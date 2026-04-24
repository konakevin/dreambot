#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/steambot/seeds/steampunk_characters.json',
  total: 200,
  batch: 50,
  metaPrompt: (n) => `You are writing ${n} STEAMPUNK CHARACTER descriptions for SteamBot's steampunk-scene path — steampunk archetype characters by role only. BioShock/Mortal-Engines/Howl/FFIX energy.

Each entry: 10-20 words. One specific steampunk archetype with distinguishing visual details.

━━━ CATEGORIES ━━━
- Goggled inventor (workshop-coat with brass goggles, tool belt, oil-stained apron)
- Corseted airship-pilot (leather corset, goggles up, aviator gloves)
- Corseted-goggled engineer (leather corset, brass goggles, wrench in hand)
- Brass-armed mechanic (Victorian-mechanic with brass prosthetic arm)
- Victorian-explorer (pith helmet, bandolier, brass sextant at belt)
- Clockwork aristocrat (Victorian noble with hidden mechanical parts)
- Automaton butler (brass humanoid in formal tailcoat)
- Corseted adventurer (Victorian-lady-explorer with goggles + revolver)
- Mad scientist (wild-hair scholar with lab coat and sparks)
- Airship-captain in long leather coat with cutlass
- Goggled telegraph-operator at brass console
- Clockwork-duchess with mechanical-fan
- Victorian industrialist (top-hat with gears)
- Brass-tinker (street-inventor with small contraption)
- Sky-pirate with feather-hat and steam-cutlass
- Gear-haired punk urchin with goggles
- Cybernetic-eye engineer with magnifying loupe
- Victorian automaton-doctor with clockwork tools
- Chrononaut with time-goggles and chronometer
- Brass-masked plague-doctor steampunk
- Victorian spy in patchwork suit
- Sky-gypsy with scarves + brass bangles
- Steam-knight in brass-and-bronze plate
- Corseted courier with mechanical-roller-skates
- Brass-prosthetic pianist at steam-organ
- Detective with monocle and clockwork-hound
- Safari-hunter with steam-rifle
- Royal-cartographer with mechanical-compass
- Botanist with brass terrarium-pack
- Librarian with mechanical-book-cart
- Balloon-mapper with aerial charts

━━━ RULES ━━━
- By role only — no IP names
- Victorian-industrial aesthetic
- Brass / copper / leather / goggles / mechanical-prosthetic details
- Include specific steampunk accessory

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
