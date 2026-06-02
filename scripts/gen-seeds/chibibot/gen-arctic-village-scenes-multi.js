#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');

generatePool({
  outPath: 'scripts/bots/chibibot/seeds/arctic_village_scenes.json',
  total: 628,
  append: true,
  batch: 25,
  metaPrompt: (
    n
  ) => `You are writing ${n} MULTI-CHARACTER ARCTIC-VILLAGE scenes for ChibiBot's arctic-village path. The pool already has 314 single-creature scenes — your job is to add PAIR + TRIO scenes for character variance.

Pixar / Sanrio / Studio Ghibli / Frozen STYLIZED. NEVER photoreal. Mix baby + adult creatures freely. Cozy snow / ice / aurora / sub-arctic VILLAGES.

Each entry: 18-28 words.

━━━ COUNT MIX ━━━
~60% PAIR / ~40% TRIO. Force "TWO DISTINCT chibi figures equally prominent" / "TRIO of chibi" / "all three visible" composition language. DIFFERENT species per character.

━━━ VILLAGE TYPES (mix broadly) ━━━
Snow-cottage town with candy-cane fences / Igloo cluster with lantern-paths / Snowy-pine-cottage cluster / Log-cabin village under aurora / Gingerbread-snow-fortress / Polar-station cottage / Snowy-mountain hamlet / Frozen-pond skating-village / Snow-pine-tunnel village / Cozy log-cabin row at sunrise / Reindeer-stable hamlet / Frost-fair market square / Aurora-watching observatory village / Hot-spring snow-cove village / Holiday-twinkle village

━━━ MULTI-SPECIES COMBOS ━━━
Pairs: polar bear + arctic fox / penguin + seal / reindeer + snowshoe-hare / snowy owl + fox / walrus + tiny seal / lynx + ptarmigan / ermine + bunny / wolverine + arctic hare / musk-ox + small bird
Trios: three penguin chicks / family of arctic foxes / three reindeer (parent + two young) / mixed-species snow gathering

━━━ COZY OVERLAY ━━━
- Architecture: snow-roofed log-cabin cottages with WARM-amber window-glow, candy-cane fence-posts, twinkle-string-lights, smoke-chimneys, jingle-bell garlands
- Pearl-white snow + sky-pink dawn + soft-mint ice + WARM igloo-amber + aurora violet/teal palette
- Soft snowflake-particle drift, soft falling snow
- Village feels LIVED IN — knit-blanket on porch, snow-shovel by door, sled at cabin, wood-stack
- Multi-character RELATIONAL — sledding together / sharing cocoa / waiting at door together / huddled in snowdrift

━━━ ABSOLUTELY BANNED ━━━
- NO photoreal / NO documentary / NO Nat-Geo
- NO grim arctic / NO blizzard-survival-horror / NO bleak
- NO blood-on-snow / NO predator-track
- NO climate-change-grim
- NO identifiable humans
- NO single-creature entries (multi only)

━━━ DEDUP DIMENSIONS ━━━
UNIQUE village-type + species-combination + activity per entry.

━━━ EXAMPLES (DO NOT REUSE) ━━━
- "TWO DISTINCT chibi figures equally prominent: polar bear cub and arctic fox kit cuddling in fresh snow beside snow-cottage row, smoke from chimneys, twinkle-lights overhead"
- "TRIO of chibi penguin chicks waddling single-file across powder snow path between igloos, three round bodies in a row, lantern-poles glowing amber"
- "TWO DISTINCT chibi figures: snowy owl perched on shoulder of reindeer-with-jingle-bells walking through frost-fair market square at twilight, twinkle-light arches"
- "TRIO of chibi arctic foxes gathered around a steaming hot-spring in snow-cove village, three white tails trailing, three pairs of golden eyes blinking in steam"
- "TWO DISTINCT chibi figures equally prominent: ermine and bunny sharing a knit blanket on porch swing of snow-pine cottage, aurora-violet sky overhead"

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering, no markdown.`,
}).catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
