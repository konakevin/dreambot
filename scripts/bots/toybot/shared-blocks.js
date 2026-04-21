/**
 * ToyBot — shared prose blocks.
 *
 * Every render is CINEMATIC toy-world storytelling. Toys are not sitting —
 * action-packed movie-stills. Each path pegged to specific toy medium.
 * Toy-ness is the art; dramatic lighting elevates the medium to cinematic.
 */

const PROMPT_PREFIX =
  'cinematic toy photography, dramatic movie-still composition, action-packed toy-world storytelling, handcrafted practical-set lighting, toy-ness elevated to cinematic art';

const PROMPT_SUFFIX = 'no text, no words, no watermarks, hyper detailed, masterpiece quality';

const TOY_PHOTOGRAPHY_BLOCK = `━━━ TOY PHOTOGRAPHY (NON-NEGOTIABLE) ━━━

Render as a REAL PHYSICAL TOY photographed in a handcrafted set with dramatic cinematic lighting. Toy-ness IS the art — never render as "real" version. If it's LEGO, bricks are visible. If it's clay, fingerprints + paint-strokes visible. If it's vinyl, glossy-sheen + oversized-head visible. If it's action-figure, joint-articulation visible. If it's stitched, fabric/felt/yarn/button-eyes visible.`;

const CINEMATIC_STORY_BLOCK = `━━━ CINEMATIC STORY — EVERY RENDER IS A MOVIE STILL ━━━

Something IS HAPPENING. Action mid-charge, explosion frozen, mid-leap, spell-casting, ambush peak-moment. NEVER "toy-on-shelf" static. Narrative + tension + dynamic composition. The viewer should feel they stumbled into minute 47 of a stop-motion film.`;

const DRAMATIC_LIGHTING_MAKES_CHEAP_LOOK_EPIC_BLOCK = `━━━ DRAMATIC LIGHTING MAKES THE MEDIUM EPIC ━━━

Lighting is the multiplier. Practical spotlights + backlit rim-light + atmospheric smoke-from-offstage + warm-key-cool-fill cinematography. Plastic/clay/fabric is elevated by lighting into something that belongs in a museum exhibition. Deep shadows, warm highlights, atmospheric depth.`;

const PATH_MEDIUM_LOCK_BLOCK = `━━━ PATH MEDIUM LOCK — NEVER MIX ━━━

Each path is locked to its medium. NEVER mix LEGO pieces in a claymation scene. NEVER put vinyl figures beside action-figures. NEVER have stitched characters in a LEGO setting. The path's medium is absolute — stay true.`;

const BLOW_IT_UP_BLOCK = `━━━ BLOW IT UP — TOY AMPLIFICATION ━━━

Stack medium-signature detail to the max: LEGO studs + printed minifig faces + transparent brick-water; clay fingerprints + painted-eyes + subtle thumb-marks; vinyl glossy sheen + oversized head + matte-paint panel-lines; action-figure joint-articulation + weathered paint + explosion effects; stitched fabric textures + button-eyes + yarn-hair + visible stitching-seams. Every render is obsessive medium-craft.`;

module.exports = {
  PROMPT_PREFIX,
  PROMPT_SUFFIX,
  TOY_PHOTOGRAPHY_BLOCK,
  CINEMATIC_STORY_BLOCK,
  DRAMATIC_LIGHTING_MAKES_CHEAP_LOOK_EPIC_BLOCK,
  PATH_MEDIUM_LOCK_BLOCK,
  BLOW_IT_UP_BLOCK,
};
