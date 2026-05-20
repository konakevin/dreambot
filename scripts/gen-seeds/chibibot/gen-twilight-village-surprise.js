#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/chibibot/seeds/twilight_village_surprise.json',
  total: 100,
  batch: 25,
  metaPrompt: (n) => `You are writing \${n} SURPRISE-ELEMENT descriptions for ChibiBot twilight-village — tiny second-tier details the eye finds after the village + foreground creature.

Each entry: 12-25 words. ONE specific tucked-away surprise detail.

━━━ CATEGORY DISTRIBUTION ━━━

- 20% FIREFLY / GLOWWORM (a single bright firefly trail / a glowworm-cluster on a wall / a glow-bug-jar on a step)
- 20% PAPER-LANTERN-DETAIL (a floating sky-lantern just released / a hung-paper-lantern catching wind / a glowing-paper-orb)
- 15% MOONLIT-DETAIL (moon-silver-reflection on a puddle / moon-halo / a glimpse of the moon between rooftops)
- 10% MAGICAL-FLORA (a moonflower mid-bloom / a glowing bioluminescent-bush / a wisteria-cluster catching lantern-glow)
- 10% TINY-CREATURE (an owl perched on a paper-lantern post / a tiny moth circling a glow / a sleepy cat on a moonlit step)
- 10% TRAIL (a paw-print trail catching moon-light / a sandal-footprint glowing softly / a moss-path lit by glow-mushrooms)
- 5% STARS / SKY-MAGIC (a shooting-star / Milky-Way arch overhead / a constellation visible)
- 5% MAGICAL-CREATURE (a will-o-wisp / a single spirit-orb / a luminous-butterfly)
- 5% MUSIC / SOUND-VISUAL (lute-music wafting visualized as glowing-notes / a music-box-trail)

━━━ HARD BANS ━━━

- NO main creature / hero creature
- NO setting / village language
- NO time / weather / activity verbs
- NO bright noon / NO daylight scenes — always twilight or night. NO snow. NO underwater.

━━━ OUTPUT ━━━

JSON array of \\${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
