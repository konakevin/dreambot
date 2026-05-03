/**
 * FaeBot dryad-portrait path.
 *
 * Single adult-scale plant-merged feminine spirit, body fills the frame
 * (medium-shot to close-medium), intimate candid pose, the forest wraps
 * around her as natural backdrop. Closest path to the original reference
 * image (the gold-olive dryad cupping magic in her palm).
 */

const pools = require('../pools');
const blocks = require('../shared-blocks');

const COMPOSITIONS = [
  'TIGHT close-up portrait, head and shoulders only, face fills 35-45% of frame, head turned in candid 3/4 profile, eyes lowered or looking away',
  'bust framing chest-up, creature off-center via rule-of-thirds, head + shoulders + collarbone fill 65-80% of frame, hair cascading',
  'close portrait, face in soft profile, single eye visible, hair-vines and flower-crown clearly readable, head fills 40-50% of frame',
  'three-quarter close portrait, creature half-turned away — back of one shoulder + side of face visible — face turned toward something off-frame',
  'intimate close-up, hands in foreground cupping a glowing magic element, creature face above looking down at it, head + shoulders + cupped hands fill 70% of frame',
  'tight side-profile bust portrait, creature in stillness, soft backlight rimming her silhouette, head + neck + shoulder fill 60-70% of frame',
  'extreme close-up of face turned in 3/4 profile, eyelashes / lichen-cheek-detail / vine-hair-strands all readable, face fills 50-60% of frame',
  'over-the-shoulder portrait, viewer behind her, profile of her cheek + jaw + ear-tip + flower-crown visible, hair flowing forward',
];

module.exports = ({ sharedDNA, vibeDirective, picker }) => {
  const creature = picker.pickWithRecency(pools.DRYAD_PORTRAITS, 'dryad_portrait');
  const composition =
    COMPOSITIONS[Math.floor(Math.random() * COMPOSITIONS.length)];

  return `You are writing ONE Flux prompt for a SINGLE-DRYAD enchanted-forest portrait. Output ONLY the prompt — comma-separated phrases, 70-95 words, no preamble, no headers.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ABSOLUTE NON-NEGOTIABLE MANDATE — these MUST be the FIRST visual elements described in your prompt, BEFORE setting/lighting/anything else.

1. THIS IS A TIGHT PORTRAIT. Head and shoulders / bust framing only. The CREATURE'S FACE AND UPPER BODY fill 60-80% of the frame. NEVER write full-body, NEVER write wide-shot, NEVER write a "figure in landscape". This is portrait scale — close enough to read eyelashes, lichen-detail on cheekbones, individual vine-strands in hair.

2. The creature description below is THE creature — render her with EVERY exotic feature listed (the moss-tinted skin, the vine-hair, the leaf-garment, the antlers/wings/glowing-marks, the magical signature, the candid posture). 4+ stacked exotic features must visibly land in the painting.

Open your prompt with the creature description in this format:
"[creature unified description], [composition framing], [forest setting wrapping around her], [lighting + magical atmosphere]."

The creature opens. Everything else is HER FRAME.
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

${blocks.PEACEFUL_FAIRY_BLOCK}

${blocks.NO_TEXT_BLOCK}

━━━ 1. THE DRYAD (the subject — render her exactly this way) ━━━
${creature}

This unified description is the FACE of the painting. Preserve every exotic feature: skin tone, hair, garment, eyes/face/antlers/wings/glowing-marks, magical signature, candid posture. Mythic-creature beauty, not human-model beauty. Confident at-home-in-her-wildness. NEVER posing, NEVER looking at the viewer.

━━━ 2. COMPOSITION ━━━
${composition}.

The forest WRAPS AROUND her like a frame — vines hanging in foreground, mossy rocks beside her, dappled canopy behind. But SHE is what the eye lands on first. Caught-on-camera-candid, off-center, real moment.

━━━ 3. FOREST BACKDROP (her natural frame) ━━━
Soft layered forest depth — foreground tactile detail (ferns, moss, vines, dewdrops), midground holding her, background fading into soft painted mist or canopy. Atmospheric haze sells the depth. Never let the backdrop compete with her presence.

━━━ 4. LIGHTING + MAGIC + ATMOSPHERE ━━━
${sharedDNA.colorPalette}. ${vibeDirective.slice(0, 150)}

Visible magical signature near her: glowing pollen, sparkles, fireflies, soft halo, glowing veins under skin, luminescent dewdrops — at least one. Soft golden-hour or moonlit-cool light catching her hair and shoulders.

━━━ 5. HARD BANS ━━━
- NO full-body framing / NO wide-shot / NO landscape-with-figure (this is a TIGHT PORTRAIT — head/bust scale only)
- NO model-poses / NO posing-for-camera / NO eye-contact-with-viewer (face turned away, eyes lowered, gaze elsewhere)
- NO sexualized framing — focus is mythic-creature beauty
- NO modern objects, NO realistic non-magical humans
- NO violence / NO scared expressions / NO edgy moods
- NO additional figures
- NO palm-sized fairy / NO tiny-pixie scale (this path is adult-scale only)

━━━ OUTPUT ━━━
Write 70-95 words, comma-separated phrases. Lead with the creature unified description from section 1 — preserve her exotic features unmistakably. Composition follows. Forest backdrop wraps around her. Lighting and magic close. NO preamble, NO headers, NO ━━━ markers.`;
};
