// import readFile from '../../helpers/readFile.js';
import readLines from '../../helpers/readLines.js';
import showTimedSolution from '../../helpers/showTimedSolution.js';

const input = readLines();

const brackets = ['()', '[]', '{}', '<>'];

const score1 = {
  ')': 3, ']': 57, '}': 1197, '>': 25137,
};

const score2 = {
  ')': 1, ']': 2, '}': 3, '>': 4,
};

const completionCharLists = [];

function checkLine(line) {
  const stack = [];
  // Loop through line to find corrupt character
  const corruptChar = line.split('').find((c) => {
    const bracket = brackets.find((b) => b.includes(c));
    // if this is an opening char, stack the expected closing char
    if (c === bracket[0]) {
      stack.push(bracket[1]);
      return false;
    }
    // if it is a closing char, corrupt if not matching the last bracket
    return stack.pop() !== c;
  });
  if (corruptChar) {
    return score1[corruptChar];
  }
  // No corruption, expected closing chars for completion are on the stack
  completionCharLists.push(stack.reverse());
  return 0;
}

function scoreCompletionChars(arr) {
  return arr.reduce((s, c) => s * 5 + score2[c], 0);
}

function solve1() {
  return input.map(checkLine).reduce((s, v) => s + v, 0);
}

function solve2() {
  const idx = (completionCharLists.length - 1) / 2;
  return completionCharLists.map(scoreCompletionChars).sort((a, b) => a - b)[idx];
}

showTimedSolution(1, () => solve1());

showTimedSolution(2, () => solve2());
