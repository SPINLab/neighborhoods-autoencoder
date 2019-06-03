import unittest

import torch
from deep_geometry import vectorizer as gv
import numpy as np
import pyefd

from model.stand_in_efd import elliptic_fourier_descriptors
from model.pytorch_efd import efd


class TestEllipticFourierDescriptor(unittest.TestCase):
    def test_efd(self):
        geom1 = 'POLYGON((0 0, 1 0, 1 1, 0 1, 0 0))'
        geom1 = gv.vectorize_wkt(geom1)

        geom2 = 'POLYGON((1 1, 0 1, 0 0, 1 0, 1 1))'
        geom_extra_node = 'POLYGON((0 0, 1 0, 1 1, 0 1, 0 0.5, 0 0))'
        polygon_tensor = geom1[:, :2]
        polygon_tensor = torch.from_numpy(polygon_tensor)

        reference_descriptors = pyefd.elliptic_fourier_descriptors(geom1[:, :2], order=10)
        stand_in_descriptors = elliptic_fourier_descriptors(geom1[:, :2], order=10)

        with self.subTest('Our stand-in efd function does the same as pyefd'):
            np.testing.assert_array_equal(reference_descriptors, stand_in_descriptors)

        with self.subTest('It does not accept a numpy ndarray'):
            with self.assertRaises(AssertionError):
                efd(geom1)

        with self.subTest('It rejects 3D geometries'):
            with self.assertRaises(AssertionError):
                efd(torch.rand((10, 3)))

        with self.subTest('It creates an elliptic fourier descriptor of a geometry, the same as pyefd creates'):
            polygon_tensor = geom1[:, :2]
            polygon_tensor = torch.from_numpy(polygon_tensor)

            our_descriptors = efd(polygon_tensor, order=10).numpy()

            np.testing.assert_array_almost_equal(reference_descriptors, our_descriptors)
