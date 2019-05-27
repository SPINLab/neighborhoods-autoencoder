import unittest

import torch
from deep_geometry import vectorizer as gv

from model.stand_in_efd import elliptic_fourier_descriptors
from model.pytorch_efd import efd


class TestEllipticFourierDescriptor(unittest.TestCase):
    def test_efd(self):
        geom1 = 'POLYGON((0 0, 1 0, 1 1, 0 1, 0 0))'
        geom1 = gv.vectorize_wkt(geom1)

        geom2 = 'POLYGON((1 1, 0 1, 0 0, 1 0, 1 1))'
        geom_extra_node = 'POLYGON((0 0, 1 0, 1 1, 0 1, 0 0.5, 0 0))'

        reference_descriptors = elliptic_fourier_descriptors(geom1[:, :2]).flatten().tolist()

        with self.subTest('It does not accept a numpy ndarray'):
            with self.assertRaises(AssertionError):
                efd(geom1)

        with self.subTest('It creates an elliptic fourier descriptor of a geometry, the same as pyefd creates'):
            polygon_tensor = geom1[:, :2]
            polygon_tensor = torch.from_numpy(polygon_tensor)

            our_descriptors = efd(polygon_tensor).numpy()

            print('torch efd:', our_descriptors)
            self.assertListEqual(reference_descriptors, our_descriptors)
