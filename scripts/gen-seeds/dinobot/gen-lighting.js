#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/dinobot/seeds/lighting.json',
  total: 200,
  batch: 50,
  metaPrompt: (n) => `You are writing ${n} LIGHTING descriptions for DinoBot — IMAX cinematic prehistoric scenes (Prehistoric Planet × Avatar Pandora × Jurassic World wet-and-lush). Each entry is one specific lighting treatment in 14-22 words.

━━━ NON-NEGOTIABLE — VOLUMETRIC IS THE DEFAULT ━━━
Every entry MUST describe LIGHT YOU CAN SEE THROUGH — visible god-rays, sun-shafts, dust motes catching light, pollen suspended in beams, mist or haze SHAPED by light. Light is a CHARACTER in the frame, not just illumination.

━━━ CATEGORIES (spread across all entries) ━━━

VOLUMETRIC GOD-RAYS (heavy emphasis — 30%+ of entries):
- Cathedral god-rays slicing through dense fern canopy, pollen drifting in shafts, mist below
- Sun-shafts piercing storm-cloud breaks, single beam picking out a sauropod silhouette
- Vertical light pillars between mega-conifer trunks, dust motes filling the beams
- Backlit forest interior with horizontal sun-rays cutting through morning fog
- Dawn fog with sun-disc rising behind tree-fern silhouettes, beams radiating outward

WET / REFLECTIVE LIGHTING (20%+):
- Golden-hour bouncing off mirror-flat river, doubled dinosaur reflection
- Storm-light glistening on rain-slick scales, every wet ridge catching sky
- Sun-flare off water with spectral halos, dinosaur wading through reflected sky
- Rain falling through golden backlight, sheet-curtains of light
- Wet mud-flat at sunset, every footprint puddle holding a fragment of orange sky

ATMOSPHERIC / HAZED:
- Humid jungle haze diffusing canopy light into milky volumetric softness
- Dust-cloud lit from behind by raking low sun, herd silhouetted within
- Pollen-drift through golden hour, mega-fern fronds dappled
- Steam rising from a swamp at dawn, sun catching the columns of vapor
- Smoke-haze from distant volcanic vent, ash-light orange-grey

DRAMATIC / CONTRASTY:
- Stormlight chiaroscuro — pitch-dark forest with one shaft of cold blue light on the dinosaur
- Lightning-flash freezing motion in stark blue-white, motion blur trailing
- Volcano underglow casting orange uplight on dinosaur belly, pyroclastic-cloud backlight
- Eclipse-darkness with corona-rim light kissing every ridge of hide
- Night moonlight silvering wet hide, with bioluminescent fungi at the dinosaur's feet

GOLDEN HOUR / DAWN / DUSK:
- First-light pink-gold raking horizontal across a misty floodplain
- Late-amber dusk filtered through dust kicked up by a herd
- Pre-dawn cool-grey with one warm crack of magenta on the horizon
- Twilight blue with one ember-warm light source (volcano / fire-tree / setting sun) anchoring

BIOLUMINESCENT / EXOTIC:
- Firefly cloud at dusk speckling the air around a sleeping sauropod
- Glowing-fungi understory casting cold-cyan uplight on a foraging dinosaur
- Phosphorescent algae bloom in lagoon, dinosaur wading lit from below
- Auroral curtains over polar Mesozoic, green-violet light raking the snow

━━━ EVERY ENTRY MUST INCLUDE ━━━
- Specific light direction (raking / backlit / overhead / underlit / rim-lit)
- A visible volumetric or reflective element (god-ray / mist column / wet surface / pollen beam / haze)
- Cinematic descriptor (cathedral / chiaroscuro / mirror-flat / soft-diffuse / etc.)

━━━ DEDUP DIMENSIONS ━━━
Deduplicate by: time-of-day + light direction + volumetric element + dinosaur framing.

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
