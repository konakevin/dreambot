const pools = require('../pools');
const blocks = require('../shared-blocks');

module.exports = ({ sharedDNA, vibeDirective, picker }) => {
  const useLandscape = Math.random() < 0.3;
  const scene = useLandscape
    ? picker.pickWithRecency(pools.MECH_TOY_LANDSCAPES, 'mech_toy_landscape')
    : picker.pickWithRecency(pools.MECH_TOY_SCENES, 'mech_toy_scene');
  const lighting = picker.pickWithRecency(pools.MECH_LIGHTING, 'mech_lighting');
  const scenario =
    sharedDNA.renderMode === 'world'
      ? picker.pickWithRecency(pools.TOY_SCENARIOS, 'toy_scenario')
      : null;
  // bespoke story_beat — verb-led mech combat events
  const storyBeat = picker.pickWithRecency(pools.MECH_STORY_BEATS, 'mech_story_beat');
  const camera = picker.pickWithRecency(pools.CAMERA_ANGLES, 'camera_angle');

  // Slot-pool DNA: roll 3-5 distinct mech archetypes per render to defeat
  // Sonnet's humanoid-mecha training-bias. Forces SPECIFIC mech classes.
  const castSize = 3 + Math.floor(Math.random() * 3);
  const cast = [];
  for (let i = 0; i < castSize; i++) {
    cast.push(picker.pickWithRecency(pools.MECH_ARCHETYPES, `mech_archetype_${i}`));
  }

  return `You are a mech-toy-commercial cinematographer writing MECH-TOY-RAMPAGE scenes for ToyBot. Articulated transforming-mech / Gundam-model-kit / Zoids-style robot-toys mid-battle on epic toy-photography sets. Chrome paneling, transformation seams, cockpit-glow, energy-weapons. Saturday-morning-mecha-anime-toy-line cinematic energy. Non-IP — archetype only (Transformers / Gundam / Zoids / Power-Rangers-megazord DNA, not named characters). Output wraps with style prefix + suffix.

${blocks.TOY_PHOTOGRAPHY_BLOCK}

${blocks.CINEMATIC_STORY_BLOCK}

${blocks.DRAMATIC_LIGHTING_MAKES_CHEAP_LOOK_EPIC_BLOCK}

${blocks.PATH_MEDIUM_LOCK_BLOCK}

━━━ MECH-TOY MEDIUM LOCK — MULTIPLE MECHS ━━━
The MECHS in this scene are articulated robot-toys — visible ball-joint articulation, chrome-plated paneling, transformation seams, cockpit-canopy glow, hand-painted weathering, snap-on weapon accessories. Real-physical-toys on a handcrafted set. NEVER IP-named, NEVER CGI, NEVER illustration. MULTIPLE distinct mechs (not a single hero) — each rendered as a real physical articulated robot-toy in its own zone.

━━━ CAMERA ━━━
${camera}

━━━ COMPOSITION LOCK — NON-NEGOTIABLE SPATIAL ANCHOR ━━━
WIDE DIORAMA FRAME — exactly ${castSize} distinct mech-toys visible simultaneously, spatially separated as ${castSize === 2 ? 'left-side and right-side' : castSize === 3 ? 'left, center, right (or foreground / midground / background)' : castSize === 4 ? 'left, center-left, center-right, right' : 'left, center-left, center, center-right, right'}. Each occupies its OWN silhouette zone — no overlap, no merging. NO single hero subject dominating the frame. ALL ${castSize} mechs visible in clear frame at the same time. (Camera/framing direction above is the spatial-perspective lens for this composition.)

━━━ THE MECHS — RENDER THESE EXACT ARCHETYPES (NON-NEGOTIABLE) ━━━
The mechs in this scene MUST be exactly these specific mech-toy archetypes — do NOT default to "generic humanoid mecha" repeats, render the EXACT class, weapon, and signature detail of each:
${cast.map((c, i) => `${i + 1}. ${c}`).join('\n')}

━━━ THE MECH-TOY SCENE ━━━
${scene}

━━━ STORY BEAT — the COMBAT MOMENT this render is showing ━━━
${storyBeat}

Render every named mech role as an articulated mech-toy in the cast above performing the verb-led action. ALL ${castSize} mechs visible mid-combat — no single hero dominates.

${blocks.STORY_BEAT_MANDATE_BLOCK}

${blocks.worldStagingSection({ renderMode: sharedDNA.renderMode, scenario, staging: sharedDNA.staging })}
━━━ CAMERA FRAMING — VARY THE ZOOM ━━━
${sharedDNA.camera}

${blocks.storyCastSection(sharedDNA.renderMode)}



━━━ LIGHTING + ATMOSPHERE ━━━
${lighting}

━━━ SCENE-WIDE COLOR PALETTE ━━━
${sharedDNA.scenePalette}

━━━ SECONDARY LIGHTING VIBE ━━━
${sharedDNA.colorPalette}

${blocks.BLOW_IT_UP_BLOCK}

━━━ MOOD CONTEXT ━━━
${vibeDirective.slice(0, 150)}

━━━ COMPOSITION ━━━
Mid-close articulated-mech-toy diorama frame. Mech mid-action — sword-clash, energy-cannon blast, transformation-mid-leap, kaiju-takedown, formation-flight, wreckage-stomp. Chrome reflections, cockpit-glow, sparks-flying, missile-trail haze. Practical commercial-toy lighting + low-angle hero composition. Mecha-anime-toy-line dramatic energy.

Output ONLY the raw 60-90 word scene description. Comma-separated phrases. NO preamble, NO titles, NO headers, NO ━━━ or ═══ or ### markers, NO **bold labels**, NO "render as" suffixes. Just the phrases, starting immediately with the scene content.`;
};
