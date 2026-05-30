/**
 * MangaBot anime-character-male path — declarative axis-system form
 * (Phase 2.2, 2026-05-29). FULL BESPOKE per
 * feedback_full_bespoke_per_path_no_shared_pools — every path axis gets
 * its OWN male-coded pool, NO reuse from female.
 *
 * 12-axis split (8 DNA + 4 path + 1 conditional drama):
 *   characterDnaAxes:
 *     ethnicity (NEW MVP-25)       — male register cues (rugged/weathered)
 *     archetype (REUSE 200)        — ANIME_ARCHETYPE_MALE
 *     skin / eyes / hair_color     — shared anime DNA pools
 *     hairstyle (REUSE 200)        — ANIME_HAIRSTYLES_MALE
 *     outfit (REUSE 200)           — ANIME_OUTFITS_MALE
 *     accessory (REUSE 200)        — ANIME_ACCESSORIES_MALE
 *   path-bespoke (ALL NEW MVP-25):
 *     setting                       — male-coded engaged contexts
 *     action                        — forward-facing, COVERED-CHEST
 *     camera_framing                — combat/dynamic-leaning forward-only
 *     surprise_element              — male-coded secondary subjects
 *   conditional (40%-gated):
 *     drama (NEW MVP-25)            — male-coded atmospheric/combat event
 *
 * Legacy at paths/legacy/anime-character-male.js.
 */

module.exports = {
  archetype: 'MANGABOT_ANIME_CHARACTER_MALE',
  pools: {
    ethnicity: 'ANIME_CHARACTER_MALE_ETHNICITY',
    archetype: 'ANIME_ARCHETYPE_MALE',
    skin: 'ANIME_SKIN',
    eyes: 'ANIME_EYES',
    hair_color: 'ANIME_HAIR_COLOR',
    hairstyle: 'ANIME_HAIRSTYLES_MALE',
    outfit: 'ANIME_OUTFITS_MALE',
    accessory: 'ANIME_ACCESSORIES_MALE',
    setting: 'ANIME_CHARACTER_MALE_SETTING',
    action: 'ANIME_CHARACTER_MALE_ACTION',
    camera_framing: 'ANIME_CHARACTER_MALE_CAMERA_FRAMING',
    surprise_element: 'ANIME_CHARACTER_MALE_SURPRISE_ELEMENT',
    drama: 'ANIME_CHARACTER_MALE_DRAMA',
  },
};
