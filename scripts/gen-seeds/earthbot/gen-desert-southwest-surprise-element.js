#!/usr/bin/env node
/**
 * DESERT_SOUTHWEST_SURPRISE_ELEMENT — small accents that add a quiet
 * grace-note to an American-SW raw-earth landscape. Saguaro blooms,
 * wildflower superblooms, ocotillo blooms, raven on a rim, lichen
 * patches, secondary spires, dust devils, distant herds. NO humans,
 * NO architecture, NO civilization.
 */
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/earthbot/seeds/desert_southwest_surprise_element.json',
  total: 200,
  batch: 25,
  maxTokens: 8000,
  append: true,
  metaPrompt: (
    n
  ) => `You are writing ${n} SURPRISE-ELEMENT entries for EarthBot's desert-southwest path — small grace-note accents added to American-SW iconic-geology landscapes (Monument Valley, Antelope Canyon, Bryce hoodoos, Zion, Arches, Sedona, Painted Desert, Canyonlands). TITLE-CAPS PREFIX — description format (18-28 words).

━━━ THE BAR ━━━
Every entry is ONE small SW-native accent that quietly enriches the landscape — never dominates it. The accent is a real American-Southwest natural element. Vivid color or distinctive silhouette. TITLE-CAPS prefix names it. The body sentence is short, specific, atmospheric. NO humans, NO architecture, NO civilization.

━━━ EXAMPLE PHRASINGS (mirror this register exactly) ━━━
"SAGUARO BLOOM CROWN — dense white blossoms crowning a towering saguaro arm, glowing amber in last-light rim-light."
"OCOTILLO IN BLOOM — scarlet-tipped whips arching against cobalt sky, each tip saturated like a brushstroke of vermillion."
"RAVEN ON RIM — single jet-black raven silhouetted on the high sandstone rim, wings half-folded, utterly still."
"WILDFLOWER SUPERBLOOM PATCH — dense carpet of magenta owl-clover and golden poppies erupting across the midground sand flat."
"DESERT VARNISH STREAKS — iron-black mineral varnish cascading in long vertical ribbons down a warm-toned sandstone cliff face."
"DUST PILLAR — single slender dust devil rising from the flat desert floor, backlit gold by afternoon sidelight."

━━━ VARIETY MANDATE (distribute across these SW-native accents) ━━━

CACTI / PLANT BLOOMS (~25%):
- ~3 SAGUARO BLOOMS / VARIANTS (saguaro bloom crown / saguaro flower-stalk / saguaro nesting hole / saguaro skeleton)
- ~3 OCOTILLO / AGAVE (ocotillo in bloom / ocotillo silhouette / agave bloom stalk / century plant bloom)
- ~3 PRICKLY-PEAR / CHOLLA (prickly-pear bloom / cholla golden halo / barrel cactus bloom crown / chain-fruit cholla)
- ~2 JOSHUA TREE / YUCCA (blooming Joshua tree / Joshua tree silhouette / yucca with tall flower stalk / mojave yucca cluster)
- ~2 WILDFLOWERS (wildflower superbloom patch / desert marigold cluster / fairy duster scatter / Indian paintbrush spike / desert lupine ribbon)
- ~1 JUNIPER / BONSAI (twisted juniper bonsai / weathered cottonwood snag / piñon pine cluster)

GEOLOGY / ROCK (~20%):
- ~3 SECONDARY ROCK FORMATIONS (secondary sandstone spire / balanced rock secondary / secondary hoodoo / lone mesa silhouette)
- ~2 ROCK SURFACE DETAIL (desert varnish streaks / colorful lichen patch / wind-sculpted concretions / petrified-wood fragments / honeycomb weathering)
- ~2 MINERAL / GEOLOGIC EVIDENCE (cross-bedded sandstone strata / iron-stained patina / volcanic plug silhouette / dyke wall / hexagonal columnar basalt)

WILDLIFE (~25%):
- ~3 BIRDS (raven on rim / solitary owl on cactus / kestrel hover / canyon wren on ledge / red-tailed hawk circling / vulture pair / roadrunner on rocks / Gambel's quail family)
- ~3 MAMMALS (pronghorn herd cluster / coyote silhouette at horizon / bighorn sheep on cliff / kit fox in shadow / jackrabbit at sage)
- ~2 REPTILES (gila monster on rock / chuckwalla basking / collared lizard mid-pose / rattlesnake coiled in shade / horned lizard frozen)
- ~1 INSECTS / SMALL LIFE (tarantula crossing sand / scorpion in moonlight / cluster of butterflies on bloom / bee swarming agave bloom)

ATMOSPHERIC / SKY (~20%):
- ~3 CLOUD / WEATHER (dramatic banner cloud / lenticular over mesa / monsoon thunderhead build / cumulus cap over butte)
- ~2 LIGHT PHENOMENA (alpenglow on far peaks / virga curtain over flats / sunset crimson banner / sun pillar / shaft of sun through cloud / mammatus cloud-bumps)
- ~2 DUST / SAND (dust pillar / wind-drifted sand ripple pattern / sand-snake on dune crest / blowing dust haze)
- ~1 NIGHT-SKY (milky way arch overhead / shooting-star streak / desert moon / starfield over silhouette)

GROUND DETAIL (~10%):
- ~2 SOIL / SURFACE (cryptobiotic soil pattern / wash gravel scatter / dry-cracked playa / salt-pan crust)
- ~1 SEASONAL DETAIL (autumn cottonwood gold / spring fresh-green patches / dry-summer parched / post-monsoon bloom flush)

━━━ FORMAT RULES (NON-NEGOTIABLE) ━━━
- TITLE PREFIX is 2-5 WORDS IN ALL-CAPS, then " — " separator, then the body.
- Body is one short sentence, 18-28 words.
- One accent per entry — NEVER stack multiple.
- Always specify position when appropriate ("midground", "at the foreground", "rising in the middle distance", "on the high rim").

━━━ BANS ━━━
- NO humans / no people / no figures / no silhouettes of people.
- NO architecture (no ruins, no buildings, no walls, no fences, no roads, no signs).
- NO petroglyphs / no civilization.
- NO modern objects (no cars, no tents, no campfires).
- NO non-SW species (no Bengal tiger, no kangaroos, no penguins).
- NO aurora / no nacreous / no bioluminescent / no sun-dogs / no fire-rainbows / no UV-glow.
- NO photographer-name drops.
- NO repeating the same accent across entries.

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering, one entry per string in the "TITLE-CAPS — body" format.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
