/**
 * ToyBot toy-blockbuster — declarative composer form (2026-05-25).
 *
 * FLAGSHIP "epic toy-movie" path. Every render is a professional Hollywood
 * movie-poster shot of an EPIC action scene staged ENTIRELY in ONE rolled toy
 * universe — cohesive (all figures the same toy line), dramatically lit + shot,
 * set-decorated, with a VERY BIG statement centerpiece (a towering boss / kaiju
 * / colossal mech / massive idol) dominating the frame. Still obviously TOYS —
 * real physical toys photographed in a real-world-as-epic-stage. NO CGI.
 *
 * COHESION comes from the medium: mediumByPath rotates ONE toy line per render
 * (Funko vinyl / army-men / claymation / Sackboy / GI-Joe / action-figures /
 * mechs / plush / fashion-dolls / Shortcake / die-cast / minis / dollhouse /
 * Calico). The medium's style fragment makes every figure that one line.
 *
 * SCENARIOS ARE UNIVERSE-AGNOSTIC ON PURPOSE — any toy line can land in any
 * epic scene. Strawberry-Shortcake figures holding the line in a warzone, a
 * Calico-Critter mech siege — the mismatch is the comedy. Embrace it.
 *
 * Axes: scenario (epic action) + centerpiece (big-statement focal) + setting
 * (real-world-as-epic-stage + set dec) + cinematic camera + universal
 * lighting/atmosphere. Cast is template-driven (3-6 figures of the rolled
 * universe). Skips chaos / two-pass polish / sensory.
 */

module.exports = {
  archetype: 'TOYBOT_TOY_BLOCKBUSTER',
  pools: {
    camera_angle: 'BLOCKBUSTER_CAMERA',
    scenario: 'BLOCKBUSTER_SCENARIO',
    centerpiece: 'BLOCKBUSTER_CENTERPIECE',
    setting: 'BLOCKBUSTER_SETTING',
    lighting: 'LIGHTING',
    atmosphere: 'ATMOSPHERES',
  },
};
