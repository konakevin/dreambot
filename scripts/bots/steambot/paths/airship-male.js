/**
 * SteamBot airship-male — declarative composer form.
 *
 * Male sister to airship-female. Solo MALE air-officer / sky-corsair /
 * crew-member caught MID-ACTION on or around a steampunk airship — combat,
 * cannon-fire, repelling boarders, climbing the rigging mid-storm, firing a
 * signal-flare, hauling a hawser, sighting through a spyglass. Character +
 * outfit + action are the primary draw; airship deck is the stage.
 *
 * Handsome / dashing / rugged / weathered / commanding — appeal reads through
 * action and craftsmanship, NEVER seductive, NEVER shirtless. Same action
 * scenes as airship-female, male actors. Carries the same wins as the female
 * path: ethnicity-noun diversity in the opening + FRONT-LOADED hair color
 * (so hair varies instead of defaulting to dark) + Frazetta painted anchor.
 *
 * Pool sharing: role / accessory / backdrop / drama are SHARED with
 * airship-female (gender-neutral airship-world + equipment axes). skin /
 * eyes / facial_hair / hair_color / hairstyle / outfit / action are
 * male-bespoke (Flux gender-coding + the no-shirtless / facial-hair mandate
 * require male vocabulary).
 */

module.exports = {
  archetype: 'STEAMBOT_AIRSHIP_MALE',
  pools: {
    // Path-bespoke
    action: 'AIRSHIP_MALE_ACTION',
    backdrop: 'AIRSHIP_BACKDROP', // shared with airship-female
    // Character DNA — 9 atomic axes (male adds facial_hair; R2 2026-06-27:
    // nationality-label + grime/aging pools replaced with clean pure-visual
    // atomic axes incl. a new `face` axis, mirroring airship-female).
    role: 'AIRSHIP_ROLE', // shared
    skin: 'AIRSHIP_MALE_SKIN',
    face: 'AIRSHIP_MALE_FACE',
    eyes: 'AIRSHIP_MALE_EYES',
    facial_hair: 'AIRSHIP_MALE_FACIAL_HAIR',
    hair_color: 'AIRSHIP_MALE_HAIR_COLOR',
    hairstyle: 'AIRSHIP_MALE_HAIRSTYLE',
    outfit: 'AIRSHIP_MALE_OUTFIT',
    accessory: 'AIRSHIP_ACCESSORY', // shared
    // Conditional (40% gate) — environmental drama (shared)
    drama: 'AIRSHIP_DRAMA',
  },
};
