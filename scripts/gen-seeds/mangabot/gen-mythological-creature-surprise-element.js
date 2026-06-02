#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/mangabot/seeds/mythological_creature_surprise_element.json',
  total: 25,
  batch: 25,
  append: true,
  metaPrompt: (
    n
  ) => `Write ${n} SURPRISE-ELEMENT entries for a MangaBot mythological-creature keyframe. SCENE-LED — each entry names ONE small unexpected detail that elevates the frame from "yokai in shrine" to "moment captured" — a flicker, a passing wing, a sudden sound, a tiny life-form drifting through.

⚠️ CRITICAL: Japanese-mythology coded surprise only. NEVER western fairy-dust / unicorn-sparkle / Greek-dove. NEVER WESTERN. Use shinto / yokai vocabulary: petal-release, lantern-flicker, sudden-cold, kitsune-laugh-echo, passing-dragonfly, shadow-shift, wind-chime, foxfire-ember, falling-shide-paper.

Each entry: 12-22 words. ONE specific quiet/odd detail. Atmospheric not action.

SURPRISE VARIETY (small unexpected beats):
- Sakura petals releasing in a sudden wind-burst, drifting across the creature's profile
- A paper-lantern flickering once at the shrine-edge, the yokai's silhouette catching the falter
- A sudden cold-snap visible as breath-mist condensing around the creature's mouth
- A distant kitsune-laugh echoing through bamboo, ripples of sound felt in the frame
- A passing dragonfly mid-flight across the frame, oblivious to the looming yokai
- A shadow-shift across the shrine-step as cloud passes the moon, half the creature dimmed
- A wind-chime tinkling at the shrine-eaves, the yokai's ear flicking toward the sound
- A foxfire-ember drifting upward past the creature's tail, blue spark fading skyward
- A single falling shide-paper from the shimenawa rope, drifting past the yokai's snout
- A koi splash visible in the lotus pond at the temple-edge, ripples mid-spread
- A persimmon falling from the orchard-branch, mid-drop past the creature's shoulder
- A frog mid-leap from a moss-stone, tiny against the looming yokai
- A spider's web catching firelight in the foreground, the creature framed past its strands
- A single snowflake suspended mid-air, perfect crystal caught in foxfire light
- A wisp of incense-smoke curling in a spiral, the creature half-visible behind the haze
- A bird's-nest in the torii's crook, a chick peeking out at the yokai
- A cicada's last cry of summer felt as resonance, the yokai's antlers vibrating
- A maple-leaf spinning down mid-frame, vermilion-red against the dragon's blue scales
- A puddle-reflection of the yokai's face rippling at the creature's footstep
- A sudden gust whipping the kitsune's tails into a different fan-shape mid-frame
- A stone-jizo statue's lichen suddenly glowing in the foxfire-cast light
- A single bell-toll resonance felt through the air, brass-ripple distorting the mist
- A swarm of fireflies passing in the upper-frame, oblivious to the looming creature
- A petal-spiral whirling around a stone-lantern, the yokai's shadow stretching past
- A single white-feather drifting down from the tengu's beating wings

DO write (small Japanese-coded surprise, atmospheric quiet detail):
- A sakura petal-release in a sudden wind-burst, drifting across the kitsune's profile
- A paper-lantern flickering once at the shrine-edge, the yokai's silhouette catching the falter
- A passing dragonfly mid-flight across the frame, oblivious to the looming oni
- A foxfire-ember drifting upward past the creature's tail, a blue spark fading skyward
- A single falling shide-paper from the shimenawa rope, drifting past the dragon's snout
- A persimmon falling from the orchard-branch, mid-drop past the creature's shoulder
- A swarm of fireflies passing in the upper-frame, oblivious to the looming yokai

DO NOT write:
- Western fairy-dust / unicorn-sparkle / Greek-dove / cherub
- Big dramatic action (this is QUIET surprise — drama pool handles big beats)
- Hero-human surprise (no human-centered moments)
- Modern surprise (phone-buzz / car-horn — different paths)
- Multi-element dumps (pick ONE surprise)
- Generic "sparkle" / "magic" without yokai specificity

Return ONLY a JSON array of ${n} strings. No preamble.`,
}).catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
