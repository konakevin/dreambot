/**
 * AlphaBot QA note (2026-09-09, round 1 fix): a 5-render batch found 2/5
 * renders with an UNINVITED character — a small background farmer figure in
 * one, and a full front-and-center chibi girl + companion creature (having
 * what read as a little tea moment) in another — even though this path NEVER
 * rolls a character and all 120 SCENES entries are pure still-life text with
 * zero character mentions (verified). Same root cause as the documented
 * FARMBOT_PATH_BUILD_STATE.md lesson on papaya-guava-orchard/barn-animal-
 * shelter-interior: without an explicit, front-loaded "NO human figure"
 * governing sentence, Sonnet/Flux default toward inventing one anyway,
 * primed by FARMBOT_COZY_NEUTRAL's own "any character in the frame..."
 * language. Fixed the same proven way: a dedicated CAST block stated FIRST
 * (ahead of even the scene block, so it survives Sonnet's fixed maxTokens:400
 * brief-writing budget), explicit "NO human figure" declaration, an anti-
 * personification guard for the moths/fireflies/cats many SCENES entries
 * already name, and a closing reinforcement repeating the same instruction.
 */
const { lookOverride } = require('../shared-blocks');
const SCENES = require('../seeds/farmbot_evening_chores_scenes.json');

module.exports = ({ sharedDNA, picker }) => {
  const scene = picker.pickWithRecency(SCENES, 'farmbot_evening_chores_scene');
  return `${lookOverride(sharedDNA && sharedDNA.lookRegister)}━━━ THE CAST (essential — read first): NO human figure appears anywhere in this scene ━━━
This is a quiet still-life evening moment — tools put away, a gate latched,
a lantern just lit — and it is carried entirely by the objects, plants, and
small touches of life named below, never by a person. Any small creature
named below (a moth, a firefly, a cat, a bee) keeps its own true-to-life
shape, color, and texture — the scene's charm comes entirely from its warm
linework, light, and color, never from any added face or expression drawn
onto an object or plant.

━━━ THE EVENING MOMENT (the hero of the shot) ━━━
${scene}

Reinforcing once more: no human figure anywhere in the frame, small or
distant or otherwise — this is a quiet countryside still-life. render every
detail named above crisply, gallery quality`;
};
