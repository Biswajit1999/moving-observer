/* kpc, Myr, Msun. Independent deterministic Galactic test-particle integrator. */
const K=0.0010227121650537077,G=4.30091e-6*K*K;
const M={disk:6.8e10,a:3,b:.28,bulge:5e9,c:.5,haloCore:12,R0:8.2,V0:233};
const r=M.R0,diskV2=G*M.disk*r*r/(r*r+(M.a+M.b)**2)**1.5,bulgeV2=G*M.bulge*r*r/(r*r+M.c*M.c)**1.5;
M.haloV2=((M.V0*K)**2-diskV2-bulgeV2)*(r*r+M.haloCore**2)/(r*r);
function potential(p){const [x,y,z]=p,R2=x*x+y*y,s=R2+z*z,B=Math.sqrt(z*z+M.b*M.b);return -G*M.bulge/Math.sqrt(s+M.c*M.c)-G*M.disk/Math.sqrt(R2+(M.a+B)**2)+M.haloV2/2*Math.log(s+M.haloCore**2);}
function force(p){const [x,y,z]=p,R2=x*x+y*y,s=R2+z*z,B=Math.sqrt(z*z+M.b*M.b),b=-G*M.bulge/(s+M.c*M.c)**1.5,h=-M.haloV2/(s+M.haloCore**2),d=-G*M.disk/(R2+(M.a+B)**2)**1.5;return [(b+h+d)*x,(b+h+d)*y,(b+h)*z+d*(M.a+B)*z/B];}
function circular(R){return Math.sqrt(-R*force([R,0,0])[0]);}
function energy(s){return potential(s.slice(0,3))+(s[3]*s[3]+s[4]*s[4]+s[5]*s[5])/2;}
function step(s,h){const a=force(s),v=s.slice(3).map((u,i)=>u+a[i]*h/2),p=s.slice(0,3).map((u,i)=>u+v[i]*h),b=force(p);return [...p,...v.map((u,i)=>u+b[i]*h/2)];}
function orbit(s,horizon=300,dt=.01,sample=.1){const n=Math.round(horizon/sample),sub=Math.round(sample/dt),h=sample/sub,out=new Float64Array((n+1)*6);out.set(s);for(let i=1;i<=n;i++){for(let j=0;j<sub;j++)s=step(s,h);out.set(s,i*6);}return out;}
function at(data,t){const raw=Math.max(0,Math.min(data.length/6-1,t/.1)),i=Math.min(Math.floor(raw),data.length/6-2),f=raw-i;return Array.from({length:6},(_,j)=>data[i*6+j]*(1-f)+data[(i+1)*6+j]*f);}
const sun=[8.2,0,.02,0,233*K,7*K];
const hosts=[{name:'Host A',p:[8.3,.15,.04],dv:[-8,4,2]},{name:'Host B',p:[7.7,-.4,-.08],dv:[6,-10,4]},{name:'Host C',p:[9,.35,.12],dv:[-12,8,-3]}];
function hostState(h){const R=Math.hypot(h.p[0],h.p[1]),v=circular(R);return [...h.p,-v*h.p[1]/R+h.dv[0]*K,v*h.p[0]/R+h.dv[1]*K,h.dv[2]*K];}
function probe(kind){if(kind==='release')return [...sun];if(kind==='escape')return [...sun.slice(0,3),sun[3]+15*K,sun[4],sun[5]];if(kind==='cancel')return [...sun.slice(0,3),0,0,0];throw Error('Unknown probe');}
function separation(a,b){return Math.hypot(a[0]-b[0],a[1]-b[1],a[2]-b[2]);}
function losAngle(observerA,observerB,target){const a=target.slice(0,3).map((v,i)=>v-observerA[i]),b=target.slice(0,3).map((v,i)=>v-observerB[i]),cross=[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]];return Math.atan2(Math.hypot(...cross),a.reduce((s,v,i)=>s+v*b[i],0))*180/Math.PI;}
module.exports={K,G,M,potential,force,circular,energy,step,orbit,at,sun,hosts,hostState,probe,separation,losAngle};
