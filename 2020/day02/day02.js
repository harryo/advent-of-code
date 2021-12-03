const fs = require('fs');

const inputText = fs.readFileSync('./day02.txt', 'utf-8');
const inputData = inputText.split(/\r?\n/);

function parseLine(line) {
  const match = line.match(/(\d+)-(\d+) (\w): (\w+)/);
  const [minStr, maxStr, ch, str] = match.slice(1);
  const min = Number(minStr);
  const max = Number(maxStr);
  return { min, max, ch, str }; 
}

function isValid({ min, max, ch, str}) {
  return [min, max].filter(i => str[i-1] === ch).length === 1;
} 

let count = 0;
inputData.forEach(line => {
  const parsed = parseLine(line);
  console.log(line, isValid(parsed));
  if (isValid(parsed)) {
    count ++;
  }
});
console.log(count);

