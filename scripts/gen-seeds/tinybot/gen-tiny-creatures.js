#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/tinybot/seeds/tiny_creatures.json',
  total: 200,
  batch: 50,
  metaPrompt: (
    n
  ) => `You are writing ${n} TINY CREATURE descriptions for TinyBot — tiny-scale creatures for terrarium + macro-nature paths.

Each entry: 8-16 words. One specific tiny creature with a charm note.

EVERYTHING MUST BE ADORABLE — rounded, friendly, storybook-cute. If a creature
isn't classically cute, DO NOT include it.

━━━ CUTE BUGS — these are the ONLY insects allowed ━━━
- Ladybug on a petal (red, round, polka-dotted)
- Butterfly resting on a flower (monarch, swallowtail, blue-morpho)
- Fuzzy bumblebee dusted in pollen / honeybee on a blossom
- Snail with a spiraled shell on a dewy leaf
- Plump fuzzy caterpillar inching along a twig
- Firefly glowing softly at dusk
- Jewel-bright dragonfly hovering over a pond

━━━ CUTE NON-BUG CRITTERS (use these freely) ━━━
- Tiny tree-frog / poison-dart frog perched on a mushroom cap
- Little gecko / anole / skink sunning on a warm pebble
- Tiny mouse nibbling a berry
- Chipmunk with cheeks full
- Hedgehog curled in autumn leaves
- Tiny turtle on a leaf
- Hummingbird mid-hover
- Tiny fluffy songbird (fairy-wren, robin chick, finch)
- Baby bunny / spotted fawn (tiny, storybook)
- Pixie / fairy / fae sprite (tiny, sweet, magical)

━━━ RULES ━━━
- CUTE-ONLY. Real or fantasy (pixie/fairy), tiny-scale, always endearing.
- A charm detail in every entry (sleepy blink, dewdrop, tiny smile, fluffy fur).
- Fits terrarium / macro-nature / tiny-vehicle-passenger scale.

━━━ ABSOLUTELY BANNED (NOT cute — never include) ━━━
- NO beetles of any kind (no jewel-beetle, scarab, tiger-beetle, ground-beetle, weevil)
- NO praying mantises, NO spiders, NO centipedes / millipedes
- NO grasshoppers, NO crickets, NO locusts
- NO moths, NO stick-insects, NO ants, NO cockroaches, NO earwigs, NO stink-bugs
- NO wasps / hornets / flies / mosquitoes / gnats
- NO snakes, NO anything spiky, leggy, creepy, or pest-like
- NEVER write the words "spider", "spider-silk", "spiderweb", "spiderwort", or
  "gossamer" — they evoke spiders. Say "dewy strand" or "silk thread" instead.
Only the seven cute bugs listed above + the cute non-bug critters.

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
