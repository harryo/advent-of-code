import fs from 'fs';
import fileFromArgs from './fileFromArgs.js';

function readFile() {
  const filename = fileFromArgs();
  return fs.readFileSync(filename, 'utf-8');
}

export default readFile;
