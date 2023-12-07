import { readLines } from '../../helpers/readInput/index.js';
import timedLog from '../../helpers/timedLog.js';

const data = readLines();

const symbolRe = new RegExp(/[^\d.]/);

function findRe(re) {
  const result = [];
  data.forEach((line, idx) => {
    let os = 0;
    let match;
    do {
      match = line.slice(os).match(re);
      if (match) {
        result.push({ value: match[2], line: idx, col: os + match[1].length, len: match[2].length });
        os += match[0].length;
      }
    } while (match);
  });
  return result;
}


function findNumbers() {
  return findRe(/(\D*)(\d+)/).map(({ value, ...rest }) => ({ nr: Number(value), ...rest }));
}

const numbers = findNumbers();

function findGears() {
  return findRe(/([^*]*)(\*)/);
}


timedLog('Preparation');

function solve1() {
  function isValid({ nr, line, col, len}) {
    const linesAround = data.slice(Math.max(0,line - 1), line + 2);
    const stringsAround = linesAround.map(l => l.slice(Math.max(0, col - 1), col + len + 1));
    const valid =  stringsAround.some(c => symbolRe.test(c));
    return valid;
  }
    return numbers.filter(isValid).reduce((sum, { nr }) => sum + nr, 0);
}

function solve2() {
  const gears = findGears();
  function isValid({ line, col }) {
    const adjacentNumbers = numbers
      .filter(({ line: l, col: c, len }) => Math.abs(line - l) <= 1 && c - 1 <= col && c + len >= col);
    if (adjacentNumbers.length !== 2) {
      return 0;
    }
    return adjacentNumbers[0].nr * adjacentNumbers[1].nr;
  };
  return gears.reduce((sum, v) => sum + isValid(v), 0);
}

timedLog('Part 1:', solve1());
timedLog('Part 2:', solve2());
