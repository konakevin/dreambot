#!/usr/bin/env node
// AlphaBot candidate — pixel-haunted-overworld (destination: PixelBot).
// A 16-bit RPG-style TOP-DOWN OVERWORLD MAP SCREEN at night: a haunted
// tile-world dotted with glowing pixel jack-o-lanterns and friendly ghost
// sprites. Five MVP-25 pools: the haunted tile-region, the landmark icons,
// the jack-o-lantern trail (money shot), the traveling spirit sprite, and
// the optional ghost sprite. Modeled on
// scripts/gen-seeds/alphabot/gen-pixel-haunted-house.js.
const { generatePool } = require('../../lib/seedGenHelper');

(async () => {
  // ── Axis 1: the haunted region — top-down tile geography, always night ──
  await generatePool({
    outPath: 'scripts/bots/pixelbot/seeds/pixel_haunted_overworld_region.json',
    total: 120,
    batch: 25,
    append: true,
    banHumanLanguage: true,
    metaPrompt: (
      n
    ) => `Write ${n} TOP-DOWN TILE-MAP GEOGRAPHY entries for a 16-bit pixel-art HAUNTED OVERWORLD MAP SCREEN (a classic RPG world-map, seen from straight overhead at night). Each entry describes the haunted tile-continent/region geography filling the frame — chunky repeating terrain tiles, always Halloween-night, always dark/moody palette. Each entry 20-32 words.

━━━ CRITICAL: THIS IS A TOP-DOWN MAP, NOT A LANDSCAPE ━━━
Describe ONLY tile-level terrain geography (forest-tile clusters, graveyard-tile fields, swamp-tile patches, path-tiles, water-tiles) as seen from directly above. NEVER mention sky, horizon, clouds, or anything you'd see looking OUT rather than DOWN — this is a map screen, not a vista.

━━━ VARY THE REGION ACROSS ALL ${n} (spread across these, don't repeat the same region twice) ━━━
- A haunted forest of gnarled black tile-trees clustered around a fog-choked clearing
- A sprawling graveyard moor of grey tombstone-tile rows dotted across pale dead grass
- A witch's swamp of murky green tile-water threaded with twisted root-tile causeways
- A pumpkin-patch valley, orange gourd-tile rows fanning out from a central barn tile
- A corn-maze field, tall dry stalk-tile rows forming a winding tile labyrinth
- A foggy moor of low grey hill tiles half-swallowed in drifting mist-tile banks
- A spider-web canyon, dark rock-tile walls strung with pale web-tile strands
- A crooked orchard, rows of bare twisted tree tiles heavy with a few last apples
- A ghost-town desert, cracked sand tiles surrounding a cluster of abandoned building tiles
- A bog of black standing water tiles dotted with pale will-o-wisp glow patches
- A haunted island archipelago, small dark-tile isles ringed by inky ocean tiles
- A crumbling castle-grounds region, broken stone-tile ramparts scattered across overgrown weed tiles
- A moonlit hedge-maze estate, tall dark hedge-tile walls forming a tangled tile pattern
- A skeletal pine forest, blackened bare-branch tile clusters rising from ash-grey ground tiles
- A crooked hillside cemetery, tombstone tiles stair-stepping up a steep grey slope
- A witch's mountain pass, jagged dark-rock tile peaks flanking a narrow winding path
- A haunted farmland region, dead crop-rows and a lone crooked scarecrow-tile silhouette
- A raven-haunted marsh, reed-tile clusters rising from still black tile-water
- A cursed vineyard, rows of withered dark-vine tiles climbing crooked trellis tiles
- A misty lakeside region, a still black tile-lake ringed by drooping willow tiles

━━━ EACH ENTRY MUST INCLUDE ━━━
1. The region/biome archetype (from or inspired by the list above)
2. At least one concrete tile-terrain detail (a specific tile cluster, path, or water feature)
3. A dark, Halloween-night color note (deep purple, ash-grey, sickly green, black, pale orange)

━━━ RULES ━━━
NO humans, no human bystanders, no people of any age. NO readable text or map labels. NO sky, horizon, or clouds — top-down tile terrain only. Spooky-but-charming register, never genuinely bleak or gory.

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
  });

  // ── Axis 2: haunted landmark icons dotting the map (pick 2) ──
  await generatePool({
    outPath: 'scripts/bots/pixelbot/seeds/pixel_haunted_overworld_landmarks.json',
    total: 120,
    batch: 25,
    append: true,
    banHumanLanguage: true,
    metaPrompt: (
      n
    ) => `Write ${n} small HAUNTED LANDMARK-ICON entries for a 16-bit pixel-art overworld MAP screen — tiny top-down landmark icons that dot a haunted RPG world-map, the way a walled town or watchtower dots a normal overworld map. Each entry 10-20 words, describing ONE small map-scale icon (never a full scene, never a close-up).

━━━ VARY THE LANDMARK ACROSS ALL ${n} (spread across these, don't repeat the same one twice) ━━━
- Crooked haunted manor silhouette with one lit attic window, perched on a small tile-hill
- Crumbling stone mausoleum with a rusted iron gate, half-sunk in tile-fog
- Witch's tapering tower-cottage with a single spiral of smoke from its chimney
- Ring of leaning grey tombstone tiles clustered around a bare dead tree
- Gnarled dead tree hung with a few sleeping bat sprites, roots cracking the tile ground
- Weathered scarecrow post standing crooked in a small dead-crop tile field
- Old covered wooden bridge strung with cobweb tiles, crossing a narrow tile-stream
- Abandoned windmill with one broken sail, frozen mid-turn against the dark
- Sunken pet-cemetery, tiny crooked headstone tiles in a fenced tile plot
- Black cauldron campfire circle with a faint green smoke wisp rising
- Spooky treehouse fort built into a single massive gnarled oak tile
- Squat stone watchtower with one flickering orange-lit window slit
- Corn-maze entrance arch built from bundled dry stalks and a carved-pumpkin cap
- Small stone well with a faint ghostly glow rising from its dark mouth
- Rickety rope bridge swaying above a narrow dark tile-ravine
- Lone iron gate standing open in an overgrown tile-hedge, cobwebs strung across it
- Tiny witch's garden shed ringed by a few glowing jack-o-lantern-shaped fence caps
- Crooked wooden signpost tile leaning at an angle, pointing toward a dark tree line
- Half-buried crypt entrance with two stone gargoyle-tile statues flanking the doorway
- Small stone shrine with a single candle glowing atop a snow-free dark hilltop

━━━ EACH ENTRY MUST INCLUDE ━━━
1. The landmark type (from or inspired by the list above)
2. One small distinguishing detail (a glow, a texture, a crooked/broken quality)

━━━ RULES ━━━
NO humans, no human bystanders, no people of any age. NO readable text. Keep each icon SMALL and map-scale — never described as filling the frame. Spooky-but-charming, never gory or graphic.

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
  });

  // ── Axis 3 (MONEY SHOT): the jack-o-lantern trail dotting the tile map ──
  await generatePool({
    outPath: 'scripts/bots/pixelbot/seeds/pixel_haunted_overworld_jackolantern_trail.json',
    total: 120,
    batch: 25,
    append: true,
    banHumanLanguage: true,
    metaPrompt: (
      n
    ) => `Write ${n} JACK-O-LANTERN-TRAIL staging entries for a 16-bit pixel-art HAUNTED OVERWORLD MAP screen — THIS IS THE MONEY SHOT of the whole scene: describe HOW small glowing pixel jack-o-lanterns are scattered/staged across the top-down tile map. Each entry 20-35 words. Always mention the warm GLOW explicitly (amber/orange candlelight glow against the dark tiles).

━━━ VARY THE STAGING ACROSS ALL ${n} (spread across distinct placements, don't repeat the same one twice) ━━━
- A winding tile-path lined on both sides with small glowing jack-o-lanterns leading toward a landmark
- A graveyard tile-cluster ringed by a neat circle of glowing pumpkins
- Pumpkins clustered thick at a crossroads where two tile-paths meet
- A spiral trail of pumpkins climbing a hill tile from base to crown
- A handful of pumpkins floating on a still tile-pond, doubled by their own reflection
- Pumpkins perched along a fence line that crosses the map in a long tile row
- A loose bonfire-shaped cluster of pumpkins glowing in a forest clearing tile
- Pumpkins lighting both ends of a covered-bridge tile crossing a narrow river
- Pumpkins dotting a cornfield in evenly-spaced rows between the dry stalk tiles
- A scattered constellation of single pumpkins spread loosely across open grass tiles
- Pumpkins lining the low stone wall bordering a graveyard tile-plot
- A cluster of pumpkins glowing at the mouth of a dark forest-tile clearing
- Pumpkins stacked in small pyramids at intervals along a long tile-road
- A ring of pumpkins glowing around the base of a lone dead tree tile
- Pumpkins scattered like fallen stars across a wide open moor tile-field
- A pumpkin glowing atop every third fence-post along a winding tile-path
- Pumpkins clustered around a well or shrine tile, glow rippling faintly
- A trail of pumpkins spiraling around a watchtower tile from ground to top
- Pumpkins lining a narrow tile causeway through swamp water
- A loose scatter of pumpkins glowing at the edge of a tile-cliff

━━━ EACH ENTRY MUST INCLUDE ━━━
1. The specific staging/placement across the tile map (from or inspired by the list above)
2. The warm glow explicitly named
3. Optionally vary carved-face character across entries (grins, gap-tooth, one-eyed wink) — not mandatory on every entry

━━━ RULES ━━━
NO humans, no human bystanders, no people of any age. NO readable text. PLAYFUL, friendly jack-o-lantern faces (grins, winks) — never menacing carved expressions. This is the SIGNATURE moment of the render — commit fully to "small glowing pumpkins dotting the tile map."

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
  });

  // ── Axis 4: the traveling spirit sprite (tiny, map-scale) ──
  await generatePool({
    outPath: 'scripts/bots/pixelbot/seeds/pixel_haunted_overworld_spirit_sprite.json',
    total: 120,
    batch: 25,
    append: true,
    banHumanLanguage: true,
    metaPrompt: (
      n
    ) => `Write ${n} TINY MAP-SCALE SPRITE entries for a 16-bit pixel-art HAUNTED OVERWORLD MAP screen — a single tiny traveling sprite crossing the tile-map, the same scale and role as the little party/ship sprite on a classic RPG world-map (never a close-up character, never a portrait). Each entry 15-28 words.

━━━ VARY THE SPRITE ACROSS ALL ${n} (spread across these, don't repeat the same one twice) ━━━
- A tiny trick-or-treater trio sprite, each in a simple costume, marching single-file along a tile-path
- A witch sprite riding a broomstick, gliding low just above the tile-tops
- A skeleton sprite carrying a small glowing lantern, walking along a tile-road
- A small black-cat sprite darting between two tile clusters, tail held high
- A mummy sprite shuffling slowly across an open tile-field, wrappings trailing
- A vampire-cloak sprite gliding in a low swoop just above the tiles
- A pumpkin-headed scarecrow sprite marching stiffly along a fence-line tile
- A tiny wizard sprite in a pointed hat, hopping tile to tile with a walking stick
- A ghost-costume trick-or-treater sprite carrying a small candy-bag icon
- A spider sprite scuttling along a thin web-bridge strung between two tiles
- A tiny bat-winged imp sprite hopping in short low arcs across the tiles
- A hooded lantern-carrier sprite trudging along a winding tile-path at a steady pace
- A broom-riding sprite trailing a thin sparkle-dust line behind it across the tiles
- A small owl-familiar sprite gliding low, following just behind a lantern-carrier sprite
- A tiny cauldron-cart sprite being pulled slowly along a bumpy tile-road
- A raven sprite hopping between fence-post tiles in short quick bursts
- A small costumed-knight trick-or-treater sprite marching with a toy-sword icon raised
- A pumpkin-cart sprite trundling along a tile-road, small wheels turning
- A tiny ghost-dog sprite trotting along beside a winding tile-path
- A lantern-lit rowboat sprite crossing a narrow stretch of tile-water

━━━ EACH ENTRY MUST INCLUDE ━━━
1. The sprite type and what it's doing (from or inspired by the list above)
2. A note that it is TINY and map-scale, never a close-up figure

━━━ RULES ━━━
NO humans, no human bystanders, no people of any age — describe COSTUMES/CREATURES/SPRITES, never age or gender nouns. NO readable text. Friendly, playful register only.

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
  });

  // ── Axis 5 (optional ~50%): a friendly ghost sprite dotting the map ──
  await generatePool({
    outPath: 'scripts/bots/pixelbot/seeds/pixel_haunted_overworld_ghost_sprite.json',
    total: 120,
    batch: 25,
    append: true,
    banHumanLanguage: true,
    metaPrompt: (
      n
    ) => `Write ${n} FRIENDLY GHOST-SPRITE entries for a 16-bit pixel-art HAUNTED OVERWORLD MAP screen — a small, translucent, FRIENDLY ghost sprite dotting/drifting over the top-down tile map (a secondary flourish, never the main subject). Each entry 15-25 words.

━━━ VARY THE GHOST BEAT ACROSS ALL ${n} (spread across these, don't repeat the same one twice) ━━━
- A single round translucent ghost sprite drifting slowly between two tile clusters
- A pair of small ghost sprites bobbing gently over a graveyard tile-cluster
- A wisp-like ghost sprite trailing a faint sparkle-line across open tiles
- A round smiling ghost sprite peeking out from behind a tree-tile
- A ghost sprite floating low over a tile-pond, its pale shape rippling in reflection
- A small ghost sprite looping in a lazy circle above a lone tombstone tile
- A friendly ghost sprite drifting alongside the map's traveling sprite, keeping pace
- A ghost sprite bobbing gently up and down above a fence-line tile
- A tiny ghost sprite peeking out of a well or crypt-entrance tile
- A translucent ghost sprite drifting through a patch of low fog-tiles
- A ghost sprite trailing three small sparkle-dots as it glides across the map
- A round ghost sprite hovering just above a cluster of glowing pumpkins
- A pale ghost sprite drifting in a slow figure-eight above an open field tile
- A small ghost sprite waving as it floats past a watchtower tile
- A ghost sprite peeking half-visible from behind a mausoleum tile
- A wide-eyed round ghost sprite bobbing near the map's winding tile-path
- A ghost sprite drifting low over a bridge tile, trailing faint mist
- A pair of tiny ghost sprites playing a gentle game of tag over open tiles
- A ghost sprite curled into a sleepy round shape, drifting slowly in place
- A ghost sprite peeking out from a hollow in a dead-tree tile

━━━ EACH ENTRY MUST INCLUDE ━━━
1. The ghost's position/behavior on the map (from or inspired by the list above)
2. A note that it is small, translucent, and FRIENDLY (a smile, a wave, a gentle drift)

━━━ RULES ━━━
NO humans, no human bystanders, no people of any age. NO readable text. ALWAYS friendly and round/cute, never a menacing or grim shape — this is a secondary charm beat, never scary.

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
  });

  console.log('\n✅ pixel-haunted-overworld: all 5 pools generated.\n');
})().catch((err) => {
  console.error('Fatal:', err.message);
  process.exit(1);
});
