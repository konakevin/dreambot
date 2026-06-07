/**
 * ToyBot giant-toys — declarative composer form (2026-05-24, boss-battle redesign).
 *
 * ToyBot's ONE deliberately WEIRD path: a goofy TOY BOSS BATTLE. ONE GIANT
 * boss/enemy toy fights a band of SMALLER regular toys (fighting / chasing /
 * throwing / kicking) staged in a real-world setting (park / beach / city /
 * backyard / playground). Kaiju-vs-heroes energy, but the ENTIRE cast is TOYS
 * — NO humans. Scale rolls per render between KAIJU-EPIC (towering boss, little
 * toys swarm below) and GROUND-BRAWL (close scrappy scuffle). Goofy + slapstick
 * + photoreal — play it deadpan so the dumb toy battle is the joke.
 *
 * Axes: giant_toy (the boss, character-toy pool) + cast_toys (pickN:3 from the
 * SHARED 91-entry TOYBOX_TOY_BUCKET) + engagement (the combat action) +
 * real-world arena setting + environmental lighting + atmosphere + battle
 * camera + 40%-gated goofy combat bonus-gag. Bespoke photoreal medium
 * giant_toy_surreal + per-path no-humans suffix. Skips chaos / polish / sensory.
 */

module.exports = {
  archetype: 'TOYBOT_GIANT_TOYS',
  pools: {
    camera_angle: 'GIANT_TOY_CAMERA',
    giant_toy: 'GIANT_TOY_SUBJECT', // the giant boss/enemy toy
    cast_toys: 'TOYBOX_TOY_BUCKET', // SHARED 91-toy bucket — the smaller toys it fights (pickN 3)
    engagement: 'GIANT_TOY_ENGAGEMENT', // the boss-vs-cast combat action
    setting: 'GIANT_TOY_SETTING', // real-world battle arena
    // story_beat (2026-06-06) — legacy 6-slot baked DNA, 200 entries of
    // complete multi-medium narrative scenes. Lifts the boss-vs-cast
    // engagement out of generic combat into a specific micro-story.
    story_beat: 'TOYBOT_TOYBOX_STORYTELLING_SCENES',
    lighting: 'GIANT_TOY_LIGHT',
    atmosphere: 'GIANT_TOY_ATMOSPHERE',
    surreal_twist: 'GIANT_TOY_TWIST', // 40%-gated goofy combat gag
  },
};
