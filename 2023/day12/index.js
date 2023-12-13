import { readLines } from '../../helpers/readInput/index.js';
import timedLog from '../../helpers/timedLog.js';

const data = readLines();

let count = 0;

function parseLine(line) {
  const [tpl, arc] = line.split(' ');
  const groups = arc.split(',').map(Number);
  return {
    tpl,
    groups,
  };
}

function parseLine2(line) {
  const [tpl, arc] = line.split(' ');
  const groups = (new Array(5).fill(arc).join(','))
    .split(',')
    .map(Number);
  return {
    tpl: new Array(5).fill(tpl).join('?'),
    groups,
  };
}

let cache;

function findOptions(tpl, groups) {
  const cacheKey = `${tpl}#${groups.join(',')}`;
  if (cache[cacheKey]) {
    return cache[cacheKey];
  }
  if (groups.length === 0) {
    return tpl.includes('#') ? 0 : 1;
  }
  const minLength = groups.reduce((a, b) => a + b, groups.length - 1);
  if (tpl.length < minLength) {
    return 0;
  }
  // Find first option
  const match = new RegExp(`^([\\?\\.]*?)([\\?\\#]{${groups[0]}})`).exec(tpl);
  if (!match) {
    return 0;
  }
  let nrOptions = 0;
  if (tpl.length === match[0].length) {
    nrOptions += groups.length === 1 ? 1 : 0;
  } else if (tpl[match[0].length] !== '#') {
    nrOptions += findOptions(tpl.slice(match[0].length + 1), groups.slice(1));
  }
  if (match[2].startsWith('?')) {
    nrOptions += findOptions(tpl.slice(match[1].length + 1), groups);
  }
  cache[cacheKey] = nrOptions;
  return nrOptions;
}

function countOptions({ tpl, groups }) {
  cache = {};
  const validOptions = findOptions(tpl, groups);
  count++;
  console.log('Count', count, validOptions);
  return validOptions;
}

timedLog('Preparation');

function solve1() {
  count = 0;
  return data.map(parseLine).map(countOptions).reduce((a, b) => a + b, 0);
}

function solve2() {
  count = 0;
  return data.map(parseLine2).map(countOptions).reduce((a, b) => a + b, 0);
}

timedLog('Part 1:', solve1());
timedLog('Part 2:', solve2());
