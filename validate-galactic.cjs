const assert=require('node:assert/strict'),fs=require('node:fs');
const D=require('./dynamics.cjs'),P=require('./physics2026.cjs'),G=require('./galactic-clock.cjs');
const results=[];
function test(name,fn){const evidence=fn();results.push({name,pass:true,...evidence});}
test('Century and Galactic clocks share initial state and century endpoint',()=>{
 assert.deepEqual(G.at(0),G.initial);
 const century=P.start.map((x,i)=>x+P.sun(100)[i]/P.KPC_AU);
 const differenceAU=D.separation(G.at(.0001),century)*P.KPC_AU;
 assert(differenceAU<.001);return {differenceAU};
});
test('Energy and axial angular momentum conserved across 250 Myr',()=>{
 const e0=D.energy(G.initial),lz=s=>s[0]*s[4]-s[1]*s[3],l0=lz(G.initial);
 let energyFraction=0,angularMomentumFraction=0;
 for(let t=0;t<=250;t+=.1){const s=G.at(t);energyFraction=Math.max(energyFraction,Math.abs((D.energy(s)-e0)/e0));angularMomentumFraction=Math.max(angularMomentumFraction,Math.abs((lz(s)-l0)/l0));}
 assert(energyFraction<1e-7);assert(angularMomentumFraction<1e-10);return {energyFraction,angularMomentumFraction};
});
test('Half-step integration converges across the full interval',()=>{
 const fine=D.orbit(G.initial,250,.005,.1);let maxPositionDifferencePc=0;
 for(let i=0;i<fine.length/6;i++)maxPositionDifferencePc=Math.max(maxPositionDifferencePc,D.separation(G.at(i*.1),fine.slice(i*6,i*6+6))*1000);
 assert(maxPositionDifferencePc<.01);return {maxPositionDifferencePc};
});
test('Fixed reference, travelled distance and orbital geometry',()=>{
 const fixed=[...G.reference];let previous=0,angle=0;
 for(let t=0;t<=250;t+=.5){const m=G.metrics(t);assert(m.travelKpc>=previous);assert(m.angleDeg>=angle);assert(m.separationKpc<=m.travelKpc+1e-7);previous=m.travelKpc;angle=m.angleDeg;}
 assert.deepEqual(G.reference,fixed);
 const half=G.metrics(G.period/2),orbit=G.metrics(G.period);
 assert(Math.abs(half.separationKpc-16.4)<.1);assert(orbit.separationKpc<.1);assert(orbit.travelKpc>51&&orbit.travelKpc<52);
 return {nominalPeriodMyr:G.period,halfOrbitSeparationKpc:half.separationKpc,nearOneOrbit:orbit};
});
test('Endpoints, finite output and domain guards',()=>{
 for(const t of [0,.0001,.009999999,216.214282,249.99999,250])assert(G.at(t).every(Number.isFinite));
 assert.equal(G.trail.length,2501);assert.deepEqual(G.trail.at(-1),G.at(250).slice(0,3));
 for(const t of [-1,250.01,NaN,Infinity])assert.throws(()=>G.at(t));return {trailSamples:G.trail.length};
});
test('Browser-exported Galactic CSV matches all model samples',()=>{
 const lines=fs.readFileSync(__dirname+'/Moving_Observer_Galactic_250Myr.csv','utf8').split(/\r?\n/).filter(x=>x&&!x.startsWith('#'));
 assert.equal(lines.length,502);
 for(let i=0;i<=500;i++){
  const t=i*.5,m=G.metrics(t),expected=[t,...m.state.slice(0,3),...m.state.slice(3).map(v=>v/D.K),...G.reference,m.separationKpc,m.travelKpc,m.angleDeg],row=lines[i+1].split(',').map(Number);
  assert.equal(row.length,13);row.forEach((x,j)=>assert(Number.isFinite(x)&&Math.abs(x-expected[j])<1e-8));
 }
 return {rows:501,numericFields:6513};
});
fs.writeFileSync(__dirname+'/validation-galactic.json',JSON.stringify({scope:'Numerical consistency of illustrative 250 Myr model; not observational validation',results},null,2)+'\n');
console.log('Passed '+results.length+' Galactic clock checks');
