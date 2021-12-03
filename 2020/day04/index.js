const fs = require('fs');

const sample = 0;
const sampleFile = './sample.txt'
const inputFile = './input.txt'
const inputText = fs.readFileSync(sample ? sampleFile : inputFile, 'utf-8');
const inputData = inputText.split(/\n\n/).filter(Boolean);

const between = (min, max) => val => val >= min && val <= max;

const required = [
 { id: 'byr', test: between(1920, 2002) },
 { id: 'iyr', test: between(2010, 2020) },
 { id: 'eyr', test: between(2020, 2030) },
 { id: 'hgt', test: (v) => {
   const match = v.match(/^(\d+)(cm|in)$/);
   if (!match) {
     return false;
   }
   return match[2] === 'cm' ? between(150, 193)(Number(match[1])) : between(59, 76)(Number(match[1]));
 } },
 { id: 'hcl', test:  v => /^#[0-9a-f]{6}$/.test(v) },
 { id: 'ecl', test: v => ['amb', 'blu', 'brn', 'gry', 'grn', 'hzl', 'oth'].includes(v) },
 { id: 'pid', test: v => /^\d{9}$/.test(v) }
]

function checkPassport(txt) {
  const fields = {};
  txt.split(/\s+/).forEach(s => { 
    const [key, value] = s.split(':');
    fields[key] = value;
  });
  return required.every(f => fields[f.id] && f.test(fields[f.id]))
}

function run() {
  const valids = inputData.map(checkPassport);
  const number = valids.filter(Boolean).length;
  debugger
}

run();
