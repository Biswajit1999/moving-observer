const esbuild=require('esbuild'),fs=require('node:fs'),path=require('node:path'),MarkdownIt=require('markdown-it'),katex=require('katex');
const read=f=>fs.readFileSync(path.join(__dirname,f),'utf8'),write=(f,s)=>fs.writeFileSync(path.join(__dirname,f),s);
function report(){
 const equations=[],source=read('REPORT.md').replace(/\$\$\s*([\s\S]*?)\s*\$\$/g,(_,tex)=>{equations.push(katex.renderToString(tex,{displayMode:true,output:'mathml',throwOnError:true,trust:false}));return '\n\n<div class="report-equation">EQUATION_'+(equations.length-1)+'</div>\n\n';});
 let html=new MarkdownIt({html:true,linkify:true}).render(source).replace(/EQUATION_(\d+)/g,(_,i)=>equations[+i]);let n=0;html=html.replace(/<h2>/g,()=>'<h2 id="report-section-'+(++n)+'">');
 const toc='<p class="report-toc"><a href="#report-section-1">Abstract</a> · <a href="#report-section-2">Answers</a> · <a href="#report-proxima">Proxima lab</a> · <a href="#report-section-3">Equations</a> · <a href="#report-section-11">Review questions</a> · <a href="#report-section-12">Tutorial</a></p>';
 return toc+html.replace('<!--LAB-->',read('report-lab.html'));
}
(async()=>{
 const content=report(),css=read('report.css');
 await esbuild.build({entryPoints:[path.join(__dirname,'app.js')],bundle:true,format:'iife',minify:true,legalComments:'inline',loader:{'.jpg':'dataurl'},outfile:path.join(__dirname,'bundle.js')});
 const html=read('index.template.html').replace('/*__REPORT_CSS__*/',()=>css).replace('/*__REPORT_CONTENT__*/',()=>content).replace('/*__BUNDLE__*/',()=>read('bundle.js').replace(/<\/script/gi,'<\\/script'));
 for(const file of ['index.html','Galactic_Journey.html','Moving_Observer_2026.html'])write(file,html);
 await esbuild.build({entryPoints:[path.join(__dirname,'report-main.js')],bundle:true,format:'iife',minify:true,outfile:path.join(__dirname,'report-bundle.js')});
 write('Report.html','<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Research report — The Moving Observer · Biswajit Jana</title><style>'+css+'</style></head><body><section id="reportPage"><nav class="report-nav"><strong>Finding Earth 2.0 / Research report</strong><div><a href="index.html">Open simulation</a><a href="https://github.com/Biswajit1999/moving-observer">GitHub &amp; feedback</a><button id="printReport">Print / save PDF</button></div></nav><article class="report-article">'+content+'</article></section><script>'+read('report-bundle.js').replace(/<\/script/gi,'<\\/script')+'</script></body></html>');
 console.log('Built offline simulation ('+Buffer.byteLength(html)+' bytes) and Report.html');
})().catch(e=>{console.error(e);process.exitCode=1;});
