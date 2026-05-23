/**
 * StarBot space-femme path — declarative axis-system form.
 *
 * Born axis-native 2026-05-23 (new path; no legacy file).
 *
 * Architecture: STARBOT_SPACE_FEMME archetype — push-to-11 ornate
 * female-figure poster renders in the Frazetta / Whelan / Vallejo /
 * Bonestell / Syd-Mead Analog-SF magazine-cover tradition. ONE female
 * figure caught in a candid heroic poster moment, packed-with-detail
 * across every dimension (subject DNA / outfit / action / biome /
 * background drama / accessories / camera framing / optional cosmic
 * phenomenon).
 *
 * Inspired by Kevin's 15-heart female-explorer calibration set — same
 * painted-oil-cover-art lineage, but cranked maximalist. Bespoke from
 * R0 per the cross-bot rule (NOT cloned from FE pools).
 *
 * Slots (7 always-on + 1 conditional):
 *   - subject_dna        — ornate stacked-trait female figure
 *   - outfit             — 4-bucket spectrum (form-fit / rogue / ornate / mixed)
 *   - action_poster      — mid-verb cinematic poster pose
 *   - biome              — exotic perilous environment
 *   - background_drama   — always-on secondary deep-distance focal point
 *   - prop (pickN: 2)    — stacked ornate accessories
 *   - camera_poster      — poster-style framing override
 *   - phenomenon (70%)   — conditional cosmic event amplifier
 *
 * See:
 *   - scripts/lib/archetypes.js          (STARBOT_SPACE_FEMME slot definitions)
 *   - scripts/lib/archetype-templates.js (STARBOT_SPACE_FEMME brief template)
 *   - scripts/lib/brief-composer.js      (resolution + assembly)
 *   - BOT_AXIS_REFACTOR_PLAN.md          (architecture decision record)
 */

module.exports = {
  archetype: 'STARBOT_SPACE_FEMME',
  pools: {
    subject_dna: 'SPACE_FEMME_SUBJECT_DNA',
    outfit: 'SPACE_FEMME_OUTFIT',
    action_poster: 'SPACE_FEMME_ACTION_POSTER',
    biome: 'SPACE_FEMME_BIOME',
    background_drama: 'SPACE_FEMME_BACKGROUND_DRAMA',
    prop: 'SPACE_FEMME_PROP',
    camera_poster: 'SPACE_FEMME_CAMERA_POSTER',
    phenomenon: 'SPACE_FEMME_PHENOMENON',
  },
};
