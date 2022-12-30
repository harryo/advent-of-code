/**
 * solve2
 * @param {array} data
 * @returns count sequences of 3 values with sum larger than the previous values
 * create array of sums of 3 values, then apply original solve function
 */

import solve1 from './solve1.js';

function arraySum(arr) {
  return arr.reduce((sum, value) => sum + value, 0);
}

function solve2(data, range) {
  const endOfSums = data.slice(range - 1);

  // get the sum of values idx...idx+range-1
  function sumRange(idx) {
    return arraySum(data.slice(idx, idx + range));
  }

  const slidingSums = endOfSums.map((dummy, idx) => sumRange(idx));

  return solve1(slidingSums);
}

export default solve2;
