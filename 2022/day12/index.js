const { readMatrix } = require('../../helpers/readInput');
const timedLog = require('../../helpers/timedLog');
const { getAdjacent, DIRECTIONS_SQUARE } = require('../../helpers/getAdjacent');
const traverse = require('../../helpers/traverse');

const matrix = readMatrix();
const posList = matrix.flat();

timedLog('Preparation', posList.length);

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

function findShortest(p0) {
  const destinations = new Set([]);
  const initialState = { pos: p0, length: 0 };
  const startsWithS = p0.ch === 'S';
  const noRepeatA = (ch) => startsWithS || ch !== 'a';
  let shortest = Infinity;
  function getNext(state) {
    const { pos, length } = state;
    if (destinations.has(pos)) {
      return [];
    }
    if (pos.ch === 'E') {
      shortest = length;
      return null;
    }
    destinations.add(pos);
    const maxElevation = getElevation(pos.ch) + 1;
    return getAdjacent(pos, matrix, DIRECTIONS_SQUARE)
      .filter((p) => getElevation(p.ch) <= maxElevation && noRepeatA(p.ch))
      .map((p) => ({ pos: p, length: length + 1 }));
  }
  traverse(initialState, getNext);
  return shortest;
}

function solve1() {
  return findShortest(posList.find((p) => p.ch === 'S'));
}

function solve2() {
  return Math.min(...posList.filter((p) => getElevation(p.ch) === 0).map((findShortest)));
}

timedLog('Part 1:', solve1());
timedLog('Part 2:', solve2());
