"""Optional independent coordinate/unit check. Requires astropy; no network calls."""
import csv
import json
from pathlib import Path
import astropy
from astropy.coordinates import SkyCoord
from astropy.time import Time
import astropy.units as u
import numpy as np

root = Path(__file__).resolve().parent
rows = list(csv.DictReader((root / 'data/gaia-nearby.csv').open()))
results = {r['source_id']: r for r in json.loads((root / 'data/research-results.json').read_text())['targets']}
col = lambda key: np.array([float(r[key]) for r in rows])
coords = SkyCoord(ra=col('ra')*u.deg, dec=col('dec')*u.deg,
                  distance=(1000/col('parallax'))*u.pc,
                  pm_ra_cosdec=col('pmra')*u.mas/u.yr,
                  pm_dec=col('pmdec')*u.mas/u.yr,
                  radial_velocity=col('radial_velocity')*u.km/u.s,
                  obstime=Time(2016, format='jyear'), frame='icrs')
position = coords.cartesian.xyz.to_value(u.pc)
velocity = coords.velocity.d_xyz.to_value(u.pc/u.yr)
errors = {}
for year, field in [(2026, 'd0'), (2126, 'd1')]:
    independent = np.linalg.norm(position + velocity*(year-col('ref_epoch')), axis=0)
    stored = np.array([results[r['source_id']][field] for r in rows])
    error = float(np.max(np.abs(independent-stored)))
    errors[str(year)] = error
    assert error < 1e-9, error
output = {'comparison': 'Independent ICRS spherical-to-Cartesian positions and velocities, then geometric rectilinear propagation',
          'astropy_version': astropy.__version__, 'sources': len(rows),
          'max_absolute_distance_difference_pc': errors,
          'scope': 'Coordinate and unit implementation only; no independent validation of binary, light-time, selection or instrument assumptions.'}
(root / 'data/astropy-comparison.json').write_text(json.dumps(output, indent=2)+'\n')
print(json.dumps(output, indent=2))
