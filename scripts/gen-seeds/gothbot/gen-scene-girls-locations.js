#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/gothbot/seeds/scene_girls_locations.json',
  total: 200,
  batch: 12,
  metaPrompt: (n) => `You are writing ${n} DARK GOTHIC FLOWER-GARDEN + COURTYARD settings for GothBot's scene-girls path. Each entry is ONE richly-detailed, painterly, dark-gothic garden or courtyard location where a dark-fantasy woman can be caught in a quiet oil-painting moment. Pre-Raphaelite-Brotherhood-dark + Crimson-Peak-garden + Castlevania-rose-maze energy.

Each entry: 25-40 words. ONE specific gothic flower-garden or courtyard with enough detail to read as a distinct oil-painting-quality setting.

━━━ ALL ENTRIES ARE GARDEN / COURTYARD / OUTDOOR-STONE SETTINGS ━━━
NOT interior rooms. NOT libraries. NOT crypts. NOT alchemy labs. NOT cliffs. NOT cathedrals (interior). Only gothic outdoor garden + courtyard + flower-bed + terrace + open-air settings where a woman could walk among flowers.

━━━ NON-NEGOTIABLE — EVERY ENTRY IS MOONLIT / TWILIGHT / SUNSET / NIGHT ━━━
Every single entry takes place during MOONLIT, TWILIGHT, BLUE-HOUR, SUNSET, GOLDEN-HOUR, or NIGHT. NEVER midday / bright / sunny / cheerful daylight.

Every entry MUST weave in atmospheric LIGHTING HUES from this eerie palette — pick 2-3 per entry:
- Purple / violet / magenta twilight sky
- Green / emerald / witch-fire-green accents
- Amber / honey / candle-gold warm pools
- Orange / sunset-crimson / forge-ember warm-burn
- Black / deep-obsidian / midnight-blue shadows
- Silver / moonlit-white / pearl-cool highlights
- Blood-red / crimson-stained-glass accent
- Cold-teal / sapphire moon-shadow

The light should cast EERIE colored glow across the garden — NOT neutral daylight. Stone becomes violet-tinted, roses catch amber-candle warmth, mist glows faintly green or pink, fountain water reflects sunset-orange, shadows pool blue-indigo. EVERY entry names the time-of-day + specific atmospheric lighting hues.

Time-of-day tokens to rotate (one per entry):
- "moonlit" / "under a full moon" / "under a crescent moon" / "blood-moon-lit"
- "twilight" / "blue-hour" / "violet-twilight" / "dusk" / "gloaming"
- "sunset" / "golden-hour" / "crimson sunset" / "amber-sunset" / "smoldering sunset"
- "pre-dawn" / "cold-blue dawn" / "gray-blue pre-dawn"
- "night" / "deep night" / "midnight" / "witching-hour"
- "candlelit dusk" / "lantern-lit twilight"

If an entry doesn't name a time-of-day + 2-3 eerie-hue lighting tokens, it's WRONG.

━━━ DARK-GOTHIC GARDEN CATEGORIES TO ROTATE ━━━

Max ~4 entries per category:

1. BLACK ROSE GARDENS — black-rose bushes climbing wrought-iron trellises, crimson-accent black-rose-mazes, rose-pillar gardens with dripping blossoms, wet-cobblestone rose-path winding through blood-rose beds
2. NIGHTSHADE / POISON-PLANT GARDENS — belladonna beds, nightshade tangles along iron fences, moonflower patches, mandrake-root gardens, hemlock borders, moonlit poison-garden apothecary-plots
3. CATHEDRAL CLOISTER GARDENS — arched stone cloister-walks circling a central garden, monk's-herb-garden in a cloister square, cathedral courtyard with stone fountain and ivy-draped columns
4. MANOR COURTYARDS — grand gothic-manor stone courtyards with saint-statues and black-rose beds, weathered flagstone quads with gothic-arch windows overlooking from all sides
5. GRAVEYARD GARDENS — overgrown cemetery with wildflower-bed between tombstones, moss-covered grave-garden with rose-vines climbing monuments, grave-hill garden with willows
6. MOONLIT TERRACE GARDENS — grand stone terraces overlooking misty valleys, moonlit balcony-garden with potted black-roses, parapet-gardens at cathedral height
7. FOUNTAIN COURTYARDS — central fountain in a stone plaza surrounded by rose beds, weathered angel-fountain with wild-rose vines, dark-water reflecting-pool garden
8. CONSERVATORY / GLASSHOUSE EXTERIORS — wrought-iron greenhouse facades wreathed in climbing wisteria, ivy-draped conservatory with broken glass panes, black-glass greenhouse with roses visible through dark panes
9. ROSE-MAZE / HEDGE-MAZE GARDENS — tall hedgerow-mazes at twilight, moonlit rose-maze with wet-cobble paths, formal hedge-maze with saint-statue-lined walks
10. WILD / OVERGROWN GARDENS — reclaimed ancient gardens where nature has won back the stone, gothic-ruin-garden with rose-vines climbing fallen columns, wildflower-reclaimed walled gardens
11. MIST / FOG-BOUND GARDENS — fog-drowned herb gardens, ground-mist pooling between flower beds, mist-choked rose-walks under pale moonlight
12. CLIFFSIDE / SEA-EDGE GARDENS — cliff-top gothic gardens overlooking stormy seas, seawall-terrace gardens with salt-wind-battered roses, coastal cathedral-garden with wet stone and sea-fog
13. POND / LILY-GARDEN — dark-water lily-pond gardens with weeping willows, stone-edged lotus pools with water-lilies, moon-reflecting pond-gardens
14. CANDLE-LIT RITUAL GARDENS — chalk-sigil-inscribed stone circles ringed by candles and night-blooming flowers, altar-gardens with votive candles scattered through flowerbeds
15. SEASONED / AUTUMNAL GARDENS — fallen-leaf-carpeted rose gardens in late autumn, dying-flower beds with frost-glinting petals, winter-brink gardens with last blooms
16. ARCHITECTURAL FRAME — gothic-arched pergolas dripping with flowering vines, stone-column gardens with flowering ivy, statue-lined garden walks
17. HIDDEN / SECRET GARDENS — walled secret gardens accessed through an iron gate, hidden courtyard behind a cathedral, forgotten flower-garden inside ruined abbey-walls
18. HERB / WITCHCRAFT GARDENS — organized herb-beds with labeled stone markers, witch's kitchen-garden with hanging drying herbs, sigil-bordered witch-garden plots
19. RAINY / WET GARDENS — rain-slick cobblestone courtyards between rose-beds, wet-petal gardens after a storm, dewdrop-heavy flower-bed paths
20. TWILIGHT / BLUE-HOUR GARDENS — gardens at the exact moment between day and night, violet-twilight rose-gardens, blue-hour fountain courtyards

━━━ MUST-HAVE FOR EVERY ENTRY ━━━
- SPECIFIC flower(s) named (black roses / belladonna / moonflower / nightshade / lilies / wisteria / ivy / thorn / rose / willow / cypress / yew / poppies / hellebore — rotate)
- Architectural detail (wrought-iron trellis / flagstone path / stone column / saint-statue / fountain / cloister-arch / sundial / stone bench / garden-gate)
- Atmospheric hook (mist / rain / moonlight / dew / wet cobbles / dripping vines / candle-glow / fog)
- LIGHTING hint (moonlit / candlelit / blue-hour twilight / overcast / storm-gray / pre-dawn mist)
- Dark, gothic, painterly, oil-painting-worthy tone
- NO character described (path brief handles her)
- NO action verb (actions pool handles that)

━━━ BANNED ━━━
- NO interior rooms / libraries / crypts / alchemy-labs / cathedral-nave-interiors / bedrooms
- NO castle-exterior-wide-shots without garden foreground
- NO modern elements (cars, streetlamps, electric lights)
- NO sunny cheerful gardens — DARK, GOTHIC, moonlit, twilight, mist-bound
- NO pentagrams / explicit satanic iconography
- NO characters / no action

━━━ WRITING EXAMPLES — every entry names time-of-day + 2-3 eerie-hue lighting tokens ━━━
"Violet-twilight walled herb garden with lavender beds and rosemary hedges, low purple-pink sky bleeding into cold sapphire at the horizon, amber-candle glow from a wrought-iron lantern on a stone bench casting warm pools on weathered flagstones, emerald-glowing witch-fire sparks rising from a cauldron at the far wall, thin mist curling between the beds"

"Blood-moon-lit sunken courtyard at midnight with deep-obsidian black stone paths between tall hedges, crimson-red moonlight casting violent shadows across a cracked marble fountain, warm amber-lantern burn spilling from a rusted iron sconce, thin ground-mist glowing faintly green, shadowed belladonna beds"

"Crimson sunset cliffside garden with salt-twisted hawthorn trees, smoldering orange-and-magenta sky behind a silhouetted stone balustrade, golden-amber last-light striking the petals of wind-battered white briar roses, deep violet shadows pooling between the beds, pink sea-fog glowing below"

"Candlelit dusk cloister garden with stone columns ringing a central sundial, dozens of votive candles casting warm amber pools across moss-covered flagstones, cold blue twilight above the arches, emerald witch-fire glimmering at a corner shrine-niche, deep midnight-blue shadows pooling between the pillars"

"Moonlit abandoned manor courtyard at witching-hour, pale silver moonlight silvering broken flagstones between overgrown flowerbeds, crimson-stained-glass light bleeding from one gothic window casting blood-red shards across a marble bench, warm amber glow from a fallen oil lamp, deep-teal shadows in the fallen-column corners"

"Pre-dawn cold-blue gray herb garden with mist still low on the ground, first faint amber sunrise bleeding behind silhouetted yew hedges, deep-indigo shadows in the rows of thyme and rosemary, a single candle still burning amber on a stone bench from the night before, thin fog glowing pale-pink at horizon"

"Golden-hour sunken nightshade garden at sunset, smoldering orange-crimson sky above, warm amber light striking moss-covered statues at low angle, deep-violet shadows pooling between overgrown belladonna and hemlock beds, emerald witch-fire-green glow from a distant shrine, wisps of smoke drifting through the warm light"

"Lantern-lit twilight cathedral cloister garden, dozens of iron lanterns burning warm-amber in the arched walkway, cold violet-twilight sky above, deep-emerald shadows in the yew hedge, crimson accent from a single stained-glass window bleeding onto mossy stones, thin blue mist curling between the columns"

"Deep-night graveyard garden under a full moon, silvery-cold moonlight casting long blue-shadows across wildflower-reclaimed tombstones, amber-candle glow from a single votive at a grave-shrine, faint green witch-fire glimmer from the chapel ruin behind, ground-mist glowing pale-pink in the moonlight, wind-twisted cypress silhouettes"

"Gloaming-hour rain-slick terrace garden overlooking a misty valley, violet-magenta twilight sky, deep-indigo shadow pooling in the corners of the stone balustrade, warm amber glow spilling from manor windows behind, thorn-vines and wisteria dripping with recent rain, fog rolling in from below"

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
