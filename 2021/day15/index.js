/**
 * Improvements
 * Time before: ca. 60s
 * 1. Calculate new path only when route is replaced, time ca. 15s
 * 2. Ignore calculating path (1.1s)
 * 3. Use standard sorting of queue (far less loops, but sorting slow, 3.8s)
 * 4. Use sorted insert of new cells (0.6s)
 */

/* eslint-disable no-param-reassign */
// import readFile from '../../helpers/readFile.js';
import createArray from '../../helpers/createArray.js';
import { getAdjacent, DIRECTIONS_SQUARE } from '../../helpers/getAdjacent.js';
import readLines from '../../helpers/readLines.js';
import showTimedSolution from '../../helpers/showTimedSolution.js';
require('../../helpers/sortBy');

const MUL = 5;

const sort = -1; // -1: no sort, but find minimum, 0: none, 1: using array.sort, 2: using sorted inserts

const matrix1 = readLines().map((line) => Array.from(line).map(Number));

/**
 * Create list of matrix cells containing position, risk and list of adjacent cells
 * @param {*} matrix
 * @returns array of matrix cells
 */
function cellsFromMatrix(matrix) {
  const filled = matrix.map((row, r) => row.map((risk, c) => ({ r, c, risk })));
  const result = filled.flat();
  result.forEach((cell) => {
    cell.adj = getAdjacent(cell, filled, DIRECTIONS_SQUARE).sort((a, b) => a.risk - b.risk);
  });
  return result;
}

/**
 * Extend the route with the cell, replacing cell route if lower risk
 * @param {array} route  { path: list of cells and accumulated risk }
 * @param {*} cell
 * @returns
 */
function checkRoute(route, cell) {
  const routeRisk = route.risk + cell.risk;
  const replace = !cell.route || cell.route.risk > routeRisk;
  if (replace) {
    // cell.route = { path: [...route.path, cell], risk: routeRisk };
    cell.route = { risk: routeRisk };
  }
  return replace && cell;
}

const takeStep = (cell) => cell.adj.map((adj) => checkRoute(cell.route, adj)).filter(Boolean);

function solveForMatrix(matrix) {
  const cells = cellsFromMatrix(matrix);
  cells[0].route = { path: [cells[0]], risk: 0 };
  const target = cells[cells.length - 1];
  // FIFO queue with cells to be checked for route extension
  const queue = [cells[0]];
  let count = 0;

  function getMin() {
    let min = Infinity;
    let idx;
    let result;
    queue.forEach((p, i) => {
      if (p.route.risk < min) {
        min = p.route.risk;
        result = p;
        idx = i;
      }
    });
    queue.splice(idx, 1);
    return result;
  }

  function insertSorted(list) {
    let ptr = 0;
    list.forEach((cell) => {
      const { risk } = cell.route;
      const len = queue.length;
      while (ptr < len && queue[ptr].route.risk < risk) {
        ptr++;
      }
      queue.splice(ptr, 0, cell);
    });
  }

  while (queue.length > 0) {
    const cell = sort < 0 ? getMin() : queue.shift();
    count++;
    if (sort > 0 && cell === target) {
      break;
    }
    const updatedCells = takeStep(cell);
    if (sort === 2) {
      insertSorted(updatedCells);
    } else {
      queue.push(...updatedCells);
      if (sort === 1) {
        queue.sortBy((a) => a.route.risk);
      }
    }
  }
  console.log('count', count);
  return target.route.risk;
}

function solve1() {
  return solveForMatrix(matrix1);
}

/**
 * Expand a row or matrix, using the inc function to increase risk
 * @param {row or matrix} o
 * @param {callback} inc
 * @returns
 */
function expand(o, inc) {
  const len = o.length;
  const result = createArray(MUL * len);
  result.forEach((i) => {
    result[i] = i < len ? o[i] : inc(result[i - len]);
  });
  return result;
}

const incRisk = (v) => (v % 9) + 1;
const incRiskRow = (row) => row.map(incRisk);
const expandRow = (row) => expand(row, incRisk);
const expandMatrix = (matrix) => expand(matrix, incRiskRow);

function solve2() {
  const matrix2 = expandMatrix(matrix1.map(expandRow));
  return solveForMatrix(matrix2);
}

showTimedSolution(1, () => solve1());

showTimedSolution(2, () => solve2());
