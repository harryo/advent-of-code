// const readFile = require('../../helpers/readFile');
const { getAdjacent, DIRECTIONS_SQUARE } = require('../../helpers/getAdjacent');
const readLines = require('../../helpers/readLines');
const showTimedSolution = require('../../helpers/showTimedSolution');

const MUL = 5;

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
    cell.adj = getAdjacent(cell, filled, DIRECTIONS_SQUARE);
    delete cell.route;
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
  const newRoute = { path: [...route.path, cell], risk: route.risk + cell.risk };
  const replace = !cell.route || cell.route.risk > newRoute.risk;
  if (replace) {
    cell.route = newRoute;
  }
  return replace && cell;
}

const takeStep = (cell) => cell.adj.map(adj => checkRoute(cell.route, adj)).filter(Boolean);

function solveForMatrix(matrix) {
  const cells = cellsFromMatrix(matrix);
  cells[0].route = { path: [cells[0]], risk: 0 };
  // FIFO queue with cells to be checked for route extension
  const queue = [cells[0]];
  while (queue.length > 0) {
    const cell = queue.shift();
    const updatedCells = takeStep(cell);
    queue.push(...updatedCells);
  }
  return cells[cells.length - 1].route.risk;
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
  const result = Array(MUL * len).fill();
  result.forEach((dummy, i) => {
    result[i] = i < len ? o[i] : inc(result[i - len]);
  });
  return result;
}

const incRisk = v => (v % 9) + 1;
const incRiskRow = row => row.map(incRisk);
const expandRow = row => expand(row, incRisk)
const expandMatrix = matrix => expand(matrix, incRiskRow)

function solve2() {
  const matrix2 = expandMatrix(matrix1.map(expandRow));
  return solveForMatrix(matrix2);
}

showTimedSolution(1, () => solve1());

showTimedSolution(2, () => solve2());
