#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/mangabot/seeds/mythological_creature_creature_pose.json',
  total: 25,
  batch: 25,
  append: true,
  metaPrompt: (
    n
  ) => `Write ${n} CREATURE-POSE entries for a MangaBot mythological-creature keyframe. SCENE-LED — each entry names a LOADED MID-ACTION pose for a Japanese YOKAI hero (kitsune / tengu / ryujin / oni / yuki-onna / nekomata / kappa / tanuki / amabie / karakasa-obake / nure-onna / rokurokubi / inugami / bake-neko / namahage). The creature must be CAUGHT MID-MOTION — never a static portrait.

⚠️ CRITICAL: poses must read as MID-ACTION dynamic. NEVER "standing", "posing", "looking at camera", "facing forward". The creature is DOING SOMETHING that loads the frame with story. Poses must work for yokai anatomy (tails / wings / coils / horns).

Each entry: 12-22 words. ONE loaded yokai pose. Action verb + body-part dynamic. Mostly back-view or 3/4 angle so it reads as a CREATURE not a person.

POSE VARIETY (loaded yokai actions):
- Mid-howl with aura-burst exploding outward from open jaws
- Nine tails fanned wide mid-flame-spread (kitsune fox-fire spreading from tail-tips)
- Mid-flight with wind-trail streaming from beating wings (tengu / dragon)
- Coiling around a vermilion shrine pillar (ryujin / nure-onna)
- Rising from waterfall mist mid-emergence (ryujin / yuki-onna)
- Kneeling at shrine with head bowed, tails curled forward
- Leaping between rooftops mid-air, claws extended
- Mid-transformation half-fox half-woman (kitsune shifting forms, body in two registers)
- Floating cross-legged with hands in mudra, aura-mandala beneath
- Mid-laugh with fox-fire jetting from open mouth
- Wreathing mist into bodily form (yokai materializing from fog)
- Tail-spread fanned wide displaying iconography
- Rearing back on hind legs, mouth open in roar
- Mid-stride across snow-field, claws crunching crust
- Mid-leap from cliff with wings unfurling
- Bowing forward in greeting toward unseen kami (head lowered, tails arched)
- Mid-coil tightening around a stone lantern
- Mid-pounce frozen at apex of leap toward bell-tower
- Mid-emergence from torii gate (body half-through, vermilion frame breaking)
- Wings half-furled mid-landing on temple roof
- Mid-prayer with fox-paws pressed together, third-eye opening
- Mid-summoning with both hands raised, sigil-cloud condensing above
- Mid-stretch with tails arching across the frame in a wide fan
- Mid-drink at a stream, head lowered to surface, reflection visible
- Mid-roar with thunder-aura bursting from chest

DO write (loaded yokai-anatomy mid-action, no portrait poses):
- A kitsune mid-howl with fox-fire-aura bursting outward from open jaws, nine tails fanned behind
- A ryujin dragon-god coiling around a vermilion shrine pillar, antlered head crested with mist
- A tengu mid-flight with wind-trail streaming from beating black wings, geta-clogs trailing
- A yuki-onna rising from waterfall mist mid-emergence, white kimono dissolving into spray
- A nekomata mid-leap between rooftops, twin tails arched, claws extended toward the next eave
- A nine-tailed kitsune mid-transformation, body half-fox half-woman, fox-fire wreathing the shift
- An oni mid-roar with thunder-aura bursting from chest, iron kanabo club raised above

DO NOT write:
- Static portrait / facing camera / looking-at-viewer poses
- "Standing" / "posing" / "staring"
- Western mythology poses (dragon clutching damsel / mermaid on rock)
- Human-anatomy-only poses (must use yokai body parts: tails / wings / coils / horns)
- Hero-human-character poses (the hero is the YOKAI)
- Multiple-pose sequences (one moment)

Return ONLY a JSON array of ${n} strings. No preamble.`,
}).catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
