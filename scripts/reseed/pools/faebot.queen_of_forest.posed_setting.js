/* global __dirname */
/**
 * faebot / queen-of-the-forest / posed_setting (LOAD-BEARING) — ONE beautiful natural forest spot with
 * the queen's pose embedded in it, like an editorial portrait in a wild setting.
 * Recipe: scripts/gen-faebot-pool.js `faebot_queen_of_forest_posed_setting` (specific natural spot +
 * her pose + wild context + regal posed register; 35-60 words; no court chamber / built throne /
 * mushroom throne / castle / masonry, no features / regalia / clothing, no critters, no lighting /
 * weather, solo). Pool 2026-09-23: 200 entries over ~17 recipe pairings ("clear forest stream" ×14,
 * "large mossy boulder" ×17, "woven-root bridge" ×8 …). Same idea = spot + pose.
 */
const path = require('path');
const { byUsage } = require('../lib/core');

const poolFile = path.join(__dirname, '../../bots/faebot/seeds/faebot_queen_of_forest_posed_setting.json');

// real natural forest spots (never built) and which poses fit each
const SPOTS = {
  'root throne': ['a gnarled-root throne formed by the upturned roots of an ancient oak', ['seated', 'reclining']],
  'low branch over stream': ['a low tree-branch extending across a clear forest stream', ['posed on', 'seated', 'reclining']],
  'wildflower meadow': ['a wildflower meadow of bluebells and foxglove-spires', ['standing', 'kneeling', 'reclining', 'half-turned']],
  'mossy boulder by waterfall': ['a large mossy boulder beside a small waterfall', ['seated', 'posed on', 'standing']],
  'tree archway': ['a natural tree-archway of arching branches', ['framed in', 'standing', 'half-turned']],
  'clear stream': ['a clear forest stream', ['wading', 'crouched at', 'standing']],
  'hero tree': ['an ancient hero-tree with deeply furrowed bark', ['leaning against', 'standing', 'seated']],
  'fallen log': ['a fallen moss-log across a glade', ['seated', 'posed on', 'reclining']],
  'root bridge': ['a woven-root bridge over a stream', ['standing', 'posed on', 'seated']],
  'sun-shaft clearing': ['a sun-shaft clearing carpeted with moss', ['standing', 'kneeling', 'half-turned']],
  'stone bench': ['a natural stone bench at the base of a giant tree', ['seated', 'reclining']],
  'fern grotto': ['a fern-grotto with hanging moss curtains', ['standing', 'framed in', 'seated']],
  'lily pond': ['the edge of a lily-covered pond', ['posed at', 'kneeling', 'crouched at', 'standing']],
  'moss mound': ['a raised moss-mound in a mushroom-dotted glade', ['sitting cross-legged on', 'reclining', 'seated']],
  'wisteria arbor': ['a wisteria-cascade arbor', ['standing', 'framed in', 'half-turned']],
  'low limb': ['a low-growing tree-limb extending across a moss-floor', ['posed on', 'seated', 'reclining']],
  'mossy stump': ['a moss-covered ancient tree stump', ['seated', 'posed on', 'standing']],
  'stepping stones': ['a run of stepping stones across a shallow stream', ['standing', 'posed on', 'crouched at']],
  'cliff ledge': ['a mossy cliff ledge above a fern glen', ['seated', 'standing', 'reclining']],
  'bluebell carpet': ['a bluebell carpet under old beeches', ['kneeling', 'reclining', 'standing']],
  'hollow tree': ['the hollow of a vast ancient tree', ['framed in', 'seated', 'standing']],
  'willow curtain': ['a willow curtain trailing over a pool', ['standing', 'framed in', 'wading']],
  'rock outcrop': ['a low rock outcrop wrapped in moss', ['seated', 'posed on', 'reclining']],
  'waterfall pool rim': ['the rim of a waterfall plunge-pool', ['seated', 'crouched at', 'wading']],
  'birch glade floor': ['a pale birch glade floor of moss and leaf-litter', ['standing', 'kneeling', 'reclining']],
  'hazel bower': ['a hazel bower of arching stems', ['framed in', 'seated', 'standing']],
  'blossom bank': ['a petal-strewn bank under a blossoming tree', ['reclining', 'seated', 'kneeling']],
  'stone slab': ['a broad moss-edged stone slab', ['reclining', 'seated', 'sitting cross-legged on']],
  'river shallows': ['the pebbled shallows of a forest river', ['wading', 'crouched at', 'standing']],
  'boulder top': ['the flat top of a house-sized boulder', ['standing', 'seated', 'posed on']],
  'tree fork': ['the broad fork of an ancient oak', ['seated', 'posed on', 'reclining']],
  'lake shore': ['a still forest lake shore', ['standing', 'kneeling', 'wading']],
  'beech buttress': ['the root buttresses of a great beech', ['leaning against', 'seated', 'standing']],
  'foxglove glade': ['a foxglove glade', ['standing', 'kneeling', 'half-turned']],
  'fallen crown': ['the fallen crown of a storm-toppled giant', ['posed on', 'seated', 'standing']],
  'natural arch': ['a natural stone arch hung with ivy', ['framed in', 'standing', 'leaning against']],
  'heather bank': ['a heather bank at the forest edge', ['reclining', 'seated', 'kneeling']],
  'pine-needle floor': ['a pine-needle floor between tall trunks', ['standing', 'kneeling', 'reclining']],
};
const POSES = {
  seated: 'seated on',
  standing: 'standing in',
  'posed on': 'posed on',
  wading: 'wading ankle-deep in',
  'leaning against': 'leaning against',
  kneeling: 'kneeling in',
  reclining: 'reclining on',
  'framed in': 'standing framed in',
  'sitting cross-legged on': 'sitting cross-legged on',
  'half-turned': 'standing half-turned in',
  'crouched at': 'crouched at',
  'posed at': 'posed at',
};
const SPOT_RULES = [
  ['root throne', /root throne|root-throne|upturned roots|gnarled-root/i],
  ['root bridge', /root bridge|woven-root/i],
  ['low branch over stream', /branch (?:extending |arching )?(?:out |horizontally )?(?:across|over|above) (?:a |the )?(?:clear |forest )?stream/i],
  ['low limb', /tree-limb|low-growing limb|low limb/i],
  ['stepping stones', /stepping[- ]stone/i],
  ['waterfall pool rim', /plunge-pool|plunge pool|waterfall pool|pool at the foot of a waterfall/i],
  ['mossy boulder by waterfall', /boulder .{0,40}waterfall|waterfall .{0,40}boulder/i],
  ['tree archway', /archway|arch of (?:arching )?branches|branches arching into an arch/i],
  ['natural arch', /stone arch|natural arch/i],
  ['hero tree', /hero-tree|hero tree|furrowed bark|ancient trunk/i],
  ['beech buttress', /buttress/i],
  ['fallen crown', /fallen crown|storm-toppled|toppled giant/i],
  ['fallen log', /fallen (?:moss-)?log|moss-log|fallen trunk/i],
  ['mossy stump', /stump/i],
  ['tree fork', /\bfork\b/i],
  ['hollow tree', /hollow of|hollow tree|tree hollow/i],
  ['stone bench', /stone bench/i],
  ['stone slab', /stone slab|flat stone/i],
  ['boulder top', /top of a .*boulder|boulder-top|atop a .*boulder/i],
  ['rock outcrop', /outcrop/i],
  ['cliff ledge', /ledge/i],
  ['lily pond', /lily|pond/i],
  ['lake shore', /lake/i],
  ['river shallows', /river|shallows/i],
  ['willow curtain', /willow/i],
  ['wisteria arbor', /wisteria/i],
  ['hazel bower', /hazel|bower/i],
  ['fern grotto', /grotto/i],
  ['moss mound', /moss-mound|moss mound/i],
  ['sun-shaft clearing', /sun-shaft|sunlit clearing|clearing/i],
  ['bluebell carpet', /bluebell/i],
  ['foxglove glade', /foxglove glade/i],
  ['blossom bank', /petal-strewn|blossom|sakura|cherry/i],
  ['heather bank', /heather/i],
  ['birch glade floor', /birch/i],
  ['pine-needle floor', /pine-needle|pine needle/i],
  ['wildflower meadow', /meadow/i],
  ['clear stream', /stream|brook|creek/i],
];
const POSE_RULES = [
  ['sitting cross-legged on', /cross-legged/i],
  ['wading', /wading|ankle-deep|knee-deep/i],
  ['leaning against', /leaning against|leaning back against|leaning on/i],
  ['kneeling', /kneeling|knelt/i],
  ['reclining', /reclining|lying|stretched out|lounging/i],
  ['framed in', /framed (?:in|by|within)|standing (?:within|beneath|under) (?:a |the )?(?:natural )?(?:tree-)?arch/i],
  ['crouched at', /crouched|crouching/i],
  ['half-turned', /half-turned|half turned|turned to look back/i],
  ['posed on', /posed on|perched on|balanced on/i],
  ['posed at', /posed at|posed beside/i],
  ['seated', /seated|sitting/i],
  ['standing', /standing|stands/i],
];
const pick = (rules, text, fallback) => {
  for (const [k, re] of rules) if (re.test(text)) return k;
  return fallback;
};
function parse(text) {
  const head = text.split(',').slice(0, 2).join(',');
  const pose = pick(POSE_RULES, head, 'posed');
  const spot = pick(SPOT_RULES, text.split(',').slice(0, 3).join(','), 'spot');
  return { keys: [`spot:${spot}`, `pose:${pose}`], spot, pose };
}
const sameGroup = (a, b) => a.spot === b.spot && a.pose === b.pose;

function planSlots({ slots }) {
  slots.forEach((s) => (s.tags = ['setting']));
}
// Every pose that physically fits a spot (the per-spot lists above are the recipe's own pairings and
// stay as the preferred first choices; ~38 spots × 3 poses is fewer than 200 entries).
const ON_SPOTS = /throne|branch|boulder|log|bridge|bench|limb|stump|ledge|outcrop|slab|boulder top|tree fork|fallen crown|moss mound|stepping stones/;
const WATER_SPOTS = /stream|shallows|lake|pond|pool rim|stepping stones|willow curtain/;
const LEAN_SPOTS = /hero tree|beech buttress|natural arch|hollow tree|tree archway|hazel bower|wisteria arbor|fern grotto/;
function fits(spot) {
  const set = new Set(SPOTS[spot][1]);
  if (ON_SPOTS.test(spot)) ['seated', 'posed on', 'reclining', 'sitting cross-legged on', 'standing', 'kneeling'].forEach((p) => set.add(p));
  else ['standing', 'kneeling', 'reclining', 'half-turned', 'seated'].forEach((p) => set.add(p));
  if (WATER_SPOTS.test(spot)) ['wading', 'crouched at', 'posed at', 'standing', 'kneeling'].forEach((p) => set.add(p));
  if (LEAN_SPOTS.test(spot)) ['leaning against', 'framed in', 'half-turned', 'standing'].forEach((p) => set.add(p));
  return [...set];
}
function assign(slot, ctx) {
  const { usage, groups } = ctx;
  const among = (list, k) => list[Math.floor(Math.random() * Math.min(k, list.length))];
  for (let attempt = 0; attempt < 400; attempt++) {
    const spot = among(
      byUsage(Object.keys(SPOTS), usage, (k) => 'spot:' + k),
      5
    );
    const pose = among(
      byUsage(fits(spot), usage, (k) => 'pose:' + k),
      4
    );
    const cand = { spot, pose };
    if (groups.some((g) => sameGroup(g.assignment ? g.assignment : g, cand))) continue;
    return { keys: [`spot:${spot}`, `pose:${pose}`], spot, pose, words: SPOTS[spot][0], poseWords: POSES[pose], tags: [spot, pose] };
  }
  return null;
}
function brief(batch, examples) {
  return `You write entries for one pool of a painted-storybook fae bot: FaeBot queen-of-the-forest, the POSED SETTING: one beautiful natural forest spot with the queen's pose embedded in it, like an editorial portrait shoot in a wild setting. Every entry is ONE spot + pose in 35-60 words, one line, comma-separated phrases: her pose in or on the spot, the spot itself, the wild forest context around it, what her hands and posture are doing, how her gown falls. Keep EXACTLY the shape of the examples.

Examples already in the pool (match their voice and length):
${examples.map((e) => '- ' + e).join('\n')}

Rules:
- Open with EXACTLY the pose given ("${'Seated on'}", "Standing in", "Wading ankle-deep in" …) and the spot given, in your own natural wording; then the wild context; then hands, posture and gown. She is posed for the viewer (eye contact, model pose, regal pose all fine). Solo.
- Natural spots only: a root throne is a tree's own roots, a bench is a natural stone; nothing built, no court chamber, no castle or masonry, no mushroom throne.
- Name none of her features, regalia or jewellery, no critters or lesser fae, no lighting or weather. Describe only what is present; write no negative words.

Slots:
${batch
  .map((s, i) => {
    const a = s.assignment;
    return `${i + 1}. pose "${a.poseWords}"; spot "${a.words}"`;
  })
  .join('\n')}

Reply with a JSON array of ${batch.length} strings only.`;
}
const formatRe = /^(?:Seated|Sitting|Standing|Posed|Reclining|Kneeling|Perched|Leaning|Wading|Crouched|Framed|Half-turned)\b.{120,}$/;
const BANS = [
  ['built', /\b(throne room|court chamber|chamber|castle|masonry|carved|built|pillar|pillars|chandelier|lantern|bench arranged|audience)\b/i],
  ['mushroom throne', /mushroom[- ]throne|mushroom[- ]spire|throne of mushrooms/i],
  ['features', /\b(her (?:eyes|hair|skin|crown|antlers|circlet|jewels|jewellery|necklace|face)|eyes of|hair of)\b/i],
  ['cast', /\b(critter|critters|fox|deer|fawn|owl|bird|birds|butterfly|butterflies|fae|fairy|fairies|attendants?)\b/i],
  ['light-weather', /\b(god-rays|sunbeam|sunbeams|golden light|moonlight|mist|fog|rain|snow|dusk|dawn|sunset|sunrise|light streaming)\b/i],
  ['negation', /\b(no|not|never|without|nothing)\b/i],
];
function mechanical(cand, slot) {
  const p = [];
  const a = slot.assignment;
  const parsed = parse(cand);
  if (parsed.spot !== a.spot) p.push(`spot ${parsed.spot}≠${a.spot}`);
  if (parsed.pose !== a.pose) p.push(`pose ${parsed.pose}≠${a.pose}`);
  const words = cand.split(/\s+/).length;
  if (words < 28 || words > 66) p.push(`${words} words`);
  if (!/gown|dress|robe|hem|train|skirt/i.test(cand)) p.push('no gown line');
  if (!/hand|hands|arm|arms|palm|fingers/i.test(cand)) p.push('no hands');
  for (const [n, re] of BANS) {
    const m = cand.match(re);
    if (m) p.push(`${n}:"${m[0]}"`);
  }
  return p;
}
function measure(pool, parsed) {
  const t = (f) => {
    const o = {};
    parsed.forEach((p) => (o[p[f]] = (o[p[f]] || 0) + 1));
    return o;
  };
  return { spot: t('spot'), pose: t('pose') };
}

module.exports = {
  name: 'faebot/queen_of_forest/posed_setting',
  poolFile,
  basis: 'setting = natural spot + pose; same when both match; greedy, pool order',
  parse,
  sameGroup,
  planSlots,
  assign,
  brief,
  formatRe,
  mechanical,
  measure,
  batchSize: 6,
  lenBand: [200, 520],
};
