#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/gothbot/seeds/facial_features.json',
  total: 25,
  batch: 12,
  metaPrompt: (n) => `You are writing ${n} DISTINCTIVE FACIAL FEATURE descriptions for GothBot's vampire character paths. Each entry is a SHORT phrase (10-18 words) describing a UNIQUE face — bone structure, nose shape, jaw, brow, lip shape, cheekbone prominence, forehead, chin. These are the STRUCTURAL features that make one face look completely different from another, BEFORE any makeup or styling is applied.

━━━ FACE STRUCTURE SPREAD (enforce variety across ${n}) ━━━
- SHARP / ANGULAR (4-5) — razor jawline, severe cheekbones, narrow face, prominent brow ridge, aquiline nose, pointed chin. Faces that cut like glass. Think Tilda Swinton, Cate Blanchett.
- SOFT / ROUND (3-4) — heart-shaped face, rounded jaw, soft cheekbones, button nose, full lips, gentle brow. Faces with warmth that make the vampire-pallor MORE unsettling by contrast.
- STRONG / BROAD (3-4) — wide jaw, prominent cheekbones, strong brow, broad nose bridge, square chin, wide-set eyes. Faces that look powerful and immovable.
- DELICATE / FINE (3-4) — narrow nose, thin lips, fine bone structure, small chin, high forehead, arched brows, elfin proportions. Faces that look almost fragile.
- ASYMMETRIC / UNUSUAL (3-4) — slightly crooked nose, one brow higher than the other, uneven lip fullness, a scar across the bridge of the nose, beauty mark placement, gap teeth. Faces with CHARACTER — the imperfections that make someone memorable.
- DRAMATIC / STATUESQUE (3-4) — deep-set eyes, heavy brow ridge, long face, pronounced nasolabial folds, strong nose, dramatic lip shape. Faces that look carved from marble.

━━━ RULES ━━━
- 10-18 words describing ONLY bone structure and facial proportions
- NO skin color (comes from skin_tones pool), NO hair (comes from hair pools), NO makeup (comes from makeup pool)
- NO ethnicity labels — describe the GEOMETRY of the face, not where she's from (ethnicity pool handles that)
- Every entry should produce a VISUALLY DISTINCT face from every other entry
- Include at least ONE unusual or unexpected detail per entry — the thing that makes THIS face unlike any other
- Think like a portrait artist describing a model's face to a sculptor — pure structure

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
