function processRows(rows) {
  const sortedRows = rows.map((row) => row.split(' ').map(Number)).sort((a, b) => a[1] - b[1]);

  const result = { 0: 0 };
  let last = 0;
  sortedRows.forEach(([dest, src, count]) => {
    if (src < last) throw new Error('Invalid range');
    result[src] = dest - src;
    result[src + count] = 0;
    last = src + count;
  });
  return Object.entries(result).map(([min, os]) => [Number(min), os]);
}

function parseInput(blocks) {
  const [seedsBlock, ...mapBlocks] = blocks;
  const seeds = seedsBlock.split(' ').slice(1).map(Number);
  const maps = mapBlocks.map((blk) => {
    const [def, ...rows] = blk.split('\n');
    const match = /^(\w+)-to-(\w+) map/.exec(def);
    if (!match) throw new Error('Invalid map definition');
    const [, from, to] = match;
    const ranges = processRows(rows);
    return {
      from,
      to,
      ranges,
    };
  });
  return { seeds, maps };
}

export default parseInput;
