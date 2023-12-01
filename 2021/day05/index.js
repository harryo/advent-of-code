import readLines from '../../helpers/readLines.js';
import showTimedSolution from '../../helpers/showTimedSolution.js';

/**
 * Split the lines in the coordinatates
 * Ignore exact notation, just split on non-numeric
 */
const source = readLines().map((line) => {
  const [x1, y1, x2, y2] = line.split(/\D+/).filter(Boolean).map(Number);
  return {
    x1, y1, x2, y2,
  };
});

/**
 * Filter returns only horizontal and vertical lines
 * @param {arr} lines
 * @returns
 */
function noDiagonal(lines) {
  return lines.filter(({
    x1, y1, x2, y2,
  }) => x1 === x2 || y1 === y2);
}

/**
 * Get points from lines
 * @param {obj} line
 * @returns
 */
function pointsFromLine(line) {
  const {
    x1, y1, x2, y2,
  } = line;
  const dx = Math.sign(x2 - x1);
  const dy = Math.sign(y2 - y1);
  const length = Math.max(Math.abs(x2 - x1), Math.abs(y2 - y1));
  const result = [];
  for (
    let i = 0, x = x1, y = y1;
    i <= length;
    i++, x += dx, y += dy) {
    result.push([x, y].join(',')); // String notation for easily identifying equal points
  }
  return result;
}

/**
 * Count how often each point is part of a line
 * @param {arr} lines
 * @returns
 */
function countPoints(lines) {
  const points = lines.map(pointsFromLine);
  const pointCounts = {};
  points.flat().forEach((pt) => {
    if (pointCounts[pt]) {
      pointCounts[pt]++;
    } else {
      pointCounts[pt] = 1;
    }
  });
  return pointCounts;
}

function solve1() {
  const lines = noDiagonal(source);
  const points = countPoints(lines);
  return Object.values(points).filter((p) => p >= 2).length;
}

function solve2() {
  const points = countPoints(source);
  return Object.values(points).filter((p) => p >= 2).length;
}

showTimedSolution(1, solve1);

showTimedSolution(2, solve2);
