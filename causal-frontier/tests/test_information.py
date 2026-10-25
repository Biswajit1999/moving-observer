import numpy as np
import pytest

from causal_frontier.information import (
    entropy_bits, conditional_entropy_bits, mutual_information_bits,
    bit_error_rate, permutation_test_mi, benjamini_hochberg,
    prelightcone_slice,
)


def test_binary_perfect_copy_is_one_bit():
    x = np.tile([0, 1], 500)
    assert np.isclose(entropy_bits(x), 1.0)
    assert np.isclose(mutual_information_bits(x, x), 1.0)
    assert np.isclose(conditional_entropy_bits(x, x), 0.0)
    assert bit_error_rate(x, x) == 0.0


def test_independent_messages_near_zero_mi():
    rng = np.random.default_rng(20261025)
    x = rng.integers(0, 2, 20_000)
    y = rng.integers(0, 2, 20_000)
    assert mutual_information_bits(x, y) < 0.01
    result = permutation_test_mi(x, y, permutations=99, seed=1)
    assert 0.01 <= result.p_value <= 1.0


def test_bh_fdr():
    result = benjamini_hochberg(np.array([0.001, 0.01, 0.2, 0.9]))
    assert result.tolist() == [True, True, False, False]


def test_pre_window_excludes_boundary_and_future():
    t = np.array([0.0, 1.0, 2.0, 3.0])
    y = np.array([3, 4, 99, 100])
    pre_t, pre_y = prelightcone_slice(t, y, 2.0)
    assert pre_t.tolist() == [0.0, 1.0]
    assert pre_y.tolist() == [3, 4]
    with pytest.raises(ValueError):
        prelightcone_slice(t, y[:-1], 2.0)
