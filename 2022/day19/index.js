const { readLines } = require('../../helpers/readInput');
const timedLog = require('../../helpers/timedLog');
const traverse = require('../../helpers/traverse');

const data = readLines().map((line) => line.split(/[:.]\s+/)).map((line) => {
  const [blueprint, ...robotLines] = line;
  const id = Number(blueprint.split(' ')[1]);
  const robots = {};
  robotLines.forEach((str) => {
    const type = str.split(' ')[1];
    const robot = { value: 0 };
    str.match(/\d+ \w+/g).forEach((m) => {
      const [numStr, tp] = m.split(' ');
      const num = Number(numStr);
      robot[tp] = num;
      if (tp === 'ore') {
        robot.value += num;
      } else {
        robot.value += num * robots[tp].value;
      }
    });
    robots[type] = robot;
  });
  return { id, robots };
});

const types = Object.keys(data[0].robots);

// Find maximum number of robots needed for each type
data.forEach(({ robots }) => {
  types.forEach((type) => {
    // eslint-disable-next-line no-param-reassign
    robots[type].max = Math.max(...types.map((tp) => robots[tp][type] || 0)) || Infinity;
    if (type === 'geode') {
    // eslint-disable-next-line no-param-reassign
      robots[type].minSteps = 1; // No sense to buy in last step, we can't use it
    } else if (type in robots.geode) {
    // eslint-disable-next-line no-param-reassign
      robots[type].minSteps = 2; // No sense to buy in later, they will not produce geode robots anymore
    } else {
    // eslint-disable-next-line no-param-reassign
      robots[type].minSteps = 3; // No sense to buy in later, they will not produce geode robots anymore
    }
  });
});

timedLog('Preparation', types);

function init(blueprint) {
  const result = {
    blueprint,
    robots: {},
    supply: {},
  };
  types.forEach((type) => {
    result.robots[type] = 0;
    result.supply[type] = 0;
  });
  result.robots.ore = 1;
  result.supply.ore = 0;
  return result;
}

function addSupply(state, n = 1) {
  const { t, supply, robots } = state;
  const result = { ...supply };
  types.forEach((type) => {
    result[type] += n * robots[type];
  });
  return { ...state, supply: result, t: t - n };
}

function buyRobots(state, typeList, priced) {
  const { blueprint, robots, supply } = state;
  const newRobots = { ...robots };
  const newSupply = { ...supply };
  typeList.forEach((type) => {
    newRobots[type]++;
    priced.forEach((tp) => {
      newSupply[tp] -= blueprint.robots[type][tp];
    });
  });
  return { ...state, robots: newRobots, supply: newSupply };
}

// Max number of geode after t seconds, assuming buying multiple all robots simultaneously
function getValue(state) {
  const {
    blueprint, t, robots, supply,
  } = state;
  if (t === 0) {
    return supply.geode;
  }
  const priced = types.slice(1);
  const typeList = priced.filter((type) => {
    const { max, minSteps } = blueprint.robots[type];
    const [, cost] = priced.map((tp) => blueprint.robots[type][tp]);
    return robots[type] < max && t >= minSteps && supply[type] >= (cost || 0);
  });
  return getValue(buyRobots(addSupply(state), typeList, priced));
}

function getKey(state) {
  const { robots, supply } = state;
  return [...Object.values(robots), ...Object.values(supply)].join(',');
}

function buyingOptions(state) {
  const {
    blueprint, robots, supply, t,
  } = state;
  const result = [addSupply(state, t)];
  types.forEach((type) => {
    const cost = blueprint.robots[type];
    if (robots[type] >= cost.max || t < cost.minSteps) {
      return;
    }
    const priced = types.filter((tp) => cost[tp] > 0);
    const delay = Math.max(...priced.map((tp) => {
      if (supply[tp] >= cost[tp]) {
        return 0;
      }
      return robots[tp] === 0 ? Infinity : Math.ceil((cost[tp] - supply[tp]) / robots[tp]);
    })) + 1;
    const nextTime = t - delay;
    if (nextTime < 1) {
      return;
    }
    const newState = buyRobots(addSupply(state, delay), [type], priced);

    if (type === 'geode' && delay === 1) {
      result.splice(0, result.length, newState);
    } else {
      result.push(newState);
    }
  });
  return result.reverse();
}

function testBlueprint(blueprint, time) {
  let maxGeodes = 0;
  const checkedStates = {};

  const initialState = {
    t: time,
    ...init(blueprint),
  };

  function getNext(state) {
    const { supply, t } = state;
    const key = getKey(state);
    if (checkedStates[key] >= t || getValue(state) <= maxGeodes) {
      return [];
    }
    checkedStates[key] = t;
    if (t === 0) {
      if (supply.geode > maxGeodes) {
        maxGeodes = supply.geode;
      }
      return [];
    }
    return buyingOptions(state);
  }
  traverse(initialState, getNext, false);
  console.log('Blueprint', blueprint.id, maxGeodes);
  return maxGeodes;
}

function solve1() {
  return data.reduce((acc, blueprint) => acc + blueprint.id * testBlueprint(blueprint, 24), 0);
}

function solve2() {
  return data.slice(0, 3).reduce((acc, blueprint) => acc * testBlueprint(blueprint, 32), 1);
}

timedLog('Part 1:', solve1());
timedLog('Part 2:', solve2());
