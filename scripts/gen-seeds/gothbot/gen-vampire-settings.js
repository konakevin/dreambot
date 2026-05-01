#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/gothbot/seeds/vampire_settings.json',
  total: 100,
  batch: 12,
  metaPrompt: (n) => `You are writing ${n} DRAMATIC GOTHIC SETTING descriptions for GothBot's vampire-girls-2 path. Each entry describes a STUNNING DRAMATIC ENVIRONMENT seen as the BACKDROP behind a bust closeup of a vampire woman. The vampire is the focal point of the painting (50-65% of frame); the setting is the dramatic backdrop visible in the remaining 35-50%. Each entry: 18-30 words, present-tense, comma-separated phrases.

CALIBRATION: From 11 hearted renders, the settings that LANDED were: cliff balcony with castle on opposing cliff + full moon (×2), gothic stone bridge with torches + full moon, gothic teal columned hall, multi-arch aqueduct with lightning, dark throne with twin torches, gothic archway with full moon, gothic cathedral spires through stone arch, MOROCCAN COURTYARD with palms + colonnade + reflecting pool, skull-headdress against violet lightning, flooded gothic chasm structures. Common thread: ONE strong architectural element + atmospheric light (full moon, torches, lightning).

ENERGY REFERENCE: stills from Van Helsing, Castlevania (Symphony of the Night box art, Ayami Kojima splash pages), Devil May Cry, Bram Stoker's Dracula. Pure gothic dark-fantasy world (Castlevania / Bloodborne / Dark-Souls / Crimson-Peak / Bram-Stoker-Dracula's-Carpathian-castle aesthetic), with occasional exotic-cultural gothic accent (Moroccan / Persian / Russian Orthodox is OK if rendered with the same gothic-painted feel).

ABSOLUTE RULES:
- The setting is the BACKDROP — visible behind/around the vampire bust. The vampire is the focal point, not a tiny figure.
- ONE strong architectural element + atmospheric light. Castle / cathedral / aqueduct / archway / throne / gothic-hall / cliff-vista / etc. + full moon / lightning / torches / blacklight stained glass.
- SOLO. NO second figures. NO ANIMALS — no ravens, no wolfhounds, no creatures.
- NO GORE. NO blood, NO bodies, NO violence-just-past coding.
- DRAMATIC. Theatrical chiaroscuro. Bold architectural element. Awe-inspiring.

━━━ SETTING SPREAD (mandatory variety across ${n} entries) ━━━

CLIFF / BALCONY VISTAS (4-5 entries — HIGH HIT-RATE):
- cliff-edge stone balcony of a vast vampire castle, moonlit medieval village far below in valley glowing with hearth-light, towering Gothic spires rising behind into stormy indigo sky
- cliffside castle balcony overlooking moonlit Carpathian forest, a distant gothic monastery silhouette on the next peak, full moon piercing storm clouds
- vast cliff balcony with sheer drop into fog-filled valley, gothic city rooftops far below, lightning crackling in distance

GOTHIC ARCHITECTURE FRAMING (5-6 entries — strong):
- vast gothic cathedral nave with massive rose window blazing crimson and sapphire light across cracked marble, towering obsidian columns flanking
- ornate dark throne carved from jet and obsidian on raised marble dais, twin braziers burning sapphire flame flanking, vaulted ceiling vanishing into shadow
- tall arched gothic window framing her, full moon directly above her crown, candelabras flanking the stone wall behind
- gothic stone bridge with seven arches spanning a chasm between mountain peaks, sapphire moonlight piercing storm clouds, torches burning in iron sconces along the span
- vast gothic teal columned hall with carved baroque columns receding into shadow, cyan stained-glass blessing light streaming across the marble floor
- ornate gothic archway carved with crouching gargoyles, full moon centered overhead, candelabras hanging from chains

VAST GOTHIC LANDMARKS (3-4 entries — gothic-vista DNA):
- massive multi-tier gothic aqueduct stretching across moonlit gorge with seven towering arches, sapphire mist pouring through gaps, violet lightning illuminating distant mountains
- towering Castlevania-style cathedral with nine obsidian spires piercing aurora-cyan sky, viewed from misty valley floor, moonlit fog pools between gnarled oaks
- vast cliff-carved gothic monastery cut into vertical mountain face, stone balconies jutting over the chasm, violet waterfalls cascading from ancient drainage spouts
- colossal gothic clock-tower striking midnight on rain-slick cobblestone plaza, gas-lamps casting amber pools, violet-lit stained-glass punctuating tower flanks

EXOTIC GOTHIC ACCENTS (3-4 entries — Moroccan landed in hearts):
- Moroccan riad central courtyard at midnight, four stories of carved cedar mashrabiya screens rising on every side, brass lanterns swinging, central reflecting pool catching full moon, palm trees framing the colonnade
- Persian palace iwan at moonrise, vast vaulted muqarnas ceiling honeycomb of stalactite arches, lapis-lazuli stars overhead, single oil lamp throwing dramatic shadow
- Russian Orthodox cathedral interior, towering jewel-encrusted iconostasis blazing gilt and crimson, dome thirty stories overhead, butter-lamp glow
- gothic Venetian palazzo at midnight, water-damaged frescoes peeling gold and ultramarine, gondola at marble steps, Doge's-palace pointed arches framing dark canal

UNCANNY GOTHIC LANDSCAPES (3-4 entries — flooded necropolis / dragon bones DNA):
- flooded necropolis stretching behind her, thousands of submerged marble tombs visible through crystal-clear poisoned water, will-o-wisps dancing across mirrored surface
- Carpathian mountain pass choked with colossal fossilized dragon skull, vertebrae forming natural archways overhead, violet lightning cracking through storm clouds
- petrified whale skeleton rising from black volcanic sand with cathedral-vault ribs arching overhead, bioluminescent fungi spreading eerie emerald glow
- towering ancient gothic ruins overgrown with banyan roots, moss-covered carved stone, distant violet lightning

━━━ RULES ━━━
- 18-30 words per entry
- ONE strong architectural element + dramatic atmospheric light
- The setting is the BACKDROP behind the vampire bust — described as visible behind/around her
- Specific renderable architecture/landscape Flux can paint
- SOLO — no other figures, no animals
- NO gore, NO blood, NO bodies
- Mostly gothic-world (Castlevania/Bloodborne/Crimson-Peak), with ~15% exotic-gothic accents (Moroccan/Persian/Russian Orthodox/Venetian) since exotic landed in hearts when painted with gothic feel

━━━ DEDUP DIMENSIONS ━━━
Deduplicate by: setting type + dominant architecture or terrain + dominant light source. Two entries are too similar if they share more than two of these.

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering, no markdown.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
