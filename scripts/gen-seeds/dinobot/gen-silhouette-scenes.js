#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/dinobot/seeds/silhouette_scenes.json',
  total: 200,
  batch: 50,
  metaPrompt: (n) => `You are writing ${n} CINEMATIC SILHOUETTE scene descriptions for DinoBot — dinosaurs as dramatic dark shapes against breathtaking prehistoric skies.

Each entry: 15-25 words. One specific silhouette scenario with species outline + sky/light condition + scale.

━━━ CATEGORIES ━━━
- T-Rex silhouette against a blood-red sunset, tiny arms visible in the outline
- Sauropod herd silhouettes at dawn, necks rising like towers against the sky
- Pterosaur flock silhouettes against a full prehistoric moon
- Lone stegosaurus on a hilltop against storm clouds with lightning
- Ceratopsian silhouette at sunrise, frill and horns catching the first light
- Raptor pack silhouettes running along a ridge at dusk
- Massive sauropod silhouette against a meteor shower sky
- Two theropods silhouetted facing each other against volcanic glow
- Ankylosaur silhouette against northern lights
- Hadrosaur herd silhouettes crossing a river at twilight
- Single dinosaur silhouette against a double rainbow after a storm
- Diplodocus neck and tail silhouette spanning the entire horizon

━━━ RULES ━━━
- The SHAPE of the animal is the subject — iconic, recognizable outlines
- The sky is spectacular — sunset, moonrise, aurora, storms, meteors
- Poster-worthy compositions, fine-art wildlife photography energy
- Mix single animals and group silhouettes

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
