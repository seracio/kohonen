'use strict';

import chai, { assert, expect } from 'chai'
import spies from 'chai-spies'
import Kohonen from '../src/Kohonen'

chai.use(spies);

describe('Kohonen', ()=>{

    describe('static range', ()=>{

        it('should return an array', ()=>{
            assert.isArray(Kohonen.range());
        });

        it('should return an array with the specified length', () => {
            assert.lengthOf(Kohonen.range(), 0);
            assert.lengthOf(Kohonen.range(10), 10);
        });


    });

});
