#!/usr/bin/env node
/**
 * MangaBot anime-trains — bespoke axis pools (Stage I2, SHADOW). THE anime motif:
 * countryside single-car trains at golden hour, level-crossing moments, train
 * interiors with sunset windows, seaside track curves (5cm/sec + Spirited-Away
 * sea-train lineage). Real JR-style rolling stock, NO IP liveries, NO legible text.
 * ZERO overlap with DreamBot dream-express (that = impossible worlds, never Japan).
 * Culture-coded from gen #1. 7 pools. Run: node scripts/gen-seeds/mangabot/gen-anime-trains-pools.js
 */
const { generatePool } = require('../../lib/seedGenHelper');
const DIR = 'scripts/bots/mangabot/seeds/';

(async () => {
  // train_scene — the hero train scene.
  await generatePool({
    outPath: DIR + 'anime_trains_train_scene.json',
    total: 120,
    append: true,
    batch: 25,
    metaPrompt: (n) => `You are writing ${n} TRAIN-SCENE descriptions for MangaBot's anime-trains path — the classic anime train motif, register of Makoto Shinkai's "5 Centimeters per Second" and quiet countryside Japan. (Those names are register anchors for YOU — never write them in the output.)

Each entry: 18-30 words. ONE specific Japanese train scene. Real ordinary JR-style / rural single-car rolling stock — NEVER a branded/IP livery, NEVER a fantasy/impossible train (this is realistic Japan, NOT a dream world).

Variety mandate — distribute across: a single-car local train at a rural level crossing, gates down, signal blinking; a countryside platform at golden hour with one waiting figure; a train interior with warm sunset flooding the windows and empty seats; a seaside track curve with a train hugging the coast above the sea; a train crossing a rice-field line in summer; a small unmanned country station in evening light; a train on an elevated track over a river valley; a snowy branch-line platform; a two-car train pulling out past cherry trees; a train stopped at a mountain halt in mist; a level crossing at blue-hour dusk with red signal lights.

Include a few (~15%) "train event" entries: the crossing bell ringing with the barrier coming down and wind kicking up, or a train bursting from a tunnel into golden light.

HARD BANS: NO named anime/characters in output, NO IP/branded train liveries, NO fantasy/impossible/floating trains (realistic Japan only), NO legible station/train text, NO photoreal. Return ONLY a JSON array of ${n} strings.`,
  });

  // light_moment — MONEY-SHOT.
  await generatePool({
    outPath: DIR + 'anime_trains_light_moment.json',
    total: 120,
    append: true,
    batch: 25,
    metaPrompt: (n) => `You are writing ${n} LIGHT-MOMENT descriptions for MangaBot's anime-trains path — the MONEY-SHOT axis: the exact light that makes an anime train frame ache. Each entry 12-22 words.

Variety mandate — warm sunset flooding golden through the train windows across empty seats; a level-crossing signal glowing red against a deep-blue dusk; long golden-hour light raking down the platform; the train's headlight cutting through evening mist; window-light spilling warm onto a dark platform; low sun flaring off the wet rails; sunset silhouetting the train against an orange sky; dawn's first pale gold on a country halt; the green signal lamp in blue twilight; interior lights glowing warm as the sky goes indigo outside.

HARD BANS: light detail only, no legible text, no photoreal. Return ONLY a JSON array of ${n} strings.`,
  });

  // season_air — the season + atmosphere.
  await generatePool({
    outPath: DIR + 'anime_trains_season_air.json',
    total: 120,
    append: true,
    batch: 25,
    metaPrompt: (n) => `You are writing ${n} SEASON-AIR descriptions for MangaBot's anime-trains path — the season and atmosphere around the train. Each entry 8-16 words.

Variety mandate — warm summer haze with cicada-still air; crisp autumn light with red-maple drift; spring with cherry petals on the breeze; a still snowy hush; humid green early-summer air; a golden late-afternoon warmth; cool blue evening after rain; misty mountain morning; the dry gold of harvest-season rice fields.

HARD BANS: season/atmosphere only, no scene/train/characters. Return ONLY a JSON array of ${n} strings.`,
  });

  // landscape_beyond — the countryside beyond the train.
  await generatePool({
    outPath: DIR + 'anime_trains_landscape_beyond.json',
    total: 120,
    append: true,
    batch: 25,
    metaPrompt: (n) => `You are writing ${n} LANDSCAPE-BEYOND descriptions for MangaBot's anime-trains path — the Japanese countryside spanning beyond the train/track (the world the line runs through). Each entry 10-20 words.

Variety mandate — green terraced rice paddies rolling to misty hills; a sparkling summer sea beyond the coastal track; distant blue mountains under a wide sky; a small town nestled in a valley below; cherry-tree rows along an embankment; a river winding through the plain; golden autumn rice fields; snow-blanketed farmland; power-lines marching to the horizon over fields; a lighthouse on a far headland above the sea.

HARD BANS: landscape only, no train/characters as focus, no legible text, no photoreal. Return ONLY a JSON array of ${n} strings.`,
  });

  // camera_framing — MANDATORY, anti-hero-portrait.
  await generatePool({
    outPath: DIR + 'anime_trains_camera_framing.json',
    total: 30,
    append: true,
    batch: 25,
    metaPrompt: (n) => `You are writing ${n} CAMERA-FRAMING descriptions for MangaBot's anime-trains path — the MANDATORY driving camera angle. Each entry 10-20 words. The TRAIN + LANDSCAPE + LIGHT is the hero, so never a hero-portrait or centered close-up face.

Variety mandate — a low trackside angle as the train passes 3/4; a wide establishing shot of the train small in the landscape; from inside the train looking down the empty aisle to the sunset windows; over-the-shoulder of a small seated passenger looking out; a level-crossing frame with the barrier arm cutting across; a high angle down onto the platform and tracks; a from-behind shot down the receding rails to a vanishing point; a seaside pull-back with the train hugging the coast; a platform-edge frame as the train pulls in.

HARD BANS: NO hero-portrait / NO centered close-up face / NO back-to-camera-as-subject cheese; framing is scene-led. Return ONLY a JSON array of ${n} strings.`,
  });

  // emotional_dna.
  await generatePool({
    outPath: DIR + 'anime_trains_emotional_dna.json',
    total: 24,
    append: true,
    batch: 24,
    metaPrompt: (n) => `You are writing ${n} EMOTIONAL-DNA phrases for MangaBot's anime-trains path — the quiet felt mood of an anime train frame. Each entry 6-14 words. Wistful, nostalgic, calm — the ache of travel and distance, but gentle (never grief).

Variety mandate — the quiet ache of departure; nostalgic longing; a suspended in-between calm; the peace of a slow country journey; gentle anticipation; a bittersweet farewell warmth; unhurried solitude; the hush of an empty carriage.

HARD BANS: no crying/grief/drama, mood only. Return ONLY a JSON array of ${n} strings.`,
  });

  // passenger_glimpse — 50%-gated small seated engaged figure.
  await generatePool({
    outPath: DIR + 'anime_trains_passenger_glimpse.json',
    total: 120,
    append: true,
    batch: 25,
    metaPrompt: (n) => `You are writing ${n} PASSENGER-GLIMPSE descriptions for MangaBot's anime-trains path — a SINGLE small figure (a passenger or a person at the platform/crossing) that gives the scene human scale. Small (5-15% of frame), ENGAGED, quiet — never a hero close-up, never posing. Role only — NEVER a named character.

Each entry: 12-22 words.

Variety mandate — a lone seated passenger gazing out the sunset window; a schoolgirl-silhouette waiting on an empty platform, bag over shoulder; a figure leaning on the platform rail watching the train pull in; a passenger's silhouette reading in a warm-lit carriage; a small figure standing at the level crossing as the train passes; a passenger resting a forehead against the cool window glass; a figure stepping down onto a country platform; a lone commuter far down the carriage.

HARD BANS: figure is SMALL (5-15%), engaged, NEVER a hero-portrait / close-up face / back-to-camera cheese; role only, NO named characters, NO sadness/crying, NO legible text. Return ONLY a JSON array of ${n} strings.`,
  });

  console.log('\n✅ All 7 anime-trains pools generated.');
})().catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
