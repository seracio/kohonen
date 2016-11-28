import chai, { assert, expect } from 'chai';
import spies from 'chai-spies';
import { add, diff, dist, mult, random } from '../src/vector';

chai.use(spies);

describe('vector', () => {

  describe('add', () => {

  });

  describe('diff', () => {

  });

  describe('dist', () => {

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
