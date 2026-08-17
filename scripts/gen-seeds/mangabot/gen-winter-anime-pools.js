#!/usr/bin/env node
/**
 * MangaBot winter-anime — bespoke axis pools (Stage I3, SHADOW). Snow-country anime:
 * first-snow streets, snow festivals with ice lanterns, kotatsu-window glow seen from
 * outside, shrine torii in snowfall, breath-clouds under station lights. The warm-vs-
 * cold contrast is the signature. Culture-coded (Erased / Laid-Back Camp winter register).
 * Torii/shrine allowed (reverent, no worship close-ups). 7 pools. NO legible text.
 * Run: node scripts/gen-seeds/mangabot/gen-winter-anime-pools.js
 */
const { generatePool } = require('../../lib/seedGenHelper');
const DIR = 'scripts/bots/mangabot/seeds/';

(async () => {
  // winter_scene — the hero snow scene.
  await generatePool({
    outPath: DIR + 'winter_anime_winter_scene.json',
    total: 120,
    append: true,
    batch: 25,
    metaPrompt: (n) => `You are writing ${n} WINTER-SCENE descriptions for MangaBot's winter-anime path — snow-country Japan through an anime lens, register of "Erased" (Hokkaido winter town) and "Laid-Back Camp" winter trips. (Those names are register anchors for YOU — never write them in the output.)

Each entry: 18-30 words. ONE specific snowy Japanese scene. The warm-vs-cold contrast (warm light against cold snow) is the soul of the register.

Variety mandate — distribute across: a first-snow shopping street with warm shop-glow on fresh snow; a snow festival lane lined with carved ice lanterns; a kotatsu-lit house window glowing warm seen from the cold street outside; a shrine torii standing in gentle snowfall (reverent, distant, no one worshipping close-up); breath-clouds under a lonely station platform light; a snowy mountain hot-spring town with steam rising; a red vending machine glowing in a white lane; a snow-covered residential street under warm street-lamps; a frozen river under a snow-dusted bridge; a lantern-lit snow-festival stall row; a torii and stone lanterns capped with snow at dusk; a convenience-store glow warm on a snowbank at night.

Include a few (~15%) "winter event" entries: festival fireworks blooming over the snow, or the moment ice-lanterns are being lit at dusk.

HARD BANS: NO named anime/characters in output, NO worshippers-in-prayer close-ups (torii/shrine only as reverent scenery), NO legible signage text, NO photoreal. Return ONLY a JSON array of ${n} strings.`,
  });

  // snow_state — MONEY-SHOT: how the snow reads.
  await generatePool({
    outPath: DIR + 'winter_anime_snow_state.json',
    total: 120,
    append: true,
    batch: 25,
    metaPrompt: (n) => `You are writing ${n} SNOW-STATE descriptions for MangaBot's winter-anime path — the MONEY-SHOT axis: exactly how the snow looks and moves. Each entry 10-20 words.

Variety mandate — fat soft flakes drifting slowly through warm lamplight; fresh untouched powder blanketing everything smooth; a light blizzard blurring the far view to white; snow glittering under a street-lamp; wet heavy snow clinging to branches and wires; a fine dry snow-sift hissing across the street; snow piled in soft rounded caps on posts and roofs; flakes caught golden in a shop's window-glow; sparkling frost on a cold clear night; snow swirling in an eddy of wind; the first tentative flakes of a first snow.

HARD BANS: snow detail only (no full scene/characters), no legible text, no photoreal. Return ONLY a JSON array of ${n} strings.`,
  });

  // warm_glow — the warm-vs-cold light source.
  await generatePool({
    outPath: DIR + 'winter_anime_warm_glow.json',
    total: 120,
    append: true,
    batch: 25,
    metaPrompt: (n) => `You are writing ${n} WARM-GLOW descriptions for MangaBot's winter-anime path — the warm light source that contrasts against the cold snow (the register's signature). Each entry 8-16 words.

Variety mandate — warm amber glow spilling from a kotatsu-lit house window; a red vending machine glowing in the snow; paper-lantern and shop-sign glow warm on white; carved ice-lanterns lit with candle-warmth inside; a convenience-store's fluorescent-and-warm glow on a snowbank; warm street-lamp pools on fresh snow; the orange glow of a festival stall; firelight from a brazier; the warm-lit windows of a passing train; a lit torii lamp against the blue snow-dusk.

HARD BANS: warm-light-source detail only, no full scene/characters, no legible text. Return ONLY a JSON array of ${n} strings.`,
  });

  // weather_air — the cold atmosphere.
  await generatePool({
    outPath: DIR + 'winter_anime_weather_air.json',
    total: 120,
    append: true,
    batch: 25,
    metaPrompt: (n) => `You are writing ${n} WEATHER-AIR descriptions for MangaBot's winter-anime path — the cold atmosphere and air. Each entry 8-16 words.

Variety mandate — crisp still cold air with visible breath-clouds; a soft grey snow-sky diffusing all light; blue-hour cold with the first stars; a hushed muffled snow-silence; steam rising from a hot-spring or a manhole into the freezing air; sharp clear starlit cold; a gentle windless snowfall; the deep blue of a snow-dusk; misty cold breath under a lamp.

HARD BANS: atmosphere only, no scene/characters, no photoreal. Return ONLY a JSON array of ${n} strings.`,
  });

  // camera_framing — MANDATORY, anti-hero-portrait.
  await generatePool({
    outPath: DIR + 'winter_anime_camera_framing.json',
    total: 30,
    append: true,
    batch: 25,
    metaPrompt: (n) => `You are writing ${n} CAMERA-FRAMING descriptions for MangaBot's winter-anime path — the MANDATORY driving camera angle. Each entry 10-20 words. The SNOW + PLACE + warm-glow is the hero, so never a hero-portrait or centered close-up face.

Variety mandate — a wide establishing shot down a snow-covered street; a from-behind over-the-shoulder of a small figure looking at glowing windows; a low angle up at snow falling through a lamp's cone of light; a warm-window-framed view from the cold outside; a high angle down onto snowy rooftops and a lit lane; a torii framing the snowy scene beyond; a 3/4 angle on a lit vending machine in the snow; a deep one-point-perspective down a snow-festival lane of ice-lanterns; a platform-level frame with breath-cloud and station light.

HARD BANS: NO hero-portrait / NO centered close-up face / NO back-to-camera-as-subject cheese; framing is scene-led. Return ONLY a JSON array of ${n} strings.`,
  });

  // emotional_dna.
  await generatePool({
    outPath: DIR + 'winter_anime_emotional_dna.json',
    total: 24,
    append: true,
    batch: 24,
    metaPrompt: (n) => `You are writing ${n} EMOTIONAL-DNA phrases for MangaBot's winter-anime path — the quiet felt mood of a snow-country anime frame. Each entry 6-14 words. Cozy, hushed, nostalgic warmth-in-the-cold — never grief.

Variety mandate — cozy warmth against the cold; a hushed snowy calm; nostalgic winter longing; the comfort of a lit window; quiet festival wonder; a peaceful solitude in the snow; gentle anticipation; the still magic of first snow.

HARD BANS: no crying/grief/drama, mood only. Return ONLY a JSON array of ${n} strings.`,
  });

  // figure_moment — 50%-gated small engaged figure.
  await generatePool({
    outPath: DIR + 'winter_anime_figure_moment.json',
    total: 120,
    append: true,
    batch: 25,
    metaPrompt: (n) => `You are writing ${n} FIGURE-MOMENT descriptions for MangaBot's winter-anime path — a SMALL figure (5-15% of frame) giving the snow-scene human scale. ENGAGED in a quiet winter action, never a hero close-up, never posing. Role only — NEVER a named character.

Each entry: 12-22 words.

Variety mandate — a small bundled-up figure walking through the snow with breath clouding; a figure buying a hot drink from a glowing vending machine; a child-silhouette catching flakes with an outstretched mitten; a figure pausing under a lit shop-window in the snow; a bundled figure sweeping snow from a doorstep; two small figures sharing a warm drink at a festival stall; a figure crossing a snowy bridge, scarf trailing; a small figure warming hands at a brazier.

HARD BANS: figure is SMALL (5-15%), engaged, NEVER a hero-portrait / close-up face / back-to-camera cheese; role only, NO named characters, NO sadness/crying, NO worshippers-praying, NO legible text. Return ONLY a JSON array of ${n} strings.`,
  });

  console.log('\n✅ All 7 winter-anime pools generated.');
})().catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
