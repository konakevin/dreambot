/**
 * AlphaBot candidate — chibi-halloween-cozy (destination: ChibiBot).
 *
 * Cloned onto ChibiBot's identity per ALPHABOT.md ("a path proven under the
 * wrong config proves nothing") — but written FULLY SELF-CONTAINED (function-
 * form, no shared-registry edits, seed pools required directly as JSON) so
 * it never touches alphabot/index.js, alphabot/pools.js, or alphabot/
 * shared-blocks.js while another candidate is being built in parallel.
 * ChibiBot's own hard identity (no humans ever, chibi proportions, cute +
 * cozy, never dark/menacing) is re-stated inline below rather than imported.
 *
 * CONCEPT: an INTIMATE INDOOR Halloween moment — 1-2 chibi critters carving
 * a pumpkin together by candlelight, telling spooky stories under a blanket
 * fort, or roasting marshmallows by a jack-o-lantern's glow. Small, private,
 * candlelit — the opposite of a wide village/street scene. Playful family-
 * friendly Halloween only: grinning jack-o-lanterns, fun-not-scary ghost
 * stories, never real horror, gore, or genuine scares.
 *
 * AXES (7 total):
 *   1. creature_1        (always)            — the chibi critter, non-human
 *   2. creature_2        (~50% conditional)  — "1-2 chibi critters"; solo is
 *                                              just as valid as a pair, so
 *                                              this is a coin-flip, not a
 *                                              default-to-pair
 *   3. accessory         (~40% conditional)  — ONE small optional Halloween
 *                                              touch (witch hat, bat-wing
 *                                              headband...) worn by a single
 *                                              present creature. Inlined as a
 *                                              plain array (short fixed list,
 *                                              no generated pool needed).
 *                                              Deliberately NOT on every
 *                                              render — a mandatory signature
 *                                              prop homogenizes every render
 *                                              into "the same one guy."
 *   4. activity          (always)            — the specific Halloween moment
 *                                              (pumpkin carving / ghost-story
 *                                              time / marshmallow roasting /
 *                                              12 more cozy variants)
 *   5. setting           (always)            — the small warm indoor nook
 *   6. decor             (always)            — one playful spooky-decor beat
 *   7. glow              (always) MONEY SHOT — the exact way warm candle /
 *                                              jack-o-lantern light washes
 *                                              the scene. This is the
 *                                              signature identity of the
 *                                              whole path (every one of the
 *                                              concept's 3 named moments is
 *                                              explicitly "by candlelight" /
 *                                              "by [a] glow"), so unlike a
 *                                              bolt-on prop it stays always-
 *                                              on — variety comes from its
 *                                              own 25-entry pool, not from
 *                                              being conditional.
 *
 * NON-NEGOTIABLE TEMPLATE MANDATE: every figure in the frame is affirmatively
 * a chibi CREATURE (real baby animal or fantasy critter) — never a human,
 * human child, or a person in costume. Stated up front AND re-stated at the
 * cast block (a "spooky story / trick-or-treat" concept is this bot's single
 * most likely human-leak failure mode, so it gets said twice, in the positive
 * register — creature anatomy words, never a human age/gender noun).
 *
 * Known failure modes deliberately designed around:
 *   - no human age/gender nouns anywhere (creature pool banHumanLanguage-
 *     gated at generation time; template never says "a young X")
 *   - no real-world ethnic/national labels (creatures are species-only)
 *   - accessory kept optional (~40%), never mandatory
 *   - positive register only ("PLAYFUL, fun-not-scary, grinning") — no bare
 *     negation as the only guardrail
 *   - no camera-framing axis added (composition line explicitly keeps the
 *     WHOLE cast + their lit corner in frame, never a macro on one prop)
 *   - tight/intimate framing is the explicit COMPOSITION instruction (this
 *     path's identity is the opposite of a wide village establishing shot)
 *
 * Medium note (for whoever wires this into chibibot/index.js at promotion —
 * NOT decided here): ChibiBot routes every look-enabled path to the
 * chibibot_neutral "looks" medium via mediumByPath; this path's identity
 * (creature-only, chibi-proportioned, no-humans) is exactly what
 * CHIBI_NEUTRAL already locks, so it should slot into that rotation like any
 * other look-enabled ChibiBot path with no bespoke medium/model override
 * needed.
 */

const CREATURES = require('../seeds/chibi_halloween_cozy_creatures.json');
const ACTIVITIES = require('../seeds/chibi_halloween_cozy_activities.json');
const SETTINGS = require('../seeds/chibi_halloween_cozy_settings.json');
const DECOR = require('../seeds/chibi_halloween_cozy_decor.json');
const GLOW = require('../seeds/chibi_halloween_cozy_glow.json');

// Small fixed list (12 options) — no generated pool needed. ONE optional
// Halloween touch worn/held by a single present creature, ~40% of renders.
const ACCESSORIES = [
  'a tiny black witch hat tilted rakishly to one side',
  'a soft felt bat-wing headband',
  'a candy-corn-striped bow clipped to one ear',
  'a miniature orange cape tied at the neck',
  'a squishy pumpkin-shaped hood',
  'a little spider hair-clip',
  'a smiling ghost-shaped button pinned to its chest',
  'a tiny broomstick tucked under one arm',
  'a jack-o-lantern-shaped basket handle looped over a paw',
  'a knit sweater with a stitched pumpkin on the front',
  'a striped orange-and-black scarf looped twice around its neck',
  'a paper crown cut like a row of pumpkin teeth',
];

module.exports = ({ sharedDNA, vibeDirective, picker }) => {
  const creature1 = picker.pickWithRecency(CREATURES, 'chibi_halloween_cozy_creature');

  let creature2 = null;
  if (Math.random() < 0.5) {
    const candidate = picker.pickWithRecency(CREATURES, 'chibi_halloween_cozy_creature');
    if (candidate !== creature1) creature2 = candidate;
  }
  const isPair = !!creature2;

  const activity = picker.pickWithRecency(ACTIVITIES, 'chibi_halloween_cozy_activity');
  const setting = picker.pickWithRecency(SETTINGS, 'chibi_halloween_cozy_setting');
  const decor = picker.pickWithRecency(DECOR, 'chibi_halloween_cozy_decor');
  // MONEY SHOT — the signature candle/jack-o-lantern glow. Always rolled;
  // variety comes from a 25-entry pool, not from being conditional (see
  // header note above).
  const glow = picker.pickWithRecency(GLOW, 'chibi_halloween_cozy_glow');

  const accessory =
    Math.random() < 0.4 ? ACCESSORIES[Math.floor(Math.random() * ACCESSORIES.length)] : null;

  const castLines = [`1. ${creature1}`];
  if (isPair) castLines.push(`2. ${creature2}`);
  const accessoryLine = accessory
    ? isPair
      ? `\nOne of the two is wearing/holding ${accessory} — a small charming touch, not a full costume.`
      : `\nIt is wearing/holding ${accessory} — a small charming touch, not a full costume.`
    : '';

  const castBlock = isPair
    ? `THE TWO OF THEM, close together and sharing this moment (never a human, never a human child — both are affirmatively non-human creatures):\n${castLines.join('\n')}${accessoryLine}`
    : `THE LONE CREATURE, caught in this candlelit moment (never a human, never a human child — affirmatively non-human):\n${castLines.join('\n')}${accessoryLine}`;

  return `You are a master pop-surrealist toy-illustrator writing ONE intimate, cozy INDOOR HALLOWEEN moment for a chibi-creature art bot. A small, candlelit scene — 1-2 adorable chibi creatures caught mid-moment on a playful autumn evening. Warm, wholesome, family-friendly: a "spooky story" here is delightfully fun-scary, NEVER a real scare; jack-o-lanterns grin, nothing is bloody or genuinely frightening. Output wraps with style prefix + suffix.

━━━ NON-NEGOTIABLE — READ FIRST ━━━
Every figure in the frame is affirmatively a chibi CREATURE — a real baby animal or a cute fantasy critter, chibi-proportioned (oversized head, massive glassy eyes) — NEVER a human, human child, or a person in a costume. Describe only the creature's own anatomy (fur, feathers, scales, paws, snout, wings, whiskers, tail) — never a human age or gender word. This is PLAYFUL Halloween coziness, not horror.

━━━ THE CAST ━━━
${castBlock}

━━━ THE MOMENT (the activity they're caught doing) ━━━
${activity}

━━━ THE COZY SETTING ━━━
${setting}

━━━ ONE PLAYFUL DECOR TOUCH ━━━
${decor}

━━━ THE SIGNATURE GLOW — the money shot; honor this light exactly ━━━
${glow}

━━━ SCENE PALETTE ━━━
${sharedDNA.scenePalette}

━━━ SECONDARY LIGHTING VIBE ━━━
${sharedDNA.colorPalette}

━━━ MOOD ━━━
${vibeDirective.slice(0, 200)}

━━━ COMPOSITION — INTIMATE, NOT A WIDE ESTABLISHING SHOT ━━━
Tight, close framing — the creature(s) and their small warm-lit corner fill the frame; this is a private, held-breath cozy moment, not a village or street scene, so keep it small in scope. The signature glow above is the dominant light source in the whole frame: let it visibly shape shadows, catchlights in the eyes, and warm color temperature across fur, fabric, and walls alike. Everything reads as safe, loved, and gently magical. CRITICAL: this tight framing must never crop the Halloween out of the shot — the decor touch above, and the glow's own light-source (the carved jack-o-lantern, candle, or lantern itself), have to sit right beside or in the hands of the creature(s), close enough to stay clearly in view within this close-up — never a mantel/shelf/windowsill detail across the room that a tight shot would cut off. A viewer glancing at the finished image must instantly spot a concrete pumpkin, candle, or Halloween prop right there with the creature(s) — warm-colored light alone, with no visible source, is not enough. AVOID THE DEFAULT POSE: do not let the creature(s) collapse into a static posed portrait — paws simply resting on/around the glow-source, head turned to gaze out at the viewer. Instead, their pose must visibly be mid-gesture of the exact moment named above — mid-carve, mid-page-turn, mid-reach, head tipped down at the work in their paws, not up at camera — so the specific activity is legible at a glance, not just the pumpkin and the blush.

Output ONLY the raw 70-100 word scene description. Comma-separated phrases. NO preamble, NO titles, NO headers, NO ━━━ or ═══ or ### markers, NO **bold labels**, NO "render as" suffixes. Start immediately with the scene content.`;
};
