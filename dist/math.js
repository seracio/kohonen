'use strict';

// return a gaussian normalization for a given val, a mean and a standard deviation
//
// https://visualstudiomagazine.com/articles/2014/01/01/how-to-standardize-data-for-neural-networks.aspx
//
// https://en.wikipedia.org/wiki/Normal_distribution

exports.__esModule = true;
var gaussianNormalization = exports.gaussianNormalization = function gaussianNormalization(val, mean, standardDeviation) {
    return (val - mean) / standardDeviation;
};

var mean = exports.mean = function mean(inputs) {
    return inputs.reduce(function (sum, cur) {
        return sum + cur;
    }, 0) / inputs.length;
};

var variance = exports.variance = function variance(inputs) {
    return 1 / inputs.length * inputs.reduce(function (sum, cur) {
        return sum + Math.pow(cur, 2);
    }, 0) - Math.pow(mean(inputs), 2);
};

var standardDeviation = exports.standardDeviation = function standardDeviation(inputs) {
    return Math.sqrt(variance(inputs));
};

var round = exports.round = function round(val, dec) {
    return Math.round(val * Math.pow(10, dec)) / Math.pow(10, dec);
};