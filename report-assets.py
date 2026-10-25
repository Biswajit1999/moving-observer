"""Reproduce the supplied discussion-note figure crops and copy the dated project plot.
Crop rectangles are pixel coordinates of the original embedded page, not regenerated art.
"""
from pathlib import Path
from pypdf import PdfReader
import shutil, hashlib, json
ROOT=Path(__file__).resolve().parent
dest=ROOT/'output/figures';dest.mkdir(parents=True,exist_ok=True)
page=PdfReader(ROOT/'discussion-note.pdf').pages[0].images[0].image
assert page.size==(1055,1491)
for name,box in [('Original_Galactic_Concept',(479,161,1027,695)),('Original_Discovery_Sky',(37,866,540,1285))]:
    page.crop(box).save(dest/(name+'.png'))
source=ROOT.parent/'finding-earth-2/results/figures/hz_diagram.png'
shutil.copy2(source,dest/'Finding_Earth_2_HZ.png')
(dest/'provenance.json').write_text(json.dumps({
 'original_figures':{'source':'discussion-note.pdf','sha256':hashlib.sha256((ROOT/'discussion-note.pdf').read_bytes()).hexdigest(),'type':'cropped original conceptual galaxy illustration and historical discovery-sky screenshot; underlying image provenance not independently established'},
 'hz_plot':{'source':'https://github.com/Biswajit1999/finding-earth-2/blob/14828643bdd9342eeb2aff65c5dd32eef31dd2c3/results/figures/hz_diagram.png','sha256':hashlib.sha256(source.read_bytes()).hexdigest(),'analysis_utc':'2026-08-28T20:00:42Z','shown_planets':5767,'catalogue_confirmed':6354,'note':'Original plot retained; data-availability subset, not complete catalogue. Similarity index is not life probability.'}
},indent=2),encoding='utf-8')
