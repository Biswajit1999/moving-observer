const assert=require('node:assert/strict'),fs=require('node:fs'),D=require('./dynamics.cjs'),G=require('./galactic-clock.cjs'),J=require('./journey.cjs');
let checks=0;function test(name,fn){fn();checks++;console.log('PASS '+name);}
test('100-light-year endpoint agrees with independent fine-step integration',()=>{
 let s=[...G.initial],path=0;const n=2000,h=J.durationMyr/n;
 for(let i=0;i<n;i++){const next=D.step(s,h);path+=D.separation(next,s);s=next;}
 const end=J.atFraction(1);
 assert.ok(Math.abs(path*J.LY_PER_KPC-100)<1e-5);
 assert.ok(D.separation(s.slice(0,3),G.at(J.durationMyr).slice(0,3))*J.LY_PER_KPC<1e-5);
 assert.ok(end.years>128000&&end.years<129000);assert.ok(Math.abs(end.pathLy-100)<1e-10);
 assert.ok(end.displacementLy<end.pathLy);assert.ok(end.position[2]>2.9&&end.position[2]<3.1);
});
test('Journey distance and epoch grow monotonically with validated inputs',()=>{
 let last=-1;for(let i=0;i<=100;i++){const q=J.atFraction(i/100);assert.ok(q.pathLy>last);last=q.pathLy;assert.ok(q.position.every(Number.isFinite));}
 for(const x of [-1,2,NaN])assert.throws(()=>J.atFraction(x));for(const x of [-1,0,Infinity])assert.throws(()=>J.timeForDistance(x));
 assert.equal(J.atFraction(0).years,0);assert.equal(J.atFraction(0).pathLy,0);
});
test('Journey dialog exists before bundle execution; outreach links are absent',()=>{
 const html=fs.readFileSync('index.html','utf8'),source=fs.readFileSync('journey-view.js','utf8');
 assert.ok(html.indexOf('id="journeyDialog"')<html.lastIndexOf('<script>'));
 for(const m of source.matchAll(/getElementById\('([^']+)'\)/g))assert.ok(html.includes('id="'+m[1]+'"'),m[1]);
 for(const file of ['index.html','Report.html','README.md'])assert.ok(!/OUTREACH\.md/i.test(fs.readFileSync(file,'utf8')));
});

function harness(){
 const THREE={...require('three')},nodes={},events={},raf=new Map(),timers=new Map(),downloads=[];let seq=0,now=0;
 const context=new Proxy({measureText:t=>({width:t.length*8}),createLinearGradient:()=>({addColorStop(){}})}, {get:(o,k)=>o[k]||(()=>{})});
 function node(id){return nodes[id]??=( {id,textContent:'',disabled:false,open:false,getContext:()=>context,addEventListener:(t,f)=>events[id+':'+t]=f,showModal(){this.open=true;},close(){this.open=false;events[id+':close']?.();},captureStream:()=>({getTracks:()=>[{stop(){}}]}),click(){downloads.push(this.download);}});}
 const doc={hidden:false,getElementById:node,createElement:()=>node('download'),addEventListener:(t,f)=>events['doc:'+t]=f};
 THREE.WebGLRenderer=class{constructor(){this.domElement={};}setSize(){}setClearColor(){}render(){}};
 class Controls{constructor(){this.target=new THREE.Vector3();this.enabled=true;}update(){}}
 class Recorder{static isTypeSupported(m){return m==='video/webm';}constructor(stream,options){this.mimeType=options.mimeType;this.state='inactive';}start(){this.state='recording';}stop(){this.state='inactive';this.ondataavailable({data:new Blob(['test'])});this.onstop();}}
 const source=fs.readFileSync('journey-view.js','utf8').replace(/^import .*;\r?\n/gm,'').replace('export function initJourney','function initJourney');
 const initialize=new Function('THREE','OrbitControls','J','document','MediaRecorder','performance','requestAnimationFrame','cancelAnimationFrame','setTimeout','clearTimeout','URL',source+';return initJourney;')(THREE,Controls,J,doc,Recorder,{now:()=>now},fn=>{raf.set(++seq,fn);return seq;},id=>raf.delete(id),(fn,ms)=>{timers.set(++seq,{fn,ms});return seq;},id=>timers.delete(id),{createObjectURL:()=> 'blob:test',revokeObjectURL(){}});
 initialize({onOpen(){}});node('journeyOpen').onclick();
 return {nodes,doc,events,downloads,frame(t){now=t;const callbacks=[...raf.values()];raf.clear();callbacks.forEach(fn=>fn(t));},flushStop(){for(const [id,t]of timers)if(t.ms===100){timers.delete(id);t.fn();}}};
}
test('Website recording completes, uses supported format and restores controls',()=>{
 const h=harness();h.nodes.journeyRecord.onclick();assert.ok(h.nodes.journeyRecord.disabled);h.frame(10000);h.flushStop();
 assert.deepEqual(h.downloads,['Moving_Observer_100_light_years_10s.webm']);assert.equal(h.nodes.journeyRecord.disabled,false);assert.ok(h.nodes.journeyStatus.textContent.includes('Recording saved'));
});
test('Hiding the tab cancels recording without saving an incomplete clip',()=>{
 const h=harness();h.nodes.journeyRecord.onclick();h.frame(2000);h.doc.hidden=true;h.events['doc:visibilitychange']();
 assert.deepEqual(h.downloads,[]);assert.equal(h.nodes.journeyRecord.disabled,false);assert.ok(h.nodes.journeyStatus.textContent.includes('cancelled'));
});
console.log(`${checks} journey physics and recording-control validation groups passed (mock media backend; no browser encoder test)`);
