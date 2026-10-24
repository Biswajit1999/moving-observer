// Scene construction tests only: no browser, renderer, shader or screenshot validation.
const assert=require('node:assert/strict'),esbuild=require('esbuild'),Module=require('node:module'),path=require('node:path');
(async()=>{
 const output=await esbuild.build({entryPoints:['extended-views.js'],bundle:true,platform:'node',format:'cjs',write:false});
 const compiled=new Module(path.join(__dirname,'scene-test.cjs'),module);
 compiled.filename=path.join(__dirname,'scene-test.cjs');compiled.paths=module.paths;
 compiled._compile(output.outputFiles[0].text,compiled.filename);
 const elements={systemMode:{value:'orbits'},systemTrail:{value:'12'},plane:{checked:true},gravityBody:{value:'All'},clockRadius:{value:'2'},wellDepth:{value:'1'}};
 global.document={getElementById:id=>elements[id]||(elements[id]={textContent:''})};
 const views=compiled.exports.createExtendedViews();
 function finiteScene(scene){scene.traverse(o=>{assert.ok(o.position.toArray().every(Number.isFinite));const positions=o.geometry?.attributes?.position;if(positions)assert.ok(positions.array.every(Number.isFinite));});}
 for(const mode of ['orbits','paths','wobble']){
  elements.systemMode.value=mode;
  for(const years of [0,30,100]){views.update(years,'system');finiteScene(views.system);const camera=views.camera('system',1);assert.ok(camera.pos.every(Number.isFinite));assert.ok(camera.min>0&&camera.max>camera.min);}
 }
 assert.equal(views.labels.filter(l=>l.scene==='system'&&l.visible()).length,2); // Sun and barycentre in close-up
 console.log('PASS Solar scenes construct finite eight-planet paths and wobble at clock boundaries');
 for(const name of ['All','Sun','Mercury','Venus','Earth','Mars','Jupiter','Saturn','Uranus','Neptune']){
  elements.gravityBody.value=name;
  for(const years of [0,100]){views.update(years,'spacetime');finiteScene(views.spacetime);}
 }
 elements.gravityBody.value='Earth';views.update(50,'spacetime');
 const before=[elements.gravityAccel.textContent,elements.clockLag.textContent];
 elements.wellDepth.value='3';views.update(50,'spacetime');
 assert.deepEqual([elements.gravityAccel.textContent,elements.clockLag.textContent],before);
 assert.equal(views.labels.filter(l=>l.scene==='spacetime'&&l.visible()).length,2);
 console.log('PASS Gravity scenes remain finite; display depth cannot change physical readouts');
 const system=views.exportCSV('system',50).csv.trim().split('\n'),gravity=views.exportCSV('spacetime',50).csv.trim().split('\n');
 assert.equal(system.length,2+101*9);assert.equal(gravity.length,2+4*9);
 assert.ok(!/NaN|undefined|Infinity/.test(system.join('')+gravity.join('')));
 console.log('PASS New-view CSV exports include every body and finite numerical values');
 console.log('3 scene-construction validation groups passed (rendering unverified)');
})().catch(e=>{console.error(e);process.exitCode=1;});
