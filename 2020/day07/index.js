import fs from 'fs';

const sample = 0;
const sampleFile = './sample.txt'
const inputFile = './input.txt'
const inputText = fs.readFileSync(sample ? sampleFile : inputFile, 'utf-8');
const inputData = inputText.split(/\n/).filter(Boolean);

let rules = [];
const rulesByColor = {};

const bagsInside = {};

const options = {
  'shiny gold': 0,
};

function parseRule(rule) {
  const parts = rule.split(' bag');
  const color = parts[0];
  const reqMatches = parts.slice(1).map(p => p.match(/(\d+) (.+)/)).filter(Boolean);
  const result = {
    color,
    bags: reqMatches.map(m => ({ n: Number(m[1]), color: m[2] })),
  }
  rulesByColor[color] = result.bags;
  return result;
}

function checkLevel(level) {
  const possible = new Set(Object.keys(options));
  let count = 0;
  rules.filter(rule => !possible.has(rule.color)).forEach(rule => {
    if (rule.bags.some(bag => possible.has(bag.color))) {
      options[rule.color] = level;
      count++;
    }
  })
  return count;
}

function getBagsInside(color) {
  if (bagsInside[color] !== undefined) {
    return bagsInside[color];
  }
  const count = rulesByColor[color].reduce((sum, bag) => sum + bag.n * getBagsInside(bag.color), 1);
  bagsInside[color] = count;
  return count;
}

function run() {
  rules = inputData.map(parseRule);
  const insideBags = getBagsInside('shiny gold') - 1;
  // let level = 0;
  // let count;
  // do {
  //   level++;
  //   count = checkLevel(level);
  // } while (count > 0);
  // const result = Object.keys(options).length - 1;
  debugger
}

run();
