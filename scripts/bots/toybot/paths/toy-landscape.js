/**
 * ToyBot toy-landscape path — declarative axis-system (R0 migration, 2026-05-17).
 *
 * Epic toy-medium landscape vista. NO characters by design — the landscape IS
 * the subject, the toy-medium IS the art. Rotates across claymation + vinyl
 * mediums via ToyBot mediumByPath['toy-landscape'] = ['claymation', 'vinyl'].
 *
 * Axes:
 *   - Universal (bot.defaultPools): camera_angle, scenario, staging
 *   - Path-bespoke: landscape (TOY_LANDSCAPES, 200 entries via existing
 *     scripts/gen-seeds/toybot/gen-toy-landscapes.js)
 *
 * Template inlines all mandate content (TOY_PHOTOGRAPHY, DRAMATIC_LIGHTING,
 * PATH_MEDIUM_LOCK, NO-CHARACTERS, BLOW_IT_UP, world-mode staging) — no
 * bot-local block imports. Self-contained per playbook commitment.
 */

module.exports = {
  archetype: 'TOYBOT_TOY_LANDSCAPE',
  pools: {
    landscape: 'TOYBOT_TOY_LANDSCAPES',
  },
};
