/* Paired, single-visit geometric-accessibility experiment. Not a mission yield. */
const fs=require('node:fs'),crypto=require('node:crypto');
const PC_KM=149597870.7*648000/Math.PI,K=31557600/PC_KM,MAS_RAD=Math.PI/648000000;
const norm=v=>Math.hypot(...v),dot=(a,b)=>a.reduce((s,x,i)=>s+x*b[i],0);
const instruments={baseline:{iwaMas:60,contrast:1e-10,planetGLimit:30},improved:{iwaMas:40,contrast:5e-11,planetGLimit:31}};
const planet={radiusEarth:1,aAU:1,geometricAlbedo:.3};
function readCatalogue(){const lines=fs.readFileSync(__dirname+'/data/gaia-nearby.csv','utf8').trim().split(/\r?\n/),keys=lines.shift().split(',');return lines.map(l=>Object.fromEntries(l.split(',').map((v,i)=>[keys[i],keys[i]==='source_id'?v:(v===''?null:Number(v))])));}
function state(row,offset=[0,0,0,0,0,0]){
 const dec=row.dec*Math.PI/180+offset[1]*MAS_RAD,ra=row.ra*Math.PI/180+offset[0]*MAS_RAD/Math.cos(row.dec*Math.PI/180),plx=row.parallax+offset[2];
 if(plx<=0)throw Error('Non-positive sampled parallax');
 const n=[Math.cos(dec)*Math.cos(ra),Math.cos(dec)*Math.sin(ra),Math.sin(dec)],ea=[-Math.sin(ra),Math.cos(ra),0],ed=[-Math.sin(dec)*Math.cos(ra),-Math.sin(dec)*Math.sin(ra),Math.cos(dec)];
 const v=n.map((x,i)=>x*(row.radial_velocity+offset[5])+4.740470463533349/plx*((row.pmra+offset[3])*ea[i]+(row.pmdec+offset[4])*ed[i]));
 return {r:n.map(x=>x*1000/plx),v:v.map(x=>x*K),epoch:row.ref_epoch,d:1000/plx};
}
function position(s,year){return s.r.map((x,i)=>x+s.v[i]*(year-s.epoch));}
function phase(a){return (Math.sin(a)+(Math.PI-a)*Math.cos(a))/Math.PI;}
// Random orientation and random phase of a circular orbit imply uniform cos(alpha).
function completeness(distance,gmag,instrument,p=planet){
 const q=instrument.iwaMas*distance/(1000*p.aAU);if(q>=1)return 0;
 const c0=p.geometricAlbedo*(p.radiusEarth*.00004263521245/p.aAU)**2;
 const threshold=Math.max(instrument.contrast,10**(-.4*(instrument.planetGLimit-gmag)))/c0;
 if(threshold>=1)return 0;
 let lo=0,hi=Math.PI;for(let j=0;j<48;j++){const mid=(lo+hi)/2;if(phase(mid)>threshold)lo=mid;else hi=mid;}
 const minAlpha=Math.asin(q),maxAlpha=Math.min(Math.PI-minAlpha,(lo+hi)/2);
 return maxAlpha<=minAlpha?0:(Math.cos(minAlpha)-Math.cos(maxAlpha))/2;
}
function evaluate(row,years,offset){const s=state(row,offset),p0=position(s,2026),p1=position(s,2026+years),d0=norm(p0),d1=norm(p1),g0=row.phot_g_mean_mag+5*Math.log10(d0/s.d),g1=row.phot_g_mean_mag+5*Math.log10(d1/s.d),c00=completeness(d0,g0,instruments.baseline),c10=completeness(d1,g1,instruments.baseline),c01=completeness(d0,g0,instruments.improved),c11=completeness(d1,g1,instruments.improved);return {d0,d1,c00,c10,c01,c11,motion:c10-c00,technology:c01-c00,interaction:c11-c10-c01+c00,radial:dot(p0,s.v)/d0/K,deltaIwaMas:1000/d1-1000/d0};}
const names=['ra','dec','parallax','pmra','pmdec'];
function covariance(row){return names.map((a,i)=>names.map((b,j)=>row[a+'_error']*row[b+'_error']*(i===j?1:row[(i<j?a+'_'+b:b+'_'+a)+'_corr'])));}
function cholesky(c){const l=Array.from({length:5},()=>Array(5).fill(0));for(let i=0;i<5;i++)for(let j=0;j<=i;j++){let x=c[i][j];for(let k=0;k<j;k++)x-=l[i][k]*l[j][k];if(i===j){if(x< -1e-12)throw Error('Non-positive covariance');l[i][j]=Math.sqrt(Math.max(0,x));}else l[i][j]=x/l[j][j];}return l;}
function rng(seed){return ()=>{seed=(Math.imul(1664525,seed)+1013904223)>>>0;return (seed+.5)/4294967296;};}
function gaussian(random){return Math.sqrt(-2*Math.log(random()))*Math.cos(2*Math.PI*random());}
function quantile(a,q){const b=[...a].sort((x,y)=>x-y),i=(b.length-1)*q,j=Math.floor(i);return b[j]+(b[Math.min(j+1,b.length-1)]-b[j])*(i-j);}
function run(years=100,draws=1024){
 const rows=readCatalogue(),random=rng(20261024),sum={c00:0,c10:0,c01:0,c11:0,motion:0,technology:0,interaction:0},sums=Array.from({length:draws},()=>({motion:0,technology:0,interaction:0}));
 const targets=rows.map(row=>{
  const v=evaluate(row,years),l=cholesky(covariance(row)),samples=[];
  for(let j=0;j<draws;j++){const z=Array.from({length:6},()=>gaussian(random)),o=l.map((line,i)=>line.reduce((s,x,k)=>s+x*z[k],0));o.push(z[5]*row.radial_velocity_error);const x=evaluate(row,years,o);samples.push(x.motion);for(const k of Object.keys(sums[j]))sums[j][k]+=x[k];}
  for(const k of Object.keys(sum))sum[k]+=v[k];
  return {source_id:row.source_id,...v,motionP025:quantile(samples,.025),motionP975:quantile(samples,.975),ruwe:row.ruwe};
 });
 const interval=Object.fromEntries(['motion','technology','interaction'].map(k=>[k,[quantile(sums.map(x=>x[k]),.025),quantile(sums.map(x=>x[k]),.975)]]));
 const sensitivity=[40,50,60,70,80,100].map(iwaMas=>{const instrument={...instruments.baseline,iwaMas};let delta=0;for(const row of rows){const s=state(row),d0=norm(position(s,2026)),d1=norm(position(s,2026+years));delta+=completeness(d1,row.phot_g_mean_mag+5*Math.log10(d1/s.d),instrument)-completeness(d0,row.phot_g_mean_mag+5*Math.log10(d0/s.d),instrument);}return {iwaMas,motion:delta};});
 return {schema:1,epoch:2026,years,draws,seed:20261024,sampleSize:rows.length,catalogueSha256:crypto.createHash('sha256').update(fs.readFileSync(__dirname+'/data/gaia-nearby.csv')).digest('hex'),instruments,planet,sum,interval,sensitivity,gainers:targets.filter(x=>x.motion>1e-12).length,losers:targets.filter(x=>x.motion< -1e-12).length,targets:targets.sort((a,b)=>Math.abs(b.motion)-Math.abs(a.motion))};
}
if(require.main===module){const result=run();fs.writeFileSync(__dirname+'/data/research-results.json',JSON.stringify(result,null,2)+'\n');const keys=Object.keys(result.targets[0]);fs.writeFileSync(__dirname+'/data/research-targets.csv',keys.join(',')+'\n'+result.targets.map(r=>keys.map(k=>r[k]).join(',')).join('\n')+'\n');console.log(JSON.stringify({...result,targets:result.targets.slice(0,3)},null,2));}
module.exports={PC_KM,K,readCatalogue,state,position,phase,completeness,covariance,cholesky,evaluate,run,instruments,planet};
