/* eslint-disable no-param-reassign */
import readlines from '../../helpers/readLines.js';
import showTimedSolution from '../../helpers/showTimedSolution.js';

const sortPattern = (pat) => Array.from(pat).sort().join('');

function splitInput(line) {
  const [patterns, output] = line.split('|');
  return {
    patterns: patterns.split(/\s+/).filter(Boolean),
    output: output.split(/\s+/).filter(Boolean),
  };
}

const source = readlines().filter(Boolean).map(splitInput);
const digitSegments = ['abcefg', 'cf', 'acdeg', 'acdfg', 'bcdf', 'abdfg', 'abdefg', 'acf', 'abcdefg', 'abcdfg'];
const chars = 'abcdefg'.split('');

function matchingDigits(pat) {
  return digitSegments.filter((o) => o.length === pat.length);
}

/**
 *
 * @returns Just count the strings
 */
function solve1() {
  return source.map((s) => s.output).flat().filter((o) => matchingDigits(o).length === 1).length;
}

/**
 * getInitialOptions, each can stand for any char
 * @returns object with characters as key, values are possible chars this key could stand for
 */
function getInitialOptions() {
  return chars.reduce((acc, ch) => ({ ...acc, [ch]: chars }), {});
}

/**
 * Transform a pattern into a digit
 * @param {str} pattern
 * @param {object} options
 * @returns corresponding digit, or -1 if not found
 */
function transform(pattern, options) {
  const transformed = pattern.split('').map((c) => options[c][0]).sort().join('');
  return digitSegments.findIndex((str) => str === transformed);
}

/**
 * Just try each option and see whether it results in valid digits
 * @param {*} patterns
 * @param {*} options
 * @returns options Object with only one option per key, resulting in valid digits, or null if none found
 */
function tryOut(patterns, options) {
  // Find a char for which there are still multiple options
  const choice = chars.find((ch) => options[ch].length > 1);
  if (!choice) {
    return patterns.every((pat) => transform(pat, options) !== -1) ? options : null;
  }
  let solution = null;
  options[choice].some((tryChar) => {
    const nextAttempt = {};
    chars.forEach((ch) => {
      nextAttempt[ch] = ch === choice ? [tryChar] : options[ch].filter((c) => c !== tryChar);
    });
    solution = tryOut(patterns, nextAttempt);
    return solution;
  });
  return solution;
}

/**
 * Find solution for given patterns, using the output
 * @param {*} param0
 * @returns transformed output digits as number
 */
function deduce({ patterns, output }) {
  const options = getInitialOptions();
  patterns.forEach((pat) => {
    const digits = matchingDigits(pat);
    if (digits.length > 1) {
      return;
    }
    chars.forEach((ch) => {
      if (pat.includes(ch)) {
        // ch should refer to one of the chars in digit
        options[ch] = options[ch].filter((c) => digits[0].includes(c));
      } else {
        // ch cannot refer to one of the chars in digit
        options[ch] = options[ch].filter((c) => !digits[0].includes(c));
      }
    });
  });
  const solution = tryOut(patterns, options);

  const result = output.map((str) => ({ str, value: transform(str, solution) }));
  return parseInt(result.map((o) => o.value).join(''), 10);
}

function solve2() {
  return source.reduce((sum, o) => sum + deduce(o), 0);
}

/**
 * Alternative - solve by finding supersets/subsets
 */

function eliminate({ patterns, output }) {
  // Set initial solution based on length of pattern
  const options = patterns.map((pat) => ({
    pattern: sortPattern(pat),
    solutions: matchingDigits(pat).map((p) => digitSegments.indexOf(p)),
  }));

  const solved = [];

  // Find patterns with only one solution left
  function findSolved() {
    const justSolved = options.filter((o) => o.solutions.length === 1 && !solved[o.solutions[0]]);
    justSolved.forEach((o) => {
      solved[o.solutions[0]] = o.pattern;
    });
    return justSolved.map((o) => o.solutions[0]);
  }

  // Test if all segments of subset are included in superset
  const isSuperset = (pat, subPat) => Array.from(subPat).every((c) => pat.includes(c));
  function findSuperset(n, reverse) {
    const subPat = digitSegments[n];
    return digitSegments
      .filter((pat) => (reverse ? isSuperset(subPat, pat) : isSuperset(pat, subPat)))
      .map((p) => digitSegments.indexOf(p));
  }

  let newlySolved = findSolved();
  // Loop until no new solutions are found
  while (newlySolved.length > 0) {
    newlySolved.forEach((n) => {
      const superset = findSuperset(n);
      const subset = findSuperset(n, true);
      const patLenght = solved[n].length;
      options.forEach((o) => {
        if (o.pattern.length > patLenght) {
          o.solutions = o.solutions.filter((v) => isSuperset(o.pattern, solved[n]) === superset.includes(v));
        } else if (o.pattern.length < patLenght) {
          o.solutions = o.solutions.filter((v) => isSuperset(solved[n], o.pattern) === subset.includes(v));
        } else if (o.pattern !== solved[n]) {
          o.solutions = o.solutions.filter((v) => v === n);
        }
      });
    });
    newlySolved = findSolved();
  }
  const result = output
    .map(sortPattern)
    .map((pat) => Object.keys(solved)
      .find((key) => solved[key] === pat));
  return parseInt(result.join(''), 10);
}

function solve2a() {
  return source.reduce((sum, o) => sum + eliminate(o), 0);
}

showTimedSolution(1, () => solve1());

showTimedSolution(2, () => solve2());

showTimedSolution('2a', () => solve2a());
