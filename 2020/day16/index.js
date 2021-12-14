/* eslint-disable no-loop-func */
/* eslint-disable no-param-reassign */
// const readFile = require('../../helpers/readFile');
// const readLines = require('../../helpers/readLines');
const readBlocks = require('../../helpers/readBlocks');
const showTimedSolution = require('../../helpers/showTimedSolution');

const blocks = readBlocks();
const fields = blocks[0].split(/\n/)
  .map((line) => line.match(/^(.*): (\d+)-(\d+) or (\d+)-(\d+)/))
  .map((match) => ({
    label: match[1],
    limits: match.slice(2).map(Number),
  }));

const myTicket = blocks[1].split(/\n/)[1].split(',').map(Number);

const nearbyTickets = blocks[2].split(/\n/).slice(1).map((line) => line.split(',').map(Number));

function fieldTest(value, field) {
  const [min1, max1, min2, max2] = field.limits;
  return (value >= min1 && value <= max1) || (value >= min2 && value <= max2);
}

function valueTest(value) {
  return fields.some((field) => fieldTest(value, field));
}

function solve1() {
  return nearbyTickets.flat().filter((v) => !valueTest(v)).reduce((s, v) => s + v, 0);
}

function getFieldOptions(field, validTickets) {
  return validTickets[0]
    .map((v, i) => i)
    .filter((pos) => validTickets
      .every((t) => fieldTest(t[pos], field)));
}

function eliminate() {
  const found = fields.map((field) => field.options).filter((opt) => opt.length === 1).map((o) => o[0]);
  let index = 0;
  while (found.length < fields.length && index < found.length) {
    fields.forEach((field) => {
      const value = found[index];
      if (field.options.length > 1 && field.options.includes(value)) {
        field.options = field.options.filter((v) => v !== value);
        if (field.options.length === 1) {
          found.push(field.options[0]);
        }
      }
    });
    index++;
  }
  return found.length === fields.length;
}

function solve2() {
  const validTickets = nearbyTickets.filter((t) => t.every(valueTest));
  fields.forEach((field) => {
    field.options = getFieldOptions(field, validTickets);
  });
  const done = eliminate();
  if (!done) {
    throw new Error('Incomplete');
  }
  return fields
    .filter((field) => /^departure /.test(field.label))
    .map((field) => field.options[0])
    .map((pos) => myTicket[pos])
    .reduce((p, v) => p * v, 1);
}

showTimedSolution(1, () => solve1());

showTimedSolution(2, () => solve2());
