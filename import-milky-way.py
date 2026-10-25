"""Parse the frozen CDS Reid+2019 source table; retain uncertainties and provenance."""
from pathlib import Path
import re, math, json, hashlib
ROOT=Path(__file__).resolve().parent/'data/milky-way'
M=[[-.0548755604162154,-.8734370902348850,-.4838350155487132],[.4941094278755837,-.4448296299600112,.7469822444972189],[-.8676661490190047,-.1980763734312015,.4559837761750669]]
rows=[]
pattern=re.compile(r'^(G\S+)\s+(.*?)\s*(\d{1,2})\s+(\d{1,2})\s+(\d+\.\d+)\s+([+-]\d+)\s+(\d+)\s+(\d+\.\d+)\s+(\d+\.\d+)\s+(\d+\.\d+)\s+([+-]?\d+\.\d+)\s+(\d+\.\d+)\s+([+-]?\d+\.\d+)\s+(\d+\.\d+)\s+([+-]?\d+)\s+(\d+)\s+(\S+)\s+(.+)$')
for line in (ROOT/'table1.dat').read_text().splitlines():
    m=pattern.match(line);assert m,line
    name,alias,hh,mm,ss,dd,dm,ds,plx,err,pmE,eE,pmN,eN,rv,eRV,arm,refs=m.groups()
    ra=(float(hh)+float(mm)/60+float(ss)/3600)*math.pi/12
    dec=(-1 if dd.startswith('-') else 1)*(abs(float(dd))+float(dm)/60+float(ds)/3600)*math.pi/180
    u=[math.cos(dec)*math.cos(ra),math.cos(dec)*math.sin(ra),math.sin(dec)]
    g=[sum(a*b for a,b in zip(row,u)) for row in M]
    plx=float(plx);err=float(err);d=1/plx
    def pos(distance):return [-distance*g[1],-8.2+distance*g[0],.020+distance*g[2]]
    rows.append(dict(name=name,alias=alias.strip(),arm=arm,parallaxMas=plx,sigmaMas=err,position=pos(d),distanceKpc=d,positionNear=pos(1/(plx+err)),positionFar=pos(1/(plx-err)) if plx>err else None,pmEastMasYr=float(pmE),pmNorthMasYr=float(pmN),vLSRKmS=float(rv),references=refs))
assert len(rows)==199 and len({(r['name'],r['alias']) for r in rows})==199
out={'source':'https://cdsarc.cds.unistra.fr/viz-bin/cat/J/ApJ/885/131','paper':'https://arxiv.org/abs/1910.03357','retrieved':'2026-10-25','sha256':hashlib.sha256((ROOT/'table1.dat').read_bytes()).hexdigest(),'coordinates':'kpc; centre origin; Sun=(0,-8.2,+0.020); x opposite Galactic longitude 90 deg. Nominal inverse-parallax positions; not propagated to 2026.','uncertainty':'Endpoints use 1/(parallax +/- sigma); not posterior credible intervals. No covariance or selection correction.','rows':rows}
(ROOT/'masers.json').write_text(json.dumps(out,indent=2)+'\n',encoding='utf-8')
print('Parsed',len(rows),'measured regions; parallax S/N >= 5:',sum(r['parallaxMas']/r['sigmaMas']>=5 for r in rows))
