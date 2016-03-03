'use strict';

import chai, { assert, expect } from 'chai';
import spies from 'chai-spies';
import Kohonen from '../src/Kohonen';
import { generateGrid } from '../src/hexagon';
import { random } from '../src/vector';

chai.use(spies);

describe('Kohonen', ()=> {

    const data = [
        [10, 20, 30],
        [-10, 17, 21],
        [7, -50, 35]
    ];

    describe('constructor', () => {

        it('should not throw an error when called properly', () => {
            assert.doesNotThrow(()=> {
                new Kohonen({data, neurons: generateGrid(10, 10)});
            }, Error);
        });

        it('should return an instance of Kohonen', () => {
            const k = new Kohonen({data, neurons: generateGrid(10, 10)});
            assert.instanceOf(k, Kohonen);
        });

        it('should return an instance of Kohonen with a neurons attribute as an array', () => {
            const k = new Kohonen({data, neurons: generateGrid(10, 10)});
            assert.property(k, 'neurons');
            assert.isArray(k.neurons);
        });

        it('should return an instance of Kohonen with a data attribute as an array', () => {
            const k = new Kohonen({data, neurons: generateGrid(10, 10)});
            assert.property(k, 'data');
            assert.isArray(k.data);
        });

        it('should return an instance of Kohonen with properly defined neurons attributes', () => {
            const k = new Kohonen({data, neurons: generateGrid(10, 10)});
            k.neurons.forEach(n => {
                assert.property(n, 'v');
                assert.isArray(n.v);
                assert.lengthOf(n.v, data.length);
                assert.property(n, 'pos');
                assert.isArray(n.pos);
                assert.lengthOf(n.pos, 2);
            });
        });

        it('should return an instance of Kohonen with a step attribute as an int', () => {
            const k = new Kohonen({data, neurons: generateGrid(10, 10)});
            assert.property(k, 'step');
            assert.isNumber(k.step);
        });

        it('should return an instance of Kohonen with a maxStep attribute as an int', () => {
            const k = new Kohonen({data, neurons: generateGrid(10, 10)});
            assert.property(k, 'maxStep');
            assert.isNumber(k.maxStep);
        });

        it('should return an instance of Kohonen with a means attribute as an array', () => {
            const k = new Kohonen({data, neurons: generateGrid(10, 10)});
            assert.property(k, 'means');
            assert.isArray(k.means);
        });

        it('should return an instance of Kohonen with a deviations attribute as an array', () => {
            const k = new Kohonen({data, neurons: generateGrid(10, 10)});
            assert.property(k, 'deviations');
            assert.isArray(k.deviations);
        });

        it('should return an instance of Kohonen with a scaleStepLearningCoef attribute as a function', () => {
            const k = new Kohonen({data, neurons: generateGrid(10, 10)});
            assert.property(k, 'scaleStepLearningCoef');
            assert.isFunction(k.scaleStepLearningCoef);
        });

        it('should return an instance of Kohonen with a scaleStepNeighborhood attribute as a function', () => {
            const k = new Kohonen({data, neurons: generateGrid(10, 10)});
            assert.property(k, 'scaleStepNeighborhood');
            assert.isFunction(k.scaleStepNeighborhood);
        });

    });

    describe('findBestMatchingUnit', ()=> {

        it('should return a neuron', () => {
            const k = new Kohonen({data, neurons: generateGrid(10, 10)});
            const bmu = k.findBestMatchingUnit([0, 0, 0]);
            assert.isObject(bmu);
            assert.property(bmu, 'v');
            assert.property(bmu, 'pos');
        });

    });

    describe('neighborhood', ()=> {

        it('should return a number', () => {
            const k = new Kohonen({data, neurons: generateGrid(10, 10)});
            const v = [0, 0, 0];
            const bmu = k.findBestMatchingUnit(v);
            assert.isNumber(k.neighborhood({bmu, n: k.neurons[0]}));
        });

        it('should return decreasing value with time', () => {
            const k = new Kohonen({data, neurons: generateGrid(10, 10)});
            const v = [0, 0, 0];
            const bmu = k.findBestMatchingUnit(v);
            let currentNeighborhood = 1;
            for (let i = 0; i < 10; i++) {
                const tempNeighborhood = k.neighborhood({bmu, n: k.neurons[0]});
                k.step += 1;
                assert.isBelow(tempNeighborhood, currentNeighborhood);
                currentNeighborhood = tempNeighborhood;
            }
        });

    });

    describe('learn', ()=> {

        it('should increase step', () => {
            const k = new Kohonen({data, neurons: generateGrid(10, 10)});
            k.learn(random(data.length));
            assert.equal(k.step, 1);
            k.learn(random(data.length));
            assert.equal(k.step, 2);
        });

        it('should update the bmu and its neighbors', () => {

        });

    });

    describe('run', () => {

        it('should call the log function at each step', () => {
            const k = new Kohonen({
                data,
                neurons: generateGrid(10, 10),
                maxStep: 3
            });
            let spy = chai.spy();
            k.run(spy);
            expect(spy).to.have.been.called.exactly(3);
        });

        it('should return the data as an array', () => {
            const k = new Kohonen({
                data,
                neurons: generateGrid(10, 10),
                maxStep: 10
            });
            const dataWithPos = k.run();
            assert.isArray(dataWithPos);
            assert.lengthOf(dataWithPos, data.length);
        });

        it('should return the data as an array of neurons', () => {
            const k = new Kohonen({
                data,
                neurons: generateGrid(10, 10),
                maxStep: 10
            });
            const dataWithPos = k.run();
            assert.isArray(dataWithPos);
            dataWithPos.forEach( n => {
                assert.isObject(n);
                assert.property(n, 'pos');
            });
        });

    });

});
