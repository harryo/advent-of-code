import { readMatrix } from '../../helpers/readInput/index.js';
import timedLog from '../../helpers/timedLog.js';
import { DIRECTIONS_SQUARE, getAdjacent } from '../../helpers/getAdjacent.js';

const data = readMatrix();
const start = data[0].find((p) => p.ch === '.');
const end = data[data.length - 1].find((p) => p.ch === '.');
const bottomRow = data.length - 1;
let visited;
let junctions;
let longestPath;

function isValid(pos) {
  return pos && pos.ch !== '#' && !visited.includes(pos);
}

function takeStep(pos) {
  if (!isValid(pos)) {
    return;
  }
  if (pos.r === bottomRow) {
    if (longestPath.length < visited.length) {
      longestPath = [...visited];
    }
    return;
  }
  visited.push(pos);
  switch (pos.ch) {
    case '>':
      takeStep(data[pos.r][[pos.c + 1]]);
      break;
    case '<':
      takeStep(data[pos.r][[pos.c - 1]]);
      break;
    case '^':
      takeStep(data[pos.r - 1][[pos.c]]);
      break;
    case 'v':
      takeStep(data[pos.r + 1][[pos.c]]);
      break;
    case '.':
      getAdjacent(pos, data, DIRECTIONS_SQUARE)
        .filter(isValid)
        .forEach(takeStep);
      break;
    default:
      throw new Error('Unknown character');
  }
  visited.pop();
}

function takeStep2(pos, distance = 0) {
  if (visited.includes(pos)) {
    return;
  }
  if (pos === end) {
    if (longestPath < distance) {
      longestPath = distance;
    }
    return;
  }
  visited.push(pos);
  Array.from(junctions.get(pos).entries())
    .forEach(([p, dist]) => takeStep2(p, distance + dist));
  visited.pop();
}

function noWall(pos) {
  return pos.ch !== '#';
}
function getOptions(pos) {
  return getAdjacent(pos, data, DIRECTIONS_SQUARE)
    .filter(noWall);
}

function getJunctions() {
  junctions = new Map();
  junctions.set(start, new Map());
  junctions.set(end, new Map());
  const checked = new Set([start, end]);
  data.flat().filter(noWall)
    .forEach((p) => {
      if (checked.has(p)) {
        return;
      }
      checked.add(p);
      const adj = getOptions(p);
      if (adj.length > 2) {
        junctions.set(p, new Map());
        return;
      }
      if (adj.length < 2) {
        return;
      }
      const endPoints = [];
      const points = [p];
      adj.forEach((a) => {
        let p2 = a;
        while (p2) {
          if (junctions.has(p2)) {
            endPoints.push(p2);
            return;
          }
          checked.add(p2);
          const next = getOptions(p2).filter((p3) => !points.includes(p3));
          if (next.length === 0) {
            return;
          }
          if (next.length > 1) {
            endPoints.push(p2);
            junctions.set(p2, new Map());
            return;
          }
          points.push(p2);
          [p2] = next;
        }
      });
      const distance = points.length + 1;
      const [ep1, ep2] = endPoints;
      junctions.get(ep1).set(ep2, distance);
      junctions.get(ep2).set(ep1, distance);
    });
  return junctions;
}

timedLog('Preparation');

function solve1() {
  visited = [];
  longestPath = { length: 0 };
  takeStep(start);
  return longestPath.length;
}

function solve2() {
  getJunctions();
  visited = [];
  longestPath = 0;
  takeStep2(start);
  return longestPath;
}

timedLog('Part 1:', solve1());
timedLog('Part 2:', solve2());
