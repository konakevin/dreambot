#!/usr/bin/env node
/**
 * SteamBot STEAMPUNK_SCENE_EVENT top-up (Stage 2 backfill 2026-06-05).
 *
 * Used by steampunk-scene path — atmospheric scene-events that animate
 * a steampunk cityscape / district. Existing 50 cycle: gear-tower
 * activations, locomotive arrivals, ash-falls, fog rolls, drawbridge
 * lifts, sun-pillars, clockwork birds wheeling overhead, brass fish
 * schools moving through canal-water.
 *
 * REGISTER: a single SCENE-WIDE ATMOSPHERIC EVENT, present tense or
 * progressive ("rolling", "rising", "shuddering"), 18-30 words. Mid-
 * cinematic, observational, no human action — the world itself acts.
 */
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/steambot/seeds/steampunk_scene_event.json',
  total: 200,
  batch: 25,
  maxTokens: 16000,
  append: true,
  metaPrompt: (
    n
  ) => `You are writing ${n} new SCENE-EVENT descriptors for SteamBot's steampunk-scene path. Each entry is a SCENE-WIDE atmospheric event happening across a steampunk city / district — the world itself doing something cinematic. NO active human characters in the event (people are extras / observers / silhouettes if at all).

Each entry: 18-30 words. ONE complete event sentence using a progressive verb (rolling, rising, shuddering, igniting, descending, beginning, breaking) or a tight active present-tense verb.

━━━ EXAMPLE PHRASINGS (mirror register exactly) ━━━

"Massive observatory dome rotating with a deep brass groan, aperture irising open to reveal a clockwork orrery slowly extending its articulated arms toward the night sky"
"Fleet of copper dirigibles passing in loose formation overhead, their running lights amber against the dusk, exhaust trails braiding together in the high wind"
"Pressure-burst from a distant foundry stack releasing a titan column of white steam that mushrooms against the low clouds and disperses in slow billows"
"Gaslamp cascade igniting in sequence down a long fog-wrapped boulevard, amber pools blooming forward one by one until the street glows like a spine of fire"
"Clockwork migration of brass-and-copper birds wheeling overhead in vast murmuration, wingtip gears catching the last light, their synchronized clicking audible even at distance"
"Drawbridge rising with ponderous mechanical grace across the central canal, its counterweight chains clanking taut, water sheeting from the iron lattice in silver curtains"

━━━ VARIETY MANDATE (distribute across ${n} new entries) ━━━

WEATHER / SKY-PHENOMENA (~14%):
- Storm fronts (lightning above clock-towers / hail on copper roofs / sleet against gas-lamp halos)
- Fog (rolling-in, settling, parting around statues, lifting at dawn)
- Rare phenomena (sun-dogs over the cathedral / aurora over the foundry-district / mist-rainbows in canal-mist)

INFRASTRUCTURE EVENTS (~14%):
- Drawbridges / canal-locks / cargo-elevators rising / counterweight-elevators dropping
- Steam-vents bursting / pressure-valves shrieking / foundry stacks erupting
- Gear-tower activations / cog-bridge engaging / massive crank-mechanisms shuddering to life

TRANSPORT FLOW (~12%):
- Airship arrivals / departures (dirigibles docking, balloon-fleets passing, ornithopters wheeling)
- Locomotive arrivals at iron stations / steam-trams gliding past / hansom-cabs rolling on cobblestone
- Mechanical-horse columns trotting / penny-farthing cavalry parade / cargo-tricycles in caravan

LIGHT-EVENTS (~12%):
- Gaslamp cascades igniting in sequence / sun-pillars piercing dome-glass / lightning sheeting across clock-faces
- Aether-light arcing between transmission-spires / spotlight from a searchlight-balloon sweeping a plaza
- Heliograph flashes from a distant hill / Tesla-coil discharge across the rooftops

CLOCKWORK FAUNA / FLORA AT SCALE (~10%):
- Clockwork bird flocks (murmurations / migrations / formation flight / dawn-chorus mechanical singing)
- Brass schools of fish through canal water / mechanical-bee swarms / clockwork-butterfly clouds
- Animated-vine bramble unfolding mechanical petals at scale

CIVIC / PUBLIC EVENTS (~10%):
- Cathedral bells beginning to ring across rooftops / clock-tower chiming the hour with whole-city resonance
- Fireworks rising over a distant carnival / lanterns being raised in unison across the plaza
- Foundry-shift change with steam-whistle echo / parade approaching with brass-band heard distantly

CITY-SCALE MECHANICAL EVENTS (~10%):
- Massive gear-tower starting up / city-scale brass orrery rotating / rooftop wind-turbines engaging in cascade
- Aether-network ignition / city-wide gas-lamp dim / steam-grid pressure release across districts
- Cargo-elevator chain plunging down a building-side / construction-crane swinging an iron beam

ATMOSPHERIC / SUBTLE (~8%):
- Ash drifting (foundry-ash / paper-ash from a chimney / pollen from rooftop gardens)
- Steam-vent halos / brass-dust catching sun / chimney-smoke columns aligning in cross-wind
- Pigeon flocks scattering / paper drifting across cobblestone / coal-smoke layering over the city

NIGHT-SPECIFIC EVENTS (~10%):
- Searchlight-balloon sweeping the harbor / lighthouse-beam crossing the rooftops
- Aether-aurora over the foundry-district / starlight catching mist-towers
- Lantern-festival barge passing along the canal / paper-lantern release from the cathedral plaza

━━━ FORMAT RULES ━━━

- 18-30 words, ONE complete sentence.
- Lead with the subject ("Massive observatory dome", "Fleet of copper dirigibles", "Pressure-burst from a distant foundry").
- Use a strong progressive verb ("rotating", "rolling", "igniting", "descending").
- Close with a specific sensory detail (sound, color, smell, motion).

━━━ HARD MANDATES ━━━

- Steampunk register — brass / copper / steam / pressure / gears / cogs / valves / gaslamps / clockwork / aether / dirigible / locomotive.
- Mid-cinematic observational tone — the WORLD acts, no human protagonist.
- Each entry's lead verb must vary across the pool.

━━━ HARD BANS ━━━

- NO active named characters performing events (the WORLD is the subject).
- NO modern technology (no laser, no rocket, no neon-electric grid, no jet).
- NO horror / dystopian collapse imagery — atmospheric mid-action only.
- NO repeating an event noun across entries (only one "drawbridge" entry, only one "observatory dome").
- NO photographer / camera-jargon.

━━━ OUTPUT ━━━

JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
