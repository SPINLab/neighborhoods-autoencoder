import torch
import numpy as np


def polygon_collate(polygon_list: list) -> torch.Tensor:
    """
    Assembles a list of polygons by concatenating replication-padded polygons into a batch
    :param polygon_list: a list of polygons
    :return: a torch.Tensor (mini)batch
    """
    longest_polygon_size = max([len(p) for p in polygon_list])
    inputs = []

    for polygon in polygon_list:
        padding_size = longest_polygon_size - len(polygon)
        last_point = polygon[-1]
        replication_padding = np.repeat([last_point], padding_size, axis=0)
        polygon = np.concatenate((polygon, replication_padding), axis=0)
        inputs.append(polygon)

    inputs = np.array(inputs)
    inputs = torch.from_numpy(inputs)

    return inputs
