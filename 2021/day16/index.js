// const readFile = require('../../helpers/readFile');
const createArray = require('../../helpers/createArray');
const readLines = require('../../helpers/readLines');
const showTimedSolution = require('../../helpers/showTimedSolution');

console.time('Preparation');
const toBits = (v, n = 4) => v.toString(2).padStart(n, '0');
const fromBits = (s) => parseInt(s, 2);

const source = readLines();

function parseLine(line) {
  const bits = Array.from(line).map((c) => parseInt(c, 16)).map((n) => toBits(n, 4)).join('');
  let ptr = 0;
  let versionSum = 0;

  function readBits(n) {
    const str = bits.slice(ptr, ptr + n);
    ptr += n;
    return str;
  }

  const readNumber = (n) => fromBits(readBits(n));

  function readLiteralValue() {
    let result = 0;
    let hasMore = true;
    while (hasMore) {
      hasMore = readNumber(1);
      result = (result * 16) + readNumber(4);
    }
    return result;
  }

  function byTotalLength() {
    const totalLength = readNumber(15);
    const endPointer = ptr + totalLength;
    const result = [];
    while (ptr < endPointer) {
      result.push(readPacket());
    }
    return result;
  }

  function bySubPacketCount() {
    const spCount = readNumber(11);
    return createArray(spCount).map(readPacket);
  }

  function readSubPackets() {
    const lengthTypeId = readNumber(1);
    return lengthTypeId === 0 ? byTotalLength() : bySubPacketCount();
  }

  function readPacket() {
    const version = readNumber(3);
    versionSum += version;
    const type = readNumber(3);
    const content = type === 4 ? readLiteralValue() : readSubPackets(type);
    // console.log(type, content.toString());
    switch (type) {
      case 0:
        return content.reduce((s, v) => s + v, 0);
      case 1:
        return content.reduce((p, v) => p * v, 1);
      case 2:
        return Math.min(...content);
      case 3:
        return Math.max(...content);
      case 4:
        return content;
      case 5:
        return Number(content[0] > content[1]);
      case 6:
        return Number(content[0] < content[1]);
      case 7:
        return Number(content[0] === content[1]);
      default:
        throw new Error('Invalid type');
    }
  }

  const packet = readPacket();
  console.log(line.slice(0, 32), versionSum, packet);
  return { versionSum, packet };
}

const result = source.map(parseLine);

console.timeEnd('Preparation');

function solve1() {
  return result[0].versionSum;
}

function solve2() {
  return result[0].packet;
}

showTimedSolution(1, () => solve1());

showTimedSolution(2, () => solve2());
