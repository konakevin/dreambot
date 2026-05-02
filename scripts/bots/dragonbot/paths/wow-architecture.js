const pools = require('../pools');
const blocks = require('../shared-blocks');

module.exports = ({ sharedDNA, vibeDirective, picker }) => {
  const architecture = picker.pickWithRecency(pools.WOW_ARCHITECTURE, 'wow_architecture');
  const lighting = picker.pickWithRecency(pools.LIGHTING, 'wow_arch_lighting');
  const atmosphere = picker.pickWithRecency(pools.ATMOSPHERES, 'wow_arch_atmosphere');

  return `You are a fantasy concept-art painter writing a WORLD-OF-WARCRAFT-CODED ARCHITECTURE scene for DragonBot — a cinematic faction/zone-coded interior in the Blizzard / Samwise-Didier / Glenn-Rane / Wei-Wang / Peter-Lee hand-painted-stylized tradition. Each interior reads as a distinct faction architectural language. NO CHARACTERS, NO PEOPLE, NO ORCS, NO ELVES, NO HEROES — pure architecture, pure aura, pure vibe. Output wraps with style prefix + suffix.

${blocks.EPIC_FANTASY_BLOCK}

${blocks.PAINTERLY_ILLUSTRATION_BLOCK}

━━━ NO CHARACTERS — NON-NEGOTIABLE ━━━
Pure architecture. NO orcs, NO elves, NO humans, NO trolls, NO foreground figures. Just the empty faction-coded space.

━━━ THE SCENE ━━━
${architecture}

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
NEVER write "Azeroth", "Stormwind", "Orgrimmar", "Ironforge", "Darnassus", "Silvermoon", "Pandaria", "Northrend", "Outland", "Argus", "Shadowlands", "Bastion", "Maldraxxus", "Ardenweald", "Revendreth", "Suramar", "Dalaran", "Acherus", "Naxxramas", "Naga", "Horde", "Alliance" in the output.

━━━ COMPOSITION ━━━
Cinematic fantasy architectural composition. STRONG faction signature (white-stone-and-gold human / red-iron orc / rune-stone dwarven / lavender-bark night-elf / gold-and-red blood-elf / blue-violet wizard / gothic-bone-green necropolis / jade-and-wood Pandaria / celestial-gold or fey-translucent shadowlands). Hand-painted-stylized mood. Foreground architectural detail, midground form, background space receding into atmospheric haze.

DRAMATIC VISUALS: render the EXACT architecture above.

Output ONLY the raw 60-90 word scene description. Comma-separated phrases. NO preamble, NO titles, NO headers, NO ━━━ or ═══ or ### markers, NO **bold labels**, NO "render as" suffixes. Just the phrases, starting immediately with the scene content.`;
};
