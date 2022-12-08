const readLines = require('../../helpers/readLines');
const timedLog = require('../../helpers/timedLog');

const data = readLines().map((line) => line.split('').map(Number));

const directions = [[0, 1], [1, 0], [0, -1], [-1, 0]];

timedLog('Preparation');

function isVisibleFromDirection(r, c, dir) {
  const v = data[r][c];
  const [dr, dc] = dir;
  let [nr, nc] = [r + dr, c + dc];
  while (nr >= 0 && nr < data.length && nc >= 0 && nc < data[0].length) {
    if (data[nr][nc] >= v) {
      return false;
    }
    nr += dr;
    nc += dc;
  }
  return true;
}

function solve1() {
  return data
    .flatMap((row, r) => row
      .filter((v, c) => directions.some((dir) => isVisibleFromDirection(r, c, dir))))
    .length;
}

function viewInDirection(r, c, dir) {
  const v = data[r][c];
  const [dr, dc] = dir;
  let [nr, nc] = [r + dr, c + dc];
  let result = 0;
  while (nr >= 0 && nr < data.length && nc >= 0 && nc < data[0].length) {
    result++;
    if (data[nr][nc] >= v) {
      break;
    }
    nr += dr;
    nc += dc;
  }
  return result;
}

function solve2() {
  return Math.max(...data
    .flatMap((row, r) => row
      .map((v, c) => directions.map((dir) => viewInDirection(r, c, dir)).reduce((a, b) => a * b, 1))));
}

timedLog('Part 1:', solve1());
timedLog('Part 2:', solve2());
