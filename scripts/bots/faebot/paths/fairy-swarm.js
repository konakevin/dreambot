/**
 * FaeBot fairy-swarm — LARGE gatherings of palm-sized fairies (2026-07-04).
 * At least SIX fairies per render (more as the event dictates), gathered at
 * one tiny forest venue, mid-shared-story-event, critters attending.
 * Reuses tiny-fae lighting + magical_flavor pools (path-agnostic content).
 */

module.exports = {
  archetype: 'FAEBOT_FAIRY_SWARM',
  pools: {
    gathering_event: 'FAEBOT_FAIRY_SWARM_EVENT',
    fae_troupe: 'FAEBOT_FAIRY_SWARM_TROUPE',
    gathering_spot: 'FAEBOT_FAIRY_SWARM_SPOT',
    critter_guests: 'FAEBOT_FAIRY_SWARM_CRITTER_GUESTS',
    flora_detail: 'FAEBOT_FAIRY_SWARM_FLORA',
    lighting: 'FAEBOT_TINY_FAE_LIGHTING',
    magical_flavor: 'FAEBOT_TINY_FAE_MAGICAL_FLAVOR',
  },
};
