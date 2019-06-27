const tf = require('@tensorflow/tfjs');

function efd(polygon, order=10) {
  polygon = tf.tensor(polygon);

  const nextPoints = polygon.slice([0], [polygon.shape[0] - 1]);
  const pointDistances = polygon.slice([1]).sub(nextPoints);

  const epsilon = tf.scalar(1e-16);

  let lengths = pointDistances.square();
  lengths = lengths.sum(axis=1)
    .add(epsilon)
    .sqrt()
    .sub(epsilon);

  let cumulativeLengths = lengths.cumsum(axis=0);
  const zeros = tf.zeros([1]);
  cumulativeLengths = tf.concat([zeros, cumulativeLengths]);
  const total_distance = tf.max(cumulativeLengths);
  let normalizedDistances = tf.div(tf.mul(Math.PI * 2, cumulativeLengths), total_distance);

  const efdOrders = tf.range(1, order + 1).reshape([order, 1]);
  const denominator = tf.square(efdOrders).mul(2).mul(tf.square(Math.PI));
  let constants = total_distance.div(denominator);
  constants = tf.squeeze(constants);
  normalizedDistances = efdOrders.matMul(normalizedDistances.reshape([1, -1]));

  const normDistX = normalizedDistances.slice([0, 1], [normalizedDistances.shape[0], normalizedDistances.shape[1] - 1]);
  const normDistY = normalizedDistances.slice([0, 0], [normalizedDistances.shape[0], normalizedDistances.shape[1] - 1]);
  const d_cos_phi = tf.cos(normDistX).sub(tf.cos(normDistY));
  const d_sin_phi = tf.sin(normDistX).sub(tf.sin(normDistY));

  const xDistances = pointDistances.slice([0, 0], [pointDistances.shape[0], 1]).squeeze();
  const yDistances = pointDistances.slice([0, 1], [pointDistances.shape[0], 1]).squeeze();

  const cos_phi = xDistances
    .mul(d_cos_phi)
    .div(lengths);

  const aCoeffs = constants.mul(cos_phi.sum(axis=1));

  const bCoeffs = constants.mul(
    xDistances.div(lengths)
      .mul(d_sin_phi)
      .sum(axis=1)
  );

  const cCoeffs = constants.mul(
    yDistances.div(lengths)
      .mul(d_cos_phi)
      .sum(axis=1)
  );

  const dCoeffs = constants.mul(yDistances.div(lengths)
    .mul(d_sin_phi)
    .sum(axis=1));

  const coeffs = tf.stack([
    aCoeffs,
    bCoeffs,
    cCoeffs,
    dCoeffs
  ]).transpose();

  // returns a Promise
  return coeffs.array()
}

function efdOffsets(polygon) {
  polygon = tf.tensor(polygon);

  const nextPoints = polygon.slice([0], [polygon.shape[0] - 1]);
  const pointDistances = polygon.slice([1]).sub(nextPoints);

  const epsilon = tf.scalar(1e-16);

  let lengths = pointDistances.square();
  lengths = lengths.sum(axis=1)
    .add(epsilon)
    .sqrt()
    .sub(epsilon);

  let cumulativeLengths = lengths.cumsum(axis=0);
  const zeros = tf.zeros([1]);
  cumulativeLengths = tf.concat([zeros, cumulativeLengths]);
  const total_distance = tf.max(cumulativeLengths);

  let xDistances = pointDistances.slice([0, 0], [pointDistances.shape[0], 1])
    .squeeze();
  let yDistances = pointDistances.slice([0, 1], [pointDistances.shape[0], 1])
    .squeeze();

  // xi = np.cumsum(dxy[:, 0]) - (dxy[:, 0] / dt) * t[1:]
  const xi = xDistances.cumsum()
    .sub(
      xDistances.div(lengths).mul(cumulativeLengths.slice([1], [cumulativeLengths.shape[0] - 1])));

  // A0 = (1 / T) * np.sum(((dxy[:, 0] / (2 * dt)) * np.diff(t ** 2)) + xi * dt)
  const squaredDiff = cumulativeLengths.square()
    .slice([1], [cumulativeLengths.shape[0] - 1])
    .sub(
      cumulativeLengths.square().slice([0], [cumulativeLengths.shape[0] - 1])
    );
  const A0 = tf.scalar(1.).div(total_distance).mul(
    xDistances.div(tf.scalar(2.).mul(lengths))
      .mul(squaredDiff)
      .add(xi.mul(lengths))
      .sum()
  );

  // delta = np.cumsum(dxy[:, 1]) - (dxy[:, 1] / dt) * t[1:]
  const delta = yDistances.cumsum()
    .sub(
      yDistances.div(lengths)
        .mul(cumulativeLengths.slice([1], cumulativeLengths.shape[0] - 1))
    );

  // C0 = (1 / T) * np.sum(((dxy[:, 1] / (2 * dt)) * np.diff(t ** 2)) + delta * dt)
  const C0 = tf.scalar(1.).div(total_distance)
    .mul(
      yDistances.div(tf.scalar(2.).mul(lengths))
        .mul(squaredDiff)
        .add(delta.mul(lengths))
        .sum()
    );
  //
  // # A0 and CO relate to the first point of the contour array as origin.
  //   # Adding those values to the coefficients to make them relate to true origin.
  //   return contour[0, 0] + A0, contour[0, 1] + C0
  const offsets = tf.concat([polygon.slice([0, 0]).add(A0), polygon.slice([0, 1]).add(C0)]);
  return offsets.array();
}

module.exports = {efd, efdOffsets};
