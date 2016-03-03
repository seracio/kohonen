'use strict';

import d3 from 'd3';
import _ from 'lodash/fp';
import PCA from 'ml-pca';
import { dist, mult, diff, add, random } from './vector';
import { gaussianNormalization } from './math';

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
    // * minLearningCoef
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
    constructor({ neurons, data, maxStep = 10000, minLearningCoef = .3, minNeighborhood = .3 }) {

        this.size = data[0].length;

        // On each neuron, generate a random vector v
        // of <size> dimension
        this.neurons = neurons.map(n => Object.assign({}, n, {
            v: random(this.size)
        }));

        // Initialize step
        this.step = 0;
        this.maxStep = maxStep;

        // generate scaleStepLearningCoef,
        // as the learning coef decreases with time
        this.scaleStepLearningCoef = d3.scale.linear()
            .clamp(true)
            .domain([0, maxStep])
            .range([1, minLearningCoef]);

        // decrease neighborhood with time
        this.scaleStepNeighborhood = d3.scale.linear()
            .clamp(true)
            .domain([0, maxStep])
            .range([1, minNeighborhood]);

        // compute variances and standard deviations of our data set
        // and build standardized data set,

        // in order to standardize data, we need to compute
        // raw means and deviations first
        const means = _.flow(_.unzip, _.map(d3.mean))(data);
        const deviations = _.flow(_.unzip, _.map(d3.deviation))(data);
        this.data = data.map(v => v.map((sc, i) => gaussianNormalization(sc, means[i], deviations[i])));

        // then we store means and deviations for normalized datas
        this.means = _.flow(_.unzip, _.map(d3.mean))(this.data);
        this.deviations = _.flow(_.unzip, _.map(d3.deviation))(this.data);

        // principal component analysis
        const pca = new PCA(this.data);
        // retrieve eigen vectors
        const eigenVectors = pca.getEigenvectors();

        console.log(eigenVectors);

        // and we can get random generators
        this.randomGenerator = _.range(0, this.size)
            .map(i => d3.random.normal(this.means[i], this.deviations[i]));
    }

    // learn and return corresponding neurons for the dataset
    run(log = () => {
    }) {
        for (let i = 0; i < this.maxStep; i++) {
            // generate a random vector
            this.learn(this.generateLearningVector());
            log(this.neurons, this.step);
        }
        return _.map(this.findBestMatchingUnit.bind(this), this.data);
    }


    generateLearningVector(){
        return this.randomGenerator.map( gen => gen() );
    }

    learn(v) {

        // find bmu
        const bmu = this.findBestMatchingUnit(v);
        // compute current learning coef
        const currentLearningCoef = this.scaleStepLearningCoef(this.step);

        this.neurons.forEach(n => {
            // compute neighborhood
            const currentNeighborhood = this.neighborhood({bmu, n});

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
    findBestMatchingUnit(v) {
        return _.flow(_.sortBy(n => dist(v, n.v)), _.first)(this.neurons);
    }

    // http://en.wikipedia.org/wiki/Gaussian_function#Two-dimensional_Gaussian_function
    //
    // http://mathworld.wolfram.com/GaussianFunction.html
    //
    // neighborhood function made with a gaussian
    neighborhood({ bmu, n}) {
        const a = 1;
        const sigmaX = 1;
        const sigmaY = 1;

        return a
            * Math.exp(
                -(Math.pow(n.pos[0] - bmu.pos[0], 2) / 2 * Math.pow(sigmaX, 2) + Math.pow(n.pos[1] - bmu.pos[1], 2) / 2 * Math.pow(sigmaY, 2))
            )
            * this.scaleStepNeighborhood(this.step);
    }

}

export default Kohonen;
