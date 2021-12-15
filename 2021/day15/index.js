// const readFile = require('../../helpers/readFile');
const { getAdjacent, DIRECTIONS_SQUARE } = require('../../helpers/getAdjacent');
const QueueIterator = require('../../helpers/QueueIterator');
const readLines = require('../../helpers/readLines');
const showTimedSolution = require('../../helpers/showTimedSolution');

const MUL = 5;

const matrix1 = readLines().map((line) => Array.from(line).map(Number));

function cellsFromMatrix(matrix) {
  const filled = matrix.map((row, r) => row.map((risk, c) => ({ r, c, risk })));
  const result = filled.flat();
  result.forEach((cell) => {
    cell.adj = getAdjacent(cell, filled, DIRECTIONS_SQUARE);
    delete cell.route;
  });
  return result;
}

function checkRoute(route, cell, push) {
  const newRoute = { path: [...route.path, cell], risk: route.risk + cell.risk };
  const replace = !cell.route || cell.route.risk > newRoute.risk;
  if (replace) {
    cell.route = newRoute;
    push(cell);
  }
}

function takeStep(cell, push) {
  cell.adj.forEach(adj => checkRoute(cell.route, adj, push));
}

function solveForMatrix(matrix) {
  const cells = cellsFromMatrix(matrix);
  cells[0].route = { path: [cells[0]], risk: 0 };
  const qIter = new QueueIterator(cells[0], takeStep);
  let count = 0;
  while (!qIter.isEmpty()) {
    count ++;
    qIter.takeStep();
  }
  return cells[cells.length - 1].route.risk;
}

function solve1() {
  return solveForMatrix(matrix1);
}

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
const expandRow  = row => expand(row, incRisk)
const expandMatrix  = matrix => expand(matrix, incRiskRow)


function solve2() {
  const matrix2 = expandMatrix(matrix1.map(expandRow));
  return solveForMatrix(matrix2);
}

showTimedSolution(1, () => solve1());

showTimedSolution(2, () => solve2());
