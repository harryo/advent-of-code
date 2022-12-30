import readLines from './readLines.js';

const readMatrix = () => readLines().map((row, r) => Array.from(row).map((ch, c) => ({ r, c, ch })));

export default readMatrix;
