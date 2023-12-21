import { PowerSquare } from 'lucide-react';
import { readMatrix } from '../../helpers/readInput/index.js';
import timedLog from '../../helpers/timedLog.js';
import Heap from '../../helpers/Heap.js';
import { DIRECTIONS_SQUARE } from '../../helpers/getAdjacent.js';

const data = readMatrix();
const start = data.flat().find((x) => x.ch === 'S');
const MAX_STEPS = data.length === 11 ? 6 : 64;
const RSIZE = data.length;
const CSIZE = data[0].length;

timedLog('Preparation');

function init() {
  const { r, c } = start;
  const steps = 0;
  const plots = new Map();
  const heap = new Heap();
  heap.insert({ pos: { r, c, s: `${r},${c}` }, steps });
  return { heap, plots };
}

function done({ heap }) {
  return !heap.hasMore();
}

function posMod(v, m) {
  return ((v % m) + m) % m;
}

const counts = { direct: 0, indirect: 0 };
function step(state, maxSteps) {
  const { heap, plots } = state;
  const { pos, steps } = heap.next();
  if (plots.has(pos.s)) {
    return { heap, plots };
  }
  if (steps % 2 === 0) {
    // const rBase = ((pos.r - start.r) % RSIZE) + start.r;
    // const cBase = ((pos.c - start.c) % CSIZE) + start.c;
    // const sBase = `${rBase},${cBase}`;
    // if (plots.has(sBase)) {
    //   const plot = plots.get(sBase);
    //   const dr = pos.r - rBase;
    //   const dc = pos.c - cBase;
    //   const ds = steps - plot;
    //   for (let i = 1; steps + i * ds <= maxSteps; i++) {
    //     counts.indirect++;
    //     plots.set(`${rBase + i * dr},${cBase + i * dc}`, steps + i * ds);
    //   }
    // }
    counts.direct++;
    plots.set(pos.s, steps);
  }
  if (steps === maxSteps) {
    return { heap, plots };
  }
  DIRECTIONS_SQUARE.forEach(([dr, dc]) => {
    const newPos = { r: pos.r + dr, c: pos.c + dc };
    newPos.s = `${newPos.r},${newPos.c}`;
    const { ch } = data[posMod(newPos.r, RSIZE)][posMod(newPos.c, CSIZE)];
    if (ch !== '#' && !plots.has(newPos.s)) {
      heap.insert({ pos: newPos, steps: steps + 1 });
    }
  });
  return { heap, plots };
}

function solve1() {
  let state = init();
  while (!done(state)) {
    state = step(state, MAX_STEPS);
  }
  return state.plots.size;
}

function solve2() {
  let state = init();
  while (!done(state)) {
    state = step(state, 100);
    // state = step(state, 26501365);
  }
  console.log(counts, (counts.direct / (counts.direct + counts.indirect)).toFixed(2));
  return state.plots.size;
}

// timedLog('Part 1:', solve1());
timedLog('Part 2:', solve2());
