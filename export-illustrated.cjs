const fs=require('node:fs'),G=require('./galactic-clock.cjs'),S=require('./stellar-motion.cjs'),E=require('./environment.cjs'),Gr=require('./gravity.cjs'),J=require('./journey.cjs');
fs.mkdirSync('tmp/illustrated',{recursive:true});
fs.writeFileSync('tmp/illustrated/data.json',JSON.stringify({
 orbit:Array.from({length:501},(_,i)=>({t:i*.5,...G.metrics(i*.5)})),
 density:E.history,speeds:[5,8.2,12,16].map(E.circular),
 proxima:Array.from({length:401},(_,i)=>S.proxima(i*100)),proximaClosest:S.proxima(S.closestYears),
 clocks:Array.from({length:241},(_,i)=>({alt:i*100,...Gr.relativistic('Earth',i*100,'circular')})),
 journey:J.atFraction(1),research:require('./data/research-results.json')
}));
console.log('Exported illustrated-report data from numerical modules');
