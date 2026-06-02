#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
const fs = require('fs');
// R1: nuke prior pool — rebuild from scratch with stricter rules.
const out = 'scripts/bots/mangabot/seeds/beach_episode_outfit.json';
try {
  fs.writeFileSync(out, '["__STUB__"]');
  console.log('reset pool to STUB-only for clean rebuild');
} catch (e) {}

generatePool({
  outPath: out,
  total: 25,
  batch: 25,
  append: true,
  metaPrompt: (
    n
  ) => `Write ${n} BEACH-EPISODE OUTFIT entries — modest summer beachwear ONLY. K-On!/Free!/Lucky-Star wholesome-vacation register.

⚠️ ANTI-CHEESECAKE MANDATE — ABSOLUTELY NON-NEGOTIABLE — read carefully:

BANNED VOCABULARY (never use these words, even with "covered" qualifier):
- "bikini" (any form: bikini-top, bikini-style, etc.)
- "swimsuit underneath" / "over swimsuit" / "over one-piece" (cover-up phrasing leaks an exposed swimsuit underneath in Flux training data)
- "cleavage" / "low-cut" / "v-neck deep" / "plunging" / "open at chest"
- "open jacket" / "unbuttoned" / "open-front" / "wrap that opens"
- "form-fitting" / "tight" / "skin-tight" / "snug fit"
- "wet T-shirt" / "see-through" / "sheer" / "oiled" / "glistening skin"
- "midriff" / "bare midriff" / "exposed stomach" / "crop top" / "tube top" / "halter"
- "thong" / "string-tied" / "high-cut leg" / "micro-" / "barely-there" / "skimpy"
- "voluptuous" / "curvy" / "bombshell" / "buxom" / "sultry" / "alluring"

REQUIRED STRUCTURE — every entry must describe a SINGLE SOLID GARMENT covering chest + torso + bottom:
✅ Rashguard (long-sleeve or short-sleeve athletic top, fully covers chest+torso+arms) + boardshorts (knee-length)
✅ Athletic one-piece swimsuit (high-neck racerback or scoop, like school-swim) + boardshorts over
✅ Cotton sundress (mid-thigh or longer, high neckline, A-line cut) — described as a STANDALONE garment, not "over" anything
✅ Surf-shorts (knee-length) + cotton tee or button-down camp-shirt (BUTTONED, NOT open)
✅ Linen sundress (full-coverage, capped sleeves, modest neckline) — standalone
✅ School swim-trunks + matching tee (boys)
✅ Lifeguard rashguard outfit (red rash-top + red shorts)
✅ Apron over tee + shorts (vendor uniform)
✅ Yukata-style ROBE that is FULLY CLOSED + sash tied tight, NO inner garment mentioned (treated as a dress)

NEVER describe layered "X over Y where Y is a swimsuit/bikini" — Flux interprets that as open jacket revealing exposed inner swimwear. Always describe the OUTER garment as the SOLE garment seen.

Each 16-26 words. Outfit + material detail + bright-summer accent.

VARIETY:
- 20% RASHGUARD-SET (long-sleeve rashguard + boardshorts — all one outfit, no inner reference)
- 16% ATHLETIC-ONE-PIECE (high-neck school-style one-piece + long swim-shorts OVER)
- 14% MODEST-SUNDRESS (cotton sundress as standalone garment, mid-thigh, high neck)
- 12% SURF-SHORTS-AND-BUTTONED-SHIRT (boardshorts + buttoned-up camp shirt)
- 10% YUKATA-ROBE-CLOSED (yukata-style summer robe FULLY CLOSED, treated as a dress — no inner garment)
- 8% SCHOOL-SWIM-BOY (school swim-trunks + matching school tee)
- 8% LIFEGUARD-UNIFORM (red rashguard + red shorts + whistle)
- 6% VENDOR-APRON (striped apron over tee + shorts)
- 6% CASUAL-COVER (long graphic tee + bike-shorts, all standalone)

DO write:
- Long-sleeve UV rashguard in coral-pink covers full chest and arms, blue boardshorts past knee, reef-shoes laced snug
- High-neck navy athletic one-piece swimsuit with school name-tag at hip, long blue swim-shorts to knee covering thighs
- Cotton lemon-print sundress to mid-thigh with high boat-neck and cap sleeves, straw-hat with yellow ribbon, sandals
- Knee-length palm-print boardshorts with white cotton tee buttoned to collar, sleeves rolled, flip-flops on sand
- Indigo wave-print yukata robe fully wrapped and sash-tied at waist with no opening at chest, geta sandals
- Navy school swim-trunks at knee with matching navy school tee tucked in, white sun-visor, rubber sandals
- Red lifeguard rashguard fully covering chest and torso with red boardshorts past knee, silver whistle at neck
- Striped pink-and-white food-stall apron over cream tee and navy shorts, towel-headband, cheerful grin
- Long graphic-print tee in sunny yellow falling to mid-thigh over navy bike-shorts, swim-cap on head, sandals
- Long-sleeve lavender rashguard with mid-thigh swim-skirt over leggings, full chest enclosed, wide-brim sun-hat
- Sky-blue zip-front rashguard fully zipped to collar with wide-leg boardshorts past knee, aqua reef-shoes
- Watermelon-stripe linen midi sundress, capped sleeves, scoop high-neck, espadrille sandals, woven straw bag
- Tangerine athletic one-piece with high racerback neckline, long UV sun-shirt over chest, boardshorts at knee
- Coral fish-print yukata-style robe wrapped and tied tight with no opening at chest, zori sandals on planks
- Cream button-down camp-shirt in pineapple-print buttoned to collar over knee surf-shorts, canvas sneakers
- Seafoam wide-leg linen pants with cotton tank fully covered by buttoned overshirt, woven slip-ons

DO NOT (these triggered cheesecake renders before — NEVER produce these patterns):
- "wave-print yukata over swimsuit" → renders an open jacket with bikini-top showing
- "kimono-cut cover-up wrapped over teal one-piece" → renders the same
- "open-front" / "draped at shoulder" / "off-shoulder" / "tied at hip"
- Anything that mentions both an outer layer AND an inner swimsuit — always describe ONE garment

Bright joyful summer + explicit full coverage + age-appropriate vacation + single-garment focus.

Return ONLY JSON array of ${n} strings. No preamble.`,
}).catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
