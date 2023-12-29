import { readLines } from '../../helpers/readInput/index.js';
import timedLog from '../../helpers/timedLog.js';

const data = readLines();

const components = new Map();

// Get components
data.forEach((line) => {
  const [key, connections] = line.split(': ');
  components.set(key, new Set(connections.split(' ')));
});

// Reverse components
components.forEach((connections, key) => {
  connections.forEach((connection) => {
    if (!components.has(connection)) {
      components.set(connection, new Set());
    }
    components.get(connection).add(key);
  });
});

function shortestPath(from, to) {
  const visited = new Set();
  const queue = [[from, 0]];

  while (queue.length) {
    const [current, distance] = queue.shift();
    if (current === to) {
      return distance;
    }
    visited.add(current);
    components.get(current).forEach((connection) => {
      if (current === from && connection === to) {
        return;
      }
      if (!visited.has(connection)) {
        queue.push([connection, distance + 1]);
      }
    });
  }
  return Infinity;
}

function findConnected(from, skip = []) {
  const visited = new Set([from]);
  const queue = [from];

  while (queue.length) {
    const current = queue.shift();
    visited.add(current);
    const checkSkip = skip.filter((c) => c.includes(current));
    components.get(current).forEach((connection) => {
      if (checkSkip.some((s) => s.includes(connection))) {
        return;
      }
      if (!visited.has(connection)) {
        queue.push(connection);
      }
    });
  }
  return visited;
}

const connections = [];

components.forEach((conn, key) => {
  conn.forEach((connection) => {
    if (key < connection) {
      connections.push([key, connection, shortestPath(key, connection)]);
    }
  });
});

timedLog('Preparation');

function solve1() {
  const removals = connections.sort((a, b) => b[2] - a[2]).slice(0, 3);
  const connected = findConnected(components.keys().next().value, removals);
  const result = connected.size * (components.size - connected.size);
  return result;
}

function solve2() {
  return 'Pending';
}

timedLog('Part 1:', solve1());
timedLog('Part 2:', solve2());
