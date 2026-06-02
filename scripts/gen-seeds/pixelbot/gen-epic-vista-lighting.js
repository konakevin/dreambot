#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/pixelbot/seeds/epic_vista_lighting.json',
  total: 200,
  batch: 50,
  append: false,
  maxTokens: 6000,
  metaPrompt: (
    n
  ) => `Write ${n} LIGHTING descriptions for PixelBot's epic-vista path (Final Fantasy VI airship-flyover / Chrono Trigger world-map / Lufia II / Secret of Mana / Terranigma 16-bit-era panoramic vista aesthetic — used as inspiration only, never named in output).

Each entry is 15-30 words. EVERY entry must include:
- DRAMATIC LANDSCAPE LIGHTING — sunset gold-and-orange / sunrise pink-and-cream pastels / golden-hour amber / dawn-pearl morning / dusk-amber / blue-hour twilight / moonlit-blue night / aurora-ribbon night / starlit cosmic / storm-break god-ray / midday-clear blue-sky / overcast-cool / volcanic-orange-glow / alien-twin-moon
- SATURATED SNES-ERA palette — RICH chunky color blocks (emerald-greens / royal-blues / sunset-amber / cosmic-violet / desert-amber / snow-cyan / volcanic-orange / aurora-pink-cyan)
- 16-BIT CHUNKY PIXEL feel — visible dithered shadow edges, no smooth gradients

NEVER soft / pastel / wispy / smoothly-fading / airbrushed light. ALWAYS chunky, hard-edged, saturated.

Examples (write fresh):
- "Sunset gold-and-orange raking across the panoramic vista, chunky-edge sun-disc on the horizon, deep purple-shadow on foreground terrain, dithered amber-cloud edges."
- "Aurora-ribbon night with pink-and-cyan ribbons across deep blue-black sky, dithered northern-light edges, foreground in cool-blue ambient, lit cabin-window glowing warm-amber."
- "Mode-7 airship-flyover at golden-hour amber, dithered cloud-fade with chunky edges, sun-rays piercing through, foreground rim-lit in warm-yellow, distant peaks in cool-violet shadow."
- "Storm-break with single god-ray piercing dark cumulus clouds, raking light hitting middle-distance peaks, deep blue-black ambient, dithered cloud-bank edges."
- "Twilight blue-hour with chunky-edge moon-disc rising over peaks, foreground in cool-violet shadow, dithered shadow-gradients, warm-amber lit-cabin window in middle distance."
- "Volcanic-orange glow rising from molten rivers, dithered ember-trails, deep blackened-stone foreground, far backdrop ash-cloud sunset-red sky."
- "Alien twin-moons rising in starfield, cool cyan-violet ambient on alien-jungle, dithered nebula-shadow edges, drifting magical motes catching cosmic light."
- "Pink-pearl sunrise across cherry-blossom valley, dithered cloud-edge in soft warm-amber, far peaks fading to lavender-haze, dappled god-rays through canopy."

Output ONLY a valid JSON array of ${n} strings. No preamble, no commentary, no markdown code fences.`,
}).catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
