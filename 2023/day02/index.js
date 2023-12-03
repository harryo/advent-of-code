import { readLines } from '../../helpers/readInput/index.js';
import timedLog from '../../helpers/timedLog.js';

const colors = ['red', 'green', 'blue'];

const data = readLines().map(parseLine);

function parseLine(line) {
  const [game, ...rest] = line.split(/[:;]\s+/);
  const id = Number(game.replace(/^Game (\d+)$/, '$1'));
  const sets  = rest.map((s) => s.split(', ').reduce((acc, str) => { 
    const [value, color] = str.split(' ');
    acc[color] = Number(value);
    return acc;
  }, {}));
  return { id, sets }
}

const bag = {
  red: 12,
  green: 13,
  blue: 14,
}

timedLog('Preparation');

function solve1() {
  return data.reduce((sum, { id, sets }) => {
    const valid = sets.every((set) => colors.every((color) => (set[color] ?? 0) <= bag[color]));
    return sum + (valid ? id : 0);
  }, 0);  
}

function solve2() {
  return data.reduce((sum, { id, sets }) => {
    const maxValues = colors.map((color) => Math.max(...sets.map((set) => set[color] ?? 0)));
    sum += maxValues.reduce((prod, val) => prod * val, 1);
    return sum;
  }, 0);  
}

timedLog('Part 1:', solve1());
timedLog('Part 2:', solve2());
