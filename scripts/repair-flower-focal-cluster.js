#!/usr/bin/env node
/**
 * repair-flower-focal-cluster.js — make every entry of BloomBot's flower-friends subject pool a genuinely
 * different flower line-up, WITHOUT changing what the pool is (SEED_POOL_REPAIR_HANDOFF.md, the resumed pilot).
 *
 * What it keeps, verbatim: the format (TITLE / TAG — flower + flower + … blooming together as co-hero in
 * pulled-back enchanted <setting> vignette, <register>, <background>), the setting words, the entry count,
 * and ONE original entry of every distinct line-up (the first one, in pool order).
 *
 * What it changes: every NEAR-COPY (an original that shares 4+ of its flowers with an earlier kept original) is
 * rewritten IN PLACE into a new line-up. Kevin 2026-09-23: same pool, all colours welcome (not only pastel),
 * stay inside the motif but vary within it. So each rewrite:
 *   - shares at most 2 flowers with every other entry in the final pool,
 *   - draws on species the pool under-uses (a per-species cap; the automatic daisies are capped out),
 *   - fills the colour families the pool is short of, 9 families evenly, about half in clear rich colour,
 *   - names each flower only in a colour it really grows in (AI check),
 *   - is judged by an AI reader as not the same idea as any other entry,
 *   - passes the pool's own bans (no insects, people, vases, interiors, text-prone nouns, negation).
 *
 * Dry run is the default: it writes the proposed pool + a report to the scratch dir and changes nothing.
 * --execute backs the pool up outside the repo, writes it, and asserts the count and JSON are intact.
 *
 *   node scripts/repair-flower-focal-cluster.js [--out <dir>] [--execute --from <proposal.json>]
 */
const fs = require('fs');
const os = require('os');
const path = require('path');
const { SONNET, HAIKU } = require('./lib/models');
const { loadEnv } = require('./lib/seedGenHelper');

const POOL = path.join(
  __dirname,
  'bots/bloombot/seeds/bloombot_flower_friends_flower_focal_cluster.json'
);
const argv = process.argv.slice(2);
const flag = (n) => (argv.includes(n) ? argv[argv.indexOf(n) + 1] : null);
const EXECUTE = argv.includes('--execute');
const OUT = flag('--out') || path.join(os.tmpdir(), 'ffc-repair');
const FROM = flag('--from');
const KEY = process.env.ANTHROPIC_API_KEY || loadEnv().ANTHROPIC_API_KEY;

// ── Parsing ──────────────────────────────────────────────────────────────────────────────────────
const FORM_TAIL = new Set([
  'cluster',
  'clusters',
  'spire',
  'spires',
  'cascade',
  'cascades',
  'strand',
  'strands',
  'tendril',
  'tendrils',
  'bloom',
  'blooms',
  'blossom',
  'blossoms',
  'spray',
  'sprays',
  'stems',
  // descriptive tail nouns new entries use ("hellebore cups", "gaura wands", "astilbe plumes")
  ...'cup cups bract bracts wand wands globe globes star stars trumpet trumpets plume plumes bell bells pincushion pincushions mound mounds frond fronds froth flower flowers head heads rosette rosettes umbel umbels disc discs petal petals tuft tufts panicle panicles candle candles tassel tassels saucer saucers chalice chalices sprig sprigs frill frills ruffle ruffles bud buds whorl whorls spike spikes stalk stalks carpet drift drifts mass masses pompoms pom-poms'.split(
    ' '
  ),
]);
const KEEP_S = new Set([
  'cosmos',
  'ranunculus',
  'phlox',
  'clematis',
  'hibiscus',
  'lotus',
  'crocus',
]);
const IRREGULAR = {
  irises: 'iris',
  crocuses: 'crocus',
  narcissi: 'narcissus',
  gladioli: 'gladiolus',
};
// One key per plant, whatever it is called ("alchemilla" = "lady's-mantle").
const ALIAS = {
  'bachelor-button': 'cornflower',
  centaurea: 'cornflower',
  alchemilla: "lady's-mantle",
  mantle: "lady's-mantle",
  'tobacco-plant': 'nicotiana',
  'tobacco-flower': 'nicotiana',
  tobacco: 'nicotiana',
  myosotis: 'forget-me-not',
  columbine: 'aquilegia',
  coneflower: 'echinacea',
  'black-eyed-susan': 'rudbeckia',
  susan: 'rudbeckia',
  digitalis: 'foxglove',
  antirrhinum: 'snapdragon',
  lathyrus: 'sweet-pea',
  pea: 'sweet-pea',
  consolida: 'larkspur',
  helleborus: 'hellebore',
  'love-in-a-mist': 'nigella',
  pincushion: 'scabiosa',
  breath: 'gypsophila',
  "baby's-breath": 'gypsophila',
  holly: 'eryngium',
  'sea-holly': 'eryngium',
  thistle: 'echinops',
  'globe-thistle': 'echinops',
  lace: 'ammi',
  "queen-anne's-lace": 'ammi',
  hemerocallis: 'daylily',
  verbascum: 'mullein',
  'flowering-tobacco': 'nicotiana',
};

function singular(w) {
  if (IRREGULAR[w]) return IRREGULAR[w];
  if (KEEP_S.has(w) || /(ss|us|is)$/.test(w)) return w;
  if (/ies$/.test(w)) return w.replace(/ies$/, 'y');
  return w.replace(/s$/, '');
}

/** The flower items of an entry, verbatim ("soft baby-blue hydrangea clusters", …). */
function flowerItems(entry) {
  const body = entry.split(' — ').slice(1).join(' — ');
  const list = body.split(' blooming together')[0];
  return list
    .split(' + ')
    .map((s) => s.trim())
    .filter(Boolean);
}

/** A species key per item: the last word once trailing form words are dropped, singular, aliased. */
function keyOfItem(item) {
  const words = item.toLowerCase().split(/\s+/);
  while (words.length > 1 && FORM_TAIL.has(words[words.length - 1])) words.pop();
  const last = words[words.length - 1];
  // "morning-glory" written with hyphens is the roster's "morning glory": key it the same way.
  const spaced = last.replace(/-/g, ' ');
  if (last.includes('-') && spaced !== last && typeof ROSTER === 'object' && ROSTER[spaced]) {
    return keyOfItem(spaced);
  }
  const s = singular(last);
  return ALIAS[s] || s;
}
function speciesOf(entry) {
  return [...new Set(flowerItems(entry).map(keyOfItem))];
}

const FAMILY_RULES = [
  ['multi', /MULTI|RAINBOW|SPECTRUM/],
  ['green', /GREEN|LIME|CHARTREUSE|CELADON|JADE/],
  ['red', /\bRED\b|RED-|CRIMSON|SCARLET|RUBY/],
  ['blue', /TURQUOISE|SEAFOAM|BLUE|CORNFLOWER|PERIWINKLE|AZURE|COBALT|SAPPHIRE/],
  ['violet', /VIOLET|LILAC|LAVENDER|PURPLE|PLUM|AMETHYST/],
  ['yellow', /YELLOW|GOLD|LEMON|BUTTERCUP|CHAMOMILE|HONEY|SAFFRON|MUSTARD/],
  ['white', /WHITE|IVORY|CREAM|OFFWHITE|PEARL/],
  ['orange', /APRICOT|PEACH|TANGERINE|ORANGE|CORAL|AMBER|COPPER|TERRACOTTA/],
  ['pink', /PINK|ROSE|BLUSH|MAUVE|FUCHSIA|MAGENTA|RASPBERRY/],
];
const FAMILIES = FAMILY_RULES.map(([f]) => f);
const TAG_FAMILY = {
  BLUE: 'blue',
  VIOLET: 'violet',
  YELLOW: 'yellow',
  WHITE: 'white',
  ORANGE: 'orange',
  PINK: 'pink',
  RED: 'red',
  GREEN: 'green',
  MULTI: 'multi',
  'MULTI-COLOR': 'multi',
};
/** The entry's colour family: its "<X>-DOMINANT" tag when it has one, else the title's colour words. */
function familyOf(entry) {
  const title = entry.split(' — ')[0].toUpperCase();
  const tag = title.match(/\/\s*([A-Z]+(?:-COLOR)?)-DOMINANT\b/);
  if (tag && TAG_FAMILY[tag[1]]) return TAG_FAMILY[tag[1]];
  for (const [f, re] of FAMILY_RULES) if (re.test(title)) return f;
  return 'other';
}
const isRich = (entry) => /rich clear watercolor register/.test(entry);

// ── The rules every rewrite must pass ───────────────────────────────────────────────────────────
// The setting words the originals use, weighted roughly as they are (garden 40, meadow 32, glade 24, rest rare).
const SETTINGS = [
  'garden',
  'meadow',
  'glade',
  'garden',
  'wildflower meadow',
  'glade',
  'garden',
  'meadow',
  'spring meadow',
  'forest-edge',
  'garden',
  'wildflower glade',
  'meadow-edge',
  'dreamscape',
];
const FORMAT_RE =
  /^[A-Z0-9][A-Z0-9 '&-]+ \/ [A-Z][A-Z -]+ — .+ \+ .+ blooming together as co-hero in pulled-back enchanted [a-z -]+ vignette, (soft pastel|rich clear) watercolor register, .+$/;
const BANS = [
  ['insect', /\b(bee|bees|butterfl|moth|dragonfl|ladybug|firefl|insect|pollinator|hummingbird)/i],
  ['person', /\b(hand|hands|person|people|girl|woman|man|child|figure|fairy|fairies|gardener)\b/i],
  [
    'setting',
    /\b(vase|bouquet in|interior|room|window|archway|arch|tunnel|ruin|ruins|city|street|wall|fence|path|trail|bench)\b/i,
  ],
  // scripts/sweep-bot-seed-defects.js: text_prior + heavy_blur (the families scoped to BloomBot)
  [
    'text_prior',
    /\b(weathervane|sundial|sign|signboard|label|banner|plaque|nameplate|marker|lettering)\b/i,
  ],
  [
    'blur',
    /\b(extreme shallow depth|heavy blur|heavily blurred|blurred into|dissolving into bokeh|out of focus|extreme macro)\b/i,
  ],
  ['negation', /\b(no|not|never|without|nothing)\b/i],
];
const NEGATION_SAFE = /forget-me-nots?/gi; // a flower, not a negation
const SPECIES_CAP = 6; // total uses of one species across the final pool (species already over it get none)

// ── Model calls ──────────────────────────────────────────────────────────────────────────────────
async function claude(model, prompt, maxTokens) {
  const delays = [2000, 6000, 15000, 30000];
  for (let i = 0; ; i++) {
    let res;
    try {
      res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'x-api-key': KEY,
          'anthropic-version': '2023-06-01',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model,
          max_tokens: maxTokens,
          messages: [{ role: 'user', content: prompt }],
        }),
      });
    } catch (e) {
      if (i < delays.length) {
        await new Promise((r) => setTimeout(r, delays[i]));
        continue;
      }
      throw e;
    }
    if (res.ok) {
      const j = await res.json();
      return j.content.map((c) => c.text || '').join('');
    }
    if ((res.status === 429 || res.status === 529 || res.status >= 500) && i < delays.length) {
      await new Promise((r) => setTimeout(r, delays[i]));
      continue;
    }
    throw new Error(`${model} ${res.status}: ${(await res.text()).slice(0, 200)}`);
  }
}
/** The first complete JSON array/object in a reply (Sonnet sometimes adds prose after it). */
function jsonOf(t) {
  const start = t.search(/[[{]/);
  if (start < 0) throw new Error('no JSON in reply');
  let depth = 0;
  let inStr = false;
  for (let i = start; i < t.length; i++) {
    const c = t[i];
    if (inStr) {
      if (c === '\\') i++;
      else if (c === '"') inStr = false;
    } else if (c === '"') inStr = true;
    else if (c === '[' || c === '{') depth++;
    else if (c === ']' || c === '}') {
      depth--;
      if (depth === 0) return JSON.parse(t.slice(start, i + 1));
    }
  }
  throw new Error('unterminated JSON in reply');
}

async function realColours(entry) {
  const items = flowerItems(entry);
  const out = await claude(
    SONNET,
    `You are an experienced horticulturist. For each flower description below, decide whether that flower comes in that HUE FAMILY at all, counting the wild form AND named garden cultivars (green zinnias like 'Envy', white agapanthus 'Albus', white echinacea 'White Swan', pink mullein 'Pink Domino', yellow winter jasmine all exist). The hue families are: blue, violet/purple, yellow, white/cream/ivory, orange/peach/apricot, pink/rose/blush, red/crimson, green/lime/chartreuse. IGNORE intensity and shade words entirely: deep, vivid, bright, clear, hot, pale, soft, dusty, powder, lemon, sage, steel and similar never make an answer false, even when the real flower is paler or greyer than the word suggests. Answer false ONLY when the flower does not come in that hue family at all (a turquoise scabiosa, a true-blue rose, a red bluebell). When in doubt, answer true.\n\n${items
      .map((s, i) => `${i + 1}. ${s}`)
      .join(
        '\n'
      )}\n\nReply with JSON only: {"answers":[{"n":1,"real":true,"why":"under 12 words"}, ...]} covering every number.`,
    2000
  );
  const a = jsonOf(out).answers || [];
  return a.filter((x) => x.real === false).map((x) => `${items[x.n - 1]} (${x.why})`);
}

async function sameIdea(candidate, others) {
  const out = await claude(
    HAIKU,
    `Below is a numbered pool of flower-garden scene descriptions, then a CANDIDATE. Is the candidate the SAME IDEA as any numbered entry? Same idea means the candidate shows MOSTLY THE SAME FLOWER SPECIES as that entry (count a plant under two names, like alchemilla and lady's-mantle, as the same species). Sharing a colour family is NOT the same idea: two all-white entries with different flowers are different ideas. The shared wording at the end of every entry does not count.\n\n${others
      .map((s, i) => `${i + 1}. ${s}`)
      .join(
        '\n'
      )}\n\nCANDIDATE: ${candidate}\n\nReply with only NONE, or the numbers it duplicates separated by commas.`,
    60
  );
  const t = out.trim();
  return /^NONE/i.test(t) ? [] : (t.match(/\d+/g) || []).map(Number);
}

// ── Checks ───────────────────────────────────────────────────────────────────────────────────────
function mechanicalProblems(entry, slot, working, usage, lenBand) {
  const p = [];
  if (!FORMAT_RE.test(entry)) p.push('format');
  const sp = speciesOf(entry);
  const n = flowerItems(entry).length;
  if (n < 5 || n > 6 || sp.length !== n) p.push(`flower count ${n}/${sp.length} distinct`);
  if (familyOf(entry) !== slot.family) p.push(`family ${familyOf(entry)}≠${slot.family}`);
  if (isRich(entry) !== slot.rich) p.push(slot.rich ? 'not rich register' : 'not pastel register');
  if (slot.rich && /\bpastel\b/i.test(entry)) p.push('rich entry says pastel');
  if (entry.length < lenBand[0] || entry.length > lenBand[1]) p.push(`length ${entry.length}`);
  const scan = entry.replace(NEGATION_SAFE, 'myosotis');
  for (const [name, re] of BANS) {
    const m = scan.match(re);
    if (m) p.push(`${name}:"${m[0]}"`);
  }
  for (const s of sp) {
    if ((usage[s] || 0) + 1 > SPECIES_CAP) p.push(`species cap: ${s} (${usage[s]})`);
  }
  for (const w of working) {
    const shared = speciesOf(w).filter((x) => sp.includes(x));
    if (shared.length > 2) {
      p.push(`shares ${shared.length} (${shared.join(', ')}) with "${w.slice(0, 50)}…"`);
      break;
    }
  }
  return p;
}

// ── Main ─────────────────────────────────────────────────────────────────────────────────────────
function plan() {
  const pool = JSON.parse(fs.readFileSync(POOL, 'utf8'));
  // Keep the first original of every line-up; a later original sharing 4+ flowers with a kept one is a near-copy.
  const kept = [];
  const slots = [];
  pool.forEach((e, i) => {
    const sp = speciesOf(e);
    const dupOf = kept.find((k) => speciesOf(pool[k]).filter((x) => sp.includes(x)).length >= 4);
    if (dupOf === undefined) kept.push(i);
    else slots.push({ index: i, old: e, dupOf });
  });

  // Colour targets: 9 families as even as the count allows; the rewrites fill whatever the kept set lacks.
  const target = Math.floor(pool.length / FAMILIES.length);
  const extra = pool.length - target * FAMILIES.length;
  const have = Object.fromEntries(FAMILIES.map((f) => [f, 0]));
  kept.forEach((k) => {
    const f = familyOf(pool[k]);
    if (f in have) have[f]++;
  });
  const need = [];
  FAMILIES.forEach((f, fi) => {
    const want = target + (fi < extra ? 1 : 0);
    for (let n = have[f]; n < want; n++) need.push(f);
  });
  while (need.length < slots.length) need.push(FAMILIES[need.length % FAMILIES.length]);
  // Interleave families across slots so each batch mixes colours; alternate pastel / rich.
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
    s.rich = i % 2 === 1;
    s.setting = SETTINGS[i % SETTINGS.length];
  });
  return { pool, kept, slots };
}

// ── The flower roster: everyday names and the hues each REALLY comes in (wild form or common cultivars) ──
// b blue · v violet · y yellow · w white/cream · o orange · p pink · r red · g green
const ROSTER = {
  agapanthus: 'bvw',
  alstroemeria: 'poywrv',
  astilbe: 'pwr',
  astrantia: 'wpr',
  'bells-of-ireland': 'g',
  "lady's-mantle": 'gy',
  hellebore: 'wpgvy',
  'flowering tobacco': 'wpgr',
  zinnia: 'poyrwgv',
  dahlia: 'poyrwv',
  calendula: 'oy',
  marigold: 'oy',
  coreopsis: 'yorp',
  rudbeckia: 'yor',
  helenium: 'yor',
  echinacea: 'pwoyg',
  gaillardia: 'roy',
  gazania: 'oypw',
  nasturtium: 'oyr',
  crocosmia: 'ory',
  daylily: 'oyrpwv',
  iris: 'bvyw',
  delphinium: 'bvwp',
  salvia: 'bvrpw',
  veronica: 'bvwp',
  borage: 'b',
  anchusa: 'b',
  baptisia: 'bvyw',
  "viper's-bugloss": 'bv',
  tradescantia: 'bvwp',
  gentian: 'b',
  lobelia: 'bvrw',
  'love-in-a-mist': 'bwpv',
  'forget-me-not': 'bpw',
  cornflower: 'bpwv',
  hydrangea: 'bpwvg',
  scabiosa: 'bvpwr',
  periwinkle: 'bvw',
  'morning glory': 'bvpw',
  'globe thistle': 'b',
  'sea holly': 'bvw',
  bluebell: 'bp',
  lupine: 'bvpywro',
  lavender: 'v',
  wisteria: 'vwp',
  lilac: 'vwp',
  allium: 'vwp',
  verbena: 'vprw',
  heliotrope: 'vw',
  clematis: 'vbwpr',
  aster: 'vbpw',
  catmint: 'vb',
  pansy: 'vywbor',
  viola: 'vywb',
  'sweet william': 'prwv',
  dianthus: 'prw',
  carnation: 'prwyov',
  stock: 'pvwy',
  lisianthus: 'wpvgb',
  'bleeding-heart': 'pwr',
  sidalcea: 'p',
  lychnis: 'rpow',
  'red valerian': 'rpw',
  persicaria: 'prw',
  hollyhock: 'prwyvo',
  mallow: 'pwv',
  cranesbill: 'bvpw',
  pelargonium: 'rpwo',
  begonia: 'rpwoy',
  impatiens: 'rpwov',
  petunia: 'rpwvby',
  poppy: 'roywpv',
  camellia: 'prw',
  magnolia: 'wpvy',
  'cherry-blossom': 'pw',
  'apple blossom': 'wp',
  azalea: 'prwovy',
  rhododendron: 'pvrwy',
  primrose: 'ypwvrbo',
  daffodil: 'ywo',
  narcissus: 'wyo',
  crocus: 'vywb',
  freesia: 'ywporv',
  gerbera: 'oyprw',
  sunflower: 'yorw',
  goldenrod: 'y',
  mullein: 'ywp',
  buttercup: 'y',
  cowslip: 'y',
  lily: 'wyopr',
  gladiolus: 'proywvg',
  amaryllis: 'rwpo',
  canna: 'royp',
  hibiscus: 'rpoywv',
  fuchsia: 'prvw',
  bergenia: 'pwr',
  gaura: 'wp',
  gypsophila: 'wp',
  meadowsweet: 'w',
  'sweet cicely': 'w',
  chamomile: 'w',
  feverfew: 'w',
  'cow parsley': 'w',
  "queen anne's lace": 'w',
  trillium: 'wpry',
  snowdrop: 'w',
  'lily-of-the-valley': 'wp',
  jasmine: 'wyp',
  gardenia: 'w',
  candytuft: 'wpv',
  alyssum: 'wpv',
  nemesia: 'pbywovr',
  diascia: 'powr',
  osteospermum: 'wvpyo',
  knautia: 'rp',
  'cardinal flower': 'r',
  'red hot poker': 'roy',
  bergamot: 'rpvw',
  penstemon: 'rpvwb',
  euphorbia: 'gy',
  'guelder-rose': 'wg',
  chrysanthemum: 'ywprovg',
  cyclamen: 'pwrv',
  tuberose: 'w',
  honeysuckle: 'ywpor',
  clover: 'pwr',
  thrift: 'pw',
  flax: 'bwr',
  nemophila: 'bw',
  brunnera: 'b',
  pulmonaria: 'bpvw',
  scilla: 'bp',
  hyacinth: 'bvpwy',
  ceanothus: 'b',
  plumbago: 'bw',
  amaranth: 'rg',
  hosta: 'vw',
  "solomon's seal": 'w',
  ranunculus: 'poywrv',
  anemone: 'rpwvb',
  daisy: 'wpy',
  cosmos: 'pwoyr',
  phlox: 'pwvbr',
  larkspur: 'bvwp',
  yarrow: 'wypr',
  aquilegia: 'bvpwyr',
  'sweet-pea': 'pvwrbo',
  rose: 'prwyov',
  peony: 'pwrvy',
  tulip: 'rpyowvg',
  snapdragon: 'prwyov',
  foxglove: 'pwvy',
  statice: 'vbwpy',
  bellflower: 'bvwp',
};
const HUE = {
  b: 'blue',
  v: 'violet',
  y: 'yellow',
  w: 'white',
  o: 'orange',
  p: 'pink',
  r: 'red',
  g: 'green',
};
const HUE_OF_FAMILY = {
  blue: 'b',
  violet: 'v',
  yellow: 'y',
  white: 'w',
  orange: 'o',
  pink: 'p',
  red: 'r',
  green: 'g',
};
// Companion hues that suit each family (the originals pair a lead colour with cream/white and a neighbour).
const COMPANIONS = {
  blue: 'wvpy',
  violet: 'wpby',
  yellow: 'wobg',
  white: 'gypb',
  orange: 'ywrp',
  pink: 'wvrg',
  red: 'wopy',
  green: 'wypv',
};
const HUE_WORDS = {
  pastel: {
    b: 'pale baby-blue / powder-blue / soft periwinkle',
    v: 'soft lavender / pale lilac / dusty violet',
    y: 'soft buttercup / pale gold / lemon-cream',
    w: 'ivory / cream / soft white',
    o: 'pale apricot / soft peach / dusty tangerine',
    p: 'blush / dusty rose / pale pink',
    r: 'soft rose-red / faded crimson / dusty red',
    g: 'pale green / soft lime / sage-green',
  },
  rich: {
    b: 'deep cobalt / vivid sky-blue / clear azure',
    v: 'deep violet / rich purple / vivid lavender',
    y: 'bright gold / clear lemon / warm saffron',
    w: 'pure white / bright white / luminous white',
    o: 'vivid tangerine / warm amber / bright orange',
    p: 'hot pink / deep rose / vivid magenta',
    r: 'vivid scarlet / deep crimson / clear cherry-red',
    g: 'vivid lime / fresh chartreuse / emerald green',
  },
};
const ROSTER_KEYS = Object.fromEntries(Object.keys(ROSTER).map((n) => [n, keyOfItem(n)]));

const shuffle = (a) =>
  a
    .map((x) => [Math.random(), x])
    .sort((p, q) => p[0] - q[0])
    .map(([, x]) => x);
/** Least-used first, ties shuffled: spreads the pool across the roster instead of favourites. */
const byUsage = (names, usage) =>
  shuffle(names).sort((m, n) => (usage[ROSTER_KEYS[m]] || 0) - (usage[ROSTER_KEYS[n]] || 0));

/**
 * Choose the flowers for one slot: 5 or 6 species, 2-3 in the family hue (multi: one per hue), the rest companions
 * in suiting hues, every species under the cap, and no more than 2 shared with ANY line-up already in the pool.
 */
function assignSpecies(slot, lineups, usage) {
  const n = 5 + (Math.random() < 0.4 ? 1 : 0);
  const okWith = (keys) => lineups.every((L) => L.filter((k) => keys.includes(k)).length <= 2);
  const underCap = (name) => (usage[ROSTER_KEYS[name]] || 0) < SPECIES_CAP;
  for (let attempt = 0; attempt < 60; attempt++) {
    const picks = [];
    const keys = [];
    const tryAdd = (name, hue) => {
      const k = ROSTER_KEYS[name];
      if (keys.includes(k) || !underCap(name)) return false;
      if (!okWith([...keys, k])) return false;
      picks.push({ name, hue });
      keys.push(k);
      return true;
    };
    if (slot.family === 'multi') {
      for (const h of shuffle(Object.keys(HUE)).slice(0, n)) {
        for (const name of byUsage(
          Object.keys(ROSTER).filter((m) => ROSTER[m].includes(h)),
          usage
        )) {
          if (tryAdd(name, h)) break;
        }
      }
    } else {
      const h = HUE_OF_FAMILY[slot.family];
      const lead = n === 6 ? 3 : 2 + (Math.random() < 0.5 ? 1 : 0);
      for (const name of byUsage(
        Object.keys(ROSTER).filter((m) => ROSTER[m].includes(h)),
        usage
      )) {
        if (picks.length >= lead) break;
        tryAdd(name, h);
      }
      const comps = shuffle(COMPANIONS[slot.family].split(''));
      let ci = 0;
      while (picks.length < n && ci < 40) {
        const ch = comps[ci++ % comps.length];
        for (const name of byUsage(
          Object.keys(ROSTER).filter((m) => ROSTER[m].includes(ch)),
          usage
        )) {
          if (tryAdd(name, ch)) break;
        }
      }
    }
    if (picks.length === n) return { picks, keys };
  }
  return null;
}

function briefFor(batch, examples) {
  return `You write entries for one pool of a flower-art bot. Every entry is a pulled-back enchanted garden scene where five or six different flower species bloom together as the co-hero. Keep EXACTLY this format, one line each:

TITLE WORDS / <FAMILY>-DOMINANT — <colour words> <flower> + <colour words> <flower> + ... blooming together as co-hero in pulled-back enchanted <setting> vignette, <register>, <background clause>

Examples already in the pool (match their shape, length and voice):
${examples.map((e) => '- ' + e).join('\n')}

Rules:
- Each slot below names its flowers and the hue to describe each one in. Use EXACTLY those flowers, all of them and nothing else, in any order, each introduced by its colour words for that hue. Keep the flower names exactly as given, spaces included (write "morning glory", not "morning-glory"), optionally followed by ONE shape word such as spires, clusters, sprays, cups, bells, plumes or globes.
- PASTEL slots use soft pastel colour words and write exactly "soft pastel watercolor register". RICH slots use clear, saturated, natural flower colours, write exactly "rich clear watercolor register", and never use the word pastel. In both, keep each colour word true to that flower: a naturally pale or steel-toned flower stays that way even in a RICH entry (say "clear sky-blue plumbago", never "deep cobalt plumbago").
- The title's tag is "<FAMILY>-DOMINANT" with the slot's family word (for the mixed family, "MULTI-COLOR"); the title's other words name the scene the way the examples do.
- The background clause describes more blooms and sky stepping back behind in crisp sharp layers, in colours that suit the entry.
- The scene is flowers growing outdoors. Mention no insects, no people, no vases, no buildings, no paths, no signs or labels. Describe only what is present; write no negative words.

Slots:
${batch
  .map(
    (s, i) =>
      `${i + 1}. family ${s.family === 'multi' ? 'MULTI-COLOR' : s.family.toUpperCase()}, ${s.rich ? 'RICH' : 'PASTEL'} (colour words like: ${[...new Set(s.picks.map((p) => p.hue))].map((h) => HUE[h] + ' = ' + HUE_WORDS[s.rich ? 'rich' : 'pastel'][h]).join('; ')}), setting "${s.setting}", flowers: ${s.picks.map((p) => `${p.name} (${HUE[p.hue]})`).join(', ')}`
  )
  .join('\n')}

Reply with a JSON array of ${batch.length} strings only.`;
}

async function run() {
  if (EXECUTE) return execute();
  if (!KEY) throw new Error('ANTHROPIC_API_KEY missing');
  fs.mkdirSync(OUT, { recursive: true });
  const { pool, kept, slots } = plan();
  const lens = pool.map((e) => e.length);
  const lenBand = [Math.min(...lens) - 20, Math.max(...lens) + 60];
  const examples = kept.slice(0, 6).map((k) => pool[k]);
  const working = kept.map((k) => pool[k]);
  const lineups = working.map(speciesOf);
  const usage = {};
  lineups.forEach((L) => L.forEach((s) => (usage[s] = (usage[s] || 0) + 1)));
  console.log(
    `pool ${pool.length} | kept originals ${kept.length} | near-copies to rewrite ${slots.length}`
  );

  // Colour sanity of the KEPT originals (flagged for Kevin, never changed here).
  const keptColourFlags = [];
  for (const k of argv.includes('--skip-kept-check') ? [] : kept) {
    try {
      const bad = await realColours(pool[k]);
      if (bad.length) keptColourFlags.push({ index: k + 1, bad });
    } catch (e) {
      keptColourFlags.push({ index: k + 1, bad: [`check failed: ${e.message.slice(0, 80)}`] });
    }
  }

  const LIMIT = Number(flag('--limit') || 0);
  const done = [];
  // --resume <report.json>: keep that run's accepted rewrites and fill only the slots it left unfilled.
  const prior = flag('--resume')
    ? JSON.parse(fs.readFileSync(flag('--resume'), 'utf8')).changes
    : [];
  const priorByIndex = new Map(prior.map((c) => [c.index - 1, c]));
  for (const s of slots) {
    const c = priorByIndex.get(s.index);
    if (!c) continue;
    working.push(c.new);
    lineups.push(speciesOf(c.new));
    speciesOf(c.new).forEach((k) => (usage[k] = (usage[k] || 0) + 1));
    done.push({ ...s, new: c.new, attempts: c.attempts, rejections: [], resumed: true });
  }
  const todo = slots.filter((s) => !priorByIndex.has(s.index));
  const pending = (LIMIT ? todo.slice(0, LIMIT) : todo).map((s) => ({
    ...s,
    attempts: 0,
    rejections: [],
  }));
  // --judge-advisory: the same-idea reader's opinion is recorded on the change, not used to reject it.
  const JUDGE_ADVISORY = argv.includes('--judge-advisory');
  const BATCH = 6;
  // Reserve the assigned species while a slot is in flight so two slots never plan the same line-up.
  const reserve = (s) => s.keys.forEach((k) => (usage[k] = (usage[k] || 0) + 1));
  const release = (s) => s.keys.forEach((k) => (usage[k] = Math.max(0, (usage[k] || 0) - 1)));
  while (pending.length) {
    const batch = pending.splice(0, BATCH);
    for (const s of batch) {
      if (!s.picks || s.reassign) {
        const a = assignSpecies(s, lineups, usage);
        if (!a) {
          s.rejections.push({
            cand: null,
            problems: ['no line-up satisfies the caps + overlap rule'],
          });
          done.push({ ...s, new: null });
          continue;
        }
        s.picks = a.picks;
        s.keys = a.keys;
        s.reassign = false;
        s.textAttempts = 0;
        reserve(s);
        lineups.push(s.keys);
      }
    }
    const live = batch.filter((s) => s.picks && !done.includes(s));
    if (!live.length) continue;
    let out;
    try {
      out = jsonOf(await claude(SONNET, briefFor(live, examples), 6000));
    } catch (e) {
      console.log(`  batch parse failed (${e.message.slice(0, 80)}); retrying these slots`);
      live.forEach((s) => (s.attempts += 1));
      pending.unshift(...live.filter((s) => s.attempts < 8));
      continue;
    }
    for (let i = 0; i < live.length; i++) {
      const s = live[i];
      const cand = String(out[i] || '').trim();
      s.attempts++;
      s.textAttempts++;
      // Overlap is guaranteed by the assignment, so compare against the pool WITHOUT this slot's own line-up.
      const others = working;
      let problems = mechanicalProblems(cand, s, others, {}, lenBand);
      const got = speciesOf(cand);
      const missing = s.keys.filter((k) => !got.includes(k));
      const extra = got.filter((k) => !s.keys.includes(k));
      if (missing.length || extra.length)
        problems.push(
          `flowers differ from the assignment (missing ${missing.join(',') || '-'}; extra ${extra.join(',') || '-'})`
        );
      try {
        if (!problems.length) {
          const bad = await realColours(cand);
          if (bad.length) problems.push(`colour not real: ${bad.join('; ')}`);
        }
        if (!problems.length) {
          const dups = await sameIdea(cand, working);
          if (dups.length) {
            const note = `same idea as: ${dups.map((d) => (working[d - 1] || '?').slice(0, 50)).join(' | ')}`;
            if (JUDGE_ADVISORY) s.judgeNote = note;
            else problems.push(note);
          }
        }
      } catch (e) {
        problems.push(`check failed: ${e.message.slice(0, 80)}`);
      }
      if (problems.length) {
        console.log(
          `  ✗ #${s.index + 1} ${s.family}${s.rich ? ' rich' : ''}: ${problems.join(' ; ').slice(0, 300)}`
        );
        if (process.env.FFC_SHOW_CAND) console.log(`      ${cand.slice(0, 400)}`);
        s.rejections.push({ cand, problems });
        if (s.textAttempts >= 3) {
          // The words keep failing for this line-up: give the slot a fresh line-up.
          release(s);
          lineups.splice(lineups.indexOf(s.keys), 1);
          s.reassign = true;
        }
        if (s.attempts < 8) pending.push(s);
        else {
          if (!s.reassign) {
            release(s);
            lineups.splice(lineups.indexOf(s.keys), 1);
          }
          done.push({ ...s, new: null });
        }
        continue;
      }
      working.push(cand);
      done.push({ ...s, new: cand });
      process.stdout.write(`  ✓ #${s.index + 1} ${s.family}${s.rich ? ' rich' : ''}\n`);
    }
  }

  // Assemble the proposal in the original order.
  const proposal = pool.slice();
  for (const d of done) if (d.new) proposal[d.index] = d.new;
  const unfilled = done.filter((d) => !d.new);
  fs.writeFileSync(path.join(OUT, 'proposal.json'), JSON.stringify(proposal, null, 2) + '\n');

  const measure = (p) => {
    const sets = p.map(speciesOf);
    let maxShared = 0;
    let lu = 0;
    const keptIdx = [];
    sets.forEach((st, i) => {
      if (!keptIdx.some((k) => sets[k].filter((x) => st.includes(x)).length >= 4)) {
        keptIdx.push(i);
        lu++;
      }
      for (let j = 0; j < i; j++)
        maxShared = Math.max(maxShared, sets[j].filter((x) => st.includes(x)).length);
    });
    const fam = {};
    p.forEach((e) => (fam[familyOf(e)] = (fam[familyOf(e)] || 0) + 1));
    return {
      entries: p.length,
      lineups: lu,
      species: new Set(sets.flat()).size,
      daisies: p.filter((e) => speciesOf(e).includes('daisy')).length,
      rich: p.filter(isRich).length,
      maxSharedAnyPair: maxShared,
      families: fam,
    };
  };
  const report = {
    basis:
      'line-up = a set of flower species; two entries are the same line-up when they share 4+ species (greedy, pool order)',
    before: measure(pool),
    after: measure(proposal),
    rewritten: done.filter((d) => d.new).length,
    unfilled: unfilled.map((u) => ({
      index: u.index + 1,
      family: u.family,
      rejections: u.rejections,
    })),
    keptColourFlags,
    changes: done
      .filter((d) => d.new)
      .sort((a, b) => a.index - b.index)
      .map((d) => ({
        index: d.index + 1,
        family: d.family,
        rich: d.rich,
        old: d.old,
        new: d.new,
        attempts: d.attempts,
        ...(d.judgeNote ? { judgeNote: d.judgeNote } : {}),
      })),
  };
  fs.writeFileSync(path.join(OUT, 'report.json'), JSON.stringify(report, null, 2) + '\n');
  console.log(JSON.stringify({ before: report.before, after: report.after }, null, 1));
  console.log(
    `rewritten ${report.rewritten}/${slots.length}, unfilled ${unfilled.length}, kept originals with a colour flag ${keptColourFlags.length}`
  );
  console.log(`proposal + report written to ${OUT} (the pool file is unchanged)`);
}

function execute() {
  if (!FROM)
    throw new Error('--execute needs --from <proposal.json> (the reviewed dry-run output)');
  const before = JSON.parse(fs.readFileSync(POOL, 'utf8'));
  const proposal = JSON.parse(fs.readFileSync(FROM, 'utf8'));
  if (!Array.isArray(proposal) || proposal.length !== before.length) {
    throw new Error(`proposal has ${proposal.length} entries, pool has ${before.length}; refusing`);
  }
  // Unchanged entries must be byte-identical originals; changed ones must pass the strict new-entry format.
  const bad = proposal.filter(
    (e, i) => e !== before[i] && (typeof e !== 'string' || !FORMAT_RE.test(e))
  );
  if (bad.length) throw new Error(`${bad.length} changed entries fail the format check; refusing`);
  const backup = path.join(
    os.homedir(),
    `poolbackup-bloombot-flower_focal_cluster-${Date.now()}.json`
  );
  fs.copyFileSync(POOL, backup);
  fs.writeFileSync(POOL, JSON.stringify(proposal, null, 2) + '\n');
  const check = JSON.parse(fs.readFileSync(POOL, 'utf8'));
  if (check.length !== before.length) throw new Error('count changed after write');
  console.log(`backed up to ${backup}; wrote ${check.length} entries to ${POOL}`);
}

module.exports = { plan, speciesOf, flowerItems, familyOf, isRich, FORMAT_RE };

if (require.main === module) {
  run().catch((e) => {
    console.error(e);
    process.exit(1);
  });
}
