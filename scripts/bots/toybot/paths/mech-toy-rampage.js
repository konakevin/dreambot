const pools = require('../pools');
const blocks = require('../shared-blocks');

module.exports = ({ sharedDNA, vibeDirective, picker }) => {
  const useLandscape = Math.random() < 0.3;
  const scene = useLandscape
    ? picker.pickWithRecency(pools.MECH_TOY_LANDSCAPES, 'mech_toy_landscape')
    : picker.pickWithRecency(pools.MECH_TOY_SCENES, 'mech_toy_scene');
  const lighting = picker.pickWithRecency(pools.LIGHTING, 'lighting');
  const atmosphere = picker.pickWithRecency(pools.ATMOSPHERES, 'atmosphere');

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

━━━ MECH-TOY MEDIUM LOCK ━━━
EVERY mech is an articulated robot-toy / Gundam-style model-kit / transforming-mech-toy — visible ball-joint articulation at neck / shoulders / elbows / wrists / hips / knees / ankles, chrome-plated paneling and armor plates, visible transformation seams (line-cuts where panels would fold/flip), cockpit-canopy with glowing tinted plastic, hand-painted weathering / battle-damage / panel-line wash, snap-on weapon accessories (energy-sword / plasma-rifle / shield / shoulder-cannon / missile-pod), sometimes 1/144-scale (Gundam-kit) or 1/100-scale or larger collector size. Archetypes: humanoid mecha, transforming car-mecha, beast-form mecha (lion / tiger / wolf / dragon mech), powered-armor exosuits. NEVER IP-named (no Optimus Prime, no Megatron, no specific Gundam model designation). NEVER CGI, NEVER illustration. Real-physical-toy on a handcrafted set.

━━━ THE MECHS — RENDER THESE EXACT ARCHETYPES (NON-NEGOTIABLE) ━━━
The mechs in this scene MUST be exactly these specific mech-toy archetypes — do NOT default to "generic humanoid mecha" repeats, render the EXACT class, weapon, and signature detail of each:
${cast.map((c, i) => `${i + 1}. ${c}`).join('\n')}

━━━ THE MECH-TOY SCENE ━━━
${scene}

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
Mid-close articulated-mech-toy diorama frame. Mech mid-action — sword-clash, energy-cannon blast, transformation-mid-leap, kaiju-takedown, formation-flight, wreckage-stomp. Chrome reflections, cockpit-glow, sparks-flying, missile-trail haze. Practical commercial-toy lighting + low-angle hero composition. Mecha-anime-toy-line dramatic energy.

Output ONLY the raw 60-90 word scene description. Comma-separated phrases. NO preamble, NO titles, NO headers, NO ━━━ or ═══ or ### markers, NO **bold labels**, NO "render as" suffixes. Just the phrases, starting immediately with the scene content.`;
};
