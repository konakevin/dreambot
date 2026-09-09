#!/usr/bin/env node
/**
 * FarmBot — feeding-time path (Moment, MVP-25).
 *
 * The activity of feeding — a filled trough/bucket/scattered feed, animals
 * gathering to eat. No deliberate human figure (evidence of feeding, not a
 * feeder).
 */
const path = require('path');
const { generatePool } = require('../../lib/seedGenHelper');

const SEEDS_DIR = path.join(__dirname, '..', '..', 'bots', 'farmbot', 'seeds');

const RECIPES = [
  {
    outPath: path.join(SEEDS_DIR, 'farmbot_feeding_time_scenes.json'),
    total: 120,
    append: false,
    banHumanLanguage: true,
    metaPrompt: (n) => `Generate ${n} distinct FEEDING-TIME scene descriptions for a cozy
farm-life bot — the moment animals gather around fresh feed. A filled
trough, scattered feed, or a hay bucket is the anchor, with 2-4 animals
(any natural farmyard mix — a couple of hens, a goat, a lamb, a duck — not
strictly one species) gathering around it. Blend TWO inspirations: (A)
Hay Day-style farm-sim feeding iconography — a wooden trough brimming with
golden feed, a scattered handful of corn on packed dirt, a hay bucket
hanging on a fence post — and (B) cozy iyashikei slice-of-life mood — the
particular contented hush of animals eating together, warm afternoon
light, dust motes over hay.

CRITICAL — every entry must be a MAGICAL, ENCHANTED little moment, one of
the coziest, prettiest farm scenes imaginable — never a bare dirt-yard
composition. SURROUND the trough/bucket/feed and its animals with rich
environmental detail (flowering shrubs or climbing vines along the fence,
tall grass, a garden bed nearby, dappled shade from a tree) PLUS at least
one small whimsical, fun detail — a butterfly drifting past, dust motes
glowing gold in a sunbeam, a bird perched watching, dew still on nearby
grass. Vary: which animals gather, season (favor spring/summer greenery),
time of day, weather, angle. CRITICAL: the TROUGH, BUCKET, or scattered
FEED must ALWAYS be the grammatical subject named FIRST in the sentence;
the animals appear only in a trailing clause. 25-40 words each. Examples:
["A wooden feed trough brims with golden grain beside a fence heavy with climbing morning glories, a curious goat and a pair of hens gathering close as a butterfly drifts past in the late afternoon light.", "Scattered corn kernels catch the morning sun across grass still silvered with dew, a plump duck and a small lamb wandering over to share the feast beneath a blossoming apple tree."]

🚫 STRICT BANS: NO named people/characters, NO readable text or signage,
NO brand names, NO photographer/camera-brand names, NO bare/empty
compositions lacking surrounding plant detail.

Output ONLY a JSON array of ${n} strings, no preamble, no numbering.`,
  },
];

async function main() {
  for (const r of RECIPES) {
    console.log(`\n=== ${path.basename(r.outPath)} ===`);
    await generatePool(r);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
