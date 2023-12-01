import readFile from '../../helpers/readFile.js';
import timedLog from '../../helpers/timedLog.js';

const commands = readFile().split('$ ').slice(1).map((cmd) => cmd.trim().split(/\n/));

const rootNode = { name: '/', dirs: {}, files: {} };
const dirNodes = [rootNode];
let curNode = rootNode;

function addFile(file, size) {
  curNode.files[file] = size;
}

function addDir(dir) {
  if (curNode.dirs[dir]) {
    return;
  }
  const dirNode = {
    parent: curNode,
    name: dir,
    dirs: {},
    files: {},
  };
  dirNodes.push(dirNode);
  curNode.dirs[dir] = dirNode;
}

function getSize(node) {
  if (node.size === undefined) {
    // eslint-disable-next-line no-param-reassign
    node.size = Object.values(node.files).reduce((acc, size) => acc + size, 0)
    + Object.values(node.dirs).reduce((acc, dir) => acc + getSize(dir), 0);
  }
  return node.size;
}

function ls(data) {
  data.forEach((line) => {
    const [typeOrSize, name] = line.split(' ');
    if (typeOrSize === 'dir') {
      addDir(name);
    } else {
      addFile(name, Number(typeOrSize));
    }
  });
}

function cd(dir) {
  switch (dir) {
    case '..':
      curNode = curNode.parent;
      break;
    case '/':
      curNode = rootNode;
      break;
    default:
      addDir(dir);
      curNode = curNode.dirs[dir];
  }
}

commands.forEach(([cmdLine, ...data]) => {
  const [cmd, param] = cmdLine.split(' ');
  switch (cmd) {
    case 'ls':
      ls(data);
      break;
    case 'cd':
      cd(param);
      break;
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
