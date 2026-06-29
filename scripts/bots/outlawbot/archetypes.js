/**
 * OutlawBot — archetype slot definitions (scanned by lib/archetypeRegistry.js).
 * Each archetype names its slots (universal / bot / path), pickN stacks, and
 * optional probability-gated conditional layers. Templates live in
 * archetype-templates.js (matched by key). Names MUST be unique across all bots.
 */

module.exports = {
  // ── frontier-town ─────────────────────────────────────────────────────────
  // Scene-as-hero: a vivid Old-West town / main street. The TOWN is the hero;
  // false-front buildings, candid street life (people + horses as scale/story),
  // the land beyond, dust + sky. Native presence is folded in incidentally via
  // the street_life pool (riders passing through), never a caricature.
  OUTLAWBOT_FRONTIER_TOWN: {
    description:
      'PATH-BESPOKE — OutlawBot frontier-town path. Scene-as-hero western main-street / town. ' +
      'town = the kind of frontier town (big variety axis); structures = false-front buildings (pickN 3); ' +
      'street_life = the candid narrative beat (people/horses/wagons); surround = the land beyond; ' +
      'atmosphere = dust/weather/light-quality; sky = the big western sky; composition = framing (anti-monotony).',
    slots: {
      universal: [],
      bot: [],
      path: ['town', 'structures', 'street_life', 'surround', 'atmosphere', 'sky', 'composition'],
    },
    pickN: { structures: 3 },
    conditionalLayer: null,
    framingModes: null,
    anchorScaleRange: null,
  },

  // ── gunslinger-male / gunslinger-female ─────────────────────────────────────
  // Character-as-hero: a single Old-West gunslinger (the SOLO hero of the frame),
  // full-body, mid-moment, planted in a vivid western environment. Male + female
  // are SEPARATE paths/templates (gender-lock rule); they share the environment
  // pools (setting/atmosphere/composition) and use gendered FIGURE pools
  // (archetype/wardrobe/weapon/action). Real historical West — vaqueros, native
  // riders etc. rendered with authentic dignity, never caricature; sex appeal is
  // NEVER the point (capable + period-true, not fanservice).
  OUTLAWBOT_GUNSLINGER_MALE: {
    description:
      'PATH-BESPOKE — OutlawBot male gunslinger (solo character hero, full-body, mid-action in a western setting). ' +
      'FIGURE (gendered): archetype/wardrobe/weapon/action. ENVIRONMENT (shared): setting/atmosphere/composition.',
    slots: {
      universal: [],
      bot: [],
      path: ['archetype', 'hair', 'wardrobe', 'weapon', 'action', 'setting', 'atmosphere', 'composition'],
    },
    pickN: {},
    conditionalLayer: null,
    framingModes: null,
    anchorScaleRange: null,
  },

  OUTLAWBOT_GUNSLINGER_FEMALE: {
    description:
      'PATH-BESPOKE — OutlawBot female gunslinger (solo character hero, full-body, mid-action in a western setting). ' +
      'FIGURE (gendered): archetype(role/bearing) + look(heritage+age+skin+face+hair, LEADS) + wardrobe + weapon + action. ' +
      'ENVIRONMENT (shared): setting/atmosphere/composition. `look` is front-loaded to beat the same-face homogenization prior.',
    slots: {
      universal: [],
      bot: [],
      path: ['look', 'archetype', 'wardrobe', 'weapon', 'action', 'setting', 'atmosphere', 'composition'],
    },
    pickN: {},
    conditionalLayer: null,
    framingModes: null,
    anchorScaleRange: null,
  },
};
