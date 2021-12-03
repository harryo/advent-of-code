const fs = require('fs');

const sample = 1;
const sampleFile = './sample.txt';
const inputFile = './input.txt';
const inputText = fs.readFileSync(sample ? sampleFile : inputFile, 'utf-8');
const inputData = inputText.split(/\r?\n/).filter(Boolean);

function isTree(x, y) {
  const row = inputData[y];
  if (!row) {
    throw new Error(`No row at index ${y}`);
  }
  const cell = row[x % row.length];
  return cell === '#';
}

function slope([dx, dy]) {
  let x = 0;
  let y = 0;
  let treeCount = 0;
  while (y < inputData.length) {
    const tree = isTree(x, y);
    if (tree) {
      treeCount++;
    }
    x += dx;
    y += dy;
  }
  console.log(dx, dy, treeCount);
  return treeCount;
}

function multiSlope(slopes) {
  return slopes.reduce((p, v) => p * slope(v), 1);
}

const slopes = [[1, 1], [3, 1], [5, 1], [7, 1], [1, 2]];

function run() {
  const product = multiSlope(slopes);
  console.log(product);
}

run();
