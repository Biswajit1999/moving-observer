"""Flat-spacetime constant-velocity moving-endpoint null propagation.

First-stage analytic baseline only: no Gaia/JPL dynamics or curved spacetime.
Positions are simultaneous in a specified inertial coordinate frame at emission.
"""

from __future__ import annotations

import numpy as np
from .relativity import C_M_S

JULIAN_YEAR_S = 365.25 * 86_400.0
LIGHT_YEAR_M = C_M_S * JULIAN_YEAR_S


def _vector3(vector: np.ndarray) -> np.ndarray:
    v = np.asarray(vector, dtype=float)
    if v.shape != (3,) or not np.all(np.isfinite(v)):
        raise ValueError("Expected finite 3D SI vector")
    return v


def light_time_seconds(
    emitter_position_m: np.ndarray,
    receiver_position_m: np.ndarray,
    receiver_velocity_m_s: np.ndarray,
) -> float:
    """Positive solution of |r_receiver + v*t - r_emitter| = c*t.

    Emitter is fixed at its emission event; receiver moves at constant velocity.
    """
    emitter = _vector3(emitter_position_m)
    receiver = _vector3(receiver_position_m)
    v = _vector3(receiver_velocity_m_s)
    v2 = float(v @ v)
    if v2 >= C_M_S**2:
        raise ValueError("Receiver speed must be subluminal")
    r = receiver - emitter
    r2 = float(r @ r)
    if r2 == 0:
        return 0.0
    rv = float(r @ v)
    a = C_M_S**2 - v2
    return float((rv + np.sqrt(rv**2 + a * r2)) / a)


def roundtrip_light_time_seconds(
    earth_position_m: np.ndarray,
    earth_velocity_m_s: np.ndarray,
    target_position_m: np.ndarray,
    target_velocity_m_s: np.ndarray,
) -> float:
    """Earth->target->Earth, instantaneous target reply in inertial coordinates."""
    e0 = _vector3(earth_position_m)
    ve = _vector3(earth_velocity_m_s)
    p0 = _vector3(target_position_m)
    vp = _vector3(target_velocity_m_s)
    if float(ve @ ve) >= C_M_S**2 or float(vp @ vp) >= C_M_S**2:
        raise ValueError("Both endpoint velocities must be subluminal")
    t_out = light_time_seconds(e0, p0, vp)
    e_at_reply = e0 + ve * t_out
    p_at_reply = p0 + vp * t_out
    t_back = light_time_seconds(p_at_reply, e_at_reply, ve)
    return t_out + t_back
