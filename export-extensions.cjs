const fs=require('node:fs'),P=require('./physics2026.cjs'),SS=require('./solar-system.cjs'),Grav=require('./gravity.cjs'),G=require('./galactic-clock.cjs'),R=require('./research.cjs');
const rows=R.readCatalogue(),sum=a=>a.reduce((x,y)=>x+y,0),median=a=>[...a].sort((x,y)=>x-y)[Math.floor(a.length/2)];
const epochs=[10,100,1000,10000].map(years=>{const q=rows.map(r=>R.evaluate(r,years));return {years,motionScore:sum(q.map(x=>x.motion)),initialScore:sum(q.map(x=>x.c00)),motionPercent:100*sum(q.map(x=>x.motion))/sum(q.map(x=>x.c00)),medianAbsoluteDistanceFraction:median(q.map(x=>Math.abs(x.d1/x.d0-1))),approaching:q.filter(x=>x.d1<x.d0).length,receding:q.filter(x=>x.d1>x.d0).length};});
const offsets=Array.from({length:1001},(_,i)=>P.norm(SS.reflex(i/10))*P.AU_KM);
const clocks=['Sun',...SS.names].map(name=>({body:name,...Grav.isolated(name,0)}));
const solarAtAU=Grav.isolated('Sun',P.AU_KM-SS.radiusKm.Sun);
const output={model:'v7 explanatory extensions; nominal sweeps are not mission forecasts',solarReflex:{minOffsetKm:Math.min(...offsets),maxOffsetKm:Math.max(...offsets),samples:1001},solarCentury:{travelAU:P.metrics(100).sunDrift,departureFromInitialTangentAU:P.norm(P.sub(P.sun(100),P.velocity.map(x=>x*100)))},galacticHeightPc:{min:Math.min(...G.trail.map(p=>1000*p[2])),max:Math.max(...G.trail.map(p=>1000*p[2]))},isolatedSurfaceClocks:clocks,solarFieldAt1AU:solarAtAU,catalogueTimeSweep:epochs};
fs.writeFileSync(__dirname+'/data/extensions-results.json',JSON.stringify(output,null,2)+'\n');console.log(JSON.stringify(output,null,2));
