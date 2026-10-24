"""Two-page discussion brief connecting the original question and current results."""
from pathlib import Path
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak, Image
from reportlab.lib import colors
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.enums import TA_CENTER
from reportlab.lib.pagesizes import A4
from pypdf import PdfReader

ROOT=Path(__file__).resolve().parent
TMP=ROOT/'tmp/pdfs'
TMP.mkdir(parents=True,exist_ok=True)
INK=colors.HexColor('#18384b')
BASE='https://biswajit1999.github.io/moving-observer/'

def figures():
    fig,ax=plt.subplots(figsize=(10,2.5),facecolor='white')
    ax.set_xlim(-.7,10.7);ax.set_ylim(-.45,3.1);ax.axis('off')
    ax.plot([0,4,8],[0,.1,.5],c='#bdcad2',ls='--',lw=1.5)
    for x,y,label,c in [(0,0,'A · today','#cc9a31'),(4,.1,'B · future','#b75e54'),(8,.5,'C · later','#2c849d')]:
        ax.scatter(x,y,s=100,color=c,zorder=4);ax.text(x,y-.27,label,ha='center',fontsize=11,color='#18384b')
    ax.plot([0,6],[0,2.25],c='#b75e54',ls='--',lw=1.2)
    ax.plot([4,7],[.1,2.4],c='#2c849d',ls='--',lw=1.2)
    ax.scatter([6,7],[2.25,2.4],s=80,color='#cc9a31')
    ax.annotate('',xy=(7,2.4),xytext=(6,2.25),arrowprops={'arrowstyle':'->','color':'#18384b'})
    ax.text(7.5,2.72,'Target star also moves',fontsize=11,color='#18384b',ha='center')
    ax.text(2.4,1.8,'Changing sightlines',fontsize=11,color='#18384b',rotation=17)
    ax.text(5,.8,'Observer motion',fontsize=10,color='#526773')
    fig.subplots_adjust(left=.01,right=.99,bottom=.06,top=.96)
    fig.savefig(TMP/'brief-geometry.png',dpi=200);plt.close(fig)
    fig=plt.figure(figsize=(10,1.42),facecolor='#f3f7f7')
    equations=[r'$\mathbf{q}_i(t)=\mathbf{r}_i(t)-\mathbf{r}_{\rm obs}(t),\quad \hat{\mathbf{n}}_i(t)=\mathbf{q}_i(t)/|\mathbf{q}_i(t)|$',
      r'$\Delta\theta\simeq |\mathbf{v}_{\rm rel,\perp}|\,\Delta t/D,\quad b=a\cos i/R_\star,\quad |b|<1+R_p/R_\star$',
      r'$P_{\rm transit}\simeq(R_\star+R_p)/a\simeq0.47\%\quad\mathrm{(Earth\!\!-\!\!Sun\ analogue)}$']
    for y,e in zip([.77,.43,.10],equations):fig.text(.035,y,e,color='#18384b',fontsize=14)
    fig.savefig(TMP/'brief-equations.png',dpi=210);plt.close(fig)

def make_pdf():
    figures();story=[]
    styles={
      'title':ParagraphStyle('title',fontName='Helvetica',fontSize=23,leading=27,alignment=TA_CENTER,textColor=INK,spaceAfter=8),
      'by':ParagraphStyle('by',fontName='Helvetica',fontSize=9,leading=13,alignment=TA_CENTER,textColor=INK,spaceAfter=11),
      'h':ParagraphStyle('h',fontName='Helvetica-Bold',fontSize=12,leading=15,textColor=INK,spaceBefore=10,spaceAfter=5),
      'p':ParagraphStyle('p',fontName='Helvetica',fontSize=9.7,leading=13.4,textColor=INK,spaceAfter=7),
      'small':ParagraphStyle('small',fontName='Helvetica',fontSize=8.1,leading=11,textColor=colors.HexColor('#526773'),spaceAfter=5)}
    def p(text,kind='p'):story.append(Paragraph(text,styles[kind]))
    def table(rows,widths):
        q=Table(rows,colWidths=widths,hAlign='LEFT')
        q.setStyle(TableStyle([('BACKGROUND',(0,0),(-1,0),colors.HexColor('#e9f0f0')),('TEXTCOLOR',(0,0),(-1,-1),INK),('FONTNAME',(0,0),(-1,0),'Helvetica-Bold'),('FONTSIZE',(0,0),(-1,-1),8.5),('TOPPADDING',(0,0),(-1,-1),6),('BOTTOMPADDING',(0,0),(-1,-1),6),('LINEBELOW',(0,0),(-1,-1),.4,colors.HexColor('#ccd8dc'))]))
        story.append(q);story.append(Spacer(1,6))
    p('Does a moving viewpoint change<br/>the exoplanet sky?','title')
    p('<b>Biswajit Jana | Finding Earth 2.0</b><br/>The Moving Observer - discussion report brief | 24 October 2026','by')
    p('1. The original question','h')
    p('Finding Earth 2.0 began with a map of known exoplanet hosts. A catalogue snapshot prompted a broader question: as the Solar System moves from A to B and later C, while target stars also move, could changing sightlines make different planetary systems detectable? In particular, could a near-boundary system enter or leave transit visibility? The question extends beyond a century.')
    story.append(Image(str(TMP/'brief-geometry.png'),width=510,height=127.5))
    p('Schematic only: observer and target both move. A, B and C are observer epochs here, not the simulation\'s optional synthetic comparison stars. No positions or angles in this drawing are measured.','small')
    p('2. Geometry that makes the question testable','h')
    story.append(Image(str(TMP/'brief-equations.png'),width=510,height=72.4))
    p('The observer position is the Solar position plus Earth\'s heliocentric offset. D is target distance; the transverse velocity is <b>relative to the observer</b>. The angular approximation requires a small change and nearly constant relative velocity. The transit condition assumes a circular planet orbit; inclination i is measured to the line of sight. The probability averages random orientations, not changing phases of a known planet.','small')
    table([['Elapsed time','Solar travel at 233 km/s','Sightline change*'],['100 years','0.0777 light-years','20.6 arcseconds'],['10,000 years','7.77 light-years','0.573 degrees'],['100,000 years','77.7 light-years','5.73 degrees']], [115,210,185])
    p('*Illustrative linear estimate for transverse relative speed 30 km/s at initial distance 100 light-years. At 100,000 years the approximation is only an order-of-magnitude guide; a trajectory calculation is needed. These figures are not counts of new stars or planets.','small')
    p('<b>The requested 100-light-year journey takes about 129,000 years.</b> The long-clock model follows an idealized, nearly circular Solar orbit in a static, smooth axisymmetric potential. Evolution of the Galactic plane is omitted; the displayed warp does not drive the orbit.','p')
    story.append(PageBreak())
    p('From a question to a test','title')
    p('Independent research and simulation - seeking expert criticism','by')
    p('3. What has been calculated so far','h')
    table([['Selected Gaia sample: 1,387 sources','Accessibility sum'],['2026 geometry; baseline thresholds','29.63207'],['2126 geometry; same thresholds','29.64118'],['2026 geometry; improved thresholds','102.72300']], [365,145])
    p('Century motion changes this direct-imaging accessibility score by about <b>0.03%</b>; the assumed instrument improvement has a much larger effect. The experiment inserts a hypothetical planet population and averages over isotropic viewing configurations. It <b>does not test transit-zone entry for known orbital planes</b>, nor predict discoveries or habitability. Some threshold choices reverse the motion effect.')
    p('4. What remains open','h')
    p('<b>Transit visibility:</b> which real systems, with constrained orbital planes, could cross a transit boundary as observer and host move? Radial-velocity amplitude also depends on viewing inclination through sin i, but a meaningful change must exceed instrumental and stellar noise.<br/><b>Observing opportunity:</b> do any target-priority gains survive binary dynamics, astrometric uncertainty, exposure times and a realistic survey schedule?<br/><b>A probe left behind:</b> which feasible second-observer trajectory would add useful geometry? A released probe inherits its velocity; a fixed Galactic marker is a hypothetical spatial reference, not a passive spacecraft.')
    p('5. Explore and reproduce','h')
    p('<b>100 light-years:</b> open the website\'s journey preview; the 10-second clip compresses about 129,000 years. Planets are unresolved and not extrapolated beyond their ephemeris range.<br/><b>Sun &amp; all planets:</b> compare the Galactic and 98% co-moving frames; inspect the separate Earth-Moon close-up.<br/><b>Space &amp; Time:</b> compare the 400 km and 20,200 km ideal Earth-orbit clocks. The report provides equations, inputs, CSV exports and limitations.')
    p('Limits and a request for guidance','h')
    p('The long-term Galaxy view is illustrative; its potential is not fitted to the latest rotation curve. Smooth density omits spiral-arm enhancements and does not forecast discovery counts. I am an independent researcher without a formal supervisor. I welcome corrections, relevant prior or follow-up work, and advice on the smallest scientifically useful next experiment.')
    p('Original note and selected foundations','h')
    for title,url in [
      ('Original two-page discussion note - preserved in full',BASE+'discussion-note.pdf'),
      ('Kaltenegger & Faherty (2021): changing Earth transit-zone membership','https://doi.org/10.1038/s41586-021-03596-y'),
      ('Bailer-Jones (2022): Gaia DR3 stellar encounters','https://arxiv.org/abs/2207.06258'),
      ('Stark et al. (2024): HWO yield modelling','https://doi.org/10.1117/1.JATIS.10.3.034006')]:
        p(f'<link href="{url}" color="#176d85">{title}</link>','small')
    p(f'<b>Simulation, full report and source:</b><br/><link href="{BASE}" color="#176d85">biswajit1999.github.io/moving-observer/</link>','small')
    def footer(c,doc):
        c.setStrokeColor(colors.HexColor('#c7d5da'));c.line(42,37,A4[0]-42,37);c.setFont('Helvetica',8);c.setFillColor(INK)
        c.drawString(42,24,'Biswajit Jana | Finding Earth 2.0 | Discussion report; not peer reviewed');c.drawRightString(A4[0]-42,24,f'{doc.page} / 2')
    dest=ROOT/'output/pdf/Moving_Observer_Brief.pdf'
    SimpleDocTemplate(str(dest),pagesize=A4,rightMargin=42,leftMargin=42,topMargin=33,bottomMargin=48,title='Does a moving viewpoint change the exoplanet sky?',author='Biswajit Jana').build(story,onFirstPage=footer,onLaterPages=footer)
    assert len(PdfReader(dest).pages)==2,'Brief must be exactly two pages'
    print('Updated two-page brief')

if __name__=='__main__':make_pdf()
