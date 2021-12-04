const { from } = require('rxjs');
const { map, reduce } = require('rxjs/operators');
const readLines = require('../../helpers/readLines');

const source = readLines(process.argv[2]);

const size = source[0].length;
const initialData = {
  counts: Array(size).fill(0),
  total: 0,
};

function reducer(acc, value) {
  const counts = acc.counts.map((count, idx) => (value[idx] === '1' ? count + 1 : count));
  return { counts, total: acc.total + 1 };
}

function getRates(data) {
  let gamma = 0;
  let epsilon = 0;
  const half = data.total / 2;
  data.counts.forEach((count) => {
    gamma <<= 1;
    epsilon <<= 1;
    if (count > half) {
      gamma++;
    } else {
      epsilon++;
    }
  });
  return { gamma, epsilon };
}

console.time('part 1');
from(source)
  .pipe(
    reduce(reducer, initialData),
    map(getRates),
  )
  .subscribe((result) => {
    console.timeEnd('part 1');
    const { gamma, epsilon } = result;
    console.log('Part 1 solution:', gamma * epsilon);
  });
