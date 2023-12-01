/* eslint-disable no-param-reassign */
// import readFile from '../../helpers/readFile.js';
import readLines from '../../helpers/readLines.js';
import showTimedSolution from '../../helpers/showTimedSolution.js';

// Create map with for each location its position and energy
const matrix = readLines()
  .map((line, r) => Array.from(line).filter(Boolean)
    .map((v, c) => ({
      r, c, e: Number(v),
    })));

// For easy looping, make flat array
const octopi = matrix.flat();

/**
 * Find adjacent locations
 * @param {*} loc
 * @returns
 */
function adjacent(loc) {
  const { r, c } = loc;
  return [[-1, 0], [1, 0], [0, -1], [0, 1], [-1, -1], [1, -1], [1, 1], [-1, 1]] // possible directions
    .map((d) => ({ r: r + d[0], c: c + d[1] })) // possible positions
    .map((p) => matrix[p.r] && matrix[p.r][p.c]) // to map locations
    .filter(Boolean); // only inside map
}

// To avoid repeat calculating adjacent, store in array
octopi.forEach((o) => {
  o.adj = adjacent(o);
});

/**
 * Flash all octopi that have not flashed yet and update neighbours
 * @param {list} hasFlashed
 * @returns list of newly flashed octopi
 */
function subStep(hasFlashed) {
  const newFlashes = octopi.filter((o) => !hasFlashed.includes(o) && o.e > 9);
  newFlashes.forEach((o) => o.adj.forEach((a) => a.e++));
  return newFlashes;
}

/**
 * Increase energy for all octopi, apply flashing and reset flashed octopi energy to 0
 * @returns count of flashes
 */
function takeStep() {
  let flashCount = 0;
  octopi.forEach((o) => o.e++);
  const flashes = [];
  let newFlashes;
  do {
    newFlashes = subStep(flashes);
    flashCount += newFlashes.length;
    flashes.push(...newFlashes);
  } while (newFlashes.length > 0);
  flashes.forEach((o) => {
    o.e = 0;
  });
  return flashCount;
}

// Take 100 steps and count flashes
function solve1() {
  return Array(100).fill().reduce((s) => s + takeStep(), 0);
}

// Keep taking stapes until all flashed
function solve2() {
  // First 100 steps have been taken already
  let count = 100;
  do {
    count++;
  } while (takeStep() < octopi.length);
  return count;
}

showTimedSolution(1, () => solve1());

showTimedSolution(2, () => solve2());
