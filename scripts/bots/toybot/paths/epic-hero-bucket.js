const pools = require('../pools');
const blocks = require('../shared-blocks');

module.exports = ({ sharedDNA, vibeDirective, picker }) => {
  const useLandscape = Math.random() < 0.3;
  const scene = useLandscape
    ? picker.pickWithRecency(pools.EPIC_HERO_BUCKET_LANDSCAPES, 'epic_hero_bucket_landscape')
    : picker.pickWithRecency(pools.EPIC_HERO_BUCKET_SCENES, 'epic_hero_bucket_scene');
  const lighting = picker.pickWithRecency(pools.LIGHTING, 'lighting');
  const scenario =
    sharedDNA.renderMode === 'world'
      ? picker.pickWithRecency(pools.TOY_SCENARIOS, 'toy_scenario')
      : null;
  // story_beat (2026-06-06) — legacy toybox_storytelling.json, 200 entries of
  // complete multi-medium narrative scenes. Fires every render regardless of
  // renderMode so the epic-hero ensemble always has a SPECIFIC event to play.
  const storyBeat = picker.pickWithRecency(
    pools.TOYBOT_TOYBOX_STORYTELLING_SCENES,
    'toybox_story_beat'
  );
  const atmosphere = picker.pickWithRecency(pools.ATMOSPHERES, 'atmosphere');

  return `You are an 80s-toy-commercial cinematographer writing VINTAGE "EPIC" ACTION-FIGURE scenes for ToyBot — a rolled-up bucket covering (a) muscular sword-and-sorcery barbarian/sorceress heroes, (b) space-adventurer archetypes (hooded laser-sword monks / dark-helmet villains / scruffy smugglers / plastic droids / bounty-hunters), and (c) cape-and-cowl superhero figures (caped champions / dark vigilantes / powered-armor heroes / cosmic-gauntlet villains). All non-IP — archetype only, never named characters. Handcrafted playset dioramas, dramatic toy-photography lighting. Output wraps with style prefix + suffix.

${blocks.TOY_PHOTOGRAPHY_BLOCK}

${blocks.CINEMATIC_STORY_BLOCK}

${blocks.DRAMATIC_LIGHTING_MAKES_CHEAP_LOOK_EPIC_BLOCK}

${blocks.PATH_MEDIUM_LOCK_BLOCK}

━━━ ACTION-HERO-FIGURES MEDIUM LOCK ━━━
EVERY character is a vintage 80s/90s hand-painted articulated action-figure — 5-to-7-inch hyper-muscled sword-and-sorcery hero (barbarian-hero / sorceress / skeletal-villain / muscle-champion / beast-warrior with primitive armor and signature weapons), OR 3.75-inch space-adventurer (hooded laser-sword monk / dark-helmet villain / scruffy smuggler / plastic droid / rebel-pilot / bounty-hunter / fur-covered alien-sidekick), OR cape-and-cowl superhero-archetype (caped champion with geometric chest-emblem / dark hooded vigilante / winged hero / cosmic hero with glowing ring / powered-armor hero with chest-reactor / amazon warrior / horned super-villain). Fully-dressed playset diorama with signature props (magic-sword / staff / laser-sword / blaster / grappling-gun / shield / scepter). Bright primary-color plastic aesthetic. NEVER IP-named, NEVER real-person, NEVER CGI.

━━━ THE ACTION-HERO SCENE ━━━
${scene}

━━━ THE STORY BEAT — the SPECIFIC narrative event ━━━
${storyBeat}

The scene above is the SETTING; the story beat here is the SPECIFIC EVENT playing out. Lift the action verbs, the chaos detail, the implied before/after, the props being reacted to — recast the named characters as ACTION-HERO FIGURES from the medium lock above (vintage barbarian-hero, space-adventurer, caped superhero). The hero ensemble performs THIS event in the action-hero diorama.

${blocks.STORY_BEAT_MANDATE_BLOCK}

${blocks.worldStagingSection({ renderMode: sharedDNA.renderMode, scenario, staging: sharedDNA.staging })}
━━━ CAMERA FRAMING — VARY THE ZOOM ━━━
${sharedDNA.camera}

${blocks.storyCastSection(sharedDNA.renderMode)}



━━━ LIGHTING ━━━
${lighting}

━━━ ATMOSPHERIC DETAIL ━━━
${atmosphere}

━━━ SCENE-WIDE COLOR PALETTE ━━━
${sharedDNA.scenePalette}

━━━ SECONDARY LIGHTING VIBE ━━━
${sharedDNA.colorPalette}

${blocks.BLOW_IT_UP_BLOCK}

━━━ COMPOSITION ━━━
Mid-close action-figure-diorama frame. Vintage 80s/90s-style articulated figure(s) mid-action in fully-dressed playset. Dramatic practical toy-photography lighting, backlit rim-light, fog-haze, laser-glow or magic-crystal glow. Cinematic Saturday-morning-epic energy.

━━━ MOOD CONTEXT ━━━
${vibeDirective.slice(0, 250)}

Output ONLY the raw 60-90 word scene description. Comma-separated phrases. NO preamble, NO titles, NO headers, NO ━━━ or ═══ or ### markers, NO **bold labels**, NO "render as" suffixes. Just the phrases, starting immediately with the scene content.`;
};
