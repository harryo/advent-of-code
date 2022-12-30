function find(arr, cb) {
  let result;
  return arr.some((v, i) => {
    result = cb(v, i);
    return result;
  }) ? result : undefined;
}

export default find;
