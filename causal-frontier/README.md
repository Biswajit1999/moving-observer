# Causal Frontier — foundational research staging

**A Reproducible Search for Information Transfer Beyond the Light Cone**

This folder is a **review-only staging subtree** on the branch research/causal-frontier-foundations of the existing Moving Observer repository. It is intended to become a standalone open-source project after scientific and software review; it does not modify the Moving Observer main branch.

Research direction from Biswajit Jana's *Beyond the Light Cone* report. Initial implementation and text are AI-assisted drafts requiring human scientific review.

**Three research branches:** Causal Frontier (relativity and no-signalling), Causal Corridor (speculative metric/source research), Photon Frontier (physical optical interstellar links).

**M1 implemented scope:** Minkowski interval classification, Lorentz boosts, a conditional tachyonic-antitelephone thought experiment, empirical mutual information with permutation null test, Bell pair reduced-state/marginal calculations, constant-velocity moving-endpoint light-time and a basic ideal optical link estimate. The speculative GR, coding, data-frozen Proxima and web visualization modules are **not implemented** in this stage.

**Status:** Not an FTL demonstration. This staged code has not yet been executed or independently validated by the assistant environment. Do not cite numerical outputs until the tests run.

## Installation and checks

From this folder with Python 3.11+:

    python -m pip install -e '.[test]'
    python -m pytest -q
    python examples/baselines.py

Pinned direct dependencies are specified in pyproject.toml; a transitive dependency lock file and frozen science data will be required before calling the complete project reproducible offline.

## Scientific reading order

1. docs/SCIENTIFIC_SPECIFICATION.md — A–P requirements and gates.
2. docs/CRITICAL_AUDIT.md — blocking scientific corrections.
3. docs/LITERATURE_LEDGER.md — initial primary-source identifiers.
4. tests/ — executable mathematical and stochastic controls.

No software component may report "FTL achieved" based on a numerical arrival advantage, phase/group velocity, entanglement correlations, or a positive finite-sample mutual-information estimate.
