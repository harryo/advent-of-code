import { readLines } from '../../helpers/readInput/index.js';
import timedLog from '../../helpers/timedLog.js';
import traverse from '../../helpers/traverse.js';
import { initDistances, getDistance } from './distances.js';

const re = /^Valve (\w+) .* rate=(\d+).* valves? (.*)$/;

function parseLine(str) {
  const [, name, rate, connections] = str.match(re);
  return { name, rate: Number(rate), connections: connections.split(', ') };
}

const data = readLines().map(parseLine);
const valves = {};
data.forEach((v) => { valves[v.name] = v; });
const valveList = data.filter((v) => v.rate > 0).sort((a, b) => b.rate - a.rate).map((v) => v.name);

timedLog('Preparation');

initDistances(valves);

timedLog('Distance calculation');

function findSteps(size, maxTime) {
  const initialState = {
    openValves: new Set(),
    finalReleased: 0,
    paths: new Array(size).fill().map(() => ({
      flowRate: 0,
      released: 0,
      current: 'AA',
      time: 0,
    })),
  };

  let bestReleased = 0;

  function getFinalReleased(path) {
    const { flowRate, released, time } = path;
    return released + flowRate * (maxTime - time);
  }

  function getNextState(v, i, state) {
    const { openValves, paths } = state;
    const {
      flowRate, released, current, time,
    } = paths[i];
    const distance = getDistance(current, v, valves);
    const newPath = {
      released: released + (distance + 1) * flowRate,
      flowRate: flowRate + valves[v].rate,
      current: v,
      time: time + distance + 1,
    };
    const newState = {
      maxTime,
      openValves: new Set(openValves).add(v),
      paths: [...paths],
    };
    newState.paths[i] = newPath;
    newState.finalReleased = newState.paths.reduce((acc, p) => acc + getFinalReleased(p), 0);
    return newState;
  }

  function getNext(state) {
    const { finalReleased, openValves } = state;
    if (finalReleased > bestReleased) {
      bestReleased = finalReleased;
    }

    return valveList
      .filter((v) => !openValves.has(v))
      .flatMap((v) => state.paths.map((p, i) => getNextState(v, i, state))
        .filter((s, i) => s.paths[i].time < maxTime))
      .filter((s) => s.finalReleased > bestReleased);
  }

  traverse(initialState, getNext);

  return bestReleased;
}

function solve1() {
  return findSteps(1, 30);
}

function solve2() {
  return findSteps(2, 26);
}

timedLog('Part 1:', solve1());
timedLog('Part 2:', solve2());
