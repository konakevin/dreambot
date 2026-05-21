/**
 * Bot archetype template registry — DO NOT ADD TEMPLATES HERE.
 *
 * Per-bot templates now live in `scripts/bots/<bot>/archetype-templates.js`.
 * This file is a thin re-export wrapping the auto-discovering registry
 * (`./archetypeRegistry.js`) so existing importers (`brief-composer.js`,
 * etc.) keep working without changes — `require('./archetype-templates')`
 * still returns the merged templates object.
 *
 * To add a new template:
 *   1. Pick the bot it belongs to: `scripts/bots/<bot>/archetype-templates.js`
 *   2. Add an entry to that file's exported object
 *   3. Add the matching archetype to `scripts/bots/<bot>/archetypes.js`
 *
 * Refactor history: 2026-05-21 — templates split from this central file
 * to per-bot files to eliminate cross-bot contention. See ARCHETYPE_REFACTOR.md.
 */

const { templates } = require('./archetypeRegistry');

module.exports = templates;
