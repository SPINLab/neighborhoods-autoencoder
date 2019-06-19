import unittest

from torch.utils.data import DataLoader

from model.polygon_batch_collator import polygon_collate
from model.PolygonDataset import PolygonDataset


class TestPolygonDataLoading(unittest.TestCase):
    def test_batch_collator(self):
        dataset = PolygonDataset(path='../data/unit_testing_data.npz')
        batch = dataset.data[:10]
        collated = polygon_collate(batch)
        self.assertEqual(collated.size(0), 10)

    def test_load_batch(self):
        dataset = PolygonDataset(path='../data/unit_testing_data.npz')
        dataloader = DataLoader(dataset, batch_size=10, collate_fn=polygon_collate)

        batches = list(dataloader)

        with self.subTest('It is going to create a set of 10 batches '):
            self.assertEqual(len(batches), 10)

        with self.subTest('It has a size of seven on the last dimension'):
            self.assertEqual(batches[0].size(-1), 7)
