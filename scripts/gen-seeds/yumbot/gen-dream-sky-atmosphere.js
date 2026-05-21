#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/yumbot/seeds/dream_sky_atmosphere.json',
  total: 50,
  batch: 25,
  metaPrompt: (n) => `You are writing \${n} SKY-AND-ATMOSPHERE descriptions for YumBot rainbow-dreamscape. The sky overhead — sunny pastel sky with optional balloons, mountains in distance, etc.

Each entry: 15-25 words.

━━━ REFERENCE — bex.ai ━━━

Sunny pastel-pink-blue gradient sky. Cherry-blossom-mountains in distance in soft pastel haze. Pastel hot-air-balloons or regular pastel balloons floating high. Pastel cotton-candy-clouds. Soft warm light pouring down.

━━━ DISTRIBUTION ━━━

- 25% SUNNY-PASTEL-SKY (sunny pastel-pink-and-blue gradient sky with soft cotton-candy-clouds / warm pastel-sunset sky with peach-and-pink gradient / pastel-sky with golden-hour-warmth)
- 25% CHERRY-BLOSSOM-MOUNTAINS (cherry-blossom-mountains rising in soft pastel haze in the distance / pastel-mountain-peaks dusted with cherry-blossoms / soft pastel-mountains with cherry-blossom-clouds at their tops)
- 20% HOT-AIR-BALLOONS (pastel hot-air-balloons drifting across the sky in a cluster / a single hot-air-balloon high in the pastel sky / two pastel hot-air-balloons floating overhead)
- 10% PASTEL-BALLOONS (cluster of pastel-pink-and-yellow balloons floating up / single floating pastel-balloon-cluster / heart-shaped pastel-balloons drifting)
- 10% PASTEL-CLOUDS (puffy pastel cotton-candy-clouds dotting the sky / soft pastel-cumulus clouds glowing pink / wispy pastel-cirrus clouds painting the sky)
- 5% BUTTERFLIES-FLOATING (clouds of pastel-butterflies fluttering in the sky / cluster of pastel-monarchs in flight / pastel-butterfly-swarm overhead)
- 5% MAGIC-SKY (impossibly pastel-rainbow sky / aurora-glow in the pastel-sky / iridescent-pastel sky with magical-shimmer)

━━━ HARD MANDATES ━━━

- ALWAYS pastel
- Visible IN the sky / upper part of the frame
- Painterly hand-illustration register

━━━ HARD BANS ━━━

- NO cups / kawaii foods
- NO ground / landscape (other pool)
- NO dark / stormy / dramatic

━━━ OUTPUT ━━━

JSON array of \\${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
