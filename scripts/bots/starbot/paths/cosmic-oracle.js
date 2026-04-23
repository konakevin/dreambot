/**
 * StarBot cosmic-oracle path — SCI-FI CHARACTER IN COSMIC SCENE.
 *
 * Diverse sci-fi characters (aliens, bounty hunters, explorers, smugglers,
 * scientists, mercenaries, diplomats) caught mid-action in wild cosmic
 * environments drawn from the full breadth of sci-fi cinema and literature.
 *
 * Axis pools:
 *   COSMIC_ORACLE_CHARACTERS — archetype + species + gear/wardrobe
 *   COSMIC_ORACLE_ACTIONS — body-shaping pose-first
 *   COSMIC_ORACLE_LOCATIONS — setting + cosmic-time + light + atmosphere
 */

const pools = require('../pools');

module.exports = ({ vibeDirective, picker }) => {
  const character = picker.pickWithRecency(pools.COSMIC_ORACLE_CHARACTERS, 'cosmic_oracle_character');
  const action = picker.pickWithRecency(pools.COSMIC_ORACLE_ACTIONS, 'cosmic_oracle_action');
  const location = picker.pickWithRecency(pools.COSMIC_ORACLE_LOCATIONS, 'cosmic_oracle_location');

  return `You are writing ONE scene description for a cinematic sci-fi oil painting. ONE solo character in a richly-detailed cosmic environment. 80-110 words, comma-separated phrases. Output ONLY the scene — no preamble, no headers, no bold.

THREE AXES — use these specific picks verbatim, do not invent:

CHARACTER: ${character}

ACTION: ${action}

LOCATION: ${location}

VIBE (subtle mood influence): ${vibeDirective.slice(0, 200)}

STRUCTURE (mandatory order):
1. LOCATION FIRST (opening 20-30 words) — the cosmic environment, lighting, atmosphere from the pool pick
2. CHARACTER ENTERS the scene — embedded within the environment, off-center at rule-of-thirds position
3. ACTION — what they're doing, body-shaping pose from the pool pick
4. Quality anchors — impasto brushwork, volumetric lighting, atmospheric depth, gallery-grade

RULES:
- The scene fills the frame. The character lives WITHIN it, off-center, NOT a centered portrait
- Face partially visible — 3/4 profile or side-lit. Helmets have visor up or transparent. Alien faces clearly shown
- ONE haunting detail — something subtly wrong (unnatural stillness / a light with no source / a door slightly open to void / starlight at the wrong angle)
- Write 2-3 specific gear items from the character description — concrete objects Flux can render
- NO "pose" / "posing" / "editorial" / "fashion" / "photo shoot"
- NO named IP characters
- NO modern Earth clothes
- NO gore / blood-spray
- SOLO — no second figure`;
};
