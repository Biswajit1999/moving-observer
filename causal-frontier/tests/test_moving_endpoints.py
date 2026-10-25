import math
import numpy as np
import pytest

from causal_frontier.moving_endpoints import (
    JULIAN_YEAR_S, LIGHT_YEAR_M, light_time_seconds,
    roundtrip_light_time_seconds,
)
from causal_frontier.relativity import C_M_S


def test_static_proxima_baseline():
    distance = 4.24 * LIGHT_YEAR_M
    t = light_time_seconds([0, 0, 0], [distance, 0, 0], [0, 0, 0])
    assert math.isclose(t / JULIAN_YEAR_S, 4.24, rel_tol=1e-12)
    rtt = roundtrip_light_time_seconds(
        [0, 0, 0], [0, 0, 0], [distance, 0, 0], [0, 0, 0]
    )
    assert math.isclose(rtt / JULIAN_YEAR_S, 8.48, rel_tol=1e-12)


def test_approaching_receiver_analytic():
    r = 1e12
    v = 22_190.0
    t = light_time_seconds([0, 0, 0], [r, 0, 0], [-v, 0, 0])
    assert math.isclose(t, r / (C_M_S + v), rel_tol=1e-12)


def test_reject_superluminal_receiver():
    with pytest.raises(ValueError):
        light_time_seconds([0, 0, 0], [1e10, 0, 0], [C_M_S, 0, 0])
