/* AU, Julian years. Local coordinates avoid subtracting kiloparsec positions. */
const D=require('./dynamics.cjs');
const AU_KM=149597870.7,YEAR_S=31557600,KPC_AU=206264806.24709636,KM_S=YEAR_S/AU_KM,C_AU_YR=299792.458*KM_S;
const start=[0,-8.2,.02], velocity=[-233*KM_S,0,7*KM_S],rad=Math.PI/180;
const matrix=[[-.0548755604162154,-.8734370902348850,-.4838350155487132],[.4941094278755837,-.4448296299600112,.7469822444972189],[-.8676661490190047,-.1980763734312015,.4559837761750669]];
function toGal(p){const e=23.43928*rad,q=[p[0],Math.cos(e)*p[1]-Math.sin(e)*p[2],Math.sin(e)*p[1]+Math.cos(e)*p[2]],g=matrix.map(row=>row.reduce((s,a,i)=>s+a*q[i],0));return [-g[1],g[0],g[2]];}
// JPL Table 2a: 3000 BC–3000 AD. Earth denotes the Earth–Moon barycentre.
const elements={
 Mercury:[[.38709843,.20563661,7.00559432,252.25166724,77.45771895,48.33961819],[0,.00002123,-.00590158,149472.67486623,.15940013,-.12214182]],
 Venus:[[.72332102,.00676399,3.39777545,181.97970850,131.76755713,76.67261496],[-.00000026,-.00005107,.00043494,58517.81560260,.05679648,-.27274174]],
 Earth:[[1.00000018,.01673163,-.00054346,100.46691572,102.93005885,-5.11260389],[-.00000003,-.00003661,-.01337178,35999.37306329,.31795260,-.24123856]],
 Mars:[[1.52371243,.09336511,1.85181869,-4.56813164,-23.91744784,49.71320984],[.00000097,.00009149,-.00724757,19140.29934243,.45223625,-.26852431]],
 Jupiter:[[5.20248019,.04853590,1.29861416,34.33479152,14.27495244,100.29282654],[-.00002864,.00018026,-.00322699,3034.90371757,.18199196,.13024619]],
 Saturn:[[9.54149883,.05550825,2.49424102,50.07571329,92.86136063,113.63998702],[-.00003065,-.00032044,.00451969,1222.11494724,.54179478,-.25015002]],
 Uranus:[[19.18797948,.04685740,.77298127,314.20276625,172.43404441,73.96250215],[-.00020455,-.00001550,-.00180155,428.49512595,.09266985,.05739699]],
 Neptune:[[30.06952752,.00895439,1.77005520,304.22289287,46.68158724,131.78635853],[.00006447,.00000818,.00022400,218.46515314,.01009938,-.00606302]]
};
const outerTerms={Jupiter:[-.00012452,.06064060,-.35635438,38.35125],Saturn:[.00025899,-.13434469,.87320147,38.35125],Uranus:[.00058331,-.97731848,.17689245,7.67025],Neptune:[-.00041348,.68346318,-.10162547,7.67025]};
function planet(name,t){if(!elements[name]||!Number.isFinite(t)||t < -5026||t>974)throw Error('Planet or epoch outside JPL Table 2 range');const T=(26+t)/100,el=elements[name],v=el[0].map((x,i)=>x+el[1][i]*T),[a,e]=v,I=v[2]*rad,w=(v[4]-v[5])*rad,O=v[5]*rad,terms=outerTerms[name],correction=terms?terms[0]*T*T+terms[1]*Math.cos(terms[3]*T*rad)+terms[2]*Math.sin(terms[3]*T*rad):0,M=((v[3]-v[4]+correction)%360)*rad;let E=M;for(let j=0;j<12;j++){const d=(E-e*Math.sin(E)-M)/(1-e*Math.cos(E));E-=d;if(Math.abs(d)<1e-13)break;}const x=a*(Math.cos(E)-e),y=a*Math.sqrt(1-e*e)*Math.sin(E),cw=Math.cos(w),sw=Math.sin(w),cO=Math.cos(O),sO=Math.sin(O),ci=Math.cos(I),si=Math.sin(I);return toGal([(cw*cO-sw*sO*ci)*x+(-sw*cO-cw*sO*ci)*y,(cw*sO+sw*cO*ci)*x+(-sw*sO+cw*cO*ci)*y,sw*si*x+cw*si*y]);}
function accel(p){return D.force(p.map((v,i)=>start[i]+v/KPC_AU)).map(a=>a*KPC_AU/1e12);}
function sunStep(s,h){const a=accel(s.slice(0,3)),v=s.slice(3).map((u,i)=>u+a[i]*h/2),p=s.slice(0,3).map((u,i)=>u+v[i]*h),b=accel(p);return [...p,...v.map((u,i)=>u+b[i]*h/2)];}
const sunTable=[[0,0,0,...velocity]];for(let i=1;i<=400;i++)sunTable.push(sunStep(sunTable[i-1],.25));
function sun(t,dt){if(dt!==undefined){let s=[0,0,0,...velocity],n=Math.max(1,Math.ceil(t/dt)),h=t/n;for(let i=0;i<n;i++)s=sunStep(s,h);return s.slice(0,3);}const index=Math.min(400,Math.floor(Math.max(0,t)*4)),h=t-index/4;return sunStep(sunTable[index],h).slice(0,3);}
const add=(a,b)=>a.map((v,i)=>v+b[i]),sub=(a,b)=>a.map((v,i)=>v-b[i]),norm=p=>Math.hypot(...p);
const beacon=planet('Earth',0); // fixed at the modeled Earth's 2026 location
function earth(t){return add(sun(t),planet('Earth',t));}
function metrics(t){const s=sun(t),e=add(s,planet('Earth',t)),d=norm(sub(e,beacon));return {sun:s,earth:e,beacon:[...beacon],sunDrift:norm(s),earthDrift:d,lightDays:d/C_AU_YR*365.25,planeDrift:Math.hypot(s[0],s[1]),vertical:s[2]};}
// Passive comparator: two-body test particle with Earth's initial heliocentric
// position/velocity. Same Galactic acceleration as Sun; tides/planets omitted.
const MU=1.32712440018e11*YEAR_S**2/AU_KM**3;
function releaseTable(dt=.001,sample=.01){let p=[...beacon],v=sub(planet('Earth',.00001),planet('Earth',-.00001)).map(x=>x/.00002),s=[...p,...v];const deriv=s=>{const f=-MU/norm(s.slice(0,3))**3;return [...s.slice(3),...s.slice(0,3).map(x=>f*x)];},out=[s.slice(0,3)],substeps=Math.round(sample/dt);dt=sample/substeps;for(let i=1;i<=Math.round(100/sample);i++){for(let j=0;j<substeps;j++){const a=deriv(s),b=deriv(s.map((x,k)=>x+dt*a[k]/2)),c=deriv(s.map((x,k)=>x+dt*b[k]/2)),d=deriv(s.map((x,k)=>x+dt*c[k]));s=s.map((x,k)=>x+dt*(a[k]+2*b[k]+2*c[k]+d[k])/6);}out.push(s.slice(0,3));}return {out,sample};}
function release(table,t){const q=Math.max(0,Math.min(100,t))/table.sample,i=Math.min(table.out.length-2,Math.floor(q)),f=q-i;return table.out[i].map((v,k)=>v*(1-f)+table.out[i+1][k]*f);}
module.exports={AU_KM,YEAR_S,KPC_AU,KM_S,C_AU_YR,start,velocity,toGal,planet,sun,earth,beacon,metrics,add,sub,norm,releaseTable,release,MU};
