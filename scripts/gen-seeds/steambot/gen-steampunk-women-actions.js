#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/steambot/seeds/steampunk_women_actions.json',
  total: 100,
  batch: 25,
  metaPrompt: (n) => `You are writing ${n} STEAMPUNK WOMAN ACTIONS for SteamBot's sexy-steampunk-woman path. Each entry is JUST what she's DOING — a candid mid-action verb-phrase. NO setting. NO background. NO outfit. NO cleavage/skin language. Just the action.

Each entry: 8-15 words. ONE specific action she's caught performing.

━━━ ACTION CATEGORIES (mix broadly) ━━━
PILOT / NAVIGATE: gripping brass helm wheel, adjusting altimeter, calculating bearing on parchment, sighting through brass sextant, plotting course on illuminated map table, throttling steam-engine lever
MECHANICAL: oiling brass-prosthetic gauntlet, tightening copper rivet with pneumatic wrench, calibrating pressure-gauge with screwdriver, soldering circuit, welding seam with brass torch, replacing gear-train, fixing piston, hammering bronze plate
WEAPONS: loading brass cartridge into rifle, sheathing brass-handled cutlass, cleaning steam-revolver, drawing twin pistols mid-motion, sharpening blade on whetstone, aiming through brass-scope rifle
ALCHEMY / SCIENCE: pipetting glowing tincture, watching alembic bubble, lighting bunsen-burner, mixing copper-crucible reagents, examining specimen under brass microscope, recording experiment in leather notebook
INVENTION / DESIGN: sketching blueprint at slanted desk, measuring with brass calipers, assembling clockwork prototype, threading brass spring into gear-housing, polishing telescope-lens
ESPIONAGE / STEALTH: picking brass lock with pin-tools, decoding cipher at desk, peering through keyhole-spyglass, adjusting cybernetic-eye, hiding behind brass column
COMMAND / LEADERSHIP: pointing across map at strategy table, signing parchment order with feather-pen, surveying troops from balcony, dictating to telegraph-clerk
PERFORMANCE / ARTISAN: tuning brass instrument, painting portrait at easel, conducting clockwork orchestra, polishing automaton, demonstrating invention to crowd
DAILY MOMENT: sipping tea while reading mechanical-encyclopedia, adjusting hairpin at vanity, lighting cigarette from gaslamp, bookmarking leather tome, fastening corset-laces, polishing brass goggles, winding pocket-watch

━━━ HARD BANS ━━━
- NO setting/background description (that's a SEPARATE pool)
- NO outfit description (that's the wardrobe pool)
- NO skin/cleavage/voyeuristic language
- NO "her", "she" — just write the verb-phrase. Ex: "gripping brass helm wheel mid-storm"
- NO multiple actions per entry — ONE action per entry

━━━ EXAMPLES (DO NOT REUSE) ━━━
- "gripping brass helm wheel mid-storm, knuckles white on polished spokes"
- "soldering copper circuit with brass iron, sparks dancing across goggles"
- "picking ornate brass lock with pin-tools, ear pressed to mechanism"
- "loading brass shells into steam-rifle one-handed, eyes scanning horizon"
- "sketching airship blueprint with feather-pen, ink-stained fingers steady"

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
