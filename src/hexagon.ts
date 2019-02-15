import _ from 'lodash/fp';
import { Neuron } from './types';

// generate a rectangular grid of sizeX * sizeY hexagonal neurons
// with normalized euclidian distance of 1 between each neighbor
const generateGrid = (sizeX, sizeY): Neuron[] => {
    const margin = 1;

    const stepX = 1;
    // Pythagoras to the rescue
    const stepY = Math.sqrt(Math.pow(stepX, 2) - Math.pow(stepX / 2, 2));

    const getHexagon = (x, y): Neuron => ({
        pos: [x, y]
    });

    const generateRow = (y, i) =>
        _.range(0, sizeX)
            .map(x => x + margin)
            .map(x => x + (i % 2 === 0 ? 0 : stepX / 2))
            .map(x => getHexagon(x, y));

    return _.flatten(
        _.range(0, sizeY)
            .map(y => y * stepY)
            .map(y => y + margin)
            .map((y, i) => generateRow(y, i))
    );
};

export { generateGrid };
