const fs = require('fs');

const sample = 0;
const sampleFile = './sample.txt'
const inputFile = './input.txt'
const inputText = fs.readFileSync(sample ? sampleFile : inputFile, 'utf-8');
const inputData = inputText.split(/\n/).filter(Boolean);

let acc = 0;
let ptr = 0;
let cache = inputData.map(() => null);

function execLine(cmd) {
  if (!cmd) {
    throw new Error(`No command at ${ptr}`);
  }
  const [instruction, value] = cmd.split(/\s+/);
  switch (instruction) {
    case 'acc':
      acc += Number(value);
      ptr++;
      break;
    case 'jmp':
      ptr += Number(value);
      break;
    case 'nop':
      ptr++;
      break;
    default:
  }
}

function reset() {
  acc= 0;
  ptr = 0;
  cache = inputData.map(() => null);
  jmpChanged = null;
}

function tryRun(jmpIgnore) {
  reset();
  while (cache[ptr] === null) {
    cache[ptr] = acc;
    const cmd = inputData[ptr];
    execLine(cmd);
    if (ptr === inputData.length) {
      return acc;
    }
    if (ptr === jmpIgnore) {
      ptr ++;
    }
  }
  return null;
}

function run() {
  for( let i=0;  i < inputData.length; i ++ ) {
    if (inputData[i].startsWith('jmp')) {
      const result = tryRun(i);
      if (result !== null) {
        console.log('Found', i, result);
        break;
      }
    }
  }
}

run();
