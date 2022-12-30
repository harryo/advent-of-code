// import readFile from '../../helpers/readFile.js';
import readLines from '../../helpers/readLines.js';
import showTimedSolution from '../../helpers/showTimedSolution.js';

console.time('Preparation');

const data = readLines()
  .map((line) => line.split(/\D+/).map(Number))
  .map(([min1, max1, min2, max2]) => [{ min: min1, max: max1 }, { min: min2, max: max2 }]);

console.timeEnd('Preparation');

function solve1() {
  function fullOverlap(r1, r2) {
    return r1.min <= r2.min && r1.max >= r2.max;
  }
  return data.filter(([r1, r2]) => fullOverlap(r1, r2) || fullOverlap(r2, r1)).length;
}

function solve2() {
  function partOverlap(r1, r2) {
    return r1.min <= r2.max && r1.max >= r2.min;
  }
  return data.filter(([r1, r2]) => partOverlap(r1, r2)).length;
}

showTimedSolution(1, () => solve1());

showTimedSolution(2, () => solve2());
