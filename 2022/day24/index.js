import { readFile } from '../../helpers/readInput/index.js';
import timedLog from '../../helpers/timedLog.js';
import getSolvers from './getSolvers.js';

const { solve1, solve2 } = getSolvers(readFile());

timedLog('Preparation');
timedLog('Part 1:', solve1());
timedLog('Part 2:', solve2());
