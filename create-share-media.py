"""Reproducible scientific video and two-page brief; no browser recording.
Requires matplotlib, imageio, imageio-ffmpeg, numpy, reportlab, pypdf and Pillow.
Run node export-media.cjs first. Outputs are model illustrations, not observations.
"""
import json, math, sys
from pathlib import Path
import numpy as np
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
from matplotlib.lines import Line2D
import imageio.v2 as imageio
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak, Image
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.enums import TA_CENTER
from reportlab.lib.pagesizes import A4
from pypdf import PdfReader

ROOT=Path(__file__).resolve().parent
DATA=json.loads((ROOT/'tmp/media/model.json').read_text(encoding='utf-8'))
TMP=ROOT/'tmp/media'; PDF=ROOT/'output/pdf'; VIDEO=ROOT/'output/video'
PDF.mkdir(parents=True,exist_ok=True); VIDEO.mkdir(parents=True,exist_ok=True)
COLORS={n:f'#{v:06x}' for n,v in DATA['colors'].items()}
INNER=['Sun','Mercury','Venus','Earth','Mars','Moon']
plt.rcParams.update({'font.family':'DejaVu Sans','font.size':10})

def axes_style(ax,dark=True):
    fg='#b9c9d8' if dark else '#294453'
    ax.set_facecolor('#07111b' if dark else '#ffffff')
    ax.tick_params(colors=fg,labelsize=8,pad=0)
    for axis in [ax.xaxis,ax.yaxis,ax.zaxis]:
        axis.label.set_color(fg)
        axis.set_pane_color((.04,.08,.12,1) if dark else (.97,.98,.98,1))
        axis._axinfo['grid']['color']=(.35,.5,.6,.2)
    ax.set_xlabel('x (AU)',labelpad=2);ax.set_ylabel('y (AU)',labelpad=2);ax.set_zlabel('z (AU)',labelpad=2)
    ax.set_box_aspect((1,1,1))

def trajectories(ax,frame,progress=1,angle=25,dark=True):
    names=DATA['names'] if frame=='galactic' else INNER
    points=np.concatenate([np.array(DATA['trajectories'][n][frame]) for n in names])
    lo=points.min(axis=0);hi=points.max(axis=0);mid=(lo+hi)/2;half=max(hi-lo)*.55
    axes_style(ax,dark)
    ax.set_xlim(mid[0]-half,mid[0]+half);ax.set_ylim(mid[1]-half,mid[1]+half);ax.set_zlim(mid[2]-half,mid[2]+half)
    end=max(2,int(progress*1000)+1)
    for name in names:
        p=np.array(DATA['trajectories'][name][frame])[:end]
        color=COLORS[name]
        if not dark and name in ['Sun','Venus','Mercury','Moon']:color={'Sun':'#95631c','Venus':'#aa7d32','Mercury':'#747777','Moon':'#8b6f95'}[name]
        ax.plot(*p.T,color=color,linewidth=1.1 if name!='Moon' else .65,alpha=.95)
        ax.scatter(*p[-1],s=24 if name=='Sun' else 10,color=color,depthshade=False)
    ax.view_init(elev=22,azim=angle)
    return names

def make_figure():
    fig=plt.figure(figsize=(10,3.5),facecolor='white')
    for j,frame in enumerate(['galactic','comoving']):
        ax=fig.add_subplot(1,2,j+1,projection='3d');trajectories(ax,frame,1,-45,False)
        ax.set_title('Full Galactic motion' if j==0 else '98% co-moving frame',fontsize=11,color='#18384b',pad=0)
    fig.subplots_adjust(left=.01,right=.98,bottom=.1,top=.9,wspace=.03)
    fig.text(.5,.025,'Same three years; equal AU axes within each panel. Different panel ranges. Markers enlarged.',ha='center',fontsize=8,color='#526773')
    fig.savefig(TMP/'trajectory-brief.png',dpi=190);plt.close(fig)

def make_pdf():
    make_figure(); style=getSampleStyleSheet()
    style.add(ParagraphStyle(name='Cover',fontName='Helvetica',fontSize=26,leading=30,textColor=colors.HexColor('#18384b'),alignment=TA_CENTER,spaceAfter=9))
    style.add(ParagraphStyle(name='Sub',fontName='Helvetica',fontSize=12,leading=17,alignment=TA_CENTER,spaceAfter=6,textColor=colors.HexColor('#486372')))
    style.add(ParagraphStyle(name='By',fontName='Helvetica',fontSize=9,leading=13,alignment=TA_CENTER,spaceAfter=14))
    style.add(ParagraphStyle(name='Section',fontName='Helvetica-Bold',fontSize=12,leading=16,spaceBefore=13,spaceAfter=6,textColor=colors.HexColor('#18384b')))
    style.add(ParagraphStyle(name='Copy',fontName='Helvetica',fontSize=10.2,leading=15,spaceAfter=8,textColor=colors.HexColor('#263a45')))
    style.add(ParagraphStyle(name='SmallCopy',fontName='Helvetica',fontSize=8.4,leading=12,spaceAfter=6,textColor=colors.HexColor('#4e626e')))
    story=[]
    def p(text,kind='Copy'):story.append(Paragraph(text,style[kind]))
    p('THE MOVING OBSERVER','Cover');p('Can a changing viewpoint improve exoplanet access?','Sub')
    p('<b>Biswajit Jana</b> | Finding Earth 2.0<br/>Independent research and simulation project | 24 October 2026 | Discussion brief v7.1','By')
    p('The question','Section')
    p('The Solar System moves through the Milky Way, while neighbouring stars follow their own orbits. Could changing <b>relative</b> positions make particular exoplanets easier to observe? I built this project to separate three effects: Galactic travel, motion relative to a target, and improvements in an instrument.')
    p('What the present calculation says','Section')
    table=[['Selected Gaia sample: 1,387 sources','Accessibility sum'],['2026 geometry; baseline thresholds','29.63207'],['2126 geometry; same thresholds','29.64118'],['2026 geometry; improved thresholds','102.72300']]
    t=Table(table,colWidths=[365,145],hAlign='LEFT');t.setStyle(TableStyle([('BACKGROUND',(0,0),(-1,0),colors.HexColor('#e9f0f0')),('TEXTCOLOR',(0,0),(-1,-1),colors.HexColor('#18384b')),('FONTNAME',(0,0),(-1,0),'Helvetica-Bold'),('FONTSIZE',(0,0),(-1,-1),9),('LEADING',(0,0),(-1,-1),13),('TOPPADDING',(0,0),(-1,-1),8),('BOTTOMPADDING',(0,0),(-1,-1),8),('LINEBELOW',(0,0),(-1,-1),.4,colors.HexColor('#ccd8dc')),('ALIGN',(1,1),(1,-1),'RIGHT')]))
    story.append(t);story.append(Spacer(1,9))
    p('<b>Century motion adds about 0.03% to the baseline score.</b> The assumed instrument change has a much larger effect. These are single-visit accessibility scores for an injected planet distribution - <b>not counts of discovered or habitable planets</b>. Some threshold choices reverse the sign of the motion effect.','SmallCopy')
    story.append(Image(str(TMP/'trajectory-brief.png'),width=510,height=178.5))
    p('Why the frame matters','Section')
    p('In the current model the Sun moves about 4,917 AU in a century. Nearby stars move too. A released probe inherits its velocity and follows gravity; it does not remain at a fixed Galactic coordinate. A fixed 2026 marker is a hypothetical reference. Winding planetary paths depend on the chosen frame.','Copy')
    story.append(PageBreak())
    p('A request for scientific guidance','Cover')
    p('I am an independent researcher without a formal supervisor. My aim is to make the question testable and invite correction, not to claim a new physical principle.','Copy')
    p('Three questions for an expert','Section')
    for text in [
        '<b>1. Is the comparison useful?</b> Which prior or follow-up work best addresses changing observer-side accessibility at fixed instrument capability?',
        '<b>2. Which targets survive a fuller model?</b> Do any gains remain after binary dynamics, astrometric systematics, planet populations, exposure times and observing schedules are included?',
        '<b>3. Would a second observer help?</b> What feasible probe trajectory and measurable observable would improve on Earth-orbit and long-term astrometry?']:
        p(text)
    p('How to explore the simulation','Section')
    p('<b>Milky Way:</b> play the 250 Myr illustration; compare radius, height and a labelled smooth-density scenario. Synthetic example stars are off by default.<br/><b>Sun &amp; all planets:</b> choose the winding-path tour, then compare full Galactic and 98% co-moving frames. Use the separate Solar-wobble and Earth-Moon close-ups.<br/><b>Space &amp; Time:</b> compare a stationary clock with ideal circular-orbit clocks around a 3D Earth. The 400 km and 20,200 km presets give about -24.7 and +38.5 microseconds/day relative to a stationary surface clock.')
    p('Limits and the next test','Section')
    p('The Galaxy artwork is not a measured star-count map. The existing illustrative potential is not a fit to the latest rotation curve. Smooth density does not predict spiral-arm crossings. The Moon is a circular illustration; the relativistic model assumes an isolated, nonrotating spherical body. The next research step is a small, carefully chosen real-target sample with a realistic observing budget and uncertainty propagation.','Copy')
    p('Selected foundations','Section')
    refs=[
        ('Kaltenegger & Faherty (2021): changing Earth transit-zone membership.','https://doi.org/10.1038/s41586-021-03596-y'),
        ('Bailer-Jones (2022): stellar encounters from Gaia DR3.','https://arxiv.org/abs/2207.06258'),
        ('Stark et al. (2024): robust HWO exoplanet yield margins.','https://doi.org/10.1117/1.JATIS.10.3.034006'),
        ('Poggio et al. (2025): Galactic vertical corrugation.','https://doi.org/10.1051/0004-6361/202451668'),
        ('JPL Horizons; Gaia DR3; NIST clock tests. Full provenance is in the report.','https://biswajit1999.github.io/moving-observer/Report.html')]
    for text,url in refs:p(f'<link href="{url}" color="#176d85">{text}</link>','SmallCopy')
    p('<b>Simulation, full report and reproducible source</b><br/><link href="https://biswajit1999.github.io/moving-observer/" color="#176d85">biswajit1999.github.io/moving-observer/</link><br/><link href="https://github.com/Biswajit1999/moving-observer" color="#176d85">github.com/Biswajit1999/moving-observer</link>','SmallCopy')
    def footer(canvas,doc):
        canvas.setStrokeColor(colors.HexColor('#c7d5da'));canvas.line(42,37,A4[0]-42,37);canvas.setFont('Helvetica',8);canvas.setFillColor(colors.HexColor('#526773'));canvas.drawString(42,24,'Biswajit Jana | Finding Earth 2.0 | Working report; not peer reviewed');canvas.drawRightString(A4[0]-42,24,f'{doc.page} / 2')
    dest=PDF/'Moving_Observer_Brief.pdf'
    SimpleDocTemplate(str(dest),pagesize=A4,rightMargin=42,leftMargin=42,topMargin=34,bottomMargin=48,title='The Moving Observer - Two-page project brief',author='Biswajit Jana').build(story,onFirstPage=footer,onLaterPages=footer)
    assert len(PdfReader(dest).pages)==2,'Brief must be exactly two pages'
    print('Created two-page PDF',flush=True)

def make_video():
    fps=16;frames_per_chapter=96
    dest=VIDEO/'Moving_Observer_3D_Tour.mp4'
    writer=imageio.get_writer(dest,fps=fps,codec='libx264',quality=7,macro_block_size=16,ffmpeg_params=['-pix_fmt','yuv420p','-metadata','artist=Biswajit Jana','-metadata','comment=Scientific model rendering; not a browser recording'])
    fig=plt.figure(figsize=(12.8,7.2),dpi=100,facecolor='#07111b')
    for chapter in range(4):
        for i in range(frames_per_chapter):
            u=i/(frames_per_chapter-1);fig.clear();ax=fig.add_axes([.24,.12,.66,.72],projection='3d')
            if chapter<2:
                frame='galactic' if chapter==0 else 'comoving';names=trajectories(ax,frame,.2+.8*u,-70+80*u,True)
                title='One Solar System. Many moving paths.' if chapter==0 else 'Change the frame. Resolve the winding.'
                sub='Full Galactic motion | 2026-2029 | equal AU axes' if chapter==0 else 'Frame follows 98% of initial Solar velocity | equal AU axes'
                note='Outer planets move slowly; inner paths look thin at this scale.' if chapter==0 else 'No stretched axes. The Moon lies almost on Earth’s track here.'
                legend=[Line2D([0],[0],color=COLORS[n],lw=2,label=n) for n in names]
                fig.legend(handles=legend,loc='center left',bbox_to_anchor=(.045,.48),frameon=False,labelcolor='#d9e5ef',fontsize=11)
            elif chapter==2:
                axes_style(ax);p=np.array(DATA['lunar']);ax.plot(*p.T,color='#bfc7d0',lw=1.8);j=int(u*360);ax.scatter(0,0,0,s=130,c='#8cbeeb');ax.scatter(*p[j],s=28,c='#bfc7d0');
                for setter in [ax.set_xlim,ax.set_ylim,ax.set_zlim]:setter(-1.15,1.15)
                ax.set_xlabel('lunar-distance units');ax.set_ylabel('');ax.set_zlabel('');ax.view_init(25,-50+60*u)
                title='The Moon needs a closer view.';sub='Earth-centred | one illustrative 27.32-day orbit';note='Circular lunar model; not an ephemeris. Body markers enlarged.'
                fig.text(.045,.55,'EARTH + MOON\n\n384,400 km\nmean separation\n\nSeparate from\nthe Solar wobble',color='#b9c9d8',fontsize=13,linespacing=1.6)
            else:
                axes_style(ax);theta=np.linspace(0,2*np.pi,60);phi=np.linspace(0,np.pi,30);x=np.outer(np.cos(theta),np.sin(phi));y=np.outer(np.sin(theta),np.sin(phi));z=np.outer(np.ones_like(theta),np.cos(phi));ax.plot_surface(x,y,z,color='#3f7ca2',linewidth=0,alpha=1,shade=True)
                r=6771/6371;ax.plot(r*np.cos(theta),r*np.sin(theta),np.zeros_like(theta),c='#79e4d9',lw=1.2);a=2*np.pi*u;ax.scatter(r*np.cos(a),r*np.sin(a),0,s=32,c='#f2c786')
                for setter in [ax.set_xlim,ax.set_ylim,ax.set_zlim]:setter(-1.6,1.6)
                ax.set_xlabel('Earth radii');ax.set_ylabel('');ax.set_zlabel('');ax.view_init(27,-45+45*u)
                title='Gravity and orbital motion change clock rates.';sub='400 km circular orbit | one 92.4-minute orbit shown in 6 seconds';note='Isolated spherical Earth; no rotation, oblateness or signal corrections.'
                fig.text(.035,.53,'-24.7 μs/day\n\nrelative to a\nstationary\nsurface clock',color='#f2c786',fontsize=20,linespacing=1.4)
            fig.text(.045,.94,'THE MOVING OBSERVER / FINDING EARTH 2.0',fontsize=11,color='#8aa6b9')
            fig.text(.045,.875,title,fontsize=22,color='#f1f5f8',weight='medium');fig.text(.045,.825,sub,fontsize=12,color='#9ec9d8')
            fig.text(.045,.07,note,fontsize=11,color='#afc1cf');fig.text(.045,.027,'Biswajit Jana · 2026  |  Model-generated scientific illustration',fontsize=10,color='#809caf');fig.text(.96,.027,f'{chapter+1}/4',ha='right',fontsize=10,color='#809caf')
            fig.canvas.draw();pixels=np.asarray(fig.canvas.buffer_rgba())[:,:,:3];writer.append_data(pixels)
            if i==frames_per_chapter//2: imageio.imwrite(TMP/f'video-shot-{chapter+1}.png',pixels)
        print('Rendered video chapter',chapter+1,flush=True)
    writer.close();plt.close(fig)
    print('Created 24-second 1280x720 MP4',flush=True)

if __name__=='__main__':
    if '--video-only' not in sys.argv:make_pdf()
    if '--pdf-only' not in sys.argv:make_video()
