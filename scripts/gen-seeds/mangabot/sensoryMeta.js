/**
 * Meta-prompt registry for MangaBot sensory channel pools.
 *
 * 4 contexts (female / male / creature / scene) × 7 channels = 28 pools.
 * Per design doc memory/sensory_rollout/mangabot.md.
 *
 * Japanese culture + anime full spectrum: Ghibli/Shinkai/Demon-Slayer +
 * traditional Japan + Neo-Tokyo cyberpunk.
 */

const SHARED_RULES = `━━━ HARD RULES ━━━
- 8-16 words per entry — short, vivid, sensory
- ONE concrete sensory image per entry — not a mood, not a list
- Comma-separated phrases when needed; no full sentences
- NO direct color naming (lightcolor channel is the exception)
- NO duplicate verb+noun pairs across entries
- Aesthetic register: anime-stylized — Shinkai / Ghibli / Demon-Slayer / Neo-Tokyo / Heian / Edo

━━━ AESTHETIC ANCHORS (use freely) ━━━
- objects: torii gate, lantern, washi paper, tatami, sliding shoji door, kotatsu, koi pond,
  bamboo grove, cherry blossom, sakura petal, shrine bell, omikuji paper, daruma, kanji sign,
  vending machine, neon sign, pachinko parlor, ramen bowl, mochi, onigiri, salaryman briefcase,
  school uniform, seifuku, gakuran, yukata, kimono, obi, geta, zori, katana, wakizashi, naginata,
  yari spear, sword saya, haori, hakama, demon mask, oni mask, kitsune mask, kappa, tengu fan
- materials: washi paper, lacquer, sumi ink, hand-forged steel, bamboo, cypress wood, jade,
  porcelain, brass-gilded gold, vermillion paint, indigo dye, raw silk, hemp fabric
- environments: Shinto shrine, Buddhist temple, bamboo grove, rice field, mountain pass,
  Edo town, Heian palace, school rooftop, convenience store, alley with vending machine,
  Akira-Tokyo, neon street, food stall, ramen shop, bath-house, summer festival, snow-clad temple`;

// ─────────────────────────────────────────────────────────────
// FEMALE — kawaii / slice-of-life / cozy-anime (young anime women)
// ─────────────────────────────────────────────────────────────

const female = {
  smell: (
    n
  ) => `You are writing ${n} distinct SMELL anchors for MangaBot's FEMALE-character paths (kawaii, slice-of-life, cozy-anime). Each entry is one olfactory cue tied to a young anime-protagonist woman in modern/traditional Japan.

EXAMPLES (DO NOT REUSE):
- "ramen steam clinging to her bangs"
- "incense from the family altar caught in her hair"
- "her cherry-blossom shampoo on the morning train"
- "matcha-and-mochi scent on her fingertips"
- "vending-machine coffee warming the air around her"

${SHARED_RULES}

━━━ DEDUP — two entries are too similar if they share ━━━
Both the SCENT NOUN AND the LOCATION on her body. Vary one.

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering, no markdown.`,

  sound: (n) => `You are writing ${n} distinct SOUND anchors for MangaBot's FEMALE paths.

EXAMPLES (DO NOT REUSE):
- "her seifuku skirt rustling as she runs"
- "wind chime tinkling at the doorway behind her"
- "her chopsticks tapping the lacquer bowl"
- "school bell ringing across the courtyard around her"
- "her phone buzzing in her uniform pocket"

${SHARED_RULES}

━━━ DEDUP — share both SOURCE and QUALITY = too similar. Vary one.
━━━ OUTPUT ━━━ JSON array of ${n} strings. No preamble, no numbering, no markdown.`,

  touch: (n) => `You are writing ${n} distinct TOUCH anchors for MangaBot's FEMALE paths.

EXAMPLES (DO NOT REUSE):
- "her warm porcelain teacup cradled in both hands"
- "rain finding the back of her neck through her hair"
- "tatami mat rough under her bare knees"
- "her yukata sash loose at her waist"
- "ramen broth heat radiating against her chin"

${SHARED_RULES}

━━━ DEDUP — share BODY PART and SENSATION VERB = too similar. Vary one.
━━━ OUTPUT ━━━ JSON array of ${n} strings. No preamble, no numbering, no markdown.`,

  temperature: (
    n
  ) => `You are writing ${n} distinct TEMPERATURE anchors for MangaBot's FEMALE paths.

EXAMPLES (DO NOT REUSE):
- "summer-evening humidity sticking her bangs to her forehead"
- "first-snow chill tinting her cheeks pink"
- "kotatsu warmth radiating up her thighs"
- "convenience-store AC chilling her bare arms"
- "tea-warmth radiating up from her cupped palms"

${SHARED_RULES}

━━━ DEDUP — share THERMAL SOURCE and BODY PART = too similar. Vary one.
━━━ OUTPUT ━━━ JSON array of ${n} strings. No preamble, no numbering, no markdown.`,

  weight: (n) => `You are writing ${n} distinct WEIGHT anchors for MangaBot's FEMALE paths.

EXAMPLES (DO NOT REUSE):
- "her schoolbag pulling at her shoulder"
- "yukata sash tied snug at her waist"
- "uniform jacket draped across her arm in the heat"
- "her plastic umbrella bouncing at her elbow"
- "convenience-store bag tugging at her wrist"

${SHARED_RULES}

━━━ DEDUP — share OBJECT and BODY PART = too similar. Vary one.
━━━ OUTPUT ━━━ JSON array of ${n} strings. No preamble, no numbering, no markdown.`,

  air: (n) => `You are writing ${n} distinct AIR anchors for MangaBot's FEMALE paths.

EXAMPLES (DO NOT REUSE):
- "cherry blossoms drifting between her and the train station"
- "summer cicada haze around her in the rice fields"
- "snow gathering on her wool scarf in the night street"
- "ramen-steam curling around her cheek"
- "rain-mist hanging in the air around her umbrella"

${SHARED_RULES}

━━━ DEDUP — share PARTICLE and MOTION VERB = too similar. Vary one.
━━━ OUTPUT ━━━ JSON array of ${n} strings. No preamble, no numbering, no markdown.`,

  lightcolor: (
    n
  ) => `You are writing ${n} distinct LIGHTCOLOR anchors for MangaBot's FEMALE paths. Anime-stylized lighting on her face/body.

EXAMPLES (DO NOT REUSE):
- "Shinkai-sunset peach-orange wash across her cheek"
- "convenience-store fluorescent green on her face at midnight"
- "lantern-amber glow under her chin at the festival stall"
- "Tokyo-rain-neon pink reflecting off her wet umbrella onto her face"
- "soft-Ghibli warm-gold backlight rim on her hair"

━━━ COLOR FAMILIES ━━━
SHINKAI-PEACH-ORANGE (12-14), GHIBLI-WARM-GOLD (10-12), CONVENIENCE-STORE FLUORESCENT-GREEN (8-10), LANTERN-AMBER (10-12), TOKYO-NEON PINK/CYAN (10-12), CHERRY-PINK (6-8), MOONLIT-BLUE (6-8), SHINTO-VERMILLION (4-6).

━━━ DIRECTION SPREAD ━━━
key (12-14), rim (10-12), shaft (8-10), backlight (6-8), wash (8-10).

━━━ HARD RULES ━━━ 8-16 words per entry; COLOR + DIRECTION + IMPACT POINT (her face / hair / silhouette / umbrella). Aesthetic: anime-stylized.
━━━ DEDUP — share COLOR FAMILY and DIRECTION = too similar.
━━━ OUTPUT ━━━ JSON array of ${n} strings. No preamble, no numbering, no markdown.`,
};

// ─────────────────────────────────────────────────────────────
// MALE — shonen-action / samurai-era (anime warrior men)
// ─────────────────────────────────────────────────────────────

const male = {
  smell: (
    n
  ) => `You are writing ${n} distinct SMELL anchors for MangaBot's MALE-character paths (shonen-action / samurai-era).

EXAMPLES (DO NOT REUSE):
- "blood and steel on his sword arm"
- "rice-wine and tobacco on his haori"
- "demon-blood smoldering on his hilt-wrap"
- "incense smoke clinging to his hair"
- "rain-on-leather of his armored sleeve"

${SHARED_RULES}
━━━ DEDUP — share SCENT NOUN and LOCATION = too similar.
━━━ OUTPUT ━━━ JSON array of ${n} strings. No preamble, no numbering, no markdown.`,

  sound: (n) => `You are writing ${n} distinct SOUND anchors for MangaBot's MALE paths.

EXAMPLES (DO NOT REUSE):
- "his katana sliding free of the saya"
- "wooden geta clacking on the temple stone"
- "his slow exhale before the strike"
- "his armor plates rustling as he turns"
- "battle-cry rising from his chest"

${SHARED_RULES}
━━━ DEDUP — share SOURCE and QUALITY = too similar.
━━━ OUTPUT ━━━ JSON array of ${n} strings. No preamble, no numbering, no markdown.`,

  touch: (n) => `You are writing ${n} distinct TOUCH anchors for MangaBot's MALE paths.

EXAMPLES (DO NOT REUSE):
- "silk haori cool against his exposed shoulder"
- "his sword-grip tacky with sweat"
- "blood streaming warm down his bare chest"
- "tatami rough under his bare feet"
- "his armor tightening across his ribs"

${SHARED_RULES}
━━━ DEDUP — share BODY PART and SENSATION VERB = too similar.
━━━ OUTPUT ━━━ JSON array of ${n} strings. No preamble, no numbering, no markdown.`,

  temperature: (n) => `You are writing ${n} distinct TEMPERATURE anchors for MangaBot's MALE paths.

EXAMPLES (DO NOT REUSE):
- "winter-frost biting through his fingerless gloves"
- "battle-heat flushing through his face"
- "lantern-warmth glowing on the back of his neck"
- "morning-dew cool on his bare forearm"
- "demon-fire heat scorching his shield-arm"

${SHARED_RULES}
━━━ DEDUP — share THERMAL SOURCE and BODY PART = too similar.
━━━ OUTPUT ━━━ JSON array of ${n} strings. No preamble, no numbering, no markdown.`,

  weight: (n) => `You are writing ${n} distinct WEIGHT anchors for MangaBot's MALE paths.

EXAMPLES (DO NOT REUSE):
- "his katana pulling at his obi"
- "battle-armor pauldron pressing his shoulder down"
- "tachi tied to his belt swinging as he turns"
- "his haori soaked with rain at the shoulders"
- "demon-skull trophy hanging from his belt"

${SHARED_RULES}
━━━ DEDUP — share OBJECT and BODY PART = too similar.
━━━ OUTPUT ━━━ JSON array of ${n} strings. No preamble, no numbering, no markdown.`,

  air: (n) => `You are writing ${n} distinct AIR anchors for MangaBot's MALE paths.

EXAMPLES (DO NOT REUSE):
- "his breath cloud trailing in the snow battlefield"
- "smoke from a cut-down enemy curling around his blade"
- "ash drifting over him from the burning village behind"
- "cherry petals lifted in the slipstream of his katana"
- "spark-embers from a torch curling past his shoulder"

${SHARED_RULES}
━━━ DEDUP — share PARTICLE and MOTION VERB = too similar.
━━━ OUTPUT ━━━ JSON array of ${n} strings. No preamble, no numbering, no markdown.`,

  lightcolor: (
    n
  ) => `You are writing ${n} distinct LIGHTCOLOR anchors for MangaBot's MALE paths. Anime-stylized lighting on his face/body/blade.

EXAMPLES (DO NOT REUSE):
- "blood-red key cutting across his face mid-strike"
- "lightning-cyan rim sculpting his katana arc"
- "lantern-orange glow on his profile at the temple gate"
- "moonlit-blue underlight rising from the snow at his feet"
- "demon-fire-magenta key flooding his face from below"

━━━ COLOR FAMILIES ━━━
BLOOD-RED (12-14), LIGHTNING-CYAN (8-10), LANTERN-AMBER (10-12), MOONLIT-EDO-BLUE (10-12), DEMON-FIRE-MAGENTA (6-8), GHIBLI-WARM-GOLD (6-8), DEMON-SLAYER BLACK-AND-WHITE-WITH-RED-ACCENT (4-6), SHINTO-VERMILLION (6-8), AKIRA-LASER-CYAN (4-6).

━━━ DIRECTION SPREAD ━━━ key (14-16), rim (12-14), strike-flash (8-10), shaft (6-8), backlight (4-6).

━━━ HARD RULES ━━━ 8-16 words per entry; COLOR + DIRECTION + IMPACT POINT (his face / blade / silhouette / armor).
━━━ DEDUP — share COLOR FAMILY and DIRECTION = too similar.
━━━ OUTPUT ━━━ JSON array of ${n} strings. No preamble, no numbering, no markdown.`,
};

// ─────────────────────────────────────────────────────────────
// CREATURE — yokai / kitsune / dragon / kappa / tengu (NO HUMANS)
// ─────────────────────────────────────────────────────────────

const ABSOLUTE_NO_HUMANS = `━━━ ABSOLUTE RULE ━━━
NEVER reference humans (her/his/she/he, hands, faces). Use "it" / "its".
The creature is a yokai / kitsune / kappa / tengu / dragon / oni — Japanese folklore creature with non-human anatomy (multi-tails, scaled body, glowing fur, fox-mask, beak, horns).`;

const creature = {
  smell: (
    n
  ) => `You are writing ${n} distinct SMELL anchors for MangaBot's CREATURE path (mythological-creature — yokai/kitsune/dragon). NO HUMANS.

EXAMPLES (DO NOT REUSE):
- "wet pine forest clinging to its multi-tailed coat"
- "bonfire smoke curling from its tongue"
- "cherry-blossom drift on its ethereal wake"
- "shrine-incense following its silent passage"
- "moss-and-river-stone perfume around its glowing form"

${SHARED_RULES}
${ABSOLUTE_NO_HUMANS}
━━━ DEDUP — share SCENT NOUN and BODY/LOCATION = too similar.
━━━ OUTPUT ━━━ JSON array of ${n} strings. No preamble, no numbering, no markdown.`,

  sound: (
    n
  ) => `You are writing ${n} distinct SOUND anchors for MangaBot's CREATURE path. NO HUMANS.

EXAMPLES (DO NOT REUSE):
- "tails rustling against the bamboo grove"
- "deep koto-string note resonating in its chest"
- "ancient bells ringing as it shifts shape"
- "its fox-cry echoing across the rice paddies"
- "river-stones clicking under its slow padded paws"

${SHARED_RULES}
${ABSOLUTE_NO_HUMANS}
━━━ DEDUP — share SOURCE and QUALITY = too similar.
━━━ OUTPUT ━━━ JSON array of ${n} strings. No preamble, no numbering, no markdown.`,

  touch: (n) => `You are writing ${n} distinct TOUCH anchors for MangaBot's CREATURE path.

EXAMPLES (DO NOT REUSE):
- "river water beading on its glowing scales"
- "spider-silk catching at the tip of its many tails"
- "moss carpeting the stone where it rests"
- "torii-pillar paint chipping under its shifting weight"
- "lantern-warmth glowing across its fox-mask cheek"

${SHARED_RULES}
${ABSOLUTE_NO_HUMANS}
━━━ DEDUP — share TEXTURE and BODY/LOCATION = too similar.
━━━ OUTPUT ━━━ JSON array of ${n} strings. No preamble, no numbering, no markdown.`,

  temperature: (
    n
  ) => `You are writing ${n} distinct TEMPERATURE anchors for MangaBot's CREATURE path.

EXAMPLES (DO NOT REUSE):
- "shrine-incense warmth glowing around its body"
- "winter-wind cooling its breath into ice-fog"
- "summer-cicada heat radiating from beneath its hide"
- "fox-fire warmth pulsing through its tails"
- "cold mountain-spring water lapping at its scaled flank"

${SHARED_RULES}
${ABSOLUTE_NO_HUMANS}
━━━ DEDUP — share THERMAL SOURCE and LOCATION = too similar.
━━━ OUTPUT ━━━ JSON array of ${n} strings. No preamble, no numbering, no markdown.`,

  weight: (n) => `You are writing ${n} distinct WEIGHT anchors for MangaBot's CREATURE path.

EXAMPLES (DO NOT REUSE):
- "its many tails trailing across the forest floor"
- "great horns dragging the temple beams as it moves"
- "ancient temple bell pulling its great paw to one side"
- "torii pillars groaning under its passing shadow"
- "stone lantern toppling beneath its slow tail-sweep"

${SHARED_RULES}
${ABSOLUTE_NO_HUMANS}
━━━ DEDUP — share OBJECT and MOTION VERB = too similar.
━━━ OUTPUT ━━━ JSON array of ${n} strings. No preamble, no numbering, no markdown.`,

  air: (n) => `You are writing ${n} distinct AIR anchors for MangaBot's CREATURE path.

EXAMPLES (DO NOT REUSE):
- "ghost-mist trailing behind it across the bamboo grove"
- "fox-fire sparks dancing around its silhouette"
- "cherry petals lifted in the swirl of its passage"
- "shrine-incense haze parting as it walks through"
- "spirit-light orbs orbiting its glowing horns"

${SHARED_RULES}
${ABSOLUTE_NO_HUMANS}
━━━ DEDUP — share PARTICLE and MOTION VERB = too similar.
━━━ OUTPUT ━━━ JSON array of ${n} strings. No preamble, no numbering, no markdown.`,

  lightcolor: (
    n
  ) => `You are writing ${n} distinct LIGHTCOLOR anchors for MangaBot's CREATURE path. Anime-stylized lighting on the yokai/kitsune/dragon body.

EXAMPLES (DO NOT REUSE):
- "fox-fire amber underlight rising from the forest floor"
- "shrine-lantern orange key on its glowing eye"
- "moonlit-blue rim along its many-tailed silhouette"
- "spirit-purple mist-light wrapping its body"
- "demon-fire crimson uplight from below its glowing maw"

━━━ COLOR FAMILIES ━━━
FOX-FIRE-AMBER (10-12), SHRINE-LANTERN-ORANGE (8-10), MOONLIT-BLUE (10-12), SPIRIT-PURPLE (10-12), DEMON-FIRE-CRIMSON (8-10), CHERRY-PINK (4-6), GHOST-MIST-WHITE (4-6), JADE-GREEN (4-6).

━━━ DIRECTION SPREAD ━━━ underlight (14-16 — its glowing parts), rim (12-14), key (10-12), backlight (8-10), shaft (4-6).

━━━ HARD RULES ━━━ 8-16 words per entry; COLOR + DIRECTION + IMPACT POINT (its tails / scales / fur / mask / silhouette).
${ABSOLUTE_NO_HUMANS}
━━━ DEDUP — share COLOR FAMILY and DIRECTION = too similar.
━━━ OUTPUT ━━━ JSON array of ${n} strings. No preamble, no numbering, no markdown.`,
};

// ─────────────────────────────────────────────────────────────
// SCENE — anime-scene / anime-landscape / anime-village / neo-tokyo /
// isekai-fantasy / food-anime
// ─────────────────────────────────────────────────────────────

const scene = {
  smell: (n) => `You are writing ${n} distinct SMELL anchors for MangaBot's PURE-SCENE paths.

EXAMPLES (DO NOT REUSE):
- "ramen broth steam filling the food stall"
- "cherry-blossom drift across the empty park"
- "shrine-incense lingering in the temple precinct"
- "fried-tempura crackling at the night-market stall"
- "matcha-and-mochi from the open kitchen window"

${SHARED_RULES}
━━━ DEDUP — share SCENT NOUN and LOCATION = too similar.
━━━ OUTPUT ━━━ JSON array of ${n} strings. No preamble, no numbering, no markdown.`,

  sound: (n) => `You are writing ${n} distinct SOUND anchors for MangaBot's PURE-SCENE paths.

EXAMPLES (DO NOT REUSE):
- "wind chimes ringing softly under the awnings"
- "Shinkansen rushing through the rural station"
- "cicadas droning through the August afternoon"
- "neon sign buzzing above the empty alley"
- "vending machine humming in the convenience-store doorway"

${SHARED_RULES}
━━━ DEDUP — share SOURCE and QUALITY = too similar.
━━━ OUTPUT ━━━ JSON array of ${n} strings. No preamble, no numbering, no markdown.`,

  touch: (n) => `You are writing ${n} distinct TOUCH anchors for MangaBot's PURE-SCENE paths.

EXAMPLES (DO NOT REUSE):
- "rain tapping the rice-paper door"
- "moss soft underfoot on the stone path"
- "neon-sign vibration humming against the alley wall"
- "tatami flexing under the weight of the table"
- "snow drifting across the temple-gate threshold"

${SHARED_RULES}
━━━ DEDUP — share TEXTURE and SURFACE = too similar.
━━━ OUTPUT ━━━ JSON array of ${n} strings. No preamble, no numbering, no markdown.`,

  temperature: (
    n
  ) => `You are writing ${n} distinct TEMPERATURE anchors for MangaBot's PURE-SCENE paths.

EXAMPLES (DO NOT REUSE):
- "summer-evening humidity hanging over the empty bath-house"
- "first-frost cooling the temple stone"
- "pachinko-parlor neon warmth pooling in the corner table"
- "ramen-steam warmth filling the food-stall canopy"
- "convenience-store AC chilling the morning aisle"

${SHARED_RULES}
━━━ DEDUP — share THERMAL SOURCE and LOCATION = too similar.
━━━ OUTPUT ━━━ JSON array of ${n} strings. No preamble, no numbering, no markdown.`,

  weight: (n) => `You are writing ${n} distinct WEIGHT anchors for MangaBot's PURE-SCENE paths.

EXAMPLES (DO NOT REUSE):
- "torii gate sagging slowly into the rice-field mud"
- "vending machine pressed up against the alley wall"
- "ancient temple bell hanging silent in its frame"
- "rusted Akira-bike leaning against the convenience-store window"
- "stack of ramen bowls weighing down the food-stall counter"

${SHARED_RULES}
━━━ DEDUP — share OBJECT and WEIGHT VERB = too similar.
━━━ OUTPUT ━━━ JSON array of ${n} strings. No preamble, no numbering, no markdown.`,

  air: (n) => `You are writing ${n} distinct AIR anchors for MangaBot's PURE-SCENE paths.

EXAMPLES (DO NOT REUSE):
- "cherry petals drifting between the school buildings"
- "ramen-steam curling around the lantern at the food stall"
- "rain-mist haloing every neon sign in the alley"
- "snow drifting across the empty Shinto courtyard"
- "incense haze hanging over the temple precinct"

${SHARED_RULES}
━━━ DEDUP — share PARTICLE and LOCATION = too similar.
━━━ OUTPUT ━━━ JSON array of ${n} strings. No preamble, no numbering, no markdown.`,

  lightcolor: (
    n
  ) => `You are writing ${n} distinct LIGHTCOLOR anchors for MangaBot's PURE-SCENE paths.

EXAMPLES (DO NOT REUSE):
- "Shinkai-sunset peach across the rooftops"
- "convenience-store fluorescent green flooding the wet pavement"
- "lantern-amber chain glowing along the festival approach"
- "Tokyo-rain-neon pink streaking the wet alley"
- "Akira-laser-cyan slash across the cyberpunk billboard"

━━━ COLOR FAMILIES ━━━
SHINKAI-SUNSET-PEACH (12-14), TOKYO-NEON PINK/CYAN (12-14), CONVENIENCE-STORE FLUORESCENT-GREEN (8-10), LANTERN-AMBER (10-12), AKIRA-LASER-CYAN (8-10), SHINTO-VERMILLION (8-10), GHIBLI-WARM-GOLD (8-10), MOONLIT-EDO-BLUE (6-8).

━━━ DIRECTION SPREAD ━━━ key (10-12), wash (12-14), shaft (10-12), rim (8-10), neon-glow (8-10).

━━━ HARD RULES ━━━ 8-16 words per entry; COLOR + DIRECTION + IMPACT POINT (anime environmental feature).
━━━ DEDUP — share COLOR FAMILY and DIRECTION = too similar.
━━━ OUTPUT ━━━ JSON array of ${n} strings. No preamble, no numbering, no markdown.`,
};

const metaPrompts = { female, male, creature, scene };
module.exports = { metaPrompts };
