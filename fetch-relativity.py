"""Freeze geometric barycentric Horizons states. One request at a time."""
import json,urllib.request,urllib.parse,time,hashlib
from pathlib import Path
ROOT=Path(__file__).resolve().parent
targets={'Sun':10,'Mercury':1,'Venus':2,'Earth':399,'Mars':4,'Jupiter':5,'Saturn':6,'Uranus':7,'Neptune':8,'Moon':301}
epoch=2451545+26*365.25
days=[0,30,365.25,3652.5]
out={'epochJDTDB':epoch,'frame':'J2000 ecliptic, ICRF orientation, Solar System barycentre','units':'AU, AU/day','days':days,'bodies':{},'retrieved':'2026-10-25','source':'https://ssd.jpl.nasa.gov/horizons/','note':'Outer planets and Mars are system barycentres represented as point masses. Earth and Moon are separate.'}
dest=ROOT/'data/relativity-horizons.json'
if dest.exists():out=json.loads(dest.read_text(encoding='utf-8'))
for name,code in targets.items():
 if name in out['bodies']:continue
 params={'format':'json','COMMAND':str(code),'CENTER':'500@0','MAKE_EPHEM':'YES','EPHEM_TYPE':'VECTORS','REF_PLANE':'ECLIPTIC','REF_SYSTEM':'ICRF','OUT_UNITS':'AU-D','VEC_TABLE':'2','VEC_CORR':'NONE','CSV_FORMAT':'YES','TLIST':"'"+' '.join(str(epoch+d) for d in days)+"'",'OBJ_DATA':'YES'}
 url='https://ssd.jpl.nasa.gov/api/horizons.api?'+urllib.parse.urlencode(params)
 with urllib.request.urlopen(url,timeout=90) as response:raw=response.read()
 result=json.loads(raw)['result'];assert '$$SOE' in result,result
 rows=[]
 for line in result.split('$$SOE')[1].split('$$EOE')[0].strip().splitlines():
  fields=[x.strip() for x in line.split(',')];rows.append([float(fields[0])]+[float(x) for x in fields[2:8]])
 assert len(rows)==len(days)
 out['bodies'][name]={'command':code,'url':url,'states':rows,'rawSha256':hashlib.sha256(raw).hexdigest(),'header':result.split('$$SOE')[0]}
 dest.write_text(json.dumps(out,indent=2),encoding='utf-8')
 print('Saved',name,flush=True);time.sleep(.5)
