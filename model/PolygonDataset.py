from torch.utils.data import Dataset
import numpy as np


class PolygonDataset(Dataset):
    def __init__(self, path):
        packed_data = np.load(path, allow_pickle=True)
        self.data = packed_data['data']

    def __len__(self):
        return len(self.data)

    def __getitem__(self, index):
        return self.data[index]
