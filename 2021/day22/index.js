// import readFile from '../../helpers/readFile.js';
import createArray from '../../helpers/createArray.js';
import readLines from '../../helpers/readLines.js';
import showTimedSolution from '../../helpers/showTimedSolution.js';

console.time('Preparation');

function parseLimits(str) {
  const [key, ...rest] = str.split(/[=.]+/);
  return {
    key,
    values: rest.map(Number),
  };
}

function parseLine(line) {
  const [state, limits] = line.split(' ');
  const result = { state: state === 'on' };
  limits
    .split(',')
    .map(parseLimits)
    .forEach(({ key, values }) => {
      result[key] = values;
    });
  return result;
}

const input = readLines().map(parseLine);

const core = new Set(); // Set with 'on' values as 'x,y,z';

function applyStep1(step) {
  // console.log('step', JSON.stringify(step));
  const {
    state, x, y, z,
  } = step;
  const MIN = -50;
  const MAX = 50;
  const limited = ([min, max]) => [Math.max(min, MIN), Math.min(max, MAX)];
  createArray(limited(x))
    .forEach((xi) => createArray(limited(y))
      .forEach((yi) => createArray(limited(z))
        .forEach((zi) => {
          const key = [xi, yi, zi].toString();
          if (state) {
            core.add(key);
          } else {
            core.delete(key);
          }
        })));
}

console.timeEnd('Preparation');

function solve1() {
  input.forEach(applyStep1);
  return core.size;
}

/**
 * Divide all possible values into ranges based on the min..max values from the input
 * @param {*} arr
 * @returns  { min, size }  lower limit and size of each range
 */
function getRanges(arr) {
  // Only need lower limits, then would apply to whole block
  const minValues = [];
  arr.forEach((limits) => {
    const [min, max] = limits;
    // max+1 is lower limit for another range
    minValues.push(min, max + 1);
  });
  // Get unique values
  const uniq = Array.from(new Set(minValues));
  uniq.sort((a, b) => a - b);
  // Create array with lower limit and size
  return uniq.slice(1).map((v, i) => ({
    min: uniq[i],
    size: v - uniq[i],
  }));
}

/**
 * Check whether the value fits inside the range
 * @param {*} v
 * @param {*} limits
 * @returns
 */
function isInside(v, limits) {
  const [min, max] = limits;
  return v >= min && v <= max;
}

function solve2() {
  // Get ranges for x
  const xRanges = getRanges(input.map((step) => step.x));
  let result = 0;
  xRanges.forEach((x) => {
    // get ranges for y, based in relevant inputs given x
    const xInput = input.filter((step) => isInside(x.min, step.x));
    const yRanges = getRanges(xInput.map((step) => step.y));
    yRanges.forEach((y) => {
    // get ranges for z, based in relevant inputs given x, y
      const yInput = xInput.filter((step) => isInside(y.min, step.y));
      const zRanges = getRanges(yInput.map((step) => step.z));
      zRanges.forEach((z) => {
        // find valid inputs for x, y, z and add size to result
        const zInput = yInput.filter((step) => isInside(z.min, step.z));
        const zLength = zInput.length;
        if (zLength > 0 && zInput[zInput.length - 1].state) {
          result += x.size * y.size * z.size;
        }
      });
    });
  });
  return result;
}

showTimedSolution(1, () => solve1());

showTimedSolution(2, () => solve2());
