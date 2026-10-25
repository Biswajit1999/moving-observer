"""Static scientific views of the model inputs, not a browser-rendering test."""
from pathlib import Path
import json, subprocess, numpy as np
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
ROOT=Path(__file__).resolve().parent
sample=json.loads(subprocess.check_output(['node','-e',"console.log(JSON.stringify(require('./milky-way-model.cjs').sample(60000)))"],cwd=ROOT,text=True))
cat=json.loads((ROOT/'data/milky-way/masers.json').read_text())
arms=json.loads(subprocess.check_output(['node','-e',"const M=require('./milky-way-model.cjs');console.log(JSON.stringify(M.arms.map(a=>({name:a.name,points:Array.from({length:161},(_,i)=>M.armPoint(a,a.range[0]+i/160*(a.range[1]-a.range[0])))}))))"],cwd=ROOT,text=True))
p=np.array(sample['positions']).reshape(-1,3);colors=np.array(sample['colors']).reshape(-1,3);m=np.array([r['position'] for r in cat['rows']]);ink='#dce9f5';bg='#07111b'
plt.rcParams.update({'font.family':'DejaVu Sans','font.size':10,'text.color':ink,'axes.labelcolor':ink,'xtick.color':ink,'ytick.color':ink,'axes.edgecolor':'#586977'})
fig=plt.figure(figsize=(13,6),facecolor=bg)
ax=fig.add_subplot(121);ax.set_facecolor(bg);ax.scatter(p[:,0],p[:,1],s=.5,c=colors,alpha=.3,rasterized=True)
ax.scatter(m[:,0],m[:,1],s=9,c='#6fffe8',label='199 measured VLBI entries',zorder=3)
for i,a in enumerate(arms):
    pts=np.array(a['points']);ax.plot(pts[:,0],pts[:,1],color='#f5d9a6',lw=1,label='Published arm-fit segments' if i==0 else None)
ax.scatter([0],[0],marker='+',s=60,color='white',label='Galactic centre',zorder=4);ax.scatter([0],[-8.2],s=45,c='#ffc86a',label='Adopted Sun',zorder=4)
ax.set(xlim=(-16,16),ylim=(-16,16),xlabel='x (kpc)',ylabel='y (kpc)',title='Evidence and model · top view');ax.set_aspect('equal')
ax.legend(loc='upper left',facecolor=bg,edgecolor='#344654',labelcolor=ink,fontsize=8)
ax=fig.add_subplot(122,projection='3d');ax.set_facecolor(bg)
r=np.hypot(p[:,0],p[:,1]);phi=np.arctan2(p[:,1],p[:,0]);warp=.7*(np.maximum(0,r-8.4)/5.6)**2*np.sin(phi)
ax.scatter(p[:,0],p[:,1],p[:,2]+warp,s=.18,c=colors,alpha=.25,depthshade=False,rasterized=True)
ax.set(xlim=(-16,16),ylim=(-16,16),zlim=(-4,4),xlabel='x (kpc)',ylabel='y (kpc)',zlabel='z (kpc)',title='Synthetic stellar light · physical proportions')
ax.set_box_aspect((32,32,8));ax.view_init(elev=13,azim=-54);ax.grid(False)
for axis in (ax.xaxis,ax.yaxis,ax.zaxis):axis.pane.fill=False;axis.pane.set_edgecolor('#344654')
fig.text(.05,.06,'Cyan sources retain catalogue epochs. Background: sampled light, not measured individual stars.',fontsize=10)
fig.text(.05,.025,'Reid et al. (2019) arm geometry; Wegg et al. (2015) bar scale. Warp and light weights are model assumptions. Biswajit Jana · 2026',fontsize=9,color='#9db1c2')
fig.subplots_adjust(left=.06,right=.97,top=.91,bottom=.20,wspace=.14)
out=ROOT/'output/figures/Galaxy_Evidence_Model.png';fig.savefig(out,dpi=155,facecolor=bg,bbox_inches="tight",pad_inches=.2);print(out)
