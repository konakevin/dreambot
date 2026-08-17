/**
 * YumBot holiday-sweets path (Stage P2, SHADOW) — function-form.
 *
 * Kawaii holiday treats with cute faces (Christmas cookies / gingerbread /
 * Halloween candy / Easter treats / Valentine chocolates / etc.) in a festive
 * context. SCENE = the festive setting; SWEETS = 1-2 kawaii holiday treats.
 * Leads with sharedDNA.lookRegister; routes to yumbot_food_neutral.
 */

const pools = require('../pools');
const { YUMBOT_LOOK_OVERRIDE } = require('../shared-blocks');

module.exports = ({ sharedDNA, vibeDirective, picker }) => {
  const scene = picker.pickWithRecency(pools.YUMBOT_HOLIDAY_SWEETS_SCENES, 'holiday_sweets_scene');

  const sweets = [
    picker.pickWithRecency(pools.YUMBOT_HOLIDAY_SWEETS_TREATS, 'holiday_sweets_treat'),
  ];
  if (Math.random() < 0.5) {
    const second = picker.pickWithRecency(
      pools.YUMBOT_HOLIDAY_SWEETS_TREATS,
      'holiday_sweets_treat'
    );
    if (second !== sweets[0]) sweets.push(second);
  }

  return `${YUMBOT_LOOK_OVERRIDE(sharedDNA)}You are writing a KAWAII HOLIDAY-SWEETS render for YumBot — adorable festive treats with cute smiling faces baked in, the sweetest little holiday-treat-characters. Visual treatment is set by the LOOK REGISTER above.

━━━ THE SCENE ━━━
${scene}

━━━ THE KAWAII SWEET(S) — the stars, each with its cute face (appear by name) ━━━
${sweets.map((s, i) => `${i + 1}. ${s}`).join('\n')}

━━━ VIBE MOOD ━━━
${vibeDirective.slice(0, 150)}

━━━ HARD MANDATES ━━━
1. The 1-2 kawaii sweets appear by name, each with its cute smiling face (dot eyes, rosy cheeks, tiny smile).
2. The holiday theme reads instantly and festive.
3. Soft, sweet, adorable, friendly (never scary) — jewel-bright or pastel per the look register.

━━━ HARD BANS ━━━
- NO humans anywhere — the sweets are the only characters.
- NO readable text (decorative marks only). NO photoreal / gritty / genuinely-spooky tokens.

Output ONLY the raw Flux prompt, 150-210 words, comma-separated. Open with the LOOK REGISTER, then the sweets + festive context, then mood. NO preamble, NO titles, NO headers, NO bulleted lists.`;
};
