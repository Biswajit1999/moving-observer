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
    import runpy
    runpy.run_path(str(ROOT/'brief-report.py'),run_name='__main__')


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
