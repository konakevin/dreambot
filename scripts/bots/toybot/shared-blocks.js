/**
 * ToyBot — shared prose blocks.
 *
 * Every render is CINEMATIC toy-world storytelling. Toys are not sitting —
 * action-packed movie-stills. Each path pegged to specific toy medium.
 * Toy-ness is the art; dramatic lighting elevates the medium to cinematic.
 */

const PROMPT_PREFIX =
  'toy photography in a handcrafted practical set, action-packed toy-world storytelling, toy-ness elevated as the subject';

const PROMPT_SUFFIX = 'no text, no words, no watermarks, hyper detailed, masterpiece quality';

const TOY_PHOTOGRAPHY_BLOCK = `━━━ TOY PHOTOGRAPHY (NON-NEGOTIABLE) ━━━

Render as a REAL PHYSICAL TOY photographed in a handcrafted set with dramatic cinematic lighting. Toy-ness IS the art — never render as "real" version. If it's LEGO, bricks are visible. If it's clay, fingerprints + paint-strokes visible. If it's vinyl, glossy-sheen + oversized-head visible. If it's action-figure, joint-articulation visible. If it's stitched, fabric/felt/yarn/button-eyes visible.`;

const CINEMATIC_STORY_BLOCK = `━━━ CINEMATIC STORY — EVERY RENDER IS A MOVIE STILL ━━━

Something IS HAPPENING. Action mid-charge, explosion frozen, mid-leap, spell-casting, ambush peak-moment. NEVER "toy-on-shelf" static. Narrative + tension + dynamic composition. The viewer should feel they stumbled into minute 47 of a stop-motion film.`;

const DRAMATIC_LIGHTING_MAKES_CHEAP_LOOK_EPIC_BLOCK = `━━━ LIGHTING ELEVATES THE MEDIUM ━━━

Lighting is the multiplier that makes plastic / clay / fabric feel like it belongs in a museum. The exact palette comes from the LIGHTING and VIBE-COLOR sections below — do NOT default to teal-and-orange, do NOT add warm-key-cool-fill unless the pool pick explicitly says so. Respect the specified palette (monochrome / high-key / low-key / noon-flat / noir-hard / golden-hour / blue-hour / neon / sodium / emergency-red / underwater / overcast / catalog-soft / whatever the pool specifies) and build the scene around IT. Atmospheric depth via smoke / haze / dust / steam / rain / snow / pollen / backlight-only is welcome, but the color temperature must follow the pool's call, not a generic cinematic default.`;

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
