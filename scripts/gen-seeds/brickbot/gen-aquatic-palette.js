#!/usr/bin/env node
/**
 * BRICKBOT_AQUATIC_PALETTE — themed 3-4-color LEGO palettes for aquatic
 * surface + submerged dioramas. Audit 2026-06-05: 50 → 200.
 */
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/brickbot/seeds/brickbot_aquatic_palette.json',
  total: 200,
  batch: 25,
  append: true,
  metaPrompt: (n) => `You are writing ${n} PALETTE entries for BrickBot's aquatic path — cohesive 3-4-color stories unifying a SURFACE or SUBMERGED brick aquatic diorama. Each entry is ONE 14-22 word phrase: theme name + colors + a short cohesion-tail.

━━━ THE BAR ━━━
Every entry names a THEME (Atlantis-treasure / Aquazone / kelp-forest / lagoon-paradise / wreck-deep / arctic-pack-ice / mangrove-delta / etc.) PLUS specific brick color names (sand-blue / dark-azure / trans-cyan / pearl-gold / sand-green / coral / dark-teal / trans-orange / dark-bley / etc.) PLUS short cohesion-tail. Read CLEAN — 3-4 main colors max.

━━━ VARIETY MANDATE (distribute across categories) ━━━
- ~5 SUBMERGED REEF / DEEP — coral garden / kelp / trench / abyss / sun-shaft column
- ~5 SURFACE COAST / BEACH / LAGOON — tropical paradise / harbor / fishing-village / surf-line / pier
- ~3 WRECK / SUNKEN-SHIP — galleon-rust / coral-encrusted hull / treasure-glint / abandoned-deep
- ~3 LEGO-FACTION HERITAGE — Atlantis / Aquazone / Aquanauts / Aquasharks / Aquaraiders / Deep-Sea Explorers
- ~3 POLAR / ICY — arctic ice-shelf / glacier-calving / aurora-sea / frozen-bay
- ~3 LAGOON / TROPICAL — coral-pink / aqua + lime / paradise palette / palm-and-sand
- ~3 STORMY / GLOOMY — squall / fog-grey / overcast harbor / monsoon
- ~2 BIOLUMINESCENT / DEEP-DARK — anglerfish-glow / vent-cyan / jellyfish-pink / abyssal trans-glow
- ~2 SUNSET / DAWN — coastal sunset / dawn-mist / dusk-pink / morning-amber
- ~1 KELP-FOREST / GREEN — sand-green + dark-blue + trans-cyan
- ~1 MANGROVE / DELTA — silt-brown + dark-green + brackish blue

━━━ FORMAT ━━━
Each entry: ONE phrase "<Theme> palette — <color>1 + <color>2 + <color>3 (+ <color>4), <cohesion tail>". Use legitimate LEGO color names where natural. Touchpoints:
"Atlantis Treasure palette — pearl-gold + dark-teal + trans-orange + dark-blue, relic-rich and adventurous, golden temple-gate glinting against teal stonework"
"Tropical Lagoon palette — bright-coral + aqua + sand + lime, sweet paradise-postcard, palm fronds over turquoise tile-water"
"Wreck-Deep palette — rust-brown + dark-grey + dark-teal + trans-orange, forgotten galleon under coral-encrusted murk"

━━━ BANS ━━━
- NO more than 4 main colors per palette
- NO photoreal vocab
- NO mood-modifier as colors ("happy-yellow")
- NO "rainbow" / "any-color" palettes — every entry is THEMED
- NO duplicating themes; vary across categories

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering, one entry per string.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
