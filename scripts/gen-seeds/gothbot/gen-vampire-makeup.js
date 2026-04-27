#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/gothbot/seeds/vampire_makeup.json',
  total: 25,
  batch: 12,
  metaPrompt: (n) => `You are writing ${n} VAMPIRE MAKEUP descriptions for GothBot's vampire portrait paths. Each entry is a SHORT phrase (15-25 words) describing a specific dramatic makeup look on a vampire face. These compose with separate archetype/hair/skin pools — describe ONLY the makeup.

These are ANCIENT IMMORTALS. The makeup is INTENTIONAL, SHARP, APPLIED WITH PURPOSE. NOT melting, NOT dripping, NOT running, NOT crying. Think: a centuries-old being who applies their war-paint with terrifying precision.

━━━ MANDATORY VARIETY SPREAD ━━━
- BOLD GRAPHIC KOHL (5-6) — heavy black kohl around eyes, sharp geometric liner, Egyptian/ancient eye-painting traditions, thick dramatic rings or cat-eye shapes. Clean and deliberate, not smudged.
- CARVED CONTOUR / SHADOW (4-5) — extreme sculpted cheekbones, hollowed temples via dark contour, face geometry emphasized through shadow-placement. The makeup makes the bone structure MORE extreme.
- DARK COUTURE EDITORIAL (4-5) — high-fashion dark beauty: matte black lip, metallic eye, graphic shapes, avant-garde placement. Sharp editorial looks that belong on a vampire runway. Clean application.
- MINIMAL / BARE-FACED (3-4) — almost no visible makeup, raw bare skin, natural chapped lips, dark circles from centuries of not sleeping. The horror IS the bare face — nothing hiding the dead skin beneath. Lips described as: bloodless, cracked, wind-chapped, colorless, bitten-raw.
- WAR-PAINT / TRIBAL (3-4) — deliberate dark marks across the face like ancient warrior markings, bold stripes or geometric patterns across cheekbone or brow. Applied with fingers, thick and intentional.
- SMOKE / HAZE (3-4) — heavy smokey eye in dark tones blown wide around the socket, diffused edges fading into skin. NOT dripping — BLENDED. Like charcoal rubbed into skin by hand.

━━━ LIP RULES — ENFORCE VARIETY ━━━
At least 5 entries must have BARE/NATURAL/COLORLESS lips (bloodless, cracked, pale, chapped, bitten-raw).
At least 3 entries must have NO lip mention at all (eyes-only looks).
Remaining entries can have dark lips (black, oxblood, deep plum) but NEVER more than 10 of ${n} total.
NEVER "perfect" lipstick. Dark lips should be matte, cracked, stained, or bitten — never glossy or pristine.

━━━ HARD BANS ━━━
- NO dripping, NO streaking, NO running, NO melting, NO bleeding makeup
- NO "mascara tears", NO "crying", NO "rain-streaked"
- NO KISS-band makeup (symmetric black circles covering entire eye area)
- NO face-paint, NO skull-paint, NO clown, NO ICP
- NO "slept-in" or "reapplied over itself" — these are PRECISE beings
- NEVER describe the look as "messy" or "deconstructed"

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
