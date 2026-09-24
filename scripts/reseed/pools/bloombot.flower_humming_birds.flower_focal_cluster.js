/* global __dirname */
/**
 * bloombot / flower-humming-birds / flower_focal_cluster — the hummingbird garden's flower line-ups.
 *
 * What the pool IS (kept): TITLE / COLOUR TAG — 3-6 hummingbird-attracting flower species in vibrant
 * saturated jewel-tone colour, in one of two shapes the pool already has: UPRIGHT ("… blooming together
 * as co-hero in pulled-back vibrant hummingbird-garden vignette, <crisp layered background>") and
 * CASCADE (vines / hanging blooms / arch / canopy "cascading down … hummingbirds darting through …").
 * Vivid only; no pastel (that is flower-friends). Original gen recipe: scripts/gen-bloombot-pool.js
 * `bloombot_flower_humming_birds_flower_focal_cluster` (26-species palette, 7 colour families).
 *
 * What was wrong (2026-09-23): 120 entries, 70 distinct line-ups (same = 4+ shared species), salvia in
 * 46, trumpet vine in 45, bee balm in 36; red-dominant 40 of 120.
 *
 * The varying element = the set of flower species. Same idea = 4+ shared species (3 shared when an
 * entry has only 3). Each rewrite keeps its original's shape (upright / cascade) and its vignette words,
 * gets species pre-assigned from a roster of real hummingbird flowers in their real hues, ≤2 shared with
 * any other entry, per-species cap, families evened over the recipe's 7.
 */
const path = require('path');
const { claude, jsonOf, shuffle, byUsage, sharedKeys, SONNET } = require('../lib/core');

const poolFile = path.join(
  __dirname,
  '../../bots/bloombot/seeds/bloombot_flower_humming_birds_flower_focal_cluster.json'
);

// ── Roster: hummingbird-attracting flowers and the hues each REALLY comes in ─────────────────────
// r red · o orange · p pink/fuchsia/magenta · v violet/purple · b blue · y yellow · w white
const ROSTER = {
  'trumpet vine': 'or',
  fuchsia: 'prv',
  salvia: 'rbvp',
  hibiscus: 'rop',
  'bee balm': 'prv',
  columbine: 'ryvp',
  'butterfly bush': 'vp',
  'cardinal flower': 'r',
  lupine: 'vbp',
  foxglove: 'vp',
  petunia: 'pvr',
  lantana: 'oyrp',
  agastache: 'vpo',
  penstemon: 'rpv',
  honeysuckle: 'roy',
  'morning glory': 'vbp',
  lobelia: 'rb',
  crocosmia: 'ro',
  'canna lily': 'roy',
  'coral bells': 'rp',
  bottlebrush: 'r',
  'bird-of-paradise': 'o',
  zinnia: 'rop',
  phlox: 'pvr',
  bougainvillea: 'pvo',
  passionflower: 'vw',
  heliconia: 'ro',
  orchid: 'pvo',
  wisteria: 'v',
  'red-hot poker': 'or',
  cuphea: 'or',
  'firecracker plant': 'r',
  jewelweed: 'o',
  nasturtium: 'ory',
  weigela: 'pr',
  abutilon: 'roy',
  'flowering ginger': 'r',
  grevillea: 'ro',
  aloe: 'or',
  justicia: 'rp',
  'scarlet runner bean': 'r',
  'mexican sunflower': 'o',
  cleome: 'pv',
  "four o'clock": 'pyr',
  gladiolus: 'rop',
  'red yucca': 'r',
  ocotillo: 'r',
  delphinium: 'bv',
  hollyhock: 'rp',
  catmint: 'v',
  'cypress vine': 'r',
  'flowering quince': 'ro',
  'flowering currant': 'p',
  'torch lily': 'o',
  jacobinia: 'p',
  chuparosa: 'r',
  'desert willow': 'p',
  'scarlet gilia': 'r',
  'bleeding heart': 'p',
  'cigar plant': 'o',
  'texas sage': 'v',
  'autumn sage': 'r',
  'tropical milkweed': 'o',
  'pineapple sage': 'r',
  'blue anise sage': 'b',
  larkspur: 'bv',
  'coral plant': 'r',
  'flame vine': 'o',
  'royal poinciana': 'r',
  'african tulip tree': 'o',
};
const ALIAS = {
  sage: 'salvia',
  monarda: 'bee balm',
  balm: 'bee balm',
  'trumpet creeper': 'trumpet vine',
  kniphofia: 'red-hot poker',
  'red hot poker': 'red-hot poker',
  aquilegia: 'columbine',
  buddleia: 'butterfly bush',
  buddleja: 'butterfly bush',
  'tropical lily': 'canna lily',
  canna: 'canna lily',
  cannas: 'canna lily',
  heuchera: 'coral bells',
  strelitzia: 'bird-of-paradise',
  'bird of paradise': 'bird-of-paradise',
  'birds-of-paradise': 'bird-of-paradise',
  'trumpet flower': 'trumpet vine',
  tithonia: 'mexican sunflower',
  'coral honeysuckle': 'honeysuckle',
  'trumpet honeysuckle': 'honeysuckle',
  ipomoea: 'morning glory',
  'morning glories': 'morning glory',
  ginger: 'flowering ginger',
  'ginger lily': 'flowering ginger',
  'torch ginger': 'flowering ginger',
  'cigar flower': 'cigar plant',
  'firecracker bush': 'firecracker plant',
  'hummingbird bush': 'chuparosa',
  'hummingbird sage': 'salvia',
  'scarlet sage': 'salvia',
  'mexican bush sage': 'salvia',
  hyssop: 'agastache',
  'anise hyssop': 'agastache',
  'hummingbird mint': 'agastache',
};
const HUE = {
  r: 'red',
  o: 'orange',
  p: 'fuchsia-pink',
  v: 'purple',
  b: 'blue',
  y: 'yellow',
  w: 'white',
};
const FAMILIES = ['red', 'pink', 'orange', 'violet', 'blue', 'yellow', 'multi'];
const HUE_OF_FAMILY = { red: 'r', pink: 'p', orange: 'o', violet: 'v', blue: 'b', yellow: 'y' };
const COMPANIONS = {
  red: 'opy',
  pink: 'vrw',
  orange: 'ryp',
  violet: 'pbr',
  blue: 'vpw',
  yellow: 'orp',
};
const HUE_WORDS = {
  r: 'vivid scarlet / crimson / ruby-red',
  o: 'flame-orange / bright tangerine / vivid coral-orange',
  p: 'hot-pink / magenta / vivid rose-pink',
  v: 'deep purple / royal violet / amethyst',
  b: 'sapphire-blue / electric indigo / cobalt',
  y: 'jewel-yellow / vivid gold / bright lemon',
  w: 'pure white / bright cream',
};
const SPECIES_CAP = 12; // uses of one species across the final pool (species already over it get none)

// ── Parsing: every roster/alias name found in the body, in order, one key per plant ─────────────
const names = [...Object.keys(ROSTER), ...Object.keys(ALIAS)].sort((a, b) => b.length - a.length);
const forms = (n) => {
  const esc = n.replace(/[.*+?^${}()|[\]\\]/g, '\\$&').replace(/ /g, '[ -]');
  const plural = /y$/.test(n) ? `${esc.slice(0, -1)}(?:y|ies)` : `${esc}(?:es|s)?`;
  return plural;
};
const NAME_RE = new RegExp(`\\b(${names.map(forms).join('|')})\\b`, 'gi');
const canon = (raw) => {
  const base = raw.toLowerCase().replace(/-/g, ' ');
  const singulars = [
    base,
    base.replace(/s$/, ''),
    base.replace(/es$/, ''),
    base.replace(/ies$/, 'y'),
  ];
  for (const s of singulars) {
    for (const t of [s, s.replace(/ /g, '-')]) {
      if (ALIAS[t]) return ALIAS[t];
      if (ROSTER[t]) return t;
    }
  }
  return base.replace(/s$/, '');
};
function bodyOf(entry) {
  return entry.split(' — ').slice(1).join(' — ');
}
/** The part of the body that names the hero flowers (the background clause repeats colour words). */
function subjectBody(entry) {
  return bodyOf(entry).split(
    / (?:clearly-defined layers|crisp (?:sharp|tropical)|dreamy bokeh|receding|layers of more|of more )/
  )[0];
}
function speciesOf(entry) {
  const body = subjectBody(entry);
  const seen = [];
  for (const m of body.matchAll(NAME_RE)) {
    const k = canon(m[1]);
    if (!seen.includes(k)) seen.push(k);
  }
  return seen;
}
const isUpright = (entry) => / blooming together as co-hero in pulled-back vibrant /.test(entry);
const FAMILY_RULES = [
  ['multi', /RAINBOW|MULTI|JEWEL-TONE MIX|MIXED|SPECTRUM|JEWEL ABUNDANCE|JEWEL-RAINBOW/],
  ['red', /\bRED\b|RED-|CRIMSON|SCARLET|RUBY|CARDINAL/],
  ['pink', /PINK|FUCHSIA|MAGENTA|ROSE|BOUGAINVILLEA/],
  ['orange', /ORANGE|FLAME|TANGERINE|CORAL|COPPER|SUNBURST/],
  ['violet', /PURPLE|VIOLET|AMETHYST|LAVENDER|WISTERIA|LILAC/],
  ['blue', /BLUE|SAPPHIRE|INDIGO|COBALT/],
  ['yellow', /YELLOW|GOLD|LEMON|CANNA/],
];
function familyOf(entry) {
  const title = entry.split(' — ')[0].toUpperCase();
  const tag = title.split('/')[1] || title;
  for (const [f, re] of FAMILY_RULES) if (re.test(tag)) return f;
  for (const [f, re] of FAMILY_RULES) if (re.test(title)) return f;
  return 'other';
}
function parse(entry) {
  const keys = speciesOf(entry);
  return { keys, family: familyOf(entry), variant: isUpright(entry) ? 'upright' : 'cascade' };
}
function sameGroup(a, b) {
  const m = Math.min(a.keys.length, b.keys.length);
  return m > 0 && sharedKeys(a, b).length >= Math.min(4, m);
}

// ── Plan: 7 families evened, each slot keeps its original's shape + vignette words ──────────────
function planSlots({ pool, parsed, kept, slots }) {
  const target = Math.floor(pool.length / FAMILIES.length);
  const extra = pool.length - target * FAMILIES.length;
  const have = Object.fromEntries(FAMILIES.map((f) => [f, 0]));
  kept.forEach((k) => {
    const f = parsed[k].family;
    if (f in have) have[f]++;
  });
  const need = [];
  FAMILIES.forEach((f, fi) => {
    const want = target + (fi < extra ? 1 : 0);
    for (let n = have[f]; n < want; n++) need.push(f);
  });
  while (need.length < slots.length) need.push(FAMILIES[need.length % FAMILIES.length]);
  const counts = {};
  for (const f of need) counts[f] = (counts[f] || 0) + 1;
  const queue = [];
  while (queue.length < slots.length) {
    const before = queue.length;
    for (const f of FAMILIES) {
      if ((counts[f] || 0) > 0 && queue.length < slots.length) {
        queue.push(f);
        counts[f]--;
      }
    }
    if (queue.length === before) break;
  }
  slots.forEach((s, i) => {
    s.family = queue[i];
    s.variant = parsed[s.index].variant;
    const m = s.old.match(/in pulled-back vibrant ([a-z -]+) vignette/);
    s.vignette = m ? m[1] : 'hummingbird-garden';
    s.tags = [s.family, s.variant];
  });
}

// ── Assign: species chosen before Sonnet writes ─────────────────────────────────────────────────
function assign(slot, ctx) {
  const { usage, groups } = ctx;
  const n =
    slot.variant === 'cascade'
      ? 3 + (Math.random() < 0.5 ? 1 : 0)
      : 5 + (Math.random() < 0.3 ? 1 : 0);
  const okWith = (keys) => groups.every((g) => g.keys.filter((k) => keys.includes(k)).length <= 2);
  const underCap = (name) => (usage[name] || 0) < SPECIES_CAP;
  const withHue = (h) => Object.keys(ROSTER).filter((m) => ROSTER[m].includes(h));
  for (let attempt = 0; attempt < 80; attempt++) {
    const picks = [];
    const keys = [];
    const tryAdd = (name, hue) => {
      if (keys.includes(name) || !underCap(name) || !okWith([...keys, name])) return false;
      picks.push({ name, hue });
      keys.push(name);
      return true;
    };
    if (slot.family === 'multi') {
      for (const h of shuffle(['r', 'o', 'p', 'v', 'b', 'y']).slice(0, n)) {
        for (const name of byUsage(withHue(h), usage)) if (tryAdd(name, h)) break;
      }
    } else {
      const h = HUE_OF_FAMILY[slot.family];
      const lead = n >= 5 ? 3 : 2;
      for (const name of byUsage(withHue(h), usage)) {
        if (picks.length >= lead) break;
        tryAdd(name, h);
      }
      const comps = shuffle(COMPANIONS[slot.family].split(''));
      let ci = 0;
      while (picks.length < n && ci < 40) {
        const ch = comps[ci++ % comps.length];
        for (const name of byUsage(withHue(ch), usage)) if (tryAdd(name, ch)) break;
      }
    }
    if (picks.length === n) return { picks, keys, tags: [slot.family, slot.variant] };
  }
  return null;
}

// ── Brief ───────────────────────────────────────────────────────────────────────────────────────
function examples(kept, pool) {
  const up = kept
    .map((k) => pool[k])
    .filter(isUpright)
    .slice(0, 3);
  const casc = kept
    .map((k) => pool[k])
    .filter((e) => !isUpright(e))
    .slice(0, 3);
  return [...up, ...casc];
}
function brief(batch, ex) {
  return `You write entries for one pool of a flower-art bot: the flower line-ups of a vibrant hummingbird garden. Every entry is 3-6 hummingbird-attracting flower species in vivid saturated jewel-tone colour, in one of two shapes. Keep EXACTLY the shape asked for, one line each:

UPRIGHT: TITLE WORDS / COLOUR TAG — <colour words> <flower> + <colour words> <flower> + ... blooming together as co-hero in pulled-back vibrant <vignette> vignette, <one clause: more blooms / foliage / warm light stepping back behind in crisp sharp layers>
CASCADE: TITLE WORDS / COLOUR TAG — <colour words> <flower> + <colour words> <flower> + <colour words> <flower> cascading / hanging / climbing / arching (as the original's kind) as the primary visual, hummingbirds darting through or hovering at the hanging blooms, <one clause: clearly-defined layers stepping back in sharp focus behind>

Examples already in the pool (match their shape, length and voice):
${ex.map((e) => '- ' + e).join('\n')}

Rules:
- Each slot names its flowers and the hue for each. Use EXACTLY those flowers, all of them and nothing else, in any order, each introduced by vivid colour words for that hue. Keep the flower names exactly as given, spaces included, optionally followed by ONE shape word (spires, trumpets, bells, clusters, sprays, bracts, strands).
- Colour is vivid, saturated, jewel-tone; never pastel, never soft or pale words. Keep each colour true to that flower. Here "fuchsia" is a flower name, not a colour word: for pinks write hot-pink or magenta.
- The COLOUR TAG after the slash is the slot's dominant colour in caps (e.g. DEEP RED, FUCHSIA-MAGENTA, FLAME-ORANGE, ROYAL PURPLE, SAPPHIRE BLUE, JEWEL YELLOW, JEWEL RAINBOW); the title words name the scene the way the examples do.
- For a CASCADE slot keep the KIND of composition its original had (hanging curtain from above, vine arch, vine wall, tropical canopy) with the new flowers.
- Flowers grow outdoors. Mention no insects, no people, no vases, no buildings, no signs. Describe only what is present; write no negative words.

Slots:
${batch
  .map(
    (s, i) =>
      `${i + 1}. ${s.variant.toUpperCase()}, family ${s.family.toUpperCase()}, vignette "${s.vignette}", colour words like: ${[...new Set(s.assignment.picks.map((p) => p.hue))].map((h) => HUE[h] + ' = ' + HUE_WORDS[h]).join('; ')}; flowers: ${s.assignment.picks.map((p) => `${p.name} (${HUE[p.hue]})`).join(', ')}${s.variant === 'cascade' ? `; the original whose composition kind to keep: "${s.old.split(' — ')[0]}"` : ''}`
  )
  .join('\n')}

Reply with a JSON array of ${batch.length} strings only.`;
}

// ── Checks ──────────────────────────────────────────────────────────────────────────────────────
// UPRIGHT joins its flowers with " + " and carries the vignette clause; CASCADE entries may weave the
// flowers into prose ("… vines cascading down an arch, orange crocosmia and red cardinal flowers …").
const formatRe =
  /^[A-Z0-9][A-Z0-9 '&-]+ \/ [A-Z][A-Z -]+ — (?:.+ \+ .+ blooming together as co-hero in pulled-back vibrant [a-z -]+ vignette, .+|.+\b(?:cascading|cascade|hanging|climbing|spilling|draping|tumbling|dangling|trailing|arching)\b.+)$/;
const BANS = [
  ['insect', /\b(bee|bees|butterfl|moth|dragonfl|ladybug|firefl|insect|pollinator)\b/i],
  ['person', /\b(hand|hands|person|people|girl|woman|man|child|figure|fairy|fairies|gardener)\b/i],
  [
    'setting',
    /\b(vase|bouquet in|interior|room|window|ruin|ruins|city|street|fence|path|trail|bench|feeder)\b/i,
  ],
  [
    'text_prior',
    /\b(weathervane|sundial|sign|signboard|label|banner|plaque|nameplate|marker|lettering)\b/i,
  ],
  [
    'blur',
    /\b(extreme shallow depth|heavy blur|heavily blurred|blurred into|dissolving into bokeh|out of focus|extreme macro)\b/i,
  ],
  ['pastel', /\b(pastel|pale|soft|dusty|powder|muted|washed)\b/i],
  ['negation', /\b(no|not|never|without|nothing)\b/i],
];
const NEGATION_SAFE = /bee balm/gi;
function mechanical(cand, slot, ctx) {
  const p = [];
  const parsed = parse(cand);
  if (parsed.variant !== slot.variant) p.push(`shape ${parsed.variant}≠${slot.variant}`);
  if (parsed.family !== slot.family) p.push(`family ${parsed.family}≠${slot.family}`);
  const scan = cand.replace(NEGATION_SAFE, 'monarda');
  for (const [name, re] of BANS) {
    const m = scan.match(re);
    if (m) p.push(`${name}:"${m[0]}"`);
  }
  for (const k of parsed.keys)
    if ((ctx.usage[k] || 0) + 1 > SPECIES_CAP && !slot.keys.includes(k)) p.push(`cap: ${k}`);
  for (const g of ctx.groups) {
    if (g === slot.groupEntry) continue;
    const shared = g.keys.filter((k) => parsed.keys.includes(k));
    if (shared.length > 2) {
      p.push(`shares ${shared.length} (${shared.join(', ')})`);
      break;
    }
  }
  return p;
}
async function reality(cand) {
  const body = subjectBody(cand);
  const items = [];
  for (const m of body.matchAll(NAME_RE)) {
    const start = Math.max(0, m.index - 40);
    const pre = body
      .slice(start, m.index)
      .split(/[+,]/)
      .pop()
      .trim()
      .split(' ')
      .slice(-3)
      .join(' ');
    items.push(`${pre} ${m[1]}`.trim());
  }
  if (!items.length) return [];
  const out = await claude(
    SONNET,
    `You are an experienced horticulturist. For each flower description below, decide whether that flower comes in that HUE FAMILY at all, counting the wild form AND named garden cultivars. Hue families: red/crimson/scarlet, orange/coral/flame, pink/fuchsia/magenta, purple/violet, blue/indigo/sapphire, yellow/gold, white/cream. IGNORE intensity words (vivid, deep, bright, hot, electric, jewel) entirely. Answer false ONLY when the flower does not come in that hue family at all. When in doubt, answer true.\n\n${items.map((s, i) => `${i + 1}. ${s}`).join('\n')}\n\nReply with JSON only: {"answers":[{"n":1,"real":true,"why":"under 12 words"}, ...]} covering every number.`,
    1500
  );
  const a = jsonOf(out).answers || [];
  return a.filter((x) => x.real === false).map((x) => `${items[x.n - 1]} (${x.why})`);
}
function measure(pool, parsed) {
  const fam = {};
  parsed.forEach((p) => (fam[p.family] = (fam[p.family] || 0) + 1));
  const top = {};
  parsed.forEach((p) => p.keys.forEach((k) => (top[k] = (top[k] || 0) + 1)));
  const topSpecies = Object.entries(top)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)
    .map(([k, v]) => `${k}:${v}`);
  return {
    families: fam,
    upright: parsed.filter((p) => p.variant === 'upright').length,
    topSpecies,
  };
}

module.exports = {
  name: 'bloombot/flower_humming_birds/flower_focal_cluster',
  poolFile,
  basis:
    'line-up = the set of hummingbird-flower species named; same when they share 4+ species (3 when an entry has only 3); greedy, pool order',
  parse,
  sameGroup,
  planSlots,
  assign,
  brief,
  examples,
  formatRe,
  mechanical,
  reality,
  measure,
  // new line-ups with six long-named species run a little longer than the originals
  lenBand: [250, 520],
  speciesOf,
  familyOf,
};
