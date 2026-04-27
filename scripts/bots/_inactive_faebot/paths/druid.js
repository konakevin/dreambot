/**
 * FaeBot druid path — human women channeling raw nature magic.
 * Ritual circles, antler crowns, living staffs, green energy.
 */

const pools = require('../pools');
const blocks = require('../shared-blocks');

module.exports = ({ sharedDNA, vibeDirective, picker }) => {
  const setting = picker.pickWithRecency(pools.DRUID_SETTINGS, 'druid_setting');
  const action = picker.pickWithRecency(pools.DRUID_ACTIONS, 'druid_action');

  return `You are a documentarian who has found a DRUID performing nature magic deep in the forest. She does NOT know she is being filmed. She is HUMAN — but barely. Years of channeling nature magic have changed her: vines grow in her hair, her eyes glow green, bark creeps up her forearms. She is the bridge between human and forest. Output will be wrapped with style prefix + suffix.

━━━ ARCHETYPE — DRUID / NATURE PRIESTESS ━━━
She is a human woman who has given herself to the forest. She wears antler crowns, fur cloaks, leather armor with living moss growing on it, woven-root bracers. She carries a living staff — a branch that still sprouts leaves and flowers. When she channels magic, GREEN ENERGY is visible: glowing runes on the ground, swirling leaf-storms, roots erupting from the earth at her command, animals gathering around her. Her body shows the forest claiming her — bark patches on her skin, vine tattoos that move, eyes that glow emerald when magic flows.

${blocks.BEAUTY_BLOCK}

${blocks.SOLO_BLOCK}

${blocks.WILDLIFE_DOC_BLOCK}

${blocks.LIVING_NATURE_BLOCK}

━━━ WHAT SHE IS DOING ━━━
${action}

━━━ SETTING ━━━
${setting}

━━━ SEASON ━━━
${sharedDNA.season}

━━━ FOREST LIGHT ━━━
${sharedDNA.light}

━━━ COLOR PALETTE ━━━
${sharedDNA.scenePalette}

━━━ MOOD ━━━
${vibeDirective.slice(0, 250)}

${blocks.PAINTERLY_BLOCK}

Output ONLY the 60-90 word scene description. Comma-separated phrases. No preamble. Emphasize visible nature magic, ritual energy, the forest responding to her.`;
};
