"""Bell-pair Born-rule marginals and a seeded no-signalling calibration.

These are standard quantum predictions, not evidence of a communication
channel. Classical comparison of Alice/Bob records is a separate step.
"""

from __future__ import annotations

import numpy as np


def bell_phi_plus() -> np.ndarray:
    """|Phi+> in computational basis |00>, |01>, |10>, |11>."""
    return np.array([1.0, 0.0, 0.0, 1.0], dtype=complex) / np.sqrt(2.0)


def bell_density_matrix() -> np.ndarray:
    psi = bell_phi_plus()
    return np.outer(psi, psi.conj())


def bob_reduced_density() -> np.ndarray:
    """Trace over Alice (first qubit), yielding I/2."""
    return np.trace(bell_density_matrix().reshape(2, 2, 2, 2),
                    axis1=0, axis2=2)


def _projectors(basis: str) -> tuple[np.ndarray, np.ndarray]:
    z0 = np.array([1.0, 0.0], dtype=complex)
    z1 = np.array([0.0, 1.0], dtype=complex)
    if basis == "Z":
        vectors = (z0, z1)
    elif basis == "X":
        vectors = ((z0 + z1) / np.sqrt(2), (z0 - z1) / np.sqrt(2))
    else:
        raise ValueError("basis must be 'Z' or 'X'")
    return tuple(np.outer(v, v.conj()) for v in vectors)


def joint_outcome_probabilities(alice_basis: str, bob_basis: str) -> np.ndarray:
    """Born probabilities P(a,b|x,y) with a,b in {0,1}."""
    a_projectors = _projectors(alice_basis)
    b_projectors = _projectors(bob_basis)
    rho = bell_density_matrix()
    probabilities = np.array([
        [float(np.real(np.trace(np.kron(pa, pb) @ rho)))
         for pb in b_projectors]
        for pa in a_projectors
    ])
    return probabilities


def bob_marginal(alice_basis: str, bob_basis: str) -> np.ndarray:
    """Bob's unconditioned P(b|x,y); independent of Alice's x."""
    return joint_outcome_probabilities(alice_basis, bob_basis).sum(axis=0)


def simulate_bell_outcomes(
    alice_bases: np.ndarray, bob_bases: np.ndarray, *, seed: int = 0
) -> tuple[np.ndarray, np.ndarray]:
    """Seeded Monte Carlo outcomes with correct joint Born probabilities."""
    alice = np.asarray(alice_bases)
    bob = np.asarray(bob_bases)
    if alice.ndim != 1 or bob.ndim != 1 or len(alice) != len(bob):
        raise ValueError("Expected equal-length basis arrays")
    if not np.all(np.isin(alice, ["Z", "X"])) or not np.all(np.isin(bob, ["Z", "X"])):
        raise ValueError("Only Z and X bases are implemented")
    rng = np.random.default_rng(seed)
    a_out = np.empty(len(alice), dtype=np.int8)
    b_out = np.empty(len(bob), dtype=np.int8)
    for a_basis in ("Z", "X"):
        for b_basis in ("Z", "X"):
            mask = (alice == a_basis) & (bob == b_basis)
            n = int(np.count_nonzero(mask))
            if n:
                p = joint_outcome_probabilities(a_basis, b_basis).ravel()
                samples = rng.choice(4, size=n, p=p)
                a_out[mask] = samples // 2
                b_out[mask] = samples % 2
    return a_out, b_out
