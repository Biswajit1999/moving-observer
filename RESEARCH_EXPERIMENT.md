## 11. Catalogue experiment: does motion help at an instrument boundary?

<div id="catalogueExperiment" class="research-lab"></div>

### Question and contribution

**For a fixed nearby-source sample, how does century-scale relative motion change single-visit direct-imaging accessibility, and does that change survive a different instrument threshold?** We test this question with a frozen Gaia DR3 sample and paired calculations, instead of converting the Sun's Galactic travel into a discovery count. The deliverable is a reproducible, source-by-source sensitivity experiment, including cases that become less accessible. This is an exploratory contribution, not an established priority claim or a new exoplanet detection.

### Data and scope

The ESA Gaia Archive query on 24 October 2026 returned **1,387 sources** with parallax at least 50 mas, parallax signal-to-noise greater than 20, a measured radial velocity, RUWE below 1.4 and at least ten visibility periods. The frozen CSV, exact ADQL, retrieval script and checksum are distributed with the code. Identifiers retain their full integer precision. See [Gaia DR3](https://doi.org/10.5270/esa-qa4lep3) and the [data provenance](https://github.com/Biswajit1999/moving-observer/blob/main/data/GAIA_PROVENANCE.md).

The sample is selected, not volume-complete: RV availability and quality cuts exclude many stars and can favour particular stellar types. RUWE filtering does not eliminate all binaries. A Gaia source is not necessarily an independent planetary system. Sources outside the original cut do not enter this fixed-sample experiment. We do not treat the artwork's rendered particles as catalogue data.

We propagate barycentric Cartesian positions at constant relative velocity from J2016.0 to 2026.0 and 2126.0. Radial motion, transverse motion and perspective geometry are retained. This is an instantaneous geometric calculation, not a light-cone or relativistic astrometry solution. Annual Earth parallax, Galactic differential acceleration, binary orbits and stellar variability are omitted. Century-scale application is deliberate; it must not be extrapolated to 250 Myr.

### A deliberately controlled planet and instrument model

Each source is assigned the same **hypothetical** circular 1 AU orbit, Earth radius and geometric albedo 0.3. Orbital orientations and phases are isotropic/random. This standardised injection isolates geometry; it is neither a list of actual planets nor a habitable-zone prescription for different stellar types. It assumes no occurrence rate. For phase angle $\alpha$, Lambert reflection and angular separation are:

$$
\Phi(\alpha)=\frac{\sin\alpha+(\pi-\alpha)\cos\alpha}{\pi},\qquad
c(\alpha)=A_g\left(\frac{R_p}{a}\right)^2\Phi(\alpha),\qquad
\theta(\alpha)=\frac{1000a_{\rm AU}}{d_{\rm pc}}\sin\alpha\ \mathrm{mas}.
$$

The baseline thresholds are 60 mas inner working angle, a contrast floor of $10^{-10}$, and limiting planet G magnitude 30. The improved scenario uses 40 mas, 5 × $10^{-11}$ and G = 31. These are chosen sensitivity settings, **not specifications or forecasts for an approved telescope**. We assume grey reflection in Gaia's G band. For constant stellar luminosity, stellar magnitude changes by $5\log_{10}(d_{\rm future}/d_{\rm initial})$, and planet magnitude is stellar magnitude minus $2.5\log_{10}c$.

With isotropically distributed planet positions, $\cos\alpha$ is uniform. We solve the simultaneous angular-separation, contrast and magnitude inequalities to obtain the allowed phase interval $[\alpha_{\min},\alpha_{\max}]$. The resulting single-visit accessibility is:

$$
C_i=\frac{\cos\alpha_{\min}-\cos\alpha_{\max}}{2}
\quad\text{if the interval is nonempty; otherwise } C_i=0.
$$

This marginalisation removes dependence on the absolute sky direction for an isotropic population. It therefore measures distance/brightness and separation-threshold effects, not entry into transit bands for known orbital planes. The two epochs use the same population distribution; we do not claim to follow the orbital phase of an individually known planet.

### Paired experiment and uncertainty

Let $S$ be the sum of $C$ over the fixed sample. The first index below denotes present/future geometry; the second denotes baseline/improved thresholds:

$$
\Delta_{\rm motion}=S_{10}-S_{00},\qquad
\Delta_{\rm instrument}=S_{01}-S_{00},\qquad
I=S_{11}-S_{10}-S_{01}+S_{00}.
$$

All four evaluations share the same star and astrometric draw. We use 1,024 draws per source, with a fixed random seed, the full five-parameter Gaia covariance and an independently sampled RV error. The positional RA uncertainty is treated as a tangent-plane quantity, with its cos(dec) factor handled explicitly. The published intervals are the 2.5th and 97.5th percentiles of summed paired differences. They reflect formal input errors under Gaussian assumptions, **not total scientific uncertainty**. Cross-source correlations, parallax systematics, unresolved binaries, planet-population uncertainty and instrument-model uncertainty are absent. Reproduction is exact for the saved seed; 1,024 draws do not warrant precision in the interval tails.

### Results

| Quantity | Nominal score | 95% formal-astrometry interval for differences |
|---|---:|---|
| 2026, baseline thresholds S00 | +29.63207 | — |
| 2126, baseline thresholds S10 | +29.64118 | — |
| 2026, improved thresholds S01 | +102.72300 | — |
| 2126, improved thresholds S11 | +102.72476 | — |
| Motion alone | +0.00911 | +0.00868 to +0.01152 |
| Instrument change alone | +73.09093 | +73.06238 to +73.14632 |
| Interaction | -0.00735 | -0.00976 to -0.00692 |

The baseline motion change is approximately **0.031%** of the initial accessibility sum. Forty-two sources gain and 45 lose accessibility (absolute changes greater than $10^{-12}$); the remainder are unchanged under these thresholds. This is not a claim that 42 planets become detectable or that 45 planets disappear. The largest nominal absolute change belongs to Gaia DR3 **762815470562110464**, with +0.00350 in accessibility and a model distance change from 2.54526 to 2.53656 pc. It is a screening result, not a validated observing recommendation or confirmation of a planet around that source.

The result is threshold-sensitive: keeping contrast and magnitude cuts fixed, a 70 mas IWA produces a net motion contribution of **−0.00145**, whereas 60 mas produces +0.00911. This counterexample rejects the simple assertion that waiting always improves aggregate accessibility. The negative interaction means the improved thresholds reduce the marginal benefit of motion in this chosen example; it is not evidence that improved instruments perform worse overall.

### What this result can and cannot establish

This experiment supplies a real catalogue, explicit selection, consistent short-time propagation, correlated astrometric uncertainty, a specified geometric detection proxy, paired controls, a sensitivity sweep and source-level outputs. An independent numerical integration over phase checks the analytic accessibility formula. Astropy 8.0.2 independently reconstructs the catalogue positions and velocities; propagated distances agree within 7.11 × 10^-15 pc at both epochs. This checks coordinates and units, not the omitted physics. The optional `compare-astropy.py` benchmark requires Astropy and writes `data/astropy-comparison.json`. The existing physics tests and a non-default integration-cadence regression test run alongside these checks.

It does **not** supply a mission yield. Exposure times, throughput, backgrounds, exozodiacal light, scheduling, observatory sky access, repeated visits, planet occurrence, known-planet exclusion and confirmations are not modelled. Applying an arbitrary occurrence factor to S would not solve those omissions. A future mission calculation should use a validated tool such as [EXOSIMS](https://arxiv.org/abs/1511.02869), and compare with the instrument-dependent methods of [Stark et al.](https://arxiv.org/abs/1904.11988).

### Research status and the question for the community

The literature search found established studies of [proper-motion effects on transits](https://arxiv.org/abs/0807.0008), [changing Earth-transit viewpoints](https://arxiv.org/abs/2107.07936), [Gaia stellar encounters](https://arxiv.org/abs/2207.06258), and direct-imaging completeness/yields. The sources examined did not establish an identical 2026–2126, Gaia-covariance, four-scenario threshold comparison. This limited search does not prove that none exists. The methods themselves are established; the specific reproducible comparison and source ranking are this project's current contribution. See `LITERATURE_SEARCH.md` for the dated search scope.

**Open question:** after modelling binaries, realistic planets, observability and a fixed observing-time budget, does any nearby system retain a scientifically useful century-scale accessibility gain attributable to relative motion, rather than to changed instrument capability—and which prior study already answers this most directly?

### Tutorial: reproduce and explore this experiment

1. Read the four scenario scores above. They use the same frozen source sample and injected planet distribution.
2. Change the IWA selector. Compare 60 and 70 mas to see the sign reversal; this control leaves the contrast and magnitude limits fixed.
3. Expand the source table to inspect the strongest absolute changes and formal uncertainty intervals. Download the CSV for all 1,387 sources.
4. In the repository run `npm ci`, `npm run research`, `npm run build`, then `npm test`. The calculation uses the local snapshot and does not need a network connection.
5. Only to refresh input data, run `python fetch-gaia.py`. Review the changed snapshot and regenerate results before drawing conclusions. Refreshing data is not part of the ordinary build.
6. Test an alternative instrument or injected planet in `research.cjs`; regenerate results and update the report's interpretation. The report table is generated from the results during the build, so the displayed numbers remain consistent.

## 12. A warped disk, vertical Solar motion, and planetary paths

The Galactic disk is not perfectly flat. [Poggio et al. (2020)](https://www.nature.com/articles/s41550-020-1017-3) inferred a precessing warp with a model-dependent rate near 10.86 km/s/kpc. [Poggio et al. (2025)](https://doi.org/10.1051/0004-6361/202451668) report an outer-disk corrugation in stellar positions and velocities, in addition to the warp. These are evidence for vertical Galactic structure; they do not prescribe a universal corkscrew trajectory for the Sun or every planetary system.

The updated display uses an optional **kinematic warp illustration**, with a 700 pc height scale at radius 14 kpc and an adopted onset at 8.4 kpc. The onset, radial quadratic profile and initial phase are display assumptions. The surface precesses independently of the spiral artwork. It does not add a new gravitational force to the integrated Solar orbit. The 2025 travelling corrugation is discussed but not fitted or animated as though it were a measured future evolution.

$$
z_w(R,\phi,t)=0.7\left[\max\left(0,\frac{R-8.4}{5.6}\right)\right]^2\sin(\phi-\Omega_w t)\ \mathrm{kpc},
$$

where R is in kpc, t in Myr, and the signed precession rate in this coordinate convention is −10.86 × 0.001022712 $\mathrm{Myr}^{-1}$. A material tracer following this surface would require:

$$
v_z=\partial_t z_w+v_R\partial_R z_w+\frac{v_\phi}{R}\partial_\phi z_w.
$$

The implementation supplies and tests this derivative. It remains a kinematic description, not a self-consistent evolving gravitational model. Artwork points indicate structure, not integrated physical stars. A dynamically coupled warp requires a different potential and validation against data before being used for predictions.

The Sun already undergoes vertical oscillation in the smooth axisymmetric potential. A new height-versus-time plot makes this motion visible at its true parsec scale without artificially stretching the 3D Galaxy. Select **Edge-on**, enable **Evolving outer-disk warp**, and play the million-year clock to distinguish the two motions. Disabling the warp does not change the Solar integration.

In **Sun & all planets**, all eight planets can be viewed in Solar System coordinates or with Galactic translation included. A separate Solar-wobble close-up resolves the small barycentric reflex motion. **Earth & Sun** retains a simpler two-body viewing option. The ecliptic is oblique to the Galactic plane. The paths can look winding in Galactic coordinates, while the Sun also has a smaller, non-circular barycentric wobble caused by the planets, and the planets do not trail behind it in a single plane perpendicular to its velocity. A trajectory's appearance depends on the chosen frame. The separate Space & Time view explains weak-field gravity and clock rates using a labelled potential-grid analogy; it does not solve the Einstein field equations.
