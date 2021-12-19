const createArray = require('../../helpers/createArray');

const transformations = [
  ([x, y, z]) => [[x, y, z], [z, y, -x], [y, -x, -z]], // Different axis up
  ([x, y, z]) => [[x, y, z], [x, -z, y], [x, -y, -z], [x, z, -y]], // Rotate around x-axis
  ([x, y, z]) => [[x, y, z], [-x, -y, -z]], // Upside down
];

const orientations1 = (loc) => transformations
  .reduce(
    (acc, tf) => acc
      .map((xyz) => tf(xyz))
      .flat(),
    [loc],
  );

const orientations2 = ([x, y, z]) => [[x, z, -y], [-z, x, -y], [-x, -z, -y],
  [z, -x, -y], [z, -y, x], [y, z, x],
  [-z, y, x], [-y, -z, x], [-y, x, z],
  [-x, -y, z], [y, -x, z], [x, y, z],
  [-z, -x, y], [x, -z, y], [z, x, y],
  [-x, z, y], [-x, y, -z], [-y, -x, -z],
  [x, -y, -z], [y, x, -z], [y, -z, -x],
  [z, y, -x], [-y, z, -x], [-z, -y, -x]];

function transformLocations(locations) {
  const options = locations.map(orientations2);
  return createArray(24).map((i) => options.map((or) => or[i]));
}

module.exports = {
  // orientations,
  transformLocations,
};
