/**
 * Extends the Object class with a forEach method
 * @param {*} callback  (value, key) => {...}
 * @returns
 */

function forEach(callback) {
  return Object.entries(this).forEach(([key, value]) => callback(value, key));
}

if (!Object.prototype.forEach) {
  // eslint-disable-next-line no-extend-native
  Object.prototype.forEach = forEach;
}
