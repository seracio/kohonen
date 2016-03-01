'use strict';

import chai, { assert, expect } from 'chai';
import spies from 'chai-spies';
import Kohonen from '../src/Kohonen';

chai.use(spies);

describe('Kohonen', ()=> {


    describe('static scaleStepNeighborhood', () => {

        it('should be defined as a function', ()=> {
            assert.isFunction(Kohonen.scaleStepNeighborhood);
        });

        it('should return a number', () => {
            assert.isNumber(Kohonen.scaleStepNeighborhood(0));
            assert.isNumber(Kohonen.scaleStepNeighborhood(10000));
            assert.isNumber(Kohonen.scaleStepNeighborhood(100000));
        });

        it('shoud return a value between 1 and .3 and decrease with time', () => {
            assert.equal(Kohonen.scaleStepNeighborhood(0), 1);
            assert.equal(Kohonen.scaleStepNeighborhood(10000), .3);
            assert.equal(Kohonen.scaleStepNeighborhood(100000), .3);
        });

    });

    describe('static neighborhood', () => {

        it('should be defined as a function', () => {
            assert.isFunction(Kohonen.neighborhood);
        });

        it('should throw an Error if parameters are not well defined', () => {

        });

    });

});
