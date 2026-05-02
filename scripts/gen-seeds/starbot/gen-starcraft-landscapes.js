#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/starbot/seeds/starcraft_landscapes.json',
  total: 25,
  batch: 12,
  metaPrompt: (n) => `You are writing ${n} STARCRAFT-CODED LANDSCAPE entries for StarBot's starcraft-landscape path. Each entry is a DENSE phrase (25-50 words) describing a SPECIFIC ALIEN VISTA in the StarCraft aesthetic tradition — three faction-coded biomes: TERRAN frontier-industrial wastelands, PROTOSS crystalline psionic ancient-civilization vistas, ZERG organic-biomechanical creep-infested wastelands.

CRITICAL — NO CHARACTERS, NO PEOPLE, NO MARINES, NO ZEALOTS, NO HYDRALISKS-AS-FOREGROUND. Pure landscape only (distant Zerg-creature silhouettes against horizon at scale OK).

CRITICAL — NO PROPER NOUNS. Never write "Terran", "Protoss", "Zerg", "Kerrigan", "Raynor", "Aiur", "Char", "Mar Sara", "Korhal", "Battlecruiser", "Khaydarin" — describe the AESTHETIC generically. Use phrases like "rugged frontier-industrial wasteland", "gold-and-blue crystalline psionic plateau", "organic creep-infested biomass-wasteland", "ancient psionic-civilization ruins overgrown".

━━━ AESTHETIC DNA ━━━

Capture the mood of Blizzard StarCraft concept-art / Sam-Didier / Glenn-Rane / Trent-Kaniuga / Phroilan-Gardner. Three faction-coded aesthetics:

- **TERRAN-FRONTIER-INDUSTRIAL**: rugged mid-future colonial-marine planets, oil-rig industrial frontier outposts, rust-and-steel infrastructure, dust-storm horizons, prefab habitat clusters, salvage-yard wastelands, atmospheric-processor silhouettes
- **PROTOSS-CRYSTALLINE-PSIONIC**: gold-blue ancient psionic civilization, floating crystal temples, Khaydarin-crystal pillars piercing skies, Aiur-jungle-ruin overgrowth, ancient classical-futurist architecture, soft purple-gold ambient
- **ZERG-ORGANIC-BIOMECH**: organic-creep wastelands with pulsating biomass coating the ground, hive-cluster mounds, primordial alien-fungal terrain, sinew-and-bone organic textures, blood-red atmosphere, twisted spawning-pools

━━━ LANDSCAPE CATEGORIES (variety across ${n}) ━━━

TERRAN FRONTIER-INDUSTRIAL WASTELANDS (~9):
- frontier mining colony exterior on rust-orange wasteland, prefab industrial structures, oil-rig silhouettes against dust-storm horizon
- abandoned colonial-marine outpost on a desolate planet, prefab bunkers and concrete walls, rusted vehicles half-buried
- frontier-industrial wasteland with atmospheric-processor towers belching smoke, scattered junked machinery, harsh midday sun
- mid-future frontier town under perpetual dust haze, rust-and-steel architecture, distant atmospheric-processor silhouette
- abandoned salvage-yard plain with mountains of crushed spacecraft scrap, dust drifting, distant industrial smokestacks
- desolate frontier highway with rust-streaked road through orange-red wasteland, abandoned vehicles, rocky horizon
- terran refinery complex on a hostile planet, industrial-yellow safety paint, exhaust steam rising, tall flare-stacks
- post-attack frontier colony with smoldering buildings, scattered debris, ash drifting, smoke columns
- rugged hostile planet under heavy storm-cloud cover, isolated prefab habitat cluster, rocky outcrops

PROTOSS CRYSTALLINE PSIONIC VISTAS (~8):
- ancient psionic civilization plateau with floating crystalline temples, gold-and-blue architecture, soft purple-gold ambient
- towering Khaydarin-style crystal pillars piercing the alien sky, gold-leaf floating-architecture wreathed around them
- ancient jungle-ruin plateau where overgrown gold-and-stone pyramids rise through the canopy, soft golden mist
- floating-temple complex suspended above an alien ocean, ornate gold-and-blue architecture, classical-future proportions
- ancient psionic civilization battlefield with shattered crystalline pillars and burned gold-stone, ash drifting through soft glow
- gold-and-blue crystal forest where every formation pulses with internal psionic light, refracted starlight dancing
- ancient psionic temple-city carved into a mountain plateau, multiple stepped levels, crystalline arch-bridges
- floating gold-and-blue cathedral-fragment suspended above a mist-shrouded valley, soft purple-gold dawn glow

ZERG ORGANIC-BIOMECH WASTELANDS (~8):
- creep-infested wasteland where pulsating purple biomass coats every surface, hive-clusters mounding in the distance
- organic primordial planet with sinew-and-bone terrain, blood-red atmosphere, distant hive-cluster silhouettes
- biomechanical alien planet with creep oozing across every rock, fungal-spawning-pools steaming, twisted hive towers
- post-infestation wasteland with creep tendrils crawling across abandoned terran ruins, organic biomass consuming everything
- vast hive-cluster horizon under blood-red sky, mountainous biomass-mounds with pulsing organic veins
- alien primordial swamp with biomass-coated trees, spawning-pool pits, fungal-spore mist drifting
- volcanic-red wasteland under perpetual ash-storm, twisted organic structures rising like coral, biomass-creep at the base
- exposed cliff-face revealing layered hive-tunnels carved into the rock, pulsing organic veins running through the strata

━━━ RULES ━━━
- 25-50 words each — dense, paintable
- NO characters / NO marines / NO zealots / NO foreground creatures
- NO franchise proper nouns
- Strong faction-color signature (rust-orange-grit Terran / gold-blue-purple Protoss / red-purple-organic Zerg)
- Variety across the 3 factions mandatory — minimum 7 entries per faction
- Cinematic / biblical scale where appropriate

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
