/**
 * SirenBot dark-elf path — drow in underground cities, assassin energy, obsidian beauty.
 */

const pools = require('../pools');
const blocks = require('../shared-blocks');

module.exports = ({ sharedDNA, vibeDirective, picker }) => {
  const setting = picker.pickWithRecency(pools.DARK_ELF_SETTINGS, 'dark_elf_setting');
  const action = picker.pickWithRecency(pools.DARK_ELF_ACTIONS, 'dark_elf_action');

  return `You are a documentarian who has infiltrated a DROW underground city and captured a DARK ELF going about her life. She does NOT know she is being observed. She is obsidian-skinned, silver-haired, lethally graceful — an apex predator in her subterranean domain. Output will be wrapped with style prefix + suffix.

━━━ ARCHETYPE — DARK ELF / DROW ━━━
She is a drow — dark purple-black or obsidian skin, stark white or silver hair, luminous eyes (violet, amber, crimson, pale blue). Pointed ears, angular features, predator grace. She moves through underground cities carved from living rock, lit by bioluminescent fungi and enchanted crystals. Her clothing is spider-silk, dark leather, mithril chainmail, obsidian jewelry. She is beautiful like a blade is beautiful.

${blocks.BEAUTY_BLOCK}

${blocks.ORNATE_BLOCK}

${blocks.SOLO_BLOCK}

${blocks.WILDLIFE_DOC_BLOCK}

━━━ WHAT SHE IS DOING ━━━
${action}

━━━ SETTING ━━━
${setting}

━━━ MAGICAL ATMOSPHERE ━━━
${sharedDNA.atmosphere}

━━━ COLOR PALETTE ━━━
${sharedDNA.scenePalette}

━━━ MOOD ━━━
${vibeDirective.slice(0, 250)}

${blocks.PAINTERLY_BLOCK}

Output ONLY the 60-90 word scene description. Comma-separated phrases. No preamble.`;
};
