const fs = require('fs');

const sample = 0;
const sampleFile = './sample.txt'
const inputFile = './input.txt'
const inputText = fs.readFileSync(sample ? sampleFile : inputFile, 'utf-8');
const inputData = inputText.split(/\n/).map(Number).sort((a, b) => b - a );

const allNumbers = new Set(inputData);

function countFor(n) {
  if (!allNumbers.has(n)) {
    return 0;
  }
  if (!cache[n]) {
    const ds = [1, 2, 3];
    cache[n] = ds.reduce((s, v) => s + countFor(v + n), 0);
  }
  return cache[n];
}

function run() {
  let steps = [...inputData.slice(1), 0]
  const nPaths = { [inputData[0]]: 1 } 
  steps.forEach(v => {
    nPaths[v] = [1, 2, 3].reduce((s, d) => s + (nPaths[v + d] || 0), 0);
  })
  debugger;
}

run();
