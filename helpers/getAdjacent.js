/**
 * Find adjacent locations
 * @param {*} loc
 * @returns
 */
export function getAdjacent(loc, matrix, directions) {
  const { r, c } = loc;
  return directions
    .map((d) => ({ r: r + d[0], c: c + d[1] })) // possible positions
    .map((p) => matrix[p.r]?.[p.c]) // to map locations
    .filter(Boolean); // only inside map
}

export const DIRECTIONS_SQUARE = [[-1, 0], [1, 0], [0, -1], [0, 1]];

export const DIRECTIONS_DIAGONAL = [[-1, -1], [1, -1], [1, 1], [-1, 1]];

export const DIRECTIONS_ALL = [...DIRECTIONS_SQUARE, ...DIRECTIONS_DIAGONAL];
