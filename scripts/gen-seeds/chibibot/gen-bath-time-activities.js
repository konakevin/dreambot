#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/chibibot/seeds/bath_time_activities.json',
  total: 200,
  batch: 50,
  append: true,
  metaPrompt: (
    n
  ) => `You are writing ${n} BATH-TIME ACTIVITY descriptions for ChibiBot — the heart-melting BATH MOMENT an adorable tiny creature is having right now. The ACTIVITY is what the creature is DOING in/around the bath. Each must read as a candid storybook moment that produces "AWWW + I want to hug it" instantly.

Each entry: 15-25 words. ONE specific bath activity. Describe the creature's body posture / expression / interaction with bath elements. NO setting language (separate axis). NO amenities themselves (separate axis) — they can be USED in the activity verb but not described as setting props.

━━━ WHAT MAKES A GREAT ENTRY ━━━
- Active verb-led — what the creature is DOING (blowing / squeezing / rinsing / soaking / playing / nestling / scrubbing / dunking / peeking / wrapping / drying)
- Body posture + expression detail (eyes squeezed shut / cheeks puffed / paws raised / head tipped back / curled / stretching / wiggling)
- One signature bath detail (foam beard / bubble crown / suds mustache / soaked-fluffy fur / wet-and-spiky cowlick / closed-eye bliss / sneeze-bubble)
- Solo OR group-able (since 70% of renders are group, write some entries that imply multiple creatures interacting; some single-creature focused)

━━━ CATEGORY DISTRIBUTION ━━━
- 25% washing-bliss (eyes closed in suds-bliss / head tipped back as water pours / paws held up while being scrubbed / chest fur lathered into a cloud)
- 20% playful-water (splashing with both paws / chasing a soap bubble / blowing bubbles through pursed lips / kicking up a tiny wave / mid-cannonball)
- 15% bubble-bath-fun (foam beard sculpted into wizard shape / bubble crown floating above ears / suds mustache curled up / bubble crowns balanced)
- 15% spa-day (cucumber slices on closed eyes / face-mask of green clay / towel turban tied just right / robe pulled snug / hot-stone resting on back)
- 10% post-bath drying (wrapped in fluffy towel only ears poking out / curled into a towel-cocoon / shaking off in a halo of droplets / mid-stretch fresh from bath)
- 10% pair-moment (scrubbing a friend's back / sharing a tiny soap-bottle toast / leaning sleepily against a friend in foam / passing a sponge to a friend mid-rinse)
- 5% peek-moments (one paw waves over tub edge / nose pokes out of bubble cloud / ears just visible over foam line / eyes peek up from beneath suds)

━━━ DEDUP DIMENSIONS ━━━
Dedup by: verb + posture + bath element. "blowing bubbles" and "puffed-cheek blowing through soapy hands" are duplicates. "eyes closed in bliss" and "curled into a towel-cocoon" are distinct.

━━━ HARD BANS ━━━
- NO setting language (no "in the clawfoot tub" / "at the hot spring")
- NO time/weather language
- NO scary / threatening / wet-dog-shake-uncontrolled / mid-fall language
- NO human-coded items (no "razor" / "shampoo bottle" — those are amenity axis only)
- NO entries that imply the creature is in distress

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
