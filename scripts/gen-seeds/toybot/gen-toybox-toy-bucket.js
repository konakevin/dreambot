#!/usr/bin/env node
/**
 * TOYBOX_TOY_BUCKET — the de-branded TOY bucket for the toybox-chaos
 * vignette. Each entry is ONE toy described as a noun phrase (toy type +
 * outfit/feature). The bucket is the source-of-variety; pickN:4 per
 * render composites 4 toys into one interacting chaos scene. 5-12 words
 * per entry, lowercase, no end-period.
 */
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/toybot/seeds/toybox_toy_bucket.json',
  total: 200,
  batch: 25,
  maxTokens: 8000,
  append: true,
  metaPrompt: (
    n
  ) => `You are writing ${n} TOY entries for ToyBot's toybox-chaos toy-bucket — DE-BRANDED, archetype-named toys that pick4 into a chaos vignette. Each entry is ONE toy as a short noun-phrase: "[toy type] in/with [feature]". Lowercase. NO end-period. 5-12 words.

━━━ THE BAR ━━━
Every entry is ONE generic / de-branded toy at archetypal level (e.g. "neon-haired troll doll", "anthro turtle-warrior figure with a colored mask and shell"). NOT brand-named (no Lego/Hasbro/Disney specifics). Mirrors well-known classic toy archetypes with iconic visual hooks. Short noun-phrase, lowercase, no period.

━━━ EXAMPLE PHRASINGS (mirror this register exactly — lowercase, no period) ━━━
"neon-haired troll doll with a wild jewel-tone updo"
"sheriff troll doll with a tin badge and felt cap"
"cowboy troll doll in a straw hat"
"wizard troll doll in a star-spangled cone hat"
"pastel toy pony with a brushable rainbow mane"
"toy unicorn with a glittery horn and lavender mane"
"muscular barbarian-hero action figure with a plastic sword"
"camo commando action figure with a backpack"
"green plastic army-man in a prone firing pose"
"green plastic army-man with a bazooka"
"anthro turtle-warrior figure with a colored mask and shell"
"blue cartoon hedgehog figure with red sneakers"

━━━ VARIETY MANDATE (distribute across these toy archetypes) ━━━

- ~5 ACTION FIGURES — COMBAT (barbarian-hero with sword / cyborg-villain in cape / pulp-jungle-hero with whip / commando in camo / ranger-archer with bow / armored-knight figure / robot-soldier with pulse-cannon / mecha-pilot in cockpit-suit / berserker with twin-axes / mercenary with battle-vest)
- ~5 ACTION FIGURES — POP-CULTURE-CODED (anthro turtle-warrior / blue cartoon hedgehog / red cartoon plumber / armored space-marine / Saturday-morning superhero / Saturday-morning supervillain / wizard with long beard / dark sorcerer in hooded cape / ninja in dark garb / pirate with peg leg)
- ~5 DOLLS — FASHION / PRINCESS (fashion doll in sequined gown / fashion doll in adventure-explorer khakis / wedding-bride doll in white lace / cheerleader doll with pom-poms / queen doll in royal robes / mermaid doll with iridescent tail / fairy doll with translucent wings / disco-dancer doll with platform boots / equestrian doll in jodhpurs / fashion-runway doll in haute couture)
- ~4 DOLLS — TROLL / CRITTER / KAWAII (neon-haired troll doll / sheriff troll / cowboy troll / wizard troll / mermaid troll / fairy troll / pirate troll / explorer troll / glittery-jewel-haired troll / star-eyed kawaii doll)
- ~4 PLUSH — ANIMAL (spotted dalmatian puppy plush / lion-cub plush with mane / spotted fawn plush / pastel care-bear-style plush / round owl plush / cuddly elephant plush / squishy panda plush / chubby koala plush / soft bunny plush / curled-up kitten plush)
- ~4 PLUSH — FANTASY / WHIMSY (plush dragon with felt wings / plush slice of pizza with face / plush unicorn with rainbow tail / plush octopus with smiling face / kawaii rainbow plush star / plush mushroom with felt eyes / plush taco with face / plush avocado with smile / cloud plush / plush narwhal with horn)
- ~3 TOY VEHICLES — CARS (die-cast sports car with flame decal / monster-truck with oversized tires / classic hot-rod with chrome / police cruiser with siren bar / fire-truck with ladder / muscle-car with stripes / tow-truck with crane / ambulance with red cross / pickup truck with dents / chrome-plated drag-racer)
- ~3 TOY VEHICLES — MILITARY / EXOTIC (toy tank with cannon / toy submarine yellow / toy helicopter with rotor blades / toy fighter-jet with decals / toy space-shuttle / toy UFO with lights / toy moon-rover / toy bulldozer / toy excavator / toy steam-train)
- ~3 PROFESSION / CHARACTER FIGURES (toy astronaut in bulky suit / deep-sea diver with brass helmet / firefighter in red gear / police officer with cap / chef in white coat / doctor in scrubs / construction worker with hardhat / cowboy with lasso / archaeologist with khaki vest / scientist in lab-coat)
- ~3 FANTASY FIGURE (toy fairy with translucent wings / garden gnome with fishing pole / plastic wizard with long beard / pirate with parrot / dragon-rider knight / minotaur with horns / centaur with bow / phoenix with spread wings / mermaid with tail / sea-serpent figure)
- ~3 DINOSAURS / MONSTERS (rubber T-rex with painted eyes / plastic triceratops figure / glow-in-the-dark slime-blob monster / rubber gorilla king-style / dragon figure with felt-wings / kraken with curling tentacles / yeti plush with white fur / Bigfoot figure with brown fur / kaiju figure with spines / giant-spider figure)
- ~3 TOY ROBOTS / MECHA (wind-up tin-robot with antenna / vintage 60s-style robot toy / toy robot dog with LED eyes / clockwork tin-robot / chrome-finish bot with red eyes / piloted toy mech with cockpit / battle-mech toy with rocket launchers / boxy retro-robot with screen-face)
- ~3 GAMES / GADGETS (chunky-button toy cash register / wind-up walking teeth / squeaky-rubber-chicken / glowing magic-8-ball / fortune-cookie crank / kazoo / wooden top with spiral paint / yoyo with neon string / paddle-ball with rubber ball / slinky)
- ~3 CRAFT / SOFT (claymation-style explorer figure / play-doh blob with face / pipe-cleaner-puppet figure / felt-finger-puppet / origami crane / paper-airplane / pom-pom puff with eyes / popsicle-stick puppet / construction-paper-cutout puppet / yarn-doll figure)
- ~3 NOVELTY / ABSURD (rubber duck with sailor hat / rubber duck with cowboy hat / rubber duck with pirate eyepatch / squeaky banana / squeaky toy hammer / glow-stick wand / mini-disco-ball figure / mini-megaphone toy / kazoo / squirt-gun / water-balloon / bubble-blower)

━━━ FORMAT RULES (NON-NEGOTIABLE) ━━━
- NO title-caps prefix — open lowercase with the toy noun.
- Single noun-phrase, 5-12 words, NO end-period.
- ALWAYS describe the TOY TYPE (figure / doll / plush / vehicle / etc.).
- ALWAYS include 1-2 ICONIC VISUAL HOOKS (outfit, color, hairstyle, accessory).
- DE-BRANDED — describe the archetype not the IP (no Mickey / no Barbie / no Hot Wheels — say "round-eared cartoon mouse figure", "fashion doll", "die-cast sports car").

━━━ BANS ━━━
- NO brand names (no Lego / Hasbro / Mattel / Disney / Marvel / etc.).
- NO specific named characters (no Mickey / Pikachu / Buzz Lightyear).
- NO end-period.
- NO uppercase opening — strict lowercase noun-phrase.
- NO repeating identical toy.
- NO single-word entries — minimum 5 words.

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering, one entry per string in lowercase noun-phrase form.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
