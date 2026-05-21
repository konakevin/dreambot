/**
 * FaeBot tiny-fae path.
 *
 * Palm-sized winged fairies — classic fae archetype but rendered in the
 * same painterly enchanted-forest world as dryad-portrait. NOT cartoon
 * Tinkerbell. The fae is captured at her own scale — interacting with
 * mushrooms, dewdrops, leaves, beetles that are normal-sized to her but
 * tiny in the broader forest context.
 */

const pools = require('../pools');
const blocks = require('../shared-blocks');

const COMPOSITIONS = [
  'extreme close-up at fairy-scale, the fae fills 35-50% of frame on a mushroom or leaf, forest backdrop blurred soft behind, foreground forest detail (dewdrops, moss, petals) in macro focus',
  'macro shot at her scale, fae 30-45% of frame perched on a flower or stem, depth of field tight on her, dappled light catching her wings',
  'mid-shot showing fae + her perch (mushroom-cap, leaf, branch-tip), fae fills 30-40% of frame, surrounding micro-flora visible at her scale',
  'low-angle macro looking up at the fae from forest-floor level, her silhouette against canopy with light filtering through wings, fae fills 25-40% of frame',
  'three-quarter view of fae mid-flight or mid-perch, wings spread or folded, hair streaming, atmospheric forest behind softly out of focus',
  'intimate close-up on the fae interacting with a tiny forest object (cradling a glowing seed, drinking from a leaf, riding a beetle), fae fills 35-55% of frame',
  'side-profile macro shot, fae caught in a quiet moment on a moss-cushion, wings catching backlight, dewdrops scaled large beside her',
  'over-the-shoulder framing past a giant flower-petal in foreground, the fae visible beyond perched at her natural scale, depth showing her tiny size',
];

module.exports = ({ sharedDNA, vibeDirective, picker }) => {
  const fae = picker.pickWithRecency(pools.TINY_FAE, 'tiny_fae');
  const composition =
    COMPOSITIONS[Math.floor(Math.random() * COMPOSITIONS.length)];

  return `You are writing ONE Flux prompt for a TINY WINGED FAE painting in the FaeBot enchanted-forest universe. Output ONLY the prompt — comma-separated phrases, 70-95 words, no preamble, no headers.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ABSOLUTE NON-NEGOTIABLE MANDATE — these MUST be the FIRST visual elements described in your prompt.

1. THE FAE IS THE SUBJECT, AT HER OWN SCALE. Palm-sized winged fae (3-8 inches tall). The render MUST include a normal-sized forest animal (robin / fox-cub / hedgehog / squirrel / hummingbird / stag-beetle / etc.) IN THE SAME FRAME that DWARFS her — this is the SCALE PROOF. Without the scale-anchor creature, Flux renders a regular-sized fairy by default. The fae fills 30-50% of the frame and the scale-anchor creature establishes her tininess unambiguously.

2. PAINTERLY-REALISTIC rendering. NOT chibi, NOT anime, NOT Disney, NOT Tinkerbell, NOT cartoon. Brian Froud + Charles Vess + painted-fantasy-novel-cover lineage — same world as dryad-portrait. Slender beautiful elegant proportions, NEVER mascot-blob.

3. The fae description below is THE fae — render her with EVERY exotic feature listed. 4+ stacked features must visibly land.

Open your prompt with the fae description in this format:
"[fae unified description], [composition framing at her scale], [forest at her scale wrapping around her], [lighting + magical atmosphere]."

The fae opens. Everything else is HER WORLD-AT-HER-SCALE.
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

${blocks.PEACEFUL_FAIRY_BLOCK}

${blocks.NO_TEXT_BLOCK}

━━━ 1. THE FAE (the subject — render her exactly this way) ━━━
${fae}

This unified description is the FACE of the painting. Preserve every exotic feature: skin/hair/wings/garment/eyes/magic-signature/posture. Painterly-real beauty at fairy-scale. NEVER posing, NEVER cartoon, NEVER mascot.

━━━ 2. COMPOSITION (at her scale) ━━━
${composition}.

The world around her is rendered at HER scale — the mushroom is HER mushroom, the dewdrop is HER cup, the beetle is HER mount. Foreground forest detail in macro focus, background softly blurred to atmospheric depth. The fae anchors the eye.

━━━ 3. ENCHANTED-FOREST BACKDROP (her natural world at fairy-scale) ━━━
A patch of the same enchanted forest the dryads live in, but rendered from FAIRY scale — giant mushrooms, towering ferns, fallen-acorn boulders, flower-bell hollows, beetle-roads through moss-canyons. Atmospheric depth fading to soft painted distance.

━━━ 4. LIGHTING + MAGIC + ATMOSPHERE ━━━
${sharedDNA.colorPalette}. ${vibeDirective.slice(0, 150)}

Visible magic at her scale: pollen-trail behind her wings, fireflies orbiting tiny around her, glowing seed in her cupped palm, sparkle-trail. Soft golden-hour or moonlit light catching her wings translucent.

━━━ 5. HARD BANS ━━━
- NO cartoon / chibi / anime / Disney / Tinkerbell / mascot rendering
- NO oversized-head proportions (painterly-real anatomy only)
- NO posing-for-camera / NO eye-contact-with-viewer
- NO sexualized framing — focus is mythic-creature beauty
- NO bare chest, NO nipples, NO topless
- NO modern objects, NO realistic non-magical humans
- NO violence / NO scared expressions / NO edgy moods
- NO additional fae beyond the focal one + ONE small creature companion (beetle / hummingbird / butterfly / firefly)

━━━ OUTPUT ━━━
Write 70-95 words, comma-separated phrases. Lead with the fae description from section 1. Composition at her scale follows. Forest-at-fairy-scale wraps around her. Lighting and magic close. NO preamble, NO headers, NO ━━━ markers.`;
};
