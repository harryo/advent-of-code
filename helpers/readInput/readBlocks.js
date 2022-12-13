const readFile = require('./readFile');

function readBlocks() {
  return readFile().split(/\n{2,}/).filter(Boolean);
}

module.exports = readBlocks;
