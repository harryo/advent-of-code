const { DIRECTIONS_ALL } = require('../../helpers/getAdjacent');
const { readLines } = require('../../helpers/readInput');
const timedLog = require('../../helpers/timedLog');

const data = readLines();
const INITIALPOSITIONS = [];

data.forEach((row, r) => row.split('')
  .forEach((char, c) => {
    if (char === '#') {
      INITIALPOSITIONS.push([r, c]);
    }
  }));

const DIRECTIONS = [[-1, 0], [1, 0], [0, -1], [0, 1]] // N, S, W, E
  .map((dir) => {
    const i = dir.findIndex((v) => v !== 0);
    return {
      dir,
      adj: DIRECTIONS_ALL.filter((d) => d[i] === dir[i]),
    };
  });
timedLog('Preparation');

function getPositions(elves) {
  return new Set(elves.map((e) => e.pos.join(',')));
}

function isFree(pos, positions) {
  const result = !positions.has(pos.join(','));
  return result;
}

function addDir(pos, dir) {
  const result = [pos[0] + dir[0], pos[1] + dir[1]];
  return result;
}

function allFree(pos, dirs, positions) {
  const result = dirs.every((d) => isFree(addDir(pos, d), positions));
  return result;
}

function proposeMove(elf, positions, directions) {
  if (allFree(elf.pos, DIRECTIONS_ALL, positions)) {
    return null;
  }
  return directions.find((d) => allFree(elf.pos, d.adj, positions));
}

function getMinMax(elves) {
  const min = [Infinity, Infinity];
  const max = [-Infinity, -Infinity];
  elves.forEach((elf) => {
    min[0] = Math.min(min[0], elf.pos[0]);
    min[1] = Math.min(min[1], elf.pos[1]);
    max[0] = Math.max(max[0], elf.pos[0]);
    max[1] = Math.max(max[1], elf.pos[1]);
  });
  return { min, max };
}

// function print(elves) {
//   const { min, max } = getMinMax(elves);
//   const rows = [];
//   for (let r = min[0]; r <= max[0]; r += 1) {
//     const row = [];
//     for (let c = min[1]; c <= max[1]; c += 1) {
//       row.push(elves.find((e) => e.pos[0] === r && e.pos[1] === c) ? '#' : '.');
//     }
//     rows.push(row.join(''));
//   }
//   console.log(rows.join('\n'));
// }

function round(elves, directions) {
  const proposedPositions = {};
  let movesCount = 0;
  const positions = getPositions(elves);
  elves.forEach((elf) => {
    const move = proposeMove(elf, positions, directions);
    if (move) {
      const newPos = addDir(elf.pos, move.dir);
      const key = newPos.join(',');
      if (proposedPositions[key]) {
        proposedPositions[key].push(elf);
      } else {
        proposedPositions[key] = [elf];
      }
    }
  });
  Object.keys(proposedPositions).forEach((key) => {
    const candidates = proposedPositions[key];
    if (candidates.length === 1) {
      movesCount++;
      candidates[0].pos = key.split(',').map(Number);
    }
  });
  const lastDir = directions.shift();
  directions.push(lastDir);
  return movesCount;
}

function spread(max = Infinity) {
  const elves = INITIALPOSITIONS.map((pos) => ({ pos }));
  const directions = DIRECTIONS.slice();
  let roundCount = 0;
  while (roundCount < max) {
    roundCount += 1;
    const movesCount = round(elves, directions);
    // console.log('Round', roundCount, 'moves', movesCount);
    // print(elves);
    if (movesCount === 0) {
      break;
    }
  }
  return { elves, roundCount };
}

function solve1() {
  const { elves } = spread(10);
  const { min, max } = getMinMax(elves);
  const size = [0, 1].map((i) => max[i] - min[i] + 1).reduce((a, b) => a * b, 1);
  return size - elves.length;
}

function solve2() {
  const { roundCount } = spread();
  return roundCount;
}

timedLog('Part 1:', solve1());
timedLog('Part 2:', solve2());
