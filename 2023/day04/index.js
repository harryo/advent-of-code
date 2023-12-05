import { readLines } from '../../helpers/readInput/index.js';
import timedLog from '../../helpers/timedLog.js';

const data = readLines();

const cards = data.map((line) => {
  const [id, rest] = line.split(/:\s+/);
  const [winners, current] = rest.split(/\s*\|\s*/).map((s) => s.split(/\s+/).map(Number));
  return { id, winners: new Set(winners), current };
});


function matchCount({ winners, current }) {
  return current.filter(c => winners.has(c)).length;
}

function cardScore({ id, winners, current }) {
  const len = matchCount({ winners, current });
  const score = len === 0 ? 0 : 2 ** (len - 1);
  return score;
}

timedLog('Preparation');

function solve1() {
  return cards.reduce((acc, card) => acc + cardScore(card), 0);
}

function solve2() {
  let sum = 0;
  const cardCounts = new Array(cards.length).fill(1);
  cards.forEach((card, i) => {
    sum += cardCounts[i];
    const max = Math.min(cards.length, i + 1 + matchCount(card));
    for (let j = i + 1; j < max; j++) {
      cardCounts[j] += cardCounts[i];
    }
  });
  return sum;
}

timedLog('Part 1:', solve1());
timedLog('Part 2:', solve2());
