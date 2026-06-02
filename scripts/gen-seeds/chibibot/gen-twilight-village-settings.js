#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/chibibot/seeds/twilight_village_settings.json',
  total: 200,
  batch: 15,
  metaPrompt: (
    n
  ) => `You are writing \${n} TWILIGHT-VILLAGE SETTINGS for ChibiBot twilight-village — cozy twilight-biome villages that are the HERO of the frame. NOT a single cottage — a VILLAGE (cluster of multiple dwellings).

Each entry: 25-40 words. ONE specific village. NO creatures, NO time-of-day, NO weather verbs.

━━━ THE BAR — CHIBI-SCALE COZY TWILIGHT VILLAGE I WANT TO LIVE IN ━━━

The viewer's reaction: "I want to move into that twilight village." Cluster of multiple dwellings. Heavily detailed lived-in. Studio Ghibli / Spirited-Away / Whisper-of-the-Heart / Howl-Moving-Castle / Tangled-lanterns aesthetic.

━━━ 11 SUB-TYPES — MUST VARY ACROSS THE POOL — distribute roughly evenly ━━━

- 10% LANTERN-LANE VILLAGE (cluster of cottages along a lane lit by a string of paper-lanterns dangling overhead, warm-amber lantern-glow pooling on stone-pavement, cottage-windows glowing softly, deep-violet dusk sky)
- 10% FIREFLY-MEADOW COTTAGES (cluster of cottages in a meadow swarming with fireflies, warm-amber cottage windows, drifting firefly-trails, dewy grass, soft-violet dusk overhead)
- 10% MOONLIT-BRIDGE TOWN (cluster of cottages bracketing an arched stone-bridge over a glassy-still moonlit-canal, paper-lantern strands across the bridge, rim-lit rooftops in cool moon-silver)
- 10% DUSK-WINDOW-GLOW CLUSTER (cluster of cottages at deep-blue dusk with every single window glowing warm-amber, cobblestone-pavement reflecting lights, chimney-smoke against the violet sky, fairy-light strands)
- 10% PAPER-LANTERN FESTIVAL VILLAGE (cluster of cottages during a paper-lantern festival, hundreds of red-and-gold paper-lanterns strung overhead and floating in the air, warm-amber festival glow, deep-purple sky, festival-stalls)
- 10% SPIRITED-AWAY PAPER-LANTERN TOWN (Japanese-paper-lantern Edo-style town with two-story wooden buildings, hanging paper-lanterns over a narrow stone-street, glowing warm-amber from every window, deep-magenta-violet dusk)
- 5% NIGHTINGALE-GROVE COTTAGES (cluster of cottages in a forest-grove at twilight with nightingale-trails of song-light, fairy-light strands woven through trees, glowing-mushroom path)
- 10% STAR-LIT-SPIRE VILLAGE (cluster of fairy-tale cottages with thin pointed-spires under an impossibly starry sky, warm-amber windows, milky-way visible, soft-violet-magenta dusk)
- 10% BIOLUMINESCENT-GARDEN CLUSTER (cluster of cottages in a garden of glowing-bioluminescent-flowers and luminous-mushrooms at twilight, soft-cyan-violet glow from plants contrasting warm cottage-windows)
- 5% GLOWWORM-CAVE HAMLET (cluster of cottages tucked into a glowworm-illuminated cave or cliff-face, glowworm-trail constellations on the rock-ceiling, warm-amber cottage-windows contrasting cool-cyan glow)
- 10% MOONFLOWER-MEADOW VILLAGE (cluster of cottages in a meadow of glowing white moonflowers blooming at twilight, warm-amber cottage windows, fireflies drifting, deep-violet-magenta dusk, dewy grass)

━━━ MANDATORY: COZY-DECOR ELEMENTS IN EVERY ENTRY ━━━

Each entry MUST visibly include at least 3 village elements that establish the biome (architecture / lighting / flora / atmosphere / props).

━━━ HARD BANS ━━━

- NO creatures or characters
- NO time / weather / activity verbs
- NO single solo cottage — must be a VILLAGE (cluster of multiple dwellings)
- NO dark / moody / abandoned villages
- NO bright noon / NO daylight scenes — always twilight or night. NO snow. NO underwater.

━━━ OUTPUT ━━━

JSON array of \\${n} strings. No preamble, no numbering.`,
}).catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
