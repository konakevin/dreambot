#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/chibibot/seeds/night_meadow_props.json',
  total: 100,
  batch: 25,
  append: true,
  metaPrompt: (
    n
  ) => `You are writing ${n} NIGHT-MEADOW PROP descriptions for ChibiBot night-meadow — the tiny accessory props that stack to amplify the night-time-wonder cuteness. The prop is a SPECIFIC OBJECT placed in/around the scene. Each render picks 2 of these (pickN:2) so each entry must be distinct enough to layer with another.

Each entry: 8-15 words. ONE specific nighttime-themed prop with concrete visual detail. NO setting / creature / activity / time-of-night language.

━━━ WHAT MAKES A GREAT ENTRY ━━━

- Concrete prop with a specific detail (vintage brass lantern with hand-rolled candle / glass mason jar holding 8-10 captured fireflies / hand-knit cable-knit blanket in cream / tiny brass telescope on a wooden tripod)
- Picture-able at tiny scale
- Adds CHARM and READABLE NIGHTTIME COZINESS without crowding the focal creatures (these are second-tier — the pair is always the hero)

━━━ CATEGORY DISTRIBUTION ━━━

- 20% lantern / warm-point-light props (brass hurricane lantern with warm yellow glow / paper lantern strung on a low branch / wax candle in glass holder / oil lamp with curved chimney / tiny camping lantern with wire bail handle / sky lantern just released)
- 20% firefly / glow-jar props (mason jar with 8-10 fireflies inside / wide-mouth jar of captured glow-worms / glass bell jar with floating fireflies / vintage jam jar with brass lid and fireflies / corked bottle of bottled-stardust)
- 15% blankets / textiles (chunky cable-knit cream blanket / patchwork quilt with stars stitched on / striped wool throw / hand-embroidered moon-and-stars blanket / linen picnic blanket spread on the grass / fluffy faux-sheepskin throw)
- 15% telescopes / star-watching gear (vintage brass telescope on wooden tripod / small handheld brass spyglass / astrolabe on a flat stone / star-chart unfurled on a blanket / brass compass / scribbled map of constellations)
- 10% beverages / treats (thimble of hot cocoa with marshmallow / tiny teacup of steaming chamomile / spoon-sized bowl of warm milk / single biscuit on a leaf-plate / honeycomb piece on a wooden board)
- 10% reading / story-time (open storybook with illustrations / leather-bound journal half-open / scribbled letter on knee / quill and tiny inkpot / illuminated manuscript page)
- 5% fairy-light / strung-light (paper lanterns strung on a branch / fairy-lights wrapped around a stick / glowing flower garland / illuminated paper-bag luminarias)
- 5% magical-artifact (glowing crystal on a pedestal / wishing stone with engraved letters / dream-catcher hanging from a branch / floating glowing acorn / spell-jar of starlight)

━━━ DEDUP DIMENSIONS ━━━

Dedup by: prop type + concrete detail. "mason jar with fireflies" and "glass jar holding glow-bugs" are duplicates. "mason jar with fireflies" and "vintage brass lantern" are distinct.

━━━ HARD BANS ━━━

- NO creatures or characters (separate axis)
- NO activity verbs
- NO setting / time-of-night / weather
- NO modern tech (no "smartphone" / "headlamp" / "electric light" — keep magical/vintage)

━━━ OUTPUT ━━━

JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
