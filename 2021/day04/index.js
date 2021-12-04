const readFile = require('../../helpers/readFile');
const Board = require('./Board');

const source = readFile().split(/\n{2,}/).filter(Boolean);

const numbers = source[0].split(/\D+/).map(Number);
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

/**
 * Find board that is completed first
 * @returns score
 */
function playToWin() {
  let winner = null;
  const lastNumber = numbers.find((num) => {
    [winner] = playNumber(num);
    return Boolean(winner);
  });
  return winner.sumUnmarked() * lastNumber;
}

/**
 * Find board that is completed last
 * @returns score
 */
function playToLose() {
  let winner = null;
  const lastNumber = numbers.find((num) => {
    [winner] = playNumber(num);
    return boards.length === completedBoards.size;
  });
  return winner.sumUnmarked() * lastNumber;
}

console.time('part 1');
const score1 = playToWin();
console.timeEnd('part 1');
console.log('Part 1 solution:', score1);

console.time('part 2');
const score2 = playToLose();
console.timeEnd('part 2');
console.log('Part 2 solution:', score2);
