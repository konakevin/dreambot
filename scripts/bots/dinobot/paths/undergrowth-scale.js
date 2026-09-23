/**
 * DinoBot undergrowth-scale — the forest floor at ankle height (2026-09-22, SHADOW).
 *
 * THE DELIGHT ANGLE (Kevin's motto: show the unseen, or redress the familiar as something more
 * interesting). Every one of DinoBot's other paths looks AT dinosaurs from human height or above.
 * This one lays the lens in the leaf litter, where fern stems are columns, a fallen leaf is a roof
 * and a rain puddle is a lake. Same animals, same world, a viewpoint nobody gets shown.
 *
 * Axes:
 *   undergrowth_floor      the floor written as a LANDSCAPE, with the ground underfoot named
 *   undergrowth_resident   the chicken-sized dinosaur who lives down here — characterful and
 *                          gorgeous, never a drab lizard, caught mid-motion close to the lens
 *   undergrowth_giant      the enormous dinosaur passing, deliberately ONLY EVER PARTIAL
 *
 * The giant axis is the one that makes the path work, and it is partial on purpose. From the floor
 * you never see a whole giant: you see four legs like pillars crossing the far ground, a shadow
 * sweeping the litter, a tail dragging fronds aside overhead, ripples crossing the puddle-lake as
 * something heavy passes. The PART is more thrilling than the whole, and every entry carries one
 * consequence at floor level so the scale actually reads.
 *
 * Both load-bearing constraints are the template's first two rules: the camera is ON THE GROUND,
 * and the giant is never whole. The path has no identity without either.
 *
 * Tone is AWE, not danger — the giant is indifferent and the resident unbothered. No hunting, no
 * threat, no fleeing. Phenomenon gate is 0.4 rather than the bot's usual 0.8 because down in the
 * litter most weather simply does not reach, and forcing it would fight the premise (same reasoning
 * as den-and-burrow's 0.5).
 */

module.exports = {
  archetype: 'DINOBOT_UNDERGROWTH_SCALE',
  pools: {
    undergrowth_floor: 'DINOBOT_UNDERGROWTH_FLOOR',
    undergrowth_resident: 'DINOBOT_UNDERGROWTH_RESIDENT',
    undergrowth_giant: 'DINOBOT_UNDERGROWTH_GIANT',
    phenomenon: 'DINOBOT_PALEO_LANDSCAPE_PHENOMENON',
  },
};
