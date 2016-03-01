'use strict';

// return a gaussian normalization for a given val, a mean and a standard deviation
// https://visualstudiomagazine.com/articles/2014/01/01/how-to-standardize-data-for-neural-networks.aspx
export const gaussianNormalization = (val, mean, standardDeviation) => (val - mean) / standardDeviation;

export const mean = inputs => inputs.reduce((sum, cur) => sum + cur, 0) / inputs.length;

export const variance = inputs =>
    (1 / inputs.length)
    * inputs.reduce((sum, cur) => sum + Math.pow(cur, 2), 0)
    - Math.pow(mean(inputs), 2);

export const standardDeviation = inputs => Math.sqrt(variance(inputs));

export const round = (val, dec) => Math.round(val * Math.pow(10, dec)) / Math.pow(10, dec);
