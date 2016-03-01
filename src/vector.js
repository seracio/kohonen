'use strict';

import _ from 'lodash/fp';

export const dist = (v1,v2) => Math.sqrt(v1.reduce((seed, cur, ind) => seed + Math.pow(v2[ind] - cur, 2), 0));

export const mult = (v, coef) => v.map(val => val * coef);

export const diff = (v1, v2) => v1.map((val, i) => v2[i] - val);

export const add = (v1, v2) => v1.map((val, i) => v2[i] + val);


// For a given size, return an array of `size` with random values
// between [0,1]
export const random = size => _.range(0,size).map(i => Math.random());