const fs = require('fs');

// const filename = process.argv[2];

function readFile(filename) {
  const pathname = process.argv[1].replace(/[^/]*$/, filename);
  return fs.readFileSync(pathname, 'utf-8');
}

module.exports = readFile;
