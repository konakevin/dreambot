#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/gothbot/seeds/vampire_male_candid_moments.json',
  total: 25,
  batch: 12,
  metaPrompt: (n) => `You are writing ${n} MALE VAMPIRE CANDID MOMENT descriptions for GothBot's vampire-boys path. Each entry is a SHORT phrase (6-12 words) describing a MICRO-ACTION a male vampire was caught doing in an extreme macro face close-up. These are paired with separate archetype/makeup/wardrobe pools.

GENDER: These are for MALE vampires. Use HIS/HE pronouns where needed. Never use "her" or "she".

━━━ MOMENT CATEGORIES (enforce variety across ${n}) ━━━
- PREDATOR STILLNESS (5-6) — completely frozen mid-thought like a wax figure, head cocked at unnaturally still angle, pupils tracking something past the camera, jaw clenched in ancient restraint
- ATMOSPHERIC (5-6) — snow melting on his corpse-cold skin, fog curling around his jaw, frost forming on his stubble, wind catching his hair across one eye
- MICRO-EXPRESSIONS (5-6) — half-smile at something centuries old, nostril-flare of contempt, slight grimace revealing fangs, eyes narrowing at distant sound
- PHYSICAL TICS (4-5) — cracking his neck with deliberate slowness, running one finger along his own jaw, pressing his temple recalling something painful, drumming one fingernail on his collarbone
- CATCH-MOMENTS (4-5) — mid-exhale of breath he doesn't need, mid-turn toward a sound behind him, eyes shifting focus to something behind you, caught mid-blink for the first time in hours

━━━ RULES ━━━
- Each moment must work for an EXTREME FACE CLOSE-UP — no body actions, no walking, no reaching for things
- MASCULINE energy — predatory, controlled, dangerous. NOT brooding-romantic, NOT smoldering
- Use HIS/HE pronouns, NEVER her/she
- SAFETY: no blood, no feeding, no biting, no violence, no victims

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
