/* global __dirname */
/**
 * faebot / dryad-portrait / forest_backdrop — the enchanted forest painted softly out-of-focus
 * behind her (portrait depth of field, never competing with her).
 * Recipe: scripts/gen-faebot-pool.js `faebot_dryad_portrait_forest_backdrop` (ONE specific forest type,
 * a softly-out-of-focus / atmospheric-haze cue, multi-tier depth with a tactile foreground anchoring
 * her midground; 25-45 words; no open meadow, no creature, no lighting / weather, no competing focal
 * element). Pool 2026-09-23: 200 entries over ~12 types ("Ancient oak grove…" ×14+8, "Sakura grove…"
 * ×17, "Wisteria-cascade…" ×18, "Bioluminescent glen / fairy-circle" ×15 …). Same idea = forest type +
 * its first signature texture (the same rosters as the queen-of-the-forest biome, minus the open
 * meadow the recipe bans here).
 */
const path = require('path');
const { shuffle, byUsage } = require('../lib/core');
const queen = require('./faebot.queen_of_forest.biome.js');

const poolFile = path.join(__dirname, '../../bots/faebot/seeds/faebot_dryad_portrait_forest_backdrop.json');

const BIOMES = Object.fromEntries(
  Object.entries(queen.BIOMES).filter(([k]) => !/meadow|heather edge|bog edge|lakeshore/.test(k))
);
const TEXTURES = queen.TEXTURES;
const FOREGROUNDS = [
  'tactile moss-covered root at the foreground anchoring her midground',
  'tactile bark-texture at the foreground edge grounding her',
  'tactile fern-frond at the foreground anchoring her midground',
  'tactile lichen-crusted stone at the foreground grounding her',
  'tactile fallen petals at the foreground edge anchoring her',
  'tactile twisted root-edge at the foreground anchoring her midground',
  'tactile leaf-litter at the foreground grounding her presence',
  'tactile mossy stone at the foreground anchoring her',
];
const HAZE = [
  'receding into atmospheric haze',
  'dissolving into soft painted mist at depth',
  'fading into pearl-grey atmospheric distance',
  'blurring into soft painted distance',
  'receding into dappled atmospheric haze',
];

// parse: reuse the queen biome's classification of type + texture
const parse = (text) => queen.parse(text);
const sameGroup = (a, b) => a.biome === b.biome && a.texture === b.texture;

function planSlots({ slots }) {
  slots.forEach((s) => (s.tags = ['backdrop']));
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
    if (/water lilies|river stones/.test(texture) && !/stream|waterfall|willow carr|alder/.test(biome)) continue;
    const cand = { biome, texture };
    if (groups.some((g) => sameGroup(g.assignment ? g.assignment : g, cand))) continue;
    return {
      keys: [`biome:${biome}`, `texture:${texture}`],
      biome,
      texture,
      words: BIOMES[biome].words,
      foreground: spread(FOREGROUNDS),
      haze: spread(HAZE),
      tags: [biome, texture],
    };
  }
  return null;
}
function brief(batch, examples) {
  return `You write entries for one pool of a painted-storybook fae bot: FaeBot dryad-portrait, the FOREST BACKDROP painted softly out-of-focus behind her at portrait depth of field. Every entry is ONE specific enchanted-forest setting in 25-45 words, one line, comma-separated phrases: the forest type "behind her", a softly-out-of-focus or atmospheric-haze cue, one signature texture, and a tactile foreground element anchoring her midground. Keep EXACTLY the shape of the examples.

Examples already in the pool (match their voice and length):
${examples.map((e) => '- ' + e).join('\n')}

Rules:
- Use EXACTLY the forest type, the signature texture, the haze cue and the foreground anchor given for the slot, in your own natural wording; name the forest's own trees or feature and the texture.
- The backdrop stays soft and behind her; she is the focus (say "behind her" or "her midground"). Real forest things, storybook-painted.
- Name no open meadow, no creature, no lighting or weather, no competing focal element, nothing glowing. Describe only what is present; write no negative words.

Slots:
${batch
  .map((s, i) => {
    const a = s.assignment;
    return `${i + 1}. forest "${a.words}"; texture "${a.texture}"; haze "${a.haze}"; foreground "${a.foreground}"`;
  })
  .join('\n')}

Reply with a JSON array of ${batch.length} strings only.`;
}
const formatRe = /^[A-Z].{90,}$/;
const BANS = [
  ['glow', /\b(glowing|bioluminescent|phosphorescent|firefly|fireflies|luminescent)\b/i],
  ['meadow', /\b(meadow|open field|grassland)\b/i],
  ['cast', /\b(creature|fae|fairy|fairies|fox|deer|bird|birds|butterfly|butterflies|her (?:face|hair|eyes|gown|skin))\b/i],
  ['weather', /\b(rain|snow|storm|dusk|dawn|sunset|sunrise|moonlight|night)\b/i],
  ['negation', /\b(no|not|never|without|nothing)\b/i],
];
function mechanical(cand, slot) {
  const p = [];
  const a = slot.assignment;
  const parsed = parse(cand);
  if (parsed.biome !== a.biome) p.push(`biome ${parsed.biome}≠${a.biome}`);
  if (!queen.TEXTURES.includes(a.texture) || !new RegExp(a.texture.replace(/-/g, '[- ]').replace(/s$/, 's?'), 'i').test(cand))
    p.push(`texture missing (${a.texture})`);
  if (!/behind her|her midground|anchoring her|grounding her/i.test(cand)) p.push('not behind her');
  if (!/out-of-focus|haze|blurred|soft focus|dissolving|receding|fading/i.test(cand)) p.push('no soft-focus cue');
  const words = cand.split(/\s+/).length;
  if (words < 20 || words > 50) p.push(`${words} words`);
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
  name: 'faebot/dryad_portrait/forest_backdrop',
  poolFile,
  basis: 'backdrop = forest type + first signature texture; same when both match; greedy, pool order',
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
