const { steps } = require('./commands');

/**
 * Analyzing the processing of each digit
 * @param {int} w  integer read, must be 1-9
 * @param {*} z  result of previous
 * @param {*} divz value used in dividing z, line 5
 * @param {*} addx value added to x, line 6
 * @param {*} addy value added to y, line 16
 * @returns result, integer
 */
function processDigit(w, z, divz, addx, addy) {
  const x = (z % 26) + addx; // lines 2,3,4,6
  let result = Math.trunc(z / divz); // line 5
  if (w !== x) { // lines 7, 8
    result *= 26; // line 9 - 13,
    result += w + addy; // line 14-17
  }
  return result;
}

function validate2(value, offset = 0, z = 0) {
  const input = Array.from(value.toString()).map(Number);
  return steps.slice(offset).slice(0, value.toString().length)
    .reduce((acc, step, i) => processDigit(input[i], acc, ...step), z);
}

module.exports = { processDigit, validate2 };
