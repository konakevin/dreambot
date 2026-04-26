/**
 * MermaidBot — shared prose blocks.
 *
 * Mermaids in every flavor — seductive sirens, deep-sea aliens, reef sprites,
 * gothic haunts, regal queens, liminal shore-dwellers, arctic ice-singers,
 * armored warriors. Fantasy character art with underwater cinematography.
 */

const PROMPT_PREFIX =
  'high fantasy mermaid illustration, cinematic underwater lighting, caustic light patterns, volumetric light shafts, rich saturated aquatic colors, hyper detailed scales and flowing hair, masterwork fantasy art';

const PROMPT_SUFFIX = 'no text, no words, no watermarks, hyper detailed, masterpiece quality';

const MERMAID_BLOCK = `━━━ CHARACTER — MERMAID ━━━

She is a mermaid — half-woman, half-sea-creature. Her tail is ALWAYS visible and detailed: iridescent scales, translucent fins, bioluminescent patterns, or armored plating depending on the path. Hair drifts naturally in water (or wind if surfaced). She is exquisitely beautiful and OTHERWORLDLY — not a woman in a costume, but a being who belongs to the ocean.

The mermaid's appearance is driven by the ROLLED FEATURES axis — tail color, scale pattern, fin shape, hair, jewelry, markings. These are UNMISTAKABLE and specific to each render.`;

const UNDERWATER_PHYSICS_BLOCK = `━━━ UNDERWATER CINEMATOGRAPHY ━━━

Water lighting physics sell the illusion:
- Caustic light ripples across skin and rocks
- Volumetric light shafts from above
- Suspended particles and drifting bubbles
- Hair and fabric drift naturally in current
- Soft refraction glow on scales
- Color shifts with depth (warm shallows → cold deep blue)

If a scene is above water, use: ocean spray, wet scales catching light, tide-pool reflections, moonpath on swells.`;

const BEAUTY_BLOCK = `━━━ MERMAID BEAUTY — INCIDENTAL, NEVER PERFORMATIVE ━━━

She is beautiful the way a wild animal is beautiful — effortlessly, without awareness of being observed. Ornate shell/coral/pearl tops, draped seaweed-silk, scale-patterned bodywear — these are her NATURAL coverings, not outfits chosen for effect.

She NEVER looks at the camera. She NEVER acknowledges the viewer. She is unaware she is being watched. Any beauty or allure is a byproduct of WHAT she is doing, not a performance FOR anyone.

STRICT COVERAGE: she is ALWAYS covered enough to avoid nudity. No nipples, no exposed breasts, no exposed genitals. Fantasy-art decorum. Think Waterhouse painting, not adult content.`;

const SOLO_BLOCK = `━━━ SOLO COMPOSITION — NON-NEGOTIABLE ━━━

She is the ONLY humanoid figure in the frame. No sailors, no divers, no other mermaids, no mermen. Sea creatures (fish, jellyfish, whales, seahorses) are ENCOURAGED as environmental companions but no second sentient figure.`;

const NO_POSING_BLOCK = `━━━ WILDLIFE DOCUMENTARY — NON-NEGOTIABLE ━━━

This is a WILDLIFE DOCUMENTARY of mermaids. We are observing her in her natural habitat through a hidden camera. She does NOT know she is being watched. She is NOT performing, NOT seducing, NOT displaying herself.

BANNED WORDS: "gazing at the viewer", "looking into the camera", "seductive pose", "alluring glance", "beckoning", "inviting", "sultry", "come-hither", "posing", "modeling", "editorial", "fashion". She is a wild creature going about her life. Describe her ACTIVITY, not her effect on an observer.`;

module.exports = {
  PROMPT_PREFIX,
  PROMPT_SUFFIX,
  MERMAID_BLOCK,
  UNDERWATER_PHYSICS_BLOCK,
  BEAUTY_BLOCK,
  SOLO_BLOCK,
  NO_POSING_BLOCK,
};
