const assert=require('node:assert/strict'),{GasDisk}=require('./gas-hydro.cjs');
function advance(s,t){while(s.time<t-1e-13)s.step(t-s.time);}
const uniform=new GasDisk({n:16,length:1,cs:1,vc:0,periodic:true,initial:'uniform'});advance(uniform,1);assert.ok(uniform.u.every((v,i)=>v===(i%3===0?1:0)));
console.log('PASS Uniform gas is preserved exactly');
function wave(n){const s=new GasDisk({n,length:1,cs:1,vc:0,periodic:true,initial:'uniform'}),eps=1e-6;for(let j=0;j<n;j++)for(let i=0;i<n;i++){const q=Math.sin(2*Math.PI*(i+.5)/n),k=3*(j*n+i);s.u[k]=1+eps*q;s.u[k+1]=eps*q;}s.initialMass=s.mass();advance(s,.2);let e=0;for(let j=0;j<n;j++)for(let i=0;i<n;i++)e+=Math.abs(s.u[3*(j*n+i)]-(1+eps*Math.sin(2*Math.PI*((i+.5)/n-.2))));assert.ok(Math.abs(s.diagnostics().massBudgetResidual)<1e-12);return e/(n*n*eps);}
const coarse=wave(32),fine=wave(64);assert.ok(fine<.65*coarse);console.log('PASS Acoustic wave converges with resolution; normalized L1 errors',coarse,fine);
const disk=new GasDisk();advance(disk,100);const d=disk.diagnostics();assert.ok(d.minDensity>0&&d.maxSpeedKmS<500);assert.ok(Math.abs(d.massBudgetResidual)<1e-11);console.log('PASS 100 Myr disk remains positive and accounts for boundary mass flux',d);
const x=4,y=7,t=23,h=1e-4,K=require('./gas-hydro.cjs').K;
function phi(x,y){const r=x*x+y*y,a=-40*K*t;return .5*disk.vc**2*Math.log(r+1)+disk.bar*disk.vc**2*25*((x*x-y*y)*Math.cos(2*a)+2*x*y*Math.sin(2*a))/(r+25)**2;}
const force=disk.force(x,y,t);assert.ok(Math.abs(force[0]+(phi(x+h,y)-phi(x-h,y))/(2*h))<1e-10);assert.ok(Math.abs(force[1]+(phi(x,y+h)-phi(x,y-h))/(2*h))<1e-10);console.log('PASS Applied acceleration matches the analytic potential gradient');
console.log('4 hydrodynamics validation groups passed; not an observational validation');
