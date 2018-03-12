// @flow
import test from 'ava';
import { generateGrid } from '../src/hexagon';
import { dist } from '../src/vector';

const roundToTwo = num => +(Math.round(num + 'e+2') + 'e-2');

test('hexagon should return an array', t => {
    t.true(Array.isArray(generateGrid(10, 10)));
    t.true(Array.isArray(generateGrid(10, 1)));
    t.true(Array.isArray(generateGrid(10, 5)));
});

test('should return an array of sizeX * sizeY length', t => {
    t.is(generateGrid(10, 10).length, 100);
    t.is(generateGrid(5, 10).length, 50);
});

/*test('hexagon', t => {
    it('should return an an object with a pos array of 2D array elements', () => {
        const grid = generateGrid(10, 10);
        grid.forEach(g => {
            assert.isObject(g);
            assert.property(g, 'pos');
            assert.lengthOf(g.pos, 2);
        });
    });

    it('should have normalized euclidian distances', () => {
        const grid = generateGrid(10, 10);
        assert.equal(1, dist(grid[0].pos, grid[1].pos));
        assert.equal(1, roundToTwo(dist(grid[0].pos, grid[10].pos)));
        assert.equal(1, roundToTwo(dist(grid[10].pos, grid[11].pos)));
        assert.equal(1, roundToTwo(dist(grid[10].pos, grid[20].pos)));
    });
});*/
