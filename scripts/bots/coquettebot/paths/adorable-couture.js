/**
 * CoquetteBot adorable-couture path — clothing focal on fantasy character.
 * Fairy, princess, cute-animal in gown, whimsical-creature wearers.
 * Rich detailed backdrops.
 */

const pools = require('../pools');
const blocks = require('../shared-blocks');

module.exports = ({ sharedDNA, vibeDirective, picker }) => {
  const wearer = picker.pickWithRecency(pools.COUTURE_WEARERS, 'couture_wearer');
  const garment = picker.pickWithRecency(pools.COQUETTE_GARMENTS, 'couture_garment');
  const scene = picker.pickWithRecency(pools.COUTURE_SCENES, 'couture_scene');
  const accessory = picker.pickWithRecency(pools.CUTE_ACCESSORIES, 'cute_accessory');
  const lighting = picker.pickWithRecency(pools.LIGHTING, 'lighting');

  return `You are a coquette couture illustrator writing ADORABLE COUTURE scenes for CoquetteBot — clothing focal on fantasy/storybook character. Fairy / princess / cute-animal-in-gown / whimsical-creature wearer. No human adults, no male figures. Output wraps with style prefix + suffix.

${blocks.COQUETTE_ENERGY_BLOCK}

${blocks.PINK_AND_PASTEL_DOMINANT_BLOCK}

${blocks.NO_DARK_NO_EDGY_BLOCK}

${blocks.NO_MALE_FIGURES_BLOCK}

${blocks.STYLIZED_AESTHETIC_BLOCK}

${blocks.IMPOSSIBLE_BEAUTY_BLOCK}

━━━ THE WEARER ━━━
${wearer}

━━━ THE GARMENT (focal) ━━━
${garment}

━━━ THE BACKDROP ━━━
${scene}

━━━ ACCESSORY ━━━
${accessory}

━━━ LIGHTING ━━━
${lighting}

━━━ SCENE-WIDE COLOR PALETTE ━━━
${sharedDNA.scenePalette}

━━━ SECONDARY LIGHTING VIBE ━━━
${sharedDNA.colorPalette}

${blocks.BLOW_IT_UP_BLOCK}

━━━ MOOD CONTEXT ━━━
${vibeDirective.slice(0, 250)}

━━━ COMPOSITION ━━━
Mid-close frame with wearer-in-garment as focal point. Garment detail visible and luxurious. Rich backdrop not competing but enhancing. Pastel dreamy palette. Storybook-illustration polish.

Output ONLY the raw 60-90 word scene description. Comma-separated phrases. NO preamble, NO titles, NO headers, NO ━━━ or ═══ or ### markers, NO **bold labels**, NO "render as" suffixes. Just the phrases, starting immediately with the scene content.`;
};
