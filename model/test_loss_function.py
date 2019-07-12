import unittest

import torch
from deep_geometry import vectorizer as gv

from model.EFDloss import EFDloss


class TestLossFunction(unittest.TestCase):
    def test_loss_function(self):
        geom1 = 'POLYGON((0 0, 1 0, 1 1, 0 1, 0 0))'
        geom2 = 'POLYGON((1 0, 1 1, 0 1, 0 0, 1 0))'

        diamond = 'POLYGON((1 0, 2 1, 1 2, 0 1, 1 0))'

        test_square = gv.vectorize_wkt(geom1)
        test_square = torch.from_numpy(test_square).unsqueeze(0)

        output_square = gv.vectorize_wkt(geom2)
        output_square = torch.from_numpy(output_square).unsqueeze(0)

        test_diamond = gv.vectorize_wkt(diamond)
        test_diamond = torch.from_numpy(test_diamond).unsqueeze(0) + 1  # offset by 1

        with self.subTest('It rejects tensors of length other than 7 on the second axis'):
            loss_function = EFDloss(order=10)
            with self.assertRaises(AssertionError):
                loss_function(torch.rand((1, 1, 5)), output_square)

        with self.subTest('It returns a tensor'):
            loss = loss_function(test_square, output_square)
            self.assertEqual(type(loss).__name__, 'Tensor')

        with self.subTest('It returns a loss of 0 for geometries that are really identical'):
            loss = loss_function(test_square, test_square)
            loss = loss.numpy()
            self.assertEqual(loss, 0.)

        with self.subTest('It returns a loss of 0 for geometries that are almost identical'):
            loss_function = EFDloss(order=50)
            loss = loss_function(test_square, output_square)
            loss = loss.numpy()
            self.assertAlmostEqual(loss, 0.0, places=1)

        with self.subTest('It returns a non-zero tensor for non-identical geometries'):
            loss_function = EFDloss(order=50)
            loss = loss_function(test_square, test_diamond)
            loss = loss.numpy()
            self.assertGreater(loss, 1.)
