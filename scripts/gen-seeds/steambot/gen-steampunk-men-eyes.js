#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/steambot/seeds/steampunk_men_eyes.json',
  total: 100,
  append: true,
  batch: 25,
  metaPrompt: (n) => `You are writing ${n} STEAMPUNK MAN EYE descriptions for SteamBot's steampunk-man path. Each entry describes specific eye color + intensity — what his eyes do in the gaslight.

Each entry: 8-15 words. ONE specific eye description.

━━━ TONE ━━━
- INTENSE / WEATHERED / INTENT / SHARP / WARY — eyes that have seen things
- Period-accurate — no modern colored-contact-lens fantasy hues
- Realistic eye colors: dark brown, hazel, amber, green, blue, grey, black

━━━ COLOR SPREAD (distribute across ${n}) ━━━
- Dark brown / nearly black (15-18)
- Hazel / light brown (8-10)
- Green / olive-green (6-8)
- Pale blue / steel blue / ice blue (8-10)
- Grey / slate / storm-grey (8-10)
- Amber / honey (3-5)

━━━ DETAILS PER ENTRY ━━━
- Specific COLOR (with shade — "dark mahogany brown" not just "brown")
- INTENSITY descriptor (intent, weary, weathered, sharp, watchful, brooding, calculating, fierce)
- Optional gaslight reaction (catching brass-light, glinting in forge-orange, reflecting gas-flame)

━━━ ABSOLUTELY BANNED ━━━
- NO sexualizing language ("smoldering", "sultry", "bedroom eyes")
- NO supernatural eye colors (no purple, no glowing, no cybernetic — those are different bots)
- NO modern lens references

━━━ EXAMPLES (DO NOT REUSE) ━━━
- "Steel-grey eyes intent and watchful under heavy brow, gaslight catching their cool sharpness"
- "Dark mahogany brown eyes weathered with age, calm and calculating in the forge-light"
- "Pale ice-blue eyes piercing and direct, gaslight reflecting cold metal"
- "Olive-green eyes sharp and intent, faint gold flecks catching brass-light"
- "Amber-honey eyes intense and brooding, candlelit warmth pooling in their depths"

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering, no markdown.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
