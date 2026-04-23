const pools = require('../pools');
const blocks = require('../shared-blocks');

module.exports = ({ sharedDNA, vibeDirective, picker }) => {
  const scene = picker.pickWithRecency(pools.GI_JOE_SCENES, 'gi_joe_scene');
  const lighting = picker.pickWithRecency(pools.LIGHTING, 'lighting');
  const atmosphere = picker.pickWithRecency(pools.ATMOSPHERES, 'atmosphere');

  return `You are a GI-Joe-era toy-commercial cinematographer writing articulated-commando action-figure scenes for ToyBot. 3.75-inch hand-painted code-name commandos vs masked terror-organization troopers on handcrafted playset dioramas. Saturday-morning-cartoon-serial military-toy storytelling. Non-IP — archetype only. Output wraps with style prefix + suffix.

${blocks.TOY_PHOTOGRAPHY_BLOCK}

${blocks.CINEMATIC_STORY_BLOCK}

${blocks.DRAMATIC_LIGHTING_MAKES_CHEAP_LOOK_EPIC_BLOCK}

${blocks.PATH_MEDIUM_LOCK_BLOCK}

━━━ GI-JOE-FIGURES MEDIUM LOCK ━━━
EVERY figure is a 3.75-inch articulated action-figure with swivel-waist / ball-joint arms / rubber-band-waist construction. Hand-painted multicolor commando wardrobe (camo fatigues / berets / goggles / bandannas / chest-rig / dogtags). Code-name commando archetypes (masked-operative / mohawk-soldier / ninja-operative / gruff-sergeant / demolitions-expert / pilot-ace / jungle-specialist / arctic-specialist / tank-commander). Opponents are masked terror-organization faceless-troopers (silver-visor helmets, armored jumpsuits) and commanders (chrome-faceplate / hooded-cloak / snake-motif / serpent-eye mask). Playset diorama with iconic plastic military vehicles (tank / jeep / assault-chopper / hoverbike / attack-cruiser). NEVER classic single-pose army-men, NEVER real soldier, NEVER CGI.

━━━ THE GI-JOE SCENE ━━━
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

━━━ COMPOSITION ━━━
Mid-close articulated-action-figure-diorama frame. Code-name commando(s) mid-action against terror-organization figures in a fully-dressed playset. Practical commercial-toy lighting, cotton-ball smoke / flash-bulb explosion-burst / dramatic spotlight. 80s cartoon-serial cinematic energy.

━━━ MOOD CONTEXT ━━━
${vibeDirective.slice(0, 250)}

Output ONLY the raw 60-90 word scene description. Comma-separated phrases. NO preamble, NO titles, NO headers, NO ━━━ or ═══ or ### markers, NO **bold labels**, NO "render as" suffixes. Just the phrases, starting immediately with the scene content.`;
};
