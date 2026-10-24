# Gaia DR3 nearby-source snapshot

Retrieved 24 October 2026 from the ESA Gaia Archive TAP synchronous service:
https://gea.esac.esa.int/tap-server/tap/sync

Catalogue: gaiadr3.gaia_source, Gaia DR3, https://doi.org/10.5270/esa-qa4lep3.
The exact ADQL query is in `gaia-query.adql`; the unmodified CSV response is `gaia-nearby.csv`. The query has no TOP clause and returned 1,387 rows. Source identifiers are strings to preserve 64-bit integers. The SHA-256 of the response is saved in `research-results.json` and verified by the test suite. The catalogue epoch is J2016.0; results are propagated to Julian years 2026.0 and 2126.0.

Selection: parallax >= 50 mas (nominal 20 pc), parallax_over_error > 20, radial_velocity IS NOT NULL, ruwe < 1.4, visibility_periods_used >= 10. These cuts do not establish completeness or exclude every binary. Radial-velocity availability biases this sample; faint and problematic sources are absent. No missing radial velocity is replaced with zero. The frozen sample is retained at both future epochs, so incoming sources from outside 20 pc are not counted. It is not a Galactic census or a list of known exoplanet hosts.

Units: ra/dec in degrees, parallax and positional uncertainties in mas, pmra/pmdec in mas/year (pmra includes cos(dec)), radial_velocity in km/s, G-band magnitude in the Gaia system. Ten correlation coefficients and five standard errors supply the full five-parameter astrometric covariance. RV errors are treated as independent Gaussian errors; Gaia does not supply their correlations with the astrometric solution here. Cross-source correlations, zero-point/systematic errors, unresolved binaries and photometric variability are not sampled. No parallax zero-point correction is applied; the sample is high-parallax and high signal-to-noise, but precision claims must still account for systematics.

This work has made use of data from the European Space Agency (ESA) mission Gaia (https://www.cosmos.esa.int/gaia), processed by the Gaia Data Processing and Analysis Consortium (DPAC, https://www.cosmos.esa.int/web/gaia/dpac/consortium). Funding for the DPAC has been provided by national institutions, in particular the institutions participating in the Gaia Multilateral Agreement.

## Retrieval

`python fetch-gaia.py` at the repository root retrieves the query again, with no credentials. It overwrites the snapshot only when explicitly run. Ordinary builds and tests use the checked-in snapshot, require no network, and verify reproducibility. An updated catalogue response may change results; regenerate and review the result tables before publishing a changed snapshot.
