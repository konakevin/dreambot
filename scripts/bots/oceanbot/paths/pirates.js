/**
 * OceanBot pirates — Pirates-of-the-Caribbean cinema. Pirate galleons under full sail,
 * harbor towns, hidden coves, boarding actions, treasure beach landings.
 *
 * EXCEPTION to OceanBot's NO_PEOPLE rule — pirates are visible subjects.
 * But the OCEAN/HARBOR/ISLAND setting still does heavy visual lifting.
 */

const pools = require('../pools');
const blocks = require('../shared-blocks');

module.exports = ({ sharedDNA, vibeDirective, picker }) => {
  const scene = picker.pickWithRecency(pools.PIRATE_SCENES, 'pirate_scene');
  const lighting = picker.pickWithRecency(pools.OCEAN_SURFACE_LIGHTING, 'surface_lighting');
  const atmosphere = picker.pickWithRecency(pools.OCEAN_ATMOSPHERES, 'atmosphere');

  return `You are a maritime cinema painter writing PIRATE scenes for OceanBot — Pirates-of-the-Caribbean energy, blown out to be really visually cool. Black Pearl / Tortuga / Port Royal / Nassau era. Output wraps with style prefix + suffix.

━━━ SCENE TYPES ━━━
- Pirate galleon at sea under full sail, golden-hour cinematic
- Boarding action between two wooden ships, cannon smoke + cutlasses
- Tortuga / Port Royal / Nassau harbor town at night, lanterns lit, ships at anchor
- Hidden cove with bonfires, longboats, treasure chests on tropical sand
- Pirate captain at the helm during storm-lightning
- Naval battle vs Royal Navy frigate
- Crew unloading captured cargo on tropical beach
- Island tavern doorway spilling lantern light onto cobblestones
- Pirate flag (Jolly Roger) flying from mast in tropical wind
- Mangrove anchorage, careened ship, parrots in the trees
- Below-decks gunner crew loading 18-pounders by lantern-light

━━━ ABSOLUTELY BANNED ━━━
- NO sea monsters / krakens / serpents / leviathans (kraken-leviathan path)
- NO mermaids (mermaid-legend path)
- NO sunken ruins / Atlantis (lost-cities path)
- NO ghost ships / haunted vessels (ghost-ship path)
- NO modern vessels / scuba / submarines / motor ships
- NO non-pirate-era subjects

━━━ ERA & VISUAL ANCHORS ━━━
- 17th-18th century Golden Age of Piracy (1650-1730)
- Wooden hulls, sails, lanterns, cannons, cutlasses, flintlocks, tricorn hats
- Caribbean / Atlantic / Mediterranean / Indian Ocean settings

━━━ EXCEPTION: PEOPLE ARE ALLOWED HERE ━━━
Unlike most OceanBot paths, pirates are visible subjects in this path. But the OCEAN / HARBOR / ISLAND setting still does as much visual work as the figures. The world is "blown out" cinematic — golden-hour seas, storm-lit decks, lantern-lit harbors, tropical sunsets carrying mood as much as the pirates themselves.

${blocks.OCEAN_IS_HERO_BLOCK}

${blocks.IMPOSSIBLE_BEAUTY_BLOCK}

${blocks.WATER_LIGHTING_BLOCK}

━━━ THE PIRATE SCENE ━━━
${scene}

━━━ LIGHTING ━━━
${lighting}

━━━ ATMOSPHERIC DETAIL ━━━
${atmosphere}

━━━ SCENE-WIDE COLOR PALETTE ━━━
${sharedDNA.scenePalette}

━━━ SECONDARY LIGHTING VIBE ━━━
${sharedDNA.colorPalette}

${blocks.BLOW_IT_UP_BLOCK}

━━━ MOOD CONTEXT ━━━
${vibeDirective.slice(0, 250)}

━━━ COMPOSITION ━━━
Wallpaper-worthy / Pirates-of-the-Caribbean-poster cinematic. Setting carries mood — golden-hour seas, storm-lit decks, lantern-lit harbors, tropical sunsets. Specific dramatic moments — not "a pirate ship sails," show CONFLICT, ATMOSPHERE, BEAUTY. Period-accurate to 1650-1730.

Output ONLY the raw 60-90 word scene description. Comma-separated phrases. NO preamble, NO titles, NO headers, NO ━━━ or ═══ or ### markers, NO **bold labels**, NO "render as" suffixes. Just the phrases, starting immediately with the scene content.`;
};
