"""Refresh saved outer-planet samples and independent midpoint checks from JPL.

Run manually with Python 3; normal builds/tests never require the network.
All epochs use TDB, AU/day, geometric heliocentric J2000 ecliptic vectors.
"""
import json
import time
import urllib.parse
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parent / 'data'
BASE = dict(format='json', EPHEM_TYPE="'VECTORS'", OBJ_DATA="'NO'",
            MAKE_EPHEM="'YES'", REF_PLANE="'ECLIPTIC'", REF_SYSTEM="'ICRF'",
            TIME_TYPE="'TDB'", OUT_UNITS="'AU-D'", VEC_TABLE="'2'",
            CSV_FORMAT="'YES'", VEC_CORR="'NONE'", CENTER="'500@10'")

def fetch(params):
    url = 'https://ssd.jpl.nasa.gov/api/horizons.api?' + urllib.parse.urlencode(params)
    for attempt in range(4):
        try:
            with urllib.request.urlopen(url, timeout=50) as response:
                data = json.load(response)
            if '$$SOE' not in data.get('result', ''):
                raise ValueError(str(data)[:500])
            return url, data
        except Exception:
            if attempt == 3:
                raise
            time.sleep(2)

if __name__ == '__main__':
    import sys
    only_midpoints = '--midpoints-only' in sys.argv
    for name, code in [('Jupiter', 5), ('Saturn', 6), ('Uranus', 7), ('Neptune', 8)]:
        base = dict(BASE, COMMAND=f"'{code}'")
        if not only_midpoints:
            url, data = fetch(dict(base, START_TIME="'JD2461041.5'", STOP_TIME="'JD2497566.5'", STEP_SIZE="'400'"))
            rows = data['result'].split('$$SOE')[1].split('$$EOE')[0].strip().splitlines()
            states = [[float(r.split(',')[0])] + [float(x) for x in r.split(',')[2:8]] for r in rows]
            assert len(states) == 401
            saved = dict(source='NASA/JPL Horizons', request=url, frame='J2000 ecliptic; geometric heliocentric', units='JD TDB; AU; AU/day', states=states)
            (ROOT / f'ephemeris-{name.lower()}.json').write_text(json.dumps(saved, indent=2)+'\n', encoding='utf-8')
        epochs = [.125, 12.125, 25.125, 50.125, 75.125, 99.875]
        dates = ' '.join(str(2451545+(26+t)*365.25) for t in epochs)
        url, data = fetch(dict(base, TLIST=f"'{dates}'"))
        (ROOT / f'horizons-{name.lower()}-midpoints-v7.json').write_text(json.dumps(dict(request=url, response=data), indent=2)+'\n', encoding='utf-8')
        print(name, 'saved', flush=True)
