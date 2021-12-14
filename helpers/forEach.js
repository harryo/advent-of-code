function forEach(obj, func) {
  Object.keys(obj).forEach((key) => func(obj[key], key));
}

module.exports = forEach;
