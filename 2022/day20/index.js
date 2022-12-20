const { readLines } = require('../../helpers/readInput');
const timedLog = require('../../helpers/timedLog');
const loop = require('../../helpers/loop');

const data = readLines().map(Number);
const size = data.length - 1; // Size of row without the moving element

function moveItem(obj, list) {
  const curPos = list.indexOf(obj);
  let newPos = (curPos + obj.v) % size;
  if (newPos <= 0) {
    newPos += size;
  }
  list.splice(curPos, 1);
  list.splice(newPos, 0, obj);
}

timedLog('Preparation');

function solve1() {
  const orgList = data.map((v, i) => ({ v, i }));
  const result = orgList.slice(0);
  orgList.forEach((o) => moveItem(o, result));
  const origin = result.findIndex((o) => o.v === 0);
  return [1, 2, 3].map((i) => result[(i * 1000 + origin) % (size + 1)].v).reduce((a, b) => a + b, 0);
}

function solve2() {
  const orgList = data.map((v, i) => ({ v: v * 811589153, i }));
  const result = orgList.slice(0);
  loop(10, () => orgList.forEach((o) => moveItem(o, result)));
  const origin = result.findIndex((o) => o.v === 0);
  return [1, 2, 3].map((i) => result[(i * 1000 + origin) % (size + 1)].v).reduce((a, b) => a + b, 0);
}

timedLog('Part 1:', solve1());
timedLog('Part 2:', solve2());
