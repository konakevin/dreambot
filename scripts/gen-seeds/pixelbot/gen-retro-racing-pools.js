#!/usr/bin/env node
/**
 * PixelBot retro-racing — bespoke axis pools (Stage K2, SHADOW). The OutRun register:
 * a pixel sports car on a coastal highway at sunset, palm parallax, dithered horizon
 * bands, mountain switchbacks, desert straights. 16-bit ARCADE pixel-art (NOT anime,
 * NOT MangaBot night-touge — that's anime-cel night; THIS is 16-bit sunset arcade).
 * Car is MORPHOLOGICAL (low red coupe), NO real models. NO text/signage. 4 pools.
 * Run: node scripts/gen-seeds/pixelbot/gen-retro-racing-pools.js
 */
const { generatePool } = require('../../lib/seedGenHelper');
const DIR = 'scripts/bots/pixelbot/seeds/';

(async () => {
  // route_scene — the route + setting.
  await generatePool({
    outPath: DIR + 'pixelbot_retro_racing_route_scene.json',
    total: 120,
    append: true,
    batch: 25,
    maxTokens: 8000,
    metaPrompt: (n) => `You are writing ${n} ROUTE-SCENE descriptions for PixelBot's retro-racing path — the classic 16-bit arcade racing route in the OutRun / Rad Racer / Top Gear register: a pixel sports car on an open highway through a beautiful setting. 16-bit SNES/arcade pixel-art game screenshot.

Each entry: 18-30 words. ONE specific racing route + its setting/scenery. NO real car models, NO readable signage.

Variety mandate — distribute across: a coastal highway hugging a sparkling sea at sunset with palm trees; a mountain switchback climbing through pine forest; a desert straight shimmering under a low sun with mesas; a dusk city-outskirts road with distant skyline; a beach straight beside dunes and surf; a canyon road between red-rock walls; a countryside highway through golden fields; a lakeside road with a bridge; a cliff-edge coastal sweeper; an autumn forest road with drifting leaves.

━━━ BANS ━━━
- NO readable text / signage / billboards-with-text / labels
- NO real car makes/models, NO IP references
- NO anime-cel look (this is 16-bit ARCADE pixel-art, not MangaBot night-touge); NO night-only (this register is SUNSET/day arcade)
- 16-bit pixel-art only, NO smooth illustration
Return ONLY a JSON array of ${n} strings.`,
  });

  // horizon_bands — MONEY-SHOT: the dithered sunset gradient + parallax.
  await generatePool({
    outPath: DIR + 'pixelbot_retro_racing_horizon_bands.json',
    total: 120,
    append: true,
    batch: 25,
    maxTokens: 8000,
    metaPrompt: (n) => `You are writing ${n} HORIZON-BANDS descriptions for PixelBot's retro-racing path — the MONEY-SHOT axis: the iconic 16-bit dithered sunset gradient sky + parallax scenery layers that define the arcade-racing look. Each entry 12-22 words.

Variety mandate — a big pixel sun sinking into dithered orange-to-purple horizon bands; palm silhouettes scrolling in parallax against the sunset; layered mountain ridges receding in dithered blue haze; a striped orange-pink-purple gradient sky with a chunky sun disc; ocean glinting in dithered highlights below the sun; clouds as dithered pink bands; a desert horizon shimmering in heat-band dither; twilight blue-to-magenta bands with the first pixel stars; a low sun flaring across the road in pixel rays.

━━━ BANS ━━━
- horizon/sky/parallax detail only, no car/road-action, no text
- 16-bit dithered pixel-art (chunky bands), NO smooth gradient illustration
Return ONLY a JSON array of ${n} strings.`,
  });

  // race_moment — verb-led race action.
  await generatePool({
    outPath: DIR + 'pixelbot_retro_racing_race_moment.json',
    total: 120,
    append: true,
    batch: 25,
    maxTokens: 8000,
    metaPrompt: (n) => `You are writing ${n} RACE-MOMENT descriptions for PixelBot's retro-racing path — the verb-led racing action of the pixel sports car (described MORPHOLOGICALLY, never a real model). Each entry 15-25 words, OPENING with an action verb. 16-bit arcade car sprite.

The car: a low sleek pixel sports coupe (red / white / blue), convertible or hardtop — described by SHAPE only, never a real make/model.

Variety mandate — cresting a hill with the road dropping away ahead; drifting a fast sweeper with a puff of pixel smoke; overtaking a rival car on a straight; kicking up dust on a desert bend; spray flying as it hugs a coastal curve; blasting down a palm-lined straight toward the sun; leaning hard into a mountain hairpin; bursting from shadow into golden light; tail sliding through a banked curve; rocketing over a bridge.

━━━ BANS ━━━
- NO real car makes/models, NO IP references, NO readable text/plates
- NO crashes, NO anime-cel look (16-bit arcade sprite)
Return ONLY a JSON array of ${n} strings.`,
  });

  // roadside_detail — 40%-gated.
  await generatePool({
    outPath: DIR + 'pixelbot_retro_racing_roadside_detail.json',
    total: 30,
    append: true,
    batch: 25,
    maxTokens: 8000,
    metaPrompt: (n) => `You are writing ${n} ROADSIDE-DETAIL descriptions for PixelBot's retro-racing path — a gated small roadside element grounding the arcade route. Each entry 10-18 words. NO readable text.

Variety mandate — a row of palm trees flicking past; a checkpoint arch spanning the road (no text); a blank billboard silhouette; roadside guardrails and reflector posts; a lighthouse on a far headland; striped roadside barriers; a windmill in a field; a gas-station silhouette (no signage); cacti along a desert verge; a scattering of confetti over a start/finish arch (no text); pixel birds over the sea.

━━━ BANS ━━━
- NO readable text / signage-with-letters / billboards-with-text / labels
- NO IP references, 16-bit pixel-art only
Return ONLY a JSON array of ${n} strings.`,
  });

  console.log('\n✅ All 4 retro-racing pools generated.');
})().catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
