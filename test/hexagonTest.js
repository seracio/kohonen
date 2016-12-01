import chai, { assert, expect } from 'chai';
import spies from 'chai-spies';
import { generateGrid } from '../src/hexagon';
import { dist } from '../src/vector';

chai.use(spies);

const roundToTwo = (num)=> +(Math.round(num + "e+2") + "e-2");

describe('hexagon', ()=> {

  it('should return an array', () => {
    assert.isArray(generateGrid(10, 10));
    assert.isArray(generateGrid(10, 1));
    assert.isArray(generateGrid(10, 5));
  });

  it('should return an array of sizeX * sizeY length', () => {
    assert.lengthOf(generateGrid(10, 10), 100);
    assert.lengthOf(generateGrid(5, 10), 50);
    assert.lengthOf(generateGrid(5, 1), 5);
  });

  it('should return an an object with a pos array of 2D array elements', () => {
    const grid = generateGrid(10, 10);
    grid.forEach(g => {
      assert.isObject(g);
      assert.property(g, 'pos');
      assert.lengthOf(g.pos, 2);
    });
  });

  it('should have normalized euclidian distances', ()=> {
    const grid = generateGrid(10, 10);
    assert.equal(1, dist(grid[0].pos, grid[1].pos));
    assert.equal(1, roundToTwo(dist(grid[0].pos, grid[10].pos)));
    assert.equal(1, roundToTwo(dist(grid[10].pos, grid[11].pos)));
    assert.equal(1, roundToTwo(dist(grid[10].pos, grid[20].pos)));
  });

});
