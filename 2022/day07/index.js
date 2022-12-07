const readFile = require('../../helpers/readFile');
const timedLog = require('../../helpers/timerLog');

const commands = readFile().split('$ ').slice(1).map((cmd) => cmd.trim().split(/\n/));

const rootNode = { name: '/', dirs: {}, files: {} };
const dirNodes = [rootNode];
let curNode = rootNode;

function addFile(file, size) {
  curNode.files[file] = size;
}

function addDir(dir) {
  if (!curNode.dirs[dir]) {
    const dirNode = {
      parent: curNode,
      name: dir,
      dirs: {},
      files: {},
    };
    dirNodes.push(dirNode);
    curNode.dirs[dir] = dirNode;
  }
  return curNode.dirs[dir];
}

function getSize(node) {
  if (node.size === undefined) {
    // eslint-disable-next-line no-param-reassign
    node.size = Object.values(node.files).reduce((acc, size) => acc + size, 0)
    + Object.values(node.dirs).reduce((acc, dir) => acc + getSize(dir), 0);
  }
  return node.size;
}

commands.forEach(([cmdLine, ...data]) => {
  const [cmd, param] = cmdLine.split(' ');
  switch (cmd) {
    case 'ls':
      data.forEach((line) => {
        const [typeOrSize, name] = line.split(' ');
        if (typeOrSize === 'dir') {
          addDir(name);
        } else {
          addFile(name, Number(typeOrSize));
        }
      });
      return;
    case 'cd':
      if (param === '..') {
        curNode = curNode.parent;
        return;
      }
      if (param === '/') {
        curNode = rootNode;
        return;
      }
      addDir(param);
      curNode = curNode.dirs[param];
      return;
    default:
      throw new Error('Invalid command');
  }
});

getSize(rootNode);

timedLog('Preparation');

function solve1() {
  getSize(rootNode);
  return dirNodes.filter((node) => node.size <= 100000).reduce((acc, node) => acc + node.size, 0);
}

function solve2() {
  const diskSpace = 70000000;
  const requiredSpace = 30000000;
  const neededExtraSpace = requiredSpace - (diskSpace - rootNode.size);
  const bigNodes = dirNodes.filter((node) => node.size > neededExtraSpace);
  return bigNodes.reduce((acc, node) => Math.min(acc, node.size), Infinity);
}

timedLog('Part 1:', solve1());
timedLog('Part 2:', solve2());
