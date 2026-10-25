"""Print reproducible baseline diagnostics; no FTL claim or real experiment."""

import json
import numpy as np

from causal_frontier.information import mutual_information_bits, permutation_test_mi
from causal_frontier.moving_endpoints import (
    LIGHT_YEAR_M, JULIAN_YEAR_S, light_time_seconds
)
from causal_frontier.optical import ideal_detected_photons_per_second
from causal_frontier.quantum import bob_marginal
from causal_frontier.relativity import C_M_S, tachyonic_antitelephone

rng = np.random.default_rng(20261025)
n = 5000
message = rng.integers(0, 2, size=n)
independent_pre_observations = rng.integers(0, 2, size=n)
post_lightcone_observations = message.copy()
permutation = permutation_test_mi(
    message, independent_pre_observations, permutations=199, seed=20261025
)
proxima_m = 4.24 * LIGHT_YEAR_M
result = {
    "model_status": "ESTABLISHED CONTROLS / HYPOTHETICAL TACHYON THOUGHT EXPERIMENT",
    "proxima_static_light_time_years": light_time_seconds(
        [0, 0, 0], [proxima_m, 0, 0], [0, 0, 0]
    ) / JULIAN_YEAR_S,
    "bob_marginal_alice_Z": bob_marginal("Z", "Z").tolist(),
    "bob_marginal_alice_X": bob_marginal("X", "Z").tolist(),
    "null_mi_estimate_bits": mutual_information_bits(
        message, independent_pre_observations
    ),
    "null_permutation_p": permutation.p_value,
    "post_arrival_perfect_copy_mi_bits": mutual_information_bits(
        message, post_lightcone_observations
    ),
    "ideal_detected_photons_s": ideal_detected_photons_per_second(
        1000, 1e-6, 10, 30, proxima_m,
        detector_and_optics_efficiency=0.2
    ),
    "conditional_antitelephone": {
        "assumed_signal_speed_c": 4.0,
        "assumed_relative_velocity_c": 0.5,
        "causal_loop_under_assumptions": tachyonic_antitelephone(
            1e9, 4 * C_M_S, 0.5 * C_M_S
        ).closed_causal_loop,
    },
    "interpretation": "No faster-than-light communication demonstrated.",
}
print(json.dumps(result, indent=2))
