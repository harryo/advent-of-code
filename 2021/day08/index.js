const readlines = require('../../helpers/readLines');
const showTimedSolution = require('../../helpers/showTimedSolution');

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

showTimedSolution(1, () => solve1());

showTimedSolution(2, () => solve2());
