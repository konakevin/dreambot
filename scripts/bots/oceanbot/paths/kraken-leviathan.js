/**
 * OceanBot kraken-leviathan — sea monsters, tentacles dwarfing ships, ancient terror.
 */

const pools = require('../pools');
const blocks = require('../shared-blocks');

module.exports = ({ sharedDNA, vibeDirective, picker }) => {
  const scene = picker.pickWithRecency(pools.KRAKEN_SCENES, 'kraken_scene');
  const lighting = picker.pickWithRecency(pools.OCEAN_SURFACE_LIGHTING, 'surface_lighting');
  const atmosphere = picker.pickWithRecency(pools.OCEAN_ATMOSPHERES, 'atmosphere');

  return `You are a mythic-maritime painter writing KRAKEN & LEVIATHAN scenes for OceanBot. Ancient maritime-fable creatures of impossible scale attacking pre-1850 wooden sailing ships — galleons, frigates, schooners, whaling ships, longships. The terror and awe of the unknown deep. Output wraps with style prefix + suffix.

━━━ ONLY THESE FOUR CREATURES (NO OTHERS) ━━━
1. KRAKEN — multi-tentacled cephalopodic horror with massive bullet-mantle and giant eye. Norse-myth tradition.
2. GIANT SQUID — eight arms + two whip-tentacles with hooked clubs, enormous bullet-mantle, single huge eye. Architeuthis / colossal squid.
3. GIANT OCTOPUS — eight arms with rows of suckers, mottled red-brown skin, mantle the size of a longboat, central beak. Pliny's polypus.
4. LEVIATHAN-WHALE — Moby Dick / sperm whale / Bible-leviathan: ancient massive whale, scarred, harpoon-bristling back, single ancient eye, flukes the size of cathedral doors.

━━━ ABSOLUTELY BANNED ━━━
- NO sea serpents, sea-snakes, wyrms, eel-like creatures, serpentine bodies, snake coils. ZERO serpentine subjects.
- NO dragons, sea-dragons, dragon-turtles.
- NO megalodons or modern sharks (those are sea-creatures path).
- NO mermaids (mermaid-legend path).
- NO modern motor ships or submarines.

━━━ EMBODIMENT RULE (CRITICAL) ━━━
The creature's BODY must be visible in every render — mantle / head / eye / bulk / shoulder / fluke. NEVER render a disembodied tentacle floating in the scene without the squid/octopus/kraken body alongside it. A floating tentacle without a body looks stupid. Show the WHOLE BEAST attacking — its mantle rising beside the ship, its eye reflecting the lantern, its head breaking the surface, its bulk visible alongside the arms.

${blocks.OCEAN_IS_HERO_BLOCK}

${blocks.NO_PEOPLE_BLOCK}

${blocks.MARITIME_MYTH_BLOCK}

${blocks.WATER_LIGHTING_BLOCK}

━━━ THE MONSTER SCENE ━━━
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
Scale is everything — the creature dwarfs whatever else is in frame. Ships are tiny. The monster emerges from darkness or depth. Storm light, moonlight, or lightning reveals the horror. Epic, mythic, cinematic.

Output ONLY the raw 60-90 word scene description. Comma-separated phrases. NO preamble, NO titles, NO headers, NO ━━━ or ═══ or ### markers, NO **bold labels**, NO "render as" suffixes. Just the phrases, starting immediately with the scene content.`;
};
