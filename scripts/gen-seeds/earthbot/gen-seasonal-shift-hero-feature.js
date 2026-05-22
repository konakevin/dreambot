#!/usr/bin/env node
/**
 * EarthBot seasonal-shift — HERO FEATURE axis (bespoke, season-tagged).
 *
 * The deep-distance scale-prover. Tiny element in the far distance that
 * proves the vastness of the scene. Season-tagged so autumn rolls get
 * autumn-coded hero features (geese, alpenglow snow-dusted peak, bear)
 * and spring rolls get spring-coded ones (warbler flocks, butterfly cloud,
 * deer fawn).
 *
 * Per playbook: render as postage-stamp / comma-speck scale — NEVER hero
 * size, the seasonal forest is the hero.
 *
 * R0 = 40 (autumn + spring 50/50).
 */
const fs = require('fs');
const { generatePool } = require('../../lib/seedGenHelper');

const outPath = 'scripts/bots/earthbot/seeds/seasonal_shift_hero_feature.json';
// Append mode — scale to 200.

generatePool({
  outPath,
  total: 200,
  batch: 12,
  append: true,
  metaPrompt: (n) => `You are writing ${n} HERO FEATURE entries for EarthBot seasonal-shift. Each entry names ONE tiny deep-distance scale-prover — a small element in the far distance that proves the vast scale of the seasonal landscape. Postage-stamp / comma-speck scale ONLY — NEVER the hero of the frame, the seasonal forest is the hero. Season-tagged so the hero matches the rolled subject's season.

━━━ THE BAR — ONE TINY DISTANT ELEMENT ━━━

A small specific element that makes the wide scene feel HUGE. A comma-speck hawk against the distant alpenglow. A distant tiny lake reflecting the canopy. A small flock of geese in V-formation. A lone deer silhouette across the valley.

━━━ OUTPUT FORMAT — JSON OBJECTS ━━━

{ "tags": ["autumn"], "description": "<one tiny scale-prover, 14-22 words>" }

Season tag MUST be the FIRST tag — ONLY "autumn" or "spring".

━━━ AUTUMN HERO FEATURES (~50%) ━━━

- A comma-speck hawk hovering motionless against the distant alpenglow-flushed peaks above the autumn canopy
- A small V-formation of migrating geese flying high across the autumn valley silhouetted against the sky
- A distant tiny mountain lake nestled deep in the valley reflecting the multi-color autumn slopes
- A lone bull-elk silhouette barely visible at the far edge of a distant meadow at the autumn valley floor
- A tiny snow-dusted peak rising at the deep horizon above the autumn canopy in faint alpenglow
- A small flock of sandhill cranes in V-formation gliding across the distant autumn valley sky
- A comma-speck bald eagle soaring above the distant autumn ridge catching warm sidelight
- A distant tiny autumn meadow clearing visible deep in the valley between mixed forested slopes
- A lone moose silhouette at the far edge of a distant pond reflecting the autumn canopy
- A small distant mountain stream cutting through the valley floor visible as a thin silver thread
- A tiny distant ridge tooth catching warm alpenglow at the deep horizon above the autumn forest
- A comma-speck osprey hovering above the distant autumn valley with wings spread
- A small distant herd of caribou silhouettes barely visible crossing the autumn meadow at the deep valley
- A tiny distant pond reflecting the multi-color autumn canopy in mirror-clean still water
- A faint distant autumn village smoke-plume — NO architecture visible, just a thin ribbon of smoke rising
- A lone distant red-fox silhouette barely visible at the autumn meadow edge at the deep distance

━━━ SPRING HERO FEATURES (~50%) ━━━

- A comma-speck red-tailed hawk soaring above the distant alpenglow-flushed peaks above the spring canopy
- A tiny distant cherry-blossom grove glowing pale pink at the deep horizon above the spring valley floor
- A small distant alpine lake nestled in the valley reflecting the multi-color spring slopes
- A lone deer fawn silhouette barely visible at the far edge of a distant spring meadow
- A small flock of warblers darting between distant flowering trees barely visible at the valley edge
- A comma-speck butterfly cloud hovering above the distant superbloom meadow at the deep valley floor
- A distant tiny spring meadow clearing glowing with wildflower bloom visible deep in the valley
- A lone black-bear-with-cub silhouette barely visible at the far edge of a distant spring meadow
- A tiny distant snowmelt waterfall cascading visible as a thin silver thread at the spring valley wall
- A comma-speck osprey hovering above the distant spring valley with wings spread catching warm light
- A small distant herd of elk silhouettes barely visible crossing the spring meadow at the deep valley
- A tiny distant superbloom patch glowing multi-color at the deep horizon above the spring forest
- A faint distant mountain ridge catching warm spring alpenglow above the flowering valley canopy
- A small distant snowmelt pond reflecting the spring canopy in mirror-clean still water
- A lone distant moose silhouette wading at the far edge of a distant spring meadow pond
- A comma-speck bald eagle circling above the distant spring valley with wings catching the warm sidelight

━━━ ABSOLUTELY BANNED ━━━

- Hero-size subjects (must be comma-speck / postage-stamp scale)
- Humans / hikers / people
- Architecture / cabins / fences / roads / paths
- Sci-fi / fantasy / glowing-eye / floating
- Bioluminescent / phosphorescent
- Made-up species — use real wildlife
- Multiple scale-provers per entry (ONE per entry)
- Lighting / sky / atmosphere details (those are separate axes)
- Color details (color_palette axis)

━━━ OUTPUT FORMAT EXAMPLES — JSON OBJECTS WITH TAGS ━━━

EVERY entry MUST be a JSON OBJECT with "tags" array (containing "autumn" OR "spring") and "description" string. Examples to copy verbatim:

✓ { "tags": ["autumn"], "description": "A comma-speck hawk hovering motionless against the distant alpenglow-flushed peaks above the autumn canopy" }
✓ { "tags": ["spring"], "description": "A comma-speck butterfly cloud hovering above the distant superbloom meadow at the deep valley floor" }
✗ BAD — bare string: "A comma-speck hawk..." (BANNED — must be object with tags)
✗ BAD — missing tags: { "description": "..." } (BANNED — tags required)

━━━ OUTPUT ━━━

JSON array of ${n} OBJECTS — each MUST have shape { "tags": ["autumn"|"spring"], "description": "..." }. No bare strings. No preamble, no markdown.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
