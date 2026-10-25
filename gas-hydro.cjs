// First-order finite-volume isothermal Euler experiment in a prescribed 2D potential.
// Units: kpc, Myr, arbitrary surface-density unit. Not MHD, self-gravity or a fitted Galaxy.
const K=.0010227121650537077;
class GasDisk {
 constructor({n=64,length=32,cs=10*K,vc=233*K,bar=.1,periodic=false,initial='disk'}={}){
  if(n<8||n>256||length<=0||cs<=0)throw Error('Invalid gas grid');
  Object.assign(this,{n,length,dx:length/n,cs,vc,bar,periodic,time:0,netMassIn:0});this.u=new Float64Array(n*n*3);
  for(let j=0;j<n;j++)for(let i=0;i<n;i++){const x=(i+.5)*this.dx-length/2,y=(j+.5)*this.dx-length/2,r=Math.hypot(x,y),rho=initial==='uniform'?1:Math.exp(-r/4),speed=initial==='uniform'?0:Math.sqrt(Math.max(0,vc*vc*r*r/(r*r+1)-cs*cs*r/4)),k=3*(j*n+i);this.u[k]=rho;this.u[k+1]=rho*speed*y/Math.max(r,1e-12);this.u[k+2]=-rho*speed*x/Math.max(r,1e-12);}
  this.initialMass=this.mass();
 }
 mass(){let m=0;for(let k=0;k<this.u.length;k+=3)m+=this.u[k];return m*this.dx*this.dx;}
 force(x,y,t=this.time){const r2=x*x+y*y,a=-40*K*t,c=Math.cos(2*a),s=Math.sin(2*a),q=(x*x-y*y)*c+2*x*y*s,d=r2+25,A=this.bar*this.vc*this.vc*25;return [-this.vc*this.vc*x/(r2+1)-A*((2*x*c+2*y*s)/d**2-4*x*q/d**3),-this.vc*this.vc*y/(r2+1)-A*((-2*y*c+2*x*s)/d**2-4*y*q/d**3)];}
 kick(dt,t){if(!this.vc)return;for(let j=0;j<this.n;j++)for(let i=0;i<this.n;i++){const k=3*(j*this.n+i),a=this.force((i+.5)*this.dx-this.length/2,(j+.5)*this.dx-this.length/2,t);this.u[k+1]+=dt*this.u[k]*a[0];this.u[k+2]+=dt*this.u[k]*a[1];}}
 stableStep(){let ax=0,ay=0;for(let k=0;k<this.u.length;k+=3){ax=Math.max(ax,Math.abs(this.u[k+1]/this.u[k])+this.cs);ay=Math.max(ay,Math.abs(this.u[k+2]/this.u[k])+this.cs);}return .3*this.dx/(ax+ay);}
 step(maxDt=Infinity){const dt=Math.min(maxDt,this.stableStep());if(!(dt>0&&Number.isFinite(dt)))throw Error('Invalid time step');this.kick(dt/2,this.time);const {n,u,dx,cs}=this,next=u.slice(),coef=dt/dx;
  const index=(i,j)=>3*((this.periodic?(j+n)%n:Math.max(0,Math.min(n-1,j)))*n+(this.periodic?(i+n)%n:Math.max(0,Math.min(n-1,i))));
  const flux=(l,r,axis)=>{const vl=u[l+axis+1]/u[l],vr=u[r+axis+1]/u[r],a=Math.max(Math.abs(vl),Math.abs(vr))+cs;return [0,1,2].map(q=>.5*(u[l+q]*vl+u[r+q]*vr+(q===axis+1?cs*cs*(u[l]+u[r]):0))-.5*a*(u[r+q]-u[l+q]));};
  let boundary=0;
  for(let j=0;j<n;j++)for(let face=0;face<=n;face++){const f=flux(index(face-1,j),index(face,j),0);for(let q=0;q<3;q++){if(face>0)next[index(face-1,j)+q]-=coef*f[q];if(face<n)next[index(face,j)+q]+=coef*f[q];}if(face===0)boundary+=f[0];if(face===n)boundary-=f[0];}
  for(let i=0;i<n;i++)for(let face=0;face<=n;face++){const f=flux(index(i,face-1),index(i,face),1);for(let q=0;q<3;q++){if(face>0)next[index(i,face-1)+q]-=coef*f[q];if(face<n)next[index(i,face)+q]+=coef*f[q];}if(face===0)boundary+=f[0];if(face===n)boundary-=f[0];}
  this.u=next;this.time+=dt;this.kick(dt/2,this.time);this.netMassIn+=boundary*dt*dx;
  for(let k=0;k<next.length;k+=3)if(!(next[k]>0&&Number.isFinite(next[k]+next[k+1]+next[k+2])))throw Error('Gas solver lost positivity; stop rather than silently clip mass');return dt;
 }
 diagnostics(){let min=Infinity,max=0,maxSpeed=0;for(let k=0;k<this.u.length;k+=3){min=Math.min(min,this.u[k]);max=Math.max(max,this.u[k]);maxSpeed=Math.max(maxSpeed,Math.hypot(this.u[k+1],this.u[k+2])/this.u[k]/K);}return {timeMyr:this.time,mass:this.mass(),massBudgetResidual:(this.mass()-this.initialMass-this.netMassIn)/this.initialMass,minDensity:min,maxDensity:max,maxSpeedKmS:maxSpeed};}
}
module.exports={GasDisk,K};
