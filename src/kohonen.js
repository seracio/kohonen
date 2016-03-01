'use strict';

import d3 from 'd3';
import _ from 'lodash/fp';


// A basic implementation of Kohonen map

// The main class
//
//
class Kohonen {

    // The constructor needs two params :
    // * size : the dimension size of the vectors
    // * neurons : an already built neurons grid as an array
    //
    // each neuron should provide :
    // * an x
    // * an y
    //
    // You should use an hexagon grid as it is the easier case
    // to deal with neighborhood.
    //
    // You also should normalized your neighborhood in such a way that 2 neighbors
    // got an euclidian distance of 1 between each other
    constructor({ size, neurons }) {
        this.size = size;

        // On each neuron, generate a random vector v
        // of <size> dimension
        this.neurons = neurons.map(n => Object.assign({}, n, {
            v: Kohonen.generateRandomVector({size})
        }));

        // Initialize step
        this.step = 0;
    }

    learn(v) {
        // find bmu
        const bmu = Kohonen.findBestMatchingUnit(v);
        // compute current learning coef
        const currentLearningCoef = Kohonen.scaleStepLearningCoef(this.step);

        this.neurons.forEach(n => {
            // compute neighborhood
            const currentNeighborhood = Kohonen.neighborhood({bmu, n, step: this.step});
            // compute delta for the current neuron
            const delta = Kohonen.mult(
                Kohonen.diff(n.v, v),
                currentNeighborhood * currentLearningCoef
            );
            // update current vector
            n.v = [...Kohonen.add(n.v, delta)];
        });
        this.step += 1;
    }

}

// The learning coef decreases with time
// TODO should be parametrizable ?
// TODO And remove from static
Kohonen.scaleStepLearningCoef = step => d3.scale.linear()
    .clamp(true)
    .domain([0, 10000])
    .range([1, .3])(step);

// Decrease neighborhood with time
// TODO should be parametrizable ?
// TODO And remove from static
Kohonen.scaleStepNeighborhood = step => d3.scale.linear()
    .clamp(true)
    .domain([0, 10000])
    .range([1, .3])(step);

// http://en.wikipedia.org/wiki/Gaussian_function#Two-dimensional_Gaussian_function
// neighborhood function made with a gaussian
// http://mathworld.wolfram.com/GaussianFunction.html
Kohonen.neighborhood = ({ bmu, n, step }) => {
    const a = 1;
    const sigmaX = 1;
    const sigmaY = 1;
    return a
        * Math.exp(
            -(Math.pow(n.x - bmu.x, 2) / 2 * Math.pow(sigmaX, 2) + Math.pow(n.y - bmu.y, 2) / 2 * Math.pow(sigmaY, 2))
        )
        * Kohonen.scaleStepNeighborhood(step);

};

// Find closer neuron
Kohonen.findBestMatchingUnit = v => _.sortBy(n => Kohonen.dist(v, n.v))(this.neurons)[0];

// For a given size, return an array of `size` with random values
// between [0,1]
Kohonen.generateRandomVector = ({size = 0} = {}) => Kohonen
    .range(size)
    .map(i => Math.random());

// Util range, generate an array of length length,
// not that trivial,
// see http://stackoverflow.com/questions/3746725/create-a-javascript-array-containing-1-n
Kohonen.range = length => Array.apply(null, {length});

// Vector util
// TODO : should be moved in another module
Kohonen.dist = (v1, v2) => Math.sqrt(v1.reduce((seed, cur, ind) => seed + Math.pow(v2[ind] - cur, 2), 0));
Kohonen.mult = (v, coef) => v.map(val => val * coef);
Kohonen.diff = (v1, v2) => v1.map((val, i) => v2[i] - val);
Kohonen.add = (v1, v2) => v1.map((val, i) => v2[i] + val);


export default Kohonen;
