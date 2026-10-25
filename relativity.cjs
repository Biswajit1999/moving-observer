/* Order-reduced Einstein–Infeld–Hoffmann 1PN point-mass equations.
   Derived from the published PPN equations (beta=gamma=1), not a full-GR solver.
   Units AU, day, GM in AU^3/day^2. Coordinates: barycentric J2000 ecliptic.
*/
const input=require('./data/relativity-horizons.json'),SS=require('./solar-system.cjs');
const AU=149597870.7,DAY=86400,C=299792.458*DAY/AU;
const names=['Sun',...SS.names,'Moon'],mu=names.map(n=>(n==='Earth'?398600.435507:n==='Moon'?4902.800118:SS.GM[n])*DAY**2/AU**3),radii=names.map(n=>(n==='Moon'?1737.4:SS.radiusKm[n])/AU);
const initial=Float64Array.from(names.flatMap(n=>input.bodies[n].states[0].slice(1)));
function acceleration(y,masses=mu,pn=true,c=C){
 const n=masses.length,a=new Float64Array(n*3),U=new Float64Array(n),dist=new Float64Array(n*n);
 for(let i=0;i<n;i++)for(let j=i+1;j<n;j++){
  const k=6*i,l=6*j,dx=y[k]-y[l],dy=y[k+1]-y[l+1],dz=y[k+2]-y[l+2],r2=dx*dx+dy*dy+dz*dz,r=Math.sqrt(r2);
  if(!Number.isFinite(r)||r<1e-12)throw Error('Invalid or colliding point-mass state');
  dist[i*n+j]=dist[j*n+i]=r;U[i]+=masses[j]/r;U[j]+=masses[i]/r;
  for(let d=0;d<3;d++){const f=(y[k+d]-y[l+d])/(r2*r);a[3*i+d]-=masses[j]*f;a[3*j+d]+=masses[i]*f;}
 }
 if(!pn)return a;
 const result=new Float64Array(a),c2=c*c;
 for(let i=0;i<n;i++)for(let j=0;j<n;j++)if(i!==j){
  const k=6*i,l=6*j,r=dist[i*n+j],r3=r*r*r;let vi2=0,vj2=0,vivj=0,rvj=0,ra=0,b=0;
  for(let d=0;d<3;d++){
   const dr=y[k+d]-y[l+d],vi=y[k+3+d],vj=y[l+3+d];
   vi2+=vi*vi;vj2+=vj*vj;vivj+=vi*vj;rvj+=dr*vj;ra+=dr*a[3*j+d];b+=dr*(4*vi-3*vj);
  }
  // Newtonian accelerations inside 1/c² terms discard only 2PN and higher terms.
  const scalar=(4*U[i]+U[j]-vi2-2*vj2+4*vivj+1.5*rvj*rvj/(r*r)+.5*ra)/c2;
  for(let d=0;d<3;d++)result[3*i+d]+=masses[j]*((y[k+d]-y[l+d])*scalar/r3+(b*(y[k+3+d]-y[l+3+d])/r3+3.5*a[3*j+d]/r)/c2);
 }
 return result;
}
function derivative(y,masses,pn,c){const n=masses.length,out=new Float64Array(y.length),a=acceleration(y,masses,pn,c);for(let i=0;i<n;i++)for(let d=0;d<3;d++){out[6*i+d]=y[6*i+3+d];out[6*i+3+d]=a[3*i+d];}return out;}
function step(y,h,masses=mu,pn=true,c=C){
 const add=(v,k,f)=>Float64Array.from(v,(x,i)=>x+f*k[i]);
 const k1=derivative(y,masses,pn,c),k2=derivative(add(y,k1,h/2),masses,pn,c),k3=derivative(add(y,k2,h/2),masses,pn,c),k4=derivative(add(y,k3,h),masses,pn,c);
 return Float64Array.from(y,(x,i)=>x+h*(k1[i]+2*k2[i]+2*k3[i]+k4[i])/6);
}
function integrate(y,days,{h=.0625,masses=mu,pn=true,c=C}={}){
 if(!Number.isFinite(days)||days<0||!Number.isFinite(h)||h<=0)throw Error('Invalid integration interval');
 let t=0,s=new Float64Array(y);while(t<days-1e-10){const dt=Math.min(h,days-t);s=step(s,dt,masses,pn,c);t+=dt;}return s;
}
function clockOffsets(y){
 const q=mu.map((m,i)=>{let U=m/radii[i],v2=0;for(let j=0;j<mu.length;j++)if(j!==i)U+=mu[j]/Math.hypot(...[0,1,2].map(d=>y[6*i+d]-y[6*j+d]));for(let d=3;d<6;d++)v2+=y[6*i+d]**2;return (U+v2/2)/C**2;});
 const earth=q[names.indexOf('Earth')];return q.map(x=>(earth-x)*DAY*1e6);
}
function perihelionArcsecCentury(a=.387098,e=.20563,m=mu[0]){const perOrbit=6*Math.PI*m/(a*(1-e*e)*C*C),period=2*Math.PI*Math.sqrt(a*a*a/m);return perOrbit*206264.80624709636*36525/period;}
function shapiro(r1,r2,R,m=mu[0]){if(![r1,r2,R,m].every(Number.isFinite)||r1<=0||r2<=0||R<0||r1+r2<=R)throw Error('Nondegenerate exterior ray geometry required');return 2*m/C**3*Math.log((r1+r2+R)/(r1+r2-R))*DAY;}
function earthSignal(y,target){
 const earth=names.indexOf('Earth');if(!Number.isInteger(target)||target<0||target>=names.length)throw Error('Unknown signal target');
 if(target===earth)return {samePosition:true,blocked:false,delaySeconds:0};
 const ep=[0,1,2].map(d=>y[6*earth+d]-y[d]),tp=[0,1,2].map(d=>y[6*target+d]-y[d]),dr=tp.map((v,i)=>v-ep[i]),distance=Math.hypot(...dr);
 const u=Math.max(0,Math.min(1,-ep.reduce((s,v,i)=>s+v*dr[i],0)/distance**2)),impact=Math.hypot(...ep.map((v,i)=>v+u*dr[i]));
 if(target===0||impact<radii[0])return {blocked:true,delaySeconds:null};
 return {blocked:false,delaySeconds:shapiro(Math.hypot(...ep),Math.hypot(...tp),distance),lightTimeSeconds:distance/C*DAY};
}
module.exports={AU,DAY,C,names,mu,radii,initial,input,acceleration,step,integrate,clockOffsets,perihelionArcsecCentury,shapiro,earthSignal};
