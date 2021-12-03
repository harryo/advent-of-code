const fs = require('fs');

const sampleFile = '/sample.txt';
const inputFile = '/input.txt';

function readLines(sample) {
  const filename = sample ? sampleFile : inputFile;
  const pathname = process.argv[1].replace(/\/[^\/]*$/, filename);
  return fs.readFileSync(pathname, 'utf-8').split(/\n/).filter(Boolean)
}

module.exports = readLines;
