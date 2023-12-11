import { readMatrix } from '../../helpers/readInput/index.js';
import timedLog from '../../helpers/timedLog.js';

const data = readMatrix();
const isGalaxy = (loc) => loc.ch === '#';

const perRow = data.map((row) => row.filter(isGalaxy).length);
const perCol = data[0].map((d, c) => data.filter((row) => isGalaxy(row[c])).length);
const total = data.flat().filter(isGalaxy).length;

timedLog('Preparation');

const stepDistance = (d) => d * (total - d);

function directionDistance(list, exp) {
  let totalDistance = 0;
  let nFound = 0;
  list.forEach((n) => {
    totalDistance += stepDistance(nFound) * (n === 0 ? exp : 1);
    nFound += n;
  });
  return totalDistance;
}

function solve1() {
  return directionDistance(perRow, 2) + directionDistance(perCol, 2);
}

function solve2() {
  return directionDistance(perRow, 1000000) + directionDistance(perCol, 1000000);
}

timedLog('Part 1:', solve1());
timedLog('Part 2:', solve2());
