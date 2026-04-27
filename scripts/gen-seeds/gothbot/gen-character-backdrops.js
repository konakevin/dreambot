#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/gothbot/seeds/character_backdrops.json',
  total: 25,
  batch: 12,
  metaPrompt: (n) => `You are writing ${n} ATMOSPHERIC BACKDROP descriptions for GothBot's character paths (full-body male and female). Each entry is a SHORT phrase (6-12 words) describing an ATMOSPHERIC ENVIRONMENT HINT behind a character. NOT a full landscape — just enough to ground the character in a place without overpowering them.

━━━ THE KEY RULE ━━━
The CHARACTER is the hero, not the background. These are bokeh-level environment hints — blurred edges of a world suggested, never a detailed landscape. Think: what's behind the character in a movie poster, NOT what's in an establishing shot.

━━━ BACKDROP TYPES (enforce variety across ${n}) ━━━
- FOG / MIST (3-4) — fog-choked treeline at frame edges, rolling mist across unseen ground, low moor-fog
- RAIN / STORM (3-4) — rain-slicked cobblestones blurred beneath, storm clouds roiling behind, downpour streaking past
- MOONLIT OUTDOOR (3-4) — moonlit moor stretching to horizon, silver moonlight on distant hills, pale moon low in sky
- FIRELIT / WARM (3-4) — distant bonfire glow through trees, torch-warmth bleeding from unseen source, ember-glow at edges
- DARK / VOID (3-4) — pure darkness with faint smoke wisps, inky void with bokeh ember-specks, absolute shadow
- GRAVEYARD / RUIN HINT (2-3) — blurred headstones in fog behind, crumbling stone edge barely visible, iron fence dissolving into mist
- NATURE / WILD (2-3) — gnarled branches at frame edge, wind-bent grass in foreground blur, dead leaves drifting

━━━ HARD BANS ━━━
- NO recognizable buildings — NO castle, NO cathedral, NO church, NO tower, NO spire
- NO detailed architecture — nothing that would pull Flux into rendering a building
- NO interior settings — no halls, no corridors, no rooms
- Keep entries SHORT — 6-12 words max, atmosphere only

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
