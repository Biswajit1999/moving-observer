import * as THREE from 'three';
import {OrbitControls} from 'three/addons/controls/OrbitControls.js';
import J from './journey.cjs';

// Recording captures this live website scene. No screen capture or remote recording.
export function initJourney({onOpen}){
 const dialog=document.getElementById('journeyDialog'),canvas=document.getElementById('journeyCanvas'),status=document.getElementById('journeyStatus');
 const ctx=canvas.getContext('2d'),preview=document.getElementById('journeyPreview'),record=document.getElementById('journeyRecord'),close=document.getElementById('journeyClose'),orbit=document.getElementById('journeyOrbit');
 let renderer,scene,camera,controls,sun,track,start=0,running=false,fraction=0,recorder=null,stream=null,chunks=[],timer=null,animation=0,failed=false;
 const points=Array.from({length:501},(_,i)=>new THREE.Vector3(...J.atFraction(i/500).position));
 function init(){
  if(renderer)return;
  renderer=new THREE.WebGLRenderer({antialias:true,preserveDrawingBuffer:true});renderer.setSize(1280,720);renderer.setClearColor(0x040b14);renderer.outputColorSpace=THREE.SRGBColorSpace;
  scene=new THREE.Scene();camera=new THREE.PerspectiveCamera(43,1280/720,.1,1000);camera.up.set(0,0,1);
  camera.position.set(-40,-135,94);controls=new OrbitControls(camera,canvas);controls.target.set(-50,0,1.5);controls.enableDamping=true;controls.minDistance=80;controls.maxDistance=300;controls.update();
  const grid=[];for(let x=-120;x<=20;x+=10)grid.push(new THREE.Vector3(x,-35,0),new THREE.Vector3(x,35,0));for(let y=-30;y<=30;y+=10)grid.push(new THREE.Vector3(-120,y,0),new THREE.Vector3(20,y,0));
  scene.add(new THREE.LineSegments(new THREE.BufferGeometry().setFromPoints(grid),new THREE.LineBasicMaterial({color:0x203449,transparent:true,opacity:.6})));
  const geometry=new THREE.BufferGeometry().setFromPoints(points);track=new THREE.Line(geometry,new THREE.LineBasicMaterial({color:0xf2c786}));scene.add(track);
  const guide=new THREE.Line(new THREE.BufferGeometry().setFromPoints(points),new THREE.LineBasicMaterial({color:0x78694f,transparent:true,opacity:.25}));scene.add(guide);
  const marker=(color,r)=>new THREE.Mesh(new THREE.SphereGeometry(r,24,16),new THREE.MeshBasicMaterial({color}));
  scene.add(marker(0x74dfdf,.6));sun=marker(0xf2c786,.85);scene.add(sun);
 }
 function tag(text,p,color,dy=0){const v=p.clone().project(camera);if(v.z<-1||v.z>1)return;const x=(v.x+1)*640,y=(1-v.y)*360+dy;ctx.font='15px system-ui';const w=ctx.measureText(text).width;ctx.fillStyle='#040b14dd';ctx.fillRect(x-w/2-7,y-18,w+14,24);ctx.fillStyle=color;ctx.fillText(text,x-w/2,y);}
 function draw(now){
  if(!dialog.open){animation=0;return;}
  if(running)fraction=Math.min(1,(now-start)/10000);
  const m=J.atFraction(fraction);sun.position.set(...m.position);track.geometry.setDrawRange(0,Math.max(1,Math.floor(fraction*500)+1));
  controls.update();renderer.render(scene,camera);ctx.drawImage(renderer.domElement,0,0);
  const shade=ctx.createLinearGradient(0,0,0,170);shade.addColorStop(0,'#040b14');shade.addColorStop(1,'#040b1400');ctx.fillStyle=shade;ctx.fillRect(0,0,1280,170);
  ctx.fillStyle='#96b4c9';ctx.font='14px system-ui';ctx.fillText('THE MOVING OBSERVER / FINDING EARTH 2.0',38,35);
  ctx.fillStyle='#edf5fc';ctx.font='30px system-ui';ctx.fillText('100 light-years with the Sun',38,79);
  ctx.fillStyle='#b0c7d7';ctx.font='17px system-ui';ctx.fillText('A local close-up of the Galactic orbit · 10 seconds ≈ 129,000 years',38,110);
  ctx.fillStyle='#040b14df';ctx.fillRect(28,151,262,153);ctx.fillStyle='#f2c786';ctx.font='34px ui-monospace,monospace';ctx.fillText(m.pathLy.toFixed(1)+' ly travelled',40,193);
  ctx.fillStyle='#d1dfe8';ctx.font='19px ui-monospace,monospace';ctx.fillText(Math.round(m.years).toLocaleString('en-GB')+' years elapsed',40,228);ctx.fillText(m.speedKmS.toFixed(1)+' km/s',40,258);
  ctx.font='13px system-ui';ctx.fillStyle='#96b4c9';ctx.fillText('Path length; not target-star separation',40,287);
  if(fraction<.04)tag('2026 START · SUN',sun.position,'#f2c786',-20);
  else {tag('SUN + SOLAR SYSTEM',sun.position,'#f2c786',-20);tag('2026 · FIXED REFERENCE',new THREE.Vector3(),'#74dfdf',26);}
  ctx.fillStyle='#040b14ef';ctx.fillRect(0,595,1280,125);ctx.font='16px system-ui';ctx.fillStyle='#d1dfe8';ctx.fillText('Equal light-year scales · grid spacing 10 ly · body markers enlarged · planets unresolved',38,624);
  ctx.font='15px system-ui';ctx.fillStyle='#96b4c9';ctx.fillText('Nearly circular orbit in a static, smooth Galactic potential. Galactic-plane evolution is omitted.',38,652);
  ctx.fillText('The near-straight appearance is physical: this is only about 0.2° of the Galactic orbit.',38,675);
  ctx.font='13px system-ui';ctx.fillText('Biswajit Jana · 2026 | Live website simulation | Fixed reference is not a passive probe',38,702);
  if(fraction===1&&running){running=false;if(recorder?.state==='recording')setTimeout(finish,100);else status.textContent='Preview complete. Drag to inspect the 3D view, or record the journey.';}
  animation=requestAnimationFrame(draw);
 }
 function finish(){if(recorder?.state==='recording')recorder.stop();clearTimeout(timer);timer=null;}
 function reset(){fraction=0;start=performance.now();running=true;status.textContent='Playing 100 light-years of modelled Solar travel.';}
 function restore(){stream?.getTracks().forEach(t=>t.stop());stream=null;record.disabled=false;preview.disabled=false;close.disabled=false;orbit.disabled=false;if(controls)controls.enabled=true;}
 function fail(message){failed=true;running=false;status.textContent=message;finish();restore();}
 document.getElementById('journeyOpen').onclick=()=>{onOpen();dialog.showModal();try{init();fraction=0;running=false;if(!animation)animation=requestAnimationFrame(draw);status.textContent='Preview the journey, then record 10 seconds. Drag to orbit the camera.';}catch(e){status.textContent='3D view unavailable: '+e.message;}};
 preview.onclick=()=>reset();
 orbit.onclick=()=>{controls.autoRotate=!controls.autoRotate;controls.autoRotateSpeed=.5;orbit.textContent=controls.autoRotate?'Stop camera orbit':'Orbit camera';};
 record.onclick=()=>{
  if(!canvas.captureStream||typeof MediaRecorder==='undefined'){status.textContent='This browser does not support canvas recording. Open the website in a current desktop Chrome or Edge browser.';return;}
  const mime=['video/mp4;codecs=avc1.42E01E','video/mp4','video/webm;codecs=vp9','video/webm;codecs=vp8','video/webm'].find(x=>MediaRecorder.isTypeSupported(x));
  if(!mime){status.textContent='No supported video encoder. You can still use Preview.';return;}
  try{
   chunks=[];failed=false;stream=canvas.captureStream(30);recorder=new MediaRecorder(stream,{mimeType:mime,videoBitsPerSecond:6000000});
   recorder.ondataavailable=e=>{if(e.data.size)chunks.push(e.data);};
   recorder.onerror=()=>fail('Recording failed. No incomplete clip was saved. Try another desktop browser.');
   recorder.onstop=()=>{restore();if(failed||!chunks.length)return;const blob=new Blob(chunks,{type:recorder.mimeType}),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download='Moving_Observer_100_light_years_10s.'+(mime.includes('mp4')?'mp4':'webm');a.click();setTimeout(()=>URL.revokeObjectURL(url),60000);status.textContent='Recording saved. '+(mime.includes('mp4')?'MP4':'WebM')+' · live website canvas · no audio.';};
   record.disabled=preview.disabled=close.disabled=orbit.disabled=true;controls.enabled=false;reset();recorder.start(1000);status.textContent='Recording 10 seconds… keep this tab visible.';
   timer=setTimeout(()=>fail('Recording timed out. Keep the tab visible and retry.'),12000);
  }catch(e){fail('Could not start recording: '+e.message);}
 };
 dialog.addEventListener('cancel',e=>{if(recorder?.state==='recording')e.preventDefault();});
 dialog.addEventListener('close',()=>{running=false;cancelAnimationFrame(animation);animation=0;if(controls)controls.autoRotate=false;orbit.textContent='Orbit camera';});
 close.onclick=()=>dialog.close();
 document.addEventListener('visibilitychange',()=>{if(document.hidden&&recorder?.state==='recording')fail('Recording cancelled because the tab was hidden. Keep the tab visible for all 10 seconds.');});
}
