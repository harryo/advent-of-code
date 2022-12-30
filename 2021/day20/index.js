import readFile from '../../helpers/readFile.js';
// import readLines from '../../helpers/readLines.js';
import showTimedSolution from '../../helpers/showTimedSolution.js';

const BORDER = 52; // At least max. iterations + 2

console.time('Preparation');

const [algorithm, imageBlock] = readFile().replace(/\./g, '0')
  .replace(/#/g, '1')
  .split(/\n\n/)
  .filter(Boolean);

const initialImage = frame(imageBlock.split(/\n/), BORDER);

function dump(tbl) {
  console.log('\nDump\n');
  console.log(tbl.map((r) => r.replace(/0/g, '.').replace(/1/g, '#')).join('\n'));
}

/**
 * Create a frame of empty cells around the image
 * @param {*} img
 * @param {*} border
 * @returns
 */
function frame(img, border) {
  const width = img[0].length + border * 2;
  const side = '0'.repeat(border);
  return [
    ...Array(border).fill('0'.repeat(width)),
    ...img.map((row) => `${side}${row}${side}`),
    ...Array(border).fill('0'.repeat(width)),
  ];
}

/**
 * To avoid border effect, i.e. simulate infinitely large, replace border with cell just inside
 * @param {*} arr
 * @returns
 */
function restoreLine(arr) {
  if (Array.isArray(arr)) {
    return [arr[1], ...arr.slice(1, -1), arr[1]];
  }
  return restoreLine(Array.from(arr)).join('');
}

function restoreBorder(img) {
  return restoreLine(img.map(restoreLine));
}

function enhance(img) {
  const source = frame(img, 1);
  const enhanced = img
    .map((row, r) => Array.from(row)
      .map((ch, c) => {
        const str = [0, 1, 2].map((d) => source[r + d].slice(c, c + 3)).join('');
        const index = parseInt(str, 2);
        return algorithm[index];
      }).join(''));
  // Remove border effects
  const result = restoreBorder(enhanced);
  // dump(result);
  return result;
}

function countLit(img) {
  return img.flatMap((r) => r.split('')).filter(Number).length;
}

console.timeEnd('Preparation');

function solve1() {
  return countLit(Array(2).fill().reduce(enhance, initialImage));
}

function solve2() {
  return countLit(Array(50).fill().reduce(enhance, initialImage));
}

showTimedSolution(1, () => solve1());

showTimedSolution(2, () => solve2());
