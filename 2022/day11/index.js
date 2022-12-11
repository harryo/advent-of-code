/* eslint-disable no-param-reassign */
const readBlocks = require('../../helpers/readBlocks');
const timedLog = require('../../helpers/timedLog');
const loop = require('../../helpers/loop');

function camelize(str) {
  return str.toLowerCase().replace(/\s+(\w)/, (m) => m[1].toUpperCase());
}

function getNumbers(str) {
  return str.match(/\d+/g)?.map(Number);
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
    const numbers = getNumbers(value);
    switch (label) {
      case 'Starting items':
        result.items = numbers;
        return;
      case 'Operation':
        result.operation = getOperation(value);
        return;
      case 'Test':
      case 'If true':
      case 'If false':
        // eslint-disable-next-line prefer-destructuring
        result[camelize(label)] = numbers[0];
        return;
      default:
        result.name = label;
    }
  });
  return result;
}

function getMonkeys() {
  return readBlocks().map(parseMonkey);
}

function fullRound(monkeys, ggd) {
  monkeys.forEach((monkey) => {
    const {
      items, operation, test, ifTrue, ifFalse,
    } = monkey;
    items.forEach((item) => {
      monkey.count++;
      const newValue = operation(item);
      // Take value modulo ggd to avoid extremely large integers in part 2
      const reducedValue = ggd ? newValue % ggd : Math.floor(newValue / 3);
      const recipient = reducedValue % test === 0 ? ifTrue : ifFalse;
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
