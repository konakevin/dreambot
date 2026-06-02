#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/toybot/seeds/space_saga_figures.json',
  total: 200,
  batch: 25,
  metaPrompt: (
    n
  ) => `Write ${n} authentic STAR WARS vintage Kenner 3.75-inch action-figure descriptions for ToyBot's space-saga-figures path. Lean fully into Star Wars IP — name characters, name eras, name factions. 8-18 words per entry.

━━━ STAR WARS CHARACTER ROSTER (rotate, vary) ━━━
- Original Trilogy heroes: Luke Skywalker (farmboy / X-wing pilot / Bespin / Endor), Princess Leia (Hoth / Endor / slave / Bespin), Han Solo (vest / Hoth / carbonite / Endor), Chewbacca, Lando Calrissian, Obi-Wan Kenobi, Yoda, Wedge Antilles
- Imperial: Darth Vader (cape billowing / saber drawn / mid-stride), Stormtroopers (white-armor blaster), Snowtroopers, Sandtroopers, Death Star Gunner, Imperial Officer (grey uniform / cap), Royal Guard (red cape / pike), Emperor Palpatine, Boba Fett, IG-88, Bossk, Dengar
- Droids: R2-D2, C-3PO, R5-D4, Power Droid, GNK Power Droid, Mouse Droid, Probe Droid, FX-7 Medical Droid, Imperial Probot
- Aliens: Greedo, Jabba the Hutt, Bib Fortuna, Walrus Man (Ponda Baba), Hammerhead, Snaggletooth, Cantina Band (Figrin D'an / Modal Nodes), Wicket / Logray / Chief Chirpa (Ewoks), Tusken Raider / Sand People, Jawas, Wampa, Tauntauns, Dewbacks, Banthas
- Prequel-era (optional sprinkle): Anakin (padawan / Sith Lord), Padmé Amidala, Mace Windu, Qui-Gon Jinn, Darth Maul, Count Dooku, General Grievous, Battle Droid (B1), Super Battle Droid, Clone Trooper (Phase I / II), Captain Rex, Commander Cody, Jango Fett

━━━ HARD VARIETY RULES ━━━
- 80%+ Original Trilogy era (1977 Kenner aesthetic)
- 20% Prequel-era (Phantom Menace through Revenge of Sith)
- Mix heroes / villains / droids / aliens roughly evenly
- Vary outfits/scenes per character (Luke has 4-5 looks: farmboy, X-wing, Bespin, Endor, Jedi Knight)
- Vary materials: hand-painted plastic, soft-vinyl, jointed-plastic, bubble-card-mint, weathered-paint

━━━ FORMAT ━━━
Each entry: 8-18 words, comma-separated phrases. Always reference 3.75-inch / vintage / Kenner / hand-painted / bubble-card-style:
- "3.75-inch vintage Kenner Luke Skywalker (X-wing pilot) in orange flight-suit, white-helmet visor, life-vest, lightsaber holstered"
- "vintage 3.75-inch Kenner Darth Vader, black T-visor full-face-mask, flowing cape, red lightsaber drawn, gloved-fist clenched"
- "Kenner-style 3.75-inch Han Solo (Hoth-gear) in blue parka with brown fur-trim, blaster-pistol drawn, frost-encrusted goggles"
- "3.75-inch Kenner Princess Leia (Endor) in camo-poncho with bandolier, blaster-pistol drawn, hand-painted face freckled"
- "vintage 3.75-inch Kenner Boba Fett, T-visor green-armor with dent, jetpack with rocket, wrist-flame-thrower, EE-3 carbine"
- "Kenner-style 3.75-inch R2-D2 cylindrical body with tri-leg base, dome-head with sensor-eye, restraining-bolt, tool-arm extended"
- "3.75-inch Kenner C-3PO golden-chrome plating, articulated jaw mid-protest, bowed-elbow gesture"
- "vintage 3.75-inch Kenner Chewbacca, full-fur Wookiee with bowcaster crossbow, bandolier of metallic-discs, mid-roar"
- "Kenner 3.75-inch Yoda (Dagobah) in brown rough-spun robe, gimer-stick walking-cane, large pointed ears, hand-painted wise-face"
- "3.75-inch Kenner Stormtrooper, white-segmented armor with T-visor helmet, E-11 blaster-rifle, mass-produced army-builder weathering"
- "vintage 3.75-inch Kenner Tusken Raider, bandage-wrapped robes, gaffi-stick raised, twin macrobinocular-eye-tubes, Tatooine-dust weathered"
- "Kenner-style 3.75-inch Wicket the Ewok, brown-fur tunic with bone-jewelry, hand-carved spear, hood pushed back"
- "3.75-inch Kenner Lando Calrissian (Bespin), cream-cape with maroon-vest, blaster-pistol holstered, hand-painted moustache"
- "Vintage 3.75-inch Kenner Obi-Wan Kenobi (Tatooine), brown-Jedi-robe with hood, blue lightsaber, weathered-elder hand-painted face"
- "Kenner 3.75-inch Greedo, green-skinned Rodian bounty-hunter, blaster-pistol drawn, antenna-snout, leather-vest, hand-painted detail"

━━━ BANNED ━━━
- Identical entries
- Generic "rebel pilot" / "imperial trooper" without naming the era / specific archetype
- Modern Disney-era characters (Rey / Kylo / Finn — those are Disney-era, less iconic-vintage)

━━━ DEDUP RULE ━━━
- No two entries share CHARACTER + OUTFIT-VARIANT exactly (Luke-X-wing only once, Luke-Endor only once)
- Vary across the ${n} entries

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
