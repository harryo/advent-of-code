import readLines from './readLines.js';

const readMatrix = () => readLines()
  .map((row, r) => Array.from(row)
    .map((ch, c) => ({
      r, c, ch, i: r * row.length + c,
    })));

export default readMatrix;
