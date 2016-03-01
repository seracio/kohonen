'use strict';

import d3 from 'd3';
import _ from 'lodash/fp';
import { dist, mult, diff, add, random } from './vector';


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
    // got an euclidian distance of 1 between each other.
    constructor({ size, neurons }) {
        this.size = size;

        // On each neuron, generate a random vector v
        // of <size> dimension
        this.neurons = neurons.map(n => Object.assign({}, n, {
            v: random(size)
        }));

        // Initialize step
        this.step = 0;
    }

    learn(v) {
        // find bmu
        const bmu = this.findBestMatchingUnit(v);
        // compute current learning coef
        const currentLearningCoef = Kohonen.scaleStepLearningCoef(this.step);

        this.neurons.forEach(n => {
            // compute neighborhood
            const currentNeighborhood = Kohonen.neighborhood({bmu, n, step: this.step});
            // compute delta for the current neuron
            const delta = mult(
                diff(n.v, v),
                currentNeighborhood * currentLearningCoef
            );
            // update current vector
            n.v = [...add(n.v, delta)];
        });
        this.step += 1;
    }

    // Find closer neuron
    findBestMatchingUnit(v){
        return _.sortBy(n => dist(v, n.v))(this.neurons)[0];
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
//
// http://mathworld.wolfram.com/GaussianFunction.html
//
// neighborhood function made with a gaussian
// TODO a, sigmaX, sigmaY should be parametrizable
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


export default Kohonen;
