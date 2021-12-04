const { from } = require('rxjs');
const {
  map, filter, count, pairwise, scan,
} = require('rxjs/operators');
const readLines = require('../../helpers/readLines');

const range = 3;

const source = readLines(process.argv[2]);

function arraySum(arr) {
  return arr.reduce((sum, val) => sum + val, 0);
}

console.time('part 1');
from(source)
  .pipe(
    map(Number),
    pairwise(),
    filter(([v1, v2]) => v2 > v1),
    count(),
  )
  .subscribe((n) => console.log('Day 1 part 1 solution:', n));
console.timeEnd('part 1');

console.time('part 2');
from(source)
  .pipe(
    map(Number),
    scan((acc, val) => ([val, ...acc].slice(0, range)), []),
    filter((arr) => arr.length >= range),
    map(arraySum),
    pairwise(),
    filter(([v1, v2]) => v2 > v1),
    count(),
  )
  .subscribe((n) => console.log('Day 1 part 2 solution:', n));
console.timeEnd('part 2');

console.time('part 2a');
from(source)
  .pipe(
    map(Number),
    scan((acc, val) => ([val, ...acc].slice(0, range + 1)), []),
    filter((arr) => arr.length > range && arr[0] > arr[range]),
    count(),
  )
  .subscribe((n) => console.log('Day 1 part 2 alt. solution:', n));
console.timeEnd('part 2a');
