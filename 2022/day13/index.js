const readBlocks = require('../../helpers/readBlocks');
const timedLog = require('../../helpers/timedLog');

const pairs = readBlocks().map((block) => block.split(/\n/).map((l) => JSON.parse(l)));
const packets = pairs.flat();

function compare(a, b) {
  if (typeof a === 'number') {
    if (typeof b === 'number') {
      return Math.sign(b - a);
    }
    return compare([a], b);
  }
  if (typeof b === 'number') {
    return compare(a, [b]);
  }
  const len = Math.min(a.length, b.length);
  for (let i = 0; i < len; i++) {
    const cmp = compare(a[i], b[i]);
    if (cmp !== 0) {
      return cmp;
    }
  }
  return compare(a.length, b.length);
}

function findPos(packet) {
  return packets.filter((p) => compare(p, packet) === 1).length + 1;
}

timedLog('Preparation');

function solve1() {
  return pairs
    .map(([a, b]) => compare(a, b) === 1)
    .reduce((s, v, i) => (v ? s + i + 1 : s), 0);
}

function solve2() {
  const p1 = JSON.parse('[[2]]');
  const p2 = JSON.parse('[[6]]');
  packets.push(p1, p2);
  const idx1 = findPos(p1);
  const idx2 = findPos(p2);
  return idx1 * idx2;
}

timedLog('Part 1:', solve1());
timedLog('Part 2:', solve2());
