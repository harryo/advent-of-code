function traverse(initialState, getNext) {
  const heap = [];
  let current = initialState;
  while (current) {
    heap.push(...getNext(current));
    current = heap.shift();
  }
}

module.exports = traverse;
