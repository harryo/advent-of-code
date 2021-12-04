const readFile = require('../../helpers/readFile');
const Board = require('./Board');

const source = readFile().split(/\n{2,}/).filter(Boolean);
const numbers = source[0].split(/\D+/).filter(Boolean).map(Number);
const boards = source.slice(1).map((line) => new Board(line));

const completedBoards = new Set();

/**
 * Mark number in all boards, return boards just completed.
 * @param {int} num
 * @returns
 */
function playNumber(num) {
  const completed = [];
  boards
    .filter((board) => !completedBoards.has(board))
    .forEach((board) => {
      board.markNumber(num);
      if (board.checkBingo()) {
        completedBoards.add(board);
        completed.push(board);
      }
    });
  return completed;
}

function play(getLast) {
  let winner = null;
  const lastNumber = numbers.find((num) => {
    [winner] = playNumber(num);
    return getLast ? completedBoards.size === boards.length : completedBoards.size > 0;
  });
  return winner.sumUnmarked() * lastNumber;
}

console.time('part 1');
const score1 = play(false);
console.timeEnd('part 1');
console.log('Part 1 solution:', score1);

console.time('part 2');
const score2 = play(true);
console.timeEnd('part 2');
console.log('Part 2 solution:', score2);
