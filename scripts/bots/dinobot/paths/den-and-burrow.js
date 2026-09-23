/**
 * DinoBot den-and-burrow — INSIDE the burrow (2026-09-22, SHADOW).
 *
 * THE DELIGHT ANGLE (Kevin's motto: show people the unseen, or redress the familiar as something
 * more interesting). Dinosaurs are maximally familiar. The inside of a dinosaur's BURROW is
 * something essentially nobody has been shown — so the hero here is the underground itself: a
 * dished nest hollow under a woven ceiling of live roots, a cutaway of chambers at two or three
 * depths, the entrance tunnel seen from inside as a blazing disc of daylight, a chamber cut into a
 * riverbank with light bouncing off the water onto the roof.
 *
 * Axes:
 *   den_chamber  the space, its materials, and its ONE light source (the hero)
 *   den_life     who is home and what they are doing — the warmth. Tender or funny over solemn:
 *                a heap of hatchlings with one upside down, a parent squeezing through a tunnel
 *                plainly too small for it, a juvenile folded into a chamber it has outgrown.
 *   den_surface  the world through the opening, written as ONE continuous shot
 *
 * The second template rule is the load-bearing one and it exists because of a documented trap: an
 * interior plus "something visible through an opening" described as two zones renders as a
 * hard-divided comic panel. So it is stated positively as one camera seeing one continuous space
 * with a bright window in it, never as a ban on panels.
 *
 * The phenomenon gate is 0.5 rather than the bot's usual 0.8 — underground, most weather simply
 * does not reach, and forcing it in would fight the premise.
 */

module.exports = {
  archetype: 'DINOBOT_DEN_AND_BURROW',
  pools: {
    den_chamber: 'DINOBOT_DEN_CHAMBER',
    den_life: 'DINOBOT_DEN_LIFE',
    den_surface: 'DINOBOT_DEN_SURFACE',
    phenomenon: 'DINOBOT_PALEO_LANDSCAPE_PHENOMENON',
  },
};
