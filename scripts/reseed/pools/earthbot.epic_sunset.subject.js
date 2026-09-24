/* global __dirname */
/**
 * earthbot / epic-sunset / subject — ONE flat wide tropical beach sunset per entry.
 *
 * What the pool IS (kept): object entries { tags, description }, 40-60 words. By design (recipe R4,
 * scripts/gen-seeds/earthbot/gen-epic-sunset-subject.js) EVERY entry is a FLAT TROPICAL BEACH SUNSET:
 * sand foreground (white / black / coral), palms on or at the beach as silhouettes, a sunset sky burning
 * above, the sea calm or with gentle shorebreak, wet-sand mirror bands. Never a cliff, cove or rocky
 * shore; volcanic rock only as a small accent. Tags: "coastal-tropical" always; "volcanic" only for
 * black sand; "tropical-jungle" only when the inland fringe is jungle.
 *
 * What was wrong (2026-09-23): 200 entries built from 9 sky openers × the same palm line-up: "Multi-band
 * rainbow gradient sky…" ×30, "Pastel blue-cream-peach pre-sunset…" ×25, "Saturated yellow-orange-red peak
 * sunset…" ×24, "Maui-style multi-palm grove silhouetted along the inland fringe" in most of them.
 *
 * The varying element = the SUNSET PICTURE: the SKY family + the PALM arrangement + the SAND. Same idea
 * = all three match. Rewrites pre-assign the three from the recipe's own rosters (least-used first), plus
 * a real tropical place, a sun moment and a sea state as flavour; the LLM only words it.
 */
const path = require('path');
const { shuffle, byUsage } = require('../lib/core');

const poolFile = path.join(__dirname, '../../bots/earthbot/seeds/epic_sunset_subject.json');

// ── Rosters (the recipe's own vocabulary) ───────────────────────────────────────────────────────
const SKY = {
  rainbow: {
    weight: 3,
    words: 'multi-band rainbow gradient sky burning yellow through orange and pink to violet and deep cobalt zenith',
  },
  pastel: {
    weight: 3,
    words: 'pastel blue-cream-peach pre-sunset sky with soft peach-tinted clouds',
  },
  peak: {
    weight: 3,
    words: 'saturated yellow-orange-red peak sunset blazing above the horizon',
  },
  honey: { weight: 2, words: 'warm honey-gold amber sky scattered with peach-tinted clouds' },
  cottoncandy: {
    weight: 2,
    words: 'cotton-candy pink-magenta cloud cover saturating the entire sky',
  },
  crimson: {
    weight: 2,
    words: 'crimson-orange dramatic cloud bands shredded across the western horizon',
  },
  afterglow: {
    weight: 2,
    words: 'post-sunset lavender-pink afterglow in dense bands with the first stars',
  },
  indigo: {
    weight: 2,
    words: 'blue-purple zenith bleeding down through indigo into a molten orange horizon band',
  },
  mackerel: {
    weight: 1,
    words: 'rippled mackerel sky of small pink-gold cloudlets lit from below',
  },
  rays: {
    weight: 1,
    words: 'crepuscular rays fanning gold through a broken purple cloud deck',
  },
};
const PALMS = {
  fringe: 'tall coconut palms silhouetted on the inland fringe of the beach',
  twin: 'twin coconut palms silhouetted at the frame edges arching over the beach',
  grove: 'a multi-palm grove silhouetted along the inland edge',
  lone: 'a lone bent coconut palm silhouetted leaning over the sand',
  corner: 'a cluster of palm silhouettes arching in from the upper corner over the beach',
  fronds: 'palm fronds arching dark from the upper corner over the sand',
  headland: 'a small palm-fringed headland silhouette across the bay with palms on the near sand',
  scattered: 'scattered coconut palms standing along the inland palm-line',
};
const SAND = {
  white: { weight: 5, words: 'white-sand', places: null },
  coral: { weight: 3, words: 'coral-sand', atoll: true },
  black: { weight: 3, words: 'black volcanic-sand', volcanic: true },
  golden: { weight: 2, words: 'golden-sand' },
  ivory: { weight: 1, words: 'pale-ivory sand' },
  pink: { weight: 1, words: 'pale pink-sand', pinkOnly: true },
  grey: { weight: 1, words: 'grey volcanic-sand', volcanic: true },
};
// Real tropical beach places, with the sands that are real there
const PLACES = [
  ['Hawaiian', ['white', 'black', 'golden']],
  ['Maui', ['white', 'black', 'golden']],
  ['Kauai', ['white', 'golden']],
  ['Big Island', ['black', 'white']],
  ['Oahu', ['white', 'golden']],
  ['Tahitian', ['black', 'white', 'grey']],
  ['Moorea', ['white', 'coral']],
  ['Bora Bora', ['white', 'coral']],
  ['Marquesas', ['black', 'grey']],
  ['Cook Islands', ['white', 'coral']],
  ['Samoan', ['white', 'black']],
  ['Tongan', ['white', 'coral']],
  ['Fijian', ['white', 'coral', 'black']],
  ['Vanuatu', ['white', 'black']],
  ['Solomon Islands', ['white', 'black']],
  ['Melanesian', ['white', 'black']],
  ['Polynesian', ['white', 'coral']],
  ['Micronesian', ['white', 'coral']],
  ['Palau', ['white', 'coral']],
  ['Guam', ['white', 'coral']],
  ['Marshall Islands', ['white', 'coral']],
  ['Maldivian', ['white', 'coral']],
  ['Seychelles', ['white', 'golden']],
  ['Mauritian', ['white', 'golden']],
  ['Zanzibar', ['white']],
  ['Kenyan', ['white']],
  ['Mozambican', ['white', 'golden']],
  ['Madagascan', ['white', 'golden']],
  ['Sri Lankan', ['golden', 'white']],
  ['Andaman', ['white']],
  ['Thai Andaman', ['white', 'golden']],
  ['Philippine', ['white']],
  ['Balinese', ['black', 'white', 'golden', 'grey']],
  ['Lombok', ['white', 'black']],
  ['Timorese', ['white', 'coral']],
  ['Okinawan', ['white', 'coral']],
  ['Caribbean', ['white', 'golden', 'pink']],
  ['Bahamian', ['white', 'pink']],
  ['Bermudian', ['pink', 'white']],
  ['Cuban', ['white', 'golden']],
  ['Jamaican', ['white', 'golden']],
  ['St Lucian', ['golden', 'black']],
  ['Grenadian', ['white', 'golden']],
  ['Barbadian', ['white', 'pink']],
  ['Aruban', ['white']],
  ['Belizean', ['white', 'coral']],
  ['Roatán', ['white']],
  ['Costa Rican', ['golden', 'black', 'white']],
  ['Panamanian', ['white', 'golden']],
  ['Mexican Riviera', ['white', 'ivory']],
  ['Yucatán', ['white', 'ivory']],
  ['Brazilian', ['white', 'golden']],
  ['Dominican', ['white', 'golden']],
  ['Puerto Rican', ['white', 'golden']],
  ['Cayman', ['white', 'ivory']],
  ['Turks and Caicos', ['white', 'ivory']],
  ['Lakshadweep', ['white', 'coral']],
  ['Kiribati', ['white', 'coral']],
  ['Tuvalu', ['white', 'coral']],
  ['Lord Howe', ['white', 'coral']],
];
const SUN = [
  'the sun glowing low on the horizon with sun-rays flaring across the wet sand',
  'the warm sun blazing through the palm silhouettes from the horizon',
  'the sun arc kissing the water horizon with golden sun-glare',
  'the sun half-sunk into the sea in a molten orange bar',
  'the sun already below the horizon and the glow rising behind the palms',
  'the sun burning through a gap in the cloud with sun-rays fanning wide',
  'the sun a soft disc behind thin cloud with a broad glow on the water',
];
const SEA = [
  'gentle shorebreak surf foaming at the foreground in warm light',
  'a calm lagoon lying mirror-flat to the horizon',
  'long wet-sand mirror bands reflecting the inverted sky back toward camera',
  'small clean waves peeling in over the shallows',
  'glassy shallows lapping the sand in slow ripples',
  'a thin sheet of backwash sliding down the sand as a mirror',
  'calm water with a distant palm-fringed islet silhouette in the middle distance',
];

// ── Parsing ─────────────────────────────────────────────────────────────────────────────────────
const SKY_RULES = [
  ['rainbow', /rainbow gradient|multi-band/i],
  ['pastel', /pastel blue-cream-peach|pastel/i],
  ['cottoncandy', /cotton-candy/i],
  ['afterglow', /afterglow/i],
  ['crimson', /crimson-orange|crimson/i],
  ['honey', /honey-gold/i],
  ['indigo', /blue-purple zenith|indigo/i],
  ['mackerel', /mackerel/i],
  ['rays', /crepuscular/i],
  ['peak', /saturated yellow-orange|peak sunset|yellow-orange-red/i],
];
// "fronds" before "corner": the fronds phrase also says "from the upper corner over the sand".
const PALM_RULES = [
  ['twin', /twin (?:coconut )?palms/i],
  ['lone', /lone bent|lone (?:coconut )?palm|one leaning palm/i],
  ['grove', /multi-palm grove|palm grove/i],
  ['fronds', /palm fronds arching/i],
  ['corner', /cluster of palm silhouettes|upper[- ]corner over/i],
  ['headland', /palm-fringed headland/i],
  ['scattered', /scattered (?:coconut )?palms/i],
  ['fringe', /inland fringe|inland edge|palm-line/i],
];
const SAND_RULES = [
  ['pink', /pink[- ]sand/i],
  ['grey', /grey (?:volcanic[- ])?sand/i],
  ['black', /black (?:volcanic[- ])?sand|black-sand/i],
  ['coral', /coral[- ]sand/i],
  ['golden', /golden[- ]sand|gold sand/i],
  ['ivory', /ivory/i],
  ['white', /white[- ]sand/i],
];
const pick = (rules, text, fallback) => {
  for (const [k, re] of rules) if (re.test(text)) return k;
  return fallback;
};
const entryText = (e) => (typeof e === 'string' ? e : e.description);
function parse(text) {
  const sky = pick(SKY_RULES, text, 'sunset');
  const palms = pick(PALM_RULES, text, 'palms');
  const sand = pick(SAND_RULES, text, 'sand');
  return { keys: [`sky:${sky}`, `palms:${palms}`, `sand:${sand}`], sky, palms, sand };
}
function sameGroup(a, b) {
  return a.sky === b.sky && a.palms === b.palms && a.sand === b.sand;
}

// ── Plan / assign ───────────────────────────────────────────────────────────────────────────────
function planSlots({ slots }) {
  slots.forEach((s) => (s.tags = ['sunset']));
}
const weightedLeastUsed = (obj, usage, prefix) =>
  shuffle(Object.keys(obj)).sort(
    (x, y) =>
      (usage[prefix + x] || 0) / (obj[x].weight || 1) -
      (usage[prefix + y] || 0) / (obj[y].weight || 1)
  );
const flavourUse = {};
const spread = (list) => {
  const choice = byUsage(list, flavourUse)[0];
  flavourUse[choice] = (flavourUse[choice] || 0) + 1;
  return choice;
};
function assign(slot, ctx) {
  const { usage, groups } = ctx;
  const among = (list, k) => list[Math.floor(Math.random() * Math.min(k, list.length))];
  for (let attempt = 0; attempt < 400; attempt++) {
    const sky = among(weightedLeastUsed(SKY, usage, 'sky:'), 4);
    const palms = among(
      byUsage(Object.keys(PALMS), usage, (k) => 'palms:' + k),
      4
    );
    const sand = among(weightedLeastUsed(SAND, usage, 'sand:'), 4);
    const cand = { sky, palms, sand };
    if (groups.some((g) => sameGroup(g.assignment ? g.assignment : g, cand))) continue;
    const places = PLACES.filter((p) => p[1].includes(sand)).map((p) => p[0]);
    if (!places.length) continue;
    // an afterglow sky has no sun disc; the "sun through the palms" moments need a sun
    const suns =
      sky === 'afterglow'
        ? SUN.filter((s) => /below the horizon/.test(s))
        : SUN.filter((s) => !/below the horizon/.test(s));
    return {
      keys: [`sky:${sky}`, `palms:${palms}`, `sand:${sand}`],
      sky,
      palms,
      sand,
      place: shuffle(places)[0],
      sun: spread(suns),
      sea: spread(SEA),
      tags: [sky, palms, sand],
    };
  }
  return null;
}

// ── Brief ───────────────────────────────────────────────────────────────────────────────────────
function brief(batch, examples) {
  return `You write entries for one pool of a landscape-photography bot: EarthBot epic-sunset. Every entry is ONE flat wide TROPICAL BEACH SUNSET in 40-55 words, one sentence, comma-separated phrases, no title. The foreground is SAND, palms stand on or at the beach as silhouettes, the sunset sky burns above, the sea is calm or gently breaking. Never a cliff, cove, rocky shore or reef as the subject.

Examples already in the pool (match their voice, order and length):
${examples.map((e) => '- ' + e).join('\n')}

Rules:
- Use EXACTLY the sky, palms, sand, place, sun moment and sea state given for the slot, in your own natural wording; the sky phrase and the palm phrase may open the entry or sit in its first two clauses, but keep their key words (the sky's colour words, the palm arrangement words, the sand words) so the picture is unmistakable.
- Name the place once as an adjective on the beach ("a flat <place> <sand> beach"). Real tropical geography only; plain physical description.
- Nothing built (no bungalow, hut, pier, dock, boardwalk, umbrella, chair, lighthouse, boat, village lights), no people, no wildlife. Describe only what is present; write no negative words.

Slots:
${batch
  .map((s, i) => {
    const a = s.assignment;
    return `${i + 1}. sky "${SKY[a.sky].words}"; palms "${PALMS[a.palms]}"; sand "${SAND[a.sand].words}"; place "${a.place}"; sun "${a.sun}"; sea "${a.sea}"`;
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
const formatRe = /^[A-Z].{180,}$/;
const BANS = [
  [
    'built',
    /\b(bungalow|bungalows|hut|huts|pier|dock|boardwalk|umbrella|chair|chairs|lighthouse|boat|boats|canoe|kayak|village|resort|hammock|lamp|lights)\b/i,
  ],
  ['person', /\b(person|people|surfer|surfers|figure|figures|swimmer|couple|child|footprints)\b/i],
  ['wildlife', /\b(bird|birds|gull|gulls|turtle|turtles|crab|crabs|dolphin|dolphins|whale)\b/i],
  [
    'not-beach',
    /\b(cliff|cliffs|cove|coves|rocky shore|tide pool|tide-pool|buttress|boulder|boulders|headland cliff|sea stack|arch|cave|waterfall)\b/i,
  ],
  ['unreal', /\b(bioluminescent|magical|neon|floating|alien|sci-fi|galaxy|milky way)\b/i],
  ['negation', /\b(no|not|never|without|nothing)\b/i],
];
function mechanical(cand, slot) {
  const p = [];
  const a = slot.assignment;
  const parsed = parse(cand);
  if (parsed.sky !== a.sky) p.push(`sky ${parsed.sky}≠${a.sky}`);
  if (parsed.palms !== a.palms) p.push(`palms ${parsed.palms}≠${a.palms}`);
  if (parsed.sand !== a.sand) p.push(`sand ${parsed.sand}≠${a.sand}`);
  const words = cand.split(/\s+/).length;
  if (words < 32 || words > 62) p.push(`${words} words`);
  if (!/(?:palm|palms)/i.test(cand)) p.push('no palms');
  if (!/\bsand\b|-sand\b/i.test(cand)) p.push('no sand');
  if (!new RegExp(a.place.split(' ')[0], 'i').test(cand)) p.push('place missing');
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
  return { sky: t('sky'), palms: t('palms'), sand: t('sand') };
}

module.exports = {
  name: 'earthbot/epic_sunset/subject',
  poolFile,
  basis:
    'sunset picture = sky family + palm arrangement + sand; same when all three match; greedy, pool order (place, sun moment and sea state are flavour)',
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
  lenBand: [220, 520],
};
