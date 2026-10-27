/* Frozen numerical report facts and source provenance; no network or PDF compiler. */
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const assert = require('node:assert/strict');
const DEFAULT_ROOT = path.resolve(__dirname, '..');
const inputFiles = [
  'data/gaia-nearby.csv', 'data/research-results.json', 'data/future-sightlines.json',
  'data/proxima-input.json', 'data/ephemeris-jupiter.json', 'data/ephemeris-saturn.json',
  'data/ephemeris-uranus.json', 'data/ephemeris-neptune.json', 'research.cjs',
  'future-sightlines.cjs', 'physics2026.cjs', 'dynamics.cjs', 'galactic-clock.cjs',
  'environment.cjs', 'stellar-motion.cjs', 'journey.cjs', 'solar-system.cjs',
  'ephemeris.cjs', 'lunar.cjs', 'export-illustrated.cjs', 'export-media.cjs',
  'create-share-media.py', 'report-latex/build_figures.py'
];
const read = (root, file) => fs.readFileSync(path.join(root, file), 'utf8');
const json = (root, file) => JSON.parse(read(root, file));
const sha = buffer => crypto.createHash('sha256').update(buffer).digest('hex');
function sourceHashes(root, candidateRoot = root) {
  return Object.fromEntries(inputFiles.map(file => {
    const candidate = path.join(candidateRoot, file);
    const data = fs.readFileSync(fs.existsSync(candidate) ? candidate : path.join(root, file));
    // The catalogue is intentionally byte-frozen; text source hashes ignore checkout line endings.
    return [file, sha(file.endsWith('.csv') ? data : data.toString('utf8').replace(/\r\n/g, '\n'))];
  }));
}
function makeFacts(root = DEFAULT_ROOT, candidateRoot = root) {
  const r = json(root, 'data/research-results.json'), f = json(root, 'data/future-sightlines.json');
  const P = require(path.join(root, 'physics2026.cjs'));
  const J = require(path.join(root, 'journey.cjs'));
  const E = require(path.join(root, 'environment.cjs'));
  const S = require(path.join(root, 'stellar-motion.cjs'));
  assert.equal(r.catalogueSha256, sha(fs.readFileSync(path.join(root, 'data/gaia-nearby.csv'))), 'Research catalogue checksum is stale');
  assert.equal(r.sampleSize, f.sampleSize, 'Future and century sample sizes differ');
  assert.equal(r.epoch, f.epoch, 'Future and century reference epochs differ');
  const century = f.epochs.find(x => x.years === r.years);
  assert.ok(century, 'The future table lacks the research interval');
  for (const [a, b] of [[century.accessibilityInitial, r.sum.c00], [century.accessibilityFuture, r.sum.c10], [century.accessibilityChange, r.sum.motion]]) {
    assert.ok(Math.abs(a - b) < 1e-11, 'Century figures disagree between numerical outputs');
  }
  const ratios = E.history.map(x => x.ratio), counts = E.history.map(x => x.expectedWithin10pc);
  return {
    schema: 1,
    note: 'Model results and assumptions, not discoveries. Source hashes are LF-normalized except the byte-frozen Gaia catalogue. No build timestamp is included.',
    sourceSha256: sourceHashes(root, candidateRoot),
    solar: {tangentialKmS: Math.hypot(P.velocity[0], P.velocity[1]) / P.KM_S,
      centuryPathAU: Math.hypot(P.velocity[0], P.velocity[1]) * 100,
      hundredLightYearsDurationYears: J.durationMyr * 1e6},
    research: {epoch: r.epoch, years: r.years, sampleSize: r.sampleSize, draws: r.draws,
      sum: r.sum, motionPercent: 100 * r.sum.motion / r.sum.c00, interval: r.interval.motion,
      gainers: r.gainers, losers: r.losers, sensitivity70: r.sensitivity.find(x => x.iwaMas === 70).motion},
    future: f.epochs,
    density: {localStars: E.params.localStars10pc, localPerPc3: E.localDensity,
      minimumRatio: Math.min(...ratios), maximumRatio: Math.max(...ratios),
      minimumStars: Math.min(...counts), maximumStars: Math.max(...counts)},
    proxima: {initial: S.proxima(0), closest: S.proxima(S.closestYears)}
  };
}
const integer = n => Math.round(n).toLocaleString('en-US');
const signed = (n, decimals) => (n >= 0 ? '+' : '-') + Math.abs(n).toFixed(decimals);
function macros(f) {
  const r = f.research, first = f.future.find(x => x.years === 100), last = f.future.find(x => x.years === 10000);
  const m = {
    ReportSolarSpeed: f.solar.tangentialKmS.toFixed(0), ReportCenturyPathLy: first.solarPathLy.toFixed(4),
    ReportCenturyPathAU: integer(f.solar.centuryPathAU),
    ReportHundredLightYearsRounded: integer(Math.round(f.solar.hundredLightYearsDurationYears / 100) * 100),
    ReportSampleSize: integer(r.sampleSize), ReportSampleSizeMath: String(r.sampleSize), ReportDraws: integer(r.draws),
    ReportBaselineInitial: r.sum.c00.toFixed(5), ReportBaselineFuture: r.sum.c10.toFixed(5),
    ReportMotionScore: signed(r.sum.motion, 6), ReportMotionPercent: signed(r.motionPercent, 5),
    ReportMotionPercentShort: signed(r.motionPercent, 4), ReportInstrumentScore: r.sum.technology.toFixed(5),
    ReportMotionLow: signed(r.interval[0], 5), ReportMotionHigh: signed(r.interval[1], 5),
    ReportGainers: String(r.gainers), ReportLosers: String(r.losers), ReportSensitivitySeventy: signed(r.sensitivity70, 5),
    ReportDensityLocalStars: integer(f.density.localStars), ReportDensityLocal: f.density.localPerPc3.toFixed(4),
    ReportDensityMinRatio: f.density.minimumRatio.toFixed(3), ReportDensityMaxRatio: f.density.maximumRatio.toFixed(3),
    ReportDensityMinStars: integer(f.density.minimumStars), ReportDensityMaxStars: integer(f.density.maximumStars),
    ReportProximaInitial: f.proxima.initial.distanceLy.toFixed(2), ReportProximaRadial: f.proxima.initial.radialKmS.toFixed(2),
    ReportProximaSpeed: f.proxima.initial.speedKmS.toFixed(2), ReportProximaClosest: f.proxima.closest.distanceLy.toFixed(2),
    ReportProximaClosestYears: integer(Math.round(f.proxima.closest.years / 100) * 100),
    ReportTenThousandAngle: last.solarAngleDeg.toFixed(5), ReportTenThousandPath: last.solarPathLy.toFixed(2)
  };
  for (const row of f.future) {
    const word = {100: 'Century', 1000: 'Millennium', 10000: 'TenMillennia'}[row.years];
    assert.ok(word, 'Report table requires explicit formatting for a new epoch');
    m[`Report${word}TablePath`] = row.solarPathLy.toFixed(4);
    m[`Report${word}TableSightline`] = row.years === 10000 ? (row.medianSightlineArcsec / 3600).toFixed(4) : row.medianSightlineArcsec.toFixed(1);
    m[`Report${word}TableChange`] = signed(row.accessibilityChangePercent, 4);
  }
  return m;
}
function tex(f) {
  return '% Generated by node report-latex/facts.cjs --write. Do not edit numerical values here.\n' +
    Object.entries(macros(f)).map(([key, value]) => `\\newcommand{\\${key}}{${value}}`).join('\n') + '\n';
}
function serialize(f) { return JSON.stringify(f, null, 2) + '\n'; }
function compareFacts(f, committedJson, committedTex) {
  assert.deepEqual(JSON.parse(committedJson), f, 'Report facts are stale: regenerate after reviewing model changes');
  assert.equal(committedTex.replace(/\r\n/g, '\n'), tex(f), 'LaTeX numerical macros are stale or edited manually');
}
function check(root = DEFAULT_ROOT, candidateRoot = root) {
  const f = makeFacts(root, candidateRoot);
  compareFacts(f, read(candidateRoot, 'report-latex/facts.json'), read(candidateRoot, 'report-latex/facts.tex'));
  const main = read(candidateRoot, 'report-latex/main.tex');
  assert.ok(main.includes('\\input{facts}'), 'main.tex must load the checked facts');
  const sections = ['01-question', '03-experiment', '04-neighbourhood'].map(n => read(candidateRoot, `report-latex/sections/${n}.tex`)).join('\n');
  for (const name of Object.keys(macros(f))) assert.ok(sections.includes(`\\${name}`), `Report fact ${name} is not used in the report`);
  return f;
}
if (require.main === module) {
  const args = process.argv.slice(2), value = key => args.includes(key) ? args[args.indexOf(key) + 1] : undefined;
  const root = path.resolve(value('--root') || DEFAULT_ROOT), output = path.resolve(value('--output-root') || root);
  if (args.includes('--write')) {
    const f = makeFacts(root, output);
    fs.mkdirSync(path.join(output, 'report-latex'), {recursive: true});
    fs.writeFileSync(path.join(output, 'report-latex/facts.json'), serialize(f));
    fs.writeFileSync(path.join(output, 'report-latex/facts.tex'), tex(f));
    console.log('Updated deterministic report facts and LaTeX macros; review changed scientific claims before publication.');
  } else {
    check(root, output);
    console.log('PASS Report facts, source hashes and LaTeX quantitative claims agree');
  }
}
module.exports = {makeFacts, macros, tex, serialize, compareFacts, check, sourceHashes};
