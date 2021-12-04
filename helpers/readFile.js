const fs = require('fs');
const fileFromArgs = require('./fileFromArgs');

function readFile() {
  const filename = fileFromArgs();
  return fs.readFileSync(filename, 'utf-8');
}

module.exports = readFile;
