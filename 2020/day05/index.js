import fs from 'fs';

const sample = 0;
const sampleFile = './sample.txt'
const inputFile = './input.txt'
const inputText = fs.readFileSync(sample ? sampleFile : inputFile, 'utf-8');
const inputData = inputText.split(/\n/).filter(Boolean);

conv = { F: 0, B: 1, R: 1, L: 0 };

function parse(str, from, to) {
  return parseInt(str.substring(from, to), 2);
}

function convertPass(str) {
  const bin = str.split('').map(c => conv[c]).join('');
  const row = parse(bin, 0, 7);
  const col = parse(bin, 7);
  const seat = parse(bin,);
  return seat;
  // return { row, col, seat };
}


function run() {
  const seats = inputData.map(convertPass);
  const max = Math.max(...seats);
  const before = seats.filter(s => s + 2 <= max && !seats.includes(s+1) && seats.includes(s+2));
  // const mine = before + 1;
  debugger
}

run();
