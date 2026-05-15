/**
 * SteamBot sexy-steampunk-woman — really-fucking-sexy steampunk woman.
 *
 * Slot-pool DNA pattern (mirrors GothBot's goth-full-body):
 *   ARCHETYPE × SKIN × EYES × MAKEUP × HAIR_COLOR × HAIRSTYLE × WARDROBE
 *   × ACCESSORY × MOMENT × LIGHTING × ATMOSPHERE × SCENE_PALETTE × VIBE_COLOR
 *
 * Each slot rotates with its own picker.pickWithRecency dedup ledger so
 * Sonnet can't cluster on samey looks. Combinatorial output is effectively
 * unlimited unique women across renders.
 */

const pools = require('../pools');
const blocks = require('../shared-blocks');

module.exports = ({ sharedDNA, vibeDirective, picker }) => {
  const archetype = picker.pickWithRecency(pools.STEAMPUNK_WOMEN_ARCHETYPES, 'spw_archetype');
  const skin = picker.pickWithRecency(pools.STEAMPUNK_WOMEN_SKIN, 'spw_skin');
  const eyes = picker.pickWithRecency(pools.STEAMPUNK_WOMEN_EYES, 'spw_eyes');
  const makeup = picker.pickWithRecency(pools.STEAMPUNK_WOMEN_MAKEUP, 'spw_makeup');
  const hairColor = picker.pickWithRecency(pools.STEAMPUNK_WOMEN_HAIR_COLOR, 'spw_hair_color');
  const hairstyle = picker.pickWithRecency(pools.STEAMPUNK_WOMEN_HAIRSTYLES, 'spw_hairstyle');
  const wardrobe = picker.pickWithRecency(pools.STEAMPUNK_WOMEN_WARDROBE, 'spw_wardrobe');
  const accessory = picker.pickWithRecency(pools.STEAMPUNK_WOMEN_ACCESSORIES, 'spw_accessory');
  const moment = picker.pickWithRecency(
    pools.STEAMPUNK_WOMEN_CANDID_MOMENTS,
    'steampunk_woman_moment'
  );
  const lighting = picker.pickWithRecency(pools.LIGHTING, 'lighting');
  const atmosphere = picker.pickWithRecency(pools.STEAMPUNK_ATMOSPHERES, 'atmosphere');

  return `You are a steampunk portrait painter writing SEXY STEAMPUNK WOMAN scenes for SteamBot. Really-fucking-sexy steampunk woman doing specific steampunk action. Solo. Candid voyeuristic framing. Output wraps with style prefix + suffix.

${blocks.STEAMPUNK_OBSESSIVE_DETAIL_BLOCK}

${blocks.VICTORIAN_INDUSTRIAL_BLOCK}

${blocks.NO_NAMED_CHARACTERS_BLOCK}

${blocks.SOLO_COMPOSITION_BLOCK}

${blocks.IMPOSSIBLE_BEAUTY_BLOCK}

${blocks.STEAMPUNK_WOMAN_CANDID_BLOCK}

━━━ SHE MUST LOOK LIKE A SPECIFIC PERSON — OBSESSIVE DETAIL ━━━
Render her with obsessive detail — she must feel like ONE specific woman, not a generic steampunk-woman-trope:
- FACE: every detail of her exact skin description rendered, cheekbones catching gaslight, expression-line specificity
- SKIN: render the EXACT skin description from the pool — how brass-light hits it, how shadow pools
- EYES: the EXACT color and intensity from the pool — they radiate, they catch firelight
- MAKEUP: the EXACT intentional steampunk-world makeup from the pool — kohl, soot, brass-dust, gold-leaf
- HAIR: the EXACT color AND hairstyle from the pools, rendered with sheen and texture
- WARDROBE: render the FULL outfit from the pool with obsessive material detail — every brass clasp, every leather strap, every layer
- ACCESSORY: the signature object from the pool — render it visible and identity-anchoring
- BODY LANGUAGE: capable confidence mid-action. She is DOING something and we caught her

━━━ WHO SHE IS (her core identity — let this inform her ENERGY) ━━━
${archetype}

━━━ HER SKIN ━━━
${skin}

━━━ HER EYES ━━━
${eyes}

━━━ HER MAKEUP ━━━
${makeup}

━━━ HER HAIR ━━━
${hairColor}, ${hairstyle}

━━━ HER WARDROBE (the wider frame shows this — render with detail) ━━━
${wardrobe}

━━━ SIGNATURE ACCESSORY (the small detail that anchors her identity) ━━━
${accessory}

━━━ THE CANDID MOMENT (she was caught doing THIS — mid-action, charged) ━━━
${moment}

━━━ LIGHTING (brass-glow / gaslight / forge preferred) ━━━
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
Mid-close candid voyeuristic frame (waist-up to thigh-up). She is DOING the specific steampunk action above. Solo — no men, no second figure. Brass / copper / gaslight dramatic lighting. She FILLS 60-75% of the vertical frame. NEVER full-body silhouette pulled-back.

She is NOT posing — she was caught mid-action in the candid moment above. Film-still-caught-mid-cut energy. The camera snapped at this exact loaded instant.

DRAMATIC VISUALS: go MAXIMUM. Render the EXACT slot-pool details above — DO NOT substitute generic descriptions. The eyes should match the eye pool entry. The skin should match the skin pool entry. The wardrobe should match the wardrobe pool entry. Every slot is locked.

━━━ HARD BANS ━━━
- NO "pose", "posing", "editorial", "fashion shoot", "trading card"
- NO second person in frame — she is ALONE
- NO full-body pulled-back silhouette — this is MID-SHOT
- NO substituting your own descriptions for the pool entries — render what's locked

━━━ STRUCTURE (write in this order) ━━━
[her face — the exact skin + eyes + makeup from above], [her hair — the exact color and style], [her wardrobe with material detail from the pool], [the signature accessory visible], [the candid moment — what she's doing mid-action], [partial steampunk environment at frame edges], [lighting on her body], [atmosphere + color palette]

Output ONLY the 60-90 word scene description, comma-separated phrases. NO preamble, NO titles, NO headers, NO ━━━ or ═══ or ### markers, NO **bold labels**, NO "render as" suffixes. Just the phrases, starting immediately with the scene content.`;
};
