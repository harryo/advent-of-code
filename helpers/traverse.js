function traverse(initialState, getNext) {
  const heap = [];
  let current = initialState;
  let ptr = 0;
  while (current) {
    const next = getNext(current);
    if (!next) {
      break;
    }
    heap.push(...next);
    current = heap[ptr++];
    if (ptr > 100) {
      heap.splice(0, ptr);
      ptr = 0;
    }
  }
}

module.exports = traverse;
