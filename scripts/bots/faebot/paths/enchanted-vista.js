/**
 * FaeBot enchanted-vista path.
 *
 * Pure SCENE-ONLY path — no figures, no creatures as focal subjects.
 * The forest itself is the subject, rendered LUSH and BEAUTIFUL with
 * subtle hints of fairy magic woven through every frame (drifting
 * fireflies, glowing pollen, phosphorescent mushrooms, will-o-wisps in
 * the distance, foxfire on bark). The "stop-and-stare" awe of walking
 * into an enchanted grove. Same painterly world as the other paths.
 */

const pools = require('../pools');
const blocks = require('../shared-blocks');

const COMPOSITIONS = [
  'wide cinematic landscape framing of the grove, deep foreground-to-background atmospheric depth, layered tree-planes fading to mist',
  'eye-level grove shot, foreground forest detail (ferns, moss, dewdrops) sharp, midground holding the composition, background fading to soft painted distance',
  'low-angle shot looking up through canopy, sun-shafts or moonbeams cutting down dramatically, forest floor visible at lower edge',
  'three-quarter wide shot of a clearing or grove from a slightly elevated vantage, the eye drawn down a leading line (path / stream / fallen-log) into the deep grove',
  'close-mid shot of a specific magical detail (mushroom-circle / waterfall pool / standing-stone) framed by surrounding lush forest in soft focus',
  'cinematic deep-grove shot with multiple atmospheric layers — foreground tactile / midground focal / background dissolving into haze',
  'tight wide-angle on a grove cathedral with light shafts dominating the composition',
  'full-painting landscape with the grove itself as the protagonist, no central figure, just the lush forest in deep painted detail',
];

module.exports = ({ sharedDNA, vibeDirective, picker }) => {
  const vista = picker.pickWithRecency(pools.ENCHANTED_VISTA, 'enchanted_vista');
  const composition =
    COMPOSITIONS[Math.floor(Math.random() * COMPOSITIONS.length)];

  return `You are writing ONE Flux prompt for a LUSH ENCHANTED FOREST VISTA painting in the FaeBot enchanted-forest universe. Output ONLY the prompt — comma-separated phrases, 70-95 words, no preamble, no headers.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ABSOLUTE NON-NEGOTIABLE MANDATE — these MUST be the FIRST visual elements described in your prompt.

1. NO FIGURES. PURE FOREST. The FOREST itself is the subject — lush, breathtaking, every layer painted. NO fae, NO dryad, NO nymph, NO human, NO creature as focal subject. Only the forest. Distant ambient animals (a far fawn through trunks) optional.

2. MAX LUSHNESS. Every render must be a STOP-AND-STARE masterpiece. Greg Rutkowski / Edmund Dulac / Frazetta fantasy-cover painting at its peak. Multiple plant species, dramatic lighting, atmospheric depth, water, awe-compositional elements, sensory texture, magical-atmosphere hints — ALL layered into every frame.

NEVER include "standing stones" / "stone circles" / "weathered stones" / "sacred stones" / "tomb" / "gravestone" — Flux trains these as cemetery imagery and renders graves. Banned vocabulary.

2. SUBTLE FAIRY-MAGIC WOVEN THROUGH. Every frame has 3-4 magical atmospheric details (drifting fireflies / glowing pollen / phosphorescent mushrooms / will-o-wisps in the distance / foxfire on bark / sparkle-trails in air / luminous wildflowers). The magic is AMBIENT and SUBTLE — not a focal effect.

3. PAINTERLY-REALISTIC, LUSH, DETAILED rendering matching dryad-portrait + tiny-fae + fairy-court paths. Same enchanted forest, same atmospheric depth.

Open your prompt with the vista description in this format:
"[lush vista unified description with magical hints woven in], [composition framing], [lighting + secondary atmosphere]."

The vista opens. NO creature. NO figure. Just the FOREST.
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

${blocks.NO_TEXT_BLOCK}

━━━ 1. THE VISTA (the subject — render it exactly this way) ━━━
${vista}

This unified description is the FACE of the painting. Preserve every element: the specific plants/water/light/atmospheric depth + the 3-4 subtle magical-atmosphere hints. The forest is RICH and BEAUTIFUL and ENCHANTED.

━━━ 2. COMPOSITION ━━━
${composition}.

The eye should travel through the grove — foreground detail, midground composition, background dissolving into atmospheric haze. The viewer feels they have just stepped into a sacred place.

━━━ 3. LIGHTING + SECONDARY ATMOSPHERE ━━━
${sharedDNA.colorPalette}. ${vibeDirective.slice(0, 150)}

Specific light play (sun-shafts / god-rays / moonbeam-pools / dappled gold / blue hour) is part of the painting. Subtle magical particles (pollen / mist / dust / sparkle) catch the light. The atmosphere is PAINTERLY and DREAMY.

━━━ 4. HARD BANS ━━━
- NO figures of any kind (no fae, no dryad, no nymph, no human — pure forest)
- NO bare chest, NO nipples, NO topless
- NO "standing stones" / "stone circles" / "tomb" / "gravestone" / "cemetery" — banned grave-trigger vocabulary
- NO cartoon / chibi / mascot rendering
- NO photographic / digital / 3D / CGI descriptors
- NO modern objects (no fences, signs, lamps, buildings, bridges-of-architecture)
- NO violence / NO scared / NO edgy moods
- NO overwhelming magic effects (the magic is SUBTLE — never the dominant element)
- NO generic vague forest — every render must be VISUALLY SPECIFIC and LUSH

━━━ OUTPUT ━━━
Write 70-95 words, comma-separated phrases. Lead with the vista description from section 1 — preserve the lush detail + subtle magical hints unmistakably. Composition follows. Lighting + atmosphere close. NO preamble, NO headers, NO ━━━ markers.`;
};
