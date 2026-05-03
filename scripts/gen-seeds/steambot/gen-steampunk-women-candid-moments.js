#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/steambot/seeds/steampunk_women_candid_moments.json',
  total: 200,
  batch: 50,
  metaPrompt: (n) => `You are writing ${n} STEAMPUNK WOMAN CANDID MOMENT descriptions for SteamBot's sexy-steampunk-woman path — STUNNING + tastefully alluring + ornate steampunk woman candid solo doing a specific steampunk action. Capable, magnetic, unmistakably steampunk. Heavy ornate gear-laden character. SOLO. The COOL OUTFIT + GEAR + ACTION is the hero. Skin-reveal language banned (no "cleavage", no "bare shoulders backlit", no "corset straining", no "sweat glistening", no "low-cut", no "barely contained" — she's tastefully alluring through CRAFT, GEAR, OUTFIT and CONFIDENCE, not through skin display).

Each entry: 15-30 words. One specific steampunk-female + specific action + setting.

━━━ CATEGORIES ━━━
- Corseted airship-captain at helm gripping brass wheel (sky visible through window)
- Brass-prosthetic mechanic oiling gauntlets at workbench (tools around)
- Victorian-adventuress reloading steam-rifle (crouched by crate)
- Mad-scientist at workbench with cybernetic-goggle lit by spark
- Goggled engineer mid-welding with sparks flying
- Corseted spy picking brass-lock with pin-tools
- Airship-pilot adjusting altitude-dial with one hand, map in other
- Tesla-coil tinkerer sparking circuit with gloved hand
- Brass-armored bounty-hunter loading cartridges
- Clockwork-alchemist mixing potion at lab-table
- Victorian-duelist wiping brass-cutlass (post-fight)
- Armored-mechanic fixing airship-engine mid-flight
- Telegraph-operator at brass-console with headphones
- Parlor-inventor sketching machine at candle-lit desk
- Watch-maker adjusting tiny gear with tweezers
- Pilot adjusting brass-goggles before takeoff
- Revolver-loading gunslinger at dusty airfield
- Flying-pack engineer strapping brass-rig on
- Plague-doctor sorting samples with mechanical-stethoscope
- Cartographer drawing map at brass-desk
- Airship-navigator with sextant on deck
- Engineer climbing brass-ladder in factory
- Astronomer aligning telescope at midnight
- Diver-suit Victorian-lady with helmet on ready to descend
- Courier fastening boot-skates
- Cyber-eyed sniper scoping from rooftop
- Blacksmith shaping brass at anvil with sparks
- Chemist in lab-coat testing tincture with cat nearby
- Sky-pirate captain smoking pipe on rigging
- Mechanic under airship-belly with wrench
- Zeppelin-maintenance tech on rope-ladder
- Brass-armed swordswoman cleaning blade
- Victorian-professor consulting clockwork-encyclopedia
- Rail-maintenance engineer with hammer and gears
- Parlor-musician tuning brass-horn-trumpet

━━━ RULES ━━━
- STUNNING + tastefully alluring + ornate + capable + unmistakably-steampunk
- Specific action she's doing (candid — not posed)
- Solo (no men, no second figure)
- "Caught-her-in-the-moment" framing — but NOT voyeuristic skin-shot
- Steampunk identity via brass/copper/goggles/corset/mechanical-detail
- BANNED skin-emphasis verbs: "cleavage", "bare shoulders backlit", "corset straining", "sweat glistening", "low-cut", "barely contained", "plunging", "exposed bust", "see-through". The OUTFIT and the ACTION are the focus, not skin.

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
