import { DIRECTIONS_SQUARE } from '../../helpers/getAdjacent.js';
import { readMatrix } from '../../helpers/readInput/index.js';
import timedLog from '../../helpers/timedLog.js';
import Heap from './Heap.js';

const data = readMatrix();
const maxDistance = data.length + data[0].length - 2;
const list = data.flat();
list.forEach((item) => {
  const { r, c, ch } = item;
  Object.assign(item, {
    value: Number(ch),
    distance: maxDistance - r - c,
    str: `[${r},${c}]`,
  });
});
const endPos = list[list.length - 1];

const dirs = ['^', 'V', '<', '>'];

function init(part) {
  const pos = data[0][0];
  const history = [];
  const heatLoss = 0;
  const minHeatLoss = Infinity;
  const placesVisited = {};
  const heap = new Heap((o) => o?.heatLoss ?? Infinity);
  heap.insert({ pos, history, heatLoss });
  return {
    minHeatLoss, placesVisited, heap, part,
  };
}

function shouldContinue(item, state) {
  const { placesVisited, minHeatLoss } = state;
  const {
    pos, heatLoss, lastDir, dirCount,
  } = item;
  const key = [pos.str, lastDir, dirCount].join('|');
  return heatLoss < Math.min(minHeatLoss - pos.distance, placesVisited[key] ?? Infinity) ? key : null;
}

function step(state) {
  const {
    placesVisited, heap, part,
  } = state;
  const item = heap.next();
  const {
    pos, history, heatLoss, lastDir, dirCount,
  } = item;
  const key = shouldContinue(item, state);
  if (!key) {
    return state;
  }
  placesVisited[key] = heatLoss;
  const newHistory = [...history, {
    pos: pos.str, heatLoss, lastDir, dirCount,
  }];
  if (pos === endPos) {
    return { ...state, minHeatLoss: heatLoss, bestpath: newHistory };
  }
  const adjacent = DIRECTIONS_SQUARE.map(([dr, dc], di) => {
    const p = data[pos.r + dr]?.[pos.c + dc];
    if (!p) {
      return null;
    }
    if (p.str === history[history.length - 1]?.pos) {
      return null;
    }
    const dir = dirs[di];
    const newDirCount = dir === lastDir ? dirCount + 1 : 1;

    if (part === 1 && newDirCount > 3) {
      return null;
    }
    if (part === 2 && newDirCount > 10) {
      return null;
    }
    if (part === 2 && dir !== lastDir && dirCount < 4) {
      return null;
    }
    const newItem = {
      pos: p,
      history: newHistory,
      heatLoss: heatLoss + p.value,
      lastDir: dir,
      dirCount: newDirCount,
    };
    return shouldContinue(newItem, state) ? newItem : null;
  }).filter(Boolean);
  heap.insert(...adjacent);
  return state;
}

timedLog('Preparation');

function solve1() {
  let state = init(1);
  while (state.heap.hasMore()) {
    state = step(state);
  }
  return state.minHeatLoss;
}

function solve2() {
  let state = init(2);
  while (state.heap.hasMore()) {
    state = step(state);
  }
  return state.minHeatLoss;
}

timedLog('Part 1:', solve1());
timedLog('Part 2:', solve2());
