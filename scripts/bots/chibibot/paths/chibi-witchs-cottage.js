/**
 * AlphaBot chibi-witchs-cottage — Halloween candidate for ChibiBot
 * (function-form, self-contained, MVP-25 seed pools).
 *
 * CONCEPT: a friendly chibi WITCH CRITTER's cute-spooky cottage — a bubbling
 * glowing cauldron, a black-cat companion, jars of glowing ingredients, warm
 * amber window-light spilling out against a moody dusk forest. PLAYFUL
 * Halloween (grinning jack-o-lanterns, friendly-ghost energy) — never
 * genuine horror, gore, or real scares. Requires seed pools DIRECTLY as JSON
 * (not via pools.js — that's a shared file this task doesn't touch).
 *
 * NON-NEGOTIABLE TEMPLATE MANDATE: the witch is an affirmatively-cast CHIBI
 * CREATURE, never a human — species + 2-3 unmistakable non-human features
 * named before anything else; the pointed hat + patched robe are COSTUME
 * ONLY, layered onto the creature body. See BOT_SCENE_QUALITY_PLAYBOOK.md
 * failure-mode catalog: an age/gender human noun on a non-human cast makes
 * Flux render a costumed human instead.
 *
 * 7 bespoke axes (none shared with any other path):
 *   Pool-generated (25 each, gen-chibi-witchs-cottage-pools.js):
 *     cottage   — the hero setting, nestled in the dusk forest
 *     witch     — the chibi witch critter + activity (money-shot-adjacent)
 *     cauldron  — MONEY SHOT axis: the bubbling glowing potion, ALWAYS present
 *     jars      — glowing ingredient jars, ALWAYS present
 *   Inline fixed lists (short enough not to need a generated pool):
 *     cat       — black-cat companion pose, ~65% present (never mandatory —
 *                 a forced companion on every render homogenizes the shot)
 *     dusk      — the dusk-forest sky/mood backdrop, ALWAYS present
 *     surprise  — a small whimsical extra touch, ~40% present
 */

const blocks = require('../shared-blocks');

const COTTAGE_SCENES = require('../seeds/chibi_witchs_cottage_cottage.json');
const WITCH_CRITTERS = require('../seeds/chibi_witchs_cottage_witch.json');
const CAULDRONS = require('../seeds/chibi_witchs_cottage_cauldron.json');
const GLOWING_JARS = require('../seeds/chibi_witchs_cottage_jars.json');

// ─── Short fixed lists — inline per playbook guidance (no pool needed) ────

const BLACK_CAT_POSES = [
  'a small round black cat curled up asleep on the windowsill, tail wrapped over its nose',
  'a small round black cat perched on the cauldron’s rim, watching the bubbles with huge curious eyes',
  'a small round black cat weaving between the witch-critter’s feet, tail held high',
  'a small round black cat sitting atop a stack of spellbooks, tail twitching',
  'a small round black cat batting a paw at a floating firefly-jar',
  'a small round black cat napping inside an upturned witch hat',
  'a small round black cat peering out a round window at the dark forest, ears perked',
  'a small round black cat grooming itself on top of a fat pumpkin',
  'a small round black cat curled inside a hanging lantern-basket, eyes half-closed',
  'a small round black cat sitting on the broom handle, riding along mid-flight',
  'a small round black cat watching from a shelf between two glowing jars',
  'a small round black cat stretching on the doorstep, back arched',
  'a small round black cat perched on a wobbly bookshelf-ladder',
  'a small round black cat with its nose deep in a bowl of glowing berries',
  'a small round black cat silhouetted in the window against the dusk sky, tail curled',
];

const DUSK_FOREST_MOODS = [
  'the last violet-and-orange light of dusk glowing behind bare crooked treetops',
  'a rising harvest moon glowing amber through the tangled branches',
  'drifting will-o’-wisps threading softly between dark tree trunks',
  'a soft blue-grey twilight mist pooling low around the tree roots',
  'fireflies rising in lazy spirals against the darkening woods',
  'a scatter of early stars appearing behind silhouetted pines',
  'thin curling fog drifting low across the forest floor',
  'a warm sunset glow fading into deep indigo at the tree line',
  'a pair of owl-eyes glinting from a high branch in the gloom',
  'the hushed purple quiet of a forest just after sundown',
  'soft glowing mushroom rings scattered beneath the nearby trees',
  'a gentle drift of golden autumn leaves catching the last light',
  'distant fireflies blinking like tiny lanterns deep in the woods',
  'a low ground-fog lit warm amber by the cottage’s own windows',
  'a few friendly bats wheeling in lazy loops against the dusk sky',
];

const SURPRISE_DETAILS = [
  'a broomstick propped by the door, bristles twitching faintly on their own',
  'a plump cauldron-shaped welcome mat at the threshold',
  'a string of tiny grinning jack-o-lantern lights strung along the eaves',
  'a crooked weathervane shaped like a friendly grinning bat, spinning slowly',
  'a garden gnome wearing a miniature pointed witch hat, tucked among the flowers',
  'a pumpkin carved with a cheerful grinning face glowing beside the step',
  'a spellbook left open on a nearby tree stump, pages fluttering gently',
  'a wind chime made of tiny glass vials, tinkling softly in the breeze',
  'a cheerful scarecrow in a patched coat, oddly friendly-looking, in the garden',
  'a cauldron-shaped mailbox standing at the little garden gate',
  'strings of dried herbs and candy-corn garlands looped over the doorway',
  'a friendly ghost-shaped paper lantern glowing softly on the porch',
  'a spare broom leaning beside a neat stack of firewood',
  'cobweb bunting strung between fence posts, dew-sparkled and glittering',
  'a trail of glowing paw-print stepping-stones leading up to the door',
];

module.exports = ({ sharedDNA, vibeDirective, picker }) => {
  const cottage = picker.pickWithRecency(COTTAGE_SCENES, 'chibi_witchs_cottage_cottage');
  const witch = picker.pickWithRecency(WITCH_CRITTERS, 'chibi_witchs_cottage_witch');
  const cauldron = picker.pickWithRecency(CAULDRONS, 'chibi_witchs_cottage_cauldron');
  const jars = picker.pickWithRecency(GLOWING_JARS, 'chibi_witchs_cottage_jars');
  const duskMood = picker.pickWithRecency(DUSK_FOREST_MOODS, 'chibi_witchs_cottage_dusk');

  // Black cat companion — optional ~65% (never mandatory; a forced companion
  // on every render homogenizes the shot and crowds out solo-witch moments).
  const catBlock =
    Math.random() < 0.65
      ? `\n\n━━━ BLACK CAT COMPANION — SPECIES-LOCKED, a companion NOT the hero ━━━\nA small round chibi CAT with solid glossy BLACK fur, pointed triangular cat ears, and a cat's whiskered face — unmistakably a CAT, a completely different species, fur color, and silhouette from the witch critter above (never the same grey/brown fur, never the same round-rodent shape, never positioned touching or mirroring the witch critter's pose). ${picker.pickWithRecency(BLACK_CAT_POSES, 'chibi_witchs_cottage_cat')}`
      : '';

  // Whimsical extra detail — optional ~40%, keeps the pool from feeling rote.
  const surpriseBlock =
    Math.random() < 0.4
      ? `\n\n━━━ WHIMSICAL EXTRA DETAIL ━━━\n${picker.pickWithRecency(SURPRISE_DETAILS, 'chibi_witchs_cottage_surprise')}`
      : '';

  return `You are writing HALLOWEEN CHIBI-WITCH'S-COTTAGE scenes for a cute-spooky chibi creature bot. A friendly chibi WITCH CRITTER's cottage nestled at the edge of a moody dusk forest — a bubbling glowing cauldron, jars of glowing ingredients on the windowsill, warm amber window-light spilling out against the darkening woods. PLAYFUL cute-spooky Halloween — think grinning jack-o-lanterns and friendly-ghost energy, NEVER genuine horror, gore, or real scares. Output wraps with style prefix + suffix.

━━━ NON-NEGOTIABLE TEMPLATE MANDATE — THE WITCH IS A CREATURE, NEVER A HUMAN ━━━
The witch is an affirmatively-cast CHIBI CREATURE — its animal/creature species (owl, cat, toad, fox, hedgehog, bat, mouse, raccoon, crow, rabbit, squirrel, etc.) plus 2-3 unmistakable non-human features (feathers, muzzle, paws, whiskers, big round animal eyes, fur, a tail) are named BEFORE anything else. The pointed witch hat and patched robe/cape are COSTUME ONLY, worn over the creature's body — they never imply a human wearer, never a "girl"/"woman"/"boy"/"man"/"person" in a costume. If any description reads human, the render has failed.

${blocks.CUTE_CUDDLY_COZY_BLOCK}

${blocks.STYLIZED_NOT_PHOTOREAL_BLOCK}

${blocks.NO_DARK_NO_INTENSE_BLOCK}

${blocks.NO_PEOPLE_BLOCK}

${blocks.IMPOSSIBLE_BEAUTY_BLOCK}

━━━ THE COTTAGE (the hero setting, nestled in the dusk forest) ━━━
${cottage}

━━━ THE WITCH CRITTER (doing small witch-critter business — not necessarily dead-center) ━━━
${witch}

━━━ THE CAULDRON — MONEY SHOT (non-negotiable centerpiece; must visibly anchor the render) ━━━
${cauldron}
This cauldron is its OWN dedicated vessel — a completely separate object from any bowl, pot, dish, jar, or shelf-work the witch critter above is using for her own business. Even when her activity happens somewhere else entirely (a chimney top, a windowsill, a shelf), the cauldron still sits large, glowing, and unmistakable in the immediate foreground — it never shrinks into a background afterthought and never gets merged or confused with whatever vessel she's holding or working in.

━━━ GLOWING INGREDIENT JARS (lining a windowsill or nearby shelf) ━━━
${jars}
${catBlock}
${surpriseBlock}

━━━ DUSK FOREST BACKDROP ━━━
${duskMood}

━━━ SCENE-WIDE COLOR PALETTE ━━━
${sharedDNA.scenePalette}

━━━ SECONDARY LIGHTING VIBE ━━━
${sharedDNA.colorPalette}

${blocks.BLOW_IT_UP_BLOCK}

━━━ MOOD CONTEXT ━━━
${vibeDirective.slice(0, 250)}

━━━ CHIBI-WITCH'S-COTTAGE DNA ━━━
The signature contrast is WARM AMBER WINDOW-GLOW against the MOODY DUSK FOREST — the cottage's windows spill honeyed light out into the cooling blue-violet woods. The cauldron always bubbles with visible glowing potion and rising motes or steam-shapes; the ingredient jars always glow softly. Cute-spooky, never scary: friendly grins, soft round shapes, warm inviting light, zero menace.

━━━ COMPOSITION ━━━
Wide or mid-wide view of the cottage tucked among the trees — the glowing cauldron and lit window both visible, the witch critter doing something small and charming, the dusk forest receding softly behind. NOT a centered product shot — a lived-in storybook moment the viewer wants to step into.

━━━ HARD LENGTH CEILING — DO NOT EXCEED 100 WORDS ━━━
STRICT MAXIMUM 100 words, target 80-90. This is a ceiling, not a suggestion: a render engine can only hold so much in one frame, and every extra flourish clause you invent on top of the material above risks silently pushing something else out of the picture entirely — including the non-negotiable cauldron or the wide cottage framing. Do NOT elaborate the witch critter's action, the jars, or the surprise/cat detail with additional invented sub-clauses beyond what's given above — state each once, briefly, and move on. If your draft is running long, cut in this exact order: (1) first, any adjective or flourish clause you added beyond the material given above, (2) then the surprise detail and the cat block, in full, (3) never cut the cauldron, never cut the cottage's lit window, never cut the wide/mid-wide establishing framing — those three survive every trim, even if everything else must shrink to a single short phrase.

Output ONLY the raw scene description, 80-100 words, hard cap 100 — count before you answer. Comma-separated phrases. NO preamble, NO titles, NO headers, NO ━━━ or ═══ or ### markers, NO **bold labels**, NO "render as" suffixes. Just the phrases, starting immediately with the scene content.`;
};
