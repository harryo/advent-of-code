import { readBlocks } from '../../helpers/readInput/index.js';
import timedLog from '../../helpers/timedLog.js';
import parseInput from './parseInput.js';

const data = readBlocks();

const { seeds, maps } = parseInput(data);

function convert(from, value, curCount) {
  const { ranges, to } = maps.find((m) => m.from === from);
  let result = value;
  let nextCount = curCount;
  for (let i = 1; i < ranges.length; i++) {
    const [min] = ranges[i];
    if (value < min) {
      result += ranges[i-1][1];
      nextCount = Math.min(curCount, min - value);
      break;
    }
  }
  return [to, result, nextCount];
}

function processSeed(seed) {
  let entity = 'seed';
  let value = seed;
  let count = Infinity;
  while (entity !== 'location') {
    [entity, value, count] = convert(entity, value, count);
  }
  return [value, count];
}

timedLog('Preparation');

function solve1() {
  const locations = seeds.map(processSeed).map(([value]) => value);
  return Math.min(...locations);
}

function solve2() {
  let seed;
  let range;
  let rest = seeds;
  let result = Infinity;
  while (rest.length > 0) {
    [seed, range, ...rest] = rest;
    let testSeed = seed;
    while (testSeed < seed + range) {
      const [value, count] = processSeed(testSeed);
      if (value < result) {
        result = value;
      }
      testSeed += count;
    }
  }
  return result;
}

timedLog('Part 1:', solve1());
timedLog('Part 2:', solve2());
