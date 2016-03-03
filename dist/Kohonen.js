'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _d = require('d3');

var _d2 = _interopRequireDefault(_d);

var _fp = require('lodash/fp');

var _fp2 = _interopRequireDefault(_fp);

var _vector = require('./vector');

var _math = require('./math');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

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
    // * minLearningCoef
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
        var _this = this;

        var neurons = _ref.neurons;
        var data = _ref.data;
        var _ref$maxStep = _ref.maxStep;
        var maxStep = _ref$maxStep === undefined ? 10000 : _ref$maxStep;
        var _ref$minLearningCoef = _ref.minLearningCoef;
        var minLearningCoef = _ref$minLearningCoef === undefined ? .3 : _ref$minLearningCoef;
        var _ref$minNeighborhood = _ref.minNeighborhood;
        var minNeighborhood = _ref$minNeighborhood === undefined ? .3 : _ref$minNeighborhood;

        _classCallCheck(this, Kohonen);

        this.size = data[0].length;

        // On each neuron, generate a random vector v
        // of <size> dimension
        this.neurons = neurons.map(function (n) {
            return Object.assign({}, n, {
                v: (0, _vector.random)(_this.size)
            });
        });

        // Initialize step
        this.step = 0;
        this.maxStep = maxStep;

        // generate scaleStepLearningCoef,
        // as the learning coef decreases with time
        this.scaleStepLearningCoef = _d2.default.scale.linear().clamp(true).domain([0, maxStep]).range([1, minLearningCoef]);

        // decrease neighborhood with time
        this.scaleStepNeighborhood = _d2.default.scale.linear().clamp(true).domain([0, maxStep]).range([1, minNeighborhood]);

        // compute variances and standard deviations of our data set
        // and build normalized data set,
        // also build an array of random generator functions
        // for each domain of data vectors

        // in order to normalize data, we need to compute
        // the unnormalized means and deviations first
        var means = _fp2.default.flow(_fp2.default.unzip, _fp2.default.map(_d2.default.mean))(data);
        var deviations = _fp2.default.flow(_fp2.default.unzip, _fp2.default.map(_d2.default.deviation))(data);
        this.data = data.map(function (v) {
            return v.map(function (sc, i) {
                return (0, _math.gaussianNormalization)(sc, means[i], deviations[i]);
            });
        });

        // then we store means and deviations for normalized datas
        this.means = _fp2.default.flow(_fp2.default.unzip, _fp2.default.map(_d2.default.mean))(this.data);
        this.deviations = _fp2.default.flow(_fp2.default.unzip, _fp2.default.map(_d2.default.deviation))(this.data);
        // and we can get random generators
        this.randomGenerator = _fp2.default.range(0, this.size).map(function (i) {
            return _d2.default.random.normal(_this.means[i], _this.deviations[i]);
        });
    }

    // learn and return corresponding neurons for the dataset


    _createClass(Kohonen, [{
        key: 'run',
        value: function run() {
            var log = arguments.length <= 0 || arguments[0] === undefined ? function () {} : arguments[0];

            for (var i = 0; i < this.maxStep; i++) {
                // generate a random vector
                this.learn(this.generateLearningVector());
                log(this.neurons, this.step);
            }
            return _fp2.default.map(this.findBestMatchingUnit.bind(this), this.data);
        }
    }, {
        key: 'generateLearningVector',
        value: function generateLearningVector() {
            return this.randomGenerator.map(function (gen) {
                return gen();
            });
        }
    }, {
        key: 'learn',
        value: function learn(v) {
            var _this2 = this;

            // find bmu
            var bmu = this.findBestMatchingUnit(v);
            // compute current learning coef
            var currentLearningCoef = this.scaleStepLearningCoef(this.step);

            this.neurons.forEach(function (n) {
                // compute neighborhood
                var currentNeighborhood = _this2.neighborhood({ bmu: bmu, n: n });

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
            return _fp2.default.flow(_fp2.default.sortBy(function (n) {
                return (0, _vector.dist)(v, n.v);
            }), _fp2.default.first)(this.neurons);
        }

        // http://en.wikipedia.org/wiki/Gaussian_function#Two-dimensional_Gaussian_function
        //
        // http://mathworld.wolfram.com/GaussianFunction.html
        //
        // neighborhood function made with a gaussian

    }, {
        key: 'neighborhood',
        value: function neighborhood(_ref2) {
            var bmu = _ref2.bmu;
            var n = _ref2.n;

            var a = 1;
            var sigmaX = 1;
            var sigmaY = 1;

            return a * Math.exp(-(Math.pow(n.pos[0] - bmu.pos[0], 2) / 2 * Math.pow(sigmaX, 2) + Math.pow(n.pos[1] - bmu.pos[1], 2) / 2 * Math.pow(sigmaY, 2))) * this.scaleStepNeighborhood(this.step);
        }
    }]);

    return Kohonen;
}();

exports.default = Kohonen;