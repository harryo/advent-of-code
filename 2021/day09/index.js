const readLines = require('../../helpers/readLines');
const showTimedSolution = require('../../helpers/showTimedSolution');
require('../../helpers/sortBy');

let index = 0;

// Create map with for each location its position, height and a unique index
const heightMap = readLines()
  .map((line, r) => line
    .split('')
    .filter(Boolean)
    .map((v, c) => ({
      r, c, h: Number(v), i: index++,
    })));

/**
 * Find adjacent locations
 * @param {*} loc
 * @returns
 */
function adjacent(loc) {
  const { r, c } = loc;
  return [[-1, 0], [1, 0], [0, -1], [0, 1]] // possible directions
    .map((d) => ({ r: r + d[0], c: c + d[1] })) // possible positions
    .map((p) => heightMap[p.r] && heightMap[p.r][p.c]) // to map locations
    .filter(Boolean); // only inside map
}

function findLowPoints() {
  return heightMap
    .flat()
    .filter((loc) => adjacent(loc)
      .every((o) => o.h > loc.h));
}

let lowPoints;

function solve1() {
  lowPoints = findLowPoints();
  return lowPoints.reduce((sum, o) => sum + o.h + 1, 0);
}

function getBasin(lowPoint) {
  const checkedLocations = new Set();

  function extend(loc) {
    if (checkedLocations.has(loc.i)) {
      return [];
    }
    checkedLocations.add(loc.i);
    const newLocations = adjacent(loc)
      .filter((o) => o.h !== 9 && o.h > loc.h)
      .map((o) => extend(o))
      .flat();
    return [loc, ...newLocations];
  }

  return extend(lowPoint);
}

function solve2() {
  return lowPoints
    .map(getBasin)
    .sortBy('-length')
    .slice(0, 3)
    .reduce((p, b) => p * b.length, 1);
}

showTimedSolution(1, () => solve1());

showTimedSolution(2, () => solve2());
