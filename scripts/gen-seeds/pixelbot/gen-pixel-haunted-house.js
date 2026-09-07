#!/usr/bin/env node
// AlphaBot candidate — pixel-haunted-house (destination: PixelBot).
// A standalone 16-bit pixel-art Halloween postcard: ONE spooky-but-charming
// house as the singular hero, stacked all around with GLOWING carved
// jack-o-lanterns (the money shot), circled by bats. NOT a gameplay
// screenshot, NOT tied to any in-game camera convention. Four MVP-25 pools:
// the house itself, the jack-o-lantern swarm staging, the yard/grounds
// dressing, and the sky/atmosphere. Modeled on
// scripts/gen-seeds/alphabot/gen-jack-o-lantern-toy-parade.js.
const { generatePool } = require('../../lib/seedGenHelper');

(async () => {
  // ── Axis 1: the house itself (architecture + one distinguishing quirk) ──
  await generatePool({
    outPath: 'scripts/bots/pixelbot/seeds/pixel_haunted_house_house.json',
    total: 120,
    batch: 25,
    append: true,
    banHumanLanguage: true,
    metaPrompt: (
      n
    ) => `Write ${n} HAUNTED-HOUSE architecture entries for a 16-bit pixel-art Halloween postcard scene. Each describes ONE spooky-but-CHARMING house's silhouette/architecture plus one distinguishing quirky feature. Each entry 20-32 words.

━━━ TONE ━━━
Charming and inviting, never derelict or menacing — a house you'd WANT to trick-or-treat at. Whimsical Halloween storybook register, not abandoned/decrepit horror.

━━━ VARY THE HOUSE ARCHETYPE ACROSS ALL ${n} (spread across these, don't repeat the same archetype twice) ━━━
- Crooked three-story Victorian manor with a wraparound porch
- Gothic farmhouse with a steep gambrel roof and a tall silo-turret
- Witch's tapering tower-cottage with a spiral of small round windows
- Leaning boarding-house with mismatched add-on wings
- Gingerbread-trim cottage with scalloped eaves gone delightfully spooky
- Castle-like manor with two round corner turrets
- Old windmill converted into a house, sails frozen mid-turn
- Lighthouse-keeper's house with a lit lantern room on top
- Treehouse fortress built into a massive gnarled oak
- Train-car house, an old caboose repurposed with a porch bolted on
- Chapel-turned-house with a single small bell tower
- Riverside houseboat with a crooked little chimney
- Barn-house hybrid with a huge sliding door and hayloft window
- Stacked shipping-crate-style cottage with a rooftop widow's walk
- Round stone tower-house like a converted grain silo
- Sprawling ranch house with a wraparound porch and a crow-topped weathervane
- Multi-gabled Queen Anne with a wraparound turret balcony
- Cliffside cottage perched on stilts over a small ravine
- Mill-house with a still, moss-covered waterwheel
- Observatory-topped house with a small domed rooftop room

━━━ EACH ENTRY MUST INCLUDE ━━━
1. The house archetype/silhouette (from or inspired by the list above)
2. ONE distinguishing quirky architectural detail (crooked chimney, tilted weathervane, sagging porch beam, mismatched shutters, ivy-choked trellis, a lopsided widow's walk, etc.)

━━━ RULES ━━━
NO humans, no human bystanders, no people of any age. NO readable text. Charming/whimsical register only — never "abandoned," "decrepit," "crumbling," or genuinely scary framing. This is a HOUSE, not a mansion interior or dungeon.

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
  });

  // ── Axis 2 (MONEY SHOT): the jack-o-lantern swarm staged around the house ──
  await generatePool({
    outPath: 'scripts/bots/pixelbot/seeds/pixel_haunted_house_jackolanterns.json',
    total: 120,
    batch: 25,
    append: true,
    banHumanLanguage: true,
    metaPrompt: (
      n
    ) => `Write ${n} JACK-O-LANTERN-SWARM staging entries for a 16-bit pixel-art Halloween house postcard — THIS IS THE MONEY SHOT of the whole scene: describe HOW glowing carved jack-o-lanterns are stacked all around a haunted house. Each entry 20-35 words. Always mention the warm GLOW explicitly (amber/orange candlelight glow).

━━━ VARY THE STAGING ACROSS ALL ${n} (spread across distinct placements, don't repeat the same one twice) ━━━
- Porch steps stacked into a glowing staircase, one pumpkin per step
- Every windowsill lined single-file with a row of small glowing pumpkins
- The roofline ridge topped with a row of pumpkins silhouetted against the sky
- Fence posts along the front walk each capped with a glowing pumpkin
- A spiral wrap of pumpkins climbing a tower's steps like garland
- A pumpkin-lantern arch built over the front gate
- Tiered pyramid stacks of pumpkins flanking either side of the front door
- Pumpkins hanging from porch rafters on short ropes, swaying gently
- Pumpkins floating on a small pond or moat, doubled by their own reflection
- A winding front path lined with pumpkins glowing like runway lights
- Pumpkins clustered into a bonfire-shaped pile in the front yard
- Pumpkins nestled in tree branches all the way up one bare oak
- Three pumpkins stacked on a chimney ledge, smoke curling behind them
- Pumpkins lined along window boxes beneath every ground-floor window
- A pumpkin-lantern chandelier of small pumpkins hanging under a porch overhang
- A garden wall topped with an even row of glowing pumpkins
- A giant pyramid of pumpkins stacked beside the front door
- Pumpkins tucked into every stair riser of a long porch staircase
- Pumpkins ringing a well or fountain in the front yard
- Pumpkins lining a low rooftop balcony rail

━━━ EACH ENTRY MUST INCLUDE ━━━
1. The specific staging/placement (from or inspired by the list above)
2. The warm glow explicitly named
3. Optionally vary carved-face character across entries (grins, gap-tooth, one-eyed wink, zigzag mouths) — not mandatory on every entry

━━━ RULES ━━━
NO humans, no human bystanders, no people of any age. NO readable text. PLAYFUL, friendly jack-o-lantern faces (grins, winks) — never menacing carved expressions. This is the SIGNATURE moment of the render — commit fully to "stacked all around, glowing."

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
  });

  // ── Axis 3: the surrounding yard/grounds dressing ──
  await generatePool({
    outPath: 'scripts/bots/pixelbot/seeds/pixel_haunted_house_yard.json',
    total: 120,
    batch: 25,
    append: true,
    banHumanLanguage: true,
    metaPrompt: (
      n
    ) => `Write ${n} HAUNTED-HOUSE YARD/GROUNDS dressing entries for a 16-bit pixel-art Halloween house postcard — the surrounding grounds detail that fills out the scene around the house (the house and jack-o-lanterns are supplied separately). Each entry 18-30 words.

━━━ VARY ACROSS ALL ${n} (spread across distinct grounds features, don't repeat the same one twice) ━━━
- A winding cobblestone path bordered by low lantern-lit stones
- A leaning picket fence strung with light cobweb bunting
- Twisted bare autumn trees strung with tiny paper bats
- A hay-bale-and-friendly-scarecrow corner near the front walk
- A garden gate framed by a corn-stalk arch
- A low stone wall topped with a string of orange fairy lights
- A small pond or birdbath reflecting the house's warm glow
- A wooden footbridge over a narrow creek at the yard's edge
- An old tire swing hanging from a gnarled front-yard tree
- A rose trellis wrapped in light cobwebs and fairy lights
- A vegetable garden with a few oversized pumpkins still on the vine
- A rusty wrought-iron gate standing ajar at the front walk
- Small wind chimes made of tiny bells hanging from the porch eave
- A pumpkin-shaped mailbox at the end of the front path
- A pair of garden gnomes in tiny witch hats flanking the doorstep
- A small firepit with warm orange embers glowing near the porch
- Rounded, cartoon-friendly headstone-shaped garden markers along a flowerbed border
- A porch swing draped with a knit autumn-colored blanket
- A row of drying corn stalks bundled and leaning against the porch rail
- Drifts of fallen orange and red leaves piled along the front walk
- A weathered wooden sign on a post reading nothing (blank, decorative)
- A cluster of hay bales stacked beside the front steps

━━━ RULES ━━━
NO humans, no human bystanders, no people of any age (scarecrows/gnomes as props are fine, never alive). NO readable text (a blank decorative sign is fine). Charming and playful — cartoon-friendly, never gory or genuinely scary (headstone props read as whimsical yard decor, not a graveyard). Keep each entry a distinct grounds feature.

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
  });

  // ── Axis 4: sky + atmosphere ──
  await generatePool({
    outPath: 'scripts/bots/pixelbot/seeds/pixel_haunted_house_sky.json',
    total: 120,
    batch: 25,
    append: true,
    banHumanLanguage: true,
    metaPrompt: (
      n
    ) => `Write ${n} SKY + ATMOSPHERE entries for a 16-bit pixel-art Halloween house postcard scene. Each entry 18-30 words, describing the sky/weather/atmosphere behind and around the house (the house and jack-o-lanterns are supplied separately).

━━━ VARY ACROSS ALL ${n} (spread across distinct sky/atmosphere moods, don't repeat the same one twice) ━━━
- Deep twilight-purple sky with an oversized harvest moon
- Thin wisps of ground fog curling low around the base of the house
- Swirling autumn leaves caught mid-air in a gentle breeze
- A scatter of small stars emerging in a darkening indigo sky
- Thin wispy clouds veiling a pale crescent moon
- Distant silhouetted rolling hills fading into deep blue dusk
- A faint will-o-wisp glow drifting like a slow comet trail
- Soft aurora-like ribbons of ghost-green light along the horizon
- A distant loose flock of bats crossing low on the horizon
- Gentle falling orange leaves drifting past the rooftop
- Deep indigo dusk sky with just a few early stars
- Low rolling mist pooling at the house's foundation
- A lone owl silhouette perched on a bare branch nearby
- A distant lighthouse-style beam sweeping once across the sky
- Parting storm clouds revealing a shaft of pale moonlight
- Fireflies mixed with a few drifting embers in the near-dark air
- Chimney smoke curling upward into a lazy spiral shape
- A distant thunderhead lit faint violet from within
- A star-strewn sky with a slim crescent moon and one bright point of light
- A warm sunset-orange horizon band fading up into deep evening blue
- Light snow-like ash of fallen leaves swirling near the rooftop
- A hazy harvest-moon halo ringed in soft amber light

━━━ RULES ━━━
NO humans, no human bystanders, no people of any age. NO readable text. Atmospheric and moody-but-charming — cozy-spooky, never bleak or genuinely frightening.

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
  });
})().catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
