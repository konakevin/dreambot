#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/chibibot/seeds/arctic_village_surprise.json',
  total: 50,
  batch: 25,
  metaPrompt: (n) => `You are writing ${n} SURPRISE-ELEMENT descriptions for ChibiBot arctic-village — tiny second-tier details the eye finds after the village + foreground creature.

Each entry: 12-25 words. ONE specific tucked-away surprise detail.

━━━ CATEGORY DISTRIBUTION ━━━

- 20% TINY-SECONDARY-CREATURE (a chickadee perched on a snow-laden pine-branch / a tiny snow-bunny peeking from a snowdrift / an owl sleeping in a frost-rimmed window / a deer-trail emerging from pine-trees in deep midground / a snow-mouse-trail crossing a path)
- 15% LANTERN / FIRE / GLOW (a single lit candle in a far-window / a brass-lantern glowing on a fence-post / a campfire-glow visible at the village edge / a hot-spring-steam-glow / a fireplace-glow shown through a porch-window)
- 15% TRAIL / FOOTPRINT (a paw-print trail leading off into pine-trees / a sled-track meandering through the snow / a fresh-footprint path crossing a frozen-pond / a deer-trail in fresh snow)
- 10% AURORA / SKY-MAGIC (a particularly vivid aurora-ribbon over a distant mountain / a shooting-star streaking across the sky / a moon-halo with rainbow-rim / the Milky-Way visible above the village)
- 10% DECOR-DETAIL (a snow-globe-style mistletoe-bunch hanging from a porch / a forgotten knit-mitten on a fence-post / a snowman built lopsided by children / a hand-painted sign reading "OPEN")
- 10% NATURE-WONDER (a frozen-waterfall in the deep background / icicles in a perfect-row from a roof / a frosted-spider-web sparkling / a snowflake-pattern preserved on a window-pane / a crystal-clear icicle dripping rainbow-light)
- 5% WATER-FEATURE (a steam-plume from a hidden hot-spring at the village edge / a frozen-pond-reflection of cottage-lights / an ice-fountain frozen mid-spray / a circle of frozen-stream)
- 5% TOOL / GAME (a forgotten sled at the bottom of a hill / ice-skates hung over a sign / a stack of firewood awaiting / a child's-snow-fort with toy-shovel)
- 5% FOOD-DETAIL (a cookie-tray left to cool on a snowy ledge / a steaming-pot of stew on an outdoor-stove / a strung-popcorn-garland on a porch / berry-laden branches dipped in snow)
- 5% MAGICAL-MOMENT (a single glowing-snowflake mid-air / a fairy-trail visible / a tiny will-o-wisp by a frozen pond / a glowing-blue-jewel on a snowy pedestal)

━━━ HARD BANS ━━━

- NO main creature / hero creature (template handles that)
- NO setting / village language
- NO time / weather / activity verbs

━━━ OUTPUT ━━━

JSON array of \${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
