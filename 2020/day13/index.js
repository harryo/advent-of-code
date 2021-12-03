const fs = require('fs');

const sample = 0;
const sampleFile = './sample.txt';
const inputFile = './input.txt';
const inputText = fs.readFileSync(sample ? sampleFile : inputFile, 'utf-8');
const inputData = inputText.split(/\n/);

function run() {
  const lines = inputData[1].split(',').map(Number);
  let ts = 0;
  let step = 1;
  lines.forEach((id, i) => {
    if (Number.isNaN(id)) {
      return;
    }
    while ((ts + i) % id !== 0) {
      ts += step;
    }
    step = lcm(step, id);
  });
  console.log('Earliest', ts);
}

run();

function lcm(x, y) {
  if ((typeof x !== 'number') || (typeof y !== 'number')) return false;
  return (!x || !y) ? 0 : Math.abs((x * y) / gcd(x, y));
}

function gcd(x, y) {
  x = Math.abs(x);
  y = Math.abs(y);
  while (y) {
    const t = y;
    y = x % y;
    x = t;
  }
  return x;
}
