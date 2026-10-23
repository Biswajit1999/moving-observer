/* Galactic clock: kpc, Myr, km/s. Same initial state as the century experiment. */
const D=require('./dynamics.cjs'),P=require('./physics2026.cjs');
const horizon=250,dt=.01,sample=.1,patternSpeed=20,patternRate=-patternSpeed*D.K;
const initial=[...P.start,-233*D.K,0,7*D.K];
const states=D.orbit(initial,horizon,dt,dt);
const path=[0],phase=[0];
for(let i=1;i<states.length/6;i++){
 const a=Array.from(states.slice((i-1)*6,(i-1)*6+3)),b=Array.from(states.slice(i*6,i*6+3));
 path.push(path[i-1]+D.separation(a,b));
 const cross=a[0]*b[1]-a[1]*b[0],dot=a[0]*b[0]+a[1]*b[1];phase.push(phase[i-1]-Math.atan2(cross,dot));
}
const reference=P.start.map((v,i)=>v+P.beacon[i]/P.KPC_AU);
function at(time){if(!Number.isFinite(time)||time<0||time>horizon)throw Error('Galactic time must be 0–250 Myr');const i=Math.min(Math.floor(time/dt+1e-10),states.length/6-1),h=Math.max(0,time-i*dt),s=Array.from(states.slice(i*6,i*6+6));return h>1e-12?D.step(s,h):s;}
function metrics(time){const s=at(time),q=time/dt,i=Math.min(Math.floor(q),path.length-2),f=q-i;return {state:s,separationKpc:D.separation(s,reference),travelKpc:path[i]*(1-f)+path[i+1]*f,angleDeg:(phase[i]*(1-f)+phase[i+1]*f)*180/Math.PI,heightPc:s[2]*1000,speedKmS:Math.hypot(...s.slice(3))/D.K};}
const trail=Array.from({length:Math.round(horizon/sample)+1},(_,i)=>at(i*sample).slice(0,3));
module.exports={horizon,dt,sample,initial,reference,patternSpeed,patternRate,at,metrics,trail,period:2*Math.PI*8.2/(233*D.K)};
