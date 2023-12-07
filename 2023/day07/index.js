import { readLines } from '../../helpers/readInput/index.js';
import timedLog from '../../helpers/timedLog.js';

const data = readLines().map((l) => l.split(/\s+/));
const len = data.length;

const symbols1 = '23456789TJQKA';
const symbols2 = 'J23456789TQKA';
const types = 'high,pair,twoPairs,three,fullHouse,four,five'.split(',');

function getType(values) {
  if (values.includes(5)) {
    return 'five';
  }
  if (values.includes(4)) {
    return 'four';
  }
  if (values.includes(3)) {
    return values.includes(2) ? 'fullHouse' : 'three';
  }
  if (values.length === 3) {
    return 'twoPairs';
  }
  return values.includes(2) ? 'pair' : 'high';
}

function findType(hand, joker) {
  const cards = {};
  let jokers = 0;
  hand.split('').forEach((card) => {
    if (card === joker) {
      jokers++;
    } else {
      cards[card] = (cards[card] ?? 0) + 1;
    }
  });
  const values = jokers === 5 ? [0] : Object.values(cards).sort((a, b) => b - a);
  values[0] += jokers;
  const type = getType(values);
  const result = types.indexOf(type) + 1;
  return result;
}

function sorter(a, b) {
  for (let i = 0; i < a.score.length; i++) {
    const result = b.score[i] - a.score[i];
    if (result !== 0) {
      return result;
    }
  }
  return 0;
}

timedLog('Preparation');

function solve1() {
  const scoredCards = data.map((line) => ({
    hand: line[0],
    bid: Number(line[1]),
    score: [findType(line[0]), ...line[0].split('').map((v) => symbols1.indexOf(v))],
  }));
  const sorted = scoredCards.sort(sorter);
  const list = sorted.map((card) => [card.hand, ...card.score].join(', '));
  return sorted.reduce((sum, card, i) => sum + card.bid * (len - i), 0);
}

function solve2() {
  const scoredCards = data.map((line) => ({
    hand: line[0],
    bid: Number(line[1]),
    score: [findType(line[0], 'J'), ...line[0].split('').map((v) => symbols2.indexOf(v))],
  }));
  const sorted = scoredCards.sort(sorter);
  const list = sorted.map((card) => [card.hand, ...card.score].join(', '));
  return sorted.reduce((sum, card, i) => sum + card.bid * (len - i), 0);
}

timedLog('Part 1:', solve1());
timedLog('Part 2:', solve2());

// 250469622 low
// 250789355
// 250452116
