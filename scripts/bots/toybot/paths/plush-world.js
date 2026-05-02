const pools = require('../pools');
const blocks = require('../shared-blocks');

module.exports = ({ sharedDNA, vibeDirective, picker }) => {
  const useLandscape = Math.random() < 0.3;
  const scene = useLandscape
    ? picker.pickWithRecency(pools.PLUSH_LANDSCAPES, 'plush_landscape')
    : picker.pickWithRecency(pools.PLUSH_SCENES, 'plush_scene');
  const lighting = picker.pickWithRecency(pools.PLUSH_LIGHTING, 'plush_lighting');
  const camera = picker.pickWithRecency(pools.CAMERA_ANGLES, 'camera_angle');

  // Slot-pool DNA: 30% solo (1 creature) / 70% ensemble (3-5 creatures).
  // Solo entries give the path a tender beat amid the group adventures.
  // Ensemble defeats Sonnet's teddy-bear training-bias.
  const isSolo = Math.random() < 0.3;
  const castSize = isSolo ? 1 : 3 + Math.floor(Math.random() * 3);
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

━━━ CAMERA ━━━
${camera}

${isSolo
  ? `━━━ COMPOSITION — SOLO TENDER MOMENT ━━━
A SINGLE plush creature in the frame, mid-cozy-activity. Intimate storybook composition — the one creature is the focal point of the moment. (Camera/framing direction above sets the perspective; this is a quiet solo beat, not an ensemble.)`
  : `━━━ COMPOSITION LOCK — NON-NEGOTIABLE SPATIAL ANCHOR ━━━
WIDE DIORAMA FRAME — exactly ${castSize} distinct plush creatures visible simultaneously, spatially separated as ${castSize === 3 ? 'left, center, right (or foreground / midground / background)' : castSize === 4 ? 'left, center-left, center-right, right' : 'left, center-left, center, center-right, right'}. Each occupies its OWN silhouette zone — no overlap, no merging. NO single hero subject dominating. ALL ${castSize} stuffies visible in clear frame at the same time. (Camera/framing direction above is the spatial-perspective lens for this composition.)`}

━━━ ${isSolo ? 'THE CREATURE' : 'THE CAST'} — RENDER ${isSolo ? 'THIS EXACT CREATURE' : 'THESE EXACT CREATURES'} (NON-NEGOTIABLE) ━━━
${isSolo ? 'The plush character in this scene MUST be this specific stuffie — do NOT default to a teddy-bear or generic plushie, render the EXACT archetype, color, and signature detail:' : 'The plush characters in this scene MUST be exactly these specific stuffies — do NOT default to teddy-bears or generic plushies, render the EXACT archetype, color, and signature detail of each:'}
${cast.map((c, i) => `${isSolo ? '' : `${i + 1}. `}${c}`).join('\n')}

━━━ THE PLUSH SCENE ━━━
${scene}

━━━ LIGHTING + ATMOSPHERE ━━━
${lighting}

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
