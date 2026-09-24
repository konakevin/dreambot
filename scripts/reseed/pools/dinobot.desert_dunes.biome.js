/* global __dirname */
/**
 * dinobot / desert-dunes / desert_dunes_biome (Track B: GROW from 25 to 100+) — THE HERO of the path:
 * a pure paleo desert VISTA. Every entry: "<A LANDFORM> <in what light>, <its scale in feet>, <a second
 * landform or texture>, <one paleo marker: bleached bone, fossil strata, petrified trunks, wind-stunted
 * cycads>, <the far distance in haze>" — 47-61 words, one sentence, no full stop. No animal, no
 * living dinosaur (a bleached bone is the only trace), documentary register with measured heights.
 *
 * Same idea = the LANDFORM + the PALEO MARKER. The 25 originals are kept byte-identical; each new entry
 * takes an unused (landform, marker) pair with a light, a height and a distance as flavour.
 */
const path = require('path');
const { byUsage, shuffle } = require('../lib/core');

const poolFile = path.join(__dirname, '../../bots/dinobot/seeds/dinobot_desert_dunes_biome.json');

const L = (body, re) => ({ body, re });
const LANDFORMS = {
  'transverse ridge': L('a long transverse dune ridge marching to the horizon, its windward flank printed with razor-sharp ripples and the slip-face dropping into shadow', /transverse dune/i),
  'star dune': L('a solitary star dune rising from a flat ochre pan, its radiating arms casting hard-edged shadows', /star dune/i),
  'dune corridor': L('a wind-scoured corridor running between two dune walls, its floor polished flat', /corridor running|between two dune walls|corridor at its narrowest|corridor interior/i),
  'cracked pan': L('a cracked dry pan between dune fields, its pale clay surface broken into irregular plates', /cracked (?:dry |clay )?pan|pan at midday|clay pan/i),
  'slope avalanche': L('a dune slope mid-avalanche, loose amber sand cascading in a slow tongue down the slip-face', /avalanche|mid-collapse/i),
  'dunes against cliffs': L('a dune field spilling hard against bare red sandstone cliffs, sand climbing the cliff base in smooth tongues', /against bare red sandstone cliffs|dunes? against/i),
  'dune field at dusk': L('a vast transverse dune field stretching horizon to horizon at dusk, ridge after ridge receding', /dune field stretching|dune field at dusk|dune field at first light/i),
  'cycad hollow': L('a hollow between two dune arms filled with low cycad scrub, the surrounding dune walls curving overhead', /hollow between two dune/i),
  'dry wash': L('a dry wash cutting across a dune field, its bed floored with cracked pale clay and flanked by eroded banks', /dry wash/i),
  'star dune arm': L('a single star dune arm viewed from its narrow ridge, the crest dropping away on both sides', /star dune arm/i),
  'eroded overhang': L('an eroded dune margin where wind has carved a shallow overhang in compacted amber sandstone', /overhang/i),
  'crest along the ridge': L('a transverse dune ridge seen along its crest, the ridge running straight for a mile before bending into haze', /along its crest/i),
  'bone scatter flat': L('a bleached bone scatter across a ripple-printed sand flat between two dune arms', /bone scatter across/i),
  'strata face': L('fossil-bearing strata exposed at a dune field margin, cream and rust bands cut sharp by erosion', /^Fossil-bearing strata/i),
  'trough view': L('a dune slope viewed from the trough, the windward face rising in a smooth unbroken curve', /viewed from the trough/i),
  'pebble apron': L('a star dune base ringed by a flat apron of wind-polished pebbles', /apron/i),
  'crescent field': L('a crescent dune field, each barchan horn pointing downwind and casting a long curved shadow', /crescent dune|barchan/i),
  'corridor mouth': L('a wind-scoured sand corridor opening onto a vast dune plain', /corridor opening/i),
  'crest veil': L('a high dune crest at the moment the wind strips a continuous amber sand veil off its edge', /sand veil off/i),
  'cupped pan': L('a cracked clay pan cupped between four converging dune arms', /cupped between/i),
  // ── new landforms ──
  'yardang field': L('a field of wind-carved yardangs, ridges of soft rock streamlined into the shape of upturned hulls', /yardang/i),
  'salt flat': L('a white salt flat between dune fields, its crust buckled into low pressure ridges', /salt flat|salt crust/i),
  'rock arch': L('a natural sandstone arch standing at a dune field margin with sand banked through its opening', /sandstone arch|natural arch/i),
  'mesa remnant': L('a flat-topped mesa remnant standing alone above the dune sea, its cliffs banded', /mesa/i),
  'playa mirage': L('a wide playa shimmering with heat mirage, the far dunes floating above a band of false water', /playa|mirage/i),
  'seif dune line': L('a long seif dune running dead straight with the wind, its crest a knife edge', /seif/i),
  'inselberg': L('a granite inselberg rising rounded from the sand, boulders shed around its foot', /inselberg/i),
  'dune lake': L('a small blue-green lake cupped in a dune hollow, reeds at its edge and salt crust on its shore', /dune lake|lake cupped/i),
  'blowout bowl': L('a blowout bowl scooped from a dune crest, its floor of dark pebbles bared by the wind', /blowout/i),
  'gravel reg': L('a flat gravel reg of wind-polished stones stretching to a dune wall on the skyline', /gravel reg|reg of/i),
  'dune slack': L('a low damp dune slack between ridges with a crust of algae and a fringe of horsetails', /dune slack|slack between/i),
  'fossil log-jam': L('a fossil log-jam of petrified trunks piled where an ancient river left them, dunes lapping round', /log-jam|log jam/i),
  'wind-scoured pavement': L('a pavement of wind-scoured sandstone slabs with ripple marks frozen in the rock', /pavement/i),
  'cinder cone': L('a black cinder cone rising from the sand at the desert edge, its flanks streaked with ochre', /cinder cone/i),
  'oasis fringe': L('a fringe of tall cycads and ginkgos around a spring at the foot of a dune wall', /oasis|spring at the foot/i),
  'canyon mouth': L('the mouth of a narrow slot canyon opening onto the dune field, its walls in banded rust', /slot canyon|canyon mouth/i),
  'ripple sea': L('a sea of small ripple dunes barely knee-high stretching flat to a far escarpment', /ripple dunes|ripple sea/i),
  'sand-buried forest': L('a stand of dead trunks half buried by a marching dune, only their crowns showing', /half buried by|buried forest/i),
  'escarpment foot': L('the foot of a great escarpment where the dunes end against a wall of layered rock', /escarpment foot|foot of a great escarpment/i),
  'dune saddle': L('a saddle between two dune peaks with the wind streaming sand through the gap', /saddle/i),
};
const M = (body, re) => ({ body, re });
const MARKERS = {
  'wind-stunted cycads': M('wind-stunted cycads barely 4ft tall anchored in the hollow', /wind-stunted cycad|stunted cycad|cycad scrub|scrub cycads/i),
  'bleached bone': M('a scatter of bleached bone half-buried at the dune\'s base', /bleached (?:bone|rib|skull|vertebra)/i),
  'petrified trunks': M('tannin-dark petrified trunks poking from the sand', /petrified (?:trunks?|wood)/i),
  'fossil strata': M('fossil-bearing strata exposed in amber and rust bands', /fossil-bearing|fossil strata|fossil bone/i),
  'rounded pebbles': M('rounded pebbles strewn across the polished floor', /rounded pebbles|wind-polished pebbles/i),
  // ── new paleo markers ──
  'fossil footprints': M('a line of fossil footprints pressed into an exposed slab of ancient mudstone', /fossil footprints|footprints pressed/i),
  'ammonite bed': M('a bed of fossil ammonites weathering out of a low grey ledge', /ammonite/i),
  'petrified stump': M('a single petrified stump standing upright where it grew, its rings in stone', /petrified stump|rings in stone/i),
  'bone-white rib cage': M('a bone-white rib cage arching from the sand like a wrecked hull', /rib cage/i),
  'fossil fern slab': M('a slab of dark shale carrying the print of a fossil fern frond', /fossil fern|shale carrying/i),
  'skull in the bank': M('a great fossil skull weathering out of a bank in profile', /fossil skull|skull weathering/i),
  'eggshell fragments': M('a scatter of fossil eggshell fragments on a low rise of red earth', /eggshell/i),
  'gastroliths': M('a heap of polished gastrolith stones lying where a great gut once was', /gastrolith/i),
  'fossil shell hash': M('a ledge of fossil shell hash glittering white in the sun', /shell hash/i),
  'trackway ridge': M('a trackway of three-toed prints crossing a hardened ridge of ancient mud', /trackway|three-toed/i),
  'petrified log bridge': M('a petrified log lying across a gully like a bridge', /petrified log/i),
  'fossil tooth': M('a fossil tooth as long as a hand lying loose on the gravel', /fossil tooth/i),
  'wind-stunted ginkgo': M('one wind-stunted ginkgo no taller than a man clinging to a rock cleft', /stunted ginkgo/i),
  'horsetail seep': M('a patch of horsetails marking a seep in the dune slack', /horsetail/i),
  'fossil coral': M('a boulder of fossil coral from an older sea standing in the sand', /fossil coral/i),
};
const LIGHTS = ['under amber afternoon light', 'at dusk with violet shadow pooling', 'at first light, the slip-faces glowing rose-amber', 'at midday under flat white light', 'in late golden light raking sideways', 'under a hazed sky with the sun a pale disc', 'at the moment the wind lifts thin sand veils', 'with heat shimmer blurring the far crests'];
const HEIGHTS = ['80ft', '120ft', '150ft', '200ft', '60ft', '300ft', '100ft', '250ft'];
const DISTANCES = ['distant dune ridges dissolving into warm golden haze', 'the far dune field fading blue and soft into morning haze', 'amber haze blurring the distant plain on all sides', 'ancient eroded escarpments haze-blued on the far horizon', 'ridge after ridge receding in deepening violet-and-amber bands', 'dune crests shimmering in warm golden haze above'];

const first = (rules, text) => {
  let best = null;
  let at = Infinity;
  for (const [k, v] of Object.entries(rules)) {
    const m = text.match(v.re);
    if (m && m.index < at) { at = m.index; best = k; }
  }
  return best;
};
function parse(text) {
  const landform = first(LANDFORMS, text.split(',').slice(0, 2).join(',')) || first(LANDFORMS, text) || 'dunes';
  const marker = first(MARKERS, text) || 'marker';
  return { keys: [`landform:${landform}`, `marker:${marker}`], landform, marker };
}
const sameGroup = (a, b) => a.landform === b.landform && a.marker === b.marker;
function planSlots({ slots }) {
  slots.forEach((s) => (s.tags = ['dunes']));
}
const flavourUse = {};
const spread = (list) => {
  const c = byUsage(list, flavourUse)[0];
  flavourUse[c] = (flavourUse[c] || 0) + 1;
  return c;
};
function assign(slot, ctx) {
  const { usage, groups } = ctx;
  const get = (g) => (g.assignment ? g.assignment : g);
  const used = (l, m) => groups.some((g) => get(g).landform === l && get(g).marker === m);
  const mUsed = (m) => groups.filter((g) => get(g).marker === m).length;
  const lands = byUsage(shuffle(Object.keys(LANDFORMS)), usage, (k) => 'landform:' + k);
  for (const landform of lands) {
    const markers = shuffle(Object.keys(MARKERS)).filter((m) => mUsed(m) < 6 && !used(landform, m)).sort((a, b) => mUsed(a) - mUsed(b));
    if (!markers.length) continue;
    const marker = markers[0];
    return {
      keys: [`landform:${landform}`, `marker:${marker}`],
      landform,
      marker,
      landWords: LANDFORMS[landform].body,
      markerWords: MARKERS[marker].body,
      light: spread(LIGHTS),
      height: spread(HEIGHTS),
      distance: spread(DISTANCES),
      tags: [landform, marker],
    };
  }
  return null;
}
function brief(batch, examples) {
  return `You write entries for one pool of a dinosaur-documentary bot: DinoBot's desert-dunes path, the BIOME axis: a pure Mesozoic desert vista, the place of the picture. Every entry is ONE vista in 47-60 words, one sentence with commas and no full stop.

Examples already in the pool (match their voice, order, measured heights and length exactly):
${examples.map((e) => '- ' + e).join('\n')}

Rules:
- Order, as the examples: the slot's landform in your own words with the slot's light, a measured height (the slot's, in feet) on its main face, ripple lines or texture; then the slot's paleo marker in your own words; then the slot's far distance in haze last.
- Documentary register with measured scale. Only the desert: no living animal, no dinosaur, no people, no water except where the landform names it. Describe only what is present; write no negative words.

Slots:
${batch
  .map((s, i) => {
    const a = s.assignment;
    return `${i + 1}. landform: "${a.landWords}"; light: ${a.light}; height: ${a.height}; paleo marker: "${a.markerWords}"; distance: "${a.distance}"`;
  })
  .join('\n')}

Reply with a JSON array of ${batch.length} strings only.`;
}
const formatRe = /^[A-Z][^.]{250,}[^.]$/;
const BANS = [
  ['animal', /\b(dinosaur|dinosaurs|herd|theropod|sauropod|raptor|lizard|bird|birds|beetle)\b(?! fossil)/i],
  ['negation', /\b(no|not|never|without|nothing|nobody)\b/i],
];
function mechanical(cand, slot) {
  const p = [];
  const a = slot.assignment;
  const parsed = parse(cand);
  if (parsed.landform !== a.landform) p.push(`landform ${parsed.landform}≠${a.landform}`);
  if (parsed.marker !== a.marker) p.push(`marker ${parsed.marker}≠${a.marker}`);
  const words = cand.split(/\s+/).length;
  if (words < 42 || words > 68) p.push(`${words} words`);
  if (!/\d+ ?ft|\d+-foot|\d+ft/i.test(cand)) p.push('no measured height');
  for (const [n, re] of BANS) {
    const m = cand.match(re);
    if (m) p.push(`${n}:"${m[0]}"`);
  }
  return p;
}
function measure(pool, parsed) {
  const t = (f) => { const o = {}; parsed.forEach((p) => (o[p[f]] = (o[p[f]] || 0) + 1)); return o; };
  return { landform: t('landform'), marker: t('marker') };
}

module.exports = {
  name: 'dinobot/desert_dunes/biome',
  poolFile,
  basis: 'dunes = the LANDFORM + the paleo marker; same when both match; greedy, pool order (light, height and distance are flavour)',
  parse,
  sameGroup,
  planSlots,
  assign,
  brief,
  formatRe,
  mechanical,
  measure,
  batchSize: 5,
  lenBand: [270, 480],
  LANDFORMS,
  MARKERS,
};
