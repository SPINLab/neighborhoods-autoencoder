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
        geom_extra_node = 'POLYGON((0 0, 1 0, 1 1, 0 1, 0 0.5, 0 0))'

        geom2 = 'POLYGON((1 1, 0 1, 0 0, 1 0, 1 1))'
        geom2 = gv.vectorize_wkt(geom2)
        polygon_tensor = geom1[:, :2]
        polygon_tensor = torch.from_numpy(polygon_tensor)

        coords_batch = geom2[:, :2]
        coords_batch = coords_batch.reshape(1, geom2.shape[0], 2)
        reference_descriptors = pyefd.elliptic_fourier_descriptors(coords_batch[0], order=10)
        stand_in_descriptors = elliptic_fourier_descriptors(coords_batch[0], order=10)

        with self.subTest('Our stand-in efd function does the same as pyefd'):
            np.testing.assert_array_equal(reference_descriptors, stand_in_descriptors)

        with self.subTest('It does not accept a numpy ndarray'):
            with self.assertRaises(AssertionError):
                efd(geom1)

        with self.subTest('It rejects 3D geometries'):
            with self.assertRaises(AssertionError):
                efd(torch.rand((10, 3)))

        with self.subTest('It creates an elliptic fourier descriptor of a geometry, the same as pyefd creates'):
            # polygon1_tensor = geom1[:, :2]
            # polygon1_tensor = torch.from_numpy(polygon1_tensor)
            # polygon1_efd = efd(polygon1_tensor, order=10).numpy()

            polygon2_tensor = coords_batch[0]
            polygon2_tensor = torch.from_numpy(polygon2_tensor)
            polygon2_efd = efd(polygon2_tensor, order=10).numpy()

            np.testing.assert_array_almost_equal(reference_descriptors, polygon2_efd)

        with self.subTest('It handles inputs of zeros without nans'):
            zero_coordinates = torch.zeros((10, 2), dtype=torch.double)
            coeffs = efd(zero_coordinates)
            coeffs = coeffs.numpy()

            for element in coeffs.flatten():
                self.assertFalse(np.isnan(element))

        with self.subTest('It creates equal coefficients for zero-padded coordinate sequences'):
            torch.manual_seed(42)
            random_coordinates = torch.rand((4, 2), dtype=torch.double)
            zero_padded_random_coords = torch.cat((random_coordinates, torch.zeros((1000, 2), dtype=torch.double)))

            non_zero_coeffs = efd(random_coordinates).numpy()
            padded_coeffs = efd(zero_padded_random_coords).numpy()

            np.testing.assert_array_almost_equal(non_zero_coeffs, padded_coeffs)
