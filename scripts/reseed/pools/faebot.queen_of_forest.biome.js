/* global __dirname */
/**
 * faebot / queen-of-the-forest / forest_biome — the type of enchanted forest wrapping her scene.
 * Recipe: scripts/gen-faebot-pool.js `faebot_queen_of_forest_biome` (ONE specific biome type + 2
 * signature textures + multi-tier painted depth, 25-45 words; no court / throne / chandeliers, no
 * queen / critters / fae, no lighting / weather, no mushroom-as-throne). Pool 2026-09-23: 200 entries
 * over 8 recipe categories ("Pale birch glade…" ×26, "Ancient oak grove…" ×19, "Forest stream-
 * clearing…" ×19 …). Same idea = biome type + its first signature texture.
 */
const path = require('path');
const { shuffle, byUsage } = require('../lib/core');

const poolFile = path.join(__dirname, '../../bots/faebot/seeds/faebot_queen_of_forest_biome.json');

// biome types: the recipe's eight, widened with sister fae-forest types (all still "forest around her")
const BIOMES = {
  'oak grove': { weight: 5, words: 'ancient oak grove of twisted gnarled trunks' },
  'oak cathedral': { weight: 2, words: 'oak-cathedral grove with a vaulted canopy of interlocked branches' },
  'birch glade': { weight: 4, words: 'pale birch glade of slender white-barked trunks' },
  'wisteria arbor': { weight: 4, words: 'wisteria-cascade arbor of violet racemes draping from overhead branches' },
  'waterfall glade': { weight: 3, words: 'small forest waterfall-glade with mossy boulders' },
  'wildflower meadow': { weight: 3, words: 'wildflower meadow opening inside the forest' },
  'autumn grove': { weight: 2, words: 'autumn-grove of golden-amber and crimson trees' },
  'fern grotto': { weight: 2, words: 'hidden fern-grotto under dripping moss walls' },
  'stream clearing': { weight: 2, words: 'forest stream-clearing with clear water winding through' },
  'hero tree': { weight: 1, words: 'hero-tree alcove around one colossal world-tree' },
  'beech cathedral': { weight: 2, words: 'beech cathedral of smooth grey columns' },
  'pine cathedral': { weight: 1, words: 'tall pine cathedral with a needle-carpet floor' },
  'cedar grove': { weight: 1, words: 'cedar grove of red fibrous trunks' },
  'redwood grove': { weight: 1, words: 'redwood grove of colossal russet trunks' },
  'hazel coppice': { weight: 1, words: 'hazel coppice of many-stemmed stools' },
  'willow carr': { weight: 1, words: 'willow carr of leaning silver trunks over dark water' },
  'alder stream': { weight: 1, words: 'alder-lined stream with root-laced banks' },
  'aspen grove': { weight: 1, words: 'aspen grove of pale trembling leaves' },
  'rowan glade': { weight: 1, words: 'rowan glade hung with red berries' },
  'hawthorn thicket': { weight: 1, words: 'hawthorn thicket in white blossom' },
  'holly hollow': { weight: 1, words: 'holly hollow of glossy dark leaves' },
  'yew grove': { weight: 1, words: 'ancient yew grove of fluted red trunks' },
  'chestnut wood': { weight: 1, words: 'chestnut wood with spiny husks on the floor' },
  'magnolia grove': { weight: 1, words: 'magnolia grove of cupped white blooms' },
  'sakura grove': { weight: 2, words: 'sakura grove in full pink bloom' },
  'dogwood glade': { weight: 1, words: 'dogwood glade of white bracts' },
  'bluebell wood': { weight: 2, words: 'bluebell wood carpeted in violet-blue' },
  'foxglove glade': { weight: 1, words: 'foxglove glade of pink spires' },
  'boulder field': { weight: 1, words: 'moss-covered boulder field under old trees' },
  'moss canyon': { weight: 1, words: 'moss-canyon glen with velvet green walls' },
  lakeshore: { weight: 1, words: 'forest lakeshore with still reflecting water' },
  'bog edge': { weight: 1, words: 'sphagnum bog edge with cotton-grass and dark pools' },
  'heather edge': { weight: 1, words: 'heather-and-birch forest edge' },
  'mushroom hollow': { weight: 1, words: 'mushroom hollow of toadstool clusters on the floor' },
  'ivy hollow': { weight: 1, words: 'ivy-choked hollow of vine-wrapped trunks' },
  'maple grove': { weight: 1, words: 'autumn maple grove in red and gold' },
  'larch glade': { weight: 1, words: 'golden larch glade in autumn' },
};
const TEXTURES = [
  'moss carpet',
  'bluebells',
  'hanging vines',
  'fairy-ring mushrooms',
  'fern fronds',
  'petal-strewn floor',
  'river stones',
  'water lilies',
  'lichen',
  'catkin veils',
  'root buttresses',
  'ivy sheets',
  'leaf litter',
  'wild roses',
  'foxglove spires',
  'dew-beaded grass',
  'hanging-moss curtains',
  'bracket fungi',
  'fallen log',
  'mossy boulders',
  'wood anemones',
  'primroses',
  'cow parsley',
  'meadowsweet',
  'honeysuckle',
  'clematis',
  'bramble arches',
  'pinecones',
  'acorns',
  'toadstools',
];
const DEPTH = [
  'painted multi-tier depth fading into soft distance',
  'painted depth fading into pale luminous distance',
  'painted gallery-tier depth into deep-green shadow',
  'painted depth into soft violet-cream haze',
  'painted depth into amber distance',
  'painted depth into pearl-mist distance',
];

const BIOME_RULES = [
  ['oak cathedral', /oak-cathedral|oak cathedral|vaulted canopy/i],
  ['hero tree', /hero-tree|world-tree|colossal/i],
  ['wisteria arbor', /wisteria/i],
  ['waterfall glade', /waterfall/i],
  ['stream clearing', /stream/i],
  ['fern grotto', /fern-grotto|fern grotto|grotto/i],
  ['autumn grove', /autumn/i],
  ['bluebell wood', /bluebell wood|bluebell carpet|carpeted in bluebell/i],
  ['foxglove glade', /foxglove glade/i],
  ['wildflower meadow', /meadow/i],
  ['birch glade', /birch/i],
  ['beech cathedral', /beech/i],
  ['pine cathedral', /pine/i],
  ['cedar grove', /cedar/i],
  ['redwood grove', /redwood|sequoia/i],
  ['hazel coppice', /hazel/i],
  ['willow carr', /willow/i],
  ['alder stream', /alder/i],
  ['aspen grove', /aspen/i],
  ['rowan glade', /rowan/i],
  ['hawthorn thicket', /hawthorn/i],
  ['holly hollow', /holly/i],
  ['yew grove', /\byew/i],
  ['chestnut wood', /chestnut/i],
  ['magnolia grove', /magnolia/i],
  ['sakura grove', /sakura|cherry/i],
  ['dogwood glade', /dogwood/i],
  ['boulder field', /boulder field|boulder-field/i],
  ['moss canyon', /moss-canyon|moss canyon|glen/i],
  ['lakeshore', /lake/i],
  ['bog edge', /\bbog|sphagnum/i],
  ['heather edge', /heather/i],
  ['mushroom hollow', /mushroom hollow|toadstool hollow/i],
  ['ivy hollow', /ivy-choked|ivy hollow/i],
  ['maple grove', /maple/i],
  ['larch glade', /larch/i],
  ['oak grove', /oak/i],
];
const TEXTURE_RULES = TEXTURES.map((t) => [t, new RegExp(t.replace(/-/g, '[- ]').replace(/s$/, 's?'), 'i')]);
const pick = (rules, text, fallback) => {
  for (const [k, re] of rules) if (re.test(text)) return k;
  return fallback;
};
function parse(text) {
  const biome = pick(BIOME_RULES, text, 'forest');
  const texture = pick(TEXTURE_RULES, text, 'texture');
  return { keys: [`biome:${biome}`, `texture:${texture}`], biome, texture };
}
const sameGroup = (a, b) => a.biome === b.biome && a.texture === b.texture;

function planSlots({ slots }) {
  slots.forEach((s, i) => {
    s.painted = /^Painted/.test(s.old || '') || (!s.old && i % 3 === 0);
    s.tags = ['biome'];
  });
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
    const texture = among(
      byUsage(TEXTURES, usage, (k) => 'texture:' + k),
      5
    );
    // water textures only where there is water
    if (/water lilies|river stones/.test(texture) && !/stream|waterfall|lake|bog|willow carr|alder/.test(biome)) continue;
    const cand = { biome, texture };
    if (groups.some((g) => sameGroup(g.assignment ? g.assignment : g, cand))) continue;
    const second = spread(TEXTURES.filter((t) => t !== texture));
    return {
      keys: [`biome:${biome}`, `texture:${texture}`],
      biome,
      texture,
      second,
      words: BIOMES[biome].words,
      depth: spread(DEPTH),
      tags: [biome, texture],
    };
  }
  return null;
}
function brief(batch, examples) {
  return `You write entries for one pool of a painted-storybook fae bot: FaeBot queen-of-the-forest, the FOREST BIOME wrapping her scene as an atmospheric backdrop. Every entry is ONE specific enchanted-forest biome in 25-45 words, one line, comma-separated phrases: the biome type (its named trees or feature), two signature texture details, and painted multi-tier depth fading to soft distance. Keep EXACTLY the shape of the examples (an entry marked painted opens with "Painted").

Examples already in the pool (match their voice and length):
${examples.map((e) => '- ' + e).join('\n')}

Rules:
- Use EXACTLY the biome, the two textures and the depth phrase given for the slot, in your own natural wording; name the biome's own trees or feature and both textures.
- The forest wraps the scene without dominating it. Real forest things, storybook-painted.
- Name no court chamber, throne or chandelier, no queen, critters or fae, no lighting or weather, no mushroom throne or mushroom pillars, nothing glowing. Describe only what is present; write no negative words.

Slots:
${batch
  .map((s, i) => {
    const a = s.assignment;
    return `${i + 1}. ${s.painted ? 'painted; ' : ''}biome "${a.words}"; textures "${a.texture}" and "${a.second}"; depth "${a.depth}"`;
  })
  .join('\n')}

Reply with a JSON array of ${batch.length} strings only.`;
}
const formatRe = /^[A-Z].{90,}$/; // the originals end with a period
const BANS = [
  ['glow', /\b(glow|glowing|bioluminescent|phosphorescent|luminous|firefly|fireflies)\b/i],
  ['court', /\b(throne|chandelier|chamber|court|hall|pillar|pillars|spire|spires)\b/i],
  ['cast', /\b(queen|fae|fairy|fairies|critter|critters|fox|deer|bird|birds|butterfly|butterflies)\b/i],
  ['light-weather', /\b(god-rays|sunbeam|sunbeams|sunlight|moonlight|mist|fog|rain|snow|dusk|dawn|sunset|golden hour|ethereal light|pearl-light|soft-amber light|warm light)\b/i],
  ['negation', /\b(no|not|never|without|nothing)\b/i],
];
function mechanical(cand, slot) {
  const p = [];
  const a = slot.assignment;
  const parsed = parse(cand);
  if (parsed.biome !== a.biome) p.push(`biome ${parsed.biome}≠${a.biome}`);
  if (!TEXTURE_RULES.find(([t]) => t === a.texture)[1].test(cand)) p.push(`texture missing (${a.texture})`);
  if (slot.painted && !/^Painted\b/.test(cand)) p.push('not painted-prefixed');
  if (!slot.painted && /^Painted\b/.test(cand)) p.push('painted-prefixed');
  const words = cand.split(/\s+/).length;
  if (words < 20 || words > 50) p.push(`${words} words`);
  if (!/depth|distance|fading|receding/i.test(cand)) p.push('no depth');
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
  return { biome: t('biome'), texture: t('texture') };
}

module.exports = {
  name: 'faebot/queen_of_forest/biome',
  poolFile,
  basis: 'biome = forest type + first signature texture; same when both match; greedy, pool order',
  parse,
  sameGroup,
  planSlots,
  assign,
  brief,
  formatRe,
  mechanical,
  measure,
  batchSize: 6,
  lenBand: [140, 380],
};
