// Reader-facing summaries use the frozen results, never a second physical model.
const future = require('./data/future-sightlines.json');
const research = require('./data/research-results.json');
const format = (value, digits = 4) => Number(value).toLocaleString('en-GB', {maximumFractionDigits: digits});
const signed = (value, digits = 4) => (value >= 0 ? '+' : '') + format(value, digits);
function epoch(years) {
  return future.epochs.find(row => row.years === Number(years)) || future.epochs[0];
}
function selection(search = '') {
  const query = new URLSearchParams(search);
  const iwa = research.sensitivity.find(row => row.iwaMas === Number(query.get('iwa')))?.iwaMas || 60;
  return {years: epoch(query.get('years')).years, iwa};
}
function shareURL(years, iwa = 60) {
  const safe = selection('?years=' + years + '&iwa=' + iwa);
  const url = new URL('https://biswajit1999.github.io/moving-observer/Report.html');
  url.searchParams.set('years', safe.years);
  url.searchParams.set('iwa', safe.iwa);
  url.hash = 'report-future-sightlines';
  return url.href;
}
function summary(years) {
  const x = epoch(years);
  return `In ${format(x.years, 0)} years after ${future.epoch}, the Sun's adopted 233 km/s tangential motion covers ${format(x.solarPathLy)} light-years along its Galactic path. In the same ${format(future.sampleSize, 0)} selected Gaia DR3 sources, the median change in viewing direction is ${format(x.medianSightlineArcsec, 1)} arcseconds (${format(x.medianSightlineArcsec / 3600)} degrees); ${x.approaching} sources end closer and ${x.receding} farther. At the fixed baseline imaging thresholds, the summed accessibility changes from ${format(x.accessibilityInitial, 5)} to ${format(x.accessibilityFuture, 5)} (${signed(x.accessibilityChangePercent)}%). These are conditional accessibility scores, not planets discovered or evidence of life. The calculation assumes constant relative velocities and a hypothetical Earth-radius planet at 1 AU per source. It omits binary dynamics and differential Galactic acceleration; the longer intervals have no new uncertainty propagation.`;
}
function snapshot(years) {
  return {
    schema: 1, author: 'Biswajit Jana', project: 'The Moving Observer / Finding Earth 2.0',
    referenceEpoch: future.epoch, sampleSize: future.sampleSize,
    catalogueSha256: research.catalogueSha256,
    method: future.method, scenario: 'baseline thresholds at both epochs',
    instrument: research.instruments.baseline, hypotheticalPlanet: research.planet,
    results: epoch(years),
    summary: summary(years),
    limitations: ['Scores are not detection counts or habitability probabilities.',
      'Constant relative space velocities; binary dynamics and differential Galactic acceleration omitted.',
      'The isotropic imaging score responds to distance and thresholds, not to the absolute sky direction.',
      'No new uncertainty propagation for the 1,000- or 10,000-year rows.'],
    methodsURL: 'https://biswajit1999.github.io/moving-observer/Report.html#report-future-sightlines'
  };
}
function csv() {
  const columns = Object.keys(future.epochs[0]);
  return '# The Moving Observer; Biswajit Jana; reference epoch ' + future.epoch + '\n' +
    '# Selected Gaia DR3 sources: ' + future.sampleSize + '; catalogue SHA-256: ' + research.catalogueSha256 + '\n' +
    '# Fixed baseline thresholds: 60 mas; contrast 1e-10; planet G limit 30. Scores are not discoveries.\n' +
    '# Constant relative velocities; longer intervals have no new uncertainty propagation.\n' +
    columns.join(',') + '\n' + future.epochs.map(row => columns.map(key => row[key]).join(',')).join('\n') + '\n';
}
module.exports = {epoch, selection, shareURL, summary, snapshot, csv, format, signed};
