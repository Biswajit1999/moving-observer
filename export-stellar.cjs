const fs=require('node:fs'),S=require('./stellar-motion.cjs'),G=require('./galactic-clock.cjs');
let csv='# Proxima: constant relative velocity, historical Kervella et al 2017 inputs; not a precision encounter forecast\nyears_from_2026,distance_ly,radial_kms,relative_speed_kms,relative_x_pc,relative_y_pc,relative_z_pc,flux_ratio,angular_separation_ratio\n';
for(let t=-50000;t<=100000;t+=100){const m=S.proxima(t);csv+=[t,m.distanceLy,m.radialKmS,m.speedKmS,...m.rPc,m.fluxRatio,m.angularSeparationRatio].map(v=>v.toFixed(9)).join(',')+'\n';}
fs.writeFileSync(__dirname+'/Proxima_relative_motion.csv',csv);
const tracers=S.tracers().map(h=>({name:h.name,type:'synthetic; not a catalogue star',initialStateKpcKpcPerMyr:h.initial,offsetFromSunKpc:h.offset,peculiarVelocityKmS:h.peculiar,initial:S.relative(h.at(0),G.at(0)),at250Myr:S.relative(h.at(250),G.at(250))}));
fs.writeFileSync(__dirname+'/data/synthetic-tracers.json',JSON.stringify({frame:'Same as Galactic model; clockwise rotation viewed from north',tracers},null,2)+'\n');
fs.writeFileSync(__dirname+'/stellar-results.json',JSON.stringify({version:'5.0.0',proxima2026:S.proxima(0),proximaClosest:S.proxima(S.closestYears),proxima100kyr:S.proxima(100000),transitHalfWidthDeg:S.transit(0).halfAngleDeg,tracers},null,2)+'\n');
console.log('Exported Proxima CSV, assumptions and derived results');
