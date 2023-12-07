import { readLines } from '../../helpers/readInput/index.js';
import timedLog from '../../helpers/timedLog.js';

const data = readLines();


timedLog('Preparation');

function solveEq2(t, d) {
  // x^^2 -x* t + d = 0
  const sqrt = Math.sqrt(t * t - 4 * d);
  const x1 = Math.floor((t - sqrt) / 2) + 1;
  const x2 = Math.ceil((t + sqrt) / 2) - 1;
  return [x1, x2]
}  

function solve1() {
  const times = data[0].split(/\s+/).slice(1).map(Number);
  const distances = data[1].split(/\s+/).slice(1).map(Number);
  const races = times.map((time, i) => ({ time, distance: distances[i] }));
  return races.map(({ time, distance }) => {
    const [x1, x2] = solveEq2(time, distance);
    return x2 - x1 + 1;
  }).reduce((a, b) => a * b, 1);
}

function solve2() {
  const time = Number(data[0].split(/\s+/).slice(1).join(''));
  const distance = Number(data[1].split(/\s+/).slice(1).join(''));
  const [x1, x2] = solveEq2(time, distance);
  return x2 - x1 + 1;
}

timedLog('Part 1:', solve1());
timedLog('Part 2:', solve2());
