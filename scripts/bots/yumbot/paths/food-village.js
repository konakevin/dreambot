/**
 * YumBot food-village path (Stage P3, SHADOW) — function-form.
 *
 * A tiny VILLAGE built entirely from kawaii food (gingerbread cottages / sushi
 * buildings / cupcake towers) inhabited by cute food-characters with faces.
 * SCENE = the food-village world; RESIDENTS = 1-2 kawaii food-character
 * residents mid-action. Leads with sharedDNA.lookRegister; routes to
 * yumbot_food_neutral.
 *
 * No-humans lesson (Stage N): a "village" summons human inhabitants — so the
 * residents are affirmatively cast as FOOD-CHARACTERS and no people are named
 * (reinforced by the yumbot_food_neutral "no humans" suffix).
 */

const pools = require('../pools');
const { YUMBOT_LOOK_OVERRIDE } = require('../shared-blocks');

module.exports = ({ sharedDNA, vibeDirective, picker }) => {
  const scene = picker.pickWithRecency(pools.YUMBOT_FOOD_VILLAGE_SCENES, 'food_village_scene');

  const residents = [
    picker.pickWithRecency(pools.YUMBOT_FOOD_VILLAGE_RESIDENTS, 'food_village_resident'),
  ];
  if (Math.random() < 0.5) {
    const second = picker.pickWithRecency(
      pools.YUMBOT_FOOD_VILLAGE_RESIDENTS,
      'food_village_resident'
    );
    if (second !== residents[0]) residents.push(second);
  }

  return `${YUMBOT_LOOK_OVERRIDE(sharedDNA)}You are writing a KAWAII FOOD-VILLAGE render for YumBot — a whimsical little village BUILT ENTIRELY FROM FOOD, where the buildings and streets are made of kawaii food and cute food-characters live. Visual treatment is set by the LOOK REGISTER above.

━━━ THE FOOD-VILLAGE WORLD ━━━
${scene}

━━━ THE RESIDENTS — cute FOOD-CHARACTERS who live here (appear by name, mid-action) ━━━
${residents.map((r, i) => `${i + 1}. ${r}`).join('\n')}
Everyone in the village is a food-character with a smiling face — there are NO people, only adorable food folk going about their day.

━━━ VIBE MOOD ━━━
${vibeDirective.slice(0, 150)}

━━━ HARD MANDATES ━━━
1. The whole village is edible architecture made of kawaii food, with real depth (foreground detail, the food-town midground, a fading far distance).
2. The 1-2 food-character residents appear by name, mid-action, each with a cute smiling face — the only inhabitants.
3. Storybook-charming, cozy, lived-in — jewel-bright or pastel per the look register.

━━━ HARD BANS ━━━
- NO humans anywhere — every resident and figure is a cute FOOD-CHARACTER.
- NO readable text (decorative marks only). NO photoreal / gritty tokens.

Output ONLY the raw Flux prompt, 160-220 words, comma-separated. Open with the LOOK REGISTER, then the food-village world, then the residents, then mood. NO preamble, NO titles, NO headers, NO bulleted lists.`;
};
