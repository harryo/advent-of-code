// const readFile = require('../../helpers/readFile');
require('../../helpers/groupBy');
const createArray = require('../../helpers/createArray');
const showTimedSolution = require('../../helpers/showTimedSolution');
const { steps } = require('./commands');
const { validate2 } = require('./processDigit');
const validate = require('./validate');
// const validate = require('./validate');

console.time('Preparation');

const digits = createArray([1, 9]);
const arr26 = createArray(26);

// Can iterate from both start and end of result, then find matches for the z value
// Nr of iteration steps from start:

const START_STEPS = Number(process.argv[3] || 5);

/**
 * Find the possible z values for previous step after processing w, given new z
 * @param {*} w digit to be processed
 * @param {*} z new outcome
 * @param {*} divz
 * @param {*} addx
 * @param {*} addy
 * @returns
 */
function stepBack(w, z, divz, addx, addy) {
  const result = [];
  // If w === x in processDigit
  let z1 = (w - addx) % 26;
  if (divz === 26) {
    const n = Math.ceil(z - (z1 / 26));
    if (n > 0) {
      z1 += 26 * n;
    }
    if ((z1 % 26) + addx === w) {
      result.push(z1);
    }
  } else if ((z - z1) % 26 === 0) {
    z1 = z;
    if ((z1 % 26) + addx === w) {
      result.push(z1);
    }
  }
  // If w !=== x in above
  const tmp = (z - w - addy) / 26;
  if (tmp === Math.trunc(tmp)) {
    const z2 = divz === 1 ? [tmp] : arr26.map((v) => (tmp * divz) + v)
      .filter((v) => (v % 26) + addx !== w);
    result.push(...z2);
  }
  return result;
}

function findOptions(z, i) {
  return digits
    .flatMap((w) => stepBack(w, z, ...steps[13 - i])
      .map((z2) => ({ w, z: z2 })));
}

function iterate(z, depth = 1, str = '') {
  const i = str.length;
  if (i >= depth) {
    return { z, str };
  }
  const options = findOptions(z, i);
  return options.flatMap((opt) => iterate(opt.z, depth, `${opt.w}${str}`));
}

const len = Number(START_STEPS);
const values = new Array(len).fill()
  .reduce(
    (v) => v
      .flatMap((s) => digits
        .map((d) => [s, d]
          .join(''))),
    [''],
  );

const startStrings = values.map((str) => ({ z: validate2(str), str }));
const endStrings = iterate(0, Number(14 - START_STEPS));
const endsGrouped = START_STEPS === 0 ? { 0: endStrings.filter((o) => o.z === 0) } : endStrings.groupBy('z');

console.timeEnd('Preparation');

function solve1() {
  const starter = [...startStrings].reverse().find((s) => endsGrouped[s.z] !== undefined);
  if (!starter) {
    return 'Not found';
  }
  const endNumbers = endsGrouped[starter.z].map((o) => Number(o.str));
  const maxEnd = Math.max(...endNumbers);
  const solution = `${starter.str}${maxEnd}`;
  console.assert(validate(solution) === 0, 'Not a valid result');
  return solution;
}

function solve2() {
  const starter = startStrings.find((s) => endsGrouped[s.z] !== undefined);
  if (!starter) {
    return 'Not found';
  }
  const endNumbers = endsGrouped[starter.z].map((o) => Number(o.str));
  const minEnd = Math.max(...endNumbers);
  const solution = `${starter.str}${minEnd}`;
  console.assert(validate(solution) === 0, 'Not a valid result');
  return solution;
}

showTimedSolution(1, () => solve1());

showTimedSolution(2, () => solve2());
