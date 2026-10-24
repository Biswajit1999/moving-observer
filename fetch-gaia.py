"""Explicit catalogue refresh; ordinary builds use the frozen local snapshot."""
import csv
import io
from pathlib import Path
import urllib.parse
import urllib.request

root = Path(__file__).resolve().parent
query = (root / 'data/gaia-query.adql').read_text()
url = 'https://gea.esac.esa.int/tap-server/tap/sync?' + urllib.parse.urlencode(
    {'REQUEST': 'doQuery', 'LANG': 'ADQL', 'FORMAT': 'csv', 'QUERY': query})
with urllib.request.urlopen(url, timeout=60) as response:
    data = response.read()
rows = list(csv.DictReader(io.StringIO(data.decode('utf-8'))))
if not rows or 'source_id' not in rows[0] or 'pmra_pmdec_corr' not in rows[0]:
    raise ValueError('Unexpected archive response; snapshot preserved')
(root / 'data/gaia-nearby.csv').write_bytes(data)
print(f'Retrieved {len(rows)} sources. Run npm run research and review changed results.')
