
function getInitialData(size) {
  return {
    counts: new Array(size).fill(0),
    total: 0,
  };
}

function reducer(acc, value) {
  const counts = acc.counts.map((count, idx) => value[idx] === '1' ? count + 1 : count);
  return { counts, total: acc.total + 1 };
}

function getRates(data) {
  let gamma = 0;
  let epsilon = 0;
  const half = data.total / 2;
  data.counts.forEach(count => {
    gamma <<= 1;
    epsilon <<= 1;
    if (count > half) {
      gamma++;
    } else {
      epsilon++;
    }
  });
  return { gamma, epsilon };
}

module.exports = {
  getInitialData,
  reducer,
  getRates
};
