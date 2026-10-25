# The Moving Observer

### Does a moving viewpoint change the exoplanet sky?

**By Biswajit Jana · Finding Earth 2.0**  
Version 7.1 · Community discussion project · 24 October 2026

The Sun moves through the Milky Way, and so do the stars around it. Could their changing relative positions bring different planetary systems within reach of observation—or change which planets transit from our viewpoint?

This project connects a 3D Milky Way demonstration with a reproducible Gaia DR3 experiment: 1,387 selected nearby sources, correlated astrometric uncertainties, and a paired comparison of century-scale motion versus instrument thresholds. It includes a fixed-reference experiment, Proxima case study, and a report with equations and tutorials.

**[Open the simulation](https://biswajit1999.github.io/moving-observer/)** · **[Read the report](https://biswajit1999.github.io/moving-observer/Report.html)** · **[Discuss or correct the work](https://github.com/Biswajit1999/moving-observer/issues/new/choose)**

> **Status:** an educational model and working discussion report, not a peer-reviewed discovery, spacecraft proposal, or reliable 250-million-year forecast for named stars. The principle that stellar motion changes transit viewing opportunities already has published precedent, cited explicitly in the report.

![Historical version 5 overview](preview-v5-galaxy.png)

The image above is a version 5 preview, not a screenshot of the updated report.

## New in version 7.1

- Synthetic example stars are off by default; only the selected example appears. Labels use collision avoidance and leader lines.
- A smooth-density scenario follows the Solar orbit; a separate radius/height comparison exposes the difference between the adopted force model and observed rotation curves.
- A one-click 3D winding-path tour, full Galactic and 98% co-moving frames, and an explicitly illustrative Earth–Moon close-up.
- A textured 3D Earth, local 24-hour orbit clock, stationary/circular Schwarzschild clock rates, and an exterior spatial embedding with labelled height magnification.
- A [two-page brief](output/pdf/Moving_Observer_Brief.pdf), [24-second scientific model animation](output/video/Moving_Observer_3D_Tour.mp4).

See [new methods and tutorials](ENVIRONMENT_REPORT.md). The lunar orbit is not a precision ephemeris; the density scenario is not an arm-crossing or discovery forecast.

## Version 7 foundations

- Repaired report equations: section insertion now preserves display-math delimiters. Invalid equations fail the build. The title and author are centred, with a single-column report layout.
- **Sun & all planets:** all eight planets, a Galactic-path view, and a close-up of the Sun moving around the system barycentre. Outer-planet positions use saved JPL Horizons ephemerides; inner planets use approximate elements.
- **Reveal Galactic wobble:** an edge-on tour with explicitly labelled vertical magnification. The integrated Solar oscillation remains separate from the kinematic disk warp.
- **Space & Time:** moving potential diagrams and isolated-body gravity/clock comparisons. Diagram depth is arbitrary; numerical clock rates use a specified weak-field approximation.
- Reproducible 10-, 100- and 1,000-year accessibility comparisons. The millennium row is a sensitivity extrapolation, not a discovery forecast.
- Independent Horizons checks and regressions for mathematics, barycentric identity, clock scaling and scene construction. See [verification and limits](AUDIT.md).

The frozen 1,387-source Gaia DR3 experiment, correlated uncertainties, four-scenario comparison and threshold-sensitivity controls remain available. Its outputs are accessibility scores, not planet discoveries.

**Research question:** Which individual targets retain a useful motion-induced gain after realistic observing budgets, binary dynamics and planetary populations are included? The current contribution is an inspectable comparison and source ranking. Novelty is not established; see [literature search](LITERATURE_SEARCH.md).

## What the project answers

- **Do stars move with us?** They share some Galactic rotation but have different velocities and orbits. Relative motion controls changing sightlines; the Sun's travelled distance alone does not.
- **Is Proxima getting closer?** Yes, currently. The documented linear calculation gives about 4.24 light-years at 2026 and a minimum near 3.10 light-years about 26,700 years later. It uses historical published inputs without binary dynamics or propagated uncertainties.
- **Can a different viewpoint help?** It can alter angular separation, brightness and transit alignment. Detection also depends on the planetary system and instrument. Getting closer does not establish habitability.
- **What happens over 250 Myr?** The demonstration integrates the Sun and three synthetic targets independently. These are explicitly invented examples, not real stars or forecasts of future discoveries.

The research question is: **for which real systems and observing methods does relative stellar motion produce a meaningful, measurable change in detection opportunity?**

## Explore the website

| View | What it shows | Scope |
|---|---|---|
| Milky Way | Sun, fixed 2026 reference, integrated paths and three moving targets | 0–250 Myr; illustrative Galactic potential |
| 2026 reference | Earth/Sun drift from the initial Earth location | 2026–2126; AU distances |
| Earth & Sun | Earth orbit and optional three-year spatial track | JPL approximation; century clock |
| Sun & all planets | Eight planets, Galactic paths and Solar barycentric wobble | 2026–2126; separate scale/frame choices |
| Space & Time | Potential diagrams, isolated gravity and clock-rate comparisons | Weak-field educational model; arbitrary plotted depth |
| Research report | Full equations, evidence, assumptions and questions | Embedded reading view, printable and offline |
| Proxima lab | Approach, minimum and recession; distance/flux/angle readouts and CSV | −50 kyr to +100 kyr; constant relative velocity |
| Transit control | Entry/exit from a circular orbit's transit band | Invented Earth–Sun analogue, not Proxima b |

Click **Research report** in the main navigation, or **Is Proxima approaching?** in the Galactic sidebar. This full reading view is separate from the shorter **Model & sources** notes. The report includes a [step-by-step tutorial](https://biswajit1999.github.io/moving-observer/Report.html#report-section-12) for every view, both clocks and the exports. Use **Print / save PDF** for a printable copy. Standalone [Report.html](Report.html) includes the same interactive case study.

The Galactic and century clocks are saved separately. Switching scenes pauses playback. Drag to orbit, scroll to zoom, or use **Plane view** and **Edge-on**. In **Earth & Sun**, select **Show Earth’s path through Galaxy** for the winding spatial trajectory at true AU proportions. Body markers are enlarged.

## Run offline

Download [Moving_Observer_2026.html](https://github.com/Biswajit1999/moving-observer/raw/refs/heads/main/Moving_Observer_2026.html) and open it in a modern WebGL-enabled browser. The single file includes the simulation, report, equations, images and Proxima lab. No online libraries or assets are required during use. External source/GitHub links need internet access. `index.html` and `Galactic_Journey.html` are identical build aliases.

## Reproduce

Requires **Node.js 22.12 or newer**; CI uses Node 24.

```sh
git clone https://github.com/Biswajit1999/moving-observer.git
cd moving-observer
npm ci
npm run research
npm run build
npm test
```

Optionally run `python -m http.server 8788` and open `http://localhost:8788/`.

The source uses plain JavaScript, Three.js and CommonJS numerical modules. esbuild bundles the application. Markdown-it and KaTeX run at build time; equations become native MathML for offline reading.

The research calculation is in `research.cjs`, its frozen inputs and formal uncertainties are described in [data provenance](data/GAIA_PROVENANCE.md), and results are in [JSON](data/research-results.json) and [CSV](data/research-targets.csv). Run `python fetch-gaia.py` only for an intentional data refresh. Ordinary builds and tests use local inputs. The outer-planet inputs, source URLs and units are stored in `data/ephemeris-*.json`. `python fetch-horizons-v7.py` intentionally refreshes those inputs and independent midpoint checks; `node compare-extensions.cjs` regenerates the error summary. The original six-date benchmark requests remain frozen. [Space & Time and Solar-motion methods](SPACE_TIME_REPORT.md) describe the approximations.

The Gaia sample is incomplete and quality-selected; it is not a census of nearby planetary systems. The threshold proxy has no exposure-time budget, scheduler or occurrence model. It cannot predict the number of new planets discovered by 2126. The warp is a kinematic display, not an evolving gravitational potential. Do not use the 250 Myr illustration to propagate named nearby systems.

## Scientific model

For observer and target star:

$$
\mathbf R=\mathbf r_\star-\mathbf r_{\rm obs},\qquad
\mathbf V=\mathbf v_\star-\mathbf v_{\rm obs},\qquad
\dot d=\frac{\mathbf R\cdot\mathbf V}{|\mathbf R|}.
$$

The model distinguishes **distance travelled**, **displacement from a fixed reference**, and **distance to a moving target**. A common velocity added to observer and target cancels from their relative motion.

The Galactic potential combines a Miyamoto–Nagai disk, Plummer bulge and logarithmic halo, normalized to 233 km/s circular speed at 8.2 kpc. The Sun starts 20 pc above the plane with 7 km/s upward velocity. Synthetic target states are supplied explicitly. This is not a Gaia fit. The display adds soft luminous particles, illustrative disk thickness, bulge, warp and simplified edge-on dust attenuation to the credited reconstruction. These visual parameters are not fitted 3D observations. Optional rigid disk-pattern rotation is schematic; artwork points are not independently measured/integrated stars.

The Proxima calculation uses Kervella, Thévenin & Lovis (2017), Table 2, with 1991.25 astrometry propagated to 2026. Constant relative velocity omits its bound orbit around Alpha Centauri AB. Displayed precision supports reproducibility, not confidence in a future encounter prediction. See [REPORT.md](REPORT.md) for the equations and limitations.

The cyan fixed reference is a coordinate thought experiment. A passive probe retains velocity and accelerates under gravity. Holding a coordinate fixed would require velocity cancellation and force compensation; no mission feasibility is claimed.

## Validation and data

`npm test` runs **82 check groups**: seven century checks, eight underlying-potential checks, four independent audit groups, six long-clock checks, seven stellar-motion checks, nine research checks, nine extension checks, seven scene-construction checks, eight environment/label/relativity checks, five journey/recording-control checks, and twelve relativistic-dynamics checks. These include archived JPL Horizons comparisons for four planets at six epochs, independent scalar closest-approach geometry, radial/transverse decomposition, common-velocity cancellation, transit boundaries and convergence tests. They assess implementation consistency and selected comparisons—not observational validation of the entire model.

| File | Purpose |
|---|---|
| [REPORT.md](REPORT.md) + [RESEARCH_EXPERIMENT.md](RESEARCH_EXPERIMENT.md) / [Report.html](Report.html) | Paper sources and rendered report |
| [data/research-results.json](data/research-results.json) | Paired experiment and uncertainty outputs |
| [data/astropy-comparison.json](data/astropy-comparison.json) | Independent coordinate/unit benchmark |
| [data/proxima-input.json](data/proxima-input.json) | Measurements, units, epoch, source and recorded errors |
| [data/synthetic-tracers.json](data/synthetic-tracers.json) | Exact assumed states for the example targets |
| [stellar-results.json](stellar-results.json) | Derived results used in the report |
| [Proxima_relative_motion.csv](Proxima_relative_motion.csv) | 1,501 samples from −50 kyr to +100 kyr |
| [Moving_Observer_Galactic_250Myr.csv](Moving_Observer_Galactic_250Myr.csv) | 501 Galactic samples |
| [Moving_Observer_2026_2126.csv](Moving_Observer_2026_2126.csv) | 101 century samples |
| [AUDIT.md](AUDIT.md) | Verification evidence and limits |
| [MODEL_NOTES.md](MODEL_NOTES.md) | Detailed underlying v4 model and frames |
| [discussion-note.pdf](discussion-note.pdf) | Original two-page note supplied by Biswajit Jana |

## Questions for the community

1. Which studies already answer this question? What references or counterarguments are missing?
2. Which real target and method make the strongest first test, holding instrument capabilities fixed?
3. How should catalogue selection handle binaries, missing radial velocities, covariance and selection effects?
4. Which observable and uncertainty treatment would make the Proxima example scientifically useful?
5. What would falsify or substantially limit the proposed observing advantage?

Use the [scientific feedback template](https://github.com/Biswajit1999/moving-observer/issues/new/choose) for corrections and suggestions. Reproducible counterexamples are welcome. See [CONTRIBUTING.md](CONTRIBUTING.md) and the [discussion brief](COMMUNITY_DISCUSSION.md). Citing a scientist does not imply their endorsement.

## Selected prior work

- Kervella, Thévenin & Lovis (2017), *Proxima's orbit around α Centauri*, A&A 598 L7. [Paper](https://arxiv.org/abs/1611.03495).
- Kaltenegger & Faherty (2021), *Past, present and future stars that can see Earth as a transiting exoplanet*, Nature 594, 505–507. [Paper](https://arxiv.org/abs/2107.07936). Directly relevant changing transit-viewpoint geometry.
- Bailer-Jones et al. (2018), *New stellar encounters discovered in the second Gaia data release*, A&A 616 A37. [Paper](https://arxiv.org/abs/1805.07581). Galactic integration with measurement-uncertainty propagation.

The report contains full references and a dated NASA Exoplanet Archive count. The code predicts neither discovery counts nor habitability.

## Authorship and rights

**Biswajit Jana** is the project originator and credited author. Independent scientific review is welcome. Published measurements and research are credited to their authors. No institutional affiliation or peer-reviewed status is claimed.

Milky Way artwork: **ESA/Gaia/DPAC, Stefan Payne-Wardenaar**, **CC BY-SA 3.0 IGO**; its display adaptation retains that licence. Dependencies retain upstream licences. See [THIRD_PARTY_NOTICES.txt](THIRD_PARTY_NOTICES.txt). Original code and text remain copyright Biswajit Jana, with no blanket open-source licence granted; see [RIGHTS.md](RIGHTS.md).

## Reproduce the sharing materials

The MP4 is a scientific rendering from the same numerical modules, not a screen recording of the website. It has four six-second chapters: full Galactic paths, a 98% co-moving inner-system view, an illustrative lunar close-up, and an ideal 400 km Earth-orbit clock. Axes use true relative proportions within each shot; body markers are enlarged where stated.

```sh
node export-media.cjs
python -m pip install matplotlib numpy imageio imageio-ffmpeg reportlab pypdf Pillow
python create-share-media.py
```

The final PDF has two pages. Numerical checks, scene construction and reviewed artifact frames do not establish live browser rendering or interaction; see `AUDIT.md` for the exact verification scope.

### Live 100-light-year preview and recording

Click **100 light-years · preview & record** on the simulation, then **Preview 10 seconds** or **Record 10 seconds**. The latter captures the actual live website canvas, with labels and model assumptions. It saves MP4 if the browser supports that encoder, otherwise WebM. Recording needs a visible tab and a supported desktop browser. Nothing is uploaded. This is separate from the older model-rendered MP4.

The integrated Sun travels 100 light-years in approximately 128,608 model years. The view uses local Galactic axes in light-years and omits unresolved planetary orbits. It assumes a nearly circular orbit in a static smooth potential; evolution of the Galactic plane is not included. Tests check the distance against a finer independent integration, recording completion and hidden-tab cancellation with a mock media backend. Actual browser encoding has not been verified in this environment.

The revised two-page brief includes the original A/B/C observer question, transit geometry and long-timescale examples. Its source is `brief-report.py`; the unchanged original is `discussion-note.pdf`.

Browser recording uses the standard [canvas capture API](https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement/captureStream) and checks [MediaRecorder format support](https://developer.mozilla.org/en-US/docs/Web/API/MediaRecorder/isTypeSupported_static) at runtime.

### Illustrated discussion report

[Download the six-page illustrated report](output/pdf/Moving_Observer_Illustrated_Report.pdf). It includes six numbered figures: a labelled conceptual Galactic map, transit geometry, the catalogue experiment, stellar environment, 3D path comparisons and Earth-orbit clocks, followed by a tutorial and references. Figures are project diagrams or generated from model data. The simulation's separate Milky Way artwork retains its ESA credit and licence. The two-page brief remains separate.

Reproduce using the same Python media dependencies listed above:

```sh
node export-media.cjs
node export-illustrated.cjs
python illustrated-report.py
```

### Coupled relativistic Solar System lab

Open **Space & Time → Relativistic Solar System · coupled 1PN lab**. It integrates the Sun, eight planetary point masses and Moon with all-included-body order-reduced Einstein–Infeld–Hoffmann 1PN dynamics and a paired Newtonian control. Choose 1, 5, 10 or 20 years; refine the RK4 step; inspect ideal relative surface clocks and a limited Solar Shapiro-delay diagnostic; export paired trajectories. See [the equations, validation and limitations](RELATIVITY_REPORT.md).

This is a weak-field 1PN model, not a full Einstein-field solver or JPL ephemeris replacement. Sparse JPL comparisons measure actual discrepancies; the Moon differs by about 17.8 km at one year and 215 km at ten years. The isolated Mercury precession benchmark gives 42.9798 arcseconds/century (analytic 42.9807). Live browser execution remains unverified; model and worker calculations are tested under Node.

Starting data and independent comparison epochs: [relativity-horizons.json](data/relativity-horizons.json). Saved checks: [relativity-validation.json](data/relativity-validation.json). Refresh data sequentially with `python fetch-relativity.py`; run checks with `node validate-relativity.cjs` after building. Surface-clock estimates and signal-delay approximations have separate, documented scopes.

### Display update: 25 October 2026

- **Milky Way → Show the bend**: line-of-nodes camera, warped rings, gold cross-section and grey flat-plane reference. The preset labels its 5× vertical display scale; physical readouts are unchanged.
- **Sun & all planets**: all-body paths by default; separate 3-year inner and 84-year outer presets; reference lines show forward travel past the following camera.
- **Space & Time**: circular-clock default, Earth orbit presets that start playback, and all-planet 1PN playback after calculation. Galactic translation belongs to the winding-path view, not the barycentric 1PN lab.
- **Six-page report**: newly drawn labelled top-down map with A/today, B/future, C/later future, arms, centre, Solar orbit and warp inset. This is explicitly a conceptual diagram. Rebuild with `python illustrated-report.py` after the numerical exports; `report-galaxy.py` creates the reusable map.

Scene checks include projected warp visibility and all-body/reference motion. They are not live browser screenshots or WebGL validation.

### Visible warped disk revision

The opening Galactic view now uses a labelled 5x vertical display and follows the warp line of nodes as time advances. A height-coloured outer surface (blue below, amber above) makes the bend visible where the artist reconstruction is faint. This is a structural overlay, not measured stellar colour or density. The edge-on surface no longer fades to zero based on the orientation of an unwarped plane. Uncheck the height overlay for artwork alone, choose 1x for true proportions, or drag to release the camera-follow mode. The cross-section uses physical parsec heights from the same warp equation.
