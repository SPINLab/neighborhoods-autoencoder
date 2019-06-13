import math
import torch


def efd(polygon_batch: torch.Tensor, order=10) -> torch.Tensor:
    """
    Pytorch function for creating elliptic fourier descriptors. Refactored from
    https://github.com/hbldh/pyefd/blob/master/pyefd.py thank you Henrik Blidh
    :param order: number of harmonics for the elliptic fourier descriptors
    :param polygon_batch: a Pytorch tensor of shape (?, 2)
    :return:
    """
    assert isinstance(polygon_batch, torch.Tensor), 'The polygon_batch should be a tensor'
    assert len(polygon_batch.size()) == 3, 'The batch of polygons should be a 3D tensor'
    assert polygon_batch.size(-1) == 2, 'The polygon_batch should be of shape (?, 2): two coordinate axes'

    batch_size = polygon_batch.size(0)

    # Add zero-padding in case the polygon_batch doesn't have this
    zeros = torch.zeros((batch_size, 4, 2), dtype=polygon_batch.dtype)
    polygon_batch = torch.cat((polygon_batch, zeros), dim=1)

    epsilon = torch.tensor(1e-16)
    # Following https://discuss.pytorch.org/t/equivalent-function-like-numpy-diff-in-pytorch/35327/2
    point_distances = polygon_batch[:, 1:] - polygon_batch[:, :-1]  # pyefd: dxy

    lengths = torch.pow(point_distances, 2)  # pyefd: dt
    lengths = torch.sum(lengths, dim=(2,))  # pyefd: dt
    lengths = torch.sqrt(lengths + epsilon)  # pyefd: dt

    # Get rid of the epsilons added to zeros
    lengths = lengths - torch.sqrt(epsilon)

    cumulative_lengths = torch.cumsum(lengths, dim=1)  # pyefd: t

    # Replace the false maximum introduced by the zero padding with a true max
    false_max = torch.max(cumulative_lengths, dim=1)
    false_max = false_max[0]
    rescale_factor = cumulative_lengths / (cumulative_lengths - false_max + epsilon)
    cumulative_lengths = cumulative_lengths - false_max
    cumulative_lengths = cumulative_lengths * rescale_factor

    # Replace the zeros with true max
    true_max = torch.max(cumulative_lengths, dim=1)
    true_max = true_max[0]
    rescale_factor = (cumulative_lengths - true_max) / (cumulative_lengths +  epsilon)
    cumulative_lengths = cumulative_lengths * rescale_factor
    cumulative_lengths = cumulative_lengths + true_max

    zeros = torch.zeros((batch_size, 1), dtype=torch.double)
    cumulative_lengths = torch.cat((zeros, cumulative_lengths), dim=1)  # pyefd: t
    total_distance = cumulative_lengths[:, -1]  # pyefd: T TODO: replace by true_max

    normalized_distances = (2 * math.pi * cumulative_lengths) / total_distance  # pyefd: phi

    efd_orders = torch.arange(1, order + 1, dtype=torch.double).view(batch_size, -1)  # pyefd: n in orders
    consts = total_distance / (2 * efd_orders ** 2 * math.pi ** 2)
    normalized_distances = efd_orders.t() * normalized_distances   # pyefd: phi_n
    d_cos_phi = torch.cos(normalized_distances[:, 1:]) - torch.cos(normalized_distances[:, :-1])
    d_sin_phi = torch.sin(normalized_distances[:, 1:]) - torch.sin(normalized_distances[:, :-1])
    cos_phi = (point_distances[:, :, 0] / lengths) * d_cos_phi
    coefficient_a = consts * torch.sum(cos_phi, dim=1)
    coefficient_b = consts * torch.sum((point_distances[:, :, 0] / lengths) * d_sin_phi, dim=1)
    coefficient_c = consts * torch.sum((point_distances[:, :, 1] / lengths) * d_cos_phi, dim=1)
    coefficient_d = consts * torch.sum((point_distances[:, :, 1] / lengths) * d_sin_phi, dim=1)

    efd_coefficients = torch.stack((coefficient_a,
                                    coefficient_b,
                                    coefficient_c,
                                    coefficient_d), dim=2)

    return efd_coefficients
