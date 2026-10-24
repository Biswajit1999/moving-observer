/* Explicitly illustrative circular lunar orbit: not a lunar ephemeris. */
const P=require('./physics2026.cjs'),SS=require('./solar-system.cjs');
const radiusAU=384400/P.AU_KM,periodYears=27.321661/365.25,inclination=5.145*Math.PI/180,moonGM=4902.800118,earthGM=398600.435507;
function relative(t){const a=2*Math.PI*t/periodYears;return P.toGal([radiusAU*Math.cos(a),radiusAU*Math.sin(a)*Math.cos(inclination),radiusAU*Math.sin(a)*Math.sin(inclination)]);}
function state(t){const s=SS.state(t),r=relative(t),emb=s.Earth;return {...s,Earth:P.sub(emb,r.map(x=>x*moonGM/(earthGM+moonGM))),Moon:P.add(emb,r.map(x=>x*earthGM/(earthGM+moonGM)))};}
module.exports={radiusAU,periodYears,relative,state,earthGM,moonGM};
