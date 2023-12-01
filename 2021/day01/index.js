import readLines from '../../helpers/readLines.js';
import solve1 from './solve1.js';
import solve2 from './solve2.js';

const range = 3;

const data = readLines().map(Number);
console.time('part 1');
const solution = solve1(data);
console.timeEnd('part 1');
console.log('Part 1 solution:', solution);

console.time('part 2');
const solution2 = solve2(data, range);
console.timeEnd('part 2');
console.log('Part 2 solution:', solution2);
