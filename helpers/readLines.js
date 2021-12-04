const readFile = require('./readFile');

function readLines() {
  return readFile().split(/\n/).filter(Boolean);
}

module.exports = readLines;
