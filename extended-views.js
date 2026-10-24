import * as THREE from 'three';
import P from './physics2026.cjs';
import SS from './solar-system.cjs';
import Grav from './gravity.cjs';
const $=id=>document.getElementById(id),fmt=(x,n=3)=>x.toLocaleString('en-GB',{maximumFractionDigits:n});
const names=['Sun',...SS.names],ex=P.toGal([1,0,0]),ey=P.toGal([0,1,0]);
const dot=(a,b)=>a.reduce((s,x,i)=>s+x*b[i],0);
function makeLine(color,opacity=.75){return new THREE.Line(new THREE.BufferGeometry(),new THREE.LineBasicMaterial({color,transparent:true,opacity,depthTest:false}));}
function replace(object,points){object.geometry.dispose();object.geometry=new THREE.BufferGeometry().setFromPoints(points.map(p=>new THREE.Vector3(...p)));}
export function createExtendedViews(){
 const system=new THREE.Scene(),spacetime=new THREE.Scene(),labels=[];
 const bodies=names.map(name=>{const mesh=new THREE.Mesh(new THREE.SphereGeometry(1,24,16),new THREE.MeshBasicMaterial({color:SS.colors[name]})),trail=makeLine(SS.colors[name]),orbit=makeLine(SS.colors[name],.2);system.add(mesh,trail,orbit);if(name!=='Sun')replace(orbit,Array.from({length:361},(_,i)=>P.planet(name,SS.periods[name]*i/360)));labels.push({text:name.toUpperCase(),scene:'system',position:()=>mesh.position,visible:()=>mesh.visible});return {name,mesh,trail,orbit};});
 const bary=new THREE.Mesh(new THREE.OctahedronGeometry(.001,0),new THREE.MeshBasicMaterial({color:0x7be7e3}));system.add(bary);labels.push({text:'SYSTEM BARYCENTRE',scene:'system',position:()=>bary.position,visible:()=>bary.visible});
 const gridGeom=new THREE.PlaneGeometry(1,1,100,100),grid=new THREE.Mesh(gridGeom,new THREE.MeshBasicMaterial({color:0x547b95,wireframe:true,transparent:true,opacity:.45,side:THREE.DoubleSide}));spacetime.add(grid);
 const gravityBodies=names.map(name=>{const mesh=new THREE.Mesh(new THREE.SphereGeometry(1,24,16),new THREE.MeshBasicMaterial({color:SS.colors[name]}));spacetime.add(mesh);labels.push({text:name.toUpperCase(),scene:'spacetime',position:()=>mesh.position,visible:()=>mesh.visible});return {name,mesh};});
 const probe=new THREE.Mesh(new THREE.SphereGeometry(.08,16,12),new THREE.MeshBasicMaterial({color:0x7be7e3}));spacetime.add(probe);labels.push({text:'TEST CLOCK',scene:'spacetime',position:()=>probe.position,visible:()=>probe.visible});
 let lastT=null,lastMode=null,lastDuration=null;
 function updateSystem(t){
  const mode=$('systemMode').value,duration=+$('systemTrail').value,s=SS.state(t),wobble=mode==='wobble',paths=mode==='paths';
  const rebuild=lastT!==t||lastMode!==mode||lastDuration!==duration,history=wobble?30:duration,begin=Math.max(0,t-history),count=Math.min(5000,Math.max(600,Math.ceil((t-begin)*110))),historyStates=[];
  if(rebuild&&(wobble||paths))for(let i=0;i<=count;i++){const when=begin+(t-begin)*i/count;historyStates.push({when,state:wobble?{Sun:SS.reflex(when)}:SS.state(when),shift:paths?P.sub(P.sun(when),P.sun(t)):[0,0,0]});}
  for(const b of bodies){b.mesh.visible=!wobble||b.name==='Sun';b.orbit.visible=!wobble&&!paths&&$('plane').checked&&b.name!=='Sun';b.trail.visible=wobble?b.name==='Sun':paths;
   b.mesh.scale.setScalar(wobble?SS.radiusKm.Sun/P.AU_KM:b.name==='Sun'?.35:['Jupiter','Saturn'].includes(b.name)?.23:.12);b.mesh.position.set(...s[b.name]);
   if(b.orbit.visible)b.orbit.position.set(...s.Sun);
   if(b.trail.visible&&rebuild)replace(b.trail,historyStates.map(h=>P.add(h.state[b.name],h.shift)));
  }
  bary.visible=!paths;bary.scale.setScalar(wobble?1:100);
  $('baryOffset').textContent=fmt(P.norm(s.Sun)*P.AU_KM,0)+' km';
  $('barySolarRadii').textContent=fmt(P.norm(s.Sun)*P.AU_KM/SS.radiusKm.Sun,2)+' Solar radii';
  $('systemScale').textContent=wobble?'True AU scale; Solar radius shown to scale. Other bodies lie outside this close-up.':paths?'True AU distances. Markers enlarged. The Sun’s small reflex motion is included but requires its own close-up.':'True AU distances in the Solar System barycentric frame. Body markers are enlarged.';
  lastT=t;lastMode=mode;lastDuration=duration;
 }
 function updateGravity(t){
  const selected=$('gravityBody').value,overview=selected==='All',name=overview?'Sun':selected,multiple=+$('clockRadius').value,depth=+$('wellDepth').value,state=SS.state(t),span=overview?36:7;
  const wellBodies=overview?names.map(n=>({x:dot(state[n],ex),y:dot(state[n],ey),massSolar:SS.GM[n]/SS.GM.Sun})):[{x:0,y:0,massSolar:1}];
  const pos=gridGeom.attributes.position;
  for(let i=0;i<pos.count;i++){const ix=i%101,iy=Math.floor(i/101),x=(ix/100-.5)*2*span,y=(.5-iy/100)*2*span;pos.setXYZ(i,x,y,depth*Grav.visualDepth(x,y,wellBodies,overview?.35:.8));}pos.needsUpdate=true;gridGeom.computeBoundingSphere();
  for(const b of gravityBodies){b.mesh.visible=overview||b.name===name;if(!b.mesh.visible)continue;const w=overview?wellBodies[names.indexOf(b.name)]:wellBodies[0],z=depth*Grav.visualDepth(w.x,w.y,wellBodies,overview?.35:.8);b.mesh.position.set(w.x,w.y,z);b.mesh.scale.setScalar(overview?(b.name==='Sun'?.45:.22):.32);}
  probe.visible=!overview;probe.position.set(multiple,0,depth*Grav.visualDepth(multiple,0,wellBodies,.8));
  const q=Grav.isolated(name,(multiple-1)*SS.radiusKm[name]);$('gravityName').textContent='Isolated '+name+' approximation';$('gravityAccel').textContent=fmt(q.accelerationMS2,4)+' m/s²';$('clockLag').textContent=fmt(q.clockLagMicrosecondsPerDay,4)+' μs/day';$('gravityPotential').textContent=fmt(q.potentialKm2S2,3)+' km²/s²';$('clockRadiusValue').textContent=fmt(multiple,1)+' body radii';
  $('gravityUnits').textContent=overview?'Horizontal coordinates: AU, projected into the ecliptic. Select a body to resolve its well. The readouts use an isolated Sun at the selected radius.':'Horizontal coordinates: '+name+' radii. Depth is an arbitrary logarithmic potential display; it is not a physical extra dimension.';
 }
 function camera(view,fit){if(view==='system'){const mode=$('systemMode').value;if(mode==='wobble')return {target:[0,0,0],pos:[.013,-.032*fit,.023*fit],min:.006,max:.2};if(mode==='paths'){const d=+$('systemTrail').value,mid=P.velocity.map(x=>-x*d/2);return {target:mid,pos:[mid[0],-d*66*fit,mid[2]+d*44*fit],min:1,max:15000};}return {target:[0,0,0],pos:[28,-65*fit,48*fit],min:1,max:300};}const r=$('gravityBody').value==='All'?75:14;return {target:[0,0,-1],pos:[r*.6,-r*fit,r*.7*fit],min:2,max:r*6};}
 function exportCSV(view,t){if(view==='system'){let csv='# Horizons outer-planet interpolation + approximate JPL inner elements + mass-weighted Solar reflex; AU in barycentric Galactic axes\nyear,body,x_AU,y_AU,z_AU\n';for(let y=0;y<=100;y++){const s=SS.state(y);for(const n of names)csv+=[2026+y,n,...s[n]].join(',')+'\n';}return {name:'Solar_System_barycentric_2026_2126.csv',csv};}let csv='# Isolated spherical weak-field clocks; stationary relative to infinity; velocity terms omitted\nbody,radius_multiple,acceleration_m_s2,clock_lag_microseconds_day,potential_km2_s2\n';for(const n of names)for(const m of [1,2,5,10]){const q=Grav.isolated(n,(m-1)*SS.radiusKm[n]);csv+=[n,m,q.accelerationMS2,q.clockLagMicrosecondsPerDay,q.potentialKm2S2].join(',')+'\n';}return {name:'Isolated_body_gravity_and_clocks.csv',csv};}
 return {system,spacetime,labels,camera,exportCSV,update(t,view){if(view==='system')updateSystem(t);if(view==='spacetime')updateGravity(t);}};
}
