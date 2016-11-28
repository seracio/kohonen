import chai, {assert, expect} from 'chai';
import spies from 'chai-spies';
import _ from 'lodash/fp';
import {add, diff, dist, mult, random} from '../src/vector';

chai.use(spies);

describe('vector', () => {

  describe('add', () => {

  });

  describe('diff', () => {

  });

  describe('dist', () => {
    it('should return a scalar value with 2 vectors of the same size', () => {
      for(let i = 50; i < 2000; i+=50){
        const v1 = _.range(0, i).map(val => Math.random());
        const v2 = _.range(0, i).map(val => Math.random());
        assert.isArray(v1);
        assert.isArray(v2);
        assert.lengthOf(v1, i);
        assert.lengthOf(v2, i);
        const d = dist(v1,v2);
        assert.isNumber(d);
        assert.isNotNaN(d);
      }
    });
    it('should return a value sup to zero', () => {
      for(let i = 50; i < 2000; i+=50){
        const v1 = _.range(0, i).map(val => Math.random());
        const v2 = _.range(0, i).map(val => Math.random());
        const d = dist(v1,v2);
        assert.isTrue(d >= 0);
      }
    });
    it('should return an euclidian distance', () => {
      assert.strictEqual(dist([1,1], [1,1]), 0);
      assert.strictEqual(dist([0,0], [1,1]), Math.sqrt(2));
    });
  });

  describe('mult', () => {

  });

  describe('random', () => {

    it('should return an array of number of length size', () => {
      assert.isArray(random(3));
      assert.lengthOf(random(3), 3);
      random(3).forEach(s => {
        assert.isNumber(s);
      });
    });

  });

});
