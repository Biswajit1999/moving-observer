const esbuild=require('esbuild'),fs=require('node:fs'),path=require('node:path');
const {renderReport,includeSection}=require('./report-render.cjs');
const read=f=>fs.readFileSync(path.join(__dirname,f),'utf8'),write=(f,s)=>fs.writeFileSync(path.join(__dirname,f),s);
function report(){
 const results=JSON.parse(read('data/research-results.json')),sum=results.sum;
 const extensions=JSON.parse(read('data/extensions-results.json'));
 let spaceTime=read('SPACE_TIME_REPORT.md');
 const timeRows=extensions.catalogueTimeSweep.map(x=>'| '+x.years+' | '+x.motionScore.toFixed(6)+' | '+x.motionPercent.toFixed(4)+'% | '+x.approaching+' / '+x.receding+' |').join('\n');
 const clockRows=extensions.isolatedSurfaceClocks.map(x=>'| '+x.body+' | '+x.accelerationMS2.toFixed(3)+' | '+x.clockLagMicrosecondsPerDay.toFixed(2)+' |').join('\n');
 const extensionText='### Same sample, different waiting times\n\n| Years after 2026 | Change in accessibility sum | Relative change | Approaching / receding sources |\n|---|---:|---:|---:|\n'+timeRows+'\n\n### Isolated-body surface clock comparison\n\n| Body | Gravity (m/s²) | Clock lag (microseconds/day vs infinity) |\n|---|---:|---:|\n'+clockRows+'\n\nThe sampled Solar barycentric offset spans **'+Math.round(extensions.solarReflex.minOffsetKm).toLocaleString('en-GB')+'–'+Math.round(extensions.solarReflex.maxOffsetKm).toLocaleString('en-GB')+' km** over 2026–2126 (1,001 samples). The smooth Galactic model travels **'+extensions.solarCentury.travelAU.toFixed(2)+' AU** in that century and departs from its initial straight tangent by **'+extensions.solarCentury.departureFromInitialTangentAU.toFixed(5)+' AU**. Its long-clock vertical oscillation spans approximately **±99 pc**. These are distinct physical scales. At 1 AU from an isolated Sun, a stationary clock has a predicted lag of **'+extensions.solarFieldAt1AU.clockLagMicrosecondsPerDay.toFixed(2)+' microseconds/day** relative to infinity.\n';
 spaceTime=includeSection(spaceTime,'<!--EXTENSION_RESULTS-->',extensionText);
 let experiment=read('RESEARCH_EXPERIMENT.md');
 const labels={c00:'2026, baseline thresholds S00',c10:'2126, baseline thresholds S10',c01:'2026, improved thresholds S01',c11:'2126, improved thresholds S11',motion:'Motion alone',technology:'Instrument change alone',interaction:'Interaction'};
 const rows=Object.entries(labels).map(([k,label])=>'| '+label+' | '+sum[k].toFixed(5)+' | '+(results.interval[k]?results.interval[k].map(x=>x.toFixed(5)).join(' to '):'—')+' |').join('\n');
 experiment=experiment.replace(/\| Quantity \|[\s\S]*?(?=\n\n)/,'| Quantity | Nominal score | 95% formal-astrometry interval for differences |\n|---|---:|---|\n'+rows);
 const source=includeSection(includeSection(includeSection(read('REPORT.md'),'<!--EXPERIMENT-->',experiment),'<!--SPACE_TIME-->',spaceTime),'<!--ENVIRONMENT-->',includeSection(read('ENVIRONMENT_REPORT.md'),'<!--RELATIVITY-->',read('RELATIVITY_REPORT.md')));
 let html=renderReport(source).html;
 // Keep the labelled report figure available in the single-file offline copy.
 html=html.replace('src="output/figures/Moving_Observer_Galactic_Map.png"','src="data:image/png;base64,'+fs.readFileSync(path.join(__dirname,'output/figures/Moving_Observer_Galactic_Map.png')).toString('base64')+'"');
 let n=0;html=html.replace(/<h2>/g,()=>'<h2 id="report-section-'+(++n)+'">');
 const toc='<nav class="report-toc" aria-label="Report contents"><span>In this report</span><a href="#report-section-1">Overview</a><a href="#catalogueExperiment">Catalogue experiment</a><a href="#report-space-time">Space &amp; Time</a><a href="#report-environment">Density, speed &amp; 3D clocks</a><a href="#report-section-3">Equations &amp; frames</a><a href="#report-proxima">Proxima lab</a><a href="#report-section-14">Warp &amp; trajectories</a><a href="#report-section-12">Simulation tutorial</a><a href="#report-section-11">Review questions</a></nav>';
 html=html.replace(/^([\s\S]*?)(?=<h2)/,(_,intro)=>'<header class="report-cover"><p class="report-kicker">Finding Earth 2.0 / Research &amp; simulation report</p>'+intro+'</header>');
 html=html.replace(/(<h2[^>]*>[\s\S]*?<\/h2>)([\s\S]*?)(?=<h2|$)/g,(_,heading,body)=>'<section class="paper-section">'+heading+'<div class="section-body">'+body+'</div></section>');

 return html.replace('</header>','</header>'+toc).replace('<!--LAB-->',read('report-lab.html'));
}
(async()=>{
 const content=report(),css=read('report.css');
 const worker=await esbuild.build({entryPoints:[path.join(__dirname,'relativity-worker.js')],bundle:true,format:'iife',minify:true,supported:{'template-literal':false},write:false});
 await esbuild.build({entryPoints:[path.join(__dirname,'app.js')],bundle:true,format:'iife',minify:true,supported:{'template-literal':false},legalComments:'inline',define:{__RELATIVITY_WORKER__:JSON.stringify(worker.outputFiles[0].text)},loader:{'.jpg':'dataurl'},outfile:path.join(__dirname,'bundle.js')});
 const html=read('index.template.html').replace('/*__REPORT_CSS__*/',()=>css).replace('/*__REPORT_CONTENT__*/',()=>content).replace('/*__BUNDLE__*/',()=>read('bundle.js').replace(/<\/script/gi,'<\\/script'));
 for(const file of ['index.html','Galactic_Journey.html','Moving_Observer_2026.html'])write(file,html);
 await esbuild.build({entryPoints:[path.join(__dirname,'report-main.js')],bundle:true,format:'iife',minify:true,outfile:path.join(__dirname,'report-bundle.js')});
 write('Report.html','<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Research report — The Moving Observer · Biswajit Jana</title><style>'+css+'</style></head><body><section id="reportPage"><nav class="report-nav"><strong>Finding Earth 2.0 / Research report</strong><div><a href="index.html">Open simulation</a><a href="https://github.com/Biswajit1999/moving-observer">GitHub &amp; feedback</a><a href="https://biswajit1999.github.io/moving-observer/output/pdf/Moving_Observer_Brief.pdf">Two-page brief</a><a href="https://biswajit1999.github.io/moving-observer/output/pdf/Moving_Observer_Illustrated_Report.pdf">Illustrated report PDF</a><button id="printReport">Print / save PDF</button></div></nav><article class="report-article">'+content+'</article></section><script>'+read('report-bundle.js').replace(/<\/script/gi,'<\\/script')+'</script></body></html>');
 console.log('Built offline simulation ('+Buffer.byteLength(html)+' bytes) and Report.html');
})().catch(e=>{console.error(e);process.exitCode=1;});
