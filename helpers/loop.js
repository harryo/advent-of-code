function loop(count, cb) {
  for (let i = 0; i < count; i++) {
    cb(i);
  }
}

export default loop;
