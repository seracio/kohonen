'use strict';

export const dist = (v1,v2) => Math.sqrt(v1.reduce((seed, cur, ind) => seed + Math.pow(v2[ind] - cur, 2), 0));

export const mult = (v, coef) => v.map(val => val * coef);

export const diff = (v1, v2) => v1.map((val, i) => v2[i] - val);

export const add = (v1, v2) => v1.map((val, i) => v2[i] + val);
