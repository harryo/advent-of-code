const readLines = require('../../helpers/readLines');
const solve1 = require('./solve1');
const solve2 = require('./solve2');

const range = 3;

const data = readLines(process.argv[2]).map(Number);
console.time('part 1');
const solution = solve1(data);
console.timeEnd('part 1');
console.log('Day 1 part 1 solution:', solution);

console.time('part 2');
const solution2 = solve2(data, range);
console.timeEnd('part 2');
console.log('Day 1 part 2 solution:', solution2);
