import { readLines } from '../../helpers/readInput/index.js';
import timedLog from '../../helpers/timedLog.js';

const data = readLines().map((l) => l.split(/\s+/).map(Number));

function last(list) {
  return list[list.length - 1];
}

function diff(list) {
  return list.slice(1).map((v, i) => v - list[i]);
}

function diffDown(list) {
  const result = [];
  let lastDiff = list;
  while (lastDiff.some((v) => v !== 0)) {
    result.push(lastDiff);
    lastDiff = diff(lastDiff);
  }
  return result;
}

timedLog('Preparation');

function solve1() {
  function extrapolate(list) {
    const diffList = diffDown(list);
    while (diffList.length > 1) {
      const d = last(diffList.pop());
      const prev = diffList.pop();
      diffList.push([...prev, last(prev) + d]);
    }
    return last(diffList[0]);
  }

  const expanded = data.map(extrapolate);
  return expanded.reduce((sum, v) => sum + v, 0);
}

function solve2() {
  function extrapolate(list) {
    const diffList = diffDown(list);
    while (diffList.length > 1) {
      const d = diffList.pop()[0];
      const prev = diffList.pop();
      diffList.push([prev[0] - d, ...prev]);
    }
    return diffList[0][0];
  }

  const expanded = data.map(extrapolate);
  return expanded.reduce((sum, v) => sum + v, 0);
}

timedLog('Part 1:', solve1());
timedLog('Part 2:', solve2());
