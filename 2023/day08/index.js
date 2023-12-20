/* eslint-disable no-continue */
import { readLines } from '../../helpers/readInput/index.js';
import timedLog from '../../helpers/timedLog.js';
import findLeastCommonMultiple from '../../helpers/leastCommonMultiple.js';

const data = readLines();
const [directions, ...rest] = data;
const len = directions.length;
const nodes = {};
rest.forEach((line) => {
  const [key, L, R] = Array.from(line.matchAll(/\w+/g)).map((o) => o[0]);
  nodes[key] = { L, R };
});

function step(node, i) {
  const dir = directions[i % len];
  return nodes[node][dir];
}

timedLog('Preparation');

function travelSteps(startNode, i0 = 0) {
  let i = i0;
  let node = startNode;
  do {
    node = step(node, i++);
  } while (!node.endsWith('Z'));
  return [i, node];
}

function solve1() {
  const node = Object.keys(nodes).find((s) => s.endsWith('A'));
  return travelSteps(node)[0];
}

function findLoop(startNode) {
  let i = 0;
  let node = startNode;
  const endPoints = [];
  let prev;
  do {
    [i, node] = travelSteps(node, i);
    // eslint-disable-next-line no-loop-func
    prev = endPoints.find((pt) => pt.node === node && (i - pt.i) % len === 0);
    if (!prev) {
      endPoints.push({ i, node });
    }
  } while (!prev);
  return endPoints.map((pt) => [pt.i, i - prev.i]);
}

function shared(a, b) {
  let [iA, repA] = a;
  let [iB, repB] = b;
  const lcm = findLeastCommonMultiple(repA, repB);
  const gcd = (repA * repB) / lcm;
  if (Math.abs(iA - iB) % gcd !== 0) {
    return null;
  }
  while (iA !== iB) {
    if (iA < iB) {
      iA += repA;
    } else {
      iB += repB;
    }
  }
  return [iA, findLeastCommonMultiple(repA, repB)];
}

function findCommon(listA, listB) {
  const result = listA.flatMap((a) => listB.map((b) => shared(a, b))).filter(Boolean);
  return result;
}

function solve2() {
  const nodeList = Object.keys(nodes).filter((s) => s.endsWith('A'));
  let results;
  nodeList.forEach((node) => {
    const loop = findLoop(node);
    results = results ? findCommon(results, loop) : loop;
  });
  return Math.min(...results.map((o) => o[0]));
}

timedLog('Part 1:', solve1());
timedLog('Part 2:', solve2());
