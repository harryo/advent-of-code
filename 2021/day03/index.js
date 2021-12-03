const readLines = require('../helpers/readLines.js');

const useSample = 0;
const source = readLines(useSample);

const size = source[0].length;

console.time('part 1');
const gammaString = solve1(source);
const gamma = parseInt(gammaString, 2);
const epsilon = 2 ** size - 1 - gamma;
console.timeEnd('part 1');
console.log('Part 1 solution:', gamma * epsilon);

console.time('part 2');
const oxygen = solve2(source, 0, true);
const co2 = solve2(source, 0, false);
console.timeEnd('part 2');
console.log('Part 2 solution:', oxygen * co2);

function solve1(list) {
  const half = list.length / 2;
  return new Array(size)
    .fill()
    .map((dummy, pos) => {
      const countOnes = list.filter(v => v[pos] === '1').length;
      return countOnes > half ? '1' : '0';
    })
    .join('');
}

function solve2(list, pos = 0, max) {
  const listWithOnes = list.filter(v => v[pos] === '1');
  // Note: bitwise XOR ^ is same a logical XOR when comparing booleans
  const newList = (listWithOnes.length < list.length / 2) ^ max ? listWithOnes : list.filter(v => v[pos] === '0');
  return newList.length > 1 && pos + 1 < size ? solve2(newList, pos + 1, max) : parseInt(newList[0], 2);
}
