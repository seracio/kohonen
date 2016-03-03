'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.random = exports.add = exports.diff = exports.mult = exports.dist = undefined;

var _fp = require('lodash/fp');

var _fp2 = _interopRequireDefault(_fp);

var _d = require('d3');

var _d2 = _interopRequireDefault(_d);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// euclidian distance of 2 vectors
var dist = exports.dist = function dist(v1, v2) {
    return Math.sqrt(v1.reduce(function (seed, cur, ind) {
        return seed + Math.pow(v2[ind] - cur, 2);
    }, 0));
};

// scalar mult of a vector
var mult = exports.mult = function mult(v, coef) {
    return v.map(function (val) {
        return val * coef;
    });
};

// scalar diff of a vector
var diff = exports.diff = function diff(v1, v2) {
    return v1.map(function (val, i) {
        return v2[i] - val;
    });
};

// scalar addition of a vector
var add = exports.add = function add(v1, v2) {
    return v1.map(function (val, i) {
        return v2[i] + val;
    });
};

// For a given size, return an array of `size` with random values
// within the gaussian normalization
//
// https://github.com/mbostock/d3/wiki/Math
var random = exports.random = function random(size) {
    var mean = arguments.length <= 1 || arguments[1] === undefined ? 0.0 : arguments[1];
    var deviation = arguments.length <= 2 || arguments[2] === undefined ? 1.0 : arguments[2];
    return _fp2.default.map(function (i) {
        return _d2.default.random.normal(mean, deviation);
    }, _fp2.default.range(0, size));
};