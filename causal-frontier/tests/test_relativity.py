import math
import pytest

from causal_frontier.relativity import (
    C_M_S, Event, causal_class, interval_squared_m2, lorentz_boost_x,
    lorentz_gamma, hypothetical_signal_arrival, tachyonic_antitelephone,
)


def test_interval_classes():
    origin = Event(0.0, 0.0)
    assert causal_class(origin, Event(1.0, 0.0)) == "timelike"
    assert causal_class(origin, Event(0.0, 100.0)) == "spacelike"
    assert causal_class(origin, Event(1.0, C_M_S)) == "null"


def test_interval_invariance_under_boost():
    a = Event(0.0, 1.0e6, 2.0e6, -3.0e6)
    b = Event(0.03, 5.0e6, -1.0e6, 4.0e6)
    v = 0.67 * C_M_S
    before = interval_squared_m2(a, b)
    after = interval_squared_m2(lorentz_boost_x(a, v), lorentz_boost_x(b, v))
    assert math.isclose(before, after, rel_tol=1e-12, abs_tol=1e-2)


def test_spacelike_order_can_reverse_but_timelike_cannot():
    origin = Event(0.0, 0.0)
    fast = hypothetical_signal_arrival(1e9, 4 * C_M_S)
    boosted = lorentz_boost_x(fast, 0.5 * C_M_S)
    assert boosted.t_s < 0
    assert causal_class(origin, fast) == "spacelike"
    for v in (-0.9 * C_M_S, 0.9 * C_M_S):
        assert lorentz_boost_x(Event(2.0, 0.0), v).t_s > 0


def test_conditional_antitelephone():
    result = tachyonic_antitelephone(1e9, 4 * C_M_S, 0.5 * C_M_S)
    assert result.outbound_arrival_s > 0
    assert result.return_arrival_s < 0
    assert result.closed_causal_loop
    slow = tachyonic_antitelephone(1e9, 4 * C_M_S, 0.2 * C_M_S)
    assert not slow.closed_causal_loop


def test_reject_invalid_boost():
    with pytest.raises(ValueError):
        lorentz_gamma(C_M_S)
