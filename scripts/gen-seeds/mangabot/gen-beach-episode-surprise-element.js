#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/mangabot/seeds/beach_episode_surprise_element.json',
  total: 25,
  batch: 25,
  append: true,
  metaPrompt: (
    n
  ) => `Write ${n} BEACH-EPISODE SURPRISE-ELEMENT entries — small bright vacation secondary subjects at midground/background.

Each 10-18 words. Element + placement + summer-vacation-world implication.

VARIETY:
- 16% PASSING-WILDLIFE (seagull cluster mid-flight at midground / pelican gliding low / crab scuttling sideways at sand-edge / dragonfly hovering near tide-pool)
- 14% IMPLIED-FRIEND-GROUP (silhouette of friend-group at midground laughing / partner-shape on towel beyond / friend mid-jump in deep distance)
- 12% BEACH-ACCESSORY-DETAIL (sand-bucket on towel beside / parasol-corner catching breeze / volleyball mid-air-pass at midground / flip-flops scattered)
- 10% FLOAT/RING/RAFT (inflatable flamingo-ring drifting on water / donut-float at midground / inflatable orca / banana-boat in deep distance)
- 8% FOOD-VENDOR-SCENE (shaved-ice cart with awning at midground / yakisoba-stall with bunting beyond / coconut-cart with palm-shade)
- 8% BOAT/SHIP (small fishing-boat in midground bay / kayak passing at distance / dragon-boat at far harbor / paddleboarder at midground)
- 6% LANTERN/BUNTING (paper-lantern string overhead at midground / festival-bunting between palms / windsock fluttering)
- 6% SAND-CASTLE (impressive sand-castle beside at midground / sand-fortress with flag / sand-sculpture in distance)
- 6% UMBRELLA/PARASOL (candy-stripe parasol catching light at midground / parasol-grid beyond / single tilted parasol in sand)
- 6% TIDE-POOL-LIFE (starfish in tide-pool at midground / anemone cluster / hermit-crab pile)
- 4% RAINBOW/POOLLIGHT (rainbow-arc in spray at midground / sun-flare on water / glittering pool-light)
- 4% INSTRUMENT (ukulele on towel beside / guitar leaned on cooler / boombox at midground)

DO write:
- Seagull cluster mid-flight at midground above sand, three birds catching sun-glare
- Silhouette of friend-group at midground building castle, laughter implied
- Sand-bucket on towel beside her with shovel, sand-grains scattered
- Inflatable pink flamingo-ring drifting on calm water at midground
- Shaved-ice cart with red-and-white awning at midground, line of friends queued
- Small fishing-boat at midground bay, single fisherman silhouette mending net
- Paper-lantern string overhead at midground between palms, six lanterns swaying
- Impressive sand-castle at midground beside path, seashell-decorated walls
- Candy-stripe parasol at midground catching afternoon-light, shadow-pool below
- Pink starfish in tide-pool at midground, water-ripple from her splash
- Rainbow-arc in mist-spray at midground from cresting-wave, colors saturated
- Ukulele on towel beside her at midground, strap-loop visible
- Donut-float in pastel-yellow at midground bobbing on water, shadow on sand-bottom
- Hermit-crab pile at midground tide-pool, three shells visible

DO NOT: anything foreground competing with character / multiple per entry / dramatic-violent / cheesecake-implied-bystanders.

Return ONLY JSON array of ${n} strings. No preamble.`,
}).catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
