#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/mechbot/seeds/alien_biomech_settings.json',
  total: 200,
  batch: 50,
  metaPrompt: (n) => `You are writing ${n} HABITAT descriptions for MechBot's alien-biomechs path. Each describes WHERE the biomech is in 14-22 words. Eerie habitats where flesh-machine creatures live.

━━━ SETTING CATEGORIES ━━━
- Alien hive interior (resin-coated walls, organic-machine architecture, dim glow)
- Derelict ship overgrown with biomass (corridors taken by alien growth)
- Bioluminescent cave (pools of glowing fluid, hanging organic stalactites)
- Coral-reef-on-land alien growth zone (huge organic structures, dust-of-spores)
- Subterranean nesting chamber (pods clustered, fluid drips, hive-resin floor)
- Surface of an alien moon (crystal-fungus forest, low gravity, two suns)
- Bone-and-cable swamp (waist-deep mire, biomech-skeleton trees, mist)
- Decaying alien shipwreck (biomech vehicle long-dead, creatures emerged from it)
- Crystalline atmospheric layer (creature suspended in glowing aerosol, dust-stars)
- Coolant-pool reservoir (creature emerging from / submerged in machine-fluid lake)

━━━ ATMOSPHERIC ELEMENTS ━━━
- Bioluminescence at multiple distances (organ glow / wall glow / pool glow)
- Mist / spore-dust / coolant-fog
- Alien wrongness (asymmetric architecture, flesh-machine seams, organic geometry)
- Suggestive scale (huge tunnel for a small creature / tiny cradle for a big one)

━━━ EXAMPLES (write fresh) ━━━
- "Alien hive interior with resin-coated walls, dim purple bioluminescence, hanging tendril-stalactites dripping fluid"
- "Bioluminescent cave with pools of glowing teal fluid, organic stalactites pulsing, mist hanging at knee level"
- "Derelict freighter corridor taken by biomass, exposed cabling fused with vine-like growth, sodium emergency lights still cycling"

━━━ DEDUP DIMENSIONS ━━━
Deduplicate by: habitat type + dominant atmospheric element + glow color/source.

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
