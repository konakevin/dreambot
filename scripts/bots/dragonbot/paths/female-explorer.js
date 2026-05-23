/**
 * DragonBot female-explorer path — created 2026-05-23.
 *
 * CARBON COPY of the cool-armor female-adventurer state at the moment it
 * was perfected (cool fitted ornate armor + candid traveling-adventurer
 * scenes — climbing / bridges / paths / drawn-blade stealth / creek-rest /
 * campfire / map). female-adventurer was simultaneously REVERTED to its
 * 2026-05-14 baseline, so these two paths now run side-by-side as DISTINCT
 * styles. Pools are fully independent (female_explorer_*) so either path can
 * evolve without touching the other.
 *
 * Escape hatch for the old female-adventurer baseline: git tag
 * `female-adventurer-baseline-2026-05-14` (== commit a7f695e^).
 *
 * Path-bespoke pools (11 axes — 10 always-on + 1 conditional):
 *   - race / eyes / hair_color / hairstyle / class / outfit / accessory
 *   - action / landscape / surprise_element
 *   - drama (40% gated)
 *
 * Bot-level shared: lighting / atmosphere.
 */

module.exports = {
  archetype: 'DRAGON_FEMALE_EXPLORER',
  pools: {
    class: 'FEMALE_EXPLORER_CLASS',
    outfit: 'FEMALE_EXPLORER_OUTFIT',
    accessory: 'FEMALE_EXPLORER_ACCESSORY',
    hairstyle: 'FEMALE_EXPLORER_HAIRSTYLE',
    action: 'FEMALE_EXPLORER_ACTION',
    landscape: 'FEMALE_EXPLORER_LANDSCAPE',
    drama: 'FEMALE_EXPLORER_DRAMA',
    surprise_element: 'FEMALE_EXPLORER_SURPRISE_ELEMENT',
    race: 'FEMALE_EXPLORER_RACE',
    eyes: 'FEMALE_EXPLORER_EYES',
    hair_color: 'FEMALE_EXPLORER_HAIR_COLOR',
  },
};
