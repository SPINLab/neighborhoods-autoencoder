import math
import torch


def efd(polygon: torch.Tensor, order=2) -> torch.Tensor:
    """
    Pytorch function for creating elliptic fourier descriptors. Refactored from
    https://github.com/hbldh/pyefd/blob/master/pyefd.py thank you Henrik Blidh
    :param order: number of harmonics for the elliptic fourier descriptors
    :param polygon: a Pytorch tensor of shape (?, 2)
    :return:
    """
    assert type(polygon).__name__ == 'Tensor', 'The polygon should be a tensor'

    # Following https://discuss.pytorch.org/t/equivalent-function-like-numpy-diff-in-pytorch/35327/2
    distances_between_nodes = polygon[1:] - polygon[:-1]

    positive_distances = torch.pow(distances_between_nodes, 2)
    positive_distances = torch.sum(positive_distances, dim=1)
    positive_distances = torch.sqrt(positive_distances)

    cumulative_distances = torch.cumsum(positive_distances, dim=0)
    zeros = torch.zeros((1,), dtype=torch.double)
    cumulative_distances = torch.cat((zeros, cumulative_distances))

    total_distance = cumulative_distances[-1]
    normalized_distances = (2 * math.pi * cumulative_distances) / total_distance  # pyefd: phi

    efd_orders = torch.arange(1, order + 1, dtype=torch.double)

    const = total_distance / (2 * efd_orders * efd_orders * math.pi * math.pi)
    print('normalized distances:', normalized_distances.numpy())
    print('efd_orders:', efd_orders.numpy())
    normalized_distances_for_order = torch.dot(normalized_distances * efd_orders)
    d_cos_phi_n = torch.cos(normalized_distances_for_order[1:]) - torch.cos(normalized_distances_for_order[:-1])
    d_sin_phi_n = torch.sin(normalized_distances_for_order[1:]) - torch.sin(normalized_distances_for_order[:-1])
    coefficient_a_for_order = const * torch.sum((distances_between_nodes[:, 0] / positive_distances) * d_cos_phi_n)
    coefficient_b_for_order = const * torch.sum((distances_between_nodes[:, 0] / positive_distances) * d_sin_phi_n)
    coefficient_c_for_order = const * torch.sum((distances_between_nodes[:, 1] / positive_distances) * d_cos_phi_n)
    coefficient_d_for_order = const * torch.sum((distances_between_nodes[:, 1] / positive_distances) * d_sin_phi_n)

    efd_coefficients = torch.stack((coefficient_a_for_order,
                                   coefficient_b_for_order,
                                   coefficient_c_for_order,
                                   coefficient_d_for_order))
    print('efd coeffs:', efd_coefficients.numpy())

    return efd_coefficients
