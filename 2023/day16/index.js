import { readMatrix } from '../../helpers/readInput/index.js';
import timedLog from '../../helpers/timedLog.js';

const data = readMatrix();
let mapStrings;

const UP = [-1, 0, '^'];
const DOWN = [1, 0, 'v'];
const LEFT = [0, -1, '<'];
const RIGHT = [0, 1, '>'];

const dirs = [UP, DOWN, LEFT, RIGHT];

function findDir(dir) {
  return dirs.find((d) => d[0] === dir[0] && d[1] === dir[1]);
}

timedLog('Preparation');

function beamStep(loc, dir) {
  const { r, c } = loc;
  return data[r + dir[0]]?.[c + dir[1]];
}

function divert(loc, dir) {
  switch (loc.ch) {
    case '.':
      return [dir];
    case '/': {
      const [r, c] = dir;
      return [findDir([-c, -r])];
    }
    case '\\': {
      const [r, c] = dir;
      return [findDir([c, r])];
    }
    case '|':
      return dir[1] === 0 ? [dir] : [UP, DOWN];
    case '-':
      return dir[0] === 0 ? [dir] : [LEFT, RIGHT];
    default:
      throw new Error('Invalid character');
  }
}

function mapToStrings(history = {}) {
  mapStrings = data.map((row) => row.map((cell) => {
    if (cell.ch !== '.') {
      return cell.ch;
    }
    if (!history[cell.i]) {
      return '.';
    }
    if (history[cell.i].length === 1) {
      return history[cell.i][0][2];
    }
    return (history[cell.i].length % 16).toString(16);
  }).join('').replace(/\\/g, '\u29F5'));
}

function withStart(initialBeam) {
  const history = {};
  let beams = [initialBeam];
  history[beams[0].loc.i] = [RIGHT];

  function newLocation(oldLoc, dir) {
    const loc = beamStep(oldLoc, dir);
    return { loc, dir };
  }
  while (beams.length > 0) {
    beams = beams.flatMap(({ loc, dir }) => {
      const newDirs = divert(loc, dir);
      return newDirs.map((newDir) => newLocation(loc, newDir));
    }).filter(({ loc, dir }) => {
      if (!loc) {
        return false;
      }
      if (!history[loc.i]) {
        history[loc.i] = [dir];
        return true;
      }
      if (history[loc.i].includes(dir)) {
        return false;
      }
      history[loc.i].push(dir);
      return true;
    });
  }
  return Object.values(history).length;
}

function solve1() {
  return withStart({ loc: data[0][0], dir: RIGHT });
}

function solve2() {
  const startBeams = [
    data.flatMap((row) => [{ loc: row[0], dir: RIGHT }, { loc: row[row.length - 1], dir: LEFT }]),
    data[0].map((cell) => ({ loc: cell, dir: DOWN })),
    data[data.length - 1].map((cell) => ({ loc: cell, dir: UP })),
  ].flat();
  return Math.max(...startBeams.map(withStart));
}

timedLog('Part 1:', solve1());
timedLog('Part 2:', solve2());
