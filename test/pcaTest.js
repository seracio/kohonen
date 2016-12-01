import chai, { assert, expect } from 'chai';
import spies from 'chai-spies';
import _ from 'lodash/fp';
import PCA from 'ml-pca';

chai.use(spies);

describe('PCA:', () => {

  const dataset = [
    [0,0],
    [.25,.155],
    [.5,.2],
    [.75,.4],
    [1,.5],
  ];

  const pca = new PCA(dataset, {
    center: true,
    scale: false,
  });

  const transposed = pca.getLoadings();
  const pc1 = _.nth(0, transposed);
  const pc2 = _.nth(1, transposed);

  describe('transposed eigenvectors:', ()=>{
    it('should be a matrix', () => {
      assert.isArray(transposed);
      for(let vec of transposed){
        assert.isArray(vec);
      }
    });

    it('each transposed vectors should have as many dimensions than a data', ()=>{
      const getDimOfFirstElement = _.flow(
        _.first,
        _.size
      );
      assert.strictEqual(getDimOfFirstElement(dataset), getDimOfFirstElement(transposed));
    });
  });

});