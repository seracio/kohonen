import chai, { assert, expect } from 'chai';
import spies from 'chai-spies';
import _ from 'lodash/fp';
import PCA from 'ml-pca';
import {add, mult} from '../src/vector';

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

  const eigenvalues = pca.getEigenvalues();
  const transposed = pca.getLoadings();
  const scaledEigenvectors = mult(transposed[0], Math.sqrt(eigenvalues[0]));

  describe('eigenvectors:', () => {
    it('should have as many eigenvectors than the num of dimensions on the dataset', () => {

      //assert.strictEqual(eigenvectors.length, dataset[0].length);
    });
    it('an eigenvector should have as many dimensions than a vector from the dataset', () => {
      //assert.strictEqual(eigenvectors[0].length, dataset[0].length);
    });
  });

  describe('eigenvalues:', () => {
    it('should have as many eigenvalues than the num of eigenvectors', () => {
      console.log(eigenvalues);
      //assert.strictEqual(eigenvalues.length, eigenvectors.length);
    });
  });

  describe('scaled eigenvectors:', ()=>{
    it('should', ()=>{
      //console.log(scaledEigenvectors);
      console.log(transposed);
    });
  });

});