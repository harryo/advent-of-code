import fs from 'fs';

const inputText = fs.readFileSync('./day01.txt', 'utf-8');
const inputData = inputText.split(/\D+/).filter(Boolean).map(Number);
const LEN = inputData.length;
const SUM = 2020;
const N = 2;

function findComplement(i0 = 0, sum = SUM, n = N) {
  for (let i = i0;  i < LEN; i ++) {
    const v = inputData[i];
    if (n == 1) {
      if (v === sum) {
        return [v];
      }
      continue;
    }
    const r = findComplement(i + 1, sum - v, n - 1);
    if (r) {
      return [v, ...r];
    }
  }
  return null;
}

const result = findComplement(0, 2020, 3);
const product = result.reduce((p, v) => p * v, 1);

console.log (result, product);

