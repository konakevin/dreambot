#!/usr/bin/env node
/**
 * EarthBot cozy-beach — WATER STATE axis (v2 pivot).
 *
 * Calm soft tropical shore water. Gentle / reflective / mirror-glass.
 *
 * R0 = 30.
 */
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/earthbot/seeds/cozy_beach_water_state.json',
  total: 200,
  batch: 12,
  append: true,
  metaPrompt: (n) => `You are writing ${n} WATER STATE entries for EarthBot cozy-beach (v2 — intimate beach moments). Each entry describes ONE calm soft tropical water state at the shore. NEVER dramatic surf.

━━━ ABSOLUTELY BANNED ━━━

- Crashing waves / dramatic surf / big waves
- Bioluminescent / sci-fi
- Architecture / village
- Subject details / sky details
- Humans

━━━ OUTPUT FORMAT — JSON STRINGS ━━━

Output a JSON array of STRINGS, 12-22 words each.

━━━ WATER STATE TYPES ━━━

- Gentle shorebreak ripples curling softly at the foreground sand
- Mirror-glass calm tropical lagoon at the foreground edge
- Soft surf foam spilling slowly into warm sand foreground
- A wet-sand mirror at low tide reflecting the warm sky
- Calm soft turquoise water at the foreground tide line
- Glass-smooth tropical water at the foreground edge
- Gentle wavelets at the foreground sand, calm tropical lagoon beyond
- A shallow tide-pool of glass-still water at the foreground
- Soft golden-glint shimmer across calm tropical water at the foreground
- A thin band of foam ribbon at the foreground sand line
- Crystal-clear gentle shorebreak at the foreground

━━━ EXAMPLES ━━━

✓ "Gentle shorebreak ripples curling softly at the foreground sand"

✓ "Mirror-glass calm tropical lagoon at the foreground edge"

✓ "Soft surf foam spilling slowly into warm sand foreground"

✓ "A wet-sand mirror at low tide reflecting the warm sky"

✓ "Gentle wavelets at the foreground sand, calm tropical lagoon beyond"

✓ "Soft golden-glint shimmer across calm tropical water at the foreground"

✓ "A thin band of foam ribbon at the foreground sand line"

━━━ OUTPUT ━━━

JSON array of ${n} STRINGS. Calm gentle tropical shore water only. No preamble, no markdown, no JSON keys — just strings.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
