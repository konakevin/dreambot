/**
 * GlowBot — shared prose blocks.
 *
 * LIGHT IS THE HERO. Every scene emotionally carried by the light itself.
 * Viewer should feel RELAXED + AWE-INSPIRED + AT PEACE.
 */

const PROMPT_PREFIX =
  'ethereal luminous painting, light is the hero, transcendent peaceful beauty, magical atmosphere, divine lighting carrying all emotion, gallery-quality wallpaper-worthy, soft glowing atmosphere';

const PROMPT_SUFFIX = 'no text, no words, no watermarks, hyper detailed, masterpiece quality';

const LIGHT_IS_HERO_BLOCK = `━━━ LIGHT IS THE HERO — NON-NEGOTIABLE ━━━

Every render is emotionally carried by the LIGHT itself. Light is the subject regardless of what else is in the frame. Pandora-bioluminescent energy + Ghibli / Narnia / Rivendell soft-sacred luminance. Every render should make the viewer feel RELAXED, AWE-INSPIRED, AT PEACE purely from how the light lands.

Light treatments are never generic — name specific light phenomena (god-rays piercing mist / aurora washing over lake / firefly pillar in forest clearing / dawn dappled through leaves / moonlit-silver reflections / bioluminescent moss glowing through / shafts of golden sunlight / inner luminosity emanating from within).

If a viewer looks at the render and doesn't immediately feel LIGHT as the emotional center — the render failed. Light carries the scene.`;

const AWE_AND_PEACE_BLOCK = `━━━ RELAXED + AWE-INSPIRED + AT PEACE ━━━

The emotional target is non-negotiable: every render must produce the feeling of RELAXED + AWE-INSPIRED + AT PEACE. Never tense, never sharp, never startling. The viewer's reaction should be a slow exhale. A long gaze. A soft smile.

Express this via: gentle composition + soft atmospheric gradients + warm or cool luminous palettes + slow-moment stillness + sense of vastness + integrated breathing-room.`;

const NO_HARSH_DARK_FIERCE_BLOCK = `━━━ NO HARSH / NO DARK / NO FIERCE ━━━

GlowBot has no menace, no threat, no horror, no sharp contrast, no aggressive lighting. Never:
- Sharp harsh-lit shadows
- Dark threatening atmosphere
- Moody-brooding vibes
- Intense dramatic storm energy (that's EarthBot's weather-moment)
- Fierce / combative tone

Always:
- Soft gentle diffuse light
- Warm-peaceful OR cool-serene palette
- Calm breath-worthy atmosphere
- Sacred-quiet vibe`;

const NO_PEOPLE_BLOCK = `━━━ NO PEOPLE ━━━

No human figures in frame. Wildlife OK as peripheral scale-element (distant deer, bird silhouette, glowing butterfly at mid-distance) — but never a human. The LIGHT + LANDSCAPE + ATMOSPHERE do the work.`;

const IMPOSSIBLE_BEAUTY_BLOCK = `━━━ IMPOSSIBLE BEAUTY ━━━

Every render is wall-poster / phone-wallpaper quality. Not documentary, not realistic-restrained — AI-generated beauty that feels impossible to capture with a camera. Dense atmospheric detail, lighting more perfect than nature allows, colors more luminous than film can capture. "I have never seen anything this serene + beautiful" is the reaction.`;

const BLOW_IT_UP_BLOCK = `━━━ BLOW IT UP — AMPLIFICATION ━━━

The theme (soft luminous light + peaceful awe) is the CANVAS, not the ceiling. Stack the light-magic: multiple layers of luminous phenomena + impossibly-abundant particulate atmosphere + atmospheric gradients stacked + scale + depth. Max saturation + max soft-glow + max layered-luminance. If the render feels gentle-but-ordinary — dial it up until it's gentle-AND-magical. Stays within peaceful-awe constraint, never menace.`;

module.exports = {
  PROMPT_PREFIX,
  PROMPT_SUFFIX,
  LIGHT_IS_HERO_BLOCK,
  AWE_AND_PEACE_BLOCK,
  NO_HARSH_DARK_FIERCE_BLOCK,
  NO_PEOPLE_BLOCK,
  IMPOSSIBLE_BEAUTY_BLOCK,
  BLOW_IT_UP_BLOCK,
};
