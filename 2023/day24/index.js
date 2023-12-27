import gcd from '../../helpers/greatestCommonDivisor.js';
import { readLines } from '../../helpers/readInput/index.js';
import timedLog from '../../helpers/timedLog.js';

const DIMS = ['x', 'y', 'z'];
const hailstones = readLines().map((line) => {
  const [p, d] = line.split(' @ ').map((s) => {
    const [x, y, z] = s.split(', ').map((n) => parseInt(n, 10));
    return { x, y, z };
  });
  return { p, d };
});

function findIntersection(h1, h2) {
  const { x: x1, y: y1 } = h1.p;
  const { x: x2, y: y2 } = h2.p;
  const { x: dx1, y: dy1 } = h1.d;
  const { x: dx2, y: dy2 } = h2.d;

  const t1 = (dx2 * (y1 - y2) - dy2 * (x1 - x2)) / (dx1 * dy2 - dy1 * dx2);
  const t2 = (dx1 * (y1 - y2) - dy1 * (x1 - x2)) / (dx1 * dy2 - dy1 * dx2);

  const x = x2 + dx2 * t2;
  const y = y2 + dy2 * t2;
  return {
    x, y, t1, t2,
  };
}
const [min, max] = hailstones.length < 10 ? [7, 27] : [200000000000000, 400000000000000];

function isValid({
  x, y, t1, t2,
}) {
  return [t1, t2].every((t) => t >= 0)
  && [x, y].every((n) => n >= min && n <= max);
}
timedLog('Preparation');

function solve1() {
  const intersections = [];
  hailstones.forEach((h1, i) => {
    hailstones.slice(i + 1).forEach((h2) => {
      const intersection = findIntersection(h1, h2);
      if (isValid(intersection)) {
        intersections.push(intersection);
      }
    });
  });
  return intersections.length;
}

function findMultiples() {
  const multiples = {};
  DIMS.forEach((dim) => {
    const pos = new Map();
    hailstones.forEach((h) => {
      const p = h.p[dim];
      const d = h.d[dim];
      if (!pos.has(d)) {
        pos.set(d, p);
      } else if (pos.get(d) !== p) {
        if (!multiples[dim]) {
          multiples[dim] = [];
        }
        multiples[dim].push(Math.abs(p - pos.get(d)));
      }
    });
  });
  return multiples;
}

function solve2() {
  const multiples = findMultiples();
  DIMS.forEach((dim) => {
    if (multiples[dim]) {
      console.log(dim, gcd(...multiples[dim]));
    }
  });
  return 'Pending';
}

timedLog('Part 1:', solve1());
timedLog('Part 2:', solve2());
