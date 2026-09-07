#!/usr/bin/env node
// AlphaBot candidate — pixel-witchs-cottage (destination: PixelBot).
// A 16-bit pixel-art game-screenshot of ONE crooked witch's cottage alone in
// a dark forest clearing: a window glowing with eerie magical cauldron-light
// (the money shot) and a crooked, smoking chimney. Isometric or side-view
// composition. Four MVP-25 pools: the cottage itself, the cauldron-glow
// window staging, the dark-forest setting, and the witchy yard/grounds
// dressing. Modeled on scripts/gen-seeds/alphabot/gen-pixel-haunted-house.js.
const { generatePool } = require('../../lib/seedGenHelper');

(async () => {
  // ── Axis 1: the cottage itself (architecture + one distinguishing quirk) ──
  await generatePool({
    outPath: 'scripts/bots/pixelbot/seeds/pixel_witchs_cottage_architecture.json',
    total: 120,
    batch: 25,
    append: true,
    banHumanLanguage: true,
    metaPrompt: (
      n
    ) => `Write ${n} WITCH'S-COTTAGE architecture entries for a 16-bit pixel-art game-screenshot scene. Each describes ONE crooked, characterful witch's cottage's silhouette/architecture plus one distinguishing quirky feature. Each entry 20-32 words.

━━━ TONE ━━━
Charming, whimsical, and characterful — a cozy-spooky storybook witch's home, never derelict or genuinely menacing.

━━━ VARY THE COTTAGE ARCHETYPE ACROSS ALL ${n} (spread across these, don't repeat the same archetype twice) ━━━
- Leaning stone cottage with a spiral thatch roof
- Toadstool-shaped cottage with a rounded mushroom-cap roof
- Timber-framed cottage built around and merged into a massive gnarled tree trunk
- Crooked A-frame cabin with a sagging ridge beam
- Round tower cottage with a conical witch-hat roof
- Cottage built atop tangled tree roots, slightly elevated off the ground
- Patchwork-roofed cottage with mismatched wood shingles and slate tiles
- Cottage with a lopsided extension bolted onto one side
- Cottage half-built into a hillside or cave mouth
- Cottage with a crystal-ball-shaped stained-glass window set in the gable
- Cottage ringed by a low crooked picket fence of bone-pale branches
- Cottage with a hanging cauldron-shaped signboard swinging outside (blank, no text)
- Cottage with heavy shutters and one single tall crooked chimney
- Treehouse-cottage hybrid nestled in the crook of two ancient oaks
- Cottage with a wraparound porch cluttered with hanging herb bundles
- Cottage with a domed greenhouse-style glass extension for potion plants
- Cottage perched on tall gnarled stilts above damp forest ground
- Cottage with an onion-domed turret at one corner
- Cottage whose walls are thick with creeping ivy and moss
- Windmill-shaped cottage with frozen, moss-grown sails
- Round stone tower-cottage like a converted grain silo
- Cottage with a lopsided widow's-walk balcony under the roof peak
- Sunken cottage with a short stone stairway leading down to its door
- Cottage with an oversized cracked clay-pot chimney-pot on the roof

━━━ EACH ENTRY MUST INCLUDE ━━━
1. The cottage archetype/silhouette (from or inspired by the list above)
2. ONE distinguishing quirky architectural detail (crooked doorframe, sagging porch beam, mismatched shutters, tilted weathervane, lopsided dormer window, etc.)

━━━ RULES ━━━
NO humans, no witch figure, no bystanders of any age. NO readable text. Charming/whimsical register only — never "abandoned," "decrepit," "crumbling," or genuinely scary framing. This is a COTTAGE, not a mansion or dungeon.

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
  });

  // ── Axis 2 (MONEY SHOT): the cauldron-glow window ──
  await generatePool({
    outPath: 'scripts/bots/pixelbot/seeds/pixel_witchs_cottage_glow.json',
    total: 120,
    batch: 25,
    append: true,
    banHumanLanguage: true,
    metaPrompt: (
      n
    ) => `Write ${n} CAULDRON-GLOW-WINDOW staging entries for a 16-bit pixel-art witch's-cottage scene — THIS IS THE MONEY SHOT of the whole scene: describe HOW an eerie magical cauldron-light glows out through one of the cottage's windows. Each entry 20-35 words. Always name the glow COLOR explicitly (sickly green / violet / emerald / amber-green / teal-green, etc.) and what's silhouetted inside.

━━━ VARY THE STAGING ACROSS ALL ${n} (spread across distinct window types + silhouettes, don't repeat the same one twice) ━━━
- A single round window glowing sickly green, a bubbling cauldron silhouette visible inside
- A diamond-paned bay window glowing violet, shelves of potion bottles lit from within
- A cracked-open shutter glowing amber-green, steam curling out into the night air
- Twin windows glowing in sync, pulsing gently like a slow heartbeat
- A round porthole-style window fogged with condensation, glowing emerald behind the glass
- A tall arched window glowing green-gold, a hanging cauldron-chain silhouette swinging faintly
- A small attic window glowing violet, a cluttered shelf of jars visible in silhouette
- A stained-glass window glowing in scattered multicolor from the cauldron-light behind it
- A window with peeling curtains glowing sickly green, smoke drifting past it from inside
- A cellar window at ground level glowing faint green through cobwebbed glass
- A window glowing in slow pulses, bright then dim, as if the potion itself is bubbling in rhythm
- A bay window crowded with jars of glowing ingredients, casting dappled green light outward
- A single warm candle-lit window beside a much brighter green-glowing cauldron window
- A round window glowing green, a broom-leaning silhouette just visible inside
- A window fogged green from within, only a vague bubbling shape visible through the haze
- A window glowing an eerie teal-green, moths circling the light just outside the glass
- A tall narrow window glowing violet-green, casting a long colored beam out across the yard
- A window glowing bright green that flickers with an occasional small spark or flare
- Twin small round windows glowing different colors, green and violet, side by side
- A window glowing green, its light catching drifting steam escaping through a cracked pane
- A round window glowing amber-green, a hanging birdcage-like lantern silhouette swaying inside

━━━ EACH ENTRY MUST INCLUDE ━━━
1. The specific window type + staging (from or inspired by the list above)
2. The glow color explicitly named
3. What is silhouetted or visible through the glow (cauldron, jars, broom, shelves, steam, etc.)

━━━ RULES ━━━
NO humans, no witch figure, no bystanders of any age. NO readable text. Eerie-but-PLAYFUL magical glow — never gory or genuinely frightening. This is the SIGNATURE moment of the render — commit fully to "unmistakable magical cauldron-light."

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
  });

  // ── Axis 3: the dark forest clearing ──
  await generatePool({
    outPath: 'scripts/bots/pixelbot/seeds/pixel_witchs_cottage_forest.json',
    total: 120,
    batch: 25,
    append: true,
    banHumanLanguage: true,
    metaPrompt: (
      n
    ) => `Write ${n} DARK-FOREST-CLEARING entries for a 16-bit pixel-art witch's-cottage scene — the surrounding dark-forest setting the cottage sits alone in (the cottage and its glowing window are supplied separately). Each entry 18-32 words.

━━━ VARY ACROSS ALL ${n} (spread across distinct forest/clearing features, don't repeat the same one twice) ━━━
- Gnarled ancient trees with twisted bare branches ringing the clearing
- A ring of pale mushrooms circling the cottage's clearing
- Low ground fog pooling between moss-covered roots
- Moonlight filtering down in dappled shafts through a dense canopy
- A narrow winding dirt path disappearing into the tree-line
- Fallen mossy logs and jagged stones scattered at the clearing's edge
- Twisted vines and hanging moss draping from overhead branches
- A ring of half-buried standing stones swallowed by underbrush at the clearing's border
- A small dark pond reflecting the cottage's glowing window
- Thick bramble thickets dotted with a few scattered glowing mushrooms
- A cluster of dead, silver-barked trees leaning at odd angles
- Fireflies or drifting spore-motes glowing faintly among the tree trunks
- A rickety wooden footbridge crossing a narrow black stream at the clearing's edge
- Twisted roots breaking up through the forest floor like gnarled fingers
- A hollow, half-dead tree stump nearby with a faint inner glow
- Dense fir and pine trees crowding close, their tips lost in darkness above
- A scattering of glowing will-o-wisps hovering just above the underbrush
- Thick spiderwebs strung between low branches, catching the moonlight
- A carpet of fallen autumn leaves blanketing the clearing floor
- Craggy moss-covered rock outcrops framing one side of the clearing
- A curtain of low-hanging willow-like branches at the clearing's far edge
- A scattering of pale toadstools glowing faintly at the tree-line

━━━ RULES ━━━
NO humans, no witch figure, no bystanders of any age. NO readable text. Moody-but-charming cozy-spooky register — atmospheric, never bleak or genuinely frightening.

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
  });

  // ── Axis 4: witchy yard/grounds dressing ──
  await generatePool({
    outPath: 'scripts/bots/pixelbot/seeds/pixel_witchs_cottage_yard.json',
    total: 120,
    batch: 25,
    append: true,
    banHumanLanguage: true,
    metaPrompt: (
      n
    ) => `Write ${n} WITCHY-YARD/GROUNDS dressing entries for a 16-bit pixel-art witch's-cottage scene — the grounds detail filling out the scene around the cottage (the cottage and glowing window are supplied separately). Each entry 18-32 words. Props and creatures ONLY — never a human or witch figure.

━━━ VARY ACROSS ALL ${n} (spread across distinct grounds features, don't repeat the same one twice) ━━━
- A second, smaller cauldron bubbling gently over a low fire near the front step
- A tidy row of drying herb bundles hanging from a porch rafter
- A cluster of glass potion bottles lined along a windowsill, each glowing faintly
- A weathered broom leaning against the doorframe
- A patch of oversized glowing mushrooms beside the front path
- A small stone well with a bucket, faint green mist rising from it
- A rickety outdoor shelf stacked with labeled-but-blank jars
- A raven perched silently on the gatepost
- A black cat curled asleep on the porch step
- A ring of small stones and candles forming a simple spell-circle in the yard
- A rack of drying gourds and gnarled roots near the door
- A cluster of jack-o-lanterns with mismatched carved grins lining the front walk
- An old weathervane shaped like a crescent moon and cat silhouette atop a post
- A garden trellis overgrown with strange glowing night-blooming flowers
- A cracked stone birdbath filled with faintly glowing water
- A small handcart loaded with gourds and gnarled roots near the path
- A cluster of tall dried cornstalks bundled beside the door
- A crooked, friendly scarecrow standing watch at the edge of the garden
- A low stone wall lined with a row of small glowing lanterns
- A stack of spellbooks and scrolls left open on an outdoor table, pages fluttering
- A cluster of bundled broomsticks propped beside the door like firewood
- A row of carved pumpkins glowing softly along the porch railing

━━━ RULES ━━━
NO humans, no witch figure, no bystanders of any age (scarecrows/animals as props/creatures are fine, never alive-human). NO readable text (blank labels/signs are fine). Charming and playful — cartoon-friendly, never gory or genuinely scary.

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
  });
})().catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
