const readLines = require('./readLines');

const readMatrix = () => readLines().map((row, r) => Array.from(row).map((ch, c) => ({ r, c, ch })));

module.exports = readMatrix;
