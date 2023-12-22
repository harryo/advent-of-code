import { readMatrix } from '../../helpers/readInput/index.js';
import timedLog from '../../helpers/timedLog.js';
import Heap from '../../helpers/Heap.js';
import { DIRECTIONS_DIAGONAL, DIRECTIONS_SQUARE } from '../../helpers/getAdjacent.js';

const data = readMatrix();
const start = data.flat().find((x) => x.ch === 'S');
const MAX_STEPS = data.length === 11 ? 6 : 64;
const SIZE = data.length;
const BLOCKS_AROUND = 4;
const BLOCKS = BLOCKS_AROUND * 2 + 1;
const STARTBLOCK = BLOCKS * BLOCKS_AROUND + BLOCKS_AROUND;

timedLog('Preparation');

function init() {
  const { r, c } = start;
  const pos = { r, c, s: `${r},${c}` };
  const steps = 0;
  const plots = new Map();
  const heap = new Heap();
  heap.insert({ pos, steps });
  const counts = new Array(BLOCKS * BLOCKS).fill(0);
  return { heap, plots, counts };
}

function posMod(v, m) {
  return ((v % m) + m) % m;
}

function done({ heap }) {
  return !heap.hasMore();
}

function outside({ r, c }) {
  return [r, c].some((x) => x < -BLOCKS_AROUND * SIZE || x >= (BLOCKS_AROUND + 1) * SIZE);
}

function getBlockIndex({ r, c }) {
  const qIndex = (v) => Math.floor(v / SIZE) + BLOCKS_AROUND;
  return qIndex(r) * BLOCKS + qIndex(c);
}

function step(state, maxSteps) {
  const { heap, plots, counts } = state;
  const { pos, steps } = heap.next();
  if (plots.has(pos.s)) {
    return state;
  }
  const block = getBlockIndex(pos);
  plots.set(pos.s, { steps, block });
  if (steps <= maxSteps && (maxSteps - steps) % 2 === 0) {
    counts[block] += 1;
  }
  if (steps < maxSteps) {
    DIRECTIONS_SQUARE.forEach(([dr, dc]) => {
      const newPos = { r: pos.r + dr, c: pos.c + dc };
      if (outside(newPos)) {
        return;
      }
      newPos.s = `${newPos.r},${newPos.c}`;
      const { ch } = data[posMod(newPos.r, SIZE)][posMod(newPos.c, SIZE)];
      if (ch !== '#' && !plots.has(newPos.s)) {
        state.heap.insert({ pos: newPos, steps: steps + 1 });
      }
    });
  }
  return { heap, plots, counts };
}

function getSteps(plots, blk) {
  const stepsList = [];
  plots.forEach(({ steps, block }) => {
    if (block === blk) {
      stepsList.push(steps);
    }
  });
  return stepsList;
}

function getBlockId(br, bc) {
  return BLOCKS * br + bc;
}

function countSteps(state, maxSteps) {
  const { plots, counts } = state;
  const center = [BLOCKS_AROUND, BLOCKS_AROUND];

  function parity(n) {
    return n % 2 === maxSteps % 2;
  }

  function filterSteps(block, max = Infinity) {
    const list = getSteps(plots, block);
    const result = list.filter((x) => x <= max && parity(x)).length;
    return result;
  }

  function getInsideBlocks(testBlock) {
    const testMax = Math.max(...getSteps(plots, testBlock));
    return Math.floor((maxSteps - testMax) / SIZE);
  }

  function sideways(dir) {
    const d = 3;
    const testBlock = getBlockId(d * dir[0] + center[0], d * dir[1] + center[1]);
    const nextBlock = getBlockId((d + 1) * dir[0] + center[0], (d + 1) * dir[1] + center[1]);
    const insideBlocks = d + getInsideBlocks(testBlock);
    let sum = Math.floor(insideBlocks / 2) * (counts[testBlock] + counts[nextBlock]);
    if (insideBlocks % 2) {
      sum += counts[testBlock];
    }
    let extraSum;
    let j = 1;
    do {
      const odd = (insideBlocks + d + j) % 2;
      const block = odd ? nextBlock : testBlock;
      extraSum = filterSteps(block, maxSteps - (insideBlocks - d + j - odd) * SIZE);
      sum += extraSum;
      j++;
    } while (extraSum > 0);

    return sum;
  }

  function triangle(n) {
    return (n * (n + 1)) / 2;
  }

  function diagonally(dir) {
    const d = 2;
    const testBlock = getBlockId(d * dir[0] + center[0], dir[1] + center[1]);
    const nextBlock = getBlockId((d + 1) * dir[0] + center[0], dir[1] + center[1]);
    const insideBlocks = d + getInsideBlocks(testBlock);
    const evenInside = 2 * triangle(Math.floor(insideBlocks / 2));
    const oddInside = triangle(insideBlocks) - evenInside;
    let sum = evenInside * counts[testBlock] + oddInside * counts[nextBlock];

    let extraSum;
    let j = 1;
    do {
      const odd = (insideBlocks + j + d) % 2;
      const block = odd ? nextBlock : testBlock;
      extraSum = filterSteps(block, maxSteps - (insideBlocks - d + j - odd) * SIZE);
      sum += (insideBlocks + j) * extraSum;
      j++;
    } while (extraSum > 0);
    return sum;
  }

  const sums = [
    ...DIRECTIONS_SQUARE.map((dir) => sideways(dir)),
    ...DIRECTIONS_DIAGONAL.map((dir) => diagonally(dir)),
  ];
  const startSum = state.counts[STARTBLOCK];
  const totalCounts = sums.reduce((a, b) => a + b, startSum);
  return totalCounts;
}

function display({ counts, plots }) {
  const lines = [];
  for (let i = 0; i < BLOCKS; i++) {
    lines.push(counts.slice(i * BLOCKS, (i + 1) * BLOCKS).join('\t'));
  }
  console.log(lines.join('\n'));
  console.log('-----------------');
  for (let i = 0; i < BLOCKS; i++) {
    const row = [];
    const os = BLOCKS * i;
    for (let j = 0; j < BLOCKS; j++) {
      const stepsList = getSteps(plots, os + j);
      row.push(Math.max(...stepsList));
    }
    console.log(row.join('\t'));
  }
}

function solve1() {
  let state = init();
  while (!done(state)) {
    state = step(state, MAX_STEPS);
  }
  return getSteps(state.plots, STARTBLOCK).filter((x) => (MAX_STEPS - x) % 2 === 0).length;
}

function solve2() {
  let state = init();
  const maxSteps = 26501365;
  while (!done(state)) {
    state = step(state, SIZE * BLOCKS * 2 + (maxSteps % 2));
  }
  // display(state);
  const totalCounts = countSteps(state, maxSteps);
  return totalCounts;
}

timedLog('Part 1:', solve1());
timedLog('Part 2:', solve2());

// 606188400245695
