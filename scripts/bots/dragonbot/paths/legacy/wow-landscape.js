const pools = require('../pools');
const blocks = require('../shared-blocks');

module.exports = ({ sharedDNA, vibeDirective, picker }) => {
  const landscape = picker.pickWithRecency(pools.WOW_LANDSCAPES, 'wow_landscape');
  const lighting = picker.pickWithRecency(pools.LIGHTING, 'wow_landscape_lighting');
  const atmosphere = picker.pickWithRecency(pools.ATMOSPHERES, 'wow_landscape_atmosphere');

  return `You are a fantasy concept-art painter writing a WORLD-OF-WARCRAFT-CODED FANTASY VISTA for DragonBot — a vast cinematic alien-fantasy landscape in the Blizzard / Samwise-Didier / Glenn-Rane / Wei-Wang / Peter-Lee hand-painted-stylized tradition. NO CHARACTERS, NO PEOPLE, NO ORCS, NO HEROES, NO FOREGROUND BEASTS — pure landscape, pure aura, pure vibe. Output wraps with style prefix + suffix.

${blocks.EPIC_FANTASY_BLOCK}

${blocks.PAINTERLY_ILLUSTRATION_BLOCK}

━━━ NO CHARACTERS — NON-NEGOTIABLE ━━━
Pure landscape. NO orcs, NO elves, NO humans, NO trolls, NO foreground heroes, NO mounted figures. Distant beast/dragon silhouettes against horizon at scale OK only.

━━━ THE SCENE ━━━
${landscape}

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

━━━ NO FRANCHISE PROPER NOUNS ━━━
NEVER write "Azeroth", "Stormwind", "Orgrimmar", "Ironforge", "Darnassus", "Silvermoon", "Pandaria", "Northrend", "Outland", "Argus", "Shadowlands", "Bastion", "Maldraxxus", "Ardenweald", "Revendreth", "Suramar", "Dalaran", "Boralus", "Drustvar", "Zandalar", "Nazjatar", "Highmountain", "Horde", "Alliance", "Sylvanas", "Thrall", "Jaina", "Arthas" in the output.

━━━ COMPOSITION ━━━
Wide cinematic fantasy landscape. HAND-PAINTED-STYLIZED color and lighting — bold, oversaturated, theatrical. Skies are heightened. Distant architecture peeks through landscape. Foreground textural detail anchors the shot, midground form, background atmospheric scale.

DRAMATIC VISUALS: render the EXACT scene above. Do NOT add foreground figures.

Output ONLY the raw 60-90 word scene description. Comma-separated phrases. NO preamble, NO titles, NO headers, NO ━━━ or ═══ or ### markers, NO **bold labels**, NO "render as" suffixes. Just the phrases, starting immediately with the scene content.`;
};
