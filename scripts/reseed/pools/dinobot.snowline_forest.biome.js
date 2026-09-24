/* global __dirname */
/**
 * dinobot / snowline-forest / snowline_forest_biome (Track B: GROW from 25 to 100+) — THE HERO of
 * the path: the high conifer forest at the snowline, a Mesozoic vista. Every entry: "<A Mesozoic
 * LANDFORM at the snowline>, <the araucaria doing what the wind and rime do to them>, <snow and bare
 * rock>, <one melt or light detail>, <the SKYLINE refrain>" — 46-64 words, one sentence, no full
 * stop. The originals end on one of five skyline refrains ("every ridge crest above carrying only
 * wind-flagged trunks and bare wet rock" …); new entries keep that.
 *
 * Same idea = the LANDFORM + the DETAIL (melt-thread, rime, deadfall, cloud, tarn, lichen …). The 25
 * originals are kept byte-identical; each new entry takes an unused (landform, detail) pair with a
 * light and a refrain as flavour.
 */
const path = require('path');
const { byUsage, shuffle } = require('../lib/core');

const poolFile = path.join(__dirname, '../../bots/dinobot/seeds/dinobot_snowline_forest_biome.json');

const L = (body, re) => ({ body, re });
const LANDFORMS = {
  'ridgeline': L('a high Mesozoic ridgeline where the last araucaria stand tall and sparse against pale sky', /ridgeline|ridge crest at dusk|ridge just at treeline/i),
  'boulder field': L('a snowline boulder field above the final tree-line, ancient lichen-crusted rocks half-buried in crusted drifts', /boulder field/i),
  'hanging valley tarn': L('a hanging Mesozoic valley cradling a frozen tarn, its ice pale blue-grey and wind-scoured', /hanging (?:mesozoic )?valley|frozen (?:mesozoic )?tarn on a high bench|high bench/i),
  'steep lean slope': L('a steep prehistoric slope where wind-flagged conifers grow at a permanent lean', /steep prehistoric slope|permanent lean/i),
  'mountain pass': L('a Mesozoic mountain pass with pale cloud pouring through the gap', /mountain pass|snowline saddle/i),
  'upper slope at first light': L('an upper conifer slope at first light, snow unbroken except where a fallen trunk bridges a gully', /upper conifer slope/i),
  'lone giant': L('a prehistoric snowline ridge with a single massive araucaria 150ft tall still holding its ground', /single massive araucaria|150ft tall|ancient mesozoic conifer just below|snowline ridge with a single/i),
  couloir: L('a Mesozoic couloir cutting between snow-draped conifer stands', /couloir/i),
  'avalanche scar': L('a long prehistoric avalanche scar cutting through the upper forest', /avalanche scar/i),
  'treeline at midday': L('a Mesozoic treeline at midday, shadow-side snow crisp and blue-white while the sun-facing rock runs wet', /treeline at midday|snowline at late afternoon/i),
  'slope from below': L('a Mesozoic upper forest slope seen from below, the canopy thinning steadily upward into bare rock', /seen from below/i),
  'deadfall gully': L('a Mesozoic high valley where deadfall bridges a frozen gully in a tangle of rime-silvered trunks', /deadfall bridges|upper gully choked/i),
  'snow-loaded stand': L('a snow-loaded Mesozoic conifer stand in still cold morning air, each branch bent under white', /snow-loaded/i),
  'melt-stream slot': L('a Mesozoic upper slope where a wide melt-stream has cut a deep dark slot through the snowpack', /melt-stream has cut|melt-stream slot|deep dark slot/i),
  'high cirque': L('a prehistoric high cirque with snow-filled floor and steep rock walls', /cirque/i),
  'forest edge from above': L('a prehistoric forest edge at the snowline seen from above, dark canopy giving way sharply to open snowfield', /seen from above/i),
  // ── new landforms ──
  'frozen waterfall': L('a Mesozoic gorge where a waterfall has frozen into a blue-white column between rime-hung conifers', /frozen (?:waterfall|into a .{0,20}column)/i),
  'wind-scoured plateau': L('a wind-scoured summit plateau above the last trees, sastrugi ridges carved across the snow', /plateau|sastrugi/i),
  'moraine ridge': L('a moraine ridge of tumbled boulders below a glacier snout, the last araucaria rooted in its lee', /moraine/i),
  'glacier tongue': L('a glacier tongue reaching down between two conifer stands, its ice cracked and blue', /glacier/i),
  'rime-fog stand': L('a conifer stand lost in freezing fog, every needle furred white and the trunks fading to grey', /freezing fog|rime-fog|lost in fog/i),
  'hot-spring clearing': L('a steaming hot-spring clearing in the snowline forest, bare wet ground ringed by snow', /hot-spring|hot spring/i),
  'cornice edge': L('a snow cornice curling over a ridge edge above the treeline, blue in its shadow', /cornice/i),
  'scree slope': L('a scree slope of frost-shattered stone between conifer stands, snow caught in every hollow', /scree/i),
  'krummholz mat': L('a krummholz mat of ancient podocarp compressed flat across granite pavement', /krummholz/i),
  'ice-crusted lake': L('a high lake with its ice crust broken into plates at the shore and conifers dark along the far bank', /ice crust|broken into plates/i),
  'snow arch': L('a snow bridge arching over a melt-stream between two conifer banks', /snow bridge|snow arch/i),
  'sun-cupped snowfield': L('a snowfield pitted with sun cups below a wind-flagged conifer line', /sun cups|sun-cupped/i),
  'rock spire': L('a rock spire standing above the snowline with a single conifer rooted in a crack halfway up', /rock spire|spire standing/i),
  'burned snowline': L('a burned stand of black conifer snags at the snowline with snow heaped against each trunk', /burned|snags/i),
  'wind gap': L('a wind gap in a ridge with snow streaming through it in a level plume', /wind gap|level plume/i),
  'tarn outflow': L('the outflow of a tarn cutting a dark channel through snow toward a drop', /outflow/i),
  'frost-heave meadow': L('a frost-heaved meadow of stone polygons above the trees, snow in every groove', /frost-heave|stone polygons/i),
  'ice cave mouth': L('the mouth of an ice cave under a snow bank, blue inside, conifers leaning over it', /ice cave/i),
  'ridge shoulder': L('a ridge shoulder where the forest thins to a last dozen conifers standing apart', /ridge shoulder|last dozen/i),
};
const D = (body, re) => ({ body, re });
const DETAILS = {
  'melt-thread': D('a cold melt-thread cutting dark through the snowpack', /melt-thread|melt-stream|melt-channel|melt-water|running with melt/i),
  'rime crystals': D('rime crystals coating every upturned needle', /rime crystals|rime coating|rime thick|rime-furred|rime glazing|furred with rime|encased in rime|rime building/i),
  'low cloud': D('pale grey cloud pressing low over the bare rocky crest', /cloud/i),
  'deadfall bridge': D('a fallen ancient trunk bridging a shadow-dark gully', /fallen (?:ancient )?trunk|deadfall/i),
  'lichen': D('lichen in ochre and grey crusting every exposed surface', /lichen/i),
  'drip-holes': D('the snowpack marked only by dark drip-holes beneath every branch tip', /drip-holes/i),
  'root-buttress crescent': D('a crescent of deep snow sheltering in north-facing root buttresses', /root buttresses/i),
  'amber dusk light': D('cold amber dusk light catching the rime on the uppermost branches', /amber/i),
  'long blue shadows': D('long cold shadows from the last conifers striping the snow blue-grey', /striping the snow|long cold shadows/i),
  'grey mist threads': D('grey mist threading between the upper trunks', /mist/i),
  // ── new details ──
  'wind-blown spindrift': D('spindrift streaming off the crest in a glittering plume', /spindrift/i),
  'blue ice glaze': D('a glaze of blue ice over every windward rock face', /glaze of (?:blue )?ice|ice glaze/i),
  'snow-cap boulders': D('each boulder wearing a cap of undisturbed snow above a skirt of wet black rock', /cap of (?:undisturbed )?snow/i),
  'cone-drop holes': D('fallen cones lying in the melt-holes they have drilled into the snow', /melt-holes|cones lying/i),
  'hoar frost feathers': D('hoar frost grown into feathers along every shaded twig', /hoar frost/i),
  'crevasse shadow': D('a crevasse showing as a blue-black line across the white', /crevasse/i),
  'steam plume': D('a plume of steam rising from a hidden vent and freezing onto the nearest branches', /steam/i),
  'avalanche debris': D('avalanche debris in frozen blocks piled against the lowest trunks', /debris/i),
  'snow-bent sapling': D('a sapling bent double under snow and frozen in its bow', /sapling bent/i),
  'ice-fringed rock': D('icicles fringing every rock overhang in uneven lengths', /icicles/i),
  'wind ripple snow': D('wind ripples printed across the snowpack like a beach', /wind ripples/i),
  'frozen spray': D('frozen spray coating the boulders beside the water in white knobs', /frozen spray/i),
  'alpenglow': D('alpenglow burning rose on the highest snow while the forest sits in blue shadow', /alpenglow/i),
  'snow dust fall': D('snow dust sifting from a shaken branch in a slow glittering fall', /snow dust|sifting/i),
  'frost-cracked rock': D('a boulder split clean in two by frost, the halves leaning apart', /split clean|frost-cracked/i),
};
const REFRAINS = ['every ridge crest above carrying only wind-flagged trunks and bare wet rock', 'the skyline held by leaning araucaria and frost-shattered stone alone', 'the high ground above bearing only snow, scree and a few bent trunks', 'each crest above occupied by rime-feathered branches and nothing else', 'the ridgeline above given over to bare rock, drifted snow and standing deadwood'];
const LIGHTS = ['at first light', 'at cold amber dusk', 'under a pale grey sky', 'at midday under thin cloud', 'in blue late-afternoon shadow', 'under a cold ochre horizon', 'in flat white noon light', 'at dawn with the rim just touched by sun'];

const first = (rules, text) => {
  let best = null;
  let at = Infinity;
  for (const [k, v] of Object.entries(rules)) {
    const m = text.match(v.re);
    if (m && m.index < at) { at = m.index; best = k; }
  }
  return best;
};
const last = (rules, text) => {
  let best = null;
  let at = -1;
  for (const [k, v] of Object.entries(rules)) {
    const g = new RegExp(v.re.source, 'gi');
    let m;
    let hit = -1;
    while ((m = g.exec(text))) { hit = m.index; if (!m[0]) g.lastIndex++; }
    if (hit > at) { at = hit; best = k; }
  }
  return best;
};
function parse(text) {
  let body = text;
  for (const r of REFRAINS) body = body.replace(r, '');
  const head = body.split(',').slice(0, 2).join(',');
  const landform = first(LANDFORMS, head) || first(LANDFORMS, body) || 'snowline';
  // rime, melt and cloud are landform flavour in the originals; the DETAIL is the last one named
  // before the skyline refrain
  const detail = last(DETAILS, body) || 'detail';
  return { keys: [`landform:${landform}`, `detail:${detail}`], landform, detail };
}
const sameGroup = (a, b) => a.landform === b.landform && a.detail === b.detail;
function planSlots({ slots }) {
  slots.forEach((s) => (s.tags = ['snowline']));
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
  const used = (l, d) => groups.some((g) => get(g).landform === l && get(g).detail === d);
  const dUsed = (d) => groups.filter((g) => get(g).detail === d).length;
  const lands = byUsage(shuffle(Object.keys(LANDFORMS)), usage, (k) => 'landform:' + k);
  for (const landform of lands) {
    const dets = shuffle(Object.keys(DETAILS)).filter((d) => dUsed(d) < 5 && !used(landform, d)).sort((a, b) => dUsed(a) - dUsed(b));
    if (!dets.length) continue;
    const detail = dets[0];
    return {
      keys: [`landform:${landform}`, `detail:${detail}`],
      landform,
      detail,
      landWords: LANDFORMS[landform].body,
      detailWords: DETAILS[detail].body,
      light: spread(LIGHTS),
      refrain: spread(REFRAINS),
      tags: [landform, detail],
    };
  }
  return null;
}
function brief(batch, examples) {
  return `You write entries for one pool of a dinosaur-documentary bot: DinoBot's snowline-forest path, the BIOME axis: the high Mesozoic conifer forest at the snowline, the place of the picture. Every entry is ONE vista in 46-62 words (COUNT THEM; over 70 is cut), one sentence with commas and no full stop.

Examples already in the pool (match their voice, order and length exactly):
${examples.map((e) => '- ' + e).join('\n')}

Rules:
- Order, as the examples: the slot's landform in your own words (named Mesozoic or prehistoric, with the slot's light), what wind and rime do to the araucaria or conifers there, snow against bare wet rock; then the slot's detail in your own words placed AFTER the landform clause; and end with the slot's skyline refrain verbatim.
- Only araucaria, podocarp and conifers, snow, rock, ice, lichen, cloud. No animal, no dinosaur, no people. Describe only what is present; write no negative words.

Slots:
${batch
  .map((s, i) => {
    const a = s.assignment;
    return `${i + 1}. landform: "${a.landWords}"; light: ${a.light}; detail: "${a.detailWords}"; refrain: "${a.refrain}"`;
  })
  .join('\n')}

Reply with a JSON array of ${batch.length} strings only.`;
}
const formatRe = /^(A|An|The) [^.]{240,}[^.]$/;
const BANS = [
  ['animal', /\b(dinosaur|dinosaurs|herd|theropod|sauropod|raptor|bird|birds|tracks of)\b/i],
  ['negation', /\b(no|not|never|without|nobody)\b/i],
];
function mechanical(cand, slot) {
  const p = [];
  const a = slot.assignment;
  const parsed = parse(cand);
  if (parsed.landform !== a.landform) p.push(`landform ${parsed.landform}≠${a.landform}`);
  if (parsed.detail !== a.detail) p.push(`detail ${parsed.detail}≠${a.detail}`);
  const words = cand.split(/\s+/).length;
  if (words < 42 || words > 78) p.push(`${words} words`);
  if (!REFRAINS.some((r) => cand.includes(r))) p.push('no skyline refrain');
  for (const [n, re] of BANS) {
    const m = cand.match(re);
    if (m) p.push(`${n}:"${m[0]}"`);
  }
  return p;
}
function measure(pool, parsed) {
  const t = (f) => { const o = {}; parsed.forEach((p) => (o[p[f]] = (o[p[f]] || 0) + 1)); return o; };
  return { landform: t('landform'), detail: t('detail') };
}

module.exports = {
  name: 'dinobot/snowline_forest/biome',
  poolFile,
  basis: 'snowline = the LANDFORM + the one detail; same when both match; greedy, pool order (light and the skyline refrain are flavour)',
  parse,
  sameGroup,
  planSlots,
  assign,
  brief,
  formatRe,
  mechanical,
  measure,
  batchSize: 5,
  lenBand: [260, 500],
  LANDFORMS,
  DETAILS,
  REFRAINS,
};
