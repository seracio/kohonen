import { writeFileSync } from 'filendir';
import fs from 'fs';
import _ from 'lodash/fp';

const readDat = path => fs.readFileSync(path, 'utf-8');

const fluxesByName = _.flow(
  readDat,
  _.split('\n'),
  _.compact,
  _.groupBy(line => line.slice(0,9)),
  _.mapValues(
    // An array of line
    _.flow(
      _.map(_.flow(
        line => line.slice(9),
        _.split(' '),
        _.compact,
        _.map(parseFloat)
      )),
      _.flatten
    )
  )
)('examples/stars/data/fluxes.dat');

const stars = _.flow(
  readDat,
  _.split('\n'),
  _.compact,
  _.map(str => ({
    name: str.slice(1,11).trim(),
    spectralType: str.slice(12, 16).trim(),
    data: fluxesByName[str.slice(1,11).trim()]
  }))
)('examples/stars/data/stars.dat');

writeFileSync('examples/stars/data/data.json', JSON.stringify(stars));
