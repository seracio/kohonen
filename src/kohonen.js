'use strict';

class Kohonen {

    constructor({ size, neurons }) {
        this.dimSize = dimSize;
        this.neurons = neurons.map(n => Object.assign({}, n, {
            v: Kohonen.generateRandomVector({size})
        }));
        this.step = 0;
    }

    learn() {

    }

}

Kohonen.scaleStepLearningCoef = () => {

};

Kohonen.scaleStepNeighborhood = () => {

};

// http://en.wikipedia.org/wiki/Gaussian_function#Two-dimensional_Gaussian_function
Kohonen.neighborhood = () => {

};

Kohonen.findBestMatchingUnit = v => {

};

// For a given size, return an array of `size` with random values
// between [0,1]
Kohonen.generateRandomVector = ({size}) => Kohonen
    .range(size)
    .map(i => Math.random());

// Util range, generate an array of length length,
// not that trivial,
// see http://stackoverflow.com/questions/3746725/create-a-javascript-array-containing-1-n
Kohonen.range = length => Array.apply(null, {length});
