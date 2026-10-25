import numpy as np

from causal_frontier.information import mutual_information_bits
from causal_frontier.quantum import (
    bob_reduced_density, bob_marginal,
    joint_outcome_probabilities, simulate_bell_outcomes,
)


def test_bob_reduced_state_is_maximally_mixed():
    np.testing.assert_allclose(bob_reduced_density(), np.eye(2) / 2, atol=1e-15)


def test_bob_marginal_independent_of_alice_basis():
    for bob_basis in ("Z", "X"):
        np.testing.assert_allclose(
            bob_marginal("Z", bob_basis),
            bob_marginal("X", bob_basis),
            atol=1e-15,
        )
        np.testing.assert_allclose(bob_marginal("X", bob_basis), [0.5, 0.5],
                                   atol=1e-15)


def test_matching_bases_are_correlated_after_comparison():
    for basis in ("Z", "X"):
        p = joint_outcome_probabilities(basis, basis)
        np.testing.assert_allclose(p, [[0.5, 0], [0, 0.5]], atol=1e-15)


def test_alice_setting_not_decodable_from_bob_local_record():
    rng = np.random.default_rng(20261025)
    n = 20_000
    alice_message = rng.integers(0, 2, n)
    alice_bases = np.where(alice_message == 0, "Z", "X")
    bob_bases = np.full(n, "Z")
    _, bob_local = simulate_bell_outcomes(alice_bases, bob_bases, seed=123)
    assert mutual_information_bits(alice_message, bob_local) < 0.01
