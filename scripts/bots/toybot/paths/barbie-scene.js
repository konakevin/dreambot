/**
 * ToyBot barbie-scene path — declarative axis-system (2026-05-19 rewrite).
 *
 * BARBIE-PLAYTIME MISCHIEF — every render is a single-frame kid-playroom
 * story moment featuring Mattel-style 11.5-inch fashion-dolls (Barbie /
 * Ken / sisters / Bratz-style) acting out absurd unexpected scenarios.
 * NOT a Barbie movie poster. NOT a fashion-shoot. A populated kid-
 * playtime story-beat captured mid-action with multilayered real-prop
 * set decoration.
 *
 * Axes:
 *   - Universal: camera_angle (path-bespoke wide narrative-action pool)
 *   - Path-bespoke:
 *       scene — 6-slot DNA seed (real surface + unexpected story setup;
 *               protagonist doll + absurd action; 3-5 supporting dolls
 *               mixing Barbie/Ken/sister/Bratz; multilayered real-prop
 *               set decoration; warm playroom light; overhead chaos)
 *
 * Locked medium: barbie_storytelling_mixed (short directive).
 * Path-bespoke prompt prefix replaces bot-wide "toy photography" with
 * "playroom-diorama film still" anchor.
 * Skips chaos / twoPassPolish / sensoryAnchors — the 6-slot seed is the
 * source of truth.
 */

module.exports = {
  archetype: 'TOYBOT_BARBIE_STORYTELLING',
  pools: {
    scene: 'TOYBOT_BARBIE_STORYTELLING_SCENES',
    camera_angle: 'TOYBOT_BARBIE_STORYTELLING_CAMERAS',
  },
};
