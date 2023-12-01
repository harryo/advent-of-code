import fs from 'fs';

const sample = 0;
const sampleFile = './sample.txt'
const inputFile = './input.txt'
const inputText = fs.readFileSync(sample ? sampleFile : inputFile, 'utf-8');
const inputData = inputText.split(/\n/);
const rMax = inputData.length;
const cMax = inputData[0].length;
let stable = false;

function initDirections() {
  const steps = [-1, 0, 1];
  const result = [];
  for (let dr of steps) {
    for (let dc of steps) {
      if (dr !== 0 || dc !== 0 ) {
        result.push({ dr, dc });
      }
    }
  }
  return result;
}

const directions = initDirections();

function loopNeighbours(r, c, data, max) {
  let count = 0;
  function checkDirection(dir) {
    const { dr, dc } = dir;
    function testDirection(i) {
      const ri = r + (i * dr);
      const ci = c + (i * dc);
      return data[ri] && data[ri][ci];
    }
    let i = 0;
    let ch = '';
    do {
      ch = testDirection(++i);
    } while (ch === '.');
    return ch === '#';
  }

  for (let i = 0; i < directions.length; i++) {
    if ( checkDirection(directions[i]) && ++count >= max) {
      return true;
    }
  }
  return false;
}

function newStatus(r, c, data, ch) {
  switch (ch) {
    case '.':
      return '.';
    case 'L':
      // Occupy if no neighbours
      return loopNeighbours(r, c, data, 1) ? 'L' : '#';
      break;
    case '#':
      // Empty if 5 or more neighbours
      return loopNeighbours(r, c, data, 5) ? 'L' : '#';
  }
}

function seat(org) {
  const result = [];
  let countChanges = 0;
  let countOccupied = 0;
  for (let r = 0; r < rMax; r++) {
    const str = [];
    for (let c = 0; c < cMax; c++) {
      const c0 = org[r][c];
      const c1 = newStatus(r, c, org, c0);
      if (c1 === '#') {
        countOccupied ++;
      }
      if (c1 !== c0) {
        countChanges++;
      }
      str.push(c1);
    }
    result.push(str.join(''));
  }
  console.log('counts', { countChanges, countOccupied });
  if (countChanges === 0) {
    stable = true;
  }
  return result;
}

function run() {
  let currentSeats = inputData;
  do {
    currentSeats = seat(currentSeats);
  } while (!stable);
  debugger;
}

run();
