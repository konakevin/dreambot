/**
 * FaeBot — shared prose blocks.
 *
 * A wildlife documentary of the enchanted forest — nymphs, dryads, fairies,
 * fae queens, naiads, druids, green witches, mushroom spirits, moth fairies.
 * Every creature observed candidly in her natural habitat.
 */

const PROMPT_PREFIX =
  'enchanted forest fantasy art, painterly illustration, dappled natural lighting, rich greens and earth tones with magical accent colors, organic detail, atmospheric depth, masterwork fine art';

const PROMPT_SUFFIX = 'no text, no words, no watermarks, hyper detailed, masterpiece quality';

const WILDLIFE_DOC_BLOCK = `━━━ WILDLIFE DOCUMENTARY — NON-NEGOTIABLE ━━━

This is a WILDLIFE DOCUMENTARY of enchanted forest creatures. We are observing her in her natural habitat through a hidden camera. She does NOT know she is being watched. She is NOT performing, NOT displaying herself.

BANNED WORDS: "gazing at the viewer", "looking into the camera", "seductive pose", "alluring glance", "beckoning", "inviting", "sultry", "come-hither", "posing", "modeling", "editorial", "fashion shoot". She is a wild creature going about her life. Describe her ACTIVITY, not her effect on an observer.`;

const BEAUTY_BLOCK = `━━━ FOREST BEAUTY — ORGANIC AND EFFORTLESS ━━━

She is stunning the way nature is stunning — effortlessly, without trying. Her beauty is woven into what she IS, not something she performs. Coverings are natural to her species: living leaves, bark, petals, spider silk, moss, fungi, woven vines. Her body is part of the forest ecosystem.

She is alluring because of what she is and what she does — the curve of a vine along her hip, the way light catches dew on her skin, the grace of her movement through her habitat. The sensuality is INCIDENTAL, never performed.

STRICT COVERAGE: she is ALWAYS covered enough to avoid nudity. No nipples, no exposed breasts, no exposed genitals. Fantasy-art decorum. Think Arthur Rackham, Brian Froud, Alan Lee — not adult content.`;

const SOLO_BLOCK = `━━━ SOLO COMPOSITION — NON-NEGOTIABLE ━━━

She is the ONLY sentient figure in the frame. No companions, no second fae. Forest animals (deer, foxes, rabbits, birds, insects, fish) are ENCOURAGED as habitat detail but no second humanoid/sentient figure. Solo shot.`;

const LIVING_NATURE_BLOCK = `━━━ LIVING NATURE — THE FOREST IS ALIVE ━━━

The forest responds to her presence — plants lean toward her, flowers open as she passes, light follows her, moss grows where she steps. The environment is not a backdrop, it is an extension of her being. She and the forest are one organism.`;

const PAINTERLY_BLOCK = `━━━ PAINTERLY FINE-ART QUALITY ━━━

This is painterly fantasy art — oil-on-canvas or masterful digital painting quality. Visible brushwork, atmospheric perspective, rich natural palette. Think Arthur Rackham fairy tale illustration, Brian Froud's Faeries, Alan Lee's Middle-earth, classic botanical art crossed with high fantasy. Never cartoon, never anime — painterly mythic fine art.`;

module.exports = {
  PROMPT_PREFIX,
  PROMPT_SUFFIX,
  WILDLIFE_DOC_BLOCK,
  BEAUTY_BLOCK,
  SOLO_BLOCK,
  LIVING_NATURE_BLOCK,
  PAINTERLY_BLOCK,
};
