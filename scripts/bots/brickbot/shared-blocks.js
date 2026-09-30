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

// Trimmed 45 → 26 words 2026-09-30 (prompt-length clean-up, BOT_FOLLOWUPS_TRACKER.md C10a): every cue
// kept (all-brick, studs, plastic texture + seams, minifig scale, the piece types); "realistic brick
// geometry" and the "intricate … details using" padding went. "professional LEGO MOC showcase photography"
// moved into BRICK_PHOTO_MEDIUM so it isn't said twice.
const PROMPT_PREFIX =
  'highly detailed LEGO diorama built entirely from real LEGO bricks, studs clearly visible, authentic plastic texture and molded seams, accurate minifigure scale, slopes tiles plates and transparent pieces';

// BrickBot's own photography fragment (2026-09-30), set via mediumStyles.photography in index.js so it
// replaces the SHARED DB `photography` flux_fragment for this bot only (nightly/Create keep theirs). The
// shared one is 27 words of generic photo cruft that sat at words ~46-72 of every BrickBot render and
// fought the all-brick look: "accurate skin tones", "photographic realism", "modern digital camera
// quality", "ultra high resolution". Its one load-bearing cue was "natural bokeh", the tabletop
// miniature signal that keeps backgrounds reading as LEGO on paths without a deep-focus prefix
// (fantasy, per the playbook's tilt-shift rule); "tabletop miniature depth of field" carries it.
const BRICK_PHOTO_MEDIUM =
  'professional LEGO MOC showcase photography, tabletop miniature depth of field, beautiful lighting';

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

// Clean-render medium for gpt-image-2 + nano-banana (routed via
// cleanMediumByModel in index.js). These models read the bot's MOC-photography
// prefix/suffix as "go abstract"; this positive-only directive keeps the render
// a readable physical LEGO build. Light genre tag, no negation cascade.
const GPT_CLEAN =
  'Clean LEGO diorama photography, crisp brick-built scene with clearly readable minifigures and brick architecture, vibrant LEGO color palette, soft studio lighting, MOC-showcase register';

module.exports = {
  PROMPT_PREFIX,
  PROMPT_SUFFIX,
  BRICK_PHOTO_MEDIUM,
  EVERYTHING_IS_BRICK_BLOCK,
  TOY_PHOTOGRAPHY_BLOCK,
  BRICK_DETAIL_BLOCK,
  STORY_SCENE_BLOCK,
  NO_TEMPLATE_BLOCK,
  GPT_CLEAN,
};
