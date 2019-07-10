import unittest

import torch
from deep_geometry import vectorizer as gv
import numpy as np
import pyefd

from model.numpy_vectorized_efd import numpy_vectorized_efd
from model.pytorch_efd import efd, centroid


class TestEllipticFourierDescriptor(unittest.TestCase):
    def test_efd(self):
        geom1 = 'POLYGON((0 0, 1 0, 1 1, 0 1, 0 0))'
        geom1 = gv.vectorize_wkt(geom1)

        geom2 = 'POLYGON((1 1, 0 1, 0 0, 1 0, 1 1))'
        geom2 = gv.vectorize_wkt(geom2)

        coords_batch = geom2[:, :2]
        coords_batch = coords_batch.reshape(1, geom2.shape[0], 2)
        pyefd_descriptors = pyefd.elliptic_fourier_descriptors(coords_batch[0], order=10)
        numpy_vectorized_descriptors = numpy_vectorized_efd(coords_batch[0], order=10)

        polygon2_tensor = torch.from_numpy(coords_batch)
        polygon2_tensor.requires_grad = True
        pytorch_descriptors = efd(polygon2_tensor, order=10)

        with self.subTest('It does not accept a numpy ndarray'):
            with self.assertRaises(AssertionError):
                efd(geom1)

        with self.subTest('It rejects 3D geometries'):
            with self.assertRaises(AssertionError):
                efd(torch.rand((10, 3)))

        with self.subTest('Our stand-in efd function does the same as pyefd'):
            np.testing.assert_array_equal(pyefd_descriptors, numpy_vectorized_descriptors)

        with self.subTest('The pytorch efd does the same as the numpy vectorized function'):
            np.testing.assert_array_almost_equal(pytorch_descriptors[0].detach().numpy(), numpy_vectorized_descriptors)

        with self.subTest('It creates an elliptic fourier descriptor of a geometry, the same as pyefd creates'):
            # polygon1_tensor = geom1[:, :2]
            # polygon1_tensor = torch.from_numpy(polygon1_tensor)
            # polygon1_efd = efd(polygon1_tensor, order=10).numpy()

            np.testing.assert_array_almost_equal(pyefd_descriptors, pytorch_descriptors[0].detach().numpy())

        with self.subTest('It handles inputs of zeros without nans'):
            zero_coordinates = torch.zeros((1, 10, 2), dtype=torch.double)
            coeffs = efd(zero_coordinates)
            coeffs = coeffs.detach().numpy()

            for element in coeffs.flatten():
                self.assertFalse(np.isnan(element))

        with self.subTest('It creates equal coefficients for replication-padded coordinate sequences'):
            torch.manual_seed(42)
            random_coordinates = torch.rand((1, 4, 2), dtype=torch.double)
            last_point = random_coordinates[:, -1]
            replication_padding = last_point.repeat(1, 4, 1)
            padded_random_coords = torch.cat((random_coordinates, replication_padding), dim=1)

            non_zero_coeffs = efd(random_coordinates).detach().numpy()
            padded_coeffs = efd(padded_random_coords).detach().numpy()

            np.testing.assert_array_almost_equal(non_zero_coeffs, padded_coeffs)

        with self.subTest('It creates descriptors for a batch of size 2 same as the pyefd implementation'):
            size_two_batch = torch.cat((polygon2_tensor, polygon2_tensor * 2), dim=0)
            resized_descriptors = pyefd.elliptic_fourier_descriptors(polygon2_tensor[0].detach().numpy() * 2, order=10)
            size_two_descriptors = efd(size_two_batch)

            size_two_descriptors = size_two_descriptors.detach().numpy()
            np.testing.assert_array_almost_equal(pyefd_descriptors, size_two_descriptors[0])
            np.testing.assert_array_almost_equal(resized_descriptors, size_two_descriptors[1])

        with self.subTest('It creates a differentiable function, returning gradients'):
            random_coordinates = torch.randn((1, 4, 2), dtype=torch.double, requires_grad=True)
            descriptors = efd(random_coordinates)
            scalar = torch.mean(descriptors)
            scalar.backward()
            gradients = random_coordinates.grad
            self.assertEqual(gradients.shape, random_coordinates.shape)

    def test_centroid(self):
        geom1 = 'POLYGON((0 0, 1 0, 1 1, 0 1, 0 0))'
        geom1 = gv.vectorize_wkt(geom1)

        with self.subTest('It does not accept a numpy ndarray'):
            with self.assertRaises(AssertionError):
                centroid(geom1)

        with self.subTest('It rejects 3D geometries'):
            with self.assertRaises(AssertionError):
                centroid(torch.rand((10, 3)))

        with self.subTest('Our stand-in centroid function does the same as pyefd'):
            geom2 = 'POLYGON((1 1, 0 1, 0 0, 1 0, 1 1))'
            geom2 = gv.vectorize_wkt(geom2)

            coords_batch = geom2[:, :2]
            coords_batch = coords_batch.reshape(1, geom2.shape[0], 2)
            polygon2_tensor = torch.from_numpy(coords_batch)

            pyefd_centroid = pyefd.calculate_dc_coefficients(coords_batch[0])
            pytorch_centroid = centroid(polygon2_tensor)

            np.testing.assert_array_almost_equal(pyefd_centroid, pytorch_centroid[0])


