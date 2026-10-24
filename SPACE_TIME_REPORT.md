## 13. The Sun moves too: eight planets and a shared centre of mass

The Sun is not fixed at the centre of the Solar System. Its planets pull on it, and it moves around the system's barycentre. This is an established effect, explained by [NASA's barycentre introduction](https://spaceplace.nasa.gov/barycenter/en/). The motion is generally a changing loop, not a perfect circular helix. It is also different from the Sun's vertical oscillation around the Galactic midplane.

The new view computes heliocentric positions for **all eight planets**. Jupiter, Saturn, Uranus and Neptune use saved [NASA/JPL Horizons](https://ssd.jpl.nasa.gov/horizons/manual.html) positions and velocities, sampled every quarter Julian year over 2026–2126 and interpolated with cubic Hermite polynomials. The inner four planets retain [JPL's approximate Table 2a elements](https://ssd.jpl.nasa.gov/planets/approx_pos.html). Thin orbit guides for all planets use approximate elements (including Table 2b corrections for the outer planets); they indicate orbital scale rather than an exact ephemeris track. The Earth marker represents the Earth–Moon barycentre, and giant-planet positions and masses represent their planetary systems. The Solar reflex position is reconstructed using gravitational mass parameters from [JPL's DE440/DE441 work](https://ssd.jpl.nasa.gov/doc/Park.2021.AJ.DE440.pdf):

$$
\mathbf r_{\odot,B}(t)=-\frac{\sum_i\mu_i\,\mathbf r_{i,\odot}(t)}{\mu_\odot+\sum_i\mu_i},\qquad
\mathbf r_{i,B}=\mathbf r_{\odot,B}+\mathbf r_{i,\odot}.
$$

Here $\mu=GM$, B denotes the barycentric frame, and the sum includes the eight planetary systems. Pluto, asteroids and other small bodies are omitted. This construction preserves the centre-of-mass identity for the included bodies; it does not make the approximate orbital elements a full N-body ephemeris.

**Independent numerical check:** at six between-node dates per outer planet, the largest differences from separate Horizons requests were 611.1 km for Jupiter, 59.1 km for Saturn, 42.6 km for Uranus and 41.7 km for Neptune. These are sampled interpolation errors, not a proven bound at every date. At six further dates, the reconstructed Sun differed from the Horizons Solar barycentric position by at most 161.8 km (0.024% of a Solar radius). The omitted small bodies and approximate inner-planet inputs remain limitations. Saved requests, values and comparison code are supplied with the project; ordinary use works offline.

**How to see it:** open **Sun & all planets**. The overview shows all eight orbits. Choose **Paths through the Galaxy** for the sum of planetary orbits, Solar reflex motion and common Galactic translation. Choose **Sun's barycentric wobble** for a 30-year close-up, with the Sun's radius shown to scale. The other planets lie outside that close-up; the cyan marker is the barycentre. Path histories of 3, 12 and 84 years serve different planets, while the overall clock remains 2026–2126. Neptune needs approximately 165 years for a full orbit, so its century path does not complete a revolution.

On the Galactic view, **Reveal Galactic wobble** selects an edge-on camera, starts the long clock and magnifies every vertical coordinate by a labelled factor of five. The numerical distances retain their true values. Return to **True proportions (1×)** for an undistorted view. This exposes the integrated Solar oscillation without inventing an annual Galactic helix. The warp remains a separate kinematic illustration.

## 14. Space & Time: what does a gravity grid mean?

<div id="report-space-time"></div>

A body does not sit in a literal downward dent in space. The grid in this simulation is an explanatory picture of gravitational potential, drawn as height so that variations are visible. A real relativistic description involves spacetime geometry, with both spatial and temporal components. The connection between gravity and clock rates is experimentally established; see [NIST's explanation of atomic-clock tests](https://www.nist.gov/atomic-clocks/a-powerful-tool-for-science/putting-einstein-test) and [Einstein Online](https://www.einstein-online.info/en/explandict/time-dilation/).

Outside slowly moving bodies in a weak field, the Newtonian potential and the leading clock-rate terms are:

$$
\Phi(\mathbf r)=-\sum_i\frac{GM_i}{|\mathbf r-\mathbf r_i|},\qquad
\frac{d\tau}{dt}\simeq1+\frac{\Phi}{c^2}-\frac{v^2}{2c^2}.
$$

The displayed numerical readouts deliberately use **one isolated spherical body and a stationary clock**, so $v=0$. The comparison is to a clock at rest infinitely far from that body, with the potential chosen to vanish at infinity. The approximate clock lag per day is therefore:

$$
\Delta t_{\rm day}\simeq\frac{GM}{rc^2}\,(86400\ \mathrm{s}),\qquad
g(r)=\frac{GM}{r^2},\qquad r\geq R_{\rm body}.
$$

This does not give the total rate of a real clock on Earth or a moving spacecraft. Those comparisons require the Sun's field, other bodies, rotation, orbital speed, a defined reference clock and propagation effects. Planetary masses and mean radii are sourced from JPL/NASA; the isolated Earth calculation uses Earth's mass alone, excluding the Moon. The giant-planet mass parameters include their moons, an approximation for these educational surface estimates.

The drawn wells use softened distances and a logarithmic height transform to remain visible and finite. That plotted depth has arbitrary units. Changing **Visual depth only** changes the drawing, never gravity or the clock calculation. The overview projects the moving Solar System into the ecliptic plane; selecting a body opens a normalized local well with horizontal distances in that body's radii. Neither the mesh nor the prescribed trajectories solve Einstein's field equations, light bending or gravitational-wave emission.

**Tutorial:** select **Space & Time**, then choose the Sun or a planet. Move **Test-clock radius** from one to ten body radii. Gravity falls by a factor of 100 and the isolated gravitational clock lag by a factor of ten. Compare Earth and Jupiter at the same radius multiple. Use the overview to see where the moving bodies contribute to the potential diagram. Export CSV to obtain the numerical comparisons for every body.

## 15. Quantitative results in plain language

<!--EXTENSION_RESULTS-->

<div class="plain-answer"><p><strong>The main answer:</strong> moving through the Galaxy changes our surroundings over long times, but nearby stars move too. Over a century, the tested instrument improvement changes the selected sample's accessibility far more than stellar motion does. A small subset of targets near a threshold can gain or lose access. The Sun's wobble and the Galaxy's warp are real kinds of motion; adding them to a picture does not by itself imply additional exoplanet discoveries.</p></div>

The 10- and 100-year comparisons use the same nominal catalogue experiment as section 11. The 1,000-year row is a **sensitivity extrapolation**, with no new uncertainty propagation or binary integration. It must not be treated as a reliable millennium forecast. The sample remains frozen, so the table does not count newly entering stars. These values describe one hypothetical injected planet distribution and instrument setting, not the actual planets present around the selected sources.

The physical scale comparison explains why the Sun can look straight in a short trail. Its century motion spans thousands of AU, while barycentric deviations and the departure from a straight tangent are tiny fractions of an AU. Making those small motions visible requires a close-up or a clearly labelled scale change. All planets inherit the common Solar translation, while retaining different orbital periods and orientations.

### Questions the community can answer without an email

1. **Is the model's question well posed?** What prior work most directly addresses century-scale changes in accessibility for a fixed nearby sample?
2. **Which targets deserve closer study?** Do the strongest changes survive binary modelling, parallax systematics and a realistic observing budget?
3. **Is the effect useful?** What minimum gain in observing efficiency or information would justify waiting or using a second observer?
4. **Which simplification matters most?** Is the first priority the planet population, instrument noise, orbit uncertainty or scheduling?
5. **What would change the conclusion?** Supply a target, assumptions and a reproducible counterexample where motion has a substantial advantage.

Feedback and corrections can be recorded in the [public project discussion through GitHub issues](https://github.com/Biswajit1999/moving-observer/issues). No email or outreach is required. These questions invite scrutiny of the calculation; they do not assert that a new physical principle or a previously unstudied problem has been discovered.
