/**
 * AlphaBot candidate — tiny-haunted-hollow (Halloween 2026, destination: TinyBot).
 *
 * A gentle-spooky (NEVER truly scary) miniature diorama: a tiny hollow tree
 * or acorn-cap "rest garden" clearing, cobwebs strung between twigs like
 * seasonal lace, warm amber mushroom-cap lanterns as the signature light,
 * and 1-2 tiny real woodland critters cast as the ONLY inhabitants. Think a
 * beloved bedtime-story autumn nook, not a haunted tomb.
 *
 * PORTABILITY CONTRACT (ALPHABOT.md) — the five hard-constraint blocks below
 * (TILT-SHIFT MINIATURE / OBSESSIVE MICRO DETAIL / CLEVER+CUTE+WHOA /
 * NO HUMANS / IMPOSSIBLE BEAUTY) are cloned VERBATIM from
 * scripts/bots/tinybot/shared-blocks.js so this path proves out under
 * TinyBot's real identity, not a generic one. BLOW_IT_UP is adapted only to
 * reference this path's own palette/atmosphere axes instead of TinyBot's
 * biome/weather/lighting/energy variety axes (AlphaBot's rollSharedDNA
 * doesn't roll those — this path is self-contained per ALPHABOT.md and
 * requires no shared-blocks.js / pools.js import from either bot). On
 * promotion, these clones can be swapped for tinybot's shared-blocks.js
 * imports 1:1 — the TEXT is already identical.
 *
 * Wiring (NOT done here — a later step per ALPHABOT.md CANDIDATES contract):
 * medium/model/twoPassPolish/sensory config should clone byte-identical from
 * TinyBot (mediums: ['photography','claymation','render'], allowedModels:
 * ['black-forest-labs/flux-1.1-pro','black-forest-labs/flux-1.1-pro-ultra'],
 * sensoryAnchors pathContext: 'scene').
 *
 * Seed pools (MVP-25, generated via
 * scripts/gen-seeds/alphabot/gen-tiny-haunted-hollow-pool.js):
 *   tiny_haunted_hollow_scenes.json   — the hollow-tree / acorn-rest-garden world
 *   tiny_haunted_hollow_lanterns.json — MONEY-SHOT axis: mushroom-lantern glow
 *   tiny_haunted_hollow_critters.json — the mandatory tiny critter cast
 * Small fixed-list axes (cobweb styling, whimsical props, atmosphere, color
 * accent) are inlined below — no pool needed for a short combinatorial list.
 */

const SCENES = require('../seeds/tiny_haunted_hollow_scenes.json');
const LANTERNS = require('../seeds/tiny_haunted_hollow_lanterns.json');
const CRITTERS = require('../seeds/tiny_haunted_hollow_critters.json');

// ─── Cloned verbatim from tinybot/shared-blocks.js (2026-09) ───
const TILT_SHIFT_MINIATURE_BLOCK = `━━━ TILT-SHIFT MINIATURE AESTHETIC (NON-NEGOTIABLE — THIS IS THE MOST IMPORTANT RULE) ━━━

This MUST look like a TABLETOP MODEL / DIORAMA photographed with a MACRO LENS. NOT a real full-scale scene. NEVER a normal photograph of a real place. The viewer must IMMEDIATELY know this is miniature — visible table edge or surface beneath, extreme shallow depth-of-field with foreground and background blur, tiny handcrafted imperfections (brush strokes, glue marks, visible seams, painted surfaces, miniature fabric fibers). Scale anchors required: props must look thumb-sized, furniture matchbox-scale, buildings palm-sized. If it could be mistaken for a real full-scale photo, you have FAILED.`;

const OBSESSIVE_MICRO_DETAIL_BLOCK = `━━━ OBSESSIVE MICRO DETAIL ━━━

Every tiny detail countable. Individual leaves, individual books on shelves, individual pastries in cases. Stare-for-5-minutes quality — viewer finds new tiny things every look. Surface density is the signature — never sparse.`;

const CLEVER_CUTE_WHOA_BLOCK = `━━━ CLEVER + CUTE + WHOA ━━━

Stop + lean in + smile + look twice. The render must produce ALL of: clever composition + cute subject + surprising scale-play + cozy-when-appropriate. Never just pretty-miniatures — always with a moment of "wait, what?" or "OH that's adorable."`;

const NO_HUMANS_BLOCK = `━━━ NO HUMANS (except peripheral distant silhouettes) ━━━

No identifiable humans in frame. Miniature WORLDS are the subject. Tiny creatures (lizards, frogs, beetles, snails, butterflies, pixies, fae, ants) OK in terrarium/macro paths. NEVER human figures as subject.`;

const IMPOSSIBLE_BEAUTY_BLOCK = `━━━ IMPOSSIBLE BEAUTY — MINIATURE EDITION ━━━

Snow-globe-world quality × 10. The kind of image you want to shrink down and live inside. Wall-poster gorgeous. Tilt-shift + macro + obsessive detail.`;

// Adapted from tinybot's BLOW_IT_UP_BLOCK — references THIS path's own
// palette/atmosphere axes instead of TinyBot's biome/weather/lighting/energy
// variety axes (which AlphaBot's rollSharedDNA doesn't produce).
const BLOW_IT_UP_BLOCK = `━━━ BLOW IT UP — MINIATURE AMPLIFICATION ━━━

Miniature magic is the canvas, not the ceiling. Stack: obsessive micro-detail + tilt-shift-blur-gradient + countable elements + clever juxtaposition + surprising scale. Color palette comes from the ATMOSPHERE + COLOR-ACCENT blocks below — do NOT default to a flat single amber wash. If viewer doesn't want to shrink down and live in it, dial up.`;

// ─── This path's own core-identity mandate ───
const CORE_MANDATE_BLOCK = `━━━ TINY-HAUNTED-HOLLOW CORE MANDATE (NON-NEGOTIABLE) ━━━

This is a GENTLE-SPOOKY, COZY autumn nook — a beloved bedtime-story illustration a child would beg to visit, NEVER a scary tomb or haunted-house scare. Every render is populated ONLY by tiny REAL woodland critters (mouse, hedgehog, vole, mole, toad, snail, beetle, owlet — proportioned like an actual small animal: whiskers, paws, quills, fur, shell) as the SOLE inhabitants — NEVER a human, human silhouette, witch-person, ghost-person, or upright humanoid figure of any kind. At least one amber-glowing mushroom-cap lantern is ALWAYS the scene's primary light source — this is the signature detail and must anchor every render. Cobwebs are strung as pretty seasonal decoration (lace, garland, bunting) — never a horror cue. Acorn-cap "rest garden" markers (if present) read as a whimsical fairy-tale motif, cheerful and moss-cushioned, never a literal creepy graveyard. A real carved jack-o'-lantern — a berry- to thumb-sized pumpkin with a simple grinning carved face, lit from within or resting beside a lantern — is ALWAYS present somewhere in the scene as the second signature Halloween prop alongside the mushroom-cap lantern; it must render as an actual small carved-pumpkin object, never merely an orange color note, a seed-textured mat, or a background mention. Both signature props earn their OWN short standalone clause, each naming exactly one thing — never packed into one clause with another small prop (e.g. never "a jack-o'-lantern beside a jar of fireflies" or "lanterns and a pumpkin and a garland" crammed together) — and both clauses land in the FIRST HALF of the output, ahead of the atmosphere/color-accent flourishes; a busy image model reliably drops whatever is buried in a late, crowded list, so the two signature props must never be that. The register throughout is PLAYFUL, warm, and inviting.`;

// ─── Small fixed-list axes — no generated pool needed (short, combinatorial) ───
const COBWEB_STYLES = [
  'delicate cobweb lace strung between two twig branches, silvered with dew and catching the lantern-glow',
  "a spiral orb-web woven directly across the hollow's knot-hole doorway, backlit warm amber from within",
  'loose cobweb bunting draped like garland along the roofline, swaying faintly in a breath of night air',
  'a single cobweb thread strung with tiny dewdrops hanging from a low branch like a strand of pearls',
  'cobweb netting caught between root and stone, dusted with drifting leaf-flakes',
  'a cobweb curtain veiling a shadowed nook, glowing faintly where lantern-light bleeds through the threads',
  'cobweb strands crisscrossing overhead like a canopy, each intersection beaded with dew catching moonlight',
  'a torn cobweb pennant fluttering from a twig-flagpole, more decorative bunting than eerie',
  'fine cobweb lattice framing a mushroom-cap window, backlit warm from the glow within',
  'a cobweb hammock strung low between two roots, empty and swaying gently',
];

const PROP_DETAILS = [
  "a row of acorn-cap rest-markers, each one topped with a tiny glowing mushroom instead of a name",
  "a snail-shell lantern hanging from a nail-thin twig hook, its glow the warm color of candlelight",
  "a tiny broom leaning by the hollow's door, bristles made from a dried seed-head",
  'a jar of fireflies set on the doorstep, blinking soft gold through cloudy glass',
  'a curled dried leaf folded into a blanket over a moss sleeping-nook',
  "a berry-sized carved jack-o'-lantern grinning cheerfully from a mossy ledge",
  'a ring of toadstools forming a fairy-circle beside the path, each capped in warm light',
  'a wind-chime of tiny hollow acorn shells clicking softly in the breeze',
  "a stack of acorn-shell barrels beside the door, corked with twig-stoppers",
  'a welcome mat woven from a single flattened leaf, edged with tiny stitched pumpkin seeds',
  'a paper-thin bat cut from a dried leaf, pinned above the doorway like a garland charm',
  'a tiny wheelbarrow of gathered acorns parked beside the hollow, one wheel a button',
];

const ATMOSPHERES = [
  'thin silver mist pooling ankle-deep among the roots, glowing faintly where lantern-light touches it',
  'a fat harvest moon glowing low through bare branches, rimming every edge in pale silver',
  'a scatter of drifting will-o-the-wisp sparks hovering just above the moss',
  'soft blue dusk settling behind the hollow, the first stars just visible through the branches',
  'a light drizzle of falling leaves catching lantern-glow as they spiral down',
  'gentle fog rolling low across the clearing, thinning where the lantern-light pushes back the dark',
  'a faint golden haze hanging in the air, like dust caught in a shaft of moonlight',
  'a hush of still night air, only the faint glow of lanterns breaking the deep indigo dark',
];

const COLOR_ACCENTS = [
  'a whisper of witchy violet in the deepest shadows',
  'a hint of ghostly teal where moonlight overlaps the lantern-glow',
  'warm pumpkin-orange bleeding into the amber light',
  'deep plum shadow pooling beneath the roots',
  'a touch of mossy sage-green in the undergrowth',
  'pale silver moon-frost along every edge catching the light',
  'a faint rust-red glow from fallen autumn leaves underfoot',
  'dusty lavender twilight softening the deep shadows',
];

module.exports = ({ sharedDNA, vibeDirective, picker }) => {
  const scene = picker.pickWithRecency(SCENES, 'tiny_haunted_hollow_scene');
  const lantern = picker.pickWithRecency(LANTERNS, 'tiny_haunted_hollow_lantern');
  const cobweb = picker.pickWithRecency(COBWEB_STYLES, 'tiny_haunted_hollow_cobweb');
  const prop = picker.pickWithRecency(PROP_DETAILS, 'tiny_haunted_hollow_prop');
  const atmosphere = picker.pickWithRecency(ATMOSPHERES, 'tiny_haunted_hollow_atmosphere');
  const colorAccent = picker.pickWithRecency(COLOR_ACCENTS, 'tiny_haunted_hollow_color_accent');

  // The tiny critter cast is the ONLY inhabitant, so the first is mandatory;
  // a second joins ~15% of the time (never forced to always be a pair —
  // avoids homogenizing every render into "the same two guys"). Lowered from
  // 40% after R3 QA: both renders that drew a second critter (mouse+toad,
  // toad+owlet — the latter compounded further because both CRITTERS entries
  // independently mention a moth) overshot the 80-110 word compression
  // ceiling and Flux dropped most of the scene's signature props/set-dressing
  // down to a sparse, generic-looking frame; the single-critter render kept
  // its full specific detail (mushroom lantern + jack-o'-lantern + stairs)
  // and read as the intended bold, specific concept. A two-critter cast adds
  // a full second description + action on top of an already-full scene +
  // lantern + jack-o'-lantern + cobweb + prop + atmosphere budget, so it
  // should stay rare rather than a coin flip.
  const critters = [picker.pickWithRecency(CRITTERS, 'tiny_haunted_hollow_critter')];
  if (Math.random() < 0.15) {
    const second = picker.pickWithRecency(CRITTERS, 'tiny_haunted_hollow_critter');
    if (second !== critters[0]) critters.push(second);
  }
  const castBlock = `━━━ THE TINY CAST (the hollow's only inhabitants — real woodland critters, never human) ━━━\n${critters.join('\n')}`;

  return `You are a master model-maker AND storyteller writing GENTLE-SPOOKY MINIATURE HOLLOW-TREE / ACORN-REST-GARDEN scenes for TinyBot's Halloween season. A dollhouse-scale autumn nook caught alive at dusk — a hollow tree trunk or a whimsical little acorn-cap clearing, cobwebs strung like seasonal lace, mushroom-cap lanterns glowing amber, one or two tiny critters as the only residents. The HOLLOW is the hero, a lived-in little world, not a single object posed on a bare surface. Storybook-adorable and cozy, never scary. Output wraps with style prefix + suffix.

${TILT_SHIFT_MINIATURE_BLOCK}

${OBSESSIVE_MICRO_DETAIL_BLOCK}

${CLEVER_CUTE_WHOA_BLOCK}

${NO_HUMANS_BLOCK}

${IMPOSSIBLE_BEAUTY_BLOCK}

${CORE_MANDATE_BLOCK}

━━━ THE HOLLOW WORLD (stage the scene here, keeping its foreground / midground / far-distance layers) ━━━
${scene}

━━━ THE MONEY SHOT — MUSHROOM-LANTERN GLOW (signature detail, must visibly anchor the render) ━━━
${lantern}

${castBlock}

━━━ COBWEB STYLING (pretty seasonal decoration, never a horror cue) ━━━
${cobweb}

━━━ A WHIMSICAL PROP DETAIL ━━━
${prop}

━━━ ATMOSPHERIC DETAIL ━━━
${atmosphere}

━━━ SCENE-WIDE COLOR PALETTE (SUPPORTING ACCENT ONLY — never lets the scene stop reading as Halloween) ━━━
${sharedDNA.scenePalette}
This is a minor supporting flavor for background/shadow edges ONLY, not the scene's dominant mood. If it reads icy, frosty, snowy, arctic, wintry, or pastel-spring-floral, do NOT follow it into a cold or springlike render — this hollow is always a WARM AUTUMN DUSK lit primarily by amber mushroom-lantern glow, with pumpkin-orange and rust-warm tones dominant. Fold any mismatched palette in as a single small cool-shadow touch at most (same weight as the COLOR ACCENT line below), never as the scene's overall temperature or light source.

━━━ SECONDARY LIGHTING VIBE ━━━
${sharedDNA.colorPalette}

━━━ COLOR ACCENT (layer this into the shadows/edges — keep amber lantern-glow dominant) ━━━
${colorAccent}

${BLOW_IT_UP_BLOCK}

━━━ MOOD CONTEXT ━━━
${vibeDirective.slice(0, 250)}

━━━ HOLLOW DNA ━━━
This is a MODEL HOLLOW-TREE WORLD rendered with master-modelmaker obsession: real gnarled bark texture at thumb-scale, a knot-hole doorway or window with resin-drop glass glowing warm amber, moss carpeting every root and stone, thread-thin cobweb lace, bead-sized acorn-cap lanterns, tiny leaf-shingle awnings, snail-shell details, dried-seed-head brooms. Lived-in at miniature scale: a worn little path between root-steps, a stack of acorn-shell barrels, a single lit window. Tilt-shift shallow DOF makes the real woodland feel dollhouse.

━━━ COMPOSITION — A CANDID STORYBOOK MOMENT, NOT A CATALOG SHOT ━━━
Wide or mid-wide elevated view looking down into the hollow like a model railway forest layout, OR a mid-close angle on the hollow's doorway with the critter(s) mid-task and the wider clearing visible behind. Build MULTIPLE DEPTH LAYERS: a near detail (the lantern, a cobweb, a critter's paw), the hollow midground of bark and root and doorway, and a far distance fading into soft misty dusk haze. Something quietly happening — a lantern being lit, a cobweb being strung, a critter mid-nap. Leave room to breathe; NOT a centered product shot, NOT one object on a bare surface. Keep the WHOLE hollow scene readable — never crop into a body-part or object macro that loses the world around it.

Output ONLY the raw 80-110 word scene description — this is a HARD CEILING, not a suggestion. Fed straight through, all the ingredient blocks above run 250+ words; if you don't actively compress, the prompt sent to the image model overshoots 110 words by 2x+, and an overlong prompt is exactly what makes it drop the critter(s), the jack-o'-lantern, the cobweb, and the mushroom-lantern glow and fall back on a generic miniature-garden cliché instead. If it doesn't all fit, cut the prop detail and atmosphere flourish FIRST, then the color-accent line — but the critter(s) with their specific action, the mushroom-lantern glow, the jack-o'-lantern (a real small carved pumpkin, not a color note), and at least one cobweb mention must survive into the final sentence (described in fewer words), never dropped outright. Comma-separated phrases. NO preamble, NO titles, NO headers, NO ━━━ or ═══ or ### markers, NO **bold labels**, NO "render as" suffixes. Just the phrases, starting immediately with the scene content.`;
};
