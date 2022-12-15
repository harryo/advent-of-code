const getNumbers = require('../../helpers/getNumbers');
const { readLines } = require('../../helpers/readInput');
const timedLog = require('../../helpers/timedLog');

const data = readLines().map(getNumbers);

const sensors = data.map(([x, y, bx, by]) => ({ x, y, d: Math.abs(bx - x) + Math.abs(by - y) }));
const beacons1 = data.map(([,, x, y]) => ({ x, y }));
const beacons = Array.from(new Set(beacons1.map((b) => JSON.stringify(b)))).map(JSON.parse);

const sampleSize = 20;
const inputSize = 4000000;
const size = process.argv[2] === 'sample.txt' ? sampleSize : inputSize;

function forRange(base, dif, limit, cb) {
  if (dif < 0) {
    return;
  }
  let iMin = base - dif;
  let iMax = base + dif;
  if (limit) {
    iMin = Math.max(iMin, 0);
    iMax = Math.min(iMax, size);
  }
  for (let i = iMin; i <= iMax; i++) {
    cb(i);
  }
}

function findBlocked(y0, limit) {
  const result = new Set();
  sensors.forEach((s) => {
    const { x, y, d } = s;
    const dy = Math.abs(y - y0);
    forRange(x, d - dy, limit, (i) => result.add(i));
  });
  return result;
}

function countBlocked(y) {
  const blocked = findBlocked(y);
  beacons.filter((b) => b.y === y).forEach((b) => blocked.delete(b.x));
  return blocked.size;
}

function insertRange(ranges, min, max) {
  // Find index of first ranges with max >= min - 1
  const below = ranges.filter((r) => r[1] < min - 1);
  const merge = ranges.filter((r) => r[1] >= min - 1 && r[0] <= max + 1);
  const above = ranges.filter((r) => r[0] > max + 1);
  const insert = merge.length === 0 ? [min, max]
    : [Math.min(min, merge[0][0]), Math.max(max, merge[merge.length - 1][1])];
  return [...below, insert, ...above];
}

function findBlockedRanges() {
  const result = Array(size + 1).fill([]);
  sensors.forEach((s, idx) => {
    console.log('Sensor', idx);
    const { x, y, d } = s;
    forRange(y, d, true, (i) => {
      const dx = d - Math.abs(y - i);
      result[i] = insertRange(result[i], Math.max(0, x - dx), Math.min(x + dx, size));
    });
  });
  return result;
}

timedLog('Preparation');

function solve1() {
  return countBlocked(size / 2);
}

function solve2() {
  const rowsMinMax = findBlockedRanges();
  const openY = rowsMinMax.findIndex((ranges) => ranges.length > 1 || ranges[0][0] > 0 || ranges[0][1] < size);
  if (openY === -1) {
    return 'Not found';
  }
  let openX = rowsMinMax[openY][0][1] + 1;
  if (openX > size) {
    openX = 0;
  }
  return openX * inputSize + openY;
}

timedLog('Part 1:', solve1());
timedLog('Part 2:', solve2());
