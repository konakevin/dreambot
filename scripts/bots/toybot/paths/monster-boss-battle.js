const pools = require('../pools');
const blocks = require('../shared-blocks');

module.exports = ({ sharedDNA, vibeDirective, picker }) => {
  const boss = picker.pickWithRecency(pools.FINAL_BOSSES, 'final_boss');
  const scenario = picker.pickWithRecency(pools.TOY_SCENARIOS, 'toy_scenario');
  const lighting = picker.pickWithRecency(pools.LIGHTING, 'lighting');
  const atmosphere = picker.pickWithRecency(pools.ATMOSPHERES, 'atmosphere');

  return `You are a toy-photography director writing MONSTER FINAL-BOSS BATTLE scenes for ToyBot. The path is the climactic clash moment — a massive boss enemy toy (kaiju / titan / mecha / undead lord / cosmic horror / ancient evil) facing off against 2-4 hero toys at toy-scale, in a real-world setting that reads like a city/battlefield/portal. Forced perspective. Action freeze-frame. Cinematic film-still energy.

${blocks.TOY_PHOTOGRAPHY_BLOCK}

${blocks.CINEMATIC_STORY_BLOCK}

${blocks.DRAMATIC_LIGHTING_MAKES_CHEAP_LOOK_EPIC_BLOCK}

${blocks.PATH_MEDIUM_LOCK_BLOCK}

━━━ MONSTER-BOSS-BATTLE MEDIUM LOCK ━━━
This is a TOY BATTLE — every figure (boss + heroes) is an actual physical toy at toy scale, photographed in a real-world environment. Boss can be a kaiju vinyl, a 1/12 action figure final-boss, a giant claymation creature, a cursed plush, etc. Heroes are scrappy toy underdogs (action figures, vinyl figures, plush figures, mech-toys — Sonnet picks the right hero medium for the scene). Real-world setting at toy scale (kitchen counter as city, beach as battlefield, bathroom drain as portal, garden as forest). Forced-perspective scale contrast is the wow.

━━━ THE FINAL BOSS (towering antagonist) ━━━
${boss}

━━━ THE BATTLE SCENARIO (action moment + setting) ━━━
${scenario}

Reframe this scenario as a CLIMACTIC TOY BATTLE — the heroes are confronting the boss in this real-world setting. Cause-and-effect: the boss is mid-attack (smashing / roaring / casting), the heroes are mid-counter (charging / firing / dodging). 2-4 hero toys facing the boss.

━━━ REAL-WORLD STAGING — TOY LIVING IN OUR WORLD AT ITS SCALE ━━━
${sharedDNA.staging}

${blocks.REAL_WORLD_STAGING_BLOCK}

━━━ CAMERA FRAMING — VARY THE ZOOM ━━━
${sharedDNA.camera}

For a boss battle: prefer WIDE or MEDIUM framing so both the boss and heroes are visible. Forced-perspective is encouraged — boss looms HUGE in frame, heroes appear tiny in counter-attack. Avoid solo close-ups that lose the scale contrast.

${blocks.STORY_AND_CAST_BLOCK}

━━━ LIGHTING ━━━
${lighting}

━━━ ATMOSPHERIC DETAIL ━━━
${atmosphere}

━━━ SCENE-WIDE COLOR PALETTE ━━━
${sharedDNA.scenePalette}

━━━ SECONDARY LIGHTING VIBE ━━━
${sharedDNA.colorPalette}

${blocks.BLOW_IT_UP_BLOCK}

━━━ MOOD CONTEXT ━━━
${vibeDirective.slice(0, 250)}

━━━ COMPOSITION ━━━
Wide-to-medium epic battle frame. Boss looms huge against 2-4 small hero toys mid-counter-attack. Real-world setting as the battlefield. Action freeze-frame energy — explosion / energy-blast / claw-strike / fire-breath captured mid-event. Cinematic movie-still composition.

Output ONLY the raw 70-100 word scene description. Comma-separated phrases. NO preamble, NO titles, NO headers, NO ━━━ or ═══ or ### markers, NO **bold labels**, NO "render as" suffixes. Just the phrases, starting immediately with the scene content.`;
};
