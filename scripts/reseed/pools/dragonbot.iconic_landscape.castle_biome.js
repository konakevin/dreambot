/* global __dirname */
/**
 * dragonbot / iconic-landscape / castle_biome — the lush Western-high-fantasy landscape around the
 * castle (the castle itself is another axis and is never named here).
 * Recipe: scripts/gen-seeds/dragonbot/gen-castle-biome.js (30-55 words; Tolkien-edition / Witcher-3 /
 * Skyrim-meadow / Shire fairytale-paradise register; 2-3 tactile foreground elements; STRICT Western
 * high fantasy: no Mediterranean olives / citron / oleander, no date palms or oases, no bamboo / cherry
 * blossom / jacaranda / magnolia / bougainvillea / lotus, no rice terraces or tea, no desert / mesa /
 * cacti, no real-world ethnic period codes; pure biome, no castle). Pool 2026-09-23: 168 entries,
 * "Vast emerald mountain valley…" ×8, "Vast pastoral valley…" ×7, "Rolling Shire-style green
 * hillscape…" ×7 … Same idea = biome type + its first hero feature.
 */
const path = require('path');
const { shuffle, byUsage } = require('../lib/core');

const poolFile = path.join(__dirname, '../../bots/dragonbot/seeds/castle_biome.json');

const BIOMES = {
  'mountain valley': { weight: 4, words: 'vast emerald mountain valley' },
  'alpine meadow': { weight: 3, words: 'verdant alpine meadow under snow peaks' },
  'hidden glade': { weight: 2, words: 'hidden mountain glade of moss-draped ancient cedars' },
  'high meadow': { weight: 2, words: 'emerald high-meadow' },
  'fen valley': { weight: 2, words: 'misty fen valley of reed-marsh and ancient willows' },
  'shire hills': { weight: 3, words: 'rolling Shire-style green hills' },
  'orchard valley': { weight: 2, words: 'pastoral valley of blossoming apple orchards' },
  'wheat valley': { weight: 2, words: 'bucolic farmland valley of golden wheat' },
  'northern pines': { weight: 3, words: 'vast Northern pine-forest' },
  'snow meadow': { weight: 2, words: 'snow-covered alpine meadow of white birches' },
  'tundra meadow': { weight: 2, words: 'tundra-meadow of frost-flowers and standing stones' },
  'sea cliffs': { weight: 3, words: 'dramatic verdant sea-cliffs above crashing surf' },
  'coastal headland': { weight: 2, words: 'emerald coastal headland of wildflower meadows' },
  'sea-stack moor': { weight: 1, words: 'weathered sea-stack cliffs topped with heather and gorse' },
  'silver-birch grove': { weight: 3, words: 'Lothlorien-style silver-birch grove of golden leaves' },
  'waterfall valley': { weight: 3, words: 'Rivendell-style waterfall valley' },
  'elven moss grove': { weight: 2, words: 'ancient elven moss-grove' },
  'wildflower prairie': { weight: 2, words: 'endless wildflower prairie' },
  'summer meadow': { weight: 2, words: 'rolling wildflower meadow in full summer bloom' },
  'barrow prairie': { weight: 1, words: 'high prairie of ancient barrows and stone circles' },
  'bioluminescent valley': { weight: 2, words: 'bioluminescent primeval valley at twilight' },
  'floating valley': { weight: 1, words: 'floating elven valley of mallorn-trees on mist-clouds' },
  'cascade valley': { weight: 2, words: 'mountain-cascade valley of terraced waterfalls' },
  'mirror lake': { weight: 2, words: 'still mirror-lake at the foot of an emerald valley' },
  'oak-island lake': { weight: 1, words: 'vast lake of ancient oaks on islands' },
  'highland moor': { weight: 2, words: 'highland moor of heather and mist' },
  'yew forest': { weight: 1, words: 'ancient yew forest' },
  'cedar forest': { weight: 1, words: 'cedar forest of red giants' },
  'river gorge': { weight: 1, words: 'river gorge of rapids between mossy walls' },
  'glacial cirque': { weight: 1, words: 'glacial cirque with a turquoise tarn' },
  'autumn beech wood': { weight: 2, words: 'autumn beech wood in copper and gold' },
  'chalk downs': { weight: 1, words: 'rolling chalk downs of wild thyme and orchids' },
  'larch valley': { weight: 1, words: 'golden larch valley in autumn' },
  'willow bog': { weight: 1, words: 'willow bog of dark pools and cotton-grass' },
  'rose valley': { weight: 1, words: 'valley of wild-rose banks and lavender fields' },
  'hanging-garden cliffs': { weight: 1, words: 'cliffs of hanging gardens and cascading vines' },
};
const HEROES = [
  'wildflower meadow',
  'blossom grove',
  'fruit orchard',
  'mirror lake',
  'ancient oaks',
  'waterfall',
  'lavender field',
  'rose garden',
  'hanging gardens',
  'silver creek',
  'mossy boulders',
  'standing stones',
  'fern carpet',
  'heather',
  'bluebells',
  'poppies',
  'white birches',
  'weeping willows',
  'reed beds',
  'gnarled cypresses',
  'stone arches',
  'ivy-claimed boulders',
  'water-lilies',
  'wild daisies',
  'foxgloves',
  'luminous fungi',
  'frost-flowers',
  'apple blossom',
  'golden mallorn leaves',
  'mist-streamers',
];
const SKYS = [
  'painted-gold afternoon light',
  'dawn-gold horizon',
  'golden-hour mist drifting',
  'sun-shafts piercing the canopy',
  'painted-gold sunset',
  'aurora rippling overhead',
  'blue-hour twilight',
  'morning mist lifting',
];

const BIOME_RULES = [
  ['bioluminescent valley', /bioluminescent|glowing star-moss|luminous vines/i],
  ['floating valley', /floating/i],
  ['hanging-garden cliffs', /hanging[- ]garden/i],
  ['silver-birch grove', /silver-birch|silver birch|mallorn|lothlorien|lothl[oó]rien/i],
  ['waterfall valley', /rivendell|waterfall-valley|waterfall valley/i],
  ['elven moss grove', /elven moss|moss-grove|moss grove/i],
  ['cascade valley', /cascade valley|terraced waterfalls|mountain-cascade/i],
  ['tundra meadow', /tundra/i],
  ['snow meadow', /snow-covered|snowy meadow|snow meadow|snow-dusted meadow/i],
  ['northern pines', /pine-forest|pine forest|evergreens/i],
  ['sea-stack moor', /sea-stack|sea stack/i],
  ['sea cliffs', /sea-cliff|sea cliff|crashing surf|crashing waves/i],
  ['coastal headland', /headland|coastal/i],
  ['orchard valley', /orchard/i],
  ['wheat valley', /wheat|farmland/i],
  ['shire hills', /shire|green hills|hillscape/i],
  ['fen valley', /\bfen\b|marsh|velen/i],
  ['willow bog', /\bbog\b/i],
  ['barrow prairie', /barrow|stone circle|stone-circle/i],
  ['wildflower prairie', /wildflower prairie|endless prairie|prairie of wildflowers/i],
  ['summer meadow', /wildflower-meadow in|summer bloom|rolling wildflower meadow/i],
  ['mirror lake', /mirror-lake|mirror lake|still lake/i],
  ['oak-island lake', /oaks? on (?:its )?islands|island oaks|oak-island|oak island|island-studded lake|lake of ancient oaks|lake reflecting/i],
  ['glacial cirque', /cirque|tarn/i],
  ['river gorge', /gorge|rapids/i],
  ['highland moor', /moor/i],
  ['yew forest', /\byew/i],
  ['cedar forest', /cedar forest|cedars/i],
  ['autumn beech wood', /beech/i],
  ['larch valley', /larch/i],
  ['chalk downs', /chalk|downs/i],
  ['rose valley', /rose valley|valley of wild-rose|wild-rose banks and lavender/i],
  ['hidden glade', /glade/i],
  ['high meadow', /high-meadow|high meadow/i],
  ['alpine meadow', /alpine/i],
  ['mountain valley', /mountain valley|mountain-valley/i],
];
const HERO_RULES = HEROES.map((h) => [h, new RegExp(h.replace(/[- ]/g, '[- ]').replace(/s$/, 's?'), 'i')]);
const pick = (rules, text, fallback) => {
  for (const [k, re] of rules) if (re.test(text)) return k;
  return fallback;
};
const stem = (w) => w.toLowerCase().replace(/s$/, '');
const wordsOf = (s) => s.split(/[- ]/).filter((w) => w.length >= 4).map(stem);
const shares = (a, b) => wordsOf(a).some((x) => wordsOf(b).some((y) => x.startsWith(y) || y.startsWith(x)));
// A hero is OWNED by a biome when it is named in the biome's key OR in the biome's own words (heather on
// the highland moor, terraced waterfalls in the cascade valley, frost-flowers on the tundra meadow): it is
// never assigned there and never parsed as that entry's hero. The first full run (2026-09-24) used the key
// only, so every moor entry parsed hero=heather and half the batch was rejected as "differs".
const overlaps = (biome, hero) =>
  shares(biome, hero) || (BIOMES[biome] ? shares(BIOMES[biome].words, hero) : false);
// generic words: only when no specific rule matched anywhere
const BIOME_FALLBACK = [
  ['wildflower prairie', /prairie/i],
  ['mountain valley', /valley/i],
];
function heroSpans(text) {
  const spans = [];
  for (const [h, re] of HERO_RULES) {
    const m = text.match(re);
    if (m) spans.push({ h, a: m.index, b: m.index + m[0].length });
  }
  return spans;
}
// The biome is written FIRST, so the earliest specific match wins (not rule order: "hidden mountain glade
// of ancient cedars" is the glade, not the cedar forest). A match that sits inside a hero phrase the biome
// does not own ("mallorn" in "golden mallorn leaves", "orchard" in "fruit orchard") is the hero, skipped.
function pickBiome(text) {
  const spans = heroSpans(text);
  let best = null;
  let at = Infinity;
  for (const [k, re] of BIOME_RULES) {
    const g = new RegExp(re.source, 'gi');
    let m;
    while ((m = g.exec(text))) {
      if (!m[0]) {
        g.lastIndex++;
        continue;
      }
      const i = m.index;
      if (spans.some((s) => i >= s.a && i < s.b && !shares(k, s.h))) continue;
      if (i < at) {
        at = i;
        best = k;
      }
      break;
    }
  }
  if (best) return best;
  for (const [k, re] of BIOME_FALLBACK) if (re.test(text)) return k;
  return 'landscape';
}
function firstHero(text, biome) {
  let best = null;
  let at = Infinity;
  for (const [h, re] of HERO_RULES) {
    if (overlaps(biome, h)) continue;
    const m = text.match(re);
    if (m && m.index < at) {
      at = m.index;
      best = h;
    }
  }
  return best || 'feature';
}
function parse(text) {
  const biome = pickBiome(text);
  const hero = firstHero(text, biome);
  return { keys: [`biome:${biome}`, `hero:${hero}`], biome, hero };
}
const sameGroup = (a, b) => a.biome === b.biome && a.hero === b.hero;
function planSlots({ slots }) {
  slots.forEach((s) => (s.tags = ['biome']));
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
    const biome = among(
      shuffle(Object.keys(BIOMES)).sort(
        (x, y) => (usage['biome:' + x] || 0) / BIOMES[x].weight - (usage['biome:' + y] || 0) / BIOMES[y].weight
      ),
      4
    );
    const hero = among(
      byUsage(HEROES.filter((h) => !overlaps(biome, h)), usage, (k) => 'hero:' + k),
      5
    );
    if (/luminous fungi|mist-streamers/.test(hero) && !/bioluminescent|elven|glade|fen|waterfall/.test(biome)) continue;
    if (/frost-flowers/.test(hero) && !/snow|tundra|northern/.test(biome)) continue;
    if (/water-lilies|reed beds/.test(hero) && !/lake|fen|bog|valley|gorge/.test(biome)) continue;
    const cand = { biome, hero };
    if (groups.some((g) => sameGroup(g.assignment ? g.assignment : g, cand))) continue;
    const second = spread(HEROES.filter((h) => h !== hero && !overlaps(biome, h)));
    return {
      keys: [`biome:${biome}`, `hero:${hero}`],
      biome,
      hero,
      second,
      words: BIOMES[biome].words,
      sky: spread(SKYS),
      tags: [biome, hero],
    };
  }
  return null;
}
function brief(batch, examples) {
  return `You write entries for one pool of a painted high-fantasy bot: DragonBot's castle path, the LANDSCAPE BIOME around the castle (the castle itself is another axis and is never mentioned). Every entry is ONE lush, colourful, life-filled Western-high-fantasy landscape in 30-55 words, one line, comma-separated phrases: the biome, then two or three tactile foreground features (the first one given FIRST), the wider land, then the painted light. Tolkien-illustrated-edition / Witcher-3 establishing shot / Shire fairytale-paradise register. Keep EXACTLY the shape of the examples.

Examples already in the pool (match their voice and length):
${examples.map((e) => '- ' + e).join('\n')}

Rules:
- Use EXACTLY the biome, the two features (first one first) and the light given for the slot, in your own natural wording, naming the features' own nouns.
- STRICT Western high fantasy: oaks, birches, cedars, pines, yews, heather, poppies, bluebells, daisies, lavender, wild roses, apple orchards, wheat, mist, snow, aurora, mallorn and elven groves. Real-world Europe of fairy tales, never elsewhere.
- Name no castle, keep, tower or fortress; no people; no Mediterranean, Asian, desert or tropical plants (no olives, citron, oleander, palms, bamboo, cherry blossom, jacaranda, magnolia, bougainvillea, lotus, rice, tea, cacti, mesas). Describe only what is present; write no negative words.

Slots:
${batch
  .map((s, i) => {
    const a = s.assignment;
    return `${i + 1}. biome "${a.words}"; features "${a.hero}" then "${a.second}"; light "${a.sky}"`;
  })
  .join('\n')}

Reply with a JSON array of ${batch.length} strings only.`;
}
const formatRe = /^[A-Z].{120,}$/;
const BANS = [
  ['castle', /\b(castle|keep|fortress|tower|towers|citadel|walls|battlements|palace)\b/i],
  ['off-world', /\b(olive|olives|citron|oleander|palm|palms|oasis|bamboo|cherry[- ]blossom|sakura|jacaranda|magnolia|bougainvillea|lotus|rice|tea[- ]field|cactus|cacti|mesa|desert|jungle|savanna|baobab)\b/i],
  ['ethnic', /\b(japanese|chinese|moorish|arabian|persian|aztec|mayan|egyptian|greek|roman|viking|celtic|tuscan|provence|alps)\b/i],
  ['people', /\b(villagers|farmers|knights|riders|people|figure|figures|hero|heroine)\b/i],
  ['negation', /\b(no|not|never|without|nothing)\b/i],
];
function mechanical(cand, slot) {
  const p = [];
  const a = slot.assignment;
  const parsed = parse(cand);
  if (parsed.biome !== a.biome) p.push(`biome ${parsed.biome}≠${a.biome}`);
  if (!HERO_RULES.find(([h]) => h === a.hero)[1].test(cand)) p.push(`feature missing (${a.hero})`);
  const words = cand.split(/\s+/).length;
  if (words < 26 || words > 62) p.push(`${words} words`);
  for (const [n, re] of BANS) {
    const m = cand.match(re);
    // a banned word that the assigned biome's own description uses is the biome, not a castle
    // ("rapids between mossy walls" is the river gorge; every gorge entry was rejected on "walls")
    if (m && new RegExp(`\\b${m[0]}\\b`, 'i').test(BIOMES[a.biome] ? BIOMES[a.biome].words : '')) continue;
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
  return { biome: t('biome'), hero: t('hero') };
}

module.exports = {
  name: 'dragonbot/iconic_landscape/castle_biome',
  poolFile,
  basis: 'landscape = biome type + first hero feature; same when both match; greedy, pool order (second feature and light are flavour)',
  parse,
  sameGroup,
  planSlots,
  assign,
  brief,
  formatRe,
  mechanical,
  measure,
  batchSize: 6,
  lenBand: [180, 480],
};
