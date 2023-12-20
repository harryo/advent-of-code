import { readBlocks } from '../../helpers/readInput/index.js';
import timedLog from '../../helpers/timedLog.js';
import Heap from '../../helpers/Heap.js';

const data = readBlocks();

const categories = 'xmas'.split('');

function parseStep(str) {
  const parts = str.split(':');
  if (parts.length === 1) {
    return { dest: str };
  }
  const match = /(\w)([<>])(\d+)/.exec(parts[0]);
  const [cat, op, val] = match.slice(1);
  return {
    cat,
    op,
    val: parseInt(val, 10),
    dest: parts[1],
  };
}
const workflows = {};
data[0].split(/\n/).forEach((line) => {
  const match = /(\w+)\{(.*)\}/.exec(line);
  const id = match[1];
  const steps = match[2].split(',').map(parseStep);
  workflows[id] = steps;
});

const parts = data[1].split(/\n/).map((line) => {
  const props = {};
  Array.from(line.matchAll(/(\w)=(\d+)/g)).forEach((match) => {
    props[match[1]] = parseInt(match[2], 10);
  });
  return props;
});
timedLog('Preparation');

function processPart(part) {
  let workflow = 'in';
  while (!('AR'.includes(workflow))) {
    const nextStep = workflows[workflow].find((step) => {
      if (step.cat) {
        // eslint-disable-next-line default-case
        switch (step.op) {
          case '<':
            return part[step.cat] < step.val;
          case '>':
            return part[step.cat] > step.val;
        }
      }
      return true;
    });
    workflow = nextStep.dest;
  }
  return workflow === 'A';
}

function solve1() {
  return parts.filter(processPart).flatMap((p) => Object.values(p)).reduce((a, b) => a + b, 0);
}

function countCombinations(limits, workflow) {
  if (workflow === 'A') {
    return categories.map((cat) => limits[cat][1] - limits[cat][0] + 1).reduce((a, b) => a * BigInt(b), 1n);
  }
  if (workflow === 'R') {
    return 0n;
  }
  const steps = workflows[workflow];
  let newLimits = { ...limits };
  return steps.map((step) => {
    if (!newLimits) {
      return 0n;
    }
    const {
      cat, op, val, dest,
    } = step;
    if (!cat) {
      return countCombinations(newLimits, dest);
    }
    const [min, max] = newLimits[cat];
    let testLimits;
    if (op === '<') {
      testLimits = { ...newLimits, [cat]: [min, Math.min(val - 1, max)] };
      newLimits[cat] = [Math.max(val, min), max];
    } else {
      testLimits = { ...newLimits, [cat]: [Math.max(val + 1, min), max] };
      newLimits[cat] = [min, Math.min(val, max)];
    }
    if (newLimits[cat][0] > newLimits[cat][1]) {
      newLimits = null;
    }
    return testLimits[cat][0] > testLimits[cat][1] ? 0n : countCombinations(testLimits, dest);
  }).reduce((a, b) => a + b, 0n);
}

function solve2() {
  const limits = {};
  categories.forEach((cat) => {
    limits[cat] = [1, 4000];
  });
  return countCombinations(limits, 'in');
}

timedLog('Part 1:', solve1());
timedLog('Part 2:', solve2());
