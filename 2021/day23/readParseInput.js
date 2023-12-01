/* eslint-disable no-param-reassign */
import { getAdjacent, DIRECTIONS_SQUARE } from '../../helpers/getAdjacent.js';
import { types } from './constants.js';

function readParseInput(matrix) {
  const inside = (f) => !('# '.includes(f.ch));
  const fields = matrix.flat().filter(inside);
  let i = 0;
  fields.forEach((f) => {
    f.adj = getAdjacent(f, matrix, DIRECTIONS_SQUARE).filter(inside);
    f.i = i++;
  });

  // Get room columns
  const roomCols = fields.filter((f) => types.includes(f.ch)).slice(0, 4).map((f) => f.c);
  fields.forEach((f) => {
    const ci = roomCols.indexOf(f.c);
    if (ci !== -1) {
      f.rule = f.r === 1 ? 'X' : types[ci];
    }
  });
  return { roomCols, fields };
}

export default readParseInput;
