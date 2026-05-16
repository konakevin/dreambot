/**
 * BloomBot closeup — declarative axis-system form (2026-05-16 migration).
 *
 * MACRO VIEW INTO a dense bloom wall in its NATURAL OUTDOOR ENVIRONMENT.
 * Anti-bouquet / anti-still-life baked into the template (legacy failure
 * mode was Sonnet drifting to "studio bouquet on a dark background").
 *
 * Legacy compositional version preserved at paths/legacy/closeup.js.
 *
 * Axes (2 path-bespoke + 60%-gated phenomenon, palette/lighting/roster
 * via sharedDNA):
 *   - bloom_wall_type (200): the kind of macro bloom-mass (vine wall /
 *     hedgerow / cliff cascade / pergola underside / etc.)
 *   - growing_context (150): the natural environment behind the
 *     shallow-DOF blur (cottage garden / wild meadow / woodland edge)
 *   - macro_phenomenon (50, 60%-gated): the small foreground magic
 *     moment (dewdrop / pollinator / sun-flare / spider-web)
 */

module.exports = {
  archetype: 'BLOOMBOT_CLOSEUP',
  pools: {
    bloom_wall_type: 'BLOOMBOT_CLOSEUP_BLOOM_WALL_TYPE',
    growing_context: 'BLOOMBOT_CLOSEUP_GROWING_CONTEXT',
    macro_phenomenon: 'BLOOMBOT_CLOSEUP_MACRO_PHENOMENON',
  },
};
