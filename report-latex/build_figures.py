"""Regenerate vector report figures from the existing project calculations.
Run node export-illustrated.cjs and node export-media.cjs from the repository first.
No browser screenshots or new physical model are introduced here.
"""
from pathlib import Path
import json, runpy
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
from matplotlib.lines import Line2D
from matplotlib.ticker import MaxNLocator

ROOT=Path(__file__).resolve().parent.parent
OUT=ROOT/'report-latex/images'
OUT.mkdir(exist_ok=True)
D=json.loads((ROOT/'tmp/illustrated/data.json').read_text())
BLUE='#183b50';TEAL='#237f85';GOLD='#aa7939';GRAY='#63727b'
plt.rcParams.update({'font.family':'DejaVu Sans','font.size':9,'pdf.fonttype':42,
 'axes.spines.top':False,'axes.spines.right':False,'axes.edgecolor':'#b9c7ce',
 'axes.labelcolor':BLUE,'text.color':BLUE,'xtick.color':GRAY,'ytick.color':GRAY,
 'grid.color':'#e0e8eb','figure.facecolor':'white'})
def save(fig,name):
 fig.savefig(OUT/(name+'.pdf'),bbox_inches='tight',pad_inches=.06,metadata={'Author':'Biswajit Jana','Creator':'Moving Observer numerical figures'})
 plt.close(fig)

fig,ax=plt.subplots(figsize=(7.1,2.05),layout='constrained')
keys=['c00','c10','c01','c11'];vals=[D['research']['sum'][k] for k in keys]
labels=['2026 / baseline','2126 / baseline','2026 / improved','2126 / improved']
ax.barh(range(4),vals,color=[BLUE,'#7694a3',TEAL,'#8ab8b8'],height=.52)
ax.set_yticks(range(4),labels);ax.invert_yaxis();ax.set_xlim(0,118)
ax.set_xlabel('Summed single-visit accessibility score')
for i,v in enumerate(vals):ax.text(v+1.2,i,f'{v:.5f}',va='center',fontsize=9)
ax.grid(axis='x',alpha=.65);ax.set_axisbelow(True);save(fig,'scores')

fig,axs=plt.subplots(1,2,figsize=(7.1,2.65),layout='constrained')
h=D['density'];axs[0].plot([x['timeMyr'] for x in h],[x['ratio'] for x in h],c=TEAL,lw=1.5)
axs[0].axhline(1,c=GRAY,ls=':',lw=.8);axs[0].set(xlabel='Million years after 2026',ylabel='Density / initial density',title='A  Smooth-density scenario',ylim=(.75,1.1))
h=D['proxima'];axs[1].plot([x['years']/1000 for x in h],[x['distanceLy'] for x in h],c=BLUE,lw=1.5)
q=D['proximaClosest'];axs[1].scatter([q['years']/1000],[q['distanceLy']],s=18,c=GOLD,zorder=4)
axs[1].annotate('3.10 ly at +26.7 kyr',(q['years']/1000,q['distanceLy']),xytext=(7,3.75),arrowprops={'arrowstyle':'-','color':GRAY},fontsize=8)
axs[1].set(xlabel='Thousand years after 2026',ylabel='Sun–Proxima distance (ly)',title='B  Constant-velocity extrapolation')
for ax in axs:ax.grid(alpha=.45)
save(fig,'neighbourhood')

media=runpy.run_path(str(ROOT/'create-share-media.py'))
fig=plt.figure(figsize=(7.1,2.65),facecolor='white')
for j,frame in enumerate(['galactic','comoving']):
 ax=fig.add_subplot(1,2,j+1,projection='3d');media['trajectories'](ax,frame,1,-45,False)
 ax.set_title('A  Full Galactic translation' if j==0 else 'B  98% co-moving frame',fontsize=9,pad=0)
 ax.tick_params(labelsize=7,pad=0)
 for axis in [ax.xaxis,ax.yaxis,ax.zaxis]:axis.set_major_locator(MaxNLocator(4))
 for axis in [ax.xaxis,ax.yaxis,ax.zaxis]:axis.label.set_size(7)
overrides={'Sun':'#95631c','Venus':'#aa7d32','Mercury':'#747777','Moon':'#8b6f95'}
handles=[Line2D([0],[0],color=overrides.get(n,col),lw=1.5,label=n) for n,col in media['COLORS'].items()]
fig.legend(handles=handles,loc='lower center',bbox_to_anchor=(.5,0),ncol=5,frameon=False,fontsize=7)
fig.subplots_adjust(left=.01,right=.99,bottom=.22,top=.89,wspace=.04)
save(fig,'paths')
print('Wrote three vector PDF charts')
