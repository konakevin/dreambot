#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/steambot/seeds/steampunk_curios.json',
  total: 100,
  batch: 12,
  append: true,
  metaPrompt: (n) => `You are writing ${n} STEAMPUNK CURIO descriptions for SteamBot's steampunk-curio path.

━━━ THE GOLD-STANDARD REFERENCE ━━━
The pinnacle render: an articulated brass peacock-songbird with iridescent copper plumage, glowing teal-gem eyes, gear-driven internals visible through chest panels, life-size, alive-feeling, displayed on a velvet pedestal under a red velvet curtain like a Vatican relic. Every entry MUST aspire to this energy: LIVING, ALIVE-FEELING, ANIMATED, CHARACTER-DRIVEN, IMPRESSIVE SCALE.

━━━ MOOD — PLEASING + INTRIGUING + WHIMSICAL ━━━
Studio-Ghibli antique-shop / Wes-Anderson cabinet-of-curiosity / Pixar-short-film charm. Every object should be visually DELIGHTFUL — pleasing to look at, intriguing to discover, with a touch of whimsy. NEVER unpleasant, NEVER unsettling, NEVER uncanny-valley, NEVER horror-coded.

━━━ THE TEST ━━━
"Does this object have a SOUL — does it look like it could turn its head and stare back?" If no → drop it. The artifact must feel ALIVE.
"Would this object exist if NOT for the steampunk-museum-curio context?" If yes (telescope, phonograph, typewriter, sextant, etc.) → BANNED.

Each entry: 22-35 words. ONE specific intricate object. LIVING + ALIVE-FEELING + IMPRESSIVE SCALE.

━━━ CATEGORIES — VARY ACROSS THESE ━━━

~12 LIFE-SIZE / IMPRESSIVE-SCALE MECHANICAL CREATURES (the gold standard) — articulated brass peacock with copper plumage and gear-heart visible through chest panels, life-size mechanical fox with hinged ribs and glowing amber eye-jewels, falcon-sized brass dragonfly with stained-glass wings beating slowly, mechanical owl with rotating moonstone eyes, mechanical cat with copper-cable tail flicking, mechanical raven with hidden compartment in its breast, ornate brass dragon coiled around a stand with a glowing forge-heart, mechanical koi the length of a forearm with copper scales rippling, brass octopus with eight articulated tentacles each curling around a different miniature curio, mechanical wolf with hinged jaw and ruby tongue.

~5 LIVING-AUTOMATON FIGURES (human/humanoid, must be ELEGANT + SMALL-FACED — never creepy) — dancing brass ballerina automaton on a music-box pedestal pirouetting eternally, miniature swordsman automaton dueling its own reflection in a brass-rimmed mirror, baby-sized cherub automaton holding a tiny lantern, mechanical violinist automaton with brass bow drawing across copper strings, elegant brass dancer-automaton in a pirouette pose. Faces must be SMALL + ELEGANT + UNPAINTED. Brass / porcelain / silver finishes on faces — never painted, never masked, never with glowing eyes.

~3 KINETIC THEATRE / STAGE / DOLLHOUSE WITH LIFE (must feature ANIMATED FIGURES inside) — miniature opera-stage automaton with three swordfighting figures eternally, dollhouse-sized brass cathedral with tiny processional figures circling the altar.

~3 ANIMATED CROWNS — animated brass crown with shifting filigree gears whose lapis-set jewels rearrange like a slow constellation, gold crown with seven articulated points that lower and raise like a slow mechanical tide. CROWNS ALWAYS DISPLAYED ON A VELVET CUSHION OR ORNATE STAND — never on a bust or head.

~2 IMPOSSIBLE FABERGE OBJECTS THAT OPEN INTO A LIVING SCENE — Faberge brass egg unfolding into a miniature mechanical garden with copper roses blooming and tiny clockwork hummingbirds in flight, ornate brass nautilus that opens into seven nested chambers each with a tiny moving creature.

━━━ EVERY ENTRY MUST INCLUDE ━━━
1. The CREATURE / FIGURE — not an abstract object, must have FACE / EYES / POSE / MOTION
2. IMPRESSIVE SCALE — life-size, falcon-size, cat-size, forearm-length — convey real presence
3. INTRICATE INTERNAL detail — gear-heart visible, hinged ribs, copper veins, articulated joints, glowing forge-stomach
4. VARIED DISPLAY — vary across: "on velvet pedestal" / "perched on a brass branch under spotlight" / "coiled around an ornate stand" / "suspended mid-flight from invisible wires" / "displayed on a gilded throne in a dark gallery" / "cradled in the hands of a marble statue" / "atop a polished mahogany pedestal in a single spotlight" / "seated on a velvet cushion in a Vatican-relic-style display alcove"

━━━ HARD BANS ━━━
- NO human heads / busts / faces / mannequin-heads as the primary subject (uncanny valley — UNPLEASANT to look at)
- NO skulls, NO body parts (eyes-in-jar, hearts-in-jar, severed hands) — horror-coded, BANNED
- NO insects (beetles, scarabs, ants — they feel creepy, not whimsical)
- NO swords / weapons / dueling-pistols as the primary subject
- NO abstract clockwork shapes — no clock-towers, no spires, no abstract gear sculptures (must be a CREATURE or FIGURE)
- NO bell-jar / glass-dome framing as the default — vary the display
- NO clocks / pocket-watches as the primary subject
- NO real-world equipment: telescopes, phonographs, typewriters, sextants, microscopes, alembics, compasses, calculators
- NO modern items, NO human characters in the room (only TINY figures inside a kinetic stage)
- NO plants as the primary subject (no roses, no bonsai — those are static)
- NO jewelry that sits still (rings, locked pendants — must be ANIMATED)
- NO musical instruments (guitar, violin, harp, piano, concertina — they don't have a face/soul)
- NO crowns sitting on busts/heads (the crown alone is fine — cushion or stand display, NOT on a bust)
- NO gothic / death / horror imagery — vibe is whimsical-pleasing, not unsettling
- NO jesters / clowns / harlequins of any kind (always render as creepy clown — BANNED)
- NO painted / masked faces on humanoid automatons (white-mask + glowing eyes + grin = uncanny horror)
- NO "shifting expression-plates" or "shifting expression" language (renders as creepy mechanical face)
- NO glowing eyes on humanoid automaton figures (cute on creatures, creepy on humanoids)

━━━ EXAMPLES (DO NOT REUSE — these set the gold-standard tone) ━━━
- "Articulated life-size brass peacock with iridescent copper plumage, gear-heart visible through chest panels, glowing teal-gem eyes that seem to track the viewer, perched on velvet pedestal under spotlight"
- "Falcon-sized brass dragonfly with stained-glass amber wings beating in slow motion, copper segmented body, ruby compound-eyes, suspended mid-flight from invisible wires in a Vatican-relic display alcove"
- "Life-size mechanical fox with hinged copper ribs revealing a glowing forge-heart, articulated tail flicking slowly, glowing amber eye-jewels, displayed on a polished mahogany throne"
- "Mechanical owl the size of a child, brass plumage layered like Faberge enamel, rotating moonstone eyes, articulated talons gripping a brass branch, single dramatic spotlight from above"
- "Dancing brass ballerina automaton in tutu of copper-leaf lacework, articulated joints in wrists and ankles, pirouetting eternally on a music-box pedestal lit by tiny stage-lanterns"
- "Mechanical raven the size of a real bird, hinged breast revealing a hidden compartment with a single tiny pearl, glowing onyx eyes, perched on a gilded skull pedestal"
- "Brass dragon coiled around an ornate stand the size of a large vase, scales rippling along its spine in slow waves, glowing forge-stomach pulsing red, gold-leaf horns curving back from its head"
- "Animated brass crown with shifting filigree gears, lapis-set jewels rearranging across the band like a slow constellation, displayed on a marble bust in a dark gallery"
- "Mechanical wolf the size of a real wolf, hinged jaw revealing brass teeth and a ruby tongue, copper-cable tail twitching, glowing amber eyes, displayed on a Roman-style plinth"
- "Faberge brass egg unfolding into a miniature mechanical garden with seven copper roses blooming and a tiny clockwork hummingbird in flight, on velvet display"

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering, no markdown.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
