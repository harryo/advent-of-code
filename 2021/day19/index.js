/* eslint-disable no-param-reassign */
/* eslint-disable prefer-destructuring */
// const readFile = require('../../helpers/readFile');
// const readLines = require('../../helpers/readLines');

require('../../helpers/sortBy');
const createArray = require('../../helpers/createArray');
const readBlocks = require('../../helpers/readBlocks');
const showTimedSolution = require('../../helpers/showTimedSolution');
const { transformLocations } = require('./orientations');

const scanners = readBlocks()
  .map((blk) => blk
    .split(/\n/)
    .slice(1)
    .map((line) => line.split(',')
      .map(Number)))
  .map((beacons) => ({ beacons }));

// Make scanner 0 the references for location and orientation
Object.assign(scanners[0], { location: [0, 0, 0], refBeacons: scanners[0].beacons });

const beaconDiff = (b1, b2) => createArray(3).map((i) => b2[i] - b1[i]);
const addLocation = (loc, b) => createArray(3).map((i) => loc[i] + b[i]);
const manhattanDistance = (p1, p2) => createArray(3).reduce((s, i) => s + Math.abs(p1[i] - p2[i]), 0);

/**
 * Get distance in each direction from each beacon to all other beacons with higher x
 * @param {*} beacons
 * @returns
 */
function getBeaconDistances(beacons) {
  const size = beacons.length;
  // Get beacon distances, order by lowest x of on end, only when at least 11 other points with higher x
  const sortedBeacons = [...beacons].sortBy((b) => b);
  return createArray(size - 11)
    .map((i) => ({
      loc: sortedBeacons[i],
      distances: createArray(size - i - 1)
        .map((j) => beaconDiff(sortedBeacons[i], sortedBeacons[i + j + 1]).toString()),
    }));
}

function countOverlap(a1, a2) {
  return a1.filter((d) => a2.includes(d)).length;
}

function checkMatchingDistances(beacons, refBeaconDistances) {
  const beaconDistances = getBeaconDistances(beacons);
  let result;
  beaconDistances
    .some((distancesFromLocation) => refBeaconDistances
      .some((distancesFromRef) => {
        const overlap = countOverlap(distancesFromLocation.distances, distancesFromRef.distances);
        const found = overlap >= 11;
        if (found) {
          result = beaconDiff(distancesFromLocation.loc, distancesFromRef.loc);
        }
        return found;
      }));
  return result;
}

// Locate scanner
function locateScanner(scanner, refBeaconDistances) {
  const { beacons } = scanner;
  return transformLocations(beacons)
    .some((trfb) => {
      const location = checkMatchingDistances(trfb, refBeaconDistances);
      if (location) {
        scanner.location = location;
        scanner.refBeacons = trfb.map((b) => addLocation(location, b));
        return true;
      }
      return false;
    });
}

function locateScanners() {
  const solved = [scanners[0]];
  let ptr = 0;
  while (solved.length < scanners.length && ptr < solved.length) {
    const refBeaconDistances = getBeaconDistances(solved[ptr].refBeacons);
    scanners
      .filter((s, i) => !s.refBeacons && locateScanner(s, refBeaconDistances, i))
      .forEach((s) => solved.push(s));
    ptr++;
  }
}

console.time('Preparation');

locateScanners();

console.timeEnd('Preparation');

function solve1() {
  const allBeacons = scanners.flatMap((s) => s.refBeacons.map((b) => b.toString()));
  const unique = new Set(allBeacons);
  return unique.size;
}

function solve2() {
  let maxDist = 0;
  scanners.forEach((s1, i) => scanners.slice(i + 1).forEach((s2) => {
    const mDist = manhattanDistance(s1.location, s2.location);
    if (mDist > maxDist) {
      maxDist = mDist;
    }
  }));
  return maxDist;
}

showTimedSolution(1, () => solve1());

showTimedSolution(2, () => solve2());
