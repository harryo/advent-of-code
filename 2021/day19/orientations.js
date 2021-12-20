const createArray = require('../../helpers/createArray');

const transformations = [
  ([x, y, z]) => [[x, y, z], [y, z, x], [z, x, y]], // Different axis up
  ([x, y, z]) => [[x, y, z], [x, -z, y], [x, -y, -z], [x, z, -y]], // Rotate around x-axis
  ([x, y, z]) => [[x, y, z], [-x, -y, z]], // Rotate on other axis
];

const orientations = (loc) => transformations
  .reduce(
    (acc, tf) => acc
      .map((xyz) => tf(xyz))
      .flat(),
    [loc],
  );

function transformLocations(locations) {
  const options = locations.map(orientations);
  return createArray(24).map((i) => options.map((or) => or[i]));
}

module.exports = {
  // orientations,
  transformLocations,
};
