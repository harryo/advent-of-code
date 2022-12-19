function findIndex(val, list) {
  if (list.length === 0) {
    return 0;
  }
  let i = 0;
  let s = list.length + 1;
  do {
    s = Math.ceil(s / 2);
    if (list[i + s - 1] < val) {
      i += s;
    }
  } while (s > 1);
  return i;
}

function traverse(initialState, getNext, sort = true) {
  const heap = [];
  let current = initialState;
  let ptr = 0;

  function findPos(prio) {
    if (heap.length === ptr) {
      return ptr;
    }
    return ptr + findIndex(prio, heap.slice(ptr).map((o) => o.priority));
  }

  function insert(state) {
    const { priority } = state;
    if (priority === undefined) {
      heap.push(state);
    }
    heap.splice(findPos(priority), 0, state);
  }

  while (current) {
    const next = getNext(current);
    if (!next) {
      break;
    }
    if (sort) {
      next.forEach(insert);
    } else {
      heap.push(...next);
    }
    current = heap[ptr++];
    if (ptr > 100) {
      heap.splice(0, ptr);
      ptr = 0;
    }
  }
}

module.exports = traverse;
