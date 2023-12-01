// import readFile from '../../helpers/readFile.js';
// import readLines from '../../helpers/readLines.js';
require('../../helpers/forEach');
require('../../helpers/sortBy');
import readBlocks from '../../helpers/readBlocks.js';
import showTimedSolution from '../../helpers/showTimedSolution.js';

const [template, ruleLines] = readBlocks();
const rules = {};
ruleLines.split(/\n/).map((line) => line.split(/\W+/))
  .forEach(([pair, char]) => {
    rules[pair] = pairwise(`${pair[0]}${char}${pair[1]}`);
  });

function replacePair(counts, pair, pairCount) {
  const repl = rules[pair];
  if (!repl || pairCount === 0) {
    return counts;
  }
  const result = {
    ...counts,
    [pair]: counts[pair] - pairCount,
  };
  repl.forEach((p) => {
    result[p] = (result[p] || 0) + pairCount;
  });
  return result;
}

function replaceAllPairs(counts) {
  const pairs = Object.keys(counts);
  return pairs.reduce((acc, pair) => replacePair(acc, pair, counts[pair]), counts);
}

/**
 * Split an array into character pairs
 * @param {string} str
 * @returns Array of charater pairs
 */
function pairwise(str) {
  return Array(str.length - 1).fill().map((dummy, i) => str.slice(i, i + 2));
}

function initialCount(tpl) {
  const result = {};
  pairwise(tpl).forEach((pair) => {
    result[pair] = (result[pair] || 0) + 1;
  });
  return result;
}

function solveSteps(n) {
  const pairCounts = Array(n).fill().reduce(replaceAllPairs, initialCount(template));
  const charCounts = { [template[0]]: 1 };
  pairCounts.forEach((count, pair) => {
    const ch = pair[1];
    charCounts[ch] = (charCounts[ch] || 0) + count;
  });
  const len = Object.values(charCounts).reduce((s, v) => s + v, 0);
  console.log(len, charCounts);
  const sortedKeys = Object.keys(charCounts)
    .sortBy((a) => charCounts[a]); // From least common to most common
  const sortedCounts = sortedKeys.map((key) => charCounts[key]);
  return sortedCounts[sortedCounts.length - 1] - sortedCounts[0];
}

showTimedSolution(1, () => solveSteps(10));
showTimedSolution(2, () => solveSteps(40));
