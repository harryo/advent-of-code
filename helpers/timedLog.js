const times = [performance.now()];

// const digits = process.argv[2] === 'sample.txt' ? 1 : 0;
const options = {
  roundingMode: 'ceil',
  maximumSignificantDigits: 3,
  // minimumFractionDigits: digits,
  // maximumFractionDigits: digits,
};

const { format } = new Intl.NumberFormat(undefined, options);

function formatTime(t) {
  return format(t).padStart(8);
}

function timedLog(...args) {
  const t = performance.now();
  times.push(t);
  console.log(formatTime(t - times[0]), formatTime(t - times[times.length - 2]), ...args);
}

export default timedLog;
