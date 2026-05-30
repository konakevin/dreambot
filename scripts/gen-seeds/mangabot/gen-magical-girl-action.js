#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/mangabot/seeds/magical_girl_action.json',
  total: 25,
  batch: 25,
  append: true,
  metaPrompt: (
    n
  ) => `Write ${n} MAGICAL-GIRL ACTION entries — what the mahou-shoujo is DOING RIGHT NOW. Mid-transformation, mid-finishing-move, mid-power, mid-summoning — captured at peak instant.

⚠️ FORWARD-FACING ONLY — never "looking out over X" / "walking toward Y" / "facing away to admire". She's IN the magical moment, body engaged, face visible per camera angle.

Each entry: 14-22 words. Action + body orientation + magical-aura signature + intensity cue.

VARIETY:
- 20% MID-TRANSFORMATION PEAK (mid-transformation with ribbons spiraling outward / mid-light-column-burst with petals exploding / mid-costume-reveal with sparkle-storm / mid-clothing-shift with star-trails)
- 18% MID-CAST/MID-FINISHING-MOVE (mid-cast palms-forward with magic-blast / mid-incantation hands raised at viewer / mid-wand-arc with sparkle-trail / mid-finishing-attack with energy-stream forward)
- 14% MID-LEAP/SPIN (mid-leap toward camera with cape billowing / mid-spin with ribbon-whirl around her / mid-pirouette mid-blast / mid-aerial-twist with sparkle-trail)
- 12% MID-POWER-UP (mid-charge with mana-corona blooming around her / mid-energy-gathering with hands cupped at chest / mid-aura-flare facing forward / mid-meditation-bloom with chakra-glow)
- 10% MID-SUMMONING (mid-summon with familiar materializing in front of her / mid-rune-circle casting / mid-card-summon with floating card-spread / mid-mascot-call with sparkles trailing)
- 8% MID-EMOTION FORWARD (mid-determined-glare toward viewer / mid-tearful-resolve / mid-laugh while wand glows / mid-shout calling out spell-name)
- 8% PROFILE DYNAMIC (full side-profile mid-blast / profile mid-leap with cape trailing / profile mid-spin mid-cast)
- 6% MID-INTERACTION FAMILIAR (mid-pet of fairy-mascot on shoulder with smile to viewer / mid-share-power with familiar facing forward / mid-bow with mascot)
- 4% MID-VICTORY (mid-victory-pose with hands raised / mid-celebration with finishing-glow / mid-cheer with sparkle-burst around)

DO write:
- Mid-transformation peak with rainbow-ribbons spiraling outward, hands crossed at chest toward viewer, hair lifting with magical updraft
- Mid-cast palms-forward at camera with crystal-blast erupting between hands, fierce-determined face, cape snapping
- Mid-leap toward viewer at apex, cape billowing behind, wand raised overhead trailing sparkle-stream
- Mid-charge with magenta mana-corona blooming around her body, eyes closed in concentration, sparkles streaming up
- Mid-summon with talking-cat-familiar materializing from light-burst in front of her, mid-incantation pose

DO NOT write:
- Walking toward / approaching / facing-away-to-admire — back-to-camera trap
- Cheesecake-coded action verbs (sultry / seductive)
- Combat-with-blood-violence
- Static "standing posing"
- Multiple actions per entry — ONE only

Return ONLY a JSON array of ${n} strings. No preamble.`,
}).catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
