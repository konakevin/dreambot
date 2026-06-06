#!/usr/bin/env node
/**
 * PIXELBOT_EPIC_VISTA_SUBJECT — 4-layer parallax vista focal landform.
 * Final Fantasy VI airship-flyover / Chrono Trigger / Lufia II / Secret
 * of Mana / DKC backgrounds / Sonic 2/3 horizons. Scene-as-hero, no
 * character — the vista IS the photo. 60-90 word entries.
 */
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/pixelbot/seeds/pixelbot_epic_vista_subject.json',
  total: 200,
  batch: 25,
  maxTokens: 16000,
  append: true,
  metaPrompt: (
    n
  ) => `You are writing ${n} VISTA-SUBJECT entries for PixelBot's epic-vista path — the focal landform of a 16-bit 4-layer parallax side-scrolling vista (FF VI airship-flyover / Chrono Trigger world-map / Lufia II overworld / Secret of Mana / Castlevania IV background-vistas / DKC backgrounds / Sonic 2/3 horizons). SCENE-AS-HERO — no character. Title-caps prefix THEN " — " separator THEN 60-90 word description.

━━━ THE BAR ━━━
Every entry is ONE epic 4-layer parallax vista with a specific FOCAL LANDFORM (rolling-hills / fjord / desert / volcanic / arctic / mountain / sea / floating-island / etc.). Specifies foreground TILE detail + midground depth-layers + far backdrop fade + "hard pixel-edges between every layer band" + a closing genre-feel tag ("FF6-overworld feel", "endless-rolling-hills feel", "alpine-vista feel", "dramatic mountain-descent feel"). 4 PARALLAX LAYERS are mandatory.

━━━ EXAMPLE PHRASINGS (mirror this register exactly) ━━━
"EMERALD ROLLING HILLS — 4-layer parallax vista with chunky rocky-edge foreground tile cresting a grassy embankment, layered emerald-green rolling hills in midground at progressive depth with scattered oak-silhouettes, distant low blue-purple mountain ridge silhouette fading in the far layer, hard pixel-edges between every hill band, FF6-overworld endless-rolling-hills feel."
"SAVANNA RIDGE — 4-layer parallax vista with chunky savanna-grass foreground showing cracked-earth tile detail, acacia-tree silhouettes scattered across midground rolling amber-grass hills at two depth steps, distant orange-rim mountain ridge in the far layer, hard pixel-edges between every terrain band, broad sun-scorched plains feel."
"SNOW-CAPPED MOUNTAIN RIDGE — 4-layer parallax vista with chunky snow-and-rock foreground tile at cliff base, rising snow-capped alpine ridge in midground with jagged peak silhouettes at two depth steps, distant blue-grey mountain peaks fading cool in the far layer, hard pixel-edges between every ridge band, classic alpine-vista feel."

━━━ VARIETY MANDATE (distribute across these vista categories) ━━━

- ~5 ROLLING-HILLS / GRASSLAND (emerald-hills / savanna-ridge / hayfield-vista / wildflower-rolling-plains / steppe-vista / heather-moor / amber-prairie / wind-grass-rolling / autumn-rolling-hills / fjord-meadow)
- ~5 MOUNTAIN / ALPINE (snow-capped peaks / volcanic-cone / jagged-spire-range / mesa-stack / canyon-overlook / waterfall-cliff / cliff-edge-with-river / hanging-glacier / cloudbreak-peaks / dolomite-spire vista)
- ~4 DESERT / ARID (dune-sea / sun-baked badlands / mesa-and-pinnacle / pyramid-and-sphinx-distant / oasis-with-palm-grove / canyon-flat / red-rock-formations / sandstorm-edge / dust-bowl plains)
- ~4 OCEAN / COASTAL (cliff-and-sea / fjord-and-sea / archipelago-isles / lighthouse-on-promontory / shipwreck-on-shore / coastal-village-far / black-sand beach / sea-stack vista / sea-cave coastline)
- ~4 FOREST / JUNGLE (dense-canopy / autumn-foliage / pine-forest mist / jungle-mist / mangrove-river / dark-tangled / treetop-canopy / bonsai-mountain forest / mushroom-grove / blue-leaf magical forest)
- ~3 ICE / ARCTIC (frozen-tundra plain / glacier-and-ice-shelf / aurora-snow / blue-iceberg sea / frozen-lake / ice-cave entrance / snow-blizzard ridge / icy-cliff-face)
- ~3 VOLCANIC / LAVA (lava-river canyon / smoking-volcano cone / obsidian-spire field / ember-vent-plains / molten-river / scorched-badlands / sulfur-spring desert / dragon-lair volcano)
- ~3 FANTASTICAL / FLOATING (floating-island chain / sky-island archipelago / drifting-mountain / cloud-castle vista / world-tree on distant ridge / crystal-pillar field / aurora-spire vista / chrysalis-tower)
- ~3 SWAMP / WETLAND (cypress-swamp / mangrove-river / lily-pad-pond / fog-marsh / boglands / will-o-wisp swamp / moss-mound delta)
- ~3 EXOTIC (zigzag-mountain valley / underwater-vista from cave / cave-with-skylight / crystal-cave entry / aurora-tundra / red-leaf valley / cherry-blossom canyon / lavender-fields panorama)

━━━ FORMAT RULES (NON-NEGOTIABLE) ━━━
- TITLE PREFIX is 2-4 WORDS IN ALL-CAPS-HYPHENATED, then " — " separator (em-dash), then description.
- ALWAYS open with "4-layer parallax vista with..." or "horizontal parallax vista with...".
- ALWAYS describe FOREGROUND TILE detail (chunky-rocky-edge / grass-tile / sand-tile / snow-tile / etc.).
- ALWAYS describe MIDGROUND with progressive depth steps + silhouettes.
- ALWAYS describe DISTANT / FAR LAYER fading.
- ALWAYS include "hard pixel-edges between every layer band" or equivalent.
- ALWAYS end with a genre-feel tag ("FF6-overworld feel", "epic alpine vista feel", etc.).
- Body is 60-90 words.

━━━ BANS ━━━
- NO characters / heroes / NPCs in the vista — scene-as-hero only.
- NO photoreal language — 16-bit SNES pixel-art register.
- NO smooth-gradient language — hard pixel-edged layers only.
- NO city / modern-urban vistas — fantasy/RPG-coded settings only.
- NO sky-only descriptions — sky is the sky_or_backdrop axis, this is LANDFORM.

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering, one entry per string.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
