import { scaleLinear } from 'd3-scale';
import { extent, mean, deviation } from 'd3-array';
import _ from 'lodash/fp';
import PCA from 'ml-pca';
import { dist, mult, diff, add } from './vector';

// lodash/fp random has a fixed arity of 2, without the last (and useful) param
const random = _.random.convert({ fixed: false });

// lodash/fp map has an iteratee with a single arg
const mapWithIndex = _.map.convert({ cap: false });

// A basic implementation of Kohonen map

// The main class
//
//
class Kohonen {
    // The constructor needs two params :
    // * neurons : an already built neurons grid as an array
    // * data : data set to consider
    // * maxStep : the max step that will be clamped in scaleStepLearningCoef and
    //             scaleStepNeighborhood
    // * maxLearningCoef
    // * minLearningCoef
    // * maxNeighborhood
    // * minNeighborhood
    //
    // each neuron should provide a 2D vector pos,
    // which refer to the grid position
    //
    // You should use an hexagon grid as it is the easier case
    // to deal with neighborhood.
    //
    // You also should normalized your neighborhood in such a way that 2 neighbors
    // got an euclidian distance of 1 between each other.
    constructor({
        neurons,
        data,
        maxStep = 10000,
        minLearningCoef = 0.1,
        maxLearningCoef = 0.4,
        minNeighborhood = 0.3,
        maxNeighborhood = 1
    }) {
        // data vectors should have at least one dimension
        if (!data[0].length) {
            throw new Error(
                'Kohonen constructor: data vectors should have at least one dimension'
            );
        }

        // all vectors should have the same size
        // all vectors values should be number
        for (let ind in data) {
            if (data[ind].length !== data[0].length) {
                throw new Error(
                    'Kohonen constructor: all vectors should have the same size'
                );
            }
            const allNum = _.reduce(
                (seed, current) => seed && !isNaN(current) && isFinite(current),
                true,
                data[ind]
            );
            if (!allNum) {
                throw new Error(
                    'Kohonen constructor: all vectors should number values'
                );
            }
        }

        this.size = data[0].length;
        this.numNeurons = neurons.length;
        this.step = 0;
        this.maxStep = maxStep;

        // generate scaleStepLearningCoef,
        // as the learning coef decreases with time
        this.scaleStepLearningCoef = scaleLinear()
            .clamp(true)
            .domain([0, maxStep])
            .range([maxLearningCoef, minLearningCoef]);

        // decrease neighborhood with time
        this.scaleStepNeighborhood = scaleLinear()
            .clamp(true)
            .domain([0, maxStep])
            .range([maxNeighborhood, minNeighborhood]);

        // retrive min and max for each feature
        const unnormalizedExtents = _.flow(
            _.unzip,
            _.map(extent)
        )(data);

        // build scales for data normalization
        const scales = unnormalizedExtents.map(extent =>
            scaleLinear()
                .domain(extent)
                .range([0, 1])
        );

        // build normalized data
        this.data = this.normalize(data, scales);

        // then we store means and deviations for normalized datas
        this.means = _.flow(
            _.unzip,
            _.map(mean)
        )(this.data);

        this.deviations = _.flow(
            _.unzip,
            _.map(deviation)
        )(this.data);

        // On each neuron, generate a random vector v
        // of <size> dimension
        const randomInitialVectors = this.generateInitialVectors();
        this.neurons = mapWithIndex(
            (neuron, i) => ({
                ...neuron,
                v: randomInitialVectors[i]
            }),
            neurons
        );
    }

    normalize(data, scales) {
        return data.map(v => v.map((s, i) => scales[i](s)));
    }

    // learn and return corresponding neurons for the dataset
    training(log = () => {}) {
        for (let i = 0; i < this.maxStep; i++) {
            // generate a random vector
            this.learn(this.generateLearningVector());
            log(this.neurons, this.step);
        }
    }

    mapping() {
        return _.map(
            _.flow(
                this.findBestMatchingUnit.bind(this),
                _.get('pos')
            ),
            this.data
        );
    }

    // The U-Matrix value of a particular node
    // is the average distance between the node's weight vector and that of its closest neighbors.
    umatrix() {
        const roundToTwo = num => +(Math.round(num + 'e+2') + 'e-2');
        const findNeighors = cn =>
            _.filter(n => roundToTwo(dist(n.pos, cn.pos)) === 1, this.neurons);
        return _.map(
            n => mean(findNeighors(n).map(nb => dist(nb.v, n.v))),
            this.neurons
        );
    }

    quantizationError() {
        return _.meanBy(d => {
            const bmu = this.findBestMatchingUnit(d);
            return dist(d, bmu.v);
        }, this.data);
    }

    topographicError() {
        return _.meanBy(d => {
            const bmus = this.findBestMatchingUnit(d, [0, 2]);
            return dist(bmus[0].pos, bmus[1].pos) <= 1.01 ? 0 : 1;
        }, this.data);
    }

    // pick a random vector among data
    generateLearningVector() {
        return this.data[_.random(0, this.data.length - 1)];
    }

    generateInitialVectors() {
        // principal component analysis
        // standardize to false as we already standardize ours
        //
        const pca = new PCA(this.data, {
            center: true,
            scale: false
        });

        // we'll only keep the 2 largest eigenvectors
        const transposedEV = _.take(2, pca.getLoadings());

        // function to generate random vectors into eigenvectors space
        const generateRandomVecWithinEigenvectorsSpace = () =>
            add(
                mult(transposedEV[0], random(-0.5, 0.5, true)),
                mult(transposedEV[1], random(-0.5, 0.5, true))
            );

        // we generate all random vectors and uncentered them by adding means vector
        return _.map(
            () => add(generateRandomVecWithinEigenvectorsSpace(), this.means),
            _.range(0, this.numNeurons)
        );
    }

    learn(v) {
        // find bmu
        const bmu = this.findBestMatchingUnit(v);
        // compute current learning coef
        const currentLearningCoef = this.scaleStepLearningCoef(this.step);

        this.neurons.forEach(n => {
            // compute neighborhood
            const currentNeighborhood = this.neighborhood({ bmu, n });

            // compute delta for the current neuron
            const delta = mult(
                diff(n.v, v),
                currentNeighborhood * currentLearningCoef
            );

            // update current vector
            n.v = add(n.v, delta);
        });
        this.step += 1;
    }

    // Find closer neuron
    findBestMatchingUnit(v, slice = 0) {
        return _.flow(
            _.orderBy(n => dist(v, n.v), 'asc'),
            arr => {
                if (Array.isArray(slice)) {
                    return arr.slice(...slice);
                } else return arr[slice];
            }
        )(this.neurons);
    }

    // http://en.wikipedia.org/wiki/Gaussian_function#Two-dimensional_Gaussian_function
    //
    // http://mathworld.wolfram.com/GaussianFunction.html
    //
    // neighborhood function made with a gaussian
    neighborhood({ bmu, n }) {
        const a = 1;
        const sigmaX = 1;
        const sigmaY = 1;

        return (
            a *
            Math.exp(
                -(
                    (Math.pow(n.pos[0] - bmu.pos[0], 2) / 2) *
                        Math.pow(sigmaX, 2) +
                    (Math.pow(n.pos[1] - bmu.pos[1], 2) / 2) *
                        Math.pow(sigmaY, 2)
                )
            ) *
            this.scaleStepNeighborhood(this.step)
        );
    }
}

export default Kohonen;
