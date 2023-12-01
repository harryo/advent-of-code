/**
 * solve
 * @param {array} data
 * @returns commands change aim, forward changes position
 */

function solve(data) {
  let horizontal = 0;
  let depth = 0;
  let aim = 0;

  data.forEach(({ command, value }) => {
    switch (command) {
      case 'forward':
        horizontal += value;
        depth += value * aim;
        break;
      case 'up':
        aim -= value;
        break;
      case 'down':
        aim += value;
        break;
      default:
        throw new Error('Unknown command', command);
    }
  });
  return depth * horizontal;
}

export default solve;
