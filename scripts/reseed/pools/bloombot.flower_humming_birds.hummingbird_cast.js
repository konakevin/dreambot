/* global __dirname */
/**
 * bloombot / flower-humming-birds / hummingbird_cast — the cast of iridescent hummingbirds per render.
 *
 * What the pool IS (kept): "CAST NAME / <FOCAL> FOCAL — a <species> hummingbird front-and-center with
 * <real plumage> <in a DYNAMIC action> at a <colour flower>, wings in motion-blur; a <species> … in crisp
 * sharp midground focus; a small <species> … in a clearly-defined background layer". Three real,
 * naturalistic species per entry, every bird in motion (the gen recipe bans perched-still poses), no
 * insects, no other birds. Original recipe: scripts/gen-bloombot-pool.js `…_hummingbird_cast`
 * (18 species, 6 dynamic poses, focal-species rotation).
 *
 * What was wrong (2026-09-23): 153 entries from 18 focal species × only TWO behaviours (hovering 101,
 * sipping 51) × ~12 flowers; 54 distinct (focal + behaviour + flower). The recipe's other dynamic poses
 * never made it into the pool.
 *
 * The varying element = the focal bird's SPECIES, its BEHAVIOUR and the FLOWER it is at (plus the two
 * supporting species, which are small in the picture and do not decide sameness). Same idea = same
 * focal species doing the same thing at the same flower. Rewrites pre-assign all of it from real
 * rosters (species with their true plumage, dynamic behaviours only, hummingbird flowers), least-used
 * first, so no two entries share focal + behaviour + flower.
 */
const path = require('path');
const { shuffle, byUsage } = require('../lib/core');

const poolFile = path.join(
  __dirname,
  '../../bots/bloombot/seeds/bloombot_flower_humming_birds_hummingbird_cast.json'
);

// ── Rosters (all real) ──────────────────────────────────────────────────────────────────────────
// key → { cap: CAPS name for the tag, plumage: the MALE's real colours }
const SPECIES = {
  'ruby-throated': {
    cap: 'RUBY-THROATED',
    plumage: 'blazing ruby-red gorget, emerald-green back, white breast',
  },
  anna: { cap: 'ANNA', plumage: 'rose-magenta crown and gorget, emerald back, grey belly' },
  costa: { cap: 'COSTA', plumage: 'violet-purple crown and long flaring gorget, green back' },
  rufous: {
    cap: 'RUFOUS',
    plumage: 'copper-orange body and tail, orange-red gorget, green wing-coverts',
  },
  allen: {
    cap: 'ALLEN',
    plumage: 'copper-orange flanks and tail, emerald back, orange-red gorget',
  },
  calliope: {
    cap: 'CALLIOPE',
    plumage: 'magenta-streaked gorget rays over white, green back, tiny',
  },
  'broad-tailed': { cap: 'BROAD-TAILED', plumage: 'rose-red gorget, emerald back, white breast' },
  'black-chinned': {
    cap: 'BLACK-CHINNED',
    plumage: 'black chin over a violet gorget band, green back',
  },
  rivoli: { cap: 'RIVOLI', plumage: 'violet crown, emerald-green gorget, dark green body' },
  'buff-bellied': {
    cap: 'BUFF-BELLIED',
    plumage: 'emerald throat and chest, buff belly, red bill',
  },
  berylline: { cap: 'BERYLLINE', plumage: 'emerald body, rufous wings and tail, red-based bill' },
  'violet-crowned': {
    cap: 'VIOLET-CROWNED',
    plumage: 'violet crown, pure white underside, red bill',
  },
  'long-tailed sylph': {
    cap: 'LONG-TAILED SYLPH',
    plumage: 'emerald body, long iridescent blue-green tail streamers',
  },
  'booted racket-tail': {
    cap: 'BOOTED RACKET-TAIL',
    plumage: 'emerald body, white leg puffs, two racket-tipped tail feathers',
  },
  'crowned woodnymph': {
    cap: 'CROWNED WOODNYMPH',
    plumage: 'violet crown and belly, emerald throat, forked tail',
  },
  'sparkling violetear': {
    cap: 'SPARKLING VIOLETEAR',
    plumage: 'emerald body, violet ear patches, violet chest spot',
  },
  bee: { cap: 'BEE', plumage: 'iridescent red-pink head and gorget, blue-green back, tiny' },
  'green violetear': {
    cap: 'GREEN VIOLETEAR',
    plumage: 'green body, violet ear patch, bronze tail',
  },
  'white-necked jacobin': {
    cap: 'WHITE-NECKED JACOBIN',
    plumage: 'deep blue head and chest, white belly and neck patch, green back',
  },
  'fiery-throated': {
    cap: 'FIERY-THROATED',
    plumage: 'fiery orange-red gorget over a blue chest, blue crown, green body',
  },
  'green-crowned brilliant': {
    cap: 'GREEN-CROWNED BRILLIANT',
    plumage: 'glittering emerald crown and body, violet throat spot',
  },
  'collared inca': {
    cap: 'COLLARED INCA',
    plumage: 'black-green body with a broad white chest collar, white tail patches',
  },
  'sword-billed': {
    cap: 'SWORD-BILLED',
    plumage: 'bronze-green body, a straight bill longer than its body',
  },
  'marvelous spatuletail': {
    cap: 'MARVELOUS SPATULETAIL',
    plumage: 'violet-blue crest, green gorget, two long wire tail feathers ending in blue discs',
  },
  'tufted coquette': {
    cap: 'TUFTED COQUETTE',
    plumage: 'rufous crest, green throat, white-spotted rufous neck tufts, tiny',
  },
  'black-throated mango': {
    cap: 'BLACK-THROATED MANGO',
    plumage: 'black throat and chest edged in purple, green sides, magenta tail',
  },
  'blue-throated mountain-gem': {
    cap: 'BLUE-THROATED MOUNTAIN-GEM',
    plumage: 'sapphire-blue gorget, green body, broad white tail tips',
  },
  'broad-billed': {
    cap: 'BROAD-BILLED',
    plumage: 'sapphire-blue gorget, emerald body, red bill with a black tip',
  },
  'white-eared': {
    cap: 'WHITE-EARED',
    plumage: 'bold white ear stripe, violet crown, emerald throat, red bill',
  },
  lucifer: {
    cap: 'LUCIFER',
    plumage: 'magenta flaring gorget, green back, curved bill, forked tail',
  },
  'amethyst-throated': {
    cap: 'AMETHYST-THROATED',
    plumage: 'amethyst gorget, green body, grey belly',
  },
  'red-billed streamertail': {
    cap: 'RED-BILLED STREAMERTAIL',
    plumage: 'emerald body, black crest, two long black tail streamers, red bill',
  },
  'cuban emerald': { cap: 'CUBAN EMERALD', plumage: 'glittering emerald body, deeply forked tail' },
  'ruby-topaz': { cap: 'RUBY-TOPAZ', plumage: 'ruby-red crown, topaz-gold gorget, dark body' },
  snowcap: { cap: 'SNOWCAP', plumage: 'snow-white cap on a deep purple-black body, tiny' },
  'purple-throated carib': {
    cap: 'PURPLE-THROATED CARIB',
    plumage: 'purple throat and chest, emerald-green wings, curved bill',
  },
  'andean hillstar': {
    cap: 'ANDEAN HILLSTAR',
    plumage: 'emerald gorget, white breast with a black band',
  },
  'gorgeted sunangel': { cap: 'GORGETED SUNANGEL', plumage: 'fiery orange-red gorget, green body' },
  'velvet-purple coronet': {
    cap: 'VELVET-PURPLE CORONET',
    plumage: 'velvet purple body, blue-green wings, white tail feathers',
  },
  xantus: {
    cap: 'XANTUS',
    plumage: 'black face with a white eye stripe, cinnamon belly, red bill',
  },
};
// Text patterns: the strong form (name + hummingbird) beats a bare name; bare names that double as
// plumage or flower words (rufous wings, bee balm) are guarded.
const BARE_GUARD = {
  rufous:
    '(?! (?:wing|wings|tail|edge|edges|flank|flanks|side|sides|belly|crown|patch|feather|feathers|body|wash|tint|wing-edges|neck|crest))',
  bee: '(?! balm)',
  magnificent: '(?= hummingbird)',
  lucifer: "(?:'s)?",
  allen: "(?:'s)?",
  anna: "(?:'s)?",
  costa: "(?:'s)?",
  rivoli: "(?:'s)?",
  xantus: "(?:'s|s)?",
};
const speciesRe = (k, strong) => {
  const esc = k.replace(/[-]/g, '[- ]');
  const tail = strong ? '\\s+hummingbird' : '(?:\\s+hummingbird)?';
  return new RegExp(`\\b${esc}${BARE_GUARD[k] || "(?:'s)?"}${tail}\\b`, 'i');
};
const SPECIES_KEYS = Object.keys(SPECIES).sort((a, b) => b.length - a.length);
const STRONG_RES = SPECIES_KEYS.map((k) => [k, speciesRe(k, true)]);
const BARE_RES = SPECIES_KEYS.map((k) => [k, speciesRe(k, false)]);
const ALIAS_SPECIES = { magnificent: 'rivoli', 'bee-hummingbird': 'bee' };

const FLOWERS = {
  'trumpet vine': 'scarlet',
  fuchsia: 'hot-pink',
  'scarlet salvia': 'scarlet',
  'sapphire salvia': 'sapphire-blue',
  'bee balm': 'magenta',
  'cardinal flower': 'vivid red',
  'butterfly bush': 'purple',
  'coral honeysuckle': 'coral-red',
  'yellow honeysuckle': 'jewel-yellow',
  crocosmia: 'flame-orange',
  penstemon: 'red',
  lupine: 'purple',
  foxglove: 'purple',
  columbine: 'red-and-yellow',
  lantana: 'orange-and-pink',
  agastache: 'purple',
  'morning glory': 'violet-blue',
  hibiscus: 'vivid red',
  'canna lily': 'orange',
  bottlebrush: 'crimson',
  'bird-of-paradise': 'orange-and-blue',
  lobelia: 'scarlet',
  'cigar plant': 'orange',
  'red-hot poker': 'orange',
  'coral bells': 'coral-red',
  weigela: 'pink',
  jewelweed: 'orange',
  'scarlet runner bean': 'scarlet',
  'mexican sunflower': 'orange',
  'cypress vine': 'scarlet',
  heliconia: 'red-and-orange',
  'shrimp plant': 'coral',
  grevillea: 'red',
  'flowering ginger': 'red',
  'flame vine': 'orange',
  petunia: 'magenta',
  zinnia: 'scarlet',
  phlox: 'hot-pink',
  bougainvillea: 'magenta',
};
const FLOWER_ALIAS = {
  salvia: 'scarlet salvia',
  sage: 'scarlet salvia',
  honeysuckle: 'coral honeysuckle',
  vine: 'trumpet vine',
  balm: 'bee balm',
  monarda: 'bee balm',
  canna: 'canna lily',
  kniphofia: 'red-hot poker',
  'red hot poker': 'red-hot poker',
  aquilegia: 'columbine',
  buddleia: 'butterfly bush',
};
const flowerNames = [...Object.keys(FLOWERS), ...Object.keys(FLOWER_ALIAS)].sort(
  (a, b) => b.length - a.length
);
const FLOWER_RE = new RegExp(
  `\\b(${flowerNames
    .map((n) => n.replace(/[-]/g, '[- ]').replace(/y$/, '(?:y|ies)') + '(?:es|s)?')
    .join('|')})\\b`,
  'i'
);
const canonFlower = (raw) => {
  const base = raw.toLowerCase().replace(/-/g, ' ');
  const singulars = [
    base,
    base.replace(/s$/, ''),
    base.replace(/es$/, ''),
    base.replace(/ies$/, 'y'),
  ];
  for (const s of singulars) {
    for (const t of [s, s.replace(/ /g, '-')]) {
      if (FLOWER_ALIAS[t]) return FLOWER_ALIAS[t];
      if (FLOWERS[t]) return t;
    }
  }
  return base.replace(/s$/, '');
};

// Dynamic behaviours only (the pool's intent). weight = share of rewrites; phrase = what Sonnet must
// write verbatim (it may add words around it); re = how it is recognised in any entry.
const ACTIONS = [
  {
    key: 'hovering',
    weight: 20,
    phrase: 'hovering at the bloom, wings a rapid blur',
    re: /hover/i,
  },
  {
    key: 'sipping',
    weight: 18,
    phrase: 'sipping nectar with its long bill deep in the tubular bloom',
    re: /sipping|drinking nectar|bill deep|beak inserted|bill inserted|feeding|probing/i,
  },
  {
    key: 'beak-to-flower',
    weight: 10,
    phrase: 'an instant before drinking, bill poised at the bloom',
    re: /instant before|about to drink|bill poised|beak poised|beak almost|bill almost/i,
  },
  {
    key: 'banking',
    weight: 10,
    phrase: 'banking sideways between blooms, tail fanned',
    re: /banking|mid-flight between|between blooms/i,
  },
  {
    key: 'tail-fan',
    weight: 8,
    phrase: 'hovering with tail feathers spread wide for balance',
    re: /tail feathers spread wide|spread wide for balance|tail-feathers spread wide/i,
  },
  {
    key: 'backing',
    weight: 6,
    phrase: 'backing away from the bloom in reverse flight',
    re: /backing away|reverse flight|backs away/i,
  },
  {
    key: 'dueling',
    weight: 8,
    phrase: 'diving at a rival male in a mid-air chase over the bloom',
    re: /rival|chase|chasing|dueling|duel|sparring|driving off/i,
  },
  {
    key: 'diving',
    weight: 5,
    phrase: 'plunging in a courtship dive with gorget flared',
    re: /courtship dive|plunging|plunges/i,
  },
  {
    key: 'rain-hover',
    weight: 6,
    phrase: 'hovering in fine rain, droplets flying from its wings',
    re: /fine rain|in the rain|drizzle|droplets flying|mist/i,
  },
  {
    key: 'leaf-drip',
    weight: 4,
    phrase: 'drinking from a dripping leaf tip beside the bloom',
    re: /dripping leaf|leaf tip|dewdrop|dew drop/i,
  },
  {
    key: 'wheeling',
    weight: 5,
    phrase: 'wheeling in a tight turn, gorget flashing as it swings round',
    re: /wheeling|tight turn|swings round|swinging round/i,
  },
  {
    key: 'face-on',
    weight: 5,
    phrase: 'hovering face-on toward the viewer, gorget blazing',
    re: /face-on|facing the viewer|toward the viewer|towards the viewer|head-on/i,
  },
];
// Recognition order: the specific behaviours first, the two generic ones last.
const ACTION_ORDER = [
  'dueling',
  'diving',
  'rain-hover',
  'leaf-drip',
  'backing',
  'wheeling',
  'face-on',
  'beak-to-flower',
  'tail-fan',
  'banking',
  'sipping',
  'hovering',
];
const SUPPORT_POSES = [
  'hovering at another bloom',
  'sipping at a deeper bloom',
  'mid-flight between blooms',
  'banking sideways',
  'rising past a spire of blooms',
  'darting in from the edge',
];

// ── Parsing ─────────────────────────────────────────────────────────────────────────────────────
/** One clause per bird. Entries with ";" separate birds with it; the older comma style is the fallback. */
function clausesOf(body) {
  if (body.includes(';')) return body.split(/;\s*/).filter(Boolean);
  return body
    .split(/,\s*(?=(?:a|an|two|three|plus|another|while)\s)|,\s*and\s+(?=(?:a|an|two)\s)/i)
    .filter(Boolean);
}
function speciesIn(clause) {
  const l = clause.toLowerCase();
  let best = null;
  for (const [k, re] of STRONG_RES) {
    const m = l.match(re);
    if (m && (best === null || m.index < best.index)) best = { k, index: m.index };
  }
  if (best) return best.k;
  for (const [k, re] of BARE_RES) {
    const m = l.match(re);
    if (m && (best === null || m.index < best.index)) best = { k, index: m.index };
  }
  if (best) return best.k;
  for (const [a, k] of Object.entries(ALIAS_SPECIES)) if (l.includes(a)) return k;
  return null;
}
function actionOf(clause) {
  for (const key of ACTION_ORDER)
    if (ACTIONS.find((a) => a.key === key).re.test(clause)) return key;
  return 'other';
}
function flowerOf(clause) {
  const f = clause.match(FLOWER_RE);
  return f ? canonFlower(f[1]) : null;
}
function parse(entry) {
  const body = entry.split(' — ').slice(1).join(' — ');
  const cls = clausesOf(body);
  const focal = cls.length ? speciesIn(cls[0]) : null;
  const action = cls.length ? actionOf(cls[0]) : 'other';
  const flower = cls.length ? flowerOf(cls[0]) : null;
  const sup = cls
    .slice(1)
    .map(speciesIn)
    .filter((s) => s && s !== focal);
  const supSet = [...new Set(sup)].sort();
  return {
    keys: [`focal:${focal}`, `act:${action}`, `flw:${flower}`, ...supSet.map((s) => `sup:${s}`)],
    focal,
    action,
    flower,
    sup: supSet,
    birds: cls.length,
  };
}
// Same scene = the same focal bird doing the same thing at the same flower.
function sameGroup(a, b) {
  if (!a.focal || a.focal !== b.focal) return false;
  return a.action === b.action && a.flower === b.flower;
}

// ── Plan / assign ───────────────────────────────────────────────────────────────────────────────
function planSlots({ slots }) {
  slots.forEach((s) => (s.tags = ['cast']));
}
const weightedLeastUsed = (usage) =>
  shuffle(ACTIONS).sort(
    (x, y) => (usage['act:' + x.key] || 0) / x.weight - (usage['act:' + y.key] || 0) / y.weight
  );
function assign(slot, ctx) {
  const { usage, groups } = ctx;
  const flowers = Object.keys(FLOWERS);
  for (let attempt = 0; attempt < 120; attempt++) {
    const focal = byUsage(SPECIES_KEYS, usage, (n) => 'focal:' + n)[attempt % 5];
    const action = weightedLeastUsed(usage)[attempt % 3].key;
    const flower = byUsage(flowers, usage, (n) => 'flw:' + n)[attempt % 4];
    const sup = byUsage(
      SPECIES_KEYS.filter((n) => n !== focal),
      usage,
      (n) => 'sup:' + n
    )
      .slice(0, 2)
      .sort();
    const cand = { focal, action, flower, sup };
    const clash = groups.some((g) => sameGroup(g.assignment ? g.assignment : g, cand));
    if (clash) continue;
    const keys = [
      `focal:${focal}`,
      `act:${action}`,
      `flw:${flower}`,
      ...sup.map((s) => `sup:${s}`),
    ];
    return { keys, focal, action, flower, sup, tags: [focal, action, flower] };
  }
  return null;
}

// ── Brief ───────────────────────────────────────────────────────────────────────────────────────
function brief(batch, examples) {
  return `You write entries for one pool of a flower-art bot: the CAST of hummingbirds in a vibrant hummingbird garden. Every entry names three real hummingbird species, one focal bird front-and-center and two supporting birds, every bird in motion. Keep EXACTLY this format, one line each:

CAST NAME / <FOCAL SPECIES IN CAPS> FOCAL — a <focal species> hummingbird front-and-center with <its plumage>, <its action phrase> at a <colour> <flower>, wings in rapid motion-blur; a <second species> hummingbird <supporting pose> in crisp sharp midground focus with <its plumage>; a small <third species> hummingbird <supporting pose> in a clearly-defined background layer in clear air.

Examples already in the pool (match their shape and voice):
${examples.map((e) => '- ' + e).join('\n')}

Rules:
- Each slot names its focal species, its plumage, its action phrase, its flower and its two supporting species with their plumage. Use EXACTLY those species and that plumage (real birds, real colours; add nothing that is not listed). Write each species name as given, followed by the word "hummingbird".
- Write the focal bird's ACTION PHRASE word for word as given (you may add a few words around it). The supporting birds are in motion too (hovering, sipping, mid-flight, banking, darting). Every bird is airborne.
- Name the flower exactly as given, in the colour given, right after the action phrase ("… at a magenta bee balm"). Vivid saturated colour words throughout.
- Separate the three birds with semicolons, as in the format line.
- Naturalistic birds: iridescent plumage, crisp feather detail, wings blurred. Hummingbirds only. Mention no insects, no other birds, no people, no feeders. Describe only what is present; write no negative words.
- 50-70 words per entry.

Slots:
${batch
  .map((s, i) => {
    const a = s.assignment;
    return `${i + 1}. focal: ${a.focal} hummingbird (${SPECIES[a.focal].plumage}); action phrase: "${ACTIONS.find((x) => x.key === a.action).phrase}"; flower: ${FLOWERS[a.flower]} ${a.flower}; supporting: ${a.sup.map((n) => `${n} hummingbird (${SPECIES[n].plumage})`).join(' and ')}; suggested supporting poses: ${shuffle(SUPPORT_POSES).slice(0, 2).join(' / ')}`;
  })
  .join('\n')}

Reply with a JSON array of ${batch.length} strings only.`;
}

// ── Checks ──────────────────────────────────────────────────────────────────────────────────────
// The pool has three title styles: "CAST NAME / X FOCAL — …" (83), "NAME FOCAL — …" (46) and
// "NAME FOCAL / X — …" (24). The word FOCAL is in every title; the slash part is optional.
const formatRe =
  /^(?=[^—]*FOCAL)[A-Z0-9][A-Z0-9 '&-]+(?: \/ [A-Z][A-Z' -]+)? — an? .+ front-and-center .+$/;
const BANS = [
  [
    'perched-still',
    /\b(perched|perching|perch|resting|rests|at rest|sits|sitting|motionless|still on)\b/i,
  ],
  [
    'insect',
    /\b(bee(?! hummingbird)(?! balm)|bees|butterfl|moth|dragonfl|ladybug|firefl|insect|wasp)\b/i,
  ],
  [
    'other-bird',
    /\b(songbird|parrot|dove|finch|jay|robin|sparrow|warbler|oriole|kingfisher|sunbird)\b/i,
  ],
  ['person', /\b(hand|hands|person|people|girl|woman|man|child|figure|gardener)\b/i],
  ['feeder', /\b(feeder|feeders|bottle|glass)\b/i],
  ['text_prior', /\b(sign|signboard|label|banner|plaque|nameplate|lettering)\b/i],
  ['negation', /\b(no|not|never|without|nothing)\b/i],
];
function mechanical(cand, slot) {
  const p = [];
  const a = slot.assignment;
  const parsed = parse(cand);
  if (parsed.focal !== a.focal) p.push(`focal ${parsed.focal}≠${a.focal}`);
  if (parsed.action !== a.action) p.push(`action ${parsed.action}≠${a.action}`);
  if (parsed.flower !== a.flower) p.push(`flower ${parsed.flower}≠${a.flower}`);
  if (parsed.sup.join('+') !== a.sup.join('+'))
    p.push(`supporting ${parsed.sup.join('+')}≠${a.sup.join('+')}`);
  if (parsed.birds < 3) p.push(`only ${parsed.birds} bird clauses`);
  const hb = (cand.match(/hummingbird/gi) || []).length;
  if (hb < 2) p.push('the word hummingbird appears fewer than twice');
  for (const [name, re] of BANS) {
    const m = cand.match(re);
    if (m) p.push(`${name}:"${m[0]}"`);
  }
  return p;
}
function measure(pool, parsed) {
  const t = (f) => {
    const o = {};
    parsed.forEach((p) => (o[p[f]] = (o[p[f]] || 0) + 1));
    return Object.keys(o).length;
  };
  return { focalSpecies: t('focal'), actions: t('action'), flowers: t('flower') };
}

module.exports = {
  name: 'bloombot/flower_humming_birds/hummingbird_cast',
  poolFile,
  basis:
    'cast = the focal bird (species) + its behaviour + the flower it is at; same when all three match; greedy, pool order',
  parse,
  sameGroup,
  planSlots,
  assign,
  brief,
  formatRe,
  mechanical,
  measure,
  batchSize: 6,
  lenBand: [320, 640],
  SPECIES,
  ACTIONS,
  FLOWERS,
};
