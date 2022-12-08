/**
 * Find adjacent locations
 * @param {*} loc
 * @returns
 */
function getAdjacent(loc, matrix, directions) {
  const { r, c } = loc;
  return directions
    .map((d) => ({ r: r + d[0], c: c + d[1] })) // possible positions
    .map((p) => matrix[p.r] && matrix[p.r][p.c]) // to map locations
    .filter(Boolean); // only inside map
}

const DIRECTIONS_SQUARE = [[-1, 0], [1, 0], [0, -1], [0, 1]];

const DIRECTIONS_DIAGONAL = [[-1, -1], [1, -1], [1, 1], [-1, 1]];

const DIRECTIONS_ALL = [...DIRECTIONS_SQUARE, ...DIRECTIONS_DIAGONAL];

module.exports = {
  getAdjacent, DIRECTIONS_ALL, DIRECTIONS_DIAGONAL, DIRECTIONS_SQUARE,
};
