import math
import torch


def efd(polygon: torch.Tensor, order=10) -> torch.Tensor:
    """
    Pytorch function for creating elliptic fourier descriptors. Refactored from
    https://github.com/hbldh/pyefd/blob/master/pyefd.py thank you Henrik Blidh
    :param order: number of harmonics for the elliptic fourier descriptors
    :param polygon: a Pytorch tensor of shape (?, 2)
    :return:
    """
    assert isinstance(polygon, torch.Tensor), 'The polygon should be a tensor'
    assert polygon.size(1) == 2, 'The polygon should be of shape (?, 2): two coordinate axes'

    # Add zero-padding in case the polygon doesn't have this
    zeros = torch.zeros((4, 2), dtype=polygon.dtype)
    polygon = torch.cat((polygon, zeros))

    epsilon = torch.tensor(1e-16)
    # Following https://discuss.pytorch.org/t/equivalent-function-like-numpy-diff-in-pytorch/35327/2
    point_distances = polygon[1:] - polygon[:-1]  # pyefd: dxy

    lengths = torch.pow(point_distances, 2)  # pyefd: dt
    lengths = torch.sum(lengths, dim=(1,))  # pyefd: dt
    lengths = torch.sqrt(lengths + epsilon)  # pyefd: dt

    # Get rid of the epsilons added to zeros
    lengths = lengths - torch.sqrt(epsilon)

    cumulative_lengths = torch.cumsum(lengths, dim=0)  # pyefd: t

    # Replace the false maximum introduced by the zero padding with a true max
    false_max = torch.max(cumulative_lengths)
    rescale_factor = cumulative_lengths / (cumulative_lengths - false_max + epsilon)
    reduced_cumsums = cumulative_lengths - false_max
    rescaled_cumsums = reduced_cumsums * rescale_factor

    # Replace the zeros with true max
    true_max = torch.max(rescaled_cumsums)
    rescale_factor = rescaled_cumsums / (rescaled_cumsums - true_max + epsilon)
    rescaled_cumsums = rescaled_cumsums * rescale_factor  # TODO: this is / (rescale_factor + epsilon) or something
    rescaled_cumsums = rescaled_cumsums + true_max

    zeros = torch.zeros((1,), dtype=torch.double)
    cumulative_lengths = torch.cat((zeros, cumulative_lengths))  # pyefd: t
    total_distance = cumulative_lengths[-1]  # pyefd: T

    normalized_distances = (2 * math.pi * cumulative_lengths) / total_distance  # pyefd: phi

    efd_orders = torch.arange(1, order + 1, dtype=torch.double).view(-1, 1)  # pyefd: n in orders
    const = total_distance / (2 * efd_orders ** 2 * math.pi ** 2)
    const = const.squeeze()  # pyefd: const as well
    normalized_distances = torch.matmul(efd_orders, normalized_distances.view(1, -1))   # pyefd: phi_n
    d_cos_phi = torch.cos(normalized_distances[:, 1:]) - torch.cos(normalized_distances[:, :-1])
    d_sin_phi = torch.sin(normalized_distances[:, 1:]) - torch.sin(normalized_distances[:, :-1])
    cos_phi = (point_distances[:, 0] / lengths) * d_cos_phi
    coefficient_a = const * torch.sum(cos_phi, dim=(1,))
    coefficient_b = const * torch.sum((point_distances[:, 0] / lengths) * d_sin_phi, dim=(1,))
    coefficient_c = const * torch.sum((point_distances[:, 1] / lengths) * d_cos_phi, dim=(1,))
    coefficient_d = const * torch.sum((point_distances[:, 1] / lengths) * d_sin_phi, dim=(1,))

    efd_coefficients = torch.stack((coefficient_a,
                                    coefficient_b,
                                    coefficient_c,
                                    coefficient_d), dim=1)

    return efd_coefficients
