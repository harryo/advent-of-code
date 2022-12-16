const { readLines } = require('../../helpers/readInput');
const timedLog = require('../../helpers/timedLog');
const traverse = require('../../helpers/traverse');
const { initDistances, getDistance } = require('./distances');

const re = /^Valve (\w+) .* rate=(\d+).* valves? (.*)$/;

function parseLine(str) {
  const [, name, rate, connections] = str.match(re);
  return { name, rate: Number(rate), connections: connections.split(', ') };
}

const data = readLines().map(parseLine);
const valves = {};
data.forEach((v) => { valves[v.name] = v; });
const valveList = data.filter((v) => v.rate > 0).sort((a, b) => b.rate - a.rate).map((v) => v.name);
const valveCount = valveList.length;

timedLog('Preparation');

initDistances(valves);

timedLog('Distance calculation');

function findSteps(maxTime) {
  const initialState = {
    openValves: new Set(),
    finalReleased: 0,
    flowRate: 0,
    released: 0,
    current: 'AA',
    time: 0,
  };

  let bestReleased = 0;
  const allPaths = [];

  function getFinalReleased(state) {
    const { flowRate, released, time } = state;
    return released + flowRate * (maxTime - time);
  }

  function getNextState(v, state) {
    const {
      openValves, flowRate, released, current, time,
    } = state;
    const distance = getDistance(current, v);
    const newState = {
      maxTime,
      openValves: new Set(openValves).add(v),
      released: released + (distance + 1) * flowRate,
      flowRate: flowRate + valves[v].rate,
      current: v,
      time: time + distance + 1,
    };
    newState.finalReleased = getFinalReleased(newState);
    return newState;
  }

  function getNext(state) {
    const { finalReleased, openValves } = state;
    if (finalReleased > bestReleased) {
      bestReleased = finalReleased;
    }
    allPaths.push({ openValves, finalReleased });

    return valveList
      .filter((v) => !openValves.has(v))
      .map((v) => getNextState(v, state))
      .filter((s) => s.time < maxTime);
  }

  traverse(initialState, getNext);

  return allPaths.sort((a, b) => b.finalReleased - a.finalReleased);
}

function solve1() {
  return findSteps(30)[0].finalReleased;
}

function solve2() {
  const allPaths = findSteps(26);
  let bestReleased = 0;
  allPaths.slice(0, -1).forEach((path, i) => {
    const openValves = Array.from(path.openValves);
    allPaths.slice(i + 1)
      .forEach((p) => {
        const finalReleased = p.finalReleased + path.finalReleased;
        if (finalReleased > bestReleased
          && openValves.length + p.openValves.size <= valveCount
          && openValves.every((v) => !p.openValves.has(v))) {
          bestReleased = finalReleased;
        }
      });
  });
  return bestReleased;
}

timedLog('Part 1:', solve1());
timedLog('Part 2:', solve2());
