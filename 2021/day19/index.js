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

const beaconDiff = (b1, b2) => createArray(3).map((i) => b2[i] - b1[i]);

function getBeaconDistances(beacons) {
  const size = beacons.length;
  return createArray(size)
    .map((i) => createArray(size)
      .filter((j) => i !== j)
      .map((j) => ({ loc: beacons[i], dist: beaconDiff(beacons[i], beacons[j]) })));
}

// Make scanner 0 the references for location and orientation
Object.assign(scanners[0], { location: [0, 0, 0], orientation: 0 });

const allBeaconDistances = scanners
  .flatMap((scanner, i) => {
    const options = i === 0 ? [scanner.beacons] : transformLocations(scanner.beacons);
    return options
      .flatMap((l, j) => getBeaconDistances(l)
        .flatMap((o) => o
          .map((d) => ({
            ...d, scanner, si: i, oi: j,
          }))));
  });

const byDistance = {};
allBeaconDistances.forEach((d) => {
  const key = d.dist.toString();
  if (byDistance[key]) {
    byDistance[key].push(d);
  } else {
    byDistance[key] = [d];
  }
});

const seenByMore = Object.keys(byDistance)
  .filter((d) => {
    const list = byDistance[d];
    return new Set(list.map((s) => s.si)).size > 1;
  })
  .map((d) => byDistance[d]);

const seenByRef = Object.keys(byDistance)
  .filter((d) => {
    const list = byDistance[d];
    return list.some((s) => s.si === 0) && list.some((s) => s.si !== 0);
  })
  .map((d) => byDistance[d]);

debugger;
function getPossibleOrigins(beacons) {
  const result = [];
  getBeaconDistances(beacons).forEach((beacon, dist) => {
    const ref = refBeaconDistances[dist];
    if (ref) {
      result.push(beaconDiff(beacon, ref));
    }
  });
  return result.lenght > 0 && result;
}

// Locate scanner
function locateScanner(scanner) {
  const { beacons } = scanner;
  const options = transformLocations(beacons);
  const possibleOrigins = options.map(getPossibleOrigins).filter(Boolean);
  debugger;
}

locateScanner(scanners[2]);

console.time('Preparation');

console.timeEnd('Preparation');

function solve1() {
  return 'Pending';
}

function solve2() {
  return 'Pending';
}

showTimedSolution(1, () => solve1());

showTimedSolution(2, () => solve2());
