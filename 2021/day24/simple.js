// import readFile from '../../helpers/readFile.js';
require('../../helpers/groupBy');
import showTimedSolution from '../../helpers/showTimedSolution.js';
import { steps } from './commands.js';
import validate from './validate.js';
// import validate from './validate.js';

console.time('Preparation');

/**
 * See processDigit for step process
 * Analyse input
 * Consider z as a base-26 digit;
 * If divz === 1, (7x)
 *   - addx is always > 10, hence w !== x,
 *   - the step becomes w => 26 * w + w + addy (note w addy always < 26)
 *   - so w has one more 26-digit
 * If divz === 26, (7x)
 *   - w divided by 26
 *   - one less 26-digit
 *   - if w !== x, again one more 26-digit -- cannot happen otherwise final result still has digits, i.e. > 0,
 *      so w => x = z %26 + addx
 * */

/**
 * Create stack with pairs where divz === 1, remember pos and addy, and corresponding divz === 26
 * The digit as pos i2 follows from the digit at i1 + addy + addx
 */
const stack = [];
const pairs = [];
function createStackFromCommands() {
  steps.forEach((step, i) => {
    const [divz, addx, addy] = step;
    if (divz === 1) {
      stack.push({ i1: i, addy });
    } else {
      pairs.push({ ...stack.pop(), i2: i, addx });
    }
  });
}

createStackFromCommands();

console.timeEnd('Preparation');

function solve1() {
  const solution = new Array(14).fill();
  pairs.forEach((o) => {
    const {
      i1, i2, addx, addy,
    } = o;
    const sum = addx + addy;
    if (sum < 0) {
      solution[i1] = 9;
      solution[i2] = 9 + sum;
    } else {
      solution[i1] = 9 - sum;
      solution[i2] = 9;
    }
  });
  const result = solution.join('');
  console.assert(validate(result) === 0, 'Not a valid result');
  return result;
}

function solve2() {
  const solution = new Array(14).fill();
  pairs.forEach((o) => {
    const {
      i1, i2, addx, addy,
    } = o;
    const sum = addx + addy;
    if (sum < 0) {
      solution[i1] = 1 - sum;
      solution[i2] = 1;
    } else {
      solution[i1] = 1;
      solution[i2] = 1 + sum;
    }
  });
  const result = solution.join('');
  console.assert(validate(result) === 0, 'Not a valid result');
  return result;
}

showTimedSolution(1, () => solve1());

showTimedSolution(2, () => solve2());
