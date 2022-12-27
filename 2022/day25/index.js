const { readLines } = require('../../helpers/readInput');
const timedLog = require('../../helpers/timedLog');

const data = readLines();

const base = '=-012';

const val = (c) => base.indexOf(c) - 2;

function toDecimal(str) {
  return str.split('').reduce((acc, c) => acc * 5 + val(c), 0);
}

function toSnafu(num) {
  const digits = [0, ...num.toString(5).split('').map(Number)];
  for (let i = digits.length - 1; i >= 0; i--) {
    if (digits[i] >= 3) {
      digits[i] -= 5;
      digits[i - 1]++;
    }
  }
  return digits.map((d) => base[d + 2]).join('').replace(/^0/, '');
}

timedLog('Preparation');

function solve1() {
  return toSnafu(data.map(toDecimal).reduce((acc, n) => acc + n, 0));
}

function solve2() {
  return 'Pending';
}

timedLog('Part 1:', solve1());
timedLog('Part 2:', solve2());
