/**
 * ChibiBot creature-adventures path (2026-06-28).
 *
 * Clone of YumBot's food-adventures path, recast for ChibiBot: a band of chibi
 * CREATURE friends out DOING fun things in real-world "out in the wild" settings
 * (amusement park / water park / beach / camping / snow / fair / playground /
 * pool / cookout / arcade / movie-theater / aquarium / birthday). Scene-led: the
 * real-world LOCATION fills the frame, and the creatures + their friends are
 * NAMED in each scene (band-of-friends charm). The opposite of outdoor-adventure
 * (solo creature in pure wilderness, no architecture).
 *
 * Single bespoke axis — the scene is self-contained (creatures + friends +
 * activity + location + framing). Look/palette via sharedDNA.lookRegister.
 * chibibot_neutral medium (auto via CHIBI_LOOK_PATHS). Skip two-pass polish.
 */

module.exports = {
  archetype: 'CHIBIBOT_CREATURE_ADVENTURES',
  pools: {
    scene: 'CHIBIBOT_CREATURE_ADVENTURES_SCENES',
  },
};
