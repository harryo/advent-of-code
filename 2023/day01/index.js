import { readLines } from '../../helpers/readInput/index.js';
import timedLog from '../../helpers/timedLog.js';

const data = readLines();

timedLog('Preparation');

const numbers = {
  one: 1,
  two: 2,
  three: 3,
  four: 4,
  five: 5,
  six: 6,
  seven: 7,
  eight: 8,
  nine: 9,
};

function solve1() {
  const sum = data.reduce((acc, line) => {
    const value = Number(line.replace(/^\D*(\d).*$/, '$1') + line.replace(/^.*(\d)\D*$/, '$1'));
    return acc + value;
  }, 0);
  return sum;
}

function solve2() {
  const coreStr = `(${Object.keys(numbers).join('|')}|\\d)`;
  const sum = data.reduce((acc, line) => {
    const re = [new RegExp(`^\\D*?${coreStr}`), new RegExp(`^.*${coreStr}`)];
    const valStrings = re.map((r) => r.exec(line));
    const values = valStrings.map((v) => numbers[v[1]] ?? v[1]);
    return acc + Number(values.join(''));
  }, 0);
  return sum;
}

timedLog('Part 1:', solve1());
timedLog('Part 2:', solve2());
