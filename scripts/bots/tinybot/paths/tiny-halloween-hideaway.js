/**
 * AlphaBot candidate — tiny-halloween-hideaway (destination: TinyBot).
 *
 * A SINGLE tiny critter's cozy Halloween micro-home: a hollowed pumpkin
 * turned into a one-room cottage, an acorn-cap turned into a candy stand, or
 * a walnut-shell / gourd den — warm, intimate, small-scale. Unlike its
 * village-scale sibling `tiny-halloween-village` (a whole lantern-lit town
 * square with 1-2 cast members), this path is deliberately INTIMATE: ONE
 * home, ONE critter, mid-close framing — the "one perfect little dwelling"
 * shot rather than a wide diorama. HOME pool = the money-shot axis (the
 * natural-object dwelling itself, its material identity kept unmistakably
 * readable). CRITTER pool = the mandatory single resident (never a second —
 * intimacy is the point). DECOR pool = the lived-in furnishing detail that
 * makes the home feel actually inhabited, not staged.
 *
 * ━━━ PORTABILITY NOTE (read before wiring or promoting) ━━━
 * Per ALPHABOT.md's portability contract, this path CLONES TinyBot's identity
 * rather than importing tinybot/shared-blocks.js (keeps this file self-
 * contained under alphabot/, and keeps the eventual promotion diff to just
 * "move this file + its 3 seed JSONs + this gen script"). The blocks below
 * marked "CLONED VERBATIM FROM TINYBOT" are byte-identical copies of
 * scripts/bots/tinybot/shared-blocks.js as of 2026-09-06 (one block,
 * NO_HUMANS, is ADAPTED for this path's mandatory-single-critter rule —
 * noted inline). If TinyBot's blocks change before this path is promoted,
 * re-sync them.
 *
 * When wiring this into a bot's index.js (AlphaBot CANDIDATES for iteration,
 * or TinyBot's pathBuilders on promotion), clone TinyBot's own per-path
 * config byte-identical (the portability contract — "a path proven under the
 * wrong config proves nothing"):
 *   - mediums: ['photography', 'claymation', 'render']  (bot-level, no
 *     per-path override needed — matches tiny-cozy / contained-worlds)
 *   - allowedModels: ['black-forest-labs/flux-1.1-pro',
 *     'black-forest-labs/flux-1.1-pro-ultra']  (bot-level, no override)
 *   - promptPrefix / promptSuffix: TinyBot's blocks.PROMPT_PREFIX /
 *     PROMPT_SUFFIX (bot-level — exported below as
 *     TINY_HALLOWEEN_HIDEAWAY_PROMPT_PREFIX/SUFFIX for convenience, text
 *     identical)
 *   - vibes: TinyBot's vibes list (cinematic/cozy/nostalgic/peaceful/
 *     whimsical/ethereal/ancient/enchanted/shimmer)
 *   - twoPassPolish: enabled, conceptWords 150, polishedWords '65-90'
 *   - sensoryAnchors: enabled, requiredChannels ['lightcolor'],
 *     pathContext: 'scene'
 *   - chaos: enabled, add to allowSubjectChaosPaths (like the other cozy /
 *     contained-world paths); do NOT add to skipPaths
 *   - Axis keys used here ('tiny_halloween_hideaway_home', '..._critter',
 *     '..._decor') do not collide with any existing TinyBot or AlphaBot axis
 *     — verified 2026-09-06 (also distinct from the sibling
 *     tiny_halloween_village_* keys).
 *
 * NOT this task's job: wiring alphabot/index.js CANDIDATES or tinybot's
 * pathBuilders/paths[] — a later, separate step does that.
 */

const HOMES = require('../seeds/tiny_halloween_hideaway_home.json');
// R5 QA fix (2026-09-06, diagnosing R4 renders): R2-R4 all tuned the
// HALLOWEEN_FLOURISH pool alone (make it mandatory → bolder icons → fix its
// focal-plane placement), yet the "instantly reads as Halloween" score was
// STILL the weak dimension across R4's renders — because the flourish was
// this path's ONLY guaranteed Halloween-specific content in a ~250+ word
// prompt otherwise dominated by generic cozy-autumn-woodland phrasing (HOME
// = natural-material identity, DECOR = generic furnishing clutter, CRITTER
// = 100% neutral cozy chores). Two concrete failures confirmed this: (1) a
// witch-hat flourish visually merged with the HOME entry's own
// independently-described chimney feature into one ambiguous blob (both
// targeted "the chimney cap"); (2) a whole render lost its flourish AND its
// mandatory critter together when the picked HOME entry set the doorway at
// a low/ground-level position (same DOF-collapse failure mode the R4 fix
// already diagnosed for the doorstep flourish, recurring here for a HOME
// entry's own door). Rather than a 4th pass at the flourish pool, this round
// raises the density of Halloween-specific content in the CRITTER pool
// instead — the critter is the one axis that's ALWAYS mandatory (never
// optional) and ALWAYS the sharp-focus subject (mandate #2 below), making it
// a far more reliable Halloween carrier than a small competable-for-space
// background prop. 7 of 25 previously-generic-chore entries (rosehip soup →
// spiced cider, plain book → ghost story, seed dish → candy-corn treats,
// stacked acorns → candy-corn kernels, seed parcels → candy treats, knitted
// scarf → witch-cape, plain lantern → jack-o-lantern) were swapped for
// Halloween-coded activities; the majority stay plain-cozy per the "never
// mandatory on every entry" lesson.
const CRITTERS = require('../seeds/tiny_halloween_hideaway_critter.json');
const DECOR = require('../seeds/tiny_halloween_hideaway_decor.json');

// ─────────────────────────────────────────────────────────────
// Bespoke axes 4-6 — short fixed lists, inlined per the playbook guidance
// (axes that don't need generated-pool depth). Plain JS arrays, no pool file.
// ─────────────────────────────────────────────────────────────

// Optional signature flourish (~50% present, per the "never mandatory on
// every entry" lesson) — a small carved-into-the-home's-own-hide Halloween
// touch, distinct from the DECOR pool's furnishing-and-clutter detail.
// R3 QA fix (2026-09-06): 7 of the original 12 entries were subtle TEXTURE
// details (garland, twig broom, dried-orange-peel curl, acorn-cap lantern,
// spider-silk-dew thread, snail-shell doorstop, cinnamon smoke) with no real
// Halloween iconography — they blend into generic cozy-autumn decor and
// vanish under the shallow-DOF miniature look. R1 re-QA renders drew "twig
// broom" and "berry-and-twine garland in lavender/grape" and both read as
// plain fall, not Halloween, confirming this pool was the recurring failure
// (this flourish is the path's ONLY guaranteed Halloween-specific carrier —
// see comment below). Replaced those 7 with bold, SILHOUETTE-SCALE markers
// (witch hat, second jack-o-lantern, bat bunting, ghost cutout, scarecrow,
// jagged jack-o-lantern teeth, paper spider) chosen so they read as
// unmistakably Halloween even small-in-frame or softened by blur — kept the
// 5 entries that were already strong (carved grinning face, seed-teeth
// smile, paper bat, candy-corn mat ring, candy-corn windowsill dish).
const HALLOWEEN_FLOURISH = [
  'a small grinning face is carved directly into the pumpkin\'s own rind beside the door, glowing from a candle-stub within',
  'a single ring of tiny carved-seed teeth lines the doorway like a friendly jack-o-lantern smile',
  'a tiny witch\'s hat, woven from a curled dried leaf, sits tilted at a jaunty angle atop the roofline or chimney cap',
  'a thumbnail-sized paper bat is pinned above the door, turning gently on a thread',
  // R4 QA fix (2026-09-06): this entry previously read "a tiny woven-grass
  // welcome mat sits on the step, edged with a single ring of candy-corn
  // kernels" — a GROUND-LEVEL/doorstep prop. R3 renders showed it (paired
  // with the acorn-cap "market stall" HOME entry) fail to render at all: the
  // COMPOSITION block explicitly treats ground-level foreground as the
  // blur-prone edge of frame ("a soft out-of-focus hint of the wider world
  // at the frame's edge"), so a doorstep-level flourish lands exactly where
  // tilt-shift DOF is heaviest and gets lost — the resulting render had zero
  // Halloween marker anywhere (no pumpkin-orange HOME material either) and
  // read as a generic spring-garden critter shot. Every OTHER flourish entry
  // that reliably survived QA renders sits at doorway/roofline/windowsill
  // height, inside the sharp focal plane the COMPOSITION block protects —
  // so this entry is moved up onto the doorway arch itself to match that
  // pattern, keeping the same candy-corn icon.
  'a garland of candy-corn kernels, alternating orange, yellow, and white, is strung along the top of the doorway arch',
  'a second, thumb-sized pumpkin beside the home glows from its own tiny triangle-cut jack-o-lantern face, doing double duty as a porch lantern',
  'a row of tiny bat silhouettes, cut from dark leaf-paper, is strung on a thread above the doorway like Halloween bunting',
  'a small pale ghost shape, cut from a dried leaf left thin and papery, hangs from a thread by the door and turns slowly',
  'a miniature scarecrow of crossed twigs and a scrap of burlap fabric stands watch just outside the entrance',
  'a tiny stack of striped candy-corn kernels is piled in a dish on the windowsill',
  'the doorway is carved with two jagged triangle teeth flanking its arch, reading unmistakably as a jack-o-lantern\'s grin',
  'a curl of black leaf-paper, cut into a spider shape, is tucked into a corner of the doorframe on a single thread',
];

// Ambient environment — always present (standard atmospheric texture layer,
// mirrors "atmosphere" pools used every render in tiny-cozy / contained-worlds).
const ATMOSPHERE = [
  'a thin curl of woodsmoke rises from the chimney and dissolves into the dusk',
  'a few fallen leaves rest against the base of the home, one still drifting down',
  'a light mist beads on every surface, catching the warm window-glow',
  'a single moth circles the lit window in slow, lazy loops',
  'dew sits in fat beads along a nearby blade of grass, each one holding a tiny amber reflection',
  'a distant cricket-chirp is the only sound in the still night air',
  'a faint breeze stirs the grass around the home\'s base, nothing more',
  'the hush of a settling evening presses in close around the little dwelling',
  'a scatter of acorn caps and small seeds lies undisturbed near the doorstep',
  'wisps of thin fog pool low around the base of the home, softening its edges',
];

// Light source / quality — always present (this path's warm-window-glow
// signature, mirrors tiny-winter-village's amber-vs-cold contrast).
const NIGHT_LIGHT = [
  'warm candlelight spills from the single round window, the only warm color in a cool blue dusk',
  'a low harvest moon sits huge and orange just behind the home, silhouetting its curved roofline',
  'firefly-jar light glows soft gold from just inside the open door',
  'starlight and a sliver of crescent moon give everything a cool silver-blue cast, except the one warm window',
  'a lone lantern hook beside the door holds a small glowing light, warm against the deepening indigo sky',
  'the last band of sunset light rakes low across the little home, turning its rind or shell warm amber',
  'soft moonlight filters through thin cloud, giving the whole scene a hushed silver glow but for the lit window',
  'a shaft of warm light escapes through a crack in the door, cutting a gold line across the ground outside',
];

function pickInline(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

// ─────────────────────────────────────────────────────────────
// CLONED VERBATIM FROM TINYBOT (scripts/bots/tinybot/shared-blocks.js,
// 2026-09-06) — TinyBot's own non-negotiable identity, reproduced here so
// this file has zero cross-bot require() dependency. NO_HUMANS is ADAPTED
// for this path's mandatory-single-critter rule — noted inline.
// ─────────────────────────────────────────────────────────────

const TINY_HALLOWEEN_HIDEAWAY_PROMPT_PREFIX =
  'miniature diorama photography, tabletop model world, tilt-shift macro lens, extreme shallow depth of field, dollhouse-scale, handcrafted tiny props, miniature set dressing, realistic modelmaking textures, visible tiny imperfections';

const TINY_HALLOWEEN_HIDEAWAY_PROMPT_SUFFIX =
  'miniature tabletop diorama model, tilt-shift shallow depth of field, macro lens close-up, tiny handcrafted props, visible miniature scale, no text, no words, no watermarks';

const TILT_SHIFT_MINIATURE_BLOCK = `━━━ TILT-SHIFT MINIATURE AESTHETIC (NON-NEGOTIABLE — THIS IS THE MOST IMPORTANT RULE) ━━━

This MUST look like a TABLETOP MODEL / DIORAMA photographed with a MACRO LENS. NOT a real full-scale scene. NEVER a normal photograph of a real place. The viewer must IMMEDIATELY know this is miniature — visible table edge or surface beneath, extreme shallow depth-of-field with foreground and background blur, tiny handcrafted imperfections (brush strokes, glue marks, visible seams, painted surfaces, miniature fabric fibers). Scale anchors required: furnishings must look thumb-sized, the home itself no bigger than a real pumpkin, acorn, or gourd because THAT IS WHAT IT LITERALLY IS. If it could be mistaken for a real full-scale photo, you have FAILED.`;

const OBSESSIVE_MICRO_DETAIL_BLOCK = `━━━ OBSESSIVE MICRO DETAIL ━━━

Every tiny detail countable. Individual carved lines in the rind, individual stitches on a leaf-blanket, individual seeds in a dish. Stare-for-5-minutes quality — viewer finds new tiny things every look. Surface density is the signature — never sparse, never one bare prop on an empty table.`;

const CLEVER_CUTE_WHOA_BLOCK = `━━━ CLEVER + CUTE + WHOA ━━━

Stop + lean in + smile + look twice. The render must produce ALL of: clever composition + cute subject + surprising scale-play (a real pumpkin/acorn/gourd, lived in!) + cozy warmth. Never just a pretty prop — always with a moment of "wait, that's a real acorn cap?" or "OH that's adorable."`;

// ADAPTED from TinyBot's NO_HUMANS_BLOCK — this path's cast is exactly ONE
// mandatory tiny critter resident, never a second (intimacy is the point).
const NO_HUMANS_BLOCK = `━━━ NO HUMANS — EXACTLY ONE CRITTER, NEVER A SECOND ━━━

No identifiable humans in frame, not even peripheral silhouettes — this is too intimate a shot for background people. Exactly ONE small real woodland critter (mouse, hedgehog, vole, chipmunk, squirrel, toad, or similar), proportioned like an actual animal, living in this home — REQUIRED, never optional, never a human, never an upright human-posed "creature-person" mascot. Never a second critter — one resident, one home, keep it intimate.`;

const IMPOSSIBLE_BEAUTY_BLOCK = `━━━ IMPOSSIBLE BEAUTY — MINIATURE EDITION ━━━

Snow-globe-world quality × 10. The kind of image you want to shrink down and live inside. Wall-poster gorgeous. Tilt-shift + macro + obsessive detail.`;

const TINY_COZY_WARMTH_BLOCK = `━━━ TINY COZY WARMTH ━━━

Warm + inviting + homey + lived-in. This tiny home feels actually inhabited — a half-carved pumpkin lid resting nearby, a acorn-cap teacup still out, a leaf-quilt wrinkled on a twig bed, a candle stub burned halfway down. Soft warm amber/honey palette against the cool night around it. Viewer wants to shrink down and move in.`;

const BLOW_IT_UP_BLOCK = `━━━ BLOW IT UP — MINIATURE AMPLIFICATION ━━━

Miniature magic is the canvas, not the ceiling. Stack: obsessive micro-detail + tilt-shift-blur-gradient + countable elements + clever material-honesty juxtaposition (this really is a hollowed pumpkin / acorn cap / walnut shell) + cozy warmth. If viewer doesn't want to shrink down and live in it, dial up.`;

// ─────────────────────────────────────────────────────────────
// Path builder
// ─────────────────────────────────────────────────────────────

module.exports = ({ sharedDNA, vibeDirective, picker }) => {
  const home = picker.pickWithRecency(HOMES, 'tiny_halloween_hideaway_home');
  const critter = picker.pickWithRecency(CRITTERS, 'tiny_halloween_hideaway_critter');
  const decor = picker.pickWithRecency(DECOR, 'tiny_halloween_hideaway_decor');
  const atmosphere = pickInline(ATMOSPHERE);
  const nightLight = pickInline(NIGHT_LIGHT);

  // MANDATORY signature flourish — R2 QA fix (2026-09-06): the HOME/CRITTER/
  // DECOR pools are mostly generic cozy-woodland-autumn phrasing with NO
  // inherent Halloween marker (verified: HOME[2] "acorn cap tea counter" +
  // CRITTER[14] "red squirrel patches an oak-leaf cloak" + DECOR[23]
  // "leaf-quilt bunched at the foot of the bed" — zero Halloween content
  // across all three). The FLOURISH block is this path's only guaranteed
  // Halloween-specific visual carrier, so it can no longer be a 50% coin
  // flip (R2 renders that missed the flip read as plain autumn, not
  // Halloween, at 2/3 in QA). Always include one; the "never mandatory on
  // every entry" lesson still applies to which flourish LINE gets picked
  // (12-way pool keeps it from repeating the same prop every render), just
  // not to whether a flourish appears at all.
  const flourish = pickInline(HALLOWEEN_FLOURISH);
  const flourishBlock = `\n━━━ SIGNATURE HALLOWEEN FLOURISH (mandatory — this render's unmistakable Halloween marker) ━━━\n${flourish}\nThis flourish must sit in the SHARP focal plane, close enough to the home or resident to read clearly at a glance — never pushed to the blurred edge of frame where it disappears.\n`;

  return `You are a master model-maker AND storyteller writing CUTE, cozy-spooky MINIATURE HALLOWEEN-HIDEAWAY scenes for TinyBot. A SINGLE tiny critter's cozy Halloween micro-home: a real hollowed pumpkin turned into a one-room cottage, an acorn-cap turned into a tiny candy stand, or a walnut-shell / gourd den — warm, intimate, small-scale. This is NOT a village or a wide diorama — it is ONE perfect little dwelling, shot mid-close, with ONE critter resident living in it. Storybook-adorable and PLAYFULLY spooky — a grinning carved face or a friendly ghost motif is welcome, never genuine horror. Output wraps with style prefix + suffix.

${TILT_SHIFT_MINIATURE_BLOCK}

${OBSESSIVE_MICRO_DETAIL_BLOCK}

${CLEVER_CUTE_WHOA_BLOCK}

${NO_HUMANS_BLOCK}

${IMPOSSIBLE_BEAUTY_BLOCK}

${TINY_COZY_WARMTH_BLOCK}

━━━ NON-NEGOTIABLE TEMPLATE MANDATE — THIS PATH'S CORE IDENTITY ━━━

Every render MUST satisfy BOTH of these or it has failed its brief:
1. MATERIAL-HONEST HOME (the money shot) — the dwelling is UNMISTAKABLY carved/hollowed from a real natural object (pumpkin, acorn cap, walnut shell, gourd, chestnut). Its natural rind, shell, cap-texture, or seed-pod grain must stay visibly readable in the render — this is never a generic round cottage that merely happens to be orange. The object's real-world identity IS the punchline; keep it legible.
2. EXACTLY ONE CRITTER RESIDENT — one small real woodland animal (never a human, never an upright human-posed mascot) actually living in and using this home. Never zero, never two — one resident keeps it intimate. If the home has more than one window, door, or opening, stage the critter in exactly ONE of them and make that opening the unmistakable visual focus of the shot — render every other opening as a quieter secondary glimpse (a soft glow, a bare hint of shape) with far less prop detail, never a rival focal point that splits attention away from the critter.
Keep the register PLAYFUL and cozy-spooky throughout — a carved grin, a friendly ghost-paper cutout, warm candlelight. Never true horror, gore, or real scares. Never a negation as the only guardrail — describe the warm, friendly register directly.

━━━ THE HIDEAWAY (the money-shot home structure — stage the whole scene around it) ━━━
${home}

━━━ THE RESIDENT (the one mandatory critter — cast affirmatively, mid a specific home activity) ━━━
${critter}
${flourishBlock}
━━━ LIVED-IN DECOR DETAIL (make the home feel inhabited, not staged) ━━━
${decor}

${sharedDNA.scenePalette ? `━━━ SCENE-WIDE COLOR PALETTE ━━━\n${sharedDNA.scenePalette}\n` : ''}
${sharedDNA.colorPalette ? `━━━ SECONDARY LIGHTING VIBE ━━━\n${sharedDNA.colorPalette}\n` : ''}
━━━ ATMOSPHERIC DETAIL ━━━
${atmosphere}

━━━ LIGHT SOURCE / NIGHT QUALITY ━━━
${nightLight}

${BLOW_IT_UP_BLOCK}

━━━ MOOD CONTEXT ━━━
${vibeDirective.slice(0, 250)}

━━━ COMPOSITION — AN INTIMATE PORTRAIT OF ONE HOME, NOT A WIDE DIORAMA ━━━
Mid-close tilt-shift frame centered on the single hideaway — close enough to read every carved and stitched detail, wide enough to keep the WHOLE home and its one resident readable together (never a macro crop into just a doorknob or a single leaf that loses the home). A soft out-of-focus hint of the wider world (grass blades, a fallen leaf, distant dusk) at the frame's edge sells the scale without becoming the subject. Something quietly happening — the critter mid-task, smoke curling, candlelight flickering. Palette dictated by the LIGHT-SOURCE block above (respect it even over "warm cozy" if it calls for a cooler or moodier cast).

Output ONLY the raw 60-90 word scene description. Comma-separated phrases. NO preamble, NO titles, NO headers, NO ━━━ or ═══ or ### markers, NO **bold labels**, NO "render as" suffixes. Just the phrases, starting immediately with the scene content.`;
};

module.exports.TINY_HALLOWEEN_HIDEAWAY_PROMPT_PREFIX = TINY_HALLOWEEN_HIDEAWAY_PROMPT_PREFIX;
module.exports.TINY_HALLOWEEN_HIDEAWAY_PROMPT_SUFFIX = TINY_HALLOWEEN_HIDEAWAY_PROMPT_SUFFIX;
