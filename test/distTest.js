'use strict';

import chai, { assert, expect } from 'chai';
import spies from 'chai-spies';

import Kohonen, {mathHelper, hexagonHelper, vectorHelper} from '../dist/index'

chai.use(spies);

describe('dist', ()=>{

    const data = [
        [10, 20, 30],
        [-10, 17, 21],
        [7, -50, 35]
    ];

    describe('Kohonen', () => {

        it('should be defined', ()=>{
            assert.isDefined(Kohonen);
        });

        it('should be a class', ()=>{
            assert.instanceOf(new Kohonen({data, neurons: [{pos: [0,0]}]}), Kohonen);
        });

    });

    describe('hexagonHelper', () => {

        it('should be defined', ()=>{
            assert.isDefined(hexagonHelper);
        });

        it('should be an object', ()=>{
            assert.isObject(hexagonHelper);
            assert.property(hexagonHelper, 'generateGrid');
        });

    });

    describe('vectorHelper', () => {

        it('should be defined', ()=>{
            assert.isDefined(vectorHelper);
        });

        it('should be an object', ()=>{
            assert.isObject(vectorHelper);
            assert.property(vectorHelper, 'dist');
            assert.property(vectorHelper, 'mult');
            assert.property(vectorHelper, 'diff');
            assert.property(vectorHelper, 'add');
            assert.property(vectorHelper, 'random');
        });

    });

});
