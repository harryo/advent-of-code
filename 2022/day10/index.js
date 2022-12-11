const readLines = require('../../helpers/readLines');
const timedLog = require('../../helpers/timedLog');

const program = readLines();

let x = 1;
let t = 0;
let signalStrengthSum = 0;
const pixels = [];

function measure() {
  if (t % 40 === 20) {
    signalStrengthSum += x * t;
  }
}

function draw() {
  const xpos = pixels.length % 40;
  const sprite = [x - 1, x, x + 1];
  const char = sprite.includes(xpos) ? '#' : '.';
  pixels.push(char);
}

function cycle() {
  t++;
  measure();
  draw();
}

function addx(v) {
  cycle();
  cycle();
  x += v;
}

function run() {
  program.forEach((line) => {
    const [cmd, param] = line.split(' ');
    switch (cmd) {
      case 'noop':
        cycle();
        return;
      case 'addx':
        addx(Number(param));
        return;
      default:
        throw new Error(`Unknown command: ${cmd}`);
    }
  });
}

run();

timedLog('Preparation');

function solve1() {
  return signalStrengthSum;
}

function solve2() {
  while (pixels.length > 0) {
    console.log(pixels.splice(0, 40).join(''));
  }
  return 'Pending';
}

timedLog('Part 1:', solve1());
timedLog('Part 2:', solve2());
