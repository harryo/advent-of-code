import readBlocks from '../../helpers/readBlocks.js';
import showTimedSolution from '../../helpers/showTimedSolution.js';

function getState(block) {
  const [base, ...columns] = block.split(/\n/).reverse();
  const result = {};
  base.split('').forEach((key, index) => {
    if (key === ' ') {
      return;
    }
    result[key] = columns.map((column) => column[index]).filter((char) => char && char !== ' ');
  });
  return result;
}

console.time('Preparation');

const data = readBlocks();

const moves = data[1].split(/\n/).map((line) => line.match(/\d+/g).map(Number));

console.timeEnd('Preparation');

function solve1() {
  const state = getState(data[0]);
  moves.forEach(([count, from, to]) => {
    for (let i = 0; i < count; i++) {
      const crate = state[from].pop();
      state[to].push(crate);
    }
  });
  return Object.values(state).map((l) => l.pop()).join('');
}

function solve2() {
  const state = getState(data[0]);
  moves.forEach(([count, from, to]) => {
    const pile = state[from].splice(-count);
    state[to].push(...pile);
  });
  return Object.values(state).map((l) => l.pop()).join('');
}

showTimedSolution(1, () => solve1());

showTimedSolution(2, () => solve2());
