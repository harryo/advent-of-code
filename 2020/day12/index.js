import fs from 'fs';

const sample = 0;
const sampleFile = './sample.txt';
const inputFile = './input.txt';
const inputText = fs.readFileSync(sample ? sampleFile : inputFile, 'utf-8');
const inputData = inputText.split(/\n/);

const pos = { e: 0, n: 0 };
let wp = { e: 10, n: 1 };

function rotate(degrees) {
  const dir = (4 + (degrees / 90)) % 4;
  switch (dir) {
    case 0:
      break;
    case 1:
      wp = { e: wp.n, n: -wp.e };
      break;
    case 2:
      wp = { e: -wp.e, n: -wp.n };
      break;
    case 3:
      wp = { e: -wp.n, n: wp.e };
      break;
    default:
      throw new Error(`Unknown direction ${degrees}`);
  }
}

function move(dir, amount) {
  switch (dir) {
    case 'N':
      wp.n += amount;
      break;
    case 'E':
      wp.e += amount;
      break;
    case 'S':
      wp.n -= amount;
      break;
    case 'W':
      wp.e -= amount;
      break;
    default:
  }
}

function step(line) {
  const cmd = line.charAt(0);
  const amount = Number(line.substring(1));
  switch (cmd) {
    case 'L':
      rotate(-amount);
      break;
    case 'R':
      rotate(amount);
      break;
    case 'F':
      pos.n += amount * wp.n;
      pos.e += amount * wp.e;
      break;
    default:
      move(cmd, amount);
  }
}

function run() {
  inputData.forEach(step);
  console.log('Final position', pos, Math.abs(pos.n) + Math.abs(pos.e));
}

run();
