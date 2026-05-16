/**
 * SteamBot steampunk-man — declarative composer form.
 *
 * Rewritten 2026-05-15 to canonical character-path shape, mirror of
 * sexy-steampunk-woman migration. THE OUTFIT IS THE MAIN SHOW.
 * Single steampunk MAN at 25-40% frame, FULL BODY, candid mid-action in a
 * fully-realized Victorian-industrial setting. Handsome / dashing / rugged
 * / intent / capable — NEVER sexy/seductive. Oil-painted illustration on
 * canvas register.
 *
 * 12-axis split: 7 character DNA + 3 path-bespoke (persona/landscape/action)
 * + 2 universal (lighting/atmosphere). Strict male DNA — never
 * cross-polluted with female vocabulary.
 *
 * Pre-rewrite preserved at paths/legacy/steampunk-man.js.
 */

module.exports = {
  archetype: 'STEAMBOT_STEAMPUNK_MAN',
  pools: {
    // Path-bespoke
    persona: 'STEAMPUNK_MEN_ARCHETYPES',
    landscape: 'STEAMPUNK_MEN_SETTINGS',
    action: 'STEAMPUNK_MEN_OUTDOOR_MOMENTS',
    // Character DNA (male — note facial_hair replaces makeup)
    skin: 'STEAMPUNK_MEN_SKIN',
    eyes: 'STEAMPUNK_MEN_EYES',
    facial_hair: 'STEAMPUNK_MEN_FACIAL_HAIR',
    hair_color: 'STEAMPUNK_MEN_HAIR_COLOR',
    hairstyle: 'STEAMPUNK_MEN_HAIRSTYLES',
    outfit: 'STEAMPUNK_MEN_WARDROBE_AMPLIFIED',
    accessory: 'STEAMPUNK_MEN_ACCESSORIES',
  },
};
