/**
 * MangaBot magical-girl path — declarative axis-system form
 * (Phase 2.3, 2026-05-29). Full-bespoke per
 * feedback_full_bespoke_per_path_no_shared_pools.
 *
 * Solo mahou-shoujo / Sailor-Moon / Precure / Madoka-Magica / Cardcaptor
 * tradition. SPARKLE STACK + transformation-peak + forward-facing pose.
 *
 * 12-axis split (8 DNA + 4 path + 1 conditional drama):
 *   DNA: ethnicity (NEW MVP-25) + archetype (NEW MVP-25) + skin / eyes /
 *        hair_color (REUSE shared anime DNA) + hairstyle (REUSE) +
 *        outfit (NEW MVP-25 — magical-girl frilly) + accessory (NEW MVP-25
 *        — wand/scepter/familiar)
 *   path: setting (NEW MVP-25) + action (NEW MVP-25 forward-facing transformation)
 *         + camera_framing (NEW MVP-25 forward-facing) + surprise_element (NEW MVP-25)
 *   conditional (40%-gate): drama (NEW MVP-25 — peak magical event)
 *
 * Legacy at paths/legacy/magical-girl.js.
 */
module.exports = {
  archetype: 'MANGABOT_MAGICAL_GIRL',
  pools: {
    ethnicity: 'MAGICAL_GIRL_ETHNICITY',
    archetype: 'MAGICAL_GIRL_ARCHETYPE',
    skin: 'ANIME_SKIN',
    eyes: 'ANIME_EYES',
    hair_color: 'ANIME_HAIR_COLOR',
    hairstyle: 'ANIME_HAIRSTYLES_FEMALE',
    outfit: 'MAGICAL_GIRL_OUTFIT',
    accessory: 'MAGICAL_GIRL_ACCESSORY',
    setting: 'MAGICAL_GIRL_SETTING',
    action: 'MAGICAL_GIRL_ACTION',
    camera_framing: 'MAGICAL_GIRL_CAMERA_FRAMING',
    surprise_element: 'MAGICAL_GIRL_SURPRISE_ELEMENT',
    drama: 'MAGICAL_GIRL_DRAMA',
  },
};
