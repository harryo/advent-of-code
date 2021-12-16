/**
 * Create Array of size n and fill with the index
 * @param {int} n
 * @returns
 */
const createArray = (n) => Array(n).fill().map((dummy, i) => i);

module.exports = createArray;
