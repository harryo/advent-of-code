// import readFile from '../../helpers/readFile.js';
import readLines from '../../helpers/readLines.js';
import showTimedSolution from '../../helpers/showTimedSolution.js';

// Make list of connections from each cave
const connections = {};
readLines().forEach((line) => {
  const [c1, c2] = line.split('-');
  connections[c1] = [...connections[c1] || [], c2];
  connections[c2] = [...connections[c2] || [], c1];
});

/**
 * Extend a route until you found 'end'
 * You can apply the joker once, this allows to use a small cave twice
 */
function extendRoute(route, joker) {
  const endpoint = route[route.length - 1];
  const canFollow = (c) => /^[A-Z]/.test(c) || !route.includes(c);
  return connections[endpoint]
    .filter((c) => canFollow(c) || (joker && c !== 'start'))
    .map((c) => {
      const nextRoute = [...route, c];
      return c === 'end' ? [nextRoute] : extendRoute(nextRoute, joker && canFollow(c));
    })
    .flat();
}

function solve1() {
  const result = extendRoute(['start'], false);
  return result.length;
}

function solve2() {
  const result = extendRoute(['start'], true);
  return result.length;
}

showTimedSolution(1, () => solve1());

showTimedSolution(2, () => solve2());
