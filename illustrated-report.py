"""Six-page illustrated discussion report. Reproduce after node export-illustrated.cjs.
Numerical figures are generated from the project modules; no browser screenshots.
"""
import json, math, runpy
from pathlib import Path
import numpy as np
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
from matplotlib.patches import Circle
from PIL import Image as PILImage
from reportlab.pdfgen import canvas
from reportlab.platypus import Paragraph, Table, TableStyle
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib import colors
from reportlab.lib.pagesizes import A4
from reportlab.lib.enums import TA_CENTER, TA_JUSTIFY
from pypdf import PdfReader

ROOT=Path(__file__).resolve().parent; TMP=ROOT/'tmp/illustrated'; TMP.mkdir(parents=True,exist_ok=True)
D=json.loads((TMP/'data.json').read_text(encoding='utf-8'))
W,H=A4;M=38;CW=W-2*M;GAP=20;COL=(CW-GAP)/2
BLUE='#17476b';TEAL='#267b89';GOLD='#bd8730';INK='#1d303f';GRAY='#536877'
plt.rcParams.update({'font.family':'DejaVu Sans','font.size':10,'axes.labelcolor':INK,'text.color':INK,'xtick.color':GRAY,'ytick.color':GRAY,'axes.spines.top':False,'axes.spines.right':False,'axes.edgecolor':'#b9c7cf','grid.color':'#e0e8eb','figure.facecolor':'white'})

def save(fig,name):
    fig.savefig(TMP/(name+'.png'),dpi=230,bbox_inches='tight',facecolor='white');plt.close(fig)

def figures():
    map_module=runpy.run_path(str(ROOT/'report-galaxy.py'))
    (ROOT/'output/figures').mkdir(parents=True,exist_ok=True)
    map_module['make_map'](ROOT/'output/figures/Moving_Observer_Galactic_Map.png')
    # Reuse the original-question schematic and equation rendering, not its page layout.
    runpy.run_path(str(ROOT/'brief-report.py'))['figures']()
    fig,ax=plt.subplots(1,2,figsize=(10,2.6),layout='constrained')
    for a,b,title in zip(ax,[1.18,.65],['A: outside the transit boundary','B: inside the transit boundary']):
        a.set_aspect('equal');a.set_xlim(-2,2);a.set_ylim(-1.25,1.6);a.axis('off')
        a.add_patch(Circle((0,0),1,color='#edc568',ec='#947335',lw=1))
        a.axhline(b,c=TEAL,ls='--',lw=1.4);a.add_patch(Circle((.4,b),.12,color=BLUE))
        a.annotate('',xy=(-1.5,b),xytext=(-1.5,0),arrowprops={'arrowstyle':'<->','color':GRAY})
        a.text(-1.65,b/2,'b',ha='right',fontsize=13);a.set_title(title,fontsize=12,pad=10)
    save(fig,'transit')
    fig,ax=plt.subplots(figsize=(10,3),layout='constrained')
    sums=D['research']['sum'];vals=[sums[k] for k in ['c00','c10','c01','c11']]
    labs=['2026 · baseline instrument','2126 · baseline instrument','2026 · improved instrument','2126 · improved instrument']
    ax.barh(range(4),vals,color=[BLUE,'#5684a4',TEAL,'#80aeb6'],height=.57);ax.set_yticks(range(4),labs);ax.invert_yaxis();ax.set_xlim(0,118);ax.set_xlabel('Summed single-visit accessibility score (not discovered planets)')
    for i,v in enumerate(vals):ax.text(v+1.3,i,f'{v:.5f}',va='center',fontsize=10)
    ax.grid(axis='x',alpha=.65);ax.set_axisbelow(True);save(fig,'scores')
    fig,axs=plt.subplots(1,2,figsize=(10,3.2),layout='constrained')
    h=D['density'];axs[0].plot([x['timeMyr'] for x in h],[x['ratio'] for x in h],c=TEAL,lw=1.8);axs[0].axhline(1,c=GRAY,ls=':',lw=1)
    axs[0].set(xlabel='Million years after 2026',ylabel='Density / starting density',title='Smooth-density scenario',ylim=(.75,1.1));axs[0].grid(alpha=.5)
    h=D['proxima'];axs[1].plot([x['years']/1000 for x in h],[x['distanceLy'] for x in h],c=BLUE,lw=1.8);q=D['proximaClosest'];axs[1].scatter([q['years']/1000],[q['distanceLy']],c=GOLD,zorder=4);axs[1].annotate('Linear-model minimum\n3.10 ly at +26.7 kyr',(q['years']/1000,q['distanceLy']),xytext=(12,3.8),arrowprops={'arrowstyle':'->','color':GRAY},fontsize=9)
    axs[1].set(xlabel='Thousand years after 2026',ylabel='Sun–Proxima distance (ly)',title='Proxima: constant-velocity example');axs[1].grid(alpha=.5);save(fig,'neighbourhood')
    fig,ax=plt.subplots(figsize=(10,2.7),layout='constrained')
    h=D['orbit'];ax.plot([x['t'] for x in h],[x['heightPc'] for x in h],c=BLUE,lw=1.6);ax.axhline(0,c=GRAY,lw=.7);ax.set(xlabel='Million years after 2026',ylabel='Height above model midplane (pc)',xlim=(0,250),ylim=(-115,115));ax.grid(alpha=.4);save(fig,'height')
    media=runpy.run_path(str(ROOT/'create-share-media.py'))
    fig=plt.figure(figsize=(10,4.0),facecolor='white')
    for j,frame in enumerate(['galactic','comoving']):
        ax=fig.add_subplot(1,2,j+1,projection='3d');media['trajectories'](ax,frame,1,-45,False)
        ax.set_title('Full Galactic motion' if j==0 else '98% co-moving frame',fontsize=11,color=INK,pad=0)
    from matplotlib.lines import Line2D
    overrides={'Sun':'#95631c','Venus':'#aa7d32','Mercury':'#747777','Moon':'#8b6f95'}
    handles=[Line2D([0],[0],color=overrides.get(n,color),lw=2,label=n) for n,color in media['COLORS'].items()]
    fig.legend(handles=handles,loc='lower center',bbox_to_anchor=(.5,.015),ncol=5,frameon=False,fontsize=9)
    fig.subplots_adjust(left=.015,right=.985,bottom=.19,top=.91,wspace=.02)
    save(fig,'paths')
    fig,ax=plt.subplots(1,2,figsize=(10,3),layout='constrained')
    # A drawing of circular orbits, not a depiction of spacetime curvature.
    ax[0].set_aspect('equal');ax[0].axis('off');ax[0].set_xlim(-4.6,4.6);ax[0].set_ylim(-4.6,4.6)
    ax[0].add_patch(Circle((0,0),1,facecolor='#689fbe',edgecolor=BLUE))
    for r,c in [(6771/6371,BLUE),(26571/6371,TEAL)]:ax[0].add_patch(Circle((0,0),r,fill=False,edgecolor=c,lw=1.5))
    ax[0].text(0,-.2,'Earth',ha='center',color='white',fontsize=10);ax[0].text(0,4.35,'20,200 km orbit',ha='center',fontsize=10,color=TEAL)
    ax[0].annotate('400 km',(.9,.56),xytext=(1.8,1.8),arrowprops={'arrowstyle':'->','color':BLUE},fontsize=10)
    ax[0].set_title('Orbital radii to scale',fontsize=12)
    h=D['clocks'];ax[1].plot([x['alt']/1000 for x in h],[x['surfaceGainMicrosecondsPerDay'] for x in h],c=BLUE,lw=1.8);ax[1].axhline(0,c=GRAY,ls=':',lw=1)
    ax[1].scatter([.4,20.2],[-24.743,38.514],c=[GOLD,TEAL],zorder=5)
    ax[1].set(xlabel='Altitude (thousands of km)',ylabel='Gain vs surface clock (µs/day)',title='Ideal circular-orbit clock');ax[1].grid(alpha=.5);save(fig,'clocks')
    fig,ax=plt.subplots(figsize=(10,2.6),layout='constrained')
    ax.set_aspect('equal');ax.set_xlim(-140,280);ax.set_ylim(-130,130)
    for r,color,label in [(120,TEAL,'Heliopause reference: 120 AU'),(90,GOLD,'Termination shock reference: 90 AU'),(30,BLUE,'Neptune: about 30 AU')]:
        ax.add_patch(Circle((0,0),r,fill=False,edgecolor=color,lw=1.5,linestyle='--' if r==90 else '-'))
        ax.annotate(label,(r*.7,r*.7),xytext=(145,r-50),fontsize=10,color=color,arrowprops={'arrowstyle':'-','color':color})
    ax.scatter([0],[0],c=GOLD,s=24);ax.text(-10,-21,'Sun',fontsize=10)
    ax.set_xlabel('AU');ax.set_ylabel('AU');ax.set_title('Schematic reference surfaces, not a fitted heliosphere',fontsize=11)
    save(fig,'heliosphere')
    eqs={
      'relative':[r'$\mathbf{r}_{\rm obs}(t)=\mathbf{r}_\odot(t)+\mathbf{r}_{\oplus/\odot}(t)$',r'$\hat{\mathbf{n}}_i(t)=\frac{\mathbf{r}_i(t)-\mathbf{r}_{\rm obs}(t)}{|\mathbf{r}_i(t)-\mathbf{r}_{\rm obs}(t)|},\qquad\Delta\theta\simeq\frac{|\mathbf{v}_{\rm rel,\perp}|\Delta t}{D}$'],
      'transit_eq':[r'$b(t)=\frac{a\cos i(t)}{R_\star},\quad |b|<1+\frac{R_p}{R_\star},\quad P_{\rm transit}\simeq\frac{R_\star+R_p}{a}$'],
      'clock_eq':[r'$\left(\frac{d\tau}{dt}\right)_{\rm held}=\sqrt{1-\frac{2GM}{rc^2}},\qquad\left(\frac{d\tau}{dt}\right)_{\rm circular}=\sqrt{1-\frac{3GM}{rc^2}}$']}
    for name,rows in eqs.items():
        fig=plt.figure(figsize=(10,len(rows)*.66),facecolor='white')
        for i,e in enumerate(rows):fig.text(.04,1-(i+.8)/len(rows),e,fontsize=17,color=INK)
        save(fig,name)

DEST=ROOT/'output/pdf/Moving_Observer_Illustrated_Report.pdf'
styles={
 'body':ParagraphStyle('body',fontName='Times-Roman',fontSize=10.8,leading=14.6,textColor=colors.HexColor(INK),alignment=TA_JUSTIFY),
 'small':ParagraphStyle('small',fontName='Helvetica',fontSize=8.3,leading=11.3,textColor=colors.HexColor(GRAY)),
 'h':ParagraphStyle('h',fontName='Times-Bold',fontSize=16,leading=19,textColor=colors.HexColor(BLUE)),
 'sub':ParagraphStyle('sub',fontName='Helvetica-Bold',fontSize=10.5,leading=14,textColor=colors.HexColor(BLUE)),
 'center':ParagraphStyle('center',fontName='Times-Roman',fontSize=12,leading=16,alignment=TA_CENTER,textColor=colors.HexColor(INK)),
 'title':ParagraphStyle('title',fontName='Times-Bold',fontSize=25,leading=28,alignment=TA_CENTER,textColor=colors.HexColor(INK))}
c=None;bounds=[]
def p(text,x,y,w=CW,style='body',gap=9):
    q=Paragraph(text,styles[style]);_,h=q.wrap(w,1000)
    assert y-h>47,(text[:60],y,h)
    q.drawOn(c,x,y-h);bounds.append((c.getPageNumber(),x,y,w,h));return y-h-gap
def pic(path,x,y,w,h=None):
    im=PILImage.open(path);height=h or w*im.height/im.width
    c.drawImage(str(path),x,y-height,width=w,height=height,preserveAspectRatio=True,anchor='c',mask='auto');return y-height
def caption(text,x,y,w=CW):return p(text,x,y-5,w,'small',10)
def heading(text,x,y,w=CW):return p(text,x,y,w,'h',8)
def box(text,y,w=CW,x=M):
    q=Paragraph(text,styles['body']);_,h=q.wrap(w-22,1000)
    c.setFillColor(colors.HexColor('#edf4f8'));c.setStrokeColor(colors.HexColor('#b6cedd'));c.rect(x,y-h-22,w,h+18,fill=1,stroke=1)
    return p(text,x+11,y-10,w-22,'body',18)-8
def tab(rows,y,widths):
    data=[[Paragraph(str(x),styles['small']) for x in row] for row in rows]
    t=Table(data,colWidths=widths);t.setStyle(TableStyle([('BACKGROUND',(0,0),(-1,0),colors.HexColor('#e6eef3')),('LINEBELOW',(0,0),(-1,-1),.35,colors.HexColor('#bdcbd4')),('VALIGN',(0,0),(-1,-1),'TOP'),('TOPPADDING',(0,0),(-1,-1),6),('BOTTOMPADDING',(0,0),(-1,-1),6)]))
    _,h=t.wrap(CW,1000);assert y-h>47;t.drawOn(c,M,y-h);return y-h-10
def page(title,n):
    if n>1:c.showPage()
    c.setFont('Helvetica',8);c.setFillColor(colors.HexColor(GRAY));c.drawString(M,H-23,'FINDING EARTH 2.0 / ILLUSTRATED DISCUSSION REPORT');c.drawRightString(W-M,H-23,'25 OCTOBER 2026')
    c.setStrokeColor(colors.HexColor('#96b2c6'));c.line(M,42,W-M,42);c.setFont('Helvetica',8);c.drawString(M,28,'Biswajit Jana | Independent research | Not peer reviewed');c.drawRightString(W-M,28,f'{n} / 6')
    return heading(title,M,H-45)

def build():
 global c
 figures();c=canvas.Canvas(str(DEST),pagesize=A4);c.setTitle('Does a moving viewpoint change the exoplanet sky? - Illustrated report');c.setAuthor('Biswajit Jana');c.setSubject('Moving observer, moving stars, detection geometry and a request for scientific guidance')
 # Page 1
 page('',1);y=p('Does a moving viewpoint change<br/>the exoplanet sky?',M,H-47,CW,'title',8)
 y=p('An illustrated report from Finding Earth 2.0',M,y,CW,'center',5)
 y=p('<b>Biswajit Jana</b> | Independent researcher and simulation author',M,y,CW,'center',16)
 y=heading('1. The question behind the project',M,y)
 y=p('As the Solar System travels through the Milky Way, neighbouring stars move too. Could this changing relative viewpoint create useful opportunities to observe planets? This report connects that question to an inspectable simulation and a quantitative, limited experiment.',M,y)
 top=y;left=p('<b>The original idea.</b> A marks today, B a future position and C a later position. The arrows illustrate other stars moving as well. The named arms locate the concept; they are not rigid tracks.',M,top,173)
 left=pic(ROOT/'output/figures/Original_Discovery_Sky.png',M,left,173)
 caption('Historical Finding Earth 2.0 discovery sky from the supplied note. Catalogue snapshot, not future trajectories.',M,left,173)
 y=pic(ROOT/'output/figures/Original_Galactic_Concept.png',M+188,top,331)
 y=caption('<b>Figure 1.</b> Original conceptual galaxy illustration, reproduced from the supplied discussion note. A/B/C are observer epochs, not three stars. This is neither an external photograph nor a measured future map. Underlying image provenance is not independently established here.',M,y)
 y=heading('The scale of the journey',M,y)
 y=tab([['Interval','At 233 km/s','Meaning'],['100 years','0.0777 ly (about 4,915 AU)','Small Galactic displacement'],['100 light-years of travel','About 128,600 years','Targets also move during this time']],y,[100,164,CW-264])
 box('<b>Question for the community:</b> which systems and observing methods make relative motion measurably useful? A passive probe inherits its release velocity; the fixed 2026 marker is a hypothetical spatial reference, not a parked spacecraft.',y)
 # Page 2
 y=page('2. Finding Earth 2.0 and changing sightlines',2)
 y=p('The related <link href="https://biswajit1999.github.io/finding-earth-2/" color="'+BLUE+'">Finding Earth 2.0 observatory</link> explores known planets and observational evidence. Its saved 28 August 2026 analysis contains 6,354 confirmed planets and 4,764 host systems, plus five Solar-System controls. It is a different dataset from the 1,387-source experiment on the next page.',M,y)
 y=pic(ROOT/'output/figures/Finding_Earth_2_HZ.png',M,y,CW,292)
 y=caption('<b>Figure 2.</b> Original saved Finding Earth 2.0 plot: 5,767 planets with incident-flux and stellar-temperature data; 1,659 have radii below two Earth radii. The similarity index is not a probability of life. Habitable-zone placement is not evidence of surface habitability. Source and methods: <link href="https://github.com/Biswajit1999/finding-earth-2" color="'+BLUE+'">Finding Earth 2.0 repository</link>.',M,y)
 y=heading('The relative-motion equation',M,y)
 y=pic(TMP/'relative.png',M,y,CW,82)
 y=p('The observer and target positions must be expressed in the same frame. D is target distance; the transverse velocity is the target velocity relative to the observer. A 30 km/s transverse relative speed at 100 ly changes direction by about 20.6 arcseconds in 100 years. This small-angle estimate is not a planet-yield prediction.',M,y-3)
 y=pic(TMP/'transit_eq.png',M,y,CW,43)
 p('For a circular orbit, b is the impact parameter and i the inclination to our sightline. An Earth-Sun analogue has an isotropic transit probability near 0.47%. Changing our viewing direction can alter alignment; finding a transit still requires suitable observing cadence, signal and orbital phase.',M,y-3)
 # Page 3
 y=page('3. What the catalogue experiment says',3)
 y=p('Changing Earth-transit-zone membership is established research [2]. The implemented experiment tests a narrower observer-side question: in a fixed nearby-source sample, how much does a century of relative motion change a single-visit direct-imaging accessibility score?',M,y)
 y=pic(TMP/'scores.png',M,y,CW,177)
 y=caption('<b>Figure 3.</b> Four paired scenarios from the saved Gaia-based calculation. The two baseline bars differ by only 0.00911; the instrument change dominates visually. The horizontal axis is an accessibility sum, not detected-planet yield.',M,y)
 top=y;left=heading('Data and assumptions',M,top,COL);right=heading('Result and uncertainty',M+COL+GAP,top,COL)
 left=p('The selected Gaia DR3 sample [8] contains <b>1,387 sources</b> with parallax at least 50 mas, parallax signal-to-noise above 20, measured radial velocity, RUWE below 1.4 and at least ten visibility periods. It is not a complete census of nearby stars.',M,left,COL)
 left=p('Each source receives a hypothetical Earth-radius planet on a circular 1 AU orbit with albedo 0.3. Positions are averaged over isotropic orientations and phases. Baseline thresholds are 60 mas inner working angle, contrast 10<super>-10</super> and G = 30; the improved scenario uses 40 mas, 5 × 10<super>-11</super> and G = 31.',M,left,COL)
 right=p('At fixed baseline thresholds, the score changes from <b>29.63207 to 29.64118</b>: about <b>+0.031%</b>. The assumed instrument improvement adds 73.09093 at the initial epoch. These settings are sensitivity scenarios, not approved mission specifications.',M+COL+GAP,right,COL)
 right=p('With 1,024 correlated astrometric draws per source, the motion difference has a formal 95% interval of +0.00868 to +0.01152. This interval excludes population uncertainty, instrument uncertainty, binary-system errors and cross-source systematics.',M+COL+GAP,right,COL)
 y=min(left,right)-2;y=heading('A useful counterexample',M,y)
 y=p('Forty-two sources gain and 45 lose accessibility at the stated thresholds; those are source-level score changes, not planet discoveries. Changing only the inner working angle to 70 mas produces a net motion contribution of about <b>-0.00145</b>. Waiting does not necessarily improve aggregate access.',M,y)
 box('<b>What remains untested:</b> averaging over isotropic planet positions removes sensitivity to absolute sky direction. This experiment therefore does not answer the original transit-boundary question for known orbital planes. A targeted, orbit-aware study is the next step.',y)
 # Page 4
 y=page('4. Are we entering a different neighbourhood?',4)
 y=p('Many disk stars share Galactic rotation, but not identical velocities. Relative velocities determine encounters. Galactic radius R and height z describe different aspects of the environment; neither alone fixes an individual star\'s speed.',M,y)
 y=pic(TMP/'neighbourhood.png',M,y,CW,183)
 y=caption('<b>Figure 4.</b> Left: a smooth thin/thick-disk density scenario along the integrated Solar orbit. Right: Proxima\'s relative trajectory under constant velocity using historical published inputs [3]. These independent models have different time ranges; the right panel is not a precise encounter forecast.',M,y)
 top=y;left=heading('Density is not a discovery count',M,top,COL);right=heading('Proxima is approaching now',M+COL+GAP,top,COL)
 left=p('The scenario is normalized to a historical count of 373 stars within 10 pc [4]. Applying the adopted thin/thick-disk profile [5] gives roughly <b>0.784-1.063 times</b> the starting density over 250 Myr, or about 292-397 stars in an instantaneous 10 pc sphere.',M,left,COL)
 left=p('These are not distinct arrivals or planets found. Spiral-arm enhancements, clusters and migration are omitted. The density profile is separate from the force model and from the artist reconstruction.',M,left,COL)
 right=p('The adopted Proxima inputs yield about <b>4.24 ly</b> in 2026 and radial velocity <b>-22.19 km/s</b>: the distance is decreasing. The total relative speed is about 32.51 km/s, including transverse motion.',M+COL+GAP,right,COL)
 right=p('Straight-line extrapolation reaches about 3.10 ly after 26,700 years. The calculation omits the Alpha Centauri system\'s orbital dynamics and Galactic differential acceleration, so the minimum is illustrative.',M+COL+GAP,right,COL)
 y=min(left,right);y=heading('Speed farther from the Galactic centre',M,y)
 y=tab([['Radius R','Model circular speed','Model orbital period']]+[[f"{q['radiusKpc']:g} kpc",f"{q['speedKmS']:.1f} km/s",f"{q['periodMyr']:.1f} Myr"] for q in D['speeds']],y,[CW/3]*3)
 y=p('The existing potential rises outward in circular speed; it is <b>not a fit to the latest measured rotation curve</b>. Observations depend on tracers and assumptions [6]. Higher-z populations can have different random motions and mean rotation; there is no universal speed-height rule.',M,y)
 # Page 5
 y=page('5. Reading the 3D simulation correctly',5)
 y=p('A trajectory\'s shape depends on the reference frame. The same planetary motion can appear as closed orbits in a co-moving frame and as winding paths when Solar travel is included. That does not imply a universal helix through spacetime.',M,y)
 y=pic(TMP/'paths.png',M,y,CW,190)
 y=caption('<b>Figure 5.</b> Numerical model rendering of three years of trajectories. Left: full Galactic translation. Right: a frame translating at 98% of the initial Solar velocity, resolving the inner-system winding. Each panel has equal AU axes but a different range; markers are enlarged. Not website screenshots.',M,y)
 y=p('The Sun\'s planetary reflex motion, its long-term vertical oscillation and the illustrative Galactic warp are different effects. The long clock uses an idealized nearly circular orbit in a static smooth potential. <b>Evolution of the Galactic plane is not modelled</b>; the animated warp does not drive the orbit.',M,y)
 y=heading('The heliosphere and physical clocks',M,y)
 y=pic(TMP/'heliosphere.png',M,y,CW,146)
 y=caption('<b>Figure 6.</b> Scale illustration: Neptune at about 30 AU, an adopted 90 AU termination shock and 120 AU heliopause. Real boundaries are asymmetric and time dependent. The 400 km/s radial-wind model stops at the shock. No magnetic-fluid or radiation-transport solution is claimed [12].',M,y)
 y=pic(TMP/'clock_eq.png',M,y,CW,42)
 y=p('For an isolated spherical Earth, the ideal 400 km circular clock loses 24.74 microseconds/day relative to a stationary surface clock; at 20,200 km it gains 38.51. The whole-system view instead sums ten masses at a specified stationary test point, using the weak-field gravitational clock rate. Its potential-sheet depth is only a diagram.',M,y-3)
 p('The separate coupled <b>1PN lab</b> integrates Sun, eight planets and Moon from JPL initial states [11]. Mercury advances 42.9798 arcseconds/century in the two-body benchmark (analytic: 42.9807). The ten-year lunar discrepancy reaches 215 km. This is a tested approximation, not full GR or a navigation ephemeris.',M,y)
 # Page 6
 y=page('6. How to explore, reproduce and critique',6)
 top=y;left=heading('A short simulation tutorial',M,top,COL);right=heading('Questions for the community',M+COL+GAP,top,COL)
 steps=[('1. Start with the scales.','In Milky Way, click Show the bend. Gold warp and grey flat-plane guides separate; 5x vertical display is labelled. Restore 1x for true proportions. The 2025 corrugation is not fitted.'),('2. Resolve 100 light-years.','Open the journey preview. It takes about 128,608 model years to cover 100 ly. Record 10 seconds captures the live local scene; keep the tab visible.'),('3. Change the frame.','Open Sun & all planets. Play inner winding paths for 3 years, or all planets with 84-year trails. The fixed camera shows forward travel. Follow Sun re-centres it. Compare 98% co-moving and Galactic frames.'),('4. Inspect physical readouts.','Space & Time opens with all planets on a years clock. Select Earth for local clocks. Show the heliosphere fits the 120 AU envelope; the 1PN lab calculates coupled dynamics.'),('5. Check the evidence.','Use the report\'s source links, CSV exports and frozen inputs. The repository supplies numerical modules and validation scripts.')]
 for title,text in steps:left=p('<b>'+title+'</b> '+text,M,left,COL)
 for title,text in [('A feasible next test','Which known planetary systems have orbital planes and relative velocities sufficiently constrained to test entry into a transit band?'),('A realistic observation model','Which apparent accessibility gains survive exposure-time budgets, repeated visits, binaries and instrument noise?'),('A second observer','What physically feasible probe orbit would produce an additional useful baseline beyond Earth\'s orbit and long-term astrometry?'),('Relevant prior work','Which studies or follow-up results best connect changing sightlines, nearby encounters and exoplanet detection opportunities?')]:right=p('<b>'+title+'.</b> '+text,M+COL+GAP,right,COL)
 right=p('I am an independent researcher without a formal supervisor. I built the software out of curiosity and would welcome expert guidance on what is useful, what is already established, and what needs correction.',M+COL+GAP,right,COL)
 y=min(left,right)-3;y=heading('Selected references and figure provenance',M,y)
 refs=[('[1] ESA/Gaia/DPAC, Stefan Payne-Wardenaar (2025). Milky Way artist reconstruction.','https://www.esa.int/ESA_Multimedia/Images/2025/01/The_best_Milky_Way_map_by_Gaia'),('[2] Kaltenegger & Faherty (2021). Past, present and future stars that can see Earth as a transiting exoplanet.','https://doi.org/10.1038/s41586-021-03596-y'),('[3] Kervella, Thévenin & Lovis (2017). Proxima / Alpha Centauri input measurements.','https://doi.org/10.1051/0004-6361/201629930'),('[4] Reylé et al. (2021). The 10 parsec sample in the Gaia era.','https://doi.org/10.1051/0004-6361/202140985'),('[5] Jurić et al. (2008). The Milky Way tomography with SDSS.','https://arxiv.org/abs/astro-ph/0510520'),('[6] Põder et al. (2023). Galactic circular-speed inference.','https://doi.org/10.1051/0004-6361/202346474'),('[7] Ashby (2003). Relativity in the Global Positioning System.','https://doi.org/10.12942/lrr-2003-1'),('[8] Gaia DR3 data release; catalogue selection and uncertainty details in the full report.','https://doi.org/10.5270/esa-qa4lep3'),('[9] Stark et al. (2024). Robust HWO exoplanet yield margins.','https://doi.org/10.1117/1.JATIS.10.3.034006'),('[10] Poggio et al. (2025). The great wave: outer-disk warp and corrugation.','https://doi.org/10.1051/0004-6361/202451668'),('[11] Park et al. (2021). JPL DE440/DE441 planetary and lunar ephemerides.','https://doi.org/10.3847/1538-3881/abd414'),('[12] NASA. Heliosphere shape and the limits of the solar-wind envelope.','https://www.nasa.gov/solar-system/uncovering-our-solar-systems-shape/')]
 for title,url in refs:y=p(f'<link href="{url}" color="{BLUE}">{title}</link>',M,y,CW,'small',5)
 y=p('Figure 1 reproduces the supplied note; Figure 2 is the dated Finding Earth 2.0 plot. Figures 3-6 are project calculations or scale diagrams. The simulation retains the ESA/Gaia artist reconstruction [1] with its licence credit. No institutional endorsement is implied. The original discussion note is preserved unchanged online.',M,y,CW,'small',8)
 p('<b>Simulation, full methods, original note and reproducible source:</b><br/><link href="https://biswajit1999.github.io/moving-observer/" color="'+BLUE+'">biswajit1999.github.io/moving-observer/</link>',M,y,CW,'small',0)
 c.save();r=PdfReader(DEST);assert len(r.pages)==6
 for i,pdfpage in enumerate(r.pages):assert f'{i+1} / 6' in pdfpage.extract_text()
 print('Created six-page illustrated report:',DEST)

if __name__=='__main__':build()
