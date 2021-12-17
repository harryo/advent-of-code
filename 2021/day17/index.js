// const createArray = require('../../helpers/createArray');
const readFile = require('../../helpers/readFile');
// const readLines = require('../../helpers/readLines');
const showTimedSolution = require('../../helpers/showTimedSolution');

const match = readFile().match(/target area: x=(.+)\.\.(.+), y=(.+)\.\.(.+)/);

console.time('Preparation');

const [xMin, xMax, yMin, yMax] = match.slice(1).map(Number);
console.log({
  xMin, xMax, yMin, yMax,
});

// abc formula to solve a quadratic equation a * x^2 + b * x + c = 0, has answers for both s = 1 and s = -1
function abcFormula(a, b, c, s = 1) {
  const sqrt = Math.sqrt(b * b - 4 * a * c);
  return (-b + s * sqrt) / (2 * a);
}

// Get Y position of probe at time t
const posY = (v, t) => t * v - (t * (t - 1)) / 2;

// Get X position of probe at time t
// Note that x, v is always >= 0
function posX(v, t) {
  return (t < v ? posY(v, t) : ((v * v + v) / 2));
}

// Get velocity to be at pos d at time t
const velocity = (d, t) => (d + ((t * (t - 1)) / 2)) / t;

// Get minimum velocity to reach a distance, i.e. position reached when v = 0, after v seconds, so v = t
// ((v * v + v) / 2)) = d, or v^2 + v - 2 * d = 0, must be positive, so s = 1 (default);
const getMinVelocity = (d) => abcFormula(1, 1, -2 * d);

// Assuming both yMin and yMax are both positive or both negative
// The max y velocity is the highest absolute value, otherwise it steps over just before or after passing 0
const vyMax = yMin < 0 ? -yMin + 1 : yMax;
// The min y velocity should not overshoot yMin if yMin negative, or minimum velocity to reach positive yMin
const vyMin = yMin < 0 ? yMin : Math.ceil(getMinVelocity(yMin));

// Min value for vx to reach xMin
const vxMin = Math.ceil(abcFormula(1, 1, -2 * xMin)); // min vx to stop after xMin
// Given a time t, vxMax is the velocity at which xMmax is reached at time t

/**
 * Check whether this y velocity has an x velocity which makes it reach the target
 * @param {int} v
 * @returns bool
 */
function checkvyo(vy) {
  const vxSet = new Set();
  const tMin = Math.ceil(abcFormula(1, -2 * vy - 1, 2 * yMax));
  const tMax = Math.floor(abcFormula(1, -2 * vy - 1, 2 * yMin));
  for (let t = tMin; t <= tMax; t++) {
    findXinTarget(t, vxSet);
  }
  return Array.from(vxSet);
}

function findXinTarget(t, resultSet) {
  // Last vX is at xMax at time t, t * vx - (t * (t - 1)) / 2 = xMax
  const vxLast = Math.floor(velocity(xMax, t));
  for (let vx = vxMin; vx <= vxLast; vx++) {
    const x = posX(vx, t);
    if (x >= xMin && x <= xMax) {
      resultSet.add(vx);
    }
  }
}

console.timeEnd('Preparation');

function solve1() {
  let vy = vyMax;
  while (checkvyo(vy).length === 0) {
    vy--;
  }
  // Top is when vy = 0, after vy0 seconds
  return posY(vy, vy);
}

function solve2() {
  const result = [];
  for (let vy = vyMax; vy >= vyMin; vy--) {
    result.push(...checkvyo(vy));
  }
  const len1 = result.length;
  const len2 = Array.from(new Set(result)).length;
  return result.length;
}

showTimedSolution(1, () => solve1());

showTimedSolution(2, () => solve2());
