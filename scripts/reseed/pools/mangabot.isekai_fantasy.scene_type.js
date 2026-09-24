/* global __dirname */
/**
 * mangabot / isekai-fantasy / scene_type — ONE anime-isekai composition concept per entry.
 * Recipe: scripts/gen-seeds/mangabot/gen-isekai-scene-type.js (14-28 words; "<Category> composition,
 * <the scene>, <energy / canon reference>"; eleven categories with a distribution; strict anime isekai
 * canon: SAO / Re:Zero / Konosuba / Overlord / Frieren / Mushoku Tensei / Slime / Restaurant of Another
 * World / Log Horizon; never Western photoreal medieval, never gritty desaturated). Pool 2026-09-23:
 * 200 entries, the five biggest categories ×17-31 each with the same few motifs. Same idea =
 * category + scene motif.
 */
const path = require('path');
const { shuffle, byUsage } = require('../lib/core');

const poolFile = path.join(__dirname, '../../bots/mangabot/seeds/isekai_scene_type.json');

// categories (recipe weights) and the scene motifs each really carries in the canon
const CATS = {
  'adventurer party': {
    weight: 16,
    opener: 'Adventurer party mid-quest composition',
    motifs: ['forest road', 'mountain pass', 'ancient ruins', 'rope bridge over a gorge', 'river ford', 'floating-island path', 'dungeon entrance', 'crystal cave', 'giant tree roots', 'coastal cliff path', 'snowfield', 'lantern-lit market street', 'wheat fields', 'overgrown temple steps', 'airship deck', 'canyon switchbacks', 'misty lake shore', 'stone causeway'],
  },
  'magic cast': {
    weight: 14,
    opener: 'Magic-cast moment composition',
    motifs: ['rune-circle beneath her palm', 'fire spiral', 'ice-crystal barrier', 'healing light', 'summoning circle', 'lightning conjuration', 'floating grimoire', 'mana status-window', 'wind blade', 'barrier dome', 'glowing staff', 'water dragon spell', 'gravity magic with floating debris', 'teleport glyph', 'light arrows', 'shadow tendrils', 'earth-wall spell', 'star-shower spell'],
  },
  'monster encounter': {
    weight: 12,
    opener: 'Monster encounter composition',
    motifs: ['smiling blue slime', 'forest wolf pack', 'baby dragon', 'mushroom golem', 'goblin scouts', 'stone golem', 'wyvern overhead', 'giant spider web', 'ghost knight', 'carbuncle', 'treant', 'orc warband', 'sand worm', 'harpy', 'mimic chest', 'giant frog', 'skeleton soldiers', 'fairy swarm'],
  },
  'cozy isekai': {
    weight: 11,
    opener: 'Cozy isekai composition',
    motifs: ['tavern table with steaming food', 'bathhouse steam', 'market street-food stall', 'cottage kitchen', 'item-shop counter', 'hot-spring inn', 'bakery window', 'guild cafeteria', 'campfire stew', 'magic-lantern shop', 'apothecary shelves', 'farm morning', 'festival lanterns', 'snowed-in inn', 'teahouse terrace', 'library reading nook', 'blacksmith forge', 'flower-shop counter', 'inn common room', 'noodle stall at night', 'fishing dock lunch', 'orchard picnic', 'potion-shop back room', 'candle-lit bookshop', 'harvest festival table', 'riverside laundry morning', 'beast-stable morning', 'dessert cafe window', 'bathhouse rooftop', 'fireplace cocoa', 'moving-house wagon', 'street fireworks'],
  },
  'mid-combat': {
    weight: 10,
    opener: 'Mid-combat anime composition',
    motifs: ['sword slash', 'dual blades', 'spear thrust', 'arrow volley', 'shield bash', 'spell clash', 'boss fight in ruins', 'aerial duel', 'giant weapon swing', 'awakening blade', 'dodge under claws', 'arena duel', 'rapier lunge', 'scythe sweep', 'gauntlet punch', 'chain-whip arc'],
  },
  'modern protagonist': {
    weight: 9,
    opener: 'Modern protagonist composition',
    motifs: ['school uniform in a fantasy meadow', 'at a fantasy city gate', 'reading a floating status screen', 'sneakers on cobblestone', 'blazer at the guild board', 'first look at a magic shop', 'on a wyvern saddle', 'in a spellbook library', 'at a fantasy train station', 'holding a glowing map', 'waking in a fantasy field', 'meeting a knight escort'],
  },
  'floating island': {
    weight: 8,
    opener: 'Floating-island vista composition',
    motifs: ['sky castle', 'islands with waterfalls', 'chained islands', 'floating city', 'sky temple', 'cloud sea', 'airship fleet', 'crystal spire island', 'island bridges', 'sunset islands'],
  },
  'guild hall': {
    weight: 7,
    opener: 'Guild hall composition',
    motifs: ['reception desk', 'quest board', 'tavern side', 'trophy wall', 'ranking board', 'party registration', "guild master's balcony", 'reward counter', 'notice-board crowd', 'guild stairs'],
  },
  'magic academy': {
    weight: 6,
    opener: 'Magic academy composition',
    motifs: ['classroom spell practice', 'library of floating books', 'dueling grounds', 'dormitory tower', 'alchemy lab', 'astronomy tower', 'greenhouse of magic plants', 'entrance ceremony hall', 'training courtyard'],
  },
  'demon lord': {
    weight: 5,
    opener: 'Demon-lord composition',
    motifs: ['dark throne', 'obsidian citadel balcony', 'floating magic-circle', 'army review', 'lava hall', 'crystal cocoon', 'mirror hall', 'skull-flag rampart'],
  },
  portal: {
    weight: 2,
    opener: 'Portal opening composition',
    motifs: ['summon circle on cobblestone', 'dimensional gate in a park', 'rift in a classroom', 'glowing archway in ruins', 'mirror portal', 'well portal', 'forest shrine gate'],
  },
};
const CANON = [
  'Frieren-style painterly calm',
  'Konosuba-coded comedic energy',
  'SAO-style keyframe',
  'Re:Zero-coded tension',
  'Mushoku Tensei painterly fantasy',
  'Slime-coded warmth',
  'Restaurant-of-Another-World register',
  'Log Horizon-coded strategy energy',
  'Overlord-coded gravitas',
  'cel-shaded party-banter energy',
];
const CAT_RULES = [
  ['adventurer party', /adventurer party|party mid-quest/i],
  ['magic cast', /magic-cast|magic cast|spell-cast moment/i],
  ['monster encounter', /monster encounter/i],
  ['cozy isekai', /cozy isekai|slow-life/i],
  ['mid-combat', /mid-combat|combat anime/i],
  ['modern protagonist', /modern protagonist/i],
  ['floating island', /floating-island|floating island/i],
  ['guild hall', /guild hall|guild-hall/i],
  ['magic academy', /magic academy|magic-academy/i],
  ['demon lord', /demon-lord|demon lord|overlord moment/i],
  ['portal', /portal/i],
];
const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const MOTIF_RULES = [];
for (const [cat, c] of Object.entries(CATS))
  for (const m of c.motifs) {
    // the motif's two most distinctive words, either order, hyphen or space
    // words every entry of the category says anyway (school uniform, magic, anime) never decide a motif
    const words = m.split(/[\s-]+/).filter((w) => w.length >= 4 && !/^(with|over|under|beneath|from|into|the|of|at|on|in|her|his|a|an|school|uniform|fantasy|anime|magic|floating|first)$/i.test(w));
    const key = words.slice(0, 2).map((w) => `(?=[\\s\\S]*\\b${esc(w).replace(/s$/, 's?')})`).join('');
    MOTIF_RULES.push([cat, m, new RegExp(key, 'i')]);
  }
const pick = (rules, text, fallback) => {
  for (const [k, re] of rules) if (re.test(text)) return k;
  return fallback;
};
function parse(text) {
  const cat = pick(CAT_RULES, text.split(',')[0], pick(CAT_RULES, text, 'scene'));
  let motif = null;
  let at = Infinity;
  for (const [c, m, re] of MOTIF_RULES) {
    if (c !== cat) continue;
    const hit = text.match(re);
    if (hit && hit.index < at) {
      at = hit.index;
      motif = m;
    }
  }
  if (!motif) {
    // an unknown motif keeps its own words (never a shared "other" bucket)
    const body = text.split(',').slice(1, 2).join('').toLowerCase().replace(/[^a-z\s-]/g, '').split(/\s+/).filter((w) => w.length >= 4);
    motif = 'own:' + body.slice(0, 3).join(' ');
  }
  return { keys: [`cat:${cat}`, `motif:${motif}`], cat, motif };
}
const sameGroup = (a, b) => a.cat === b.cat && a.motif === b.motif;
function planSlots({ slots }) {
  slots.forEach((s) => (s.tags = ['scene']));
}
const flavourUse = {};
const spread = (list) => {
  const c = byUsage(list, flavourUse)[0];
  flavourUse[c] = (flavourUse[c] || 0) + 1;
  return c;
};
function assign(slot, ctx) {
  const { usage, groups } = ctx;
  const among = (list, k) => list[Math.floor(Math.random() * Math.min(k, list.length))];
  for (let attempt = 0; attempt < 400; attempt++) {
    const cat = among(
      shuffle(Object.keys(CATS)).sort(
        (x, y) => (usage['cat:' + x] || 0) / CATS[x].weight - (usage['cat:' + y] || 0) / CATS[y].weight
      ),
      3
    );
    const motif = among(
      byUsage(CATS[cat].motifs, usage, (k) => 'motif:' + k),
      4
    );
    const cand = { cat, motif };
    if (groups.some((g) => sameGroup(g.assignment ? g.assignment : g, cand))) continue;
    return {
      keys: [`cat:${cat}`, `motif:${motif}`],
      cat,
      motif,
      opener: CATS[cat].opener,
      canon: spread(CANON),
      tags: [cat, motif],
    };
  }
  return null;
}
function brief(batch, examples) {
  return `You write entries for one pool of an anime bot: MangaBot isekai-fantasy, the SCENE-TYPE axis. Every entry is ONE anime-isekai composition concept in 14-28 words, one line, comma-separated phrases: the category opener, then the scene motif with 1-2 concrete anime-keyframe details, then an energy or canon note. Strict anime isekai canon (Sword Art Online / Re:Zero / Konosuba / Overlord / Frieren / Mushoku Tensei / Slime / Restaurant of Another World / Log Horizon). Keep EXACTLY the shape of the examples.

Examples already in the pool (match their voice and length):
${examples.map((e) => '- ' + e).join('\n')}

Rules:
- Open with EXACTLY the category opener given, then EXACTLY the scene motif given (its own nouns, in your own natural wording), then the energy note given. The motif given is the ONLY scene motif in the entry: add none of the other canon motifs (no second rune-circle, status-window, cloud sea, island waterfall, quest board or slime unless it IS the motif given).
- Painterly cel-shaded anime keyframe; mana-glow, status-windows and rune-circles are canon. One composition per entry.
- Never Western photoreal medieval (no Witcher / Skyrim / D&D / Game of Thrones), never gritty or desaturated, never generic fantasy. Describe only what is present; write no negative words.

Slots:
${batch
  .map((s, i) => {
    const a = s.assignment;
    return `${i + 1}. opener "${a.opener}"; motif "${a.motif}"; energy "${a.canon}"`;
  })
  .join('\n')}

Reply with a JSON array of ${batch.length} strings only.`;
}
const formatRe = /^[A-Z][^,]{8,60} composition, .{40,}$/;
const BANS = [
  ['western', /\b(witcher|skyrim|d&d|dungeons and dragons|game of thrones|got\b|photoreal|photorealistic|gritty|desaturated|grimdark)\b/i],
  ['negation', /\b(no|not|never|without|nothing)\b/i],
];
function mechanical(cand, slot) {
  const p = [];
  const a = slot.assignment;
  const parsed = parse(cand);
  if (parsed.cat !== a.cat) p.push(`category ${parsed.cat}≠${a.cat}`);
  if (parsed.motif !== a.motif) p.push(`motif ${parsed.motif}≠${a.motif}`);
  if (!cand.startsWith(a.opener.split(' ')[0])) p.push('opener changed');
  const words = cand.split(/\s+/).length;
  if (words < 12 || words > 32) p.push(`${words} words`);
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
  return { cat: t('cat'), motifs: Object.keys(t('motif')).length };
}

module.exports = {
  name: 'mangabot/isekai_fantasy/scene_type',
  poolFile,
  basis: 'scene = category + scene motif; same when both match; greedy, pool order (the energy note is flavour)',
  parse,
  sameGroup,
  planSlots,
  assign,
  brief,
  formatRe,
  mechanical,
  measure,
  batchSize: 8,
  lenBand: [90, 260],
};
