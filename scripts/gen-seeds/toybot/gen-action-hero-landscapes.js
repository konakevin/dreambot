#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/toybot/seeds/action_hero_landscapes.json',
  total: 50,
  batch: 10,
  metaPrompt: (n) => `You are writing ${n} VINTAGE "EPIC" ACTION-FIGURE LANDSCAPE scene descriptions for ToyBot's action-hero path — rolled-up bucket of 80s/90s action-figure environments covering (a) Masters-of-the-Universe sword-and-sorcery realms, (b) Star-Wars-era space-adventurer sets, and (c) cape-and-cowl superhero-headquarters/battlefields. Non-IP — archetype only.

Each entry: 15-25 words. ONE specific vintage-action-figure landscape scene.

━━━ THE MIX ━━━
- ~30% Type A — pure empty vintage-action-figure playset/environment, NO figures. Sword-and-sorcery realm OR space-adventurer set OR cape-hero headquarters IS the subject.
- ~70% Type B — ONE off-center vintage-action-figure (5-7 inch muscle-hero OR 3.75-inch space-adventurer OR cape-and-cowl superhero) in a specific body-shaping pose within a playset environment. Lead with BODY POSITION.

━━━ TYPE B RULES ━━━
Lead with body-position in first 5-8 words (kneeling / crouched / seated / reclining / lying / leaning / mid-stride / reaching / climbing / leaping / bent / tilted / dangling / flying-dive / hovering). Environment dominates frame.

━━━ CONTEXT DNA ━━━
- Sword-and-sorcery environments: skeletal-throne-room / castle-siege / mystic-crystal-cave / volcanic-mountain / beast-warrior-jungle / sorceress-tower / molded-rock-bridge / prophetic-altar-pool / barbarian-wilds
- Space-adventurer environments: starship-cockpit / hangar-bay / gantry-over-pit / cantina-interior / alien-planet-surface / cargo-crate-warehouse / plastic-asteroid / space-monk-training-rock / Dark-corridor-firefight
- Cape-and-cowl environments: city-rooftop / skyscraper-silhouette / plastic-headquarters-emblem-wall / villain-throne-pyramid / plastic-gauntlet-cosmic-pillar / city-alleyway / hangar-door-open / Greek-temple-pillar / cosmic-asteroid
- Figure DNA:
  (a) 5-7-inch hyper-muscular hand-painted barbarian-hero / sorceress / skeletal-villain / muscle-champion / beast-warrior with loincloth-fur-boots / cross-straps / magic-sword or battle-axe / crystal-staff
  (b) 3.75-inch space-adventurer — hooded laser-sword-monk / dark-helmet full-face-mask villain / scruffy vested smuggler / astromech/protocol droid / flight-suited rebel-pilot / T-visor-helmeted bounty-hunter
  (c) cape-and-cowl superhero — caped champion with geometric chest-emblem / dark hooded vigilante with utility-belt and grappling-gun / winged hero / cosmic hero with glowing ring / powered-armor hero with chest-reactor / amazon warrior with tiara-and-bracers / horned cape-villain with scepter

━━━ MUST-HAVE ━━━
- Reference ACTION-FIGURE / articulated-figure / 5-to-7-inch or 3.75-inch / hand-painted / playset-diorama LANGUAGE
- Vintage 80s/90s action-figure toy-photography energy — plastic, playful, epic-serial-cinematic
- Type A = zero figures. Type B = exactly ONE figure, OFF-CENTER, body-shaping pose-first
- Specific archetype NAME (barbarian-hero / sorceress / space-monk / dark-helmet villain / caped-champion / vigilante / powered-armor hero / bounty-hunter / droid)
- Aggressive dedup: max 4 per pose-family, max 2 per environment-type, rotate across all three families (sword-and-sorcery / space-adventurer / cape-and-cowl)

━━━ BANNED ━━━
- NO centered-hero figure
- NO multi-figure entries
- NO passive verbs
- NO real IP names (He-Man / Skeletor / She-Ra / Luke / Vader / Han / Leia / Chewbacca / C-3PO / R2-D2 / Darth Maul / Boba Fett / Batman / Superman / Wonder Woman / Iron Man / Thor / Spider-Man / Joker) — archetype language only
- NO franchise proper nouns (Lightsaber / Force / Mjolnir / Infinity Gauntlet / Castle Grayskull / Eternia)
- NO CGI / illustration / photorealism

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
