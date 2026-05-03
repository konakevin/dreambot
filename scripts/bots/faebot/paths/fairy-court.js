/**
 * FaeBot fairy-court path.
 *
 * Regal fae royalty — solo queens or small courts (2-5 figures) caught
 * in candid sacred-grove moments. Three-quarter to full-body framing.
 * Same painterly enchanted-forest world as dryad-portrait, just the
 * NOBLE register: ancient, ceremonial, regal-still.
 */

const pools = require('../pools');
const blocks = require('../shared-blocks');

const COMPOSITIONS = [
  'three-quarter-body framing of the queen on her moss-throne, queen fills 40-55% of frame, ancient grove framing the throne',
  'full-figure shot of the queen standing in a sacred-stone-circle at twilight, queen fills 50-65% of frame, ancient stones around her',
  'wide-medium framing of a small processional (queen + 2 attendants) walking through a wisteria-archway, group fills 45-60% of frame',
  'medium shot of queen seated, one attendant kneeling at her feet, queen fills 45-60% of frame, the kneeling figure smaller in foreground',
  'three-quarter shot from a slight low-angle (looking up at the throne), queen fills 50-65% of frame, antler-crown framing the canopy',
  'mid-shot of queen extending a hand toward a sacred animal (white stag, raven, owl) knelt or perched before her, both fill 55-70% of frame together',
  'wide processional shot, queen at center with 2-4 fae fanning around her, all turned in the same direction, the grove backdrop holding atmospheric haze',
  'full-body portrait of a solo regal fae walking slowly through her grove, body fills 50-60% of frame, hair and gown trailing',
];

module.exports = ({ sharedDNA, vibeDirective, picker }) => {
  const courtScene = picker.pickWithRecency(pools.FAIRY_COURT, 'fairy_court_scene');
  const composition =
    COMPOSITIONS[Math.floor(Math.random() * COMPOSITIONS.length)];

  return `You are writing ONE Flux prompt for a FAIRY COURT painting in the FaeBot enchanted-forest universe. Output ONLY the prompt — comma-separated phrases, 70-95 words, no preamble, no headers.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ABSOLUTE NON-NEGOTIABLE MANDATE — these MUST be the FIRST visual elements described in your prompt.

1. THE COURT IS THE SUBJECT — either a SOLITARY REGAL QUEEN (full-body or three-quarter-body framing, body fills 40-65% of frame) OR a SMALL COURT of 2-5 figures with the queen at center fanning into attendants. NEVER a tight portrait (that's dryad-portrait). NEVER tiny-fairy scale (that's tiny-fae). NEVER a wide landscape with tiny figure.

2. PAINTERLY-REALISTIC rendering matching dryad-portrait + tiny-fae paths. Same enchanted forest, same Brian Froud + Charles Vess + fantasy-novel-cover lineage. NEVER cartoon, NEVER mascot.

Open your prompt with the court description in this format:
"[court scene unified description], [composition framing], [grove-throne backdrop], [lighting + magical atmosphere]."

The court opens. Everything else is THEIR SACRED GROVE.
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

${blocks.PEACEFUL_FAIRY_BLOCK}

${blocks.NO_TEXT_BLOCK}

━━━ 1. THE COURT (the subject — render it exactly this way) ━━━
${courtScene}

This unified description is the FACE of the painting. Preserve every detail: the queen's exotic features (skin/hair/gown/crown/magic), the attendants' presence (if any), the grove-throne setting, the candid nobility moment. Mythic regal beauty. NEVER posing for camera, NEVER eye-contact-with-viewer.

━━━ 2. COMPOSITION ━━━
${composition}.

The grove WRAPS AROUND the court — ancient trees, hanging moss, ferns, twisted roots. The throne (when present) is grown moss-and-root, NOT carved stone or built architecture. Sacred-grove-throne energy.

━━━ 3. SACRED GROVE BACKDROP ━━━
The same painterly enchanted forest as dryad-portrait. Ancient oaks/willows/birches, moonlit or twilight or golden-hour, dappled canopy light, wisteria and ferns and bluebells. Atmospheric depth fading to soft painted distance.

━━━ 4. LIGHTING + MAGIC + ATMOSPHERE ━━━
${sharedDNA.colorPalette}. ${vibeDirective.slice(0, 150)}

Royal magic signature: butterflies orbiting around the queen's crown, soft amber halo at her shoulders, drifting petals, glowing pollen, will-o-wisps trailing the procession. Soft moonlit-cool or golden-hour light catching her hair, gown, and antler/diadem.

━━━ 5. HARD BANS ━━━
- NO castle / built architecture / stone-throne (the court lives in a GROWN GROVE — moss-and-root throne, fern-grotto, sacred-stone-circle ONLY)
- NO model-poses / NO posing-for-camera / NO eye-contact-with-viewer
- NO sexualized framing — focus is regal-otherworldly beauty
- NO modern objects, NO realistic non-magical humans
- NO violence / NO threatening / NO weapons
- NO crowds beyond 5 figures
- NO tight head-and-shoulders portrait (this path is body-scale, not face-close)
- NO tiny-fairy scale (that's tiny-fae path)
- NO cartoon / chibi / mascot rendering

━━━ OUTPUT ━━━
Write 70-95 words, comma-separated phrases. Lead with the court scene from section 1 — preserve queen's regal features and attendant arrangement unmistakably. Composition follows. Grove backdrop wraps. Lighting + magic close. NO preamble, NO headers, NO ━━━ markers.`;
};
