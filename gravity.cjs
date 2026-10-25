/* Weak-field explanatory quantities. Display wells are softened potential contours. */
const SS=require('./solar-system.cjs'),P=require('./physics2026.cjs'),c=299792.458,bodyGM={...SS.GM,Earth:398600.435507,Moon:4902.800118};
const radiusKm={...SS.radiusKm,Moon:1737.4};
function field(p,bodies){let potential=0;const acceleration=[0,0,0];for(const b of bodies){const d=p.map((x,i)=>(x-b.position[i])*P.AU_KM),r=Math.hypot(...d),radius=radiusKm[b.name];if(!bodyGM[b.name]||!Number.isFinite(r)||r<radius)throw Error('Physical field readouts are defined outside known body surfaces');potential-=bodyGM[b.name]/r;for(let i=0;i<3;i++)acceleration[i]-=bodyGM[b.name]*d[i]/r**3;}return {potentialKm2S2:potential,accelerationVectorMS2:acceleration.map(x=>x*1000),accelerationMS2:Math.hypot(...acceleration)*1000,clockLagMicrosecondsPerDay:-potential/c**2*86400*1e6};}
function isolated(name,altitudeKm){if(!bodyGM[name]||altitudeKm<0||!Number.isFinite(altitudeKm))throw Error('Invalid body or altitude');const r=SS.radiusKm[name]+altitudeKm,mu=bodyGM[name],potential=-mu/r;return {radiusKm:r,potentialKm2S2:potential,accelerationMS2:1000*mu/r**2,schwarzschildRadiusKm:2*mu/c**2,clockLagMicrosecondsPerDay:-potential/c**2*86400*1e6};}
function visualDepth(x,y,bodies,softening=.3){let q=0;for(const b of bodies){const d=Math.hypot(x-b.x,y-b.y,softening);q+=b.massSolar/d;}return -Math.log1p(q*10);}
function relativistic(name,altitudeKm,mode='stationary'){
 if(!['stationary','circular'].includes(mode))throw Error('Unknown clock mode');
 const q=isolated(name,altitudeKm),mu=bodyGM[name],r=q.radiusKm,R=SS.radiusKm[name],u=mu/(r*c*c),x=(mode==='circular'?3:2)*u;
 if(r<=6*mu/(c*c))throw Error('Outside stable circular-orbit domain');
 const lapse=Math.sqrt(1-x),loss=x/(1+lapse),surfaceX=2*mu/(R*c*c),surfaceLapse=Math.sqrt(1-surfaceX),surfaceLoss=surfaceX/(1+surfaceLapse);
 return {...q,mode,lapse,compactness:2*u,clockLagMicrosecondsPerDay:loss*86400*1e6,surfaceGainMicrosecondsPerDay:(surfaceLoss-loss)/surfaceLapse*86400*1e6,orbitalSpeedKmS:Math.sqrt(mu/r),orbitalPeriodSeconds:2*Math.PI*Math.sqrt(r**3/mu),properHoverAccelerationMS2:q.accelerationMS2/Math.sqrt(1-2*u)};
}
function embedding(name,radiusMultiple){const q=isolated(name,0),R=q.radiusKm,r=R*radiusMultiple,rs=q.schwarzschildRadiusKm;if(radiusMultiple<1||!Number.isFinite(radiusMultiple))throw Error('Exterior spatial slice only');return 2*Math.sqrt(rs)*(Math.sqrt(r-rs)-Math.sqrt(R-rs));}
module.exports={c,bodyGM,field,isolated,visualDepth,relativistic,embedding};
