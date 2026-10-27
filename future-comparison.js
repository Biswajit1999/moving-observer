import future from './data/future-sightlines.json';
import * as S from './research-summary.cjs';

function download(text, name, type) {
  const url = URL.createObjectURL(new Blob([text], {type}));
  const a = document.createElement('a');
  a.href = url; a.download = name; a.click();
  setTimeout(() => URL.revokeObjectURL(url), 2000);
}

export function initFutureComparison() {
  const root = document.getElementById('futureComparison');
  if (!root) return;
  root.className = 'future-comparison research-lab';
  root.innerHTML = `<p class="report-kicker">Your question, in numbers</p>
    <h3>What changes while we travel?</h3>
    <p>Compare the same nearby-star sample over three intervals. Solar travel, a changed sightline and improved access are different measurements.</p>
    <div class="future-toolbar"><label for="futureYears">Years after 2026 <select id="futureYears">${future.epochs.map(x => `<option value="${x.years}">${S.format(x.years, 0)} years</option>`).join('')}</select></label><span>1,387 selected Gaia DR3 sources · fixed baseline thresholds</span></div>
    <div id="futureMetrics" class="future-metrics" aria-live="polite" aria-atomic="true"></div>
    <div class="future-findings"><section aria-labelledby="futureDistanceTitle"><h4 id="futureDistanceTitle">Do the stars get closer?</h4><div id="futureDistanceChart"></div><p class="lab-small">Distances at the two endpoints are compared. “Ends closer” does not mean continuous approach throughout the interval.</p></section><section aria-labelledby="futureAccessTitle"><h4 id="futureAccessTitle">Does imaging access improve?</h4><p id="futureAccessCounts"></p><p class="lab-small">The baseline stays at 60 mas, contrast 10⁻¹⁰ and planet G = 30. The separate century instrument experiment has its own controls.</p></section></div>
    <p id="futureReadout" class="future-answer"></p>
    <details class="future-assumptions"><summary>Assumptions and what these numbers cannot establish</summary><ul><li>One hypothetical Earth-radius planet on a 1 AU orbit per source, albedo 0.3; orientations and phases are averaged.</li><li>Constant relative velocities; no binary dynamics or differential Galactic acceleration. No new uncertainty propagation for 1,000 or 10,000 years.</li><li>The imaging score depends on distance and instrument thresholds. It does not test a known planet entering a transit band as the sightline changes.</li><li>The sample is selected and incomplete. There is no exposure-time budget, detection yield or probability of life in this calculation.</li></ul><a href="#catalogueExperiment">Inspect the century experiment and sensitivity →</a></details>
    <div class="lab-actions"><button type="button" id="copyFutureAnswer">Copy answer</button><button type="button" id="copyFutureLink">Copy link to this comparison</button><button type="button" id="downloadFutureCSV">Download all intervals (CSV)</button><button type="button" id="downloadFutureJSON">Save selected scenario (JSON)</button></div>
    <p id="futureStatus" role="status"></p><label id="futureCopyFallback" hidden>Copy this text manually<textarea id="futureCopyText" readonly rows="5"></textarea></label>`;
  const $ = id => document.getElementById(id);
  const choose = $('futureYears');
  choose.value = String(S.selection(location.search).years);
  function show() {
    const x = S.epoch(choose.value), n = future.sampleSize;
    const angle = x.medianSightlineArcsec;
    $('futureMetrics').innerHTML = `<div><span>Solar path · at 233 km/s</span><strong>${S.format(x.solarPathLy)} <small>ly</small></strong><p>Path through Galactic coordinates</p></div><div><span>Median sightline change</span><strong>${S.format(angle, 1)} <small>arcsec</small></strong><p>${S.format(angle / 3600)}° · relative stellar motion</p></div><div><span>Net imaging accessibility</span><strong>${S.signed(x.accessibilityChangePercent)}<small>%</small></strong><p>${S.format(x.accessibilityInitial, 5)} → ${S.format(x.accessibilityFuture, 5)} score</p></div>`;
    // Labels carry the counts so colour and bar length are never the only cues.
    $('futureDistanceChart').innerHTML = `<div class="future-count-bar" role="img" aria-label="${x.approaching} sources end closer and ${x.receding} end farther out of ${n}"><span style="width:${100 * x.approaching / n}%"></span><span style="width:${100 * x.receding / n}%"></span></div><div class="future-count-labels"><span><strong>${x.approaching}</strong> end closer</span><span><strong>${x.receding}</strong> end farther</span></div>`;
    $('futureAccessCounts').innerHTML = `<strong>${x.gainers}</strong> sources gain access, <strong>${x.losers}</strong> lose it; <strong>${n - x.gainers - x.losers}</strong> are unchanged at the numerical tolerance. A net increase does not mean every target improves.`;
    $('futureReadout').textContent = S.summary(x.years);
    $('futureStatus').textContent = '';
    $('futureCopyFallback').hidden = true;
  }
  choose.addEventListener('change', () => {
    show();
    const url = new URL(location.href); url.searchParams.set('years', choose.value);
    try { history.replaceState(null, '', url); } catch { /* Local-file origins can reject history changes. */ }
  });
  async function copy(text, confirmation) {
    try {
      if (!navigator.clipboard?.writeText) throw new Error('Clipboard unavailable');
      await navigator.clipboard.writeText(text);
      $('futureCopyFallback').hidden = true; $('futureStatus').textContent = confirmation;
    } catch {
      $('futureCopyText').value = text; $('futureCopyFallback').hidden = false;
      $('futureCopyText').focus(); $('futureCopyText').select();
      $('futureStatus').textContent = 'Automatic copying is unavailable. The text below is selected for manual copying.';
    }
  }
  $('copyFutureAnswer').onclick = () => copy(S.summary(choose.value), 'Answer copied, including assumptions and limitations.');
  $('copyFutureLink').onclick = () => copy(S.shareURL(choose.value, document.getElementById('researchIwa')?.value), 'Public report link copied with the selected interval and century sensitivity setting.');
  $('downloadFutureCSV').onclick = () => { download(S.csv(), 'Moving_Observer_100_1000_10000_years.csv', 'text/csv;charset=utf-8'); $('futureStatus').textContent = 'Saved all three intervals with units and catalogue provenance.'; };
  $('downloadFutureJSON').onclick = () => { download(JSON.stringify(S.snapshot(choose.value), null, 2) + '\n', `Moving_Observer_${choose.value}_years.json`, 'application/json'); $('futureStatus').textContent = 'Saved the selected baseline scenario, inputs, results and limitations.'; };
  show();
}
