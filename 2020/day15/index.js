import readFile from '../../helpers/readFile.js';
// import readLines from '../../helpers/readLines.js';
import showTimedSolution from '../../helpers/showTimedSolution.js';

const startingSequence = readFile().split(/\D+/).filter(Boolean).map(Number);

function solve(max) {
  const indices = Array(max).fill();
  startingSequence.slice(0, -1).forEach((v, i) => {
    indices[v] = i;
  });
  let count = startingSequence.length - 1;
  let lastNumber;
  let nextNumber = startingSequence[count];

  while (count < max) {
    lastNumber = nextNumber;
    const prevIndex = indices[lastNumber];
    nextNumber = prevIndex === undefined ? 0 : count - prevIndex;
    indices[lastNumber] = count;
    count++;
  }
  return lastNumber;
}

function solve1() {
  return solve(2020);
}

function solve2() {
  return solve(30000000);
}

showTimedSolution(1, () => solve1());

showTimedSolution(2, () => solve2());
