import readFile from '../../helpers/readFile.js';
// import readLines from '../../helpers/readLines.js';
import showTimedSolution from '../../helpers/showTimedSolution.js';

const blocks = readFile().split(/\n{2,}/);

// Keep points as string to easily find duplicates
const points = blocks[0].split(/\n/);

// Get key (x or y) and value for folds
const folds = blocks[1].split(/\n/)
  .map((line) => line.match(/([xy])=(\d+)/))
  .map((match) => ({ key: match[1], value: Number(match[2]) }));

// Make a fold and return unique points
function makeFold(pts, fold) {
  const { key, value } = fold;
  const newPoints = pts.map((pt) => {
    const [x, y] = pt.split(',').map(Number);
    const newPoint = { x, y };
    newPoint[key] = newPoint[key] < value ? newPoint[key] : 2 * value - newPoint[key];
    return `${newPoint.x},${newPoint.y}`;
  });
  // Eliminate double points
  return Array.from(new Set(newPoints));
}

// Create a matrix with the points marked
function asString(strPoints) {
  const pts = strPoints.map((p) => p.split(',').map(Number)).map(([x, y]) => ({ x, y }));
  const size = {
    x: Math.max(...pts.map((p) => p.x)),
    y: Math.max(...pts.map((p) => p.y)),
  };
  const matrix = Array(size.y + 1).fill().map(() => Array(size.x + 1).fill('.'));
  pts.forEach((pt) => {
    matrix[pt.y][pt.x] = '#';
  });
  return matrix.map((line) => line.join('')).join('\n');
}

function solve1() {
  return makeFold(points, folds[0]).length;
}

function solve2() {
  const final = folds.reduce((pts, fold) => makeFold(pts, fold), points);
  return `\n${asString(final)}`;
}

showTimedSolution(1, () => solve1());

showTimedSolution(2, () => solve2());
