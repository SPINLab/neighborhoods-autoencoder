import numpy as np


def elliptic_fourier_descriptors(contour, order=2, normalize=False):
    """Calculate elliptical Fourier descriptors for a contour.
    :param numpy.ndarray contour: A contour array of size ``[M x 2]``.
    :param int order: The order of Fourier coefficients to calculate.
    :param bool normalize: If the coefficients should be normalized;
        see references for details.
    :return: A ``[order x 4]`` array of Fourier coefficients.
    :rtype: :py:class:`numpy.ndarray`
    """
    dxy = np.diff(contour, axis=0)

    dt = dxy ** 2
    dt = dt.sum(axis=1)
    dt = np.sqrt(dt)

    t = np.cumsum(dt)
    t = np.concatenate([([0.]), t])
    T = t[-1]

    phi = (2 * np.pi * t) / T
    coeffs = np.zeros((order, 4))

    order = 1
    for n in range(1, order + 1):
        const = T / (2 * n * n * np.pi * np.pi)
        phi_n = phi * n
        print('phi_n:', phi_n)
        d_cos_phi_n = np.cos(phi_n[1:]) - np.cos(phi_n[:-1])
        d_sin_phi_n = np.sin(phi_n[1:]) - np.sin(phi_n[:-1])
        a_n = const * np.sum((dxy[:, 0] / dt) * d_cos_phi_n)
        b_n = const * np.sum((dxy[:, 0] / dt) * d_sin_phi_n)
        c_n = const * np.sum((dxy[:, 1] / dt) * d_cos_phi_n)
        d_n = const * np.sum((dxy[:, 1] / dt) * d_sin_phi_n)

    coeffs[n - 1, :] = a_n, b_n, c_n, d_n
    # print('pyefd coeffs:', coeffs)

    return coeffs
