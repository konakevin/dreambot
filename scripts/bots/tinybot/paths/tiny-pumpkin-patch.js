/**
 * AlphaBot candidate — tiny-pumpkin-patch (destination: TinyBot).
 *
 * A miniature Halloween PUMPKIN-PATCH FIELD at golden late-day light — the
 * daytime field sibling to tiny-halloween-village's night-time town square.
 * Rows of vines, fences, and farm clutter (never cottages/cobblestones).
 * The money moment: a tiny critter (mouse/hedgehog, biased) caught ACTIVELY
 * MID-CARVE, turning a real berry or tiny gourd into a jack-o-lantern face
 * right in frame — not posed with a finished pumpkin, the carve itself is
 * happening. SCENE pool = the layered field world. CAST pool = the MANDATORY
 * carving critter (100% of entries show the carve in progress — this path's
 * signature action, not a generic Halloween-activity grab-bag). SCALE_PROVER
 * pool = the MONEY-SHOT axis: one true-to-life-scale FARM/GARDEN everyday
 * object (a work glove, ball of twine, dropped coin, plant-marker stake...)
 * planted beside the patch so the miniature reads unmistakably tiny by
 * direct comparison — bespoke content, farm/garden-themed rather than the
 * village sibling's generic forest-autumn objects (kept distinct on purpose).
 *
 * ━━━ PORTABILITY NOTE (read before wiring or promoting) ━━━
 * Per ALPHABOT.md's portability contract, this path CLONES TinyBot's identity
 * rather than importing tinybot/shared-blocks.js (keeps this file self-
 * contained under alphabot/, and keeps the eventual promotion diff to just
 * "move this file + its 3 seed JSONs + this gen script"). The 5 blocks below
 * marked "CLONED VERBATIM FROM TINYBOT" are byte-identical copies of
 * scripts/bots/tinybot/shared-blocks.js as of 2026-09-06 — if TinyBot's
 * blocks change before this path is promoted, re-sync them.
 *
 * When wiring this into a bot's index.js (AlphaBot CANDIDATES for iteration,
 * or TinyBot's pathBuilders on promotion), clone TinyBot's own per-path
 * config byte-identical (the portability contract — "a path proven under the
 * wrong config proves nothing"):
 *   - mediums: ['photography', 'claymation', 'render']  (bot-level, no
 *     per-path override needed — matches tiny-winter-village)
 *   - allowedModels: ['black-forest-labs/flux-1.1-pro',
 *     'black-forest-labs/flux-1.1-pro-ultra']  (bot-level, no override)
 *   - promptPrefix / promptSuffix: TinyBot's blocks.PROMPT_PREFIX /
 *     PROMPT_SUFFIX (bot-level — exported below as TINY_PUMPKIN_PATCH_PROMPT_
 *     PREFIX/SUFFIX for convenience, identical text)
 *   - vibes: TinyBot's vibes list (cinematic/cozy/nostalgic/peaceful/
 *     whimsical/ethereal/ancient/enchanted/shimmer)
 *   - twoPassPolish: enabled, conceptWords 150, polishedWords '65-90'
 *   - sensoryAnchors: enabled, requiredChannels ['lightcolor'],
 *     pathContext: 'scene'
 *   - chaos: enabled, add to allowSubjectChaosPaths (like the other village/
 *     field paths); do NOT add to skipPaths
 *   - IMPORTANT — do NOT call blocks.varietyAxesSection(sharedDNA) / TinyBot's
 *     rolled biome+weather+lighting hard-override on this path (mirrors the
 *     tiny-halloween-village sibling's own choice for the same reason): this
 *     path's whole identity is GOLDEN LATE-DAY LIGHT + a DAYTIME FIELD, and a
 *     rolled "midnight" or "storm" weather axis would stomp that. Keep this
 *     path's own GOLDEN_LIGHT / LEAF_SCATTER / PATCH_DECOR inline blocks as
 *     its only atmosphere axes.
 *   - Axis keys used here ('tiny_pumpkin_patch_scene', '..._cast',
 *     '..._scale_prover') do not collide with any existing TinyBot or
 *     AlphaBot axis, nor with the chibi_pumpkin_patch_* axes used by the
 *     separate chibi-pumpkin-patch candidate — verified 2026-09-06.
 *
 * NOT this task's job: wiring alphabot/index.js CANDIDATES or tinybot's
 * pathBuilders/paths[] — a later, separate step does that.
 */

const SCENES = require('../seeds/tiny_pumpkin_patch_scene.json');
const CAST = require('../seeds/tiny_pumpkin_patch_cast.json');
const SCALE_PROVERS = require('../seeds/tiny_pumpkin_patch_scale_prover.json');

// ─────────────────────────────────────────────────────────────
// Bespoke axes 4-6 — short fixed lists, inlined per the playbook guidance
// (axes that don't need generated-pool depth). Plain JS arrays, no pool file.
// ─────────────────────────────────────────────────────────────

// Axis 4 — GOLDEN LATE-DAY LIGHT. The identity-defining daytime axis that
// separates this path from the night-time tiny-halloween-village sibling.
const GOLDEN_LIGHT = [
  'the sun sits low and huge on the horizon, throwing long amber shadows across every furrow',
  'a warm honey-gold wash floods the whole field as the sun dips behind a distant tree line',
  'slanting late-afternoon sunbeams cut through gaps in the windbreak, lighting drifting chaff and dust',
  'the entire patch glows amber-orange, shadows stretched impossibly long between the vine rows',
  'a low sun flares just above the horizon, rim-lighting every leaf edge and vine tendril in gold',
  'hazy golden light diffuses through a thin veil of field dust, giving the whole scene a warm sepia cast',
  'the sun sits fat and orange just above the fence line, throwing every gourd\'s shadow long across the dirt',
  'warm late-day light pools in patches between drifting cloud-shadows, sliding slowly across the rows',
  'a wash of amber back-light rims every gourd and leaf edge in gold, the field\'s own shadow pooling cool blue beneath',
  'the last hour of daylight turns the whole patch the color of a lit jack-o-lantern',
  'low golden sun catches the dust kicked up along the cart-track, hanging in the air like fine gold powder',
  'a warm autumn haze softens the far tree line into a glowing amber smear beneath the low sun',
];

// Axis 5 — AUTUMN LEAF SCATTER. Concept-mandated ("autumn leaves scattered").
const LEAF_SCATTER = [
  'a drift of fallen oak and maple leaves scatters loosely between the vine rows',
  'leaves pile in small drifts against the base of a hay bale, a few caught mid-tumble in the breeze',
  'a scatter of curled brown leaves crunches along the worn dirt row',
  'leaves settle in the furrows between vines, some still edged in green',
  'a leaf-strewn path winds between the rows, leaves piled ankle-deep at the corners',
  'a few bright red maple leaves stand out among the mostly brown-gold litter',
  'the breeze has swept leaves into a loose spiral near the field\'s edge',
  'leaves cling to the underside of broad pumpkin leaves, caught by the vine',
  'a carpet of gold and rust leaves blankets the ground between the crates',
  'scattered leaves skate across the dirt path in a gust, a few lifting into the golden light',
];

// Axis 6 — PATCH DECOR / SETTING ACCENT. Extra combinatorial variety so the
// 25-entry scene pool doesn't feel static across renders.
const PATCH_DECOR = [
  'a rustic wooden wheelbarrow tipped with a small fresh harvest of gourds',
  'a row of miniature hay bales stacked along the field\'s edge',
  'a leaning wooden fence rail strung with a few dried corn husks',
  'a small weathered scarecrow propped on a single post at the field\'s edge',
  'a stack of wicker harvest baskets piled near a fence post',
  'a wagon wheel half-buried at the patch\'s border, a curl of ivy climbing one side',
  'a row of small wooden crates brimming with gathered gourds',
  'a rickety ladder leaning against a fence post nearby',
  'a coil of garden twine looped over a fence post',
  'a weathered wooden marker stake (blank, no text) at a row\'s end',
];

function pickInline(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

// ─────────────────────────────────────────────────────────────
// CLONED VERBATIM FROM TINYBOT (scripts/bots/tinybot/shared-blocks.js,
// 2026-09-06) — TinyBot's own non-negotiable identity, reproduced here so
// this file has zero cross-bot require() dependency. Two blocks
// (NO_HUMANS, DNA/composition) are ADAPTED for this path — noted inline.
// ─────────────────────────────────────────────────────────────

const TINY_PUMPKIN_PATCH_PROMPT_PREFIX =
  'miniature diorama photography, tabletop model world, tilt-shift macro lens, extreme shallow depth of field, dollhouse-scale, handcrafted tiny props, miniature set dressing, realistic modelmaking textures, visible tiny imperfections';

const TINY_PUMPKIN_PATCH_PROMPT_SUFFIX =
  'miniature tabletop diorama model, tilt-shift shallow depth of field, macro lens close-up, tiny handcrafted props, visible miniature scale, no text, no words, no watermarks';

const TILT_SHIFT_MINIATURE_BLOCK = `━━━ TILT-SHIFT MINIATURE AESTHETIC (NON-NEGOTIABLE — THIS IS THE MOST IMPORTANT RULE) ━━━

This MUST look like a TABLETOP MODEL / DIORAMA photographed with a MACRO LENS. NOT a real full-scale scene. NEVER a normal photograph of a real place. The viewer must IMMEDIATELY know this is miniature — visible table edge or surface beneath, extreme shallow depth-of-field with foreground and background blur, tiny handcrafted imperfections (brush strokes, glue marks, visible seams, painted surfaces, miniature fabric fibers). Scale anchors required: props must look thumb-sized, furniture matchbox-scale, buildings palm-sized. If it could be mistaken for a real full-scale photo, you have FAILED.`;

const OBSESSIVE_MICRO_DETAIL_BLOCK = `━━━ OBSESSIVE MICRO DETAIL ━━━

Every tiny detail countable. Individual leaves, individual gourds on the vine, individual seeds. Stare-for-5-minutes quality — viewer finds new tiny things every look. Surface density is the signature — never sparse.`;

const CLEVER_CUTE_WHOA_BLOCK = `━━━ CLEVER + CUTE + WHOA ━━━

Stop + lean in + smile + look twice. The render must produce ALL of: clever composition + cute subject + surprising scale-play + cozy-when-appropriate. Never just pretty-miniatures — always with a moment of "wait, what?" or "OH that's adorable."`;

// ADAPTED from TinyBot's NO_HUMANS_BLOCK — this path's OK-list is its own
// mandatory carving critter rather than terrarium/macro fauna.
const NO_HUMANS_BLOCK = `━━━ NO HUMANS (except peripheral distant silhouettes) ━━━

No identifiable humans in frame. The miniature PUMPKIN-PATCH FIELD is the subject. A tiny critter resident (mouse, hedgehog, or similar small woodland animal — see below) is not just allowed but REQUIRED, caught actively carving. NEVER human figures as subject, NEVER an upright anthropomorphic "creature-person" standing/posed like a human.`;

const IMPOSSIBLE_BEAUTY_BLOCK = `━━━ IMPOSSIBLE BEAUTY — MINIATURE EDITION ━━━

Snow-globe-world quality × 10. The kind of image you want to shrink down and live inside. Wall-poster gorgeous. Tilt-shift + macro + obsessive detail.`;

const BLOW_IT_UP_BLOCK = `━━━ BLOW IT UP — MINIATURE AMPLIFICATION ━━━

Miniature magic is the canvas, not the ceiling. Stack: obsessive micro-detail + tilt-shift-blur-gradient + countable elements + clever juxtaposition + surprising scale. If viewer doesn't want to shrink down and live in it, dial up.`;

// ─────────────────────────────────────────────────────────────
// Path builder
// ─────────────────────────────────────────────────────────────

module.exports = ({ sharedDNA, vibeDirective, picker }) => {
  const scene = picker.pickWithRecency(SCENES, 'tiny_pumpkin_patch_scene');
  const scaleProver = picker.pickWithRecency(SCALE_PROVERS, 'tiny_pumpkin_patch_scale_prover');
  const goldenLight = pickInline(GOLDEN_LIGHT);
  const leafScatter = pickInline(LEAF_SCATTER);
  const patchDecor = pickInline(PATCH_DECOR);

  // MANDATORY cast — the concept's non-negotiable: exactly the carving
  // critter, always present (this path's cast pool is 100% carving-in-
  // progress entries, unlike a generic multi-activity cast pool). ~30%
  // chance of a second critter doing a SECOND independent carve nearby
  // (never the same entry twice), for occasional richer shots.
  const cast = [picker.pickWithRecency(CAST, 'tiny_pumpkin_patch_cast')];
  if (Math.random() < 0.3) {
    const second = picker.pickWithRecency(CAST, 'tiny_pumpkin_patch_cast');
    if (second !== cast[0]) cast.push(second);
  }
  const castBlock = `\n━━━ THE CARVER (MANDATORY — THIS PATH'S ONE TRUE SIGNATURE MONEY-SHOT, THE ELEMENT THAT MUST SURVIVE EVEN IF EVERY OTHER DETAIL GETS TRIMMED FOR LENGTH — a HANDCRAFTED MINIATURE DIORAMA FIGURE of the critter below, felted-fur or painted-clay/resin material with visible tiny brush-strokes, seams, and glue marks like every other prop in this scene — NEVER a real photographed live animal, NEVER slick studio-photo fur realism, never human, never an anthropomorphic mascot, ACTIVELY mid-carve) ━━━\n${cast.join('\n')}`;

  return `You are a master model-maker AND storyteller writing CUTE, cozy-spooky MINIATURE PUMPKIN-PATCH scenes for TinyBot. A dollhouse-scale Halloween pumpkin-patch FIELD caught alive in golden late-day light — vine rows heavy with berries and tiny gourds, farmhouse fences and clutter, a tiny critter resident hard at work carving. This is a FIELD, not a village street — no cottages, no cobblestones, no town square. The PATCH is the hero, a lived-in little world, not a single object posed on a bare surface. Storybook-adorable and PLAYFULLY spooky — grinning jack-o-lantern faces taking shape, never genuine horror. NO humans (peripheral distant silhouettes at most). Output wraps with style prefix + suffix.

${TILT_SHIFT_MINIATURE_BLOCK}

${OBSESSIVE_MICRO_DETAIL_BLOCK}

${CLEVER_CUTE_WHOA_BLOCK}

${NO_HUMANS_BLOCK}

${IMPOSSIBLE_BEAUTY_BLOCK}

━━━ NON-NEGOTIABLE TEMPLATE MANDATE — THIS PATH'S CORE IDENTITY ━━━

Every render MUST show ALL of these, or it has failed its brief:
1. CARVING IN PROGRESS — the tiny critter cast below is ACTIVELY mid-carve on a berry or tiny gourd, turning it into a jack-o-lantern face right in the shot. The tool must be touching the berry/gourd with a curl or sliver of peel coming away — NEVER a finished jack-o-lantern sitting on its own, NEVER the critter just holding or admiring one.
2. GOLDEN LATE-DAY LIGHT, DAYTIME FIELD — this is a sunlit pumpkin-patch FIELD of vine rows and farm clutter, never a night scene, never a village street, never cobblestones or cottages. If it looks like dusk or indoors, you have failed.
3. SCALE-PROVEN — the true-to-life-scale farm/garden object below is placed beside or within the patch at its real size, so the miniature reads unmistakably tiny purely by comparison.
Keep the register PLAYFUL and cozy-spooky throughout — a grinning face taking shape, warm golden light, never true horror, gore, or real scares.

━━━ THE MINIATURE PUMPKIN-PATCH FIELD (stage the scene here, keeping its foreground / midground / far-distance layers) ━━━
${scene}
${castBlock}

━━━ THE SCALE-PROVER (a secondary scale-tell detail, never at the expense of the mandatory carve above — place this true-to-life-scale farm/garden object beside or within the patch) ━━━
${scaleProver}

━━━ SEASONAL FIELD ACCENT (weave this specific flourish into the scene) ━━━
${patchDecor}

${sharedDNA.scenePalette ? `━━━ SCENE-WIDE COLOR PALETTE ━━━\n${sharedDNA.scenePalette}\n` : ''}
${sharedDNA.colorPalette ? `━━━ SECONDARY LIGHTING VIBE ━━━\n${sharedDNA.colorPalette}\n` : ''}
━━━ GOLDEN LATE-DAY LIGHT (non-negotiable — never night, never dusk) ━━━
${goldenLight}

━━━ AUTUMN LEAF DETAIL ━━━
${leafScatter}

${BLOW_IT_UP_BLOCK}

━━━ MOOD CONTEXT ━━━
${vibeDirective.slice(0, 250)}

━━━ PUMPKIN-PATCH DNA ━━━
This is a MODEL PUMPKIN-PATCH FIELD — every gourd fits in your fingertips. Render with master-modelmaker obsession: hand-laid split-rail fences the size of matchsticks, vines with sugar-cube-scale gourds and berries, thumb-sized crates and wheelbarrows, thread-thin twine, bead-sized hay bales. The SIGNATURE is warm golden late-day sun raking long across the rows, catching the carving critter's tool mid-stroke and the fresh curl of peel falling away. Lived-in at miniature scale: a half-carved berry with shavings still on the ground beside it, a matchstick-thin ladder leaning on a fence, a wheelbarrow mid-haul. Tilt-shift shallow DOF makes the real feel dollhouse.

━━━ COMPOSITION — A CANDID STORYBOOK MOMENT, NOT A CATALOG SHOT ━━━
Wide or mid-wide elevated view looking down at the pumpkin-patch field like a model railway layout. Build MULTIPLE DEPTH LAYERS, and describe them in THIS ORDER so the carve survives any length trim: FIRST, as the very first concrete image in the scene, the carving critter caught mid-stroke — the tool touching the berry/gourd's skin, a curl or sliver of peel actively lifting away — this is the frame's one non-negotiable focal hero and must be named before any fence, basket, gate, or other field prop. SECOND, the scale-prover object placed nearby in that same near layer as a quiet scale-tell — it never substitutes for the critter as the focal point, only sits beside it. THEN the field midground of vine rows and farm clutter, and a far distance fading into warm golden haze. Keep the WHOLE scene readable — never zoom into a single prop or body-part macro that loses the field. Something quietly happening — the carve itself, dust motes in the low sun, a leaf drifting. Leave room to breathe; NOT a centered product shot, NOT one object on a bare surface. Palette dictated by the GOLDEN-LIGHT block above (respect the daytime warmth even over "cozy" if it calls for something brighter or hazier).

Output ONLY the raw 70-100 word scene description. Comma-separated phrases. NO preamble, NO titles, NO headers, NO ━━━ or ═══ or ### markers, NO **bold labels**, NO "render as" suffixes. Just the phrases, starting immediately with the scene content.`;
};

module.exports.TINY_PUMPKIN_PATCH_PROMPT_PREFIX = TINY_PUMPKIN_PATCH_PROMPT_PREFIX;
module.exports.TINY_PUMPKIN_PATCH_PROMPT_SUFFIX = TINY_PUMPKIN_PATCH_PROMPT_SUFFIX;
