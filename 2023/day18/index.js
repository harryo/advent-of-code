import { readLines } from '../../helpers/readInput/index.js';
import timedLog from '../../helpers/timedLog.js';

const data = readLines();

const sorter = (a, b) => a - b;

const directions = {
  U: [0, -1],
  D: [0, 1],
  R: [1, 0],
  L: [-1, 0],
};

function steps2turns(steps) {
  const turns = [];
  let x = 0;
  let y = 0;
  steps.forEach(({ action, amount }) => {
    const [dx, dy] = directions[action];
    x += dx * amount;
    y += dy * amount;
    turns.push([x, y]);
  });
  return turns;
}

function groupByX(turns) {
  const turnsByX = {};
  turns.forEach(([x, y]) => {
    if (!turnsByX[x]) {
      turnsByX[x] = [];
    }
    turnsByX[x].push(y);
  });
  const result = [];
  Object.entries(turnsByX).forEach(([x, ys]) => {
    result.push({ x: Number(x), ys: ys.sort(sorter) });
  });
  return result.sort((a, b) => a[0] - b[0]);
}

function steps2state(steps) {
  const turns = groupByX(steps2turns(steps));
  const state = {
    turns,
    interior: 0,
    limits: [],
    ptr: 0,
    nextX: 0,
  };
  return state;
}

function init() {
  const steps = data.map((line) => {
    const [action, amount] = line.split(' ');
    return {
      action,
      amount: Number(amount),
    };
  });
  return steps2state(steps);
}

function init2() {
  const steps = data.map((line) => {
    const [, hex, code] = /#(\w{5})(\d)/.exec(line);
    const action = 'RDLU'[Number(code)];
    const amount = parseInt(hex, 16);
    return {
      action,
      amount: Number(amount),
    };
  });
  return steps2state(steps);
}

function mergeLimits(limits, ys) {
  const merged = new Set(limits);
  const newLimits = new Set(limits);
  ys.forEach((y) => {
    merged.add(y);
    if (newLimits.has(y)) {
      newLimits.delete(y);
    } else {
      newLimits.add(y);
    }
  });
  return {
    merged: [...merged].sort(sorter),
    newLimits: [...newLimits].sort(sorter),
  };
}

function step(state) {
  const {
    turns, interior, limits, ptr, nextX,
  } = state;
  const { x, ys } = turns[ptr];
  let inside = false;
  let newArea = 0;
  if (x > nextX) {
    limits.forEach((y) => {
      newArea += inside ? y : 1 - y;
      inside = !inside;
    });
    newArea *= x - nextX;
  }
  inside = false;
  const { merged, newLimits } = mergeLimits(limits, ys);
  // For this x
  let oldInside = false;
  let newInside = false;
  inside = false;
  let rowArea = 0;
  merged.forEach((y) => {
    if (limits.includes(y)) {
      oldInside = !oldInside;
    }
    if (newLimits.includes(y)) {
      newInside = !newInside;
    }
    if ((oldInside || newInside) !== inside) {
      rowArea += inside ? y : 1 - y;
      inside = !inside;
    }
  });
  return {
    ...state,
    interior: interior + newArea + rowArea,
    limits: newLimits,
    ptr: ptr + 1,
    nextX: x + 1,
  };
}

function done(state) {
  const { turns, ptr } = state;
  return ptr === turns.length;
}

function answer(state) {
  return state.interior;
}

timedLog('Preparation');

function solve1() {
  let state = init();
  while (!done(state)) {
    state = step(state);
  }
  return answer(state);
}

function solve2() {
  let state = init2();
  while (!done(state)) {
    state = step(state);
  }
  return answer(state);
}

timedLog('Part 1:', solve1());
timedLog('Part 2:', solve2());
