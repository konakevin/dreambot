/**
 * StarBot female-explorer path — declarative form.
 *
 * Migrated 2026-05-12 from hand-written brief to the shared archetype
 * composer using a BESPOKE per-gender template (FEMALE_EXPLORER, not
 * gender-neutral EXPLORER). Sibling archetype to MALE_EXPLORER.
 *
 * Pre-refactor file preserved at paths/legacy/female-explorer-bounty-hunter.js
 * (this is the version Kevin confirmed worked + had the bounty-hunter
 * mandate). paths/legacy/female-explorer.js is the older pre-bounty-hunter
 * version.
 *
 * Why bespoke (not DRY shared template)? 2026-05-12 lesson: gender-neutral
 * EXPLORER template regressed character renders. Flux uses gendered
 * pronouns + nouns (she/her/woman vs he/his/man) as primary gender-render
 * signals. Sibling per-gender templates preserve the working DNA. See
 * feedback_diversity_over_template_lockdown.md (related rule) +
 * BOT_SCENE_QUALITY_PLAYBOOK.md "Gender-locked character paths".
 *
 * Architecture: FEMALE_EXPLORER archetype — sci-fi female character is
 * the SHOW at MEDIUM scale (25-40% frame). Alien biome serves as her
 * stage. Full 7-axis female DNA stack (race / skin / eyes / hair color /
 * hairstyle / outfit / accessory) + biome + action + explorer_archetype.
 * Universal lighting + weather_particulate, bot sky_layer +
 * surprise_element resolved from StarBot defaultPools.
 *
 * See:
 *   - scripts/lib/archetypes.js          (FEMALE_EXPLORER slot definitions)
 *   - scripts/lib/archetype-templates.js (FEMALE_EXPLORER brief template)
 *   - scripts/lib/brief-composer.js      (resolution + assembly)
 *   - BOT_AXIS_REFACTOR_PLAN.md          (architecture decision record)
 */

module.exports = {
  archetype: 'FEMALE_EXPLORER',
  pools: {
    // Path-bespoke pools
    biome: 'ALIEN_PLANET_BIOME',
    action: 'CHARACTER_ACTION',
    explorer_archetype: 'FEMALE_EXPLORERS',
    // Character DNA pools (gender-locked female stack)
    race: 'SCI_FI_RACE',
    skin: 'EXPLORER_SKIN',
    eyes: 'EXPLORER_EYES',
    hair_color: 'EXPLORER_HAIR_COLOR',
    hairstyle: 'FEMALE_EXPLORER_HAIRSTYLES',
    outfit: 'SLEEK_FEMALE_EXPLORER_OUTFITS',
    accessory: 'FEMALE_EXPLORER_ACCESSORIES',
  },
};
