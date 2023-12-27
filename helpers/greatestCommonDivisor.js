function greatestCommonDivisor(a, b) {
  if (b === 0) {
    return a;
  }
  return greatestCommonDivisor(b, a % b);
}

function gcd(...nums) {
  return nums.reduce((a, b) => greatestCommonDivisor(a, b));
}

export default gcd;
