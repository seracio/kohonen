'use strict';

import chai, { assert, expect } from 'chai';
import spies from 'chai-spies';
import { generateGrid } from '../src/hexagon';
import { dist } from '../src/vector';
import { round } from '../src/math';

chai.use(spies);

describe('hexagon', ()=>{

    it('should return an array', () => {
        assert.isArray(generateGrid(10,10));
        assert.isArray(generateGrid(10,1));
        assert.isArray(generateGrid(10,5));
    });

    it('should return an array of sizeX * sizeY length', () => {
        assert.lengthOf(generateGrid(10,10), 100);
        assert.lengthOf(generateGrid(5,10), 50);
        assert.lengthOf(generateGrid(5,1), 5);
    });

    it('should return an array of 2D array elements', () => {
        const grid = generateGrid(10,10);
        grid.forEach( g => {
            assert.isArray(g);
            assert.lengthOf(g,2)
        });
    });

    it('should have normalized euclidian distances', ()=> {
        const grid = generateGrid(10,10);
        assert.equal(1, dist(grid[0], grid[1]));
        assert.equal(1, Math.round(dist(grid[0], grid[10])), 2);
        assert.equal(1, Math.round(dist(grid[10], grid[11])), 2);
        assert.equal(1, Math.round(dist(grid[10], grid[20])), 2);
    });

});
