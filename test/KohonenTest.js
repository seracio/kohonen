'use strict';

import chai, { assert, expect } from 'chai';
import spies from 'chai-spies';
import Kohonen from '../src/Kohonen';
import { generateGrid } from '../src/hexagon';

chai.use(spies);

describe('Kohonen', ()=> {

    describe('constructor', () => {

        it('should not throw an error when called properly', () => {
            assert.doesNotThrow(()=>{
                new Kohonen({ size: 3, neurons: generateGrid(10,10)});
            }, Error);
        });

        it('should return an instance of Kohonen', () => {
            const k = new Kohonen({ size: 3, neurons: generateGrid(10,10)});
            assert.instanceOf(k, Kohonen);
        });

        it('should return an instance of Kohonen with a neurons attribute as an array', () => {
            const k = new Kohonen({ size: 3, neurons: generateGrid(10,10)});
            assert.property(k, 'neurons');
            assert.isArray(k.neurons);
        });

        it('should return an instance of Kohonen with a step attribute as an int', () => {
            const k = new Kohonen({ size: 3, neurons: generateGrid(10,10)});
            assert.property(k, 'step');
            assert.isNumber(k.step);
        });

        it('should return an instance of Kohonen with a scaleStepLearningCoef attribute as a function', () => {
            const k = new Kohonen({ size: 3, neurons: generateGrid(10,10)});
            assert.property(k, 'scaleStepLearningCoef');
            assert.isFunction(k.scaleStepLearningCoef);
        });

        it('should return an instance of Kohonen with a scaleStepNeighborhood attribute as a function', () => {
            const k = new Kohonen({ size: 3, neurons: generateGrid(10,10)});
            assert.property(k, 'scaleStepNeighborhood');
            assert.isFunction(k.scaleStepNeighborhood);
        });

    });

    describe('scaleStepLearningCoef', ()=>{

    });

    describe('scaleStepNeighborhood', ()=>{

    });

    describe('learn', ()=>{

    });

    describe('findBestMatchingUnit', ()=>{

    });

    describe('neighborhood', ()=>{

    });

});
