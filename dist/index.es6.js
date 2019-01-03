import _ from 'lodash/fp';
import { randomNormal } from 'd3-random';
import { scaleLinear } from 'd3-scale';
import { extent, mean, deviation } from 'd3-array';
import PCA from 'ml-pca';

// with normalized euclidian distance of 1 between each neighbor

var generateGrid = function generateGrid(sizeX, sizeY) {
  var margin = 1;
  var stepX = 1; // Pythagoras to the rescue

  var stepY = Math.sqrt(Math.pow(stepX, 2) - Math.pow(stepX / 2, 2));

  var getHexagon = function getHexagon(x, y) {
    return {
      pos: [x, y]
    };
  };

  var generateRow = function generateRow(y, i) {
    return _.range(0, sizeX).map(function (x) {
      return x + margin;
    }).map(function (x) {
      return x + (i % 2 === 0 ? 0 : stepX / 2);
    }).map(function (x) {
      return getHexagon(x, y);
    });
  };

  return _.flatten(_.range(0, sizeY).map(function (y) {
    return y * stepY;
  }).map(function (y) {
    return y + margin;
  }).map(function (y, i) {
    return generateRow(y, i);
  }));
};

var hexagon = Object.freeze({
	generateGrid: generateGrid
});

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}

function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  return Constructor;
}

function _extends() {
  _extends = Object.assign || function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];

      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }

    return target;
  };

  return _extends.apply(this, arguments);
}

function _toConsumableArray(arr) {
  if (Array.isArray(arr)) {
    for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) arr2[i] = arr[i];

    return arr2;
  } else {
    return Array.from(arr);
  }
}

var dist = function dist(v1, v2) {
  var d = Math.sqrt(v1.reduce(function (seed, cur, ind) {
    return seed + Math.pow(v2[ind] - cur, 2);
  }, 0));

  if (isNaN(d) || !isFinite(d)) {
    throw new Error('vector.dist : not a number');
  }

  return d;
}; // scalar mult of a vector

var mult = function mult(v, coef) {
  return v.map(function (val) {
    return val * coef;
  });
}; // scalar diff of a vector

var diff = function diff(v1, v2) {
  return v1.map(function (val, i) {
    return v2[i] - val;
  });
}; // scalar addition of a vector

var add = function add(v1, v2) {
  return v1.map(function (val, i) {
    return v2[i] + val;
  });
}; // For a given size, return an array of `size` with random values
// within the gaussian normalization
//
// https://github.com/mbostock/d3/wiki/Math

var random = function random(size) {
  var mean$$1 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0.0;
  var deviation$$1 = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 1.0;
  return _.map(function (i) {
    return randomNormal(mean$$1, deviation$$1)();
  }, _.range(0, size));
};

var vector = Object.freeze({
	dist: dist,
	mult: mult,
	diff: diff,
	add: add,
	random: random
});

var random$1 = _.random.convert({
  fixed: false
}); // lodash/fp map has an iteratee with a single arg


var mapWithIndex = _.map.convert({
  cap: false
}); // A basic implementation of Kohonen map
// The main class
//
//


var Kohonen =
/*#__PURE__*/
function () {
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
        maxStep = _ref$maxStep === void 0 ? 10000 : _ref$maxStep,
        _ref$minLearningCoef = _ref.minLearningCoef,
        minLearningCoef = _ref$minLearningCoef === void 0 ? 0.1 : _ref$minLearningCoef,
        _ref$maxLearningCoef = _ref.maxLearningCoef,
        maxLearningCoef = _ref$maxLearningCoef === void 0 ? 0.4 : _ref$maxLearningCoef,
        _ref$minNeighborhood = _ref.minNeighborhood,
        minNeighborhood = _ref$minNeighborhood === void 0 ? 0.3 : _ref$minNeighborhood,
        _ref$maxNeighborhood = _ref.maxNeighborhood,
        maxNeighborhood = _ref$maxNeighborhood === void 0 ? 1 : _ref$maxNeighborhood;

    _classCallCheck(this, Kohonen);

    // data vectors should have at least one dimension
    if (!data[0].length) {
      throw new Error('Kohonen constructor: data vectors should have at least one dimension');
    } // all vectors should have the same size
    // all vectors values should be number


    for (var ind in data) {
      if (data[ind].length !== data[0].length) {
        throw new Error('Kohonen constructor: all vectors should have the same size');
      }

      var allNum = _.reduce(function (seed, current) {
        return seed && !isNaN(current) && isFinite(current);
      }, true, data[ind]);

      if (!allNum) {
        throw new Error('Kohonen constructor: all vectors should number values');
      }
    }

    this.size = data[0].length;
    this.numNeurons = neurons.length;
    this.step = 0;
    this.maxStep = maxStep; // generate scaleStepLearningCoef,
    // as the learning coef decreases with time

    this.scaleStepLearningCoef = scaleLinear().clamp(true).domain([0, maxStep]).range([maxLearningCoef, minLearningCoef]); // decrease neighborhood with time

    this.scaleStepNeighborhood = scaleLinear().clamp(true).domain([0, maxStep]).range([maxNeighborhood, minNeighborhood]); // retrive min and max for each feature

    var unnormalizedExtents = _.flow(_.unzip, _.map(extent))(data); // build scales for data normalization


    var scales = unnormalizedExtents.map(function (extent$$1) {
      return scaleLinear().domain(extent$$1).range([0, 1]);
    }); // build normalized data

    this.data = this.normalize(data, scales); // then we store means and deviations for normalized datas

    this.means = _.flow(_.unzip, _.map(mean))(this.data);
    this.deviations = _.flow(_.unzip, _.map(deviation))(this.data); // On each neuron, generate a random vector v
    // of <size> dimension

    var randomInitialVectors = this.generateInitialVectors();
    this.neurons = mapWithIndex(function (neuron, i) {
      return _extends({}, neuron, {
        v: randomInitialVectors[i]
      });
    }, neurons);
  }

  _createClass(Kohonen, [{
    key: "normalize",
    value: function normalize(data, scales) {
      return data.map(function (v) {
        return v.map(function (s, i) {
          return scales[i](s);
        });
      });
    } // learn and return corresponding neurons for the dataset

  }, {
    key: "training",
    value: function training() {
      var log = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : function () {};

      for (var i = 0; i < this.maxStep; i++) {
        // generate a random vector
        this.learn(this.generateLearningVector());
        log(this.neurons, this.step);
      }
    }
  }, {
    key: "mapping",
    value: function mapping() {
      return _.map(_.flow(this.findBestMatchingUnit.bind(this), _.get('pos')), this.data);
    } // The U-Matrix value of a particular node
    // is the average distance between the node's weight vector and that of its closest neighbors.

  }, {
    key: "umatrix",
    value: function umatrix() {
      var _this = this;

      var roundToTwo = function roundToTwo(num) {
        return +(Math.round(num + 'e+2') + 'e-2');
      };

      var findNeighors = function findNeighors(cn) {
        return _.filter(function (n) {
          return roundToTwo(dist(n.pos, cn.pos)) === 1;
        }, _this.neurons);
      };

      return _.map(function (n) {
        return mean(findNeighors(n).map(function (nb) {
          return dist(nb.v, n.v);
        }));
      }, this.neurons);
    }
  }, {
    key: "quantizationError",
    value: function quantizationError() {
      var _this2 = this;

      return _.meanBy(function (d) {
        var bmu = _this2.findBestMatchingUnit(d);

        return dist(d, bmu.v);
      }, this.data);
    }
  }, {
    key: "topographicError",
    value: function topographicError() {
      var _this3 = this;

      return _.meanBy(function (d) {
        var bmus = _this3.findBestMatchingUnit(d, [0, 2]);

        return dist(bmus[0].pos, bmus[1].pos) <= 1.01 ? 0 : 1;
      }, this.data);
    } // pick a random vector among data

  }, {
    key: "generateLearningVector",
    value: function generateLearningVector() {
      return this.data[_.random(0, this.data.length - 1)];
    }
  }, {
    key: "generateInitialVectors",
    value: function generateInitialVectors() {
      var _this4 = this;

      // principal component analysis
      // standardize to false as we already standardize ours
      //
      var pca = new PCA(this.data, {
        center: true,
        scale: false
      }); // we'll only keep the 2 largest eigenvectors

      var transposedEV = _.take(2, pca.getLoadings()); // function to generate random vectors into eigenvectors space


      var generateRandomVecWithinEigenvectorsSpace = function generateRandomVecWithinEigenvectorsSpace() {
        return add(mult(transposedEV[0], random$1(-0.5, 0.5, true)), mult(transposedEV[1], random$1(-0.5, 0.5, true)));
      }; // we generate all random vectors and uncentered them by adding means vector


      return _.map(function () {
        return add(generateRandomVecWithinEigenvectorsSpace(), _this4.means);
      }, _.range(0, this.numNeurons));
    }
  }, {
    key: "learn",
    value: function learn(v) {
      var _this5 = this;

      // find bmu
      var bmu = this.findBestMatchingUnit(v); // compute current learning coef

      var currentLearningCoef = this.scaleStepLearningCoef(this.step);
      this.neurons.forEach(function (n) {
        // compute neighborhood
        var currentNeighborhood = _this5.neighborhood({
          bmu: bmu,
          n: n
        }); // compute delta for the current neuron


        var delta = mult(diff(n.v, v), currentNeighborhood * currentLearningCoef); // update current vector

        n.v = add(n.v, delta);
      });
      this.step += 1;
    } // Find closer neuron

  }, {
    key: "findBestMatchingUnit",
    value: function findBestMatchingUnit(v) {
      var slice = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
      return _.flow(_.orderBy(function (n) {
        return dist(v, n.v);
      }, 'asc'), function (arr) {
        if (Array.isArray(slice)) {
          return arr.slice.apply(arr, _toConsumableArray(slice));
        } else return arr[slice];
      })(this.neurons);
    } // http://en.wikipedia.org/wiki/Gaussian_function#Two-dimensional_Gaussian_function
    //
    // http://mathworld.wolfram.com/GaussianFunction.html
    //
    // neighborhood function made with a gaussian

  }, {
    key: "neighborhood",
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

export default Kohonen;
export { hexagon as hexagonHelper, vector as vectorHelper };
