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

function test(tpl, groups, seps, idx) {
  const str = seps.slice(0, idx).map((s, i) => '.'.repeat(s) + '#'.repeat(groups[i] ?? 0)).join('');
  return str.split('').every((c, i) => tpl[i] === '?' || tpl[i] === c);
}

function findOptions(tpl, groups, seps, idx, remaining) {
  if (!test(tpl, groups, seps, idx)) {
    return 0;
  }
  let nrOptions = 0;
  const idxSep = seps[idx];
  if (idx === seps.length - 1) {
    seps[idx] += remaining; // eslint-disable-line no-param-reassign
    nrOptions = test(tpl, groups, seps, idx + 1) ? 1 : 0;
  } else {
    for (let i = 0; i <= remaining; i++) {
      seps[idx] = idxSep + i; // eslint-disable-line no-param-reassign
      nrOptions += findOptions(tpl, groups, seps, idx + 1, remaining - i);
    }
  }
  seps[idx] = idxSep; // eslint-disable-line no-param-reassign
  return nrOptions;
}

function countOptions({ tpl, groups }) {
  const seps = new Array(groups.length + 1).fill(1);
  seps[0] = 0;
  seps[seps.length - 1] = 0;
  const remaining = tpl.length - [...seps, ...groups].reduce((a, b) => a + b, 0);
  const validOptions = findOptions(tpl, groups, seps, 0, remaining);
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
