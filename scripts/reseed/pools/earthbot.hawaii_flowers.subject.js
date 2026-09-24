/* global __dirname */
/**
 * earthbot / hawaii-flowers / subject — the ground-level tropical BEACH behind the path's flowers.
 *
 * What the pool IS (kept): object entries { tags, description }. By design (path header + gen recipe
 * scripts/gen-seeds/earthbot/gen-hawaii-flowers-subject.js, R3 architecture) it is BEACH-ONLY: a
 * ground-level POV opener, a wide flat sandy beach across the full midground, palms at the inland
 * fringe, calm open tropical water to the horizon, a distant context. Flowers come from a separate
 * axis and are never named here. The recipe bans cliffs / waterfalls / jungle interiors / coves /
 * rocky foregrounds; the sea stays an open horizon. 22-40 words.
 *
 * What was wrong (2026-09-23): 200 entries, 17 distinct beaches (same = sand type + beach form + water
 * state); 38 were "coral sand + beach + mirror-glass", 108 said "crescent", every one had coconut
 * palms and calm water.
 *
 * The varying element = the beach itself: SAND (real tropical sand types), FORM (the shape of the
 * shore), WATER (what the calm sea is doing), with palms, distant context and place as flavour.
 * Same idea = same sand + form + water. Rewrites keep each original's POV opener and pre-assign the
 * rest from real rosters, least-used first, so no two entries share the triple.
 */
const path = require('path');
const { shuffle, byUsage } = require('../lib/core');

const poolFile = path.join(__dirname, '../../bots/earthbot/seeds/hawaii_flowers_subject.json');

// ── Rosters (all real tropical beach features) ──────────────────────────────────────────────────
// weight = rough share the recipe intended (white / black Hawaiian sand lead); places = where it is real
const SAND = {
  white: {
    weight: 6,
    words: 'wide flat white-sand',
    places: ['Hawaiian', 'Oahu', 'Kauai', 'Caribbean', 'Costa Rican', 'Fijian', 'Seychelles'],
  },
  black: {
    weight: 5,
    words: 'black volcanic-sand',
    places: ['Hawaiian', 'Big Island', 'Maui', 'Tahitian', 'Bali'],
    volcanic: true,
  },
  coral: {
    weight: 3,
    words: 'palm-fringed coral-sand',
    places: ['Maldivian', 'Polynesian', 'Bora Bora', 'Rangiroa atoll', 'Cook Islands', 'Caribbean'],
  },
  golden: {
    weight: 3,
    words: 'golden-sand',
    places: ['Hawaiian', 'Kauai', 'Maui', 'Costa Rican', 'Samoan'],
  },
  'salt-and-pepper': {
    weight: 2,
    words: 'salt-and-pepper sand',
    places: ['Hawaiian', 'Big Island', 'Maui'],
    volcanic: true,
  },
  green: { weight: 1, words: 'olivine green-sand', places: ['Big Island'], volcanic: true },
  red: { weight: 1, words: 'rust-red sand', places: ['Maui'], volcanic: true },
  pink: { weight: 1, words: 'pale pink-sand', places: ['Bahamian', 'Bermudian', 'Caribbean'] },
  shell: {
    weight: 1,
    words: 'shell-flecked white sand',
    places: ['Fijian', 'Cook Islands', 'Caribbean'],
  },
};
const FORM = {
  crescent: 'crescent',
  strand: 'long straight strand',
  'lagoon shore': 'lagoon shore',
  motu: 'motu islet beach',
  'reef-flat': 'reef-flat beach with turquoise shallows',
  'river-mouth': 'beach at a small stream mouth',
  'dune-backed': 'dune-backed beach',
  spit: 'sand spit',
  sandbar: 'beach fronting a pale sandbar',
  'tide-flat': 'wide low-tide sand flat',
};
const WATER = {
  'mirror-glass': 'mirror-glass turquoise water',
  calm: 'calm cobalt water',
  shorebreak: 'gentle shorebreak surf curling at the foreground sand',
  'small waves': 'small clean waves rolling in',
  'reef shallows': 'reef-fringed turquoise shallows',
  'wet sheen': 'a wet tide-washed sheen on the foreground sand',
  ripples: 'trade-wind ripples on glassy water',
  'sand channels': 'clear water over pale sand channels',
};
const PALMS = [
  'tall coconut palms silhouetted at the inland fringe',
  'twin coconut palms framing the lateral edges',
  'a multi-palm grove silhouetted along the inland edge',
  'scattered coconut palms standing along the inland palm-line',
  'one leaning coconut palm reaching out over the sand',
  'coconut palms mixed with hala trees at the inland fringe',
  'a low line of ironwood and coconut palms behind the sand',
  'wind-bent coconut palms along the inland edge',
];
// Distant context: sky / land / horizon words only, never water words (those belong to WATER).
const CONTEXT = [
  'open ocean stretching to the horizon',
  'open Pacific stretching to the horizon',
  'a small green islet far offshore',
  'a low green headland far down the coast',
  'a distant volcanic slope far inland, small',
  'a low island on the horizon',
  'the beach curving away empty into the distance',
  'a distant green ridge far inland, small',
  'the sea open to the horizon under a wide tropical sky',
  'the horizon wide and empty under tall trade-wind clouds',
];
// Places where an atoll islet (motu) or a lagoon shore is real
const ATOLL_PLACES = [
  'Polynesian',
  'Bora Bora',
  'Rangiroa atoll',
  'Cook Islands',
  'Maldivian',
  'Fijian',
  'Tahitian',
  'Seychelles',
];
const OPENERS = [
  'Ground-level POV across',
  'Camera-low across',
  'Eye-level at the inland palm-line of',
  'From a beach-edge vantage across',
];

// ── Parsing ─────────────────────────────────────────────────────────────────────────────────────
const SAND_RULES = [
  ['green', /green[- ]sand|olivine/i],
  ['red', /red[- ]sand|rust-red/i],
  ['pink', /pink[- ]sand/i],
  ['salt-and-pepper', /salt-and-pepper/i],
  ['shell', /shell-flecked|shell[- ]sand/i],
  ['black', /black (?:volcanic[- ])?sand/i],
  ['coral', /coral[- ]sand/i],
  ['golden', /golden[- ]sand|gold sand/i],
  ['white', /white[- ]sand/i],
];
const FORM_RULES = [
  ['motu', /\bmotu\b/i],
  ['lagoon shore', /lagoon[- ]shore/i],
  ['reef-flat', /reef-flat|reef flat/i],
  ['river-mouth', /stream mouth|river mouth|stream-mouth|river-mouth/i],
  ['dune-backed', /dune-backed|dunes? behind/i],
  ['spit', /sand spit|\bspit\b/i],
  ['sandbar', /sandbar/i],
  ['tide-flat', /sand flat|tide flat|tidal flat/i],
  ['strand', /straight strand|long strand/i],
  ['crescent', /crescent/i],
];
// Specific states first; the two generic calm words last.
const WATER_RULES = [
  ['sand channels', /sand channels/i],
  ['wet sheen', /wet sheen|tide-washed|wet sand sheen/i],
  ['ripples', /ripples|trade-wind ripple/i],
  ['small waves', /small clean waves|rolling in|breaking waves|rolling waves/i],
  ['shorebreak', /shorebreak|surf curling|gentle surf/i],
  ['reef shallows', /reef-fringed|reef shallows|white reef line/i],
  ['mirror-glass', /mirror-glass|glassy|glass-calm|mirror-calm/i],
  ['calm', /\bcalm\b/i],
];
const pick = (rules, text, fallback) => {
  for (const [k, re] of rules) if (re.test(text)) return k;
  return fallback;
};
function parse(text) {
  const sand = pick(SAND_RULES, text, 'sand');
  const form = pick(FORM_RULES, text, 'beach');
  const water = pick(WATER_RULES, text, 'water');
  return { keys: [`sand:${sand}`, `form:${form}`, `water:${water}`], sand, form, water };
}
function sameGroup(a, b) {
  return a.sand === b.sand && a.form === b.form && a.water === b.water;
}
const entryText = (e) => (typeof e === 'string' ? e : e.description);
const openerOf = (text) => OPENERS.find((o) => text.startsWith(o.split(' ')[0])) || OPENERS[0];

// ── Plan / assign ───────────────────────────────────────────────────────────────────────────────
function planSlots({ slots }) {
  slots.forEach((s) => {
    s.opener = s.old ? openerOf(entryText(s.old)) : OPENERS[Math.floor(Math.random() * 4)];
    s.tags = ['beach'];
  });
}
const weightedLeastUsed = (obj, usage, prefix) =>
  shuffle(Object.keys(obj)).sort(
    (x, y) =>
      (usage[prefix + x] || 0) / (obj[x].weight || 1) -
      (usage[prefix + y] || 0) / (obj[y].weight || 1)
  );
// Flavour rosters are spread by a private counter (they are not part of the "same" rule or the keys).
const flavourUse = {};
const spread = (list) => {
  const choice = byUsage(list, flavourUse)[0];
  flavourUse[choice] = (flavourUse[choice] || 0) + 1;
  return choice;
};
function assign(slot, ctx) {
  const { usage, groups } = ctx;
  // Each axis draws independently from its least-used few (a shared attempt index would lock the
  // three choices in step and retry the same dozen combinations).
  const among = (list, k) => list[Math.floor(Math.random() * Math.min(k, list.length))];
  for (let attempt = 0; attempt < 400; attempt++) {
    const sand = among(weightedLeastUsed(SAND, usage, 'sand:'), 4);
    const form = among(
      byUsage(Object.keys(FORM), usage, (k) => 'form:' + k),
      5
    );
    const water = among(
      byUsage(Object.keys(WATER), usage, (k) => 'water:' + k),
      4
    );
    const cand = { sand, form, water };
    if (groups.some((g) => sameGroup(g.assignment ? g.assignment : g, cand))) continue;
    // a lagoon shore / motu / reef flat is calm water country, never shorebreak
    if (
      ['lagoon shore', 'motu', 'reef-flat'].includes(form) &&
      ['shorebreak', 'small waves'].includes(water)
    )
      continue;
    // real geography: a motu is an atoll islet (coral / white / shell sand, Polynesian places); the
    // green and red Hawaiian sands are small pocket beaches, never spits, flats or sandbars
    if (form === 'motu' && !['coral', 'white', 'shell'].includes(sand)) continue;
    if (['green', 'red'].includes(sand) && !['crescent', 'strand', 'river-mouth'].includes(form))
      continue;
    const places =
      form === 'motu' || form === 'lagoon shore'
        ? SAND[sand].places.filter((p) => ATOLL_PLACES.includes(p))
        : SAND[sand].places;
    if (!places.length) continue;
    return {
      keys: [`sand:${sand}`, `form:${form}`, `water:${water}`],
      sand,
      form,
      water,
      palms: spread(PALMS),
      context: spread(CONTEXT),
      place: shuffle(places)[0],
      tags: [sand, form, water],
    };
  }
  return null;
}

// ── Brief ───────────────────────────────────────────────────────────────────────────────────────
function brief(batch, examples) {
  return `You write entries for one pool of a landscape-photography bot: the tropical BEACH behind a scene (flowers are added by a separate axis, so name none here). Every entry is ONE ground-level tropical beach setting in 25-40 words, one sentence, comma-separated phrases, no title. Keep EXACTLY this shape:

<opener> a <place> <sand words> <beach form> extending across the full midground of the frame, <palms>, <water>, <distant context>

Examples already in the pool (match their voice and length):
${examples.map((e) => '- ' + e).join('\n')}

Rules:
- Use EXACTLY the opener, place, sand, beach form, palms, water and distant context given for the slot, in that order, in your own natural wording. Keep the sand words, the beach-form words and the water words as given so the beach is unmistakable.
- The beach is wide, flat and sandy across the frame; the sea is an OPEN horizon. Real geography only, plain physical description (no glow, no magic).
- Name no flowers, no people, no buildings, boats, umbrellas or huts. No cliffs or mountains as the subject (a distant slope or headland is fine, small). No waterfalls, no jungle interiors. Describe only what is present; write no negative words.

Slots:
${batch
  .map((s, i) => {
    const a = s.assignment;
    return `${i + 1}. opener "${s.opener}"; place ${a.place}; sand "${SAND[a.sand].words}"; beach form "${FORM[a.form]}"; palms "${a.palms}"; water "${WATER[a.water]}"; distant context "${a.context}"`;
  })
  .join('\n')}

Reply with a JSON array of ${batch.length} strings only.`;
}
function build(text, slot) {
  const a = slot.assignment;
  const tags = ['coastal-tropical'];
  if (a && SAND[a.sand] && SAND[a.sand].volcanic) tags.push('volcanic');
  return { tags, description: text };
}

// ── Checks ──────────────────────────────────────────────────────────────────────────────────────
const formatRe = /^(?:Ground-level POV|Camera-low|Eye-level|From a [a-z-]+ vantage)\b.{100,}$/;
const BANS = [
  [
    'flower',
    /\b(flower|flowers|bloom|blooms|blossom|blossoms|petal|petals|hibiscus|plumeria|orchid|frangipani|bougainvillea|heliconia)\b/i,
  ],
  [
    'person',
    /\b(person|people|surfer|sunbather|figure|silhouette of a|footprints|swimmer|couple|child)\b/i,
  ],
  [
    'built',
    /\b(hut|huts|bungalow|bungalows|pier|dock|boardwalk|umbrella|chair|chairs|cabana|bar|lighthouse|village|resort|boat|boats|canoe|kayak|hammock|tiki|lamp)\b/i,
  ],
  [
    'not-beach',
    /\b(waterfall|cascade|canyon|cove|jungle interior|rainforest interior|boulder|rocky shore|cliffs? (?:tower|loom|dominat)|eruption|lava plume)\b/i,
  ],
  ['unreal', /\b(glow|glowing|bioluminescent|magical|neon|floating|alien|sci-fi)\b/i],
  ['negation', /\b(no|not|never|without|nothing)\b/i],
];
function mechanical(cand, slot) {
  const p = [];
  const a = slot.assignment;
  const parsed = parse(cand);
  if (parsed.sand !== a.sand) p.push(`sand ${parsed.sand}≠${a.sand}`);
  if (parsed.form !== a.form) p.push(`form ${parsed.form}≠${a.form}`);
  if (parsed.water !== a.water) p.push(`water ${parsed.water}≠${a.water}`);
  if (!cand.startsWith(slot.opener.split(' ')[0])) p.push('opener changed');
  const words = cand.split(/\s+/).length;
  if (words < 20 || words > 50) p.push(`${words} words`);
  if (!/(?:palm|palms)/i.test(cand)) p.push('no palms');
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
    return o;
  };
  return { sand: t('sand'), form: t('form'), water: t('water') };
}

module.exports = {
  name: 'earthbot/hawaii_flowers/subject',
  poolFile,
  basis:
    'beach = sand type + beach form + water state; same when all three match; greedy, pool order (palms, distant context and place are flavour)',
  entryText,
  build,
  parse,
  sameGroup,
  planSlots,
  assign,
  brief,
  formatRe,
  mechanical,
  measure,
  batchSize: 6,
  lenBand: [150, 360],
};
