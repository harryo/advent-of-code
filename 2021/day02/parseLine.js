function parseLine(line) {
  const [command, value] = line.split(' ');
  return { command, value: Number(value) };
}

export default parseLine;
