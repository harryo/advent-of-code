/**
 * solve
 * @param {array} data
 * @returns commands immediately affect position
 */

function solve(data) {
  let horizontal = 0;
  let depth = 0;

  data.forEach(({ command, value }) => {
    switch (command) {
      case 'forward':
        horizontal += value;
        break;
      case 'up':
        depth -= value;
        break;
      case 'down':
        depth += value;
        break;
      default:
        throw new Error('Unknown command', command);
    }
  });
  return depth * horizontal;
}

export default solve;
