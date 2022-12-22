class Cache {
  constructor() {
    this.cache = {};
    this.hits = 0;
    this.misses = 0;
  }

  getStats() {
    return {
      hits: this.hits,
      misses: this.misses,
      ratio: this.hits / (this.misses + this.hits),
    };
  }

  cached(fn, getKey = (...args) => args.join(',')) {
    return (...args) => {
      const key = getKey(...args);
      if (this.cache[key]) {
        this.hits++;
        return this.cache[key];
      }
      this.misses++;
      const result = fn(...args);
      this.cache[key] = result;
      return result;
    };
  }
}

module.exports = Cache;
