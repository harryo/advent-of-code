function greatestCommonDivisor(a, b) {
  if (b === 0) {
    return a;
  }
  return greatestCommonDivisor(b, a % b);
}

function gcd(...nums) {
  if (nums.length === 1) {
    return nums[0];
  }
  return nums.reduce((a, b) => greatestCommonDivisor(a, b));
}

export default gcd;
