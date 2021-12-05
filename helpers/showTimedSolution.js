function showTimedSolution(id, callback) {
  const key = `part ${id}`;
  console.time(key);
  const result = callback();
  console.timeEnd(key);
  console.log(`Part ${id} solution:`, result);
}

module.exports = showTimedSolution;
