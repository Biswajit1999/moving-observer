const MarkdownIt=require('markdown-it'),katex=require('katex');
function renderReport(source){
 const equations=[];
 function math(tex,display){const rendered=katex.renderToString(tex,{displayMode:display,output:'mathml',throwOnError:true,trust:false});const key='MATHTOKEN'+equations.length+'END';equations.push(rendered);return display?'\n\n<div class="report-equation">'+key+'</div>\n\n':'<span class="inline-equation">'+key+'</span>';}
 const protectedSource=source.replace(/\$\$\s*([\s\S]*?)\s*\$\$/g,(_,tex)=>math(tex,true)).replace(/\$([^$\n]+)\$/g,(_,tex)=>math(tex,false));
 const html=new MarkdownIt({html:true,linkify:true}).render(protectedSource).replace(/MATHTOKEN(\d+)END/g,(_,i)=>equations[+i]);
 return {html,count:equations.length};
}
// Callback replacement is essential: a string replacement would turn every $$ into $.
function includeSection(source,marker,section){return source.replace(marker,()=>section);}
module.exports={renderReport,includeSection};
