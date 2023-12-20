function leastCommonMultiple(...nums) {
  return nums.reduce((a, b) => {
    const maxNum = Math.max(a, b);
    const minNum = Math.min(a, b);
    for (let i = maxNum; ; i += maxNum) {
      if (i % minNum === 0) {
        return i;
      }
    }
  });
}

export default leastCommonMultiple;
