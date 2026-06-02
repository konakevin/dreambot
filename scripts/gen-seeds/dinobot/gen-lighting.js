#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/dinobot/seeds/lighting.json',
  total: 200,
  batch: 50,
  metaPrompt: (
    n
  ) => `You are writing ${n} LIGHTING descriptions for DinoBot — Unreal Engine 5 cinematic paleoart. Each entry is 14-22 words specifying ONE lighting treatment.

━━━ NON-NEGOTIABLE — REBALANCE TOWARD CRISP RAY-TRACED LIGHTING ━━━
Distribute across these modes to fix over-foggy/over-hazy renders:
- ~50% RAY-TRACED CRISP (specular reflections, mirror water, sharp shadows, hard-edge sunlight)
- ~25% VOLUMETRIC ATMOSPHERIC (god-rays through haze, mist, fog — when the scene calls for it)
- ~15% DRAMATIC CONTRAST (chiaroscuro, lightning, storm-light, eclipse, volcano-glow)
- ~10% EXOTIC / BIOLUMINESCENT (firefly clouds, glowing fungi, aurora)

━━━ CATEGORIES ━━━

RAY-TRACED CRISP / SPECULAR / REFLECTIVE (heavy emphasis):
- Mirror-flat water at noon doubles every dinosaur in perfect ray-traced reflection
- Sharp midday hard-light with chrome-bright specular highlights on rain-slick hide
- Bright crisp sunlight on a herd, razor-sharp shadow architecture, no atmospheric diffusion
- Dawn over still water, surface reflecting sky and silhouette in glass-clear doubling
- Post-rain crystalline daylight, each droplet refracting like a tiny lens
- Hard-edge golden-hour with crisp shadows and rich saturation, no haze
- Sun-caustics dancing on shallow lake bed beneath wading dinosaur, ray-traced perfection
- Rim-light on wet hide outlining every scale ridge in chrome-bright specular
- Cold arctic clarity with razor-sharp distant peaks and crisp hard shadows
- Stark desert raking light, hard shadows, every detail tack-sharp

VOLUMETRIC ATMOSPHERIC (use deliberately, not as default):
- Cathedral god-rays slicing through dense fern canopy, pollen drifting in shafts
- Sun-shafts piercing storm-cloud breaks, single beam picking out a sauropod silhouette
- Vertical light pillars between mega-conifer trunks, dust motes filling beams
- Backlit forest interior with horizontal sun-rays cutting through morning fog
- Dawn fog with sun-disc rising, beams radiating outward through tree-fern silhouettes

DRAMATIC CONTRAST:
- Stormlight chiaroscuro — pitch-dark forest with one shaft of cold blue light on the dinosaur
- Lightning-flash freezing motion in stark blue-white, motion blur trailing
- Volcano underglow casting orange uplight on dinosaur belly, pyroclastic-cloud backlight
- Eclipse-darkness with corona-rim light kissing every ridge of hide
- Storm-front edge with half the frame in dark cloud-shadow, half blasted with sun

WET / WATER / REFLECTION-FOCUSED:
- Sun-flare bouncing off mirror lake, doubled spectral halos around dinosaur reflection
- Rain falling through golden backlight, individual drops catching light, sheet-curtains illuminated
- Wet mud-flat at sunset, every footprint puddle holding a fragment of orange sky
- Rain-cleared sky with rainbow arc, post-storm wet-everything sparkling
- Glassy lagoon catching dawn pink, mirror-perfect doubling of dinosaur silhouette

GOLDEN HOUR / DAWN / DUSK:
- First-light pink-gold raking horizontal across a misty floodplain
- Late-amber dusk filtered through dust kicked up by a herd
- Pre-dawn cool-grey with one warm crack of magenta on the horizon
- Twilight blue with one ember-warm light source anchoring (volcano / fire-tree / setting sun)

EXOTIC / BIOLUMINESCENT:
- Firefly cloud at dusk speckling the air around a sleeping sauropod
- Glowing-fungi understory casting cold-cyan uplight on a foraging dinosaur
- Phosphorescent algae bloom in lagoon, dinosaur wading lit from below
- Auroral curtains over polar Mesozoic, green-violet light raking the snow

━━━ EVERY ENTRY MUST INCLUDE ━━━
- Specific light direction (raking / backlit / overhead / underlit / rim-lit / hard / soft)
- A visible visual element (specular / reflection / volumetric beam / shadow architecture / saturation)
- Cinematic descriptor when fitting (chrome-bright / mirror-flat / razor-sharp / cathedral / chiaroscuro)

━━━ PRIORITIZE ━━━
Specular reflections, mirror water, sharp shadows, ray-traced crispness OVER fog and haze. The bot must produce killed-it Unreal Engine 5 cinematic renders, not always-foggy documentary stills.

━━━ DEDUP DIMENSIONS ━━━
Deduplicate by: time-of-day + light direction + lighting mode (crisp/volumetric/dramatic) + visible element.

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
