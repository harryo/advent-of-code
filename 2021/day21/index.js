// const readFile = require('../../helpers/readFile');
const readLines = require('../../helpers/readLines');
const showTimedSolution = require('../../helpers/showTimedSolution');

console.time('Preparation');

const positions = readLines().flatMap((line) => line.split(/\D+/).slice(-1).map((a) => Number(a[0])));

const advancePos = (pos, steps) => ((pos + steps - 1) % 10) + 1;

let dice = 0;
function roll() {
  let result = 0;
  Array(3).fill().forEach(() => {
    result += (dice % 100) + 1;
    dice++;
  });
  return result;
}

console.timeEnd('Preparation');

function play1(player, currentPos, otherPos, currentScore = 0, otherScore = 0) {
  const newPos = advancePos(currentPos, roll());
  const newScore = currentScore + newPos;
  return newScore < 1000
    ? play1(1 - player, otherPos, newPos, otherScore, newScore)
    : otherScore * dice;
}

function solve1() {
  return play1(0, ...positions);
}

const cache = {};

function play2(player, currentPos, otherPos, currentScore = 0, otherScore = 0) {
  const key = [player, currentPos, otherPos, currentScore, otherScore].join('|');
  if (cache[key]) {
    return cache[key];
  }
  const wins = [0, 0];
  for (let i = 1; i <= 3; i++) {
    for (let j = 1; j <= 3; j++) {
      for (let k = 1; k <= 3; k++) {
        const newPos = advancePos(currentPos, i + j + k);
        const newScore = currentScore + newPos;
        if (newScore >= 21) {
          wins[player]++;
        } else {
          const newWins = play2(1 - player, otherPos, newPos, otherScore, newScore);
          newWins.forEach((v, w) => {
            wins[w] += v;
          });
        }
      }
    }
  }
  cache[key] = wins;
  return wins;
}

function solve2() {
  const scores = [0, 0];
  const wins = play2(0, ...positions, scores[0], scores[1]);
  return Math.max(...wins);
}

showTimedSolution(1, () => solve1());

showTimedSolution(2, () => solve2());
