/**
 * Extends the Array class with a sortBy method
 * @param {string|function}
 * @returns
 */

function compare(a, b) {
  if (a > b) {
    return 1;
  }
  return a < b ? -1 : 0;
}

function sortBy(arg) {
  if (typeof arg === 'function') {
    return this.sort((a, b) => compare(arg(a), arg(b)));
  }
  if (typeof arg === 'string' && arg[0] === '-') {
    const prop = arg.slice(1);
    return this.sort((a, b) => compare(b[prop], a[prop]));
  }
  return this.sort((a, b) => compare(a[arg], b[arg]));
}

if (!Array.prototype.sortBy) {
  // eslint-disable-next-line no-extend-native
  Array.prototype.sortBy = sortBy;
}
