#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/gothbot/seeds/vampire_menace_features.json',
  total: 100,
  batch: 25,
  metaPrompt: (n) => `You are writing ${n} VAMPIRE MENACE-FEATURE descriptions for GothBot's vampire-girls-2 path. Each entry is the PRIMARY face description for one render — eye-color + glow + heavy gothic eye makeup + lip color + skin tone + ONE demonic tell, woven into a single phrase. Each entry: 25-40 words, comma-separated phrases, no preamble.

CALIBRATION — these 17 hardcoded entries drove the QA-loop wins (Round 13 was the breakthrough). Match their structure, vocabulary, and intensity exactly. Generate ${n} new entries in the same lineage:

REFERENCE ENTRY 1: "glowing crimson eyes radiating inner red light, HEAVY caked-on jet-black eyeshadow piled thick on the lid, severe dark eyebrow, oxblood matte lips, DEAD-PALE corpse-blue-tinted skin, single sharp fang visible at her lip"
REFERENCE ENTRY 2: "glowing sapphire-blue eyes radiating cold luminous light, HEAVY thick jet-black smoky-eye on the lid, severe dark brow, oxblood matte lips, ASH-GREY corpse-pallid skin, single sharp fang visible at her lip"
REFERENCE ENTRY 3: "glowing amber-gold eyes with hourglass-slit pupils radiating molten light, HEAVY caked-on charcoal eyeshadow, severe dark eyebrow, blood-red matte lips, DEAD-PALE alabaster corpse-skin, clawed black-lacquered fingertips"
REFERENCE ENTRY 4: "glowing void-violet eyes with no whites — full void-black sclera with iris centers radiating violet light, HEAVY thick jet-black smoky-eye, severe dark brow, jet-black matte lips, ASH-PALE corpse-skin"
REFERENCE ENTRY 5: "glowing crimson eyes with hourglass-slit pupils radiating predator light, HEAVY caked-on jet-black eyeshadow piled thick, severe dark brow, oxblood matte lips, DEAD-PALE alabaster corpse-skin, two sharp fangs visible against the lip"

━━━ THE FORMULA (every entry must hit these 6 elements) ━━━
1. EYE GLOW — "glowing [color] eyes radiating [quality] light" — color variety (crimson / sapphire-blue / amber-gold / fel-green / magenta-red / void-violet / necrotic-white / ember-gold / electric-purple / mercury-silver / cyan-deep-ocean / bright-yellow / violet / rose-quartz / emerald / copper-red / chrome-silver). Optional: hourglass-slit pupils, vertical-slit demon pupils, full void-black sclera, thin gold-rim iris.
2. HEAVY DARK EYE MAKEUP — "HEAVY caked-on [color] eyeshadow piled thick on the lid" or "HEAVY thick black smoky-eye on the lid" — the makeup is theatrical-club-goth intensity, NOT subtle.
3. SEVERE DARK BROW — "severe dark eyebrow" or "severe sharp dark brow" — sharp, dark, dramatic.
4. DARK LIPS — "oxblood matte lips" or "blood-red matte lips" or "jet-black matte lips" — matte and dark.
5. DEAD-PALE SKIN — "DEAD-PALE corpse-blue-tinted skin" or "ASH-GREY corpse-pallid skin" or "ASH-PALE corpse-skin" — undead-pale, NOT alive-healthy.
6. ONE DEMONIC TELL (optional but encouraged) — "single sharp fang visible at her lip" / "two sharp fangs visible" / "clawed black-lacquered fingertips" / "demon-slit pupil" / no separate tell on some entries (the eye glow alone is the tell).

━━━ ABSOLUTE BANS ━━━
- NO "blown across the orbital bone", NO "spilling onto cheekbones", NO "casting paint" — those flow verbs trigger Flux clown-stripe paint-drip interpretations
- NO "painted-on tear streak", NO "ritual face paint stripes", NO clown-stripe makeup
- NO "elf ears", NO "pointed ear cartilage", NO fantasy-creature ear shapes
- NO "gaunt", NO "skeletal", NO "hollow eye sockets" — DEAD-PALE but NOT undernourished
- NO "pretty" / "alluring" / "alive-looking" — she IS DEAD
- NO face-type archetypes ("sharp-jawed", "broad-cheekboned") — Kevin rejected those
- NO bare lips / no "natural lips" — lips MUST be dark matte
- NO "subtle smoky-eye" / "soft eyeshadow" — makeup is HEAVY
- NO horns
- NO blood splatter, NO bloody handprints, NO gore (a single elegant blood drop at the lip corner is OK)

━━━ DEDUP DIMENSIONS ━━━
Deduplicate by: eye color + makeup color + lip color + tell. Two entries are too similar if they share more than 2 of these. Spread the eye colors across the full palette (don't generate 30 crimson entries).

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering, no markdown.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
