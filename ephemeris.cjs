const P=require('./physics2026.cjs');
const tables={Jupiter:require('./data/ephemeris-jupiter.json'),Saturn:require('./data/ephemeris-saturn.json'),Uranus:require('./data/ephemeris-uranus.json'),Neptune:require('./data/ephemeris-neptune.json')};
function position(name,t){
 if(!tables[name])return P.planet(name,t);
 if(!Number.isFinite(t)||t<0||t>100)throw Error('Saved outer-planet ephemeris covers 2026–2126');
 const states=tables[name].states,jd=2451545+(26+t)*365.25,i=Math.min(states.length-2,Math.floor(t*4)),a=states[i],b=states[i+1],h=b[0]-a[0],u=(jd-a[0])/h;
 const h00=2*u**3-3*u*u+1,h10=u**3-2*u*u+u,h01=-2*u**3+3*u*u,h11=u**3-u*u;
 return P.toGal([0,1,2].map(k=>h00*a[k+1]+h10*h*a[k+4]+h01*b[k+1]+h11*h*b[k+4]));
}
module.exports={position,tables};
