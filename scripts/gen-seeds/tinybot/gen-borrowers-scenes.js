#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/tinybot/seeds/borrowers_scenes.json',
  total: 200,
  batch: 50,
  metaPrompt: (n) => `You are writing ${n} BORROWERS scene descriptions for TinyBot — tiny humans (5cm tall, Arrietty / Borrowers / Ant-Man scale) living inside the normal-sized human world. The signature is OBJECT-FOR-SCALE ANCHORING — an everyday object (thimble, teacup, spool, pencil, postage stamp, button, matchbox) at its TRUE everyday size, with a tiny borrower interacting with it. The viewer instantly reads the scale because they know how big the object is.

Each entry: 18-28 words. ONE specific scene with the everyday object + the borrower's action.

━━━ SETTINGS (mix broadly across all entries) ━━━
- Kitchen counter / breakfast table / pantry shelf
- Bathroom sink / vanity / soap dish
- Sewing room / spool drawer / button jar / pin cushion
- Bedroom nightstand / book pile / lamp base
- Garden potting shed / seed packets / terracotta pot rim
- Garage workbench / tool tray / nut-and-bolt jar
- Dining table mid-meal / breadcrumbs / wine-cork landscape
- Library / desk / inkwell / typewriter keys / rolodex
- Toy chest / dollhouse roof / chess board
- Pocket / purse interior / wallet / coin tray
- Window sill / houseplant pot / curtain folds
- Fireplace mantel / clock face / mantle clock interior
- Refrigerator door / magnet collage / butter dish

━━━ EVERYDAY OBJECTS AS BORROWER-SCALE LANDSCAPE (ANCHOR EVERY ENTRY) ━━━
Each entry MUST name at least one everyday object that anchors the scale. Examples:
- thimble (bathtub / cup / hat)
- spool of thread (stool / wagon-wheel / ladder)
- teacup (swimming pool / boat / shelter)
- pencil (beam / log / bridge)
- postage stamp (poster / wall / flag)
- button (table / wheel / shield)
- matchbox (bed / wagon / crate)
- coin (table / shield / mirror)
- safety pin (sword / hook / ladder)
- pencil-eraser (cushion / pillow / sandbag)
- bottle-cap (pool / dish / hat)
- key (bridge / sled / mechanism)
- domino (wall / bench / table)
- paper-clip (chair / climbing-frame / hook)
- breadcrumb (boulder / chunk / pebble)

━━━ BORROWER ACTION (every entry shows the borrower DOING something) ━━━
- Bathing in a thimble, sipping from an acorn-cap, climbing a spool-thread ladder
- Sewing a coat from a handkerchief scrap, mending a sock-cuff sweater
- Reading a postage-stamp newspaper, writing on a leaf with a pin
- Cooking on a candle-flame stove, hauling a breadcrumb to a pantry-shelf cottage
- Steering a walnut-shell across a teacup of milk, paddling with a popsicle-stick oar
- Sleeping in a matchbox bed, waking on a rolled-sock pillow
- Hiding behind a salt-shaker, peeking out from under a teacup
- Climbing a knitting-needle ladder, sliding down a spoon

━━━ ANATOMY / IDENTITY RULES ━━━
- Borrowers are stylized illustrated figurines — soft Arrietty/Ghibli features, NEVER identifiable real-person faces
- Tiny clothes are clearly handmade from human-world scraps (handkerchief skirts, sock-cuff sweaters, button hats, ribbon belts)
- Cap on borrowers in scene: 1 or 2 max. Solo borrower or borrower-pair. Never crowds.
- Either gender / any apparent age — vary across entries

━━━ ABSOLUTELY BANNED ━━━
- NO identifiable real human (no celebrities, no realistic adult faces)
- NO normal-scale humans visible in frame (only the borrowers are visible, the human world is just the OBJECT-environment)
- NO sexual / suggestive content
- NO modern devices that don't fit the cozy aesthetic (no smartphones, no laptops, no cars)
- NO weapons / violence
- NO sad / scary scenes — keep it cozy + resourceful + hidden-magic

━━━ DEDUP DIMENSIONS ━━━
Deduplicate by: setting + everyday-object + borrower-action. "Borrower in a thimble bathtub on the bathroom sink" and "tiny human bathing in a thimble" are TOO SIMILAR. Vary the OBJECT and the ACTION and the SETTING across entries.

━━━ EXAMPLES (DO NOT REUSE) ━━━
- "Tiny borrower in a handkerchief-toga bathing in a thimble of warm water on a porcelain sink rim, soap-bubble the size of her head"
- "5cm-tall borrower steering a walnut-shell sailboat across a brimming teacup of milk on a kitchen counter, leaf sail tilted in steam-breeze"
- "Borrower-pair hauling a giant breadcrumb across an open recipe book, lantern-bead glowing, ink-stains as their landscape"
- "Tiny borrower asleep in a matchbox bed inside a sock drawer, button-quilt over her, spool-of-thread nightstand with a thimble lamp"
- "Borrower climbing a paper-clip ladder up the side of a sugar bowl on a teatray, a spider-silk rope coiled at her belt"

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering, no markdown.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
