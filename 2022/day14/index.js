const { readLines } = require('../../helpers/readInput');
const timedLog = require('../../helpers/timedLog');
const Wall = require('./Wall');

const data = readLines().map((l) => l.split(' -> ').map((p) => p.split(',').map(Number)));
const yMax = Math.max(...data.flat().map(([, y]) => y)) + 1;

function fallStep(x, y, wall) {
  return [0, -1, 1]
    .map((dx) => [x + dx, y + 1])
    .find((p) => !wall.has(p));
}

function fall(wall) {
  let [x, y] = [500, 0];
  while (y < yMax) {
    const p = fallStep(x, y, wall);
    if (!p) {
      break;
    }
    [x, y] = p;
  }
  return [x, y];
}

function fill(isFinished) {
  const wall = new Wall(data, yMax + 1);
  let count = 0;
  let p;
  do {
    p = fall(wall);
    wall.add(p);
    count++;
  } while (!isFinished(p));
  return count;
}

timedLog('Preparation');

function solve1() {
  return fill(([, y]) => y === yMax) - 1;
}

function solve2() {
  return fill(([, y]) => y === 0);
}

timedLog('Part 1:', solve1());
timedLog('Part 2:', solve2());
