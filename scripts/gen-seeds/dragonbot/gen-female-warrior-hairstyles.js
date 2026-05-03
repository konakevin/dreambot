#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/dragonbot/seeds/female_warrior_hairstyles.json',
  total: 100,
  append: true,
  batch: 12,
  metaPrompt: (n) => `You are writing ${n} HAIRSTYLE entries for DragonBot's female-warrior path. Each entry is a SHORT phrase (10-22 words) describing the EXACT hairstyle for a battle-ready fantasy warrior woman — practical, weathered, often tied for combat, sometimes loose for ceremony.

━━━ STYLE SPREAD (enforce variety across ${n}) ━━━
- BATTLE-PRACTICAL BRAIDS (5-6) — thick warrior-braid down one shoulder bound with leather thongs and small bone-beads, tight Norse-style boxer-braids close to the scalp, fishtail braid pulled forward over a pauldron, double battle-braids tucked under a leather collar, single thick rope-braid with iron-ring bindings every few inches
- WIND-CAUGHT / LOOSE (4-5) — long hair caught wild in dragon-wind tangling around a iron circlet, loose waves blown back from a cliff-stand reveal, undone curls escaping a half-failed war-bun, tousled long hair with a few stray strands stuck to a sweat-damp brow from battle, salt-tangled long hair from too many days at the prow
- PINNED / CEREMONIAL (4-5) — tall pinned-up war-crown with iron-and-bone hairpieces, half-up Highland fall pinned with a tarnished silver dragon-clasp, intricate updo with a small stone-circle ornament, formal court-style chignon with gold-leaf trim, rune-pinned bun tight enough for combat
- SHORT / CROPPED / EDGED (4-5) — sharp warrior-bob with a battle-cut fringe, pixie-cut close at the sides shaved with rune-tracks, jaw-length asymmetrical bob from a cut-short campaign, choppy short cut singed unevenly from dragon-fire, undercut with a topknot of remaining hair
- WAR-MARKED / SIGNATURE (3-4) — head shaved on one side and long-braided on the other, single-blue-streak braided through the center, war-paint smudged through the part-line, ash-and-blood crusted in a single front-lock from a recent kill

━━━ RULES ━━━
- Each entry is a VIVID hairstyle with a FANTASY-WORLD detail (bone-bead, iron-ring, dragon-wind, war-paint, rune-track, etc.)
- Style-diverse — do NOT cluster on braids
- Practical for combat or ceremonial intent — explain WHY this style on a warrior
- No modern hair (no balayage, no beach-waves alone)
- Specific to FEMALE warriors

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
