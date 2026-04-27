#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/oceanbot/seeds/mermaid_legend_moments.json',
  total: 50,
  batch: 50,
  metaPrompt: (n) => `You are writing ${n} MERMAID MOMENT descriptions for OceanBot's mermaid-legend path. These are what the mermaid is DOING when glimpsed — mysterious, beautiful, alluring in the way old sailors described. She is a small figure within a vast ocean scene, not a close-up portrait.

Each entry: 15-25 words. A specific moment — what the mermaid is doing and how she appears in the scene.

━━━ CATEGORIES TO COVER ━━━
- Singing on distant rocks, mouth open, hair streaming in the wind, barely visible through spray
- Tail disappearing beneath dark waves, leaving a trail of phosphorescent ripples behind
- Silhouetted on a sea stack against a full moon, arms raised, hair cascading
- Half-submerged in a tidal pool, watching a passing ship with luminous unblinking eyes
- Draped across a reef at low tide, combing long wet hair with a shell comb
- Diving from a cliff into deep water, iridescent tail catching the last light
- Floating on her back in calm moonlit water, tail fin breaking the surface lazily
- Perched on the figurehead of a ghost ship, looking out to sea, tail curled around the prow
- Rising from a wave crest, water cascading off her shoulders, gone before the next swell
- Visible beneath the surface as a glowing shape, seen from a ship's rail looking down
- Sitting on a barnacle-covered rock, examining a drowned sailors compass by moonlight
- Slipping off a rock into dark water as a lighthouse beam sweeps past, just missed

━━━ RULES ━━━
- She is BEAUTIFUL and ALLURING — the legend demands it
- She is mysterious — half-seen, glimpsed, never fully revealed
- She is part of the ocean, not separate from it
- Mix dangerous siren energy with haunting beauty
- Some moments are serene, some are ominous

━━━ DEDUP DIMENSIONS ━━━
Deduplicate by: action verb + position (surface/submerged/rock/air) + mood (serene/ominous/alluring).

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
