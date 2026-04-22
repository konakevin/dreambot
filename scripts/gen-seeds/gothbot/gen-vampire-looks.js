#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/gothbot/seeds/vampire_looks.json',
  total: 50,
  batch: 12,
  metaPrompt: (n) => `You are writing ${n} GLAMOUR-VAMPIRE LOOK descriptions for GothBot's vampire-vogue-realism path. Each entry is ONE vampire woman — deathly pale, glamorous, terrifying, sexy-in-a-predator-way. Interview-with-the-Vampire / Only-Lovers-Left-Alive / Penny-Dreadful Eva-Green / Theda-Bara / Lady-Dimitrescu glamour-vampire energy.

Each entry: 25-40 words. Describes ONE vampire's complete GLAMOUR LOOK. NO setting, NO action (path brief handles those). Just the look.

━━━ NORTH STAR ━━━
GLAMOROUS vampire. Intense. Dark. Pale. Gorgeous. Terrifying. She should look like a vampire queen in a prestige film — NOT a face-painted horror-makeup monster.

━━━ EVERY ENTRY NAMES ALL OF THESE 7 DIMENSIONS ━━━

1. **DEATHLY-PALE SKIN** — corpse-white / bone-white / bloodless / drained-of-blood / ashen-ivory / moonstone-pallid / blue-tinged translucent / violet-tinted pallid / waxy-pale / chalk-white / porcelain-corpse. Pale enough to look DEAD. Name 1-2 pallor descriptors.

2. **GLOWING UNNATURAL IRIS** — rotate hues aggressively across pool: crimson-ember / molten-amber / ember-gold / emerald / fel-green / witch-fire / violet-void / electric-purple / ice-sapphire / glacial-blue / turquoise / silver-moonlit / necrotic-white / plum-deep / obsidian-with-corona / opalescent / honey-amber. Name one specific hue + glow quality (fully-luminous / corona-ring / ember-radiant / back-lit / inner-glow).

3. **HAIR** — color + texture + styling. Varied:
   - Colors: raven-black / jet-black / platinum / silver / wine-red / burgundy / copper / violet-streak / ash-grey / honey-blonde / white-with-black-streak
   - Styles: wet-lacquered slick-back / waist-long wet cascade / severe backcombed / long loose waves / wet clinging to cheekbone / braided crown / half-veiled / sleek bob
   NOTE: "wet dark hair framing face" is a good default — renders gorgeously

4. **GLAMOUR-VAMPIRE MAKEUP (NOT face-paint)** — intense smoky dark dramatic GLAMOUR makeup. NEVER face-paint / cracked-mask / ritual-sigils / painted-tear-streaks. Describe:
   - Heavy black / jet / charcoal / obsidian smoky eye-shadow thickly blended on the lid
   - Sharp black winged eyeliner extending to a clean cat-eye flick (or a subtler defined liner)
   - Long dark lashes — can be extreme or natural
   - Sharp darkened / defined brows
   - Dramatic chiaroscuro cheekbone contour carving hollows
   Each entry names 2-3 makeup elements.

5. **DARK WET-GLOSS LIPS** — shade + finish:
   - Shade: obsidian-black / jet-black / oxblood-wine / deep-plum / violet-ink / blue-black / burgundy / crimson-lacquer / deep-red / midnight
   - Finish: wet-lacquered / heavy-specular-gloss / mirror-shine / hard-polish

6. **VAMPIRE FANGS** — lips parted revealing SHARP LONG UPPER CANINE FANGS. Vary how: "two long sharp upper fangs visible between parted dark lips" / "fang-tips catching key light" / "one upper canine grazing the lower lip" / "long sharp fangs peeking between wet-gloss lips".

7. **FRINGE COUTURE WARDROBE ACCENT** (high-collar/shoulder-only, tiny detail — face is the hero): black-velvet choker + ruby / sheer black lace high-collar / spiked leather choker / obsidian-bead necklace / Victorian-crepe veil edge / black-satin cape-collar popped / bare pale shoulder / jet cabochon brooch / silver-crucifix-inverted pendant / black-silk shoulder-strap

━━━ OPTIONAL ACCENT (USE SPARINGLY — only 1 per every ~5 entries) ━━━
- Single small crimson bead at the corner of the mouth
- Faint crystalline frost-glint at the lashes
- A single water droplet at the temple
- Thin trail of breath-fog

NEVER describe as a MANDATORY element in every entry. 80% of entries skip this. Goal is NOT to stack face-detail — keep her face clean and glamorous, let pallor + eyes + makeup + fangs do the work.

━━━ ETHNICITY ━━━
DO NOT name an ethnicity or region in any entry. Every entry says "she" or "vampire woman" without ethnic anchor. Let Flux render whatever default face comes naturally. Do NOT write "Japanese vampire" / "Nigerian vampire" / "Persian vampire" etc — those anchors heavily bias the pool toward whichever region gets mentioned most.

━━━ HARD BANS — DO NOT WRITE ANY OF THESE ━━━
- NO "painted tear-streak" / "dark tears running down cheek" / "painted blood drip from eye"
- NO "blackwork filigree" / "ritual-sigil painted across temple / cheekbone / jawline"
- NO "cracked-stone pattern" / "desiccation cracks" / "peeling-parchment skin"
- NO "ghost-skull underlayer" / "painted skull suggestion"
- NO "painted crown-line on forehead" / "obsidian-spiked crown-line"
- NO "ink-black veins visibly tracing the neck / jaw / temple" (fine to say "faint blue veins beneath translucent skin" — but NOT "ink-black vein line tracing jaw")
- NO "old bite-scar" / "fresh bite-scar" / "scar-line on temple / jaw / brow"
- NO "thread-vein broken capillary burst across eye-white" — no visible wounds/damage
- NO "uneven splotches of different pallor" / "blotches" / "dry flaking patch" — clean pallid skin
- NO "bruise-purple hollow under-eye" — subtle is OK ("slight dark shadow under eye") but not bruise
- NO "soulless gone hollow dead-inside lights-on-nobody-home gaze" language — too literal, makes the face look damaged
- NO "action verbs / scene / setting" — path brief owns those
- NO "pose" / "editorial" / "photograph" / "magazine" / "runway"
- NO cute-anime-girl / YA-fantasy-prom-queen / Halloween-costume read
- NO nudity / lingerie-catalog
- NO named IP (Dracula / Lestat / Carmilla / Vampirella / Lady Dimitrescu)
- NO devil horns / horn headpieces

━━━ GAZE DESCRIPTOR (use these, NOT dead-inside language) ━━━
Her gaze is: cold / unblinking / knowing / ancient / predator-calm / still / menacing / calculating / bored / indifferent / lethal / calm-ancient-hungry. Describe her gaze in 2-4 words as part of the entry. Use phrases like "cold ancient stare", "knowing unblinking gaze", "predator-calm indifference", "still menacing stare". NOT "hollow" / "dead-inside" / "lights-on-nobody-home" / "soulless-gone".

━━━ WRITING EXAMPLES (style target — LEAN, GLAMOROUS, CLEAN) ━━━

"Corpse-white deathly-pale vampire with violet-void fully-luminous iris, cold ancient stare, wet-lacquered raven hair clinging to cheekbone, heavy black smoky eye-shadow with sharp winged liner, obsidian-black wet-gloss lips revealing two long sharp upper fangs, black-velvet choker with ruby pendant"

"Bone-white drained pallor with faint blue-vein temple tracery, glowing molten-amber iris with slitted cat-eye pupil, unblinking predator stare, long loose wet raven cascade, intense charcoal smoky-eye with cat-eye flick and long lashes, deep-plum wet-gloss lips parted to show sharp fangs, sheer black-lace high-collar"

"Bloodless moonstone-pallid skin, ice-sapphire glowing iris with fully-luminous glow, still knowing gaze, backcombed platinum-white hair, jet-black smoky eye thickly blended with sharp winged liner, oxblood-wine lacquered lips with heavy specular highlight, fang-tips catching the light between parted lips, spiked leather choker, single crimson bead at mouth corner"

"Ashen-ivory corpse-pale vampire with emerald-poison fully-luminous iris, calm-ancient-hungry gaze, wet-slick-back raven hair, heavy obsidian smoky eye-shadow with sharp cat-eye flick, dramatic black carved cheekbone contour, jet-black wet-mirror-gloss lips revealing two sharp elongated upper canines, Victorian-crepe black veil edge at temple"

━━━ HARD RULES ━━━
- 25-40 words per entry
- EVERY entry names: pallor + glowing-iris + gaze + hair + 2-3 makeup elements + dark wet-gloss lips + fangs visible + wardrobe accent
- NEVER includes banned tokens listed above (no face-paint, no scars, no imperfection-damage)
- LEAN and GLAMOROUS — don't stack detail. Keep it tight.
- Every entry visibly distinct in eye hue / hair / lip shade / makeup / wardrobe combination

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
