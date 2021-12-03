const { from } = require('rxjs');
const { map, reduce } = require('rxjs/operators');
const readLines = require('../helpers/readLines.js');
const { reducer, getInitialData, getRates } = require("./helpers");

const useSample = 0;
const source = readLines(useSample);

const size = source[0].length;
const initialData = getInitialData(size);

console.time('part 1');
from(source)
  .pipe(
    reduce(reducer, initialData),
    map(getRates),
  )
  .subscribe(result => {
    console.timeEnd('part 1');
    const { gamma, epsilon } = result;
    console.log('Part 1 solution:', gamma * epsilon);
  });
