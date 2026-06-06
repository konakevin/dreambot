#!/usr/bin/env node
/**
 * PIXELBOT_SIDE_SCROLLER_PLATFORM_GEOGRAPHY — foreground platformable
 * terrain detail. Castlevania IV / Super Metroid / Donkey Kong Country
 * / Mega Man X / Owlboy / Hollow Knight pixel / Ori / Trine. The PLATFORM
 * (tile / cliff-ledge / treetop-branch / factory-walkway / ice-bridge /
 * mushroom-cap / cracked-magma). 40-60 words each.
 */
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/pixelbot/seeds/pixelbot_side_scroller_platform_geography.json',
  total: 200,
  batch: 25,
  maxTokens: 8000,
  append: true,
  metaPrompt: (
    n
  ) => `You are writing ${n} PLATFORM-GEOGRAPHY entries for PixelBot's side-scroller-world path — the FOREGROUND PLATFORMABLE TERRAIN detail running across the bottom of a 16-bit side-scrolling platformer screen (Castlevania IV / Super Metroid / DKC / Mega Man X / Owlboy / Hollow Knight pixel / Ori / Celeste / Dead Cells / Trine). Title-caps prefix THEN " — " separator THEN 40-60 word description.

━━━ THE BAR ━━━
Every entry is ONE platformable surface running across the frame-bottom. Specifies MATERIAL + TILE-DETAIL + DROP-OFF-EDGES + condition. The platform IS the foreground — heroes jump and run across it. Always references the pixel-tile grid + drop-off ledges. Genre-specific platform feel (gothic / industrial / forest / ice / lava / etc.).

━━━ EXAMPLE PHRASINGS (mirror this register exactly) ━━━
"GOTHIC GRAY-STONE TILE PLATFORM — clean gray-stone tiles laid in precise horizontal rows across the full frame-bottom, visible pixel-tile grid with chiseled grout-lines, slightly worn edges, gothic-mason quality, flat drop-off ledge at both ends."
"WEATHERED RUIN PLATFORM — broken mossy-stone platform extending across the foreground, overgrown green-moss blanketing the tile-tops, crumbled-tile edges, scattered fallen-stone rubble sitting on the surface, ragged drop-off at the right edge."
"CRACKED STONE WITH FISSURE GAPS — broken cracked-stone platform running across the frame-bottom, visible fissure-gaps between tiles, vines threading up through the cracks, ancient-ruin weathering, sharp crumbled ledge-edges dropping into darkness below."

━━━ VARIETY MANDATE (distribute across these platform categories) ━━━

- ~4 GOTHIC / STONE (gray-stone tile / cathedral-tile / mossy-ruin / cracked-flagstone / cobblestone / dressed-stone-block / chiseled-marble / scorched-stone / blood-stained-tile / broken-altar tile)
- ~4 FOREST / NATURAL (treetop-branch walkway / mossy-log bridge / vine-bridge / mushroom-cap platforms / giant-leaf platforms / tree-root walkway / canopy-branch platform / fallen-tree trunk / forest-floor with mushrooms / overgrown-roots)
- ~4 ICE / SNOW (smooth-ice bridge / cracked-ice platform / snow-drift tile / icicle-ledge / frozen-stream tile / glacier-shelf / frost-coated stone / blue-ice walkway / hanging-snow-ridge / packed-snow tile)
- ~4 LAVA / MAGMA (cracked-magma tile / scorched-rock bridge / cooled-lava platform / glowing-magma seam / volcanic-stone tile / obsidian-shelf / ember-glowing rock / sulfur-vent ledge / lava-tube tile / volcanic-rock bridge)
- ~4 INDUSTRIAL / FACTORY (steel-grate walkway / rusted-pipe walkway / conveyor-belt section / scaffolding plank / industrial-mesh floor / catwalk grating / electrified tile / oil-slick steel / corrugated-metal plank / factory-girder walkway)
- ~3 DESERT / SAND (sun-baked sand-stone tile / desert-stone with cracks / wind-eroded sandstone / pyramid-block tile / oasis stone-rim / dune-crest platform / scarab-carved stone / hieroglyph-incised tile)
- ~3 SCI-FI / SPACE (chrome-tile walkway / hex-grid energy-floor / sci-fi grating / power-conduit tile / hovering-platform tile / energy-bridge / starship-corridor floor / alien-organic tile)
- ~3 UNDERWATER / SUBMERGED (coral-shelf platform / submerged-stone tile / shipwreck-deck plank / kelp-covered stone / sand-and-shell tile / underwater-ruin tile / pearl-encrusted stone)
- ~3 SEWER / CAVE (slime-coated stone / dripping-cave tile / wet-cobblestone sewer / rusted-grate sewer / cave-mushroom platform / glowing-mineral tile / crystal-shard floor / bone-strewn cave tile)
- ~3 FANTASY / EXOTIC (cloud-platform / rainbow-arc bridge / star-tile floor / aurora-light platform / clockwork-gear platform / candy-coated tile / cake-frosting platform / dream-mist tile / treehouse-deck plank)

━━━ FORMAT RULES (NON-NEGOTIABLE) ━━━
- TITLE PREFIX is 2-4 WORDS IN ALL-CAPS-HYPHENATED, then " — " separator (em-dash), then description.
- ALWAYS describe MATERIAL + condition (clean / worn / cracked / mossy / scorched / etc.).
- ALWAYS reference "pixel-tile grid" or "tile-edges" or "visible tile boundaries".
- ALWAYS reference DROP-OFF EDGES at frame ends ("ragged drop-off at the right edge", "flat ledge at both ends", "crumbled edges drop into darkness").
- Body is 40-60 words.

━━━ BANS ━━━
- NO characters / enemies on the platform — geography ONLY.
- NO biome/sky/parallax background — platform only (biome lives in biome_setting axis).
- NO photoreal language — 16-bit pixel-art register.
- NO modern objects (cars / phones) outside the industrial/sci-fi categories.
- NO repeating exact platform material twice.

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering, one entry per string.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
