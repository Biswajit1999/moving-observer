# Causal Frontier — Scientific Specification v0.1

**Status:** PRE-IMPLEMENTATION / UNVERIFIED HYPOTHESES  
**Research lead:** Biswajit Jana (proposed; from author-supplied brief)  
**Working title:** *Causal Frontier: A Reproducible Search for Information Transfer Beyond the Light Cone*  
**Research module:** Moving Observer: Causal Corridor (MOCC)  
**Date:** 2026-10-25

## Scope and source hierarchy

This specification was derived from the author-provided *Beyond the Light Cone: A Research Programme for Interstellar Communication*, its embedded project prompt, and the existing Moving Observer repository. It is a scientific design document, **not** a completed validation, a novelty determination, or evidence for faster-than-light signalling. The source report's chat-session citation tokens are not stable bibliographic references; verify primary papers and exact equation numbers before implementing published metrics. Confirmed primary source URLs are listed in LITERATURE_LEDGER.md.

**Three branches:** (1) Causal Frontier: relativity, quantum no-signalling, causal inference and statistics; (2) Causal Corridor: GR inverse metric/source analysis and global causality; (3) Photon Frontier: realistic interstellar optical links and predictive-twin compression.

**Vocabulary:**
- ESTABLISHED PHYSICS — validated physical laws or mathematical consequences under stated assumptions.
- SPECULATIVE THEORETICAL MODEL — a model that has not been demonstrated as a physical device.
- ORIGINAL EXPLORATORY MODEL — a proposed research ansatz, not a discovery or proven novelty.

## A. Research hypothesis

Can a receiver obtain reproducible, causally attributable information about a message X randomly chosen at event A, at an event B spacelike-separated from A with respect to the **actual physical metric**, after excluding all ordinary causal paths and pre-shared correlations?

The baseline comparison additionally measures whether reception precedes the earliest null arrival in a specified unmodified background metric. These are **distinct** claims: background shortcut and physical-metric spacelike signalling.

## B. Null and alternative hypotheses

H0: For any randomized local transmitter intervention X=x versus X=x', and for receiver data Y restricted to an admissible pre-causal window, P(Y | do(X=x)) = P(Y | do(X=x')).

H1: At least one randomized intervention changes that distribution, with a pre-registered effect, adequate statistical power, independent clock/geometry validation, and no ordinary causal side channel.

The estimated mutual information I_hat(X;Y) is a statistic, **not** itself a proof of H1 or a proof of a physically superluminal channel.

## C. Operational definition of information transfer

1. Randomize a fresh message X after freezing receiver predictions, pre-shared state and analysis protocol.
2. Define transmitter event A, receiver observations and the relevant time coordinate/clock synchronization procedure.
3. Compute t_background as the earliest permitted null arrival for the unmodified reference spacetime and moving endpoints.
4. Compute the candidate spacetime's causal relation between A and each reception event. In a curved spacetime, coordinate differences alone are not invariant causal tests.
5. Strictly partition receiver records into Y_< = Y(t < t_background) and Y_>= = Y(t >= t_background); never leak future observations, labels or post-selected outcomes into the former.
6. Estimate mutual information, uncertainty and intervention effect. Pre-register family-wise error control and side-channel controls.
7. Label results precisely: "no evidence", "background early arrival in theoretical geometry", "causal side-channel suspected", or "unexplained pre-background dependence requiring replication". Never output "FTL achieved" on numerical arrival time or MI alone.

## D. Invariants and observables

- Minkowski interval ds² = -c²dt² + dx² + dy² + dz² (only globally applicable in flat inertial coordinates).
- Lorentz-invariant causal classification of event pairs in Minkowski spacetime.
- Proper time along observer worldlines; locally measured frequencies/energies.
- Curved-spacetime causal reachability using future-directed timelike/null curves.
- Scalar curvature invariants (Ricci scalar and Kretschmann K), tensor contractions in specified orthonormal tetrads.
- Observer-dependent local energy density with explicit normalization conventions.
- Receiver photon counts, BER, message-decoding likelihood and pre-window mutual information.

Use SI throughout except explicitly marked geometrized-unit internal calculations.

## E. Candidate mechanisms

**Established controls:** electromagnetic propagation, quantum entanglement/teleportation no-signalling, fast-light pulse reshaping, neutrino/gravitational-wave comparisons, realistic optical links.

**Speculative models:** tachyonic communication under a declared propagation law; traversable wormholes; Alcubierre and published warp classes; Hyperwave; Lorentz-violating channels (only with explicit equations).

**Original exploratory model:** moving-endpoint Causal Corridor using a 3+1 lapse/shift/spatial metric ansatz. It is an inverse-design hypothesis, not a demonstrated source or a novelty claim.

## F. Mechanism-specific falsification

- Quantum: Bob's unconditioned local distribution must not depend on Alice's randomized choice; test Born-rule marginals analytically and numerically.
- Fast-light: receiver must decode fresh unpredictable modulation before the earliest causal front, not merely an early peak.
- Tachyon: test ordering reversal and return-message causal loops under the explicitly assumed signal law.
- Warp/Hyperwave/wormhole: reproduce source equations, calculate full T_mu_nu, evaluate energy conditions for all relevant observers, geodesics, global causality, stability/creation history, source feasibility and operational channel encoding.
- Optical: compare received photons and coded BER against analytical channel benchmarks; no claims of reducing vacuum propagation time.
- Predictive twin: compare conditional entropy, transmitted bits, accuracy and resynchronization cost; never classify local prediction as early reception of new remote information.

## G. Baseline models

1. Minkowski light cones and Lorentz transformations.
2. Bell pair |Phi+> = (|00>+|11>)/sqrt(2), Bob reduced state I/2.
3. Constant-velocity moving-endpoint null propagation as a validated approximation; upgrade to frozen Gaia/JPL dynamical inputs.
4. Minkowski, Schwarzschild exterior and a third analytic GR metric for tensor validation.
5. Photon-counting direct-detection optical link with PPM and noise.
6. Published Alcubierre metric and Hyperwave reproduction **only after source equations are verified**.

## H. Datasets and provenance

- Frozen astrometry for Proxima/Alpha Cen with reference epoch, frame, proper motions, radial velocity, parallax, covariance and Gaia release identifiers.
- Solar System barycentric ephemerides and leap-second/time-standard conventions when relevant.
- CODATA/SI constants and units, including exact c.
- Optical detector response, filter, noise, transmitter and aperture parameters with manufacturer or literature provenance.
- Primary paper version/DOI/equation numbers for each GR benchmark.
- Every dataset gets checksum, license, download/access date, coordinate frame, valid time range and known omissions.

Do not silently import old Moving Observer numerical outputs as validated input for a new 50,000-year integration.

## I. Mathematical derivations required

**Special relativity:** gamma = 1/sqrt(1-v²/c²), x' = gamma(x-vt), t' = gamma(t-vx/c²); for a hypothetical speed u>c and L>0, delta t' = gamma L(1/u - v/c²). Ordering reverses for v>c²/u. A two-way antitelephone additionally requires a specified return channel.

**Information theory:** I(X;Y)=sum p(x,y)log2[p(x,y)/(p(x)p(y))). Implement entropy, BER, permutation tests, uncertainty and false-discovery control; finite-sample I_hat is positively biased.

**GR:** from g_mu_nu calculate inverse, Christoffels, Riemann, Ricci, scalar, Einstein tensor and T_required = c^4/(8pi G)(G+Lambda g). Check covariant conservation, constraint equations, regularity and asymptotics. Use physically normalized observer four-velocity u.u=-c², in which energy density epsilon = T_mu_nu u^mu u^nu/c². Null energy condition: T_mu_nu k^mu k^nu>=0 for all null k.

**Corridor ansatz:** x_c(s,t)=(1-s)x_E(t)+s x_T(t), r_perp distance from corridor, F(r)=0.5[1-tanh((r-R)/Delta)], and ds²=-alpha²c²dt²+gamma_ij(dx^i+beta^i dt)(dx^j+beta^j dt). Specify shift units (velocity), lapse normalization, endpoint simultaneity convention, support, boundary conditions and differentiability.

**Geodesics:** d²x^mu/dlambda² + Gamma^mu_ab dx^a/dlambda dx^b/dlambda=0, check g_mu_nu k^mu k^nu=0 and convergence.

**Optical:** E_photon=hc/lambda, theta_Airy=1.22lambda/D_t, detected rate=eta P_received/E_photon; full Airy integration and background Poisson process needed beyond first-order benchmarks.

**Inverse sources:** optimize a covariant, tetrad-based norm of T_candidate-T_required subject to the actual field equations, conservation and source constraints; a coordinate-component Euclidean tensor norm is not invariant.

## J. Simulation architecture

Python >=3.11 scientific core; pinned NumPy and pytest for the first milestone. Later: SciPy, JAX/SymPy, Astropy, xarray, optional GPU, and a TypeScript/Three.js front end. Physics calculations are versioned, independently testable library functions. Web visualizations consume structured results and may not substitute illustrative geometry for numerical data.

Computational stages: analytic controls -> stochastic calibration -> moving-target baseline -> optical link -> GR tensor engine -> published metric replication -> original corridor -> constrained source search -> global causal audit.

## K. Uncertainty model

Track separately numerical truncation/roundoff, stochastic estimator error, observational covariance, parameter uncertainty, model discrepancy, omitted physics and source-paper ambiguity. Use deterministic seeds for reproducibility but independent seeds for replication. Convergence studies and null distributions must precede positive claims. Report confidence intervals and effective sample sizes.

## L. Validation matrix

- Lorentz interval invariance and exact vacuum speed c.
- Spacelike ordering reversal under appropriate boost; timelike order cannot reverse.
- Antitelephone with declared two-frame symmetric FTL law.
- Bell local marginals I/2 and no-signalling for Z/X settings.
- Independent random messages produce calibrated null MI; perfectly copied messages produce ~1 bit for balanced binary inputs.
- Strict exclusion of t>=t_background from pre-window analyses.
- Minkowski Riemann=0; Schwarzschild G=0 outside source; independent third metric; Bianchi identity and index symmetry.
- Null geodesic constraint and solver convergence.
- NEC/WEC counterexamples, observer sampling plus stronger optimization/certification where possible.
- Photon energy, inverse-square far-field scaling, aperture scaling and PPM encode/decode.
- Constant-velocity moving receiver light time against analytic radial formula.
- All random results repeat under frozen seeds and dependencies.

**Stage gate:** every implemented benchmark has source equation, assumptions, units, expected result, measured residual, tolerance justification and explicit limitation.

## M. Repository structure

Staging subtree: causal-frontier/ in the Moving Observer repository on an isolated research branch. This is **not** the final separate repository. Intended future standalone layout:

- src/causal_frontier/{relativity,information,quantum,optical,moving_endpoints,...}
- src/causal_frontier/gr/{metrics,tensors,energy_conditions,geodesics,...}
- tests/, examples/, experiments/, data/frozen/, figures/
- web/ (14 research views)
- docs/{SCIENTIFIC_SPECIFICATION,CRITICAL_AUDIT,LITERATURE_LEDGER,...}
- papers/, CITATION.cff, README.md, pyproject.toml, reproducibility lock files

## N. Interactive visualization

Views: Light Cone, Lorentz Boost, Tachyon/Causality, Quantum No-Signalling, Earth–Proxima, Optical Link, Warp Metric, Stress-Energy, Energy Conditions, Null Geodesics, Causal Corridor, Causal Loop Test, Parameter Explorer, Research Report.

Each must show the active metric, frame, clock/epoch, physical versus illustrative scale, numerical diagnostics, and model-status label. Controls may alter model parameters but cannot relabel speculative geometry as physically achievable. Plot numerical errors and uncertainty where material.

## O. Literature and novelty questions

- Has an equivalent operational FTL/intervention test already been published?
- Which versions and equations define Hyperwave, Alcubierre, Bobrick–Martire and Lentz metrics?
- What quantum inequality assumptions actually apply to microscopic wall geometries?
- Can complete matter-field tensors reproduce a required metric while satisfying their own field equations?
- Which published GR shortcut models allow global causality and controlled construction?
- How do state-of-art optical PPM receivers and coding compare on incident/detected photons per bit?
- Is a moving-endpoint corridor meaningfully distinct from known warp tube/Krasnikov-tube constructions?

No novelty claim until primary-source and citation-network review.

## P. Milestones and exit criteria

**M0 — specification and critical audit:** completed design, missing-source register, preregistered tests.  
**M1 — foundational causal lab:** Lorentz, intervals, tachyonic antitelephone, quantum no-signalling, MI/permutation and tests.  
**M2 — moving Proxima and photon baseline:** frozen data, light-time, link budget, PPM and coded BER.  
**M3 — independent GR engine:** analytic metric tests and error/convergence reporting.  
**M4 — Hyperwave and Alcubierre replication:** source-equation provenance and discrepancy audit.  
**M5 — exploratory MOCC:** constrained metric search, energy conditions, causality and source compatibility.  
**M6 — visualization, manuscript and reproducibility:** documented offline builds, data/figure provenance, peer-review-ready negative and positive results.

### Acceptance policy

A theoretical early arrival is labelled "background-time advantage under hypothetical geometry", never "FTL achieved". Experimental extraordinary claims require preregistered random interventions, causal isolation, independent time standards, statistical correction, replication, and demonstration that the events are spacelike in the actual physical metric. A negative result is a valid result.
