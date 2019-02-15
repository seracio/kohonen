// @flow
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

test('quantization error', () => {
    const k = new Kohonen({
        data,
        neurons: generateGrid(10, 10),
        maxStep: 100
    });

    k.training();

    const qe = k.quantizationError();
    expect(_.isFinite(qe)).toBe(true);
});

test('topographic error', () => {
    const k = new Kohonen({
        data,
        neurons: generateGrid(10, 10),
        maxStep: 100
    });

    k.training();

    const te = k.topographicError();
    expect(_.isFinite(te)).toBe(true);
});
