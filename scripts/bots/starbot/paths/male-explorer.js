/**
 * StarBot male-explorer path — declarative form.
 *
 * Migrated 2026-05-13 from hand-written brief to the shared archetype
 * composer using a BESPOKE per-gender template (MALE_EXPLORER, not
 * gender-neutral EXPLORER). Sibling archetype to FEMALE_EXPLORER.
 *
 * Pre-refactor file preserved at paths/legacy/male-explorer.js.
 *
 * Why bespoke (not DRY shared template)? 2026-05-12 lesson: gender-neutral
 * EXPLORER template regressed character renders. Flux uses gendered
 * pronouns + nouns as primary gender-render signals. Sibling per-gender
 * templates preserve the working DNA.
 *
 * Why a separate "rugged" pool for males? 2026-05-13: Kevin specified
 * that men should feel "rugged-coded ... not as form-fitting ... more
 * badass." FE pool emphasizes form-fit + sexy; ME pool emphasizes heavy
 * tactical + weathered + weapon-bristled. Mandalorian protagonist /
 * Shepard / Joel / Geralt / Mal Reynolds / ODST aesthetic vs FE's sleek
 * Mass Effect Andromeda Pathfinder / Aeon Flux silhouette.
 *
 * See:
 *   - scripts/lib/archetypes.js          (MALE_EXPLORER slot definitions)
 *   - scripts/lib/archetype-templates.js (MALE_EXPLORER brief template)
 *   - scripts/lib/brief-composer.js      (resolution + assembly)
 *   - BOT_AXIS_REFACTOR_PLAN.md          (architecture decision record)
 */

module.exports = {
  archetype: 'MALE_EXPLORER',
  pools: {
    // Path-bespoke pools
    biome: 'ALIEN_PLANET_BIOME',
    action: 'CHARACTER_ACTION',
    explorer_archetype: 'MALE_EXPLORERS',
    // Character DNA pools (gender-locked male stack)
    race: 'SCI_FI_RACE',
    skin: 'EXPLORER_SKIN',
    eyes: 'EXPLORER_EYES',
    hair_color: 'EXPLORER_HAIR_COLOR',
    hairstyle: 'MALE_EXPLORER_HAIRSTYLES',
    outfit: 'RUGGED_MALE_EXPLORER_OUTFITS',
    accessory: 'MALE_EXPLORER_ACCESSORIES',
  },
};
