/**
 * DragonBot male-action-scenes path — mirror of female-action-scenes
 * (2026-05-14). Full bespoke male pools (no sharing with female).
 *
 * Architecture cloned from male-adventurer with:
 *  - Own MALE_ACTION_SCENES archetype + template
 *  - Own 12 path-bespoke pool clones
 *  - Action pool will be rewritten for peak-action multi-effect stack
 *
 * Content target: peak-action cinematic moments for a male protagonist —
 * mages mid-spell with explosions, ranger mid-loose with arrow streaking,
 * rogue mid-leap from rooftop, paladin mid-strike with divine light,
 * sorcerer at summon apex, druid mid-shape-shift, warlock eldritch blast.
 * Alive, motion-blurred, effect-rich. Every render shows 2-3 simultaneous
 * dynamic elements (primary action + environmental reaction + scene context).
 */

module.exports = {
  archetype: 'MALE_ACTION_SCENES',
  pools: {
    race: 'MALE_ACTION_SCENES_RACE',
    class: 'MALE_ACTION_SCENES_CLASS',
    skin: 'MALE_ACTION_SCENES_SKIN',
    eyes: 'MALE_ACTION_SCENES_EYES',
    hair_color: 'MALE_ACTION_SCENES_HAIR_COLOR',
    hairstyle: 'MALE_ACTION_SCENES_HAIRSTYLE',
    outfit: 'MALE_ACTION_SCENES_OUTFIT',
    accessory: 'MALE_ACTION_SCENES_ACCESSORY',
    action: 'MALE_ACTION_SCENES_ACTION',
    landscape: 'MALE_ACTION_SCENES_LANDSCAPE',
    drama: 'MALE_ACTION_SCENES_DRAMA',
    surprise_element: 'MALE_ACTION_SCENES_SURPRISE_ELEMENT',
  },
};
