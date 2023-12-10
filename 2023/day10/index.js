/* eslint-disable no-param-reassign */
import { DIRECTIONS_ALL, getAdjacent } from '../../helpers/getAdjacent.js';
import { readMatrix } from '../../helpers/readInput/index.js';
import timedLog from '../../helpers/timedLog.js';

const data = readMatrix();
const rMax = data.length - 1;
const cMax = data[0].length - 1;

const list = data.flat();
let start;

list.forEach((item, i) => {
  item.index = i;
  const { r, c, ch } = item;
  switch (ch) {
    case '|': item.conn = [data[r - 1]?.[c], data[r + 1]?.[c]]; break;
    case '-': item.conn = [data[r][c - 1], data[r][c + 1]]; break;
    case 'L': item.conn = [data[r - 1]?.[c], data[r][c + 1]]; break;
    case 'J': item.conn = [data[r - 1]?.[c], data[r][c - 1]]; break;
    case '7': item.conn = [data[r + 1]?.[c], data[r][c - 1]]; break;
    case 'F': item.conn = [data[r + 1]?.[c], data[r][c + 1]]; break;
    case '.': item.conn = []; break;
    case 'S': item.conn = []; start = item; break;
    default: throw new Error('Unexpected character');
  }
});

function step(a, b) {
  return b.conn.includes(a) && b.conn.find((c) => c !== a);
}

function findRing() {
  const conn = list.filter((item) => item.conn.includes(start));
  let ring;
  conn.some((loc) => {
    ring = [start, loc];
    let next = step(start, loc);
    while (next && next !== start) {
      ring.push(next);
      next = step(...ring.slice(-2));
    }
    return next === start;
  });
  return ring;
}

timedLog('Preparation');

function solve1() {
  const ring = findRing();
  return ring.length;
}

function solve2() {
  const ring = findRing();
  let count = 0;
  let startRow;

  function handleRow(row) {
    let isInside = false;
    let charIn;

    function handleChar(ch, exp) {
      if (!charIn) {
        charIn = exp;
        return;
      }
      if (ch === charIn) {
        isInside = !isInside;
      }
      charIn = null;
    }
    row.some((loc) => {
      if (ring.includes(loc)) {
        switch (loc.ch) {
          case '|': isInside = !isInside; break;
          case 'L': handleChar(loc.ch, '7'); break;
          case 'J': handleChar(loc.ch, 'F'); break;
          case '7': handleChar(loc.ch, 'L'); break;
          case 'F': handleChar(loc.ch, 'J'); break;
          case 'S': startRow = [...row].reverse(); break;
          default: break;
        }
      } else if (isInside) {
        count++;
      }
      return loc.ch === 'S';
    });
  }

  data.forEach(handleRow);
  handleRow(startRow);
  return count;
}

timedLog('Part 1:', solve1());
timedLog('Part 2:', solve2());
