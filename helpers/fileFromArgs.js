/**
 * Read filename from command line args and add path from script file
 * @returns filename with path
 */
function fileFromArgs() {
  const filename = process.argv[2];
  if (!filename) {
    throw new Error('Missing filename');
  }
  const pathname = process.argv[1].replace(/[^/]*$/, filename);
  return pathname;
}

module.exports = fileFromArgs;
