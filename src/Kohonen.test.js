// @flow
import test from 'ava';
import _ from 'lodash/fp';
import Kohonen from './Kohonen';
import { dist } from './vector';
import { generateGrid } from './hexagon';

const data = [
    [0, 0, 0],
    [0, 0, 255],
    [0, 255, 0],
    [0, 255, 255],
    [255, 0, 0],
    [255, 0, 255],
    [255, 255, 0],
    [255, 255, 255]
];

test('quantization error', t => {
    const k = new Kohonen({
        data,
        neurons: generateGrid(10, 10),
        maxStep: 100
    });

    k.training();

    const qe = k.quantizationError();
    t.true(_.isFinite(qe));
});

test('topographic error', t => {
    const k = new Kohonen({
        data,
        neurons: generateGrid(10, 10),
        maxStep: 100
    });

    k.training();

    const te = k.topographicError();
    t.true(_.isFinite(te));
});
