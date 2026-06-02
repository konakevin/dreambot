#!/usr/bin/env node
/**
 * Append PAIR + TRIO entries to arctic_creatures.json. Existing 346 solo
 * stay. Target: 50/30/20 solo/pair/trio. Append: 346 (208 pair + 138 trio).
 */
const { generatePool } = require('../../lib/seedGenHelper');

generatePool({
  outPath: 'scripts/bots/chibibot/seeds/arctic_creatures.json',
  total: 692,
  append: true,
  batch: 50,
  metaPrompt: (
    n
  ) => `You are writing ${n} MULTI-CREATURE arctic entries for ChibiBot's snowy-arctic path. The pool already has 346 SOLO entries — your job is to add PAIR and TRIO entries so renders vary character count.

This batch is ALL multi-character. Mix ~60% PAIR / 40% TRIO.

Pixar / Sanrio / Frozen / Polar-Express STYLIZED. NEVER photoreal.

Each entry: 12-22 words. ONE specific multi-creature arctic moment.

━━━ CRITICAL: MULTIPLE DISTINCT FIGURES, EQUALLY PROMINENT ━━━
- "TWO DISTINCT chibi figures" / "all three visible" / "both equally prominent in frame"
- DIFFERENT arctic species per character
- RELATIONAL contact: touching, leaning, sharing, gathered

━━━ ARCTIC SPECIES PAIRS/TRIOS (use widely) ━━━
Pairs: polar bear + arctic fox / penguin + seal / reindeer + snowshoe-hare / snowy owl + fox / walrus + tiny seal / lynx + ptarmigan / ermine + redpoll-bird / wolverine + arctic hare / musk-ox + small bird / harbor seal + puffin / orca + dolphin / arctic wolf + raven / bighorn ram + small marmot / pika + snow-bunting / mountain goat + ptarmigan
Trios: three penguin chicks / family of arctic foxes / three reindeer (parent + two young) / mixed-species snow gathering / three baby seals on ice-floe

━━━ 50/50 BABY/ADULT BLEND ━━━
Mix age:
- All-adult (mature polar bear + elder snowy owl together)
- All-young (three arctic fox kits in a snowdrift)
- Mixed (mother bear + cub + small bird friend)

━━━ ARCTIC ACTIVITIES (every entry) ━━━
Sharing a fish / cuddling in a snowdrift / sliding down ice together / huddled in a windbreak / watching the aurora together / walking single-file across snow / sharing a hot-spring soak / mid-snow-tumble / perched on an ice-cliff together / pressed close for warmth / playing in fresh snow

━━━ CHIBI STYLE ━━━
- Pixar/Sanrio stylized — NEVER photoreal
- Glassy dewy eyes, thick fluffy winter coats
- Optional cute accessories: knit scarves, jingle-bell collars, fur-trim capes
- ALL characters chibi proportions

━━━ ABSOLUTELY BANNED ━━━
- NO photoreal / NO documentary
- NO predator-prey violence — friends only
- NO blood / NO menace
- NO sexualized
- NO identifiable humans
- NO single-character entries
- NO "background" language

━━━ DEDUP DIMENSIONS ━━━
UNIQUE species combination + activity per entry.

━━━ EXAMPLES (DO NOT REUSE) ━━━
- "TWO DISTINCT chibi figures: polar bear cub and snowy-white arctic fox kit cuddling in a snowdrift, both with massive glassy eyes"
- "TRIO of chibi penguin chicks waddling single-file across powder snow, three round bodies in a row, breath-puffs visible"
- "TWO DISTINCT chibi figures equally prominent: a wise snowy owl perched beside a young reindeer calf at twilight"
- "TRIO of chibi arctic foxes huddled together in a snow-burrow, three white tail-tips poking out, six golden eyes peeking"
- "TWO DISTINCT chibi figures: harbor seal and puffin perched on an ice-floe together, both blinking up at the aurora"

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering, no markdown.`,
}).catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
