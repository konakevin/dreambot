// Halloween pool taxonomy — SINGLE SOURCE OF TRUTH (Kevin 2026-09-05, HOLIDAY_DREAMS_PLAN.md FINAL list).
// 2026-09-06: 7 sub-themes that never read as Halloween were FOLDED into the elegant / goofy pools as year-round
// seeds (gothic_greenhouse, gothic_glam_editorial, ghost_hotel_1920s → elegant; afterlife_waiting_room,
// striped_suit_haunting → goofy); haunted_house_comedy pool retired. undead_wedding + stop_motion_whimsy came
// BACK the same day (their register-driven renders read fully Halloween).
// 14 main pools × sub-categories (13 + enchanted_harvest_court, 2026-09-07). Each pool: palette, signature objects, whether jack-o-lanterns are
// allowed, subs. Each sub: costume + setting hints for the generator. The engine mirror is
// supabase/functions/_shared/holidayPools.ts (parity-tested). Share = ceil(SHARE / subs) per sub, per table.
'use strict';
const SHARE = 70;
const POOLS = {
  halloween_neighborhood: {
    palette: 'orange and amber, cozy porch light, deep blue dusk',
    objects:
      'porches, cul-de-sacs, inflatable ghosts, yard skeletons, string lights, carved jack-o-lanterns',
    lanterns: true,
    subs: [
      'cozy_porch',
      'decorated_neighborhood',
      'trick_or_treating',
      'pumpkin_carving',
      'jack_o_lantern_overload',
      'suburban_halloween_chaos',
      'salem_town_night',
      'flashlight_suburbia_80s',
    ],
  },
  pumpkin_patch_night: {
    palette: 'orange and amber under an indigo night, harvest-moon gold',
    objects:
      'pumpkin fields, a hayride wagon, corn-maze torches, scarecrows on posts, a huge harvest moon',
    lanterns: true,
    subs: [
      'enchanted_pumpkin_patch',
      'jack_o_lantern_festival',
      'pumpkin_king_patch',
      'haunted_hayride',
      'corn_maze_torchlight',
      'fall_festival',
    ],
  },
  witch_cottage: {
    palette: 'deep purple, emerald cauldron glow, black, candle gold',
    objects:
      'a bubbling cauldron, spell books, black cats, broomsticks, dripping candles, hanging herbs, glowing potion bottles',
    lanterns: false,
    subs: [
      'witch',
      'witch_sisters_cottage',
      'witchy_victorian_house',
      'black_cat_alley',
      'cursed_library',
    ],
  },
  gothic_manor: {
    palette: 'black and deep violet, blood-red velvet, candlelight, silver moon',
    objects:
      'candelabra, a grand ballroom, velvet drapes, a black carriage, a vampire aristocrat register, an undead wedding aisle, a moonlit conservatory',
    lanterns: false,
    subs: [
      'haunted_mansion',
      'vampire',
      'midnight_carriage',
      'gothic_masquerade_ball',
      'macabre_family_mansion',
      'undead_wedding',
    ],
  },
  haunted_graveyard: {
    palette: 'cold blue and black, silver fog, a blood moon',
    objects:
      'leaning tombstones, ankle fog, ravens, a blood moon, a reaper silhouette, a headless rider in the distance, translucent ghosts, iron gates',
    lanterns: false,
    subs: [
      'reaper',
      'ghost_glam',
      'graveyard_picnic',
      'headless_hollow_bridge',
      'friendly_ghost_manor',
    ],
  },
  halloween_town_square: {
    palette: 'purple sky, acid green, black silhouettes, a huge pale moon',
    objects:
      'crooked spires, a spiral hill, a fountain of glowing green water, pumpkin-headed scarecrows, bats',
    lanterns: true,
    subs: ['halloween_town_square', 'stop_motion_whimsy'],
  },
  halloween_party: {
    palette: 'orange and black party lights, disco-ball sparkle, candy colors',
    objects:
      'a costume party, a disco ball, a dance hall stage, bowls of candy, a cozy cafe, a garage band, a monster hotel lobby',
    lanterns: true,
    subs: [
      'halloween_party',
      'movie_night',
      'skeleton_dance_hall',
      'candy_store_frenzy',
      'pumpkin_spice_cafe',
      'monster_garage_band',
      'monster_hotel_lobby',
    ],
  },
  haunted_attractions: {
    palette: 'carnival red and gold, strobe white, purple fog',
    objects:
      'a haunted-house walkthrough entrance, an abandoned carnival, a dark big top, a haunted carousel, a fortune-teller booth, a ticket booth in cobwebs',
    lanterns: false,
    subs: ['haunted_house_attraction', 'haunted_amusement_park', 'dark_carnival'],
  },
  mad_lab_and_monsters: {
    palette: 'electric green glass, steel grey, silver moonlight, storm blue',
    objects:
      'bubbling laboratory glassware, Tesla coils, a monster-hunter kit, a full moon over a pine forest, howling silhouettes',
    lanterns: false,
    subs: ['mad_scientist', 'monster_hunter', 'werewolf_moon_forest'],
  },
  ghost_hunting_crew: {
    palette: 'tan and brick red, slime green, sodium streetlight amber',
    objects:
      'utility jumpsuits, glowing gadget backpacks, a haunted library, a ghost trap, a brick firehouse, a converted hearse',
    lanterns: false,
    subs: ['ghost_hunting_crew'],
  },
  seance_parlor: {
    palette: 'violet velvet, candle amber, deep shadow',
    objects:
      'a glowing crystal ball, a tarot spread, a spirit board, drifting curtains, a levitating table, candelabra',
    lanterns: false,
    subs: ['seance_parlor'],
  },
  cute_halloween: {
    palette: 'pastel orange, lilac, cream, soft twilight',
    objects:
      'plush ghosts, a black cat in a tiny witch hat, candy-corn bunting, a miniature pumpkin cafe, round pumpkins',
    lanterns: true,
    subs: ['cute_halloween'],
  },
  ghost_pirate_ship: {
    palette: 'moonlit silver and black, cursed gold, sea-green fog',
    objects:
      'a ghost galleon, torn glowing sails, chests of cursed gold, a skeleton crew in the rigging, fog on the deck, a glowing compass',
    lanterns: false,
    subs: ['ghost_pirate_ship'],
  },
  // 2026-09-07: autumn_fae + harvest_royalty MOVED here from category=fall (Kevin: "move them if they're
  // good, viable pools" — both passed the Aug-19 archetype QA at 4.65 / 4.8 and every row is jack-o-lantern-lit,
  // which Fall no longer allows). Their own pool so the lantern rule stays true.
  enchanted_harvest_court: {
    palette: 'plum and amber, gilded oak leaf, candle gold, a huge harvest moon',
    objects:
      'a moonlit haunted rose garden, black roses on iron trellises, a cracked marble fountain, a candlelit harvest banquet hall, gourds and grapes down a long table, iron chandeliers, glowing jack-o-lanterns',
    lanterns: true,
    subs: ['autumn_fae', 'harvest_royalty'],
  },
};
const SUBS = {
  cozy_porch: {
    pool: 'halloween_neighborhood',
    costume: 'chunky knit sweaters, a plaid blanket',
    setting:
      'a beautiful porch framed by fiery Halloween-colored trees and bushes, carved pumpkins on the steps, an autumn wreath, warm lantern light at golden hour',
  },
  decorated_neighborhood: {
    pool: 'halloween_neighborhood',
    costume: 'cozy autumn coats and scarves',
    setting:
      'a cute suburban street draped in playful Halloween decor, inflatable ghosts, posed skeletons, glowing pumpkins, string lights, fiery trees at dusk',
  },
  trick_or_treating: {
    pool: 'halloween_neighborhood',
    costume: 'cozy hooded coats (hoods down), warm scarves, candy pails',
    setting:
      'a decorated neighborhood street at dusk, glowing jack-o-lanterns on every porch, warm-lit windows, orange string lights, drifting leaves, a low harvest moon',
  },
  pumpkin_carving: {
    pool: 'halloween_neighborhood',
    costume: 'cozy sweaters and aprons',
    setting:
      'a candlelit rustic porch strewn with carved pumpkins, scattered seeds, glowing lanterns, an autumn wreath, warm amber light, fiery foliage',
  },
  jack_o_lantern_overload: {
    pool: 'halloween_neighborhood',
    costume: 'a cozy flannel, a puffer vest, a knit scarf',
    setting:
      'a suburban front yard buried under hundreds of glowing carved jack-o-lanterns, pumpkins stacked up the porch steps and along the roofline, on every windowsill and fence post, a pumpkin-filled wheelbarrow, orange glow everywhere',
  },
  suburban_halloween_chaos: {
    pool: 'halloween_neighborhood',
    costume: 'a puffer vest over plaid flannel, a knit beanie, sneakers',
    setting:
      'a suburban cul-de-sac on Halloween night, toilet paper streaming from the trees, an egged mailbox, a bicycle with a basket of candy, inflatable ghosts, foam tombstones, glowing porch pumpkins on every house, porch lights blazing',
  },
  salem_town_night: {
    pool: 'halloween_neighborhood',
    costume: 'cozy wool coats, plaid scarves, knit beanies, leather boots',
    setting:
      'a New England town square on All Hallows Eve, a white church steeple, cobblestones lined with hundreds of glowing jack-o-lanterns, hay bales, a roaring bonfire, candy stalls under string lights, fiery maples, a huge harvest moon',
  },
  flashlight_suburbia_80s: {
    pool: 'halloween_neighborhood',
    costume:
      'a puffer vest over a striped tee, high-top sneakers, a walkie-talkie clipped to the belt',
    setting:
      'a foggy 1980s suburban street at night, bicycles dropped on a lawn, flashlight beams cutting the mist, porch string lights, a glowing woods edge, a chain-link fence',
  },
  enchanted_pumpkin_patch: {
    pool: 'pumpkin_patch_night',
    costume: 'cozy fall coats and scarves',
    setting:
      'a magical night pumpkin patch, hundreds of glowing carved jack-o-lanterns, drifting paper lanterns, fireflies, silver mist, a huge harvest moon',
  },
  jack_o_lantern_festival: {
    pool: 'pumpkin_patch_night',
    costume: 'cozy fall or light gothic attire',
    setting:
      'a hillside sea of thousands of glowing carved jack-o-lanterns at night, lantern-lit winding paths, warm orange glow, drifting embers, a huge harvest moon',
  },
  pumpkin_king_patch: {
    pool: 'pumpkin_patch_night',
    costume: 'a corduroy jacket, a knit scarf, a wool blanket over the shoulders',
    setting:
      'a vast night pumpkin patch under a giant amber moon, a single lantern on a plaid blanket, rows of pumpkins fading into mist, one colossal pumpkin looming at the far end, fireflies, a weathered fence',
  },
  haunted_hayride: {
    pool: 'pumpkin_patch_night',
    costume: 'flannel, corduroy, a cozy blanket over the shoulders',
    setting:
      'a lantern-lit wagon hayride through a misty farm at night, towering cornstalks, glowing jack-o-lanterns along the trail, a huge harvest moon',
  },
  corn_maze_torchlight: {
    pool: 'pumpkin_patch_night',
    costume: 'flannel, a chunky knit scarf, a denim jacket, a slouchy beanie',
    setting:
      'a night corn maze lit by torches, towering dry cornstalks, scarecrows on posts, a hay-bale tower, lanterns marking the path, a rising harvest moon, mist between the rows',
  },
  fall_festival: {
    pool: 'pumpkin_patch_night',
    costume: 'cozy flannel, scarves, beanies',
    setting:
      'a festive fall harvest festival at dusk, a mountain of pumpkins, hay bales, warm string lights, game booths, a glowing ferris wheel, a harvest moon',
  },
  witch: {
    pool: 'witch_cottage',
    costume:
      'flowing purple-and-black witch robes with wide sleeves, a wide-brim pointed hat tilted back off the face, silver star jewelry',
    setting:
      'an enchanted cottage with a glowing green cauldron, floating candles, a black cat, jack-o-lanterns',
  },
  witch_sisters_cottage: {
    pool: 'witch_cottage',
    costume:
      'flowing velvet witch robes in emerald, plum and rust with corseted bodices, wide-brim pointed hats tilted back off the face, tarnished silver charms',
    setting:
      'a candlelit crooked cottage crammed with spell books, a bubbling green cauldron, a black cat on the mantel, three broomsticks by the door, dripping candles on every surface, dried herbs and a glowing spellbook, jack-o-lanterns in every window',
  },
  witchy_victorian_house: {
    pool: 'witch_cottage',
    costume: 'a long flowing bohemian dress with a shawl, or a linen shirt with a wool vest',
    setting:
      'a Victorian witch house kitchen with herbs hanging from the beams, a spellbook open on the counter, midnight cocktails on a copper tray, a moonlit conservatory of belladonna and nightshade, candles in every window',
  },
  black_cat_alley: {
    pool: 'witch_cottage',
    costume: 'a long black wool coat, a striped scarf, fingerless gloves',
    setting:
      'a lantern-lit cobblestone alley at night with dozens of black cats perched on ledges, steps and barrels, glowing green cat-eyes in every shadow, carved pumpkins on the stoops, fog curling low',
  },
  cursed_library: {
    pool: 'witch_cottage',
    costume: 'a tweed blazer over a dark turtleneck, or a long black cardigan with a brooch',
    setting:
      'a towering cursed library at midnight, grimoires floating open off the shelves, rolling ladders, candle sconces guttering green, a cracked spellbook glowing on a lectern',
  },
  haunted_mansion: {
    pool: 'gothic_manor',
    costume: 'elegant gothic attire or cozy fall coats',
    setting:
      'a towering haunted Victorian mansion under a full moon, jack-o-lanterns strewn across the overgrown yard, black cats, wheeling bats, a wrought-iron gate, drifting fog',
  },
  vampire: {
    pool: 'gothic_manor',
    costume:
      'a floor-length opera cape with a high collar, crimson-and-black brocade, sharp Victorian formalwear',
    setting:
      'a candlelit gothic ballroom or moonlit castle courtyard, dripping candelabra, a huge full moon, jack-o-lanterns',
  },
  midnight_carriage: {
    pool: 'gothic_manor',
    costume: 'elegant gothic formalwear, flowing cloaks',
    setting:
      'a black horse-drawn carriage on a foggy cobblestone road, gothic wrought-iron lanterns, bare twisted trees, drifting mist, a huge full moon overhead',
  },
  gothic_masquerade_ball: {
    pool: 'gothic_manor',
    costume:
      'opulent gothic evening formalwear — a sharp velvet tailcoat with a jeweled brocade waistcoat and high cravat, or a sweeping jeweled ballgown, with long satin gloves',
    setting:
      'a grand candlelit gothic ballroom, dripping crystal chandeliers, tall arched windows spilling moonlight, deep-red velvet drapes, a carved staircase, jack-o-lanterns glowing along the balustrade',
  },
  macabre_family_mansion: {
    pool: 'gothic_manor',
    costume:
      'a black pinstripe suit with a red boutonniere, or a floor-length black velvet gown with sheer sleeves',
    setting:
      'a gothic mansion foyer in black velvet and dark wood, a carnivorous plant in a brass pot, a grand staircase, candelabra dripping wax, a suit of armor, cobwebbed chandeliers, a raven on the banister',
  },
  reaper: {
    pool: 'haunted_graveyard',
    costume:
      'an ornate flowing black robe with silver-embroidered hem, hood DOWN off the face, a tall scythe',
    setting:
      'a windswept moonlit cliff cemetery, rolling mist, a lone dead tree, ravens, a blood-orange harvest moon',
  },
  ghost_glam: {
    pool: 'haunted_graveyard',
    costume:
      'a tattered gossamer white-grey gown trailing into mist, pale ribbons, a dulled silver locket',
    setting:
      'a moonlit fog-drenched graveyard, leaning headstones, a wrought-iron gate, drifting will-o-wisps',
  },
  graveyard_picnic: {
    pool: 'haunted_graveyard',
    costume: 'a black velvet blazer over a crisp shirt, or a black lace midi dress with a cardigan',
    setting:
      'a moonlit graveyard picnic with a checkered blanket spread between mossy tombstones, a candelabra on a crypt, a wicker basket and wine, ankle-high fog, a raven on a headstone, jack-o-lanterns on the graves',
  },
  headless_hollow_bridge: {
    pool: 'haunted_graveyard',
    costume: 'a long wool riding coat, a waistcoat, tall boots',
    setting:
      'an autumn covered bridge in thick fog, a jack-o-lantern glowing on the railing, a distant headless rider silhouette on the far bank, twisted trees, a blood-orange moon, fallen leaves on the planks',
  },
  friendly_ghost_manor: {
    pool: 'haunted_graveyard',
    costume: 'a cozy cardigan and jeans, or a soft plaid dress with a cardigan',
    setting:
      'a grand haunted manor foyer with playful translucent ghosts drifting up the staircase, floating candlesticks, a swaying chandelier, sheet-ghost shapes peeking from doorways, dusty gilt portraits, moonlight through tall windows',
  },
  halloween_town_square: {
    pool: 'halloween_town_square',
    costume: 'a pinstriped patchwork suit, or a rag-doll patchwork dress with mismatched stitching',
    setting:
      'a whimsical crooked gothic town square, a spiral hill curling under an enormous full moon, pumpkin-headed scarecrows, a fountain of glowing green water, crooked spires, singing jack-o-lanterns lining the walls, bats across the sky',
  },
  halloween_party: {
    pool: 'halloween_party',
    costume: 'festive party outfits with playful light costume accents, cozy layers',
    setting:
      'a lively home Halloween party at night, orange-and-purple string lights, carved pumpkins, cobweb garlands, warm candlelit glow, a decorated mantel',
  },
  movie_night: {
    pool: 'halloween_party',
    costume: 'cozy pajamas and oversized sweaters, a blanket',
    setting:
      'a cozy living room decked for Halloween, glowing jack-o-lanterns, cobweb garlands, a candy bowl, warm firelight, a soft spooky glow, a black cat',
  },
  skeleton_dance_hall: {
    pool: 'halloween_party',
    costume: 'a vintage tuxedo with tails, or a flapper-style fringe dress',
    setting:
      'a grand dance hall full of dancing skeletons, a bone xylophone band on stage, jack-o-lantern stage lights, a mirrored ball, cobwebbed balconies, purple and orange spotlights',
  },
  candy_store_frenzy: {
    pool: 'halloween_party',
    costume: 'a colorful cardigan over a striped tee, or a polka-dot dress',
    setting:
      'a Halloween candy shop with floor-to-ceiling jars of candy, a giant candy bowl on the counter, candy-corn garlands, glowing pumpkins in the window, string lights, a gumball machine',
  },
  pumpkin_spice_cafe: {
    pool: 'halloween_party',
    costume: 'an oversized knit sweater, a scarf, a beanie',
    setting:
      'a cozy Halloween cafe with pumpkin displays on every shelf, spider-web latte art on the counter, black-cat cookies in the case, string lights, a wreath of autumn leaves, fogged windows, a glowing pumpkin in the doorway',
  },
  monster_garage_band: {
    pool: 'halloween_party',
    costume: 'a leather jacket with band patches, a striped tee, ripped jeans',
    setting:
      'a suburban garage band rehearsal with a mummy on drums, a swamp creature on bass, a witch on keys, amps stacked high, a jack-o-lantern drum kit, string lights, cobwebbed rafters',
  },
  monster_hotel_lobby: {
    pool: 'halloween_party',
    costume: 'a bellhop-style jacket with brass buttons, or a chic travel dress with a scarf',
    setting:
      'a grand monster hotel lobby with coffin luggage carts, a bandaged concierge at the desk, gargoyle bellhops, a bubbling green fountain, velvet ropes and brass',
  },
  haunted_house_attraction: {
    pool: 'haunted_attractions',
    costume: 'a denim jacket, a graphic tee, a canvas bag of candy',
    setting:
      'the entrance of a suburban haunted-house attraction at night, strobe lights flashing through fog, a ticket booth draped in cobwebs, animatronic ghouls in the doorway, a hearse parked on the lawn, orange and purple floodlights',
  },
  haunted_amusement_park: {
    pool: 'haunted_attractions',
    costume: 'a turtleneck and corduroy, an ascot, a groovy seventies jacket',
    setting:
      'an abandoned carnival at night with a dead Ferris wheel, a funhouse of cracked mirrors, a sheet-ghost fleeing between booths, a flower-painted van parked by the gate, flashlight beams in fog, popcorn stands glowing',
  },
  dark_carnival: {
    pool: 'haunted_attractions',
    costume:
      'a ringmaster tailcoat with sequined lapels, or a sequined acrobat dress with a feathered headpiece off the face',
    setting:
      'a dark carnival at night, a striped big top glowing from within, a haunted carousel with glowing horses, a fortune-teller booth, gaslight and drifting fog',
  },
  mad_scientist: {
    pool: 'mad_lab_and_monsters',
    costume:
      'a slightly-too-big white lab coat over a rumpled shirt and skinny tie, rubber gloves, brass goggles pushed up onto the forehead',
    setting:
      'a retro laboratory crackling with Tesla coils, bubbling green-and-violet beakers, jars of glowing goo, a chalkboard',
  },
  monster_hunter: {
    pool: 'mad_lab_and_monsters',
    costume:
      'a long weathered leather coat, buckled waistcoat, a crossbow strap, tall travel boots',
    setting:
      'a fog-drowned cobblestone village square at midnight, guttering lanterns, bats, a full moon',
  },
  werewolf_moon_forest: {
    pool: 'mad_lab_and_monsters',
    costume: 'a torn plaid shirt with rolled sleeves, jeans, hiking boots',
    setting:
      'a moonlit pine forest under a silver full moon, howling wolf silhouettes on a distant ridge, fog on the forest floor, twisted branches, a lantern-lit trail',
  },
  ghost_hunting_crew: {
    pool: 'ghost_hunting_crew',
    costume:
      'a tan utility jumpsuit with a name patch, work boots, a glowing gadget backpack with coiled tubing',
    setting:
      'a haunted city library at night with books floating off the shelves, green slime dripping from a card catalog, a glowing ghost trap on the marble floor, a brick firehouse garage with a converted hearse',
  },
  seance_parlor: {
    pool: 'seance_parlor',
    costume:
      'a high-collared black lace dress with a cameo, or a black velvet waistcoat with a silk cravat',
    setting:
      'a candlelit Victorian seance parlor, a crystal ball glowing violet, a spirit board with a planchette, a tarot spread across a velvet table, curtains drifting with no wind, a levitating tea service',
  },
  cute_halloween: {
    pool: 'cute_halloween',
    costume:
      'a fuzzy pastel sweater with a tiny ghost embroidery, or a lilac cardigan with candy-corn buttons',
    setting:
      'a pastel kawaii Halloween scene, plush white ghosts peeking from a lilac doorway, a black cat in a tiny witch hat, candy-corn bunting, a miniature pumpkin cafe with round windows, soft orange and purple twilight',
  },
  ghost_pirate_ship: {
    pool: 'ghost_pirate_ship',
    costume:
      'a long pirate frock coat with brass buttons, a tricorn pushed back off the face, tall boots',
    setting:
      'a moonlit ghost galleon with torn sails glowing silver, fog rolling over the deck, chests of cursed gold spilling coins, skeleton crew silhouettes in the rigging, a glowing compass',
  },
  undead_wedding: {
    pool: 'gothic_manor',
    costume:
      'a tattered ivory wedding gown with a crown of dead roses, and a faded black tailcoat with a wilted boutonniere',
    setting:
      'a blue-lit crypt chapel wedding with a skeletal band on the altar steps, black roses down the aisle, a thousand candles, cobwebbed pews, a moon through a broken rose window',
  },
  autumn_fae: {
    pool: 'enchanted_harvest_court',
    costume:
      'a gown of deep-plum and black petals with gossamer dark wings, or a plum velvet doublet with a thorn-and-berry crown resting back off the brow',
    setting:
      'a moonlit haunted rose garden, black roses climbing iron trellises, a cracked fountain, fireflies, carved jack-o-lanterns glowing on weathered benches, an enormous amber moon',
  },
  harvest_royalty: {
    pool: 'enchanted_harvest_court',
    costume:
      'a regal cloak-gown or cloak-and-doublet of amber, russet and gold autumn-leaf brocade, a crown of gilded oak leaves and acorns, topaz jewels',
    setting:
      'a candlelit harvest banquet hall, a long table of gourds, grapes and carved jack-o-lanterns, iron chandeliers ablaze, a roaring stone hearth, violet moonlight through tall windows',
  },
  stop_motion_whimsy: {
    pool: 'halloween_town_square',
    costume:
      'a patchwork pinstripe suit with mismatched buttons, or a rag-doll dress with visible stitching',
    setting:
      'a slightly-wrong stop-motion world: a too-perfect crooked house, a garden clipped into curling spirals, an oversized moon, tiny circus tents, a long tunnel of purple light',
  },
};
const POOL_OF_SUB = Object.fromEntries(Object.entries(SUBS).map(([s, d]) => [s, d.pool]));
const shareFor = (main) => Math.ceil(SHARE / POOLS[main].subs.length); // always round UP (Kevin)
module.exports = { SHARE, POOLS, SUBS, POOL_OF_SUB, shareFor };
