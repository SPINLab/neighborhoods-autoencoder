const chai = require('chai');
const expect = require('chai').expect;
const chaiAsPromised = require('chai-as-promised');
const chaiAlmost = require('chai-almost');

const efd = require('../efdCoefficients').efd;
const efdOffsets = require('../efdCoefficients').efdOffsets;
const reconstructPolygon = require('../efdCoefficients').reconstructPolygon;

chai.use(chaiAsPromised).should();
chai.use(chaiAlmost(customTolerance=1e-7));

const polygon = [[1., 1.], [0., 1.], [0., 0.], [1., 0.], [1., 1.]];

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

  describe('The efd coefficient function', () => {
    it('should create the pre-defined coefficients for a simple square', () => {
      return expect(efd(polygon)).to.eventually.be.deep.almost(expectedCoefficients)
    })
  });

  describe('The efd offset function', () => {
    it('should calculate the verified offsets', () => {
      const expectedOffsets = [0.5, 0.5];
      return expect(efdOffsets(polygon)).to.eventually.be.deep.equal(expectedOffsets)
    })
  });

  describe('The polygon reconstruction function', () => {
    it('should reconstruct the original polygon', function () {
      // const coefficients = efd(polygon;
      chai.use(chaiAlmost(customTolerance=5e-2));
      return expect(reconstructPolygon(expectedCoefficients, locus=[0.5, 0.5], numberOfPoints=5))
        .to.eventually.be.deep.almost(polygon);
    });
  })
});
