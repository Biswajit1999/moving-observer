"""Labelled conceptual Galactic map; no image generation or catalogue fit."""
from pathlib import Path
import numpy as np
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
from matplotlib.lines import Line2D

def make_map(destination):
    fig=plt.figure(figsize=(11,6.5),facecolor='#071421')
    ax=fig.add_axes([.015,.045,.63,.91],facecolor='#071421')
    ax.set_aspect('equal');ax.set_xlim(-18,18);ax.set_ylim(-18,18);ax.axis('off')
    # Deliberately schematic logarithmic arms, with explicit uncertainty text.
    names=['Perseus arm','Sagittarius-Carina arm','Scutum-Centaurus arm','Norma-Outer arm']
    colors=['#8cbad0','#c2a6d7','#e2bb89','#6a9cba']
    rng=np.random.default_rng(2026)
    for j,(name,color) in enumerate(zip(names,colors)):
        theta=np.linspace(-2.6,3.5,900)+j*np.pi/2
        r=3*np.exp(.25*(theta+2.6-j*np.pi/2));x=r*np.cos(theta);y=r*np.sin(theta)
        for lw,alpha in [(18,.035),(10,.055),(4,.16),(1.8,.8)]:ax.plot(x,y,c=color,lw=lw,alpha=alpha)
        # Illustrative density texture, not individual catalogue stars.
        picks=rng.integers(0,len(x),3000);scatter=.12+.025*r[picks]
        ax.scatter(x[picks]+rng.normal(0,scatter),y[picks]+rng.normal(0,scatter),s=rng.uniform(.08,1.1,len(picks)),c=color,alpha=.2,linewidths=0,zorder=0)
    xx,yy=np.meshgrid(np.linspace(-18,18,400),np.linspace(-18,18,400))
    bulge=np.exp(-((xx/2.1)**2+(yy/3.7)**2));rgba=np.zeros((400,400,4));rgba[:,:,:3]=[1,.77,.42];rgba[:,:,3]=bulge*.8
    ax.imshow(rgba,extent=[-18,18,-18,18],origin='lower',zorder=1)
    a=np.linspace(0,2*np.pi,401);ax.plot(8.2*np.cos(a),8.2*np.sin(a),'--',c='#f5cf78',lw=1.2,alpha=.85)
    # Clockwise motion in the project's fixed x/y convention: initial (0,-8.2).
    degrees_per_myr=233*.0010227121650537077/8.2*180/np.pi
    for angle,label,color,xytext in [(-90,'A · TODAY\n2026','#f5cf78',(2,-12)),(-90-25*degrees_per_myr,'B · FUTURE\n+25 million years','#ff998d',(-13,-13.4)),(-90-50*degrees_per_myr,'C · LATER FUTURE\n+50 million years','#71d7ee',(-16,3.3))]:
        angle=np.deg2rad(angle);xy=(8.2*np.cos(angle),8.2*np.sin(angle));ax.scatter(*xy,s=80,c=color,edgecolors='#071421',lw=1.6,zorder=9)
        ax.annotate(label,xy,xytext=xytext,fontsize=10,color=color,weight='bold',arrowprops={'arrowstyle':'-','color':color,'lw':.8},zorder=10)
    for ang in [-108,-151]:
        a1=np.deg2rad(ang+5);a2=np.deg2rad(ang-5);ax.annotate('',(8.2*np.cos(a2),8.2*np.sin(a2)),(8.2*np.cos(a1),8.2*np.sin(a1)),arrowprops={'arrowstyle':'->','color':'#f5cf78','lw':2})
    ax.scatter(0,0,marker='+',s=130,c='white',zorder=9);ax.annotate('GALACTIC CENTRE',(0,0),xytext=(2.1,2.9),fontsize=10,color='white',arrowprops={'arrowstyle':'-','color':'white'})
    a=np.linspace(-1.75,-1.25,90);r=np.linspace(8,8.6,90);ax.plot(r*np.cos(a),r*np.sin(a),c='#c9ead7',lw=3)
    ax.annotate('Orion / Local spur',(2,-8.1),xytext=(4.1,-5),fontsize=9,color='#c9ead7',arrowprops={'arrowstyle':'-','color':'#c9ead7'})
    ax.text(-17,16.3,'TOP-DOWN · CONCEPTUAL GALACTIC MAP',color='white',fontsize=10,weight='bold')
    ax.plot([-16,-11],[14.7,14.7],c='white',lw=2);ax.text(-13.5,13.3,'5 kpc ≈ 16,300 ly',ha='center',color='#c5d6e3',fontsize=8)
    # Distinct target motions are examples; they are not frozen stars.
    for x,y,dx,dy in [(10,5,1.4,-1),(9,-9,-1.1,-1.3),(-11,8,1.3,1.1)]:
        ax.scatter(x,y,s=10,color='white');ax.annotate('',(x+dx,y+dy),(x,y),arrowprops={'arrowstyle':'->','color':'#d6e3eb','lw':1})
    leg=fig.add_axes([.66,.49,.32,.45]);leg.axis('off')
    leg.text(0,1,'READING THE MAP',color='white',fontsize=12,weight='bold',va='top')
    for i,(name,col) in enumerate(zip(names,colors)):
        y=.84-i*.11;leg.plot([0,.12],[y,y],c=col,lw=3);leg.text(.17,y,name,color='#dce7ef',fontsize=10,va='center')
    leg.text(0,.33,'Dashed gold: Solar circular path\nRadius 8.2 kpc; speed 233 km/s\nWhite arrows: example stellar motions',color='#dce7ef',fontsize=9,linespacing=1.7,va='top')
    leg.text(0,.08,'Arm shapes and positions are schematic.\nA/B/C follow an ideal circular orbit.\nNot a catalogue map or arm-crossing forecast.',color='#a5bdce',fontsize=8.5,linespacing=1.5,va='top');leg.set_xlim(0,1);leg.set_ylim(-.14,1.04)
    side=fig.add_axes([.70,.14,.26,.24],facecolor='#071421')
    x=np.linspace(-16,16,321);z=.7*np.maximum(0,(abs(x)-8.4)/5.6)**2*np.sign(x)
    side.axhline(0,c='#829aae',ls='--',lw=1);side.plot(x,z,c='#f5cf78',lw=2);side.set(xlim=(-16,16),ylim=(-1.5,1.5),xticks=[-14,0,14],yticks=[-.7,0,.7])
    side.set_title('EDGE-ON WARP SECTION',color='white',fontsize=10,pad=10);side.set_xlabel('Distance across disk (kpc)',color='#c5d6e3',fontsize=8);side.set_ylabel('Height (kpc)',color='#c5d6e3',fontsize=8);side.tick_params(colors='#c5d6e3',labelsize=8)
    for sp in side.spines.values():sp.set_color('#3c596d')
    fig.text(.68,.02,'Vertical axis enlarged; kinematic illustration [10].',color='#a5bdce',fontsize=8)
    fig.savefig(destination,dpi=240,facecolor=fig.get_facecolor());plt.close(fig)

if __name__=='__main__':
    dest=Path(__file__).parent/'output/figures/Moving_Observer_Galactic_Map.png';dest.parent.mkdir(parents=True,exist_ok=True);make_map(dest)
