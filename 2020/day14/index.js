/* eslint-disable no-param-reassign */
// const readFile = require('../../helpers/readFile');
const readLines = require('../../helpers/readLines');
const showTimedSolution = require('../../helpers/showTimedSolution');

const commands = readLines();

let mask;
const mem = {};
const mem2 = {};

function maskedValue(val) {
  const result = Array.from(val.toString(2).padStart(mask.length, '0')); // val to 36-bit binary
  Array.from(mask).forEach((b, i) => {
    if (b !== 'X') {
      result[i] = b;
    }
  });
  return parseInt(result.join(''), 2);
}

function v2addresses(val) {
  const bitValue = Array.from(val.toString(2).padStart(mask.length, '0')); // val to 36-bit binary
  const floating = [];
  Array.from(mask).forEach((b, i) => {
    if (b === 'X') {
      floating.push(i);
    } else if (b === '1') {
      bitValue[i] = '1';
    }
  });
  return Array(2 ** floating.length).fill()
    .map(() => [...bitValue])
    .map((v, i) => {
      const bits = Array.from(i.toString(2).padStart(floating.length, '0'));
      floating.forEach((p, j) => {
        v[p] = bits[j];
      });
      return v;
    })
    // .map((v) => v.join(''));
    .map((v) => parseInt(v.join(''), 2));
}

function process(line, version2) {
  const [cmd, v1, v2] = line.split(/\W+/);
  if (cmd === 'mask') {
    mask = v1;
    return;
  }
  if (!version2) {
    mem[v1] = maskedValue(Number(v2));
    return;
  }
  v2addresses(Number(v1)).forEach((at) => {
    mem2[at] = Number(v2);
  });
}

// commands.forEach(process);

commands.forEach((line) => process(line, true));

function solve1() {
  // return Object.values(mem).reduce((s, v) => s + v, 0);
}

function solve2() {
  return Object.values(mem2).reduce((s, v) => s + v, 0);
}

showTimedSolution(1, () => solve1());

showTimedSolution(2, () => solve2());
