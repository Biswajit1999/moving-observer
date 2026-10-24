/* A 100-light-year path in the existing Galactic potential, not a planet ephemeris. */
const G=require('./galactic-clock.cjs');
const LY_PER_KPC=3261.5637771674333;
function timeForDistance(lightYears=100){
 if(!Number.isFinite(lightYears)||lightYears<=0||lightYears>G.metrics(G.horizon).travelKpc*LY_PER_KPC)throw Error('Distance outside integrated orbit');
 let a=0,b=G.horizon;
 for(let i=0;i<60;i++){const mid=(a+b)/2;if(G.metrics(mid).travelKpc*LY_PER_KPC<lightYears)a=mid;else b=mid;}
 return (a+b)/2;
}
const durationMyr=timeForDistance(100),origin=G.at(0).slice(0,3);
function atFraction(f){
 if(!Number.isFinite(f)||f<0||f>1)throw Error('Journey fraction must be 0–1');
 const time=f*durationMyr,m=G.metrics(time);
 return {years:time*1e6,pathLy:m.travelKpc*LY_PER_KPC,displacementLy:Math.hypot(...m.state.slice(0,3).map((v,i)=>(v-origin[i])*LY_PER_KPC)),position:m.state.slice(0,3).map((v,i)=>(v-origin[i])*LY_PER_KPC),speedKmS:m.speedKmS};
}
module.exports={LY_PER_KPC,durationMyr,atFraction,timeForDistance};
