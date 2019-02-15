// @flow
import _ from 'lodash/fp';
import PCA from 'ml-pca';

test('', () => {
    const dataset = [[0, 0], [0.25, 0.155], [0.5, 0.2], [0.75, 0.4], [1, 0.5]];

    const pca = new PCA(dataset, {
        center: true,
        scale: false
    });

    const transposed = pca.getLoadings();
    const pc1 = _.nth(0, transposed);
    const pc2 = _.nth(1, transposed);

    expect(Array.isArray(transposed)).toBe(true);

    for (let vec of transposed) {
        expect(Array.isArray(vec)).toBe(true);
    }
});
