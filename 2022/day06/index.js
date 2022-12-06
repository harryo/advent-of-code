const readFile = require('../../helpers/readFile');
// const readLines = require('../../helpers/readLines');
const timedLog = require('../../helpers/timerLog');

/**
 * Return index of first character that is duplicated in arr
 * @param {array} arr
 * @returns int
 */
function findDuplicate(arr) {
  return arr.slice(0, -1).findIndex((ch, i) => arr.slice(i + 1).includes(ch));
}

function findMarker(arr, size) {
  let idx = size;
  while (idx <= arr.length) {
    const duplicateIndex = findDuplicate(arr.slice(idx - size, idx));
    if (duplicateIndex === -1) {
      return idx; // Found marker
    }
    idx += duplicateIndex + 1;
  }
  throw new Error('Marker not found');
}

const data = readFile().split('');

timedLog('Preparation');

function solve1() {
  return findMarker(data, 4);
}

function solve2() {
  return findMarker(data, 14);
}

timedLog('Part 1:', solve1());
timedLog('Part 2:', solve2());
