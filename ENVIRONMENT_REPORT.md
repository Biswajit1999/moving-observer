## 16. Are we entering a denser region, and how fast do other stars move?

<div id="report-environment"></div>

**Two different distances matter.** Galactic radius R is the distance from the centre measured in the disk; z is height above its midplane. Moving outward in R generally reduces disk star density. Moving farther from the plane also reduces it, while changing the mixture of thin-disk, thick-disk and halo populations. Neither coordinate alone specifies an individual star's velocity. The displayed synthetic examples A, B and C are invented orbit comparisons, not catalogue stars. They are off by default; only a selected example appears when enabled.

### A transparent density scenario

The new panel uses a smooth double-exponential number-density profile, with thin/thick radial lengths 2.6/3.6 kpc, heights 0.3/0.9 kpc and midplane thick/thin ratio 0.12. These structural choices come from the M-dwarf analysis of [Jurić et al. (2008)](https://arxiv.org/abs/astro-ph/0510520). We adopt the project's radius 8.2 kpc and initial height 0.020 kpc, and normalize the profile there:

$$
f(R,z)=\exp\left[-\frac{R-8.2}{2.6}-\frac{|z|}{0.3}\right]
+0.12\exp\left[-\frac{R-8.2}{3.6}-\frac{|z|}{0.9}\right],\qquad
\frac{n(R,z)}{n_0}=\frac{f(R,z)}{f(8.2,0.020)}.
$$

[Reylé et al. (2021)](https://doi.org/10.1051/0004-6361/202140985) listed 373 stars within 10 pc, including white dwarfs, separately from brown dwarfs and planets. This historical count supplies an illustrative normalization of 0.0890 stars per cubic parsec. It is not a newly measured 2026 census. Applying one tracer population's spatial profile to the whole stellar count is an explicit simplification; the count display is a scenario with no calibrated uncertainty interval.

$$
n_0=\frac{373}{(4\pi/3)(10\ \mathrm{pc})^3},\qquad
N_{10}(R,z)\simeq\frac{4\pi}{3}(10\ \mathrm{pc})^3n(R,z).
$$

Along the current 250 Myr Solar integration, sampled every 0.5 Myr, R stays between approximately 8.1996 and 8.2047 kpc. The Sun does not approach the bulge. Its vertical oscillation changes this smooth density to approximately **0.784–1.063 times** the starting value, or **292–397 scenario stars** in an instantaneous 10 pc sphere. At the screenshot epoch of +34.9 Myr, the model gives about **0.949 times** the starting density. These values do not count new arrivals, discovered planets, or distinct stars encountered over the full journey.

This profile is independent of the force model and the artwork. It omits spiral-arm enhancements, clusters, the bar, halo, warp-relative density changes, stellar evolution and migration. It cannot identify a reliable future arm-crossing date. A denser patch in the picture is not a measured star-count map. The 3–16 kpc comparison range is educational; extrapolation into the bulge is deliberately excluded.

### How many stars might enter a neighbourhood?

For a uniform, stationary statistical population, the approximate incoming crossing rate of a sphere of radius b is:

$$
\dot N_{\rm in}\simeq n\pi b^2\langle v_{\rm rel}\rangle.
$$

Using the historical normalization, b = 10 pc and an **assumed** mean relative speed of 30 km/s gives an expectation of approximately **0.086 incoming crossings in 100 years**. Similar outgoing flux balances it in this stationary approximation. This is not a prediction of a particular arrival, independent unique targets or new discoveries. The relevant speed is relative to nearby stars; inserting the Sun's 233 km/s Galactic speed would treat those stars as stationary and answer the wrong question.

### Speed depends on the potential and the stellar population

The circular speed is a property of an adopted potential, not a universal speed for every star:

$$
v_c^2(R)=R\left.\frac{\partial\Phi}{\partial R}\right|_{z=0},\qquad
\Omega=\frac{v_c}{R},\qquad T=\frac{2\pi R}{v_c}.
$$

| Radius from centre | Existing model circular speed | Existing model orbital period |
|---|---:|---:|
| 5 kpc | 221.8 km/s | 138.5 Myr |
| 8.2 kpc | 233.0 km/s | 216.2 Myr |
| 12 kpc | 244.9 km/s | 301.0 Myr |
| 16 kpc | 255.0 km/s | 385.4 Myr |

**A limitation exposed by this comparison:** the existing illustrative force model rises outward. It is not a current fit to the observed rotation curve. [Põder et al. (2023)](https://doi.org/10.1051/0004-6361/202346474) inferred 233 ± 7 km/s near the Sun and a curve consistent with flatness across their 5–14 kpc fit. A [2026 Cepheid study](https://doi.org/10.1093/mnras/stag011) reports roughly 236 km/s near the Sun and 230 km/s around 16 kpc, with radial structure. These tracer-dependent results must not be replaced by the model values in the table. Future orbit predictions require a better constrained potential and uncertainty propagation.

Farther out, stars can take longer to go around even when their speeds in km/s are similar: the circumference is larger. Farther above the plane, older populations typically have larger random motions and can rotate more slowly on average. There is no single speed-height law. Our height slider therefore changes density, while the speed readout explicitly remains the **midplane circular-speed reference**, not the velocity of a star at that height. See the population analysis in [APOGEE orbit-superposition work](https://doi.org/10.1051/0004-6361/202453305).

**Tutorial:** in Milky Way, scroll to **Stellar environment · model**. Play the Galactic clock and follow the density history. Expand **Compare radius, height & speed** to change R and z independently. Export CSV on the Galactic clock to obtain the density scenario alongside positions. The model-versus-observation distinction is part of the result, not an uncertainty to hide.

## 17. More physical 3D clocks and clearer planetary paths

The one-click **Show winding paths · 3D tour** starts a three-year inner-system trajectory in a frame translating at 98% of the Sun's initial velocity. This resolves winding motion while retaining equal AU scales on all axes. It is a change of reference frame, not a slower Sun or a stretched orbit. Select **Galactic frame · full Solar travel** to restore the full displacement. The other planets can be restored with **Bodies to show**. Manual dragging stops the 30-second camera tour.

$$
\mathbf x'_i(t)=\mathbf x_i(t)-\mathbf v_{\rm frame}(t-t_0),\qquad
\mathbf v_{\rm frame}=0.98\,\mathbf v_{\odot,0}.
$$

The optional lunar example adds one Moon to the eight planets and Sun, for ten displayed bodies. It uses a circular 384,400 km orbit, 27.321661-day period and 5.145° inclination; the phase is illustrative. These scales are documented in [NASA's Moon fact sheet](https://nssdc.gsfc.nasa.gov/planetary/factsheet/moonfact.html). Earth and Moon offsets preserve the model Earth–Moon barycentre. Eccentricity, precession, perturbations and other moons are omitted. The **Earth & Moon close-up** resolves a lunar path that is nearly indistinguishable from Earth's on the all-planet Galactic scale.

### Exterior spherical spacetime, with explicit clock references

Space & Time now offers a textured 3D Earth/body, an inverse-square field display, and an exterior Schwarzschild spatial slice. The circular-clock mode includes gravity and ideal orbital motion. Let $\mu=GM$, $r_s=2\mu/c^2$, and r be the areal radius outside the body's surface. For an isolated nonrotating spherical body:

$$
\left(\frac{d\tau}{dt}\right)_{\rm held}=\sqrt{1-\frac{2\mu}{rc^2}},\qquad
\left(\frac{d\tau}{dt}\right)_{\rm circular}=\sqrt{1-\frac{3\mu}{rc^2}},\qquad
T=2\pi\sqrt{\frac{r^3}{\mu}}.
$$

Here t is the Schwarzschild time referenced to infinity; a held clock needs support. A circular geodesic clock is in free fall even though the displayed Newtonian field magnitude is nonzero. Rates relative to a stationary surface clock use the ratio of the two lapse factors, not the difference of potentials alone. The local animation clock spans 24 hours; its acceleration setting specifies physical seconds per playback second. It is separate from the Galactic and century clocks.

For a spherical, nonrotating Earth, the 400 km circular preset has an approximately **92.4-minute period** and **−24.7 microseconds/day** relative to the stationary surface clock. The 20,200 km preset gives **+38.5 microseconds/day**. This reproduces the scale and sign of the familiar GNSS result described by [NIST](https://www.nist.gov/atomic-clocks/a-powerful-tool-for-science/putting-einstein-test); it is not a navigation-grade GPS correction. Earth's rotation, oblateness, other bodies, eccentricity and signal propagation are omitted. See [Ashby (2003)](https://doi.org/10.12942/lrr-2003-1) for the fuller relativistic timekeeping problem.

The spatial-slice option embeds the constant-time equatorial exterior geometry in Euclidean 3D:

$$
Z(r)-Z(R)=2\sqrt{r_s}\left[\sqrt{r-r_s}-\sqrt{R-r_s}\right],\qquad
1+\left(\frac{dZ}{dr}\right)^2=\frac{1}{1-r_s/r}.
$$

Only radii outside the physical body are drawn. The embedding height is magnified by the factor shown on screen; the unscaled geometry obeys the radial metric identity. Z is an embedding coordinate, not a physical downward direction. This depicts a spatial slice, not all of spacetime, and marbles rolling on it would not reproduce geodesics. The older softened potential diagram remains a separately labelled analogy. See the derivation in [University of Bath relativity notes](https://people.bath.ac.uk/pystab/PH30101_notes.pdf).

**Tutorial:** open **Space & Time**, select Earth, and choose **3D body, field & clock**. Select **Earth · 400 km**, then Play to follow the ideal circular clock. Compare **Earth · 20,200 km** and the sign of **Gain vs stationary surface**. Switch to **Schwarzschild spatial slice** and read the magnification label. **Diagram height only** never changes the numerical clock rates. **Orbit the 3D view** changes the camera, not the physics.

### Share the question

Download the [two-page project brief](https://biswajit1999.github.io/moving-observer/output/pdf/Moving_Observer_Brief.pdf) and [24-second scientific model animation](https://biswajit1999.github.io/moving-observer/output/video/Moving_Observer_3D_Tour.mp4). The animation is generated from the numerical modules, not recorded from the website. It labels its reference frames, scale changes between shots and illustrative lunar assumptions.

