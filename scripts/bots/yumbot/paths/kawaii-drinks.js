/**
 * YumBot kawaii-drinks path (Stage P1, SHADOW) — function-form.
 *
 * Cute drinks with kawaii faces baked in (boba / milkshakes / smoothies / cocoa
 * / lattes / sodas). REWORKED 2026-08-16 (Kevin: the first version was too
 * minimal/bland) — now every render has a fun little STORY MOMENT, lavish cute
 * set-decoration + pops of color, and maximal adorableness. SCENE = the lively
 * busy setting; MOMENT = the story the drinks are caught in; DRINKS = 1-2 cute
 * drink-characters; DECOR = pickN 2-3 cute set-dressing details. Leads with
 * sharedDNA.lookRegister; routes to yumbot_food_neutral.
 */

const pools = require('../pools');
const { YUMBOT_LOOK_OVERRIDE } = require('../shared-blocks');

module.exports = ({ sharedDNA, vibeDirective, picker }) => {
  const scene = picker.pickWithRecency(pools.YUMBOT_KAWAII_DRINKS_SCENES, 'kawaii_drinks_scene');
  const moment = picker.pickWithRecency(pools.YUMBOT_KAWAII_DRINKS_MOMENT, 'kawaii_drinks_moment');

  const drinks = [picker.pickWithRecency(pools.YUMBOT_KAWAII_DRINKS_TREATS, 'kawaii_drinks_treat')];
  if (Math.random() < 0.5) {
    const second = picker.pickWithRecency(pools.YUMBOT_KAWAII_DRINKS_TREATS, 'kawaii_drinks_treat');
    if (second !== drinks[0]) drinks.push(second);
  }

  // 2-3 cute decor details — pops of color + set-dressing so the scene reads busy
  // and delightful, never bland.
  const decor = [];
  const decorCount = 2 + (Math.random() < 0.5 ? 1 : 0);
  while (decor.length < decorCount) {
    const d = picker.pickWithRecency(
      pools.YUMBOT_KAWAII_DRINKS_DECOR,
      `kawaii_drinks_decor_${decor.length}`
    );
    if (!decor.includes(d)) decor.push(d);
  }

  return `${YUMBOT_LOOK_OVERRIDE(sharedDNA)}You are writing a KAWAII-DRINKS render for YumBot — adorable drinks with cute smiling faces, caught in a FUN little story in a lively, colorful, delightfully busy scene. This is joyful and packed with charm — NEVER minimal or bland. Visual treatment is set by the LOOK REGISTER above.

━━━ THE LIVELY SCENE (colorful, busy, full of cute set-decoration) ━━━
${scene}

━━━ THE STORY MOMENT (what's happening — render this fun little moment clearly) ━━━
${moment}

━━━ THE KAWAII DRINK(S) — the adorable stars, each with a big-eyed smiling face (appear by name) ━━━
${drinks.map((d, i) => `${i + 1}. ${d}`).join('\n')}

━━━ CUTE DECOR — POPS OF COLOR + DETAIL (all of these appear, scattered through the scene) ━━━
${decor.map((d, i) => `${i + 1}. ${d}`).join('\n')}

━━━ VIBE MOOD ━━━
${vibeDirective.slice(0, 150)}

━━━ HARD MANDATES ━━━
1. MAXIMAL CUTENESS — the drinks are irresistibly adorable: big sparkly eyes, rosy blush cheeks, tiny happy expressions, little arms; give them personality.
2. A FUN STORY the eye reads in 2 seconds — something is happening (the moment above), the drinks are DOING something delightful together.
3. BUSY + COLORFUL — pops of color and lots of charming detail everywhere (the decor above), a rich lively scene, never empty or minimal.
4. Soft, sweet, jewel-bright or pastel per the look register; a joyful sugar-rush of a picture.

━━━ HARD BANS ━━━
- NO humans anywhere — the drinks are the only characters.
- NO readable text on signs/menus (decorative marks only). NO photoreal / gritty tokens.

Output ONLY the raw Flux prompt, 170-230 words, comma-separated. Open with the LOOK REGISTER, then the lively scene + the fun moment, then the adorable drinks + their expressions, then the pops of color + decor, then mood. NO preamble, NO titles, NO headers, NO bulleted lists.`;
};
