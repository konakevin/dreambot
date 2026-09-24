/* global __dirname */
/**
 * dinobot / undergrowth-scale / undergrowth_resident (Track B: GROW from 23 to 100+) — the
 * chicken-sized dinosaur who lives on the forest floor, characterful and gorgeous, caught mid-motion
 * close to the lens. Every entry: "A <size> <body plan>, <plumage or hide colours>, bipedal or
 * four-legged, <tail or crest>, <the action mid-motion>, <the attitude in a clause>." 32-39 words,
 * one sentence. Never a drab lizard, never named to species.
 *
 * Same idea = the BODY PLAN + the ACTION. The 23 originals are kept byte-identical; each new entry
 * takes an unused (plan, action) pair with a size word, a plumage and an attitude as flavour.
 */
const path = require('path');
const { byUsage, shuffle } = require('../lib/core');

const poolFile = path.join(__dirname, '../../bots/dinobot/seeds/dinobot_undergrowth_resident.json');

const P = (body, re) => ({ body, re });
const PLANS = {
  'feathered theropod': P('feathered theropod, bipedal, long counterbalancing tail', /feathered theropod|theropod with barred|theropod gripping|theropod perched|theropod,/i),
  'armoured herbivore': P('armoured herbivore, low and wide, four-legged, rows of spines along its flanks', /armoured herbivore/i),
  'long-legged runner': P('long-legged runner, bipedal, banded tail held horizontal', /long-legged runner/i),
  climber: P('climber with a bipedal frame adapted for grip, long tail for counterbalance', /climber/i),
  burrower: P('burrower, bipedal but hunched low, robust forelimbs and blunt claws', /burrower/i),
  'juvenile giant theropod': P('juvenile of a large theropod species, wide hips and thick thighs scaled down to knee height', /juvenile of a large theropod/i),
  'juvenile ceratopsian': P('juvenile of a large ceratopsian relative, four-legged, a frill beginning to develop and tiny horn nubs', /ceratopsian/i),
  'juvenile ankylosaur': P('juvenile of a large ankylosaur relative, four-legged, wide and flat-bodied with plates just forming', /ankylosaur/i),
  'pair of theropods': P('pair of feathered theropods, bipedal, long tails', /pair of/i),
  // ── new body plans ──
  'crested hopper': P('crested hopper, bipedal with long hind legs built for leaping and a stiff quill crest', /crested hopper|built for leaping/i),
  'fluffy hatchling': P('fluffy hatchling of a duck-billed hadrosaur, four-legged and round, covered in pale down', /hadrosaur|duck-billed|fluffy hatchling/i),
  'gliding lizard-dino': P('four-winged glider with feathered arms and legs, bipedal on the ground with a long vaned tail', /four-winged|glider/i),
  'beaked ornithopod': P('rabbit-sized beaked ornithopod, bipedal, quilled along its back with a stiff tail', /beaked ornithopod|ornithopod/i),
  'tiny sickle-claw': P('tiny sickle-clawed raptor, bipedal, one raised toe-claw on each foot and long arm feathers', /sickle-claw/i),
  'shrew-sized mammal-like': P('shrew-sized furred mammal, low to the ground with whiskers and a naked tail', /furred mammal|shrew-sized/i),
  'ground beetle-hunter': P('needle-snouted theropod, bipedal, with a fringe of hair-like feathers', /needle[- ]snout/i),
  'dome-headed juvenile': P('juvenile dome-headed pachycephalosaur, bipedal, the skull cap just thickening', /dome-headed|pachycephalosaur/i),
  'crested oviraptorid': P('cat-sized crested oviraptorid, bipedal, toothless beak and a fan of tail feathers', /oviraptorid/i),
  'stripe-tailed scansor': P('stripe-tailed scansor, bipedal with a long ribbon-like tail feather and clinging claws', /scansor|ribbon-like tail/i),
  'quilled iguanodont hatchling': P('quilled hatchling of a large iguanodont, four-legged with a beak and thumb-spike nubs', /iguanodont/i),
  'ground-nesting bird-like': P('pigeon-sized bird-like theropod with a fanned tail and clawed wings', /bird-like|clawed wings/i),
};
const A = (body, re) => ({ body, re });
const ACTIONS = {
  'scratching litter': A('scratching the leaf litter with both foot-claws in quick alternating sweeps', /scratching/i),
  'head tilt at beetle': A('tilting its head sideways at a beetle on a rotting log', /tilting its head sideways|cock(?:ing|s) its head/i),
  'nosing debris': A('nosing through wet debris with its flat snout', /nosing through|nosing each stem|nosing a fallen/i),
  'mid-stride dash': A('caught mid-stride across open litter, one foot lifted, weight forward', /mid-stride|full-speed dash/i),
  'gripping a fern stem': A('gripping a thick fern stem with both hand-claws and one foot, peering down', /gripping a thick fern|clinging to the underside/i),
  'emerging from a hole': A('half emerged from a fresh hole in the bank, soil crusted on its snout', /half emerged|half-out|emerging from a tunnel/i),
  'sentry and forager': A('one standing upright and still with eyes on the canopy, the other scratching nearby', /standing upright and perfectly still/i),
  'toddling a log ridge': A('toddling along a mossy log ridge', /toddling/i),
  'perched surveying': A('perched on the highest point of a fallen log surveying the floor below', /perched on the highest|perched on the edge|perched sideways/i),
  'shaking off rain': A('shaking rain off its dense plumage in a full-body shudder', /shaking rain/i),
  'probing bark': A('methodically probing bark with its snout beside an alert partner', /probing bark/i),
  'nosing a seed pod': A('nosing a fallen seed pod with its brow furrowed', /nosing a fallen seed pod/i),
  'drinking at a puddle': A('drinking at the edge of a moss-rimmed puddle, tail raised for balance', /drinking at/i),
  'sitting in fern': A('sitting in a patch of soft fern blinking slowly at nothing in particular', /sitting in a patch/i),
  'tongue-flick pause': A('pausing to taste the air with a quick tongue-flick', /tongue-flick/i),
  'leaning into a crevice': A('leaning far out from a diagonal log to investigate a crevice below', /leaning far out/i),
  // ── new actions ──
  'leaping a puddle': A('caught mid-leap over a puddle with both legs tucked', /mid-leap/i),
  'dust bathing': A('rolling in a patch of dry dust with legs in the air', /rolling in .{0,20}dust|dust bath/i),
  'stalking a dragonfly': A('frozen mid-stalk with one foot raised toward a dragonfly on a frond', /mid-stalk|stalk(?:ing)? .{0,20}dragonfly/i),
  'preening': A('preening one arm-feather through its beak with eyes half closed', /preening/i),
  'carrying a leaf': A('carrying a leaf far too big for it in its beak', /carrying a leaf|leaf far too big/i),
  'yawning': A('mid-yawn with its jaws stretched wide and eyes squeezed shut', /mid-yawn|yawn/i),
  'balancing on a mushroom': A('balancing on the cap of a mushroom with its tail out straight', /balancing on/i),
  'digging a hollow': A('digging a shallow hollow with alternating hand-claws, soil flying', /digging a shallow hollow|soil flying/i),
  'stretching after sleep': A('stretching one leg straight back the way a bird does on waking', /stretching one leg/i),
  'peering into a burrow': A('peering down a burrow mouth with its whole head inside', /peering down a burrow|head inside/i),
  'chasing a moth': A('snapping at a moth an inch from its beak, feathers puffed', /snapping at a moth|moth an inch/i),
  'sunning on a stone': A('flat on a warm stone with wings spread to the sun', /warm stone with|sunning/i),
  'squabbling over a beetle': A('two of them tugging opposite ends of one beetle', /tugging opposite ends/i),
  'hiding under a leaf': A('crouched under a fallen leaf with only its eyes and snout showing', /crouched under a fallen leaf|only its eyes/i),
  'carrying a twig': A('dragging a twig twice its length toward a half-built nest', /dragging a twig/i),
  'listening': A('stock-still with its head turned to listen, one foot mid-air', /head turned to listen|stock-still/i),
  'climbing a horsetail': A('climbing a horsetail stem hand over hand with its tail wrapped round it', /climbing a horsetail/i),
  'splashing in a seep': A('splashing in a shallow seep with water flying from its feet', /splashing/i),
  'sleeping curled': A('curled asleep in a hollow between roots with its tail over its nose', /curled asleep|tail over its nose/i),
  'sniffing a mushroom': A('sniffing a mushroom cap with its snout pressed to the gills', /sniffing a mushroom/i),
  'chick following': A('followed by a line of three fuzzy chicks along a root', /line of three|fuzzy chicks/i),
  'eating a berry': A('holding a red berry in both hand-claws and biting it', /red berry/i),
  'shaking a frond': A('shaking a fern frond to bring down the beetles on it', /shaking a fern frond/i),
  'looking straight at the lens': A('looking straight into the lens from a hand-span away with total confidence', /straight into the lens/i),
  'wading': A('wading a shallow puddle with its tail held high and dry', /wading/i),
};
const SIZES = ['chicken-sized', 'turkey-sized', 'cat-sized', 'sparrow-sized', 'rabbit-sized', 'pigeon-sized', 'thrush-sized', 'crow-sized'];
const PLUMAGES = ['barred rust and cream feathers', 'iridescent green-black plumage', 'sandy hide with dark rosette spots', 'body feathers barred grey and tawny', 'pale sandy feathers with dark streaks', 'spotted brown and cream fuzz', 'feathers barred deep chestnut and pale buff', 'spotted tawny and dark brown', 'barred olive and cream feathers', 'deep blue-grey feathers with rust-barred flanks', 'copper and cream plumage', 'dark olive hide with bold cream stripes', 'barred grey-green and white feathers', 'iridescent blue-green feathers', 'russet feathers with a white throat', 'slate feathers with a saffron crest', 'pale gold down with brown flecks', 'black plumage with a white eye-ring', 'moss-green feathers with orange cheeks', 'dappled fawn and white hide'];
const ATTITUDES = ['entirely absorbed in wherever it is going', 'looking pleased with the situation', 'with great proprietary satisfaction', 'wholly committed to the task', 'with the focused air of a connoisseur', 'as if it owns every leaf', 'with an expression of mild outrage', 'with a calm that suggests it has seen worse', 'with enormous seriousness', 'and plainly enjoying itself', 'with a look of deep suspicion', 'utterly unbothered by the lens'];

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
  const plan = first(PLANS, text) || 'dinosaur';
  const action = first(ACTIONS, text) || 'action';
  return { keys: [`plan:${plan}`, `action:${action}`], plan, action };
}
const sameGroup = (a, b) => a.plan === b.plan && a.action === b.action;
function planSlots({ slots }) {
  slots.forEach((s) => (s.tags = ['resident']));
}
const flavourUse = {};
const spread = (list) => {
  const c = byUsage(list, flavourUse)[0];
  flavourUse[c] = (flavourUse[c] || 0) + 1;
  return c;
};
const ORIGINAL_ACTIONS = Object.keys(ACTIONS).slice(0, 16);
function assign(slot, ctx) {
  const { usage, groups } = ctx;
  const get = (g) => (g.assignment ? g.assignment : g);
  const used = (p, a) => groups.some((g) => get(g).plan === p && get(g).action === a);
  const aUsed = (a) => groups.filter((g) => get(g).action === a).length;
  const plans = byUsage(shuffle(Object.keys(PLANS)), usage, (k) => 'plan:' + k);
  for (const plan of plans) {
    const acts = shuffle(Object.keys(ACTIONS)).filter((a) => !ORIGINAL_ACTIONS.includes(a) && aUsed(a) < 4 && !used(plan, a)).sort((a, b) => aUsed(a) - aUsed(b));
    if (!acts.length) continue;
    const action = acts[0];
    return {
      keys: [`plan:${plan}`, `action:${action}`],
      plan,
      action,
      planWords: PLANS[plan].body,
      actionWords: ACTIONS[action].body,
      size: spread(SIZES),
      plumage: spread(PLUMAGES),
      attitude: spread(ATTITUDES),
      tags: [plan, action],
    };
  }
  return null;
}
function brief(batch, examples) {
  return `You write entries for one pool of a dinosaur-documentary bot: DinoBot's undergrowth-scale path, the RESIDENT axis: the small dinosaur who lives on the forest floor, caught mid-motion close to the lens, characterful and gorgeous. Every entry is ONE animal in 32-40 words, one sentence.

Examples already in the pool (match their voice, order and length exactly):
${examples.map((e) => '- ' + e).join('\n')}

Rules:
- Order, as the examples: "A <the slot's size> <the slot's body plan in your own words>, <the slot's plumage or hide>, bipedal or four-legged as the plan says, <tail or crest>, <the slot's action mid-motion>, <the slot's attitude>."
- Never a species name, never a drab lizard; feathers and colour named plainly. Only the resident (a pair or chicks only if the plan or action names them); no floor description, no giant (other axes). Describe only what is present; write no negative words.

Slots:
${batch
  .map((s, i) => {
    const a = s.assignment;
    return `${i + 1}. size: ${a.size}; body plan: "${a.planWords}"; plumage: ${a.plumage}; action: "${a.actionWords}"; attitude: "${a.attitude}"`;
  })
  .join('\n')}

Reply with a JSON array of ${batch.length} strings only.`;
}
const formatRe = /^A .{150,}$/;
const BANS = [
  ['species', /\b(velociraptor|compsognathus|microraptor|psittacosaurus|protoceratops|t-rex|tyrannosaurus|triceratops|ankylosaurus|deinonychus)\b/i],
  ['negation', /\b(no|not|never|without)\b/i],
];
function mechanical(cand, slot) {
  const p = [];
  const a = slot.assignment;
  const parsed = parse(cand);
  if (parsed.plan !== a.plan) p.push(`plan ${parsed.plan}≠${a.plan}`);
  if (parsed.action !== a.action) p.push(`action ${parsed.action}≠${a.action}`);
  const words = cand.split(/\s+/).length;
  if (words < 28 || words > 46) p.push(`${words} words`);
  if (!/-sized/i.test(cand)) p.push('no size');
  for (const [n, re] of BANS) {
    const m = cand.match(re);
    if (m) p.push(`${n}:"${m[0]}"`);
  }
  return p;
}
function measure(pool, parsed) {
  const t = (f) => { const o = {}; parsed.forEach((p) => (o[p[f]] = (o[p[f]] || 0) + 1)); return o; };
  return { plan: t('plan'), action: t('action') };
}

module.exports = {
  name: 'dinobot/undergrowth_scale/undergrowth_resident',
  poolFile,
  basis: 'resident = the body plan + the action; same when both match; greedy, pool order (size, plumage and attitude are flavour)',
  parse,
  sameGroup,
  planSlots,
  assign,
  brief,
  formatRe,
  mechanical,
  measure,
  batchSize: 6,
  lenBand: [160, 320],
  PLANS,
  ACTIONS,
};
