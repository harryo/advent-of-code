import readLines from '../../helpers/readLines.js';
import timedLog from '../../helpers/timedLog.js';
import { DIRECTIONS_SQUARE } from '../../helpers/getAdjacent.js';

const data = readLines().map((line) => line.split('').map(Number));

function loopDirection(r, c, dir, cb) {
  const [dr, dc] = dir;
  let [nr, nc] = [r + dr, c + dc];
  while (nr >= 0 && nr < data.length && nc >= 0 && nc < data[0].length && cb(nr, nc)) {
    nr += dr;
    nc += dc;
  }
}

timedLog('Preparation');

function isVisibleFromDirection(r, c, dir) {
  const v = data[r][c];
  let isVisible = true;
  loopDirection(r, c, dir, (nr, nc) => {
    isVisible = data[nr][nc] < v;
    return isVisible;
  });
  return isVisible;
}

function solve1() {
  return data
    .flatMap((row, r) => row
      .filter((v, c) => DIRECTIONS_SQUARE.some((dir) => isVisibleFromDirection(r, c, dir))))
    .length;
}

function viewInDirection(r, c, dir) {
  const v = data[r][c];
  let view = 0;
  loopDirection(r, c, dir, (nr, nc) => {
    view++;
    return data[nr][nc] < v;
  });
  return view;
}

function solve2() {
  return Math.max(...data
    .flatMap((row, r) => row
      .map((v, c) => DIRECTIONS_SQUARE.map((dir) => viewInDirection(r, c, dir)).reduce((a, b) => a * b, 1))));
}

timedLog('Part 1:', solve1());
timedLog('Part 2:', solve2());
