/* global __dirname */
/**
 * dinobot / courtship-display / display_act (Track B: GROW from 25 to 100+) — THE HERO of the path:
 * the display BEHAVIOUR, mid-motion, the body plan named first so Flux renders a dinosaur. Every
 * entry: "<body plan> <verb-ing> <the display act>, <what the anatomy does: flush, tremble, fan>,
 * <one physical trace: dust, spray, scattered soil, pressed mud>" — 24-31 words, lower-case start,
 * no full stop. No rival named as a fight, no location (the arena axis), no sky.
 *
 * Same idea = the BODY PLAN + the ACT. The 25 originals are kept byte-identical; each new entry
 * takes an unused (body plan, act) pair, plans spread evenly, with a colour flush and a trace as
 * flavour.
 */
const path = require('path');
const { byUsage, shuffle } = require('../lib/core');

const poolFile = path.join(__dirname, '../../bots/dinobot/seeds/dinobot_courtship_act.json');

const P = (words, re) => ({ words, re });
const PLANS = {
  'crested duckbill': P('crested duckbill', /crested duckbill/i),
  'sail-backed theropod': P('sail-backed theropod', /sail-backed theropod/i),
  'small feathered theropod': P('small feathered theropod', /small feathered theropod/i),
  'long-necked sauropod': P('long-necked sauropod', /long-necked sauropod/i),
  'horned ceratopsian': P('horned ceratopsian', /horned ceratopsian/i),
  'tyrannosaur-built theropod': P('tyrannosaur-built theropod', /tyrannosaur-built theropod/i),
  // ── new body plans, each named so Flux renders a dinosaur ──
  'dome-headed pachycephalosaur': P('dome-headed pachycephalosaur with a thick bony skull cap', /dome-headed/i),
  'plated stegosaur': P('plated stegosaur with a double row of back plates', /plated stegosaur/i),
  'armoured ankylosaur': P('armoured ankylosaur, low and wide with a tail club', /armoured ankylosaur/i),
  'ostrich-like ornithomimid': P('ostrich-like ornithomimid, long-legged and feathered', /ostrich-like/i),
  'sickle-clawed raptor': P('sickle-clawed feathered raptor', /sickle-clawed/i),
  'spinosaur fish-eater': P('long-snouted spinosaur with a tall back sail', /long-snouted spinosaur/i),
  'bulky iguanodont': P('bulky thumb-spiked iguanodont', /iguanodont/i),
  'tiny compsognathid': P('tiny sparrow-sized compsognathid theropod', /compsognathid/i),
  'frilled protoceratops': P('sheep-sized frilled protoceratops', /protoceratops/i),
  'crested oviraptorid': P('crested feathered oviraptorid', /oviraptorid/i),
  'therizinosaur': P('pot-bellied long-clawed therizinosaur', /therizinosaur/i),
  'tall-spined ouranosaur': P('tall-spined sail-backed ouranosaur', /ouranosaur/i),
};
const A = (words, re) => ({ words, re });
const ACTS = {
  'crest broadside': A('angling its crest broadside so it flushes darker with each pulse of blood', /crest broadside/i),
  'fin perpendicular': A('turning its dorsal fin perpendicular to a rival, the skin flushing from ochre to crimson', /fin perpendicular/i),
  'arm-fans bounding': A('throwing both arm-fans wide and bounding in place', /arm-fans wide and bounding/i),
  'neck arc': A('sweeping its entire neck through a slow lateral arc', /neck through a slow lateral arc/i),
  'circle scrape': A('scraping a wide circle into the clay with one forefoot', /scraping a wide circle/i),
  'head-back call': A('throwing its head back mid-call, jaws open', /head back mid-call/i),
  'stamping circle': A('stamping in a slow deliberate circle around a cleared patch', /stamping in a slow deliberate circle/i),
  'gift seed-pod': A('presenting a curved seed-pod held carefully in its beak', /presenting a curved seed-pod/i),
  'broadside silhouette': A('standing broadside on a low ridge with its fin angled for maximum silhouette', /broadside on a low ridge/i),
  'frond offering': A('laying a mouthful of freshly torn cycad fronds on the cleared ground', /mouthful of freshly torn/i),
  'crest bobbing': A('bobbing its crest in rapid vertical pulses', /bobbing its crest/i),
  'paired frills': A('standing parallel to a matched animal, both frills held at identical angles', /parallel to a second|matched animal, both/i),
  'throat sac boom': A('inflating its throat sac mid-boom into a taut globe', /throat sac/i),
  'low circling': A('circling with its head carried low over the other animal\'s back', /head carried low/i),
  'tail-fan shiver': A('raising its tail-fan of plumes and shivering them into a blur', /tail-fan of elongated plumes|shivering them rapidly/i),
  'gift stone': A('presenting a rounded river stone gripped gently in its bill', /rounded river stone/i),
  'arena clearing': A('clearing an arena with broad sweeps of its head', /clearing an arena/i),
  'dewlap inflate': A('inflating a loose dewlap of blue skin beneath the jaw', /dewlap/i),
  'pebble mound': A('building a low mound of tamped earth and arranged pebbles', /mound of tamped earth/i),
  'figure-eight sway': A('swaying its neck in a wide lateral figure-eight', /figure-eight/i),
  'neck colour flush': A('flushing the loose skin of its neck through a rapid sequence of blue to violet', /sequence of blue to violet/i),
  'rhythmic stamp': A('stamping a slow rhythmic pattern into the clearing', /rhythmic pattern/i),
  'skull-resonant call': A('throwing its head back with jaws spread, the skull bones amplifying a call', /resonating bones/i),
  'mirror display': A('displaying side by side with a matched rival in mirror-image postures', /mirror-image/i),
  'ring scrape': A('scraping a ring of earth outward with alternating hind feet', /ring of scraped earth/i),
  // ── new acts ──
  'plate flush': A('flushing its back plates from dull grey to blazing orange in a wave from front to rear', /plates? from dull grey|wave from front to rear/i),
  'head-butt feint': A('lowering its dome and feinting a head-butt at empty air, then rearing back', /feinting a head-butt/i),
  'tail-club drum': A('drumming its tail club on a hollow log in a slow beat', /tail club/i),
  'high-step strut': A('strutting past in an exaggerated high-step with feathers fluffed to double size', /exaggerated high-step/i),
  'wing-fan freeze': A('snapping both feathered arms open like fans and freezing dead still', /snapping both feathered arms open/i),
  'sail sun-catch': A('turning its sail into the low sun so the light glows through every ray', /sail into the low sun/i),
  'thumb-spike flash': A('raising both forelimbs to flash the pale undersides and thumb spikes', /flash the pale undersides/i),
  'hop and spin': A('hopping straight up and spinning a full turn before landing', /hopping straight up and spinning/i),
  'frill flare': A('flaring its frill and tilting it toward the light so the colour rings blaze', /flaring its frill/i),
  'egg-shaped stone gift': A('rolling an egg-shaped stone toward the other animal with its snout', /egg-shaped stone/i),
  'claw-clack': A('clacking its long claws together in a slow rhythm held high', /clacking its long claws/i),
  'spine ripple': A('rippling colour up its tall spines in a slow wave', /rippling colour up/i),
  'dust bath spray': A('flinging dust over its own back in a shimmering arc', /flinging dust over its own back/i),
  'branch gift': A('dragging a flowering branch across the cleared ground and dropping it', /flowering branch/i),
  'crouch and quiver': A('crouching low with its whole body quivering and tail tip flicking', /crouching low with its whole body quivering/i),
  'neck-stretch sky': A('stretching its neck straight up and holding the pose with throat pulsing', /neck straight up/i),
  'water splash': A('slapping the shallows with its tail to throw up a curtain of spray', /slapping the shallows/i),
  'leaf-shower': A('shaking a low branch to bring down a shower of leaves over itself', /shower of leaves/i),
  'side-step dance': A('side-stepping in a tight shuffle with its head low and swaying', /side-stepping in a tight shuffle/i),
  'feather-flag wave': A('waving one arm-fan slowly like a flag while the other stays folded', /waving one arm-fan/i),
  'pebble stack': A('stacking flat pebbles one on another with its snout', /stacking flat pebbles/i),
  'tail whip arc': A('whipping its tail through a wide arc that scatters loose sand', /whipping its tail/i),
  'crest inflate': A('inflating a soft crest of skin along its snout to twice its size', /inflating a soft crest/i),
  'rear and roar': A('rearing onto its hind legs and bellowing straight upward', /rearing onto its hind legs/i),
  'mirror bow': A('bowing low with its neck curved down to the ground and holding it', /bowing low/i),
  'log-kick': A('kicking a rotten log to pieces in a burst of dust and beetles', /kicking a rotten log/i),
  'feather preen show': A('preening one wing-fan in slow deliberate strokes while watching sideways', /preening one wing-fan/i),
  'chest puff': A('puffing its chest feathers out into a round shield of colour', /puffing its chest/i),
  'sand-circle spin': A('spinning slowly on the spot to scribe a perfect circle in the sand', /scribe a perfect circle/i),
  'twig parade': A('parading with a long twig held high in its beak', /long twig held high/i),
};
const ORIGINAL_ACTS = Object.keys(ACTS).slice(0, 25);
const TRACES = ['dust motes drifting through the shaft of light it dominates', 'loose soil scattering beneath its shifting weight', 'the ground beneath it pattered with rapid toe-strikes', 'a fine spray of moisture catching the light', 'a low resonant exhalation rolling from its chest', 'loose leaflets tumbling and settling around it', 'neck tendons visibly tightening and releasing', 'deep impressions pressed into the soft riverbank mud', 'loose down drifting downwind', 'raw pale clay showing against dark loam', 'the whole torso visibly shuddering with the resonance', 'water droplets flicking at each reversal', 'musculature visibly rippling beneath the display', 'a tremor running through the packed earth', 'loose chest feathers flattening against the expelled air', 'a haze of pollen shaken loose into the light', 'small stones skittering away from each footfall', 'its shadow swinging across the cleared ground', 'breath steaming in the cool air', 'dry leaves lifting in the draught of the movement'];
const FLUSHES = ['ochre to deep crimson', 'grey to blazing orange', 'dull green to electric blue', 'sand to scarlet', 'slate to violet', 'cream to gold', 'rust to magenta', 'olive to turquoise'];

function first(rules, text) {
  let best = null;
  let at = Infinity;
  for (const [k, v] of Object.entries(rules)) {
    const m = text.match(v.re);
    if (m && m.index < at) { at = m.index; best = k; }
  }
  return best;
}
function parse(text) {
  const plan = first(PLANS, text) || 'dinosaur';
  const act = first(ACTS, text) || 'act';
  return { keys: [`plan:${plan}`, `act:${act}`], plan, act };
}
const sameGroup = (a, b) => a.plan === b.plan && a.act === b.act;
function planSlots({ slots }) {
  slots.forEach((s) => (s.tags = ['display']));
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
  const used = (p, a) => groups.some((g) => get(g).plan === p && get(g).act === a);
  const aUsed = (a) => groups.filter((g) => get(g).act === a).length;
  const plans = byUsage(shuffle(Object.keys(PLANS)), usage, (k) => 'plan:' + k);
  for (const plan of plans) {
    const acts = shuffle(Object.keys(ACTS)).filter((a) => !ORIGINAL_ACTS.includes(a) && aUsed(a) < 3 && !used(plan, a)).sort((a, b) => aUsed(a) - aUsed(b));
    if (!acts.length) continue;
    const act = acts[0];
    return {
      keys: [`plan:${plan}`, `act:${act}`],
      plan,
      act,
      planWords: PLANS[plan].words,
      actWords: ACTS[act].words,
      flush: spread(FLUSHES),
      trace: spread(TRACES),
      tags: [plan, act],
    };
  }
  return null;
}
function brief(batch, examples) {
  return `You write entries for one pool of a dinosaur-documentary bot: DinoBot's courtship-display path, the DISPLAY ACT axis: one animal mid-display, the hero behaviour of the picture. Every entry is ONE act in 24-32 words (COUNT THEM; over 36 is cut), starting lower-case with the body plan, one sentence with commas, ending with a physical trace and no full stop.

Examples already in the pool (match their voice, order and length exactly):
${examples.map((e) => '- ' + e).join('\n')}

Rules:
- Order, as the examples: the slot's body plan first (the exact words given, so the animal renders as a dinosaur), then the slot's act in your own words caught MID-MOTION, then what the anatomy does (a colour flush from the slot's colours, a tremble, a fan, a stretch), then the slot's physical trace.
- Only the displaying animal (a matched partner may be named only if the act names one). No place, no sky, no time of day (other axes). Documentary register, never cute. Describe only what is present; write no negative words.

Slots:
${batch
  .map((s, i) => {
    const a = s.assignment;
    return `${i + 1}. body plan: "${a.planWords}"; act: "${a.actWords}"; colour flush: ${a.flush}; trace: "${a.trace}"`;
  })
  .join('\n')}

Reply with a JSON array of ${batch.length} strings only.`;
}
const formatRe = /^[a-z][^.]{120,}[^.]$/;
const BANS = [
  ['place', /\b(forest|lake|beach|clearing at|desert|sunset|dawn|dusk|sky|canopy)\b/i],
  ['negation', /\b(no|not|never|without|nothing|nobody)\b/i],
];
function mechanical(cand, slot) {
  const p = [];
  const a = slot.assignment;
  const parsed = parse(cand);
  if (parsed.plan !== a.plan) p.push(`plan ${parsed.plan}≠${a.plan}`);
  if (parsed.act !== a.act) p.push(`act ${parsed.act}≠${a.act}`);
  const words = cand.split(/\s+/).length;
  if (words < 22 || words > 42) p.push(`${words} words`);
  if (!/ing\b/.test(cand.split(/\s+/).slice(0, 14).join(' '))) p.push('no mid-motion verb in the opening');
  for (const [n, re] of BANS) {
    const m = cand.match(re);
    if (m) p.push(`${n}:"${m[0]}"`);
  }
  return p;
}
function measure(pool, parsed) {
  const t = (f) => { const o = {}; parsed.forEach((p) => (o[p[f]] = (o[p[f]] || 0) + 1)); return o; };
  return { plan: t('plan'), act: t('act') };
}

module.exports = {
  name: 'dinobot/courtship_display/display_act',
  poolFile,
  basis: 'display = the body plan + the act; same when both match; greedy, pool order (the colour flush and the trace are flavour)',
  parse,
  sameGroup,
  planSlots,
  assign,
  brief,
  formatRe,
  mechanical,
  measure,
  batchSize: 6,
  lenBand: [130, 260],
  PLANS,
  ACTS,
};
