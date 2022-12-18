const shapesString = `
####

.#.
###
.#.

..#
..#
###

#
#
#
#

##
##
`;

const asNumbers = (shape) => shape.split('\n')
  .map((s) => (s.replace(/#/g, '1').replace(/\./g, '0').padEnd(5, 0)))
  .map((s) => parseInt(s, 2));

const shapes = shapesString.trim().split(/\n{2,}/).map(asNumbers).map((sprite, key) => ({
  sprite,
  length: sprite.length,
  key,
}));

let shapePtr = 0;

function nextShape() {
  return shapes[shapePtr++ % shapes.length];
}

function initShapes() {
  shapePtr = 0;
}

module.exports = { nextShape, initShapes };
