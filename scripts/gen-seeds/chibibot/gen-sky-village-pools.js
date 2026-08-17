#!/usr/bin/env node
/**
 * ChibiBot sky-village — bespoke axis pools (Stage H3, SHADOW). The 7th village:
 * a cloud-kingdom. SETTING-AS-HERO whimsical sky village (cottages on cloud-tufts,
 * rainbow bridges, balloon docks, star-lamp posts, floating islands), a SOLO chibi
 * creature as a small scale-prover. Clouds-as-ground read soft-solid-whimsical
 * (storybook physics is fine on this bot); NO airplanes/tech/rockets. 6 pools:
 *   settings (village) / activities (solo resident) / details (pickN:3) / time_of_day /
 *   surprise / phenomena. Run: node scripts/gen-seeds/chibibot/gen-sky-village-pools.js
 */
const { generatePool } = require('../../lib/seedGenHelper');

const DIR = 'scripts/bots/chibibot/seeds/';

(async () => {
  // 1) SETTINGS — the sky-village (HERO, cluster of dwellings, no creatures).
  await generatePool({
    outPath: DIR + 'sky_village_settings.json',
    total: 120,
    append: true,
    batch: 25,
    metaPrompt: (n) => `You are writing ${n} SKY-VILLAGE SETTINGS for ChibiBot sky-village — a whimsical CLOUD-KINGDOM village that is the HERO of the frame. NOT a single cottage — a VILLAGE (a cluster of many dwellings) FLOATING HIGH IN THE OPEN SKY above an endless sea of clouds.

Each entry: 25-40 words. ONE specific sky-village. NO creatures, NO time-of-day, NO weather verbs.

⚠️ EVERYTHING FLOATS HIGH IN THE SKY ABOVE AN ENDLESS CLOUD-SEA — this is the #1 lock. Every entry must clearly be UP IN THE OPEN SKY: cottages perch on billowing cloud-tufts and floating grassy sky-islands suspended in open air, with the endless cloud-sea and blue sky visible all around and far below. NEVER a village on solid ground / on a hill / in a forest / on a plateau — the "ground" is CLOUDS and open sky. Storybook dream-physics (you can stand on a cloud). NO airplanes/rockets/jets/tech.

Variety mandate — distribute across sub-types, ALL floating in open sky above a cloud-sea: cottages clustered on billowing cloud-tufts linked by rope-and-plank rainbow bridges across open air; stacked floating grassy sky-islands with waterfalls spilling off their edges into the cloud-sea far below; a floating sky-harbor of hot-air-balloon docks and tethered cloth-airships; a cloud-castle with turrets rising from a giant cloud-bank; floating islands joined by swaying rope bridges over the void; a cluster of glass-bubble cottages bobbing among the clouds; lantern-strung cloud-terraces stepping down a towering cloud-bank; a windmill-island floating alone in a golden cloud-sea; a moon-and-star observatory island high above the cloud-sea; a floating tree-island whose roots trail down into the clouds.

Each entry MUST clearly convey FLOATING-IN-OPEN-SKY + at least 3 sky-village elements (cloud-islands / rainbow bridges / balloons / star-lamps / cloud-sea / floating cottages).

HARD BANS: NO grounded villages / NO solid earth / NO hills / NO forest floor / NO plateau-on-land — it FLOATS in the sky above a cloud-sea; NO creatures/characters, NO time/weather/activity verbs, NO single solo cottage (must be a VILLAGE cluster), NO airplanes/jets/rockets/tech, NO dark/abandoned. Return ONLY a JSON array of ${n} strings. No preamble, no numbering.`,
  });

  // 2) ACTIVITIES — the SOLO foreground creature's story activity (subject-agnostic).
  await generatePool({
    outPath: DIR + 'sky_village_activities.json',
    total: 120,
    append: true,
    batch: 25,
    metaPrompt: (n) => `You are writing ${n} RESIDENT-ACTIVITY phrases for ChibiBot sky-village — what the SOLO foreground chibi creature is doing (a small scale-prover living its daily life in the cloud-village). The species comes from a SEPARATE axis, so do NOT name a species — use "a little creature / they / their".

Each entry: 12-22 words, an ACTIVE mid-action verb-phrase (never posing), a cozy sky-village daily-life beat.

Variety mandate — distribute across: crossing a rainbow bridge with a basket, tending a cloud-garden of star-flowers, hanging a little star-lantern on a post, launching a tiny paper-boat off a cloud-edge, feeding a drifting cloud-sheep, watering flower-boxes on a floating balcony, tugging a tethered balloon home, sweeping a cloud-terrace, delivering a parcel between islands, fishing for stars off a bridge rail, climbing a rope-ladder to a higher island, chasing a runaway kite over the clouds.

Examples (NO species named):
"mid-step across a rope-and-plank rainbow bridge with a basket of star-flowers, cloak fluttering in the high wind"
"reaching up on tiptoe to hang a little glowing star-lantern on a cloud-terrace post"
"tugging a bobbing tethered balloon down toward a floating dock, paws braced against the breeze"
"crouched at a bridge rail dangling a line to fish tiny stars from the cloud-sea below"
"watering a window-box of star-flowers on a floating balcony, watering-can tipped"

HARD BANS: NO species names, NO humans, NO airplanes/tech, NO posing (always mid-action), NO mood/lighting/palette words. Return ONLY a JSON array of ${n} strings.`,
  });

  // 3) DETAILS — sky-village lived-in elements (pickN:3).
  await generatePool({
    outPath: DIR + 'sky_village_details.json',
    total: 120,
    append: true,
    batch: 25,
    metaPrompt: (n) => `You are writing ${n} SKY-VILLAGE DETAILS for ChibiBot sky-village — concrete lived-in cloud-kingdom elements that populate the village (the template stacks THREE per render). Each 6-14 words. NO characters as the focus.

Variety mandate — cloud-tuft window-boxes of star-flowers / a little rainbow bridge with rope rails / tethered hot-air balloons bobbing at a dock / star-lamp posts glowing softly / floating paper lanterns strung between cottages / a drifting fluffy cloud-sheep / laundry strung between floating balconies / a spiral rope-ladder to a higher island / a tiny windmill spinning on a cloud / a waterfall spilling off a floating island edge / potted star-flowers on cottage steps / a mailbox on a cloud-post.

Examples:
"cloud-tuft window-boxes spilling glowing star-flowers"
"a little rope-railed rainbow bridge arcing between islands"
"tethered pastel hot-air balloons bobbing at a floating dock"
"soft-glowing star-lamp posts lining a cloud-terrace"
"a fluffy cloud-sheep drifting lazily past a cottage"
"a waterfall spilling off the edge of a floating island into the mist"

HARD BANS: NO characters as focus (distant figures are tiny chibi animals), NO airplanes/tech, NO time/weather words. Return ONLY a JSON array of ${n} strings.`,
  });

  // 4) TIME OF DAY — light + sky.
  await generatePool({
    outPath: DIR + 'sky_village_time_of_day.json',
    total: 24,
    append: true,
    batch: 24,
    metaPrompt: (n) => `You are writing ${n} TIME-OF-DAY phrases for ChibiBot sky-village — the light + sky over the cloud-village (light/sky only). Each 8-16 words.

Variety mandate — soft golden dawn breaking over the cloud-sea / bright blue midday with fluffy clouds / warm golden-hour sun gilding the cloud-tops / rosy sunset above a pink-and-gold cloud-sea / deep-blue starry night over the sky-village / soft lilac twilight with the first stars / a dawn cloud-sea glowing peach below / moonlit silver night over the clouds.

Examples:
"soft golden dawn breaking pink and gold across the cloud-sea"
"warm golden-hour sun gilding the drifting cloud-tops"
"a deep-blue starry night glittering over the sky-village"
"rosy sunset painting the cloud-sea in peach and lavender"

HARD BANS: light/sky only, no creatures/scene/activity. Return ONLY a JSON array of ${n} strings.`,
  });

  // 5) SURPRISE — tucked-away second-tier beat.
  await generatePool({
    outPath: DIR + 'sky_village_surprise.json',
    total: 24,
    append: true,
    batch: 24,
    metaPrompt: (n) => `You are writing ${n} SURPRISE background beats for ChibiBot sky-village — a tiny tucked-away delightful cloud-kingdom detail in the deep midground. Each 6-14 words.

Variety mandate — a distant sky-whale drifting slowly past below / a runaway kite tangled on a star-lamp / a flock of tiny paper-birds wheeling over the clouds / a little balloon drifting free into the sky / a rainbow arcing between two far islands / a cloud-sheep asleep on a rooftop / a shooting-star streak far off / a tiny lantern-boat drifting down a cloud-stream.

Examples:
"a distant sky-whale drifting slowly through the cloud-sea below"
"a runaway kite snagged fluttering on a far star-lamp"
"a flock of tiny paper-birds wheeling over the far islands"
"a rainbow arcing softly between two distant cloud-islands"

HARD BANS: NO humans, NO airplanes/tech, NO scary/sad. Return ONLY a JSON array of ${n} strings.`,
  });

  // 6) PHENOMENA — 60%-gated environmental wonder.
  await generatePool({
    outPath: DIR + 'sky_village_phenomena.json',
    total: 24,
    append: true,
    batch: 24,
    metaPrompt: (n) => `You are writing ${n} ENVIRONMENTAL PHENOMENA for ChibiBot sky-village — a gated atmospheric wonder that stacks over the cloud-village. Each 10-20 words.

Variety mandate — a soft aurora rippling green-and-violet over the cloud-sea / a gentle sun-shower with a full rainbow arcing over the islands / a sea of cloud-mist rising to swallow the lower islands / a meteor shower streaking the night sky / a bloom of drifting glowing spores/fireflies over the clouds / a double rainbow framing the village / a golden sunbeam breaking through to spotlight one island / a slow drift of giant soft cloud-galleons passing.

Examples:
"a soft aurora rippling green-and-violet across the starry cloud-sea"
"a gentle sun-shower trailing a full rainbow over the floating islands"
"a rising sea of cloud-mist slowly swallowing the lower islands in soft haze"
"a golden sunbeam breaking through the clouds to spotlight one little island"

HARD BANS: NO humans, NO airplanes/tech, NO storms-of-menace (keep it gentle + wondrous). Return ONLY a JSON array of ${n} strings.`,
  });

  console.log('\n✅ All 6 sky-village pools generated.');
})().catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
