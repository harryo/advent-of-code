function getNumbers(str) {
  return str.match(/[-\d]+/g)?.map(Number);
}

module.exports = getNumbers;
