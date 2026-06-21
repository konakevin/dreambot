/**
 * YumBot food-adventures path (2026-06-21) — STORYTELLING / "set them free".
 *
 * Embodied kawaii food CHARACTERS (chibi bodies, outfits, props) out DOING
 * activities in real-world locations — amusement park, water park, mall,
 * camping, park, beach, concert, arcade, etc. The playful story-driven side of
 * YumBot, modeled on the hearted taco-mariachi render (a food character with
 * arms/legs/costume performing on a stage), NOT a close-up of a smiling food.
 *
 * Identity: yumbot_food_character medium (embodied) instead of the default
 * yumbot_food_neutral ("face baked into a food object"). Wired in index.js via
 * mediumByPath + modelByPath (flux-1.1-pro-ultra, best at coherent characters
 * now that gpt-image-2 — which rendered the taco winner — is banned).
 *
 * MVP-25 scene pool; reuses the narrative axis pools for the secondary axes.
 */

module.exports = {
  archetype: 'YUMBOT_FOOD_ADVENTURES',
  pools: {
    scene: 'YUMBOT_FOOD_ADVENTURES_SCENES',
    camera_framing: 'YUMBOT_NARRATIVE_CAMERAS',
    lighting: 'YUMBOT_NARRATIVE_LIGHTING',
    palette: 'YUMBOT_NARRATIVE_PALETTES',
    time_of_day: 'YUMBOT_NARRATIVE_TIME_OF_DAY',
    companion: 'YUMBOT_NARRATIVE_COMPANIONS',
    decor_accents: 'YUMBOT_NARRATIVE_DECOR',
    atmospheric_accent: 'YUMBOT_NARRATIVE_ATMOSPHERIC_ACCENT',
  },
};
