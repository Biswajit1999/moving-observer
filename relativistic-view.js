import * as THREE from 'three';
import {OrbitControls} from 'three/addons/controls/OrbitControls.js';
import R from './relativity.cjs';
import SS from './solar-system.cjs';
import earthImage from './earth.jpg';
const $=id=>document.getElementById(id);
export function initRelativity({onOpen}){
 let renderer,scene,camera,controls,worker,workerURL,rows=null,meshes=[],trails=[],ghosts=[],last=0,playing=false,frame=0,index=0,playbackDay=0;
 const dialog=$('relativityDialog'),canvas=$('relativityCanvas'),status=$('relativityStatus');
 function stop() {playing=false;$('relativityPlay').textContent='Play';}
 function setup(){
  if(renderer)return;renderer=new THREE.WebGLRenderer({canvas,antialias:true,preserveDrawingBuffer:true});renderer.setPixelRatio(Math.min(devicePixelRatio,2));renderer.setSize(900,610,false);renderer.setClearColor(0x040b14);
  scene=new THREE.Scene();scene.add(new THREE.HemisphereLight(0xc7d9ed,0x111a28,1.3));const sunLight=new THREE.PointLight(0xfff0d5,2,0,0);sunLight.name='relativitySunlight';scene.add(sunLight);const earthTexture=new THREE.TextureLoader().load(earthImage);earthTexture.colorSpace=THREE.SRGBColorSpace;camera=new THREE.PerspectiveCamera(45,900/610,1e-6,1000);camera.up.set(0,0,1);controls=new OrbitControls(camera,canvas);controls.enableDamping=true;
  R.names.forEach((n,i)=>{const color=SS.colors[n]||0xbfc7d0,mesh=new THREE.Mesh(new THREE.SphereGeometry(1,20,16),(n==='Sun'?new THREE.MeshBasicMaterial({color}):new THREE.MeshStandardMaterial({color:n==='Earth'?0xffffff:color,map:n==='Earth'?earthTexture:null,roughness:1})));mesh.rotation.x=Math.PI/2;scene.add(mesh);meshes.push(mesh);for(const list of [trails,ghosts]){const line=new THREE.Line(new THREE.BufferGeometry(),new THREE.LineBasicMaterial({color:list===trails?color:0x758698,transparent:true,opacity:list===trails?.85:.3}));list.push(line);scene.add(line);}});
 }
 function selected(){return $('relativityFocus').value;}
 function visible(i){const n=R.names[i],focus=selected();return ['all','bary','moon'].includes(focus)?['all','bary'].includes(focus)||['Earth','Moon'].includes(n):['Sun','Mercury','Venus','Earth','Mars'].includes(n);}
 function origin(s){if(selected()==='bary')return [0,0,0];const i=selected()==='moon'?R.names.indexOf('Earth'):0;return [s[6*i],s[6*i+1],s[6*i+2]];}
 function position(s,i,o){return [0,1,2].map(d=>s[6*i+d]-o[d]);}
 function fit(kind='overview'){const moon=selected()==='moon',r=moon?.006:['all','bary'].includes(selected())?70:3;camera.position.set(...(kind==='top'?[0,0,r*1.2]:kind==='edge'?[0,-r*1.2,r*.02]:[0,-r*.9,r*.65]));camera.near=moon?1e-7:.0001;camera.updateProjectionMatrix();controls.target.set(0,0,0);controls.minDistance=r/15;controls.maxDistance=r*8;controls.update();}
 function lines(){if(!rows)return;const stopAt=Math.min(index+1,rows.length),begin=Math.max(0,stopAt-(selected()==='moon'?20:1500));
  R.names.forEach((n,i)=>{for(const [objects,key] of [[trails,'pn'],[ghosts,'newton']]){objects[i].visible=visible(i)&&(key==='pn'||$('relativityGhost').checked);const points=[];if(objects[i].visible)for(let j=begin;j<stopAt;j++){const s=rows[j][key];points.push(new THREE.Vector3(...position(s,i,origin(s))));}objects[i].geometry.dispose();objects[i].geometry=new THREE.BufferGeometry().setFromPoints(points);}});
 }
 function renderState(){if(!rows)return;const row=rows[index],o=origin(row.pn),focus=selected(),target=R.names.indexOf($('relativityTarget').value),p=position(row.pn,target,o),q=position(row.newton,target,origin(row.newton)),difference=Math.hypot(...p.map((v,i)=>v-q[i]))*R.AU;
  R.names.forEach((n,i)=>{meshes[i].visible=visible(i);meshes[i].position.set(...position(row.pn,i,o));meshes[i].scale.setScalar(focus==='moon'?(n==='Earth'?.000085:.000026):['all','bary'].includes(focus)?(i===0?.35:.15):(i===0?.035:.012));});
  scene.getObjectByName('relativitySunlight').position.set(...position(row.pn,0,o));$('relativityEpoch').textContent='+'+(row.day/365.25).toFixed(3)+' Julian years from 2026.0';$('relativityTime').value=index;
  $('relativityDelta').textContent=difference.toLocaleString('en-GB',{maximumFractionDigits:3})+' km';
  const clocks=R.clockOffsets(row.pn);$('relativityClock').textContent=clocks[target].toFixed(2)+' µs/day';$('relativityAccumulated').textContent=row.clockSeconds[target].toFixed(6)+' s';
  const signal=R.earthSignal(row.pn,target);$('relativityShapiro').textContent=signal.samePosition?'Same position':signal.blocked?'Sun intersects the geometric ray':(signal.delaySeconds*1e6).toFixed(3)+' µs';
  $('relativityLabels').textContent=R.names.filter((_,i)=>visible(i)).join(' · ');
  $('relativityScale').textContent=(focus==='moon'?'Earth-centred; AU coordinates. Earth/Moon markers enlarged.':focus==='bary'?'Barycentric; AU coordinates. The Sun moves too. Body markers enlarged.':'Sun-centred; AU coordinates. Body markers enlarged.')+' Grey: Newtonian comparison. Galactic translation is omitted here; use Sun & all planets for forward travel. Real 1PN differences are usually too small to distinguish visually.';lines();
 }
 function calculate(){stop();worker?.terminate();rows=null;$('relativityRun').disabled=true;$('relativityPlay').disabled=true;$('relativityTime').disabled=true;status.textContent='Integrating both models in a background worker…';
  if(workerURL)URL.revokeObjectURL(workerURL);workerURL=URL.createObjectURL(new Blob([__RELATIVITY_WORKER__],{type:'text/javascript'}));worker=new Worker(workerURL);
  worker.onerror=e=>{$('relativityRun').disabled=false;status.textContent='Integration worker failed: '+e.message+'. Use Calculate to retry.';};
  worker.onmessage=e=>{const data=e.data;if(data.error){$('relativityRun').disabled=false;status.textContent=data.error;return;}if(data.progress){status.textContent='Integrating Newtonian and 1PN: '+Math.round(data.progress*100)+'%';return;}if(data.done){$('relativityRun').disabled=false;rows=data.rows;index=Math.min(15,rows.length-1);playbackDay=rows[index].day;$('relativityTime').max=rows.length-1;$('relativityTime').disabled=false;$('relativityPlay').disabled=false;status.textContent='Ready · '+data.years+' years · RK4 step '+data.h+' day · '+rows.length+' saved epochs. Check the documented error budget before interpreting differences.';fit();renderState();playing=true;$('relativityPlay').textContent='Pause';}};
  worker.postMessage({years:+$('relativityYears').value,h:+$('relativityStep').value});
 }
 function animate(now){if(!dialog.open){frame=0;return;}const dt=Math.min(.1,(now-last)/1000);last=now;if(playing&&rows){playbackDay=Math.min(rows[rows.length-1].day,playbackDay+dt*+$('relativitySpeed').value);index=Math.min(rows.length-1,Math.floor(playbackDay/2));if(playbackDay===rows[rows.length-1].day)index=rows.length-1;renderState();if(index===rows.length-1)stop();}controls.update();renderer.render(scene,camera);frame=requestAnimationFrame(animate);}
 $('relativityOpen').onclick=()=>{onOpen();dialog.showModal();setup();if(!rows)calculate();else renderState();if(!frame){last=performance.now();frame=requestAnimationFrame(animate);}};
 $('relativityClose').onclick=()=>dialog.close();dialog.addEventListener('close',()=>{stop();cancelAnimationFrame(frame);frame=0;});
 $('relativityRun').onclick=calculate;for(const [id,kind] of [['relativityResetCamera','overview'],['relativityTop','top'],['relativityEdge','edge']])$(id).onclick=()=>fit(kind);$('relativityZoomIn').onclick=()=>{camera.position.sub(controls.target).multiplyScalar(.8).add(controls.target);controls.update();};$('relativityZoomOut').onclick=()=>{camera.position.sub(controls.target).multiplyScalar(1.25).add(controls.target);controls.update();};$('relativityFocus').onchange=()=>{if(selected()==='moon')$('relativityTarget').value='Moon';fit();renderState();};$('relativityGhost').onchange=renderState;$('relativityTarget').onchange=renderState;
 $('relativityTime').oninput=e=>{stop();index=+e.target.value;playbackDay=rows[index].day;renderState();};$('relativityPlay').onclick=()=>{if(!rows)return;if(index===rows.length-1)index=0;playbackDay=rows[index].day;playing=!playing;$('relativityPlay').textContent=playing?'Pause':'Play';};
 $('relativityCSV').onclick=()=>{if(!rows)return;let text='# Order-reduced 1PN EIH; AU and AU/day; 2026.0 JDTDB '+R.input.epochJDTDB+'; no ephemeris-accuracy claim\n';text+='day,body,pn_x_AU,pn_y_AU,pn_z_AU,pn_vx_AUday,pn_vy_AUday,pn_vz_AUday,newton_x_AU,newton_y_AU,newton_z_AU,clock_seconds_vs_Earth\n';for(const row of rows)R.names.forEach((n,i)=>{text+=[row.day,n,...row.pn.slice(6*i,6*i+6),...row.newton.slice(6*i,6*i+3),row.clockSeconds[i]].join(',')+'\n';});const url=URL.createObjectURL(new Blob([text],{type:'text/csv'})),a=document.createElement('a');a.href=url;a.download='Moving_Observer_1PN.csv';a.click();setTimeout(()=>URL.revokeObjectURL(url),10000);};
}
