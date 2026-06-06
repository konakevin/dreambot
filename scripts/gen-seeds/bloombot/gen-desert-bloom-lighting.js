#!/usr/bin/env node
/**
 * BLOOMBOT_DESERT_BLOOM_LIGHTING — path-bespoke lighting pool that
 * filters out wet/snow/ice/sci-fi lighting entries. Southwest desert
 * + wildflower bloom scenes need dramatic, warm, vivid light. Golden
 * hour rays through saguaro silhouettes, chiaroscuro, dappled cactus
 * shadow, monsoon-storm beam, etc.
 */
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/bloombot/seeds/bloombot_desert_bloom_lighting.json',
  total: 200,
  batch: 25,
  maxTokens: 8000,
  append: true,
  metaPrompt: (
    n
  ) => `You are writing ${n} LIGHTING entries for BloomBot's desert-bloom path — southwest-desert + wildflower-explosion scenes with vivid Sonoran-sunset palette. Each entry is one descriptive line, 18-30 words, naming the light source + direction + how it falls on blooms + petals.

━━━ THE BAR ━━━
Every entry names a SPECIFIC lighting condition that fits a hot, dry, dramatic southwest desert (not wet / snow / ice). The light interacts with wildflowers (petals, carpets, blooms) AND desert landforms (saguaro, mesa, red rock). Tones run warm: golden, amber, copper, rose-gold, blazing white, deep cobalt twilight, magenta sunset. Storm light + monsoon light + lightning are allowed (the SW gets monsoons).

━━━ EXAMPLE PHRASINGS (mirror this register) ━━━
"golden-hour backlight slicing through translucent petals from low side angle, blooms glowing from within, long warm shadows raking across the foreground"
"chiaroscuro Rembrandt directional light from the left, deep velvet shadows on the right, blooms catching the light edge-lit"
"stormy moody dramatic clouds with a single beam of direct light breaking through, dramatic spotlight on the central bloom mass"
"amber sunset rim-light raking from behind, every bloom edge ignited in fire, deep red shadows in the cores"
"high-noon overhead sun, vertical light, every bloom flat-lit but jewel-saturated, sharp short shadows"
"noir-style single hard side-light, deep absolute black shadows, every bloom carved in light/dark contrast"

━━━ VARIETY MANDATE (distribute across these light moods) ━━━
- ~3 GOLDEN-HOUR (low warm raking light / amber sunset rim / honey-glow side-light / molten gold backlight / pre-sunset glaze)
- ~3 HIGH-NOON / BLAZING (hard overhead sun / blazing white noon / vertical light, short shadows / harsh tropical sun)
- ~3 STORM / DRAMATIC (monsoon storm with light-beam break / single beam through clouds / dramatic god-ray / theater-spotlight beam / shaft of light through storm)
- ~3 BLUE-HOUR / TWILIGHT (deep cobalt dusk / twilight blue ambient / indigo afterglow / blue-hour velvet)
- ~3 CHIAROSCURO / SIDE-LIGHT (Rembrandt side-light / hard directional left-light / single key-light noir / contrasty edge-lit)
- ~2 DAPPLED / FILTERED (dappled saguaro shadow / mesquite-canopy filter / cholla-spine halo dapple)
- ~2 MOONLIGHT / SILVER (full-moon silver wash / desert moonbeam / cool blue moonlight, blooms in silver glow)
- ~2 LIGHTNING / FLASH (lightning-flash freeze-frame / sheet-lightning edge-light / heat-lightning glow)
- ~2 DAWN / MORNING (dewdrop dawn / pre-dawn pink wash / first-rays horizontal beam / pearl-grey morning)
- ~2 SPOTLIGHT / KEY-LIGHT (single hard key on hero bloom / theatrical down-light / cone of light from above)
- ~1 BACKLIT TRANSLUCENT (every petal lit through from behind, jewel-glow)
- ~1 RAINBOW-AFTER-RAIN (rare monsoon rainbow arc with warm sidelight)
- ~1 STAR-FIELD AMBIENT (deep night with milky-way glow lighting blooms below)
- ~1 FIRE / LANTERN GLOW (campfire warm flicker / paper-lantern soft glow / brazier warm pulse)

━━━ BANS ━━━
- NO ICE / SNOW / FROST lighting (this is desert — never).
- NO RAIN / WET-SURFACE / PUDDLE-REFLECTION lighting (the desert is DRY).
- NO sci-fi / neon / cyberpunk / laser / hologram lighting.
- NO bare "warm light" — name source + direction + how it lands on the blooms.
- NO photographer-name drops (no Marc Adamus / no Peter Lik / etc.).
- NO repeating the same exact lighting condition across entries.

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering, one entry per string.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
