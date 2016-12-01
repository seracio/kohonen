'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _d3Scale = require('d3-scale');

var _d3Array = require('d3-array');

var _fp = require('lodash/fp');

var _fp2 = _interopRequireDefault(_fp);

var _mlPca = require('ml-pca');

var _mlPca2 = _interopRequireDefault(_mlPca);

var _vector = require('./vector');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// lodash/fp random has a fixed arity of 2, without the last (and useful) param
var random = _fp2.default.random.convert({ fixed: false });

// lodash/fp map has an iteratee with a single arg
var mapWithIndex = _fp2.default.map.convert({ cap: false });

// A basic implementation of Kohonen map

// The main class
//
//

var Kohonen = function () {

  // The constructor needs two params :
  // * neurons : an already built neurons grid as an array
  // * data : data set to consider
  // * maxStep : the max step that will be clamped in scaleStepLearningCoef and
  //             scaleStepNeighborhood
  // * maxLearningCoef
  // * minLearningCoef
  // * maxNeighborhood
  // * minNeighborhood
  //
  // each neuron should provide a 2D vector pos,
  // which refer to the grid position
  //
  // You should use an hexagon grid as it is the easier case
  // to deal with neighborhood.
  //
  // You also should normalized your neighborhood in such a way that 2 neighbors
  // got an euclidian distance of 1 between each other.
  function Kohonen(_ref) {
    var neurons = _ref.neurons,
        data = _ref.data,
        _ref$maxStep = _ref.maxStep,
        maxStep = _ref$maxStep === undefined ? 10000 : _ref$maxStep,
        _ref$minLearningCoef = _ref.minLearningCoef,
        minLearningCoef = _ref$minLearningCoef === undefined ? .1 : _ref$minLearningCoef,
        _ref$maxLearningCoef = _ref.maxLearningCoef,
        maxLearningCoef = _ref$maxLearningCoef === undefined ? .4 : _ref$maxLearningCoef,
        _ref$minNeighborhood = _ref.minNeighborhood,
        minNeighborhood = _ref$minNeighborhood === undefined ? .3 : _ref$minNeighborhood,
        _ref$maxNeighborhood = _ref.maxNeighborhood,
        maxNeighborhood = _ref$maxNeighborhood === undefined ? 1 : _ref$maxNeighborhood;

    _classCallCheck(this, Kohonen);

    // data vectors should have at least one dimension
    if (!data[0].length) {
      throw new Error('Kohonen constructor: data vectors should have at least one dimension');
    }

    // all vectors should have the same size
    // all vectors values should be number
    for (var ind in data) {
      if (data[ind].length !== data[0].length) {
        throw new Error('Kohonen constructor: all vectors should have the same size');
      }
      var allNum = _fp2.default.reduce(function (seed, current) {
        return seed && !isNaN(current) && isFinite(current);
      }, true, data[ind]);
      if (!allNum) {
        throw new Error('Kohonen constructor: all vectors should number values');
      }
    }

    this.size = data[0].length;
    this.numNeurons = neurons.length;
    this.step = 0;
    this.maxStep = maxStep;

    // generate scaleStepLearningCoef,
    // as the learning coef decreases with time
    this.scaleStepLearningCoef = (0, _d3Scale.scaleLinear)().clamp(true).domain([0, maxStep]).range([maxLearningCoef, minLearningCoef]);

    // decrease neighborhood with time
    this.scaleStepNeighborhood = (0, _d3Scale.scaleLinear)().clamp(true).domain([0, maxStep]).range([maxNeighborhood, minNeighborhood]);

    // retrive min and max for each feature
    var unnormalizedExtents = _fp2.default.flow(_fp2.default.unzip, _fp2.default.map(_d3Array.extent))(data);

    // build scales for data normalization
    var scales = unnormalizedExtents.map(function (extent) {
      return (0, _d3Scale.scaleLinear)().domain(extent).range([0, 1]);
    });

    // build normalized data
    this.data = this.normalize(data, scales);

    // then we store means and deviations for normalized datas
    this.means = _fp2.default.flow(_fp2.default.unzip, _fp2.default.map(_d3Array.mean))(this.data);

    this.deviations = _fp2.default.flow(_fp2.default.unzip, _fp2.default.map(_d3Array.deviation))(this.data);

    // On each neuron, generate a random vector v
    // of <size> dimension
    var randomInitialVectors = this.generateInitialVectors();
    this.neurons = mapWithIndex(function (neuron, i) {
      return _extends({}, neuron, {
        v: randomInitialVectors[i]
      });
    }, neurons);
  }

  _createClass(Kohonen, [{
    key: 'normalize',
    value: function normalize(data, scales) {
      return data.map(function (v) {
        return v.map(function (s, i) {
          return scales[i](s);
        });
      });
    }

    // learn and return corresponding neurons for the dataset

  }, {
    key: 'training',
    value: function training() {
      var log = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : function () {};

      for (var i = 0; i < this.maxStep; i++) {
        // generate a random vector
        this.learn(this.generateLearningVector());
        log(this.neurons, this.step);
      }
    }
  }, {
    key: 'mapping',
    value: function mapping() {
      return _fp2.default.map(_fp2.default.flow(this.findBestMatchingUnit.bind(this), _fp2.default.get('pos')), this.data);
    }

    // The U-Matrix value of a particular node
    // is the average distance between the node's weight vector and that of its closest neighbors.

  }, {
    key: 'umatrix',
    value: function umatrix() {
      var _this = this;

      var roundToTwo = function roundToTwo(num) {
        return +(Math.round(num + "e+2") + "e-2");
      };
      var findNeighors = function findNeighors(cn) {
        return _fp2.default.filter(function (n) {
          return roundToTwo((0, _vector.dist)(n.pos, cn.pos)) === 1;
        }, _this.neurons);
      };
      return _fp2.default.map(function (n) {
        return (0, _d3Array.mean)(findNeighors(n).map(function (nb) {
          return (0, _vector.dist)(nb.v, n.v);
        }));
      }, this.neurons);
    }

    // pick a random vector among data

  }, {
    key: 'generateLearningVector',
    value: function generateLearningVector() {
      return this.data[_fp2.default.random(0, this.data.length - 1)];
    }
  }, {
    key: 'generateInitialVectors',
    value: function generateInitialVectors() {
      var _this2 = this;

      // principal component analysis
      // standardize to false as we already standardize ours
      //
      var pca = new _mlPca2.default(this.data, {
        center: true,
        scale: false
      });

      // we'll only keep the 2 largest eigenvectors
      var transposedEV = _fp2.default.take(2, pca.getLoadings());

      // function to generate random vectors into eigenvectors space
      var generateRandomVecWithinEigenvectorsSpace = function generateRandomVecWithinEigenvectorsSpace() {
        return (0, _vector.add)((0, _vector.mult)(transposedEV[0], random(-.5, .5, true)), (0, _vector.mult)(transposedEV[1], random(-.5, .5, true)));
      };

      // we generate all random vectors and uncentered them by adding means vector
      return _fp2.default.map(function () {
        return (0, _vector.add)(generateRandomVecWithinEigenvectorsSpace(), _this2.means);
      }, _fp2.default.range(0, this.numNeurons));
    }
  }, {
    key: 'learn',
    value: function learn(v) {
      var _this3 = this;

      // find bmu
      var bmu = this.findBestMatchingUnit(v);
      // compute current learning coef
      var currentLearningCoef = this.scaleStepLearningCoef(this.step);

      this.neurons.forEach(function (n) {
        // compute neighborhood
        var currentNeighborhood = _this3.neighborhood({ bmu: bmu, n: n });

        // compute delta for the current neuron
        var delta = (0, _vector.mult)((0, _vector.diff)(n.v, v), currentNeighborhood * currentLearningCoef);

        // update current vector
        n.v = (0, _vector.add)(n.v, delta);
      });
      this.step += 1;
    }

    // Find closer neuron

  }, {
    key: 'findBestMatchingUnit',
    value: function findBestMatchingUnit(v) {
      return _fp2.default.flow(_fp2.default.orderBy(function (n) {
        return (0, _vector.dist)(v, n.v);
      }, 'asc'), _fp2.default.first)(this.neurons);
    }

    // http://en.wikipedia.org/wiki/Gaussian_function#Two-dimensional_Gaussian_function
    //
    // http://mathworld.wolfram.com/GaussianFunction.html
    //
    // neighborhood function made with a gaussian

  }, {
    key: 'neighborhood',
    value: function neighborhood(_ref2) {
      var bmu = _ref2.bmu,
          n = _ref2.n;

      var a = 1;
      var sigmaX = 1;
      var sigmaY = 1;

      return a * Math.exp(-(Math.pow(n.pos[0] - bmu.pos[0], 2) / 2 * Math.pow(sigmaX, 2) + Math.pow(n.pos[1] - bmu.pos[1], 2) / 2 * Math.pow(sigmaY, 2))) * this.scaleStepNeighborhood(this.step);
    }
  }]);

  return Kohonen;
}();

exports.default = Kohonen;