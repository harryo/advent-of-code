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
const [min, max] = hailstones.length < 10 ? [7, 27] : [200000000000000, 400000000000000];

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
    const diffs = new Map();
    multiples[dim] = new Map();
    hailstones.forEach((h) => {
      const p = h.p[dim];
      const d = h.d[dim];
      if (pos.has(d)) {
        diffs.set(d, [...(diffs.get(d) || []), Math.abs(p - pos.get(d))]);
      }
      pos.set(d, [p]);
    });
    multiples[dim] = [];
    diffs.forEach((p, d) => {
      multiples[dim].push({ d, p: gcd(...p) });
    });
  });
  return multiples;
}

function findDenominators(p) {
  const dMax = Math.sqrt(p);
  const result = new Set();
  for (let i = 1; i <= dMax; i++) {
    if (p % i === 0) {
      result.add(i);
      result.add(p / i);
      result.add(-i);
      result.add(-p / i);
    }
  }
  return Array.from(result).sort((a, b) => a - b);
}

function findOptions(d, p, options) {
  if (!options) {
    return findDenominators(p).map((n) => n + d);
  }
  return options.filter((n) => p % (n - d) === 0);
}

function solve2() {
  const multiples = findMultiples();
  const options = DIMS.map((dim) => multiples[dim].reduce((acc, { d, p }) => findOptions(d, p, acc), null));
  const allOptions = [];
  options[0].forEach((x) => {
    options[1].forEach((y) => {
      options[2].forEach((z) => {
        allOptions.push({ x, y, z });
      });
    });
  });
  const solutions = allOptions.map((o) => {
    const points = hailstones.slice(0, 2).map(({ p, d }) => ({ p, d: { x: d.x - o.x, y: d.y - o.y, z: d.z - o.z } }));
    const {
      x, y, t1, t2,
    } = findIntersection(...points);
    if (t1 < 0 || t2 < 0) {
      return null;
    }
    const z1 = points[0].p.z + points[0].d.z * t1;
    const z2 = points[1].p.z + points[1].d.z * t2;
    const err = Math.abs(z1 - z2);
    if (err > 0.1) {
      return null;
    }
    return {
      p: { x, y, z: Math.round(z1) },
      d: o,
    };
  }).filter(Boolean);
  return DIMS.reduce((acc, dim) => acc + solutions[0].p[dim], 0);
}

timedLog('Part 1:', solve1());
timedLog('Part 2:', solve2());
