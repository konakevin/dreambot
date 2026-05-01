/**
 * OceanBot big-wave — 60ft walls of water, Nazaré/Mavericks power, spray and awe.
 */

const pools = require('../pools');
const blocks = require('../shared-blocks');

module.exports = ({ sharedDNA, vibeDirective, picker }) => {
  const scene = picker.pickWithRecency(pools.BIG_WAVES, 'big_wave');
  const lighting = picker.pickWithRecency(pools.OCEAN_SURFACE_LIGHTING, 'surface_lighting');
  const atmosphere = picker.pickWithRecency(pools.OCEAN_ATMOSPHERES, 'atmosphere');

  return `You are a maritime catastrophe painter writing MASSIVE WAVE scenes for OceanBot's big-wave path. The theme is RAW DESTRUCTIVE POWER OF THE SEA — heavy seas, terrifying scale, cliff-exploding impact moments, walls of water meeting the coast. SCARY, AWE-INSPIRING, BIBLICAL-FURY. The viewer should feel the danger.

NOT side-view surf-portraits. IMPACT moments where massive water meets coastline / cliffs / lighthouses / wooden boats / beaches / harbors. Old Testament Leviathan-power energy.

━━━ SUBJECTS ━━━
- 80-100 ft walls of water detonating against vertical sea-cliffs (geyser-pillar spray)
- Massive surge engulfing historic stone lighthouses halfway up the tower
- Rogue waves overtopping stone breakwaters into harbors, wooden boats tossed
- Apocalyptic beach surges dragging driftwood up the strand
- Pre-1850 wooden galleons in storm seas, dwarfed by wave walls
- Old fishing villages with stone houses being spray-blasted
- Headlands disappearing in spray-foam during sustained wave assault
- Storm-pyramid wave formations on open ocean, biblical-fury scale

━━━ ABSOLUTELY BANNED ━━━
- NO surfers / surfboards (focus is power, not sport)
- NO modern vessels — only pre-1850 wooden sailing ships
- NO modern cars / highways / cute beach scenes
- NO sea monsters / krakens (kraken-leviathan path)
- NO calm seas (calm-glass-sea path)
- **NO BOATS BEING DESTROYED AGAINST SHORE / CLIFF / ROCKS / WALLS / DOCKS / PIERS / BREAKWATERS.** A wooden vessel riding heavy open seas / dwarfed by an open-ocean wave wall is FINE. A boat smashed against the coast is BANNED. This is a SCENE path showing AWE-OF-NATURE — the SEA is the subject, not boat-disaster.

${blocks.OCEAN_IS_HERO_BLOCK}

${blocks.NO_PEOPLE_BLOCK}

${blocks.IMPOSSIBLE_BEAUTY_BLOCK}

${blocks.WATER_LIGHTING_BLOCK}

━━━ THE BIG WAVE ━━━
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
IMPACT moments dominate. Wave + coastline / lighthouse / cliff / wooden vessel together in frame, wave wall taller than land structures by 2-5×. Storm-light, dramatic backlight, cliff explosion mid-detonation, foam pillars in the air, debris flying. Water-level shots are fine if a coastal structure is present. Avoid open-sea side-view portraits — those feel boring. SCARY. POWERFUL. BIBLICAL.

Output ONLY the raw 60-90 word scene description. Comma-separated phrases. NO preamble, NO titles, NO headers, NO ━━━ or ═══ or ### markers, NO **bold labels**, NO "render as" suffixes. Just the phrases, starting immediately with the scene content.`;
};
