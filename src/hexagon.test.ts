import { generateGrid } from './hexagon';
import { dist } from './vector';

//const roundToTwo = num => +(Math.round(num + 'e+2') + 'e-2');

test('hexagon should return an array', () => {
    expect(Array.isArray(generateGrid(10, 10))).toBe(true);
    expect(Array.isArray(generateGrid(10, 1))).toBe(true);
    expect(Array.isArray(generateGrid(10, 5))).toBe(true);
});

test('should return an array of sizeX * sizeY length', () => {
    expect(generateGrid(10, 10).length).toEqual(100);
    expect(generateGrid(5, 10).length).toEqual(100);
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
