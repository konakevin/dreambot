/**
 * SirenBot — shared prose blocks.
 *
 * Gorgeous dangerous fantasy women across all archetypes — mermaids, dark elves,
 * nymphs, vampires, dragon-women, sorceresses, valkyries. Wildlife-documentary
 * framing: we are observing them in their natural habitats, unaware of the camera.
 */

const PROMPT_PREFIX =
  'high fantasy concept art, painterly illustration, dramatic lighting, rich saturated colors, ornate detail, cinematic composition, epic fantasy atmosphere, masterwork fine art';

const PROMPT_SUFFIX = 'no text, no words, no watermarks, hyper detailed, masterpiece quality';

const WILDLIFE_DOC_BLOCK = `━━━ WILDLIFE DOCUMENTARY — NON-NEGOTIABLE ━━━

This is a WILDLIFE DOCUMENTARY of fantasy creatures. We are observing her in her natural habitat through a hidden camera. She does NOT know she is being watched. She is NOT performing, NOT seducing, NOT displaying herself.

BANNED WORDS: "gazing at the viewer", "looking into the camera", "seductive pose", "alluring glance", "beckoning", "inviting", "sultry", "come-hither", "posing", "modeling", "editorial", "fashion shoot". She is a wild creature going about her life. Describe her ACTIVITY, not her effect on an observer.`;

const BEAUTY_BLOCK = `━━━ FANTASY BEAUTY — INCIDENTAL, NEVER PERFORMATIVE ━━━

She is beautiful the way a wild animal is beautiful — effortlessly, without awareness of being observed. Her clothing, armor, or coverings are natural to her species and world, not outfits chosen for effect. Any beauty or allure is a byproduct of WHAT she is doing, not a performance FOR anyone.

STRICT COVERAGE: she is ALWAYS covered enough to avoid nudity. No nipples, no exposed breasts, no exposed genitals. Fantasy-art decorum. Think Waterhouse painting, not adult content.`;

const SOLO_BLOCK = `━━━ SOLO COMPOSITION — NON-NEGOTIABLE ━━━

She is the ONLY sentient figure in the frame. No companions, no enemies, no second character. Environmental creatures (animals, fish, birds, insects) are fine as habitat detail but no second humanoid/sentient figure. Solo shot.`;

const ORNATE_BLOCK = `━━━ ORNATE DETAIL — NON-NEGOTIABLE ━━━

She carries signature flashy details specific to her archetype: enchanted armor, magical tattoos, glowing runes, jeweled accessories, ornamental weapons, intricate warpaint, gem-studded accessories, woven braids with charms, shimmering magical effects. ALWAYS ornate. Never plain.`;

const PAINTERLY_BLOCK = `━━━ PAINTERLY FINE-ART QUALITY ━━━

This is painterly concept art — oil-on-canvas or masterful digital painting quality. Visible brushwork, chiaroscuro lighting, atmospheric perspective, rich palette with mythical accent colors. Think cover art for a high-fantasy novel, trading-card-game masterwork, or classical history painting. Never cartoon, never anime — painterly mythic fine art.`;

module.exports = {
  PROMPT_PREFIX,
  PROMPT_SUFFIX,
  WILDLIFE_DOC_BLOCK,
  BEAUTY_BLOCK,
  SOLO_BLOCK,
  ORNATE_BLOCK,
  PAINTERLY_BLOCK,
};
