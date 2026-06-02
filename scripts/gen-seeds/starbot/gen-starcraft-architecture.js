#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/starbot/seeds/starcraft_architecture.json',
  total: 25,
  batch: 12,
  metaPrompt: (
    n
  ) => `You are writing ${n} STARCRAFT-CODED ARCHITECTURE entries for StarBot's starcraft-architecture path. Each entry is a DENSE phrase (25-50 words) describing a SPECIFIC ARCHITECTURAL INTERIOR in the StarCraft aesthetic tradition — three faction-coded interiors: TERRAN frontier-industrial bunkers and command centers, PROTOSS crystalline psionic temple-chambers, ZERG organic-biomech hive-cluster interiors.

CRITICAL — NO CHARACTERS, NO PEOPLE, NO MARINES, NO ZEALOTS, NO HYDRALISKS-AS-FOREGROUND. Pure architecture only.

CRITICAL — NO PROPER NOUNS. Never write "Terran", "Protoss", "Zerg", "Kerrigan", "Raynor", "Aiur", "Char", "Mar Sara", "Korhal", "Battlecruiser", "Khaydarin", "Carrier" — describe the AESTHETIC generically.

━━━ AESTHETIC DNA ━━━

Capture the mood of Blizzard StarCraft concept-art / Sam-Didier / Glenn-Rane / Trent-Kaniuga. Three faction-coded interior aesthetics:

- **TERRAN-FRONTIER-INDUSTRIAL**: gritty mid-future colonial-marine bunker interiors, command centers with CRT screens and tactical maps, oil-rig industrial workshops, prefab habitat modules, hangar bays with parked vehicles, supply-ship cargo holds, rust-and-steel everywhere
- **PROTOSS-CRYSTALLINE-PSIONIC**: gold-and-blue ancient temple chambers, Khaydarin-crystal pillar halls, classical-futurist columned chambers, floating-architecture interiors with psionic-glow ambient, gold-leaf and crystal everywhere
- **ZERG-ORGANIC-BIOMECH**: pulsating biomass-coated hive-tunnel interiors, sinew-and-bone organic chambers, spawning-pool pits, fungal hive-clusters with pulsing veins running through walls, blood-red ambient

━━━ ARCHITECTURE CATEGORIES (variety across ${n}) ━━━

TERRAN FRONTIER-INDUSTRIAL INTERIORS (~9):
- frontier command center with CRT-screen tactical wall, rust-streaked metal walls, scattered datapads on a central table
- colonial-marine bunker interior with concrete walls, sandbag emplacements, fluorescent strip lighting, racks of weapon-cases
- oil-rig industrial workshop with hydraulic presses, pipe runs along the ceiling, sparks frozen in mid-air, no figures
- prefab habitat module interior with bunks, scattered personal effects, beat-up footlockers, fluorescent-amber lighting
- frontier-base hangar bay with parked vehicles, scattered tools, atmospheric haze, harsh white work-lights
- supply-ship cargo hold with stacked crates strapped to bulkheads, dim emergency lighting, no figures
- terran refinery control room with banks of monitors, indicator lights, atmospheric haze, industrial-yellow safety paint
- frontier-tavern interior with neon signs, beat-up tables, jukebox-style music console, rust-streaked walls
- post-attack frontier base interior with smoldering equipment, scattered debris, smoke drifting, emergency strobe lights

PROTOSS CRYSTALLINE PSIONIC TEMPLES (~8):
- ancient psionic temple chamber with gold-and-blue Khaydarin-crystal pillars piercing floor and ceiling, soft purple-gold ambient
- floating-temple sanctuary with classical-futurist gold-and-blue columns, ornate gold-leaf ceiling, soft psionic-glow ambient
- crystalline psionic chamber with central glowing sphere suspended in mid-air, gold inlay across the floor
- ancient gold-and-blue throne hall with raised dais, intricate floor-mosaic, towering crystal pillars at every corner
- psionic library chamber with floating crystal-tablet shelves arranged in concentric rings, soft golden ambient
- ancient temple-corridor with gold-and-blue walls and Khaydarin crystal embedded in the architecture, soft glowing-glyphs along the walls
- floating-citadel observation chamber with panoramic crystal-window view, gold-leaf decoration, soft psionic ambient
- ancient psionic-civilization great hall with vaulted gold ceiling, ornate floor pattern, glowing crystal at the center

ZERG ORGANIC-BIOMECH HIVE INTERIORS (~8):
- pulsating hive-tunnel interior with sinew-and-bone walls, biomass-creep across the floor, blood-red ambient
- organic spawning-pool chamber with bubbling pits, biomass-coated walls, pulsing veins, fungal-spore mist drifting
- hive-cluster central chamber with massive organic bone-vault ceiling, pulsing organic floor, twisted biomass conduits
- biomechanical hive corridor with rib-arched walls and pulsing organic veins, dim red ambient
- spawning-chamber with rows of biomass cocoons (no creatures emerged), organic walls pulsing, blood-red overhead glow
- organic primordial cave with biomass-coating across stalactites and stalagmites, pulsing veins running through the floor
- hive-tunnel intersection with multiple biomass corridors converging, pulsing organic central node, blood-red ambient
- post-infestation terran corridor where creep has consumed metal walls, hybrid biomechanical mess, twisted organic-mech chaos

━━━ RULES ━━━
- 25-50 words each — dense, paintable
- NO characters / NO marines / NO zealots / NO Zerg-creatures-as-figures
- NO franchise proper nouns
- Strong faction signature (rust-and-grit Terran / gold-and-blue Protoss / sinew-and-blood-red Zerg)
- Variety across the 3 factions mandatory — minimum 7 entries per faction
- Strong material specificity per faction

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
