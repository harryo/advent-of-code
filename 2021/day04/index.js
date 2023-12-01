import readFile from '../../helpers/readFile.js';
import showTimedSolution from '../../helpers/showTimedSolution.js';
import Board from './Board.js';

const source = readFile().split(/\n{2,}/).filter(Boolean);
const numbers = source[0].split(/\D+/).filter(Boolean).map(Number);
const boards = source.slice(1).map((block) => new Board(block));

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
  return winner && winner.sumUnmarked() * lastNumber;
}

function reset() {
  boards.forEach((board) => board.reset());
  completedBoards.clear();
}

showTimedSolution(1, () => play(false));

reset();

showTimedSolution(2, () => play(true));
