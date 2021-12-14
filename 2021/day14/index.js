// const readFile = require('../../helpers/readFile');
// const readLines = require('../../helpers/readLines');
const readBlocks = require('../../helpers/readBlocks');
const showTimedSolution = require('../../helpers/showTimedSolution');

/**
 * In replacements, always return the result minus the first character,
 * as this is already included in the replacement of the previous pair
 */

const [template, ruleLines] = readBlocks();
const rules = {};
ruleLines.split(/\n/).map((line) => line.split(/\W+/))
  .forEach(([pair, char]) => {
    rules[pair] = Array(40).fill(); // Array to be extended with multi-step replacements
    rules[pair][0] = char;
    rules[pair][1] = `${pair[0]}${char}${pair[1]}`;
  });

/**
 * Split an array into character pairs
 * @param {string} str
 * @returns Array of charater pairs
 */
function pairwise(str) {
  return Array(str.length - 1).fill().map((dummy, i) => str.slice(i, i + 2));
}

/**
 * find Replacement for pair after number of steps
 * @param {string} pair
 * @param {integer} steps
 * @returns replacement
 */
const cacheCount = { checked: 0, found: 0 };

function findLastStep(limit, rule) {
  for (let i = limit; i > 0; i--) {
    if (rule[i]) {
      return i;
    }
  }
  throw new Error('No result!');
}

function findReplacement(pair, steps) {
  const pairRules = rules[pair];
  cacheCount.checked++;
  if (!pairRules) {
    // console.log('None ', pair, steps, pair[0] + endChar);
    return pair;
  }
  const lastStep = findLastStep(steps, pairRules);
  const lastResult = pairRules[lastStep];
  if (lastStep === steps) {
    cacheCount.found++;
    return lastResult;
  }
  const remainingSteps = steps - lastStep;
  const result = takeSteps(lastResult, remainingSteps);
  pairRules[steps] = result;
  return result;
}

function takeStep(tpl) {
  const replaced = pairwise(tpl).map((pair) => {
    const insertChar = rules[pair][0];
    const endChar = pair[1];
    return insertChar !== undefined ? `${insertChar}${endChar}` : endChar;
  });
  return `${tpl[0]}${replaced.join('')}`;
}

function takeSteps(tpl, steps) {
  const replaced = pairwise(tpl).map((pair) => findReplacement(pair, steps));
  return replaced.map((s, i) => (i > 0 ? s.slice(1) : s)).join('');
}

function countChars(str) {
  const result = {};
  Array.from(str).forEach((c) => {
    result[c] = (result[c] || 0) + 1;
  });
  return result;
}

function solveSteps(n, simple) {
  const str = simple
    ? Array(n).fill().reduce(takeStep, template)
    : takeSteps(template, n);
  const counts = countChars(str);
  const sortedKeys = Object.keys(counts).sort((a, b) => counts[a] - counts[b]); // From least common to most common
  const sortedCounts = sortedKeys.map((key) => counts[key]);
  return sortedCounts[sortedCounts.length - 1] - sortedCounts[0];
}

const SIMPLE = 0;

showTimedSolution(1, () => solveSteps(10, SIMPLE));
showTimedSolution(2, () => solveSteps(20, SIMPLE));

// showTimedSolution(2, () => solveSteps(20, SIMPLE));

console.log(cacheCount);
