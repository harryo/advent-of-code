import { readBlocks } from '../../helpers/readInput/index.js';
import timedLog from '../../helpers/timedLog.js';

const data = readBlocks();

const map = data[0].split(/\n/);
const path = Array.from(data[1].matchAll(/(\d+)(\D)?/g)).flatMap((m) => [Number(m[1]), m[2]]).filter(Boolean);

const SIZE = process.argv[2] === 'sample.txt' ? 4 : 50;

console.log(map.length, map[0].length);

const DIRECTIONS = [
  [0, 1], // right
  [1, 0], // down
  [0, -1], // left
  [-1, 0], // up
];

const TURNS = { R: 1, L: -1 };

const RIGHT = 1;
const PREV = 2;

function makeTurn(dir, turn) {
  return (dir + turn + 4) % 4;
}

const offLimits = (ch) => ch === undefined || ch === ' ';

function charAt(pos) {
  const [r, c] = pos;
  return map[r]?.[c];
}

function getNextPos(pos, dir, rot = 0) {
  const [r, c] = pos;
  const [dr, dc] = DIRECTIONS[makeTurn(dir, rot)];
  return [r + dr, c + dc];
}

function findAroundCube(pos, dir) {
  const [r, c] = pos;
  const key = `${SIZE},${Math.floor(r / SIZE)},${Math.floor(c / SIZE)},${dir}`;
  const rm = r % SIZE;
  const cm = c % SIZE;
  switch (key) {
    case '4,1,2,0':
      return [[2 * SIZE, 4 * SIZE - 1 - rm], 1];
    case '4,2,2,1':
      return [[2 * SIZE - 1, SIZE - 1 - cm], 3];
    case '4,1,1,3':
      return [[cm, 2 * SIZE], 0];
    case '50,2,0,2':
      return [[SIZE - rm - 1, SIZE], 0];
    case '50,2,0,3':
      return [[SIZE + cm, SIZE], 0];
    case '50,0,1,2':
      return [[3 * SIZE - rm - 1, 0], 0];
    case '50,0,1,3':
      return [[3 * SIZE + cm, 0], 0];
    case '50,1,1,2':
      return [[2 * SIZE, rm], 1];
    case '50,3,0,2':
      return [[0, SIZE + rm], 1];
    case '50,3,0,1':
      return [[0, 3 * SIZE - cm - 1], 1];
    case '50,2,1,0':
      return [[SIZE - rm - 1, 3 * SIZE - 1], 2];
    case '50,0,2,1':
      return [[SIZE + cm, 2 * SIZE - 1], 2];
    case '50,0,2,0':
      return [[3 * SIZE - rm - 1, 2 * SIZE - 1], 2];
    case '50,2,1,1':
      return [[3 * SIZE + cm, SIZE - 1], 2];
    case '50,0,2,3':
      return [[4 * SIZE - 1, SIZE - cm - 1], 3];
    case '50,3,0,0':
      return [[3 * SIZE - 1, SIZE + rm], 3];
    case '50,1,1,0':
      return [[SIZE - 1, 2 * SIZE + rm], 3];
    default:
      console.log(key);
      debugger; // Write to mapping
  }
  return null;
}

function makeSteps(pos, dir, steps, part) {
  let newPos = pos;
  for (let i = 0; i < steps; i++) {
    let nextPos = getNextPos(newPos, dir);
    if (offLimits(charAt(nextPos))) {
      if (part === 1) {
        nextPos = newPos;
        while (!offLimits(charAt(nextPos))) {
          nextPos = getNextPos(nextPos, dir, PREV);
        }
        nextPos = getNextPos(nextPos, dir);
      } else {
        // console.log('walking', nextPos.toString(), dir);
        const aroundCube = findAroundCube(newPos, dir);
        // console.log('aroundCube', aroundCube?.flat().toString());
        if (charAt(aroundCube[0]) === '#') {
          break;
        }
        return makeSteps(...aroundCube, steps - i - 1, part);
      }
    }
    if (charAt(nextPos) === '#') {
      break;
    }
    newPos = nextPos;
  }
  return [newPos, dir];
}

function travel(part) {
  let pos = [0, map[0].indexOf('.')];
  let dir = 0;
  path.forEach((step, i) => {
    // console.log(i, step, pos.toString(), dir);
    if (typeof step === 'string') {
      dir = makeTurn(dir, TURNS[step]);
    } else {
      [pos, dir] = makeSteps(pos, dir, step, part);
    }
  });
  return { pos, dir };
}

timedLog('Preparation');

function solve1() {
  const { pos, dir } = travel(1);
  const [r, c] = pos;
  return (r + 1) * 1000 + (c + 1) * 4 + dir;
}

function solve2() {
  const { pos, dir } = travel(2);
  const [r, c] = pos;
  return (r + 1) * 1000 + (c + 1) * 4 + dir;
}

timedLog('Part 1:', solve1());
timedLog('Part 2:', solve2());
