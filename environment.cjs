/* Smooth stellar-number-density scenario, independent of the force model and artwork. */
const D=require('./dynamics.cjs'),G=require('./galactic-clock.cjs');
const params={R0:8.2,z0:.020,Lthin:2.6,Hthin:.3,Lthick:3.6,Hthick:.9,thickRatio:.12,localStars10pc:373};
function profile(R,z){if(!Number.isFinite(R)||!Number.isFinite(z)||R<3||R>16||Math.abs(z)>2)throw Error('Density scenario: 3–16 kpc radius and |z| ≤ 2 kpc');return Math.exp(-(R-params.R0)/params.Lthin-Math.abs(z)/params.Hthin)+params.thickRatio*Math.exp(-(R-params.R0)/params.Lthick-Math.abs(z)/params.Hthick);}
const normal=profile(params.R0,params.z0),localDensity=params.localStars10pc/(4*Math.PI/3*10**3);
function density(R,z){const ratio=profile(R,z)/normal;return {ratio,starsPerPc3:localDensity*ratio,expectedWithin10pc:params.localStars10pc*ratio};}
function circular(R){if(!Number.isFinite(R)||R<3||R>16)throw Error('Speed comparison: 3–16 kpc');const v=D.circular(R);return {radiusKpc:R,speedKmS:v/D.K,periodMyr:2*Math.PI*R/v};}
function along(time){const s=G.at(time),R=Math.hypot(s[0],s[1]);return {timeMyr:time,radiusKpc:R,heightPc:s[2]*1000,solarSpeedKmS:Math.hypot(...s.slice(3))/D.K,...density(R,s[2])};}
const history=Array.from({length:501},(_,i)=>along(i*.5));
function incoming(radiusPc=10,relativeSpeedKmS=30,years=100){if(![radiusPc,relativeSpeedKmS,years].every(x=>Number.isFinite(x)&&x>=0))throw Error('Nonnegative finite inputs required');return localDensity*Math.PI*radiusPc**2*relativeSpeedKmS*D.K/1000*years;}
module.exports={params,localDensity,density,circular,along,history,incoming};
