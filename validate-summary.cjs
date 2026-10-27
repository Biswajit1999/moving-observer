const assert = require('node:assert/strict');
const S = require('./research-summary.cjs');
const future = require('./data/future-sightlines.json');
const R = require('./research.cjs');
const fs = require('node:fs');
for (const row of future.epochs) {
  const snapshot = S.snapshot(row.years);
  assert.deepEqual(snapshot.results, row);
  assert.equal(snapshot.sampleSize, row.approaching + row.receding);
  assert.ok(row.gainers + row.losers <= snapshot.sampleSize);
  assert.ok(S.summary(row.years).includes('not planets discovered or evidence of life'));
  assert.ok(S.summary(row.years).includes('constant relative velocities'));
  assert.ok(Math.abs(row.accessibilityFuture - row.accessibilityInitial - row.accessibilityChange) < 1e-10);
  assert.ok(Math.abs(row.solarPathLy - 233 * row.years / 299792.458) < 1e-12);
  const url = new URL(S.shareURL(row.years, 70));
  assert.deepEqual(S.selection(url.search), {years:row.years, iwa:70});
  assert.equal(url.hostname, 'biswajit1999.github.io');
  assert.equal(url.hash, '#report-future-sightlines');
}
assert.deepEqual(S.selection('?years=250000000&iwa=not-a-number'), {years:100, iwa:60});
assert.deepEqual(S.selection('?years=1000&iwa=70'), {years:1000, iwa:70});
assert.deepEqual(S.selection('?years=<script>&iwa=0'), {years:100, iwa:60});
const records = S.csv().split('\n').filter(line => line && !line.startsWith('#'));
const keys = records[0].split(',');
assert.equal(records.length, 4);
for (let i = 1; i < records.length; i++) {
  const values = records[i].split(',').map(Number);
  assert.ok(values.every(Number.isFinite));
  keys.forEach((key, col) => assert.equal(values[col], future.epochs[i-1][key]));
}
// Check the frozen intervals against independent recomputation from the catalogue.
const recomputed = require('./future-sightlines.cjs').run();
assert.deepEqual(recomputed, future, 'Frozen sightline results need rebuilding');
assert.equal(R.readCatalogue().length, future.sampleSize);
const report = fs.readFileSync('Report.html', 'utf8');
assert.ok(report.includes('id="futureComparison"'));
assert.ok(report.includes('id="report-future-sightlines"'));
assert.ok(report.includes('Save selected scenario (JSON)'));
console.log('PASS Reader summaries preserve frozen calculations, safe shared settings, CSV units and interpretation limits');
