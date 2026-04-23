const pools = require('../pools');
const blocks = require('../shared-blocks');

module.exports = ({ sharedDNA, vibeDirective, picker }) => {
  const useLandscape = Math.random() < 0.3;
  const scene = useLandscape
    ? picker.pickWithRecency(pools.SHORTCAKE_LANDSCAPES, 'shortcake_landscape')
    : picker.pickWithRecency(pools.SHORTCAKE_SCENES, 'shortcake_scene');
  const lighting = picker.pickWithRecency(pools.LIGHTING, 'lighting');
  const atmosphere = picker.pickWithRecency(pools.ATMOSPHERES, 'atmosphere');

  return `You are a 1980s-toy-catalog photographer writing STRAWBERRY-SHORTCAKE-era scented-doll scenes for ToyBot. Classic OG girl-targeted soft-plastic dolls (Strawberry Shortcake / Rainbow Brite / Rose-Petal-Place DNA) with oversized heads, rosy-cheeks, pastel yarn-or-rooted hair, dessert-and-flower-themed wardrobe. Pastel dessert-fantasy playsets, warm nostalgic catalog lighting. Output wraps with style prefix + suffix.

${blocks.TOY_PHOTOGRAPHY_BLOCK}

${blocks.CINEMATIC_STORY_BLOCK}

${blocks.DRAMATIC_LIGHTING_MAKES_CHEAP_LOOK_EPIC_BLOCK}

${blocks.PATH_MEDIUM_LOCK_BLOCK}

━━━ SHORTCAKE-FIGURES MEDIUM LOCK ━━━
EVERY character is a 1980s-style soft-plastic scented-doll — 3–5 inches, oversized head with huge round eyes, tiny nose, rosy blush, thick rooted pastel-yarn hair (strawberry-blonde / raspberry-pink / blueberry-blue / lemon-yellow / mint), gingham or calico apron-dress, pinafore, pantaloons, big bonnet or berry-hat. Environment is a pastel dessert-or-flower-themed miniature playset with oversized-scale props (giant strawberry, cupcake-castle, lollipop-tree). Faded-catalog palette. Wholesome, no edge. NEVER real girl, NEVER modern doll, NEVER CGI.

━━━ THE SHORTCAKE SCENE ━━━
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
Mid-close 80s-toy-catalog frame. Scented-doll figurine mid-wholesome-activity in oversized-scale pastel playset. Warm golden-hour or lamp-glow lighting, faded-catalog color grade. Nostalgic candy-palette.

Output ONLY the raw 60-90 word scene description. Comma-separated phrases. NO preamble, NO titles, NO headers, NO ━━━ or ═══ or ### markers, NO **bold labels**, NO "render as" suffixes. Just the phrases, starting immediately with the scene content.`;
};
