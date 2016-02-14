'use strict';

import chai, { assert, expect } from 'chai'
import spies from 'chai-spies'
import Kohonen from '../src/Kohonen'

chai.use(spies);

describe('Kohonen', ()=> {

    describe('static range', ()=> {

        it('should be defined as a function', ()=> {
            assert.isFunction(Kohonen.range);
        });

        it('should return an array', ()=> {
            assert.isArray(Kohonen.range());
        });

        it('should return an array with the specified length', () => {
            assert.lengthOf(Kohonen.range(), 0);
            assert.lengthOf(Kohonen.range(10), 10);
        });

    });

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

    describe('static generateRandomVector', () => {

        it('should be defined as a function', () => {
            assert.isFunction(Kohonen.generateRandomVector);
        });

        it('should return an array', () => {
            assert.isArray(Kohonen.generateRandomVector());
            assert.isArray(Kohonen.generateRandomVector(10));
        });

        it('should return an empty array if parameter is not defined', () => {
            assert.lengthOf(Kohonen.generateRandomVector(), 0);
        });

        it('should return an array with a lengthOf size parameter', () => {
            assert.lengthOf(Kohonen.generateRandomVector({size: 0}), 0);
            assert.lengthOf(Kohonen.generateRandomVector({size: 10}), 10);
        });

        it('should return an array with values between 0 and 1', () => {
            Kohonen.generateRandomVector({size: 10})
                .map( val => assert.isTrue( val >= 0 && val <= 1 ));
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
