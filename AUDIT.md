## Visible outer-disk warp correction

The supplied screenshot showed a faint warped outer disk dominated by a flat bright centre. The surface shader's global plane-angle fade was nearly zero at the intended edge-on camera angle. The correction retains at least 65% of the surface fade multiplier and adds an optional, explicitly labelled height-coloured structural surface in the outer disk. The same height function deforms the surface, points and guide rings; no dynamics parameters changed.

The default view is 5x vertically magnified, and the camera follows the precessing line of nodes so the bend stays across the image. Manual camera interaction releases follow mode. The reveal button preserves the selected epoch. Tests cover edge-on visibility and the screenshot epoch of 119.9 Myr. Live WebGL rendering remains unverified due the existing browser restriction; source/scene checks do not replace that verification.

## Warp, forward motion and report revision · 25 October 2026

The edge-on camera now looks along the warp line of nodes, exposing the bend across the image. Rings and a maximum-bend cross-section follow the same height function as the artwork, against a flat-plane reference. The reveal preset turns the warp on and labels its 5× vertical display. Projection checks resolve the 700 pc bend at four precession phases.

The planetary view opens with all ten bodies. Separate three-year inner and 84-year all-planet presets use reference lines fixed in the selected translating frame. The camera follows the Sun, so these lines move past it. A scene check measures the expected approximately 0.98 AU/year residual motion in the 98% frame. Long-trail resampling is bounded to reduce per-frame work. Earth-clock presets start playback; the 1PN lab shows all planets and starts playback after calculation.

All 81 numerical and scene-control check groups passed. Fresh live browser rendering remains unverified because access is restricted; no alternate browser automation was used. The six PDF pages were rendered with Poppler and visually inspected, including a second inspection of the revised cover diagram. The opening figure is now a project-drawn conceptual map with named arms, centre, Solar orbit, A/B/C epochs, an internal legend and a warp inset. It is not an observed arm-position map.

## Coupled 1PN Solar System lab · 25 October 2026

The new dynamics branch uses order-reduced all-included-body EIH 1PN equations, frozen geometric barycentric Horizons states and paired Newtonian integration. Twelve validation groups include a Mercury apsidal benchmark, the Schwarzschild test-particle limit, covariance/scaling, 30-day step refinement, three sparse JPL comparison epochs, clocks, signal geometry, and actual worker numerical execution under Node. Measured errors and the distinction from a full-GR solver are in `RELATIVITY_REPORT.md`. No browser rendering or encoding claim is added. The previous illustrated PDF remains unchanged.

## Illustrated discussion report · 24 October 2026

The new six-page PDF was rendered with Poppler and every page visually inspected. Revised figure pages were re-rendered and checked after adding the planetary legend. It contains seven numbered figures and a separate reference/tutorial page. Numerical figure data come from `export-illustrated.cjs` and the existing media export. The PDF preserves the distinction between an illustrative Galactic potential, historical Proxima inputs, schematic transit geometry and the Gaia accessibility experiment. Model plots are not represented as browser screenshots. The original note and two-page brief are retained.

## 100-light-year recording and original-note revision · 24 October 2026

- The 100-light-year journey ends after 128,608.38 model years; the constant-233-km/s estimate is 128,666.29 years. The existing integration includes 7 km/s initial vertical velocity. This is path length, not distance gained relative to neighbouring stars.
- An independent 2,000-step integration gives a path-length difference below 0.000001 ly and an endpoint difference of about 0.00000141 ly relative to the coarser existing orbit. These are numerical consistency checks, not physical uncertainty bounds.
- Five new validation groups cover distance, input bounds, public markup, mock recording completion and hidden-tab cancellation. Actual browser video encoding and fresh live UI inspection remain unverified because browser automation was blocked by security policy.
- The revised brief was rendered and both pages visually inspected. It restores the original sightline/transit question and links the full original note. The original uploaded PDF and repository `discussion-note.pdf` have identical SHA-256 hashes.
- Outreach drafts and the LinkedIn caption are maintained outside this repository. The current branch no longer contains them; this does not purge earlier Git history.

# Version 7.1 verification - 24 October 2026

- All **62 validation groups** passed locally: the earlier 53, eight density/label/relativity groups and one physical circular-clock animation check. Scene construction exercises all geometry modes at clock boundaries; it is not a browser rendering test.
- Labels now use bounded screen-space rectangles, marker exclusion and leader lines. Synthetic Galactic example stars are disabled by default, with only the selected example displayed. The supplied overlap screenshot guided the change; fresh live visual behavior remains unverified.
- The double-exponential density scenario is normalized to a historical 373-star 10 pc census, not inferred from the artwork. Its radial/vertical behavior, symmetry, local normalization and flux units are checked. The existing force model's outward-rising circular speed is explicitly distinguished from current observational findings.
- Exact isolated spherical stationary/circular clock factors recover the weak-field limit. Earth presets give -24.743 and +38.514 microseconds/day relative to a stationary surface clock at 400 and 20,200 km altitude. The 400 km marker completes a quarter revolution in one quarter of its computed 92.414-minute period. Rotation, oblateness, other bodies and signal propagation remain omitted.
- A finite-difference check of the unscaled exterior embedding reproduces the Schwarzschild radial metric. Display magnification never changes clock rates. The older potential mesh remains labelled as an analogy.
- The circular lunar illustration preserves the Earth-Moon barycentre and adopted separation. It is not an ephemeris. The co-moving path option applies a common translating frame; physical distances between bodies remain unchanged.
- The two-page PDF was rendered with Poppler and both pages visually inspected. Author metadata is Biswajit Jana. The generated 24-second MP4 is H.264/yuv420p at 1280x720 and 16 fps (384 decoded frames); a representative image from each of its four chapters was visually inspected. It is a numerical-model rendering, not a website recording.
- Browser access remains blocked by the tool security policy. Live WebGL rendering, interaction, device performance and HTML print pagination are not claimed as verified. PDF and video checks concern those standalone artifacts only.
- Public professional contact details and current NASA routing/leadership roles were researched for `OUTREACH.md`. These are proposed recipients and unsent drafts, not an endorsement or an existing mentorship.

---

# Version 7 verification — 24 October 2026

This release repairs equation rendering and the report cover/layout, adds eight-planet and Solar-reflex views, and adds an explanatory gravitational-potential and clock-rate view.

- All **53 numerical, artifact and scene-construction validation groups** passed locally. The 12 added groups test preserved display-math delimiters, invalid-equation rejection, full-source mathematics, barycentric identities, gravity/clock scaling, epoch guards, Horizons comparisons, generated controls, finite scene geometry and CSV exports.
- The original equation failure was JavaScript replacement-string handling of `$$`. Callback replacement now preserves those delimiters. Visible-text inspection of both built HTML documents found no leaked TeX, duplicate IDs or missing local fragment targets.
- Outer planets use 401 saved Horizons position/velocity states per body and cubic Hermite interpolation. Six independent between-node dates per body give maximum sampled errors of 611.1 km (Jupiter), 59.1 km (Saturn), 42.6 km (Uranus), and 41.7 km (Neptune). A 1,000 km regression threshold applies to these samples; it is not an all-epoch accuracy guarantee. Saved-node checks test ingestion only.
- Six independent Solar barycentric comparisons give a maximum reconstruction difference of 161.8 km. The regression criterion is 0.1% of the Solar radius. Inner-planet approximations and omitted small bodies limit the reconstruction. This is not a full N-body solver.
- At 1 AU from an isolated Sun, the stationary weak-field clock lag relative to infinity is 852.82 microseconds/day. Tests verify inverse-radius clock scaling, inverse-square acceleration and invariance of readouts under visual-depth changes. Actual terrestrial or spacecraft clocks need additional terms and a defined reference system.
- The supplied screenshots were inspected. Fresh live browser inspection was blocked by the browser tool's security policy. Scene-construction tests run without a renderer and cannot establish visual layout, shader execution, interaction, performance or print pagination. These remain unverified for version 7; no older screenshots are presented as new evidence.
- The Galactic warp remains kinematic and independent of the integrated Solar vertical orbit. Labelled vertical display magnification changes neither numerical distances nor the force model.
- The 1,000-year catalogue row is a nominal sensitivity extrapolation with no new uncertainty or binary propagation. Accessibility scores are not planet counts. No claim of established novelty is made.

---

# Version 6 verification - 24 October 2026

This release adds a frozen 1,387-source Gaia DR3 experiment, a four-scenario accessibility comparison, formal covariance sampling, IWA sensitivity, a kinematic warp display, inner-planet spatial tracks and a paper-style report.

- All 41 numerical/model check groups passed locally. Nine new groups cover cadence interpolation, catalogue integrity, covariance reconstruction, radial/transverse transformations, paired epoch-zero controls, independent phase quadrature, instrument monotonicity, warp material derivatives and exact seeded reproduction.
- The prior hard-coded 0.1 Myr interpolation cadence is corrected. Tables carry their own sample interval, with an explicit parameter available for externally supplied arrays.
- An optional independent Astropy 8.0.2 comparison reconstructs ICRS Cartesian positions and velocities for all 1,387 sources. Maximum distance differences at 2026 and 2126 are 7.11e-15 pc. This verifies transformation/units, not omitted astrophysics. See `compare-astropy.py` and `data/astropy-comparison.json`.
- The Gaia CSV is preserved byte-for-byte through Git using `.gitattributes`; the experiment checksum must match on every platform. Builds and tests use a frozen snapshot without external queries.
- The direct-imaging calculation is a single-visit threshold proxy, with no observing-time budget or planet occurrence model. Its scores must not be presented as new discoveries. The instrument settings are hypothetical.
- The report's four-scenario result table is generated from the result JSON during the build. Interpretation text requires review when model assumptions change.
- The outer-disk warp has a sourced scale and precession rate but assumed profile/phase. Its tested material derivative is a kinematic consistency check, not a validation of a self-consistent Galactic potential. The Sun remains independently integrated in the existing smooth potential.
- Browser inspection was unavailable during this release. Numerical and static checks do not establish visual rendering, shader execution, browser interaction or print-pagination correctness. Prior screenshots and browser checks below belong to their explicitly labelled older versions.

---

# Version 5 verification - 23 October 2026

The current release adds the full embedded and standalone research report, a usage tutorial, the historical-input Proxima lab and three independently integrated synthetic stellar tracers. Earlier sections below are retained as historical evidence for their stated versions.

- All 32 check groups pass using Node 24.19.0. New stellar checks independently reconstruct radial/transverse speeds, closest-approach geometry and stationarity, common-velocity cancellation, transit boundaries, synthetic-orbit conservation and step-halving convergence. Built report MathML and offline assets are checked.
- Proxima at 2026: 4.240001 light-years; radial velocity -22.188574 km/s; relative speed 32.513114 km/s. The rectilinear minimum is 3.099154 light-years after 26,680.807 years. These are calculation outputs without uncertainty propagation or binary acceleration, not precision forecasts.
- Browser verification: report entry/return and section links; desktop equations; tutorial navigation at 390 x 844; Proxima closest-approach and +100,000-year presets; transit control outside the band and at zero angle; synthetic target selection at +50 Myr; visible author/year footer; oblique and edge-on cameras. Browser warning/error logs were empty when inspected.
- The browser-exported Proxima CSV matches all 1,501 rows and nine numeric fields of the reproducible source export exactly. The displayed closest-approach radial velocity rounds to 0.00 rather than a negative zero.
- Fixed report text encoding and mobile navigation width after visual inspection. Native MathML displays offline. Print styling is supplied; print pagination has not been separately verified.
- The renderer samples 180,000 luminous points from the credited ESA reconstruction, uses soft point profiles, illustrative disk/bulge thickness and warp, fades the surface near edge-on, and applies schematic dust attenuation. These are rendering assumptions, not measured stellar positions or a fitted dust model. Solar-system lighting now shows a stronger day/night boundary. The simulation footer and saved images credit Biswajit Jana, 2026.
- Publication check: the public simulation and standalone report loaded successfully from GitHub Pages. Visible simulation author/year credit, the public +50 Myr state, report equations and tutorial anchors were verified. The GitHub model/build workflow passed on the published source.
- Preview evidence: preview-v5-galaxy.png, preview-v5-report.png and preview-v5-tutorial-mobile.png. Historical v4 images remain labelled by version.
- Dependency audit reported zero known vulnerabilities after updating the report build dependencies. Numerical agreement does not validate omitted physics or an observational discovery forecast.

---

# Version 4 verification extension — 23 October 2026

The default Milky Way scene now has its own 0–250 Myr clock. The original century model and independent JPL evidence below remain applicable to the 2026–2126 planetary view only; the new long clock does not extrapolate those planetary elements.

## New implementation and evidence

- Same initial Solar position and velocity in both clocks. The 100-year endpoints differ by 4.6e-8 AU, a floating-point level discrepancy.
- Six new checks pass in `validate-galactic.cjs`. Across 250 Myr, sampled relative energy variation is 2.11e-11 or less and axial angular momentum variation 2.39e-14 or less. Halving the timestep changes sampled positions by at most 0.000307 pc. These are numerical checks, not physical uncertainty bounds.
- The nominal circular period is 216.214 Myr. At that epoch the integrated path is 51.520 kpc long but ends only 0.06167 kpc from the initial reference. Thus distance travelled is correctly distinguished from separation. The nonzero height and vertical velocity prevent an exactly closed orbit at that nominal period.
- The Galactic CSV was downloaded through the actual browser control. All 501 rows and 6,513 numeric fields agree with the model. All seven century checks, eight retained potential checks and four prior audit groups also pass.
- Browser verification: visible Galactic playback; both clock ranges and saved epochs; 10 Myr/s switching to century and back; 0.1 yr/s selection on entering Earth & Sun; one-orbit jump; endpoints; plane camera; pattern toggle; CSV and image downloads; three-year winding path toggle; return to inner-orbit view; responsive control drawer at 390 × 844. The temporary viewport override was reset. Inspected browser warning/error logs were empty.
- Current preview files are named `preview-v4-*`. Older `preview-v3-*` and `audit-*` images document the earlier audit below. Sidebar scroll resets on scene changes so main readouts remain visible. Trajectory lines and reference symbols are rendered as annotations above the galaxy texture.

## Scientific scope of the new visuals

The Sun is integrated in a static illustrative axisymmetric potential, including vertical oscillation. The disk artwork rotates rigidly at an assumed 20 km/s/kpc, with an explicit schematic label and an off switch. Individual stars, differential rotation, changing spiral structure, encounters, star formation and galaxy-wide spacetime dynamics are not modeled. Arm contrast changes texture brightness and point opacity only; darker inter-arm regions still contain stars. It does not turn the artwork into a density measurement.

The Earth space-path option displays `r_sun(t) + r_earth_relative(t)`, translated by the current Solar position for the camera. It samples up to the last three years at true AU proportions and shows the corresponding Solar track. The ecliptic is oblique to Solar motion. This is a frame-dependent winding spatial trajectory, not a perfect universal helix or a relativistic spacetime simulation.

A fixed cyan reference still requires active velocity cancellation and force compensation. It is a coordinate thought experiment. The 250 Myr endpoint is not a realistic probe lifetime or a mission claim.

---

# Verification audit — The Moving Observer v3.1

Audit date: 23 October 2026. Scope: numerical implementation, scientific claims, browser behavior, responsive layout, exports and packaged files.

## Conclusion

The implementation is internally consistent and suitable as an explicitly approximate **discussion demonstration** of a 2026 fixed-reference experiment. It is not a validated Galactic reconstruction, spacecraft mission model, or exoplanet-discovery forecast. The audit found and corrected presentation defects; it found no error in the century-baseline calculation or the implemented planetary coordinate transformation.

## Independent evidence

The actual planetary code was compared with geometric heliocentric vectors from **JPL Horizons**, not just with another copy of its Kepler formula. All requests use the Sun as origin, ICRF/J2000 ecliptic axes, AU units, TDB and exact model Julian dates. Six epochs were queried for each of Mercury, Venus, the Earth–Moon barycentre and Mars: 2026.0, 2026.25, 2051.0, 2076.0, 2101.0 and 2126.0.

| Body | Largest 3D position difference among six samples |
|---|---:|
| Mercury | 3,346 km |
| Venus | 10,521 km |
| Earth–Moon barycentre | 27,885 km |
| Mars | 159,167 km |

These are approximation residuals at selected epochs, not full-century error bounds. The deliberately loose 0.005 AU automated regression guard catches gross calculation changes; it is not a published JPL tolerance or a claim of observational accuracy. Exact API URLs and complete replies are retained in `horizons-*.json`; `compare-horizons.cjs` regenerates `horizons-comparison.json`.

The passive test particle was also compared with an independent analytic Kepler two-body solution derived from its initial position and velocity. Maximum difference at selected stored times was 1.04e-7 AU (about 16 km). Linear interpolation between saved output samples increased selected midpoint differences to 0.00051034 AU (about 76,000 km). The interpolation error is therefore much larger than integration error and is disclosed; the passive comparator is illustrative, not navigational.

The 100-year Solar displacement along the Galactic plane independently agrees with velocity × time: 233 km/s × 100 Julian years = 4,915.124 AU. With the assumed 7 km/s vertical component, total Solar displacement is 4,917.342 AU. Earth's distance to its initial reference is 4,917.346 AU. Instantaneous distance/c is 28.400 days. Ecliptic inclination to the Galactic plane is 60.18856 degrees.

## Numerical and artifact checks

- Seven current-model checks pass: century displacement, Solar timestep convergence, fixed-reference invariance, rotation length/handedness, Earth radial bounds, passive timestep convergence/boundedness, light-time and the PDF's angular example.
- Eight retained checks pass for the underlying Galactic potential and integrator: normalization, gradient, conservation, convergence and limiting cases. Those long-timescale tests verify numerical machinery, not observational validity of that potential.
- Four audit groups pass: 24 independent Horizons comparisons; passive analytic-orbit comparison; self-contained/matching HTML aliases; all 101 CSV rows and all 1,616 numeric fields.
- HTML embeds code and images; source hyperlinks are the only required external destinations when explicitly opened. The two output HTML aliases match. ZIP member hashes and CRCs are checked during packaging; the Downloads HTML matches the tested workspace build.

## Issues corrected

1. **Mobile inset visibility:** inline display style overrode the narrow-screen stylesheet, producing an off-screen inset. A hidden attribute now controls scale visibility while media rules retain control of mobile layout.
2. **Narrow-screen image exports:** long titles and attribution lines could be cut off. Captions now wrap to the image width; label outlines improve readability against the galaxy core.
3. **Early-time reference label:** the first 0.8 year was labelled as though Earth and the reference were still together. Combined labelling now applies only at the exact initial epoch; later Earth/Sun labels identify the moving observer.
4. **Orbital playback readability:** entering Earth & Sun selects 0.1 year/second. Higher rates can visually undersample inner-planet orbits and are explicitly described as such. This changes playback presentation, not computed positions or the shared epoch.
5. **Small-screen clutter and guidance:** intermediate path-year labels are hidden at narrow widths, and instructions point to Earth & Sun rather than an inset that is unavailable there.

## Browser verification

Checked in the in-app browser at its normal desktop viewport and at 390 × 844 CSS pixels (temporary override subsequently reset). This is responsive browser testing, not a physical-phone or multi-browser certification.

Verified scale switching with a shared epoch, initial reset, timeline endpoint/automatic stop, playback speed selection, plane/edge camera presets, zoom/reset controls, labels and plane visibility, passive comparator, mobile control drawer, model dialog, CSV download and image download. Narrow-screen image output was opened and inspected. The inspected browser console reported no warning or error messages.

## Scientific limits that remain

- The primary cyan object is an **actively held, hypothetical fixed coordinate** in the chosen Galactic frame. No propulsion, fuel, station-keeping, launch or feasibility calculation is included. A released spacecraft retains inherited velocity; there is no universal absolute-rest position implied.
- The Sun's adopted phase-space state and the axisymmetric potential are illustrative. Solar peculiar radial/tangential motion, updated Galactic measurements and parameter covariance have not been fitted. A 1 km/s speed change alters a century baseline by about 21.1 AU. Display precision is not a measurement uncertainty.
- Earth is represented by the Earth–Moon barycentre. The four planetary orbits are JPL's lower-accuracy fitted-element approximation, not Horizons trajectories. The illustration does not solve lunar motion, planetary perturbations, Solar barycentric reflex motion, encounters or spacecraft dynamics.
- The face-on Milky Way is ESA's observationally informed artist reconstruction. Added depths, disk thickness and warp are display assumptions. This project has not reprocessed Gaia observations; its points are not individual catalogue stars.
- Whole-galaxy motion over 100 years is genuinely too small to resolve. The AU view is needed to see the baseline. Body markers are enlarged, and Earth surface orientation/lighting is illustrative.
- Distance/c is instantaneous geometric light time. Retarded positions, signals, relativity and actual instrument measurements are absent.
- No target-star catalogue, full stellar space velocities, planetary inclination evolution, transit selection, signal-to-noise, extinction or detection simulation is present. The original exoplanet question remains a scientific hypothesis to discuss, not an established result.

## Sources and reproduction

Run `npm ci`, `npm run build`, `npm test` in the source directory. Tests use the archived Horizons responses and do not require network access.

- JPL approximate planetary elements and their stated scope: https://ssd.jpl.nasa.gov/planets/approx_pos.html
- JPL Horizons API: https://ssd-api.jpl.nasa.gov/doc/horizons.html
- Gaia coordinate transformation, equation 4.62: https://gea.esac.esa.int/archive/documentation/GDR3/Data_processing/chap_cu3ast/sec_cu3ast_intro/ssec_cu3ast_intro_tansforms.html
- ESA Milky Way reconstruction and attribution: https://www.esa.int/ESA_Multimedia/Images/2025/01/The_best_Milky_Way_map_by_Gaia
- Original problem: the user's `discussion-note.pdf`, included unchanged.
