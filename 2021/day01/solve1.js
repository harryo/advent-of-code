/**
 * solve1
 * @param {array} data
 * @returns count of values larger than previous
 */

function solve1(data) {
  const nextValues = data.slice(1);

  function hasIncreased(value, idx) {
    return value > data[idx];
  }

  return nextValues.filter(hasIncreased).length;
}

export default solve1;
