'use strict';

import d3 from 'd3';

class Kohonen {

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

    learn() {

    }

}

Kohonen.scaleStepLearningCoef = () => {

};

// Decrease neighborhood with time
Kohonen.scaleStepNeighborhood = step => d3.scale.linear()
    .clamp(true)
    .domain([0, 10000])
    .range([1, .3])(step);

// http://en.wikipedia.org/wiki/Gaussian_function#Two-dimensional_Gaussian_function
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

Kohonen.findBestMatchingUnit = v => {

};

// For a given size, return an array of `size` with random values
// between [0,1]
Kohonen.generateRandomVector = ({size = 0} = {}) => Kohonen
    .range(size)
    .map(i => Math.random());

// Util range, generate an array of length length,
// not that trivial,
// see http://stackoverflow.com/questions/3746725/create-a-javascript-array-containing-1-n
Kohonen.range = length => Array.apply(null, {length});

export default Kohonen;
