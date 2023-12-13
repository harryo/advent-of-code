import { readBlocks } from '../../helpers/readInput/index.js';
import timedLog from '../../helpers/timedLog.js';

const data = readBlocks().map((block) => block.split('\n'));

timedLog('Preparation');

function findVerticalAxis(block, smudges = 0) {
  const len = block[0].length;
  for (let i = 1; i < len; i++) {
    let nrSmudges = 0;
    const size = Math.min(i, len - i);
    for (let r = 0; r < block.length && nrSmudges <= smudges; r++) {
      for (let j = 0; j < size && nrSmudges <= smudges; j++) {
        if (block[r][i - j - 1] !== block[r][i + j]) {
          nrSmudges++;
        }
      }
    }
    if (nrSmudges === smudges) {
      return i;
    }
  }
  return 0;
}

function findHorizontalAxis(block, smudges = 0) {
  const len = block.length;
  for (let i = 1; i < len; i++) {
    let nrSmudges = 0;
    const size = Math.min(i, len - i);
    for (let c = 0; c < block[0].length && nrSmudges <= smudges; c++) {
      for (let j = 0; j < size && nrSmudges <= smudges; j++) {
        if (block[i - j - 1][c] !== block[i + j][c]) {
          nrSmudges++;
        }
      }
    }
    if (nrSmudges === smudges) {
      return i;
    }
  }
  return 0;
}

function solve1() {
  let sum = 0;
  data.forEach((block) => {
    sum += findVerticalAxis(block) || (100 * findHorizontalAxis(block));
  });
  return sum;
}

function solve2() {
  let sum = 0;
  data.forEach((block) => {
    sum += findVerticalAxis(block, 1) || (100 * findHorizontalAxis(block, 1));
  });
  return sum;
}

timedLog('Part 1:', solve1());
timedLog('Part 2:', solve2());
