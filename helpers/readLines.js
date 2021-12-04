const readFile = require('./readFile');

function readLines(sample) {
  return readFile(sample).split(/\n/).filter(Boolean);
}

module.exports = readLines;
