/**
 * SteamBot sexy-steampunk-woman — declarative composer form.
 *
 * Rewritten 2026-05-15 to canonical character-path shape (mirrors DragonBot
 * ARTSY_GIRL + StarBot FEMALE_EXPLORER). THE OUTFIT IS THE MAIN SHOW.
 * Single steampunk woman at 25-40% frame, FULL BODY, candid mid-action in a
 * fully-realized Victorian-industrial setting. Mucha / Klimt / Pre-Raphaelite
 * illustration tradition. NSFW-clean vocabulary.
 *
 * 12-axis split: 7 DNA + 3 path-bespoke (persona/landscape/action) + 2
 * universal (lighting/atmosphere). The legacy `moment` pool
 * (STEAMPUNK_WOMEN_CANDID_MOMENTS) is no longer wired here — replaced by
 * the cleaner action + landscape combo so the brief composes the candid
 * scene from atomic axes instead of pre-baked sentences.
 *
 * Pre-rewrite preserved at paths/legacy/sexy-steampunk-woman.js.
 */

module.exports = {
  archetype: 'STEAMBOT_STEAMPUNK_WOMAN',
  pools: {
    // Path-bespoke
    persona: 'STEAMPUNK_WOMEN_ARCHETYPES',
    landscape: 'STEAMPUNK_WOMEN_SETTINGS',
    action: 'STEAMPUNK_WOMEN_OUTDOOR_MOMENTS',
    // Character DNA
    skin: 'STEAMPUNK_WOMEN_SKIN',
    eyes: 'STEAMPUNK_WOMEN_EYES',
    makeup: 'STEAMPUNK_WOMEN_MAKEUP',
    hair_color: 'STEAMPUNK_WOMEN_HAIR_COLOR',
    hairstyle: 'STEAMPUNK_WOMEN_HAIRSTYLES',
    outfit: 'STEAMPUNK_WOMEN_WARDROBE_AMPLIFIED',
    accessory: 'STEAMPUNK_WOMEN_ACCESSORIES',
  },
};
