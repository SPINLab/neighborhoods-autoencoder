import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import chaiAlmost from 'chai-almost';
// const chaiAsPromised = require('chai-as-promised');
// const chaiAlmost = require('chai-almost');

import {efd, efdOffsets, reconstructPolygon} from '../efdCoefficients';
// const efdOffsets = require('../efdCoefficients').efdOffsets;
// const reconstructPolygon = require('../efdCoefficients').reconstructPolygon;

chai.use(chaiAsPromised).should();
chai.use(chaiAlmost(1e-7));

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
      return efd(polygon).should.eventually.be.deep.almost(expectedCoefficients)
    });

    it('rejects non-integer orders', () => {
      return efd(polygon, 'I am not a number')
        .should.be.rejectedWith('Please provide an integer as order argument.');
    })

  });

  describe('The efd offset function', () => {
    it('should calculate the verified offsets', () => {
      const expectedOffsets = [0.5, 0.5];
      return efdOffsets(polygon).should.eventually.be.deep.equal(expectedOffsets)
    });
  });

  describe('The polygon reconstruction function', () => {
    it('should reconstruct the original polygon', function () {
      // const coefficients = efd(polygon;
      chai.use(chaiAlmost(5e-2));
      return reconstructPolygon(expectedCoefficients, [0.5, 0.5], 5)
        .should.eventually.be.deep.almost(polygon);
    });
  })
});
