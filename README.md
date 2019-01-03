# kohonen [![Build Status](https://travis-ci.org/seracio/kohonen.svg?branch=master)](https://travis-ci.org/seracio/kohonen)

> A basic implementation of a Kohonen map in JavaScript

Disclaiment: this is a toy implementation of the SOM algorithm, you should probably consider using a more solid library in R or Python.

## Usage

### Import lib

```
npm i d3-array d3-scale d3-random lodash ml-pca @seracio/kohonen --save
```

Then, in your JS script :

```javascript
import { Kohonen, generateGrid } from '@seracio/kohonen';
```

### API

#### Kohonen

The Kohonen class is the main class.

##### Constructor

|   param name    |    definition     |      type      | mandatory | default |
| :-------------: | :---------------: | :------------: | :-------: | :-----: |
|     neurons     |  grid of neurons  |     Array      |    yes    |         |
|      data       |      dataset      | Array of Array |    yes    |         |
|     maxStep     | step max to clamp |     Number     |    no     |  1000   |
| maxLearningCoef |                   |     Number     |    no     |   .4    |
| minLearningCoef |                   |     Number     |    no     |   .1    |
| maxNeighborhood |                   |     Number     |    no     |    1    |
| minNeighborhood |                   |     Number     |    no     |   .3    |

```javascript
// instanciate your Kohonen map
const k = new Kohonen({ data, neurons });

// you can use the grid helper to generate a grid with 10x10 hexagons
const k = new Kohonen({ data, neurons: generateGrid(10, 10) });
```

`neurons` parameter should be a flat array of `{ pos: [x,y] }`. `pos` array being the coordinate on the grid.

`data` parameter is an array of the vectors you want to display. There is no need to standardize your data, that will
be done internally by scaling each feature to the [0,1] range.

Basically the constructor do :

-   standardize the given data set
-   initialize random weights for neurons using PCA's largests eigenvectors

##### training method

| param name |                   definition                    |   type   | mandatory |       default       |
| :--------: | :---------------------------------------------: | :------: | :-------: | :-----------------: |
|    log     | func called after each step of learning process | Function |    no     | (neurons, step)=>{} |

```javascript
k.training();
```

`training` method iterates on random vectors picked on normalized data.
If a log function is provided as a parameter, it will receive instance neurons and step as params.

##### mapping method

`mapping` method returns grid position for each data provided on the constructor.

```javascript
const myPositions = k.mapping();
```

##### umatrix method

`umatrix` method returns the U-Matrix of the grid (currently only with standardized vectors).

```javascript
const umatrix = k.umatrix();
```

##### errors

There are some heavy calculations in those 2 methods ; if you use them in the training callback (log),
it's better not to use it on every step.

```javascript
k.topographicError();
k.quantizationError();

k.training((neurons, step) => {
    if (step % 20 === 0) {
        k.topographicError();
        k.quantizationError();
    }
});
```

## Example

We've developed a full example on [a dedicated repository](https://github.com/seracio/kohonen-stars)

![capture](https://cdn.rawgit.com/seracio/kohonen-stars/master/images/capture.svg)

## (Re)sources

-   [The Self-Organizing Map (SOM)]
-   [d3]
-   [lodash/fp]
-   [ml-pca]
-   [Loadings vs eigenvector in PCA]
-   [SOM tutorial]
-   [Shyam M. Guthikonda]

[d3]: https://d3js.org
[lodash/fp]: https://github.com/lodash/lodash/wiki/FP-Guide
[ml-pca]: https://github.com/mljs/pca
[the self-organizing map (som)]: http://www.cis.hut.fi/projects/somtoolbox/theory/somalgorithm.shtml
[som tutorial]: http://www.ai-junkie.com/ann/som/som1.html
[loadings vs eigenvector in pca]: http://stats.stackexchange.com/questions/143905/loadings-vs-eigenvectors-in-pca-when-to-use-one-or-another
[shyam m. guthikonda]: http://www.shy.am/wp-content/uploads/2009/01/kohonen-self-organizing-maps-shyam-guthikonda.pdf
