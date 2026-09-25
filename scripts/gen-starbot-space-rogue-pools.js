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
 * AXES (each its own pool; the camera pool is HAND-AUTHORED in the path file, never generated):
 *   venue          the place, its light SOURCE (kind + position, no colour) and ONE charm detail;
 *                  tagged [BAR] [STREET] [SHIP] [PORT] [WILD] so set dressing + events can match it
 *   set_dressing   one venue object, tagged by family (+ [ANY]); two rolled per render
 *   light_story    two committed hues on the LIGHT, warm against cool; colour words only
 *   air            what the air is doing; no colour, no light
 *   lineage        THE HEADLINE POOL — who she is physically: species or human variant, skin,
 *                  2-3 unmistakable features, eyes, hair. Visual traits only.
 *   role           title + demeanour; zero clothing, zero props
 *   costume        the outfit — sleek and sexy through CUT, MATERIAL and SHEEN, never body words
 *   hero_object    the one thing in her hand or on her; nothing with a screen or a label
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
    theme: `THE LINEAGE — who she is physically, and this is the headline pool: cool alien races and striking humans, every one of them killing it. Each entry is ONE woman's physical identity, 30-44 words, in this order: her lineage as an invented species name or a human variant, her SKIN (colour, surface, pattern), TWO OR THREE UNMISTAKABLE FEATURES (horns, crest, tail, extra eyes, gills, antennae, bioluminescent markings, crystalline plating, mirror-chrome augmentation, tattoos of light, a mane, tentacle-locks), her EYES, and her HAIR or what she has instead of hair. She is always beautiful, confident and adult, with a full face and real eyes.
VARIETY MANDATE across 25: about fifteen alien lineages spanning reptilian, amphibian, avian, feline, insectoid-elegant, crystalline, plant-like, aquatic, energy-veined, four-armed, and horned families in colours the wheel has never seen on a person (violet, teal, bronze-green, bone-white, deep blue, coral, obsidian); about ten humans and near-humans with striking looks (shaved head with circuit tattoos, waist-length silver braids, chrome-ringed irises, a mane of dyed hair, freckles that glow, a mirror-plated jaw, gold-leaf eyelids). Skin tones for humans span the full range from porcelain to deep ebony, described as colours, never as a nationality or region. Never repeat a lineage.
Every feature is UNMISTAKABLE and concrete so it paints, never subtle. No age words. Never bald-round-white-headed, never faceless, never insect-mandibled, never a snout, never a body fused into a machine.
${NO_BODY_WORDS}
${ORIGINAL_WORLDS}
Axis discipline: no clothing, no props, no place, no pose, no camera. Her body, face, eyes and hair only.`,
    touchpoints: [
      'a Vessari woman with skin of deep violet that shades to lilac at the throat, a pair of small backswept ivory horns, a faint constellation of bioluminescent freckles across her cheekbones, wide amber eyes with horizontal pupils, and a mane of white hair worn in a high tail',
      'a Kethran woman with fine bronze-green scales that catch light like beaten metal, a low crest of translucent fins running from brow to nape in place of hair, gold slit-pupil eyes, and a long tail she carries curled behind her',
      'a human woman with warm umber skin, a shaved head tattooed with fine circuitry that glows soft blue at the temples, mirror-chrome rings around dark brown irises, and a single long braid of copper hair from the crown',
      'an Ilyari woman with bone-white skin veined faintly with teal light, four eyes stacked in two pairs all a deep sea-green, small pointed ears, and heavy tentacle-locks of ink-black that move slightly on their own',
      'a human woman with porcelain skin dusted with real gold leaf across the eyelids, sharp grey eyes, freckles, and a waist-length rope of silver-white braids threaded with tiny metal rings',
      'a Marrowen woman with skin like polished obsidian shot with veins of slow-moving orange light, a crown of short jet horns in a ring, pupil-less eyes of solid molten gold, and no hair at all, her scalp patterned like cooled lava',
    ],
    instructions: `Each entry is ONE woman's physical identity, 30-44 words, ${ONE_SENTENCE}`,
  },

  starbot_space_rogue_role: {
    format: 'simple',
    theme: `THE ROLE — what she does and how she carries herself, in 10-18 words: a title plus a demeanour. The demeanour is the point: confident, amused, dangerous, playful, unbothered, hungry for trouble. She is always the coolest person in the room.
VARIETY MANDATE across 25: bounty huntress, smuggler captain, courier, pilot, mercenary, cartel envoy, exiled heiress, augmented racer, xeno-diplomat, thief, arena champion, bartender who owns the place, salvage queen, cartographer of dead worlds, gunrunner, monster tamer, bodyguard, gambler, mechanic, relic hunter, assassin off duty, fleet deserter, holo-star on the run, prizefighter, and so on. Never repeat a title.
Axis discipline: ZERO clothing, ZERO props, ZERO place, ZERO species. Title and demeanour only.`,
    touchpoints: [
      'bounty huntress, relaxed and amused, like the job is already finished',
      'smuggler captain, all easy swagger, daring the room to say something',
      'exiled heiress turned gunrunner, bored by danger, delighted by trouble',
      'arena champion off duty, loose-limbed and laughing, still the most dangerous thing in the room',
    ],
    instructions: `Each entry is ONE role, 10-18 words, ${ONE_SENTENCE}`,
  },

  starbot_space_rogue_costume: {
    format: 'simple',
    theme: `THE COSTUME — what she wears, designed by a costume designer who wants her to be the sleekest, sexiest, coolest thing in the frame. Each entry is ONE outfit, 30-46 words, and it is built from STRUCTURED, OPAQUE, VISIBLY CONSTRUCTED garments: pieces with panels, seams, quilting, plates, buttons, lacing, buckles, pleats, a collar, a hem. Write the garment that covers her TORSO first, as a closed, solid piece (a laced corset over a shirt, a buttoned tunic, a quilted vest, a plated breastplate over a wrapped sash top, a high-necked sleeveless top, a cropped zipped jacket worn closed over a thick cloth band, a structured dress with a defined bodice). Then the garment that covers her LEGS (trousers, a skirt with its length stated, a wrap, greaves, boots to the thigh). Then ONE accessory.
Skin shows only where a CUT leaves it: bare arms, bare shoulders, a bare midriff between a cropped top and a high waist, bare legs below a short skirt, one thigh through a slit. COVERAGE MIX across 25: about nine fully covered and ornate, about eight fitted and mid-coverage, about eight showing skin through one of those cuts.
Garment materials are visibly CLOTH, LEATHER, METAL, CERAMIC, WOVEN or QUILTED and always thick enough to hold a shape: leather, suede, brushed steel, lacquer, thick silk, velvet, quilted nylon, bone plates, enamel, carbon weave, feathers, fine chainmail worn over cloth, ceramic plates, raw linen, heavy canvas, fur trim, hammered gold, frosted plastic plates, glass beads. Two entries may share at most one material word.
NEVER write any of these: bodysuit, catsuit, leotard, unitard, jumpsuit, second-skin, skin-tight, satin, sheer, translucent, transparent, see-through, gauze, mesh, fishnet, net, lace, film, latex, rubber, clinging, thin, open over, worn open, unzipped, unbuttoned, revealing, backless, plunging, cut-out, over bare, underlayer, under-layer, undershirt, pearlescent, shell fabric. A garment is never described as covering skin or as being over skin; it simply IS the piece she wears.
EVERY ENTRY IS A DIFFERENT DESIGN: spread the 25 across silhouette families and never repeat one (corset and trousers, tunic and thigh boots, plated breastplate and skirt, structured gown, cropped jacket and high-waisted trousers, cropped jacket and short skirt, long buttoned coat with a slit, wrapped and belted desert layers, quilted vest and greaves, a fitted racing jacket and tall boots, a pleated dress with a hard bodice, a sash-wrapped top and wide trousers, a hooded cloak over a buttoned tunic, a scavenger's patched leathers made elegant, a diplomat's tailored suit, a fighter's laced vest and wrapped hands, a courier's weatherproof shell with a bright collar).
Push the visuals: fun, bold, boundary-pushing, never plain and never a uniform. Every outfit has one detail nobody has seen before, and it is a different KIND of detail each time (a collar, a hem, a fastening, a lining, a trim, a glove, a boot, a belt, a pattern).
${NO_BODY_WORDS}
${ORIGINAL_WORLDS}
Her face is always visible: any helmet is carried or hung, never worn.
Axis discipline: no skin colour, no hair, no species, no props in hand, no place, no pose, no camera. The clothes and one accessory only.`,
    touchpoints: [
      'a laced corset of enamelled ceramic plates over a long-sleeved shirt of thick white cotton, wide leather trousers tucked into buckled boots, and a belt of hammered gold links',
      'a cropped bomber jacket of quilted midnight-blue nylon zipped to the collar, a short pleated skirt of stiff black leather with bare legs above tall lace-up boots, and one long glove of carbon weave',
      'a floor-length coat of deep burgundy velvet buttoned closed from throat to hip with bone buttons, a high slit opening at one thigh above tall boots, and a collar of dark feathers',
      'a high-necked sleeveless tunic of thick oil-slick iridescent silk that leaves her arms bare, wide trousers of raw linen belted with a sash of woven fibre-optic, and a cuff of raw crystal at one wrist',
      'a plated breastplate of brushed steel worn over a wrapped sash top of heavy cloth, a wide belt of interlocking bone plates, a knee-length skirt of layered leather strips, and boots to the knee',
      'a cropped jacket of stiff lacquered leather buttoned closed, a bare midriff between its hem and high-waisted armoured trousers of quilted grey canvas, and a chain of glass beads at the throat',
    ],
    instructions: `Each entry is ONE outfit, 30-46 words, ${ONE_SENTENCE}`,
  },

  starbot_space_rogue_hero_object: {
    format: 'simple',
    theme: `THE HERO OBJECT — the one thing in her hand or on her that anchors who she is. Each entry is ONE object, 10-20 words, concrete and paintable, with its material or its glow. It is held, carried, slung, hung or resting under one arm.
VARIETY MANDATE across 25: a bounty puck glowing red, a long-barrelled pistol holstered or held loose, her helmet under one arm, a drink that smokes, a coiled whip of light, a heavy sealed case chained to her wrist, a vapor stick trailing smoke, a glowing key the size of a hand, a caged tiny creature, a rifle slung across her back, a bundle of stolen fuel cells, a throwing blade, a jar of something alive, a grappling launcher, a chunk of raw crystal, a severed robot head, a lockbox, a folded map of cloth, a fighting staff, a chained crate handle, and so on. Never repeat an object.
${NO_TEXT_LAW} Nothing she holds has a screen, a display, a readout or a label.
${ORIGINAL_WORLDS}
Axis discipline: no clothing, no place, no pose beyond how it is held, no camera, no species.`,
    touchpoints: [
      'a bounty puck the size of her palm glowing deep red between two fingers',
      'her helmet, a smooth mirrored dome, tucked under one arm',
      'a tall drink in a fluted glass that smokes slowly and changes colour as it settles',
      'a long-barrelled pistol with a bone grip held loose and low at her side',
      'a heavy sealed alloy case chained to her wrist, frost forming along its seams',
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
  /\b(bodysuit|catsuit|leotard|unitard|jumpsuit|second-?skin|skin-?tight|satin|sheer|translucent|transparent|see-?through|gauze|mesh|fishnet|\bnet\b|lace\b|film|latex|rubber|clinging|thin|open over|worn open|unzipped|unbuttoned|revealing|backless|plunging|cut-?out|over bare|under-?layer|undershirt|pearlescent|shell fabric)\b/i;

function violates(entry) {
  if (/costume/.test(POOL)) {
    const m = entry.match(COSTUME_GUARD);
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
