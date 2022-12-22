/* eslint-disable no-param-reassign */
const { readLines } = require('../../helpers/readInput');
const timedLog = require('../../helpers/timedLog');

const data = readLines();

function getMonkeys() {
  const result = {};
  data.forEach((line) => {
    const [name, op1, op, op2] = line.split(/:? /);
    const base = { name, line, pending: op ? 2 : 0 };
    result[name] = op
      ? { ...base, ops: [op1, op2], op }
      : { ...base, value: Number(op1) };
  });
  return result;
}

// Index to find the monkeys that can possibly be resolved when this monkey is resolved
function makeIndex(monkeys) {
  const result = {};
  Object.values(monkeys)
    .filter((m) => m.pending > 0)
    .forEach((m) => {
      m.ops.forEach((op, i) => {
        result[op] = result[op] || [];
        result[op].push({ monkey: m, index: i });
      });
    });
  return result;
}

timedLog('Preparation');

const operators = {
  '+': (a, b) => a + b,
  '/': (a, b) => a / b,
  '*': (a, b) => a * b,
  '-': (a, b) => a - b,
};

function parseOps(ops) {
  const idx = ops.findIndex((o) => typeof o === 'number');
  const value = ops[idx];
  const arr = ops[1 - idx];
  return { value, valueFirst: idx === 0, arr };
}

function getValue(monkey) {
  const { op, ops } = monkey;
  if (ops.every((o) => typeof o === 'number')) {
    return operators[op](...ops);
  }
  // For part two, an array is passed with the operators to be applied, unshift this one
  const { value, valueFirst, arr } = parseOps(ops);
  return [{ op, value, valueFirst }, ...arr];
}

// Resolve one of the operands of the monkey with value
function resolveOp(monkey, index, value) {
  monkey.ops[index] = value;
  monkey.pending--;
  if (monkey.pending > 0) {
    return false;
  }
  monkey.value = getValue(monkey);
  return true;
}

// Solve by iteratively applying the resolved monkey values to dependant monkeys
function solve(monkeys) {
  const index = makeIndex(monkeys);
  let justResolved = Object.values(monkeys)
    .filter((m) => m.pending === 0);

  function applySolved(monkey) {
    const usedBy = index[monkey.name];
    if (!usedBy) {
      return [];
    }
    return usedBy
      .filter((o) => resolveOp(o.monkey, o.index, monkey.value))
      .map((o) => o.monkey);
  }
  while (justResolved.length > 0) {
    const result = justResolved.flatMap(applySolved);
    justResolved = result;
  }
}

// Find input value that produces the given output
function reducer(acc, cur) {
  const { op, value, valueFirst } = cur;
  switch (op) {
    case '+':
      // result + value = acc
      return acc - value;
    case '*':
      // result * value = acc
      return acc / value;
    case '-':
      // valueFirst ? value - result = acc : result - value = acc
      return valueFirst ? value - acc : value + acc;
    case '/':
      // valueFirst ? value / result = acc : result / value = acc
      return valueFirst ? value / acc : value * acc;
    default:
      throw new Error(`Unknown op ${op}`);
  }
}

function solve1() {
  const monkeys = getMonkeys();
  solve(monkeys);
  return monkeys.root.value;
}

function solve2() {
  const monkeys = getMonkeys();
  monkeys.root.op = '=';
  monkeys.humn.value = []; // Accumulate operators to be applied
  solve(monkeys);
  const { value, arr } = parseOps(monkeys.root.ops);
  return arr.reduce(reducer, value);
}

timedLog('Part 1:', solve1());
timedLog('Part 2:', solve2());
