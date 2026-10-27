// Build-output navigation checks. These do not replace browser or keyboard testing.
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const root=process.argv[2]?path.resolve(process.argv[2]):__dirname;
const html=fs.readFileSync(path.join(root,'Report.html'),'utf8').split('<script>')[0];
const ids=[...html.matchAll(/\bid="([^"]+)"/g)].map(x=>x[1]);
assert.equal(new Set(ids).size,ids.length,'Report contains duplicate element IDs');
const idSet=new Set(ids);
for(const [,fragment] of html.matchAll(/href="#([^"]*)"/g)){
 if(fragment)assert.ok(idSet.has(fragment),'Missing fragment target: '+fragment);
}
const text=s=>s.replace(/<[^>]+>/g,'').replace(/&amp;/g,'&').trim();
const headings=new Map([...html.matchAll(/<h2 id="([^"]+)">([\s\S]*?)<\/h2>/g)].map(x=>[x[1],text(x[2])]));
const expected={
 'report-overview':'Report overview',
 'report-equations':'Reference frames and equations',
 'report-questions':'Questions for researchers and interested readers',
 'report-tutorial':'Tutorial: using the simulation',
 'report-warp':'A warped disk, vertical Solar motion, and planetary paths',
 'report-space-time':'Space & Time: what does a gravity grid mean?',
 'report-environment':'Are we entering a denser region, and how fast do other stars move?',
 'report-galaxy-data':'Building a Galaxy from evidence, and separating gas from stars',
 'report-future-sightlines':'What changes after 100, 1,000 and 10,000 years?'
};
for(const [id,label] of Object.entries(expected)){
 assert.equal(headings.get(id)?.replace(/^\d+\.\s*/,''),label,'Semantic target points to wrong heading: '+id);
}
const toc=html.match(/<nav class="report-toc"[\s\S]*?<\/nav>/)?.[0];
assert.ok(toc,'Report contents missing');
assert.ok(toc.includes('href="#report-future-sightlines"'),'Timescale comparison missing from contents');
assert.ok(!toc.includes('#report-section-'),'Contents depend on numerical section order');
for(const n of [1,3,11,12,14,16,19,22,23])assert.ok(idSet.has('report-section-'+n),'Legacy numbered link missing: '+n);
const numbers=[...headings.values()].map(s=>s.match(/^(\d+)\.\s/)?.[1]).filter(Boolean);
assert.equal(new Set(numbers).size,numbers.length,'Visible report section numbers repeat');
for(const [,refs] of html.matchAll(/aria-(?:labelledby|describedby)="([^"]+)"/g)){
 for(const id of refs.split(/\s+/))assert.ok(idSet.has(id),'Missing accessibility reference: '+id);
}
for(const [,id] of html.matchAll(/<label\b[^>]*\bfor="([^"]+)"/g))assert.ok(idSet.has(id),'Missing label target: '+id);
console.log('PASS Report fragments, semantic headings, legacy links, section numbering and accessibility references');
