#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/toybot/seeds/hotwheels_lighting.json',
  total: 100,
  batch: 25,
  metaPrompt: (
    n
  ) => `Write ${n} hot-wheels-event lighting + atmosphere descriptors for ToyBot's hotwheels-city path. Each entry combines real-world household event-mood + light quality + atmospheric phenomenon. 10-20 words per entry.

━━━ THE WORLD ━━━
Hot Wheels die-cast cars on real-world household surfaces — kitchen counter, driveway, bedroom rug, garage floor, picnic blanket, coffee table, patio, bathtub, sandbox. Event-driven moods: birthday party, BBQ, Christmas morning, sleepover, garage workshop, kitchen-breakfast, summer-pool-party, halloween-driveway, snow-day rally, cul-de-sac block-party.

━━━ HARD VARIETY RULES ━━━
- Cover all 4 SEASONS / multiple TIMES OF DAY
- Mix EVENT-DRIVEN moods (party / BBQ / holiday) with PRACTICAL household lighting
- Strong color/event signals each entry — never generic

━━━ LIGHTING / ATMOSPHERE TO ROTATE ━━━
- garage-workshop fluorescent overhead, oil-stain reflections, dust-motes in shaft of door-light
- driveway sunset, asphalt-warm long-shadows, golden-hour bouncing off chrome
- kitchen-morning sun through curtains, syrup-amber glow on counter, coffee-steam rising
- BBQ-twilight grill-smoke haze, ember-glow, sodium patio-lights flickering on
- Christmas-morning warm-tree-lights bokeh, gift-wrap sparkle, fireplace-glow
- sleepover-bedroom fairy-light strings, blue-hour through window, blanket-fort glow
- birthday-party balloon-cluster soft, candle-flicker, streamer-confetti suspended
- Halloween-driveway orange-pumpkin glow, fog-machine haze, jack-o-lantern flicker
- pool-party noon-bright, water-reflection caustics, cyan-pool-glow, sun-spray haze
- snow-day overcast bright, fresh-powder reflecting, breath-frost visible, soft daylight
- cul-de-sac late-summer dusk, sodium streetlamps warming, cricket-warmth, peach sky
- patio-twilight blue-hour, citronella candles glowing, mosquito-haze, fairy lights
- hallway-runner morning, rectangle of slatted-window-light cutting carpet
- coffee-table-arena window-light, magazine-glare, dust-motes in afternoon shaft
- sandbox-noon harsh sun, hot-dust shimmer, deep-shadows from castle walls
- bathroom-tile fluorescent, mirror-bounce, suds-bubble reflections
- bedroom-rug afternoon, slats-of-light through blinds, plush-bear-spectator shadow
- garage-megaramp single-bulb hanging, dramatic-shadow, oil-puddle mirror
- driveway-rainstorm, glistening asphalt reflections, headlight-cones cutting through wet
- attic floorboards single-bulb dust-motes, beam-of-window-light slanting
- Christmas-tree-base ornament-bokeh, garland-warm, lit-window snow beyond
- summer-evening porch fairy-lights, fireflies, golden hour fading to violet
- post-meal kitchen-counter dim, only stove-light on, late-night quiet
- workshop bench under-cabinet LED, tool-shadow drama, sparks from grinder

━━━ FORMAT ━━━
Each entry: 10-20 words, comma-separated phrases, real-world household setting + light + event-mood:
- "Christmas-morning warm tree-lights bokeh, gift-wrap shimmer, fireplace-glow on hardwood"
- "garage-workshop fluorescent overhead, oil-stain reflections, single-bulb spotlight on workbench"
- "BBQ-twilight grill-smoke haze, ember-glow, sodium patio-lights flickering on, peach sky"

━━━ BANNED ━━━
- Generic "cinematic" without environment + light + event-mood
- Studio lighting that doesn't fit a household / event setting
- Identical entries

━━━ DEDUP RULE ━━━
- No two entries share ENVIRONMENT + LIGHT + EVENT-MOOD exactly

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
