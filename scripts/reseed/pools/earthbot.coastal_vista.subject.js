/* global __dirname */
/**
 * earthbot / coastal-vista / subject — the dramatic craggy coast that IS the picture.
 *
 * What the pool IS (kept): object entries { tags, description }, 25-40 words, POV-led, drama-led,
 * geologically specific, cold-dramatic coasts (basalt column walls, fjord walls, sea stacks, arches,
 * blowholes, wave-cut platforms, sea caves), NO tourist names, NO human-built features, NO weather /
 * light / sky / wildlife (other axes). Recipe: scripts/gen-seeds/earthbot/gen-coastal-vista-subject.js,
 * with intended regional shares (Iceland/Faroe 25, PNW/Big Sur 20, Norway/NZ fjords 15, Irish/English
 * 10, Hawaiian 10, Australian 10, Arctic 5, Scottish/Cornish 5).
 *
 * What was wrong (2026-09-23): 200 entries whose openers repeat verbatim ("Side-on across an Irish
 * Atlantic flagstone coast" ×11, "Aerial drone perspective over a Faroese sea-cliff peninsula" ×11 …):
 * the same coast + feature restated with different scale numbers.
 *
 * The varying element = the COAST: region + the named geological feature + its rock. Same idea = all
 * three match. Rewrites keep each original's POV opener and pre-assign region (weighted to the recipe's
 * shares), a feature that really exists in that region and its real rock, least-used first.
 */
const path = require('path');
const { shuffle, byUsage } = require('../lib/core');

const poolFile = path.join(__dirname, '../../bots/earthbot/seeds/coastal_vista_subject.json');

// ── Roster: real dramatic coasts, what they are made of, what they offer ─────────────────────────
// features use the recipe's own vocabulary; rocks are the region's real rocks; tags per the recipe
const REGIONS = {
  iceland: {
    weight: 13,
    anchor: 'Icelandic black-basalt coast',
    tags: ['coastal-temperate', 'volcanic'],
    rocks: ['basalt', 'lava', 'tuff'],
    features: [
      'column wall',
      'sea stacks',
      'sea arch',
      'sea cave',
      'wave-cut platform',
      'blowhole',
      'amphitheatre',
      'boulder shore',
    ],
  },
  faroe: {
    weight: 12,
    anchor: 'Faroese sea-cliff coast',
    tags: ['coastal-temperate'],
    rocks: ['basalt'],
    features: [
      'cliff',
      'headland',
      'sea stacks',
      'inlet',
      'sea cave',
      'column wall',
      'amphitheatre',
    ],
  },
  pnw: {
    weight: 10,
    anchor: 'Pacific Northwest stack coast',
    tags: ['coastal-temperate'],
    rocks: ['basalt', 'sandstone'],
    features: [
      'sea stacks',
      'wave-cut platform',
      'headland',
      'sea cave',
      'sea arch',
      'boulder shore',
    ],
  },
  'big-sur': {
    weight: 10,
    anchor: 'Big Sur California cliff coast',
    tags: ['coastal-temperate'],
    rocks: ['sandstone', 'shale', 'chert', 'granite'],
    features: ['cliff', 'headland', 'sea arch', 'boulder shore', 'wave-cut platform', 'inlet'],
  },
  norway: {
    weight: 8,
    anchor: 'Norwegian fjord coast',
    tags: ['coastal-temperate', 'alpine'],
    rocks: ['granite', 'gneiss'],
    features: ['fjord wall', 'headland', 'inlet', 'cliff', 'boulder shore'],
  },
  nz: {
    weight: 7,
    anchor: 'NZ Fiordland-style coast',
    tags: ['alpine', 'coastal-temperate'],
    rocks: ['granite', 'gneiss'],
    features: ['fjord wall', 'inlet', 'cliff', 'headland'],
  },
  ireland: {
    weight: 5,
    anchor: 'Irish Atlantic coast',
    tags: ['coastal-temperate'],
    rocks: ['limestone', 'flagstone', 'sandstone'],
    features: ['cliff', 'sea stacks', 'sea arch', 'blowhole', 'headland', 'wave-cut platform'],
  },
  england: {
    weight: 5,
    anchor: 'English Channel chalk coast',
    tags: ['coastal-temperate'],
    rocks: ['chalk', 'limestone'],
    features: ['cliff', 'sea stacks', 'sea arch', 'wave-cut platform', 'headland'],
  },
  hawaii: {
    weight: 10,
    anchor: 'Hawaiian volcanic sea-cliff coast',
    tags: ['volcanic', 'coastal-tropical'],
    rocks: ['lava', 'basalt'],
    features: [
      'cliff',
      'amphitheatre',
      'blowhole',
      'sea arch',
      'sea cave',
      'wave-cut platform',
      'headland',
    ],
  },
  australia: {
    weight: 10,
    anchor: 'Australian Southern Ocean coast',
    tags: ['coastal-temperate'],
    rocks: ['limestone', 'sandstone', 'dolerite', 'granite'],
    features: [
      'sea stacks',
      'cliff',
      'sea arch',
      'column wall',
      'headland',
      'blowhole',
      'boulder shore',
    ],
  },
  arctic: {
    weight: 5,
    anchor: 'Arctic fjord coast',
    tags: ['arctic-polar', 'coastal-temperate'],
    rocks: ['granite', 'dolerite', 'gneiss'],
    features: ['glacier cliff', 'fjord wall', 'cliff', 'inlet'],
  },
  scotland: {
    weight: 3,
    anchor: 'Scottish Hebridean coast',
    tags: ['coastal-temperate'],
    rocks: ['gneiss', 'basalt', 'sandstone'],
    features: ['cliff', 'sea stacks', 'column wall', 'inlet', 'sea cave', 'headland'],
  },
  cornwall: {
    weight: 2,
    anchor: 'Cornish granite coast',
    tags: ['coastal-temperate'],
    rocks: ['granite', 'slate'],
    features: ['headland', 'inlet', 'sea cave', 'cliff', 'boulder shore', 'sea arch'],
  },
  macaronesia: {
    weight: 2,
    anchor: 'Madeira-and-Azores volcanic coast',
    tags: ['volcanic', 'coastal-temperate'],
    rocks: ['basalt', 'lava'],
    features: ['cliff', 'sea stacks', 'sea arch', 'column wall', 'boulder shore'],
  },
  patagonia: {
    weight: 2,
    anchor: 'Patagonian fjord coast',
    tags: ['coastal-temperate', 'alpine'],
    rocks: ['granite', 'gneiss'],
    features: ['fjord wall', 'glacier cliff', 'inlet', 'cliff'],
  },
  'atlantic-canada': {
    weight: 2,
    anchor: 'Atlantic Canada sandstone coast',
    tags: ['coastal-temperate'],
    rocks: ['sandstone', 'granite'],
    features: ['sea stacks', 'sea arch', 'wave-cut platform', 'cliff', 'sea cave'],
  },
  'south-africa': {
    weight: 1,
    anchor: 'Cape granite coast',
    tags: ['coastal-temperate'],
    rocks: ['granite', 'sandstone'],
    features: ['boulder shore', 'headland', 'cliff'],
  },
  'east-asia': {
    weight: 1,
    anchor: 'East Asian volcanic coast',
    tags: ['coastal-temperate', 'volcanic'],
    rocks: ['basalt', 'andesite'],
    features: ['column wall', 'sea stacks'],
  },
};
const FEATURE_WORDS = {
  'column wall': 'hexagonal basalt column wall',
  'sea stacks': 'field of sea stacks standing offshore',
  'sea arch': 'wave-carved sea arch',
  'sea cave': 'sea-eroded cave mouth at the waterline',
  'wave-cut platform': 'wave-cut rock platform exposed at low tide',
  blowhole: 'blowhole punched through the shelf',
  amphitheatre: 'sea-cliff amphitheatre',
  'boulder shore': 'boulder shore of van-sized blocks',
  cliff: 'sheer sea cliff',
  headland: 'headland plunging into the sea',
  inlet: 'cliff-bound inlet',
  'fjord wall': 'fjord wall dropping into deep water',
  'glacier cliff': 'tidewater glacier cliff calving into the fjord',
};
// Scale anchors carry no feature word (a "column" or "stack" here would be read as the feature).
const SCALE = [
  'a thousand-foot vertical drop',
  'six-hundred-foot faces dropping sheer',
  'rock rising sixty meters from the surge',
  'a two-thousand-meter rise from the water',
  'a mile-long sweep of rock',
  'a rise the height of a cathedral',
  'a three-hundred-foot sheer face',
  'rock running unbroken for kilometers',
  'slabs the size of city blocks',
  'a drop of eight hundred feet to the surf',
];
const SURFACE = [
  'wind-scoured',
  'wave-pummeled',
  'salt-bleached',
  'glacier-polished',
  'iron-stained',
  'lichen-crusted',
  'spray-slick',
  'surge-scoured',
  'kelp-strewn',
  'barnacle-crusted',
  'frost-shattered',
  'sea-eroded',
];
const OPENERS = [
  'Aerial drone perspective over',
  'Low POV from the surf-line looking up at',
  'Cliff-edge looking down into',
  'Wide-angle wrapping',
  'Side-on across',
  'Looking along the curve of',
];

// ── Parsing ─────────────────────────────────────────────────────────────────────────────────────
const REGION_RULES = [
  ['faroe', /faroe/i],
  ['iceland', /iceland/i],
  ['pnw', /pacific northwest|oregon|washington coast/i],
  ['big-sur', /big sur|california/i],
  ['nz', /\bnz\b|new zealand|milford|fiordland/i],
  ['norway', /norw|lofoten/i],
  ['ireland', /irish|ireland/i],
  ['england', /english channel|chalk-and-flint|normandy|dover|sussex|dorset/i],
  ['hawaii', /hawai|napali|na pali|polynesian/i],
  ['australia', /australia|southern ocean|tasmania/i],
  ['arctic', /greenland|svalbard|antarctic|arctic/i],
  ['scotland', /scott|hebrid|orkney|shetland/i],
  ['cornwall', /cornish|cornwall|welsh|pembroke/i],
  ['macaronesia', /madeira|azores|canary/i],
  ['patagonia', /patagon|chilean|chile/i],
  ['atlantic-canada', /atlantic canada|newfoundland|fundy|nova scotia|maine|acadia/i],
  ['south-africa', /south africa|cape granite|cape peninsula/i],
  ['east-asia', /japan|jeju|korea|east asian/i],
];
const FEATURE_RULES = [
  ['glacier cliff', /tidewater glacier|calving|glacier cliff|glacier front/i],
  ['column wall', /hexagonal|column/i],
  ['sea arch', /sea arch|rock arch|natural arch|\barch(?:es|way)?\b/i],
  ['sea stacks', /sea[- ]stack|stacks?\b|needle/i],
  ['sea cave', /sea[- ]cave|cave/i],
  ['blowhole', /blowhole/i],
  ['fjord wall', /fjord|fiord/i],
  ['amphitheatre', /amphitheat/i],
  ['wave-cut platform', /wave-cut|platform|shelf|ledge/i],
  ['boulder shore', /boulder|cobble|shingle|blocks/i],
  ['inlet', /inlet|\bgeo\b|zawn|strait|channel|narrows/i],
  ['headland', /headland|peninsula|promontory|point\b/i],
  ['cliff', /cliff|rampart|wall|face/i],
];
const ROCK_RULES = [
  ['dolerite', /dolerite/i],
  ['gneiss', /gneiss/i],
  ['quartzite', /quartzite/i],
  ['flagstone', /flagstone/i],
  ['chert', /chert|serpentinite/i],
  ['andesite', /andesite/i],
  ['tuff', /tuff|palagonite/i],
  ['chalk', /chalk/i],
  ['limestone', /limestone|karst/i],
  ['sandstone', /sandstone/i],
  ['shale', /shale/i],
  ['slate', /slate/i],
  ['granite', /granite/i],
  ['lava', /\blava\b|cinder|volcanic rock/i],
  ['basalt', /basalt/i],
];
const pick = (rules, text, fallback) => {
  for (const [k, re] of rules) if (re.test(text)) return k;
  return fallback;
};
// The assigned feature phrase, when present, decides the feature; the region anchor is stripped first
// ("Norwegian fjord coast" must not read as a fjord wall, "Big Sur cliff coast" not as a cliff).
const ANCHOR_RE = new RegExp(
  Object.values(REGIONS)
    .map((r) => r.anchor.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
    .join('|'),
  'gi'
);
const FEATURE_PHRASES = [
  ['column wall', /column wall/i],
  ['sea stacks', /sea stacks? standing|field of sea stacks/i],
  ['sea arch', /wave-carved sea arch/i],
  ['sea cave', /cave mouth at the waterline|sea-eroded cave mouth/i],
  ['wave-cut platform', /wave-cut rock platform/i],
  ['blowhole', /blowhole punched/i],
  ['amphitheatre', /sea-cliff amphitheatre/i],
  ['boulder shore', /boulder shore/i],
  ['glacier cliff', /tidewater glacier cliff/i],
  ['fjord wall', /fjord wall/i],
  ['inlet', /cliff-bound inlet/i],
  ['headland', /headland plunging/i],
  ['cliff', /sheer sea cliff/i],
];
function parse(text) {
  const region = pick(REGION_RULES, text, 'coast');
  const body = text.replace(ANCHOR_RE, ' ');
  const feature = pick(FEATURE_PHRASES, body, null) || pick(FEATURE_RULES, body, 'cliff');
  const rock = pick(ROCK_RULES, body, 'rock');
  const pov = openerOf(text) || 'other';
  return {
    keys: [`region:${region}`, `feature:${feature}`, `rock:${rock}`, `pov:${pov}`],
    region,
    feature,
    rock,
    pov,
  };
}
// Same picture = the same coast (region + feature + rock) seen the same way (POV opener). An aerial
// over basalt sea stacks and a surf-line low POV at the same stacks are different pictures.
function sameGroup(a, b) {
  return a.region === b.region && a.feature === b.feature && a.rock === b.rock && a.pov === b.pov;
}
const entryText = (e) => (typeof e === 'string' ? e : e.description);
const openerOf = (text) => {
  const l = text.toLowerCase();
  if (l.startsWith('aerial')) return OPENERS[0];
  if (l.startsWith('low pov')) return OPENERS[1];
  if (l.startsWith('cliff-edge')) return OPENERS[2];
  if (l.startsWith('wide-angle')) return OPENERS[3];
  if (l.startsWith('side-on')) return OPENERS[4];
  if (l.startsWith('looking')) return OPENERS[5];
  return null;
};

// ── Plan / assign ───────────────────────────────────────────────────────────────────────────────
const flavourUse = {};
const spread = (list) => {
  const c = byUsage(list, flavourUse)[0];
  flavourUse[c] = (flavourUse[c] || 0) + 1;
  return c;
};
function planSlots({ slots }) {
  slots.forEach((s) => {
    s.opener = (s.old && openerOf(entryText(s.old))) || spread(OPENERS);
    s.tags = ['coast'];
  });
}
const among = (list, k) => list[Math.floor(Math.random() * Math.min(k, list.length))];
// Enumerate every (region, feature, rock, pov) still free, then choose the region furthest below its
// recipe share among those that still have free combos, and the least-used feature / rock / pov
// inside it. Trying random combos instead exhausts small regions and leaves slots unfilled.
function assign(slot, ctx) {
  const { usage, groups } = ctx;
  const taken = new Set(
    groups.map((g) => {
      const p = g.assignment ? g.assignment : g;
      return `${p.region}|${p.feature}|${p.rock}|${p.pov}`;
    })
  );
  const free = {};
  for (const [region, R] of Object.entries(REGIONS)) {
    for (const feature of R.features)
      for (const rock of R.rocks)
        for (const pov of OPENERS)
          if (!taken.has(`${region}|${feature}|${rock}|${pov}`))
            (free[region] = free[region] || []).push({ region, feature, rock, pov });
  }
  const regions = Object.keys(free);
  if (!regions.length) return null;
  const region = among(
    shuffle(regions).sort(
      (x, y) =>
        (usage['region:' + x] || 0) / REGIONS[x].weight -
        (usage['region:' + y] || 0) / REGIONS[y].weight
    ),
    2
  );
  const score = (c) =>
    (usage['feature:' + c.feature] || 0) +
    (usage['rock:' + c.rock] || 0) +
    (usage['pov:' + c.pov] || 0);
  const pick1 = among(
    shuffle(free[region]).sort((a, b) => score(a) - score(b)),
    3
  );
  return {
    keys: [
      `region:${pick1.region}`,
      `feature:${pick1.feature}`,
      `rock:${pick1.rock}`,
      `pov:${pick1.pov}`,
    ],
    ...pick1,
    scale: spread(SCALE),
    surface: [spread(SURFACE), spread(SURFACE)],
    tags: [pick1.region, pick1.feature, pick1.rock],
  };
}

// ── Brief ───────────────────────────────────────────────────────────────────────────────────────
function brief(batch, examples) {
  return `You write entries for one pool of a landscape-photography bot: DRAMATIC craggy coasts, the "I can't believe this is Earth" kind, gallery-print tier. Every entry is ONE coast scene in 25-40 words, one sentence, comma-separated phrases, POV-led and drama-led, geologically specific. Keep EXACTLY this shape:

<opener> a <region anchor> <feature>, <scale anchor>, <rock and surface specifics>, <one more concrete geological detail of the same coast>

Examples already in the pool (match their voice and length):
${examples.map((e) => '- ' + e).join('\n')}

Rules:
- Use EXACTLY the opener, region anchor, feature, rock, scale anchor and surface words given for the slot, in your own natural wording. Name the feature and the rock plainly so the coast is unmistakable, and name ONLY that rock type (one rock per entry). Real geology of that region only. 25-40 words: stop at the fourth phrase.
- Broad regional anchors only: no named landmarks, viewpoints, parks or trails. No human-built thing of any kind (no lighthouse, steps, path, wall, pier, cabin, deck, railing).
- Describe the COAST only: no weather, no time of day, no light, no sky, no fog or mist, no wildlife, no people. Surface character is fine (wind-scoured, wave-pummeled, glacier-polished). Describe only what is present; write no negative words.

Slots:
${batch
  .map((s, i) => {
    const a = s.assignment;
    return `${i + 1}. opener "${a.pov}"; region anchor "${REGIONS[a.region].anchor}"; feature "${FEATURE_WORDS[a.feature]}"; rock ${a.rock}; scale anchor "${a.scale}"; surface words "${a.surface.join('", "')}"`;
  })
  .join('\n')}

Reply with a JSON array of ${batch.length} strings only.`;
}
function build(text, slot) {
  const a = slot.assignment;
  return { tags: a ? REGIONS[a.region].tags.slice() : ['coastal-temperate'], description: text };
}

// ── Checks ──────────────────────────────────────────────────────────────────────────────────────
const formatRe =
  /^(?:Aerial drone perspective over|Low POV from the surf-line looking up at|Cliff-edge looking down into|Wide-angle wrapping|Side-on across|Looking along the curve of)\b.{120,}$/;
const BANS = [
  [
    'landmark',
    /\b(Reynisfjara|Moher|Apostles|Étretat|Etretat|Kiwanda|Bandon|Trolltunga|Preikestolen|Napali Coast|Na Pali Coast|Faraglioni|Wickham|Staffa|Old Man of|Durdle|Giant's Causeway|Bixby|Seven Sisters|Cape Point|Nugget Point|Tojinbo|Jusangjeolli)\b/i,
  ],
  [
    'built',
    /\b(lighthouse|steps|path|paths|cobblestone|footbridge|stone wall|walls? of stone|ruins?|tower|cabin|dock|pier|boathouse|platform deck|deck|porch|railing|trail|stepping stones|bridge|road|fence|house|village|harbou?r|boat|boats|ship)\b/i,
  ],
  [
    'other-axis',
    /\b(sunset|sunrise|golden hour|golden-hour|fog|foggy|mist|misty|storm|stormy|rain|raining|godray|god-ray|aurora|moon|moonlit|stars|starry|dusk|dawn|twilight|light|lit\b|glow|glowing|cloud|clouds|overcast|sky|skies|rainbow|snowfall|blizzard)\b/i,
  ],
  ['wildlife', /\b(puffin|puffins|seal|seals|whale|whales|bird|birds|gull|gulls|eagle|otter)\b/i],
  ['person', /\b(person|people|hiker|hikers|climber|climbers|figure|silhouette|footprints)\b/i],
  ['unreal', /\b(bioluminescent|magical|mystical|alien|sci-fi|fantasy)\b/i],
  ['tropical-paradise', /\b(palm|palms|white-sand beach|lagoon)\b/i],
  ['negation', /\b(no|not|never|without|nothing)\b/i],
];
function mechanical(cand, slot) {
  const p = [];
  const a = slot.assignment;
  const parsed = parse(cand);
  if (parsed.region !== a.region) p.push(`region ${parsed.region}≠${a.region}`);
  if (parsed.feature !== a.feature) p.push(`feature ${parsed.feature}≠${a.feature}`);
  if (parsed.rock !== a.rock) p.push(`rock ${parsed.rock}≠${a.rock}`);
  if (parsed.pov !== a.pov) p.push(`opener ${parsed.pov}≠${a.pov}`);
  const words = cand.split(/\s+/).length;
  if (words < 22 || words > 52) p.push(`${words} words`);
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
  return { regions: t('region'), features: t('feature'), rocks: t('rock') };
}

module.exports = {
  name: 'earthbot/coastal_vista/subject',
  poolFile,
  basis:
    'coast = region + geological feature + rock; same when all three match; greedy, pool order (opener, scale and surface words are flavour)',
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
  lenBand: [220, 480],
};
