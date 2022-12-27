const { readMatrix } = require('../../helpers/readInput');
const timedLog = require('../../helpers/timedLog');
const { DIRECTIONS_SQUARE } = require('../../helpers/getAdjacent');

const ALLMOVES = [[0, 0], ...DIRECTIONS_SQUARE];
const data = readMatrix();
const HEIGHT = data.length;
const WIDTH = data[0].length;
const BLZ_CHARS = '^v<>';

function blizzardMove(blz) {
  // eslint-disable-next-line prefer-const
  let { r, c, ch } = blz;
  switch (ch) {
    case '^':
      r -= 1;
      if (r === 0) r = HEIGHT - 2;
      break;
    case 'v':
      r += 1;
      if (r === HEIGHT - 1) r = 1;
      break;
    case '<':
      c -= 1;
      if (c === 0) c = WIDTH - 2;
      break;
    case '>':
      c += 1;
      if (c === WIDTH - 1) c = 1;
      break;
    default:
  }
  return { r, c, ch };
}

function addDir(pos, dir) {
  const result = [pos[0] + dir[0], pos[1] + dir[1]];
  return result;
}

function print(pos, blz) {
  const result = data.map((row) => row.map((col) => (col.ch === '#' ? '#' : '.')));
  result[pos[0]][pos[1]] = 'E';
  blz.forEach((b) => {
    result[b.r][b.c] = b.ch;
  });
  console.log(result.map((r) => r.join('')).join('\n'));
}

function findPath(targets) {
  const heap = [];
  const done = new Set();
  let pos = [0, 1];
  let t = 0;
  const blizzards = data.flat().filter((d) => BLZ_CHARS.includes(d.ch));
  let tBlz = 0;

  function allMoves() {
    return ALLMOVES
      .map((dir) => addDir(pos, dir))
      .filter((newPos) => {
        if (done.has(newPos.join(','))) {
          return false;
        }
        const [r, c] = newPos;
        const org = data[r] && data[r][c];
        return org && org.ch !== '#' && blizzards.every((b) => b.r !== r || b.c !== c);
      });
  }

  function addMove(move) {
    done.add(move.join(','));
    heap.push({ pos: move, t });
  }

  targets.forEach((target) => {
    heap.length = 0;
    done.clear();

    while (pos[0] !== target) {
      const key = [t, ...pos].join(',');
      done.add(key);
      t++;
      if (t > tBlz) {
        done.clear();
        console.log('Step', t, heap.length);
        blizzards.forEach((blz, i) => {
          blizzards[i] = blizzardMove(blz);
        });
        tBlz += 1;
      }
      // print(pos, blizzards);
      const moves = allMoves(pos, blizzards);
      moves.forEach(addMove);
      const current = heap.shift();
      pos = current.pos;
      t = current.t;
    }
  });
  return t;
}

timedLog('Preparation');

function solve1() {
  return findPath([HEIGHT - 1]);
}

function solve2() {
  return findPath([HEIGHT - 1, 0, HEIGHT - 1]);
}

timedLog('Part 1:', solve1());
timedLog('Part 2:', solve2());
