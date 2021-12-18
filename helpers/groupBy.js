/**
 * Extends the Array class with a groupBy method
 * @param {string|function}
 * @returns
 */

function groupBy(arg) {
  const getKey = ((o) => (typeof arg === 'function' ? arg(o) : o[arg]));
  const result = {};
  this.forEach((o) => {
    const key = getKey(o);
    if (result[key]) {
      result[key].push(o);
    } else {
      result[key] = [o];
    }
  });
  return result;
}

if (!Array.prototype.groupBy) {
  // eslint-disable-next-line no-extend-native
  Array.prototype.groupBy = groupBy;
}
