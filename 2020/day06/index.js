const fs = require('fs');

const sample = 01;
const sampleFile = './sample.txt'
const inputFile = './input.txt'
const inputText = fs.readFileSync(sample ? sampleFile : inputFile, 'utf-8');
const inputData = inputText.split(/\n\n/).filter(Boolean);

function questions(str) {
  const persons = str.split(/\n/).map(p => p.split(''));
  return persons.slice(1).reduce((s, p) => s.filter(v => p.includes(v)), persons[0]);
  return persons;
}

function run() {
  const result = inputData.map(questions);
  // const number = valids.filter(Boolean).length;
  const sum =result.reduce((s, v) => s + v.length, 0)
  debugger
}

run();
