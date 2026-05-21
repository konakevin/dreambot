/**
 * Bot archetype registry — DO NOT ADD ARCHETYPES HERE.
 *
 * Per-bot archetypes now live in `scripts/bots/<bot>/archetypes.js`.
 * This file is a thin re-export wrapping the auto-discovering registry
 * (`./archetypeRegistry.js`) so existing importers (`brief-composer.js`,
 * etc.) keep working without changes — `require('./archetypes')` still
 * returns `{ ARCHETYPES }`.
 *
 * To add a new archetype:
 *   1. Pick the bot it belongs to: `scripts/bots/<bot>/archetypes.js`
 *   2. Add an entry to that file's exported object
 *   3. Add the matching template fn to `scripts/bots/<bot>/archetype-templates.js`
 *   4. Reference from a path file via `{ archetype: 'YOUR_NAME', pools: {...} }`
 *
 * Refactor history: 2026-05-21 — archetypes split from this central file
 * to per-bot files to eliminate cross-bot contention. See ARCHETYPE_REFACTOR.md.
 */

const { archetypes: ARCHETYPES } = require('./archetypeRegistry');

module.exports = { ARCHETYPES };
