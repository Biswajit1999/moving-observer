/* Sourced scales, illustrative kinematic surface; not a fitted Galactic potential. */
const onsetKpc=8.4,anchorKpc=14,anchorHeightKpc=.7,omega=-10.86*.0010227121650537077;
function height(r,phi,t){return anchorHeightKpc*Math.max(0,(r-onsetKpc)/(anchorKpc-onsetKpc))**2*Math.sin(phi-omega*t);}
function verticalVelocity(r,phi,t,vR,vPhi){const q=Math.max(0,(r-onsetKpc)/(anchorKpc-onsetKpc)),a=anchorHeightKpc*q*q,da=r>onsetKpc?2*anchorHeightKpc*q/(anchorKpc-onsetKpc):0;return da*vR*Math.sin(phi-omega*t)+a*(vPhi/r-omega)*Math.cos(phi-omega*t);}
const shader=`uniform float warpTime;uniform float warpEnabled;uniform float patternAngle;
float warpHeight(vec2 p){float r=length(p);float phase=atan(p.y,p.x)+patternAngle-(${omega.toFixed(12)})*warpTime;return warpEnabled*0.7*pow(max(0.,(r-8.4)/5.6),2.)*sin(phase);}`;
module.exports={onsetKpc,anchorKpc,anchorHeightKpc,omega,height,verticalVelocity,shader};
