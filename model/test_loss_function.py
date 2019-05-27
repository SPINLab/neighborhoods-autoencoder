import unittest

import torch
from deep_geometry import vectorizer as gv

from model.loss_function import loss_function


class TestLossFunction(unittest.TestCase):
    def test_loss_function(self):
        geom1 = 'POLYGON((0 0, 1 0, 1 1, 0 1, 0 0))'
        geom2 = 'POLYGON((1 1, 0 1, 0 0, 1 0, 1 1))'
        geom_extra_node = 'POLYGON((0 0, 1 0, 1 1, 0 1, 0 0.5, 0 0))'

        diamond = 'POLYGON((1 0, 2 1, 1 2, 0 1, 1 0))'

        test_square = gv.vectorize_wkt(geom1)
        test_square = torch.from_numpy(test_square)

        test_square_extra_node = gv.vectorize_wkt(geom_extra_node)
        test_square_extra_node = torch.from_numpy(test_square_extra_node)

        output_square = gv.vectorize_wkt(geom2)
        output_square = torch.from_numpy(output_square)

        test_diamond = gv.vectorize_wkt(diamond)
        test_diamond = torch.from_numpy(test_diamond)

        with self.subTest('It accepts only tensors of length 7 on the second axis'):
            loss_function(test_square, output_square)

        with self.subTest('It returns a tensor'):
            loss = loss_function(test_square, output_square)
            self.assertEqual(type(loss).__name__, 'Tensor')

        with self.subTest('It returns a loss of 0 for geometries that are really identical'):
            loss = loss_function(test_square, test_square)
            loss = loss.numpy()
            self.assertEqual(loss, 0.)

        with self.subTest('It returns a loss of 0 for geometries that are almost identical'):
            loss = loss_function(test_square, output_square)
            loss = loss.numpy()
            self.assertEqual(loss, 0.)

        with self.subTest('It returns a non-zero tensor for non-identical geometries'):
            loss = loss_function(test_square, test_diamond)
            loss = loss.numpy()
            self.assertGreater(loss, 0.)

        # with self.subTest('It returns a zero or almost zero loss for a set of same squares where one has an extra node'):
        #     loss = loss_function(test_square, test_square_extra_node)
