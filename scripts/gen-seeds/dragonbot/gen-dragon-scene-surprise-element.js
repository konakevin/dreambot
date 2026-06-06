#!/usr/bin/env node
/**
 * DRAGON_SCENE_SURPRISE_ELEMENT — Tiny secondary subject pool.
 *
 * Implies a wider world. A small secondary subject (armored knight,
 * distant castle, scattered hoard, burning village, second dragon,
 * stone circle, wizard's tower) somewhere in the composition. Provides
 * scale + narrative. Always tiny / midground / distant — never
 * competing with the dragon for focus.
 *
 * Mirrors existing 30-entry register — long-form (~60 words) painted
 * composition note describing WHAT it is + WHERE in the frame + WHAT it
 * implies about the world.
 */
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/dragonbot/seeds/dragon_scene_surprise_element.json',
  total: 200,
  batch: 50,
  append: true,
  metaPrompt: (
    n
  ) => `You are writing ${n} SURPRISE-ELEMENT descriptions for DragonBot's dragon-scene path — a tiny secondary subject hidden in the composition that adds scale + narrative + sells the dragon's enormity. Frazetta / Brom / Vallejo / Hildebrandt / Whelan painted-fantasy-cover register.

Each entry: 45-80 words. Each describes ONE small secondary element + its EXACT placement in the frame + what it IMPLIES about the wider world.

━━━ THE PURPOSE — SCALE-PROVER + STORYTELLING ━━━

The surprise element does three things:
1. Proves the dragon's scale by being tiny next to it (chess-piece castle, ant-sized army, matchstick village)
2. Implies a wider world the dragon inhabits (kingdoms, armies, observers, history)
3. Adds a narrative beat (this dragon kills armies / this dragon is being hunted / this dragon guards forgotten treasure)

━━━ VARIETY MANDATE — distribute across these clusters (~25 per cluster) ━━━

1. SOLITARY MORTAL WITNESS (armored figure on bridge / lone wizard at tower window / scout on ridge / archer on parapet / sage with telescope on observatory)
2. DISTANT ARCHITECTURE (clifftop castle silhouette / ruined fortress / wizard's tower / lighthouse / temple complex / ziggurat)
3. SECONDARY DRAGON (smaller dragon wheeling in distant sky / two dragons sparring at edge of frame / dragon-skeleton on hillside / silhouette gliding across moon)
4. TREASURE / HOARD (gold spilling from cave / scattered crowns / chalices in shadow / glittering coin-drift / mountain of artifacts)
5. AFTERMATH (bone-pile at dragon's talons / charred forest / smouldering ruins / shattered armor / scorched battlefield)
6. ACTIVE CONFLICT AT TINY SCALE (village burning four kilometers distant / military formation arrayed below / cavalry charge across plain / siege engines firing at dragon)
7. WRECKAGE / TECHNOLOGICAL HUBRIS (crashed airship / fallen siege tower / broken catapult / scattered ironclad fragments / shattered ballista)
8. ARCANE WITNESS (wizard's tower window glowing / ritual circle in valley below / stone circle in basin / glyph-burned plain / observatory of bound mages)
9. ANCIENT MARKER (stone circle / standing stones / weathered statue / ruined arch / forgotten obelisk / titan-skull)
10. ECOLOGICAL SCALE (herd of giant elk crossing river / pod of whales in coastal water / flock of huge birds wheeling at distance / cave-bear pack on cliff face)

━━━ COMPOSITION RULES ━━━

EVERY entry must specify:
1. WHAT the element is (specific: "armored figure on stone bridge" not "person somewhere")
2. WHERE in the frame ("midground", "deep distance", "between dragon's foreleg and wing-shadow", "just beneath dragon's wingtip", "lower-third left", "past dragon's shoulder")
3. SCALE-PROVER comparison ("chess piece", "ant-sized", "matchstick scale", "thumb-sized at this distance", "barely visible")
4. WHAT it IMPLIES ("suggesting the creature's territory encompasses kingdoms", "tactical futility made visual through scale", "Neolithic permanence versus living apocalypse")

━━━ THE LANGUAGE PATTERN — mirror these existing entries' register ━━━

GOOD examples already in the pool (vary strongly from them):
  • "A single armored figure stands atop a narrow stone bridge spanning a chasm in the midground, sword raised toward the dragon, silhouetted against firelight — the bridge ancient and crumbling, barely visible between dragon's foreleg and wing-shadow, implying forgotten road networks beneath the beast."
  • "Distant clifftop castle silhouette on far ridge three kilometers back, half-ruined towers black against amber horizon glow, pennants still flying from one intact spire — positioned just beneath dragon's wingtip, suggesting the creature's territory encompasses entire kingdoms, castle tiny as a chess piece."
  • "Wizard's tower on isolated crag in deep distance, single window glowing violet against storm-grey sky — needle-thin spire positioned just left of dragon's neck, light pulsing rhythmically, suggesting observer or summoner."

━━━ BANS ━━━

- NO element that competes with the dragon for visual focus — surprise element is ALWAYS tiny, midground/distant, never larger than ~10% of frame
- NO modern objects (no cars, no guns, no neon, no plastic — high fantasy worldbuilding only)
- NO named IPs (no Mordor, no Westeros, no Hogwarts)
- NO close-up faces — distance / silhouette / scale-prover ONLY
- NO "epic / awesome / stunning" filler — show the implication, don't name it

━━━ OUTPUT ━━━

JSON array of ${n} strings. No preamble, no numbering, no markdown. Each string is a single long composition note (45-80 words).`,
}).catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
