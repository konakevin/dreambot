/**
 * OceanBot archetype slot definitions.
 *
 * Auto-discovered by scripts/lib/archetypeRegistry.js.
 *
 * Pilot path only — shipwreck-kingdom. Other 9 paths' archetypes ship
 * after the pilot's render quality is approved.
 */

module.exports = {
  OCEANBOT_SHIPWRECK_KINGDOM: {
    description:
      'Sunken wreck reclaimed by reef life — the wreck IS the reef. Pre-1850 wooden vessel as the hero anchor, marine life as the living frame, caustic submarine light setting the mood. NatGeo wreck-discovery / Brian Skerry register on photography medium; Pre-Raphaelite painted maritime tradition on canvas.',
    slots: {
      universal: ['lighting', 'atmosphere'],
      bot: [],
      path: [
        'wreck_class',
        'decay_state',
        'coral_growth',
        'marine_life',
        'caustic_light',
        'water_clarity',
        'foreground_element',
        'scale_provers',
        'camera_framing',
        'surprise_element',
      ],
    },
    pickN: {},
    // 40% chance of an extra dramatic beat — passing shark / phosphorescent
    // bloom / storm above / etc. Keep gate moderate so most renders read
    // as quiet wreck-discovery, with drama as an occasional escalation.
    conditionalLayer: { slot: 'drama', gate: 0.4 },
    framingModes: null,
    anchorScaleRange: null,
  },
};
