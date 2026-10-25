## 18. Coupled relativistic Solar System: the 1PN dynamics lab

<div id="report-relativity"></div>

The new lab integrates the **Sun, eight planetary point masses and the Moon together**. Each included body acts on every other included body. A paired Newtonian integration starts from exactly the same state. The relativistic branch uses the **order-reduced Einstein–Infeld–Hoffmann first post-Newtonian (1PN) equations**, rather than adding only a Solar precession term to prescribed Keplerian orbits. These equations retain corrections of order $v^2/c^2$ and $GM/(rc^2)$ in weak fields and slow motion.

This is a coupled relativistic approximation appropriate to this educational Solar System lab. It is **not a numerical solution of the full Einstein field equations**, a replacement for JPL ephemerides or a spacecraft-navigation product. The GR clock diagrams elsewhere in the project and this dynamical integration have different purposes and assumptions.

### Starting data, coordinates and represented bodies

The frozen JPL Horizons queries return geometric barycentric positions and velocities at **JD 2461041.5 TDB**, labelled 2026.0, with independent comparison states 30 days, one Julian year and ten Julian years later. Coordinates use the J2000 ecliptic orientation with the Solar System barycentre as origin; vectors are uncorrected for light time. Units are AU and AU/day; one AU is 149,597,870.7 km. The input files preserve the request URLs, returned headers, body identifiers and response hashes. The returned planetary states identify DE441 as their source; the model does not claim to reproduce DE441's full force model.

Earth and Moon are separate bodies with separate mass parameters. Mars and the outer planets are represented by their **system barycentres and total system mass parameters**; their individual satellites are not integrated. Planetary parameters follow the table in [Park et al. (2021)](https://ssd.jpl.nasa.gov/doc/Park.2021.AJ.DE440.pdf). Pluto, asteroids and Kuiper-belt objects are omitted. This lab uses Solar System barycentric coordinates; Galactic translation and Galactic tidal forces are not added to these equations or clock rates.

### Equations implemented

Let $\mu_i=GM_i$, $\mathbf d_{ij}=\mathbf r_i-\mathbf r_j$, $r_{ij}=|\mathbf d_{ij}|$, and define the external positive potential and Newtonian acceleration:

$$
U_i=\sum_{k\ne i}\frac{\mu_k}{r_{ik}},\qquad
\mathbf a_i^N=-\sum_{j\ne i}\frac{\mu_j\mathbf d_{ij}}{r_{ij}^3}.
$$

For GR parameters $\beta=\gamma=1$, the order-reduced equation used here is:

$$
\mathbf a_i=\mathbf a_i^N+\frac{1}{c^2}\sum_{j\ne i}\mu_j
\left\{\frac{\mathbf d_{ij}}{r_{ij}^3}A_{ij}
+\frac{\mathbf d_{ij}\cdot(4\mathbf v_i-3\mathbf v_j)}{r_{ij}^3}(\mathbf v_i-\mathbf v_j)
+\frac{7\mathbf a_j^N}{2r_{ij}}\right\},
$$

$$
A_{ij}=4U_i+U_j-v_i^2-2v_j^2+4\mathbf v_i\cdot\mathbf v_j
+\frac{3}{2}\left(\frac{\mathbf d_{ij}\cdot\mathbf v_j}{r_{ij}}\right)^2
+\frac{1}{2}\mathbf d_{ij}\cdot\mathbf a_j^N.
$$

Replacing accelerations inside the $1/c^2$ terms by their Newtonian values discards terms beyond the retained 1PN order. This is an explicit order reduction, not an iterative exact-GR solution. The equations follow the published point-mass PPN formulation summarized in [Park et al., section 3.1](https://ssd.jpl.nasa.gov/doc/Park.2021.AJ.DE440.pdf). [Tamayo et al.](https://doi.org/10.1093/mnras/stz2877) and the [REBOUNDx documentation](https://reboundx.readthedocs.io/en/stable/effects.html) distinguish all-body 1PN dynamics from dominant-central-body approximations. The project's implementation is independently written from the equations; it does not embed REBOUNDx source code.

Fixed-step classical RK4 integrates the velocity-dependent equations. The standard step is **0.0625 day**, with **0.03125 day** available for refinement. RK4 is not symplectic. The browser computes in a background worker, saves paired states every two days and retains the exact end epoch. Displayed saved states are not precision dense-output ephemerides. The lab accepts spans of 1, 5, 10 or 20 Julian years; the frozen external comparisons extend only to ten years. A longer display span does not imply a validated long-term prediction.

### What the checks actually show

The isolated test-particle limit recovers the Schwarzschild weak-field acceleration. A ten-year two-body Mercury test fits the difference of relativistic and Newtonian apsidal angles and returns **42.9798 arcseconds per century**, compared with **42.9807** from the analytic 1PN prediction:

$$
\Delta\omega_{\rm orbit}=\frac{6\pi GM_\odot}{a(1-e^2)c^2}.
$$

This is an isolated dynamical benchmark; it is not the full Solar System's total observed precession. At 30 days in the ten-body model, Mercury's heliocentric relativistic/Newtonian position difference is approximately **8.825 km**, while halving the integration step changes its relativistic position by **0.000085 km**. For the Moon, the same refinement changes the heliocentric position by about **0.00239 km**. These are numerical consistency checks, not physical uncertainty bounds.

| Body | Error vs JPL at 30 days | At 1 Julian year | At 10 Julian years |
|---|---:|---:|---:|
| Mercury | 0.00350 km | 0.0666 km | 0.324 km |
| Earth | 0.0164 km | 0.204 km | 1.852 km |
| Jupiter system | 0.00133 km | 0.257 km | 17.007 km |
| Moon | 1.341 km | 17.754 km | 215.382 km |

Errors are instantaneous **heliocentric 3D position discrepancies at the saved epochs**, using identical initial states. They do not bound every epoch or every observable. The growing lunar discrepancy reflects omitted physics as well as integration error. Complete results, including all bodies and step-refinement checks, are in `data/relativity-validation.json`. Additional tests check Newtonian force balance, rotational covariance, $1/c^2$ scaling, finite outputs, worker completion and rejection of unsupported settings. No fresh browser rendering or browser-worker execution has been verified in this environment; the worker algorithm is executed directly under Node for validation.

### Relative clock rates

The lab gives a separate **leading weak-field estimate** for ideal nonrotating spherical surface clocks, using each body's centre velocity and external potential, plus its spherical self-potential:

$$
q_i=\frac{U_i+GM_i/R_i+v_i^2/2}{c^2},\qquad
\frac{d\tau_i}{dt}\simeq1-q_i,\qquad
\frac{d(\tau_i-\tau_E)}{dt}\simeq q_E-q_i.
$$

The instantaneous readout is microseconds per coordinate day relative to the model Earth clock. The cumulative difference is integrated using trapezoidal quadrature at each dynamics step. It is not a UTC/TT time-transfer solution. Surface rotation, location, tidal potential, atmospheric effects and non-spherical self-gravity are omitted. The Sun's clock, for example, uses its adopted photospheric radius; these readings are not clocks located at singular point-mass centres. The approximation is lower order than a complete relativistic ephemeris/time-transfer treatment; see [Ashby (2003)](https://doi.org/10.12942/lrr-2003-1).

### Light propagation: a limited Solar Shapiro term

For non-occulted Earth-to-body geometry, the optional readout computes the leading one-way delay in the field of a static spherical Sun:

$$
\Delta t_{\rm Shapiro}=\frac{2GM_\odot}{c^3}\ln\left(\frac{r_E+r_T+R}{r_E+r_T-R}\right).
$$

Here the endpoints are instantaneous body-centre positions; $R$ is their geometric separation and $r_E,r_T$ are their distances from the Sun. Rays whose straight segment intersects the adopted Solar radius are excluded. This readout is a diagnostic approximation: it omits moving endpoints, retarded positions, light deflection, other bodies' delays and full null-geodesic ray tracing. It does not turn the spatial display into an apparent sky image.

### Tutorial and limitations

Open **Space & Time → Relativistic Solar System · coupled 1PN lab**. Choose a span and integration step, then **Calculate both models**. When the calculation finishes, press Play or scrub the saved epochs. Use the inner-system, all-planet or Earth–Moon view; drag to orbit and scroll to zoom. Select a readout body to inspect the positional difference, relative surface-clock rate and accumulated clock offset. Export the paired CSV for numerical inspection. The coordinate origin is Sun-centred in the planetary views, at the Solar System barycentre in the all-body barycentric view, and Earth-centred in the lunar view; the integrator itself remains barycentric.

Body markers are enlarged; coordinates use equal AU scales. Grey tracks show the Newtonian comparison. At true scale the relativistic and Newtonian paths mostly overlap: the numerical difference is the useful observable. No artificial precession or difference magnification is silently applied.

The model omits spin/frame dragging, Solar and planetary quadrupoles, other satellites as separate bodies, lunar rotation and tides, asteroids, Pluto, Kuiper-belt perturbations, 2PN and higher corrections, gravitational radiation, a self-consistent evolving spacetime metric and full photon ray tracing. It uses pre-fitted starting data without refitting parameters to observations. These omissions prevent calling it a complete relativistic ephemeris or a full numerical-relativity Solar System. The delivered capability is a reproducible, coupled **all-included-body 1PN lab**, with measured limits and a Newtonian control.
