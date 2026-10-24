const fs=require('node:fs'),assert=require('node:assert/strict'),S=require('./stellar-motion.cjs'),G=require('./galactic-clock.cjs'),D=require('./dynamics.cjs');
const results=[];function test(name,fn){results.push({name,pass:true,...fn()});}
const near=(a,b,t=1e-9)=>assert(Math.abs(a-b)<t,`${a} differs from ${b}`);
test('Astrometry independently reconstructs radial and transverse speed',()=>{
 const d=S.input,n=S.scale(S.original.r,1/S.norm(S.original.r)),radial=S.dot(n,S.original.v),tangent=Math.hypot(d.pm_ra_cosdec_mas_yr,d.pm_dec_mas_yr)*149597870.7/31557600/d.parallax_mas;
 near(S.norm(S.original.r),1000/d.parallax_mas);near(radial,d.radial_velocity_kms);near(S.norm(S.original.v)**2,radial**2+tangent**2,1e-8);
 return {radialAtInputEpochKmS:radial,transverseAtInputEpochKmS:tangent};
});
test('Closest approach agrees with independent scalar geometry',()=>{
 const d=S.norm(S.original.r),v=S.input.radial_velocity_kms,vt=Math.hypot(S.input.pm_ra_cosdec_mas_yr,S.input.pm_dec_mas_yr)*149597870.7/31557600/S.input.parallax_mas;
 const t=-d*v/(v*v+vt*vt)/S.KMS_PC_YR-(2026-S.input.astrometric_epoch_jyear),minimum=d*vt/Math.hypot(v,vt),m=S.proxima(S.closestYears);
 near(S.closestYears,t,1e-7);near(m.distancePc,minimum);near(m.radialKmS,0);assert(S.proxima(t-1000).distancePc>minimum);assert(S.proxima(t+1000).distancePc>minimum);
 return {closestYears:t,minimumLightYears:m.distanceLy};
});
test('Epoch propagation, perspective radial change and domain bounds',()=>{
 near(S.proxima(0).distanceLy,4.240001362155811,1e-10);assert(S.proxima(0).radialKmS<0);assert(S.proxima(100000).radialKmS>0);
 const m=S.proxima(50000),derivative=(S.proxima(50001).distancePc-S.proxima(49999).distancePc)/2/S.KMS_PC_YR;near(derivative,m.radialKmS,1e-6);
 for(const t of [-50001,100001,NaN,Infinity])assert.throws(()=>S.proxima(t));return {};
});
test('A shared velocity does not change relative position',()=>{
 const a=[1,2,3],b=[4,5,6],v=[.01,-.02,.03],w=[-.04,.05,-.06],common=[20,30,40],t=100;
 const original=S.sub(S.add(a,S.scale(v,t)),S.add(b,S.scale(w,t))),boosted=S.sub(S.add(a,S.scale(S.add(v,common),t)),S.add(b,S.scale(S.add(w,common),t)));
 original.forEach((x,i)=>near(x,boosted[i],1e-10));const q=S.relative([0,0,0,1,2,3],[1,0,0,1,2,3]);near(q.relativeSpeedKmS,0);return {};
});
test('Flux, angular separation and transit boundaries have correct limits',()=>{
 const now=S.proxima(0),m=S.proxima(S.closestYears);near(now.fluxRatio,1);near(m.fluxRatio,m.angularSeparationRatio**2);assert(S.transit(0).possible);assert(!S.transit(1).possible);const edge=S.transit(0).halfAngleDeg;assert(S.transit(edge-1e-6).possible);assert(!S.transit(edge+1e-6).possible);near(S.transit(-.4).impactParameter,S.transit(.4).impactParameter);
 return {solarEarthTransitHalfWidthDeg:edge};
});
test('Synthetic tracers conserve quantities and agree at half timestep',()=>{
 return {tracers:S.tracers().map(h=>{const e0=D.energy(h.initial),lz=s=>s[0]*s[4]-s[1]*s[3],l0=lz(h.initial);let maxEnergyFraction=0,maxLzFraction=0;for(let t=0;t<=250;t+=.5){const s=h.at(t);maxEnergyFraction=Math.max(maxEnergyFraction,Math.abs((D.energy(s)-e0)/e0));maxLzFraction=Math.max(maxLzFraction,Math.abs((lz(s)-l0)/l0));}assert(maxEnergyFraction<1e-7);assert(maxLzFraction<1e-10);const fine=D.orbit(h.initial,250,.005,.1),end=fine.slice(-6),differencePc=D.separation(end,h.at(250))*1000;assert(differencePc<.01);assert.throws(()=>h.at(-1));return {name:h.name,maxEnergyFraction,maxLzFraction,halfStepEndpointDifferencePc:differencePc};})};
});
test('Published report renders mathematical markup and provides actual report navigation',()=>{
 const html=fs.readFileSync(__dirname+'/index.html','utf8'),report=fs.readFileSync(__dirname+'/Report.html','utf8');assert(html.includes('id="reportOpen"'));assert(html.includes('id="reportPage"'));assert(html.includes('id="proxTime"'));assert((report.match(/<math /g)||[]).length>=14);assert(!html.includes('/*__REPORT_'));assert(!report.includes('EQUATION_'));assert(!/<script[^>]+src=["']https?:/i.test(report));return {mathBlocks:(report.match(/<math /g)||[]).length};
});
const output={version:require('./package.json').version,scope:'Numerical and artifact checks, not a forecast uncertainty estimate',results,proxima2026:S.proxima(0),proximaClosest:S.proxima(S.closestYears)};
fs.writeFileSync(__dirname+'/validation-stellar.json',JSON.stringify(output,null,2)+'\n');console.log(`Passed ${results.length} stellar-motion checks`);
