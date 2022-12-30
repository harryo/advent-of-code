import readBlocks from '../../helpers/readBlocks.js';
import showTimedSolution from '../../helpers/showTimedSolution.js';

console.time('Preparation');
const caloriesPerElf = readBlocks().map((blk) => blk.split('\n').map(Number).reduce((a, b) => a + b, 0));
console.timeEnd('Preparation');

function solve1() {
  return Math.max(...caloriesPerElf);
}

function solve2() {
  caloriesPerElf.sort((a, b) => b - a);
  return caloriesPerElf.slice(0, 3).reduce((a, b) => a + b, 0);
}

showTimedSolution(1, () => solve1());

showTimedSolution(2, () => solve2());
