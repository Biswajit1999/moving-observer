// Geometry and scale only: no magnetohydrodynamic or cosmic-ray transport solver.
const AU_KM=149597870.7, YEAR_S=365.25*86400;
const boundaryAU=120, terminationAU=90, windKmS=400;
function windDistanceAU(years){return windKmS*years*YEAR_S/AU_KM;}
function travelDays(radiusAU){return radiusAU*AU_KM/windKmS/86400;}
function spherePoint(radius,longitude,latitude){return [radius*Math.cos(latitude)*Math.cos(longitude),radius*Math.cos(latitude)*Math.sin(longitude),radius*Math.sin(latitude)];}
module.exports={boundaryAU,terminationAU,windKmS,windDistanceAU,travelDays,spherePoint};
