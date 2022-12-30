import readFile from './readFile.js';

function readBlocks() {
  return readFile().split(/\n{2,}/).filter(Boolean);
}

export default readBlocks;
