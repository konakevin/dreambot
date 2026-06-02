/**
 * DragonBot cozy-arcane path — declarative form.
 *
 * Migrated 2026-05-31 from inline-function form to declarative axis system.
 * Pre-refactor file preserved at paths/legacy/cozy-arcane.js for 30 days
 * as a rollback reference.
 *
 * Architecture: COZY_ARCANE archetype — a single fantasy character at
 * home in their magical-cluttered sanctum, caught in a candid moment.
 * 9 path-bespoke pools at MVP-25 each + character DNA (race via shared
 * FANTASY_RACE) + inline gender roll in the template. clutter_focus
 * uses pickN:3 to preserve the inline form's "stack 6 categories" mandate
 * at a tighter axis-system count.
 *
 * Migration design preserves the intricate cozy-arcane character DNA
 * (race + age + archetype) + intimate-scale mandate (no cathedral
 * framing) + dense magical-clutter mandate (3 spotlighted items per
 * render + ambient density). Adds 4 new accent axes (hearth_warmth /
 * familiar / aesthetic_tradition / magical_signature) gated at 50%
 * for premium-tier richness.
 *
 * See:
 *   - scripts/bots/dragonbot/archetypes.js          (COZY_ARCANE slot definitions)
 *   - scripts/bots/dragonbot/archetype-templates.js (COZY_ARCANE brief template)
 *   - scripts/lib/brief-composer.js                 (resolution + assembly)
 *   - paths/legacy/cozy-arcane.js                   (pre-migration reference)
 */

module.exports = {
  archetype: 'COZY_ARCANE',
  pools: {
    // Always-on identity (sets WHO + WHERE + WHAT-NOW):
    inhabitant_archetype: 'COZY_ARCANE_INHABITANT_ARCHETYPE',
    inhabitant_age: 'COZY_ARCANE_INHABITANT_AGE',
    candid_moment: 'COZY_ARCANE_CANDID_MOMENT',
    setting: 'COZY_ARCANE_SETTINGS', // existing 200-entry fat seed (NO change)
    // Always-on multi-pick — pickN:3 picks 3 specific spotlighted clutter items
    clutter_focus: 'COZY_ARCANE_CLUTTER_FOCUS',
    // Gated 50% accent layers (premium-tier richness):
    hearth_warmth_source: 'COZY_ARCANE_HEARTH_WARMTH_SOURCE',
    signature_familiar: 'COZY_ARCANE_SIGNATURE_FAMILIAR',
    aesthetic_tradition: 'COZY_ARCANE_AESTHETIC_TRADITION',
    magical_signature: 'COZY_ARCANE_MAGICAL_SIGNATURE',
    // Character DNA — race via the cozy-arcane-specific COZY_ARCANE_RACE pool
    // (Kevin 2026-05-31). Replaces shared FANTASY_RACE because that pool's 28%
    // orc/tusks/grey-skin entries dominated visually due to Flux's training
    // bias + read off-genre for the cozy scholar/sanctum register. The bespoke
    // pool skews toward sanctum-appropriate races with minimal orc-coded entries.
    // Gender is rolled inline in the template body ('woman'/'man').
    race: 'COZY_ARCANE_RACE',
  },
};
