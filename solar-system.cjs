/* Barycentric reconstruction: saved Horizons outer planets and approximate inner elements. */
const P=require('./physics2026.cjs'),E=require('./ephemeris.cjs');
const GM={Sun:132712440041.279419,Mercury:22031.868551,Venus:324858.592,Earth:398600.435507+4902.800118,Mars:42828.375816,Jupiter:126712764.1,Saturn:37940584.8418,Uranus:5794556.4,Neptune:6836527.10058};
const names=Object.keys(GM).filter(n=>n!=='Sun'),total=Object.values(GM).reduce((a,b)=>a+b,0);
const radiusKm={Sun:695700,Mercury:2439.4,Venus:6051.8,Earth:6371,Mars:3389.5,Jupiter:69911,Saturn:58232,Uranus:25362,Neptune:24622};
const colors={Sun:0xf2c786,Mercury:0xa8a3a0,Venus:0xdbb578,Earth:0x8cbeeb,Mars:0xd58261,Jupiter:0xe3b58b,Saturn:0xe4d3a6,Uranus:0x7ad1d4,Neptune:0x608bff};
const periods={Mercury:.24085,Venus:.6152,Earth:1,Mars:1.8808,Jupiter:11.862,Saturn:29.4475,Uranus:84.0168,Neptune:164.7913};
function reflex(t){const sum=[0,0,0];for(const n of names){const r=E.position(n,t);for(let i=0;i<3;i++)sum[i]-=GM[n]*r[i]/total;}return sum;}
function state(t){const sun=reflex(t),bodies={Sun:sun};for(const n of names)bodies[n]=P.add(sun,E.position(n,t));return bodies;}
const origin=reflex(0);
function galacticPosition(name,t){const q=state(t)[name];if(!q)throw Error('Unknown body');return P.add(P.sub(P.sun(t),origin),q);}
module.exports={GM,radiusKm,colors,periods,names,total,reflex,state,galacticPosition,position:E.position};
