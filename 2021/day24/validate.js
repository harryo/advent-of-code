const { commands } = require('./commands');

const initialState = {
  w: 0, x: 0, y: 0, z: 0,
};

/**
 * Parse a command line, apply and return new state
 * @param {*} state
 * @param {*} input // array of digits, first one will be shifted moved on inp command
 * @param {*} line
 * @returns
 */
function parse(state, input, line) {
  const [op, mem, par] = line.split(' ');
  const val = 'wxyz'.includes(par) ? state[par] : Number(par);
  switch (op) {
    case 'inp':
      return { ...state, [mem]: input.shift() };
    case 'add':
      return { ...state, [mem]: state[mem] + val };
    case 'mul':
      return { ...state, [mem]: state[mem] * val };
    case 'div':
      return { ...state, [mem]: Math.trunc(state[mem] / val) };
    case 'mod':
      return { ...state, [mem]: state[mem] % val };
    case 'eql':
      return { ...state, [mem]: Number(state[mem] === val) };
    default: throw new Error('Invalid instruction', op);
  }
}

function validate(value, offset = 0, z = 0) {
  const input = Array.from(value.toString()).map(Number);
  const result = commands.slice(offset * 18).slice(0, value.toString().length * 18)
    .reduce((state, line) => parse(state, input, line), { ...initialState, z });
  return result.z;
}

module.exports = validate;
