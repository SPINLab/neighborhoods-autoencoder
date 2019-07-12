import math
import torch


def efd(polygon_batch: torch.Tensor, order=10) -> torch.Tensor:
    """
    Pytorch function for creating elliptic fourier descriptors. Refactored from
    https://github.com/hbldh/pyefd/blob/master/pyefd.py thank you Henrik Blidh
    :param order: number (scalar) of harmonics for the elliptic fourier descriptors
    :param polygon_batch: a Pytorch tensor of shape (batch_size, num_points, 2)
    :return: a torch tensor of shape (batch_size, order, 4)
    """
    assert isinstance(polygon_batch, torch.Tensor), 'The polygon_batch should be a tensor'
    assert len(polygon_batch.shape) == 3, 'The polygon_batch should be a 3D tensor'
    assert polygon_batch.size(-1) == 2, 'The polygon_batch should be of shape (?, ?, 2): two coordinate axes'

    batch_size = polygon_batch.size(0)

    epsilon = torch.tensor(1e-16)
    # Following https://discuss.pytorch.org/t/equivalent-function-like-numpy-diff-in-pytorch/35327/2
    point_distances = polygon_batch[:, 1:] - polygon_batch[:, :-1]  # pyefd: dxy

    lengths = torch.pow(point_distances, 2)  # pyefd: dt
    lengths = torch.sum(lengths, dim=2)  # pyefd: dt
    lengths = torch.sqrt(lengths + epsilon)  # pyefd: dt

    # Get rid of the epsilons added to zeros
    lengths = lengths - torch.sqrt(epsilon)
    cumulative_lengths = torch.cumsum(lengths, dim=1)  # pyefd: t

    true_max, _ = torch.max(cumulative_lengths, dim=1)
    true_max = true_max.unsqueeze(0).t()  # pyefd: T

    zeros = torch.zeros((batch_size, 1), dtype=polygon_batch.dtype)
    cumulative_lengths = torch.cat((zeros, cumulative_lengths), dim=1)  # pyefd: t

    normalized_distances = (2 * math.pi * cumulative_lengths) / true_max  # pyefd: phi

    efd_orders = torch.arange(1, order + 1, dtype=polygon_batch.dtype)
    efd_orders = efd_orders.unsqueeze(0).t()  # shape: (batch_size, num_points)
    efd_orders = efd_orders.repeat((batch_size, 1, 1))  # pyefd: n in orders. Shape: (batch_size, order)

    # pyefd: phi_n. Shape: (batch_size, order, num_points)
    normalized_distances = normalized_distances.unsqueeze(1)
    # resulting shape (batch_size, order, num_points)
    normalized_distances = torch.matmul(efd_orders, normalized_distances)
    d_cos_phi = torch.cos(normalized_distances[:, :, 1:]) - torch.cos(normalized_distances[:, :, :-1])
    d_sin_phi = torch.sin(normalized_distances[:, :, 1:]) - torch.sin(normalized_distances[:, :, :-1])

    cos_phi = (point_distances[:, :, 0] / lengths).unsqueeze(1) * d_cos_phi  # Shape: (batch, order, num_points - 1)

    consts = true_max.unsqueeze(1) / (2 * efd_orders ** 2 * math.pi ** 2)  # Shape: (batch, order, 1)
    consts = consts.squeeze(2)
    coefficient_a = consts * torch.sum(cos_phi, dim=2)  # Shape: (batch, order)
    coefficient_b = consts * torch.sum((point_distances[:, :, 0] / lengths).unsqueeze(1) * d_sin_phi, dim=2)
    coefficient_c = consts * torch.sum((point_distances[:, :, 1] / lengths).unsqueeze(1) * d_cos_phi, dim=2)
    coefficient_d = consts * torch.sum((point_distances[:, :, 1] / lengths).unsqueeze(1) * d_sin_phi, dim=2)

    efd_coefficients = torch.stack((coefficient_a,
                                    coefficient_b,
                                    coefficient_c,
                                    coefficient_d), dim=2)

    return efd_coefficients


def centroid(polygon_batch: torch.Tensor) -> torch.Tensor:
    assert isinstance(polygon_batch, torch.Tensor), 'The polygon_batch should be a tensor'
    assert len(polygon_batch.size()) == 3, 'The polygon_batch should be a 3D tensor'

    batch_size = polygon_batch.size(0)
    epsilon = torch.tensor(1e-16)
    # Following https://discuss.pytorch.org/t/equivalent-function-like-numpy-diff-in-pytorch/35327/2
    point_distances = polygon_batch[:, 1:] - polygon_batch[:, :-1]  # pyefd: dxy

    lengths = torch.pow(point_distances, 2)  # pyefd: dt
    lengths = torch.sum(lengths, dim=2)  # pyefd: dt
    lengths = torch.sqrt(lengths + epsilon)  # pyefd: dt

    # Get rid of the epsilons added to zeros
    lengths = lengths - torch.sqrt(epsilon)
    cumulative_lengths = torch.cumsum(lengths, dim=1)  # pyefd: t

    true_max, _ = torch.max(cumulative_lengths, dim=1)
    true_max = true_max.unsqueeze(0).t()  # pyefd: T

    zeros = torch.zeros((batch_size, 1), dtype=polygon_batch.dtype)
    cumulative_lengths = torch.cat((zeros, cumulative_lengths), dim=1)  # pyefd: t

    squared_cum_lengths = torch.pow(cumulative_lengths, 2)
    diff_squared_cum_lengths = squared_cum_lengths[:, 1:] - squared_cum_lengths[:, :-1]

    xi_delta = torch.cumsum(point_distances, dim=1) - \
           (point_distances / lengths.unsqueeze(-1)) * cumulative_lengths[:, 1:].unsqueeze(-1)  # pyefd: xi
    offsets = (1 / true_max) * torch.sum(
        (point_distances / (2 * lengths.unsqueeze(-1))) *
        diff_squared_cum_lengths.unsqueeze(-1) + xi_delta * lengths.unsqueeze(-1), dim=1)

    return offsets + polygon_batch[:, 0]
