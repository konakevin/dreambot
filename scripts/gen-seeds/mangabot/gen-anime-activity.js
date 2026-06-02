#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/mangabot/seeds/anime_activity.json',
  total: 200,
  batch: 50,
  append: true,
  maxTokens: 4000,
  metaPrompt: (
    n
  ) => `Write ${n} ANIME CHARACTER ACTIVITY descriptions for MangaBot's character paths. Each entry is 14-22 words. The activity is what the character is DOING — a candid mid-action body-pose. Place-agnostic so it fits any anime setting.

CONTEXT: Slice-of-anime-life moments. NOT adventuring, NOT combat. Just characters in their world, caught mid-moment. Wonder, beauty, style — the kind of pose that anchors a wall-poster anime frame.

Categories — rotate widely:
- Walking / strolling (mid-stride forward / mid-step away from camera / hands in pockets walking / pausing mid-stride to look up)
- With-something-in-hand (sipping tea / holding a coffee cup with both hands / eating ramen at counter / holding a book / carrying a paper bag of groceries / cradling a sketchpad)
- Reading / writing (reading on a bench / sketching in a notebook / writing at a café table / browsing a magazine / studying with elbows on a desk)
- Listening / observing (headphones on mid-step / pausing to listen to distant music / watching cherry petals fall / gazing at a skyline / leaning on a railing watching the city)
- Photography / recording (raising a film camera to take a shot / scrolling on a phone / mid-photo with smartphone)
- With animals (holding a cat / sitting beside a sleeping dog / kneeling to pet a stray)
- Umbrella / weather (walking with umbrella in rain / pulling a hood up against wind / catching a snowflake on outstretched palm / shielding eyes from sun)
- Casual standing (leaning on a railing / leaning against a vending machine / standing at the edge of a station platform / sitting on stone steps)
- Mid-laugh / smile (mid-laugh hand at mouth / soft smile head turned slightly / closed-eye-content smile)
- Reaching / touching (reaching for a falling petal / touching a window / running hand along a railing / picking up a leaf)
- Climbing / descending (mid-step up stairs / mid-step down a hill path)
- Riding (sitting on a bicycle paused at a corner / leaning on a scooter / sitting on a train seat looking out)

EVERY entry should imply MOTION + presence — body weight subtly shifted, a limb in motion, captured at a candid instant. Hair / clothing / scarf / hood caught mid-motion is encouraged.

ABSOLUTELY BANNED:
- NO seated cross-legged meditating / eyes-closed-still
- NO standing-still-modeling / hands-on-hips runway / runway-pose
- NO "training" / "fighting" / "running away from danger"
- NO weapons (this is slice-of-life, not adventure)
- NO "mid-strike" / "mid-attack"

Examples (write fresh):
- "mid-stride along a stone path with both hands tucked into hoodie pockets, gaze toward the horizon, scarf trailing in the breeze"
- "sipping a steaming mug at a café table, both hands cradling the cup, looking out the rain-streaked window, hair falling forward"
- "headphones on mid-step on a crosswalk, eyes ahead, hand drifting near the strap of a shoulder bag, hair caught in motion"
- "reading on a park bench with one leg crossed under, book held in lap, head tilted slightly, leaves drifting past"
- "leaning on a rooftop railing with both forearms resting on it, gazing at the city below, hair lifted by gentle wind"

Output ONLY a valid JSON array of ${n} strings (14-22 words each). No preamble, no commentary.`,
}).catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
