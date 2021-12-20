/* eslint-disable no-param-reassign */
/* eslint-disable prefer-destructuring */
// const readFile = require('../../helpers/readFile');
// const readLines = require('../../helpers/readLines');

require('../../helpers/forEach');
require('../../helpers/groupBy');
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
const relativeLocation = (l1, l2) => createArray(3).map((i) => l1[i] + l2[i]);

function getBeaconDistances(beacons) {
  const size = beacons.length;
  const sortedBeacons = [...beacons].sortBy((b) => b);
  return createArray(size)
    .flatMap((i) => createArray(size - i - 1)
      .map((j) => ({ loc: sortedBeacons[i], dist: beaconDiff(sortedBeacons[i], sortedBeacons[i + j + 1]) })));
}

function getPossibleOrigins(beacons, refBeaconDistances) {
  return getBeaconDistances(beacons)
    .map((beacon) => {
      const key = beacon.dist.toString();
      const ref = refBeaconDistances[key];
      return ref && beaconDiff(beacon.loc, ref[0].loc);
    })
    .filter(Boolean);
}

// Locate scanner
function locateScanner(scanner, ref) {
  const { beacons } = scanner;
  const { location, beaconDistances } = ref;
  return transformLocations(beacons)
    .some((trfb) => {
      const origins = getPossibleOrigins(trfb, beaconDistances);
      if (origins.length < 66) {
        return false;
      }
      scanner.location = relativeLocation(location, origins[0]);
      scanner.refBeacons = beacons;
      return true;
    });
}

function locateScanners() {
  const solved = [scanners[0]];
  let ptr = 0;

  while (solved.length < scanners.length && ptr < solved.length) {
    const ref = {
      beaconDistances: getBeaconDistances(solved[ptr].refBeacons).groupBy((d) => d.dist.toString()),
      location: solved[ptr].location,
    };
    scanners
      .filter((s) => !s.refBeacons && locateScanner(s, ref))
      .forEach((s) => solved.push(s));
    ptr++;
  }
}

// scanner 1:  68,-1246,-43
// scanner 2:  1105,-1205,1229
// scanner 3:  -92,-2380,-20
// scanner 4:  -20,-1133,1061

function countBeacons() {
  const allBeacons = scanners.flatMap((s) => s.refBeacons.map((b) => b.toString()));
  const unique = new Set(allBeacons);
  return unique.size;
}

console.time('Preparation');

console.timeEnd('Preparation');

function solve1() {
  locateScanners();
  return countBeacons();
}

function solve2() {
  return 'Pending';
}

showTimedSolution(1, () => solve1());

showTimedSolution(2, () => solve2());
