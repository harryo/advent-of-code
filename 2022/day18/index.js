const { readLines } = require('../../helpers/readInput');
const timedLog = require('../../helpers/timedLog');
const getNumbers = require('../../helpers/getNumbers');

const posKey = (p) => p.join(',');

const cubes = readLines().map(getNumbers);
const cubeSet = new Set(cubes.map(posKey));

const SIDES = [0, 1, 2];
const DIRECTIONS = [-1, 1];

function getNeighbours(p) {
  return SIDES.flatMap((s) => DIRECTIONS.map((d) => {
    const r = p.slice(0);
    r[s] += d;
    return posKey(r);
  }));
}

timedLog('Preparation');

const countConnections = (pos) => getNeighbours(pos).filter((n) => cubeSet.has(n)).length;

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

  let openPositions = positions.filter((p) => getNeighbours(p).some((n) => !combinedSet.has(n)));
  let openSet;
  const notOpen = (p) => !openSet.has(posKey(p));
  const connectedToOpen = (p) => getNeighbours(p).some((n) => openSet.has(n));
  while (openPositions.length > 0) {
    openSet = new Set(openPositions.map(posKey));
    positions = positions.filter(notOpen);
    openPositions = positions.filter(connectedToOpen);
  }
  return positions;
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

timedLog('Part 1:', solve1());
timedLog('Part 2:', solve2());
