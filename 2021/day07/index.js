import readFile from '../../helpers/readFile.js';
import showTimedSolution from '../../helpers/showTimedSolution.js';

const source = readFile().split(/\D+/).filter(Boolean).map(Number);

function sumFuel1(pos) {
  return source.reduce((sum, val) => sum + Math.abs(val - pos), 0);
}

function solve1() {
  // Looking for the median value, i.e. the value for which there are as many lower as higher.
  // Cast to TypedArray to ensure proper sorting
  const sorted = new Uint16Array(source).sort();
  const medianIndex = Math.floor(source.length / 2);
  return sumFuel1(sorted[medianIndex]);
}

// Fuel consumption series, calculate with cache;
const fuelCache = [0];
function fuel(n) {
  if (fuelCache[n] === undefined) {
    for (let i = fuelCache.length; i <= n; i++) {
      fuelCache[i] = fuelCache[i - 1] + i;
    }
  }
  return fuelCache[n];
}

function sumFuel2(pos) {
  return source.reduce((sum, val) => sum + fuel(Math.abs(val - pos)), 0);
}

function solve2() {
  // Brute force, loop through positions until fuel starts increasing
  let pos = 0;
  let lastFuel = sumFuel2(0);
  let minFuel = lastFuel;
  while (lastFuel <= minFuel) {
    minFuel = lastFuel;
    pos++;
    lastFuel = sumFuel2(pos);
  }
  return minFuel;
}

showTimedSolution(1, () => solve1());

showTimedSolution(2, () => solve2());
