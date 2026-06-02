#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/toybot/seeds/toybox_chaos_scenes.json',
  total: 400,
  batch: 15,
  metaPrompt: (
    n
  ) => `Write ${n} TOYBOX-CHAOS scenes for ToyBot's toybox-chaos path. The toybox just got dumped. MIXED-MEDIUM ensemble — multiple toy types coexist on a real-world surface at REAL-WORLD scale. Size-mismatch IS the point. Each toy keeps its OWN native style. Each entry 20-32 words.

━━━ HARD RULES ━━━
- AT LEAST 3 different toy types per scene.
- All toys at their actual physical size (12-inch plush next to 1.5-inch Hot-Wheels next to 2-inch LEGO minifig — exactly as on real floor).
- Real-world surface anchor (kid's bedroom floor / coffee-table / playmat / garage floor / picnic blanket / kitchen counter / hardwood / rug / blanket).
- Each toy described in OWN native medium (LEGO stays LEGO with studs / plush stays plush with fabric / mech stays chrome).
- Mid-action interaction across toy-tribes.

━━━ TOY ROSTER (mix per scene) ━━━
LEGO minifigs (~1.5", studs, blocky), 3.75" action-figures (jointed), plush teddies (6-12", fabric), Hot-Wheels die-cast (3", chrome wheels), Barbie fashion-dolls (11.5", molded hair), green army-men (2", oval-base), mech-toys (4-6", chrome), Sylvanian flocked-animals (3", velvet), vinyl designer-toys (4", oversized-head), claymation puppets (5", clay-fingerprints).

━━━ EXAMPLE ARCHETYPES (rotate, vary — mix 3-5 toy types each) ━━━
- LEGO knights raiding plush picnic — minifigs charging across red-checkered blanket toward teddy with tea-cup
- Hot-Wheels chase through army-men trench — die-cast cutting through formation in mid-charge
- Mech defending Barbie tea-party — chrome mech kneeling beside Barbie at miniature tea-set, plush-bunny watching
- LEGO + plush + mech rooftop standoff — three toy-tribes converging on shoebox rooftop, Hot-Wheels skidding around corner
- Coffee-mug fortress siege — LEGO knights and 3.75" action-figures climbing mug-fortress, plush-dragon overhead
- Plush bear-leader rallying mixed-army — stuffed-teddy with knit-cape pointing forward, army-men + LEGO + Barbies behind
- Mech-toy delivering pizza to plush-fort — chrome mech with pizza-box at sock-pile fortress door, plush-bear opening
- Sylvanian-bunny driving Hot-Wheels — flocked-animal in driver-seat, mech-passenger riding shotgun
- Plush teddy referee at LEGO + army-men football — stuffed-bear with whistle, minifigs vs soldiers
- Toybox dump-out moment — toys cascading from overturned toybox onto floor, all tribes mid-tumble
- Vinyl-toy DJ-set on bookshelf — oversized-head designer at mini-turntables, LEGO + plush crowd watching
- Claymation-character commanding mech-army — clay-figure pointing across counter at chrome mech-formation

━━━ MUST-HAVE per entry ━━━
- 3+ different toy types
- Real-world surface anchor
- Each toy in own native medium language
- Visible scale-mismatch
- Mid-action narrative

━━━ SCENE/SETTING DEDUP RULE (critical at 400 entries) ━━━
- No two entries share the same SETTING + CORE-NARRATIVE combo
- Vary settings: kid's bedroom floor, coffee table, playmat, garage floor, picnic blanket, kitchen counter, bathroom tile, stairs, shoe-rack closet, basement carpet, bookshelf top, dining table, garden patio, pool deck, attic, hallway runner, rug pattern, slipper line, sock pile, blanket fort, cardboard box, bath tub, sink, fireplace hearth, windowsill, desk top, dresser top, cereal box landscape, lego-pile mountain, backpack interior, lunch box arena, christmas tree base, halloween candy bowl, easter basket, birthday-cake centerpiece, sandbox, sandcastle, pillow fort, treehouse interior, cookie jar, fridge magnets cityscape
- Vary core-narratives: raid / rescue / parade / wedding / election / heist / talent show / detective case / cooking competition / sports tournament / archaeological dig / fashion show / movie premiere / concert / fireworks / picnic / parade / hostage situation / gold rush / spy infiltration / royal coronation / pirate plunder / time-travel / dimensional portal / pet rescue / library scavenger hunt / lighthouse rescue / submarine voyage / circus train / haunted mansion exploration / scientific experiment / superhero origin / villain reveal / undercover sting / lost treasure dig / underwater adventure / castle siege / gladiator arena

━━━ BANNED ━━━
- Unifying art style across the toys (each keeps its own)
- Scaling toys to match each other
- Real children / hands / humans in scene
- Fantasy-world / sci-fi-world settings (real-world household only)
- Single-toy-type scenes
- CGI / illustration.

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
