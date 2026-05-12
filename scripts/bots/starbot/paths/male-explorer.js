/**
 * StarBot male-explorer path — character path applying the proven recipe
 * from female-explorer's 12-round QA loop (Kevin-approved at R12).
 *
 * Identical brief structure to female-explorer.js — only the pool refs
 * differ (MALE_EXPLORERS / EXPLORER_OUTFITS_MALE / MALE_EXPLORER_*).
 * Medium override to `canvas` set in index.js mediumByPath.
 */

const pools = require('../pools');
const blocks = require('../shared-blocks');

module.exports = ({ sharedDNA, vibeDirective, picker }) => {
  // ── Scene-stage axes ──
  const biome = picker.pickWithRecency(pools.ALIEN_PLANET_BIOME, 'alien_planet_biome');
  const skyLayer = picker.pickWithRecency(pools.ALIEN_SKY_LAYER, 'alien_sky_layer');
  const lighting = picker.pickWithRecency(pools.LIGHTING, 'lighting');
  const weatherParticulate = picker.pickWithRecency(pools.WEATHER_PARTICULATE, 'weather_particulate');
  const action = picker.pickWithRecency(pools.CHARACTER_ACTION, 'character_action');
  const surpriseElement = picker.pickWithRecency(pools.SURPRISE_ELEMENT, 'surprise_element');

  // ── Character DNA (compact one-line bio — race + hair + outfit + accessory) ──
  const race = picker.pickWithRecency(pools.SCI_FI_RACE, 'me_race');
  const archetype = picker.pickWithRecency(pools.MALE_EXPLORERS, 'male_explorer');
  const outfit = picker.pickWithRecency(pools.EXPLORER_OUTFITS_MALE, 'me_outfit');
  const hairColor = picker.pickWithRecency(pools.EXPLORER_HAIR_COLOR, 'me_hair_color');
  const accessory = picker.pickWithRecency(pools.MALE_EXPLORER_ACCESSORIES, 'me_accessory');

  return `You are a sci-fi concept-art painter writing a CHARACTER MOMENT for StarBot — a single heroic man of a SPECIFIC sci-fi lineage caught in a candid grounded moment of alien-wilderness adventuring. The character is ALIVE, CAPABLE, and the camera caught him doing real work in a real place. Output wraps with style prefix + suffix.

━━━ HE IS THE SHOW — NON-NEGOTIABLE ━━━
The male explorer is the MAIN SUBJECT of this render. His face, gear, outfit, lineage, action, and pose are the DRAW — the viewer is here for HIM. Every detail of his outfit and equipment readable and CRISP. He is the hero of the frame; the alien world is his stage.

He occupies 25-40% of the frame vertically — FULL BODY head-to-toe visible, head no larger than 10% of frame height. NOT tiny silhouette. NOT centered portrait. MEDIUM scale where outfit, gear, and lineage are CLEARLY READABLE.

━━━ SOLO CHARACTER ONLY ━━━
EXACTLY ONE character. No companions, no enemies, no crowds. This explorer ALONE in his moment.

━━━ ENGAGED IN THE SCENE — NON-NEGOTIABLE ━━━
He is DOING SOMETHING SPECIFIC in this frame. The action below is the PRIMARY SUBJECT of the prompt — he is mid-act, captured at a loaded instant. Combat / battling / hunting / spying / tinkering / scheming / reconnaissance / artifact-discovery / infiltration / extraction — these are ALL fair game. Weapons MAY be in active use during battling-coded actions.

━━━ THE ACTION — what he is doing in this exact frame ━━━
${action}

GROUNDED — feet on the ground or interacting with terrain. No floating mid-air leaps. Body weight visible, captured at a loaded instant.

━━━ HIS LINEAGE / SCI-FI RACE (LOCKED) ━━━
${race}

This race is NON-NEGOTIABLE. Render him with the EXACT anatomy, distinguishing features, skin tone, ridges/horns/lekku/montrals/antennae above. The lineage is the HERO of his identity.

━━━ HIS COMPACT BIO (one-line block — DO NOT expand into separate sections) ━━━
A ${race.split(':')[0]} man with ${hairColor.split(',')[0]} hair, wearing ${outfit}, carrying ${accessory}.

(skin tone, eye color, and hairstyle are minor details — only visible at the face if a helmet is up. He is sealed in armor or appropriate biome gear.)

ABSOLUTE FRANCHISE LOOKALIKE BAN: NO Stormtrooper plastic armor. NO Mandalorian T-visor full-body. NO Halo Spartan helmet. NO Mass Effect N7. NO Imperial officer. NO Fremen stillsuit. NO Jedi or Sith robes.

Render the outfit EXACTLY as described — sealed armor plates, equipment-laden.

━━━ BIOME-APPROPRIATE OUTFIT — HARD RULE ━━━
The outfit MUST match the biome's hazards. If the rolled outfit conflicts with the biome, OVERRIDE the outfit:
- AIRLESS / VACUUM / TOXIC / METHANE biome → sealed EVA pressure suit with helmet
- HOSTILE COLD / GLACIAL / ICE biome → heavy insulated parka, hood, gloves
- HOT DESERT / DUNE / VOLCANIC biome → moisture-recycler suit, face wrap
- Temperate / habitable biome → standard tactical-explorer gear

━━━ HIS ARCHETYPE (his energy / role) ━━━
${archetype}

━━━ SURPRISE ELEMENT — a secondary subject in the scene that adds story ━━━
${surpriseElement}

Place at midground or deep midground, NOT in front of him.

━━━ THE ALIEN BIOME (his stage) ━━━
${biome}

━━━ SKY OVERHEAD ━━━
${skyLayer}

━━━ LIGHTING ━━━
${lighting}

━━━ WEATHER / PARTICULATE ━━━
${weatherParticulate}

━━━ SCENE-WIDE COLOR PALETTE ━━━
${sharedDNA.scenePalette}

━━━ SECONDARY LIGHTING VIBE ━━━
${sharedDNA.colorPalette}

━━━ MOOD CONTEXT ━━━
${vibeDirective.slice(0, 250)}

━━━ COMPOSITION ━━━
Three-quarter angle or side profile so we see his face and lineage clearly. NEVER walking head-on toward camera. NEVER posing. Full-body or wide mid-shot. FOREGROUND: tactile detail near his feet. MIDGROUND: HIM, full body, mid-action, 25-40% of frame. BACKGROUND: the alien biome receding into atmospheric haze.

━━━ STRUCTURE (write the prompt in this exact order) ━━━
[OPENING — a wide cinematic action shot of a [race-coded man] [DOING THE EXACT CINEMATIC ACTION] in an alien wilderness — the action verb leads the prompt], [he wears [outfit] with full material detail], [his race anatomy + key DNA from the bio block], [his signature accessory visible], [the alien biome wrapping around him — depth and atmospheric layers], [sky overhead], [lighting and weather particles], [surprise element at midground], [color palette and mood]

CRITICAL — the OPENING tokens of the prompt are "[character] [DOING ACTION]" — the action verb leads. The character DNA flows after. The world establishes the stage. He fills 25-40% of frame, FULL-BODY, captured at the loaded instant of his action.

DRAMATIC VISUALS: render the EXACT slot-pool details above. Race comes FIRST visually. Every other slot is locked. His outfit + accessory + action all readable at full-body scale.

Output ONLY the raw 80-120 word scene description. Comma-separated phrases. NO preamble, NO titles, NO headers, NO ━━━ or ═══ or ### markers, NO **bold labels**, NO "render as" suffixes. Just the scene content.`;
};
