const readLines = require('../../helpers/readLines');
const timedLog = require('../../helpers/timedLog');
const loop = require('../../helpers/loop');

const moves = readLines().map((line) => line.split(' ')).map((a) => ({ dir: a[0], dist: Number(a[1]) }));
const dirs = {
  U: [0, 1],
  D: [0, -1],
  L: [-1, 0],
  R: [1, 0],
};
const s = [0, 0];

function init(size) {
  return {
    rope: new Array(size).fill(s),
    visited: new Set([s.toString()]),
  };
}

function makeStep(pos, step) {
  return [pos[0] + step[0], pos[1] + step[1]];
}

function follow(H, T) {
  const d = [H[0] - T[0], H[1] - T[1]];
  if (Math.abs(d[0]) <= 1 && Math.abs(d[1]) <= 1) {
    return T;
  }
  const step = [Math.sign(d[0]), Math.sign(d[1])];
  return makeStep(T, step);
}

function makeMove(state, { dir, dist }) {
  // eslint-disable-next-line prefer-const
  let { rope, visited } = state;
  loop(dist, () => {
    let lastKnot;

    rope = rope.map((knot, i) => {
      lastKnot = (i === 0
        ? makeStep(knot, dirs[dir])
        : follow(lastKnot, knot));
      return lastKnot;
    });
    visited.add(rope[rope.length - 1].toString());
  });
  // console.log(`\nMove ${dir} ${dist}\n${printRope(rope, 6, 5)}\n`);
  return { rope, visited };
}

// eslint-disable-next-line no-unused-vars
function printRope(rope, sx = 5, sy = 5) {
  const maxY = Math.max(...rope.map(([x, y]) => y), sy);
  const maxX = Math.max(...rope.map(([x, y]) => x), sx);
  const result = new Array(maxY).fill(null).map(() => new Array(maxX).fill('.'));
  rope.forEach(([x, y], i) => {
    result[y][x] = i || 'H';
  });
  return result.reverse().map((line) => line.join('')).join('\n');
}
timedLog('Preparation');

function solve1() {
  const { visited } = moves.reduce(makeMove, init(2));
  return visited.size;
}

function solve2() {
  const { visited } = moves.reduce(makeMove, init(10));
  return visited.size;
}

timedLog('Part 1:', solve1());
timedLog('Part 2:', solve2());
