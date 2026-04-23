const pools = require('../pools');
const blocks = require('../shared-blocks');

module.exports = ({ sharedDNA, vibeDirective, picker }) => {
  const useLandscape = Math.random() < 0.3;
  const scene = useLandscape
    ? picker.pickWithRecency(pools.BURTON_LANDSCAPES, 'burton_landscape')
    : picker.pickWithRecency(pools.BURTON_SCENES, 'burton_scene');
  const lighting = picker.pickWithRecency(pools.LIGHTING, 'lighting');
  const atmosphere = picker.pickWithRecency(pools.ATMOSPHERES, 'atmosphere');

  return `You are a Laika-Studios stop-motion cinematographer writing TIM BURTON / CORPSE BRIDE puppet-scenes for ToyBot. Gothic-whimsy miniature sets. Every character is a tall gaunt Laika-puppet, NOT a real person. Output wraps with style prefix + suffix.

${blocks.TOY_PHOTOGRAPHY_BLOCK}

${blocks.CINEMATIC_STORY_BLOCK}

${blocks.DRAMATIC_LIGHTING_MAKES_CHEAP_LOOK_EPIC_BLOCK}

${blocks.PATH_MEDIUM_LOCK_BLOCK}

━━━ BURTON-PUPPET MEDIUM LOCK ━━━
EVERY character is a stop-motion armature-supported PUPPET — tall gaunt elongated body, oversized head, huge teardrop eyes, porcelain or pale-blue sculpted skin, visible stitch-seams, wild silk hair or sculpted updo, Victorian-gothic wardrobe in real miniature fabric. Environment is a HANDCRAFTED miniature set — paper-moon, sculpted-foam rock, miniature-tree, practical-lighting rig visible in the world. Laika / Coraline / Corpse Bride / Frankenweenie / Nightmare-Before-Christmas craft DNA. NEVER render as real-human or CGI.

━━━ THE BURTON SCENE ━━━
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
Mid-close stop-motion frame. Laika-puppet mid-action in handcrafted miniature gothic set. Off-center cinematic composition. Practical-set lighting, paper-moon / candle / sputtering-lantern glow.

Output ONLY the raw 60-90 word scene description. Comma-separated phrases. NO preamble, NO titles, NO headers, NO ━━━ or ═══ or ### markers, NO **bold labels**, NO "render as" suffixes. Just the phrases, starting immediately with the scene content.`;
};
