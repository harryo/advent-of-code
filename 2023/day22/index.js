/* eslint-disable no-param-reassign */
import { readLines } from '../../helpers/readInput/index.js';
import timedLog from '../../helpers/timedLog.js';

const data = readLines();

function init() {
  const bricks = data.map((line) => line.split('~')
    .map((p) => {
      const [x, y, z] = p.split(',').map(Number);
      return { x, y, z };
    })).map((brick, idx) => {
    const [zMin, zMax] = brick.map((b) => b.z);
    const pList = [];
    for (let { x } = brick[0]; x <= brick[1].x; x++) {
      for (let { y } = brick[0]; y <= brick[1].y; y++) {
        pList.push(`${x},${y}`);
      }
    }
    return {
      zMax, zMin, pList, idx, supports: new Set(), supportedBy: new Set(),
    };
  });

  bricks.sort((a, b) => a.zMin - b.zMin);
  return { bricks, zPlane: {} };
}

function drop(brick, zPlane) {
  const { zMin, pList } = brick;
  let zLow = { z: 0, bricks: new Set() };
  pList.forEach((p) => {
    if (!zPlane[p] || zPlane[p].z < zLow.z) {
      return;
    }
    if (zPlane[p].z === zLow.z) {
      zLow.bricks.add(zPlane[p].brick);
      return;
    }
    zLow = { z: zPlane[p].z, bricks: new Set([zPlane[p].brick]) };
  });
  brick.supportedBy = zLow.bricks;
  zLow.bricks.forEach((b) => b.supports.add(brick));
  const zDiff = zMin - zLow.z - 1;
  if (zDiff > 0) {
    brick.zMin -= zDiff;
    brick.zMax -= zDiff;
  }
  pList.forEach((p) => {
    zPlane[p] = { z: brick.zMax, brick };
  });
}

timedLog('Preparation');

function solve1() {
  const { bricks, zPlane } = init();
  bricks.forEach((brick) => drop(brick, zPlane));
  const canBeDisintegrated = new Set(bricks);
  bricks.forEach((brick) => {
    if (brick.supportedBy.size === 1) {
      canBeDisintegrated.delete(brick.supportedBy.values().next().value);
    }
  });
  return canBeDisintegrated.size;
}

function countFalls(brick) {
  const potentialFalls = new Map();
  const hasFallen = [brick];
  let ptr = 0;
  while (ptr < hasFallen.length) {
    const b = hasFallen[ptr];
    b.supports.forEach((s) => {
      if (!potentialFalls.has(s)) {
        potentialFalls.set(s, new Set(s.supportedBy));
      }
      potentialFalls.get(s).delete(b);
      if (potentialFalls.get(s).size === 0) {
        hasFallen.push(s);
      }
    });
    ptr += 1;
  }
  return hasFallen.length - 1;
}

function solve2() {
  const { bricks, zPlane } = init();
  bricks.forEach((brick) => drop(brick, zPlane));
  const causeFalls = new Set();
  bricks.forEach((brick) => {
    if (brick.supportedBy.size === 1) {
      causeFalls.add(brick.supportedBy.values().next().value);
    }
  });
  let totalFalls = 0;
  causeFalls.forEach((brick) => {
    totalFalls += countFalls(brick);
  });
  return totalFalls;
}

timedLog('Part 1:', solve1());
timedLog('Part 2:', solve2());
