const pools = require('../pools');
const blocks = require('../shared-blocks');

module.exports = ({ sharedDNA, vibeDirective, picker }) => {
  const useLandscape = Math.random() < 0.3;
  const scene = useLandscape
    ? picker.pickWithRecency(pools.PLUSH_LANDSCAPES, 'plush_landscape')
    : picker.pickWithRecency(pools.PLUSH_SCENES, 'plush_scene');
  const lighting = picker.pickWithRecency(pools.LIGHTING, 'lighting');
  const atmosphere = picker.pickWithRecency(pools.ATMOSPHERES, 'atmosphere');

  // Slot-pool DNA: roll 4-6 distinct plush creatures per render to defeat
  // Sonnet's teddy-bear training-bias. Cast block forces SPECIFIC creatures.
  const castSize = 4 + Math.floor(Math.random() * 3);
  const cast = [];
  for (let i = 0; i < castSize; i++) {
    cast.push(picker.pickWithRecency(pools.PLUSH_CREATURES, `plush_creature_${i}`));
  }

  return `You are a stuffed-animal storybook photographer writing PLUSH-WORLD scenes for ToyBot. Soft-fabric stuffed-animal characters (teddy bears, plush bunnies, stuffed foxes, knitted cats, stitched dragons, owls) on cozy adventures. Forest campsites, sailboats at sea, picnic meadows, attic bedrooms, treehouses. Warm + emotionally tender. NOT Sackboy LBP-burlap-and-zipper aesthetic — this is huggable plush-fabric. Output wraps with style prefix + suffix.

${blocks.TOY_PHOTOGRAPHY_BLOCK}

${blocks.CINEMATIC_STORY_BLOCK}

${blocks.DRAMATIC_LIGHTING_MAKES_CHEAP_LOOK_EPIC_BLOCK}

${blocks.PATH_MEDIUM_LOCK_BLOCK}

━━━ PLUSH MEDIUM LOCK ━━━
EVERY character is a soft-fabric stuffed animal — teddy bear / plush bunny / stuffed fox / knitted cat / stitched dragon / fabric owl / felt duck / cuddly raccoon. Visible plush-fiber FUR or KNIT TEXTURE on body, embroidered or button eyes, stitched mouth, sewn-on muzzle, soft floppy limbs, fiberfill pudgy bodies, optional tiny knit sweaters or cloth bandanas. NEVER LBP burlap-with-zipper (that's Sackboy). NEVER real animal. NEVER CGI. Photographed in a fully-dressed handcrafted miniature set. Practical lighting, shallow depth-of-field, storybook warmth.

━━━ THE CAST — RENDER THESE EXACT CREATURES (NON-NEGOTIABLE) ━━━
The plush characters in this scene MUST be exactly these specific stuffies — do NOT default to teddy-bears or generic plushies, render the EXACT archetype, color, and signature detail of each:
${cast.map((c, i) => `${i + 1}. ${c}`).join('\n')}

━━━ THE PLUSH SCENE ━━━
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
Mid-close plush-toy-diorama frame. Stuffed-animal character(s) mid-cozy-adventure (toasting marshmallows, hoisting tiny sail, exploring attic, pouring tea). Warm firelight / lantern-glow / golden-hour-meadow / moonlit-window lighting per pool palette. Visible fabric texture, embroidered eyes, soft-fur fiber. Storybook tenderness.

Output ONLY the raw 60-90 word scene description. Comma-separated phrases. NO preamble, NO titles, NO headers, NO ━━━ or ═══ or ### markers, NO **bold labels**, NO "render as" suffixes. Just the phrases, starting immediately with the scene content.`;
};
