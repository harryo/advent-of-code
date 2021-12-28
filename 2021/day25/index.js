/* eslint-disable no-param-reassign */
// const readFile = require('../../helpers/readFile');
// const readLines = require('../../helpers/readLines');
const readMatrix = require('../../helpers/readMatrix');
const createArray = require('../../helpers/createArray');
const showTimedSolution = require('../../helpers/showTimedSolution');

console.time('Preparation');

const matrix = readMatrix();
const height = matrix.length;
const width = matrix[0].length;
const fields = matrix.flat();
fields.forEach((f, i) => {
  f.i = i;
});
fields.forEach((f) => {
  f.e = matrix[f.r][(f.c + 1) % width].i;
  f.s = matrix[(f.r + 1) % height][f.c].i;
});

const state = fields.map((f) => f.ch);

function step() {
  let changed = false;
  function makeChanges(ch, dir) {
    fields
      .map((f) => ({ from: f.i, to: f[dir] }))
      .filter((o) => state[o.from] === ch && state[o.to] === '.')
      .forEach((o) => {
        changed = true;
        state[o.from] = '.';
        state[o.to] = ch;
      });
  }
  makeChanges('>', 'e');
  makeChanges('v', 's');
  return changed;
}

function dump(label) {
  console.group(label);
  matrix.forEach((row) => {
    console.log(row.map((f) => state[f.i]).join(''));
  });
  console.groupEnd();
}

console.timeEnd('Preparation');

function solve1() {
  let count = 0;
  do {
    count++;
  } while (step());
  return count;
}

function solve2() {
  return 'Pending';
}

showTimedSolution(1, () => solve1());

showTimedSolution(2, () => solve2());
