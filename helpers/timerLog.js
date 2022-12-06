const times = [performance.now()];

function formatTime(t) {
  return t.toFixed(2).padStart(6);
}

function timedLog(...args) {
  const t = performance.now();
  times.push(t);
  console.log(formatTime(t - times[0]), formatTime(t - times[times.length - 2]), ...args);
}

module.exports = timedLog;
