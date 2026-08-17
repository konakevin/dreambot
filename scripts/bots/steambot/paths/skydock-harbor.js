/**
 * SteamBot skydock-harbor (Stage M4, SHADOW) — the airship PORT. Docked fleets at
 * brass gantry-towers, cargo cranes swinging crates, departure crowds on platforms,
 * lamplit fog. Ships at REST + human bustle (airship-skies is in-flight; THIS is the
 * PLACE). dock_activity = verb-led multi-actor; crowd_texture = living mass;
 * mooring_light = scene light. 40%-gated departure_event. Routes to steambot_neutral.
 */

module.exports = {
  archetype: 'STEAMBOT_SKYDOCK_HARBOR',
  pools: {
    harbor_vista: 'SKYDOCK_HARBOR_VISTA',
    dock_activity: 'SKYDOCK_HARBOR_DOCK_ACTIVITY',
    mooring_light: 'SKYDOCK_HARBOR_MOORING_LIGHT',
    crowd_texture: 'SKYDOCK_HARBOR_CROWD_TEXTURE',
    departure_event: 'SKYDOCK_HARBOR_DEPARTURE_EVENT',
  },
};
