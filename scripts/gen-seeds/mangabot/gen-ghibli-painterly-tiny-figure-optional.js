#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/mangabot/seeds/ghibli_painterly_tiny_figure_optional.json',
  total: 25,
  batch: 25,
  append: true,
  metaPrompt: (n) => `Write ${n} TINY FIGURE entries for a MangaBot ghibli-painterly keyframe. The figure (if present) is a SCALE PROVER at 5-10% of frame, NOT a hero portrait. About 30% of entries should be "NO FIGURE" so the architecture stands alone. NEVER a close-up character.

Each entry: 10-18 words. ONE specific small figure (or absence). MUST be tiny relative to the monumental anchor.

VARIETY (25 bespoke entries):
- 30% NO FIGURE (architecture alone is the hero — 7 of 25 entries should explicitly say "no figure")
- 25% LONE SILHOUETTE on stair/bridge/balcony (small Ghibli-character silhouette walking, gazing, ascending)
- 20% ROBED MONK / SHRINE MAIDEN at archway or shrine (lighting a lantern, sweeping steps, bowing)
- 10% CHILD PROTAGONIST gazing up (Chihiro/Sheeta-coded small figure looking at the spire)
- 10% TRAVELER WITH PACK descending stair (backpack, cloak, walking-stick)
- 5% SPIRIT-CREATURE small in frame (kodama / soot-sprite / firefly-cloud — non-human scale prover)

DO write (each "with figure" entry MUST start with explicit size cue + position):
- A tiny lone figure in white robes stands at the foot of the cathedral steps, dwarfed by the doorway
- A small silhouette of a girl ascending the spiral stair, halfway up the spire, her hair caught by wind
- A robed monk in saffron sweeps the wooden veranda with a long broom, head bowed
- A child gazes up at the floating fortress from the cliff edge, backpack hanging from one shoulder
- A traveler with hat and walking-stick descends the long mountain stair, mid-frame at scale-prover position
- A kodama spirit small in the foreground gazes up at the cathedral, head turned toward the spire
- No figure — the architecture stands alone in the frame, no human presence
- Architecture only — no figure visible
- A shrine maiden in white-and-red lights a single lantern at the torii base, head-height to the post
- A traveling acolyte at the foot of the gate, hat in hand, looking up at the spire above

DO NOT write:
- Hero portrait / close-up character / large character
- Character at 30%+ of frame (this is SCALE-PROVER not portrait)
- Action pose (no fighting / no running)
- Modern clothing
- Western character types

Return ONLY a JSON array of ${n} strings. No preamble.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
