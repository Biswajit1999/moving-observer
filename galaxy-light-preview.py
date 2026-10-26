"""Independent CPU projection of the volume equations; not a WebGL screenshot."""
from pathlib import Path
import subprocess
import numpy as np
from PIL import Image,ImageDraw,ImageFont
ROOT=Path(__file__).resolve().parent
raw=subprocess.check_output(['node','-e',"process.stdout.write(Buffer.from(require('./galaxy-light.cjs').makeLightMap().data))"],cwd=ROOT)
texture=np.frombuffer(raw,dtype=np.uint8).reshape(384,384,4)/255.
def sample(uv):
    xy=np.clip(uv*384-.5,0,383);ij=np.floor(xy).astype(int);hi=np.minimum(ij+1,383);w=xy-ij
    a=texture[ij[:,1],ij[:,0]]*(1-w[:,0,None])+texture[ij[:,1],hi[:,0]]*w[:,0,None]
    b=texture[hi[:,1],ij[:,0]]*(1-w[:,0,None])+texture[hi[:,1],hi[:,0]]*w[:,0,None]
    return a*(1-w[:,1,None])+b*w[:,1,None]
def render(camera,width=560,height=336):
    camera=np.array(camera,dtype=float);forward=-camera/np.linalg.norm(camera);right=np.cross(forward,[0,0,1]);right/=np.linalg.norm(right);up=np.cross(right,forward)
    xx,yy=np.meshgrid((np.arange(width)+.5)/width*2-1,1-(np.arange(height)+.5)/height*2)
    directions=forward+xx.reshape(-1,1)*right*np.tan(np.deg2rad(23))*width/height+yy.reshape(-1,1)*up*np.tan(np.deg2rad(23));directions/=np.linalg.norm(directions,axis=1)[:,None]
    a=(-np.array([17,17,5])-camera)/directions;b=(np.array([17,17,5])-camera)/directions
    start=np.maximum(0,np.min(np.stack([a,b]),axis=0).max(axis=1));end=np.max(np.stack([a,b]),axis=0).min(axis=1);valid=end>start
    step=np.maximum(0,end-start)/112;light=np.zeros((len(step),3));transmission=np.ones(len(step))
    for i in range(112):
        p=camera+directions*(start+(i+.5)*step)[:,None];r=np.linalg.norm(p[:,:2],axis=1);bend=.7*(np.maximum(0,r-8.4)/5.6)**2*np.sin(np.arctan2(p[:,1],p[:,0]));z=p[:,2]-bend
        tex=sample(p[:,:2]/34+.5);density=4*tex[:,:3]**2
        disk=density[:,0]*(np.exp(-abs(z)/.3)+.1*np.exp(-abs(z)/.9));bar=density[:,1]*np.exp(-.5*(z/(.22+.34*np.exp(-r*r/9)))**2);arm=density[:,2]*np.exp(-abs(z)/.12)
        radial=p[:,:2]+.001;radial/=np.linalg.norm(radial,axis=1)[:,None];lane=sample(p[:,:2]/34+.5+radial*.2/34)
        dust=4*lane[:,2]**2*np.exp(-abs(z)/.065)*(.25+1.7*lane[:,3]**2)
        emission=.36*disk[:,None]*[.64,.60,.53]+.48*bar[:,None]*[1,.72,.39]+.65*(arm*(.12+2.8*tex[:,3]**2))[:,None]*[.43,.62,.94]
        emission+=.18*(arm*np.maximum(0,(tex[:,3]-.65)/.35)**2)[:,None]*[1,.23,.36]
        extinction=.20*disk+.40*bar+.24*arm+.85*dust;absorbed=1-np.exp(-extinction*step)
        light+=(transmission*absorbed/np.maximum(extinction,.00001))[:,None]*emission;transmission*=1-absorbed
    alpha=(1-transmission)*valid;colour=1-np.exp(-light*3.2*1.12)
    srgb=np.where(colour<=.0031308,12.92*colour,1.055*colour**(1/2.4)-.055)
    final=srgb*valid[:,None]+np.array([4,7,13])/255*(1-alpha[:,None]);return Image.fromarray(np.uint8(np.clip(final.reshape(height,width,3),0,1)*255))
if __name__=='__main__':
    image=Image.new('RGB',(1120,435),(4,7,13));image.paste(render([32,-9,19]),(0,45));image.paste(render([.01,-.01,44]),(560,45))
    draw=ImageDraw.Draw(image);font=ImageFont.truetype('C:/Windows/Fonts/segoeui.ttf',20);small=ImageFont.truetype('C:/Windows/Fonts/segoeui.ttf',14)
    draw.text((22,12),'Stellar light and dust · oblique view',fill='#e9e0d2',font=font);draw.text((582,12),'Top view · illustrative far-side continuation',fill='#e9e0d2',font=font)
    draw.text((22,386),'Independent CPU model projection, not a website screenshot. Dust and light weights are illustrative.',fill='#9eacba',font=small)
    draw.text((22,409),'Orbital calculations and measured positions are unchanged.',fill='#9eacba',font=small)
    out=ROOT/'output/figures/Galaxy_Light_Preview.png';image.save(out);print(out)
