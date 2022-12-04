// const readFile = require('../../helpers/readFile');
const readLines = require('../../helpers/readLines');
const showTimedSolution = require('../../helpers/showTimedSolution');

function itemsPerRucksack(line) {
  const size = line.length / 2;
  return [line.slice(0, size), line.slice(size)];
}

function getScore(ch) {
  const charCode = (c) => c.charCodeAt(0);
  const isUppercase = (c) => /[A-Z]/.test(c);
  return isUppercase(ch) ? charCode(ch) - charCode('A') + 27 : charCode(ch) - charCode('a') + 1;
}

function findDuplicate(a1, a2) {
  return a1.find((item) => a2.includes(item));
}

function makeGroups(lines) {
  return new Array(lines.length / 3).fill(null).map((dummy, idx) => lines.slice(idx * 3, idx * 3 + 3));
}

function findCommon(a1, a2, ...rest) {
  const common = a1.filter((item) => a2.includes(item));
  if (rest.length === 0) {
    return common;
  }
  return findCommon(common, ...rest);
}

console.time('Preparation');

const data = readLines('input.txt').map((line) => line.split(''));

console.timeEnd('Preparation');

function solve1() {
  return data
    .map(itemsPerRucksack)
    .map(([r1, r2]) => findDuplicate(r1, r2))
    .reduce((a, b) => a + getScore(b), 0);
}

function solve2() {
  return makeGroups(data)
    .map(([r1, r2, r3]) => findCommon(r1, r2, r3))
    .reduce((a, b) => a + getScore(b[0]), 0);
}

showTimedSolution(1, () => solve1());

showTimedSolution(2, () => solve2());
