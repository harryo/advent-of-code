const createArray = require('../../helpers/createArray');
const readLines = require('../../helpers/readLines');

const commands = readLines();

/**
 * Commands can be split in 14 groups of 18 lines,
 * each group processing one digit using a similar function with three params
 * @param {commands} prog
 * @returns steps
 */
function splitInput(prog) {
  const lastNumber = (str) => Number(str.split(' ').slice(-1)[0]);
  return createArray(14).map((i) => [4, 5, 15].map((j) => lastNumber(prog[18 * i + j])));
}
const steps = splitInput(commands);

module.exports = { commands, steps };
