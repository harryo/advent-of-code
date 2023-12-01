// import readFile from '../../helpers/readFile.js';
import readLines from '../../helpers/readLines.js';
import showTimedSolution from '../../helpers/showTimedSolution.js';

console.time('Preparation');

const ROCK = Symbol('Rock');
const PAPER = Symbol('Paper');
const SCISSORS = Symbol('Scissors');

const WIN = 6;
const DRAW = 3;
const LOSE = 0;

const shapeScore = {
  [ROCK]: 1,
  [PAPER]: 2,
  [SCISSORS]: 3,
};

function outcomeScore(player1, player2) {
  if (player1 === player2) {
    return DRAW;
  }
  switch (player1) {
    case ROCK:
      return player2 === PAPER ? WIN : LOSE;
    case SCISSORS:
      return player2 === ROCK ? WIN : LOSE;
    case PAPER:
      return player2 === SCISSORS ? WIN : LOSE;
    default:
      throw new Error('Invalid shape');
  }
}

function outcomeShape(player1, outcome) {
  if (outcome === DRAW) {
    return player1;
  }
  switch (player1) {
    case ROCK:
      return outcome === WIN ? PAPER : SCISSORS;
    case SCISSORS:
      return outcome === WIN ? ROCK : PAPER;
    case PAPER:
      return outcome === WIN ? SCISSORS : ROCK;
    default:
      throw new Error('Invalid shape');
  }
}

const translationTable = {
  A: ROCK,
  B: PAPER,
  C: SCISSORS,
  X: ROCK,
  Y: PAPER,
  Z: SCISSORS,
};

const outcomeTable = {
  X: LOSE,
  Y: DRAW,
  Z: WIN,
};

const data = readLines().map((s) => s.split(' '));

console.timeEnd('Preparation');

function solve1() {
  return data
    .map((p) => p.map((c) => translationTable[c]))
    .map(([player1, player2]) => outcomeScore(player1, player2) + shapeScore[player2])
    .reduce((a, b) => a + b, 0);
}

function solve2() {
  return data
    .map(([player1, outcome]) => [translationTable[player1], outcomeTable[outcome]])
    .map(([player1, outcome]) => outcome + shapeScore[outcomeShape(player1, outcome)])
    .reduce((a, b) => a + b, 0);
}

showTimedSolution(1, () => solve1());

showTimedSolution(2, () => solve2());
