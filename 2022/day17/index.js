const { readFile } = require('../../helpers/readInput');
const timedLog = require('../../helpers/timedLog');
const loop = require('../../helpers/loop');
const { initShapes, nextShape } = require('./shapes');

const INITHEIGHT = 3;

const jets = readFile().split('');

let jetPtr = 0;
const nextJet = () => jets[jetPtr++ % jets.length];

const LEFT_MASK = 0b1000000;
const RIGHT_MASK = 0b0000001;

let chamber = [];
let shape;

function init() {
  chamber = [];
  jetPtr = 0;
  initShapes();
}

// const makeGraph = () => {
//   const { sprite, y } = shape;
//   const asString = (row) => row.toString(2).padStart(7, '0');
//   const graph = chamber.map((row) => asString(row).replace(/0/g, '.').replace(/1/g, '#'));
//   sprite.forEach((row, i) => {
//     asString(row).split('').forEach((ch, j) => {
//       const line = graph[y + i].split('');
//       if (ch === '1') {
//         line[j] = '@';
//       }
//       graph[y + i] = line.join('');
//     });
//   });
//   console.log([...graph.map((row) => `|${row}|`), `+${'-'.repeat(WIDTH)}+`].join('\n'));
// };

function newShape() {
  shape = {
    y: 0,
    ...nextShape(),
  };
  chamber.unshift(...Array(shape.length + INITHEIGHT).fill(0));
}

function fixShape() {
  const { sprite, y } = shape;
  sprite.forEach((row, i) => {
    chamber[y + i] |= row;
  });
  const firstRow = chamber.findIndex((row) => row !== 0);
  if (firstRow > 0) {
    chamber.splice(0, firstRow);
  }
}

function hasCollision(sprite, y) {
  return sprite.some((row, i) => (chamber[y + i] & row) !== 0);
}

function jetMove() {
  const ch = nextJet();
  // console.log('Jet', ch);
  let newSprite;
  const { sprite, y } = shape;
  const mask = sprite.reduce((acc, row) => acc | row, 0);
  if (ch === '<') {
    if (mask & LEFT_MASK) {
      return;
    }
    newSprite = sprite.map((row) => row << 1);
  }
  if (ch === '>') {
    if (mask & RIGHT_MASK) {
      return;
    }
    newSprite = sprite.map((row) => row >> 1);
  }
  if (hasCollision(newSprite, y)) {
    return;
  }
  shape.sprite = newSprite;
}

function moveDown() {
  const newY = shape.y + 1;
  if (newY + shape.length > chamber.length) {
    return false;
  }
  if (hasCollision(shape.sprite, newY)) {
    return false;
  }
  shape.y = newY;
  return true;
}

function fallDown() {
  newShape();
  do {
    // makeGraph();
    jetMove();
    // makeGraph();
  } while (moveDown());
  fixShape();
}

function getKey() {
  const chamberRows = chamber.slice(0, 10).map((v) => v.toString(16).padStart(2, '0'));
  return [shape.key, jetPtr % jets.length, ...chamberRows].join('');
}

function repeatFallDown(n) {
  const history = {};
  const heights = [];
  for (let i = 0; i < n; i++) {
    fallDown();
    heights.push(chamber.length);
    const key = getKey();
    if (key in history) {
      const index = history[key];
      const cycle = i - history[key];
      const stepHeight = chamber.length - heights[index];
      console.log('Found cycle', cycle, stepHeight);
      const remainingCycles = Math.floor((n - index - 1) / cycle);
      const baseIndex = n - remainingCycles * cycle - 1;
      return heights[baseIndex] + remainingCycles * stepHeight;
    }
    history[key] = i;
  }
  return chamber.length;
}

timedLog('Preparation', jets.length);

function solve1() {
  init();
  loop(2022, fallDown);
  return chamber.length;
}

function solve2() {
  init();
  return repeatFallDown(1000000000000);
}

timedLog('Part 1:', solve1());
timedLog('Part 2:', solve2());

// Not 1532167749718
// Not 1532163940216 too high
// Not 1532206917087
