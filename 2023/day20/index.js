import { readLines } from '../../helpers/readInput/index.js';
import timedLog from '../../helpers/timedLog.js';
import Conjunction from './Conjunction.js';
import FlipFlop from './FlipFlop.js';

const data = readLines();

function init() {
  const state = {};
  const inputs = {};
  const conjunctions = [];
  data.forEach((line) => {
    const [input, output] = line.split(' -> ');
    const outputs = output.split(', ');
    if (input === 'broadcaster') {
      state.broadcaster = outputs;
      return;
    }
    const type = input[0];
    const id = input.slice(1);
    switch (type) {
      case '%':
        state[id] = new FlipFlop(id, outputs);
        break;
      case '&':
        state[id] = new Conjunction(id, outputs);
        conjunctions.push(id);
        break;
      default:
        throw new Error(`Unknown type ${type}`);
    }
    outputs.forEach((op) => {
      inputs[op] = inputs[op] || [];
      inputs[op].push(id);
    });
  });
  conjunctions.forEach((id) => {
    state[id].setInputs(inputs[id]);
  });
  return state;
}

timedLog('Preparation');

function button(state, value, counts, i) {
  // eslint-disable-next-line no-param-reassign
  counts[value] = (counts[value] || 0) + 1;
  const pulses = state.broadcaster.map((output) => ['broadcaster', value, output]);
  while (pulses.length > 0) {
    const [input, pulse, output] = pulses.shift();
    // eslint-disable-next-line no-param-reassign
    counts[pulse] = (counts[pulse] || 0) + 1;
    if (state.broadcaster.includes(output) && input !== 'broadcaster' && !pulse && !counts[output]) {
      // eslint-disable-next-line no-param-reassign
      counts[output] = i;
    }
    if (output in state) {
      pulses.push(...state[output].receive(pulse, input));
    }
  }
}

function solve1() {
  const state = init();
  const counts = {};
  for (let i = 0; i < 1000; i += 1) {
    button(state, false, counts, i);
  }
  console.log('Done', counts);
  return Object.values(counts).reduce((a, b) => a * b);
}

function solve2() {
  const state = init();
  const checks = state.broadcaster;
  const counts = {};
  let i = 0;
  while (!checks.every((check) => check in counts)) {
    button(state, false, counts, ++i);
  }
  return checks.map((check) => counts[check]).reduce((a, b) => a * b, 1);
}

timedLog('Part 1:', solve1());
timedLog('Part 2:', solve2());
