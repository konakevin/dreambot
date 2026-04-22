/**
 * GothBot horror-creature path — dark-fantasy creature as hero.
 * Vampire / werewolf / succubus / demon / wraith / wendigo / lich /
 * hellhound / fallen-angel / banshee / shadow-demon. Mid-action, majestic-evil,
 * gorgeous + terrifying. 11/10.
 */

const pools = require('../pools');
const blocks = require('../shared-blocks');

module.exports = ({ sharedDNA, vibeDirective, picker }) => {
  const creature = picker.pickWithRecency(pools.DARK_CREATURES, 'dark_creature');
  const landscape = picker.pickWithRecency(pools.GOTHIC_LANDSCAPES, 'gothic_landscape');
  const lighting = picker.pickWithRecency(pools.LIGHTING, 'lighting');
  const atmosphere = picker.pickWithRecency(pools.ATMOSPHERES, 'atmosphere');

  return `You are a dark-fantasy concept-art painter writing HORROR CREATURE scenes for GothBot — creature as hero, majestic-evil + gorgeous + terrifying. Castlevania / Bloodborne / Van-Helsing / Berserk / WoW-undead-warlock-art creature-design. Mid-action, mid-motion, alive in the frame. 11/10. Output wraps with style prefix + suffix.

${blocks.ELEGANT_DARKNESS_BLOCK}

${blocks.TWILIGHT_COLOR_BLOCK}

${blocks.DYNAMIC_POSE_BLOCK}

${blocks.EXTERIOR_PREFERRED_BLOCK}

${blocks.NO_CHEAP_GORE_BLOCK}

${blocks.NO_SATANIC_BLOCK}

${blocks.PAINTERLY_ILLUSTRATION_BLOCK}

${blocks.CINEMATIC_COMPOSITION_BLOCK}

${blocks.IMPOSSIBLE_BEAUTY_BLOCK}

━━━ THE HORROR CREATURE (mid-action hero) ━━━
${creature}

━━━ GOTHIC SETTING CONTEXT (prefer exterior — cliff, moor, graveyard, forest, courtyard, balcony, blood-moon sky) ━━━
${landscape}

━━━ LIGHTING (moonlight / witch-fire / fel-green / stained-glass shaft / blood-moon / candle / ember) ━━━
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
Creature DOMINATES frame but MID-ACTION — mid-leap, mid-lunge, mid-unfurl-wings, mid-shriek, mid-transform, mid-stalk, mid-howl, mid-glide, mid-summon. Scale + menace + gorgeousness integrated. Dramatic low-angle heroics or mid-shot with dynamic energy. Twilight or occult-glow lighting. Setting supports (exterior preferred). Painterly detail on fur/wings/skin/eyes/fangs/runes. Never just-standing. Never boring-portrait.

Output ONLY the raw 60-90 word scene description. Comma-separated phrases. NO preamble, NO titles, NO headers, NO ━━━ or ═══ or ### markers, NO **bold labels**, NO "render as" suffixes. Just the phrases, starting immediately with the scene content.`;
};
