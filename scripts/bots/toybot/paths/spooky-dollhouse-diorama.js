/**
 * spooky-dollhouse-diorama — AlphaBot Halloween candidate path, eventual
 * promotion target: ToyBot.
 *
 * CONCEPT: a miniature HAUNTED DOLLHOUSE rendered as a physical toy/model
 * ARCHITECTURAL diorama — tiny cobwebbed rooms glimpsed through lit windows,
 * a crooked turret or other haunted-house quirk, warm window-glow punching
 * through a dark exterior silhouette, shot as a cinematic macro toy
 * photograph. The HOUSE ITSELF is the hero (architecture, not a dollhouse
 * cast of little people) — closer in spirit to ToyBot's model-train-world /
 * giant-toys "the scene/object is the subject" register than to
 * dollhouse-life's figurine-cast register.
 *
 * NON-NEGOTIABLE TEMPLATE MANDATE — the one rule this whole path depends on:
 *   This is ALWAYS a REAL PHYSICAL HANDCRAFTED MINIATURE DOLLHOUSE TOY —
 *   scale-model architecture built from wood / card / paint / glue at toy
 *   scale — NEVER an actual full-size house, NEVER photoreal real-world
 *   architecture. Any haunting is PLAYFUL Halloween-cute (friendly ghosts,
 *   grinning jack-o-lanterns, cozy cobwebs) — NEVER genuine horror, gore, or
 *   real scares. If this mandate slips, the render stops being a ToyBot toy
 *   photograph and just becomes a photo of a spooky house.
 *
 * Self-contained function-form path. Requires its own seed pools DIRECTLY
 * (no pools.js registry edit) — six bespoke axes, none shared with any
 * other path:
 *   1. HAUNTED_ARCHITECTURE    — MONEY-SHOT axis (pool, MVP-25). The
 *      dollhouse's exterior silhouette + ONE haunted/crooked quirk. ALWAYS
 *      present — this IS the iconic detail every render is built around.
 *      (A whole 25-entry pool, not one hardcoded feature, so "always
 *      present" never collapses into "always the same one house.")
 *   2. COBWEBBED_ROOM_VIGNETTE — pool (MVP-25). One tiny interior room
 *      glimpsed through a lit window / open dollhouse-front cutaway.
 *   3. YARD_AND_GROUNDS        — pool (MVP-25). The exterior grounds/base
 *      dressing that seats the dollhouse in a believable little diorama.
 *   4. FRIENDLY_HAUNT_ACCENT   — pool (MVP-25), OPTIONAL ~45% of renders.
 *      One tiny toy-scale friendly creature/detail. Deliberately NOT
 *      mandatory — a signature accent on every single render would
 *      homogenize every house into "the one with the ghost."
 *   5. WINDOW_GLOW_PALETTE     — inline fixed list. The warm glow color
 *      punching through the dark exterior (the "warm window-glow against
 *      a dark exterior" half of the concept brief).
 *   6. SKY_AND_ATMOSPHERE      — inline fixed list. Dusk/night backdrop.
 *
 * Camera framing rides on the bot-level `sharedDNA.camera` (consistent with
 * every other ToyBot path) plus one bespoke framing-safety instruction below
 * so a close macro never dissolves the whole-house read (known failure mode
 * for camera axes on architecture/object subjects).
 */

const ARCHITECTURE = require('../seeds/spooky_dollhouse_architecture.json');
const ROOM_VIGNETTE = require('../seeds/spooky_dollhouse_room_vignette.json');
const YARD_GROUNDS = require('../seeds/spooky_dollhouse_yard_grounds.json');
const HAUNT_ACCENT = require('../seeds/spooky_dollhouse_haunt_accent.json');

// Axis 5 — warm glow color cutting through the dark exterior. Fixed short
// list; doesn't need a generated pool.
const WINDOW_GLOW_PALETTE = [
  'warm candlelit amber glow pouring from every window',
  'deep pumpkin-orange glow spilling out from the windows',
  'ghostly pale-green glow flickering behind the curtains',
  'witchy violet-purple glow pulsing softly from within',
  'warm honey-gold lamplight glowing in the front windows',
  'cool moonlit-blue glow with one single warm amber window as the exception',
  'flickering candle-orange glow like real flame behind the glass',
];

// Axis 6 — dusk/night backdrop. Fixed short list; doesn't need a generated pool.
const SKY_AND_ATMOSPHERE = [
  'a deep indigo dusk sky just past sunset, one last band of orange low on the horizon',
  'a huge low harvest moon glowing behind thin drifting clouds',
  'a starry black night sky with a faint wisp of ground fog',
  'swirling autumn leaves caught mid-drift on a light breeze',
  'a soft silvery ground-fog pooling low around the base of the house',
  'a deep-blue twilight sky with the first stars just appearing',
];

module.exports = ({ sharedDNA, vibeDirective, picker }) => {
  const architecture = picker.pickWithRecency(ARCHITECTURE, 'spooky_dollhouse_architecture');
  const roomVignette = picker.pickWithRecency(ROOM_VIGNETTE, 'spooky_dollhouse_room_vignette');
  const yardGrounds = picker.pickWithRecency(YARD_GROUNDS, 'spooky_dollhouse_yard_grounds');
  const glow = WINDOW_GLOW_PALETTE[Math.floor(Math.random() * WINDOW_GLOW_PALETTE.length)];
  const sky = SKY_AND_ATMOSPHERE[Math.floor(Math.random() * SKY_AND_ATMOSPHERE.length)];

  // Optional ~45% — deliberately NOT mandatory (see header note). Half the
  // time the house's own architecture + rooms + grounds carry the shot alone.
  const accent =
    Math.random() < 0.45
      ? picker.pickWithRecency(HAUNT_ACCENT, 'spooky_dollhouse_haunt_accent')
      : null;
  const accentBlock = accent
    ? `\n\n━━━ A FRIENDLY HAUNT ACCENT (this render has one) ━━━\n${accent}`
    : '';

  return `You are a macro toy photographer shooting a MINIATURE HAUNTED DOLLHOUSE for ToyBot — a real handcrafted scale-model architectural toy, playful trick-or-treat spooky, never a genuine scare. Photoreal cinematic macro, shallow depth of field, tilt-shift miniature photography.

━━━ NON-NEGOTIABLE — THIS IS A TOY, NOT A REAL HOUSE ━━━
The dollhouse is a REAL PHYSICAL HANDCRAFTED MINIATURE — hand-cut wood siding, glued card shingles, hand-painted trim, visible glue seams, dollhouse-scale hardware — built and photographed on a tabletop. NEVER an actual full-size house, NEVER a photoreal real-world building, NEVER populated by real humans. The haunting is PLAYFUL Halloween-cute — grinning jack-o-lanterns, friendly ghosts, cozy cobwebs — NEVER genuine horror, gore, or real scares.

━━━ THE HOUSE — its one unmistakable haunted quirk ━━━
${architecture}

━━━ A ROOM GLIMPSED INSIDE — cobwebbed but cozy-spooky ━━━
${roomVignette}

━━━ THE GROUNDS — what the dollhouse sits in ━━━
${yardGrounds}${accentBlock}

━━━ WARM GLOW AGAINST THE DARK EXTERIOR ━━━
${glow}. The exterior itself reads dark and silhouetted; the glow is the one warm thing cutting through it — that contrast is the whole point of the shot.

━━━ SKY + ATMOSPHERE ━━━
${sky}

━━━ CAMERA — KEEP THE WHOLE HOUSE READABLE ━━━
${sharedDNA.camera}
Whatever the framing calls for, this shot MUST show the dollhouse's full silhouette from roofline to ground in frame — NEVER crop in so tight that only a single window, porch section, or wall detail fills the shot. The architecture is the hero of the shot, not a single texture or prop macro.

━━━ SCENE-WIDE COLOR PALETTE ━━━
${sharedDNA.scenePalette}

━━━ SECONDARY LIGHTING VIBE ━━━
${sharedDNA.colorPalette}

━━━ MOOD ━━━
${vibeDirective.slice(0, 150)}

Output ONLY the 80-110 word Flux prompt, comma-separated phrases. NO preamble, NO headers, NO ━━━ markers, NO "render as" suffixes. Start immediately with the scene description. End with: no text, no words, no letters, no watermarks, masterwork composition, hyper detailed.`;
};
