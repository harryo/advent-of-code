import { readLines } from '../../helpers/readInput/index.js';
import timedLog from '../../helpers/timedLog.js';

const data = readLines();

let count = 0;
function isValid(str, groups) {
  const g = Array.from(str.matchAll(/#+/g));
  return g.length === groups.length && g.every((m, i) => m[0].length === groups[i]);
}

function makeRegex(groups) {
  return new RegExp(`^[\\?\\.]*${groups.map((g) => `[\\?\\#]{${g}}`).join('[\\?\\.]+')}[\\?\\.]*$`);
}

function mayBeValid(str, groups) {
  const g = Array.from(str.matchAll(/#+/g));
  if (g.length > groups.length) {
    return false;
  }
  if (g.every((m, i) => m[0].length === groups[i])) {
    return true;
  }
  const canExtend = str.endsWith('#');
  const lastIndex = g.length - 1;
  return canExtend && g[lastIndex][0].length <= groups[lastIndex];
}

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

function findOptions(tpl, re) {
  const pos = tpl.indexOf('?');
  if (pos === -1) {
    return [tpl];
  }
  if (!re.test(tpl)) {
    return [];
  }
  const s1 = tpl.slice(0, pos);
  const s2 = tpl.slice(pos + 1);
  return ['.', '#'].flatMap((c) => findOptions(`${s1}${c}${s2}`, re));
}

function countOptions({ tpl, groups }) {
  const re = makeRegex(groups);
  const options = findOptions(tpl, re);
  const validOptions = options.filter((o) => isValid(o, groups));
  count++;
  console.log('Count', count, validOptions.length);
  return validOptions.length;
}

timedLog('Preparation');

function solve1() {
  count = 0;
  // return data.map(parseLine).map(countOptions).reduce((a, b) => a + b, 0);
}

function solve2() {
  count = 0;
  return data.map(parseLine2).slice(4, 5).map(countOptions).reduce((a, b) => a + b, 0);
}

timedLog('Part 1:', solve1());
timedLog('Part 2:', solve2());
