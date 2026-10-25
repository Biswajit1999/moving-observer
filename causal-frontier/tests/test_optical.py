import math
import pytest

from causal_frontier.optical import (
    photon_energy_joule, airy_first_null_rad, ideal_far_field_coupling,
    ideal_detected_photons_per_second,
)


def test_photon_energy_and_airy_angle():
    assert math.isclose(photon_energy_joule(1e-6), 1.986445857e-19, rel_tol=1e-8)
    assert math.isclose(airy_first_null_rad(1e-6, 10), 1.22e-7, rel_tol=1e-12)


def test_far_field_scaling():
    p = ideal_far_field_coupling(1e-6, 10, 30, 4e16)
    assert math.isclose(ideal_far_field_coupling(1e-6, 10, 30, 8e16),
                        p / 4, rel_tol=1e-12)
    assert math.isclose(ideal_far_field_coupling(1e-6, 20, 30, 4e16),
                        4 * p, rel_tol=1e-12)


def test_detected_photon_efficiency():
    full = ideal_detected_photons_per_second(1000, 1e-6, 10, 30, 4e16)
    part = ideal_detected_photons_per_second(
        1000, 1e-6, 10, 30, 4e16, detector_and_optics_efficiency=0.2
    )
    assert math.isclose(part, full * 0.2, rel_tol=1e-12)
    with pytest.raises(ValueError):
        ideal_detected_photons_per_second(
            1000, 1e-6, 10, 30, 4e16, detector_and_optics_efficiency=1.1
        )
