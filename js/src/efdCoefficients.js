const tf = require('@tensorflow/tfjs');

function efd(polygon, order=10) {
  const slice2 = polygon.slice([0], [polygon.shape[0] - 1]);
  const pointDistances = tf.sub(polygon.slice([1]), slice2);

  const epsilon = tf.scalar(1e-16);

  let lengths = tf.square(pointDistances);
  lengths = tf.sum(lengths, dim = 1);
  lengths = tf.sqrt(lengths.add(epsilon));
  lengths = lengths.sub(epsilon);

  let cumulative_lengths = tf.cumsum(lengths, dim = 0);

  const zeros = tf.zeros([1]);
  cumulative_lengths = tf.concat([zeros, cumulative_lengths]);

  const total_distance = tf.max(cumulative_lengths);

  let normalized_distances = tf.div(tf.mul(Math.PI * 2, cumulative_lengths), total_distance);

  const efd_orders = tf.range(1, order + 1).reshape([order, 1]);
  const denominator = tf.square(efd_orders).mul(2).mul(tf.square(Math.PI));
  let consts = total_distance.div(denominator);
  consts = tf.squeeze(consts);
  normalized_distances = tf.matMul(efd_orders, normalized_distances.reshape([1, -1]));

  const norm_dist_slice0 = normalized_distances.slice([0, 1], [normalized_distances.shape[0], normalized_distances.shape[1] - 1]);
  const norm_dist_slice1 = normalized_distances.slice([0, 0], [normalized_distances.shape[0], normalized_distances.shape[1] - 1]);
  const d_cos_phi = tf.sub(tf.cos(norm_dist_slice0), tf.cos(norm_dist_slice1));
  const d_sin_phi = tf.sub(tf.sin(norm_dist_slice0), tf.sin(norm_dist_slice1));

  const xDistances = pointDistances.slice([0, 0], [pointDistances.shape[0], 1]).squeeze();
  const yDistances = pointDistances.slice([0, 1], [pointDistances.shape[0], 1]).squeeze();

  const cos_phi = xDistances
    .mul(d_cos_phi)
    .div(lengths);
  const aCoeffs = consts.mul(cos_phi.sum(axis=1));
  const bCoeffs = consts.mul(xDistances.div(lengths)
    .mul(d_sin_phi)
    .sum(axis=1));
  const cCoeffs = consts.mul(yDistances.div(lengths)
    .mul(d_cos_phi)
    .sum(axis=1));
  const dCoeffs = consts.mul(yDistances.div(lengths)
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

module.exports = efd;
