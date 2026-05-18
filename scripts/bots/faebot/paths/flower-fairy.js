/**
 * FaeBot flower-fairy path (R11 reset, 2026-05-17).
 *
 * Cloned directly from forest-fairy-scene.js — the FaeBot path that
 * reliably renders convincing mythic fairy creatures. R11 just retargets
 * the seed content into FLOWER-saturated environments: fairies in fields
 * of wildflowers, fairies living inside giant tulip-bells, fairies
 * dancing in cherry-blossom snow, fairies emerging from peony-clusters,
 * fairies sleeping on giant lotus pads, etc.
 *
 * The R5-R10 declarative attempt (10-axis archetype + bloom_gown / hair_floral /
 * wings / candid_action / atmospheric_phenomenon pools + nuclear template
 * mandates) was scrapped — never landed on "looks like a fairy". This path
 * inherits forest-fairy-scene's working fae aesthetic and retargets to flowers.
 *
 * Uses two new bespoke pools:
 *   - FLOWER_FAIRY_CREATURES (analog of FOREST_CREATURES) — fae creatures
 *     whose bodies are made of/merged with flowers (petal-skin, blossom-hair,
 *     pollen-glow, petal-wings) with candid posture
 *   - FLOWER_FAIRY_SCENES (analog of FOREST_FAIRY_SCENES) — fairies in /
 *     among / living in flowers (giant peony, tulip-bell, wildflower field,
 *     wisteria-cascade, etc.)
 */

const pools = require('../pools');
const blocks = require('../shared-blocks');

const COMPOSITIONS = [
  'medium-shot framing, the fairy off-center via rule-of-thirds, body fills 40-55% of frame, face clearly visible in 3/4 profile',
  'close medium-shot, waist-up to thigh-up framing, fairy anchored at the left or right third, head turned in candid profile',
  'eye-level full-figure framing, fairy seated or kneeling, body fills 45-60% of frame, intimate distance like wildlife photography',
  'three-quarter rear angle, fairy half-turned away from viewer revealing back/wing/shoulder details, head in soft profile, the flower-garden receding past her',
  'low-angle medium shot, fairy on a giant petal or moss-and-bloom stump, body 40-50% of frame, framed by hanging bloom-clusters in foreground',
  'high-angle medium shot looking down, fairy crouched or seated, body 40-55% of frame, surrounded by overflowing wildflowers',
  'side-profile medium shot, fairy in stillness with one shoulder forward, wings and hair draping naturally, the flower-garden framing her like a painted theatre',
  'slight low-angle close, fairy standing waist-deep in a bloom-meadow or among giant lotus-pads, body 50-65% of frame, hands lifted in a candid magical gesture',
];

module.exports = ({ sharedDNA, vibeDirective, picker }) => {
  const creature = picker.pickWithRecency(pools.FLOWER_FAIRY_CREATURES, 'flower_fairy_creature');
  const composition = COMPOSITIONS[Math.floor(Math.random() * COMPOSITIONS.length)];
  const scene = picker.pickWithRecency(pools.FLOWER_FAIRY_SCENES, 'flower_fairy_scene_setting');

  return `You are writing ONE Flux prompt for an enchanted-flower-garden fairy painting. Output ONLY the prompt — comma-separated phrases, 70-95 words, no preamble, no headers.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ABSOLUTE NON-NEGOTIABLE MANDATE — these MUST be the FIRST visual elements described in your prompt, BEFORE setting/lighting/anything else.

1. THE FAIRY IS THE SUBJECT. Not the landscape. The fairy fills 40-55% of the frame and is the eye's first landing place. NEVER write a "wide landscape with tiny figure". NEVER write "small figure in distance".

2. The fairy description below is THE fairy — render her with EVERY exotic feature listed (the petal-skin, the blossom-hair, the flower-wings, the antennae/horns/glowing-marks, the magical signature, the candid posture). 4+ stacked exotic fae features must visibly land in the painting.

Open your prompt with the fairy description in this format:
"[fairy unified description], [composition framing], [flower-garden setting wrapping around her], [lighting + magical atmosphere], [palette]."

The fairy opens. Everything else is HER FRAME.
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

${blocks.PEACEFUL_FAIRY_BLOCK}

${blocks.NO_TEXT_BLOCK}

━━━ 1. THE FAIRY (this is the subject — render her exactly this way) ━━━
${creature}

This unified description is the FACE of the painting. Preserve every exotic feature: the petal-skin tone, the blossom-hair, the flower-petal garment, the wings/antennae/glowing-marks, the magical signature, the candid posture. She is otherworldly-beautiful — mythic-creature beauty, not human-model beauty. Confident at-home-in-her-flowers. NEVER posing, NEVER looking at the viewer.

━━━ 2. COMPOSITION (the fairy dominates the frame) ━━━
${composition}.

The flower-garden WRAPS AROUND her like a frame — bloom-clusters hanging in foreground, mossy petal-strewn ground beside her, flowering trees behind. But SHE is what the eye lands on first. NOT a landscape with tiny figure. NOT a centered hero portrait either — caught-on-camera-candid, off-center, real moment.

━━━ 3. THE FLOWER-GARDEN SETTING (her natural backdrop — wraps around her) ━━━
${scene}

This setting is HER FRAME, not the subject. Render with atmospheric depth — foreground tactile detail (petals, dewdrops, bloom-clusters), midground holding her, background fading into soft painted bloom-mist or canopy.

━━━ 4. LIGHTING + MAGIC + ATMOSPHERE ━━━
${sharedDNA.colorPalette}. ${vibeDirective.slice(0, 150)}

Visible magical signature near her: glowing pollen, sparkles, will-o-wisps, fireflies, soft halo, glowing veins under skin, luminescent dewdrops, drifting petals — at least one. Atmospheric haze and dappled light sell the flower-garden depth.

━━━ 5. HARD BANS ━━━
- NO landscape with tiny figure (the fairy MUST fill 40-55% of frame)
- NO model-poses / NO posing-for-camera / NO eye-contact-with-viewer
- NO sexualized framing — focus is mythic-creature beauty
- NO modern objects (phones, glasses, electronics)
- NO realistic non-magical humans
- NO violence / NO scared expressions / NO edgy moods
- NO photographic / digital / 3D / cgi descriptors at the technique level
- NO additional figures beyond the focal fairy + ONE small animal companion

━━━ OUTPUT ━━━
Write 70-95 words, comma-separated phrases. Lead with the fairy unified description from section 1 — preserve her exotic features unmistakably. Composition framing follows. Flower-garden setting wraps around her. Lighting and magic close. NO preamble, NO headers, NO ━━━ markers.`;
};
