/**
 * DragonBot female-warrior path — slot-pool DNA + fantasy race + ADVENTURING.
 *
 * NO battle scenes, NO combat, NO mid-strike, NO violence. These paths are
 * candid / adventuring / atmospheric — warriors caught hiking, traveling,
 * sitting in a tavern, scouting, breaking camp, or in a peaceful lineage-
 * signature moment.
 *
 * Each render rotates independent skin / eyes / hair_color / hairstyle / outfit /
 * accessory ledgers, locks a fantasy RACE (drow / tiefling / dragonborn / etc.)
 * that drives the visual identity, and rolls one of THREE peaceful action types:
 *   40% generic candid (warrior_actions — atmospheric quiet existing pool)
 *   40% adventuring (warrior_adventure_actions — hiking / town / tavern / camp)
 *   20% lineage (fantasy_lineage_actions — race-flavored peaceful moments)
 */

const pools = require('../pools');
const blocks = require('../shared-blocks');

module.exports = ({ sharedDNA, vibeDirective, picker }) => {
  const race = picker.pickWithRecency(pools.FANTASY_RACE, 'fw_race');
  const archetype = picker.pickWithRecency(pools.FEMALE_WARRIORS, 'female_warrior');
  const outfit = picker.pickWithRecency(pools.FEMALE_OUTFITS, 'female_outfit');
  const skin = picker.pickWithRecency(pools.WARRIOR_SKIN, 'fw_skin');
  const eyes = picker.pickWithRecency(pools.WARRIOR_EYES, 'fw_eyes');
  const hairColor = picker.pickWithRecency(pools.WARRIOR_HAIR_COLOR, 'fw_hair_color');
  const hairstyle = picker.pickWithRecency(pools.FEMALE_WARRIOR_HAIRSTYLES, 'fw_hairstyle');
  const accessory = picker.pickWithRecency(pools.FEMALE_WARRIOR_ACCESSORIES, 'fw_accessory');
  const landscape = picker.pickWithRecency(pools.FANTASY_LANDSCAPES, 'fantasy_landscape');
  const lighting = picker.pickWithRecency(pools.LIGHTING, 'lighting');
  const atmosphere = picker.pickWithRecency(pools.ATMOSPHERES, 'atmosphere');

  // 3-way action roll: 40% candid / 40% adventuring / 20% lineage
  // ALL peaceful — no battle, no combat, no violence
  const actionRoll = Math.random();
  let action, actionType;
  if (actionRoll < 0.4) {
    action = picker.pickWithRecency(pools.WARRIOR_ACTIONS, 'warrior_action');
    actionType = 'CANDID MOMENT (atmospheric quiet — render this exact peaceful frame)';
  } else if (actionRoll < 0.8) {
    action = picker.pickWithRecency(pools.WARRIOR_ADVENTURE_ACTIONS, 'fw_adventure_action');
    actionType = 'ADVENTURING MOMENT (hiking / traveling / town / tavern / camp — peaceful candid life)';
  } else {
    action = picker.pickWithRecency(pools.FANTASY_LINEAGE_ACTIONS, 'fw_lineage_action');
    actionType = 'LINEAGE-SIGNATURE MOMENT (race-flavored peaceful moment — let her ancestry SHINE)';
  }

  return `You are a fantasy concept-art painter writing PEACEFUL ADVENTURING scenes for DragonBot — a single heroic woman of a SPECIFIC fantasy lineage (drow, dragonborn, tiefling, blood elf, dwarf, etc.) caught in a CANDID peaceful moment of adventuring life: hiking, traveling, in a tavern, breaking camp, scouting, in a quiet lineage-flavored moment. Same universe as our dragons and vast landscapes. The character is ALIVE, CAPABLE, and the camera caught her between battles, never IN one. Output wraps with style prefix + suffix.

━━━ ABSOLUTE BANS — NO BATTLE / NO COMBAT / NO VIOLENCE ━━━
NO mid-strike, NO weapon-aimed-at-foe, NO enemy in frame, NO fallen body, NO wounded character, NO blood, NO fighting another being. NO "battle peak", NO charging-forward-with-weapon, NO standing-over-defeated-foe.

Weapons can be HOLSTERED, sheathed across the back, slung at the hip, or being maintained (sharpened, restrung, polished). Weapons are NEVER in active combat use. The mood is candid / quiet / contemplative / adventurous — never violent.

${blocks.EPIC_FANTASY_BLOCK}

${blocks.PAINTERLY_ILLUSTRATION_BLOCK}

${blocks.CINEMATIC_COMPOSITION_BLOCK}

${blocks.IMPOSSIBLE_BEAUTY_BLOCK}

━━━ SOLO CHARACTER ONLY ━━━
ONE character. No companions, no enemies, no crowds. This warrior ALONE in her moment.

━━━ HER LINEAGE / RACE (LOCKED — render her unmistakably as THIS lineage) ━━━
${race}

This race is NON-NEGOTIABLE. Render her with the EXACT anatomy, skin/scale tone, ears, eyes, distinguishing features above. If the race is drow, she has obsidian-grey skin and white-silver hair — NOT a default-fantasy-blonde human. If tiefling, she has horns and slit-pupil eyes. If dragonborn, scaled face and draconic snout. The lineage is the HERO of identity.

━━━ SHE MUST LOOK LIKE A SPECIFIC PERSON OF HER RACE — OBSESSIVE DETAIL ━━━
- FACE: render the EXACT race-anatomy first (ears, scales, horns, eye-shape), THEN layer the skin description from the pool
- SKIN: render the EXACT skin description from the pool, in the race's natural tone (drow obsidian, dragonborn scaled, etc.)
- EYES: the EXACT color and intensity from the pool, filtered through the race's eye-type (slit-pupil for dragonborn, glowing for blood elf, etc.)
- HAIR: the EXACT color AND hairstyle from the pools (or absent if the race doesn't have hair)
- OUTFIT: render the FULL armor / warrior dress from the pool with obsessive material detail
- ACCESSORY: the signature object from the pool — render it visible and identity-anchoring

━━━ HER WARRIOR ARCHETYPE (her role / energy — informs how she carries herself) ━━━
${archetype}

━━━ HER SKIN ━━━
${skin}

━━━ HER EYES ━━━
${eyes}

━━━ HER HAIR ━━━
${hairColor}, ${hairstyle}

━━━ HER OUTFIT (render with material detail) ━━━
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
The action above defines the body-position. Render it EXACTLY — if it's a battle peak, freeze her at that loaded instant. If it's lineage-flavored, let the race-iconography drive the moment.
CAMERA — three-quarter angle or side profile so we see her face and lineage clearly. NEVER from behind. NEVER walking head-on toward camera. Full-body or wide mid-shot. Foreground detail, midground character, background landscape.

DRAMATIC VISUALS: render the EXACT slot-pool details above — DO NOT substitute generic descriptions. Race comes FIRST visually. Every other slot is locked.

Output ONLY the raw 60-90 word scene description. Comma-separated phrases. NO preamble, NO titles, NO headers, NO ━━━ or ═══ or ### markers, NO **bold labels**, NO "render as" suffixes. Just the phrases, starting immediately with the scene content.`;
};
