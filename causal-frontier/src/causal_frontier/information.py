"""Discrete information statistics and strictly pre-lightcone data partitioning.

Finite-sample plug-in mutual information is generally positive under H0.
Statistical association alone does not demonstrate causal signalling.
"""

from __future__ import annotations

from dataclasses import dataclass
import math
import numpy as np


@dataclass(frozen=True)
class PermutationResult:
    observed_bits: float
    p_value: float
    permutations: int
    seed: int


def _paired_1d(x: np.ndarray, y: np.ndarray) -> tuple[np.ndarray, np.ndarray]:
    a, b = np.asarray(x), np.asarray(y)
    if a.ndim != 1 or b.ndim != 1 or len(a) != len(b) or len(a) == 0:
        raise ValueError("Expected two nonempty, equal-length 1D sequences")
    return a, b


def entropy_bits(x: np.ndarray) -> float:
    """Empirical discrete Shannon entropy in bits."""
    a = np.asarray(x)
    if a.ndim != 1 or a.size == 0:
        raise ValueError("Expected a nonempty 1D sequence")
    _, counts = np.unique(a, return_counts=True)
    p = counts / counts.sum()
    return float(-np.sum(p * np.log2(p)))


def mutual_information_bits(x: np.ndarray, y: np.ndarray) -> float:
    """Empirical discrete plug-in MI in bits; not bias-corrected."""
    a, b = _paired_1d(x, y)
    _, ix = np.unique(a, return_inverse=True)
    _, iy = np.unique(b, return_inverse=True)
    counts = np.zeros((int(ix.max()) + 1, int(iy.max()) + 1), dtype=np.int64)
    np.add.at(counts, (ix, iy), 1)
    p = counts / len(a)
    px = p.sum(axis=1, keepdims=True)
    py = p.sum(axis=0, keepdims=True)
    expected = px @ py
    nonzero = p > 0
    mi = float(np.sum(p[nonzero] * np.log2(p[nonzero] / expected[nonzero])))
    return max(0.0, mi)


def conditional_entropy_bits(x: np.ndarray, y: np.ndarray) -> float:
    """Empirical H(X|Y), subject to plug-in estimator bias."""
    return max(0.0, entropy_bits(np.asarray(x)) - mutual_information_bits(x, y))


def bit_error_rate(sent: np.ndarray, received: np.ndarray) -> float:
    a, b = _paired_1d(sent, received)
    if not np.all(np.isin(a, [0, 1])) or not np.all(np.isin(b, [0, 1])):
        raise ValueError("BER requires binary 0/1 sequences")
    return float(np.mean(a != b))


def permutation_test_mi(
    x: np.ndarray, y: np.ndarray, *, permutations: int = 999, seed: int = 0
) -> PermutationResult:
    """Monte Carlo permutation test for association (not causal attribution).

    The minimum attainable p-value is 1/(permutations+1). Do not claim
    discovery-scale significance from a small permutation budget.
    """
    a, b = _paired_1d(x, y)
    if permutations < 1:
        raise ValueError("permutations must be >= 1")
    rng = np.random.default_rng(seed)
    observed = mutual_information_bits(a, b)
    exceedances = 0
    for _ in range(permutations):
        shuffled = rng.permutation(b)
        if mutual_information_bits(a, shuffled) >= observed - 1e-14:
            exceedances += 1
    return PermutationResult(observed, (exceedances + 1) / (permutations + 1),
                             permutations, seed)


def benjamini_hochberg(p_values: np.ndarray, *, alpha: float = 0.05) -> np.ndarray:
    """Benjamini-Hochberg FDR decisions for a prespecified test family."""
    p = np.asarray(p_values, dtype=float)
    if p.ndim != 1 or not np.all(np.isfinite(p)) or np.any((p < 0) | (p > 1)):
        raise ValueError("p_values must be finite probabilities in a 1D array")
    if not 0 < alpha < 1:
        raise ValueError("alpha must lie strictly between 0 and 1")
    rejected = np.zeros(p.size, dtype=bool)
    if not p.size:
        return rejected
    order = np.argsort(p)
    thresholds = alpha * np.arange(1, p.size + 1) / p.size
    passed = np.flatnonzero(p[order] <= thresholds)
    if passed.size:
        rejected[order[:passed[-1] + 1]] = True
    return rejected


def prelightcone_slice(
    observation_times_s: np.ndarray, observations: np.ndarray, light_arrival_s: float
) -> tuple[np.ndarray, np.ndarray]:
    """Return only times strictly before reference-background light arrival.

    This function does not itself establish spacelike separation in a candidate
    curved metric. Never use >=t_light data to fit pre-window classifiers.
    """
    t = np.asarray(observation_times_s, dtype=float)
    y = np.asarray(observations)
    if t.ndim != 1 or y.ndim == 0 or len(t) != len(y):
        raise ValueError("Times must be 1D and match the first observation dimension")
    if not np.all(np.isfinite(t)) or not math.isfinite(light_arrival_s):
        raise ValueError("Times must be finite")
    mask = t < light_arrival_s
    return t[mask], y[mask]
