"""First-order, idealized far-field optical link benchmarks.

Assumes ideal circular apertures, diffraction-limited pointing, unobscured
on-axis receiver, far-field propagation and a receiver small relative to the
Airy pattern. NOT a complete interstellar optical link budget.
"""

from __future__ import annotations

import math

PLANCK_J_S = 6.62607015e-34  # exact SI definition
C_M_S = 299_792_458.0


def _positive_finite(*values: float) -> None:
    if not all(math.isfinite(x) and x > 0 for x in values):
        raise ValueError("Inputs must be positive finite SI quantities")


def photon_energy_joule(wavelength_m: float) -> float:
    _positive_finite(wavelength_m)
    return PLANCK_J_S * C_M_S / wavelength_m


def airy_first_null_rad(wavelength_m: float, transmitter_diameter_m: float) -> float:
    _positive_finite(wavelength_m, transmitter_diameter_m)
    return 1.22 * wavelength_m / transmitter_diameter_m


def ideal_far_field_coupling(
    wavelength_m: float, transmitter_diameter_m: float,
    receiver_diameter_m: float, distance_m: float
) -> float:
    """Ideal small-receiver Airy on-axis coupling; not a uniform beam-disc model.

    Requires Fraunhofer far-field and receiver much smaller than beam footprint.
    Return is a power fraction, not a complete detector efficiency.
    """
    _positive_finite(wavelength_m, transmitter_diameter_m,
                     receiver_diameter_m, distance_m)
    fraction = (math.pi * transmitter_diameter_m * receiver_diameter_m /
                (4.0 * wavelength_m * distance_m)) ** 2
    if fraction > 1.0:
        raise ValueError("Approximation outside validity domain (coupling > 1)")
    return fraction


def ideal_detected_photons_per_second(
    transmit_power_w: float, wavelength_m: float,
    transmitter_diameter_m: float, receiver_diameter_m: float,
    distance_m: float, *, detector_and_optics_efficiency: float = 1.0
) -> float:
    _positive_finite(transmit_power_w)
    if not (math.isfinite(detector_and_optics_efficiency) and
            0 <= detector_and_optics_efficiency <= 1):
        raise ValueError("Efficiency must be between 0 and 1")
    coupling = ideal_far_field_coupling(
        wavelength_m, transmitter_diameter_m, receiver_diameter_m, distance_m
    )
    return (transmit_power_w * coupling * detector_and_optics_efficiency /
            photon_energy_joule(wavelength_m))
