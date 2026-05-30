/**
 * MangaBot anime-character-female path — declarative axis-system form
 * (Phase 2.1 of the MangaBot overhaul, 2026-05-29).
 *
 * Anime woman as the HERO of the frame in a richly-rendered anime setting.
 * First legacy MangaBot path converted to the axis system + the canonical
 * pattern for the remaining 17 conversions.
 *
 * Designed anti-back-to-camera from gen-1 per the Phase 2.0 validation
 * lesson:
 *   • action pool seeded FORWARD-FACING ONLY (mid-strike toward viewer /
 *     mid-cast / forward 3/4 stance / profile dynamic action — never
 *     "walking toward gate" / "approaching the temple" / "looking out
 *     over X")
 *   • camera_framing pool seeded FORWARD-FACING ONLY (low-angle hero /
 *     forward 3/4 / tight medium-shot / profile dynamic — never
 *     over-shoulder / wide-figure-tiny / silhouette-from-behind)
 *   • setting pool designed for character-led compositions where the
 *     character is naturally engaged with something IN-FRAME, not
 *     "X looking out over Y"
 *   • camera_framing wired as MANDATORY DRIVING AXIS via shared-blocks.
 *     CAMERA_FRAMING_MANDATORY_BLOCK in the template
 *   • twoPassPolish skipped (Phase 2.0c lesson — Haiku strips axis text)
 *
 * 12-axis split (8 character DNA + 4 path + 1 conditional drama):
 *   characterDnaAxes:
 *     ethnicity (NEW, 50)         — anime-canon ethnicity-noun lead
 *     archetype (REUSE, 200)      — anime role
 *     skin (REUSE, 200)           — anime skin tone
 *     eyes (REUSE, 200)           — anime eye color + shape
 *     hair_color (REUSE, 200)     — anime hair color
 *     hairstyle (REUSE, 200)      — anime hairstyle
 *     outfit (REUSE, 200)         — anime outfit silhouette
 *     accessory (REUSE, 200)      — anime signature object
 *   path:
 *     setting (NEW, 200)          — anime stage with in-frame engagement
 *     action (NEW, 200)           — FORWARD-FACING mid-action only
 *     camera_framing (NEW, 150)   — FORWARD-FACING-ONLY framings
 *     surprise_element (NEW, 150) — anime midground secondary subject
 *   conditional (40%-gated):
 *     drama (NEW, 60)             — anime atmospheric event (NOT eclipsing her)
 *
 * Legacy inline-form preserved at paths/legacy/anime-character-female.js.
 *
 * See:
 *   - scripts/bots/mangabot/archetypes.js (MANGABOT_ANIME_CHARACTER_FEMALE
 *     slot definitions)
 *   - scripts/bots/mangabot/archetype-templates.js (template w/ gender
 *     lock, ethnicity-noun lock, anti-back-to-camera mandates, CAMERA_
 *     FRAMING_MANDATORY_BLOCK)
 *   - scripts/bots/mangabot/shared-blocks.js (CAMERA_FRAMING_MANDATORY_
 *     BLOCK — used by the template)
 *   - project_mangabot_back_to_camera_overhaul memory file
 */

module.exports = {
  archetype: 'MANGABOT_ANIME_CHARACTER_FEMALE',
  pools: {
    // Character DNA (reused 200-entry pools — appearance-only, no composition bias)
    ethnicity: 'ANIME_CHARACTER_FEMALE_ETHNICITY',
    archetype: 'ANIME_ARCHETYPE_FEMALE',
    skin: 'ANIME_SKIN',
    eyes: 'ANIME_EYES',
    hair_color: 'ANIME_HAIR_COLOR',
    hairstyle: 'ANIME_HAIRSTYLES_FEMALE',
    outfit: 'ANIME_OUTFITS_FEMALE',
    accessory: 'ANIME_ACCESSORIES_FEMALE',
    // Path-bespoke (new — Phase 2.1)
    setting: 'ANIME_CHARACTER_FEMALE_SETTING',
    action: 'ANIME_CHARACTER_FEMALE_ACTION',
    camera_framing: 'ANIME_CHARACTER_FEMALE_CAMERA_FRAMING',
    surprise_element: 'ANIME_CHARACTER_FEMALE_SURPRISE_ELEMENT',
    // Conditional drama (40% gate)
    drama: 'ANIME_CHARACTER_FEMALE_DRAMA',
  },
};
