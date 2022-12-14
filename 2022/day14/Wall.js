/**
 * Wall: a set of points that are filled,
 *   stored as an array of y values,
 *   each containing a Set with the occupied x values
 * @param {Array<Array<Array<number>>>} data
 */
class Wall {
  constructor(data, size) {
    this.filled = Array(size).fill().map(() => new Set());
    data.forEach((points) => {
      points.forEach((pt, i) => {
        if (i === 0) {
          this.add(pt);
        } else {
          this.addPointsInLine(points[i - 1], pt);
        }
      });
    });
  }

  addPointsInLine(p1, p2) {
    let [x1, y1] = p1;
    const [x2, y2] = p2;
    const dx = Math.sign(x2 - x1);
    const dy = Math.sign(y2 - y1);
    do {
      x1 += dx;
      y1 += dy;
      this.add([x1, y1]);
    }
    while (x1 !== x2 || y1 !== y2);
  }

  add([x, y]) {
    this.filled[y].add(x);
  }

  has([x, y]) {
    return this.filled[y].has(x);
  }
}

module.exports = Wall;
