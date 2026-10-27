// Event-level checks with a minimal DOM; not browser layout or rendering validation.
const assert = require('node:assert/strict');
const vm = require('node:vm');
const esbuild = require('esbuild');
const S = require('./research-summary.cjs');
(async () => {
  const output = await esbuild.build({entryPoints:['future-comparison.js'],bundle:true,platform:'node',format:'cjs',write:false});
  const nodes = {}, downloads = [], blobs = [];
  class Element {
    constructor() { this.value=''; this.textContent=''; this.hidden=false; this.events={}; }
    set innerHTML(value) {
      this.markup=value;
      for (const match of value.matchAll(/id="([^"]+)"/g)) nodes[match[1]] ||= new Element();
    }
    get innerHTML() { return this.markup || ''; }
    addEventListener(name, callback) { this.events[name]=callback; }
    click() { downloads.push({name:this.download,url:this.href}); }
    focus() { this.focused=true; }
    select() { this.selected=true; }
  }
  nodes.futureComparison = new Element(); nodes.researchIwa = new Element(); nodes.researchIwa.value='70';
  class TestURL extends URL { static createObjectURL(blob) {blobs.push(blob);return 'blob:test/'+blobs.length;} static revokeObjectURL(){} }
  const location = {href:'https://example.org/Report.html?years=1000&iwa=70#report-future-sightlines',search:'?years=1000&iwa=70'};
  const context = {module:{exports:{}},exports:{},URL:TestURL,URLSearchParams,Blob,console,location,
    history:{replaceState(_state,_unused,url){location.href=url.href;location.search=url.search;}},
    document:{getElementById:id=>nodes[id]||null,createElement:()=>new Element()},
    navigator:{clipboard:{writeText:async()=>{throw Error('denied');}}},setTimeout:callback=>callback()};
  vm.runInNewContext(output.outputFiles[0].text,context);
  context.module.exports.initFutureComparison();
  assert.equal(nodes.futureYears.value,'1000');
  assert.ok(nodes.futureMetrics.innerHTML.includes('0.7772'));
  assert.ok(nodes.futureAccessCounts.innerHTML.includes('<strong>41</strong>'));
  nodes.futureYears.value='10000';nodes.futureYears.events.change();
  assert.ok(location.search.includes('years=10000'));assert.ok(location.search.includes('iwa=70'));
  assert.equal(nodes.futureReadout.textContent,S.summary(10000));
  assert.ok(nodes.futureDistanceChart.innerHTML.includes('667 sources end closer'));
  await nodes.copyFutureAnswer.onclick();
  assert.equal(nodes.futureCopyFallback.hidden,false);assert.equal(nodes.futureCopyText.selected,true);
  assert.equal(nodes.futureCopyText.value,S.summary(10000));
  let copied='';context.navigator.clipboard.writeText=async value=>{copied=value;};
  await nodes.copyFutureLink.onclick();
  assert.equal(copied,S.shareURL(10000,70));assert.equal(nodes.futureCopyFallback.hidden,true);
  nodes.downloadFutureJSON.onclick();
  assert.equal(downloads.at(-1).name,'Moving_Observer_10000_years.json');
  assert.deepEqual(JSON.parse(await blobs.at(-1).text()),S.snapshot(10000));
  nodes.downloadFutureCSV.onclick();
  assert.equal(await blobs.at(-1).text(),S.csv());
  nodes.futureYears.value='100';nodes.futureYears.events.change();
  assert.ok(nodes.futureAccessCounts.innerHTML.includes('<strong>1,300</strong>') || nodes.futureAccessCounts.innerHTML.includes('<strong>1300</strong>'));
  assert.ok(nodes.futureMetrics.innerHTML.includes('0.0307'));
  console.log('PASS Interval changes, shared settings, clipboard fallback and scenario downloads preserve the selected results');
})().catch(error=>{console.error(error);process.exitCode=1;});
