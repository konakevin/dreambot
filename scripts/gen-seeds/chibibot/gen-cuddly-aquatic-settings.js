#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/chibibot/seeds/cuddly_aquatic_settings.json',
  total: 200,
  batch: 50,
  append: true,
  metaPrompt: (
    n
  ) => `You are writing ${n} CUDDLY-AQUATIC SETTING descriptions for ChibiBot — the underwater / surface-water / waterside HABITAT where adorable cuddly aquatic creatures live. The SETTING is the aquatic stage — depth, habitat, biome — for the cuddly pair. Each must feel like a frame from a different page of a "tiny aquatic creatures around the world" storybook.

Each entry: 15-25 words. ONE specific aquatic setting. NO creatures (separate axis). NO interaction / activity (separate axis). NO time-of-day / weather (separate axes).

━━━ THE BAR: VARIED AQUATIC DESTINATIONS, NOT GENERIC "OCEAN" ━━━

Every setting should answer "WHERE in the water is this?" with specific habitat + depth + signature feature. The aquatic-cuddle moment can happen anywhere from a tide pool to the deep sea to a frozen arctic ice-edge to a tropical reef to a flooded sunken pirate-ship.

━━━ CATEGORY DISTRIBUTION ━━━

- 25% tropical-reef / coral-garden (rainbow coral garden bathed in sun-dappled water / pink anemone village beneath a coral arch / spiral coral tower wrapped in sea-fans / kelp-cathedral with stained-glass-like light filtering / staghorn coral nursery / branching brain-coral plateau)
- 15% kelp-forest (sun-lit kelp cathedral with cathedral-like beams of light filtering down / kelp canopy at midwater with shafts of green light / shadowy kelp-forest floor with sea-otter rafting overhead silhouettes / sea-grass meadow swaying gently)
- 15% arctic / ice-edge / polar (ice-edge floe with submerged blue ice walls below / underside-of-iceberg crystal cathedral / arctic kelp-garden under thin ice / pristine cold-blue arctic plateau / glacial trench with bubbles rising)
- 10% tide pool / shore (rocky tide pool with anemones at low tide / sea-glass-scattered tide pool / dock-pylon under-shadow with barnacles / mangrove root tangle in coastal mud / sea-cave mouth at the tideline)
- 10% deep-sea / abyssal-cute (bioluminescent deep-sea cuddle nook with glowing jellies / abyssal volcanic vent with warm currents and tube worms / lantern-fish meadow in midnight zone / glowing dragon-fish hollow / soft sediment plain with rays drifting overhead)
- 10% freshwater / lily-pond (lily-pad raft on a koi pond / cherry-blossom-petal-strewn pond / mossy spring with bubbles rising / lotus-bloom hollow in a still pond / waterfall-curtain alcove behind a forest fall / hidden cave-pool with stalactites dripping)
- 5% sunken-architecture (sunken pirate ship interior with treasure chests overgrown by coral / submerged Roman amphora cluster on the sea floor / sunken temple courtyard with fish swimming through stone arches / underwater cave with shafts of light through ceiling cracks)
- 5% magical / fantastical (mermaid-grotto with bioluminescent pearls / glass-clear arctic pool reflecting aurora / underwater fairy-ring in a kelp grove / coral palace gates / pearl-cave with spiraling shell-staircases)
- 5% surface-water / floating (lily-pad raft floating with cherry blossoms on a forest stream / cattail-marsh canoe-of-leaves / hot-spring island in a misty mountain lake / sunlit kelp-mat floating with otter raft)

━━━ WHAT MAKES AN ENTRY 10/10 ━━━

- Concrete habitat anchor + depth-implied (surface / midwater / deep / tidepool / floor)
- Material truth: coral / kelp / ice / sand / stone / mossy stone / lily-pad / barnacle / pearl
- Specific signature feature (rainbow coral / sun-pillar-shafts / aurora reflected / pink anemones / bioluminescent jellies / cherry-blossom petals on surface)
- Picture-able as one mental still frame

━━━ DEDUP DIMENSIONS ━━━

Dedup by: habitat type + depth + signature feature. "tropical reef with sun-dapples" and "coral garden with sun-filtering light" are duplicates. "tropical reef" and "arctic ice-edge" are distinct.

━━━ HARD BANS ━━━

- NO creatures (separate axis — no "with otters playing" / "fish swimming nearby" as the focal point)
- NO interactions / cuddle actions (separate axis)
- NO time-of-day language (no "at dawn" / "moonlit")
- NO weather (no "during a storm")
- NO predator-prey / sharks / threat / scary undertones
- NO documentary-ocean language (no "harsh predator-rich waters")
- NO modern-tech (no "submarine" / "scuba tank" unless on the sunken-architecture list as decor)

━━━ OUTPUT ━━━

JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
