const chai = require('chai');
const expect = require('chai').expect;
const chaiAsPromised = require('chai-as-promised');
const chaiAlmost = require('chai-almost');

const tf = require('@tensorflow/tfjs');

const efd = require('../efdCoefficients');

chai.use(chaiAsPromised).should();
chai.use(chaiAlmost(customTolerance=1e-7));

const polygon = tf.tensor([[1., 1.], [0., 1.], [0., 0.], [1., 0.], [1., 1.]]);

const expectedCoefficients =
  [[ 4.05284735e-01, -4.05284735e-01,  4.05284735e-01,  4.05284735e-01],
   [ 0.00000000e+00,  2.48165326e-17,  0.00000000e+00, -2.48165326e-17],
   [ 4.50316372e-02,  4.50316372e-02,  4.50316372e-02, -4.50316372e-02],
   [ 0.00000000e+00,  6.24440005e-34 , 0.00000000e+00, -6.24440005e-34],
   [ 1.62113894e-02, -1.62113894e-02,  1.62113894e-02, 1.62113894e-02],
   [ 0.00000000e+00,  8.27217755e-18,  0.00000000e+00, -8.27217755e-18],
   [ 8.27111703e-03 , 8.27111703e-03,  8.27111703e-03, -8.27111703e-03],
   [ 0.00000000e+00,  3.12220003e-34,  0.00000000e+00, -3.12220003e-34],
   [ 5.00351524e-03, -5.00351524e-03,  5.00351524e-03,  5.00351524e-03],
   [ 0.00000000e+00,  1.21626096e-17,  0.00000000e+00, -1.21626096e-17]];

describe('The tensorflow.js elliptic fourier descriptor library', () => {
  describe('The efd function', () => {
    it('should create the pre-defined coefficients for a simple square', () => {
      return expect(efd(polygon)).to.eventually.be.deep.almost(expectedCoefficients)
    })
  })
});