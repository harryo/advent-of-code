const SIZE_MAX = 100;

function findIndex(arr, fn) {
  let l = 0;
  let r = arr.length;
  let m = l + Math.floor((r - l) / 2);
  while (r > l) {
    const x = fn(arr[m]);
    if (x === 0) {
      return m;
    }
    if (x > 0) {
      l = m + 1;
    } else {
      r = m;
    }
    m = l + Math.floor((r - l) / 2);
  }
  return m;
}

class Heap {
  constructor(getDistance) {
    this.heap = [];
    this.getDistance = getDistance;
    this.ptr = 0;
  }

  hasMore() {
    return this.heap.length > this.ptr;
  }

  next() {
    return this.heap[this.ptr++];
  }

  remaining() {
    return this.heap.slice(this.ptr);
  }

  insert(...items) {
    if (this.ptr > SIZE_MAX) {
      this.heap.splice(0, this.ptr);
      this.ptr = 0;
    }
    if (!this.getDistance) {
      this.heap.push(...items);
      return;
    }
    items.forEach((item) => {
      const distance = this.getDistance(item);
      const index = findIndex(this.heap.slice(this.ptr), (o) => distance - this.getDistance(o));
      this.heap.splice(this.ptr + index, 0, item);
    });
  }
}

export default Heap;
