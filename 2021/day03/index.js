const readLines = require('../../helpers/readLines.js');
const xor = require('../../helpers/xor.js');

const useSample = 0;
const source = readLines(useSample);

const size = source[0].length;

console.time('part 1');
const gammaString = getGammaString(source);
const gamma = parseInt(gammaString, 2);
const epsilon = 2 ** size - 1 - gamma;
console.timeEnd('part 1');
console.log('Part 1 solution:', gamma * epsilon);

console.time('part 2');
const oxygen = parseInt(filterList(source, 0, true), 2);
const co2 = parseInt(filterList(source, 0, false), 2);
console.timeEnd('part 2');
console.log('Part 2 solution:', oxygen * co2);

/**
 * Set each bit to the most common bit at the same place in the list
 * @param {array} list 
 * @returns string
 */
function getGammaString(list) {
  const half = list.length / 2;
  return Array(size)
    .fill()
    .map((dummy, pos) => {
      const countOnes = list.filter(v => v[pos] === '1').length;
      return countOnes > half ? '1' : '0';
    })
    .join('');
}

/**
 * Recursively find the items with the most/least common bits in a given position
 * @param {array} list 
 * @param {int} pos 
 * @param {bool} max true if searching for most common bit
 * @returns 
 */
function filterList(list, pos = 0, max) {
  const listWithOnes = list.filter(v => v[pos] === '1');
  const newList = xor(listWithOnes.length < list.length / 2, max) ? listWithOnes : list.filter(v => v[pos] === '0');
  return newList.length > 1 && pos + 1 < size ? filterList(newList, pos + 1, max) : newList;
}
