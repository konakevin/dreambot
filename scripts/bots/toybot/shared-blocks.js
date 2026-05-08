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

// Anti-human-leak rule for action-figure paths. Sonnet/Flux otherwise read
// archetype words ("priestess", "warrior", "ninja") + skin/flesh language
// as REAL HUMANS instead of plastic action figures. Collector-shelf-epic
// hit this on a "voodoo priestess" entry — rendered as a human with violet
// skin instead of an articulated plastic figure with painted skin-tone.
const ACTION_FIGURE_ANTI_HUMAN_LEAK_BLOCK = `━━━ ANTI-HUMAN-LEAK — FIGURE IS PLASTIC ━━━

Every figure in the scene is a PLASTIC ACTION FIGURE, not a real person. Anchor that with toy-medium language INSIDE the figure description, not just in the medium prefix.

REQUIRE these words about the figure: molded, painted, sculpted, cast, articulated, ball-jointed, plastic, vinyl, weathered (paint), primer (chips), 1/12-scale.

FORBID these words about the figure: "skin" (use "painted skin-tone" or "plastic skin-tone"), "flesh", "real eyes", "wet eyes", "tears", "sweat", "breath", "alive", "her face" / "his face" alone (use "painted face" or "sculpted face").

If the archetype is a person (priestess, warrior, ninja, knight, etc.), ALWAYS attach "action figure" / "1/12-scale plastic figure" / "articulated figurine" so Flux renders the toy, not a human.

The figure is OPENLY ARTIFICIAL — ball-joints showing, primer-chip weathering, brushwork visible, oversized accessories at scale. Embrace plastic-toy language throughout.`;

// Real-world staging block — used by 17 paths (all except miniature-dungeon
// which has its own tabletop-diorama identity). Forces "toys living in our
// world at their tiny scale" framing so renders feel like real-world
// toy photography, not handcrafted toy dioramas. Pairs with the
// staging axis pool (seeds/staging_axis.json).
const REAL_WORLD_STAGING_BLOCK = `━━━ REAL-WORLD STAGING — NON-NEGOTIABLE ━━━

The toy is LIVING in the REAL WORLD at its tiny scale. The scene is shot in a real human environment (real surfaces, real objects, real light, real weather, real dust) with the toy existing INSIDE that environment as if it has a tiny life happening there. NOT a handcrafted toy diorama. NOT a backdrop painted to look real. The real world IS the toy's world.

The setting in the STAGING block below is the WHERE/HOW of the scene. Treat the toy/figure described in the SCENE seed as the WHO/WHAT, then drop them into this real-world setting. Implied story / "moment in the day" vibe — they have errands, adventures, struggles, quiet moments, like real residents of this real world.

Use real-world textures explicitly: real wet asphalt, real wood grain, real moss, real concrete, real fabric weave, real ceramic, real glass, real metal scratches, real dust, real sand, real grass. NOT painted prop, NOT crafted set, NOT diorama.

Forced perspective and scale illusion are encouraged — make the brain ask "how is this physically possible?". Toy-scale interaction with real-scale environment is the wow.`;

// Story + cast block — every render must show 2-4 characters in a narrative
// moment, not a single-figure portrait. Pairs with REAL_WORLD_STAGING_BLOCK
// + the camera framing axis to push ToyBot away from "billion single
// character portraits" (Kevin 2026-05-08) toward LEGO-style multi-figure
// story scenes where you can read who's doing what to whom.
const STORY_AND_CAST_BLOCK = `━━━ MULTI-CHARACTER STORY MOMENT — NON-NEGOTIABLE ━━━

The scene must have 2-4 figures in the frame. Single-character portraits are FORBIDDEN. The figures are mid-NARRATIVE — show what's happening AT THIS MOMENT with cause and reaction:
  • One figure does something (verb) — climbing, pointing, fleeing, fighting, hiding, repairing, crying, celebrating, conspiring, peeking, confronting.
  • Another figure REACTS — surprised, helping, opposing, watching, mid-arrival.
  • The composition tells a small story like a single LEGO set diorama: who, what, why, what's about to happen next.

Bad (single hero portrait): "vinyl figure of a goth witch standing in front of a graveyard, looking serious"

Good (multi-character story beat): "vinyl goth witch climbing onto a real moss-covered headstone while her vinyl raven familiar lands on her shoulder mid-flight, a tiny vinyl ghost peeking over a smaller stone behind, real cobweb stretched between them — moonlit cemetery in real backyard at dusk"

The camera framing block above is the WHO-IS-IN-THE-FRAME control. The staging block is the WHERE. This block is the WHAT-HAPPENS.`;

// World-mode injection — the scenario + real-world staging axis. Returns
// empty string in classic mode so path-builders render with just the path's
// own bespoke SCENES/LANDSCAPES pool (the pre-2026-05 classic behavior).
function worldStagingSection({ renderMode, scenario, staging }) {
  if (renderMode !== 'world') return '';
  return `━━━ THE SCENARIO ━━━
${scenario}

Combine the cast/figures described above with this multi-character story moment in a real-world setting. The path's medium-specific cast performs the scenario.

━━━ REAL-WORLD STAGING — TOY LIVING IN OUR WORLD AT ITS SCALE ━━━
${staging}

${REAL_WORLD_STAGING_BLOCK}
`;
}

// Multi-character story-and-cast block — world-mode only. Classic mode lets
// the path's SCENES pool drive the cast count naturally (some classic seeds
// describe single figures, some describe scenes).
function storyCastSection(renderMode) {
  return renderMode === 'world' ? STORY_AND_CAST_BLOCK : '';
}

module.exports = {
  PROMPT_PREFIX,
  PROMPT_SUFFIX,
  TOY_PHOTOGRAPHY_BLOCK,
  CINEMATIC_STORY_BLOCK,
  DRAMATIC_LIGHTING_MAKES_CHEAP_LOOK_EPIC_BLOCK,
  PATH_MEDIUM_LOCK_BLOCK,
  BLOW_IT_UP_BLOCK,
  ACTION_FIGURE_ANTI_HUMAN_LEAK_BLOCK,
  REAL_WORLD_STAGING_BLOCK,
  STORY_AND_CAST_BLOCK,
  worldStagingSection,
  storyCastSection,
};
