#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/starbot/seeds/cosmic_oracle_locations.json',
  total: 25,
  batch: 10,
  metaPrompt: (n) => `You are writing ${n} COSMIC LOCATION descriptions for StarBot's cosmic-oracle path — richly-detailed sci-fi settings where a solo oracle-woman lives WITHIN the environment. Each entry combines SETTING + COSMIC-TIME-OF-DAY + VISIBLE COSMIC-LIGHT-SOURCE + ATMOSPHERIC DETAIL baked together so Flux doesn't average conflicting cues from separate axes.

Each entry: 25-40 words. ONE specific cosmic location with full time-of-cosmic-day + visible cosmic-light-source + atmospheric detail all in one description.

━━━ THE CORE RULE ━━━
Each entry MUST include:
1. SETTING — the specific cosmic-environment (observation-deck / nebula-cathedral / crystal-moon / temple-ship / ritual-plateau / alien-shore / starship-bridge / etc.)
2. TIME-OF-COSMIC-DAY — nebula-twilight / binary-star-dawn / dying-sun-dusk / aurora-midnight / supernova-afterglow / etc.
3. VISIBLE COSMIC-LIGHT-SOURCE IN FRAME — specific nebula / binary-stars / pulsar / aurora / sun-dog / ring-system visible in sky/viewport
4. ATMOSPHERIC DETAIL — drifting cosmic-dust / volumetric starlight / plasma-mist / crystalline-frost / etc.

━━━ REFERENCES (not IP — aesthetic tradition) ━━━
Chesley-Bonestell painted-space tradition / Syd-Mead architectural sci-fi / John-Harris epic-scale-horizons / Moebius-Jodorowsky surreal-cosmic / Bruce-Pennington apocalyptic-cosmos / Ralph-McQuarrie concept-art / Dune-painterly-desert-world / Arrival alien-monolith / Blade-Runner-2049 dystopian-practical-effects / Annihilation iridescent-shimmer / 2001 monolithic-mystery.

━━━ CATEGORIES (rotate, don't cluster — max ~3 per category across 25 entries) ━━━

COSMIC OBSERVATION / VIEWPORT-BASED:
- Nebula-observation-deck overlooking a binary-star system
- Curved-glass observation-rotunda with swirling magenta-and-cyan nebula beyond
- Crystal-dome observatory under alien-ringed-planet disk filling half the sky
- Vertical-viewport ritual-chamber facing a pulsar's rhythmic flash
- Low-gravity meditation-balcony tethered to a spinning station with deep-space sunrise

TEMPLE / CATHEDRAL / RITUAL SPACE:
- Cathedral-airlock with Gothic-pointed arches facing a dying green-nebula
- Subterranean crystal-temple on an ice-moon lit from below by cryo-blue glow
- Jungle-temple on a bioluminescent world, alien-moon huge overhead
- Floating-pyramid ritual-chamber above a cosmic-abyss, only starlight for a floor
- Bronze-and-obsidian temple on a volcanic moon with red-giant sun looming

PLANETARY SURFACE / ALIEN HORIZON:
- Desert-dune plateau on a Dune-like world at twilight, twin-suns setting
- Crystalline-shore of a mercury-mirror sea beneath an auroral sky
- Towering monolith-valley on an alien plateau, stars wheeling overhead (Arrival-esque)
- Iridescent shimmer-zone where plants bend impossibly (Annihilation-esque)
- Black-volcanic beach under a sky torn open by a passing supernova remnant

STARSHIP / SPACECRAFT INTERIOR:
- Cold corridor of a derelict generation-ship, emergency-crimson lighting flickering
- Navigator's bridge of a cathedral-ship with a floor-viewport showing void below
- Pilot-ritual cockpit lit only by console-glow and stars through cracked visor
- Cryo-chamber dormitory with frost-covered pods, single console-light
- Engine-room of a cosmic-frigate, plasma-reactor cyan-glow dominating

PLAYSET-COSMIC RITUAL / CEREMONIAL:
- Floating ring of crystal-obelisks suspended above a planet-ring, solar wind streaming through
- Sigil-carved ritual-plateau on an asteroid shard drifting through a dust-field
- Zero-gravity meditation-sphere with slowly orbiting star-charts
- Temple-library carved into an asteroid, shelves of glyph-scrolls floating in low-g
- Void-altar at the edge of a black-hole event-horizon, time visibly distorted

COMBINED COSMIC-LIGHT EXAMPLES (embed these patterns into entries):
- "cold cyan pulsar-flash rhythmic through the starboard viewport, silver-frost mist pooling low"
- "deep magenta nebula cloud swallowing half the sky, dust-motes caught in the volumetric starlight"
- "twin-setting-suns casting amber-and-violet double-shadows across the dune-plateau"
- "auroral green-and-gold sheets streaming down the observation-dome, silhouetting everything"
- "red-giant sun swollen across the entire lower-horizon, long crimson shadows raking across"
- "supernova-afterglow filling the sky with iridescent pink-and-white scattered shimmer"
- "black-hole event-horizon bending a ring of distant stars into a visible lens-halo"

━━━ MUST-HAVE FOR EVERY ENTRY ━━━
- Setting named specifically (not "a cosmic place")
- Time-of-cosmic-day baked in (nebula-twilight / aurora-midnight / binary-dawn / etc.)
- Visible cosmic-light-source named (specific nebula / pulsar / aurora / twin-suns / ringed-planet / black-hole)
- Atmospheric detail named (dust / mist / plasma / frost / volumetric-starlight)
- 25-40 words, dense and specific

━━━ BANNED ━━━
- NO characters / people (the character pool owns that)
- NO real IP place-names (Arrakis / Tatooine / Hoth / Mustafar / Vulcan / Coruscant / LV-426)
- NO "cinematic" / "dramatic" as fallback adjectives — name the specific cosmic quality
- NO Earth-modern cities / Earth-specific architecture (no "Manhattan" / "Tokyo skyline")
- NO generic "space" without specifics

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
