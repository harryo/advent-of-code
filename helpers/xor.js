/**
 * Create logical XOR from bitwise XOR
 * @param {*} a 
 * @param {*} b 
 * @returns 
 */
function xor(a, b) {
  return Boolean(Boolean(a) ^ Boolean(b));
}

module.exports = xor;