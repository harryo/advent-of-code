const readFile = require('../../helpers/readFile');
// const readLines = require('../../helpers/readLines');
const showTimedSolution = require('../../helpers/showTimedSolution');

/**
 * Return index of first character that is duplicated in arr
 * @param {array} arr
 * @returns int
 */
function findDuplicate(arr) {
  return arr.slice(0, -1).findIndex((ch, i) => arr.slice(i + 1).includes(ch));
}

function findMarker(arr, size) {
  let idx = 0;
  while (idx < arr.length) {
    const duplicateIndex = findDuplicate(arr.slice(idx, idx + size));
    if (duplicateIndex === -1) {
      break; // Found marker
    }
    idx += duplicateIndex + 1;
  }
  return idx + size;
}

console.time('Preparation');

const data = readFile().split('');

console.timeEnd('Preparation');

function solve1() {
  return findMarker(data, 4);
}

function solve2() {
  return findMarker(data, 14);
}

showTimedSolution(1, () => solve1());

showTimedSolution(2, () => solve2());
