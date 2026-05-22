#!/usr/bin/env node
/**
 * EarthBot cozy-beach — PHENOMENON axis (v2 pivot, conditional 30%-gated).
 *
 * Soft cozy optical / accent events — not dramatic. Gentle rainbow / soft
 * crepuscular rays / drifting butterflies / gull-flock in flight.
 *
 * R0 = 25.
 */
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/earthbot/seeds/cozy_beach_phenomenon.json',
  total: 100,
  batch: 10,
  append: true,
  metaPrompt: (n) => `You are writing ${n} COZY PHENOMENON entries for EarthBot cozy-beach (v2). Each entry describes ONE soft cozy optical / accent event. 30%-gated.

━━━ ABSOLUTELY BANNED ━━━

- Fire-rainbow / fantasy / sci-fi
- Bioluminescent / phosphorescent
- Single beam / single shaft
- Multiple phenomena per entry (ONE only)
- Dramatic weather / lightning / storms
- Architecture / humans
- Subject / water / sky / light details

━━━ OUTPUT FORMAT — JSON STRINGS ━━━

Output a JSON array of STRINGS, 12-22 words each.

━━━ PHENOMENON TYPES ━━━

- A small gentle rainbow arcing softly above the horizon in post-storm clearing
- Soft crepuscular rays plural fanning warm gold through palm fronds onto the foreground sand
- A few butterflies fluttering past in the foreground in soft warm light
- A drift of falling tropical petals carried by gentle breeze across the foreground
- A small flock of seabirds gliding past at gentle altitude
- A soft sun-dog visible flanking the sun in the warm afternoon sky
- A delicate halo ring visible around the sun overhead
- A pair of dragonflies hovering at the foreground sand
- A few swallows darting past at golden-hour
- Soft drifting cotton-like seed pods carried in warm breeze across the foreground

━━━ EXAMPLES ━━━

✓ "A small gentle rainbow arcing softly above the horizon in post-storm clearing"

✓ "Soft crepuscular rays plural fanning warm gold through palm fronds onto the foreground sand"

✓ "A few butterflies fluttering past in the foreground in soft warm light"

✓ "A drift of falling tropical petals carried by gentle breeze across the foreground"

✓ "A small flock of seabirds gliding past at gentle altitude"

━━━ OUTPUT ━━━

JSON array of ${n} STRINGS. ONE soft cozy accent per entry. No preamble, no markdown, no JSON keys — just strings.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
