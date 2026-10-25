// Scene construction tests only: no browser, renderer, shader or screenshot validation.
const Grav=require('./gravity.cjs'),assert=require('node:assert/strict'),esbuild=require('esbuild'),Module=require('node:module'),path=require('node:path');
(async()=>{
 const output=await esbuild.build({entryPoints:['extended-views.js'],bundle:true,platform:'node',format:'cjs',write:false});
 const compiled=new Module(path.join(__dirname,'scene-test.cjs'),module);
 compiled.filename=path.join(__dirname,'scene-test.cjs');compiled.paths=module.paths;
 compiled._compile(output.outputFiles[0].text,compiled.filename);
 const elements={systemMode:{value:'orbits'},systemTrail:{value:'12'},plane:{checked:true},gravityBody:{value:'All'},clockRadius:{value:'2'},wellDepth:{value:'1'},systemFrame:{value:'0'},systemFocus:{value:'all'},gravityGeometry:{value:'body'},gravityClockMode:{value:'stationary'}};
 global.document={getElementById:id=>elements[id]||(elements[id]={textContent:''})};
 const views=compiled.exports.createExtendedViews();
 function finiteScene(scene){scene.traverse(o=>{assert.ok(o.position.toArray().every(Number.isFinite));const positions=o.geometry?.attributes?.position;if(positions)assert.ok(positions.array.every(Number.isFinite));});}
 for(const mode of ['orbits','paths','moon','wobble']){
  elements.systemMode.value=mode;
  for(const years of [0,30,100]){views.update(years,'system');finiteScene(views.system);const camera=views.camera('system',1);assert.ok(camera.pos.every(Number.isFinite));assert.ok(camera.min>0&&camera.max>camera.min);}
 }
 assert.equal(views.labels.filter(l=>l.scene==='system'&&l.visible()).length,2); // Sun and barycentre in close-up
 console.log('PASS Solar scenes construct finite eight-planet paths and wobble at clock boundaries');
 for(const name of ['All','Sun','Mercury','Venus','Earth','Mars','Jupiter','Saturn','Uranus','Neptune']){
  elements.gravityBody.value=name;
  for(const mode of ['body','potential','embedding']){elements.gravityGeometry.value=mode;for(const years of [0,100]){views.update(years,'spacetime',5000);finiteScene(views.spacetime);}}
 }
 elements.gravityBody.value='Earth';views.update(50,'spacetime');
 const before=[elements.gravityAccel.textContent,elements.clockLag.textContent];
 elements.wellDepth.value='3';views.update(50,'spacetime');
 assert.deepEqual([elements.gravityAccel.textContent,elements.clockLag.textContent],before);
 assert.equal(views.labels.filter(l=>l.scene==='spacetime'&&l.visible()).length,2);
 console.log('PASS Gravity scenes remain finite; display depth cannot change physical readouts');
 elements.gravityBody.value='Earth';elements.gravityGeometry.value='body';elements.gravityClockMode.value='circular';elements.clockRadius.value=String(1+400/6371);
 const period=Grav.relativistic('Earth',400,'circular').orbitalPeriodSeconds;
 views.update(0,'spacetime',0);const clock=views.labels.find(l=>l.text==='TEST CLOCK');assert.ok(Math.abs(clock.position().y)<1e-12);
 views.update(0,'spacetime',period/4);assert.ok(Math.abs(clock.position().x)<1e-12);assert.ok(Math.abs(clock.position().y-(1+400/6371))<1e-12);
 console.log('PASS Animated circular clock advances a quarter orbit in its physical quarter period');
 const system=views.exportCSV('system',50).csv.trim().split('\n'),gravity=views.exportCSV('spacetime',50).csv.trim().split('\n');
 assert.equal(system.length,2+101*10);assert.equal(gravity.length,2+4*9);
 assert.ok(!/NaN|undefined|Infinity/.test(system.join('')+gravity.join('')));
 console.log('PASS New-view CSV exports include every body and finite numerical values');
 elements.systemMode.value='paths';elements.systemFrame.value='.98';elements.systemFocus.value='all';elements.systemTrail.value='84';
 views.update(84,'system');const beforeOrigin=views.labels.find(l=>l.text==='2026 ORIGIN IN SELECTED FRAME').position().clone();
 assert.equal(views.labels.filter(l=>l.scene==='system'&&l.visible()&&['SUN','MERCURY','VENUS','EARTH','MARS','JUPITER','SATURN','URANUS','NEPTUNE','MOON'].includes(l.text)).length,10);
 views.update(85,'system');const afterOrigin=views.labels.find(l=>l.text==='2026 ORIGIN IN SELECTED FRAME').position();
 assert.ok(afterOrigin.distanceTo(beforeOrigin)>.9&&afterOrigin.distanceTo(beforeOrigin)<1.1);
 assert.ok(elements.systemMotion.textContent.includes('98%'));finiteScene(views.system);
 console.log('PASS All ten body markers are visible and the reference advances by residual Solar travel');
 const W=require('./warp.cjs'),THREE=require('three');
 for(const time of [0,30,119.9,125,250]){
  const camera=new THREE.PerspectiveCamera(46,1.5,.01,100);camera.up.set(0,0,1);camera.position.set(...W.edgeCamera(time));camera.lookAt(0,0,0);camera.updateMatrixWorld();
  const section=W.section(time),flat=W.section(time,false);const i=150;assert.ok(Math.abs(section[i][2]-.7)<1e-12);assert.equal(flat[i][2],0);
  const project=p=>new THREE.Vector3(...p).project(camera);assert.ok(Math.abs(project(section[i]).y-project(flat[i]).y)>.025,'edge-on projection must expose the physical bend');
 }
 console.log('PASS Warp camera exposes the +/-700 pc bend at multiple precession phases');
 const surface=require('./galaxy-surface.cjs');
 for(const face of [0,.035,.1,.5,1])assert.ok(surface.visibility(face)>=.65&&surface.visibility(face)<=1);
 assert.ok(surface.vertexShader.includes('p.z+=warpZ'));
 assert.ok(surface.fragmentShader.includes('structure*outer*.6'));
 const html=require('fs').readFileSync('index.html','utf8');
 for(const id of ['warpSurface','warpFollow','warpProfile'])assert.ok(html.includes('id="'+id+'"'));
 assert.ok(html.includes('<option value="5" selected>'));
 console.log('PASS Edge-on disk remains visible; height overlay and default warp controls exist');
 console.log('7 scene-construction validation groups passed (rendering unverified)');
})().catch(e=>{console.error(e);process.exitCode=1;});
