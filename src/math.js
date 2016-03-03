'use strict';

// return a gaussian normalization for a given val, a mean and a standard deviation
//
// https://visualstudiomagazine.com/articles/2014/01/01/how-to-standardize-data-for-neural-networks.aspx
//
// https://en.wikipedia.org/wiki/Normal_distribution
export const gaussianNormalization = (val, mean, standardDeviation) => (val - mean) / standardDeviation;
