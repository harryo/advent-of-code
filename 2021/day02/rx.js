const { from } = require('rxjs');
const { map, reduce } = require('rxjs/operators');
const readLines = require('../../helpers/readLines');
const parseLine = require('./parseLine');

const source = readLines(process.argv[2]);

const initialState = {
  horizontal: 0,
  depth: 0,
  aim: 0,
};

function reducer1(acc, val) {
  const { command, value } = val;
  let { horizontal, depth } = acc;
  switch (command) {
    case 'forward':
      horizontal += value;
      break;
    case 'up':
      depth -= value;
      break;
    case 'down':
      depth += value;
      break;
    default:
      throw new Error('Unknown command', command);
  }
  return { horizontal, depth };
}

function reducer2(acc, val) {
  const { command, value } = val;
  let { horizontal, depth, aim } = acc;
  switch (command) {
    case 'forward':
      horizontal += value;
      depth += value * aim;
      break;
    case 'up':
      aim -= value;
      break;
    case 'down':
      aim += value;
      break;
    default:
      throw new Error('Unknown command', command);
  }
  return { horizontal, depth, aim };
}

console.time('Part 1');
from(source)
  .pipe(
    map(parseLine),
    reduce(reducer1, initialState),
  )
  .subscribe((result) => {
    const { horizontal, depth } = result;
    console.timeEnd('Part 1');
    console.log('Part 1 solution:', horizontal * depth);
  });

console.time('Part 2');
from(source)
  .pipe(
    map(parseLine),
    reduce(reducer2, initialState),
  )
  .subscribe((result) => {
    const { horizontal, depth } = result;
    console.timeEnd('Part 2');
    console.log('Part 2 solution:', horizontal * depth);
  });
