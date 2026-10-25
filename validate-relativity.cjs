const assert=require('node:assert/strict'),fs=require('node:fs'),R=require('./relativity.cjs');
const norm=v=>Math.hypot(...v),sub=(a,b)=>a.map((x,i)=>x-b[i]);
let count=0;function test(name,fn){fn();count++;console.log('PASS '+name);}
const evidence={model:'Order-reduced EIH 1PN; point masses; RK4',epochJDTDB:R.input.epochJDTDB,stepDays:.0625,scope:"Numerical consistency plus sparse ephemeris comparisons; not a total uncertainty budget"};
test('Frozen states use the same TDB epoch, geometric reference and units',()=>{assert.equal(R.names.length,10);for(const n of R.names){assert.equal(R.input.bodies[n].states[0][0],R.input.epochJDTDB);assert.equal(R.input.bodies[n].states.length,4);assert.ok(R.input.bodies[n].header.includes('GEOMETRIC'));assert.ok(R.input.bodies[n].header.includes('AU-D'));}assert.ok(Math.abs(R.C-173.144632674240)<1e-10);});
test('Newtonian pair force conserves mass-weighted momentum derivative',()=>{const a=R.acceleration(R.initial,R.mu,false);for(let d=0;d<3;d++)assert.ok(Math.abs(R.mu.reduce((s,m,i)=>s+m*a[i*3+d],0))<1e-23);});
test('1PN test-particle limit matches the independent Schwarzschild weak-field formula',()=>{const m=R.mu[0],s=[0,0,0,0,0,0,.4,.1,.02,-.003,.025,.001],a=R.acceleration(s,[m,0],true),N=R.acceleration(s,[m,0],false),p=s.slice(6,9),v=s.slice(9),r=norm(p),rv=p.reduce((q,x,i)=>q+x*v[i],0),v2=norm(v)**2;for(let d=0;d<3;d++){const expected=m/(r**3*R.C**2)*((4*m/r-v2)*p[d]+4*rv*v[d]);assert.ok(Math.abs((a[3+d]-N[3+d])-expected)<1e-18);}assert.deepEqual(Array.from(a.slice(0,3)),[0,0,0]);});
test('1PN correction scales as 1/c² and is rotationally covariant',()=>{const n=R.acceleration(R.initial,R.mu,false),a=R.acceleration(R.initial),b=R.acceleration(R.initial,R.mu,true,R.C*2);for(let i=0;i<n.length;i++)assert.ok(Math.abs((a[i]-n[i])/4-(b[i]-n[i]))<10*Number.EPSILON*Math.max(Math.abs(n[i]),1e-10));const y=Float64Array.from(R.initial);for(let i=0;i<y.length;i+=3)[y[i],y[i+1],y[i+2]]=[y[i+1],y[i+2],y[i]];const rot=R.acceleration(y);for(let i=0;i<a.length;i+=3)for(let d=0;d<3;d++)assert.ok(Math.abs(rot[i+d]-a[i+(d+1)%3])<1e-17);});
test('Mercury numerical apsidal advance agrees with the 1PN analytic prediction',()=>{
 const a=.387098,e=.20563,m=R.mu[0],masses=[m,0],rp=a*(1-e),vp=Math.sqrt(m*(1+e)/(a*(1-e))),s0=[0,0,0,0,0,0,rp,0,0,0,vp,0];let pn=new Float64Array(s0),nt=new Float64Array(s0),time=0;
 function angle(s){const x=s[6],y=s[7],vx=s[9],vy=s[10],r=Math.hypot(x,y),h=x*vy-y*vx;return Math.atan2(-vx*h/m-y/r,vy*h/m-x/r);}
 const xs=[],ys=[],h=.0625;let next=20;
 while(time<3652.5-1e-9){const dt=Math.min(h,3652.5-time);pn=R.step(pn,dt,masses,true);nt=R.step(nt,dt,masses,false);time+=dt;if(time>=next){xs.push(time);ys.push(angle(pn)-angle(nt));next+=20;}}
 const mx=xs.reduce((a,b)=>a+b)/xs.length,my=ys.reduce((a,b)=>a+b)/ys.length;
 const slope=xs.reduce((s,x,i)=>s+(x-mx)*(ys[i]-my),0)/xs.reduce((s,x)=>s+(x-mx)**2,0),numeric=slope*206264.80624709636*36525,analytic=R.perihelionArcsecCentury(a,e,m);
 evidence.mercury={numericalArcsecCentury:numeric,analyticArcsecCentury:analytic,fitYears:10,stepDays:h};assert.ok(Math.abs(numeric-analytic)<.15,JSON.stringify(evidence.mercury));
});
test('Time-step refinement resolves the relativistic signal over 30 days',()=>{
 const a=R.integrate(R.initial,30),b=R.integrate(R.initial,30,{h:.03125}),n=R.integrate(R.initial,30,{pn:false});const errors={};
 R.names.forEach((name,i)=>{const p=s=>[0,1,2].map(d=>s[6*i+d]-s[d]),error=norm(sub(p(a),p(b)))*R.AU,signal=norm(sub(p(a),p(n)))*R.AU;errors[name]={refinementKm:error,relativisticDifferenceKm:signal};assert.ok(error<.02);if(name==='Mercury')assert.ok(error<signal/100);});evidence.convergence30days=errors;
});
test('Short-term discrepancies against saved JPL states are measured and bounded',()=>{
 evidence.horizons=[];
 for(const day of [30,365.25,3652.5]){const s=R.integrate(R.initial,day),j=R.input.days.indexOf(day),row={days:day,heliocentricErrorKm:{}};
 R.names.forEach((name,i)=>{const q=R.input.bodies[name].states[j],sun=R.input.bodies.Sun.states[j],error=norm([0,1,2].map(d=>(s[6*i+d]-s[d])-(q[d+1]-sun[d+1])))*R.AU;row.heliocentricErrorKm[name]=error;assert.ok(Number.isFinite(error));assert.ok(error<(day===30?100:20000),name+' '+error);});evidence.horizons.push(row);}
});
test('Leading surface clocks and Shapiro delay have physical reference and limits',()=>{const offsets=R.clockOffsets(R.initial);assert.equal(offsets[R.names.indexOf('Earth')],0);assert.ok(offsets.every(Number.isFinite));const d=R.shapiro(1,1,.5);assert.ok(d>0&&d<1e-4);assert.equal(R.shapiro(1,1,.5,0),0);assert.throws(()=>R.shapiro(1,1,2));assert.ok(R.earthSignal(R.initial,9).delaySeconds>0);assert.ok(R.earthSignal(R.initial,0).blocked);assert.ok(R.earthSignal(R.initial,3).samePosition);});
test('New UI references and worker payload are present in the offline build',()=>{const html=fs.readFileSync('index.html','utf8'),source=fs.readFileSync('relativistic-view.js','utf8');for(const m of source.matchAll(/\$\('([^']+)'\)/g))assert.ok(html.includes('id="'+m[1]+'"'),m[1]);assert.ok(!html.includes('__RELATIVITY_WORKER__'));assert.ok(html.indexOf('id="relativityDialog"')<html.lastIndexOf('<script>'));});
test('Real worker integration produces paired trajectories and cumulative clock offsets',()=>{
 const messages=[],self={postMessage:m=>messages.push(m)},source=fs.readFileSync('relativity-worker.js','utf8').replace("import R from './relativity.cjs';",'');new Function('R','self',source)(R,self);
 self.onmessage({data:{years:1,h:.0625}});const result=messages.find(x=>x.done);assert.ok(result);assert.equal(result.rows.length,184);assert.equal(result.rows[0].day,0);assert.equal(result.rows.at(-1).day,365.25);
 assert.ok(messages.some(x=>x.progress>.9));for(const row of result.rows){assert.ok([...row.pn,...row.newton,...row.clockSeconds].every(Number.isFinite));assert.equal(row.clockSeconds[3],0);}
 assert.ok(result.rows.at(-1).clockSeconds[1]<0);const independent=R.integrate(R.initial,2);assert.ok(norm(sub(Array.from(independent),result.rows[1].pn))<1e-12);evidence.worker={years:1,savedEpochs:result.rows.length,mercuryClockSecondsVsEarth:result.rows.at(-1).clockSeconds[1]};
});
test('Worker rejects unsupported spans without returning a trajectory',()=>{const messages=[],self={postMessage:m=>messages.push(m)};new Function('R','self',fs.readFileSync('relativity-worker.js','utf8').replace("import R from './relativity.cjs';",''))(R,self);self.onmessage({data:{years:100000,h:.0625}});assert.ok(messages[0].error);assert.ok(!messages.some(x=>x.done));});
test('Lab controls construct scenes and update every reference frame with mocked rendering',()=>{
 const THREE={...require('three')},nodes={},events={};let latestWorker;
 const defaults={relativityFocus:'inner',relativityTarget:'Mercury',relativityYears:'1',relativityStep:'.0625',relativitySpeed:'30'};
 const node=id=>nodes[id]??={value:defaults[id]||'0',checked:true,textContent:'',open:false,addEventListener:(t,f)=>events[id+':'+t]=f,showModal(){this.open=true;},close(){this.open=false;events[id+':close']?.();},click(){}};
 THREE.WebGLRenderer=class{setPixelRatio(){}setSize(){}setClearColor(){}render(scene){scene.traverse(o=>assert.ok(o.position.toArray().every(Number.isFinite)));}};
 THREE.TextureLoader=class{load(){return new THREE.Texture();}};
 class Controls{constructor(){this.target=new THREE.Vector3();}update(){}}
 class Worker{constructor(){latestWorker=this;}terminate(){}postMessage(m){assert.equal(m.years,1);}}
 const source=fs.readFileSync('relativistic-view.js','utf8').replace(/^import .*;\r?\n/gm,'').replace('export function initRelativity','function initRelativity');
 const init=new Function('THREE','OrbitControls','R','SS','earthImage','document','devicePixelRatio','Worker','URL','performance','requestAnimationFrame','cancelAnimationFrame','__RELATIVITY_WORKER__',source+';return initRelativity;')(THREE,Controls,R,require('./solar-system.cjs'),'test',{getElementById:node,createElement:()=>node('a')},1,Worker,{createObjectURL:()=> 'blob:test',revokeObjectURL(){}},{now:()=>0},()=>1,()=>{},'');
 init({onOpen(){}});node('relativityOpen').onclick();assert.equal(node('relativityRun').disabled,true);
 const p=Array.from(R.integrate(R.initial,2)),n=Array.from(R.integrate(R.initial,2,{pn:false}));latestWorker.onmessage({data:{done:true,years:1,h:.0625,rows:[{day:0,pn:Array.from(R.initial),newton:Array.from(R.initial),clockSeconds:R.names.map(()=>0)},{day:2,pn:p,newton:n,clockSeconds:R.names.map(()=>0)}]}});
 assert.equal(node('relativityRun').disabled,false);for(const view of ['inner','all','bary','moon']){node('relativityFocus').value=view;node('relativityFocus').onchange();node('relativityTime').oninput({target:{value:1}});assert.ok(!node('relativityDelta').textContent.includes('NaN'));}
 assert.equal(node('relativityTarget').value,'Moon');assert.ok(node('relativityShapiro').textContent.includes('µs'));node('relativityClose').onclick();assert.equal(node('relativityPlay').textContent,'Play');
});
fs.writeFileSync('data/relativity-validation.json',JSON.stringify({...evidence,groups:count},null,2));console.log(count+' relativistic dynamics validation groups passed');
