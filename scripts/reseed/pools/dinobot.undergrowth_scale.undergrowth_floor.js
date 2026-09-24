/* global __dirname */
/**
 * dinobot / undergrowth-scale / undergrowth_floor (Track B: GROW from 25 to 100+) — the forest floor
 * at ankle height written as a LANDSCAPE: fern stems are columns, a fallen log is a mountain range, a
 * puddle is a lake. Every entry: "<Floor FEATURE as a landscape>, <its scale-up detail>, <the light>,
 * <one small crisp detail: a dew bead, a seed-fluff spiral, a snail track>." 40-50 words, one
 * sentence. No animal (the resident axis), no giant (the giant axis).
 *
 * Same idea = the floor FEATURE + the small DETAIL. The 25 originals are kept byte-identical; each
 * new entry takes an unused (feature, detail) pair with a light and a scale word as flavour.
 */
const path = require('path');
const { byUsage, shuffle } = require('../lib/core');

const poolFile = path.join(__dirname, '../../bots/dinobot/seeds/dinobot_undergrowth_floor.json');

const F = (body, re) => ({ body, re });
const FEATURES = {
  'fern-stem cathedral': F('fern stems rising as columns through cathedral shadow', /fern[- ]stems?|fern columns/i),
  'fallen log range': F('a fallen log become a mountain range, bark lifting in overhanging shelves', /fallen log|log-top ridge|mossy log/i),
  'leaf-litter caves': F('leaf-litter floor of curled leaves arching into tunnels and caves', /leaf-litter|leaf litter/i),
  'puddle sea': F('a rain puddle vast as an inland sea', /puddle/i),
  'cycad vault': F('a cycad crown seen from directly beneath, every frond a rib of a vaulted ceiling', /cycad crown/i),
  'horsetail pillars': F("a horsetail forest at the water's edge, jointed stems rising like pillars", /horsetail/i),
  'root-buttress cliff': F('a root buttress rising as a cliff wall with a natural archway worn under its lowest sweep', /root buttress/i),
  'mushroom settlement': F('a mushroom ring standing as a full settlement, caps at shoulder, waist and knee height', /mushroom ring/i),
  'moss hummock land': F('moss in full living depth, a landscape of hummocks and valleys', /moss in full|moss landscape|hummock/i),
  'lone light patch': F('a single shaft of light hitting one small patch of bare soil in absolute isolation', /single shaft of (?:white )?light|hard shaft of late light/i),
  'ginkgo fan litter': F('deep ginkgo-leaf litter, the fans overlapping in gold and pale yellow', /ginkgo-leaf litter|ginkgo fan/i),
  // ── new floor features ──
  'pebble desert': F('a scatter of river pebbles become a boulder desert, each stone a house-sized dome', /river pebbles become|boulder desert/i),
  'bark-chip scree': F('a slope of shed bark chips become a scree field tumbling toward a dark crevasse', /bark chips|scree field/i),
  'seed-pod canyon': F('a split seed pod become a canyon, its two halves rising as cliffs either side', /seed pod become|seed-pod canyon/i),
  'spider-web bridge': F('a spider web strung between two stems become a suspension bridge across a gorge', /spider web|suspension bridge/i),
  'acorn hill': F('a fallen cone the size of a hill, its scales stepping up like terraces', /fallen cone the size|cone the size of a hill/i),
  'lichen plateau': F('a flat stone crusted in lichen become a plateau of grey and orange plains', /lichen plateau|crusted in lichen/i),
  'dew-drop lake chain': F('a chain of dew drops along a grass blade become a string of lakes on a ridge', /chain of dew|string of lakes/i),
  'fern-frond overpass': F('a bent fern frond arching overhead become a green overpass with light coming through it', /green overpass|frond arching overhead/i),
  'ant highway': F('a worn ant trail become a highway across a plain of packed soil', /ant trail|ant highway/i),
  'bracket-fungus stair': F('a column of bracket fungi up a stump become a spiral staircase', /bracket fungi up|spiral staircase/i),
  'rotten-wood cave': F('a hollow in a rotten log become a cave with a roof of amber fibre', /rotten log|hollow in a rotten/i),
  'seed-fluff drifts': F('drifts of seed fluff become snowdrifts against a fallen twig', /seed fluff become|snowdrifts/i),
  'sap-drip lake': F('a pool of dried sap become a glassy amber lake on the litter', /dried sap|amber lake/i),
  'twig log-jam': F('a tangle of fallen twigs become a log-jam across a channel of dark soil', /log-jam|tangle of fallen twigs/i),
  'liverwort marsh': F('a bed of liverwort become a green marsh of overlapping plates', /liverwort become|liverwort marsh/i),
  'footprint crater': F('a single giant footprint become a crater with a lake at its bottom', /footprint become|footprint crater/i),
  'snail-shell dome': F('an empty snail shell become a domed temple on the litter', /snail shell become|domed temple/i),
  'stone-flake cliff': F('a flake of stone standing on edge become a cliff face throwing a long shadow', /flake of stone|stone-flake/i),
  'leaf-vein delta': F('a skeleton leaf become a river delta of pale veins on dark ground', /skeleton leaf|river delta/i),
  'cone-scale stairs': F('a shed cone scale become a flight of stairs down to a puddle', /cone scale become|cone-scale stairs/i),
  'grass-stem forest': F('a stand of grass stems become a forest of pale green masts with seed heads for crowns', /grass stems become|grass-stem forest/i),
  'feather roof': F('a shed feather lying across two stems become a striped roof over a hollow', /shed feather|feather roof/i),
  'eggshell ruin': F('a broken eggshell become a white ruined dome on the litter', /eggshell/i),
  'root-hair veil': F('a curtain of fine root hairs from an undercut bank become a hanging veil', /root hairs|root-hair/i),
};
const D = (body, re) => ({ body, re });
const DETAILS = {
  'dew bead crozier': D('one curled crozier cupping a single bead of dew that holds the whole canopy inside it', /bead of dew that holds|crozier/i),
  'beetle-bore light needle': D('a beetle-bored hole in the underside letting in one bright needle of gold light', /bright needle of gold/i),
  'leaf-cave corridor': D('one leaf-cave entrance framing a corridor of amber shadow stretching back', /corridor of amber shadow/i),
  'drowned ginkgo leaf': D('a single drowned ginkgo leaf resting on the bottom in perfect golden silhouette', /drowned ginkgo/i),
  'coiled new frond': D('at the very centre a new frond coiled tight as a fist just beginning to open', /coiled tight as a fist/i),
  'footprint mud': D('the mud between the stems printed with the press of passing feet', /press of passing feet/i),
  'coin of light': D('a single coin of light falling through the canopy onto bare dark soil', /coin of light/i),
  'raindrop mirror cap': D('one cap holding a pooled raindrop at its exact centre like a mirror', /pooled raindrop/i),
  'dew lanterns': D('dew caught in the nap like thousands of tiny lanterns', /tiny lanterns/i),
  'pinned seed-fluff': D('a spiral of seed-fluff resting perfectly still as if pinned there', /seed-fluff resting|spiral of seed-fluff/i),
  'copper stem edges': D('every stem edged in backlit copper where fronds overlap the light path above', /edged in backlit copper/i),
  'slow drip chain': D('water still dripping from the lowest rim in a slow chain', /slow chain/i),
  'amber leaf roof': D('one large ginkgo fan-leaf bridging a gap between two mounds making a perfect amber roof', /amber roof/i),
  'half-sunk horsetail': D('a dead horsetail stem lying half-submerged along the near shore', /half-submerged/i),
  'spider thread span': D('a spider thread crossing the whole span catching the light', /spider thread/i),
  'broken reflection': D('perfectly still water holding a broken reflection of the green above', /broken reflection/i),
  'silver snail ribbon': D('a snail track dried to a silver ribbon crossing the threshold', /snail track|silver ribbon/i),
  'collapsed cap': D('a collapsed cap already returning to dark slick fibre', /collapsed cap/i),
  'one lit hummock': D('one low beam igniting a single hummock from within while everything around stays dim', /igniting|single hummock/i),
  'ankle mist': D('a thin mist lying ankle-height, perfectly level, glowing where the shafts cross it', /ankle-height|thin mist/i),
  'rainwater groove': D('a groove of trapped rainwater running along a central fold still bright', /groove of trapped rainwater/i),
  'moss-stem trees': D('individual moss-stems visible at this scale as tiny trees', /tiny trees/i),
  'floating leaflet shadow': D('a single cycad leaflet floating on the surface casting a long thin shadow', /leaflet floating/i),
  'bright joint rings': D('the joint-collars catching the light as bright rings up each stem', /bright rings/i),
  'seed-fluff fibres': D('every fibre of the fluff separately visible, its shadow stretching long across the moss', /every fibre/i),
  // ── new small details ──
  'water-drop lens': D('one water drop on a leaf tip magnifying the veins beneath it', /magnifying/i),
  'pollen dust road': D('a road of yellow pollen dust blown into a drift along the low ground', /pollen dust/i),
  'ant on the ridge': D('a single ant crossing the ridge line like a walker on a skyline', /single ant/i),
  'shadow of a frond': D('the shadow of one frond above lying across the ground in a perfect comb', /perfect comb/i),
  'spore cloud': D('a puff of spores caught mid-drift in a shaft of light', /puff of spores/i),
  'seed cracked open': D('one seed cracked open at the foot of the wall with a pale shoot already out', /pale shoot/i),
  'dew line': D('a straight line of dew beads along one vein like a row of street lamps', /row of street lamps/i),
  'fallen petal sail': D('a fallen petal standing on edge in the litter like a sail', /petal standing on edge/i),
  'bubble on the puddle': D('one bubble on the puddle skin holding a tiny curved reflection', /bubble on the puddle/i),
  'silk strand in light': D('a single strand of silk crossing the light shaft and glowing along its whole length', /strand of silk/i),
  'mud crack maze': D('cracks in the drying mud making a maze of canyons in miniature', /maze of canyons/i),
  'lichen medallion': D('one round lichen medallion on the stone glowing orange in the light', /lichen medallion/i),
  'hair root arch': D('a hair root arching from the bank with one drop hanging at its tip', /hair root arching/i),
  'tunnel of light': D('a tunnel of light bored through the litter by a gap above', /tunnel of light/i),
  'moss flower stalks': D('a crowd of moss flower stalks standing up like a crop with capsules for heads', /moss flower stalks|capsules for heads/i),
  'rolled leaf telescope': D('one leaf rolled into a tube lying like a telescope pointed at the canopy', /rolled into a tube|like a telescope/i),
  'wet bark gleam': D('one wet bark shelf gleaming like a roof after rain', /gleaming like a roof/i),
  'shadow crossing': D('a shadow of something passing far above sweeping across the whole scene', /shadow of something passing/i),
  'seed-head lantern': D('a translucent seed head lit from behind like a paper lantern', /paper lantern/i),
  'crumb of resin': D('a crumb of amber resin on the ground catching the light like a lamp', /crumb of amber/i),
};
const LIGHTS = ['hard shafts of amber light driving between them to the floor', 'backlit so every edge burns electric green', 'in deep green shade with one low beam', 'in full morning backlight, every rim gold', 'in afternoon side-light throwing long horizontal shadows', 'at dawn with the light coming in nearly horizontal', 'under a canopy glow of diffuse green', 'in one white shaft with the rest of the floor lost in blue-green dark', 'after rain with everything gleaming', 'in late gold light with depth of field falling away fast'];

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
  const feature = first(FEATURES, text) || 'floor';
  const detail = first(DETAILS, text) || 'detail';
  return { keys: [`feature:${feature}`, `detail:${detail}`], feature, detail };
}
const sameGroup = (a, b) => a.feature === b.feature && a.detail === b.detail;
function planSlots({ slots }) {
  slots.forEach((s) => (s.tags = ['floor']));
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
  const used = (f, d) => groups.some((g) => get(g).feature === f && get(g).detail === d);
  const dUsed = (d) => groups.filter((g) => get(g).detail === d).length;
  const feats = byUsage(shuffle(Object.keys(FEATURES)), usage, (k) => 'feature:' + k);
  for (const feature of feats) {
    const dets = shuffle(Object.keys(DETAILS)).filter((d) => dUsed(d) < 3 && !used(feature, d)).sort((a, b) => dUsed(a) - dUsed(b));
    if (!dets.length) continue;
    const detail = dets[0];
    return {
      keys: [`feature:${feature}`, `detail:${detail}`],
      feature,
      detail,
      featureWords: FEATURES[feature].body,
      detailWords: DETAILS[detail].body,
      light: spread(LIGHTS),
      tags: [feature, detail],
    };
  }
  return null;
}
function brief(batch, examples) {
  return `You write entries for one pool of a dinosaur-documentary bot: DinoBot's undergrowth-scale path, the FLOOR axis: the forest floor seen from ankle height and written as a LANDSCAPE, the place of the picture. Every entry is ONE floor scene in 40-50 words, one sentence.

Examples already in the pool (match their voice, order and length exactly):
${examples.map((e) => '- ' + e).join('\n')}

Rules:
- Order, as the examples: the slot's floor feature in your own words at ankle-height scale (a stem is a column, a log is a range, a puddle is a lake); the slot's light; then the slot's small crisp detail last.
- Mesozoic floor only: ferns, cycads, horsetails, ginkgo, moss, liverwort, lichen, fungi, litter, resin. No animal of any size, no dinosaur, no giant passing (other axes). Describe only what is present; write no negative words.

Slots:
${batch
  .map((s, i) => {
    const a = s.assignment;
    return `${i + 1}. floor feature: "${a.featureWords}"; light: "${a.light}"; small detail: "${a.detailWords}"`;
  })
  .join('\n')}

Reply with a JSON array of ${batch.length} strings only.`;
}
const formatRe = /^[A-Z].{200,}$/;
const BANS = [
  ['animal', /\b(dinosaur|dinosaurs|theropod|raptor|bird|birds|frog|lizard|mouse)\b/i],
  ['negation', /\b(no|not|never|without|nothing|nobody)\b/i],
];
function mechanical(cand, slot) {
  const p = [];
  const a = slot.assignment;
  const parsed = parse(cand);
  if (parsed.feature !== a.feature) p.push(`feature ${parsed.feature}≠${a.feature}`);
  if (parsed.detail !== a.detail) p.push(`detail ${parsed.detail}≠${a.detail}`);
  const words = cand.split(/\s+/).length;
  if (words < 30 || words > 58) p.push(`${words} words`);
  for (const [n, re] of BANS) {
    const m = cand.match(re);
    if (m) p.push(`${n}:"${m[0]}"`);
  }
  return p;
}
function measure(pool, parsed) {
  const t = (f) => { const o = {}; parsed.forEach((p) => (o[p[f]] = (o[p[f]] || 0) + 1)); return o; };
  return { feature: t('feature'), detail: t('detail') };
}

module.exports = {
  name: 'dinobot/undergrowth_scale/undergrowth_floor',
  poolFile,
  basis: 'floor = the floor FEATURE as a landscape + the one small detail; same when both match; greedy, pool order (the light is flavour)',
  parse,
  sameGroup,
  planSlots,
  assign,
  brief,
  formatRe,
  mechanical,
  measure,
  batchSize: 6,
  lenBand: [210, 400],
  FEATURES,
  DETAILS,
};
