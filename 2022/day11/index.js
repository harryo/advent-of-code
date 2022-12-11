/* eslint-disable no-param-reassign */
const readBlocks = require('../../helpers/readBlocks');
const timedLog = require('../../helpers/timedLog');
const loop = require('../../helpers/loop');

function getMonkeys() {
  return readBlocks().map(parseMonkey);
}

function getOperation(str) {
  if (str.endsWith('= old * old')) {
    return (v) => v * v;
  }
  const match = str.match(/= old (\S) (\d+)/);
  if (!match) {
    throw new Error(`Unknown operation: ${str}`);
  }
  switch (match[1]) {
    case '+': return (v) => v + Number(match[2]);
    case '-': return (v) => v - Number(match[2]);
    case '*': return (v) => v * Number(match[2]);
    default: throw new Error(`Unknown operation: ${str}`);
  }
}

function parseMonkey(blk) {
  const lines = blk.split(/\n/);
  const result = { count: 0 };
  lines.forEach((line) => {
    const [label, value] = line.split(':').map((s) => s.trim());
    const key = label.split(' ').pop().toLowerCase();
    const numbers = value.match(/\d+/g)?.map(Number);
    switch (key) {
      case 'items':
        result[key] = numbers;
        return;
      case 'operation':
        result.operation = getOperation(value);
        return;
      case 'test':
      case 'true':
      case 'false':
        [result[key]] = numbers;
        return;
      default:
        result.name = label;
    }
  });
  return result;
}

function fullRound(monkeys, ggd) {
  monkeys.forEach((monkey) => {
    const {
      items, operation, test, true: trueValue, false: falseValue,
    } = monkey;
    items.forEach((item) => {
      monkey.count++;
      const newValue = operation(item);
      const reducedValue = ggd ? newValue % ggd : Math.floor(newValue / 3);
      const recipient = reducedValue % test === 0 ? trueValue : falseValue;
      monkeys[recipient].items.push(reducedValue);
    });
    monkey.items = [];
  });
}

timedLog('Preparation');

function solve1() {
  const monkeys = getMonkeys();
  loop(20, () => fullRound(monkeys));
  return monkeys.map((m) => m.count).sort((a, b) => b - a).slice(0, 2).reduce((a, b) => a * b, 1);
}

function solve2() {
  const monkeys = getMonkeys();
  const ggd = monkeys.reduce((a, b) => a * b.test, 1);
  loop(10000, () => fullRound(monkeys, ggd));
  return monkeys.map((m) => m.count).sort((a, b) => b - a).slice(0, 2).reduce((a, b) => a * b, 1);
}

timedLog('Part 1:', solve1());
timedLog('Part 2:', solve2());
