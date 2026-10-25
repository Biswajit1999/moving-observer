"""Special-relativistic causal classification and an explicitly hypothetical FTL model.

Signature: (-,+,+,+). Coordinates: t in seconds; x,y,z in metres.
An antitelephone here is a conditional thought experiment, not a physical device.
"""

from __future__ import annotations

from dataclasses import dataclass
import math
import sys

C_M_S = 299_792_458.0


@dataclass(frozen=True)
class Event:
    t_s: float
    x_m: float
    y_m: float = 0.0
    z_m: float = 0.0


@dataclass(frozen=True)
class AntitelephoneResult:
    outbound_arrival_s: float
    return_arrival_s: float
    closed_causal_loop: bool


def lorentz_gamma(velocity_m_s: float) -> float:
    """Gamma for a subluminal inertial frame velocity along +x."""
    if not math.isfinite(velocity_m_s) or abs(velocity_m_s) >= C_M_S:
        raise ValueError("A physical inertial boost requires |v| < c")
    beta = velocity_m_s / C_M_S
    return 1.0 / math.sqrt((1.0 - beta) * (1.0 + beta))


def lorentz_boost_x(event: Event, velocity_m_s: float) -> Event:
    """Transform from unprimed to frame moving at velocity v along +x."""
    gamma = lorentz_gamma(velocity_m_s)
    t = gamma * (event.t_s - velocity_m_s * event.x_m / C_M_S**2)
    x = gamma * (event.x_m - velocity_m_s * event.t_s)
    return Event(t, x, event.y_m, event.z_m)


def interval_squared_m2(a: Event, b: Event) -> float:
    """Invariant ds^2, in m^2, with (-,+,+,+) signature."""
    dx = b.x_m - a.x_m
    dy = b.y_m - a.y_m
    dz = b.z_m - a.z_m
    ct = C_M_S * (b.t_s - a.t_s)
    return math.fsum((dx * dx, dy * dy, dz * dz, -ct * ct))


def causal_class(a: Event, b: Event) -> str:
    """Classify an interval with a roundoff-scaled null tolerance."""
    dx = b.x_m - a.x_m
    dy = b.y_m - a.y_m
    dz = b.z_m - a.z_m
    spatial2 = math.fsum((dx * dx, dy * dy, dz * dz))
    temporal2 = (C_M_S * (b.t_s - a.t_s)) ** 2
    ds2 = spatial2 - temporal2
    tolerance = 64.0 * sys.float_info.epsilon * max(spatial2, temporal2, 1.0)
    if abs(ds2) <= tolerance:
        return "null"
    return "timelike" if ds2 < 0 else "spacelike"


def hypothetical_signal_arrival(distance_m: float, speed_m_s: float) -> Event:
    """Arrival event for an imposed constant-speed signal, not a physical law."""
    if distance_m <= 0 or speed_m_s <= 0:
        raise ValueError("Distance and signal speed must be positive")
    if not all(math.isfinite(q) for q in (distance_m, speed_m_s)):
        raise ValueError("Parameters must be finite")
    return Event(distance_m / speed_m_s, distance_m)


def tachyonic_antitelephone(
    initial_separation_m: float, signal_speed_m_s: float, relative_velocity_m_s: float
) -> AntitelephoneResult:
    """Conditional two-way FTL thought experiment.

    Earth is at x=0, Bob is initially at x=L moving at +v.
    Earth sends at speed +u in Earth frame. Bob replies immediately at
    speed -u in Bob's own inertial frame. No acceleration/engineering model.
    A negative return time demonstrates a causal loop under these assumptions.
    """
    L, u, v = initial_separation_m, signal_speed_m_s, relative_velocity_m_s
    if not all(math.isfinite(q) for q in (L, u, v)):
        raise ValueError("Parameters must be finite")
    if L <= 0 or u <= C_M_S or v < 0 or v >= C_M_S:
        raise ValueError("Require L>0, u>c and 0<=v<c")
    gamma = lorentz_gamma(v)
    t1 = L / (u - v)
    x1 = u * t1
    # Bob-frame origin is at Bob's initial position (Earth t=0, x=L).
    t1_prime = gamma * (t1 - v * (x1 - L) / C_M_S**2)
    # In Bob's frame Earth follows x'_Earth=-L/gamma-v*t'.
    t2_prime = (L / gamma + u * t1_prime) / (u - v)
    t2 = t2_prime / gamma - v * L / C_M_S**2
    return AntitelephoneResult(t1, t2, t2 < 0)
