import readFile from './readFile.js';

function readLines() {
  return readFile().split(/\n/).filter(Boolean);
}

export default readLines;
