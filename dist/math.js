'use strict';

// return a gaussian normalization for a given val, a mean and a standard deviation
//
// https://visualstudiomagazine.com/articles/2014/01/01/how-to-standardize-data-for-neural-networks.aspx
//
// https://en.wikipedia.org/wiki/Normal_distribution

Object.defineProperty(exports, "__esModule", {
  value: true
});
var gaussianNormalization = exports.gaussianNormalization = function gaussianNormalization(val, mean, standardDeviation) {
  return (val - mean) / standardDeviation;
};