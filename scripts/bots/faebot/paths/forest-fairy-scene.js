/**
 * ForestBot forest-fairy-scene path.
 *
 * Mirrors the vampire-girls-2 pattern: ONE creature is the SUBJECT of the
 * frame. The CREATURE comes from a unified Sonnet-seeded pool of stacked-
 * exotic forest spirit descriptions. The path-builder mandates the creature
 * is the focal point (35-55% of frame), medium-shot or closer, and frames
 * the surrounding forest as her natural backdrop.
 */

const pools = require('../pools');
const blocks = require('../shared-blocks');

const COMPOSITIONS = [
  'medium-shot framing, the creature off-center via rule-of-thirds, body fills 40-55% of frame, face clearly visible in 3/4 profile',
  'close medium-shot, waist-up to thigh-up framing, creature anchored at the left or right third, head turned in candid profile',
  'eye-level full-figure framing, creature seated or kneeling, body fills 45-60% of frame, intimate distance like wildlife photography',
  'three-quarter rear angle, creature half-turned away from viewer revealing back/shoulder details, head in soft profile, the forest receding past her',
  'low-angle medium shot, creature on a moss-covered log or root, body 40-50% of frame, framed by hanging vines in foreground',
  'high-angle medium shot looking down, creature crouched or seated, body 40-55% of frame, surrounded by ferns and wildflowers',
  'side-profile medium shot, creature in stillness with one shoulder forward, hair and limbs draping naturally, the forest framing her like a painted theatre',
  'slight low-angle close, creature standing waist-deep in a pool or among tall ferns, body 50-65% of frame, hands lifted in a candid magical gesture',
];

module.exports = ({ sharedDNA, vibeDirective, picker }) => {
  const creature = picker.pickWithRecency(pools.FOREST_CREATURES, 'forest_creature');
  const composition =
    COMPOSITIONS[Math.floor(Math.random() * COMPOSITIONS.length)];
  const scene = picker.pickWithRecency(pools.FOREST_FAIRY_SCENES, 'forest_fairy_scene_setting');

  return `You are writing ONE Flux prompt for an enchanted-forest creature painting. Output ONLY the prompt — comma-separated phrases, 70-95 words, no preamble, no headers.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ABSOLUTE NON-NEGOTIABLE MANDATE — these MUST be the FIRST visual elements described in your prompt, BEFORE setting/lighting/anything else.

1. THE CREATURE IS THE SUBJECT. Not the landscape. The creature fills 40-55% of the frame and is the eye's first landing place. NEVER write a "wide landscape with tiny figure". NEVER write "small figure in distance".

2. The creature description below is THE creature — render her with EVERY exotic feature listed (the moss-tinted skin, the vine-hair, the leaf-garment, the antlers/wings/glowing-marks, the magical signature, the candid posture). 4+ stacked exotic features must visibly land in the painting.

Open your prompt with the creature description in this format:
"[creature unified description], [composition framing], [forest setting wrapping around her], [lighting + magical atmosphere], [palette]."

The creature opens. Everything else is HER FRAME.
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

${blocks.PEACEFUL_FAIRY_BLOCK}

${blocks.NO_TEXT_BLOCK}

━━━ 1. THE CREATURE (this is the subject — render her exactly this way) ━━━
${creature}

This unified description is the FACE of the painting. Preserve every exotic feature: the skin tone, the hair, the garment, the eyes/face/antlers/wings/glowing-marks, the magical signature, the candid posture. She is otherworldly-beautiful — mythic-creature beauty, not human-model beauty. Confident at-home-in-her-wildness. NEVER posing, NEVER looking at the viewer.

━━━ 2. COMPOSITION (the creature dominates the frame) ━━━
${composition}.

The forest WRAPS AROUND her like a frame — vines hanging in foreground, mossy rocks beside her, dappled canopy behind. But SHE is what the eye lands on first. NOT a landscape with tiny figure. NOT a centered hero portrait either — caught-on-camera-candid, off-center, real moment.

━━━ 3. THE FOREST SETTING (her natural backdrop — wraps around her) ━━━
${scene}

This setting is HER FRAME, not the subject. Render with atmospheric depth — foreground tactile detail (ferns, moss, vines), midground holding her, background fading into soft painted mist or canopy.

━━━ 4. LIGHTING + MAGIC + ATMOSPHERE ━━━
${sharedDNA.colorPalette}. ${vibeDirective.slice(0, 150)}

Visible magical signature near her: glowing pollen, sparkles, will-o-wisps, fireflies, soft halo, glowing veins under skin, luminescent dewdrops — at least one. Atmospheric haze and dappled light sell the forest depth.

━━━ 5. HARD BANS ━━━
- NO landscape with tiny figure (the creature MUST fill 40-55% of frame)
- NO model-poses / NO posing-for-camera / NO eye-contact-with-viewer
- NO sexualized framing — focus is mythic-creature beauty
- NO modern objects (phones, glasses, electronics)
- NO realistic non-magical humans
- NO violence / NO scared expressions / NO edgy moods
- NO photographic / digital / 3D / cgi descriptors at the technique level
- NO additional figures beyond the focal creature + ONE small animal companion

━━━ OUTPUT ━━━
Write 70-95 words, comma-separated phrases. Lead with the creature unified description from section 1 — preserve her exotic features unmistakably. Composition framing follows. Forest setting wraps around her. Lighting and magic close. NO preamble, NO headers, NO ━━━ markers.`;
};
