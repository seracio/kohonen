'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.generateGrid = undefined;

var _fp = require('lodash/fp');

var _fp2 = _interopRequireDefault(_fp);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// generate a rectangular grid of sizeX * sizeY hexagonal neurons
// with normalized euclidian distance of 1 between each neighbor
var generateGrid = exports.generateGrid = function generateGrid(sizeX, sizeY) {

  var margin = 1;

  var stepX = 1;
  // Pythagoras to the rescue
  var stepY = Math.sqrt(Math.pow(stepX, 2) - Math.pow(stepX / 2, 2));

  var getHexagon = function getHexagon(x, y) {
    return {
      pos: [x, y]
    };
  };

  var generateRow = function generateRow(y, i) {
    return _fp2.default.range(0, sizeX).map(function (x) {
      return x + margin;
    }).map(function (x) {
      return x + (i % 2 === 0 ? 0 : stepX / 2);
    }).map(function (x) {
      return getHexagon(x, y);
    });
  };

  return _fp2.default.flatten(_fp2.default.range(0, sizeY).map(function (y) {
    return y * stepY;
  }).map(function (y) {
    return y + margin;
  }).map(function (y, i) {
    return generateRow(y, i);
  }));
};