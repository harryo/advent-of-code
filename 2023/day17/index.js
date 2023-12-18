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
  const placesVisited = new Array(list.length).fill(null);
  const heap = new Heap((o) => o?.heatLoss ?? Infinity);
  heap.insert({ pos, history, heatLoss });
  return {
    minHeatLoss, placesVisited, heap, part,
  };
}

function step(state) {
  const {
    placesVisited, heap, minHeatLoss, part,
  } = state;
  const {
    pos, history, heatLoss, lastDir, dirCount,
  } = heap.next();
  const key = [lastDir, dirCount].join('|');
  if (heatLoss + pos.distance >= minHeatLoss) {
    return state;
  }
  if (placesVisited[pos.i]?.[key] && placesVisited[pos.i][key] <= heatLoss) {
    return state;
  }
  placesVisited[pos.i] = Object.assign(placesVisited[pos.i] || {}, { [key]: heatLoss });
  const newHistory = [...history, {
    pos: pos.str, heatLoss, lastDir, dirCount,
  }];
  if (pos === endPos) {
    if (heatLoss >= minHeatLoss) {
      return state;
    }
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
    if (heatLoss + p.value + p.distance >= minHeatLoss) {
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
    const newKey = [dir, newDirCount].join('|');
    if (placesVisited[p.i]?.[newKey] && placesVisited[p.i][newKey] < heatLoss) {
      return null;
    }
    return {
      pos: p,
      history: newHistory,
      heatLoss: heatLoss + p.value,
      lastDir: dir,
      dirCount: newDirCount,
    };
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
