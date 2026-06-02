#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/gothbot/seeds/creature_wild_action.json',
  total: 200,
  batch: 50,
  append: true,
  maxTokens: 4000,
  metaPrompt: (
    n
  ) => `Write ${n} CREATURE WILD ACTION descriptions for GothBot's monster-prowl path. Each entry is 14-22 words.

CONTEXT: A solo gothic creature OUT IN THE WILD doing creature-business (no hunter present, no fight). Castlevania-boss / Bloodborne-beast / Devil-May-Cry-demon / Van-Helsing-monster aesthetic. The creature is mid-action, doing something specifically MONSTROUS — stalking, hunting, lurking, transforming, summoning, mid-flight, etc. Frozen-instant of action.

Categories (rotate widely — vary across creature types):
- Stalking / prowling (mid-stalk through fog / mid-prowl across cobblestones / mid-stride down a graveyard path)
- Mid-flight (mid-flight over rooftops with wings spread / mid-soar between cathedral spires / mid-dive from a tower)
- Mid-leap (mid-leap from a parapet / mid-spring from one rooftop to another / mid-pounce off a tomb)
- Perched / watching (perched on a parapet watching / crouched on a gravestone surveying / hanging from a gargoyle ledge upside-down watching)
- Mid-transformation (man mid-shift to wolf / a swirl of bats coalescing into a vampire / shadow-wraith mid-form-from-fog)
- Mid-howl / mid-shriek (head thrown back mid-howl / mid-shriek hands raised / mid-wail with mouth wide open)
- Mid-summon / mid-cast (hands raised mid-summon, sigil glowing at fingertips / mid-conjure with smoke gathering / mid-incantation)
- Drifting / floating (drifting through fog with feet not quite touching ground / floating above a graveyard / drifting between trees)
- Mid-rise / mid-emerge (clawing up from a grave / rising from a fog-bank / emerging from a mausoleum doorway)
- Lurking / waiting (deep in a doorway shadow watching / partially hidden behind a tomb watching / barely visible at the edge of fog)
- Mid-leap with prey-implied (mid-pounce on something off-frame / mid-grab toward something below — implied, never gore)

EVERY entry must include:
- WHO (creature-coded subject — but generic so it fits any creature: "the figure" / "the beast" / "the creature" / "the silhouette")
- Mid-action verb (stalking / soaring / leaping / perching / transforming / howling / drifting / rising / lurking)
- Position in frame (foreground / midground / on a rooftop / mid-air / between trees / etc.)

ABSOLUTELY BANNED:
- NO gore, NO blood-spatter, NO mid-bite-on-victim
- NO already-drinking-blood, NO mouth-on-throat
- NO seated / cross-legged / meditating
- NO standing-still-posing
- NO eyes-closed
- NO second figure in scene (creature is ALWAYS solo here)

Examples (write fresh):
- "stalking through fog mid-stride, body lowered and forward, gaze locked on something off-frame, fog parting around the form"
- "mid-flight over the rooftops with wings spread wide, body angled in a sharp dive, silhouette dark against the moon"
- "perched on a cathedral parapet mid-crouch, claws gripping the stone edge, head turned to survey the courtyard below"
- "mid-shift on its hind legs, fur rippling along the spine, snout extending, mid-transformation frozen at the instant"
- "drifting between gravestones with feet barely touching the ground, robe trailing behind in cold wind, head turning slowly"

Output ONLY a valid JSON array of ${n} strings (14-22 words each). No preamble, no commentary.`,
}).catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
