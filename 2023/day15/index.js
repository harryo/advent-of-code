import { readFile } from '../../helpers/readInput/index.js';
import timedLog from '../../helpers/timedLog.js';

const data = readFile().split(',');
const boxes = new Array(256).fill(null);

timedLog('Preparation');

function hash(str) {
  return Array.from(str).reduce((s, ch) => ((s + ch.charCodeAt(0)) * 17) % 256, 0);
}

function remove(box, label) {
  if (boxes[box]?.[label]) {
    delete boxes[box][label];
  }
}

function replace(box, label, value) {
  if (!boxes[box]) {
    boxes[box] = {};
  }
  boxes[box][label] = value;
}

function focusPower(box) {
  if (!box) {
    return 0;
  }
  return Object.keys(box).reduce((sum, key, i) => sum + box[key] * (i + 1), 0);
}

function step(str) {
  const [_, label, op, value] = /(\w+)([-=])(\d*)/.exec(str);
  const box = hash(label);
  if (op === '-') {
    remove(box, label);
  } else {
    replace(box, label, parseInt(value, 10));
  }
}

function solve1() {
  return data.reduce((s, str) => s + hash(str), 0);
}

function solve2() {
  data.forEach(step);
  return boxes.reduce((s, box, i) => s + focusPower(box) * (i + 1), 0);
}

timedLog('Part 1:', solve1());
timedLog('Part 2:', solve2());
