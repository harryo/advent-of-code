import traverse from '../../helpers/traverse.js';

const cache = {};

function getDistancesFrom(start, valves) {
  const initialState = { pos: start, distance: 0, destinations: new Set([start]) };
  const destinations = new Set();

  function getNext(state) {
    const { pos, distance } = state;
    destinations.add(pos);
    if (distance > 0 && valves[pos].rate > 0) {
      const key = [start, pos].sort().join('-');
      cache[key] = distance;
    }
    return valves[pos].connections
      .filter((c) => !destinations.has(c))
      .map((c) => ({
        pos: c,
        distance: distance + 1,
      }));
  }

  traverse(initialState, getNext);
}

function initDistances(valves) {
  Object.keys(valves).filter((v) => v === 'AA' || valves[v].rate > 0).forEach((v) => getDistancesFrom(v, valves));
}

function getDistance(start, end) {
  const key = [start, end].sort().join('-');
  if (!cache[key]) throw new Error(`No distance found for ${key}`);
  return cache[key];
}

export default { getDistance, initDistances };
