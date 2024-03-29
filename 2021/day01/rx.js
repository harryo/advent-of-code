import { from } from 'rxjs';
const {
  map, filter, count, pairwise, scan,
} = require('rxjs/operators');
import readLines from '../../helpers/readLines.js';

const range = 3;

const source = readLines();

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
  .subscribe((n) => console.log('Part 1 solution:', n));
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
  .subscribe((n) => console.log('Part 2 solution:', n));
console.timeEnd('part 2');

console.time('part 2a');
from(source)
  .pipe(
    map(Number),
    scan((acc, val) => ([val, ...acc].slice(0, range + 1)), []),
    filter((arr) => arr.length > range && arr[0] > arr[range]),
    count(),
  )
  .subscribe((n) => console.log('Part 2 alt. solution:', n));
console.timeEnd('part 2a');
