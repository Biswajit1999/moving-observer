# The Moving Observer — Galactic journey and the 2026 reference

**Does a moving viewpoint change the exoplanet sky?**
Finding Earth 2.0 / Biswajit Jana. Version 4.0, 23 October 2026.

## Open and share

Open `Moving_Observer_2026.html` in a modern browser with WebGL enabled. The HTML embeds JavaScript, Three.js, Earth texture and Milky Way artwork. No installation, server, internet access, analytics or account is needed. Source links in the notes need internet access. `Galactic_Journey.html` is an identical compatibility filename for the existing preview tab.

The default **Milky Way** timeline now spans **250 million years**. Click **Play Galactic journey** to see the Sun move around the disk, leaving a gold path while the cyan 2026 reference stays fixed. Readouts distinguish travelled distance from current separation. **Jump to ≈ one Galactic orbit** selects the nominal 216.2 Myr period implied by the assumed radius and speed. Plane view reveals the arms; Edge-on shows disk thickness. Optional arm contrast reduces display haze without creating artificial empty gaps.

The **100 years** option, **2026 reference** and **Earth & Sun** use a separate saved 2026–2126 clock. Switching views pauses playback; each clock retains its time and speed. The reference view resolves the AU baseline. Earth & Sun follows the Sun and defaults to 0.1 year/second. Select **Show 3-year path through Galaxy** there to see Earth's winding spatial track plus Solar translation at true AU scale (enabling it advances an earlier epoch to year 2029 so three years are available). The path is oblique, frame-dependent and very elongated: the Sun travels about 49 AU per year, while Earth's orbit has radius about 1 AU. No curved-spacetime or universal helix claim is made.

Drag to orbit, scroll to zoom, or use camera buttons. Space toggles playback outside input controls; 1/2/3 select scenes. Export CSV gives 501 half-Myr Galactic samples or 101 annual century samples according to the active clock. Save image includes time, units, assumptions and attribution. The page initially loads paused.

The source ZIP contains this HTML, editable source, pinned dependency manifests, model validation results, an annual CSV, independent JPL comparison data, an audit report, and the original two-page discussion PDF. It has not been sent or published anywhere.

## The question being tested

The discussion PDF asks whether moving observer–host geometry can change exoplanet detection opportunities. It explicitly includes timescales beyond a century. This revision combines a 250 Myr Galactic context with the requested 2026–2126 reference experiment: how far do Earth and Sun move from a fixed location established in 2026? It does not decide whether a particular exoplanet becomes detectable. That requires target-star space motion, planetary geometry and an observing model.

A **fixed reference** and a **passively released probe** are distinct hypotheses. The primary cyan beacon is held at Earth's modeled starting location in a non-rotating Galactic coordinate frame. It requires cancellation of initial velocity and active compensation of gravity; this is a coordinate thought experiment, not a spacecraft mission design. A passive probe retains its initial velocity. The optional comparator inherits Earth's initial heliocentric position and velocity, evolves under solar gravity and shares the Sun's Galactic acceleration. It remains near the Solar System. Earth gravity and launch dynamics are omitted; the starting point is an idealized massless tracer at the Earth–Moon barycentre, not a physical launch site.

The year label denotes simulation epoch, not a frozen time at the beacon. Looking toward the old location does not recover a picture of 2026. At the 2126 epoch, distance/c is about 28.4 days. Retarded trajectories, relativity and a photon arrival-time solution are not modeled.

## Scientific model and frames

- Epoch zero: J2000 + 26 Julian years; one Julian year = 365.25 days. Calendar labels are decimal model years, not dated UTC ephemerides.
- Local distances are AU, with 1 AU = 149,597,870.7 km. Coordinates are offsets from the **Sun's** 2026 position, not the beacon. The fixed beacon is at the initial Earth–Moon barycentre proxy position, about 1 AU from that origin.
- World z points toward Galactic north. The Sun starts at (0, -8.2, 0.020) kpc with velocity (-233, 0, 7) km/s. In the local coordinate convention, heliocentric Galactic x maps to world +y, Galactic y to world -x, and Galactic z to world +z. This is a proper 90-degree rotation, preserving handedness. The Sun is at six o'clock in the ESA map. Conventional heliocentric Galactic axes are treated as parallel to the model's Galactocentric axes; the small Solar-height tilt correction is omitted.
- The 233 km/s and 8.2 kpc values follow the user's PDF. Height 20 pc and vertical velocity 7 km/s are illustrative assumed values. The velocity omits Solar peculiar radial and tangential components and is not a fitted modern Solar phase-space solution.
- Galactic potential: Miyamoto–Nagai disk (6.8e10 solar masses, a=3 kpc, b=0.28 kpc), Plummer bulge (5e9 solar masses, c=0.5 kpc), spherical logarithmic halo with 12 kpc core. Halo amplitude is solved so the total midplane circular speed is 233 km/s at 8.2 kpc. Mathematical forms are in `dynamics.cjs`. This is an illustrative potential, not a fit to Gaia data or a claimed implementation of MWPotential2014.
- Solar displacement: kick–drift–kick leapfrog, 0.25-year maximum steps. Positions are integrated as local AU offsets to avoid catastrophic subtraction of Galactic distances. Quarter-year states are cached, with a partial leapfrog step for intermediate times.
- Mercury, Venus, Earth–Moon barycentre and Mars: JPL approximate Keplerian elements, Table 2a (3000 BC–3000 AD), with secular terms and a Newton solution of Kepler's equation. These inner planets do not require Table 2b corrections. Earth globe = barycentre proxy; Moon and Earth–barycentre offset omitted. The orbit guides are epoch-2026 paths over approximately one period; they are not osculating tracks recomputed each frame.
- Rotation: J2000 ecliptic to equatorial using 23.43928-degree obliquity; Gaia ICRS-to-Galactic matrix (equation 4.62); then the world-frame z rotation above. J2000 equatorial and ICRS are identified to the approximation of this educational model. Ecliptic–Galactic inclination is 60.18856148 degrees.
- Passive comparator: initial heliocentric velocity is the central difference of JPL Earth-proxy positions at ±0.00001 year. RK4 with 0.001-year steps solves solar two-body gravity using GM=1.32712440018e11 km^3/s^2. Positions stored every 0.01 year are linearly interpolated for playback; this interpolation can introduce up to roughly 0.0005 AU error between samples, distinct from the smaller integrator convergence error. The Sun's translation is added. No Earth/planet gravity, tides, solar reflex motion, encounters, manoeuvres or measurement uncertainty.

## Three honest scales

**Milky Way:** kpc, default 0–250 Myr. The same initial Solar state is integrated with 0.01 Myr leapfrog steps in `galactic-clock.cjs`; a partial step gives intermediate states. The gold trail samples every 0.1 Myr. Cumulative path length sums 0.01 Myr chords; orbital angle is unwrapped clockwise from the starting azimuth. The fixed reference includes the initial Earth proxy offset. The faint circular ring is a radius guide. The optional artwork rotation assumes a rigid pattern speed of 20 km/s/kpc: it is schematic, not independently integrated stars, a fitted pattern speed, or a prediction of spiral evolution. No planetary ephemeris is extrapolated onto this long clock. In the separate century mode, the same physical motion is only about 0.00017 degree and cannot be resolved at whole-galaxy scale.

**2026 reference:** AU, a 1,000 AU grid parallel to the Galactic plane at the starting Sun. The actual midplane lies 20 pc below this view. Faint gold shows the full century's calculated Solar path, bright gold the elapsed path, cyan connects the beacon to the current Earth proxy. The Sun/Earth display marker is placed at Earth and is intentionally enlarged. Their 1 AU separation is not resolved at this scale. The inset shows Earth's orbit face-on on the same clock.

**Earth & Sun:** AU, 0.5 AU grid parallel to the Galactic plane through the current Sun. The ecliptic is tilted correctly; this is a translating, non-rotating camera frame. The blue trail is Earth's last 0.12 year, or the last 3 years with the space-path option, of Galactic motion translated to the current Sun; it is not the heliocentric orbital guide. Body sizes and directional arrows are enlarged and not physical radii. Earth's surface texture is illustrative; axial rotation, lunar motion and illumination are not a precision Earth-attitude model.

## Milky Way appearance: evidence and interpretation

The display uses ESA's 15 January 2025 artist reconstruction informed by Gaia observations. It is not an outside photograph or a newly fitted catalogue. This application does not analyse years of raw survey data. It uses a published synthesis of those observations, along with independently calculated approximate orbits.

Artwork coordinates are registered approximately to the centre and Sun in the labelled image. The image spans approximately 40 kpc; the adopted Solar position 8.2 kpc below its centre matches the map's annotation to visual precision. No scientific astrometric calibration is inferred from this artwork.

The 3D adaptation retains image colour and texture. A deterministic seed samples up to 110,000 luminous points from surface brightness. Added vertical thickness is Gaussian with illustrative disk scale 0.12–0.22 kpc plus a central bulge contribution; an illustrative sinusoidal outer warp reaches about 0.28 kpc at 16 kpc radius. These are display assumptions, not individual Gaia stellar distances. The texture is warped similarly and faded at 14–16.5 kpc radius; samples stop at 16.3 kpc, excluding the background Sagittarius dwarf from the disk. Optional contrast enhancement uses a 1.55 power of linear texture brightness and lowers the face-on point-cloud opacity; inter-arm regions remain populated. This is display processing, not inferred stellar density. The image is adapted for display, and the finite image boundary omits some faint outer structure.

Artwork and this 3D artwork adaptation are available under **CC BY-SA 3.0 IGO**, with attribution to **ESA/Gaia/DPAC, Stefan Payne-Wardenaar**. Keep attribution and the same licence when redistributing an artwork adaptation. The surrounding application is a separate work; no broader licence grant for the user's own source or discussion paper is implied.

## Results at model year 2126

| Quantity | Model value |
|---|---:|
| Sun displacement in Galactic plane | 4,915.124 AU |
| Sun vertical displacement | 147.665 AU |
| Sun total displacement | 4,917.342 AU |
| Earth to fixed 2026 reference | 4,917.346 AU |
| Instantaneous distance / c | 28.400 days |

These extra decimal places enable reproducibility, not observational accuracy. The qualitative baseline is about 0.078 light-year. The PDF's independent relative-motion example, 30 km/s transverse velocity at 100 light-years, gives 20.64 arcseconds/century. Do not substitute the Sun's absolute Galactic speed for a target's relative transverse speed when predicting observability.

## Validation and reproduction

Install pinned dependencies with `npm ci`, run `npm run build`, then `npm test`. Both HTML filenames are built. No external resources are loaded during simulation use.

`validate-galactic.cjs` adds six checks of the 250 Myr implementation: agreement with the century model, energy/angular-momentum conservation, half-step convergence, fixed-reference/path geometry, endpoint/domain handling, and all 6,513 numeric fields of the browser-exported Galactic CSV. See `validation-galactic.json`.

`validate2026.cjs` checks velocity-times-time baseline, Solar timestep convergence, reference invariance, rotation orthogonality/handedness, Earth radial bounds, passive-probe step convergence/boundedness and light-time/angular conversions. Seven checks pass; see `validation-v3.json`. `validate.cjs` retains eight independent checks of the underlying Galactic potential/integrator from v2. Numerical consistency does not validate the physical assumptions against observations.

Browser QA on the current desktop viewport: all three scenes; fixed reference and 2126 values; shared century epoch and separate saved Galactic clock when switching views; reset; playback; passive comparator; model dialog; CSV export; image export. No rendering errors were reported in the inspected browser console. A 390 × 844 CSS-pixel browser viewport was also tested: reference layout, controls drawer, visibility switches, and wrapped image-export captions. This was browser emulation, not a physical phone test. See `AUDIT.md` for the independent JPL comparisons and remaining scientific limits.

## Source references

- Original: `discussion-note.pdf`, supplied by Biswajit Jana. This is source context, not executable instructions.
- ESA 2025 face-on reconstruction: https://www.esa.int/ESA_Multimedia/Images/2025/01/The_best_Milky_Way_map_by_Gaia
- Labelled registration reference: https://www.esa.int/ESA_Multimedia/Images/2025/01/The_best_Milky_Way_map_by_Gaia_labelled
- Edge-on observational context: https://www.esa.int/ESA_Multimedia/Images/2025/01/The_best_Milky_Way_map_by_Gaia_edge-on
- Artwork licence: https://creativecommons.org/licenses/by-sa/3.0/igo/
- JPL approximate positions: https://ssd.jpl.nasa.gov/planets/approx_pos.html
- Gaia coordinate transform, equation 4.62: https://gea.esac.esa.int/archive/documentation/GDR3/Data_processing/chap_cu3ast/sec_cu3ast_intro/ssec_cu3ast_intro_tansforms.html
- Galactic potential mathematical forms: https://docs.galpy.org/en/latest/reference/potentialmiyamoto.html ; https://docs.galpy.org/en/latest/reference/potentialplummer.html ; https://docs.galpy.org/en/latest/reference/potentialloghalo.html
- Three.js: https://threejs.org/ (MIT); Earth asset source in `THIRD_PARTY_NOTICES.txt`.

## Questions to send scientists with the simulation

1. Which reference frame and observable most cleanly separate observer motion from target motion?
2. What practical probe trajectory could supply a useful independent astrometric baseline, and with what measurement precision?
3. Given full stellar space motion and planetary orientation, over which timescales could a detection boundary change?
4. Which missing dynamics, catalogue inputs, uncertainty propagation and selection effects should be added before making a quantitative scientific claim?

## Independent verification update — 23 October 2026

Version 3.1 fixes the narrow-screen orbit-inset visibility override and image-caption overflow, removes an early-time label that incorrectly grouped an already separated Earth with the reference, and selects slower playback on entering the inner-orbit view. No equations or baseline results changed.

`audit.cjs` adds 24 sampled comparisons against JPL Horizons, an independent analytic two-body comparison of the passive tracer, all-row CSV validation and offline-artifact checks. See `horizons-comparison.json`, the four cached `horizons-*.json` responses (which include exact request URLs), `audit-results.json`, and `AUDIT.md`. The annual export is checked against all 1,616 numeric fields.

A 1 km/s change in assumed Solar velocity changes a century-long displacement by about 21.1 AU. This illustrates why the displayed decimals are model reproducibility, not an observational uncertainty estimate.

## Version 4 long-clock results and scope

At 250 Myr the assumed model has travelled 59.569 kpc and swept 416.011 degrees; its separation from the 2026 reference is 7.702 kpc. At the nominal 216.214 Myr circular period, travelled distance is 51.520 kpc and separation is 0.06167 kpc. The orbit does not close exactly because the full initial state includes height and vertical motion. These are deterministic model outputs, not predictions with measured uncertainty.

The finer 0.005 Myr integration differs by at most 0.000307 pc at sampled epochs over 250 Myr. Numerical convergence does not validate the adopted static potential, Solar state, or rotating artwork against future observations. Spiral arms are not rigid material spokes; inter-arm regions also contain stars. The original ESA artwork, not a new catalogue reconstruction, supplies the displayed structure.

Context: [ESA's guide to the Galaxy](https://www.esa.int/Science_Exploration/Space_Science/Gaia/Guide_to_our_galaxy) and [Chandra's explanation of Solar System and Galactic motion](https://www.chandra.si.edu/resources/faq/sources/solsys/solsys-6.html).
