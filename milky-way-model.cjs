// Published arm fits plus an explicitly synthetic light distribution. No photo sampling.
const deg=Math.PI/180;
// Reid et al. 2019 Table 2: beta interval, kink angle/radius, two pitches, width.
const arms=[
 {name:'Norma',range:[5,54],kink:18,radius:4.46,pitch:[-1,19.5],width:.14},
 {name:'Scutum–Centaurus',range:[0,104],kink:23,radius:4.91,pitch:[14.1,12.1],width:.23},
 {name:'Sagittarius–Carina',range:[2,97],kink:24,radius:6.04,pitch:[17.1,1],width:.27},
 {name:'Local arm',range:[-8,34],kink:9,radius:8.26,pitch:[11.4,11.4],width:.31},
 {name:'Perseus',range:[-23,115],kink:40,radius:8.87,pitch:[10.3,8.7],width:.35},
 {name:'Outer arm',range:[-16,71],kink:18,radius:12.24,pitch:[3,9.4],width:.65}
];
function armPoint(arm,betaDeg){const r=arm.radius*Math.exp(-(betaDeg-arm.kink)*deg*Math.tan(arm.pitch[betaDeg<arm.kink?0:1]*deg));return [-r*Math.sin(betaDeg*deg),-r*Math.cos(betaDeg*deg),0];}
function sample(count=190000,seed=20261025){
 let state=seed>>>0;const rand=()=>{state=(1664525*state+1013904223)>>>0;return (state+.5)/4294967296;},normal=()=>Math.sqrt(-2*Math.log(rand()))*Math.cos(2*Math.PI*rand());
 const positions=[],colors=[],kinds=[];
 for(let i=0;i<count;i++){
  let x,y,z,rgb,kind;const choice=rand();
  if(choice<.56){let r;do{r=-2.6*Math.log(rand()*rand());}while(r>16);const a=rand()*2*Math.PI;x=r*Math.cos(a);y=r*Math.sin(a);const h=(rand()<.12?.9:.3)*(1+Math.max(0,r-8)*.04);z=(rand()<.5?-1:1)*-h*Math.log(rand());rgb=[.63,.63,.65];kind=0;}
  else if(choice<.78){const a=30*deg;let u;do{u=normal()*2.15;}while(Math.abs(u)>5);const v=normal()*(.25+.22*(1-Math.abs(u)/5));x=-u*Math.sin(a)+v*Math.cos(a);y=-u*Math.cos(a)-v*Math.sin(a);z=normal()*(.18+.48*Math.exp(-u*u/3));rgb=[1,.78,.48];kind=1;}
  else {const arm=arms[Math.floor(rand()*arms.length)],extension=arm.name==='Local arm'?15:65,b=arm.range[0]-extension+rand()*(arm.range[1]-arm.range[0]+2*extension),p=armPoint(arm,b),r=Math.hypot(p[0],p[1]),dr=normal()*arm.width,clump=.13*Math.sin(b*.7)+.06*Math.sin(b*2.3);x=p[0]*(1+(dr+clump)/r);y=p[1]*(1+(dr+clump)/r);z=normal()*.07;kind=b>=arm.range[0]&&b<=arm.range[1]?2:3;const fade=kind===3?.38:1;rgb=rand()<.13?[1*fade,.30*fade,.25*fade]:[.62*fade,.80*fade,1*fade];}
  if(Math.hypot(x,y)>16||Math.abs(z)>3){i--;continue;}positions.push(x,y,z);colors.push(...rgb);kinds.push(kind);
 }
 return {positions,colors,kinds};
}
module.exports={arms,armPoint,sample};
