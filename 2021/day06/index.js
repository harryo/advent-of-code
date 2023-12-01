import readFile from '../../helpers/readFile.js';
import showTimedSolution from '../../helpers/showTimedSolution.js';

const CYCLE = 7;
const source = readFile().split(/\D+/).filter(Boolean).map(Number);

const initialPopulation = Array(CYCLE + 2).fill(0);
source.forEach((age) => {
  initialPopulation[age]++;
});

function nextGeneration(population) {
  const result = population.slice(1);
  const creating = population[0];
  result[CYCLE - 1] += creating;
  result.push(creating);
  return result;
}

function totalCount(population) {
  return population.reduce((sum, count) => sum + count, 0);
}

function solve(numDays) {
  let population = initialPopulation;
  for (let i = 0; i < numDays; i++) {
    population = nextGeneration(population);
  }
  return totalCount(population);
}

showTimedSolution(1, () => solve(80));

showTimedSolution(2, () => solve(256));
