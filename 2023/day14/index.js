import { readLines } from '../../helpers/readInput/index.js';
import timedLog from '../../helpers/timedLog.js';

const MAX = 1000000000;

const readData = () => readLines().map((l) => l.split(''));

const data = readData();

function reset() {
  data.splice(0, data.length, ...readData());
}

function newLastDot(ch, lastDot, index, onRound) {
  switch (ch) {
    case '.':
      return (lastDot === -1) ? index : lastDot;
    case '#':
      return -1;
    case 'O':
      if (lastDot === -1) {
        return lastDot;
      }
      return lastDot + onRound(lastDot);
    default:
  }
  return -1;
}

function moveNorth() {
  for (let c = 0; c < data[0].length; c++) {
    let lastDot = -1;
    for (let r = 0; r < data.length; r++) {
      lastDot = newLastDot(data[r][c], lastDot, r, (i) => {
        data[i][c] = 'O';
        data[r][c] = '.';
        return 1;
      });
    }
  }
}

function moveWest() {
  for (let r = 0; r < data.length; r++) {
    let lastDot = -1;
    for (let c = 0; c < data[r].length; c++) {
      lastDot = newLastDot(data[r][c], lastDot, c, (i) => {
        data[r][i] = 'O';
        data[r][c] = '.';
        return 1;
      });
    }
  }
}

function moveSouth() {
  for (let c = 0; c < data[0].length; c++) {
    let lastDot = -1;
    for (let r = data.length - 1; r >= 0; r--) {
      lastDot = newLastDot(data[r][c], lastDot, r, (i) => {
        data[i][c] = 'O';
        data[r][c] = '.';
        return -1;
      });
    }
  }
}

function moveEast() {
  for (let r = 0; r < data.length; r++) {
    let lastDot = -1;
    for (let c = data[r].length - 1; c >= 0; c--) {
      lastDot = newLastDot(data[r][c], lastDot, c, (i) => {
        data[r][i] = 'O';
        data[r][c] = '.';
        return -1;
      });
    }
  }
}

function cycle() {
  moveNorth();
  moveWest();
  moveSouth();
  moveEast();
}

function print() {
  console.log(data.map((r) => r.join('')).join('\n'));
}

function getLoad() {
  return data.reduce((sum, row, r) => sum + row.filter((c) => c === 'O').length * (data.length - r), 0);
}

function getKey() {
  return data.map((r) => r.join('')).join('');
}

timedLog('Preparation');

function solve1() {
  moveNorth();
  return getLoad();
}

function solve2() {
  reset();
  const cache = { [getKey()]: 0 };
  let count = 0;
  let matched = false;
  while (count < MAX) {
    cycle();
    count++;
    if (!matched) {
      const key = getKey();
      if (cache[key]) {
        const diff = count - cache[key];
        const remaining = (MAX - count) % diff;
        count = MAX - remaining;
        matched = true;
      }
      cache[key] = count;
    }
  }
  return getLoad();
}

timedLog('Part 1:', solve1());
timedLog('Part 2:', solve2());
