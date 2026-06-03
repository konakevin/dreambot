/**
 * BrickBot — shared prose blocks (rebuild 2026-05-07).
 *
 * Architecture: subject is the path identity. Camera + lighting + palette
 * are AXES that vary inside each path. Universal LEGO MOC blocks below
 * apply to every render.
 *
 * Universal rules:
 *   1. Everything in the frame is built from real LEGO bricks. No hands,
 *      no human skin, no real people, no claymation.
 *   2. Every render is professional MOC photography quality — could
 *      win a LEGO convention award.
 *   3. Per-path scene pools deliver variety: ~40% architecture/world
 *      shots, ~50% character story scenes (action verbs, narrative
 *      beats), ~10% mood/establishing.
 */

const PROMPT_PREFIX =
  'highly detailed LEGO diorama scene, built entirely from real LEGO bricks, studs clearly visible, authentic LEGO plastic texture, molded seams and connection points, realistic brick geometry, accurate minifigure scale, intricate brick-built details using slopes tiles plates and transparent pieces, professional LEGO MOC showcase photography';

// 2026-06-02 cruft-audit strip — was a 13-item `no X` negation chain
// (no human hands / no human fingers / no human skin / no real people /
// no cartoon render / no minecraft / no voxel art / no claymation /
// no painted textures / no smooth surfaces / no melted plastic /
// no deformed studs / no text / no watermark) — Flux's CLIP tokenizer
// ignores `no` and reads each banned noun as DESIRED content per
// [[feedback_negative_prompt_leak]]. Stripped to a positive all-LEGO
// anchor — the EVERYTHING_IS_BRICK_BLOCK already covers the rules
// downstream so the suffix just needs to keep the brick register at
// the tail. Dropped tech-spec `ultra detailed`. `no text, no watermark`
// stays — overlay-text suppressor that Flux treats differently from
// scene content.
const PROMPT_SUFFIX =
  'all-LEGO scene throughout, every element brick-built, crisp brick texture, sharp stud detail, no text, no watermark';

const EVERYTHING_IS_BRICK_BLOCK = `━━━ EVERYTHING IS BRICK — NON-NEGOTIABLE ━━━
Every element in the frame is built from LEGO bricks. Buildings, vehicles, terrain, water, fire, smoke, trees, rocks, sky-elements — all plastic on a tabletop. Studs visible. Minifigures have yellow skin (or path-specified color), C-shaped hands, printed faces. Macro lens / tabletop diorama photography. NEVER real human hands, fingers, skin, or photoreal people.`;

const TOY_PHOTOGRAPHY_BLOCK = `━━━ TOY PHOTOGRAPHY QUALITY ━━━
Shot like a professional LEGO photographer — convention-award level. Realistic shadows. Use the CAMERA AXIS + LIGHTING + PALETTE specified below; do NOT default to tilt-shift unless that's what the camera axis says.`;

const BRICK_DETAIL_BLOCK = `━━━ BRICK DETAIL VARIETY ━━━
Specify brick types in use: transparent pieces for water/fire/glass, slope bricks for curves, tiles for smooth surfaces, plates for thin layers, technic beams for mechanical parts, minifig accessories for tiny details. The more specific the brick construction, the more authentically MOC the build reads.`;

const STORY_SCENE_BLOCK = `━━━ STORY-SCENE RULE ━━━
If the SCENE seed describes minifigs, render an ACTION moment — a story beat with verbs and consequences. NOT minifigs standing around in a setting. Show what's happening in this frame: who's reacting, who's moving, what the cause is, what the effect is. Architecture / vehicle shots (no minifigs, build is the subject) follow different rules and don't need this.`;

const NO_TEMPLATE_BLOCK = `━━━ ANTI-SAMENESS ━━━
The CAMERA AXIS is the variety knob. Macro detail of a build versus wide diorama vista versus dutch-angle action shot all read totally different. Use the camera axis below as a hard constraint, not a suggestion. Don't default to centered eye-level minifig framing.`;

module.exports = {
  PROMPT_PREFIX,
  PROMPT_SUFFIX,
  EVERYTHING_IS_BRICK_BLOCK,
  TOY_PHOTOGRAPHY_BLOCK,
  BRICK_DETAIL_BLOCK,
  STORY_SCENE_BLOCK,
  NO_TEMPLATE_BLOCK,
};
