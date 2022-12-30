class Board {
  constructor(block) {
    this.data = block.split(/\n/)
      .map((line) => line.split(/\s+/)
        .filter(Boolean)
        .map((str) => ({ num: Number(str), marked: false })));
  }

  markNumber(num) {
    // Could be made faster if assumed that each number occurs only once per board, but this is not stated
    this.data.forEach((rows) => rows.forEach((cell) => {
      if (cell.num === num) {
        // eslint-disable-next-line no-param-reassign
        cell.marked = true;
      }
    }));
  }

  checkRows() {
    return this.data.some((row) => row.every((cell) => cell.marked));
  }

  checkColumns() {
    return this.data[0].some((dummy, idx) => this.data.every((row) => row[idx].marked));
  }

  checkBingo() {
    return this.checkRows() || this.checkColumns();
  }

  sumUnmarked() {
    const unmarkedRowSum = (row) => row
      .filter((cell) => !cell.marked)
      .reduce((sum, cell) => sum + cell.num, 0);
    return this.data.reduce((sum, row) => sum + unmarkedRowSum(row), 0);
  }

  reset() {
    this.data.forEach((row) => row.forEach((cell) => {
      // eslint-disable-next-line no-param-reassign
      cell.marked = false;
    }));
  }
}

export default Board;
