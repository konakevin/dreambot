#!/usr/bin/env node
/**
 * MangaBot night-touge — bespoke axis pools (Stage I4, SHADOW). Initial-D lineage:
 * 90s-era Japanese sports cars drifting mountain passes at night, neon wangan
 * highways, vending-machine glow pit stops, headlight trails through hairpins.
 * First vehicle path. hero_car = era-coded NON-IP MORPHOLOGICAL descriptions
 * (white coupe with pop-up headlights, boxy silver sedan) — NEVER name real models
 * (AE86/RX-7 are IP-adjacent; decided non-IP 2026-08-15, flag Kevin). Anime cel
 * register (look carries it); speed READS (motion lines OK in anime idiom); no
 * crashes / no danger-glamor; NO legible text. 7 pools.
 * Run: node scripts/gen-seeds/mangabot/gen-night-touge-pools.js
 */
const { generatePool } = require('../../lib/seedGenHelper');
const DIR = 'scripts/bots/mangabot/seeds/';

(async () => {
  // touge_scene — the hero pass/road scene.
  await generatePool({
    outPath: DIR + 'night_touge_touge_scene.json',
    total: 120,
    append: true,
    batch: 25,
    metaPrompt: (n) => `You are writing ${n} TOUGE-SCENE descriptions for MangaBot's night-touge path — the mountain-pass street-driving register of "Initial D" (90s Japanese touge + wangan night driving). (That name is a register anchor for YOU — never write it in the output.)

Each entry: 16-28 words. ONE specific night driving scene. The road + night + car is the hero.

Variety mandate — distribute across: a tight mountain-pass hairpin with guardrails and a valley of city-lights far below; a downhill S-curve run through dark forested switchbacks; a neon-lit elevated wangan bay-shore highway; a long dim mountain tunnel with strip-lights streaking past; a summit parking-area meet with cars pulled up under sodium lamps; a misty ridge road with the tree-line rushing by; a pass under a full moon with the road snaking down; a guardrail-lined bend slick with night dew; a bridge over a dark ravine; a switchback with a vending-machine glow at the corner.

HARD BANS: NO named anime/characters/car-models in output, NO crashes/wrecks/danger-glamor, NO legible signage text, NO photoreal. Return ONLY a JSON array of ${n} strings.`,
  });

  // hero_car — NON-IP morphological car.
  await generatePool({
    outPath: DIR + 'night_touge_hero_car.json',
    total: 120,
    append: true,
    batch: 25,
    metaPrompt: (n) => `You are writing ${n} HERO-CAR descriptions for MangaBot's night-touge path — a 90s-era Japanese sports car, described by its SHAPE and era ONLY (morphological), NEVER by a real model/brand name. Each entry 12-22 words.

⚠️ NON-IP: describe the car's silhouette/features, NEVER a real make or model. NO badges, NO brand names, NO legible plates.

Variety mandate — a boxy 90s white two-door coupe with pop-up headlights; a low silver hatchback with a rear spoiler; a wide-body red coupe with round tail-lights; a compact boxy sedan in matte black; a curvy 90s roadster with the top up; a blocky rally-style hatch with fog lamps; a sleek dark GT coupe with hidden headlights; a two-tone panda-colored old-school coupe (black-and-white); a wedge-shaped silver sports car; a small nimble hot-hatch with steel wheels; a long-nosed grand-tourer coupe.

HARD BANS: NO real make/model names, NO brand badges, NO legible license plates, NO modern/futuristic cars (keep it 80s-90s). Return ONLY a JSON array of ${n} strings.`,
  });

  // motion_signature — MONEY-SHOT.
  await generatePool({
    outPath: DIR + 'night_touge_motion_signature.json',
    total: 120,
    append: true,
    batch: 25,
    metaPrompt: (n) => `You are writing ${n} MOTION-SIGNATURE descriptions for MangaBot's night-touge path — the MONEY-SHOT axis: how the SPEED and drift read (anime motion idiom). Each entry 10-20 words. Speed READS — anime motion-lines / streaked lights are welcome.

Variety mandate — the car sideways mid-drift with white tire-smoke curling off the rear; headlight beams streaking as long light-trails through a hairpin; speed-lines blurring the guardrails past the car; sparks flicking from the undertray on a dip; tire-smoke lit red by tail-lights; the car countersteering at full opposite-lock; a long-exposure ribbon of tail-lights down the pass; blurred forest walls rushing past; the front wheels turned hard into the apex; a plume of smoke and gravel off the shoulder.

HARD BANS: motion detail only, no crashes, no legible text, no photoreal. Return ONLY a JSON array of ${n} strings.`,
  });

  // night_light — the night light sources.
  await generatePool({
    outPath: DIR + 'night_touge_night_light.json',
    total: 120,
    append: true,
    batch: 25,
    metaPrompt: (n) => `You are writing ${n} NIGHT-LIGHT descriptions for MangaBot's night-touge path — the night light sources. Each entry 8-16 words.

Variety mandate — orange sodium street-lamps pooling on the tarmac; the warm glow of the dashboard on the driver's face; a distant city-bowl of lights sparkling below the pass; a glowing vending machine at a dark corner; cold blue-white tunnel strip-lights; neon signs smearing across a wet wangan road; a full moon silvering the ridge; red tail-lights glowing in the dark; headlights carving a cone through the night mist.

HARD BANS: light-source detail only, no full scene/characters, no legible text. Return ONLY a JSON array of ${n} strings.`,
  });

  // camera_framing — MANDATORY.
  await generatePool({
    outPath: DIR + 'night_touge_camera_framing.json',
    total: 30,
    append: true,
    batch: 25,
    metaPrompt: (n) => `You are writing ${n} CAMERA-FRAMING descriptions for MangaBot's night-touge path — the MANDATORY driving camera angle (the CAR + ROAD + SPEED is the hero, never a driver-face close-up). Each entry 10-20 words.

Variety mandate — a low chase-cam right behind the car through a hairpin; a guardrail-height pan tracking the car past; a car bursting from a tunnel mouth toward the camera; a high angle down onto the switchbacks with the car small; a from-inside-over-the-hood view down the dark road; a wide establishing shot of the pass with the car mid-corner; a rear 3/4 as the car drifts away sideways; a low front 3/4 with headlights flaring; a bird's-eye of the road snaking down to the city lights.

HARD BANS: NO driver-face close-up / NO hero-portrait / NO static posed car; framing is motion/road-led. Return ONLY a JSON array of ${n} strings.`,
  });

  // emotional_dna.
  await generatePool({
    outPath: DIR + 'night_touge_emotional_dna.json',
    total: 24,
    append: true,
    batch: 24,
    metaPrompt: (n) => `You are writing ${n} EMOTIONAL-DNA phrases for MangaBot's night-touge path — the felt mood of a night mountain-pass drive. Each entry 6-14 words. Cool focus, adrenaline, night-solitude, 90s nostalgia — never danger-fear.

Variety mandate — cool focused adrenaline; the flow-state of a perfect run; night-drive solitude; 90s neon nostalgia; quiet tension before the corner; the thrill of speed; a calm midnight cruise; the hush between hairpins.

HARD BANS: no fear/crashes/drama, mood only. Return ONLY a JSON array of ${n} strings.`,
  });

  // street_detail — 40%-gated.
  await generatePool({
    outPath: DIR + 'night_touge_street_detail.json',
    total: 30,
    append: true,
    batch: 25,
    metaPrompt: (n) => `You are writing ${n} STREET-DETAIL descriptions for MangaBot's night-touge path — a gated small roadside detail that grounds the night scene. Each entry 8-16 words. NO legible text/signage.

Variety mandate — a glowing vending machine cluster at a dark pullout; a guardrail with faded reflectors catching the headlights; a road-sign silhouette (blank, no readable text) at a bend; scattered cones marking a corner; a lone snack-stand shuttered for the night; a mirror on a pole at a blind hairpin; oil-stained tarmac at a well-used apex; a chain-link fence above the ravine; a parked car's silhouette at the summit meet.

HARD BANS: NO legible text/kanji/signage words, NO people as focus, no crashes. Return ONLY a JSON array of ${n} strings.`,
  });

  console.log('\n✅ All 7 night-touge pools generated.');
})().catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
