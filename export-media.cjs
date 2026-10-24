const fs=require('node:fs'),P=require('./physics2026.cjs'),L=require('./lunar.cjs'),SS=require('./solar-system.cjs'),Grav=require('./gravity.cjs'),E=require('./environment.cjs');
fs.mkdirSync('tmp/media',{recursive:true});
const names=['Sun',...SS.names,'Moon'],times=Array.from({length:1001},(_,i)=>i*3/1000),raw=times.map(t=>L.state(t)),origin=SS.reflex(0),trajectories={};
for(const name of names){trajectories[name]={galactic:times.map((t,i)=>P.add(P.sub(P.sun(t),origin),raw[i][name])),comoving:times.map((t,i)=>P.sub(P.add(P.sub(P.sun(t),origin),raw[i][name]),P.velocity.map(v=>v*.98*t)))};}
const lunar=Array.from({length:361},(_,i)=>L.relative(i/360*L.periodYears).map(x=>x/L.radiusAU));
fs.writeFileSync('tmp/media/model.json',JSON.stringify({author:'Biswajit Jana',version:'7.1',times,names,trajectories,lunar,colors:{...SS.colors,Moon:0xbfc7d0},clock400:Grav.relativistic('Earth',400,'circular'),clock20200:Grav.relativistic('Earth',20200,'circular'),density:E.history,localDensity:E.localDensity}));
console.log('Exported scientific media coordinates directly from project modules');
