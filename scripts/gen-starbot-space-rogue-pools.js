#!/usr/bin/env node
/**
 * Generate the StarBot `space-rogue` axis pools using Sonnet.
 *
 * Own gen script (NOT recipes bolted into the shared gen-starbot-pool.js) so this build never
 * contends with another agent on that file. Infrastructure (buildPrompt / callSonnet / parseArray /
 * signature + title dedup / target loop / timestamped backup) mirrors
 * gen-brickbot-airfield-pools.js verbatim so the pool files come out byte-compatible.
 *
 * THE PATH (Kevin, 2026-09-25): "a highly stylized version of characters in sci-fi settings —
 * alien planets, bounty hunters, space pubs and bars/hangouts/clubs on alien planets, street
 * scenes in cities on alien planets, inside space ships … the setting should always lend itself
 * to somewhere a sleek, sexy looking space character would be … women characters to begin with …
 * push boundaries on visuals … the scenes to look as sexy and cool as the main character" and
 * "i want to see some crazy looks out of it — all sorts of cool alien races and humans for
 * characters — all out killin it".
 *
 * R4 CHARACTER REBUILD (Kevin's verdict on the 15 R0-R3 renders, 2026-09-25): "these are too basic
 * looking — the women look like they're just in leisure outfits mostly. i want these to be more
 * 'boba fett' in the fact that she's a mystery, and she stands out from the crowd because of her
 * 'out there' attire and dangerous looking 'edge'. the scenery and settings are really good, just the
 * character looks and designs need to be fixed — more alien looking figures, or alien/human hybrids".
 * So the four CHARACTER pools (lineage, costume, role, hero_object) were regenerated under new
 * recipes; the seven SETTING pools (venue, set_dressing, light_story, air, beat, company, event) are
 * untouched. Two playbook laws drive the rewrite: (1) "[age] man/woman framing renders a fantasy
 * RACE as a costumed modern human" — the identity noun is the SPECIES, gender rides on the role
 * noun + pronouns, and LINEAGE_GUARD rejects woman/man/girl/age words programmatically; (2) "canvas
 * without sealed-armor pool entries biases cheesecake — pool must emphasize armor plates / equipment
 * / helmet / visor", which is also exactly the bounty-hunter register Kevin asked for.
 *
 * AXES (each its own pool; the camera pool is HAND-AUTHORED in the path file, never generated):
 *   venue          the place, its light SOURCE (kind + position, no colour) and ONE charm detail;
 *                  tagged [BAR] [STREET] [SHIP] [PORT] [WILD] so set dressing + events can match it
 *   set_dressing   one venue object, tagged by family (+ [ANY]); two rolled per render
 *   light_story    two committed hues on the LIGHT, warm against cool; colour words only
 *   air            what the air is doing; no colour, no light
 *   lineage        THE HEADLINE POOL — who she is physically: an ALIEN or an ALIEN-HUMAN HYBRID,
 *                  species as the identity noun ("A Sorvathi with …"), head/face structure first,
 *                  then skin, eyes, hair-or-what-grows-instead. Visual traits only. Never a human.
 *   role           hunter/outlaw title + a dangerous-mystery demeanour; zero clothing, zero props
 *   costume        THE KIT — bounty-hunter armour made couture: plate over structured cloth, a
 *                  head cover register (full helm / partial / bare + carried), one piece of gear
 *   hero_object    the one thing in her hand or on her — mostly weapons and hunter's tools, a few
 *                  trophies; nothing with a screen or a label
 *   beat           verb-led, grounded, body-shaping — presence or momentum, never a chore
 *   company        ONE other presence, alien-cast or machine or creature; gated in the path
 *   event          something happening beyond her; tagged by family; gated in the path
 *
 * FIVE hard traps every recipe here exists to defeat (each already cost renders on another path):
 *   1. READABLE TEXT — bars, streets and ports are the fleet's strongest signage priors. Nothing
 *      in any pool is a sign, board, screen, menu, label, banner, holo-ad, plaque or lettering.
 *      Neon is bent into a SHAPE (a ring, a comet, a coiled serpent). Flat surfaces are DRESSED.
 *   2. THE CROWD — dense human-figure scenes trip flux-1.1's safety filter and steal the frame.
 *      Company is ONE presence. A venue is never "packed" or "crowded".
 *   3. BODY WORDS — sexy comes from silhouette, material and attitude. Banned everywhere:
 *      minimal coverage, bikini, cleavage, skin-tight, second-skin, sultry, seductive, sensual,
 *      provocative, and "schoolgirl" (it flags every Flux model).
 *   4. THE PORTRAIT — a static hero shot. Every beat is a VERB with the body doing something.
 *   5. CROSS-AXIS LEAKS — no camera words outside the camera pool, no colour outside light_story,
 *      no clothing outside costume, no species outside lineage.
 *
 * Usage:
 *   node scripts/gen-starbot-space-rogue-pools.js --pool starbot_space_rogue_venue --target 25
 *   node scripts/gen-starbot-space-rogue-pools.js --pool starbot_space_rogue_venue --family BAR --count 5
 *
 * Output: scripts/bots/starbot/seeds/<pool>.json (a JSON array of strings)
 */

const fs = require('fs');
const path = require('path');
const { SONNET } = require('./lib/models');

function readEnvFile() {
  try {
    const lines = fs.readFileSync('.env.local', 'utf8').split('\n');
    const env = {};
    for (const line of lines) {
      const eq = line.indexOf('=');
      if (eq > 0) env[line.slice(0, eq).trim()] = line.slice(eq + 1).trim();
    }
    return env;
  } catch {
    return {};
  }
}
const env = readEnvFile();
const ANTHROPIC = process.env.ANTHROPIC_API_KEY || env.ANTHROPIC_API_KEY;
if (!ANTHROPIC) {
  console.error('ANTHROPIC_API_KEY missing (env or .env.local)');
  process.exit(1);
}

const args = process.argv.slice(2);
const flag = (n, fb) => {
  const i = args.indexOf('--' + n);
  return i >= 0 && args[i + 1] && !args[i + 1].startsWith('--') ? args[i + 1] : fb;
};
const POOL = flag('pool', null);
const COUNT = parseInt(flag('count', '25'), 10);
const TARGET = args.includes('--target') ? parseInt(flag('target', '25'), 10) : null;
const FAMILY = flag('family', null);
const DRY = args.includes('--dry-run');
const MAX_ITERATIONS = 8;
if (!POOL) {
  console.error('usage: --pool <name> [--target N | --count N] [--family BAR] [--dry-run]');
  process.exit(1);
}

// ── Shared law text, reused inside recipes so every axis carries the same guards ──────────────
const NO_TEXT_LAW = `NEVER write anything that carries writing: no sign, signboard, board, screen, monitor, display, menu, label, tag, banner, poster, plaque, holo-ad, hologram of text, lettering, logo, number plate or ticker. Neon exists only as a tube bent into a SHAPE (a ring, a comet, a coiled serpent, a crescent, a spiral). Every flat surface is positively dressed with objects or texture, never left blank.`;
const NO_CROWD_LAW = `Never a crowd, throng, mass, queue or "packed" room. If other figures exist they are two or three at most, far back, in silhouette.`;
const NO_BODY_WORDS = `Never use: minimal coverage, bikini, cleavage, skin-tight, second-skin, form-fitting, sultry, seductive, sensual, provocative, alluring, curves, schoolgirl, naked, nude, bare-chested, lingerie.`;
const ORIGINAL_WORLDS = `Original worlds only: never a named franchise, film, game, character, ship, planet or species from existing fiction.`;
const NO_HUMAN_NOUNS = `Gender is carried only by "she" and "her" and by a feminine title where one exists; the identity noun is never a human noun. NEVER use the words woman, women, man, men, girl, lady, female, male, person, or any age word or number.`;
const ONE_SENTENCE = `a single flowing sentence, no headline prefix, no dashes of any kind, no colons, no internal newlines. Output a NUMBERED list, one entry per line.`;
const FAMILY_TAGS = `Every entry BEGINS with exactly one family tag in square brackets, then a space: [BAR] for bars, pubs, cantinas, lounges, clubs, gambling dens, backrooms and bounty offices; [STREET] for streets, alleys, markets, rooftops, bridges, transit platforms and plazas of a city on another world; [SHIP] for the inside of a spacecraft (cargo bay, cockpit, corridor, mess, engine room, airlock, boarding ramp); [PORT] for spaceports, hangars, landing pads, docks, fuel yards and orbital-station promenades; [WILD] for the open surface of an alien world where a traveller would stop (an overlook, a dune ridge, a crash site, a hot spring, a jungle platform, a frozen shore).`;

const POOL_RECIPES = {
  starbot_space_rogue_venue: {
    format: 'simple',
    theme: `THE VENUE — the hero stage of a painted sci-fi character still, and it must be as designed and as cool as the woman who will be standing in it. Each entry is ONE complete place, 30-48 words: WHAT it is and what it is made of, its LIGHT SOURCE named by kind and position with NO colour word at all (a long bar lit from beneath, one hanging lamp over the table, an open hangar door with the outside coming in, engine glow through a floor grate, a skylight, a window onto the planet), and ONE CHARM DETAIL the eye finds on the second look (a fish tank of something alive built into the bar, a ceiling of hanging spacesuits, a fountain of coolant, a mechanic's pet asleep on the engine cowling, a bathtub on a rooftop).
${FAMILY_TAGS}
VARIETY MANDATE across 25 entries: five of each family. Within a family never repeat a concept: five bars means five different KINDS of bar (a cantina cut into rock, a rooftop club, a zero-g lounge, a dockside dive built from a wrecked hull, a gambling backroom lit by one lamp).
Push the visuals: every place is somewhere a sleek, confident space character would choose to be seen. Playful, adventurous, vivid, clever. Never grim, derelict, dystopian, rotting or grey.
${NO_TEXT_LAW}
${NO_CROWD_LAW}
${ORIGINAL_WORLDS}
Axis discipline: no figures, no clothing, no camera position, no colour words, no weather, no time of day. The place, its light source, its materials and its one charm detail only.`,
    touchpoints: [
      '[BAR] a low-ceilinged cantina cut straight into red sandstone, its long bar a single slab of black glass lit from beneath, shelves of globe-shaped bottles behind it, and a tank of slow luminous jellyfish built into the wall where a mirror would be',
      '[STREET] a rain-slick market alley on stilts above a canal, awnings of stretched membrane, lit by strings of paper lanterns and the open fronts of the stalls, and a vendor grilling skewers over a stolen engine core',
      '[SHIP] the cargo bay of a small freighter with its ramp down, stacked sealed canisters and hanging cargo nets, lit by the bay floodlamps and the daylight pouring up the ramp, and a hammock slung between two crates with a pillow in it',
      "[PORT] a hangar deck of scuffed alloy with a single sleek ship parked under service gantries, lit by work lamps and the open hangar mouth, fuel lines coiled on the floor, and a mechanic's six-legged pet asleep on the warm engine cowling",
      '[WILD] a black-glass dune ridge on a desert world with a parked hover-bike and a bedroll, the whole plain lit by a ringed gas giant filling half the sky, and a tiny cook-fire of blue flame in a dish of stones',
      '[BAR] a rooftop club on a tower above the cloud deck, low couches around a sunken fire pit, lit by the fire and the open sky, and a bartender mixing drinks that smoke and change shape in the glass',
    ],
    instructions: `Each entry is ONE complete venue, 30-48 words, beginning with its family tag, ${ONE_SENTENCE}`,
  },

  starbot_space_rogue_set_dressing: {
    format: 'simple',
    theme: `SET DRESSING — one object or furnishing that makes a space venue read as a real, lived-in, cool place. Each entry is ONE thing, 12-24 words, concrete and paintable, with a material or a state.
${FAMILY_TAGS} Add a sixth tag [ANY] for objects that fit anywhere (a hovering tray drone, a coil of glowing cable, a sealed cargo canister, a hanging string of lanterns, a caged glow-lizard, a folded cloak on a rail).
VARIETY MANDATE across 25 entries: four of each of the five families and five [ANY]. Never repeat an object type.
${NO_TEXT_LAW}
${NO_CROWD_LAW}
${ORIGINAL_WORLDS}
Axis discipline: no people, no clothing on a person, no camera, no colour words, no light source. The object only.`,
    touchpoints: [
      '[BAR] a rack of alien liquor in blown-glass globes, each bottle holding a slowly drifting light inside it',
      "[STREET] a street vendor's cart of skewered fruit that steams and sparks over a scavenged reactor coil",
      "[SHIP] a pilot's chair with a fur throw slung over it and a boot resting on the console edge",
      '[PORT] a refuelling hose as thick as a tree trunk, frosted with condensation and hissing at the coupling',
      '[WILD] a crashed escape pod half buried in sand, its hatch propped open as a windbreak',
      '[ANY] a hovering tray drone carrying two drinks that glow faintly through the glass',
    ],
    instructions: `Each entry is ONE object, 12-24 words, beginning with its family tag, ${ONE_SENTENCE}`,
  },

  starbot_space_rogue_light_story: {
    format: 'simple',
    theme: `THE COLOUR STORY — two committed hues on the LIGHT of a painted sci-fi character still, one warm and one cool, always in opposition. Each entry is ONE colour relationship, 12-22 words, colour and light words only, and it says where each hue lives: which one is the key light on her, which one fills the room or the sky behind her.
VARIETY MANDATE: no two entries share both hues; span the wheel (magenta, violet, ultramarine, teal, cyan, emerald, lime, gold, amber, tangerine, coral, crimson, hot pink, rose, ice-white). One hue may be described as the rim light, the other as the wash. A neutral (grey, pewter, charcoal, white) is never one of the two hues.
Commit fully: saturated, vivid, rich. Never muted, never washed out, never pastel.
Axis discipline: no objects, no places, no people, no weather, no camera. Colour and light words only.`,
    touchpoints: [
      'hot magenta rim light along her edges against a deep teal room, the magenta the only warm thing in the frame',
      'a gold key light on her face and shoulders with everything behind her sunk in ultramarine',
      'acid lime bouncing up from below and a violet wash from above, both colours meeting on her',
      'tangerine backlight blazing behind her against a cold cyan foreground glow',
      'crimson from one side and emerald from the other, the two colours splitting her body down the middle',
    ],
    instructions: `Each entry is ONE colour relationship, 12-22 words, ${ONE_SENTENCE}`,
  },

  starbot_space_rogue_air: {
    format: 'simple',
    theme: `THE AIR — what the atmosphere itself is doing in a painted sci-fi venue. Each entry is ONE condition, 10-20 words, concrete and visible.
VARIETY MANDATE across 25: smoke in flat layers, steam, drifting sparks, fine rain blown in, dust hanging, clear crisp air, condensation fog at floor level, drifting embers, floating pollen-like spores, a heat shimmer, spray from a fountain, snow blown in through a door, bubbles rising through liquid air, and so on. Never repeat a condition.
Axis discipline: no colour words, no light source, no objects, no people, no camera. The air only.`,
    touchpoints: [
      'smoke hanging in three flat layers at head height, undisturbed until she moves through it',
      'fine rain blowing in sideways through an open doorway and beading on every surface',
      'clear crisp air with every edge razor sharp all the way to the back wall',
      'a haze of engine steam rolling low across the floor and curling around her boots',
    ],
    instructions: `Each entry is ONE air condition, 10-20 words, ${ONE_SENTENCE}`,
  },

  starbot_space_rogue_lineage: {
    format: 'simple',
    theme: `THE LINEAGE — who she is physically, and this is the headline pool: she is an ALIEN or an ALIEN-HUMAN HYBRID, never a human, and the first look at her says "not from here". Each entry is ONE being's physical identity, 26-40 words, in this order: her lineage as an invented species name used as the NOUN ("A Sorvathi with …" or "A Sorvathi-human hybrid with …"), then her HEAD AND FACE STRUCTURE first because it is the strongest signal (a tall backswept or ridged skull, bony brow plates, cheek plates of chitin, slit nostrils in a flat bridge, a wide lipless mouth, a fanned jaw frill, four eyes, eyes set wide, a bony faceplate, twin head-tails in place of hair), then her SKIN (colour, surface, pattern), then her EYES, then her HAIR or what grows instead (tendrils, quills, plumes, crystal filaments, a fin, a bare patterned scalp), plus at most ONE body feature that shows below the jaw (a tail, a second pair of arms, fins along the forearms, plates down the spine, clawed hands, digitigrade legs).
She is beautiful, sleek and adult, with a full face and real eyes, and every feature is UNMISTAKABLE and concrete so it paints. ${NO_HUMAN_NOUNS}
VARIETY MANDATE across 25: about fifteen full aliens spanning reptilian, amphibian, avian-feathered, feline-sleek, insect-elegant, crystalline, plant-grown, deep-sea, chitin-plated, horned, tentacle-haired and four-armed families, in skin colours never seen on a person (violet, teal, bronze-green, bone-white, deep blue, coral, obsidian, gold, slate, crimson); about ten HYBRIDS, each with a human face structure carrying two or three alien features from one parent (horns, tendrils, patterned skin of an alien colour, eyes with strange pupils, a tail, plated forearms). Never repeat a species, a skull shape or a hair substitute.
Never faceless, never bald-round-white-headed, never a long animal snout, never a body fused into a machine, and never the word crest (it renders as a helmet).
${NO_BODY_WORDS}
${ORIGINAL_WORLDS}
Axis discipline: no clothing, no armour, no props, no place, no pose, no camera. Her body, face, eyes and hair only.`,
    touchpoints: [
      'A Sorvathi with a tall backswept skull ridged in three bony lines, slit nostrils in a flat bridge and a wide dark mouth, skin of deep teal shading to aquamarine at the throat, pupil-less sea-glass eyes, and two thick head-tails hanging past her shoulders in place of hair',
      'A Kethran with plates of bronze-green chitin over the cheekbones and brow, fine scales like beaten metal across the rest of her face and throat, gold slit-pupil eyes, a low fin of translucent membrane from brow to nape instead of hair, and a long tail carried curled behind her',
      'A Vessari-human hybrid with a human face under a pair of small backswept ivory horns, deep violet skin that shades to lilac at the throat, a constellation of bioluminescent freckles across the cheekbones, wide amber eyes with horizontal pupils, and a mane of white hair in a high tail',
      'An Ilyari with a bony faceplate of bone-white across the brow and cheeks, four sea-green eyes in two stacked pairs, skin veined faintly with teal light, small pointed ears, and heavy ink-black tentacle-locks that move slightly on their own',
      'A Marrowen with a ring of short jet horns around a smooth patterned scalp, skin like polished obsidian shot with veins of slow orange light, a jaw frill of fine black spines, and pupil-less eyes of solid molten gold',
      'A Quell-human hybrid with a human face and a scattering of small iridescent scales along the cheekbones and temples, skin of pale gold, eyes of faceted emerald with no white, and long quills of silver in place of hair swept back over her shoulders',
    ],
    instructions: `Each entry is ONE being's physical identity, 26-40 words, opening "A <Species> with" or "A <Species>-human hybrid with", ${ONE_SENTENCE}`,
  },

  starbot_space_rogue_role: {
    format: 'simple',
    theme: `THE ROLE — what she is and how she carries herself, in 10-18 words: a TITLE of two to four words, then a comma, then a demeanour. Both say DANGEROUS MYSTERY: she is the figure nobody in the room can place, the one everybody watches without meaning to. Titles are hunter and outlaw trades (bounty huntress, headhunter, tracker, hired blade, enforcer, executioner for hire, warlord's daughter, syndicate assassin, ship-breaker, poacher of dangerous things, pirate captain, deserter, exiled war-priestess, pit-fighter, saboteur, relic thief, plague-ship survivor, hunter of hunters, smuggler queen, duellist, cartel collector, ghost of a dead fleet, prison-moon escapee, monster-hunter, debt collector). The demeanour is the point: still, unreadable, amused by danger, unhurried, patient, certain, watching, the room going quiet around her.
Write the title with a feminine noun where one exists (huntress, priestess, queen, daughter) and gender the rest with "she" and "her". ${NO_HUMAN_NOUNS}
VARIETY MANDATE across 25: never repeat a title; never repeat a demeanour word.
Axis discipline: ZERO clothing, ZERO armour, ZERO weapons, ZERO place, ZERO species. Title and demeanour only.`,
    touchpoints: [
      'Bounty huntress, utterly still, the whole room pretending not to watch her',
      'Headhunter, unhurried and certain, amused by everything that thinks it is dangerous',
      "Warlord's daughter, patient as a held breath, a price on her head she finds funny",
      'Hunter of hunters, unreadable, letting the silence do the talking for her',
    ],
    instructions: `Each entry is ONE role, 10-18 words, a two-to-four-word title then a comma then the demeanour, ${ONE_SENTENCE}`,
  },

  starbot_space_rogue_costume: {
    format: 'simple',
    theme: `THE KIT — what she wears, designed by a costume designer building a mysterious, dangerous hunter who stands out in any room: attire so out-there that the whole place notices, worn like she was born in it. The register is a BOUNTY HUNTER'S ARMOUR made couture: battered plate over structured cloth, gear that tells a history, one piece nobody has seen before. Each entry is ONE complete kit, 32-46 words, built from STRUCTURED, OPAQUE, VISIBLY CONSTRUCTED pieces, written in this order:
1. Her TORSO first, always a closed solid armour piece with a named material (a scorched alloy chest plate over a padded canvas jacket, a lacquered breastplate over a high-collared tunic, a ribbed cuirass of ceramic plates over a wrapped cloth top, a heavy hooded poncho over a plated vest, a quilted flight jacket with armoured shoulders, a long armoured coat buttoned to the throat).
2. Her LEGS and BOOTS (armoured trousers, greaves over trousers, a plated kilt of leather strips over a short skirt, thigh guards over tall boots).
3. Her HEAD, where the mystery lives, split three ways across the 25: about eight wear a FULL HELMET of a striking original shape (a beaked helm, a smooth dome with one wide slit visor, a horned helm with a mirrored faceplate, a heavy hood-cowl with a lens visor), each open at the back or crown so her hair or what grows there shows behind it; about nine wear a PARTIAL cover (a respirator over the mouth and jaw with the eyes bare, a visor band across the eyes with the mouth bare, a hood pulled low with the face lit beneath, a half-mask over one side of the face, a scarf wrapped to the nose); about eight have the FACE BARE with the helmet carried or hung at the hip and a painted stripe or a scar-mark on the face.
4. ONE piece of GEAR that says hunter (a bandolier of sealed cylinders, twin thigh holsters, a half-cape of scorched fabric over one shoulder, a compact jet-pack, a coil of cable at the hip, a string of trophies of teeth and claws, a blade sheathed along the boot, a chain wrapped around one forearm, mismatched pauldrons in two colours, a fur mantle over the plates, a cracked plate patched with a different metal).
Skin shows only where a CUT leaves it: one bare arm under a single pauldron, bare shoulders above a breastplate, one thigh above a greave, bare legs below a plated kilt. COVERAGE MIX across 25: about eleven sealed head to toe, about eight mid-coverage, about six showing skin through one of those cuts. Sleek and sexy through SILHOUETTE only: a cinched armoured waist, long plated legs, a high collar, a cape that falls straight.
Materials are visibly METAL, CERAMIC, LEATHER, CANVAS, QUILTED or BONE and thick enough to hold a shape: scorched alloy, gunmetal, brushed steel, hammered bronze, lacquered ceramic, enamel, carbon plate, bone plates, thick leather, waxed canvas, quilted nylon, boiled wool, fur, chain links, frosted resin plates, gold inlay. Plates can be dented, scorched, scratched, mismatched, painted with a stripe or a hand-print. Two entries may share at most one material word.
NEVER write any of these: bodysuit, catsuit, leotard, unitard, jumpsuit, second-skin, skin-tight, satin, sheer, translucent, transparent, see-through, gauze, mesh, fishnet, net, lace, film, latex, rubber, clinging, thin, open over, worn open, unzipped, unbuttoned, revealing, backless, plunging, cut-out, over bare, underlayer, under-layer, undershirt, pearlescent, shell fabric, midriff. A garment is never described as covering skin or as being over skin; it simply IS the piece she wears.
EVERY ENTRY IS A DIFFERENT DESIGN across silhouette families, never repeating one (chest plate and armoured coat, cuirass and plated kilt, poncho over plates, flight jacket and greaves, hooded cowl and long coat, mismatched scavenged plates, ceremonial lacquered armour, a duster over a breastplate, a fur mantle over plates, a long split armoured skirt, a tunic under a plated harness, a sealed hard-shell suit of panels with a full helm, a wrapped desert armour of cloth and bone plates).
${NO_TEXT_LAW} No insignia, emblem, badge, sigil, rune or marking that could read as writing anywhere on the kit; a plate carries a stripe, a hand-print or scorch marks.
${NO_BODY_WORDS}
${ORIGINAL_WORLDS} Nothing that names or copies a famous screen bounty hunter's armour.
Axis discipline: no skin colour, no hair, no species, no weapon in hand, no place, no pose, no camera. The kit, the head cover and one piece of gear only.`,
    touchpoints: [
      'A scorched alloy chest plate over a padded jacket of waxed olive canvas, armoured trousers of thick leather with steel knee guards above heavy buckled boots, a beaked helm of gunmetal open at the back so her hair falls behind it, and a half-cape of scorched fabric over one shoulder',
      'A ribbed cuirass of lacquered crimson ceramic plates over a wrapped top of heavy cloth, a plated kilt of leather strips over a short skirt with bare legs above tall greaved boots, a respirator of brushed steel over the mouth and jaw with the eyes bare, and twin thigh holsters',
      'A long armoured coat of boiled black wool buttoned to the throat with bone plates riveted across the shoulders and forearms, tall boots of dark leather, a visor band of smoked glass across the eyes with the mouth bare, and a bandolier of sealed brass cylinders',
      'A heavy hooded poncho of undyed canvas over a plated vest of hammered bronze, straight trousers of thick suede tucked into flat boots, the hood pulled low with the face lit beneath it, and a string of trophies of teeth and claws hung across the chest',
      'Mismatched scavenged plates of gunmetal and hammered copper strapped over a quilted flight jacket, one arm bare under a single pauldron, armoured trousers of grey canvas above steel-toed boots, the face bare with a painted white stripe across the eyes and a dented helmet hung at the hip, and a chain wrapped around one forearm',
      'A sealed hard-shell suit of frosted resin panels with a cinched waist plate and shoulder guards, greaves of the same resin over tall boots, a smooth dome helmet with one wide slit visor open at the crown so her quills rise through it, and a compact jet-pack of scorched alloy',
    ],
    instructions: `Each entry is ONE complete kit, 32-46 words, torso then legs then head then gear, ${ONE_SENTENCE}`,
  },

  starbot_space_rogue_hero_object: {
    format: 'simple',
    theme: `THE HERO OBJECT — the one thing in her hand or on her that says she is dangerous and that this is her trade. Each entry is ONE object, 10-20 words, concrete and paintable, with its material or its glow and how it is held, carried, slung, hung or rested.
VARIETY MANDATE across 25: about eighteen WEAPONS AND HUNTER'S TOOLS of original design (a long rifle with a scorched barrel, a heavy pistol with a bone grip, a hooked polearm, a wrist-mounted grapple, a serrated blade, a stun lance crackling at the tip, a net launcher, a coiled whip of light, a throwing disc, twin daggers, a harpoon gun, a shock baton, a tracking drone the size of a fist perched on her wrist, a thick chain ending in a hook, a heavy hammer, a bola of iron weights), and about seven TROPHIES AND PRIZES (a bounty puck glowing red, a severed robot head, a sealed case chained to her wrist, a caged creature, a jar of something alive, a bundle of stolen fuel cells, a drink that smokes). Never repeat an object.
${NO_TEXT_LAW} Nothing she holds has a screen, a display, a readout or a label.
${ORIGINAL_WORLDS} No weapon named or shaped after a famous screen weapon.
Axis discipline: no clothing, no armour, no place, no pose beyond how it is held, no camera, no species.`,
    touchpoints: [
      'a long rifle with a scorched barrel resting across her shoulders, both wrists hooked over it',
      'a heavy pistol with a bone grip held loose and low at her side',
      'a hooked polearm of black alloy taller than she is, planted butt-down beside her boot',
      'a bounty puck the size of her palm glowing deep red between two fingers',
      'a stun lance crackling faintly at the tip, carried point-down in one hand',
      'a severed robot head held by its neck cables, one eye still flickering',
    ],
    instructions: `Each entry is ONE hero object, 10-20 words, ${ONE_SENTENCE}`,
  },

  starbot_space_rogue_beat: {
    format: 'simple',
    theme: `THE BEAT — what she is doing at this exact instant, and it is what shapes her body in the frame. Each entry is ONE moment, 16-30 words, that OPENS with a verb in the present participle. Two registers, and every entry belongs to one: PRESENCE (leaning back against something on both elbows, sitting on the edge of a console with one boot up, mid-stride across the floor glancing back over a shoulder, raising a glass, dealing cards, cracking her neck, tightening a strap, resting a boot on a crate) and MOMENTUM (vaulting a barrier, sliding into a booth, drawing from a holster, stepping off a ramp into the light, swinging down from a gantry, kicking a door wide, catching something thrown to her).
VARIETY MANDATE across 25: about fourteen presence beats and eleven momentum beats. Every beat is confident, playful or dangerous, and always GROUNDED: at least one foot on something solid, never mid-air, never inverted, never hanging from a wire, never a chore or maintenance task. Never repeat a beat.
The beat may name what her body touches (a bar, a rail, a crate, a ramp, a doorway) but not the venue itself, so it composes with any place.
${NO_BODY_WORDS} No word for how the pose looks; only what she is doing.
Axis discipline: no clothing, no props beyond what the verb needs, no species, no camera, no colour.`,
    touchpoints: [
      'leaning back against the bar on both elbows with one boot hooked on the rail, watching the door with a half smile',
      'stepping off the boarding ramp mid-stride into the light, glancing back over one shoulder',
      'sitting on the edge of a console with one boot up on it, tossing something small and catching it without looking',
      'vaulting a low barrier one-handed, landing already walking',
      'sliding into a booth and kicking her feet up on the seat opposite',
      'drawing from a thigh holster in one smooth motion, the arm still low, eyes already on the target',
    ],
    instructions: `Each entry is ONE beat, 16-30 words, opening with a present participle verb, ${ONE_SENTENCE}`,
  },

  starbot_space_rogue_company: {
    format: 'simple',
    theme: `THE COMPANY — one other presence sharing the frame with her, and it is never human: an alien of a clearly different species, a machine, or a creature. Each entry is ONE presence, 14-26 words, concrete and paintable, with WHERE it is relative to her (beside her at a distance, behind her, at the next table, at her feet, on her shoulder, hovering above) and what it is doing. It never touches her and never crowds her; there is always clear space between them.
VARIETY MANDATE across 25: about nine creatures (a six-legged pet, a glow-lizard, a hovering jelly, a leashed beast, a bird-thing on a rail), about eight machines (a maintenance droid, a tray drone, a security sphere, a loader rig, a battered companion bot), about eight aliens of an obviously different species (a four-armed bartender, a hulking hooded broker, a tiny chittering fixer, a towering insect-elegant rival), described by two unmistakable non-human features. Never repeat a presence.
${NO_CROWD_LAW}
${ORIGINAL_WORLDS}
Axis discipline: no clothing on her, no colour words, no camera, no venue. The presence only.`,
    touchpoints: [
      'a six-legged pet the size of a cat curled asleep on the bar beside her elbow, one eye open',
      'a four-armed bartender with a long tapered skull polishing four glasses at once behind her',
      'a battered spherical maintenance droid hovering at her shoulder height, one lens cracked, keeping its distance',
      'a hulking hooded broker with tusks and tiny eyes seated at the next table, waiting his turn',
      'a hovering jelly the size of a lantern drifting slowly across the room behind her, trailing threads',
    ],
    instructions: `Each entry is ONE presence, 14-26 words, ${ONE_SENTENCE}`,
  },

  starbot_space_rogue_event: {
    format: 'simple',
    theme: `THE EVENT — something happening beyond her, in the same frame, that proves the world is alive. Each entry is ONE event, 12-24 words, visible and concrete, placed behind or beside her (through a window, at the far end, outside the door, high above).
${FAMILY_TAGS} Add a sixth tag [ANY] for events that work anywhere (a searchlight drone sweeping past, a shower of sparks from above, a small creature bolting across the floor).
VARIETY MANDATE across 25: four of each of the five families and five [ANY]. Examples of the kind: a ship lifting off through the window on a column of blue fire, a brawl in the far booth, a sandstorm arriving at the open door, a gas giant rising over the rooftops, a police sphere sweeping a searchlight across the street, the boarding ramp beginning to close, a cargo crane swinging a container overhead, a tide of glowing water coming in.
${NO_TEXT_LAW}
${NO_CROWD_LAW}
${ORIGINAL_WORLDS}
Axis discipline: nothing about her, no clothing, no colour words, no camera. The event only.`,
    touchpoints: [
      '[BAR] a brawl breaking out in the far booth, one chair already in the air',
      '[PORT] a sleek ship lifting off the far pad on a column of fire, dust rolling outward',
      '[STREET] a security sphere drifting down the street sweeping a searchlight across the wet stones',
      '[SHIP] the boarding ramp beginning to close behind her with a groan of hydraulics',
      '[WILD] a wall of sandstorm arriving across the plain, still a minute away',
      '[ANY] a shower of welding sparks raining down from somewhere above',
    ],
    instructions: `Each entry is ONE event, 12-24 words, beginning with its family tag, ${ONE_SENTENCE}`,
  },
};

const recipe = POOL_RECIPES[POOL];
if (!recipe) {
  console.error(
    `No recipe for pool "${POOL}". Add it to POOL_RECIPES. Available: ${Object.keys(POOL_RECIPES).join(', ')}`
  );
  process.exit(1);
}

function buildPrompt(count, recipe) {
  if (recipe.format === 'simple') {
    const familyLine = FAMILY
      ? `\n\nFOCUSED RUN: every one of these ${count} entries belongs to the [${FAMILY}] family and begins with that tag. Ignore the per-family spread above for this run.`
      : '';
    return `${recipe.theme}${familyLine}

━━━ TOUCHPOINT EXAMPLES (draw aesthetic from these — same caliber, same vocabulary register) ━━━
${recipe.touchpoints.map((t) => '  • ' + t).join('\n')}

${recipe.instructions}

Output ${count} numbered list entries (1. ... 2. ... 3. ...). Each entry on its own single line. NO preamble, NO commentary, NO markdown fences.`;
  }
  throw new Error(`Unknown recipe.format "${recipe.format}"`);
}

async function callSonnet(prompt) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 15 * 60 * 1000);
  try {
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': ANTHROPIC,
        'anthropic-version': '2023-06-01',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: SONNET,
        max_tokens: 16000,
        messages: [{ role: 'user', content: prompt }],
      }),
      signal: controller.signal,
    });
    if (!res.ok) throw new Error(`Sonnet ${res.status}: ${(await res.text()).slice(0, 300)}`);
    const data = await res.json();
    return (data.content?.[0]?.text || '').trim();
  } finally {
    clearTimeout(timeoutId);
  }
}

function parseArray(text) {
  const body = text
    .replace(/```[a-z]*\n?/gi, '')
    .replace(/```/g, '')
    .trim();
  const lines = body.split('\n');
  const entries = [];
  let current = null;
  const numRe = /^\s*(\d+)\s*[.):\]]\s*(.+)$/;
  for (const raw of lines) {
    const trimmed = raw.trim();
    if (!trimmed) continue;
    const m = trimmed.match(numRe);
    if (m) {
      if (current) entries.push(current);
      current = m[2].trim();
    } else if (current) current += ' ' + trimmed;
  }
  if (current) entries.push(current);
  const cleaned = entries
    .map((e) => e.replace(/^["'`]+|["'`]+$/g, '').trim())
    .filter((e) => e.length >= 20 && e.length <= 1200);
  if (cleaned.length === 0) throw new Error('no numbered entries parsed');
  return cleaned;
}

const STOP = new Set([
  'the',
  'and',
  'with',
  'from',
  'into',
  'that',
  'this',
  'over',
  'under',
  'onto',
  'across',
  'their',
  'while',
  'every',
  'each',
  'woman',
  'against',
  'behind',
  'beside',
]);

function signatureOf(entry) {
  const words = String(entry)
    .toLowerCase()
    .replace(/\[[a-z]+\]/g, ' ')
    .replace(/[^a-z0-9\s-]/g, ' ')
    .split(/\s+/)
    .filter((w) => w.length > 4 && !STOP.has(w));
  const uniq = [...new Set(words)].slice(0, 12).sort();
  return uniq.join('|');
}

function titleOf(entry) {
  const dashIdx = String(entry).indexOf('—');
  if (dashIdx < 0) return null;
  return entry.slice(0, dashIdx).trim().toLowerCase();
}

// Hard guards on generated text (the recipe is a nudge; this is the control).
const GUARD = [
  /\b(minimal coverage|bikini|cleavage|skin-?tight|second-?skin|form-?fitting|sultry|seductive|sensual|provocative|alluring|schoolgirl|naked|nude|bare-?chested|lingerie)\b/i,
  /\b(sign|signboard|signage|screen|monitor|display|menu|label|banner|poster|plaque|holo-?ad|lettering|logo|ticker|number plate|readout)s?\b/i,
  /\b(crowd|crowded|throng|packed|mob)\b/i,
];

// Costume-only guard (R1 → R2, 2026-09-25): every R1 render that came out nude or flagged had a body
// garment Flux merged with the lineage's skin — a bodysuit under scaled skin rendered as fishnet, an
// "open jacket over bare arms" as a bare chest, a coat "over a fitted underlayer" as a bare torso.
// The fleet already knows the "X over swimsuit" form leaks the inner layer (MangaBot beach-episode).
const COSTUME_GUARD =
  /\b(bodysuit|catsuit|leotard|unitard|jumpsuit|second-?skin|skin-?tight|satin|sheer|translucent|transparent|see-?through|gauze|mesh|fishnet|\bnet\b|lace\b|film|latex|rubber|clinging|thin|open over|worn open|unzipped|unbuttoned|revealing|backless|plunging|cut-?out|over bare|under-?layer|undershirt|pearlescent|shell fabric|midriff|insignia|emblem|badge|crest|sigil|rune|glyph|inscription|engraved|etched|stencil(?:led)?)\b/i;

// Lineage + role guard (R4, 2026-09-25): the playbook's "[age] man/woman" law — a human age/gender
// noun right after the species anchors CLIP on a modern human and the alien features become a
// costume. The species is the identity noun; gender rides on "she/her" and feminine titles.
const HUMAN_NOUN_GUARD =
  /\b(woman|women|man|men|girl|girls|lady|ladies|female|male|person|people|twenties|thirties|forties|fifties|elderly|young|youthful|teen|teenage|aged|year-?old|years old)\b/i;

// Kevin's reference for the R4 register is Boba Fett; the pools must stay original worlds.
const FRANCHISE_GUARD =
  /\b(mandalorian|beskar|jedi|sith|wookiee|twi'?lek|togruta|zabrak|tatooine|star wars|star trek|vulcan|klingon|asari|turian|quarian|krogan|mass effect|na'?vi|xenomorph|fremen|arrakis|blade runner|stormtrooper)\b/i;

function violates(entry) {
  if (/costume/.test(POOL)) {
    const m = entry.match(COSTUME_GUARD);
    if (m) return m[0];
  }
  if (/lineage|role/.test(POOL)) {
    const m = entry.match(HUMAN_NOUN_GUARD);
    if (m) return m[0];
  }
  {
    const m = entry.match(FRANCHISE_GUARD);
    if (m) return m[0];
  }
  for (const re of GUARD) {
    const m = entry.match(re);
    if (m) return m[0];
  }
  return null;
}

function dedupe(entries) {
  const seenSigs = new Map();
  const seenTitles = new Map();
  const kept = [];
  const dropped = [];
  for (const e of entries) {
    if (typeof e !== 'string' || e.length < 20) continue;
    const bad = violates(e);
    if (bad) {
      dropped.push({ entry: e.slice(0, 80), reason: 'guard:' + bad });
      continue;
    }
    const title = titleOf(e);
    if (title && seenTitles.has(title)) {
      dropped.push({ entry: e.slice(0, 80), reason: 'title' });
      continue;
    }
    const sig = signatureOf(e);
    if (sig.length < 10) {
      if (title) seenTitles.set(title, e);
      kept.push(e);
      continue;
    }
    if (seenSigs.has(sig)) {
      dropped.push({ entry: e.slice(0, 80), reason: 'body' });
      continue;
    }
    seenSigs.set(sig, e);
    if (title) seenTitles.set(title, e);
    kept.push(e);
  }
  return { kept, dropped };
}

async function generateBatch(batchCount) {
  const t0 = Date.now();
  const text = await callSonnet(buildPrompt(batchCount, recipe));
  const elapsed = ((Date.now() - t0) / 1000).toFixed(1);
  let arr;
  try {
    arr = parseArray(text);
  } catch (e) {
    console.error('Parse failed:', e.message);
    console.error('First 400 chars:', text.slice(0, 400));
    return [];
  }
  console.log(`  • Sonnet returned ${arr.length} entries in ${elapsed}s`);
  return arr;
}

(async () => {
  const outPath = path.resolve(`scripts/bots/starbot/seeds/${POOL}.json`);
  let preExisting = [];
  if (fs.existsSync(outPath)) {
    try {
      preExisting = JSON.parse(fs.readFileSync(outPath, 'utf8'));
    } catch {}
  }
  const finalTarget = TARGET ?? preExisting.length + COUNT;
  const startCount = preExisting.length;
  console.log(
    `Pool "${POOL}": ${startCount} → ${finalTarget} (iterative gen+dedup)${FAMILY ? ` family=${FAMILY}` : ''}${DRY ? ' (dry-run)' : ''}`
  );
  let pool = [...preExisting];
  let iteration = 0;
  while (pool.length < finalTarget && iteration < MAX_ITERATIONS) {
    iteration++;
    const stillNeeded = finalTarget - pool.length;
    const batchSize = Math.min(30, Math.ceil(stillNeeded * 1.4));
    console.log(
      `\nIteration ${iteration}: pool at ${pool.length}/${finalTarget}, need ${stillNeeded} more, gen ${batchSize}`
    );
    const fresh = await generateBatch(batchSize);
    if (fresh.length === 0) {
      console.warn('  ⚠ empty Sonnet response — stopping iteration');
      break;
    }
    const within = dedupe(fresh);
    for (const d of within.dropped)
      if (d.reason.startsWith('guard')) console.log(`  ✗ ${d.reason}: ${d.entry}`);
    if (within.dropped.length > 0)
      console.log(`  • within-batch dedup dropped ${within.dropped.length}`);
    const existingSigs = new Set(pool.map((e) => signatureOf(e)));
    const existingTitles = new Set(pool.map((e) => titleOf(e)).filter(Boolean));
    const newUnique = within.kept.filter((e) => {
      if (existingSigs.has(signatureOf(e))) return false;
      const t = titleOf(e);
      if (t && existingTitles.has(t)) return false;
      return true;
    });
    const crossDropped = within.kept.length - newUnique.length;
    if (crossDropped > 0) console.log(`  • cross-batch dedup dropped ${crossDropped}`);
    const room = finalTarget - pool.length;
    const toAdd = newUnique.slice(0, room);
    pool = [...pool, ...toAdd];
    console.log(`  ✓ Added ${toAdd.length} unique → pool at ${pool.length}/${finalTarget}`);
    if (toAdd.length === 0 && newUnique.length === 0) {
      console.warn('  ⚠ batch added nothing — Sonnet may be exhausted on theme, stopping');
      break;
    }
  }
  console.log(
    `\n━━━ Final: ${pool.length}/${finalTarget} entries (${pool.length - startCount} new)`
  );
  const tags = {};
  for (const e of pool) {
    const m = String(e).match(/^\[([A-Z]+)\]/);
    if (m) tags[m[1]] = (tags[m[1]] || 0) + 1;
  }
  if (Object.keys(tags).length) console.log('family tags:', JSON.stringify(tags));
  if (DRY) {
    console.log('\nDry-run — not writing to disk.');
    return;
  }
  const bakPath = outPath + '.bak-' + Date.now();
  if (fs.existsSync(outPath) && preExisting.length > 0) {
    fs.copyFileSync(outPath, bakPath);
    console.log(`Backed up existing pool → ${bakPath}`);
  }
  fs.writeFileSync(outPath, JSON.stringify(pool, null, 2));
  console.log(`✓ Wrote ${pool.length} entries → ${outPath}`);
})();
