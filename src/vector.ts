import _ from 'lodash/fp';
import { randomNormal } from 'd3-random';

// euclidian distance of 2 vectors
export const dist = (v1, v2) => {
    const d = Math.sqrt(
        v1.reduce((seed, cur, ind) => seed + Math.pow(v2[ind] - cur, 2), 0)
    );
    if (isNaN(d) || !isFinite(d)) {
        throw new Error('vector.dist : not a number');
    }
    return d;
};

// scalar mult of a vector
export const mult = (v, coef) => v.map(val => val * coef);

// scalar diff of a vector
export const diff = (v1, v2) => v1.map((val, i) => v2[i] - val);

// scalar addition of a vector
export const add = (v1, v2) => v1.map((val, i) => v2[i] + val);

// For a given size, return an array of `size` with random values
// within the gaussian normalization
//
// https://github.com/mbostock/d3/wiki/Math
export const random = (size, mean = 0.0, deviation = 1.0) =>
    _.map(i => randomNormal(mean, deviation)(), _.range(0, size));
