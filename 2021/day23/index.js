import createArray from '../../helpers/createArray.js';
import readLines from '../../helpers/readLines.js';
import showTimedSolution from '../../helpers/showTimedSolution.js';
import { types, energyReq } from './constants.js';
import readParseInput from './readParseInput.js';

console.time('Preparation');
const input = readLines();
console.timeEnd('Preparation');

function findLeastEnergy(lines) {
  const matrix = lines.map((row, r) => Array.from(row).map((ch, c) => ({ r, c, ch })));
  const { fields, roomCols } = readParseInput(matrix);
  const isSolved = (positions) => (f) => f.rule === positions[f.i];
  const checkSolved = (positions) => fields.filter((f) => types.includes(f.rule)).every(isSolved(positions));
  const lastEnergies = {};
  const queue = [];
  let minEnergy = Infinity;

  const hallway = matrix[1];

  // function dump(positions) {
  //   console.log(matrix.map((row) => row.map((f) => positions[f.i] || f.ch).join('')).join('\n'));
  // }

  function movesOut(from, positions) {
    // Can move out?
    if (createArray([1, from.r - 1]).some((r) => positions[matrix[r][from.c].i] !== '.')) {
      return [];
    }
    const vSteps = from.r - 1;
    const result = [];
    const isFree = (c) => hallway[c].ch === '.' && positions[hallway[c].i] === '.';
    for (let i = 1; isFree(from.c + i); i++) {
      if (!roomCols.includes(from.c + i)) {
        result.push({ from, to: hallway[from.c + i], steps: i + vSteps });
      }
    }
    for (let i = 1; isFree(from.c - i); i++) {
      if (!roomCols.includes(from.c - i)) {
        result.push({ from, to: hallway[from.c - i], steps: i + vSteps });
      }
    }
    return result;
  }

  function movesIn(from, positions) {
    const ch = positions[from.i];
    const col = roomCols[types.indexOf(ch)];
    const room = matrix.map((r) => r[col]).slice(2, -1);
    const firstOccupied = room.findIndex((f) => positions[f.i] !== '.');
    if (firstOccupied === 0) {
      return []; // No free space
    }
    const isEmpty = firstOccupied === -1;
    if (!isEmpty && room.slice(firstOccupied).some((f) => positions[f.i] !== ch)) {
      return []; // Still other amphipods in room
    }
    const to = isEmpty ? room[room.length - 1] : room[firstOccupied - 1];
    // Check if column can be reached
    const vSteps = to.r - 1;
    if (from.c === to.c) {
      return [{ from, to, steps: vSteps }];
    }
    const path = from.c < to.c ? hallway.slice(from.c + 1, to.c + 1) : hallway.slice(to.c, from.c);
    return (path.some((s) => types.includes(positions[s.i]))) ? []
      : { from, to, steps: Math.abs(from.c - to.c) + vSteps };
  }

  function isHome(field, positions) {
    if (field.r === 1) {
      return false; // in hallway
    }
    if (field.rule !== positions[field.i]) {
      return false; // in wrong room
    }
    if (field.r === 3) {
      return true; // bottom row always fine
    }
    return positions[matrix[3][field.c]] === field.rule; // top row only if bottom row matches
  }

  function getMoves(positions) {
    return fields
      .filter((f) => positions[f.i] !== '.') // Only fields with amphipods
      .filter((f) => !isHome(f, positions)) // skip solved fields
      .flatMap((f) => (f.r === 1 ? movesIn(f, positions) : movesOut(f, positions)));
  }

  function makeKey(positions) {
    return positions.join('').replace(/\.{2,}/g, (s) => s.length);
  }

  function makeMove(move, positions, energy) {
    const { from, to, steps } = move;
    const ch = positions[from.i];
    const newPositions = [...positions];
    newPositions[from.i] = '.';
    newPositions[to.i] = ch;
    const str = makeKey(newPositions);
    const newEnergy = energy + energyReq[ch] * steps;
    return { str, newPositions, newEnergy };
  }

  function iterate(state) {
    const { positions, energy, level } = state;
    const moves = getMoves(positions);
    moves.forEach((move) => {
      const { newPositions, str, newEnergy } = makeMove(move, positions, energy);
      const lastEnergy = lastEnergies[str];
      if (lastEnergy <= newEnergy) {
        return;
      }
      lastEnergies[str] = newEnergy;
      if (checkSolved(newPositions)) {
        if (newEnergy < minEnergy) {
          minEnergy = newEnergy;
        }
        return;
      }
      const nextState = { positions: newPositions, energy: newEnergy, level: level + 1 };
      const idx = queue.findIndex((s) => s.energy >= newEnergy);
      if (idx === -1) {
        queue.push(nextState);
      } else {
        queue.splice(idx, 0, nextState);
      }
    });
  }

  const positions = fields.map((f) => f.ch);
  queue.push({ positions, energy: 0, level: 0 });
  lastEnergies[makeKey(positions)] = 0;
  while (queue.length > 0) {
    const state = queue.shift();
    if (state.energy >= minEnergy) {
      break;
    }
    // console.log(state.level, state.energy);
    // dump(state.positions);
    iterate(state);
  }
  console.log(Object.keys(lastEnergies).length);
  return minEnergy;
}

function solve1() {
  return findLeastEnergy(input);
}

function solve2() {
  const lines = [
    ...input.slice(0, 3),
    '  #D#C#B#A#',
    '  #D#B#A#C#',
    ...input.slice(3),
  ];
  return findLeastEnergy(lines);
}

showTimedSolution(1, () => solve1());

showTimedSolution(2, () => solve2());
