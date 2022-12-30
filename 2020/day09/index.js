import fs from 'fs';
import { userInfo } from 'os';

const sample = 0;
const sampleFile = './sample.txt'
const inputFile = './input.txt'
const inputText = fs.readFileSync(sample ? sampleFile : inputFile, 'utf-8');
const inputData = inputText.split(/\n/).filter(Boolean);
const inputNumbers = inputData.map(Number);

function run() {
  const size = inputNumbers[0];
  let i = 0;
  let found;
  let preamble;
  let sum;
  let ctgSum;
  do {
    i++;
    const j = i + size;
    preamble = inputNumbers.slice(i, j);
    sum = inputNumbers[j];
    found = preamble.slice(0, -1).some((v, k) => preamble.slice(k + 1).includes(sum - v));
  } while (found);
  i = 0;
  do {
    i++;
    j = i;
    ctgSum = 0;
    while (ctgSum < sum) {
      ctgSum += inputNumbers[j++];
    }
  } while (ctgSum > sum);
  const range = inputNumbers.slice(i, j);
  const min = Math.min(...range);
  const max = Math.max(...range);
  console.log(i, j, sum, range, min, max, min + max);
  debugger;
}

run();
