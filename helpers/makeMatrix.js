function makeMatrix(text) {
  return text.split(/\n/).filter(Boolean).map((row, r) => Array.from(row).map((ch, c) => ({ r, c, ch })));
}

export default makeMatrix;
