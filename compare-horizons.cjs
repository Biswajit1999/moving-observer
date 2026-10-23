const fs=require('node:fs'),P=require('./physics2026.cjs');
const summary=[];
for(const name of ['Mercury','Venus','Earth','Mars']){
 const data=JSON.parse(fs.readFileSync(__dirname+'/horizons-'+name.toLowerCase()+'.json','utf8'));const result=data.response.result;
 const rows=result.split('$$SOE')[1].split('$$EOE')[0].trim().split('\n').map(l=>l.split(','));
 const errors=rows.map(row=>{const jd=+row[0],t=(jd-2451545)/365.25-26,truth=row.slice(2,5).map(Number),model=P.planet(name,t),reference=P.toGal(truth);return {epoch:2026+t,positionErrorKm:P.norm(P.sub(model,reference))*P.AU_KM,radialErrorKm:Math.abs(P.norm(model)-P.norm(reference))*P.AU_KM};});
 summary.push({planet:name,maxPositionErrorKm:Math.max(...errors.map(e=>e.positionErrorKm)),samples:errors});
}
fs.writeFileSync(__dirname+'/horizons-comparison.json',JSON.stringify(summary,null,2));console.log(JSON.stringify(summary,null,2));
