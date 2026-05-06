/**
 * CuddleBot night-meadow path — impossibly cute critters at twilight /
 * night in a meadow / forest clearing / starlit glade. Stargazing
 * critters, fireflies in jars, glow-worm tea parties, comet-watching,
 * moonlit picnics. Twilight palette unique to this path.
 */

const pools = require('../pools');
const blocks = require('../shared-blocks');

module.exports = ({ sharedDNA, vibeDirective, picker }) => {
  const creature1 = picker.pickWithRecency(pools.CUTE_CREATURES, 'creature');
  const creature2 = picker.pickWithRecency(pools.CUTE_CREATURES, 'creature');
  const scene = picker.pickWithRecency(pools.NIGHT_MEADOW_SCENES, 'night_meadow_scene');
  const lighting = picker.pickWithRecency(pools.LIGHTING, 'lighting');
  const atmosphere = picker.pickWithRecency(pools.ATMOSPHERES, 'atmosphere');

  return `You are writing NIGHT-MEADOW scenes for CuddleBot — impossibly cute critters at twilight or night in a meadow / forest clearing / starlit glade. Stargazing fox kits, fireflies in mason jars, glow-worm tea parties on a mushroom-cap, comet-watching bunnies, moonlit picnic on a giant leaf, owl + hedgehog under a starry blanket. Pixar / Sanrio / Studio Ghibli / Beatrix-Potter-twilight aesthetic. Output wraps with style prefix + suffix.

${blocks.CUTE_CUDDLY_COZY_BLOCK}

${blocks.STYLIZED_NOT_PHOTOREAL_BLOCK}

${blocks.NO_DARK_NO_INTENSE_BLOCK}

${blocks.NO_PEOPLE_BLOCK}

${blocks.IMPOSSIBLE_BEAUTY_BLOCK}

━━━ THE NIGHT-MEADOW SCENE ━━━
${scene}

━━━ TWILIGHT CRITTER 1 ━━━
${creature1}

━━━ TWILIGHT CRITTER 2 ━━━
${creature2}

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

━━━ NIGHT-MEADOW DNA ━━━
SUPER OVERLAY CUTE — never photoreal, NEVER documentary-nature. Pixar / Sanrio / Studio Ghibli / Beatrix-Potter / The-Owl-Who-Was-Afraid-of-the-Dark aesthetic. Every creature has OVERSIZED dewy eyes catching star-glow, round chubby bodies, blushing cheeks lit warm by lantern/firefly, tiny stubby paws, fluffy soft textures. Twilight palette: deep indigo + violet skies, soft moon-pearl, warm honey-amber lantern-glow, aqua-teal fireflies, golden glow-worms, milky-way silver-cream. Soft starlight, dotted galaxies, drifting fireflies, glow-worm clusters, lantern-bug constellations, fox-shaped bushes silhouetted, dew-glinting grass. The two creatures INTERACT cutely — pressed shoulder-to-shoulder watching the stars, cuddled in a flower-bowl with a glow-jar between them, wrapped in a tiny knitted blanket on a mushroom, pawing at fireflies, sharing a thimble of cocoa under the moon. Wonder + safety + warmth. Picture-book clarity.

━━━ COMPOSITION ━━━
Mid-close or wide-cute on the pair under twilight/night sky. Sky should READ as twilight/night — not just dark — with star-density + soft galaxy-bands or aurora hints. Lantern / firefly / glow-worm warm point-light should accent and warm the cool sky. Creatures fill 30-50% of frame. Maximum cute saturation despite the night setting — twilight is COZY here, never scary.

Output ONLY the raw 60-90 word scene description. Comma-separated phrases. NO preamble, NO titles, NO headers, NO ━━━ or ═══ or ### markers, NO **bold labels**, NO "render as" suffixes. Just the phrases, starting immediately with the scene content.`;
};
