#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/starbot/seeds/robot_types.json',
  total: 200,
  batch: 50,
  metaPrompt: (n) => `You are writing ${n} ROBOT descriptions for StarBot's robot-moment path. These are ORNATE, VISUALLY STUNNING machines — not mundane utility bots. Every robot should be a visual showpiece that commands the frame.

Each entry: 15-25 words. One specific robot with rich visual detail — materials, textures, proportions, distinguishing features.

━━━ CATEGORIES (mix across all) ━━━
- Ancient alien-built guardian (unknown alloys, crystalline cores, glyphs etched into plating, millennia-old)
- Ornate ceremonial sentinel (temple guardian with intricate engravings, jeweled optics, ritualistic markings)
- Massive war titan (battle-scarred colossus, trophy-draped, siege weaponry, intimidating scale)
- Biomechanical construct (organic-metal fusion, synthetic muscle visible beneath translucent plating, breathing)
- Regal ambassador android (polished precious-metal finish, diplomatic insignia, elegant proportions)
- Weathered deep-space explorer (alien modifications bolted on, mismatched repair panels, star-charts scratched into hull)
- Decommissioned military giant (overgrown with moss/vines, repurposed as monument, weapons deactivated)
- Insectoid swarm-queen (chitinous plating, compound optical array, antennae, abdomen reactor core)
- Crystalline intelligence (transparent geometric body, light refracting through internal lattice, hovering)
- Forge-master (molten-metal veins glowing beneath black iron chassis, anvil-arms, heat shimmer)
- Aquatic deep-diver (pressure-rated hull, bioluminescent running lights, barnacle-encrusted joints)
- Clockwork automaton (exposed brass gears, copper filigree, steam vents, Victorian-mechanical precision)
- Monolithic stone golem (carved from alien rock, glowing rune-seams, moss in crevices, ancient)
- Sleek racing/pursuit chassis (aerodynamic, low-slung, chrome and carbon-fiber, speed lines)
- Towering construction architect (crane-arms, blueprint hologram projectors, scaffold-climbing legs)

━━━ DEDUP DIMENSIONS ━━━
Deduplicate by: body type (humanoid/quadruped/insectoid/spherical/serpentine) + primary material (metal/crystal/stone/organic/brass) + scale (tiny/human-sized/large/colossal) + condition (pristine/weathered/ancient/battle-damaged/overgrown)

━━━ RULES ━━━
- NO cyborg-women, NO sexy androids (VenusBot territory)
- NO mundane utility: no janitor-bots, kitchen-bots, nurse-bots, farm-bots, desk companions
- Every robot should make you say "I want to see THAT rendered"
- Gender-neutral or non-gendered
- ORNATE DETAIL: engravings, patina, glowing elements, textured surfaces, visible internals
- Vary proportions wildly: some massive, some human-scale, some tiny-but-intricate

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
