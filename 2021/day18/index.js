/* eslint-disable no-continue */
// const readFile = require('../../helpers/readFile');
const readLines = require('../../helpers/readLines');
const showTimedSolution = require('../../helpers/showTimedSolution');

console.time('Preparation');

const lines = readLines();

function add(v1, v2) {
  return parseLine(`[${v1},${v2}]`);
}

function parseLine(line) {
  // Check nested pairs to explode
  let d = 0;
  for (let i = 0; i < line.length; i++) {
    switch (line[i]) {
      case '[':
        d++;
        break;
      case ']':
        d--;
        break;
      default:
        if (d > 4) {
          const match = line.slice(i).match(/^(\d+),(\d+)]/);
          if (match) {
            return explode(line, i, match);
          }
        }
    }
  }
  // Find regular number to split
  const match = line.match(/^(.*?\D)(\d{2,})(\D.*)$/);
  if (match) {
    return split(match);
  }
  return line;
}

const replaceSum = (match, number) => [match[1], Number(match[2]) + number, match[3]].join('');

function explode(line, p, match) {
  const endOfMatch = p + match[0].length;
  const sections = [line.slice(0, p - 1), 0, line.slice(endOfMatch)];
  const numbers = match.slice(1).map(Number);
  // Replace right
  const matchRight = sections[0].match(/^(.*\D)(\d+)(\D+)$/);
  if (matchRight) {
    sections[0] = replaceSum(matchRight, numbers[0]);
  }
  // Replace left
  const matchLeft = line.slice(p + match[0].length).match(/^(\D+)(\d+)(\D.*)$/);
  if (matchLeft) {
    sections[2] = replaceSum(matchLeft, numbers[1]);
  }
  const result = sections.join('');
  return parseLine(result);
}

function split(match) {
  const half = Number(match[2]) / 2;
  const result = [match[1], `[${Math.floor(half)},${Math.ceil(half)}]`, match[3]].join('');
  return parseLine(result);
}

function magnitude(line) {
  const result = line.replace(/\[(\d+),(\d+)\]/, (...args) => {
    const [v1, v2] = args.slice(1).map(Number);
    return 3 * v1 + 2 * v2;
  });
  return result[0] === '[' ? magnitude(result) : result;
}

console.log(magnitude('[[[[8,7],[7,7]],[[8,6],[7,7]]],[[[0,7],[6,6]],[8,7]]]'));
console.timeEnd('Preparation');

function solve1() {
  return magnitude(lines.reduce((s, v) => add(s, v)));
}

function solve2() {
  let max = 0;
  lines.forEach((l1) => lines
    .filter((l2) => l1 !== l2)
    .forEach((l2) => {
      const mag = Number(magnitude(add(l1, l2)));
      if (mag > max) {
        max = mag;
      }
    }));
  return max;
}

showTimedSolution(1, () => solve1());

showTimedSolution(2, () => solve2());
