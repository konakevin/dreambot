#!/usr/bin/env node
/**
 * MangaBot anime-rain — bespoke axis pools (Stage I1, SHADOW). The Garden-of-Words
 * register: rain-soaked shrine steps, shared-umbrella moments, puddle reflections,
 * hydrangeas in June rain, rain on train windows. The RAIN is the hero. Culture-coded
 * from gen #1 (anime-canon touchpoints in the recipe, NEVER in output). 7 pools:
 *   rain_scene / rain_play (MONEY) / water_reflection / weather_air / camera_framing
 *   (MANDATORY, anti-hero-portrait) / emotional_dna / figure_moment (60%-gated).
 * Run: node scripts/gen-seeds/mangabot/gen-anime-rain-pools.js
 */
const { generatePool } = require('../../lib/seedGenHelper');
const DIR = 'scripts/bots/mangabot/seeds/';

(async () => {
  // rain_scene — the place + rain interplay (the HERO scene).
  await generatePool({
    outPath: DIR + 'anime_rain_rain_scene.json',
    total: 120,
    append: true,
    batch: 25,
    metaPrompt: (n) => `You are writing ${n} RAIN-SCENE descriptions for MangaBot's anime-rain path — the place-plus-rain interplay that is the HERO of the frame. The register is Makoto Shinkai's "The Garden of Words" and "5 Centimeters per Second" plus the Japanese June rainy season (tsuyu): lush, saturated, quietly beautiful rain. (These names are register anchors for YOU — never write them in the output.)

Each entry: 18-30 words. ONE specific rain-soaked Japanese place, the rain woven through it. NO characters as the focus (the rain + place is the hero). NO named anime titles/characters in the output.

Variety mandate — distribute across: rain-soaked stone shrine steps under dripping trees; a garden pavilion in a downpour with a pond ringed by ripples; a narrow old-town alley of wet paving and glowing shop-signs; hydrangeas heavy with June rain along a temple wall; rain sheeting off tiled temple eaves; a wet crosswalk under umbrellas at dusk; a park gazebo in summer rain over a lily pond; rain streaming down a train-station window over a green valley; a mossy garden path with rain-jeweled ferns; a canal-side street in silver rain; a bamboo grove hissing with rain; a rain-break with sun piercing the last drops.

Include a few (~20%) "rain event" entries: a sudden downpour breaking, or a bright sun-shower with rain still falling.

HARD BANS: NO named anime/characters in output, NO people as the focus, NO sadness/tears/crying (quiet beauty only), NO photoreal, NO English/Japanese legible signage text. Return ONLY a JSON array of ${n} strings.`,
  });

  // rain_play — MONEY-SHOT: how the rain catches light.
  await generatePool({
    outPath: DIR + 'anime_rain_rain_play.json',
    total: 120,
    append: true,
    batch: 25,
    metaPrompt: (n) => `You are writing ${n} RAIN-PLAY descriptions for MangaBot's anime-rain path — the MONEY-SHOT axis: exactly HOW the rain catches light and moves (the shimmering detail that makes a Garden-of-Words rain frame sing). Each entry 12-22 words.

Variety mandate — rain-beads sliding down a glass pane catching the light; silver streaks of rain against dark wet greens; concentric ripple-rings spreading across a puddle; rain haloed gold around a lantern; droplets hanging jeweled on a leaf-tip; a fine misting drizzle softening the far view; fat drops splashing crowns on stone; rain drawing bright vertical lines through a shaft of light; spray misting off a tiled eave; rain dimpling the still surface of a pond; backlit rain glittering like falling glass; wet reflections streaking neon into long ribbons.

HARD BANS: rain-light detail only (no full scene/characters), no legible text, no photoreal. Return ONLY a JSON array of ${n} strings.`,
  });

  // water_reflection — the reflected world.
  await generatePool({
    outPath: DIR + 'anime_rain_water_reflection.json',
    total: 120,
    append: true,
    batch: 25,
    metaPrompt: (n) => `You are writing ${n} WATER-REFLECTION descriptions for MangaBot's anime-rain path — the reflected world in wet surfaces (a signature of the register). Each entry 10-20 words.

Variety mandate — glowing shop-signs smeared into long ribbons across a wet crosswalk; a red torii mirrored broken in a rain-puddle; warm window-light pooled on wet paving; the grey sky and umbrella-shapes doubled in a flooded gutter; a lantern's reflection wobbling in ripples; green trees mirrored in a still garden pond; neon reflected in a rain-slick alley; a bridge lamp trailing gold down wet stone.

HARD BANS: reflection detail only, no legible text, no characters as focus, no photoreal. Return ONLY a JSON array of ${n} strings.`,
  });

  // weather_air — the atmosphere of the rain.
  await generatePool({
    outPath: DIR + 'anime_rain_weather_air.json',
    total: 120,
    append: true,
    batch: 25,
    metaPrompt: (n) => `You are writing ${n} WEATHER-AIR descriptions for MangaBot's anime-rain path — the atmosphere and air of the rain (mist, haze, humidity, temperature-feel). Each entry 8-16 words.

Variety mandate — warm humid June air thick with the green smell of rain; low mist rising off wet stone; a soft grey-silver overcast diffusing all shadow; steam curling off warm pavement in a summer shower; cool damp air after the downpour; distant haze softening the far rooftops; the hush of steady rain; petrichor and wet-earth freshness; drifting drizzle veiling the background.

HARD BANS: atmosphere only, no scene/characters, no photoreal. Return ONLY a JSON array of ${n} strings.`,
  });

  // camera_framing — MANDATORY, anti-hero-portrait.
  await generatePool({
    outPath: DIR + 'anime_rain_camera_framing.json',
    total: 30,
    append: true,
    batch: 25,
    metaPrompt: (n) => `You are writing ${n} CAMERA-FRAMING descriptions for MangaBot's anime-rain path — the MANDATORY driving camera angle. Each entry 10-20 words. The RAIN + PLACE is the hero, so the framing must NEVER be a hero-portrait or a centered close-up face.

⚠️ ANTI-HERO-PORTRAIT: never "close-up on a face", never a centered character portrait. Framings are scene/rain-led.

Variety mandate — a low angle looking up through rain past dripping eaves; a wide establishing shot of the rain-soaked place; a from-behind over-the-shoulder of a small umbrella figure looking into the scene; a tight macro on rain-beads on glass with the world blurred beyond; a reflection-led shot composed in a puddle; a high angle down onto umbrellas and wet paving; a through-a-rain-streaked-window frame; a 3/4 architectural angle with rain sheeting across it; a deep one-point-perspective down a wet alley.

HARD BANS: NO hero-portrait / NO centered close-up face / NO back-to-camera-as-subject cheese; framing is scene-led. Return ONLY a JSON array of ${n} strings.`,
  });

  // emotional_dna — the felt mood.
  await generatePool({
    outPath: DIR + 'anime_rain_emotional_dna.json',
    total: 24,
    append: true,
    batch: 24,
    metaPrompt: (n) => `You are writing ${n} EMOTIONAL-DNA phrases for MangaBot's anime-rain path — the quiet felt mood of a Garden-of-Words rain frame. Each entry 6-14 words. Quiet beauty, gentle longing, calm — NEVER sadness-porn or tears.

Variety mandate — a hushed, suspended calm; gentle wistful longing; the cozy shelter of an umbrella; quiet wonder at the rain's beauty; a peaceful solitude; a tender in-between moment; the fresh hope of a clearing sky; unhurried stillness.

HARD BANS: no crying/tears/grief, no drama, mood only. Return ONLY a JSON array of ${n} strings.`,
  });

  // figure_moment — 60%-gated small engaged umbrella figure.
  await generatePool({
    outPath: DIR + 'anime_rain_figure_moment.json',
    total: 120,
    append: true,
    batch: 25,
    metaPrompt: (n) => `You are writing ${n} FIGURE-MOMENT descriptions for MangaBot's anime-rain path — a SMALL background/midground figure (5-15% of frame) that gives the rain-scene human scale. The figure is ENGAGED in a quiet action (never posing, never gazing blankly at the camera, never a hero close-up). Role only — NEVER a named character.

Each entry: 12-22 words. A small figure doing something in the rain.

Variety mandate — a lone figure under a clear umbrella pausing on shrine steps; a schoolgirl-silhouette closing a dripping umbrella under an eave; a figure crouched watching ripples spread in a puddle; two small figures sharing one umbrella crossing a wet street; a figure sheltering under a gazebo sketching the rain; a small figure adjusting an umbrella against the wind; a figure stepping over puddles down an alley; a figure leaning on a station rail watching rain on the glass.

HARD BANS: figure is SMALL (5-15%), engaged, NEVER a hero-portrait / close-up face / back-to-camera cheese; role only, NO named characters, NO sadness/crying. Return ONLY a JSON array of ${n} strings.`,
  });

  console.log('\n✅ All 7 anime-rain pools generated.');
})().catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
