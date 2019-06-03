import numpy as np


def elliptic_fourier_descriptors(contour, order=10, normalize=False):
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

    orders = np.arange(1, order + 1)
    consts = T / (2 * orders * orders * np.pi * np.pi)
    phi = phi * orders.reshape((order, -1))
    d_cos_phi = np.cos(phi[:, 1:]) - np.cos(phi[:, :-1])
    d_sin_phi = np.sin(phi[:, 1:]) - np.sin(phi[:, :-1])
    cos_phi = (dxy[:, 0] / dt) * d_cos_phi
    a = consts * np.sum(cos_phi, axis=1)
    b = consts * np.sum((dxy[:, 0] / dt) * d_sin_phi, axis=1)
    c = consts * np.sum((dxy[:, 1] / dt) * d_cos_phi, axis=1)
    d = consts * np.sum((dxy[:, 1] / dt) * d_sin_phi, axis=1)

    coeffs = np.concatenate([
        a.reshape((order, 1)),
        b.reshape((order, 1)),
        c.reshape((order, 1)),
        d.reshape((order, 1))
        ], axis=1)

    return coeffs
