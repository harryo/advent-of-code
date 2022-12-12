const readMatrix = require('../../helpers/readMatrix');
const timedLog = require('../../helpers/timedLog');
const { getAdjacent, DIRECTIONS_SQUARE } = require('../../helpers/getAdjacent');

const matrix = readMatrix();
const posList = matrix.flat();

timedLog('Preparation');

function getElevation(ch) {
  switch (ch) {
    case 'S':
      return getElevation('a');
    case 'E':
      return getElevation('z');
    default:
      return ch.charCodeAt(0) - 'a'.charCodeAt(0);
  }
}

function traverse(p0) {
  const testPaths = [{ pos: p0, length: 0 }];
  const checkedPoints = new Set([]);
  let testPtr = 0;
  while (testPtr < testPaths.length) {
    const { pos, length } = testPaths[testPtr++];
    if (checkedPoints.has(pos) || (length === 1 && pos.ch === 'a' && p0.ch === 'a')) {
      // eslint-disable-next-line no-continue
      continue;
    }
    if (pos.ch === 'E') {
      return length;
    }
    checkedPoints.add(pos);
    const maxElevation = getElevation(pos.ch) + 1;
    const neighbours = getAdjacent(pos, matrix, DIRECTIONS_SQUARE)
      .filter((p) => getElevation(p.ch) <= maxElevation)
      .map((p) => ({ pos: p, length: length + 1 }));
    testPaths.push(...neighbours);
  }
  return Infinity;
}

function solve1() {
  return traverse(posList.find((p) => p.ch === 'S'));
}

function solve2() {
  return Math.min(...posList.filter((p) => getElevation(p.ch) === 0).map((traverse)));
}

timedLog('Part 1:', solve1());
timedLog('Part 2:', solve2());
