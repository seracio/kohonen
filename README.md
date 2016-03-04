# kohonen [![Build Status](https://travis-ci.org/seracio/kohonen.svg?branch=master)](https://travis-ci.org/seracio/kohonen)
A basic implementation of a Kohonen map in JavaScript

We are still on an early stage of dev. Do not use this package until v1.0.0 has been released.

## Usage


### Import lib

Add the npm package to your `package.json` file

```
npm i kohonen --save
```

Then, in your JS script :

```javascript
import Kohonen, {hexagonHelper} from 'kohonen';
```

### API

#### Kohonen

The Kohonen class is the main class.

##### Constructor

|  param name      | definition       | type             | mandatory        | default          |
|:----------------:|:----------------:|:----------------:|:----------------:|:----------------:|
|    neurons       |  grid of neurons |   Array          |       yes        |                  |
|    data          |  dataset         |   Array of Array |       yes        |                  |
|    maxStep       | step max to clamp|   Number         |       no         |     10000        |
| minLearningCoef  |                  |   Number         |       no         |      .3          |
| minNeighborhood  |                  |   Number         |       no         |      .3          |

```javascript

// instanciate your Kohonen map
const k = new Kohonen({data, neurons});

// you can use the grid helper to generate a grid with 10x10 hexagons
const k = new Kohonen({data, neurons: hexagonHelper.generateGrid(10,10)});
```

`neurons` parameter should be a flat array of `{ pos: [x,y] }`. `pos` array being the coordinate on the grid.
The constructor builds a random vector of `size` dimensions for each neuron, using [d3]'s random generation within a
normal gaussian distribution with a standard deviation of 1 and a mean of 0.

`data` parameter is an array of the vectors you want to display. There is no need to normalize your data, that will
 be done via a gaussian normalization applied on each dimension of the vectors of the dataset.

##### run method

|  param name      | definition                                       | type             | mandatory        | default          |
|:----------------:|:------------------------------------------------:|:----------------:|:----------------:|:----------------:|
|    log           |  func called after each step of learning process |   Function       |       yes        |  ()=>{}          |


```javascript
k.run();
```

if a log function is provided as a parameter, it will receive instance neurons and step as params.

`run` method will iterate on random vectors within the normalized space and return the position of each vector of the
data provided in the constructor

## (Re)sources

* [The Self-Organizing Map (SOM)]
* [d3]
* [lodash/fp]
* [ml-pca]

[d3]: https://d3js.org
[lodash/fp]: https://github.com/lodash/lodash/wiki/FP-Guide
[ml-pca]: https://github.com/mljs/pca
[The Self-Organizing Map (SOM)]: http://www.cis.hut.fi/projects/somtoolbox/theory/somalgorithm.shtml