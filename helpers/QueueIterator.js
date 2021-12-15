class QueueIterator {
  constructor(initial, callback) {
    this.queue = [initial];
    this.callback = callback;
  }

  isEmpty() {
    return this.queue.length === 0;
  }

  takeStep() {
    const value = this.queue.shift();
    this.callback(value, (v) => this.queue.push(v));
  }
}

module.exports = QueueIterator;