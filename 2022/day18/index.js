import { readLines } from '../../helpers/readInput/index.js';
import timedLog from '../../helpers/timedLog.js';
import getNumbers from '../../helpers/getNumbers.js';

const posKey = (p) => p.join(',');

const cubes = readLines().map(getNumbers);
const cubeSet = new Set(cubes.map(posKey));

const SIDES = [0, 1, 2];
const DIRECTIONS = [-1, 1];

timedLog('Preparation');

function getNeighbours(p) {
  return SIDES.flatMap((s) => DIRECTIONS.map((d) => {
    const r = p.slice(0);
    r[s] += d;
    return r;
  }));
}

const getNeighbourKeys = (p) => getNeighbours(p).map(posKey);

const countConnections = (pos) => getNeighbourKeys(pos).filter((n) => cubeSet.has(n)).length;

const countAllConnections = (posList) => posList.reduce((acc, p) => acc + countConnections(p), 0);

const countSurface = (posList) => posList.length * 6 - countAllConnections(posList);

/**
 * Initial list of potentiall trapped positions,
 * @returns {Array} Array of positions that are trapped in z orientation
 */
function getInsidePositions() {
  const grouped = {};
  cubes.forEach((p) => {
    const [x, y, z] = p;
    const key = JSON.stringify([x, y]);
    grouped[key] = grouped[key] || [];
    grouped[key].push(z);
  });
  const result = [];
  Object.keys(grouped).forEach((k) => {
    if (grouped[k].length === 1) {
      return;
    }
    const [x, y] = JSON.parse(k);
    const zMin = Math.min(...grouped[k]);
    const zMax = Math.max(...grouped[k]);
    for (let z = zMin + 1; z < zMax; z++) {
      if (!grouped[k].includes(z)) {
        result.push([x, y, z]);
      }
    }
  });
  return result;
}

/**
 * Iteratively removes positions that are connected to open positions
 * @returns list of trapped positions
 */
function findTrapped() {
  let positions = getInsidePositions();
  const positionSet = new Set(positions.map(posKey));
  const combinedSet = new Set([...cubeSet, ...positionSet]);

  let openPositions = positions.filter((p) => getNeighbourKeys(p).some((n) => !combinedSet.has(n)));
  let openSet;
  const notOpen = (p) => !openSet.has(posKey(p));
  const connectedToOpen = (p) => getNeighbourKeys(p).some((n) => openSet.has(n));
  while (openPositions.length > 0) {
    openSet = new Set(openPositions.map(posKey));
    positions = positions.filter(notOpen);
    openPositions = positions.filter(connectedToOpen);
  }
  return positions;
}

function floodFill() {
  const max = SIDES.map((s) => Math.max(...cubes.map((p) => p[s])) + 1);
  const min = SIDES.map((s) => Math.min(...cubes.map((p) => p[s])) - 1);
  const isInside = (p) => SIDES.every((s) => p[s] >= min[s] && p[s] <= max[s]);
  const p0 = [0, 0, 0];
  const visited = new Set();
  const visitedList = [];
  const heap = [];
  let ptr = 0;
  let current = p0;
  while (current) {
    const key = posKey(current);
    if (!visited.has(key)) {
      visited.add(key);
      visitedList.push(current);
      const neighbours = getNeighbours(current).filter((p) => {
        const pKey = posKey(p);
        return !cubeSet.has(pKey) && !visited.has(pKey) && isInside(p);
      });
      heap.push(...neighbours);
    }
    current = heap[ptr++];
  }
  return visitedList;
}

let fullSurface;

function solve1() {
  fullSurface = countSurface(cubes);
  return fullSurface;
}

function solve2() {
  const trapped = findTrapped();
  const trappedConnections = countAllConnections(trapped);
  return fullSurface - trappedConnections;
}

function solve3() {
  return countAllConnections(floodFill());
}

timedLog('Part 1:', solve1());
timedLog('Part 2:', solve2());
timedLog('Part 3:', solve3());
