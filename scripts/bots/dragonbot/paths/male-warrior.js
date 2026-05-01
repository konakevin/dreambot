/**
 * DragonBot male-warrior path — slot-pool DNA + fantasy race upgrade.
 *
 * Each render rotates independent skin / eyes / hair_color / hairstyle / outfit /
 * accessory ledgers, locks a fantasy RACE (drow / tiefling / dragonborn / etc.)
 * that drives the visual identity, and rolls one of THREE action types:
 *   30% candid (warrior_actions — atmospheric / traveling)
 *   50% battle (warrior_battle_actions — peak combat freeze-frames)
 *   20% lineage (fantasy_lineage_actions — race-flavored signature moments)
 */

const pools = require('../pools');
const blocks = require('../shared-blocks');

module.exports = ({ sharedDNA, vibeDirective, picker }) => {
  const race = picker.pickWithRecency(pools.FANTASY_RACE, 'mw_race');
  const archetype = picker.pickWithRecency(pools.MALE_WARRIORS, 'male_warrior');
  const outfit = picker.pickWithRecency(pools.MALE_OUTFITS, 'male_outfit');
  const skin = picker.pickWithRecency(pools.WARRIOR_SKIN, 'mw_skin');
  const eyes = picker.pickWithRecency(pools.WARRIOR_EYES, 'mw_eyes');
  const hairColor = picker.pickWithRecency(pools.WARRIOR_HAIR_COLOR, 'mw_hair_color');
  const hairstyle = picker.pickWithRecency(pools.MALE_WARRIOR_HAIRSTYLES, 'mw_hairstyle');
  const accessory = picker.pickWithRecency(pools.MALE_WARRIOR_ACCESSORIES, 'mw_accessory');
  const landscape = picker.pickWithRecency(pools.FANTASY_LANDSCAPES, 'fantasy_landscape');
  const lighting = picker.pickWithRecency(pools.LIGHTING, 'lighting');
  const atmosphere = picker.pickWithRecency(pools.ATMOSPHERES, 'atmosphere');

  // 3-way action roll: 30% candid / 50% battle / 20% lineage
  const actionRoll = Math.random();
  let action, actionType;
  if (actionRoll < 0.3) {
    action = picker.pickWithRecency(pools.WARRIOR_ACTIONS, 'warrior_action');
    actionType = 'CANDID MOMENT (atmospheric, between battles)';
  } else if (actionRoll < 0.8) {
    action = picker.pickWithRecency(pools.WARRIOR_BATTLE_ACTIONS, 'mw_battle_action');
    actionType = 'BATTLE PEAK (mid-strike, parry, charge — render this exact freeze-frame)';
  } else {
    action = picker.pickWithRecency(pools.FANTASY_LINEAGE_ACTIONS, 'mw_lineage_action');
    actionType = 'LINEAGE-SIGNATURE MOMENT (race-flavored — let his ancestry SHINE in this moment)';
  }

  return `You are a fantasy concept-art painter writing EPIC FANTASY WARRIOR scenes for DragonBot — a single heroic man of a SPECIFIC fantasy lineage (drow, dragonborn, tiefling, blood elf, dwarf, orc, etc.) caught in a powerful moment. Same universe as our dragons and vast landscapes. The character is the HERO and his LINEAGE is unmistakable. Output wraps with style prefix + suffix.

${blocks.EPIC_FANTASY_BLOCK}

${blocks.PAINTERLY_ILLUSTRATION_BLOCK}

${blocks.CINEMATIC_COMPOSITION_BLOCK}

${blocks.IMPOSSIBLE_BEAUTY_BLOCK}

━━━ SOLO CHARACTER ONLY ━━━
ONE character. No companions, no enemies, no crowds. This warrior ALONE in his moment.

━━━ HIS LINEAGE / RACE (LOCKED — render him unmistakably as THIS lineage) ━━━
${race}

This race is NON-NEGOTIABLE. Render him with the EXACT anatomy, skin/scale tone, ears, eyes, distinguishing features above. If drow, obsidian-grey skin and white-silver hair. If tiefling, horns and slit-pupil eyes. If dragonborn, scaled face and draconic snout. If orc, green skin and tusks. The lineage is the HERO of identity.

━━━ HE MUST LOOK LIKE A SPECIFIC PERSON OF HIS RACE — OBSESSIVE DETAIL ━━━
He is MASCULINE — rugged, scarred, angular, powerful build, masculine features filtered through the race's anatomy.
- FACE: render the EXACT race-anatomy first (ears, scales, horns, tusks, eye-shape), THEN layer the skin description
- SKIN: render the EXACT skin description from the pool, in the race's natural tone
- EYES: the EXACT color from the pool, filtered through the race's eye-type
- HAIR: the EXACT color AND hairstyle (beard included where described, or absent if the race doesn't have hair)
- OUTFIT: render the FULL armor / warrior dress from the pool with obsessive material detail
- ACCESSORY: the signature object from the pool — render it visible and identity-anchoring

━━━ HIS WARRIOR ARCHETYPE (his role / energy) ━━━
${archetype}

━━━ HIS SKIN ━━━
${skin}

━━━ HIS EYES ━━━
${eyes}

━━━ HIS HAIR (and beard if described) ━━━
${hairColor}, ${hairstyle}

━━━ HIS OUTFIT (render with material detail) ━━━
${outfit}

━━━ SIGNATURE ACCESSORY ━━━
${accessory}

━━━ THE ACTION — ${actionType} ━━━
${action}

━━━ THE LANDSCAPE (as epic as the character) ━━━
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

━━━ COMPOSITION ━━━
GROUNDED — feet on the ground for non-flight moments. No floating, no impossible mid-air leaps unless the action explicitly calls for one (then render that specific moment).
The action above defines the body-position. Render it EXACTLY — if battle peak, freeze him at that loaded instant. If lineage-flavored, let the race-iconography drive the moment.
CAMERA — three-quarter angle or side profile so we see his face and lineage clearly. NEVER from behind. NEVER walking head-on toward camera. Full-body or wide mid-shot. Foreground detail, midground character, background landscape.

DRAMATIC VISUALS: render the EXACT slot-pool details above — DO NOT substitute generic descriptions. Race comes FIRST visually. Every other slot is locked.

Output ONLY the raw 60-90 word scene description. Comma-separated phrases. NO preamble, NO titles, NO headers, NO ━━━ or ═══ or ### markers, NO **bold labels**, NO "render as" suffixes. Just the phrases, starting immediately with the scene content.`;
};
