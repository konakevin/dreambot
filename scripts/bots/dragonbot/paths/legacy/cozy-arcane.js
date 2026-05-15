const pools = require('../pools');
const blocks = require('../shared-blocks');

// Inline rolls for character variety. Race rolls from the shared
// FANTASY_RACE pool (50 entries, same pool female/male-warrior use).
// Gender / age / archetype roll inline so every render gets distinct
// character DNA without needing a separate cozy_arcane_characters pool.
const GENDERS = ['woman', 'man'];
const AGES = [
  'young apprentice in their early twenties',
  'young apprentice in their mid-twenties',
  'mid-twenties scholar',
  'thirties scholar',
  'mid-thirties scholar',
  'forties scholar',
  'mid-forties sage',
  'fifties mature sage',
  'sixties elder sage',
  'ancient seventies sage',
];
const ARCHETYPES = [
  'wizard with embroidered velvet mage-robes and glowing-rune cuffs',
  'alchemist in a leather-and-wool stained apron over a linen tunic, ink-blackened fingertips',
  'scholar in a wool scholar-coat with rolled-back sleeves, ink-stained fingers, glasses pushed up on brow',
  'hedgewitch in a layered shawl-and-skirt of dyed wool, beaded necklaces, herb-pouches at the belt',
  'dragon-lorekeeper in deep-green velvet robes with embroidered dragon-scale motifs and a dragon-tooth pendant',
  'arcane-mage in midnight-blue robes embroidered with silver constellations, gemmed staff at hand',
  'sage in worn travel-robes layered with a thick wool cloak, ink-stained scrolls in their satchel',
  'apprentice in simple linen robes with a leather rune-belt, glowing-mark forearms',
  'apothecary in a clay-and-soot-marked apron over patched workclothes, glowing potion-runes on knuckles',
  'sorcerer in dark-velvet robes with crystal-cluster harness, glowing tattoos visible on collarbone',
];

module.exports = ({ sharedDNA, vibeDirective, picker }) => {
  const setting = picker.pickWithRecency(pools.COZY_ARCANE_SETTINGS, 'cozy_arcane_setting');
  const race = picker.pickWithRecency(pools.FANTASY_RACE, 'cozy_arcane_race');
  const gender = GENDERS[Math.floor(Math.random() * GENDERS.length)];
  const age = AGES[Math.floor(Math.random() * AGES.length)];
  const archetype = ARCHETYPES[Math.floor(Math.random() * ARCHETYPES.length)];
  const lighting = picker.pickWithRecency(pools.LIGHTING, 'lighting');
  const atmosphere = picker.pickWithRecency(pools.ATMOSPHERES, 'atmosphere');

  return `You are a fantasy concept-art painter writing COZY INTIMATE scenes for DragonBot — warm, inviting corners of an epic high-fantasy world. Same universe as dragons and vast landscapes, but zoomed into the WARM PRIVATE SPACES where wizards rest, where hearths crackle, where candlelight pools on worn wood. Output wraps with style prefix + suffix.

${blocks.EPIC_FANTASY_BLOCK}

${blocks.PAINTERLY_ILLUSTRATION_BLOCK}

${blocks.CINEMATIC_COMPOSITION_BLOCK}

${blocks.IMPOSSIBLE_BEAUTY_BLOCK}

━━━ THE INHABITANT (NON-NEGOTIABLE — render this character exactly) ━━━
A ${age} ${gender}, race: ${race}. They are a ${archetype}.

Render the FANTASY RACE features unmistakably (skin tone, ear shape, horn / tail / tusks if applicable, eye color, distinguishing anatomy). Render the AGE visible in their face and posture. Render the ARCHETYPE garment exactly. NEVER substitute the race for a generic human, NEVER default to "old white wizard with beard" — preserve every rolled detail above.

The character is caught in a candid intimate moment within the cluttered sanctum — pick ONE per render:
- Hunched over an open grimoire with a quill mid-write
- Stirring a bubbling cauldron of glowing potion
- Holding a glowing crystal orb with both hands, examining it
- Reading a tome by firelight in a wing-back chair, robes pooled around them
- Standing at the window with a steaming mug, looking out at the storm
- Levitating an ingredient over a flask with focused concentration
- Asleep at the desk surrounded by scrolls, head on folded arms
- Drawing a magical sigil mid-gesture with glowing fingertips
- Petting a familiar (a small dragon-cat / a raven on the desk / a glowing wisp-pet)

Character occupies 25-40% of frame, off-center, surrounded by the magical clutter described below. NEVER posing, NEVER looking at viewer — absorbed in their craft, "caught on a hidden camera in their sanctum."

━━━ OPULENT MAGICAL CLUTTER (NON-NEGOTIABLE) ━━━
This space is LIVED-IN by a wizard / scholar / alchemist / dragon-lorekeeper. Every render must be DENSELY FILLED with specific magical objects and accessories — never an empty room. STACK AT LEAST 6 of these categories visibly in every frame:

- ALCHEMY GEAR — glass alembics with bubbling colored liquids, copper distillation rigs, mortars and pestles stained with herbs, racks of labeled apothecary bottles, dragon-glass beakers, clay crucibles
- BOOKS + SCROLLS — towering stacks of leather-bound tomes with metal clasps, rolled scrolls tied with crimson ribbon, an open grimoire with glowing script, parchment maps unfurled across the desk, ink-pots and quills mid-write
- GLOWING ARTIFACTS — crystal orb pulsing with inner light, floating runes orbiting a pedestal, an enchanted compass spinning on its own, a glowing magic-stone in a wrought-iron stand, levitating candle-flames
- DRAGON-LORE DECOR — dragon skull mounted on the wall, dragon-scale display case, dragon-claw pen-rests, dragon-tooth letter-opener, dragon-egg in a velvet cradle
- HANGING DETAIL — bundles of dried herbs and flowers hanging from rafters, drying mushrooms strung on twine, garlands of dragon-tail feathers, suspended astrolabes and orreries, hanging brass lanterns
- FURNITURE TEXTURE — cluttered roll-top desk overflowing with parchment, deep wing-back armchair worn at the arms with a fur throw, low table with carved runes, chest with iron strap-bands and brass lock, ornate carved wood with worn varnish
- LIGHT-SOURCE OBJECTS — multi-arm candelabra with melted-wax cascading down, brass oil-lantern with magical blue-flame, fireplace with embers and brass tools, floating glowing wisp-orbs, lit pipe smoldering on a stand
- MAP / NAVIGATION — wall-pinned maps with thumbtacks and red string, brass compass on the desk, celestial chart on parchment, a cracked globe of an unknown world, a sextant on the windowsill
- CREATURE COMPANIONS (objects, not animals) — empty raven-cage with door open, cat-bed with a curled depression, a perch with feathers, a fish-bowl with a glowing creature
- POTIONS + INGREDIENTS — glass vials of glowing colored liquids in a wooden rack, jars of pickled-things, bottles of sparkling powder, packets of folded herbs, a small cauldron simmering
- TROPHIES + CURIOSITIES — taxidermied owl on a perch, butterfly collection in a frame, glass jar with a preserved tiny dragon, rune-carved wooden box, gilded chess-set mid-game

Render at least 6 categories simultaneously. The room should look ALIVE — like the wizard just stepped out for a moment. Every surface has STUFF on it. Every shelf is full. Light pools across MULTIPLE INTERESTING OBJECTS, not bare wood.

━━━ THE COZY SPACE ━━━
${setting}

━━━ LIGHTING ━━━
${lighting}

━━━ ATMOSPHERIC DETAIL ━━━
${atmosphere}

━━━ SCENE-WIDE COLOR PALETTE ━━━
${sharedDNA.scenePalette}

━━━ SECONDARY LIGHTING VIBE ━━━
${sharedDNA.colorPalette}

${blocks.BLOW_IT_UP_BLOCK}

━━━ MOOD CONTEXT ━━━
${vibeDirective.slice(0, 250)}

━━━ COMPOSITION ━━━
Mid or mid-close framing. These are INTIMATE spaces — not cathedral halls. The private study off the grand library, the hearthside corner of a dwarven forge-hall, a wizard's reading nook carved into ancient stone. WARMTH is everything: firelight, candleglow, hearth-embers, lantern-light pooling on worn surfaces. Rich texture on every surface — aged leather, dripping wax, weathered stone, tarnished brass. The viewer should want to SIT DOWN in this space. Cozy but still unmistakably high-fantasy.

Output ONLY the raw 60-90 word scene description. Comma-separated phrases. NO preamble, NO titles, NO headers, NO ━━━ or ═══ or ### markers, NO **bold labels**, NO "render as" suffixes. Just the phrases, starting immediately with the scene content.`;
};
