/**
 * DragonBot female-adventurer path — flagship rebuild 2026-05-23.
 *
 * Replaces 2026-05-14 version. ALL identity DNA now path-bespoke (forked
 * out of shared WARRIOR_*). Skin axis DROPPED — race entry carries skin
 * (drow=obsidian, dragonborn=scaled, tiefling=crimson; for humans, race
 * encodes ethnic heritage). Race pool curated to attractive races only
 * (Kevin 2026-05-23): elves, fey/celestial, striking humanoids, small-folk
 * (halfling/gnome/dwarf/kenku/tabaxi/shifter/triton allowed), and ~30%
 * human ethnic heritages with fantasy-canon names.
 *
 * Outfit recipe rewritten 2026-05-23: ornate fitted + feminine-coded
 * (replacing the prior "no form-fitting" bans that produced draped
 * silhouettes). LOTR/Witcher/GoT/Elden register.
 *
 * Path-bespoke pools (12 axes — 10 always-on + 2 conditional):
 *   - race: FEMALE_ADVENTURER_RACE (skin baked in, attractive races only)
 *   - eyes: FEMALE_ADVENTURER_EYES (cool/warm/earth/exotic distribution)
 *   - hair_color: FEMALE_ADVENTURER_HAIR_COLOR (anti-warm-bias)
 *   - hairstyle: FEMALE_ADVENTURER_HAIRSTYLE (practical adventuring)
 *   - class: FEMALE_ADVENTURER_CLASS
 *   - outfit: FEMALE_ADVENTURER_OUTFIT (ornate fitted, feminine-coded)
 *   - accessory: FEMALE_ADVENTURER_ACCESSORY
 *   - action: FEMALE_ADVENTURER_ACTION
 *   - landscape: FEMALE_ADVENTURER_LANDSCAPE
 *   - drama: FEMALE_ADVENTURER_DRAMA (40% gated)
 *   - surprise_element: FEMALE_ADVENTURER_SURPRISE_ELEMENT
 *
 * Bot-level shared (kept for now; flag for future fork):
 *   - lighting / atmosphere
 */

module.exports = {
  archetype: 'FEMALE_ADVENTURER',
  pools: {
    class: 'FEMALE_ADVENTURER_CLASS',
    outfit: 'FEMALE_ADVENTURER_OUTFIT',
    accessory: 'FEMALE_ADVENTURER_ACCESSORY',
    hairstyle: 'FEMALE_ADVENTURER_HAIRSTYLE',
    action: 'FEMALE_ADVENTURER_ACTION',
    landscape: 'FEMALE_ADVENTURER_LANDSCAPE',
    drama: 'FEMALE_ADVENTURER_DRAMA',
    surprise_element: 'FEMALE_ADVENTURER_SURPRISE_ELEMENT',
    race: 'FEMALE_ADVENTURER_RACE',
    eyes: 'FEMALE_ADVENTURER_EYES',
    hair_color: 'FEMALE_ADVENTURER_HAIR_COLOR',
  },
};
