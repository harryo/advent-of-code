/**
 * Create Array of size n and fill with the index
 * @param {int} n
 * @returns
 */
function createArray(n) {
  if (typeof n === 'number') {
    return Array(n).fill().map((dummy, i) => i);
  }
  if (Array.isArray(n)) {
    const [min, max] = n;
    if (min > max) {
      return [];
    }
    const size = max - min + 1;
    return Array(size).fill().map((dummy, i) => i + min);
  }
  throw new Error('Invalid type', typeof n);
}

export default createArray;
