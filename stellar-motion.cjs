/* Short relative-motion case study and separate illustrative Galactic tracers. */
const D=require('./dynamics.cjs'),G=require('./galactic-clock.cjs'),input=require('./data/proxima-input.json');
const PC_KM=149597870.7*648000/Math.PI, YEAR_S=31557600, PC_LY=PC_KM/(299792.458*YEAR_S), KMS_PC_YR=YEAR_S/PC_KM;
const dot=(a,b)=>a.reduce((s,x,i)=>s+x*b[i],0),norm=a=>Math.hypot(...a),add=(a,b)=>a.map((x,i)=>x+b[i]),scale=(a,k)=>a.map(x=>x*k),sub=(a,b)=>a.map((x,i)=>x-b[i]);
function astrometry(d){
 const a=(d.right_ascension_hms[0]+d.right_ascension_hms[1]/60+d.right_ascension_hms[2]/3600)*Math.PI/12;
 const q=d.declination_dms,dec=Math.sign(q[0])*(Math.abs(q[0])+q[1]/60+q[2]/3600)*Math.PI/180;
 const n=[Math.cos(dec)*Math.cos(a),Math.cos(dec)*Math.sin(a),Math.sin(dec)],ea=[-Math.sin(a),Math.cos(a),0],ed=[-Math.sin(dec)*Math.cos(a),-Math.sin(dec)*Math.sin(a),Math.cos(dec)];
 const distance=1000/d.parallax_mas,k=149597870.7/YEAR_S;
 const velocity=add(scale(n,d.radial_velocity_kms),scale(add(scale(ea,d.pm_ra_cosdec_mas_yr),scale(ed,d.pm_dec_mas_yr)),k/d.parallax_mas));
 return {r:scale(n,distance),v:velocity};
}
const original=astrometry(input),vPcYr=scale(original.v,KMS_PC_YR),r2026=add(original.r,scale(vPcYr,2026-input.astrometric_epoch_jyear));
const radialUnit=scale(r2026,1/norm(r2026)),radial2026=dot(original.v,radialUnit),transverseVector=sub(original.v,scale(radialUnit,radial2026)),transverse2026=norm(transverseVector),transverseUnit=scale(transverseVector,1/transverse2026);
const closestYears=-dot(r2026,vPcYr)/dot(vPcYr,vPcYr);
function proxima(years){
 if(!Number.isFinite(years)||years< -50000||years>100000)throw Error('Proxima linear illustration is limited to -50,000 to +100,000 years');
 const r=add(r2026,scale(vPcYr,years)),d=norm(r),radial=dot(r,original.v)/d;
 return {years,rPc:r,distancePc:d,distanceLy:d*PC_LY,radialKmS:radial,speedKmS:norm(original.v),transverseKmS:Math.sqrt(Math.max(0,norm(original.v)**2-radial**2)),xLy:dot(r,radialUnit)*PC_LY,yLy:dot(r,transverseUnit)*PC_LY,fluxRatio:(norm(r2026)/d)**2,angularSeparationRatio:norm(r2026)/d};
}
const syntheticSpecs=[{name:'Illustrative A',offset:[.12,.04,.025],peculiar:[-8,4,2],color:0xc4a0ff},{name:'Illustrative B',offset:[-.18,.15,-.04],peculiar:[6,-10,4],color:0x8ce0a3},{name:'Illustrative C',offset:[.3,-.2,.06],peculiar:[-12,8,-3],color:0xf49aaa}];
let tracersCache;
function tracers(){if(tracersCache)return tracersCache;tracersCache=syntheticSpecs.map(h=>{
 const p=add(G.initial.slice(0,3),h.offset),R=Math.hypot(p[0],p[1]),vc=D.circular(R),v=add([vc*p[1]/R,-vc*p[0]/R,0],scale(h.peculiar,D.K)),initial=[...p,...v],states=D.orbit(initial,250,.01,.1);
 return {...h,initial,at(t){if(!Number.isFinite(t)||t<0||t>250)throw Error('Tracer time outside 0–250 Myr');return D.at(states,t);},trail:Array.from({length:2501},(_,i)=>Array.from(states.slice(i*6,i*6+3)))};
 });return tracersCache;}
function relative(a,b){const r=sub(a.slice(0,3),b.slice(0,3)),v=sub(a.slice(3),b.slice(3)),d=norm(r);return {distanceKpc:d,relativeSpeedKmS:norm(v)/D.K,radialKmS:d?dot(r,v)/(d*D.K):0};}
// Circular orbit transit geometry. An adjustable inclination is an assumption, not a Proxima measurement.
function transit(offsetDeg,rStarSolar=1,aAU=1,rPlanetEarth=1){const rStar=rStarSolar*.00465046726096,rPlanet=rPlanetEarth*.00004263521245,b=aAU*Math.abs(Math.sin(offsetDeg*Math.PI/180))/rStar;return {impactParameter:b,threshold:1+rPlanet/rStar,possible:b<=1+rPlanet/rStar,halfAngleDeg:Math.asin(Math.min(1,(rStar+rPlanet)/aAU))*180/Math.PI};}
module.exports={input,PC_KM,PC_LY,KMS_PC_YR,astrometry,original,r2026,vPcYr,radial2026,transverse2026,closestYears,proxima,tracers,relative,transit,dot,norm,add,sub,scale};
