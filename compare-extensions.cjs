const fs=require('node:fs'),P=require('./physics2026.cjs'),SS=require('./solar-system.cjs');
const summary=['Jupiter','Saturn','Uranus','Neptune','Sun','Jupiter-midpoints','Saturn-midpoints','Uranus-midpoints','Neptune-midpoints'].map(key=>{
 const name=key.split('-')[0],midpoint=key.endsWith('-midpoints');
 const file=JSON.parse(fs.readFileSync(__dirname+'/data/horizons-'+key.toLowerCase()+'-v7.json','utf8'));
 const rows=file.response.result.split('$$SOE')[1].split('$$EOE')[0].trim().split('\n').map(x=>x.split(','));
 const samples=rows.map(r=>{const t=(+r[0]-2451545)/365.25-26,truth=P.toGal(r.slice(2,5).map(Number)),model=name==='Sun'?SS.reflex(t):SS.position(name,t);return {year:2026+t,positionErrorAU:P.norm(P.sub(model,truth)),positionErrorKm:P.norm(P.sub(model,truth))*P.AU_KM};});
 return {body:name,check:midpoint?'independent interpolation midpoint':'saved node / Solar reconstruction',samples,maxPositionErrorKm:Math.max(...samples.map(x=>x.positionErrorKm))};
});
if(require.main===module){fs.writeFileSync(__dirname+'/data/horizons-v7-comparison.json',JSON.stringify(summary,null,2)+'\n');console.log(JSON.stringify(summary,null,2));}
module.exports=summary;
