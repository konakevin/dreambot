#!/usr/bin/env node
/**
 * Generate a GothBot pool using Sonnet.
 *
 * GothBot aesthetic — Castlevania / Bloodborne / Crimson-Peak / Berserk /
 * Tim-Burton / gothic-fairy-tale. Dark elegant beauty with twilight color,
 * NEVER LOTR / Skyrim / Witcher high-fantasy vocabulary.
 *
 * Usage:
 *   node scripts/gen-gothbot-pool.js --pool gothbot_dark_landscape_biome --count 30
 *   node scripts/gen-gothbot-pool.js --pool gothbot_dark_landscape_biome --target 200 --count 30
 *
 * Output written to scripts/bots/gothbot/seeds/<pool>.json.
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
  console.error('ANTHROPIC_API_KEY missing');
  process.exit(1);
}

const args = process.argv.slice(2);
const flag = (n, fb) => {
  const i = args.indexOf('--' + n);
  return i >= 0 ? args[i + 1] : fb;
};
const has = (n) => args.includes('--' + n);
const POOL = flag('pool', null);
const COUNT = parseInt(flag('count', '50'), 10);
const TARGET = flag('target', null) ? parseInt(flag('target', '0'), 10) : null;
const MAX_ITERATIONS = parseInt(flag('max-iter', '15'), 10);
const DRY = has('dry-run');

if (!POOL) {
  console.error('Usage: --pool <name> --count <N> [--dry-run]');
  process.exit(1);
}

// Per-pool recipe — GothBot bespoke aesthetic. Castlevania / Bloodborne /
// Crimson-Peak / Berserk / Tim-Burton — NEVER LOTR / Skyrim / Witcher.
const POOL_RECIPES = {
  // ─── GOTHBOT monster-prowl — DARK/EVIL VAMPIRE creatures (2026-05-25).
  // Kevin: vampires in this path were rendering as glam "goth women / regal
  // counts" (overlapping the goth-female paths). Regenerate the vampire sub-pool
  // MONSTROUS + EVIL — nosferatu / feral blood-beasts / corrupted vampire-lords.
  // Merge into seeds/creature_archetype.json (replacing the old glam vampires).
  // ──────────────────────────────────────────────────────────────────
  gothbot_creature_vampire: {
    format: 'simple',
    theme: `DARK, EVIL, MONSTROUS VAMPIRE CREATURES for GothBot's monster-prowl path — solo, in the gothic night. Each entry 40-60 words. These are NOT glamorous romantic counts, NOT pretty seductive goth-women — they are TERRIFYING, predatory, monstrous vampires. Nosferatu (Count Orlok) / feral blood-beast / ancient corrupted vampire-lord / plague-strigoi / bat-demon. Castlevania / Bloodborne / Nosferatu / 30-Days-of-Night / Bram-Stoker-bat-demon energy. DARK and EVIL.\n\n⚠️ MONSTER FIRST — render a monstrous vampire: cadaverous gaunt frame or hulking predator, corpse-pale / grey / ashen / sickly skin, sunken GLOWING eyes (crimson / sulfur-yellow / violet), ELONGATED dagger-fangs and long clawed talons, often a bald nosferatu skull, pointed bat-ears, or an elongated batlike snarling face, an aura of evil and menace.\n\n⚠️ EVIL, NOT SEXY: no glamour, no beauty, no alluring/seductive posing, no silk-gown-or-velvet-finery as the focus, no fashion-model elegance. Terrifying and predatory.\n\n⚠️ SKIN-TONE VARIETY: corpse-pale, ashen-grey, sickly grey-green, dusky-grey, deep-grey — all monstrous and unnatural.`,
    touchpoints: [
      'A nosferatu vampire, bald and cadaverous with grey corpse-skin stretched tight over a skull-like face, enormous bat-ears, sunken sulfur-yellow eyes burning under a heavy brow, two long rat-fangs jutting from a lipless mouth, impossibly long clawed fingers, a tattered black funerary coat hanging off an emaciated frame, predatory and silent and evil',
      'A feral blood-beast vampire crouched low on all fours, ashen-grey skin webbed with black veins, an elongated batlike snarling face split by a fang-crowded maw, milky-white pupil-less eyes, hooked talons gouging stone, naked sinew and jutting spine, animalistic and ravenous',
      'An ancient corrupted vampire-lord towering and gaunt, deep-grey skin like cracked marble, eyes two pits of crimson fire, a mouth of needle-fangs, long black talons, a high tattered collar framing a monstrous skeletal visage, regal in bearing but utterly inhuman and malevolent',
      'A plague-strigoi risen from a peasant grave, hunched and emaciated with grey-blue rotting-pale skin, burning yellow eyes deep in bruised sockets, jagged broken fangs, grave-dirt matted in thin hair, tattered burial rags, long filthy claws, feral and diseased and merciless',
      'A bat-demon vampire mid-shift, dusky-grey skin, leathery wing-membranes stretching between elongated clawed arms, an upturned bat-snout with peeled-back gums and rows of fangs, pointed ears, glowing violet eyes, a hunched menacing crouch, monstrous and predatory',
      'A hulking elder vampire, broad and brutal with sickly grey-green hide, a heavy lantern-jaw crammed with tusked fangs, deep-set burning orange eyes, scarred bald scalp, massive clawed hands, a blood-blackened tattered cloak, slow and ancient and full of dread',
      'A gaunt cathedral-haunting vampire, near-translucent corpse-pale skin showing dark veins, hairless and skeletal, eyes glowing cold green in hollow sockets, an unnaturally wide fanged grin, fingers ending in black needle-claws, drifting in tattered grey vestments, silent and evil',
      'A deep-grey-skinned feral vampire-noble gone monstrous over centuries, once-fine attire rotted to rags over a starved cadaverous frame, elongated face and jaw, crimson eyes, a mane of lank black hair, claw-tipped grasping hands, a rictus of needle-fangs, terrifying and pitiless',
    ],
    instructions: `Each entry is ONE solo MONSTROUS, DARK, EVIL vampire, 40-60 words. Must read as a terrifying predatory monster (gaunt/feral/cadaverous, corpse/grey/sickly skin, glowing sunken eyes, elongated fangs + clawed talons, nosferatu / batlike / corrupted features) — NEVER a glamorous beautiful count or pretty seductive goth-woman, never silk-gown elegance. Vary skin tone (all unnatural/monstrous). STRICTLY gothic dark-fantasy, NEVER LOTR / Skyrim / Witcher. No gore, no satanic iconography. Output as a NUMBERED list (1. ... 2. ... 3. ...), one entry per line.`,
  },

  // ─── GOTHBOT gargoyle path — GLOWING EYES axis (2026-05-25).
  gothbot_gargoyle_eyes: {
    format: 'simple',
    theme: `GLOWING GARGOYLE EYES for GothBot's gargoyle path — ONE description of a stone gargoyle's glowing eyes and how they burn, 12-22 words. The eyes glow with fierce inner light from deep within carved stone sockets — the one living spark in the rock, menacing and intense. Vary the COLOR and quality widely.`,
    touchpoints: [
      'burning ember-orange eyes glowing fierce from deep within cracked stone sockets',
      'molten lava-red eyes pulsing with furnace-light behind the carved grotesque face',
      'cold witchfire-green eyes glowing eerily from the weathered stone skull',
      'searing white-hot pinpoint eyes blazing out of black basalt sockets',
      'pulsing arcane-violet eyes radiating cold inner light through the rock',
      'smoldering coal-red eyes flickering like dying embers deep in stone',
      'icy spectral-blue eyes glowing pale from within ancient granite',
      'sulfur-yellow slitted eyes burning with malice behind a carved brow',
      'blazing molten-gold eyes like twin furnaces glowing behind the stone',
      'deep blood-crimson eyes glowing wet and pitiless in the grotesque face',
      'toxic acid-green eyes pulsing out of cracked obsidian sockets',
      'hollow ghost-white eyes glowing cold and merciless from deep stone',
    ],
    instructions: `Each entry is ONE gargoyle eye-glow description, 12-22 words. The eyes glow with inner light from within carved stone sockets — menacing and intense. Vary the color. Output as a NUMBERED list (1. ... 2. ... 3. ...), one entry per line.`,
  },

  // ─── GOTHBOT gargoyle path — SIGNATURE FEATURE axis (2026-05-25).
  gothbot_gargoyle_features: {
    format: 'simple',
    theme: `SIGNATURE GARGOYLE FEATURES for GothBot's gargoyle path — ONE gnarly AND ornate standout detail of an animated stone gargoyle, 15-30 words. A feature that makes it both terrifying and fascinating to study — vicious horns, spikes, fangs, claws, wings, tail, or intricately-carved stonework.`,
    touchpoints: [
      'a towering crown of jagged back-swept horns, each one wound with intricate carved baroque filigree',
      'rows of barbed stone spikes marching down the spine and along the lashing tail',
      'a fang-crammed maw cracked in a permanent snarl, every tooth a carved stone dagger',
      'vast ribbed stone-wings edged with carved hooks and lined with tiny grotesque sub-faces',
      'a long serpentine barbed tail carved end-to-end with ornamental scrollwork and runes',
      'cracked ancient stone crusted with lichen and studded with tiny carved leering grotesques',
      'raking talons like curved daggers, each knuckle capped with an ornate carved boss',
      'a heavy armored brow of layered ornamental stone-plates shadowing the burning eyes',
      'a ruff of jagged stone shards bristling around the neck like a collar of blades',
      'great curling ram-horns ribbed with deep-cut runic carving and worn filigree',
      'a chest of interlocking carved scales — each etched with filigree — over brutal slab-muscle',
      'wing-membranes carved with intricate stone tracery like shattered cathedral rose-windows',
    ],
    instructions: `Each entry is ONE gnarly + ornate signature gargoyle feature, 15-30 words — vicious AND intricately carved. STRICTLY gothic dark-fantasy. Output as a NUMBERED list (1. ... 2. ... 3. ...), one entry per line.`,
  },

  // ─── GOTHBOT monster-prowl-weta — GARGOYLE ACTIONS (2026-05-25).
  // The weta path is now gargoyles-only; this is the dedicated gargoyle action
  // axis — flying / perched / attacking / scouting / lurking / etc.
  // ──────────────────────────────────────────────────────────────────
  gothbot_weta_gargoyle_action: {
    format: 'simple',
    theme: `GARGOYLE ACTIONS for GothBot's gargoyle path — ONE dynamic action/pose of an animated carved-stone GARGOYLE caught mid-motion in the gothic night. Each entry 25-45 words. The gargoyle is ALWAYS a stone creature in motion. Vary the action across: flying high / swooping-diving in attack / perched gripping a spire surveying below / lurking motionless in shadow / uncoiling from its stone perch / climbing a wall claws-gouging / mid-roar on a parapet / gliding silent between towers / crouched scouting from a gutter / taking flight wings unfurling / banking through the spires / clinging upside-down beneath an arch.\n\n⚠️ Describe ONLY the gargoyle's action + body posture (wings, claws, stance, head). NO human, NO second figure, NO other creature. The gargoyle is solo and made of STONE.`,
    touchpoints: [
      'The gargoyle soars high above the cathedral, vast stone wings spread wide and rigid, body streamlined into the wind, head sweeping the streets far below, talons tucked, a colossal carved shape against the moon',
      'Perched gripping the tip of a soaring spire, wings folded tight, the gargoyle leans forward over the drop, glowing eyes raking the city below, utterly still — a sentinel of stone surveying its domain',
      'The gargoyle plummets in a full attack-dive, stone wings swept hard against its back, talons thrust forward and splayed, jaw cracked wide in a silent roar, hurtling down toward the streets',
      'Lurking motionless in deep shadow on a high ledge, the gargoyle crouches low, wings drawn close like a cloak, only its faintly-glowing eyes betraying that the stone is alive and watching',
      'The gargoyle uncoils from its centuries-old perch, stone grinding as cramped wings unfurl to their full span, forelimbs stretching, head rising, dust and lichen sloughing off newly-waking rock',
      'Climbing the sheer cathedral wall headfirst, the gargoyle digs blunt stone talons into the masonry, wings half-furled for balance, body pressed flat to the stone as it scales toward a high window',
      'Mid-roar atop a crumbling parapet, the gargoyle rears back on its haunches, wings flung wide, jaws agape, chest thrown out — a stone beast bellowing its challenge into the storm',
      'Gliding silent and low between the gothic towers, wings angled in a long banking turn, the gargoyle threads the spire-forest with predatory grace, talons skimming just above the rooftops',
      'Crouched scouting from a gutter-mouth, the gargoyle hunches with neck craned forward and down, one clawed hand gripping the stone lip, wings tucked, head cocked as it studies something below',
      'Clinging upside-down beneath a flying buttress, the gargoyle hangs by its hind talons, wings draped, head twisted around and alert, an inverted stone predator waiting in the vault-shadow',
      'Landing hard on a tomb-roof, the gargoyle slams down on all fours, wings snapping closed, stone cracking beneath its weight, head low and glaring forward mid-impact',
      'Spreading its wings on a high cliff-edge cathedral ruin, the gargoyle catches the rising wind, body coiled and leaning into the gust an instant before launching into flight',
    ],
    instructions: `Each entry is ONE solo gargoyle action, 25-45 words. The gargoyle is a STONE creature in motion — flying / swooping / perched / lurking / attacking / scouting / climbing / roaring / gliding / launching. Describe only its action + posture (wings / claws / stance / head). NO humans, NO second figure, NO other creatures. STRICTLY gothic dark-fantasy. Output as a NUMBERED list (1. ... 2. ... 3. ...), one entry per line.`,
  },

  // ─── GOTHBOT monster-prowl — SHADE creatures (2026-05-25).
  // The 5th classic-gothic-monster category Kevin wants (werewolf / vampire /
  // demon-succubus / gargoyle / SHADE). A shade is a being of LIVING DARKNESS
  // with a DEFINED, RECOGNIZABLE cloaked-humanoid silhouette — NOT a formless
  // mist-blob (that failure mode killed earlier renders) and NOT a skeleton /
  // rotting undead (that's the lich/undead category being CUT). Merge output
  // into seeds/creature_archetype.json.
  // ──────────────────────────────────────────────────────────────────
  gothbot_creature_shade: {
    format: 'simple',
    theme: `GOTHIC SHADE CREATURES for GothBot's monster-prowl path — solo, in the gothic night. Each entry 40-60 words. A SHADE is a being of LIVING DARKNESS: a clearly RECOGNIZABLE humanoid figure (head, shoulders, reaching arms, a defined silhouette) whose BODY is woven from churning shadow, smoke-edged blackness, and ribboned night — terrifying and beautiful, operatic gothic horror. Castlevania / Bloodborne shadow-boss energy.\n\n⚠️ RECOGNIZABILITY IS MANDATORY: the shade must read instantly as a defined cloaked/hooded figure of darkness with a clear silhouette and burning eyes — NEVER a formless smoke-cloud, abstract mist, or shapeless blob.\n\n⚠️ A shade is made of SHADOW/DARKNESS, not flesh and not bone — do NOT write skeletons, skulls, exposed bone, rotting flesh, or decayed corpses (those are the undead/lich category, which is BANNED here).`,
    touchpoints: [
      'A towering shade cloaked in churning living-darkness, hooded silhouette razor-sharp against the fog, two points of cold violet light burning where eyes should be, ribbons of shadow streaming off its shoulders like tattered banners, a reaching arm dissolving into smoke at the fingertips, regal and patient and utterly silent',
      'A shadow-figure of a robed monarch woven from black smoke, a faint crown of darker-than-black shadow above the hood, ember-red eyes, the hem of its form fraying into drifting soot across the flagstones, an aura of cold pressing the air, ancient and imperious',
      'A lithe shade in the shape of a cloaked assassin, body a deep churning void edged in faint blue luminescence, a blade of condensed night held low, eyes like two slits of white fire, moving as if the darkness itself leans forward, predatory and quick',
      'A broad-shouldered shade like a knight cut from living shadow, its silhouette armored in plates of denser blackness, fel-green eyes glowing beneath a shadowed brow, wisps of darkness curling from the joints, a presence that swallows the torchlight around it, grim and immovable',
      'A serpentine shade rising tall and humanoid from a pool of spreading darkness, long shadow-tendrils for hair drifting upward against gravity, hollow silver-white eyes, the lower body trailing off into a churning column of night, sinuous and hypnotic and cold',
      'A shade in the form of a hooded mourner, face an absolute void framed by a cowl of smoke, faint amber light leaking from within the hood, long shadow-robes pooling and dissolving at the ground, skeletal-thin arms of pure darkness reaching forward, sorrowful and menacing',
      'A regal shade-empress woven from violet-black darkness, an hourglass silhouette in a gown of churning shadow that trails into smoke, twin crescents of pale cold light for eyes, a collar of darker shadow rising behind her head like a fan, imperious and beautiful and lethal',
      'A hulking shade like a cloaked giant of living night, its outline blurred by streaming darkness, a single broad chest-wide band of dim ember-light where a heart would burn, eyes two coals, the fog around it pulled inward as if breathing, slow and crushing and ancient',
    ],
    instructions: `Each entry is ONE solo shade creature, 40-60 words. It MUST read as a recognizable cloaked/hooded humanoid figure of living darkness with a clear silhouette + glowing eyes — never a formless mist-blob, never a skeleton or rotting corpse. STRICTLY gothic dark-fantasy, NEVER LOTR / Skyrim / Witcher vocabulary (no Nazgul / Ringwraith). No gore, no satanic iconography, no sexualized bodies. Output as a NUMBERED list (1. ... 2. ... 3. ...), one entry per line.`,
  },

  // ─── GOTHBOT monster-prowl — SUCCUBUS creatures (2026-05-25).
  // Dark, seductive, REVEALING demon-temptresses in the painted dark-fantasy
  // tradition (Brom / Luis Royo / Boris Vallejo) — beautiful AND monstrous.
  // Sensual + bare skin, but strategically covered enough (shadow / drape /
  // wing / hair / pose) to clear Flux's NSFW filter — explicit nudity just gets
  // the render blocked. Skin-tone variety. Merge into seeds/creature_archetype.json.
  // ──────────────────────────────────────────────────────────────────
  gothbot_creature_succubus: {
    format: 'simple',
    theme: `GOTHIC SUCCUBUS CREATURES for GothBot's monster-prowl path — solo, in the gothic night. Each entry 40-60 words. A succubus is a DARK, SEDUCTIVE, REVEALING demon-temptress who is beautiful AND terrifying — irresistible allure fused with monstrous menace. Painted dark-fantasy tradition (Brom / Luis Royo / Boris Vallejo). Dark seductive-predator energy: hypnotic heavy-lidded gaze, sinuous pose, an irresistible-but-lethal presence. Castlevania / Bloodborne / Devil-May-Cry demon-temptress.\n\n⚠️ MONSTER FIRST: she must read as a demonic creature — curved horns, leathery or feathered dark wings, taloned fingertips, a fanged smile, glowing eyes, often a barbed tail. Seductive, never merely a pretty woman.\n\n⚠️ SENSUAL + REVEALING: bare shoulders, back, midriff, and long legs; barely-there dark silk, low-cut or open gowns, leather-strap harnesses, draped gossamer, thigh-baring slits. Lean into the sensual painted-succubus register.\n\n⚠️ KEEP IT POSTABLE (so Flux's filter passes): nipples and genitals are NOT shown — kept just-covered by strategic shadow, a silk drape, a wing, falling hair, an arm, or pose. Suggestive and seductive, rendered as a PAINTED illustration — alluring, not pornographic.\n\n⚠️ SKIN-TONE VARIETY: alabaster, dusky-bronze, deep-ebony, warm-olive, ashen-grey, crimson-tinged — not all pale.`,
    touchpoints: [
      'A succubus with deep-ebony skin and molten-gold eyes, two backswept onyx horns, vast leathery wings half-spread, a fanged knowing smile, bare-shouldered in barely-there blackened silk that drapes low across her hips, taloned fingers trailing down her bare midriff, a wing curling forward to half-veil her, regal and hypnotic and lethal',
      'A succubus with dusky-bronze skin and burning amber eyes heavy-lidded with cruel amusement, curved ram-horns wound with thin gold chain, feathered raven-black wings, a thin oxblood-velvet harness of crossed straps over bare skin, a barbed tail curling at her thigh, hair spilling across her chest, predatory and irresistible',
      'A succubus with ashen-grey skin and twin violet eyes that glow like coals, slender obsidian horns, bat-leather wings folded close, a single length of midnight-blue silk draped diagonally and pooling at her bare legs, a fang dimpling her smile, taloned fingertips at a crumbling balustrade, deep shadow veiling her, cold and seductive',
      'A succubus with warm-olive skin and crimson eyes, backward-curving horns crowned with a thin black-iron circlet, dark feathered wings rising behind her, an open charcoal gown slit to the hip baring one long leg, a leather strap across her chest, fanged smile, sinuous and dangerous and beautiful',
      'A crimson-tinged succubus with eyes like burning embers, broad demonic horns and a serpentine barbed tail, vast dark wings arched like a cathedral vault behind her, a blackened-bronze armor-bodice over bare midriff and tattered crimson silk falling from her hips, taloned hand extended in invitation, ferocious and seductive',
      'A succubus with alabaster skin and silver-white glowing eyes, delicate curved horns, gossamer-dark dragonfly wings catching faint light, draped in sheer plum gauze that bares her shoulders and back, a knowing fanged smile and heavy-lidded gaze, one arm drawn across her, elegant and hypnotic and cold',
      'A statuesque succubus with deep-mahogany skin and fel-green eyes, heavy backswept horns, enormous leathery wings unfurling, a black-and-gold silk drape clasped at one shoulder and falling open down her side, a barbed tail and taloned fingers, chin lifted in imperious allure, queenly and monstrous',
      'A lithe succubus with dusky skin and twin gold-ringed violet eyes, short curling horns, sleek bat-wings tucked behind, in a minimal black leather harness and trailing sheer chiffon baring her legs, lips parted in a fanged smile, one taloned finger raised, an aura of perfumed danger, seductive and predatory',
    ],
    instructions: `Each entry is ONE solo succubus creature, 40-60 words. She MUST read as a demonic monster (horns + wings + glowing eyes + fangs/talons) who is dark, seductive, and REVEALING — bare skin, barely-there silk / leather harness / open or thigh-slit gowns, sinuous pose. Vary skin tone. Keep it postable so Flux's filter passes: nipples and genitals are NOT shown — kept just-covered by shadow / drape / wing / hair / arm / pose; suggestive painted illustration, not pornographic. STRICTLY gothic dark-fantasy, NEVER LOTR / Skyrim / Witcher. No gore, no satanic iconography. Output as a NUMBERED list (1. ... 2. ... 3. ...), one entry per line.`,
  },

  // ─── GOTHBOT monster-prowl — WEREWOLF + GARGOYLE + HELLHOUND + HARPY
  // (2026-05-25). Boost werewolves/gargoyles + restore hellhounds/harpies per
  // Kevin. Merge output into seeds/creature_archetype.json.
  // ──────────────────────────────────────────────────────────────────
  gothbot_creature_werewolf: {
    format: 'simple',
    theme: `GOTHIC WEREWOLF CREATURES for GothBot's monster-prowl path — solo, in the gothic night. Each entry 40-60 words. A massive, terrifying, magnificent lycanthrope beast — Castlevania / Bloodborne / Van-Helsing / Underworld werewolf energy. The WHO, the design, signature features.\n\n⚠️ MONSTER FIRST: a clearly recognizable werewolf — towering lupine beast, dense fur, elongated snout with bared fangs, taloned claws, powerful corded musculature, glowing eyes.\n\n⚠️ VARIETY: vary fur color (charcoal-grey / midnight-black / silver / russet-brown / ash-white / grizzled), build (lean and rangy / hulking and broad / fenrir-giant), and form (full bipedal beast / mid-transformation half-human / hunched quadruped-stance).`,
    touchpoints: [
      'A massive bipedal werewolf eight feet tall, dense charcoal-grey fur over corded muscle, elongated snout with bared sword-length fangs, glowing fel-green eyes, taloned hands hanging long, a tattered leather war-harness with a silver-claw clasp across its chest, mid-howl with head thrown skyward, ferocious and primal',
      'A silver-furred werewolf caught mid-leap, lean and rangy frame stretched in flight, moonlight rimming every hair in cold light, ice-blue eyes burning, fangs bared in a snarl, ribbons of torn cloak streaming behind, claws extended forward, savage and graceful',
      'A werewolf mid-transformation, half-human torso still visible above a lengthening lupine snout, russet-brown fur erupting across stretching limbs, fingers splitting into black claws, eyes shifting from human to glowing-amber, jaw distending with new fangs, agonized and terrible',
      'A fenrir-giant werewolf hulking and broad as a bear, midnight-black fur matted with frost, massive shoulders, glowing crimson eyes deep beneath a heavy brow, fangs like ivory daggers, a snapped iron chain still locked around one wrist, slow and crushing and ancient',
      'An ash-white werewolf hunched in a quadruped stalking-stance, pale fur bristling along a ridged spine, lips peeled back from black gums and yellow fangs, sulfur-yellow eyes low to the ground, drool stringing from its maw, coiled and hungry and predatory',
      'A grizzled scarred werewolf standing upright, dense grey-brown fur crossed with old battle-scars and a torn ear, one milky blind eye and one burning gold, broad clawed hands flexing, a bone-and-leather collar at its throat, weathered and lethal and unkillable',
    ],
    instructions: `Each entry is ONE solo werewolf, 40-60 words. Must read instantly as a recognizable werewolf (lupine snout + fangs + fur + claws + glowing eyes). Vary fur color, build, and transformation stage. STRICTLY gothic dark-fantasy, NEVER LOTR / Skyrim / Witcher. No gore, no mid-bite-on-victim, no satanic iconography. Output as a NUMBERED list (1. ... 2. ... 3. ...), one entry per line.`,
  },

  gothbot_creature_gargoyle: {
    format: 'simple',
    theme: `GNARLY, FEROCIOUS, ORNATE — but STRICTLY CLASSIC — GOTHIC GARGOYLE CREATURES for GothBot's gargoyle path. Each entry 40-60 words. An animated carved-STONE CLASSIC CATHEDRAL GARGOYLE come to terrible life — the iconic Van-Helsing / Castlevania / Notre-Dame winged demonic stone gargoyle: a HORNED, BAT-WINGED, FANGED-DEMON-FACED, clawed grotesque of carved stone. The MOST gnarly, mean gargoyle imaginable, dialed to 11, yet ORNATELY carved — terrifying AND mesmerizing.\n\n⚠️ CLASSIC GARGOYLE FORM (MANDATORY every entry): a LEAN, HUNCHED, gnarled demonic stone-grotesque body, a snarling FANGED demon-face, CURVED HORNS, membranous BAT-LEATHER stone-WINGS, clawed talons — the instantly-recognizable cathedral-gargoyle silhouette. LEAN, wiry, and gnarled — NOT muscular / bulky / beefy / heroic-physique; a traditional crouching grotesque, never a bodybuilder.\n⚠️ GNARLY + ORNATE: snarling fanged maw, jagged barbs and spikes, vicious horns, raking talons, scarred cracked stone — AND densely carved baroque filigree, ornamental flourishes, intricate craftsmanship.\n⚠️ STONE: weathered carved stone (granite / sandstone / blackened basalt / verdigris-bronze / obsidian), unmistakably LIVING ROCK.\n⚠️ VARY ONLY: stone type, pose, horn-style (short curved / swept-back / jagged / clustered multi-horned), wing-spread, ornamentation. The CREATURE TYPE never changes — ALWAYS the classic horned bat-winged fanged-demon stone gargoyle.\n\n🚫 BANNED — NEVER: NO lion-maned/leonine, NO bird/raptor beaks, NO skull-faced or skeletal gargoyles, NO chimera/multi-headed, NO imp, NO dragon-snouts, NO goat / ram / caprine / satyr heads, horns, or faces. The face is ALWAYS a snarling fanged DEMON-grotesque (flat brutish snout, NOT an animal muzzle). ONLY the classic winged demon-gargoyle. (Eyes kept generic — a separate axis sets the glow.)`,
    touchpoints: [
      'A classic cathedral gargoyle of weathered granite, a lean hunched demonic grotesque with a snarling fanged face and flat snout, two short curved horns, bat-leather stone-wings folded high, clawed talons gripping a ledge, ornate filigree across its gnarled hide',
      'A tall lean winged stone gargoyle of blackened basalt, a fanged demon-face in a wide bared-teeth grimace, swept-back horns, vast membranous bat-wings, raking stone claws on spindly limbs, every plate carved with baroque ornament, mean and ancient',
      'A Notre-Dame-style gargoyle of cracked sandstone, a lean hunched demonic body, swept-back horns, a fanged grimacing visage, leathery stone-wings half-spread, taloned claws, deeply ornamented weathered stone, gnarly and grand',
      'A Castlevania-style stone gargoyle, a horned demon-grotesque with a wide fang-crammed maw, membranous bat-wings spread, a barbed tail, long clawed talons on a lean wiry frame, intricate filigree across its plates',
      'A verdigris-bronze gargoyle, a snarling horned demon-face with pointed ears, vast bat-wings, lean clawed grasping limbs, scrollwork and tiny grotesque sub-faces carved across its corroded hide, vicious and ornate',
      'A gaunt obsidian gargoyle, multiple short curved horns crowning a fanged demonic face, jagged spikes down its hunched back, leathery stone-wings, raking talons, dense baroque carving over angular gnarled stone, terrifying and detailed',
      'A weathered granite gargoyle crouched low and aggressive, a snarling fanged maw, twin back-swept horns, bat-leather wings drawn like a cloak, long clawed talons, a lean sinewy stone frame, ornate filigree and lichen in the deep grooves',
      'A grand cathedral gargoyle of grey stone, a classic horned demon-grotesque with a fanged snarl, broad membranous wings flared wide, barbed elbows and tail, raking talons on a lean angular body, lavish baroque carving across every surface',
    ],
    instructions: `Each entry is ONE solo CLASSIC gargoyle, 40-60 words — the iconic HORNED, BAT-WINGED, FANGED-DEMON-FACED, clawed carved-STONE cathedral gargoyle (Van-Helsing / Castlevania / Notre-Dame), gnarly + mean + ornately carved, and LEAN / hunched / gnarled (NOT muscular / bulky / beefy). Vary ONLY stone, pose, horns, wing-spread, ornamentation — the creature type is ALWAYS the classic winged demon-gargoyle. 🚫 NEVER lion-maned, bird-beaked, skull-faced/skeletal, chimera/multi-headed, imp, dragon-snouted, or goat/ram/caprine-headed. Keep eye-color generic. STRICTLY gothic dark-fantasy. Output as a NUMBERED list (1. ... 2. ... 3. ...), one entry per line.`,
  },

  gothbot_creature_hellhound: {
    format: 'simple',
    theme: `GOTHIC HELLHOUND CREATURES for GothBot's monster-prowl path — solo, in the gothic night. Each entry 40-60 words. A massive demonic hound from the underworld — burning, monstrous, terrifying. Castlevania / Bloodborne / Diablo hellhound energy. The WHO, the design, signature features.\n\n⚠️ MONSTER FIRST: a clearly recognizable demonic hound — huge canine body (size of a horse or larger), obsidian / charred / ember-cracked hide, a fanged maw with smoking or fiery breath, burning eyes, claws scoring the ground.\n\n⚠️ VARIETY: vary the hide (sleek obsidian fur / charred-cracked ember-skin / matted ash-grey / spined-and-armored), the fire (ember-red / hellfire-orange / cold-blue spectral flame / sulfur-green), head-count (single / twin-headed / three-headed cerberus), and accessories (broken hell-chains / spiked collar / burning brand).`,
    touchpoints: [
      'A hellhound the size of a war-horse, sleek obsidian fur over slab-muscle, burning ember-red eyes like furnace-coals, a fanged maw venting curls of black smoke, broken iron hell-chains dragging from a spiked collar, claws scoring molten grooves into the cobblestones, ravenous and savage',
      'A charred ember-skinned hellhound, hide cracked like cooling lava with hellfire-orange glow leaking from every fissure, a slavering maw rimmed in flame, eyes two points of white-hot fire, embers shedding from its hackles, lunging low with bared fangs, infernal and relentless',
      'A three-headed cerberus hellhound, three obsidian canine heads on one massive corded neck-and-shoulders, six burning sulfur-green eyes, three sets of dripping fangs snarling in unison, a spiked black collar binding all three throats, claws braced wide on broken gravestones, monstrous and watchful',
      'A spectral hellhound wreathed in cold-blue ghost-flame, ash-grey skeletal-lean frame (still furred, not bone) edged in flickering spirit-fire, hollow eyes burning ice-blue, a soundless snarl trailing wisps of frost-flame, padding through the fog leaving scorched pawprints, eerie and predatory',
      'A spined-and-armored hellhound, matted black fur over a back ridged with jagged bone-spikes, a brand of glowing runes seared into its flank, burning amber eyes, jaws cracked wide showing a furnace-glow throat, a snapped chain whipping behind, brutal and unstoppable',
      'A colossal hellhound twice horse-height, obsidian hide steaming in the cold night, a single burning-coal eye and one scarred-shut socket, a maw of blackened fangs venting hellfire, a heavy spiked war-collar half-buried in its ruff, head low and stalking, ancient and merciless',
    ],
    instructions: `Each entry is ONE solo hellhound, 40-60 words. Must read instantly as a demonic hound (huge canine body + fanged maw + fire/smoke + burning eyes). Vary hide, flame color, head-count, accessories. STRICTLY gothic dark-fantasy, NEVER LOTR / Skyrim / Witcher. No gore, no mid-bite-on-victim, no satanic iconography. Output as a NUMBERED list (1. ... 2. ... 3. ...), one entry per line.`,
  },

  gothbot_creature_harpy: {
    format: 'simple',
    theme: `GOTHIC HARPY CREATURES for GothBot's monster-prowl path — solo, in the gothic night. Each entry 40-60 words. A fierce woman-raptor hybrid monster — terrifying and beautiful. Greek-myth-by-way-of-Castlevania / Berserk harpy energy. The WHO, the design, signature features.\n\n⚠️ MONSTER FIRST: a clearly recognizable harpy — a fierce woman's face and feathered torso fused with massive raptor wings, taloned bird-legs / clawed feet, often feather-clad or armored, a wild predatory bearing. She is a MONSTER, not a pin-up — feathers and plumage cover her, fierce not sexual.\n\n⚠️ VARIETY: vary plumage (raven-black / storm-grey / blood-streaked-crimson / barn-owl mottled / iridescent-oily-green), pose (perched on a crag / mid-flight diving / wings flared in threat-display), and features (clawed hands / fully bird-taloned / a crest of feathers / a screech mid-cry).`,
    touchpoints: [
      "A harpy perched on a windswept crag, a fierce woman's face with sharp features and golden raptor-eyes, a torso clad in raven-black plumage, vast black-feathered wings half-spread, scaled taloned bird-legs gripping the wet stone, a crest of dark feathers raised, screeching mid-cry, wild and predatory",
      "A storm-grey harpy diving mid-flight, wings swept back into a hunting-stoop, a woman's face contorted in a shriek, feathered arms ending in long raking claws, mottled grey plumage streaming, taloned feet thrust forward to strike, fierce and lethal",
      "A blood-streaked crimson harpy clinging to a gargoyle's shoulder, a gaunt beautiful woman's face with burning amber eyes, dark-red-and-black plumage matted across her torso, enormous tattered wings, clawed hands gripping the stone, a low feral hiss, vicious and territorial",
      "A barn-owl harpy on a moonlit belfry-rail, a pale heart-shaped woman's face ringed in mottled cream-and-brown feathers, huge silent owl-wings folded, deep-black eyes, feathered torso and taloned legs, head swiveling unnaturally far, eerie and silent and watchful",
      "An iridescent oily-green harpy with wings flared wide in a threat-display, a fierce woman's face with a shrieking open mouth, glossy black-green plumage catching sickly light, long clawed fingers spread, scaled raptor-legs braced on a ruined cornice, aggressive and unnerving",
      "A regal ash-grey harpy queen on a high crag, a proud woman's face crowned with a sweeping feather-crest, ornate bone-and-feather adornments at her shoulders, vast grey wings arched like a cloak, taloned feet curled around a perch of stacked skulls, imperious and monstrous",
    ],
    instructions: `Each entry is ONE solo harpy, 40-60 words. Must read instantly as a woman-raptor harpy (woman\'s face + feathered torso + massive raptor-wings + taloned legs). She is a fierce MONSTER, feather-clad — not a pin-up, not sexualized. Vary plumage, pose, features. STRICTLY gothic dark-fantasy, NEVER LOTR / Skyrim / Witcher. No gore, no satanic iconography. Output as a NUMBERED list (1. ... 2. ... 3. ...), one entry per line.`,
  },

  // ─── GOTHBOT monster-prowl — DRAMATIC BACKGROUND EVENT (2026-05-25).
  // A 40%-gated "drama" axis (DragonBot pattern) — a dramatic gothic EVENT/
  // phenomenon layered into the sky/distance behind the monster to make the
  // background interesting + narrative. NOT the monster, NOT a human focus.
  // Merge into seeds/gothbot_monster_prowl_drama.json.
  // ──────────────────────────────────────────────────────────────────
  gothbot_monster_prowl_drama: {
    format: 'simple',
    theme: `DRAMATIC GOTHIC BACKGROUND EVENTS for GothBot's monster-prowl path — ONE dramatic environmental EVENT or phenomenon layered into the sky / midground / deep distance of a gothic-horror scene, BEHIND and around a solo monster (the monster is rendered separately — do NOT describe the monster or any human). Each entry 30-50 words, opening with the EVENT NAME IN CAPS then " — " then the description. Castlevania / Bloodborne / Van-Helsing operatic drama. The event makes the background gorgeous, ominous, and narrative.\n\n⚠️ Describe ONLY the background event/phenomenon and how it transforms the sky/distance — NO monster, NO creature, NO human figure (those are added separately).\n\n⚠️ STRICTLY gothic dark-fantasy, NEVER LOTR / Skyrim / Witcher, NEVER modern / sci-fi. NO satanic iconography (no pentagrams / inverted crosses).`,
    touchpoints: [
      'BLOOD-MOON ECLIPSE — a vast crimson eclipse swallows the night sky, the blood-red moon ringed in a corona of fire, bathing the distant spires and clouds in deep scarlet light, long red shadows stretching across the gothic landscape',
      'DISTANT BURNING SIEGE — a far-off village and castle ablaze on the horizon, towering columns of orange firelight and black smoke climbing into the night, the glow flickering across low storm-clouds and silhouetting distant ruined towers',
      'ERUPTING BAT-SWARM — a vast living swarm of thousands of bats explodes upward from the cathedral spires, spiralling black against the moon in a churning ribbon that darkens half the sky',
      'WITCHFIRE AURORA — eerie green-and-violet auroral curtains ripple and pulse across the entire sky above the jagged skyline, casting shifting spectral light over the distant rooftops and fog',
      'TEMPEST LIGHTNING — a violent black storm splits the heavens with branching forks of white lightning that flash-illuminate the distant gothic towers and sheeting rain, thunderheads boiling overhead',
      'OMEN COMET — a blazing blue-white comet streaks low across the star-strewn night, its long burning tail arcing over the spires, an ill omen reflected in every distant window and wet rooftop',
      'GHOST-LIGHT PROCESSION — a winding river of pale spectral lanterns and drifting will-o-wisps threads through the fog-filled valley far below, a silent funereal procession of cold blue light',
      'TIDAL FOG-WAVE — a towering wall of luminous fog rolls in across the distant moor like a slow tidal wave, swallowing far hills and the bases of the gothic towers, its crest catching the moonlight',
      'ASH-AND-EMBER RAIN — the sky rains glowing orange embers and grey ash drifting down over the whole scene from some distant unseen fire, motes catching the light against deep-charcoal clouds',
      'TWIN BLOOD MOONS — two enormous moons hang side by side low over the horizon, one bone-pale and one blood-red, their combined light throwing doubled shadows across the haunted distance',
      'COLLAPSING BELL-TOWER — far across the city a great gothic bell-tower buckles and falls mid-collapse, a billowing plume of dust and dislodged ravens rising against the moonlit sky',
      'MASSING SHADOW-HORDE — on the distant moonlit hills a vast silent horde of shadowy silhouetted figures massses and advances, a dark tide spilling toward the spired skyline',
    ],
    instructions: `Each entry is ONE dramatic gothic BACKGROUND event/phenomenon, 30-50 words, opening with EVENT NAME IN CAPS + " — " + description. Describe ONLY the sky/distance phenomenon — NO monster, NO creature, NO human figure. STRICTLY gothic dark-fantasy, NEVER LOTR / Skyrim / Witcher / modern / sci-fi. No satanic iconography. Output as a NUMBERED list (1. ... 2. ... 3. ...), one entry per line.`,
  },

  // ─── GOTHBOT monster-prowl — LUSH GOTHIC SETTING / STAGE (2026-05-25).
  // Replaces the borrowed ASSASSIN_STAGE (sparse, ground-level, deliberately
  // empty) with DENSE, LAYERED, richly-detailed gothic backdrops so the monster
  // stands in a lush full world, not a minimal void. Castlevania / Bloodborne /
  // Crimson-Peak splendor. Merge into seeds/gothbot_monster_prowl_stage.json.
  // ──────────────────────────────────────────────────────────────────
  gothbot_monster_prowl_stage: {
    format: 'simple',
    theme: `LUSH FULL GOTHIC SETTINGS for GothBot's monster-prowl path — the dramatic, richly-detailed BACKGROUND behind a solo monster hero. Each entry 40-60 words. A DENSE, layered, gorgeous gothic environment PACKED with architectural detail and multi-tier depth. Castlevania / Bloodborne / Crimson-Peak / Van-Helsing / Dark-Souls splendor.\n\n⚠️ LUSH AND FULL, never empty or minimal: every entry must read as a rich, detailed, layered world — foreground architectural detail + a commanding midground structure + deep-distance spires/towers/sky.\n\n⚠️ NAME a specific grand gothic setting (towering cathedral interior / ornate castle throne-hall / sprawling statuary graveyard / grand ruined abbey nave / vast crypt-cathedral gallery / blood-cult sanctum / gothic city rooftops of spires / moonlit cloister / candle-lit gothic library / catacomb gallery / vampire-castle courtyard) with AT LEAST 2-3 named architectural features (rose windows, ribbed vaults, flying buttresses, carved statuary, iron chandeliers, tattered banners, sweeping stairs, gargoyle-lined ledges).\n\n⚠️ This is a BACKDROP — describe the ENVIRONMENT only, NO humans, NO figures, NO creatures (a monster is added separately in the foreground). Richly atmospheric (volumetric light, drifting mist/dust/embers) but the architecture stays crisp and detailed, never lost in haze.`,
    touchpoints: [
      'The soaring interior of a vast gothic cathedral, towering ribbed-vault ceiling vanishing into shadow, an enormous jewel-toned stained-glass rose window flooding colored light, double rows of carved saint-statues flanking the nave, massive iron chandeliers hanging on heavy chains, moonlit dust drifting between the columns, deep multi-tier depth to a distant altar',
      'A sprawling statuary graveyard at blood-moon rise, hundreds of weathered tombstones and weeping-angel statues receding row upon row into drifting fog, ornate mausoleums with iron doors, a towering gothic chapel spire piercing the distance, gnarled black trees framing the foreground, layered depth everywhere',
      'An ornate castle throne-hall, black-marble floor mirroring towering fluted columns, tattered royal banners hanging the full height of the walls, a distant carved obsidian throne on a tiered dais, blazing candelabras and a vast vaulted ceiling, deep stained-glass windows leaking colored moonlight',
      'A grand ruined abbey nave open to a stormy sky where the roof collapsed long ago, soaring broken arches and ivy-choked columns marching into the distance, scattered carved rubble and toppled statuary, a half-ruined altar far down the nave, shafts of moonlight cutting the drifting mist',
      'A vast crypt-cathedral gallery, endless ribbed stone arches lined with carved marble sarcophagi and bone-ornamented walls, hundreds of dripping candles on iron stands, deep receding tunnels branching into darkness, a great carved ossuary screen in the midground, cold light pooling on the flagstones',
      'The moonlit rooftops of a gothic city, an undulating sea of steep slate roofs and crooked chimneys, clustered spires and a colossal cathedral silhouette dominating the skyline, flying buttresses and gargoyle-lined ledges in the foreground, a vast full moon and layered atmospheric depth behind',
      'The torch-lit courtyard of a multi-spire vampire castle at night, a central statuary fountain, sweeping stone stairs flanked by gargoyles, the towering ornate facade with rows of arched windows rising on every side, iron gates and skeletal topiary, the castle keep looming against a star-strewn sky',
      'A candle-lit gothic library-sanctum, towering bookshelves rising three storeys into a vaulted ceiling, ornate iron balconies and spiral stairs, a great arched window pouring blue moonlight across a marble floor, drifting dust and gold candle-glow, deep shadowed alcoves layered into the distance',
    ],
    instructions: `Each entry is ONE lush, full, detailed gothic SETTING (backdrop only — NO humans, NO figures, NO creatures), 40-60 words. Name a specific grand gothic structure/place + 2-3 named architectural features + multi-tier depth (foreground / midground structure / deep distance). DENSE and richly detailed, never empty/minimal. STRICTLY gothic dark-fantasy, NEVER LOTR / Skyrim / Witcher, NEVER modern / sci-fi. Output as a NUMBERED list (1. ... 2. ... 3. ...), one entry per line.`,
  },

  // ─── GOTHBOT goth-male-closeup path (2026-05-15 migration).
  // MALE-LOCKED dark-aristocrat closeups. Mysterious / ominous / deadly.
  // Tight frame, vampire-lord mandate, NSFW-clean. Solo.
  // ──────────────────────────────────────────────────────────────────

  gothbot_goth_male_closeup_archetype: {
    format: 'simple',
    theme: `MALE GOTHIC ARCHETYPES — core identity for dark-aristocrat goth-male-closeup. Each entry 15-30 words. MYSTERIOUS / OMINOUS / DEADLY energy.\n\n⚠️ Each entry is ONE archetype with a 1-2 sentence essence that informs his ENERGY (predatory / mysterious / dangerous / regal / weathered / lethal / etc.).\n\n⚠️ STRICTLY GOTHIC FANTASY archetypes — never real-world ethnic codes. Always MALE-coded.\n\n✓ ALLOWED: vampire lord / dark prince / dark king / dark warlock / dark priest / shadow assassin / dark sorcerer / death-god / dark druid / vampire-baron / dark hunter / undead duke / dark valkyr (male) / dark bard / dark cardinal / nightshade-warlock / dark countess's-consort / blood-sorcerer / death-cult patriarch / corrupted-angel (male) / dark seraph / bone-king / nightmare-groom / dark vampire-marquis / obsidian alchemist / dark monk-assassin / dark inquisitor / dark templar / dark prophet / ghost-king`,
    touchpoints: [
      'ANCIENT VAMPIRE LORD — centuries-old aristocratic predator, blood-debt-keeper, knows everyone in this room belongs to him already',
      'DARK PRINCE — fallen-kingdom heir who waited too long, crown still cold on his brow, ruling from his tomb-throne',
      'DARK WARLOCK — practitioner of forbidden spell-craft, ink-stained hands, eyes that have seen the void',
      'DARK PRIEST — high priest of a cult-of-shadows, blood-sacrament on his hands, devoted to the night',
      'SHADOW ASSASSIN — silent killer with the patience of stone, blade always within reach, sleepless gaze',
      'DARK SORCERER — silver-tongued caster whose every word binds, smile like a knife',
      'VAMPIRE BARON — Wallachian noble in deepest velvets, bargain-keeper, dangerous trickster',
      'DEATH-GOD INCARNATE — minor death-deity walking among mortals, bored and watchful',
      'UNDEAD DUKE — Victorian aristocrat caught in his own death, still elegant, still hungry',
      'DARK DRUID — green-warlock of the corrupted-grove, wears antlers and lichens, beloved of crows',
      'DARK HUNTER — vampire-hunter who became what he hunted, scarred and lethal, never sleeps',
      'NIGHTSHADE WARLOCK — wild-haired hedge-warlock who lives in the haunted-wood, poisons in his satchel',
      'DARK INQUISITOR — fanatic ex-cleric turned dark-arts-burner, gauntleted, severe',
      'DARK TEMPLAR — fallen-paladin turned death-knight, gothic-plate over silk, gaunt and grim',
      'NIGHTMARE GROOM — left at the altar a century ago and never forgave, the rage cooled to ice',
      'BLOOD SORCERER — practitioner of crimson-magick, scarlet-eyed, calligraphy-scars on his arms',
      'DARK BARD — wandering minstrel-warlock who curses through verse, lute slung across his back',
      'DARK CARDINAL — fallen-clergy aristocrat in deep-crimson silk, jeweled rings, lethal piety',
      'CORRUPTED ANGEL (male) — fallen-celestial who never repented, broken wings hidden beneath cloak',
      'DEATH-CULT PATRIARCH — leader of a death-worshipping coven, marked with ritual scars he chose',
      'DARK SERAPH — six-winged shadow-celestial, eyes mismatched, voice doubled',
      'BONE-KING — necromancer-monarch who rules a kingdom of the bound-dead, weathered crown',
      'OBSIDIAN ALCHEMIST — dragon-blooded sorcerer in deep-violet robes, can break stone with a glance',
      'PLAGUE-PRIEST — devotee of pestilence, gives plague as blessing, raven-mask hangs at his belt',
      "GHOST-KING — wraith-monarch who keeps a spectral court, knows every dead man's name in his realm",
      'DARK PROPHET — possessed seer who speaks with multiple voices, eyes white as moons',
      'DARK MONK-ASSASSIN — silent-order assassin in long robes, prayer-beads in one hand, blade in other',
      'NIGHT-MARKET MERCHANT — sells forbidden things in a stall at midnight, his smile cuts the air',
      'DARK VAMPIRE-MARQUIS — Wallachian nobleman, family name older than the kingdom, secret rooms in his castle',
      'TEMPLE-BOUND CONSORT — bridegroom of an old dark god, lifetime-bound, eyes glow when his god speaks through him',
    ],
    instructions: `Each entry is ONE male gothic archetype, 15-30 words. STRICTLY gothic-fantasy. NEVER real-world ethnic. ALWAYS male-coded. Output as a NUMBERED list (1. ... 2. ... 3. ...), one entry per line.`,
  },

  gothbot_goth_male_closeup_skin: {
    format: 'simple',
    theme: `MALE GOTHIC SKIN — descriptions for dark-aristocrat goth-male-closeup, what candlelight does to his skin in tight frame. Each entry 15-30 words.\n\n⚠️ Diverse range of skin tones (porcelain / olive / dusk-bronze / mahogany / ebony) but ALL with gothic-corrupted-beauty character — never modern. Describe HOW LIGHT INTERACTS with masculine bone structure.\n\n✓ ALLOWED: pale-marble / corpse-pale / dusk-olive / honey-bronze / mahogany / sepia / deep-ebony / dusk-violet-undertone / weathered-tan / scar-marked`,
    touchpoints: [
      'porcelain-pale skin with cool blue-violet undertones in shadow, candlelight pooling warm-amber at his sharp cheekbones and jawline',
      'corpse-pale skin so white it seems to glow, faint blue veins visible at the temples, moonlight rendering him almost translucent',
      'dusk-olive skin with rich warm undertones, candlelight catching at his cheekbones and the line of his strong jaw in gold',
      'mahogany skin warm and deep, candlelight rendering him in burnished bronze and shadow, cheekbones sculpted by the dark',
      'pale-marble skin with cool gray-violet shadow, centuries old and still smooth — predator skin that does not age',
      'weathered-tan skin with the faintest scatter of pale scars across his cheekbone, candlelight warming the warm-amber tones',
      'honey-bronze skin with warm-gold candlelight catching his cheekbones, shadow pooling in violet beneath his jawline',
      'ebony skin rich and deep, candlelight catching the high planes of his face in soft warm-amber, shadows in cool indigo',
      'sepia-amber skin warm in candlelight, the deeper hollows of his face in plum-shadow, predator cheekbone-shadow',
      'moon-silvered pale skin with cool-blue-undertones, candlelight unable to fully warm him, ghostly pallor',
      'dusk-violet-undertone skin in deepest shadow, candlelight catching gold at his cheekbone and the bridge of his nose',
      'pale-rose skin in candlelight with the faintest flush at his cheekbones, shadow pooling cool-blue at his throat',
      'deep-bronze skin glowing warm in firelight, the texture of carved hardwood at the cheekbone, predator-shadow',
      'porcelain skin with a single scar tracing from cheekbone to jaw, candlelight catching the silver of the old wound',
      'weathered-amber skin with the faintest map of old battle-scars across his face, candlelight gold-warm',
      'pale-amber skin with rose-gold undertones in candlelight, the deeper shadows in deep-violet, vampire-warm',
      'dusky-olive skin with deep warm tones, candlelight catching at the bridge of his nose and the line of his clavicle',
      'corpse-pale skin with the faintest violet flush at his cheekbones (recently fed), candlelight unable to truly warm him',
      'rich-cocoa skin with warm-amber highlights at the cheekbones, shadow in cool-plum at the jaw, predator cheekbones',
      'pale-ivory skin with the faintest amber undertone in candlelight, shadow in deep-violet beneath his jaw',
      'sun-deprived pale skin so cool it reads silver, candlelight rendering him almost statuesque',
      'olive skin with golden warm undertones, candlelight catching at his cheekbones and the upper curve of his shoulder',
      'pale-marble skin with the faintest blue undertones at his temples (centuries-old vein-glow), candlelight unable to fully warm',
      'mahogany skin deep and warm, candlelight catching the polished hardwood of his cheekbones, predator-shadows in burnt-umber',
      'weathered-pale skin with a single scar at his throat (where someone tried), candlelight rendering it silvered',
      'pale-ivory skin marked with a small constellation of pale-violet birthmarks at his collarbone, candlelight gold',
      'dusk-bronze skin with rich warm tones, candlelight catching at his cheekbones in warm-gold, shadow in cool-violet',
      'porcelain-pale skin in candlelight with the faintest cool-violet undertone, predator skin that does not flush',
      'amber-rose skin with warm undertones, candlelight catching the high places of his face in gold, plum-shadow beneath',
      'corpse-pale skin so cool it reads in moonlight-blue even in warm candlelight, ghostly and inhuman',
    ],
    instructions: `Each entry is ONE skin description with light interaction, 15-30 words. Diverse tones. Gothic-corrupted-beauty MASCULINE. Output as a NUMBERED list (1. ... 2. ... 3. ...), one entry per line.`,
  },

  gothbot_goth_male_closeup_eyes: {
    format: 'simple',
    theme: `MALE GOTHIC EYES — for dark-aristocrat goth-male-closeup, eyes are HERO of the frame. Each entry 15-30 words. PREDATORY-PIERCING gaze.\n\n⚠️ Eyes should GLOW supernatural, radiate light. The gaze CUTS. Each entry: color + character + how it catches light.\n\n✓ ALLOWED colors: crimson / blood-ruby / violet / amethyst / deep-plum / golden / amber / honey / pale-jade / emerald / forest-green / pale-silver / mercury / obsidian-black / ice-blue / sapphire / cobalt / wine-dark / sulphur-yellow / mismatched (heterochromia) / opal / pearl-white`,
    touchpoints: [
      'crimson eyes glowing softly from within, pupils dilated to almost-black in candlelight, lashes thick and dark, predator-still',
      'amethyst eyes deep-violet with a star-shimmer at the iris, glowing faintly even in deep shadow, the gaze cutting',
      'golden eyes molten and slit-pupiled, glowing warm-amber from within, predator-glow, lashes dark',
      'pale-silver eyes that seem to reflect more light than they receive, ghost-luminous, pupils tiny, knife-edge gaze',
      'obsidian-black eyes deep and lightless, the pupil indistinguishable from the iris, two abysses',
      'sapphire-cobalt eyes glowing icy-blue from within, lashes long and dark, predator-stare, the gaze of an old wolf',
      'wine-dark eyes the color of deep merlot with gold flecks, glowing softly in candlelight',
      "sulphur-yellow eyes glowing pale-citrine, slit-pupiled, wolf's-eyes in a man's face",
      'mismatched eyes: one crimson, one violet, heterochromia making him look hexed from birth',
      'opal eyes shimmering in rainbow-violets, blues, pinks, mother-of-pearl in candlelight',
      'pearl-white eyes whiteless and pupil-less, the eyes of an oracle, glowing soft moonlight',
      'pale-jade eyes glowing soft emerald, lashes thick and dark, predator-stare',
      'emerald-green eyes deep and rich, glowing faintly green from within, pupils dilated',
      'honey-amber eyes molten in candlelight, slit-pupiled, the gaze of an old cat',
      'ice-blue eyes pale and cold, glowing icy-violet from within in deep shadow',
      'mercury eyes liquid silver that catch every flicker of candlelight, almost reflective, the gaze unsettling',
      "ruby-red eyes glowing softly crimson, lashes thick and dark, the eyes of a vampire who's just fed",
      'forest-green eyes deep-jade with gold flecks, glowing faintly in firelight, lashes wild',
      'mismatched eyes: one obsidian-black, one pale-silver, the gaze unsettling and asymmetric',
      'deep-plum eyes the color of overripe fruit, glowing soft-violet, lashes long and dark',
      'amber-gold eyes glowing molten-warm, predator-shape, lashes thick',
      'pale-violet eyes glowing softly lavender, the iris star-patterned with deeper violet',
      'cobalt-deep eyes glowing rich-blue from within, lashes long and dark, the gaze cold and lethal',
      'silver-grey eyes that catch every flicker of candlelight, glowing pale-platinum, predator-stare',
      'crimson eyes the color of fresh blood, glowing warm from within, lashes thick',
      'sulphur-amber eyes slit-pupiled, glowing pale-yellow, the gaze of an old wolf',
      'opal-iridescent eyes shimmering pink-and-violet, dark lashes, the gaze otherworldly',
      'wine-and-gold eyes (heterochromia), one merlot, one molten-honey, the gaze hexed',
      'pearl-and-obsidian eyes (heterochromia), one milky-pale, one lightless-black, the gaze asymmetric',
      'pale-emerald eyes glowing faintly green, dark lashes, the iris fractured in patterns like crackled glass',
    ],
    instructions: `Each entry is ONE eye description, 15-30 words. PREDATORY-PIERCING masculine. SUPERNATURAL glowing. Output as a NUMBERED list (1. ... 2. ... 3. ...), one entry per line.`,
  },

  gothbot_goth_male_closeup_hair_color: {
    format: 'simple',
    theme: `MALE GOTHIC HAIR COLOR — for dark-aristocrat goth-male-closeup. Each entry 10-25 words. ONE color description + character.\n\n✓ ALLOWED: raven-black / blue-black / oxblood-streak / silver-platinum / moon-silvered / ash-grey / charcoal-streak / midnight-blue / deep-plum / inkwell-black / bone-white / pale-silver-with-dark-roots / shadow-grey / dragon-emerald / dark-burgundy-streak / iron-grey`,
    touchpoints: [
      'raven-black, so dark it absorbs light, with faint blue-iridescent highlights in candlelight',
      'inkwell-black, deep and rich, with single streak of bone-white at one temple',
      'silver-platinum, so pale it reads white in candlelight, with charcoal-shadow at the crown',
      'moon-silvered — pale-grey-violet with cool undertones, almost ghostly',
      'midnight-blue — black with rich blue undertones, almost peacock in candlelight',
      'iron-grey with darker shadow at the roots, weathered and severe',
      'shadow-grey — deep charcoal with silver-tipped strands at the temples, weathered',
      'bone-white — pure white with platinum sheen, the hair of an ancient warrior-mage',
      'oxblood-and-black streaked, dark and rich, with hints of crimson in firelight',
      'dark-burgundy streak in raven-black, asymmetric drama',
      'ash-grey with violet undertones, ghost-cool',
      'charcoal-grey-and-silver streaked, the hair of a warlock grown old',
      'blue-black, almost peacock-iridescent in candlelight, deep and rich',
      'deep-plum, the color of crushed grape, with darker indigo at the ends',
      'raven-black with single streak of crimson at the side',
      'silver-mercury — liquid-silver, catches every candle-flicker, ghost-cool',
      'deep-violet-and-ash silvered-tipped, contrast of dark roots and pale ends',
      'midnight-blue with deep-violet undertones, peacock-rich',
      'iron-grey with single dark streak at the temple',
      'platinum-blonde with deep-burgundy under-layer hidden until he moves',
      'cool-ash-grey with single violet streak at the temple',
      'pale-bone-blonde with the faintest violet undertone in candlelight',
      'deep-merlot-burgundy with darker roots, rich and warm',
      'raven-black undercut with longer top, severe contrast',
      'oxblood-dark cropped short, with the faintest crimson highlights catching firelight',
      'shadow-grey with silver-streak at one temple, weathered and severe',
      'dragon-emerald — deep-green with iridescent peacock-violet shimmer (rare archetype only)',
      'silver-platinum with charcoal-tip, almost ombre, dark roots warming to pale',
      'inkwell-black with the faintest silver-thread strands at his temples (age)',
      'deep-charcoal with bone-white streak running from his temple down one side',
    ],
    instructions: `Each entry is ONE hair color description, 10-25 words. Gothic-masculine. Output as a NUMBERED list (1. ... 2. ... 3. ...), one entry per line.`,
  },

  gothbot_goth_male_closeup_hairstyle: {
    format: 'simple',
    theme: `MALE GOTHIC HAIRSTYLE — for dark-aristocrat goth-male-closeup. Each entry 15-30 words. Masculine, NEVER salon-perfect.\n\n⚠️ Each entry describes the SHAPE and BEHAVIOR — how it falls, what it's tangled with, what it's doing in the candid moment.\n\n✓ ALLOWED: short-cropped / pulled-back-leather-tie / undercut / wild-loose / wind-blown / wet-from-rain / long-flowing / shaved-sides / messy-medium / shoulder-length-wavy / queue-braid / half-undone-queue / regency-tied-back`,
    touchpoints: [
      'short-cropped on the sides with longer dark on top, swept back with one rebellious strand falling across his brow',
      'pulled severely back with a leather tie at his nape, single escaped strand framing his cheekbone',
      'undercut sharp on the sides with dark longer top, brushed back, severe and modern-gothic',
      'wild and loose, falling past his shoulders in dark waves, a single rebellious strand cutting across one eye',
      'wind-blown wildly across his face, partially obscuring one eye, the rest streaming behind',
      'wet from rain, dark strands plastered to his temples and cheek, catching candlelight in silver-flecks',
      'long single queue down his back tied with black-silk ribbon, severe and traditional',
      'half-undone queue, the ribbon loosened, strands escaping to frame his face',
      'shoulder-length dark waves, slightly tousled, one strand across his cheekbone',
      'shaved sides with longer dark top brushed back, undercut-modern-gothic',
      'messy medium-length dark hair, slightly tousled, candlelight catching the high strands',
      'long flowing dark hair falling past his shoulders, blown back by an unseen wind',
      'short and severely cropped, almost-shaved at the sides, weathered military',
      'wet-from-bath dark strands clinging to his shoulders, candlelight catching the water',
      'sleek raven-black hair pulled back into a low knot at his nape, severe Victorian',
      'wild bedhead chaos, dark waves tangled and dramatic, no styling',
      'short-shaggy dark layers framing his sharp cheekbones, calculated-undone',
      'long Pre-Raphaelite dark waves cascading past his shoulders, slightly damp',
      'pulled back severely with twin braids at his temples (Norse-warrior coded), the rest loose',
      'cropped short and slicked back with oil, severe Victorian-aristocrat',
      'long dark strands half-pulled-up with a tarnished-silver clasp, the rest cascading',
      'tousled medium-length dark hair, slightly damp from sweat or rain, candlelight catching the wet',
      'severely cropped on the sides with a high dark top, Wallachian-noble coded',
      'long single thick braid down his back wound with crimson silk, the silk catching candlelight',
      'shaggy-cropped dark hair with deliberate bangs falling across his brow',
      'shoulder-length dark hair pulled back behind his ears, one ear visible with earring',
      'half-shaved on one side, dark longer hair falling over the opposite shoulder',
      "wind-tossed dark hair as if he's been running, candlelight catching the chaos",
      "cropped close with dramatic widow's-peak hairline, severe and gothic",
      'long Victorian-noble waves cascading past his shoulders, threaded with a single silver clasp',
    ],
    instructions: `Each entry is ONE hairstyle description, 15-30 words. Masculine / candid — NEVER salon-perfect. Output as a NUMBERED list (1. ... 2. ... 3. ...), one entry per line.`,
  },

  gothbot_goth_male_closeup_face_detail: {
    format: 'simple',
    theme: `MALE GOTHIC FACE DETAIL — weathered + masculine + deadly features. Each entry 15-30 words.\n\n⚠️ NOT makeup. Face details: stubble / scars / sleepless dark-circles / kohl-rim (sparse, masculine) / dirt-streaks / facial-hair / weathered features / blood-streaks (slight).\n\n⚠️ Predator + sleepless aristocrat look mandatory. NEVER clean / well-rested / makeup-clean.\n\n✓ ALLOWED: light-stubble / dark-stubble / faint-scar across cheek / sharp scar through eyebrow / sleepless dark-circles / faint kohl-rim / weathered crow's-feet / faint blood-streak at temple / single drop crimson at corner of mouth / weathered scowl-lines / battle-scars / faint dirt-streaks at jaw`,
    touchpoints: [
      'sharp masculine cheekbones with deep shadow beneath, faint dark-stubble along his jaw, sleepless dark-circles under his eyes',
      'faint scar tracing across his left cheekbone, silver-thin with age, dark-stubble along his jaw, predator-still gaze',
      'sleepless half-circles of dark shadow beneath his eyes (vampire-pallor), light dark-stubble, clean-shaven cheekbones',
      'sharp scar slicing through his right eyebrow with a thin pale line, dark-stubble along his jaw, weathered scowl-lines at his eyes',
      'faint kohl-rim under his eyes (Castlevania-vampire-coded), sleepless dark-circles, sharp jawline with light stubble',
      "weathered crow's-feet at his eyes from centuries of watching, light dark-stubble, sleepless purple-violet half-circles beneath",
      'faint single blood-streak at his temple (just-fed or just-fought), dark-stubble, sharp masculine cheekbones',
      'masculine clean-shaven sharp jawline with hollow cheeks, sleepless dark-circles, faint kohl-rim',
      'weathered scowl-lines between his dark brows, light beard along his jaw, sleepless violet-undertones beneath his eyes',
      'sharp battle-scars: a faint silver line at his throat, another tracing his left jaw, light dark-stubble, predator stillness',
      'thick dark stubble along his jaw and upper lip, sharp masculine cheekbones, sleepless dark-circles beneath his eyes',
      'faint kohl-rim sleepless dark-circles pulled into half-moons beneath his eyes (Bloodborne-vampire coded), clean-shaven',
      'weathered Wallachian-warrior face: sharp masculine cheekbones, light dark-stubble, single faint scar at his temple',
      'sleepless violet-undertone half-circles beneath his eyes, light stubble, hollow-cheeked predator gaze',
      'faint single drop of crimson at the corner of his mouth (just-fed), light dark-stubble, sleepless dark-circles',
      'sharp masculine jaw with light scruffy beard, single silver-thin scar through his upper lip, sleepless dark gaze',
      'severe weathered features: sharp masculine cheekbones, light dark-stubble, sleepless violet-purple half-circles',
      'centuries-old kohl-rim sleepless dark-circles pulled into half-moons, faint stubble, hollow-cheeked aristocrat',
      'masculine sharp jaw with full short beard, weathered scowl-lines, sleepless half-circles beneath his eyes',
      'faint dirt-streaks across his cheekbone, sharp masculine jaw with light stubble, sleepless dark gaze',
      'clean-shaven sharp jawline, sleepless violet-undertone half-circles, single faint scar through his right eyebrow',
      'weathered Wallachian-noble features: sharp masculine cheekbones, light dark-stubble, sleepless purple-undertones',
      'severe Victorian face with sharp masculine cheekbones, faint kohl-rim under his eyes, clean-shaven, sleepless circles',
      'masculine hollow-cheeked face with light dark-stubble, faint silver scar across his jaw, sleepless gaze',
      'sharp battle-scarred features: a faint thin scar at his left cheek, another at his throat, light stubble, sleepless eyes',
    ],
    instructions: `Each entry is ONE face-detail description, 15-30 words. Masculine + weathered + deadly. NEVER makeup-clean. Output as a NUMBERED list (1. ... 2. ... 3. ...), one entry per line.`,
  },

  gothbot_goth_male_closeup_wardrobe: {
    format: 'simple',
    theme: `MALE GOTHIC WARDROBE — visible at FRAME EDGE in goth-male-closeup (neckline / shoulder / collar). Each entry 15-30 words. Visible in tight closeup — only the top of the garment matters.\n\n⚠️ Gothic-aristocratic male wardrobe. NSFW-clean (clothed neckline only, no bare-chest emphasis). High-collared / military / armor-detail / brocade.\n\n✓ ALLOWED: high-collar Victorian coat / vampire-lord cloak / brocade jacket / gothic-armor pauldron / black-leather harness / velvet-collar long-coat / military-coat with epaulettes / gothic-armor breastplate / wrought-iron pauldron / silk-cravat at throat / fur-trim stole / leather-and-velvet jerkin / Wallachian-noble coat / dark monk-robe / dark cardinal-robe / Witcher-medallion-chain`,
    touchpoints: [
      'high-collar deep-burgundy velvet coat fitted up to his jaw, gold-thread embroidery at the throat',
      'vampire-lord black-velvet cloak with deep-crimson silk lining visible at his collar',
      'brocade jacket of deep-violet and gold-thread, the collar standing high, intricate ornament',
      'gothic-armor pauldron visible at his shoulder, bronze-and-iron with carved-relief skulls',
      'black-leather harness over a high-collared dark-silk shirt, bronze-buckle details',
      'velvet-collar long-coat of inkwell-black, gold-thread frog-closures at the chest',
      'military-coat with epaulettes of tarnished-silver, high-collar fitted, gothic-aristocrat',
      'wrought-iron gothic-armor breastplate visible at his shoulder, deep-burgundy silk shirt beneath',
      'high-collared white-silk shirt beneath a fitted black-velvet jerkin with silver-thread embroidery',
      'silk-cravat at his throat in deep-burgundy with single jet-and-silver pin, black-velvet coat collar',
      'fur-trim stole of black-fox draped over his shoulders, the fur catching candlelight',
      'leather-and-velvet jerkin of deep-violet with brass-buckle details, fitted high-collar',
      'Wallachian-noble coat of deep-crimson velvet with gold-thread embroidery, high-collared',
      'dark monk-robe of inkwell-black with cowl pulled back, silver-and-amethyst pendant visible at throat',
      'dark-cardinal robe of deep-crimson silk with black-velvet trim, gold-cross visible at throat',
      'Witcher-medallion-chain at his throat with a wolf-medallion catching candlelight, dark leather collar',
      'wrought-iron pauldron with carved bat-wing finials, deep-burgundy silk shirt visible beneath',
      'high-collared deep-emerald silk coat with black-velvet trim, gold-thread vine embroidery',
      'gothic-noble doublet of inkwell-black with slashes showing deep-burgundy silk lining, high collar',
      'cropped black-velvet jacket with single raven-feather pinned at the lapel, fitted high-collar',
      'dark cloak with the hood pulled back, the deep-burgundy interior catching candlelight, gold-clasp at throat',
      'black-lace high-collar vampire-lord coat with the lace pattern of skulls-and-bones, intricate and dark',
      'fitted black-leather long-coat with bronze-buckle details and a black-silk collar standing high',
      'gothic-baroque officer-coat of dark-burgundy with gold-braid at the shoulders, high mandarin-collar',
      'leather-and-iron warlock-harness with rune-engraved bronze plates at his shoulder, dark shirt beneath',
      'sleek black-silk shirt with intricate dark-lace overlay at the collar and high neck (slim, not bulky)',
      'fitted oxblood-velvet doublet with gold-thread embroidered phoenix at the chest, high collar',
      'deep-violet brocade jacket with silver-thread embroidery and a single jet brooch at the throat',
      'fitted black-leather harness over a high-collared white-silk shirt, sharp contrast, gothic-noble',
      'sleek dark-silk hooded coat with a high-mandarin collar and intricate silver-thread occult-sigil embroidery',
    ],
    instructions: `Each entry is ONE wardrobe top-detail visible at frame edge, 15-30 words. Masculine gothic-aristocrat. NSFW-clean (clothed neckline). NO bare-chest emphasis. Output as a NUMBERED list (1. ... 2. ... 3. ...), one entry per line.`,
  },

  gothbot_goth_male_closeup_accessory: {
    format: 'simple',
    theme: `MALE GOTHIC SIGNATURE ACCESSORY — close-frame detail visible in goth-male-closeup. Each entry 10-25 words. Visible at collarbone / neckline / hand / ear / signet ring.\n\n✓ ALLOWED: signet-ring with crest / wolf-medallion at throat / raven-pin at lapel / blood-vial pendant / antique-brass-cross / amethyst-and-silver pendant / dragon-claw earring (single) / leather-cord with single fang / antique pocket-watch / obsidian dagger-handle visible / bronze-and-jet brooch / occult-sigil-pendant`,
    touchpoints: [
      'a heavy silver signet-ring on his left index finger, carved with a dragon-and-cross crest',
      'a wolf-medallion on a leather cord at his throat, dark-bronze with weathered details',
      'a raven-pin of tarnished-silver at his lapel, the bird carved in mid-flight',
      'a slim blood-vial pendant on a silver chain at his throat, dark-crimson liquid visible inside',
      'an antique-brass-cross hanging at his throat, weathered and tarnished, faint engraved sigils',
      'an amethyst-and-tarnished-silver pendant resting in the hollow of his throat',
      'a single dragon-claw earring of bronze-and-bone in his left ear, the other ear bare',
      'a leather cord at his throat with a single black-fang (wolf or vampire) hanging at the hollow',
      'an antique-bronze pocket-watch on a long-chain at his bodice, the chain crossing his chest',
      'an obsidian dagger-handle visible at his belt-line at frame edge, carved with rune-marks',
      'a bronze-and-jet brooch at his shoulder pinning a velvet cloak, intricate gothic-baroque',
      'an occult-sigil-pendant of bronze hanging at his collarbone, the sigil glowing faint amber',
      'a single skull-ring on his middle finger of tarnished-silver, the skull intricately carved',
      'a Castlevania-coded crucifix at his throat — silver with deep-engraved Latin words',
      'a Witcher-coded school medallion at his throat — wolf / cat / griffin / viper carved bronze',
      'a single black-velvet ribbon at his throat with a small jet-bead hanging at the hollow',
      'a single faint scar at his throat marking where a stake once almost killed him',
      'a small leather-strap pendant at his throat with a single tarnished-silver coin',
      'a coin-of-charon pendant at his throat, dark-bronze with Greek-coded engraving',
      'a heavy gold-and-onyx Wallachian noble-ring on his thumb, the stone catching candlelight',
      'an obsidian-cabochon ring on his middle finger, the stone catching candlelight in soft glints',
      'a serpent-twined silver ring at his thumb visible if his hand is at his face',
      'a single dragon-scale earring (single, dangling) iridescent in candlelight, the other ear bare',
      'an intricate silver-chain through his lapel-buttonhole holding a single jet-bead',
      'a tarnished-silver crucifix-and-rosary hanging at his hip visible at frame edge',
      'a small antique pocket-watch on a chain in his palm at face-level, the chain dripping down',
      'a bronze-and-amber pendant carved like a moth-skull, hanging at his sternum',
      'an antique iron-bound book-locket pendant at his throat, intricate occult diagrams etched in',
      'a single jet earring in his left ear, droplet-shaped, the other ear bare',
      'a wedding-ring of weathered gold on his ring-finger (the bride is centuries-dead)',
    ],
    instructions: `Each entry is ONE accessory close-frame detail, 10-25 words. Gothic-masculine. NEVER modern jewelry. NEVER feminine. Output as a NUMBERED list (1. ... 2. ... 3. ...), one entry per line.`,
  },

  gothbot_goth_male_closeup_candid_moment: {
    format: 'simple',
    theme: `CANDID MOMENT — what he was caught doing in the goth-male-closeup loaded-moment. Each entry 20-40 words.\n\n⚠️ A LOADED moment — predatory / mysterious / dangerous / secretive / lethal. Caught mid-action, not posed.\n\n⚠️ NSFW-clean. Dark-aristocrat / dangerous / mysterious vibes only.\n\n✓ ALLOWED: weighing-a-dagger / sharpening-a-blade / lighting-a-candle-with-fingertip / sipping-wine / kissing-a-pendant / reading-a-letter / smiling-in-the-dark / wiping-a-streak / pouring-poison / catching-his-reflection / casting-a-sigil / drawing-a-rune / examining-his-own-hand / cleaning-blood-from-blade`,
    touchpoints: [
      'weighing a single obsidian dagger against his palm, considering its balance, eyes flicking up to meet the camera',
      'sharpening a thin black blade against a whetstone at frame edge, the metal whispering, his gaze elsewhere',
      'lighting a tall candle with a fingertip-flame, the spell-flame jumping from his finger to the wick',
      'sipping slowly from a crystal goblet of dark wine, throat working as he swallows, eyes half-closed',
      'kissing a pendant pressed to his lips, eyes closed, the gesture intimate and old',
      'reading a folded parchment letter pressed close to his face, eyes scanning hungrily',
      'just blown out a candle, the smoke curling between his face and the camera, his eyes still on the flame',
      'smiling slowly in the dark, the smile not reaching his eyes, the threat of it palpable',
      'wiping a single faint streak of crimson from his mouth with the back of his hand, expression unreadable',
      'pouring a single drop of poison from a vial into a goblet (visible at frame edge), expression calm',
      'catching his own reflection in a black scrying-mirror, gaze having just turned away',
      'tracing an invisible sigil on his own throat with one finger, gaze locked on the camera',
      'drawing a rune on his own forearm with a fingertip of glowing-ink, expression focused',
      'examining his own hand turned palm-up before his face, considering a fresh wound or sigil',
      'cleaning blood from a thin black blade with a black-silk cloth, gaze elsewhere',
      'half-turned away as if just summoned by an unheard voice, eyes flicking back toward the camera',
      'humming a low half-remembered prayer-chant under his breath, his eyes far away',
      'tucking a knife back into a hidden sheath at his belt, gaze still on what he just stopped',
      'pressing a wax-seal to a folded parchment with the heel of his palm, expression focused',
      'just removed his hood — dark hair falling around his shoulders, fingers still at the cloth',
      'caught mid-prayer-chant in a dead language, lips moving, eyes glowing slightly with the words',
      'closing his eyes to remember something centuries old, the memory visible on his face',
      'tilting his head slightly with predator patience, watching something off-frame for a long moment',
      "pulling a single black-rose petal off the rose he's been holding, the petal drifting downward",
      'caught mid-whisper to an unseen confidant or familiar, leaning toward something off-frame',
      'wiping a small smear of crimson from the corner of his mouth (recent feed), unhurried',
      'parting his lips slightly as if about to speak a binding-word, eyes glowing with the gathered magic',
      'pressing a cold compress to his own throat (after something that nearly killed him), gaze defiant',
      'cracking his neck slowly from side to side, predator-relaxed, eyes locked on the camera',
      'just sheathed a thin black blade, the blade visible mid-slide into the sheath at his belt',
    ],
    instructions: `Each entry is ONE candid loaded-moment, 20-40 words. Mid-action, NEVER posed. NSFW-clean. Masculine deadly aristocrat. Output as a NUMBERED list (1. ... 2. ... 3. ...), one entry per line.`,
  },

  gothbot_goth_male_closeup_camera_perspective: {
    format: 'simple',
    theme: `CAMERA PERSPECTIVE for goth-male-closeup — the EXACT angle and framing of the closeup. Each entry 15-30 words.\n\n⚠️ Use diverse framing — never default to straight-on three-quarter. Each entry is ONE specific camera angle / frame.\n\n✓ ALLOWED: straight-on three-quarter / sharp side-profile / mirror-angle side-profile / over-the-shoulder / low-angle looking up / high-angle looking down / dutch-angle tilted / extreme close-up on eyes / extreme close-up on lips / through-the-hood / through-his-hand / from-below the throat / close bust-up / reflected in mirror / through his own hair / through stained-glass / framed-by-candles / over-his-blade`,
    touchpoints: [
      'straight-on three-quarter closeup, his eyes locked directly on the viewer, slight tilt of his head',
      'sharp side-profile closeup, his gaze off-frame, hair cascading down his cheekbone',
      'opposite side-profile closeup (mirror angle), jawline in hard shadow, eye barely visible',
      'over-the-shoulder from behind — he is glancing back at the viewer with a knife-edge smirk',
      'low-angle closeup looking UP at his face — he towers, predator, looking down',
      'high-angle closeup looking DOWN at him — he tilts his face up toward the viewer, defiant',
      'dutch-angle tilted closeup, composition off-kilter, his gaze unsettling and asymmetric',
      'extreme close-up — just his eyes and upper cheek, lashes and pupil filling the frame',
      'extreme close-up — lips and chin, dark mouth slightly parted, throat visible below',
      'through-the-hood closeup — the cowl of his cloak parted, only the lower half of his face visible',
      'through-his-hand closeup — his fingers partially obscuring his face, one eye peering between',
      'from-below looking up his throat — chin raised, eyes half-closed',
      'close bust-up three-quarter — shoulder turned toward viewer, head swiveled back at the camera',
      'extreme close-up reflected in a polished dagger blade he holds at frame edge',
      'closeup through strands of his own dark hair, face partially hidden, one glowing eye visible',
      'closeup through a stained-glass window pane, his face fractured by the colored glass between us and him',
      'closeup framed-by-candles — two candle-flames flanking his face in the foreground, soft warm-glow',
      'closeup framed-by-an-iron-grille — bars across the frame, his face visible between them',
      'rim-lit silhouette closeup — his face in deep shadow with only edge-light tracing his profile',
      'close-tight on his face with a single drop of dark rain rolling down one cheek',
      'extreme close on his hand at his face — his own fingers covering his mouth, one eye above',
      'over-the-collar closeup — looking past the high coat-collar at his face above',
      'extreme close-up on his ear with the dangling earring catching candlelight',
      'closeup with the camera level at his collarbone looking up toward his face — predator angle',
      'closeup from behind a partly-open door — vertical sliver of frame, his face visible in the opening',
      'closeup over his blade — a thin black dagger in the foreground out-of-focus, his face beyond in sharp focus',
      'sharp closeup from his left, half his face in deep-violet shadow, half in warm-amber candlelight',
      'closeup framed by twin pillars of incense smoke rising on either side of his face',
      'closeup with him in the foreground out-of-focus and a candle in deep-focus behind — depth play',
      'closeup with him gazing through a window at frame edge, half his face in moonlight, half in shadow',
    ],
    instructions: `Each entry is ONE specific camera perspective, 15-30 words. Diverse angles. Output as a NUMBERED list (1. ... 2. ... 3. ...), one entry per line.`,
  },

  // ─── GOTHBOT goth-closeup path (2026-05-15 migration).
  // FEMALE-LOCKED dark-seductress closeups. Tight frame, candid moment,
  // sexy/sultry/evil/feisty. NSFW-clean. Solo. 10 path-bespoke axes.
  // ──────────────────────────────────────────────────────────────────

  gothbot_goth_closeup_archetype: {
    format: 'simple',
    theme: `GOTHIC FEMALE ARCHETYPES — core identity for dark-seductress goth-closeup. Each entry 15-30 words. Castlevania / Crimson-Peak / Bloodborne / Devil-May-Cry dark-beauty lineage.\n\n⚠️ Each entry is ONE archetype with a 1-2 sentence essence that informs her ENERGY (predatory / mysterious / dangerous / regal / mournful / vengeful / etc.).\n\n⚠️ STRICTLY GOTHIC FANTASY archetypes — never real-world ethnic codes.\n\n✓ ALLOWED: vampiress / dark queen / dark sorceress / dark priestess / witch / enchantress / dark fae queen / banshee / succubus / dark goddess / undead duchess / dark druidess / shadow assassin / dark mystic / nightmare-bride / dark oracle / dark valkyrie / dark countess / death-cult-priestess / dark muse / dark seraph / nightshade-witch / blood-sorceress / corrupted-angel\n\n🚫 NO real-world historical / ethnic figures. NO modern. NO sci-fi.`,
    touchpoints: [
      'ANCIENT VAMPIRESS — centuries-old aristocratic predator, blood-debt-keeper, knows everyone in this room is already hers',
      'DARK QUEEN — fallen-empire monarch in deep mourning, crown still cold on her brow, ruling from her tomb-throne',
      'DARK SORCERESS — practitioner of forbidden spell-craft, ink-stained fingers, eyes that have seen the void',
      'DARK PRIESTESS — high priestess of a cult-of-shadows, blood-sacrament on her hands, devotion to the night',
      'NIGHTSHADE WITCH — wild-haired hedge witch who lives in the haunted-wood, poisons in her satchel, eyes like a wolf',
      'ENCHANTRESS OF SHADOW — silver-tongued seductress whose every word binds, smile like a knife',
      'DARK FAE QUEEN — fae-court ruler in deepest velvets, bargain-keeper, beautiful trickster',
      'BANSHEE — wailing-woman of the dead-marshes, hair like rain, voice like grief, eyes hollowed',
      'SUCCUBUS — dream-walker who steals breath while you sleep, perfume of orchid and ash',
      'DARK GODDESS — minor death-goddess walking among mortals, bored and watchful',
      'UNDEAD DUCHESS — Victorian aristocrat caught in her own death, still elegant, still hungry',
      'DARK DRUIDESS — green-witch of the corrupted-grove, wears antlers and lichens, beloved of crows',
      'SHADOW ASSASSIN — silent killer with the patience of stone, blade always within reach',
      'DARK MYSTIC — scrying-witch who reads futures in blood, never speaks her own',
      'NIGHTMARE BRIDE — left at the altar a century ago and never forgave, the rage cooled to ice',
      'DARK ORACLE — possessed seer who speaks with multiple voices, eyes white as moons',
      'DARK VALKYRIE — chooser-of-the-slain wandered far from the war, wears trophies as jewelry',
      'DARK COUNTESS — Wallachian noblewoman, family name older than the kingdom, secret rooms in her castle',
      'BLOOD SORCERESS — practitioner of crimson-magick, scarlet-eyed, calligraphy-scars on her arms',
      'NIGHTMARE DUCHESS — aristocrat of fear, walks the dreams of the living, her court is sleep',
      'CORRUPTED ANGEL — fallen-celestial who never repented, broken wings hidden beneath her cloak',
      'DEATH-CULT MATRIARCH — leader of a death-worshipping coven, marked with ritual scars she chose',
      'DARK SERAPH — six-winged shadow-celestial, eyes mismatched, voice doubled',
      'GHOST BRIDE — drowned-on-her-wedding-day, still in her tattered silk gown, still cold-mouthed',
      'OBSIDIAN WITCH — dragon-blooded sorceress in deep-violet robes, can break stone with a glance',
      'PLAGUE-PRIESTESS — devotee of pestilence, gives plague as blessing, raven-mask hangs at her belt',
      "RAVENSEEKER — witch who keeps a court of ravens, knows every dead man's name within a hundred miles",
      'TEMPLE-CHOICE MAIDEN — bride of an old dark god, lifetime-bound, eyes glow when he speaks through her',
      'DARK MUSE — terrible inspiration to mad poets, lover of artists who go mad for love of her',
      'NIGHT-MARKET MERCHANT — sells forbidden things in a stall at midnight, her smile cuts the air',
    ],
    instructions: `Each entry is ONE gothic female archetype, 15-30 words. STRICTLY gothic-fantasy. NEVER real-world ethnic. Output as a NUMBERED list (1. ... 2. ... 3. ...), one entry per line.`,
  },

  gothbot_goth_closeup_skin: {
    format: 'simple',
    theme: `GOTHIC FEMALE SKIN — descriptions for dark-seductress goth-closeup, what light does to her skin in tight frame. Each entry 15-30 words.\n\n⚠️ Diverse range of skin tones (porcelain / olive / dusk-bronze / mahogany / ebony) but ALL with gothic-corrupted-beauty character — never modern beauty-magazine. Describe HOW LIGHT INTERACTS, not just the color.\n\n✓ ALLOWED: pale-marble / porcelain / parchment-pale / dusk-olive / honey-bronze / amber / mahogany / sepia / deep-ebony / dusk-violet-undertone / corpse-pale / moon-silvered / freckled / scar-marked`,
    touchpoints: [
      'porcelain-pale skin with cool blue-violet undertones in shadow, candlelight pooling warm-amber at the cheekbones and collarbones',
      'corpse-pale skin so white it seems to glow, faint blue veins visible at the temples, moonlight rendering her almost translucent',
      'dusk-olive skin with rich warm undertones, candlelight catching at her cheekbones and the line of her jaw in gold',
      'mahogany skin warm and deep, candlelight rendering her in burnished bronze and shadow, cheekbones sculpted by the dark',
      'pale-marble skin with cool gray-violet shadow, two centuries old and still smooth — predator skin that does not age',
      'parchment-pale skin with the faintest scatter of freckles across the bridge of her nose, candlelight warming her cheek',
      'honey-bronze skin with warm-gold candlelight catching her cheekbones, shadow pooling in violet beneath her jawline',
      'ebony skin rich and deep, candlelight catching the high planes of her face in soft warm-amber, shadows in cool indigo',
      'sepia-amber skin warm in candlelight, the deeper hollows of her face in plum-shadow, predatory cheekbone-shadow',
      'moon-silvered pale skin with cool-blue-undertones, candlelight unable to fully warm her, ghostly pallor',
      'dusk-violet-undertone skin in deepest shadow, candlelight catching gold at her cheekbone and the bridge of her nose',
      'pale-rose skin in candlelight with the faintest flush at her cheekbones, shadow pooling cool-blue at her throat',
      'deep-bronze skin glowing warm in firelight, the texture of carved hardwood at the cheekbone, predator-shadow',
      'porcelain skin with the faintest scar tracing from her cheekbone to her jaw, candlelight catching the silver of the old wound',
      'parchment-pale skin with the faintest map of pale freckles across her cheeks and shoulders, candlelight gold-warm',
      'pale-amber skin with rose-gold undertones in candlelight, the deeper shadows in deep-violet, vampire-warm',
      'dusky-olive skin with deep warm tones, candlelight catching at the bridge of her nose and the line of her clavicle',
      'corpse-pale skin with the faintest violet flush at her cheekbones (recently fed), candlelight unable to truly warm her',
      'rich-cocoa skin with warm-amber highlights at the cheekbones, shadow in cool-plum at the jaw, predator-cheekbones',
      'pale-ivory skin with the faintest amber undertone in candlelight, shadow in deep-violet beneath her jaw',
      'sun-deprived pale skin so cool it reads silver, candlelight rendering her almost statuesque',
      'olive skin with golden warm undertones, candlelight catching at her cheekbones and the upper curve of her shoulder',
      'pale-marble skin with the faintest blue undertones at her temples (centuries-old vein-glow), candlelight unable to fully warm',
      'mahogany skin deep and warm, candlelight catching the polished hardwood of her cheekbones, predator-shadows in burnt-umber',
      'parchment-pale skin with a single scar at her throat (where someone tried), candlelight rendering it silvered',
      'pale-ivory skin marked with a small constellation of pale-violet birthmarks at her collarbone, candlelight gold',
      'dusk-bronze skin with rich warm tones, candlelight catching at her cheekbones in warm-gold, shadow in cool-violet',
      'porcelain-pale skin in candlelight with the faintest cool-violet undertone, predator skin that does not flush',
      'amber-rose skin with warm undertones, candlelight catching the high places of her face in gold, plum-shadow beneath',
      'corpse-pale skin so cool it reads in moonlight-blue even in warm candlelight, ghostly and inhuman',
    ],
    instructions: `Each entry is ONE skin description with light interaction, 15-30 words. Diverse tones. Gothic-corrupted-beauty. NO modern beauty-magazine. Output as a NUMBERED list (1. ... 2. ... 3. ...), one entry per line.`,
  },

  gothbot_goth_closeup_eyes: {
    format: 'simple',
    theme: `GOTHIC FEMALE EYES — for dark-seductress goth-closeup, the eyes are HERO of the frame. Each entry 15-30 words.\n\n⚠️ Eyes should GLOW supernatural, radiate light, the iris a universe. Each entry: color + character + how it catches light.\n\n✓ ALLOWED colors: crimson / blood-ruby / violet / amethyst / deep-plum / golden / amber / honey / pale-jade / emerald / forest-green / pale-silver / mercury / obsidian-black / ice-blue / sapphire / cobalt / wine-dark / sulphur-yellow / mismatched (heterochromia) / opal / pearl-white`,
    touchpoints: [
      'crimson eyes glowing softly from within, pupils dilated to almost-black in candlelight, lashes thick and dark',
      'amethyst eyes deep-violet with a star-shimmer at the iris, glowing faintly even in deep shadow',
      'golden eyes molten and slit-pupiled, glowing warm-amber from within, predator-glow',
      'pale-silver eyes that seem to reflect more light than they receive, ghost-luminous, pupils tiny',
      'obsidian-black eyes deep and lightless, the pupil indistinguishable from the iris, two abysses',
      'sapphire-cobalt eyes glowing icy-blue from within, lashes long and dark, predator-stare',
      'wine-dark eyes the color of deep merlot with gold flecks, glowing softly in candlelight',
      "sulphur-yellow eyes glowing pale-citrine, slit-pupiled, wolf's-eyes in a woman's face",
      'mismatched eyes: one crimson, one violet, heterochromia making her look hexed from birth',
      'opal eyes shimmering in rainbow-violets, blues, pinks, mother-of-pearl in candlelight',
      'pearl-white eyes whiteless and pupil-less, the eyes of an oracle, glowing soft moonlight',
      'pale-jade eyes glowing soft emerald, lashes thick with dark mascara, predator-stare',
      'emerald-green eyes deep and rich, glowing faintly green from within, pupils dilated',
      'honey-amber eyes molten in candlelight, slit-pupiled, the gaze of an old cat',
      'ice-blue eyes pale and cold, glowing icy-violet from within in deep shadow',
      'mercury eyes liquid silver that catch every flicker of candlelight, almost reflective',
      "ruby-red eyes glowing softly crimson, lashes thick and dark, the eyes of a vampire who's just fed",
      'forest-green eyes deep-jade with gold flecks, glowing faintly in firelight, lashes wild',
      'mismatched eyes: one obsidian-black, one pale-silver, the gaze unsettling and asymmetric',
      'deep-plum eyes the color of overripe fruit, glowing soft-violet, lashes long and dark',
      'amber-gold eyes glowing molten-warm, predator-shape, lashes thick',
      'pale-violet eyes glowing softly lavender, the iris star-patterned with deeper violet',
      'cobalt-deep eyes glowing rich-blue from within, lashes long and dark, the gaze cold',
      'silver-grey eyes that catch every flicker of candlelight, glowing pale-platinum, predator-stare',
      'crimson eyes the color of fresh blood, glowing warm from within, lashes thick',
      'sulphur-amber eyes slit-pupiled, glowing pale-yellow, the gaze of an old wolf',
      'opal-iridescent eyes shimmering pink-and-violet, dark lashes, the gaze otherworldly',
      'wine-and-gold eyes (heterochromia), one merlot, one molten-honey, the gaze hexed',
      'pearl-and-obsidian eyes (heterochromia), one milky-pale, one lightless-black, the gaze asymmetric',
      'pale-emerald eyes glowing faintly green, dark lashes, the iris fractured in patterns like crackled glass',
    ],
    instructions: `Each entry is ONE eye description, 15-30 words. SUPERNATURAL glowing. NO ordinary eye colors without character. Output as a NUMBERED list (1. ... 2. ... 3. ...), one entry per line.`,
  },

  gothbot_goth_closeup_hair_color: {
    format: 'simple',
    theme: `GOTHIC FEMALE HAIR COLOR — for dark-seductress goth-closeup. Each entry 10-25 words. ONE color description + character.\n\n✓ ALLOWED: raven-black / blue-black / deep-violet / oxblood / blood-red / silver-platinum / moon-silvered / ash-grey / charcoal-streak / midnight-blue / deep-plum / amethyst / inkwell-black / bone-white / pale-rose / ash-blonde with dark roots / bruise-purple-streak / dragon-emerald / dark-burgundy-with-blonde-streak`,
    touchpoints: [
      'raven-black, so dark it absorbs light, with faint blue-iridescent highlights in candlelight',
      'deep-violet, the color of overripe plum, with darker shadow at the roots',
      'oxblood — deep wine-red, almost black at the roots, catches firelight in mahogany',
      'silver-platinum, so pale it reads white in candlelight, with charcoal-shadow at the crown',
      'moon-silvered — pale-grey-violet with cool undertones, almost ghostly',
      'inkwell-black with single streak of bone-white at one temple',
      'midnight-blue — black with rich blue undertones, almost peacock in candlelight',
      'deep-plum, the color of crushed grape, with darker indigo at the ends',
      'amethyst — pale-violet with cool undertones, dramatic when paired with dark roots',
      'bone-white — pure white with platinum sheen, the hair of a banshee',
      'pale-rose, the color of a tea-rose, with deeper burgundy at the underside',
      'ash-blonde with deep-burgundy dark-roots, edgy contrast',
      'bruise-purple-and-burgundy streaked, dark and rich, with hints of crimson in firelight',
      'dragon-emerald — deep-green with iridescent peacock-violet shimmer',
      'dark-burgundy with single blonde streak, asymmetric drama',
      'charcoal-grey-and-silver streaked, the hair of a witch grown old',
      'blue-black, almost peacock-iridescent in candlelight, deep and rich',
      'blood-red, deep crimson with darker shadow at the roots, vampire-coded',
      'ash-grey with violet undertones, ghost-cool',
      'pale-amethyst with shadow-roots, dreamlike violet',
      'inkwell-black with crimson under-layer, hidden until she moves',
      'silver-mercury — liquid-silver, catches every candle-flicker',
      'deep-violet-and-ash silvered-tipped, contrast of dark roots and pale ends',
      'oxblood-and-black ombre, dark at the roots warming to wine at the ends',
      'midnight-blue with deep-violet undertones, peacock-rich',
      'crimson-and-black streaked, dramatic vampire contrast',
      'platinum-blonde with deep-burgundy under-layer hidden until she moves',
      'cool-ash-grey with single violet streak at the temple',
      'pale-bone-blonde with the faintest violet undertone in candlelight',
      'deep-merlot-burgundy with darker roots, rich and warm',
    ],
    instructions: `Each entry is ONE hair color description, 10-25 words. Gothic-dramatic. NO ordinary colors without character. Output as a NUMBERED list (1. ... 2. ... 3. ...), one entry per line.`,
  },

  gothbot_goth_closeup_hairstyle: {
    format: 'simple',
    theme: `GOTHIC FEMALE HAIRSTYLE — for dark-seductress goth-closeup. Each entry 15-30 words. Wild, wind-caught, rain-damp, tangled — NEVER salon-perfect.\n\n⚠️ Each entry describes the SHAPE and BEHAVIOR of her hair — how it falls, what it's tangled with, what it's doing in the candid moment.\n\n✓ Diverse hairstyles: loose-wild / pinned-with-jet / cascading / braided-with-ribbons / cropped-shaggy / undone-from-formal / wind-blown / wet-from-rain / etc.`,
    touchpoints: [
      'loose and wild, falling past her shoulders in dark waves, a single rebellious strand cutting across one eye',
      'half-pinned with tarnished-silver hair-pins, the rest cascading down her back in disordered waves',
      'long and tangled, dark strands wound through with dead-rose petals and a single black ribbon',
      'pulled back severely with jet hair-combs but a few strands have escaped and frame her face',
      'cut short and shaggy, dark layers framing her sharp cheekbones, undone in a calculated way',
      'undone from a formal Victorian coiffure, half-collapsed in waves with hair-pins still tangled',
      'wind-blown wildly across her face, partially obscuring one eye, the rest streaming behind',
      'wet from rain, dark strands plastered to her temples and cheek, catching candlelight in silver-flecks',
      'cascading in slow waves down her shoulders, threaded through with a black-velvet ribbon, ends curling',
      'pinned in a high coil with a single dead-rose, escaped tendrils framing her face',
      'half-shaved on one side, the rest falling in dark waves over the opposite shoulder',
      'long single braid over her shoulder, threaded with silver-thread, ends loosely curling',
      'cropped close like a 1920s flapper but darker, sharp-cut sleek, with single fingerwave at the temple',
      'wild crown of curls, dark spirals catching candlelight, a single jet-pin holding back one side',
      'pulled into a severe high knot with a tarnished-silver tiara, escaped wisps at her temples',
      'long and straight, dark sheets falling past her shoulders, perfectly still — predator stillness',
      'twin braids wound around her crown like a coronet, threaded with silver-thread and dead-flowers',
      'undone bedhead chaos, dark waves tangled and beautiful, a velvet-ribbon hanging loose',
      'wet from a recent bath, dark strands clinging to her shoulders, candlelight catching the water',
      'cropped pixie with dramatic dark eyeliner-thick lash, sharp-angle bangs cutting across her brow',
      'long and loose, blown back as if by an unseen wind, framing her face in dynamic motion',
      'half-up in a Victorian coif with jet-and-pearl pins, the rest cascading in waves',
      'tangled with raven-feathers woven into the strands, dark and primal',
      'sweat-damp from heat or exertion, dark strands clinging at her temples, candlelight catching the wet',
      'falling forward over one shoulder in a single thick wave, the other shoulder bare',
      'short bob with sharp bangs cutting straight across her brow, severe and gothic',
      'long Pre-Raphaelite waves cascading past her hips, threaded with single dead-rose',
      "wild and slightly matted as if she's been running, dark strands flying, candlelight catching the chaos",
      'pulled severely back in a low knot with silver-thread, two escaped tendrils framing her cheekbones',
      'long single braid down her back wound with crimson-silk ribbon, the ribbon catching candlelight',
    ],
    instructions: `Each entry is ONE hairstyle description, 15-30 words. Wild / disordered / candid — NEVER salon-perfect. Output as a NUMBERED list (1. ... 2. ... 3. ...), one entry per line.`,
  },

  gothbot_goth_closeup_makeup: {
    format: 'simple',
    theme: `GOTHIC FEMALE MAKEUP — for dark-seductress goth-closeup. Each entry 15-30 words. BOLD and DRAMATIC dark glamour she CHOSE.\n\n⚠️ Sharp where it's sharp, smudged where it's smudged. Devastating intentional dark beauty. Describe the makeup as a CHOICE that defines her energy.\n\n✓ ALLOWED: smoky-eye / sharp-eyeliner / blood-red-lip / dark-burgundy-lip / black-lip / dark-plum-lip / glitter-eye / heavy-mascara / dramatic-brow / cut-crease / dark-blush / pencil-thin-brow / bare-skin-with-eye-only / dark-glitter / matte-black-lip / nude-with-smudged-eye`,
    touchpoints: [
      'sharp jet-black eyeliner extending into severe winged points, smudged smoky-shadow above, blood-red lip',
      'heavy smoky-eye in plum and charcoal with cut-crease detail, lips deep-burgundy and matte',
      'pencil-thin dark brows, gradient of charcoal-smoke on the lids, lips dark-wine and slightly parted',
      'matte-black lips, severe sharp eyeliner, no other makeup — pale-canvas face',
      'dark-glitter shimmer on the lids in violet-and-silver, dark-plum lips, mascara thick',
      'cut-crease smoky-eye in deep-emerald and jet, dark-glossy-burgundy lip',
      'sharp winged eyeliner with crimson-glitter accent at the outer corner, blood-red lip',
      'all eye no lip — heavy black smoke and gold-glitter on the lids, lips bare-blushed',
      'severe sharp-arched dark brows, no lid makeup, deep-oxblood matte lip',
      'cool-violet smoky-eye blending into pale-silver at the inner corners, dark-plum lip',
      'sharp graphic black eyeliner with a single crimson tear-drop liner below the eye, nude-glossy lip',
      'smoldering charcoal-and-violet smoky-eye smudged dramatically, glossy oxblood lip',
      'dark-burgundy smoke around the eyes, no lip color but a faint berry-stain, dramatic brows',
      'jet-black graphic eyeliner extended into sharp cat-flick, gold-glitter inner corner, deep-plum matte lip',
      'no eyeliner but heavy smudgy shadow in deep-charcoal, dark-burgundy gloss lip',
      'matte black lip, all-black smudgy shadow, dramatic dark-arched brows — full witch glamour',
      'pencil-thin arched brows, gold-glitter on the lids, deep-wine glossy lip',
      'sharp winged liner in deep-violet (not black), smoky-violet shadow, oxblood matte lip',
      'all dramatic eye — cut-crease in dark-emerald and bronze, no lip color, glowing-clean skin',
      'blood-red lip glossy and slightly smudged at the corner (recent feed), no other makeup',
      'sharp graphic black liner in geometric lines (not winged — angular), deep-plum matte lip',
      'glitter-fade dark-violet smoky-eye to silver-shimmer at the brow bone, deep-oxblood lip',
      'matte deep-burgundy lip, smudgy ash-grey shadow on the lids, severe dark brows',
      'severe almost-Victorian severity — no eye makeup, ghostly pale skin, dark deep-wine lip',
      'sharp winged eyeliner with two parallel lines (graphic-double-flick), deep-plum gloss lip',
      'smudgy crimson-and-charcoal shadow blended dramatically, glossy dark-cherry lip',
      'jet-black lid with gold-leaf flecks at the inner corner, matte black lip',
      'pencil-thin dark arched brows, no lid color, deep-oxblood lip slightly parted',
      'smoldering smudgy plum-and-jet shadow with graphic-liner, glossy-blood-red lip',
      'cool-violet wash on the lids fading to dark at the outer corner, deep-burgundy gloss lip',
    ],
    instructions: `Each entry is ONE makeup description, 15-30 words. BOLD intentional dark glamour. NEVER neutral / natural / minimal. Output as a NUMBERED list (1. ... 2. ... 3. ...), one entry per line.`,
  },

  gothbot_goth_closeup_wardrobe: {
    format: 'simple',
    theme: `GOTHIC FEMALE WARDROBE — visible at FRAME EDGE in goth-closeup (neckline / shoulder / collar). Each entry 15-30 words. Visible in tight closeup — only the top of the garment matters.\n\n⚠️ The wardrobe is gothic-elegant, sleek-not-cheesecake. NSFW-clean (no bare cleavage emphasis, no nipple visibility). High-collared / modestly-low / shoulder-detail. Sleek-gothic-elegant.\n\n✓ ALLOWED: high-lace-collar Victorian / black-velvet sleeveless gown with brocade trim / corset-with-modest-bodice / black-silk turtleneck / black-leather choker-collar / off-shoulder velvet / black-fur stole / brocade jacket / vampire-cape collar / mourning-veil descending over collar / dark cloak with hood / black-lace top-detail / metal-trim shoulder / etc.`,
    touchpoints: [
      'high-lace Victorian collar fitted up to her jaw, deep-burgundy velvet beneath, gold-thread embroidery at the seam',
      'sleek black-silk turtleneck visible at the throat, smooth and unbroken, the collar reaching her chin',
      'off-shoulder black-velvet gown with the shoulder bare, the velvet rich and undisturbed',
      'high-collared deep-violet silk gown with intricate jet-bead embroidery at the throat',
      'mourning-veil of black-lace draping over her collar and shoulders, partially obscuring the wardrobe beneath',
      'black-leather choker-collar fitted to her throat with a single hanging amethyst pendant',
      'corset-with-modest-bodice in oxblood satin and black-lace trim at the bust-line — visible just at frame edge',
      'sleeveless black-velvet gown with brocade trim at the neckline, deep-burgundy interior visible',
      'high-collared white-lace blouse beneath a fitted black-velvet jacket with silver-thread embroidery',
      'black-fur stole draped over her shoulders, the fur catching candlelight in soft sheen',
      'brocade jacket of deep-violet and gold-thread, the collar standing high, intricate ornament',
      'vampire-cape collar standing tall behind her head, the velvet a deep oxblood, gold-clasps at the throat',
      'metal-trim shoulder of a fitted gothic-armor gown, deep-bronze trim catching candlelight',
      'high-necked Victorian mourning gown with rows of jet beads from collar to bust-line',
      'sleek black-silk gown with a single shoulder-strap, the other shoulder bare and luminous',
      'gothic-leather harness over a high-collared silk blouse, the harness with bronze-buckle details',
      'fitted black-velvet bodice with intricate gold-embroidered phoenix at the chest, high collar',
      'deep-emerald silk gown with a corset-bodice, high-collared, the silk catching candlelight in sheen',
      'cropped black-velvet jacket with raven-feather collar, soft black feathers framing her throat',
      'dark cloak with the hood pulled back, the deep-burgundy interior catching candlelight, gold-clasp at throat',
      'black-lace high-collar Victorian gown with the lace pattern of skulls-and-roses, intricate and dark',
      'fitted black-leather corset with bronze-buckle details and a black-silk collar standing high',
      'sleeveless deep-plum velvet gown with silver-thread embroidered occult sigils at the neckline',
      'wrought-iron-clasp collar over a high-necked white-silk shirt and black-velvet vest',
      'gothic-cropped leather jacket with metal-stud details at the shoulder, fitted high-collar',
      'sleek black-silk gown with intricate dark-lace overlay at the bust-line and high neck',
      'fitted oxblood-velvet bodice with gold-thread embroidered roses at the neckline',
      'deep-violet brocade jacket with silver-thread embroidery and a single jet brooch at the throat',
      'fitted black-leather corset over a high-collared white-lace blouse, sharp contrast',
      'sleek black-silk gown with a high-mandarin collar and intricate silver-thread occult-sigil embroidery',
    ],
    instructions: `Each entry is ONE wardrobe top-detail visible at frame edge, 15-30 words. Sleek-gothic-elegant. NSFW-clean. NO bare cleavage. NO lingerie. Output as a NUMBERED list (1. ... 2. ... 3. ...), one entry per line.`,
  },

  gothbot_goth_closeup_accessory: {
    format: 'simple',
    theme: `GOTHIC FEMALE SIGNATURE ACCESSORY — close-frame detail visible in goth-closeup. Each entry 10-25 words. Visible at collarbone / neckline / hand / earring / hair.\n\n✓ ALLOWED: amethyst-and-silver pendant / jet-mourning-locket / antique-brass-cross / blood-ruby-choker / single tear-drop pearl earring / dramatic chandelier earring / raven-feather hair-pin / silver-skull-ring / occult-sigil-pendant / dead-rose-hair-pin / black-lace-glove visible / vintage-pearl-strand / single black-rose pinned at temple / etc.`,
    touchpoints: [
      'an amethyst-and-tarnished-silver pendant resting in the hollow of her throat, catching candlelight',
      'a jet-mourning-locket on a long silver-chain, visible at her collarbone with engraved Victorian-cross',
      'an antique-brass-cross hanging at her throat, weathered and tarnished, faint engraved sigils',
      'a blood-ruby-choker fitted to her throat with a single tear-drop ruby pendant glowing softly',
      'a single tear-drop pearl earring catching candlelight, the other ear bare',
      'a dramatic chandelier earring of cascading jet-and-silver, catching candlelight in flickers',
      'a raven-feather hair-pin tucked behind her ear, the feathers iridescent black-violet',
      'a silver-skull ring on her index finger, visible if she brings her hand to her face',
      'an occult-sigil-pendant of bronze hanging at her collarbone, the sigil glowing faint amber',
      'a dead-rose hair-pin tucked at her temple, the petals dark-burgundy and slightly wilted',
      'a single black-lace glove visible on the hand near her face, intricate pattern',
      'a vintage-pearl strand visible at her throat, the pearls cool-moonlight-silvered',
      'a single black-rose pinned at her temple, fresh and velvet-petaled, contrasting her pale skin',
      'an ornate brass-key hanging on a long-chain at her throat, the key intricate and old',
      'a deep-amethyst-set ring on her thumb visible if her hand is at her face',
      'a delicate filigreed silver-chain across her forehead, an amethyst at the center between her brows',
      'a wrought-iron-and-jet brooch at her shoulder pinning a velvet shawl, intricate Victorian',
      'a single drop of dried-crimson-resin necklace at her throat (carved like a tear), at the hollow',
      'a small pinned-raven-feather earring of glossy black with silver-thread accent',
      'a bronze-and-amber pendant carved like a moth, hanging at her sternum',
      'a faint scar at her throat marking where a chain used to be (the chain now around her wrist)',
      'a single dried-violet pressed-flower pinned at her temple by a silver hair-clip',
      'an antique pocket-watch on a long-chain visible at her bodice, the chain crossing her chest',
      'a black-velvet-ribbon choker with a single small jet-bead at the throat',
      'a faint smear of dark-burgundy lipstick at the corner of her mouth (slightly smudged)',
      'an obsidian-cabochon ring on her middle finger, the stone catching candlelight in soft glints',
      'a dragon-scale earring (single, dangling) iridescent in candlelight, the other ear bare',
      'an intricate silver-filigree hair-comb visible at one side of her head',
      'a small leather-strap pendant at her throat with a single tarnished-silver coin',
      'a coin-of-charon pendant (Greek-coded for Hades-ferry payment) at her throat, dark-bronze',
    ],
    instructions: `Each entry is ONE accessory close-frame detail, 10-25 words. Gothic + dark. NEVER modern jewelry. Output as a NUMBERED list (1. ... 2. ... 3. ...), one entry per line.`,
  },

  gothbot_goth_closeup_candid_moment: {
    format: 'simple',
    theme: `CANDID MOMENT — what she was caught doing in the goth-closeup loaded-moment. Each entry 20-40 words.\n\n⚠️ A LOADED moment — predatory / intimate / dangerous / secretive / vulnerable / vengeful. Caught mid-action, not posed.\n\n⚠️ NSFW-clean. No explicit sexual acts. Dark-romantic / dangerous / mysterious vibes only.\n\n✓ ALLOWED: licking-blood-from-fingertip / whispering-a-curse / blowing-out-a-candle / catching-her-reflection / removing-a-veil / unfastening-a-collar-clasp / weighing-a-vial / pouring-poison / reading-a-letter / smiling-in-the-dark / wiping-a-tear / drinking-from-a-goblet / kissing-a-pendant / studying-her-own-hand / etc.`,
    touchpoints: [
      'licking a single droplet of blood from her fingertip with sharp focus, eyes flicking up to meet the camera',
      'whispering a curse-syllable under her breath, lips parted, eyes glowing slightly with the spell',
      'just blown out a candle, the smoke curling between her face and the camera, her eyes still on the flame',
      'caught studying her own reflection in a black scrying-mirror, her gaze having just turned away',
      'removing a black-lace mourning-veil, the fabric still half-covering her brow, eyes piercing through',
      'unfastening the brass clasp at her gothic collar, fingers at her throat, gaze locked on something off-frame',
      'weighing a small crystal vial of glowing emerald liquid against her palm, gaze considering its weight',
      'pouring a single drop of poison from a vial into a goblet (visible at frame edge), expression calm',
      'reading a letter pressed close to her face, the parchment yellow with age, eyes scanning hungrily',
      'smiling slowly in the dark, the smile not reaching her eyes, the danger of it palpable',
      'wiping a single dark tear from beneath her eye with a black-lace handkerchief, defiant',
      'drinking from a crystal goblet (visible at frame edge), throat working as she swallows, eyes closed',
      'kissing a pendant pressed to her lips, eyes closed, the gesture intimate and old',
      'studying her own hand turned palm-up before her face, examining a fresh wound or sigil',
      'just removed a kiss from her lips with the back of her hand, expression unreadable',
      'half-turned away as if just summoned by an unheard voice, eyes flicking back toward the camera',
      'humming a low half-remembered lullaby under her breath, her eyes far away',
      'tucking a knife back into a hidden sheath at her belt, gaze still on what she just stopped',
      'pressing a wax-seal to a folded parchment with the heel of her palm, expression focused',
      'just unbraided her hair, the strands falling around her shoulders, fingers still threaded through',
      'caught mid-laugh — but the laugh has nothing to do with joy',
      'closing her eyes to remember something centuries old, the memory visible on her face',
      'sipping from a copper goblet, the liquid dark and steaming, her eyes half-closed in satisfaction',
      'tracing an invisible sigil on her own throat with one finger, her gaze locked on the camera',
      "pulling a single black-rose petal off the rose she's been holding, the petal drifting downward",
      'caught mid-whisper to an unseen confidant or familiar, leaning toward something off-frame',
      'wiping a small smear of crimson from the corner of her mouth (recent feed), unhurried',
      'parting her lips slightly as if about to speak a binding-word, eyes glowing with the gathered magic',
      'pressing a cold compress to her own throat (after something that nearly killed her), gaze defiant',
      'lighting a fresh candle with a fingertip-flame, the spell-flame jumping from her finger to the wick',
    ],
    instructions: `Each entry is ONE candid loaded-moment, 20-40 words. Mid-action, NEVER posed. NSFW-clean. Output as a NUMBERED list (1. ... 2. ... 3. ...), one entry per line.`,
  },

  gothbot_goth_closeup_camera_perspective: {
    format: 'simple',
    theme: `CAMERA PERSPECTIVE for goth-closeup — the EXACT angle and framing of the closeup. Each entry 15-30 words.\n\n⚠️ Use diverse framing — never default to straight-on three-quarter. Each entry is ONE specific camera angle / frame.\n\n✓ ALLOWED: straight-on three-quarter / sharp side-profile / mirror-angle side-profile / over-the-shoulder / low-angle looking up / high-angle looking down / dutch-angle tilted / extreme close-up on eyes / extreme close-up on lips / through-the-veil / through-her-hand / from-below the throat / close bust-up / reflected in mirror / through her own hair / through stained-glass / framed-by-candles / etc.`,
    touchpoints: [
      'straight-on three-quarter closeup, her eyes locked directly on the viewer, slight tilt of her head',
      'sharp side-profile closeup, her gaze off-frame, hair cascading down her cheekbone',
      'opposite side-profile closeup (mirror angle), jawline in hard shadow, eye barely visible',
      'over-the-shoulder from behind — she is glancing back at the viewer with a hungry smirk',
      'low-angle closeup looking UP at her face — she towers, menacing, looking down',
      'high-angle closeup looking DOWN at her — she tilts her face up toward the viewer, defiant',
      'dutch-angle tilted closeup, composition off-kilter, her gaze unsettling and asymmetric',
      'extreme close-up — just her eyes and upper cheek, lashes and pupil filling the frame',
      'extreme close-up — lips and chin, dark lips parted, throat visible below',
      'through-the-veil closeup — sheer black lace parted in front of her face',
      'through-the-hand closeup — her fingers partially obscuring her face, one eye peering between',
      'from-below looking up her throat — chin raised, eyes half-closed',
      'close bust-up three-quarter — shoulder turned toward viewer, head swiveled back at the camera',
      'extreme close-up reflected in a shattered hand-mirror she holds at frame edge',
      'closeup through strands of her own hair, face partially hidden, one glowing eye visible',
      'closeup through a stained-glass window pane, her face fractured by the colored glass between us and her',
      'closeup framed-by-candles — two candle-flames flanking her face in the foreground, soft warm-glow',
      'closeup framed-by-an-iron-grille — bars across the frame, her face visible between them',
      'rim-lit silhouette closeup — her face in deep shadow with only edge-light tracing her profile',
      'close-tight on her face with a single tear of black-mascara-laced rain rolling down one cheek',
      'extreme close on her hand at her face — her own fingers covering her mouth, one eye above',
      'over-the-collar closeup — looking past the high lace collar at her face above',
      'extreme close-up on her ear with the dangling chandelier earring catching candlelight',
      'closeup with the camera level at her collarbone looking up toward her face — predator angle',
      'closeup from behind a partly-open door — vertical sliver of frame, her face visible in the opening',
      'closeup looking through a hand-mirror she holds toward the camera — reflection meta-shot',
      'sharp closeup from her left, half her face in deep-violet shadow, half in warm-amber candlelight',
      'closeup framed by twin pillars of incense smoke rising on either side of her face',
      'closeup with her in the foreground out-of-focus and a candle in deep-focus behind — depth play',
      'closeup with her at the bottom of frame and reflective surface of water above (looking up from her bath at the reflected ceiling)',
    ],
    instructions: `Each entry is ONE specific camera perspective, 15-30 words. Diverse angles — NEVER default to straight-on. Output as a NUMBERED list (1. ... 2. ... 3. ...), one entry per line.`,
  },

  // ─── GOTHBOT cozy-goth path (2026-05-15 migration).
  // LAYERED witch's-study / curio-cabinet / occult-apothecary interiors
  // densely packed with macabre, occult, and magical trinkets. Warm-dark
  // candle/hearth lighting. NO characters. ────────────────────────────

  gothbot_cozy_goth_interior_space: {
    format: 'simple',
    theme: `LAYERED COZY-GOTHIC INTERIOR SPACES for GothBot's cozy-goth path. Each entry 50-80 words. Crimson Peak / Pan's Labyrinth / Practical Magic / Hocus Pocus / Dracula's library / 19th-century gothic curio-cabinet engraving visual lineage.\n\n⚠️ Each entry is ONE specific cozy-gothic INTERIOR space — described as a corner / alcove / shelf-cluster, densely furnished, mid or mid-close intimate frame. The room is the hero.\n\n⚠️ NO CHARACTERS / NO humans / NO hands / NO figures. A cat / raven / familiar at the edge OK as scale-prover.\n\nMANDATORY in every entry:\n• A SPECIFIC INTERIOR-SPACE TYPE named distinctly (witch's apothecary corner / candlelit gothic library / scrying-chamber alcove / alchemy laboratory shelf / curio-cabinet drawer-display / rain-window reading nook / fireplace alcove / archive corner / gothic bedroom / etc.)\n• MULTI-TIER DENSITY — 5+ depth layers from foreground tabletop / shelf-edge through midground shelves / deeper shelves and walls / back wall with hanging items / ambient air with dust-motes\n• WARM-DARK lighting (candle / oil-lamp / hearth / fireplace)\n• AT LEAST 3 NAMED COZY-GOTHIC FURNISHINGS in the description (e.g., antique writing-desk, wing-back velvet armchair, brass apothecary scale, oak bookshelf with carved-finial, etc.)\n• HAUNTINGLY-COZY mood — never dramatic, never sharp\n\n🚫 ABSOLUTE BANS:\n• NO humans / figures / hands / silhouettes\n• NO sci-fi / modern / cyberpunk / industrial / neon\n• NO real-world ethnic codes\n• NO bright daylight — always candle / oil-lamp / fireplace\n• NO sterile / sparse compositions — DENSELY LAYERED mandatory\n• NO outdoor scenes — pure interior\n• NO drama / menace / horror — peaceful warmth\n• NO cold-blue palette dominant — warm-amber primary\n\nVARIETY MANDATE — distribute across these interior types:\n  A. **WITCH'S APOTHECARY CORNER** (~20%): apothecary bench with brass scales, dozens of labeled jars on dark-oak shelves, mortar-and-pestle, hanging herb bundles\n  B. **CANDLELIT GOTHIC LIBRARY** (~20%): towering oak bookcases with leather-bound tomes, ladder-on-rail, wing-back velvet armchair, ornate writing-desk lit by oil-lamp\n  C. **SCRYING / DIVINATION CHAMBER** (~15%): velvet-draped table with crystal ball, scattered tarot, pendulum, brass astrolabe, candles around the cloth\n  D. **ALCHEMY LABORATORY** (~15%): copper alembic on stone slab, glass distillation apparatus, hanging brass instruments, bookshelf of alchemy tomes, oil-lamp light\n  E. **CURIO-CABINET / WONDER-ROOM** (~15%): wall of glass-cased shelves displaying specimens, skulls, taxidermy, bell-jars, gemstones, the room dim with lamp-light\n  F. **RAIN-WINDOW READING NOOK** (~5%): velvet cushion in a deep-set arched window, books piled, single candle, view of rain-streaked stained-glass\n  G. **FIREPLACE ALCOVE** (~5%): stone fireplace with crackling fire, mantle laden with trinkets, gothic armchair, fire-warmed shelves of books\n  H. **GOTHIC BEDROOM CORNER** (~5%): four-poster bed with velvet curtains, antique nightstand with candelabra and book, persian rug, warm shadow`,
    touchpoints: [
      "WITCH'S APOTHECARY CORNER — a dark-oak apothecary bench dominates midground, brass apothecary-scales at center, dozens of glass jars with hand-written labels on tiered shelves behind, hanging bundles of sage and wormwood drifting from the rafters above, mortar-and-pestle to one side, candle-stub burning beside an open recipe-book, dust-motes in the warm amber light.",
      'CANDLELIT GOTHIC LIBRARY — a deep alcove between towering oak bookcases, leather-bound tomes stacked in disarray on a antique writing-desk, brass oil-lamp casting warm amber pool across an open grimoire, wing-back velvet armchair partly visible at midground edge, persian rug, the upper shelves disappearing into deep shadow with dust-motes drifting through the light.',
      'SCRYING CHAMBER — a velvet-draped round table at midground, large crystal ball at center catching candlelight, scattered tarot deck face-up beside it, brass pendulum hanging from a wooden stand, astrolabe and divination charts at the table edge, candles in tarnished candelabras flanking, deep-violet velvet drapes behind, intimate warm light.',
      'ALCHEMY LABORATORY — a stone slab workbench dominates midground, copper alembic with intricate distillation tubing in operation, glass beakers with colored liquid lining the back shelf, brass instruments and a magnifying lens, books stacked precariously, oil-lamp casting amber light, vapor rising softly from the alembic.',
      'CURIO-CABINET WONDER-ROOM — a wall of glass-cased mahogany shelves dominates midground, each shelf packed with specimens — skulls, mounted insects in shadow-boxes, fossils, gemstone clusters, bell-jars with curiosities, taxidermy birds, the cabinet dimly lit by a brass oil-lamp on a nearby table, hardwood floor strewn with persian rugs.',
      'RAIN-WINDOW READING NOOK — a deep-set arched stained-glass window dominates midground, velvet cushion bench filling the sill with stacked leather books, brass candle-holder with melted candle on the sill-edge, rain-streaks visible on the stained-glass exterior, the rest of the room in deep warm shadow.',
      'FIREPLACE ALCOVE — a great stone fireplace with crackling amber fire dominates midground, ornate mantle laden with brass candlesticks and ancestral portraits, gothic armchair with carved-finials at one side, hardwood floor with persian rug, the firelight warming a small reading-table laden with books.',
      'GOTHIC BEDROOM CORNER — a four-poster bed with deep-burgundy velvet curtains partly visible at midground, antique nightstand with brass candelabra and open prayer-book, persian rug, tapestry on the wall depicting hounds and hunters, the room warm-amber from candlelight, an oil-painting in gilt frame above the nightstand.',
      'OCCULT WRITING-DESK STUDY — a great oak writing-desk dominates midground, ornate brass desk-lamp casting amber pool over an open grimoire and ink-pot, scattered parchment scrolls, quill pen, candles in melted clusters, brass instruments arranged on a leather mat, the back wall covered with hanging maps and botanical illustrations.',
      'TAROT-READING PARLOR CORNER — a small round table draped in deep-violet velvet at midground, tarot deck spread in a Celtic-cross layout, candles flanking the spread, crystal ball at one side, divination charts pinned to the back wall, deep shadows around with brass candle-sconces giving warm pools of light.',
      "NECROMANCER'S SCRIPTORIUM — a slate-topped writing slab at midground, dark-bound grimoires piled, raven-quill in an ink-bottle, candle-cluster with thirteen tapers burning, occult-symbol diagrams pinned above, skull on a side-shelf, hanging dried hellebore bundles, deep shadow but warm amber light around the slab.",
      'GLASS-CONSERVATORY APOTHECARY — a copper-framed glass conservatory section converted to apothecary, dozens of potted nightshade plants on iron shelves, brass watering-cans, dried flowers hanging in bundles, a small workbench with mortar-and-pestle, oil-lamp at center, the glass panels showing rain-streaks at night.',
      'CANDLE-MAKING ALCOVE — a wax-stained workbench at midground, dozens of candles in various stages of dipping, brass dipping-vats, drying racks of finished tapers, jars of beeswax and bayberry-wax on shelves, an old leather apron hung on the wall, oil-lamp lighting the workspace amber.',
      'OCCULT-MAP ROOM — antique writing-desk laden with rolled and partially-unfurled parchment maps at midground, brass compass and divider-set, oil-lamp, a great wall-map behind annotated with occult sigils, books on cartography stacked beside, leather-bound atlas open to a strange continent.',
      'ANCESTRAL PORTRAIT GALLERY — a long wall hung with dozens of ornate gilt-framed ancestral portraits dominating midground, low brass console-table with a candelabra and a single antique key on a velvet cloth, wainscoting in dark mahogany below, the gallery extending into warm-shadowed deep distance.',
      'BREWING KITCHEN COZY-CORNER — a great copper cauldron on a stone hearth at midground, hanging copper pots and pans, shelves of brass spice-tins and labeled jars, hanging dried herbs, a single oil-lamp casting amber light, the rest of the kitchen in deep warm shadow with the hearth-fire as primary light.',
      'BOTANICAL ILLUSTRATION-CORNER — antique drafting-desk at midground with a half-finished watercolor of a foxglove specimen, ink-pots and brush-cups, watercolor paint-palette, dozens of finished botanical illustrations pinned to the back wall, oil-lamp casting amber light over the work.',
      "GEMOLOGIST'S DISPLAY-CORNER — a velvet-draped display-case at midground showing dozens of cut gemstones and raw crystals, brass jeweler's loupe, scale, tweezers on a leather work-mat, additional shelves behind with geodes and mineral specimens, the room dim with directed jeweler's candle-light.",
      'MUSIC-ROOM CORNER WITH HARPSICHORD — antique harpsichord in dark wood dominates midground, sheet-music open on the stand, brass candelabra atop the instrument lit, ornate music-stand with violin, persian rug, the rest of the room hung with ornate gilt-frame mirrors and gothic-tapestries, deep shadow with warm pools.',
      "MOURNING-COSTUMERY WORKROOM — a tailor's mannequin draped in half-finished black velvet mourning-gown at midground, antique sewing-table with brass scissors and pin-cushion, spools of black silk thread, jars of jet beads, oil-lamp casting amber light, the back wall hung with mourning-veil patterns.",
      'TEA-AND-DIVINATION NOOK — a small round table with crocheted lace cloth at midground, fine porcelain tea-set with steaming pot, single tea-leaf reading visible in an empty cup, deck of tarot cards beside, candle-cluster, the surrounding cozy-corner with persian cushions, dark wallpaper with damask pattern.',
      'BLACK-IRON CONSERVATORY-CORNER — wrought-iron-and-glass conservatory section at midground, potted carnivorous plants (sundew, pitcher-plant, Venus flytrap) on iron shelves, brass watering-can, the glass panels at midnight blue with stars visible above, oil-lamp casting amber light through the foliage.',
      'CHESS-AND-OCCULT-STUDY — antique chess-set on a marble inlaid table at midground, mid-game positions, leather-bound chess-strategy books stacked beside, brass clock ticking, oil-lamp casting amber light, tapestry of medieval chess-game on the back wall, deep warm shadow at edges.',
      "STAINED-GLASS WORKROOM — a stained-glass artist's workbench at midground, lead-came tools and glass-cutters laid out, a half-finished panel showing a phoenix in jewel-tones laid across a light-table, jars of pigments and finished panels on shelves around, oil-lamp casting amber light through pieces.",
      "COLLECTOR'S CABINET-OF-CURIOSITIES — a vast mahogany cabinet with dozens of small drawers dominating midground, several drawers open to display contents (insect-pinned, fossils, gemstones, miniature paintings), the wall above hung with antique sextants and compasses, oil-lamp casting amber light.",
    ],
    instructions: `Each entry is ONE specific cozy-gothic interior space, 50-80 words. DENSELY LAYERED with 5+ depth layers. NO characters / humans / hands. WARM-DARK candle/hearth lighting. NO modern / sci-fi / ethnic. Output as a NUMBERED list (1. ... 2. ... 3. ...), one entry per line.`,
  },

  gothbot_cozy_goth_magical_glow_item: {
    format: 'simple',
    theme: `MAGICAL GLOWING ITEMS for cozy-goth interior scenes — glowing potions, runed artifacts, mystical crystal orbs, enchanted talismans, luminous spell-objects. Each entry 15-30 words. Practical Magic / Hocus Pocus / Howl's Moving Castle / Pan's Labyrinth / Harry Potter visual lineage.\n\n⚠️ Each entry is ONE specific magical-glowing item placed in the room. Foreground tabletop / shelf / wall / cabinet. The item has VISIBLE MAGICAL CHARACTER — glowing, runed, levitating, pulsing, swirling, enchanted.\n\n⚠️ GOTH + TWIST OF MAGIC. Items belong in a witch's-lair / wizard's-workroom. Mystical without being grim.\n\n🚫 ABSOLUTE BANS:\n• NO bodies / organs / cadavers / anatomical-models / skeleton-displays / corpse-imagery\n• NO Victorian mortuary / surgical / autopsy items\n• NO formaldehyde-preserved organs / eyeballs / brains\n• NO death-mask art / mourning-portraits / cemetery-coded items\n• NO modern / sci-fi / cyberpunk / neon — mystical-magical only\n• NO real-world ethnic codes\n\n✓ ALLOWED: glowing potion-bottles with colored magical contents / brass-rimmed glass jars with luminous swirling liquid / rune-carved obsidian discs glowing faintly / floating crystal orbs above their stands / runed leather grimoires with luminous text leaking from the pages / wand displays / staves leaning against shelves / enchanted talismans glowing faintly / glowing herb-bundles tied with twine / pinned magical-creature sketches on the wall / floating candle-flames detached from candles / luminous moonstones in dishes / glowing salt-circles on cloth / bottled-lightning in mason jars / magical-ink wells with self-stirring contents / cursed-mirror with shifting reflection / shimmering star-charts / dragon-scale specimen in a brass frame / phoenix-feather in a glass display`,
    touchpoints: [
      'a tall glass apothecary-bottle at midground filled with swirling emerald-green liquid, soft glow pulsing slowly, brass-rimmed cork',
      'a brass-and-glass display case at midground containing a single floating moonstone, faint silver-blue light radiating',
      'a runed obsidian disc at midground on a velvet cloth, the carved runes glowing faintly amber, mystical pattern',
      'a leather-bound grimoire at midground open to a spell-page, the inked text glowing pale-violet from within',
      'a rack of seven wooden wands at midground, each with a different crystal tip — amethyst, quartz, citrine, obsidian, moonstone',
      'a magical staff leaning against the bookcase at midground, crystal at the head pulsing soft cobalt-blue light',
      'a velvet-cushioned tray of enchanted talismans at midground, three glowing faintly different colors',
      'bundles of dried herbs hanging from a copper rack at midground, the herbs faintly luminescent green-gold',
      'a brass-framed pinned sketch on the wall at midground of a magical creature, the ink shimmering with movement',
      'a single levitating candle-flame at midground floating six inches above an empty candlestick, casting amber light',
      'a glass dish of moonstones at midground glowing soft silver-blue, the stones drifting slowly within the dish as if alive',
      'a velvet cloth with a salt-circle at midground, the circle faintly glowing pale-white in slow pulses',
      'a mason jar at midground containing trapped lightning-bolt, the bolt zigzagging slowly inside the glass',
      'an antique ink-well at midground with the quill standing upright in the ink, the quill writing on parchment by itself',
      'an ornate hand-mirror on a stand at midground, the reflection showing a different room than the one we see',
      'an unrolled star-chart on the desk at midground, the constellations shifting visibly as we watch',
      'a brass-framed display case at midground containing a single iridescent dragon-scale, soft rainbow shimmer',
      'a glass dome at midground containing a single golden phoenix-feather, faint warm light radiating',
      'a tall narrow apothecary bottle at midground filled with violet-purple potion swirling on its own, glowing edges',
      'a brass-rimmed glass orb at midground floating above its stand, internal storm-clouds churning',
      'a leather pouch spilling glowing star-dust onto a velvet cloth at midground, the dust drifting slowly upward',
      'a rune-engraved silver bracelet at midground on a small wooden pedestal, the runes pulsing faint amber',
      'a small bottle of liquid moonlight at midground, the contents glowing pale-silver and visible-flowing in defiance of gravity',
      'a wax-sealed parchment scroll at midground with the seal glowing faint violet, runes inked on the visible portion',
      'a copper alembic at midground with luminous violet potion steaming softly through the distillation coils',
      'an obsidian-glass scrying mirror at midground in a brass frame, the mirror surface swirling like dark water',
      'an enchanted lantern at midground burning with cold blue flame, no fuel source visible',
      "a stoppered bottle of dragon's-breath at midground, the bottled vapor swirling crimson-orange within",
      'a small velvet pouch spilling glowing rune-stones at midground, six different glyphs catching candle-light',
      'a glass display case at midground containing a hovering enchanted gemstone, rotating slowly in mid-air, soft sapphire glow',
    ],
    instructions: `Each entry is ONE magical glowing/runed/enchanted item for the cozy-gothic interior, 15-30 words. GOTH + TWIST OF MAGIC. NO bodies / organs / cadavers / mortuary items. NO modern / sci-fi / ethnic. Output as a NUMBERED list (1. ... 2. ... 3. ...), one entry per line.`,
  },

  gothbot_cozy_goth_figure_accent: {
    format: 'simple',
    theme: `MYSTERIOUS GOTH-FEMININE FIGURE as DEEP-MIDGROUND SCALE-PROVER for cozy-goth interior scenes. Each entry 30-50 words. Practical Magic / Hocus Pocus / Crimson Peak / Interview-with-a-Vampire visual lineage.\n\n⚠️ The figure is SCALE-PROVER ONLY — 8-15% of frame, positioned at DEEP MIDGROUND or MIDGROUND CORNER. Never foreground, never centered, never the subject. Partly absorbed into warm-shadow, sometimes partially turned away or partly silhouetted by candle/firelight. She belongs in the space — atmospheric inventory not protagonist.\n\n⚠️ ALL FIGURES SHARE A GOTH AESTHETIC — even gypsy-fortune-teller archetypes are goth-coded (deep velvets, dark lace, scarlet accents, mystic dark sensibility) rather than folk-coded.\n\n⚠️ SOLO mandate — only ONE figure ever.\n\n⚠️ SLEEK-GOTHIC-MYSTERIOUS not cheesecake. Modest gothic-Victorian dress. NO lingerie / cleavage emphasis / pin-up posing.\n\n⚠️ Always FEMALE (she/her), adult, never child.\n\n🚫 ABSOLUTE BANS:\n• NO multiple figures\n• NO foreground / centered / portrait framing\n• NO sexualized / cheesecake / lingerie / pin-up\n• NO modern / sci-fi / cyberpunk clothing\n• NO real-world ethnic-folk costumes (gothic-romanticized only)\n• NO bright / cheerful outfit colors\n• NO child / teen / pubescent figures\n\nVARIETY MANDATE — distribute across these goth-coded archetypes:\n  A. **VAMPIRE NOBLEWOMAN** (~25%): pale-skinned aristocratic vampiress in deep-burgundy or black silk Victorian gown, high lace collar, choker with pendant, hair coiffed in dark Victorian waves\n  B. **SUCCUBUS / DARK ENCHANTRESS** (~15%): obsidian-pale or dusk-bronze skin, sleek-fitted dark gown, deep-violet or black lace, mysterious half-shadowed face, dark-jewel-toned eyes\n  C. **GOTH GYPSY FORTUNE-TELLER** (~20%): mystic gothic gypsy in layered deep-burgundy and black velvet skirts, dark-jewel-toned shawl with deep tassels, lace headscarf, ornate dark jewelry — NEVER folksy bright colors, GOTH-CODED only\n  D. **GOTHIC MYSTIC / WITCH-COVEN** (~20%): dark hooded gothic robe with deep-burgundy or violet trim, silver-and-amethyst jewelry, raven-black hair flowing, mysterious half-shadowed pose\n  E. **DARK BARONESS / VICTORIAN MOURNING-WIDOW** (~10%): tall figure in black velvet mourning gown with black lace veil, jet beads, mysterious authority\n  F. **OBSIDIAN ALCHEMIST / DARK SCHOLAR** (~10%): gothic scholar in deep-violet silk robe with silver embroidery, dark spectacles, ink-stained hands hidden, hair tied in severe dark knot\n\nMANDATORY in every entry:\n• ARCHETYPE named distinctly (vampiress / succubus / goth-gypsy / gothic-mystic / dark-baroness / obsidian-alchemist)\n• GOTH-CODED outfit (deep velvets / black silk / dark lace / scarlet accents / amethyst-and-silver jewelry)\n• POSITION descriptor — "at deep midground" / "in the back-shelf alcove" / "leaning against the bookshelf" / "seated in the wing-back armchair at midground" / "half-silhouetted by the candle-light at midground" / etc.\n• ACTION — quietly reading / pouring potion / inspecting an artifact / lighting a candle / scrying into the crystal / paging through a grimoire / sipping from a goblet / gazing into the fire / etc.\n• SOLO + SMALL emphasis baked in`,
    touchpoints: [
      'a vampire noblewoman at deep midground, pale-marble skin, deep-burgundy silk gown with high black-lace collar, dark-Victorian hair coiffed in waves, dark-ruby choker, seated in a wing-back armchair quietly reading from a leather grimoire, partially silhouetted by candle-light, only 10% of frame',
      'a goth-gypsy fortune-teller at deep midground, dusk-olive skin in layered deep-burgundy and black velvet skirts, dark-jewel-toned shawl with onyx tassels, lace headscarf, ornate amethyst-and-silver jewelry, hands hovering over a glowing crystal ball, partially turned away, only 10% of frame',
      'a gothic mystic at deep midground in a hooded violet-and-burgundy robe with silver embroidery, raven-black hair flowing from the hood, paging through a glowing grimoire on the writing desk, half-silhouetted by candelabra light, only 12% of frame',
      'a dark baroness at deep midground in a tall black-velvet Victorian mourning gown with black-lace veil and jet beads, gazing into the hearth-fire with mysterious authority, partly turned away from the camera, only 10% of frame',
      'a succubus enchantress at deep midground, obsidian-pale skin, sleek-fitted black silk gown with deep-violet lace trim, dark-violet eyes glinting in candlelight, leaning against an oak bookshelf inspecting a runed obsidian disc, partially silhouetted, only 10% of frame',
      'an obsidian alchemist at deep midground in a deep-violet silk robe with silver embroidery, dark hair tied in a severe knot, dark spectacles catching candlelight, carefully pouring a glowing emerald potion into a smaller vial at her workbench, only 12% of frame',
      'a vampire noblewoman at deep midground in a sweeping black velvet gown with scarlet lace accents, dark hair piled high with jet pins, holding a brass-handled candle aloft as she examines the upper shelves of grimoires, only 10% of frame',
      'a goth-gypsy mystic at deep midground in deep-burgundy velvet skirts and dark fringed shawl with onyx-and-coral beadwork, hands cradling a smoking incense bowl, mysteriously half-shadowed at the scrying table, only 10% of frame',
      'a gothic mystic at deep midground, hooded in deep-violet robe with silver moon-and-star embroidery, casting a small handful of rune-stones onto a velvet cloth at the back-corner table, only 12% of frame',
      'a dark baroness at deep midground in a high-necked black-silk Victorian gown with raven-feather mantle, paging through an open atlas on the back writing-desk, dark hair coiffed severely, only 10% of frame',
      'a succubus enchantress at deep midground in a sleek black-velvet gown with deep-amethyst trim, dark hair flowing loose, sipping from an ornate silver goblet while seated in the wing-back armchair, partly silhouetted by hearth-glow, only 10% of frame',
      'an obsidian alchemist at deep midground in a deep-burgundy laboratory coat with silver clasps, dark hair under a black silk scarf, carefully stirring a violet-glowing potion in a copper crucible, only 12% of frame',
      'a vampire noblewoman at deep midground in a black-velvet Edwardian gown with intricate gold-thread embroidery, hair upswept with an amethyst hair-pin, kneeling at the lower shelves to retrieve a leather tome, partially silhouetted, only 10% of frame',
      'a goth-gypsy at deep midground in layered deep-burgundy velvet skirts and a dark-ruby silk shawl, dark hair under a lace headscarf, dealing tarot cards onto the velvet-draped table, only 10% of frame',
      'a gothic mystic at deep midground in a long deep-violet robe with silver-thread embroidered occult sigils, raven-black hair half-hidden by hood, lighting a tall taper from the candelabra at the writing-desk, only 12% of frame',
      'a dark baroness at deep midground in a sweeping black-silk gown with a long lace train, dark hair coiffed in Victorian waves with jet hairpins, examining a glowing potion bottle she has lifted from the shelf, only 10% of frame',
      'a succubus enchantress at deep midground in a deep-amethyst silk gown with dark-lace overlay, dark eyes glinting violet, gazing into a black scrying-mirror at the back-corner table, partially silhouetted, only 10% of frame',
      'an obsidian alchemist at deep midground in a long deep-violet silk robe with silver-thread trim, dark hair in a severe knot, holding open an alchemy-tome to consult a glowing diagram, only 12% of frame',
      'a vampire noblewoman at deep midground in a black-silk Victorian gown with deep-crimson velvet trim, dark hair upswept with a raven-feather hairpin, sipping deep-crimson wine from a tall crystal goblet by the hearth, only 10% of frame',
      'a goth-gypsy fortune-teller at deep midground in deep-burgundy and black velvet, dark-jewel-toned shawl with onyx tassels, lace headscarf, hands hovering over a deck of tarot cards she has just spread, only 10% of frame',
      'a gothic mystic at deep midground in a hooded violet robe with silver constellation embroidery, raven-black hair flowing from the hood, hands cupped around a small glowing salt-circle on a velvet cloth, only 12% of frame',
      'a dark baroness at deep midground in a black-velvet mourning gown with a high lace collar and jet-bead waist-belt, paging through an ornate gilt-frame photo-album at the writing-desk, only 10% of frame',
      'a succubus enchantress at deep midground in a sleek black-silk gown with deep-rose lace overlay, dark hair half-pinned with an obsidian rose, leaning over a scrying-bowl at the back-corner table, partially silhouetted, only 10% of frame',
      'an obsidian alchemist at deep midground in a deep-violet silk-and-velvet robe with silver clasps, dark hair tied with a jet ribbon, carefully transferring a glowing silver tincture from one bottle to another with a glass dropper, only 12% of frame',
      'a vampire noblewoman at deep midground in a deep-burgundy silk gown with black lace overlay, dark hair upswept with a tarnished-silver tiara, gazing thoughtfully into the flames of the hearth-fire, partially silhouetted, only 10% of frame',
    ],
    instructions: `Each entry is ONE mysterious goth-feminine figure at deep midground, 30-50 words. SCALE-PROVER only (8-15% frame). SOLO. SLEEK-GOTHIC-MYSTERIOUS not cheesecake. NO foreground / centered / portrait framing. NO modern / sci-fi / ethnic-folk / sexualized. Output as a NUMBERED list (1. ... 2. ... 3. ...), one entry per line.`,
  },

  gothbot_cozy_goth_occult_artifact: {
    format: 'simple',
    theme: `OCCULT / MAGICAL ARTIFACTS for cozy-goth interior scenes — grimoires / pendulums / scrying-orbs / pentacles / tarot / wands / potions. Each entry 15-30 words. Crimson Peak / Pan's Labyrinth / Practical Magic / 19th-c curio-cabinet engraving visual lineage.\n\n⚠️ Each entry is ONE specific occult or magical artifact placed in the room. Foreground tabletop / shelf / wall / cabinet.\n\n✓ ALLOWED: grimoires (open / closed) / spell-books / scrying-orbs / crystal balls / pendulums / pentacle-engraved discs / tarot decks / runes / wand-collections / staves / amulets / talismans / potion-bottles with glowing contents / mortar-and-pestle / brass astrolabes / brass pendulums / occult sigil-diagrams / hex-bags / charms / dousing-rods / brass divination-tools`,
    touchpoints: [
      'an open leather-bound grimoire at midground on a velvet cloth, occult sigils inked in iron-gall on the parchment pages',
      'a large crystal ball on a brass clawed-stand at midground, faint internal cobalt-glow swirling',
      'a brass pendulum on a wooden stand at midground, the pendulum frozen mid-swing above a divination chart',
      'a pentacle-engraved disc in beaten copper at midground on a velvet pad, candles arranged at each point',
      'a tarot deck face-up in a Celtic-cross spread on a velvet cloth at midground, the Tower card centered',
      'a tray of carved bone-runes on a velvet pad at midground, each engraved with a different Norse rune',
      'a collection of wands in a brass urn at midground — willow, oak, ash, elder, each with a different crystal tip',
      'a velvet-lined case of amulets and talismans at midground, dozens of small charms on individual brass stands',
      'a tall apothecary bottle at midground with a glowing emerald potion, vapor curling slowly from the corked top',
      'a brass-and-marble mortar-and-pestle at midground, dried herbs being ground, fine powder dusting the marble',
      'a large brass astrolabe at midground on its wooden stand, the rete and rulers carefully positioned',
      'a hex-bag of red silk at midground on a small brass dish, the contents lumpy and partly visible — bones, herbs, a coin',
      'a pair of crossed dousing-rods on a velvet cushion at midground, brass-tipped and finely polished',
      'an ornate silver chalice at midground engraved with occult sigils, half-filled with a dark wine',
      'a sealed scroll on a small wooden tray at midground, broken wax seal showing an occult sigil',
      'a brass pendulum-with-pointer atop a divination-board with letters and numbers at midground',
      'an open spell-book at midground showing an illustrated diagram of a binding-circle, dried herbs as bookmarks',
      'a glass bottle of moon-water at midground on a small brass stand, the water faintly luminescent silver',
      'a velvet-lined case of polished crystals at midground — amethyst clusters, smoky quartz, rose-quartz, obsidian',
      'a brass-handled athame (ritual knife) on a velvet cloth at midground, the blade etched with occult sigils',
      "a ouija board in dark mahogany at midground, the planchette resting on the letter 'A'",
      'a tall bottle of green absinthe-coded elixir at midground with a smoking serpent etched on the glass',
      'a crystal scrying-bowl at midground filled with still black water reflecting the candle-flame, occult symbols around the rim',
      'a brass-and-ebony hourglass at midground with crimson sand falling slowly, occult sigils inscribed on the wooden frame',
      'an ornate silver-and-ruby ring on a velvet pad at midground, the bezel engraved with a pentacle',
    ],
    instructions: `Each entry is ONE occult or magical artifact for the cozy-gothic interior, 15-30 words. NO modern / sci-fi / ethnic. Output as a NUMBERED list (1. ... 2. ... 3. ...), one entry per line.`,
  },

  gothbot_cozy_goth_ambient_atmosphere: {
    format: 'simple',
    theme: `COZY AMBIENT ATMOSPHERIC DETAIL for cozy-goth interior scenes. Each entry 15-30 words. Crimson Peak / Pan's Labyrinth / Practical Magic visual lineage.\n\n⚠️ A small atmospheric flourish that fills the interior air — dust-motes / candle-smoke / steam / firelight flicker / etc. Adds depth without competing with the trinkets.\n\n✓ ALLOWED: dust-motes drifting in light-rays / candle-smoke curling slowly / steam rising from a teapot / firelight flicker on the walls / volumetric warm-light rays through dust / scattered rose-petals on the floor / drifting embers from the hearth / fog of pipe-smoke / cobwebs catching candlelight / drifting moth around a candle / dust on the upper shelves / shadows pooling in corners / draft moving a curtain slowly`,
    touchpoints: [
      'dust-motes drifting in slow volumetric warm-light rays from the oil-lamp at midground',
      'candle-smoke curling slowly upward from a melted taper at foreground, dispersing into the deep shadow above',
      'steam rising softly from a porcelain teapot at midground edge, the steam catching candlelight',
      'warm firelight flicker dancing across the back wall in soft amber pulses',
      'volumetric warm-light rays piercing the deep shadow through dust-haze, each ray catching the curio-cabinet contents',
      'scattered black rose-petals across the foreground hardwood floor, the source unseen',
      'drifting embers from the unseen hearth visible in the foreground air, slow-rising warm motes',
      'fog of pipe-smoke hangs at upper midground, slowly drifting through the warm-amber light',
      'cobwebs at the upper cornices catching candlelight, fine silver threads visible against the dark wood',
      'a single white moth circling a tall taper-candle at midground, wings catching amber',
      'a thick layer of dust on the upper shelves, undisturbed for years, the deeper shelves clean by use',
      'deep pools of shadow gather in the room corners, leaving warm-pools of light at the focal surfaces',
      'a slow draft moves a velvet curtain at midground edge, no visible source',
      'warm steam from a kettle hangs in the air at midground, fragrant tea visible as a halo of soft mist',
      'drifting incense-smoke from a brass burner at midground, sweet sandalwood haze pooling in the warm light',
      'candle-flame at midground flickers in a draft that has no apparent source',
      'fog of breath-mist visible at the rain-window edge, condensing on the stained-glass',
      'drifting feather (from an unseen raven) at midground, slowly settling onto an open book',
      'warm-amber halo around every candle-flame, the haloes overlapping in the dense candlescape',
      'dust visible in the warm-light rays settling slowly onto the topmost shelves',
    ],
    instructions: `Each entry is ONE ambient atmospheric flourish for the cozy-gothic interior, 15-30 words. SMALL not frame-filling. NO modern / sci-fi / ethnic. Output as a NUMBERED list (1. ... 2. ... 3. ...), one entry per line.`,
  },

  // ─── GOTHBOT castlevania-scene path (2026-05-15 migration).
  // STRICT KONAMI CASTLEVANIA — Symphony of the Night / Bloodlines /
  // Lords of Shadow / Order of Ecclesia. Ayami Kojima painted concept-
  // art. BOLD + LUSH + FULL-COLOR-SATURATED palette (royal violet /
  // crimson / sapphire / gold-leaf / emerald / amber). STRUCTURE HERO.
  // ──────────────────────────────────────────────────────────────────

  gothbot_castlevania_scene_structure: {
    format: 'simple',
    theme: `KONAMI CASTLEVANIA structures for GothBot's castlevania-scene path — the castle IS the hero. Each entry is ONE specific Castlevania-canon structure with rich painted-canvas detail, 50-80 words. STRICT Symphony of the Night / Castlevania Bloodlines / Lament of Innocence / Curse of Darkness / Order of Ecclesia / Lords of Shadow / Aria of Sorrow visual lineage. Ayami Kojima painted concept-art aesthetic.\n\n⚠️ STRUCTURE dominates 80%+ of frame. Multi-tier depth (foreground architectural-detail / midground castle body / deep distance supporting wings / sky).\n\n⚠️ STRICT KONAMI CASTLEVANIA — NEVER Bloodborne, NEVER Hammer-horror, NEVER Crimson-Peak, NEVER LOTR / Skyrim / Witcher, NEVER generic-gothic. KONAMI's specific Wallachian / Vlad-Tepes / Bram-Stoker-Dracula aesthetic with ART-NOUVEAU GOTHIC ornament.\n\n⚠️ BOLD + LUSH + FULL-COLOR-SATURATED — every Castlevania structure is rendered with rich painted-canvas saturation. Royal violet / deep crimson / sapphire / gold-leaf / emerald / amber. NOT muted, NOT desaturated.\n\n⚠️ EXTERIOR or grand-portal/atrium-from-outside only. NO interior chamber-shots.\n\nMANDATORY in every entry:\n• A SPECIFIC CASTLEVANIA-CANON structure named distinctly (Dracula's-castle entrance / the Royal Chapel / the Marble Gallery exterior / the Clock Tower / the Inverted Castle silhouette / Olrox's Quarters facade / the Underground Caverns mouth / the Alchemy Laboratory tower / Brauner's Gardens gate / etc.)\n• MASSIVE COMPLEX SCALE — sprawling multi-wing castle complex (NOT a single spire-tower)\n• AT LEAST 2 NAMED ARCHITECTURAL FEATURES (sapphire-stained-glass rose-window / gold-leafed crockets / dragon-heraldic banners / wrought-iron bat-finial gates / etc.)\n• KONAMI-CANON COLOR SATURATION woven in (violet sky / crimson banner / sapphire glass / gold-leaf trim / amber window-glow / emerald foliage at base)\n• ORNATE ART-NOUVEAU GOTHIC vocabulary — vine-and-skull tracery, dragon-cross heraldry of Drăculești, bat-wing finials\n\n🚫 ABSOLUTE BANS:\n• NO Bloodborne / NO Hammer-horror / NO Crimson-Peak / NO LOTR / NO Skyrim / NO Witcher\n• NO modern / industrial / sci-fi / cyberpunk\n• NO real-world ethnic codes\n• NO humans as primary subject (Belmont/Alucard small silhouette OK as scale-prover only)\n• NO interior chamber-shots — exterior only\n• NO pentagram / satanic iconography\n• NO Jack-Skellington stylization\n• NO muted / desaturated / monochrome — this path is BOLD AND LUSH\n• NO standalone spire-towers — must be SPRAWLING complex\n• NO blood-red dominant sky (red as ACCENT in banners/stained-glass)\n\nVARIETY MANDATE — distribute roughly across Castlevania canon:\n  A. **DRACULA'S CASTLE — exterior approach** (~25%): mountain-perched multi-spire ancestral seat, sprawling curtain-walls, central keep with rose-window, surrounded by Wallachian forest\n  B. **THE CLOCK TOWER** (~15%): tall ornate clock-tower complex with adjacent chapel-wing, gold-leaf clock-face, gargoyle finials, mechanical-gothic ornament\n  C. **THE ROYAL CHAPEL / CATHEDRAL** (~15%): grand cathedral-wing of Dracula's castle, twin sapphire-rose-windows, ornate spires, scarlet-velvet-banner heraldry\n  D. **THE MARBLE GALLERY / ATRIUM** (~10%): grand entry-atrium of the castle, marble columns, sapphire-stained-glass ceiling, opulent gold-leaf\n  E. **THE INVERTED CASTLE silhouette** (~10%): the castle reflected/inverted hanging above the lake or in the sky — Symphony-of-the-Night iconic image\n  F. **OLROX'S QUARTERS / NOBLE-WING** (~10%): aristocratic wing of the castle, mansard-roof gothic-baroque, balcony-gardens, ornate facade\n  G. **THE LIBRARY / ALCHEMY LABORATORY TOWER** (~5%): tall tower with arched windows showing internal candle-glow, alchemical-symbol stained-glass\n  H. **THE UNDERGROUND CAVERNS — mouth** (~5%): grand cavern-entrance carved into mountain with Castlevania-architecture above the opening, ancient stone-archway\n  I. **THE CURSED GARDEN / BRAUNER'S GARDENS gate** (~5%): formal gothic-garden entry with iron-bat-finial gate, ornate balustrades, garden visible beyond`,
    touchpoints: [
      "DRACULA'S ANCESTRAL SEAT — a vast sprawling Castlevania mountain-fortress dominates the frame, dozens of soaring spires above three concentric curtain-walls, every wall lined with carved-stone gargoyle finials, the central keep crowned with an enormous sapphire-stained-glass rose-window glowing from within, mountain-crag flanks dropping into Wallachian forest, gold-leafed spire-crockets catching twilight, scarlet-velvet banners with the Drăculești dragon-cross hanging at every gate, full amber moon behind the highest spire.",
      "THE CLOCK TOWER OF DRACULA'S CASTLE — colossal art-nouveau clock-tower complex fills the frame, the great gold-leafed clock-face at midground glowing amber-from-within, surrounding ornate spire-cluster with bat-wing finials, adjacent chapel-wing with sapphire-rose-window, gargoyle balustrade at every level, mountain-crag at base, deep violet twilight sky beyond, the clock-mechanism faintly visible behind the dial in bronze and gold.",
      'THE ROYAL CHAPEL — grand Castlevania cathedral-wing dominates the frame, twin soaring spires flanking a colossal sapphire-and-crimson rose-window glowing richly, flying buttresses with carved stone-saints, scarlet-velvet banners with gold-thread Drăculești heraldry hanging the length of each spire, ornate gold-leafed cornices, marble columns at the entrance, full amber moon behind the spires, Wallachian mountain horizon at deep distance.',
      'THE MARBLE GALLERY ATRIUM — grand sapphire-and-marble entry-atrium fills the frame from below, colossal Corinthian marble columns rising with gold-leafed capitals, sapphire-stained-glass ceiling glowing from above, scarlet-velvet runner-carpet leading toward the camera, gold-and-bronze chandelier hanging at midground, ornate marble balustrade with gargoyle-posts, deep violet sky visible through the open archway behind.',
      "THE INVERTED CASTLE — Dracula's full castle complex hangs INVERTED in the sky above a still mirror-black lake, every spire pointing DOWN at the water, the castle's reflection visible right-way-up in the water below; surrounding mist-shrouded Wallachian mountains, full amber moon behind the inverted castle, deep violet sky, the inversion casts gold-and-sapphire light onto the lake's surface.",
      "OLROX'S QUARTERS — aristocratic noble-wing of Castlevania castle dominates the frame, gothic-baroque mansard-roof with gold-leafed crockets and bronze finials, multiple balcony-gardens with marble balustrades and ornate iron-railings, every window glowing amber from internal candlelight, scarlet-velvet curtains visible behind ornate sapphire-stained-glass, the main facade two stories tall with carved-relief friezes, full violet twilight sky.",
      'THE LIBRARY TOWER — tall slender Castlevania-library tower with adjacent castle-wings, narrow arched windows glowing amber from internal candle-light, alchemical-symbol stained-glass at each level, gold-leafed spire-tip, gargoyle balustrade at the top, surrounded by lower castle-wings receding into deep distance, deep violet sky, full pale-amber moon directly behind the tower.',
      'THE ALCHEMY LABORATORY — Castlevania alchemy-tower complex with adjacent observatory dome, sapphire-stained-glass dome glowing from within with alchemical-circle pattern, ornate gold-leafed wrought-iron trim, multiple smaller spires with bat-wing finials, mountain-crag base with stone-staircase ascending, deep violet twilight sky, full amber moon, the dome lit with internal cobalt-glow.',
      'THE UNDERGROUND CAVERN MOUTH — grand carved stone archway entrance to the Castlevania underground caverns, the archway 30 meters tall with carved-relief skulls and Drăculești heraldry, Castlevania-architecture rising ABOVE the archway with twin spires and ornate balustrade, gold-leafed inscription above the arch, sapphire-stained-glass on the upper level glowing, scarlet-velvet banners flanking, mountain-crag setting, deep violet sky.',
      "BRAUNER'S GARDENS — formal Castlevania-garden gate-entry, twin colossal wrought-iron gates with bat-wing finials and gold-leafed accents, ornate stone gate-posts topped by carved marble gargoyles, the formal garden visible beyond with carved stone fountains and topiary, the castle-wing rising behind the gardens with sapphire-stained-glass windows glowing, deep violet twilight sky, full amber moon.",
      "THE GRAND ENTRY HALL FACADE — towering main entry of Dracula's castle, twin colossal gargoyle statues flanking massive iron-bound oak doors with gold-leafed trim, the facade above carved with the full Drăculești dragon-and-cross heraldry, ornate sapphire-rose-window glowing above the doors, twin spires flanking the facade with gold-leafed crockets, scarlet-velvet banners hanging, deep violet sky, full amber moon.",
      'THE CATHEDRAL OF DEAD — Castlevania funerary-cathedral complex dominates the frame, central spire with crimson-rose-window glowing, twin lesser spires with stained-glass saints, flying buttresses with carved-skull keystones, ornate gold-leafed cornices, gargoyle balustrade at every level, marble-stair-approach with scarlet-velvet runner, mountain-crag setting, deep violet sky with full pale-amber moon.',
      "DRACULA'S THRONE-ROOM TOWER — exterior of the throne-room tower, gold-leafed dome with massive carved Drăculești dragon-cross emblem, sapphire-stained-glass arched windows showing chandelier-light from within, scarlet-velvet banners hanging from every window, surrounding lesser towers with ornate spire-clusters, mountain-crag base, deep violet twilight sky, full amber moon directly behind the dome.",
      'THE NORTHERN CURTAIN-WALL — colossal Castlevania curtain-wall section running across the frame, multi-tier with gallery balustrades at each level, gargoyle-finialed corner-towers, gold-leafed parapet ornament, scarlet-velvet banners hanging at intervals, the main castle visible rising above and behind, mountain-crag setting, deep violet sky, full pale-amber moon.',
      'THE BLOOD GALLERY EXTERIOR — sapphire-and-crimson stained-glass gallery wing of Dracula’s castle, the entire wall a series of immense pointed-arch stained-glass windows glowing richly from within (mostly crimson and sapphire), gold-leafed marble-column dividers between windows, ornate cornice with gargoyles, deep violet twilight sky, full amber moon behind the gallery roof.',
      "THE MASTER KEEPER'S TOWER — Castlevania tower complex with adjacent armory-wing, gold-leafed onion-dome at the top with ornate weather-vane, sapphire-stained-glass arched windows at each level glowing amber-internal, scarlet-velvet banners hanging the length, ornate bronze-cornice and gold-leafed crockets, mountain-crag base, deep violet sky.",
      'THE CASTLEVANIA-ROSE-COURTYARD — formal courtyard surrounded on three sides by Castlevania castle-wings, central marble fountain with carved gargoyle-spouts, sapphire-stained-glass windows on every wall glowing rich, gold-leafed cornices, ornate gothic-arched doorways at intervals, scarlet-velvet banners hanging from balconies, deep violet sky, full amber moon overhead.',
      "OLROX'S BALCONY-WING — aristocratic balcony-wing of Castlevania castle, multi-tier ornate gothic-baroque facade, every balcony with marble balustrade and carved gargoyle-posts, sapphire-stained-glass French-doors leading to each balcony with amber-candle-light glowing, scarlet-velvet curtains visible inside, gold-leafed cornice trim, deep violet twilight sky, full pale-amber moon.",
      'THE GREAT BELLTOWER — towering Castlevania belltower with gold-leafed dome and great bronze bells visible through arched openings near the top, ornate gothic spire-cluster surrounding, sapphire-stained-glass windows below the bells glowing amber, scarlet-velvet banners hanging the length, gargoyle balustrade, deep violet sky, full amber moon directly behind the dome.',
      'THE FUNERAL CHAPEL ANNEX — small ornate Castlevania-chapel annex attached to the main castle, single tall spire with gold-leafed crockets, twin sapphire-and-crimson stained-glass rose-windows on the chapel-facade glowing rich, ornate gothic-arched entry with carved-marble saints flanking, scarlet-velvet banners, the main castle rising behind, deep violet sky.',
    ],
    instructions: `Each entry is ONE specific Castlevania-canon structure, 50-80 words. STRICT Konami Castlevania ONLY. Ayami Kojima painted aesthetic. BOLD + LUSH + FULL-COLOR-SATURATED palette. Massive complex scale (NOT single-spire). Exterior or grand-portal only. Output as a NUMBERED list (1. ... 2. ... 3. ...), one entry per line.`,
  },

  gothbot_castlevania_scene_detail: {
    format: 'simple',
    theme: `KONAMI CASTLEVANIA architectural details — ornate art-nouveau gothic flourishes for the castlevania-scene path. Each entry 20-40 words. Symphony of the Night / Bloodlines / Lords of Shadow / Order of Ecclesia / Ayami Kojima visual lineage.\n\n⚠️ STRICT Castlevania-canon ornamentation — never generic gothic.\n\n✓ ALLOWED: bat-wing finial spires / Drăculești dragon-cross heraldry / sapphire-stained-glass rose-windows / gold-leafed crockets and pinnacles / wrought-iron bat-and-wyvern gates / scarlet-velvet banner-drops / carved-marble gargoyle balustrades / vine-and-skull tracery / fallen-angel statuary / chandelier-windows visible glowing / gothic-arched doorways with carved saints / dragon-head water-spouts / bronze-and-gold cornice trim / opulent ornate gilt-frame ornament`,
    touchpoints: [
      'a colossal sapphire-and-crimson stained-glass rose-window at the main facade, glowing richly from within with chandelier-light, the tracery in gold-leafed lead',
      'a row of carved-stone gargoyle finials lining every spire-base, each gargoyle in a different fierce pose, bronze-gilt highlights catching twilight',
      'twin colossal wrought-iron bat-wing finials topping the main spires, gold-leafed accents on each wing, intricate bat-anatomy detail',
      'a scarlet-velvet banner with gold-thread Drăculești dragon-cross heraldry hanging the full length of the main facade, the fabric heavy with embroidered detail',
      'ornate gold-leafed crockets running every spire from base to tip, each crocket carved as a different bat / serpent / dragon-head motif',
      'carved-marble fallen-angel statuary lining the main entrance walk, each angel ten feet tall holding a different ornate weapon',
      'a wrought-iron gate with bat-and-wyvern motif, gold-leafed accents on the wing-spans, ornate floral-and-bone tracery, taller than three men',
      'flying buttresses with carved-relief friezes of saints and demons, each frieze a different scene, weathered marble with bronze-gilt edges',
      'carved Drăculești dragon-and-cross emblem set above the main entrance arch, two meters across, carved deep in marble with gold-leaf inlay',
      'ornate sapphire-and-emerald stained-glass arched windows on the chapel-wing, each showing a different martyred saint, glowing rich from within',
      'a gilt-frame bronze-and-gold balcony-railing with carved gargoyle-posts at every meter, marble inset on the balcony floor',
      'vine-and-skull stone-tracery running the lintels of every door and window, carved deep with gold-leaf in the recesses',
      'a colossal pair of carved-marble dragon-head water-spouts flanking the main entrance, each dragon eight feet long, water still trickling from their jaws',
      'gold-leafed dome with massive carved Drăculești dragon-cross emblem at its peak, the dome itself decorated with bronze-relief panels',
      'ornate sapphire-stained-glass French-doors at every balcony, gold-leafed door-frames, scarlet-velvet curtains visible behind glass',
      'a colossal gilt-frame bronze chandelier visible through an arched window, hundreds of candles burning, light spilling rich-amber outward',
      'a carved-stone Drăculești coat-of-arms set above every door, two meters across, marble with bronze-gilt detail',
      'ornate gold-leafed parapet running every wall-top, intricate gothic-tracery with bat-and-vine motif, painted accents in scarlet and emerald',
      'wrought-iron weather-vanes atop every spire shaped as bats or dragons, gold-leafed accents catching moonlight',
      "carved-relief frieze running the main cornice depicting the rise of Wallachia's first prince, two hundred feet long, bronze-gilt highlights",
    ],
    instructions: `Each entry is ONE Castlevania-canon architectural detail, 20-40 words. ORNATE art-nouveau gothic. BOLD + LUSH + SATURATED. Output as a NUMBERED list (1. ... 2. ... 3. ...), one entry per line.`,
  },

  gothbot_castlevania_scene_inner_light: {
    format: 'simple',
    theme: `KONAMI CASTLEVANIA inner-castle light — what glows from within the castle's windows, rose-windows, and openings. Each entry 20-40 words. Symphony of the Night / Bloodlines / Lords of Shadow / Ayami Kojima visual lineage.\n\n⚠️ The CASTLE IS ALIVE FROM WITHIN — light leaks through stained-glass / rose-windows / chandelier-windows / arched openings / doorways. Source is CASTLEVANIA-CANON — chandelier-candles / sapphire-occult / amber-fireplace / crimson-altar / gold-coronet / violet-spell.\n\n✓ ALLOWED: chandelier-amber-candle / sapphire-stained-glass internal-glow / crimson-altar-light / gold-coronet-radiance / violet-spell light / emerald-alchemy / pale-blue-spectral / rose-pink stained-glass`,
    touchpoints: [
      'rich amber candle-light from chandeliers visible glowing through every arched window, each window radiating a warm-gold cone outward into the night',
      'sapphire-blue stained-glass rose-window glowing richly from within with chandelier-light behind, the blue light spilling onto the courtyard below',
      'crimson-and-gold altar-glow visible through the chapel rose-window, the chapel interior visibly aflame with candle-light',
      "violet-spell light flickering from the alchemy-tower's high windows, the violet glow pulsing with internal magical-rhythm",
      'emerald-alchemy light from the laboratory dome, pulsing softly through the stained-glass alchemical-circle pattern',
      'gold-leafed chandelier visible through the throne-room window, hundreds of candles burning, rich gold light flooding outward',
      'sapphire-and-emerald paired light from twin chapel rose-windows, each window glowing its own jewel-color, the light spilling onto the marble forecourt',
      "ornate amber-warm internal light from every balcony's French-doors, scarlet-velvet curtains visible silhouetted, candle-flame visible behind",
      'rose-pink stained-glass at the lady-chapel window glowing rich-rose from within, the only pink note in the deep-violet castle facade',
      'crimson-altar-candle glow from the funerary-cathedral, the entire window glowing scarlet, light spilling onto the marble approach',
      'cobalt-stained-glass at the observatory dome glowing rich blue from within with magical-circle pattern faintly visible',
      'gold-coronet-radiance from the master-keeper tower, the gold-leafed light spilling outward from every level',
      'pale-blue-spectral light from the upper library windows, the cold radiance moving slowly across the panes as if from a candle in motion',
      'rich amber-and-rose double-light from the main entry foyer, the warm light spilling out through the open doors onto the marble steps',
      'sapphire-stained-glass great-rose-window backlit by a massive crystal chandelier, the sapphire light cone reaching the entry approach below',
      'violet-magical-runes glowing faintly across every window of the alchemy-tower at a slow pulse',
      'gold-amber chandelier-light from every gallery window, the chandeliers visible swaying gently behind the glass',
      "sapphire-and-gold paired light from the rose-window's twin lobes, the two colors mixing in the spilled light below",
      'rich-crimson velvet-curtain light glowing scarlet from behind every chapel window',
      'amber and emerald paired internal light from the dual-purpose chapel-and-alchemy wing, the two hues mixing in the spilled light',
    ],
    instructions: `Each entry is ONE Castlevania inner-castle light source, 20-40 words. BOLD saturated jewel-tones (sapphire / amber / crimson / emerald / rose / violet / gold). Output as a NUMBERED list (1. ... 2. ... 3. ...), one entry per line.`,
  },

  gothbot_castlevania_scene_accent_creature: {
    format: 'simple',
    theme: `80%-gated ACCENT CREATURE for castlevania-scene — atmospheric scale-prover only. Each entry 20-40 words. Symphony of the Night / Bloodlines visual lineage.\n\n⚠️ Accent only — atmospheric scale-prover at MIDGROUND EDGE or perched ON the architecture. Never the primary subject.\n\n🚫 NO humans / no humanoid figures as primary. NO modern. NO Bloodborne-beast.\n\n✓ ALLOWED: bat-flock streaming from a bell-tower / single carved gargoyle on a finial / wolf-pack silhouette on a ridge / single raven on the dragon-cross / shadowy-Belmont silhouette at distance / shadowy-Alucard silhouette at distance / single wyvern silhouette wheeling at distance / bat-cloud against the moon / single owl on the chapel-cross / fox crossing the courtyard / serpent coiled on a balustrade`,
    touchpoints: [
      "a thick bat-flock streams out of the bell-tower's open arched-windows in a black ribbon against the amber moon, dozens of silhouettes",
      'a single colossal carved-stone gargoyle perches on a finial at midground, wings spread, the rest of the castle receding behind',
      'a wolf-pack silhouette on a distant ridge at midground, four wolves watching the castle, the largest motionless and central',
      'a single raven perched on the Drăculești dragon-cross emblem above the main entrance, beak slightly open, head turned',
      'a small distant Belmont-coded silhouette in scarlet-cloak at the deep midground steps of the entry, scale-prover only — no facial detail',
      'a small distant Alucard-coded silhouette in white-cloak at midground balcony, motionless, scale-prover only',
      'a single wyvern silhouette wheeling against the amber moon at deep distance, wings spread, scale-prover',
      'a massive bat-cloud streams across the face of the full amber moon in a black ribbon — hundreds of bats',
      'a single owl perched on the chapel-cross at midground, head fully rotated to face camera, white-feather catching moonlight',
      'a small fox crossing the marble courtyard at midground, head turned toward the camera',
      'a black serpent coiled on the balustrade of an upper gallery, head raised, scale-prover at midground edge',
      'two bats perched on a gargoyle finial at midground, wings folded, eyes glinting',
      'a single raven on a wrought-iron weather-vane at midground edge, the weather-vane shaped as a bat',
      "a Belmont-cloaked silhouette at the deep distance castle-gate, scale-prover only, the cloak's scarlet-edge visible",
      'a stone-gargoyle at midground that looks like it just MOVED — the position not quite right against its pedestal',
      'a wolf at midground edge stepping toward the castle, head lowered',
      'a cloud of bats funnels upward from the underground-cavern mouth at midground, dozens of silhouettes spiraling',
      'a single Alucard-cloaked silhouette at midground balcony, motionless, gazing into the night',
      'a serpent winding through the bars of the wrought-iron gate at midground, scale and detail visible',
      'a Drăculești-coded shadow-figure at the deep distance balcony-railing, single scarlet-eye visible — atmospheric scale-prover only',
    ],
    instructions: `Each entry is ONE atmospheric accent creature, 20-40 words. NO primary humans. Castlevania-canon (bats / gargoyles / wolves / ravens / wyverns / Belmont-Alucard distant-silhouette). Output as a NUMBERED list (1. ... 2. ... 3. ...), one entry per line.`,
  },

  gothbot_castlevania_scene_spice: {
    format: 'simple',
    theme: `SMALL CASTLEVANIA SPICE-FLOURISH for castlevania-scene — atmospheric decorative element. Each entry 15-30 words. Symphony of the Night / Bloodlines / Ayami Kojima visual lineage.\n\n⚠️ SMALL — never frame-filling. Adds character without competing.\n\n✓ ALLOWED: full moon variety (amber / pale-ivory / blood-amber) / candle-cluster at the steps / scarlet-velvet banner with gold-thread / wrought-iron lantern hanging / falling rose-petals / drifting white-petals / wreath of flowers / single rose on a balcony rail / candelabra silhouette / hanging gilt-frame portraits visible through window / single carved-statue of saint / ornate weather-vane silhouette / clock-face at exact midnight / chess-piece on a balustrade / single carved Castlevania-coded item`,
    touchpoints: [
      'a massive full amber moon centered directly behind the castle highest spire, the spire silhouetted against the rich amber disc',
      'a row of tall candle-cluster on the marble entry-steps, each candle burning amber, the row leading toward the castle door',
      'a scarlet-velvet banner with gold-thread Drăculești dragon-cross emblem hanging from a single high spire, billowing slowly',
      'a wrought-iron lantern hanging from a stone arch at midground, amber-flame burning, gold-leafed accents catching light',
      'drifting curtain of black-and-crimson rose-petals falling across the foreground from an unseen source above',
      'a wreath of white roses with crimson-velvet ribbon hanging from the central wrought-iron gate at midground',
      'a single deep-crimson rose laid on a balcony balustrade at midground, the rest of the rail empty',
      'a ten-armed candelabra silhouetted in an arched window at midground, every candle burning amber',
      'two gilt-frame portraits visible through an open arched window at midground, ancestral Drăculești portraits',
      'a single carved-marble saint-statue at midground on the main staircase landing, the statue holding a relic-cup',
      'an ornate wrought-iron weather-vane shaped as a bat-and-wyvern atop the central spire, gold-leafed',
      "the clock-tower's gold-leafed clock-face reads exactly midnight, hands frozen at twelve",
      'a single carved-marble chess-piece (a knight) on a balustrade at midground, gold-leafed accents',
      'a wreath of dried scarlet roses with gold-thread ribbon hanging on the chapel-door at midground',
      'a colossal full pale-amber moon at upper-left, the castle silhouetted against the rich amber disc',
      'a row of scarlet-velvet banners with gold-thread heraldry hanging the length of the main approach, billowing slowly',
      'a single ornate gilt-frame portrait of the first prince of Wallachia visible through a French-door at midground',
      'an ornate gold-leafed cross atop the main chapel spire silhouetted against the moon',
      'a cluster of three crystal-cut candle-lanterns on a stone bench at the entry steps, all burning amber',
      'a colossal blood-amber full moon directly behind the cathedral-rose-window, the rose-window glowing scarlet against the amber',
    ],
    instructions: `Each entry is ONE small Castlevania spice-flourish, 15-30 words. SMALL not frame-filling. BOLD + LUSH + SATURATED. Output as a NUMBERED list (1. ... 2. ... 3. ...), one entry per line.`,
  },

  gothbot_castlevania_scene_sky: {
    format: 'simple',
    theme: `KONAMI CASTLEVANIA SKY for castlevania-scene. Each entry 15-30 words. Symphony of the Night / Bloodlines / Lords of Shadow / Ayami Kojima visual lineage.\n\n⚠️ The sky is THEATRICAL and SATURATED — deep-violet twilight / rich-amber dusk / sapphire-storm-cloud / royal-violet aurora / blood-amber sunset / cobalt-night with stars / rich-emerald-haze.\n\n⚠️ The sky FRAMES the castle silhouette, never competes. Big full moon often present.\n\n🚫 NO clean blue daylight. NO purple-monochrome (must have warm + cool accent). NO blood-red dominant. NO sci-fi / nebulas / orbital.\n\n✓ Always SATURATED rich-color, NEVER muted.`,
    touchpoints: [
      'deep royal-violet twilight sky with rich-amber horizon glow behind the castle, scudding sapphire-edged cloud above, full pale-amber moon at upper-right',
      'rich blood-amber dusk sky behind the castle silhouette, deep scarlet bleeding into violet at the upper edge, full pale-amber moon centered',
      'sapphire-cobalt night sky thick with stars, full rich-amber moon dominant at upper-third, the castle silhouetted in deep-violet against the cobalt',
      'royal-violet aurora curtain across the upper sky in rich saturated bands, full amber moon below, the castle backlit',
      'deep-violet storm-cloud sky with gold-amber sunset-rays piercing through the cloud-edges, the castle silhouetted against the rich color',
      'rich-emerald-haze twilight sky with violet upper-edge, full amber moon to one side, scudding emerald-tinged cloud',
      'deep-violet sky with rich-crimson cloud-edge highlights, full amber moon at upper-left, the castle silhouetted against the rich color',
      'rich-amber-and-gold sunset sky directly behind the central spire, deep violet at upper edges, the castle pure silhouette against the warm sky',
      'royal-violet velvet sky thick with sapphire-tinted stars, full pale-amber moon dominant, the castle deep-silhouette',
      'deep-violet twilight with twin moons (one amber, one sapphire) flanking the central spire, rich saturated palette',
      'rich amethyst-and-rose-pink twilight with full amber moon centered, the castle silhouetted against the lush color',
      'deep-violet storm sky with sapphire-edged lightning forking in the deep distance, full amber moon visible through cloud-gap',
      'royal-violet sky with rich-emerald aurora at upper-edge, full pale-amber moon below, the castle silhouetted',
      'deep-cobalt night sky with the Milky Way visible as a rich-violet band, full amber moon, the castle silhouetted',
      'rich-amber sunset bleeding to deep-violet at the zenith, gold-edged scudding cloud, the castle silhouetted in deep-violet against the warm horizon',
      'deep-violet velvet sky with full crimson-amber blood-moon at upper-third (Castlevania-canon — used sparingly ~15%), the castle silhouetted',
      'royal-violet twilight with rich-gold sunset-rays piercing the cloud-cap, full pale-amber moon centered, the castle silhouetted',
      'deep-amethyst sky thick with sapphire-and-emerald stars, full amber moon dominant, the castle in deep-silhouette',
      'rich-violet storm-cloud sky with gold-rimmed cloud-edges, full amber moon visible through a gap, the castle silhouetted',
      'deep-violet twilight with rich-rose-pink upper-edge, full amber moon centered, the castle silhouetted against the saturated palette',
    ],
    instructions: `Each entry is ONE saturated theatrical Castlevania sky, 15-30 words. RICH + LUSH + FULL-COLOR. Output as a NUMBERED list (1. ... 2. ... 3. ...), one entry per line.`,
  },

  // ─── GOTHBOT gothic-architecture path (2026-05-15, bespoke migration).
  // STRUCTURE IS THE HERO (80%+ visual weight). Inner-glow mandatory.
  // Ornate architectural detail porn. Exterior only. ─────────────────

  gothbot_gothic_architecture_structure: {
    format: 'simple',
    theme: `GOTHIC STRUCTURES for GothBot's gothic-architecture path — the building IS the hero. Each entry is ONE specific gothic structure with surrounding context + setting, 50-80 words. Castlevania / Bloodborne / Crimson-Peak / Berserk / Dark-Souls / Elden-Ring / Van-Helsing visual lineage.\n\n⚠️ The STRUCTURE dominates 80%+ of frame. Surrounding landscape is SUPPORTING context, never competes. Multi-tier depth still required (foreground architectural-detail / midground structure body / deep distance supporting context + sky).\n\n⚠️ STRICT GOTHIC DARK-FANTASY — NEVER LOTR / Skyrim / Witcher / Warcraft high-fantasy. NEVER modern / industrial / sci-fi.\n\n⚠️ EXTERIOR shot only — NO interior chamber compositions.\n\nMANDATORY in every entry:\n• A SPECIFIC GOTHIC STRUCTURE TYPE named distinctly (vampire-castle / Gothic cathedral / ruined abbey / cliff-perched monastery / mausoleum-cathedral / black-iron fortress / spired citadel / cursed-village church / chateau-manor / Gothic lighthouse-tower / catacomb-temple / bell-tower / sea-stack chapel / forge-cathedral / etc.)\n• EXTERIOR SCALE describing the structure DOMINATING the frame — towering, vast, sprawling\n• AT LEAST 2 NAMED ARCHITECTURAL FEATURES (e.g., specific spire-style / specific rose-window-shape / specific buttress / specific dome / specific arch-type)\n• SURROUNDING CONTEXT briefly described — cliff / moor / canyon / forest / harbor / village / etc. — but supporting role only\n• "WEATHERED / RUINED / HAUNTED" SIGNAL — centuries-old, baroque decay\n\n🚫 ABSOLUTE BANS:\n• NO LOTR / Skyrim / Witcher / Warcraft vocabulary\n• NO modern (no electric lighthouses with electric bulbs / no clocktowers with digital faces / no factories)\n• NO real-world ethnic-coded structures (no Forbidden-City / Persian-palace / Aztec-pyramid / Indian-fort)\n• NO sci-fi / cyberpunk / neon\n• NO humans / human figures (those go in the accent_creature axis only)\n• NO interior shots — exterior only\n• NO "castle silhouette on cliff" generic — must SHOW architectural detail\n• NO pentagram / satanic iconography\n\nVARIETY MANDATE — distribute roughly across structure types:\n\n  A. **VAMPIRE-CASTLE** (~25%): multi-spire fortress / cliff-perched dark castle / mountain-crag vampire-citadel / Wallachian-coded keep — SPRAWLING multi-wing complex\n  B. **GOTHIC CATHEDRAL** (~20%): Notre-Dame-coded ruin / collapsed-nave cathedral / soaring-spire basilica / blood-cult cathedral — full cathedral-complex with attendant buildings\n  C. **RUINED ABBEY / MONASTERY** (~15%): cliff-perched monastery / collapsed abbey on a tor / mountainside priory / coastal sanctuary — multi-building complex with cloisters and outbuildings\n  D. **MAUSOLEUM-CATHEDRAL / CRYPT-COMPLEX** (~10%): central tomb-cathedral / above-ground crypt-cathedral / catacomb-entrance temple — vast complex with statuary-flanked approach\n  E. **CHATEAU-MANOR / GOTHIC PALACE** (~15%): multi-wing mansard-roof manor / Crimson-Peak-coded chateau / weather-worn palace — sprawling palace-complex\n  F. **FORGE-CATHEDRAL / IRONWORK STRUCTURE** (~5%): Gothic dwarven-coded forge-hall / black-iron weapon-foundry / smith-cathedral — multi-tier industrial-Gothic complex\n  G. **BLACK-IRON FORTRESS** (~10%): siege-fortress with skeletal scarecrow battlements / Gothic war-keep — multi-wing fortified complex\n\n🚫 BANNED CATEGORIES (do NOT include in this pool):\n• NO solitary lighthouse-towers / standalone single-tower structures\n• NO standalone Gothic spire / single-tower entries\n• NO bell-tower-only entries — bell-towers MUST be attached to a larger cathedral/abbey complex\n• NO sea-stack chapel / isolated single-chapel structures — chapels must be part of a larger complex\n• NO village-chapel-only entries — chapels MUST be part of a wider haunted-village or church-cathedral complex`,
    touchpoints: [
      'A vast multi-spire vampire-castle on a basalt crag dominating the entire frame, ten soaring spires bristling above three concentric curtain-walls, every wall lined with skeletal-warrior statuary at thirty-foot intervals, the lower castle wrapped in dead-vines, a single causeway-bridge approaching from foreground, distant Gothic forest at deep-distance edge.',
      'A Gothic cathedral ruin filling the frame at midground, single rose-window the size of a small house at the center with shattered tracery still partially intact, flying buttresses lining both sides like skeletal ribs, twin soaring spires rising into storm-sky, weathered grotesques at every corner.',
      'A cliff-perched abbey dominating the frame, multiple stacked stone-and-tile roofs cascading down a rock-face, single watchtower at the summit, every window arched and barred with wrought-iron, weathered statuary lining the rooftop pinnacles.',
      'A vast mausoleum-cathedral dominating the frame, cathedral-sized tomb with stone-angel statuary lining the entire approach colonnade, twin colossal weeping-angel statues flanking a central iron-bound door, weathered family-crests carved above every alcove, central spire piercing fog.',
      'A Crimson-Peak-coded chateau-manor dominating the frame, multi-wing red-brick mansion with steep mansard roofs, dozens of pointed-arch windows in every wing, wrought-iron balconies at every level, single central tower with weather-vane, the manor sinking slightly into ground-soft soil.',
      'A solitary tall Gothic bell-tower dominating the frame center, weathered iron bell visible through arched opening at the summit, ivy crawling up the entire structure in serpentine patterns, gargoyle-faces on every corner battlement.',
      'A Gothic sea-stack lighthouse-tower dominating the frame, single soaring stone tower rising from an isolated rock pillar surrounded by crashing waves, single iron-cage candle-fire beacon at the summit (NO electric bulb), weathered salt-rime on every stone.',
      'A vast black-iron fortress dominating the frame, multi-tower Gothic fortress with skeletal scarecrows impaled at every crenellation, single gate flanked by twin gargoyle-statues thirty-feet tall, three concentric curtain-walls visible in receding tiers.',
      'A Gothic forge-cathedral dominating the frame, Dwarven-coded multi-tier forge-hall with chimneys at every tower-top still actively smoking, central forge-stack rising hundreds of feet, ironwork-stair networks visible scaling the exterior.',
      'A Notre-Dame-coded Gothic cathedral filling the frame, soaring twin-spire facade with a massive central rose-window the size of a small ballroom, deeply-carved Gothic tympanum above the central portal, flying buttresses on both sides supporting the nave-walls.',
      'A cliff-perched monastery dominating the frame, multi-tier stone-and-slate buildings cascading down a sheer rock-face, narrow rope-bridges connecting clusters, central bell-tower piercing the cloud-layer, weathered to grey by centuries of storm.',
      'A Castlevania-coded vampire-castle dominating the frame, central spired keep flanked by twin slightly-shorter wing-towers, four-tier concentric curtain-walls with gargoyles spaced at every yard along the battlements, central gate with iron portcullis raised.',
      'A Crimson-Peak-coded gothic mansion dominating the frame, vast red-brick mansion with countless pointed-arch windows and steep mansard roofs, the entire structure visibly sinking into red-clay ground, weathered iron-wrought balconies on every wing.',
      'A Dark-Souls-coded cathedral-ruin dominating the frame, half-collapsed Gothic cathedral with two of four spires fallen, scattered carved-stone fragments still half-standing in the foreground, central rose-window partially intact still casting tracery-shadow.',
      'A Bloodborne-coded Gothic cathedral-spire dominating the frame, vast multi-tier spire architecture with stained-glass windows lit from within at multiple levels, Victorian-coded ornamental ironwork at every balcony, surrounded by lesser spire-buildings forming the cathedral-district.',
      'A blood-cult monastery dominating the frame, circular stone monastery on a hilltop with cult-symbols carved across every visible wall, central iron-bound door beneath a colossal carved sigil, weathered to grey by centuries.',
      'A cliff-perched chateau-fortress dominating the frame, Gothic-Romanesque hybrid fortress with multiple round-towers and pointed-arch windows clinging to a vertical cliff, central keep with conical-roof tower, weathered iron-balcony walkways.',
      'A vast catacomb-temple entrance dominating the frame, colossal carved-stone gate flanked by twin stone-angel statues with broken wings, gate-arch carved with concentric warding-runes, descending stair into darkness beyond the threshold.',
      'A cursed-village chapel dominating the frame, half-timbered Gothic chapel with collapsed roof exposing the rafters, weathered grave-yard surrounding the building, single intact stained-glass window showing pale-violet inner-glow, village ruins barely visible at frame-edges.',
      'A Gothic siege-fortress dominating the frame, multi-tier black-iron fortress with skeletal scarecrows at every battlement-corner, single great-gate with iron-banded doors and twin gargoyle-flanking.',
      'A Bram-Stoker-coded vampire-castle dominating the frame, soaring multi-spire fortress on an alpine crag with countless lit-windows at varying levels, central gate with portcullis raised, gargoyle-statuary at every spire-cap.',
      'A Gothic clocktower (mechanical, not digital) dominating the frame, single soaring stone tower with vast clock-face showing weathered roman-numerals, ornamental ironwork around the clock-face, gargoyle-spouts at every corner.',
      'A Berserk-coded fortress-cathedral dominating the frame, Gothic-fortress hybrid with both military-and-ecclesiastical features — battlemented walls AND cathedral-spires, surrounded by impaled-statuary.',
      'A Gothic chateau-mansion on a hilltop dominating the frame, multi-wing palace with countless pointed-arch windows, central tower with weathered weather-vane, ivy crawling across the entire facade.',
      'A Bell-tower-and-chapel-complex dominating the frame, Gothic bell-tower with attached single-aisle chapel, weathered iron bell visible through arched opening, ivy on every wall.',
    ],
    instructions: `Each entry is ONE gothic structure dominating the frame (80%+ visual weight), 50-80 words. EXTERIOR only. Multi-tier depth: structure-detail foreground / structure body / supporting-context background. STRICT GothBot dark-fantasy. NO LOTR / Skyrim / Witcher / modern / sci-fi / real-world ethnic / human figures. Output as a NUMBERED list (1. ... 2. ... 3. ...), one entry per line.`,
  },

  gothbot_gothic_architecture_detail: {
    format: 'simple',
    theme: `ORNATE GOTHIC ARCHITECTURAL FLOURISHES for gothic-architecture scenes — pickN: 3 per render. Each entry is ONE specific architectural detail Sonnet must render visibly, 15-30 words. Castlevania / Bloodborne / Crimson-Peak / Berserk visual lineage.\n\n⚠️ These are the ornate-detail-porn elements. Each render picks 3 of these to render visibly across the frame.\n\n🚫 NO modern / sci-fi / industrial. NO real-world ethnic codes.\n\n✓ GOTHIC ARCHITECTURAL FLOURISHES: rose-window tracery / flying-buttresses / spire-pinnacles with crockets / gargoyles in profile / grotesques on cornices / wrought-iron weathervanes / stone-angel statuary / dragon-head water-spouts / bat-motif finials / vaulted arch keystones / relief-saint carvings / pointed-arch windows / ironwork-spike rows / carved-rose carvings / Gothic tracery / decorative crenellation / iron-bound doors with rune-bands / oxidized-copper roof patches / iron-cage braziers`,
    touchpoints: [
      'A massive rose-window with intricate stone-tracery in concentric quatrefoils, partially shattered with witch-fire green light leaking through remaining glass',
      'Twin flying-buttresses lining the cathedral nave, each carved with relief-scrollwork showing saints and demons in conflict',
      'A soaring spire-pinnacle with carved crockets running up the edge and a weather-vane in iron-bat-silhouette at the summit',
      'A gargoyle perched in profile on a corner buttress, mouth open in mid-roar, water-spout visible at the throat',
      'Three grotesques carved at varying heights on the central cornice, each more weathered than the last',
      'An ornate wrought-iron weathervane in the shape of a Gothic cross spinning slowly atop the highest spire',
      'A stone-angel statue with broken wings lining the cathedral-approach colonnade, weathered to grey',
      'A dragon-head water-spout extending from the cornice, the dragon-mouth carved open and a thin trickle of rainwater pouring',
      'Bat-motif finials capping every spire-tip and battlement-corner, each carved bat with outstretched wings',
      'A vaulted arch keystone carved with the family-crest of a forgotten noble line, ivy creeping up the keystone-edge',
      'A weathered relief-carving of saints flanking the central portal, faces eroded but garment-folds still visible',
      'Pointed-arch windows in alternating sizes lining every level of the facade, each filled with stained-glass tracery',
      'Ironwork-spike rows topping every parapet-wall, the spikes weathered to dark verdigris',
      'A carved-rose ornament at the central facade above the main door, the rose half-bloomed with thorn-detail',
      'Gothic tracery patterns in every window-frame, the lattice carved in stone with quatrefoil and trefoil motifs',
      'Decorative crenellation along every battlement-wall, the merlons carved with bat-and-skull motifs',
      'A massive iron-bound door with three horizontal rune-bands carved across its face, the wood weathered to black',
      'A weathervane spire at the gate-tower summit topped with a wrought-iron raven silhouette',
      'Oxidized-copper roof patches showing patina-green on every spire and tower, the underlying lead-sheets weathered',
      'An iron-cage brazier at every wall-corner with a single witch-fire green flame burning inside',
      'A vaulted Romanesque archway above the main portal carved with concentric grotesque faces',
      'Stone-angel statuary in alcoves at every level of the facade, each angel posed in mid-flight or kneeling',
      'A carved-tympanum above the great-gate depicting a Gothic last-judgment scene in three relief-tiers',
      'A row of carved-saint statues lining the cathedral-approach, each statue with weathered hands and chipped halos',
      'A wrought-iron portcullis raised at the gate, the ironwork formed in spiked-bat-wing patterns',
    ],
    instructions: `Each entry is ONE ornate gothic architectural flourish, 15-30 words. STRICT GothBot dark-fantasy. NO modern / sci-fi / ethnic. Output as a NUMBERED list (1. ... 2. ... 3. ...), one entry per line.`,
  },

  gothbot_gothic_architecture_inner_light: {
    format: 'simple',
    theme: `INNER DARK-MAGIC LIGHT SOURCES for gothic-architecture scenes. Each entry 15-30 words. The structure is LIT FROM WITHIN. Castlevania / Bloodborne / Crimson-Peak visual lineage.\n\n⚠️ MANDATORY: the inner-glow is the structure's "alive" signal — light leaking through windows / rose-windows / cracks / doorways. NEVER sunlight, NEVER exterior illumination.\n\n🚫 NO modern (no electric / no flashlights / no LEDs). NO sci-fi (no neon / no plasma).\n\n✓ INNER-LIGHT SOURCES: witch-fire green / sapphire-necromantic blue / violet-spell glow / candle-amber warmth / alchemist-gold / fel-green warlock light / blacklight ultraviolet / corpse-pale luminescence / forge-ember orange / rose-tinted candlelight / pulsing-rune-light / cobalt arcane glow / pale-moon-reflected silver`,
    touchpoints: [
      'WITCH-FIRE GREEN glow blazing through every rose-window and pointed-arch window, the green light spilling onto surrounding stonework in casting-pools',
      'CANDLE-AMBER warmth leaking from a dozen narrow arrow-slit windows at varying levels, the amber pools suggesting unseen movement inside',
      'SAPPHIRE-NECROMANTIC BLUE pulsing slowly from the central rose-window in rhythm with an unseen heartbeat',
      'VIOLET-SPELL GLOW seeping through every crack in the stone, the structure looking as if it could split apart at the seams from inner pressure',
      'ALCHEMIST-GOLD radiance pouring from a single top-spire window, the gold light catching dust-motes in surrounding air',
      'FEL-GREEN WARLOCK LIGHT bleeding through stained-glass in jagged patterns, casting acid-green tracery on the ground below',
      'BLACKLIGHT ULTRAVIOLET pulsing from the central doorway, the violet light revealing rune-script invisible to normal sight on surrounding stones',
      'CORPSE-PALE LUMINESCENCE seeping from every opening like cold breath, the pale glow making stonework appear icy',
      'FORGE-EMBER ORANGE glow from the basement-level windows visible through grills, the orange light suggesting something still burns inside',
      'ROSE-TINTED CANDLELIGHT softly glowing through every leaded-glass window, the rose light catching ironwork tracery',
      'PULSING-RUNE-LIGHT visible on every interior wall through open archways, the runes glowing in synchronized rhythm',
      'COBALT ARCANE GLOW spilling from a tall arched doorway, the blue light reaching out into surrounding fog as if alive',
      'PALE-MOON SILVER reflected from polished interior surfaces, the silver light cascading through every opening',
      'WITCH-FIRE GREEN combined with VIOLET-SPELL — two competing inner-glows leaking from different windows, colors mixing in surrounding fog',
      'EMBER-RED FORGE-GLOW from a basement-forge combined with CANDLE-AMBER from upper-level windows, layered warm tones',
      'SAPPHIRE-BLUE arcane glow through stained-glass + GOLDEN-CANDLE warmth through arrow-slits, the cool-and-warm contrast saturating the facade',
      'A single intense WITCH-FIRE GREEN beam shooting upward from an open rooftop oculus into storm-sky, visible from miles away',
      'PULSING amber-and-violet alternating glow from rose-window, the pulse rhythm a slow heartbeat-beat',
      'DEAD-SOUL PALE-WHITE light leaking through every opening, the structure feeling spectral, the inner-glow having no warmth',
      'CHAOS-MULTI-COLOR arcane glow with violet, green, gold, and rose all simultaneously visible through different windows, suggesting impossible inner-events',
    ],
    instructions: `Each entry is ONE inner-light source, 15-30 words. Inner-glow only — NEVER sunlight / exterior illumination. STRICT GothBot dark-fantasy. Output as a NUMBERED list (1. ... 2. ... 3. ...), one entry per line.`,
  },

  gothbot_gothic_architecture_spice: {
    format: 'simple',
    theme: `SET-DECORATION SPICE for gothic-architecture scenes. Each entry 25-45 words. Castlevania / Bloodborne / Crimson-Peak / Berserk visual lineage.\n\n⚠️ MANDATORY 100%-active spice layer. Each render gets ONE spice from this pool — adds atmospheric character without competing with the structure.\n\n⚠️ STRICT POOL CONTENT — only THREE categories allowed:\n\n  A. **DRAMATIC FULL MOONS** (~50%): ALWAYS full moon (NEVER crescent / half / quarter). The moon must be RICHLY DETAILED — visible craters, lunar maria, fine texture across the disc — NEVER a flat white blob. Vary the DRAMA via weather + cloud-veil + sky-mood:\n     • Vast pale-silver full moon riding low, surface deeply textured with visible craters and dark maria, a single thin cloud-veil draped across the lower third\n     • Massive blood-orange full moon haloed in red corona, deep maria visible like ink on copper, surrounding violet sky\n     • Clear-sky full moon at zenith, sharply detailed crater-shadows raking across the disc, no clouds\n     • Storm-cloud-shrouded full moon partially veiled, the visible portion showing fine pock-marked surface detail, lightning forking nearby\n     • Eclipsed full moon with red corona ringing the blackened disc, surface detail still readable through the eclipse-shadow\n     • Wind-torn cloud-rags streaking across a vivid full moon, the moon-surface visible between cloud-tears with crater-detail\n     • Mist-veiled full moon glowing softly through a thin fog-curtain, surface texture diffused but still readable\n     • Twin-moon night with both moons full and detailed, offset against deep-violet sky\n     • Aurora-haloed full moon, aurora-curtain rippling behind the moon-disc, moon-surface fine-textured at the center\n  B. **BATS** (~30%): vary the bat presentation — bat-ribbon streaming from a belfry / vast bat-cloud filling the upper sky / single bat-silhouette dramatically crossing the moon-disc / bat-swarm wheeling around the highest spire / paired bats perched on a gargoyle ledge / wedge-formation bat-flock crossing the sky\n  C. **FLYING GARGOYLES** (~20%): stone gargoyles in mid-flight (animated, alive) — single gargoyle in mid-pounce above the cathedral roof / pair of gargoyles wheeling in synchronized flight above the spires / gargoyle-pack diving from the upper battlements / lone gargoyle silhouetted against the moon mid-flight\n\n🚫 NO other spice categories — NO tiny figures / NO lanterns / NO wisps / NO sigils / NO crows / NO owls / NO wolves / NO comets / NO aurora-without-moon / NO shooting-stars / NO carriages.`,
    touchpoints: [
      'Vast pale-silver full moon riding low behind the central spire, deeply pock-marked surface visible — craters and dark maria readable as fine texture across the disc, a thin cloud-veil draped across the lower third of the lunar face, surrounding sky deep violet',
      'Massive blood-orange full moon haloed in red corona at midground sky, deep maria visible like ink on copper, fine crater-detail across the upper hemisphere, surrounding sky bruise-purple',
      'Clear-sky full moon at zenith above the cathedral, sharp crater-shadows raking across the surface in stark high-contrast detail, no clouds, surrounding violet-black night with cold stars',
      'Storm-cloud-shrouded full moon partially veiled, the visible portion showing fine pock-marked surface, fork-lightning crackling at the cloud-edge revealing more moon-detail in flashes',
      'Eclipsed full moon with red corona ringing the blackened disc, surface detail still readable through the eclipse-shadow as a darkened-but-textured face',
      'Wind-torn cloud-rags streaking across a vivid full moon, the moon-surface visible between cloud-tears with deep crater-detail, surrounding sky storm-purple',
      'Mist-veiled full moon glowing softly through a thin fog-curtain, surface texture diffused but still readable, the moon haloed in a pale-violet ring',
      'Twin-moon night with both moons full and richly detailed, offset against deep-violet sky, the smaller moon casting a fainter shadow than the larger',
      'Aurora-haloed full moon, aurora-curtain of green-violet rippling behind the moon-disc, moon-surface fine-textured with visible craters at the center',
      'Pale full moon haloed in concentric pale-violet corona rings, surface deeply detailed with visible maria, the moon rendered larger than physically plausible directly behind the central spire',
      'Frost-blue full moon in winter sky with crater-detail enhanced by cold-tone shading, surrounding stars cold-pale, the moon casting silver light across the frosted facade',
      'Smoke-veiled full moon partially obscured by rising chimney-smoke, the visible portion showing fine textured surface, the smoke catching moonlight in gold-violet streamers',
      'Bone-white full moon at deep midnight, every crater shadowed in stark relief, surrounding sky impossibly dark, the moon almost three-dimensional in its detail',
      'Full moon glimpsed through broken storm-clouds, surface visible in a single torn-cloud aperture, every crater detail crisp in the cloud-gap, surrounding sky bruise-purple churning',
      'Violet-coronaed full moon directly behind the cathedral spire, the spire silhouetted as a black blade across the moon-disc, surface detail wrapping around the silhouette',
      'A stream of bats pouring from the bell-tower belfry like a black ribbon, the stream extending across the upper third of the frame, individual wing-shapes visible',
      'A vast bat-cloud filling the upper sky behind the structure, dozens of silhouettes converging into a dense layer across the moon',
      'A single bat in mid-flight directly across the lunar disc, wings spread wide, frozen as a stark silhouette against the textured moon-surface',
      'A bat-swarm wheeling in slow gyre around the highest spire, the silhouettes a moving constellation against the violet sky',
      'A wedge-formation bat-flock crossing the sky between the structure and the moon, dozens in V-pattern flight',
      'Three bats perched motionless on a gargoyle ledge at midground edge, wings folded, heads tilted toward the camera',
      'A vampire-bat-stream the size of a city-bus pouring from a single belfry window at midground, the stream curling outward into the storm-sky in serpentine pattern',
      'A pair of bats wheeling in synchronized flight directly in front of the moon-disc, their silhouettes catching pale moonlight on outstretched wings',
      'A bat-cloud emerging from beneath the cathedral porch-arch in a slow upward spiral, individual bats visible in mid-burst',
      'A single bat silhouette dramatically frozen in mid-dive past the highest pinnacle, wings hyper-extended, claws extended forward toward unseen prey',
      'A single stone gargoyle in mid-flight above the cathedral roof, wings outstretched, stone-eyes glowing pale-green, mid-pounce with claws extended',
      'A pair of gargoyles wheeling in synchronized flight above the central spires, their stone-wings catching moonlight at high angles',
      'A gargoyle-pack of four silhouettes diving from the upper battlements toward unseen quarry below, all in mid-dive with wings half-folded',
      'A lone gargoyle silhouetted dramatically against the full moon mid-flight, wings outstretched and tail trailing behind, the moon-disc visible through the gap between wings',
      'A gargoyle in mid-leap from one tower-cap to another, mid-flight pose frozen, stone-claws extended, wings beating downward',
    ],
    instructions: `Each entry is ONE spice element, 25-45 words. ONLY 3 categories: dramatic detailed full moons (~50%) / bats (~30%) / flying gargoyles (~20%). NEVER white-blob moons — moons must show rich crater + maria + surface detail. ALWAYS full moon (never crescent/half/quarter). STRICT GothBot dark-fantasy. NO other spice categories. Output as a NUMBERED list (1. ... 2. ... 3. ...), one entry per line.`,
  },

  gothbot_gothic_architecture_accent_creature: {
    format: 'simple',
    theme: `80%-gated ACCENT CREATURES for gothic-architecture scenes — tiny atmospheric dark-wildlife that enhances without competing with the structure. Each entry 15-30 words. Castlevania / Bloodborne / Crimson-Peak visual lineage.\n\n⚠️ ACCENT ONLY — tiny scale-prover, never primary subject. The structure is hero; these add alive-haunted texture.\n\n⚠️ NO HUMANS / NO HUMANOID FIGURES.\n\n✓ ALLOWED: a crow on a gargoyle ledge / bat-swarm from a bell-tower / single bat silhouette / wolf in the courtyard / wolf-pack at the gate / pale-ghost wisp past a window / raven on a weathervane / owl on a stone-angel statue / moth around an unlit lantern / cat on a balcony / fox at the doorway`,
    touchpoints: [
      'a single black raven perched on the highest gargoyle ledge at midground edge, one bright eye fixed on the camera',
      'a vast bat-swarm streaming from the bell-tower belfry in a black ribbon across the upper frame',
      'three bat-silhouettes wheeling between two of the spires at midground, their wing-shapes catching moonlight',
      'a wolf at the foot of the gate-arch in midground, head turned toward the camera, fur ragged and eyes faintly luminous',
      'a wolf-pack of four silhouettes on the cathedral-approach steps at midground, all watching motionless',
      'a pale-ghost wisp drifting past a stained-glass window at midground, the wisp visible through the colored glass',
      'a raven perched on the weathervane atop the highest spire at midground, silhouetted against the moon',
      'an owl with massive luminous amber eyes perched on a stone-angel statue at midground, head turned to face the camera',
      'a single luminous moth the size of a dinner plate circling an unlit iron-cage lantern at midground edge',
      'a black cat sitting on a stone balustrade at midground edge, motionless and unnaturally still',
      'a fox crossing the cathedral-doorway threshold at midground, head turned to look back, fur catching moonlight',
      'a flock of black-feathered ravens perched along a weathered iron-fence at midground edge, all motionless and watching',
      'a single gargoyle silhouette in mid-flight at midground above the cathedral roof, wings spread, posed unnaturally still',
      'a swarm of fireflies drifting through an open archway at midground, pale-green points visible against dark interior',
      'a hawk-silhouette wheeling above the highest spire at midground, dark against the violet sky',
      'a black-feathered crow perched on the wrought-iron portcullis at midground, calling silently with open beak',
      'an owl perched on a broken stone-angel arm at midground edge, eyes glowing pale-green in moonlight',
      'a single bat-swarm passing across the moon at midground, the silhouettes a dense layer obscuring half the lunar disc',
      'a procession of spectral will-o-wisps drifting up the cathedral-approach steps at midground edge in slow line',
      'a black-iron-bound spellbook left open on a low pedestal at the gate-approach midground edge, pages turning by themselves',
      'a single suit of empty cursed armor standing at the cathedral-approach midground edge, helm-visor down, sword planted in ground (no body inside)',
      'a vulture flock visible on a distant battlement-row at deep midground, perched and patient',
      'a single owl-shadow passing across the moon at midground, the silhouette unmistakable',
      'a fox-silhouette emerging from an open crypt-door at midground edge, head turned toward the camera',
      'a single nightshade-vine creeping across the gate-arch at midground foreground edge, a black-spider perched on the largest leaf',
    ],
    instructions: `Each entry is ONE accent creature, 15-30 words. NO HUMANS / NO HUMANOID FIGURES. Tiny scale-prover only. STRICT GothBot dark-fantasy. Output as a NUMBERED list (1. ... 2. ... 3. ...), one entry per line.`,
  },

  gothbot_gothic_architecture_sky: {
    format: 'simple',
    theme: `SATURATED GOTHIC SKY for a gothic-architecture scene. Each entry 15-30 words. The sky FRAMES the structure. Castlevania / Bloodborne / Crimson-Peak visual lineage.\n\n⚠️ Structure dominates 80%+ of the frame; sky is supporting backdrop — but MUST be saturated theatrical, never washed-out.\n\n🚫 NO sci-fi / nebulas / orbital / cheerful-blue. NO blood-red dominant (red moon ~10% max). NO LOTR / Skyrim / Witcher vocabulary.\n\n✓ GOTHIC ARCHITECTURE SKIES: storm-bruised violet with fork-lightning silhouetting spires / moonlit-violet with massive moon dominant / sickly-green aurora rippling overhead / lavender-indigo twilight / storm-cracked violet with sheet-lightning / corpse-pale overcast / fel-violet storm-cloud with bat-shadows / aurora-curtained night with crow-silhouettes / pale-rose dusk / cathedral-cloud violet / blackened-eclipse-moon / star-streaked aurora / twin-moon night sky`,
    touchpoints: [
      'Storm-bruised purple-and-violet sky with fork-lightning crackling at horizon, silhouetting the spires of the structure',
      'Moonlit-violet sky with a massive pale-silver moon dominant directly behind the central spire, halo-glow around the lunar disc',
      'Sickly green-violet aurora rippling across the night sky in slow waves, the green light catching every weathered stone of the facade',
      'Lavender-indigo twilight bleeding from rose-horizon to deep-violet zenith, the structure silhouetted in saturated mood',
      'Storm-cracked violet sky with fork-lightning illuminating architectural detail in stark flashes',
      'Corpse-pale overcast with phantom-shape outlines barely visible in the cloud-bank, the structure rising before them',
      'Fel-violet storm-cloud sky with bat-shadow silhouettes moving across, no actual birds present',
      'Aurora-curtained night with green-and-violet light-curtains rippling, crow-silhouettes wheeling against the curtains',
      'Pale-rose dusk bleeding to deep violet with a single witch-star at horizon catching the structure-glow',
      'Cathedral-cloud sky with massive painted cloud-banks piled in vertical stratus-castles behind the spires',
      'Blackened-eclipse moon haloed in pale corona behind the central spire (use ~10% max)',
      'Bruised-blue-violet sky with painted thunder-cloud architecture, sheet-lightning at horizon revealing structure-silhouette',
      'Twin-moon night sky with two moons hanging dim-and-pale-violet against deep-indigo, the structure silhouetted by both',
      'Pale corpse-light overcast with no warmth, the structure casting no shadow, lit only by its own inner-glow',
      'Ash-snow sky with slow black flakes falling perpetually, accumulating on every spire-edge and balcony-rail',
      'Violet-and-rose sunset bleeding to deep indigo, single witch-light at horizon catching the highest spire',
      'Storm-violet sky with sheet-lightning at horizon and fork-lightning above, bat-ribbons clearly visible in the flash above the structure',
      'Pale-silver moon haloed in faint violet corona behind the central tower, surrounding stars cold-pale',
      'Pyre-smoke and ash-fall sky with distant amber fires at horizon below, the cloud-cap glowing dimly, crows wheeling silhouetted',
      'Bone-white overcast sky with thin black cracks visible as if the sky itself were ceramic and breaking',
      'Spectral-army visible in the cloud-bank as ghostly silhouettes, the cloud lit faintly luminous from within behind the spires',
      'Pale-violet corruption sky with phantom-bird silhouettes circling at altitude above the bell-tower',
      'Storm-bruised violet sky with mammatus pouches and forking lightning above the cathedral, every quadrant churning',
      'Star-streaked aurora night with shooting-stars visible against the green-and-violet curtains',
      'Sickly green god-ray piercing through corrupted cloud-cover onto a single point of the structure facade',
    ],
    instructions: `Each entry is ONE saturated theatrical gothic sky framing the structure, 15-30 words. SATURATED + THEATRICAL + GOTHIC. NEVER cheerful blue / NEVER clean daylight. STRICT GothBot dark-fantasy. Output as a NUMBERED list (1. ... 2. ... 3. ...), one entry per line.`,
  },

  // ─── GOTHBOT gothic-vista path (2026-05-15, full bespoke migration).
  // The LAND IS ALIVE mandate — dark-wildlife everywhere, bioluminescent
  // flora, structures glowing from within, supernatural-presence sigils.
  // Awe-and-dread. NO CHARACTERS. ──────────────────────────────────────

  gothbot_gothic_vista_biome: {
    format: 'simple',
    theme: `LIVING-AND-HAUNTED GOTHIC LANDSCAPE BIOMES for GothBot's gothic-vista path. Each entry is a FULL biome with multi-tier depth (foreground tactile / midground body / deep distance / sky context). Castlevania / Bloodborne / Crimson-Peak / Berserk / Tim-Burton / Van-Helsing / Dark-Souls visual lineage. Each entry 50-80 words.\n\n⚠️ MANDATORY in EVERY entry: the LAND IS ALIVE — render dark-wildlife AND bioluminescent dark-flora AND a supernatural-presence signal visibly woven into the biome description. NOT a static dead backdrop — a LIVING BREATHING gothic world that GORGEOUSLY UNSETTLES.\n\n⚠️ Dark-wildlife signals (at least one in each entry): crows wheeling in ominous formations / bats streaming from a belfry in black ribbons / wolves watching from a treeline / owls perched on gargoyles / fireflies drifting through graveyards like wandering spirits / moths circling unlit lanterns / spectral wisps between headstones / single raven on a tomb-cross.\n\n⚠️ Bioluminescent dark-flora signals: black moss reclaiming stone / nightshade-and-belladonna bloom-clusters / moonflowers in silver light / ghostly pale wildflowers in cursed soil / bioluminescent fungi pulsing in crypt-corners / glow-thorn vines / luminous nightshade berries.\n\n⚠️ Supernatural-presence signals (at least one): fog moving against the wind / shadows pooling where no object casts them / lit windows impossibly glowing in abandoned ruins / spectral wisps drifting / witch-fire green glow bleeding from cathedral windows / unnaturally still fog-curtain.\n\n⚠️ STRICT GOTHIC DARK-FANTASY ONLY — NEVER LOTR / Skyrim / Witcher / Warcraft / DragonBot high-fantasy vocabulary.\n\n⚠️ NO CHARACTERS / NO humanoid figures (dark-wildlife as scale-prover only).\n\n⚠️ MOVIE-POSTER WIDE VISTA — every biome reads as JAW-DROPPING. The kind of landscape that opens a Castlevania stage / Bloodborne area. SCALE-VERTIGO mandatory.\n\nMANDATORY in every entry:\n• A SPECIFIC GOTHIC BIOME (haunted-forest / cemetery / moorland / coastal-cliff / canyon-gorge / cursed-village / abbey-ruin / castle-approach / frozen-lake / swamp / volcanic-wasteland / etc.) named distinctly\n• MULTI-TIER DEPTH — foreground tactile detail + midground body + deep distance atmospheric layer\n• "ALIVE AND HAUNTED" SIGNAL — dark-wildlife + bioluminescent-flora + supernatural-presence woven together\n• A SIGNATURE FEATURE that makes this biome distinct (specific architectural ruin / specific moonlight pattern / specific witch-fire / specific gothic-flora)\n• SCALE PROVER — explicit dark-wildlife or atmospheric scale-prover (NEVER humanoid)\n\n🚫 ABSOLUTE BANS:\n• NO characters / human figures / humanoid silhouettes — dark-wildlife only\n• NO LOTR / Skyrim / Witcher / Warcraft vocabulary\n• NO modern / industrial / sci-fi / cyberpunk / neon\n• NO single-tier flat compositions\n• NO "looking through stone archway at gothic building in middle distance" — banned cliché\n• NO blood-red-stained-glass dominant (windows DARK / MOONLIT VIOLET / CANDLE-AMBER / FEL-GREEN / WITCH-FIRE GREEN only)\n• NO red-fog / red-mist / red-everything (palette is purple/violet/blue/green/silver/black with red as ACCENT only)\n• NO blood-moon dominating the sky (~10% max)\n• NO interior chamber compositions\n\nVARIETY MANDATE — distribute across gothic-biome categories with dark-life integration:\n\n  A. **HAUNTED FOREST WITH DARK-WILDLIFE** (~15%): petrified dead trees with crow-flocks / blackened canopy with bat-ribbons / will-o-wisp-haunted woodland with spectral wisps\n  B. **CEMETERY WITH DARK-LIFE** (~15%): tombstone field with crow-murders / mausoleum city with owl-on-gargoyle / drowned tomb-garden with firefly-swarms\n  C. **CASTLE-APPROACH WITH GLOWING WINDOWS** (~15%): mountain-pass to castle with witch-fire green windows / cliff-top fortress with single lit-window / spired citadel with candle-tower glow\n  D. **CATHEDRAL/ABBEY WITH INNER-GLOW** (~10%): cathedral ruin with witch-fire stained-glass / abbey courtyard with candle-tower / monastery with bell-tower bat-stream\n  E. **COASTAL CLIFF WITH STORM-LIGHTHOUSE** (~10%): storm-coast with lighthouse-candle / fjord with sea-cave-glow / drowning village with witch-fire window\n  F. **MOOR/HEATH WITH DARK-WILDLIFE** (~10%): heather-moor with abbey-glow + wolves on ridge / blackthorn waste with raven-flock / cursed-fen with will-o-wisps\n  G. **MOUNTAIN PASS WITH GLOWING CITADEL** (~5%): mountain-pass with vampire-castle showing witch-fire windows / snow-pass with monastery-glow\n  H. **WETLAND/SWAMP WITH SPECTRAL-WISPS** (~10%): half-submerged gothic ruin with will-o-wisps / corpse-marsh with dead-tree-firefly-spires / drowned chapel with witch-fire window\n  I. **CURSED VILLAGE WITH IMPOSSIBLE LIT-WINDOWS** (~5%): aerial view of haunted village with castle-glow / Gothic city with witch-fire windows / abandoned village at dusk with single-lit-tavern\n  J. **CANYON WITH BIOLUMINESCENT FLORA** (~5%): canyon-gorge with glow-fungi / cliff-perch monastery with luminous-moss / red-rock canyon with bioluminescent-vines\n  K. **FROZEN LANDSCAPE WITH GLOW** (~5%): frozen-lake with chateau-glow across ice / snow-cemetery with witch-fire / ice-rimed castle with single window-glow\n  L. **VOLCANIC WASTELAND WITH FORGE-GLOW** (~5%): volcanic plain with abandoned forge still burning / ash-fall city with single-tower-burning / smoldering crater-field with witch-fire vents`,
    touchpoints: [
      'HAUNTED FOREST WITH BAT-RIBBON BELFRY — dead petrified forest stretching to horizon with a bell-tower piercing canopy at midground, ribbons of bats streaming from its open belfry across a moonlit-violet sky; foreground: a single nightshade-bloom cluster glowing pale-luminous beside a moss-claimed grave-stone, fireflies drifting; midground: the bell-tower with one window glowing witch-fire green; deep distance: more dead canopy receding into violet mist.',
      'CEMETERY WITH OWL-ON-GARGOYLE — vast tombstone field stretching miles with a mausoleum-cathedral at midground, a great horned owl perched on a weeping-angel statue staring at the camera, crow-murder wheeling overhead; foreground: a single luminous moonflower opening between two tilted gravestones; midground: the mausoleum with witch-fire-green window pulsing; deep distance: more tombstones into pale fog; sky: silver moon and aurora-violet.',
      'CASTLE-APPROACH WITH WITCH-FIRE WINDOWS — narrow stone road winding up between sheer cliff-walls toward a multi-spire vampire-castle, every window glowing emerald witch-fire as if something alive watches from within; foreground: a single weathered cairn-stone with a single raven perched on top; midground: the switchback road with creeping ivy strangling iron gates beside it; deep distance: the castle silhouetted against violet-twilight storm-sky with witch-fire glow casting onto the rocks below.',
      'CATHEDRAL RUIN WITH WITCH-FIRE STAINED-GLASS — collapsed Gothic cathedral half-swallowed by dead-bark forest, the rose-window shattered but the rim still bleeding witch-fire green light onto the surrounding stone; foreground: a fallen stone-saint relief glowing pale-luminous from bioluminescent moss; midground: the cathedral with witch-fire stained-glass casting green pools onto the forest floor, bats streaming from one tower; deep distance: more forest receding; sky: pale moonlit-violet with crow-flock silhouettes.',
      'COASTAL CLIFF WITH STORM-LIGHTHOUSE — black basalt sea-cliff above crashing waves with a vast Gothic lighthouse-tower at midground, single witch-fire green candle burning at its summit, gulls and storm-petrels wheeling; foreground: a single firefly swarm rising from a dead-bramble cluster at the cliff-edge; midground: the lighthouse-tower silhouetted with green-fire summit; deep distance: storm-line at sea-horizon with sheet-lightning; sky: storm-bruised purple with fork-lightning illuminating bat-ribbons.',
      'MOOR WITH WOLF-RIDGE — windswept blackthorn moor with a weathered abbey silhouette at midground showing a single lit-window, a wolf-pack silhouetted on a distant ridge watching across the heath; foreground: a single standing-stone with moss-claimed runes, nightshade-blooms at its base glowing faintly violet; midground: the moor stretching with the abbey at center, wolves on the ridge to one side; deep distance: more moor receding; sky: twilight-lavender to deep-violet.',
      'SPIRED CITADEL WITH CANDLE-TOWER — valley-floor view looking up at a multi-spired dark citadel with a single tower bleeding candle-amber light, bats streaming around its battlements like a living veil; foreground: a fallen banner-stone with creeping ivy; midground: the valley floor with mist rolling toward the citadel; deep distance: the citadel rising into the storm-sky with candle-glow window; sky: storm-cracked violet with sheet-lightning.',
      'WETLAND WITH WILL-O-WISP CHAPEL — black-water swamp filled with vertical dead-tree trunks half-submerged like cathedral pillars, a half-drowned Gothic chapel at midground with witch-fire window casting green onto the water; foreground: a single will-o-wisp drifting near the camera with reflected glow on black water, glow-fungi clusters on the nearest trunk; midground: the chapel with broken spire and witch-fire window, more will-o-wisps drifting between trunks; deep distance: dead cypress receding into mist; sky: green-tinged overcast.',
      'AERIAL HAUNTED VILLAGE — high vantage looking down on a fog-shrouded valley with cursed village clustered along a black river, a vampire-castle on the distant hilltop with witch-fire windows; foreground: dead-tree branches in the upper frame as a window into the scene, a perched raven on the nearest branch; midground: village rooftops poking through fog with impossible lit-windows in supposedly-abandoned houses; deep distance: the castle silhouetted on the hill against violet sky; sky: violet-twilight with crow-formation flying.',
      'FROZEN LAKE WITH CHATEAU-GLOW — vast frozen-lake foreground stretching to a Gothic chateau silhouette across the ice, the chateau windows blazing amber as if a feast continues despite the building being long-abandoned; foreground: a single black-feathered raven perched on a frozen-reed stalk; midground: the ice surface with starlight reflection; deep distance: the chateau with multiple lit windows casting amber pools onto the surrounding snow; sky: aurora-purple with pale-silver moon, bat-silhouettes in the upper frame.',
      'CANYON WITH BIOLUMINESCENT VINES — deep canyon spanned by a colossal stone aqueduct-bridge with multiple arch-tiers, every arch wrapped in glowing bioluminescent ivy that pulses in slow rhythm; foreground: cliff-edge with a gnarled dead tree clinging to the rim, glow-fungi clusters at its base; midground: the aqueduct in profile, water still trickling in places, vines pulsing across every arch; deep distance: the opposite cliff with monastery; sky: storm-bruised purple with crows wheeling in slow gyre.',
      'ABBEY UNDER LAVENDER SKY WITH OWL-WATCH — windswept blackthorn moor with weathered abbey silhouette at deep distance, an owl perched motionless on the highest spire watching across the heath; foreground: a single weathered standing-stone with rune-carving, nightshade-blooms at base; midground: the moor stretching toward the abbey; deep distance: the abbey with single lit-window casting amber spot; sky: twilight-lavender bleeding to deep violet, owl silhouette unmistakable.',
      'BARROW-FIELD WITH FIREFLY-SWARM — vast field of moss-covered barrow-mounds carpeted in blackthorn brambles, hundreds of fireflies rising in slow vortex above a central barrow; foreground: a single barrow-entrance stone with carved warning-runes, glow-fungi at base; midground: the barrow-field with fireflies converging; deep distance: a tor with standing-stone circle; sky: pre-dawn rose with witch-fire green glow at horizon.',
      'DROWNED-FOREST WITH GLOW-FUNGI — black-water swamp filled with vertical dead-tree trunks half-submerged, every trunk covered in pulsing glow-fungi in pale-green and violet; foreground: dark water reflecting upward into the trunks, a single luminous moonflower floating on the surface; midground: the trunk-grove receding into mist with green fungal-glow pulsing in waves; deep distance: a partially-drowned chapel-spire silhouette with witch-fire window; sky: visible only as pale-violet patches between canopy-skeletons.',
      'BLOOD-MOON FOREST CLEARING WITH RAVENS — circular forest clearing with a single ancient witch-tree at center, the eclipsed moon directly overhead through a perfect break in the canopy, dozens of ravens perched in the witch-tree branches; foreground: a weathered stone-altar with offerings (candles, dried roses, glow-fungi), a single raven on the altar-edge; midground: the witch-tree with raven-laden antler-branches; deep distance: surrounding black-bark forest; sky: eclipsed moon with red corona, ravens silhouetted.',
      'VOLCANIC WASTELAND WITH FORGE-RUIN — vast plain of cracked black volcanic glass under perpetual ash-fall, a ruined Gothic forge at midground still burning amber as if the smith never stopped; foreground: a single twisted dead-bramble growing from glass-cracks, glow-fungi at base; midground: the plain stretching with the forge-ruin emitting amber glow visible miles away; deep distance: scattered obsidian fang-spires; sky: storm-bruised purple with violet aurora and ash-fall.',
      'WINTER PASS TO ICE-RIMED FORTRESS WITH WITCH-FIRE — snowy mountain-pass with weathered black-stone fortress visible on the highest crag, single witch-fire green window casting green onto the snow; foreground: a single frostbitten dead pine clinging to the cliff-edge, a wolf-print trail in fresh snow leading away; midground: the pass with wolf-pack silhouetted in deep midground; deep distance: the fortress with witch-fire window; sky: aurora-purple with snow-dust drifting.',
      'CURSED VILLAGE AT DUSK WITH IMPOSSIBLE LIT WINDOWS — abandoned half-timbered Gothic village with single street between empty houses, every house showing amber lit-windows despite the village being long-deserted; foreground: a dropped basket of withered roses, a moth circling an unlit lamp-post; midground: the street with lit windows and floating motes; deep distance: a Gothic church-spire at street-end with witch-fire window; sky: post-dusk indigo with first stars.',
      'POISONED FEN AT TWILIGHT WITH WISPS — flat reed-marsh in dim twilight with rolling violet fog, willow-of-the-wisps dancing knee-high in dozens; foreground: a single reed-cluster with perched black-bird, glow-fungi at base; midground: the marsh with fog rolling in slow waves, wisps converging into formations; deep distance: a Gothic chapel emerging from fog with witch-fire window; sky: post-dusk green-purple gloom.',
      'CATACOMB-ENTRANCE PLAIN WITH OWLS — flat barren stone-plain with vast carved catacomb entrance, twin colossal stone-angel statues flanking the descent, owls perched on both angel-shoulders; foreground: a single weathered offering-stone with melted candle stubs and glow-fungi cluster; midground: the catacomb-entrance with darkness within and witch-fire green spilling out; deep distance: more carved-stone features dotting the plain; sky: pre-dawn rose with constellation visible.',
      'STORM-LIT ABBEY ON SEA-STACK WITH BAT-STREAM — solitary Gothic abbey on an isolated sea-stack with crashing waves around its base, lightning illuminating the silhouette, bats streaming from a bell-tower window in a black ribbon; foreground: storm-spray exploding against weathered rocks; midground: the abbey silhouetted with bat-stream; deep distance: storm-line at horizon with sheet-lightning; sky: storm-violet with fork-lightning.',
      'VAMPIRE-CASTLE OVER MIST-VALLEY WITH WITCH-FIRE — towering multi-spire vampire-castle viewed from below, every window blazing witch-fire green like a constellation of unblinking eyes; foreground: a Gothic stone-bridge crossing a black river with weathered statuary, a raven on the bridge-keystone; midground: the valley floor with rolling mist; deep distance: the castle with hundreds of witch-fire windows; sky: violet-twilight with bat-silhouettes circling the highest spire.',
      'WITCH-FOREST WITH BARROW-MOUND AND WISPS — small clearing in dead-bark forest with single moss-grown barrow-mound at center, weathered stone-marker at the apex, will-o-wisps converging around the marker; foreground: a circle of pale-green witch-fire candles burning low on the forest-floor; midground: the barrow with the marker and wisps; deep distance: skeletal forest; sky: pale-violet through the canopy, a single raven silhouetted.',
      'GOTHIC ROCKBOUND COVE WITH BAT-COLONY — small cove between sheer black cliffs with single Gothic chapel on a sea-stack, dark waves crashing around it, a vast bat-colony streaming from the chapel-belfry against moonlit sky; foreground: a single weathered jetty with overturned boat, glow-fungi on the planks; midground: the chapel with witch-fire window, bat-stream visible; deep distance: open ocean with storm-line; sky: storm-violet with pale-silver moon, bat-ribbon clearly visible.',
      'TOMB-GARDEN OVERGROWN WITH MOONFLOWERS — vast garden-cemetery overgrown with black-rose AND moonflower vines crawling across stone-angels and tomb-crosses, moonflowers opening in silver light; foreground: a fallen moonflower-bloom on a weathered grave-stone, single firefly drifting; midground: the rose-AND-moonflower vines crawling everywhere with bioluminescent glow in pockets; deep distance: a central mausoleum-chapel silhouette with witch-fire window; sky: rose-dusk with single morning-star, owl silhouette on the mausoleum-roof.',
    ],
    instructions: `Each entry is ONE alive-and-haunted gothic biome, 50-80 words. Format: "[BIOME NAME] — [primary element with dark-life]; foreground [tactile detail with dark-flora]; midground [body with architecture-glowing-from-within]; deep distance [atmospheric layer]; sky [overhead]". MANDATORY: dark-wildlife visible + bioluminescent dark-flora + supernatural-presence signal. STRICT GothBot dark-fantasy. NO LOTR / Skyrim / Witcher vocabulary. NO characters / human figures. Output as a NUMBERED list (1. ... 2. ... 3. ...), one entry per line.`,
  },

  gothbot_gothic_vista_architecture: {
    format: 'simple',
    theme: `GOTHIC ARCHITECTURE GLOWING FROM WITHIN for gothic-vista scenes. Each entry 20-40 words. Castlevania / Bloodborne / Crimson-Peak / Berserk visual lineage.\n\n⚠️ MANDATORY: every structure has VISIBLE INNER-GLOW — witch-fire green window / candle-amber tower-light / forge-ember basement / single lit-window in an abandoned building / bioluminescent moss-spread across the facade. Something is ALIVE inside, even when nothing should be.\n\n⚠️ STRICT GOTHIC ONLY — NO LOTR / Skyrim / Witcher / Warcraft architecture.\n\n🚫 NO modern (no electric lighthouses / no clocktowers with digital faces / no factories). NO real-world ethnic codes. NO sci-fi.\n🚫 NO cheerful / bright structures. Every entry is RUINED, WEATHERED, or HAUNTED — but ALIVE WITH GLOW.\n🚫 NO blood-red-stained-glass dominant — windows DARK or WITCH-FIRE GREEN or MOONLIT VIOLET or CANDLE-AMBER or FEL-GREEN only.\n\n✓ GOTHIC ARCHITECTURE: vampire-castles with witch-fire windows / Gothic cathedrals with stained-glass bleeding green / ruined abbeys with single lit-window / cliff-perched monasteries with candle-tower / mausoleum-cathedrals with crypt-glow / black-iron fortresses with forge-ember / spired citadels with multiple impossible-lit windows / cursed-village churches with bell-tower glow / chateau-manors with mansard-glow / Gothic lighthouse-towers with candle-fire beacon / forge-ruins still burning / blood-cult-temple-glow.`,
    touchpoints: [
      'A multi-spire vampire-castle with witch-fire green windows glowing in every tower, gargoyles silhouetted against the inner light.',
      'A Gothic cathedral ruin with a shattered rose-window still bleeding witch-fire green into the surrounding forest.',
      'A cliff-perched abbey with a single lit-window high in the spire, candle-amber glow against the moonlit-violet sky.',
      'A vast mausoleum-cathedral with witch-fire green seeping from cracks between the stone-angel statuary at the entrance.',
      'A black-iron fortress with forge-ember glow visible through arrow-slit windows, smoke rising from a chimney impossibly active.',
      'A solitary Gothic spire with a single witch-fire green lit window at its summit, ravens circling the inner-glow.',
      'A cursed-village church with bell-tower glowing amber from within, bats streaming from the bell-window in a black ribbon.',
      'A chateau-manor with dozens of mansard-roof windows glowing amber, as if a midnight ball still goes on inside.',
      'A bell-tower glowing witch-fire green from within, the iron-bell silhouetted against the inner light.',
      'A catacomb-entrance gate with green-fire light spilling out from the descending stair beyond the threshold.',
      'A Gothic stone-aqueduct with bioluminescent vines crawling up the arches, every arch pulsing pale-violet.',
      'A vast necropolis-skyline with multiple mausoleum-windows glowing impossibly across the tomb-city.',
      'A moss-covered barrow-mound with a witch-fire green glow seeping from the carved-stone entrance.',
      'A sea-stack chapel with single witch-fire window blazing through storm-mist, visible miles offshore.',
      'A forest-shrine with twin candle-stands burning bright violet, weathered carved-saint relief catching the light.',
      'A blood-cult temple with cult-sigils glowing red along the carved walls (rare — accent only, NOT dominant).',
      'A Gothic lighthouse-tower with single candle-fire beacon at the summit, weathered with salt-rime.',
      'A drowning-chapel with the upper half of its bell-tower above black-water, witch-fire green spilling from the open belfry.',
      'A cliff-bridge fortress with multiple witch-fire green windows along its central tower, smoke rising from a chimney.',
      'A Gothic abbey courtyard with the central well glowing pale-violet from within, bioluminescent moss across every wall.',
      'A vampire-castle gatehouse with witch-fire green flames burning in iron-cage braziers flanking the portcullis.',
      'A black-stone observatory with witch-fire green telescope-eye glowing at the dome-apex.',
      'A Gothic cliff-monastery with a candle-amber chain of windows running up its facade as if monks still pray within.',
      'A weathered cemetery-gate with witch-fire green glow seeping from beyond the iron-bars, suggesting something alive inside the necropolis.',
      'A cursed obelisk with red rune-lines glowing at the seams (accent only — not dominant), surrounded by lesser glowing rune-stones.',
    ],
    instructions: `Each entry is ONE gothic architecture focal point WITH VISIBLE INNER-GLOW, 20-40 words. STRICT GothBot gothic dark-fantasy. NO LOTR / Skyrim / Witcher / modern / sci-fi / real-world ethnic. Positioned at MIDGROUND or DEEP DISTANCE. Inner-glow is mandatory. Output as a NUMBERED list (1. ... 2. ... 3. ...), one entry per line.`,
  },

  gothbot_gothic_vista_phenomenon: {
    format: 'simple',
    theme: `80%-gated SUPERNATURAL-PRESENCE PHENOMENA for a gothic-vista scene — the LAND-IS-WATCHING signal. Each entry 25-50 words. Castlevania / Bloodborne / Crimson-Peak / Berserk visual lineage.\n\n⚠️ MANDATORY: every phenomenon signals SOMETHING IS WATCHING / SOMETHING IS WRONG / THE LAND REMEMBERS. Not just atmospheric — eerie + alive + present.\n\n🚫 NO sci-fi / cosmic / nebulas / orbital structures. NO Lovecraftian-tentacle-horror.\n\n✓ SUPERNATURAL-PRESENCE PHENOMENA: fog moving against the wind / shadows pooling where no object casts them / lights flickering in impossible patterns / fireflies converging into watching-eye formations / spectral apparitions emerging from cloud-banks / a phantom carriage drawn by spectral horses at deep distance / witch-fire green aurora "breathing" / phantom-bell tolling visible as concentric mist-ripples / a watching-tower window where no one should be lit / a procession of will-o-wisps marching in formation / shadows of unseen wings passing over the scene / unnaturally-still fog-curtain that splits to reveal something / a single distant figure-shape in the mist that vanishes when looked at directly / a moaning low wind that visibly moves only certain leaves / ravens forming letters in flight / a watching-pair-of-eyes glowing from a tree-hollow at midground edge`,
    touchpoints: [
      'SPECTRAL MIST AGAINST THE WIND — wall of pale violet mist advancing across the landscape against prevailing wind, faces almost visible within the curling vapor, eyes following the camera',
      'SHADOW-POOLS WHERE NO OBJECT CASTS — distinct dark shadow-pools on the moonlit ground that have no corresponding object overhead, the shadows moving slowly as if breathing',
      'FIREFLIES IN WATCHING-EYE FORMATION — vast swarm of fireflies converged into the shape of a giant watching-eye hovering above a barrow-mound, the pupil-area darker than the surrounding light',
      'PHANTOM CARRIAGE AT DEEP DISTANCE — translucent funeral-carriage visible at deep distance crossing the landscape, drawn by spectral horses, no driver visible, a lantern at the carriage-side',
      "WITCH'S TOWER-LIGHT BREATHING — single beam of witch-fire green light from a distant tower cast upward onto the cloud-bank, pulsing in slow rhythm as if breathing",
      'SPECTRAL APPARITION IN CLOUD-BANK — ghostly figure formed of pale mist visible in the distant cloud-bank, holding shape briefly before dissolving, leaving a faint residue of presence',
      'WILL-O-WISP MARCHING PROCESSION — dozens of pale-violet wisps in single-file formation moving slowly across a moor as if processing toward an unseen destination',
      'GHOST-BELL RIPPLES IN MIST — visible concentric ripples expanding through fog as a phantom bell tolls across the silent landscape, the toll itself silent',
      'IMPOSSIBLE LIT-WINDOW BLINKING — a single window in a distant abandoned tower glowing candle-amber and visibly blinking on-off-on in slow rhythm',
      'SHADOWS OF UNSEEN WINGS — vast shadow shapes of bird-wings passing across the moonlit landscape with no actual bird visible overhead, the shadows moving in slow gyre',
      "UNNATURAL FOG-CURTAIN SPLIT — a wall of fog suddenly splits down the middle to reveal a distant Gothic structure that wasn't there moments before, the fog re-closing slowly",
      'DISTANT FIGURE-SHAPE VANISHING — a humanoid silhouette barely visible in the mist at deep distance, half-formed and dissolving as the camera resolves on it',
      'MOANING LOW WIND MOVING ONLY CERTAIN LEAVES — wind that visibly moves only specific dead-leaf clusters across the landscape, the rest of the foliage still, suggesting something invisible passes through',
      'RAVENS FORMING LETTERS IN FLIGHT — a murder of crows arranged in flight-formation that resolves momentarily into letters or sigils in the violet sky before dispersing',
      'WATCHING-EYES IN TREE-HOLLOW — a pair of glowing pale-green eyes visible in a distant tree-hollow at midground edge, blinking once, then gone',
      'WITCH-FIRE AURORA BREATHING — vast green-violet aurora across the sky that visibly inhales-and-exhales in slow rhythm, the colors deepening on the exhale',
      'BAT-STREAM FORMING SPIRAL — vast stream of bats forming a slow spiraling vortex above a ruined cathedral, the vortex-center filled with witch-fire green light',
      'PHANTOM-FUNERAL PROCESSION DISTANT — translucent procession of robed figures visible at deep distance carrying a phantom-coffin across a moor, moving slowly with phantom-lanterns',
      'GLOWING CARRION-BIRD FLOCK — vast flock of luminous spectral ravens circling overhead, their silhouettes glowing pale-green against the dark sky in slow rhythm',
      'UNHOLY-RUNE-GLOW IN GROUND — glowing red-and-violet rune-sigil scarred across the landscape ground (rare red-accent use), pulsing in slow waves visible to horizon',
      'NIGHTMARE-MOTH SWARM EYES — vast cloud of dark moths with glowing-skull-eye markings rising from the forest, the eyes appearing to watch the camera',
      'SPECTRAL HORSE-CARRIAGE FAR — translucent funeral-carriage visible crossing the landscape at deep distance, drawn by spectral horses, no driver',
      'CURSED-MIST CRAWLING LIKE SERPENTS — thick black-violet mist crawling across the ground in serpent-coil patterns, moving against the wind, occasionally rising in cobra-hood shapes',
      'BLOOD-MOON ECLIPSE — moon turning to crimson disk haloed in pale corona (use sparingly, ~10% max), the eclipse-light catching the dark-wildlife at midground',
      'WILL-O-WISP DENSE GATHERING — hundreds of pale-violet wisps swarming around a single ancient tree at midground in a slow vortex-pattern, the tree-leaves vibrating with their motion',
    ],
    instructions: `Each entry is ONE supernatural-presence phenomenon for a gothic-vista, 25-50 words. STRICT GothBot gothic dark-fantasy. Every phenomenon signals SOMETHING IS WATCHING / SOMETHING IS WRONG / THE LAND IS ALIVE. NO sci-fi / cosmic / Lovecraftian-tentacles. Use blood-moon sparingly (~10% max). Output as a NUMBERED list (1. ... 2. ... 3. ...), one entry per line.`,
  },

  gothbot_gothic_vista_surprise_element: {
    format: 'simple',
    theme: `MANDATORY DARK-WILDLIFE / SCALE-PROVER for gothic-vista scenes — the LAND-IS-ALIVE signal. Each entry 15-35 words. Castlevania / Bloodborne / Crimson-Peak visual lineage.\n\n⚠️ NO CHARACTERS / NO humanoid figures (path is pure landscape). DARK-WILDLIFE only — crows / bats / wolves / owls / fireflies / spectral wisps / single fox / single black cat.\n\n⚠️ Dark-wildlife is MANDATORY at this layer — gothic-vista requires the landscape to feel ALIVE. Render scale-prover wildlife at midground or foreground edge.\n\n✓ ALLOWED: distant crow flock / bat ribbon from belfry / wolf-pack silhouette on a ridge / single owl on a gargoyle / firefly swarm in a graveyard / single raven on a tomb-cross / moths circling unlit lanterns / spectral wisps drifting between headstones / single fox crossing a moonlit path / single black cat on a tomb-step / a vulture flock on a distant gibbet / glowing-eyed crows perched along a fence.\n\n🚫 ABSOLUTE BANS: NO human / humanoid figures. NO modern objects. NO sci-fi. NO bright/cheerful elements.`,
    touchpoints: [
      'a vast murder of crows wheeling overhead in slow ominous gyre, dozens of black silhouettes against the violet sky at midground',
      'a stream of bats pouring from a belfry like a black ribbon, the stream extending across the upper midground',
      'a wolf-pack silhouetted on a distant ridge at midground edge, fur ragged and eyes faintly luminous in moonlight',
      'a single great horned owl perched on a gargoyle at midground edge, head turned with luminous amber eyes',
      'a vast swarm of fireflies drifting through a graveyard at midground, dozens of points of pale-green light',
      'a single raven perched on a tomb-cross at midground edge, one bright eye fixed on the camera',
      'a flock of moths circling an unlit lantern at midground edge, their wing-glints catching moonlight',
      'a procession of spectral will-o-wisps drifting between headstones at midground, pale-violet glow in slow line',
      'a single fox crossing a moonlit path at midground edge, head turned to look back, fur catching silver light',
      'a single black cat on a tomb-step at midground, motionless and unnaturally still, eyes glowing pale-green',
      'a vulture flock perched on a distant gibbet at deep midground, motionless and patient',
      'a row of glowing-eyed crows perched along a weathered iron-fence at midground edge',
      'a bat-cloud passing across the moon at midground, the silhouettes a dense layer obscuring half the lunar disc',
      'a single black-feathered raven on a fallen banner-pole at midground, the banner long-rotted but the iron of the standard still hooked',
      'a flock of hell-ravens circling a tower at midground, dozens of black silhouettes against the witch-fire green window',
      'a single deer silhouette at clearing-edge at midground, its eyes glinting silver in moonlight, antlers branching',
      'a wisp-swarm converging into a spiral pattern above a barrow at midground, pale-green points moving in coordinated formation',
      'a single owl with massive luminous amber eyes perched on a tomb-cross at midground, head turned to face the camera',
      'a black-iron-bound spellbook left open on a stone pedestal at midground, pages turning by themselves in still air (atmospheric, not human)',
      'a single suit of empty cursed armor standing at midground edge, helm-visor down, sword planted in ground (no body inside)',
      'a single dark-blossom flower growing impossibly from a skull at foreground edge, black-petaled and faintly luminous',
      'a Gothic carriage-lantern fallen on its side at midground, the wax-candle within still flickering somehow',
      'a single luminous moth the size of a dinner plate perched on a fallen banner at midground edge, wings slowly fanning',
      'a partially-buried skull at foreground edge surrounded by glow-fungi, the fungi pulsing in slow rhythm',
      'a single wolf at midground center watching the camera with luminous amber eyes, fur catching moonlight',
    ],
    instructions: `Each entry is ONE dark-wildlife or atmospheric scale-prover, 15-35 words. MANDATORY dark-wildlife for the LAND-IS-ALIVE signal. NO human/humanoid figures (path is pure landscape). STRICT GothBot gothic dark-fantasy. Output as a NUMBERED list (1. ... 2. ... 3. ...), one entry per line.`,
  },

  gothbot_gothic_vista_sky: {
    format: 'simple',
    theme: `SATURATED GOTHIC SKY for a gothic-vista scene. Each entry 15-30 words. The sky is THE atmospheric anchor — SATURATED + THEATRICAL + GOTHIC. Castlevania / Bloodborne / Crimson-Peak visual lineage.\n\n⚠️ Lean toward skies that REINFORCE the alive-and-haunted vibe — aurora-rippling / bat-silhouetted / fog-crawling overhead / mist-curling / clouds-with-faces / phantom-shapes-in-stormcloud.\n\n🚫 NO sci-fi / nebulas-in-daylight / galaxy-arms / floating-islands / sky-whales / orbital structures / cheerful-blue. 🚫 NO blood-red dominant sky (red moon ~10% max). NO clear bright weather. NO LOTR / Skyrim / Witcher vocabulary.\n\n✓ GOTHIC VISTA SKIES: violet-twilight with bat-silhouettes / moonlit-violet with crow-flock / sickly-green aurora rippling / cathedral-cloud violet with painted thunder / corpse-pale overcast with phantom-army silhouettes / fel-violet storm-cloud with wing-shadows / aurora-curtained night with fireflies rising / ghost-light pale overcast / blackened-eclipse-moon haloed in violet / spectral-shapes in cloud-bank / cathedral-arch sky with light-shafts / star-streaked aurora with shooting-star streaks / twin-moon night sky / painted dawn-tear sky / cathedral-pillar god-ray sky`,
    touchpoints: [
      'Storm-bruised purple-and-violet sky with fork-lightning crackling at horizon, bat-silhouettes etched against the cloud',
      'Moonlit-violet sky with a pale-silver moon dominant, dozens of crow-silhouettes wheeling across in slow gyre',
      'Sickly green-violet aurora rippling across the night sky in slow waves, the green light casting on every surface below',
      'Lavender-indigo twilight bleeding from rose-horizon to deep-violet zenith, a single owl silhouetted on a distant spire',
      'Storm-cracked violet sky with fork-lightning illuminating bat-ribbons streaming from a distant belfry in flashes',
      'Corpse-pale overcast with phantom-army silhouettes visible in the cloud-bank, faintly luminous shapes moving',
      'Ash-fall grey-violet sky with dark flakes drifting perpetually, ravens visible silhouetted against the haze',
      'Pale-rose dusk bleeding to deep violet, a single witch-star visible at horizon, owl-silhouette on the architecture',
      'Fel-violet storm-cloud sky with wing-shadows visible moving across, no actual birds present',
      'Ghost-light pale luminescence sky with no source visible, even cold luminescence with phantom-shape outlines in cloud',
      'Blackened-eclipse moon haloed in pale red corona, surrounding sky deep-violet (use ~10% max), bats clearly visible',
      'Aurora-curtained night with green-and-violet light-curtains rippling, fireflies rising from the landscape below',
      'Cathedral-cloud violet sky with massive painted cloud-banks piled in vertical castles catching dying light, raven-flock in the lower frame',
      'Bruised-blue-violet sky with painted thunder-cloud architecture, sheet-lightning at horizon revealing bat-ribbons',
      'Twin-moon night sky with two moons hanging dim-and-pale-violet against deep-indigo, owl-silhouette on architecture',
      'Pale corpse-light overcast sky with no warmth, distant spectral-figure outlines barely visible in the cloud',
      'Ash-snow sky with slow black flakes falling perpetually from grey-violet ceiling, low cloud-cover with bat-shapes moving',
      'Violet-and-rose sunset bleeding to deep indigo at zenith, single witch-light at horizon, owl-silhouette unmistakable',
      'Storm-violet sky with sheet-lightning at horizon and fork-lightning above, bat-ribbons clearly visible in the flash',
      'Pale-silver moon haloed in faint violet corona against a violet-black sky, surrounding stars cold, raven-silhouette across the lunar disc',
      'Pyre-smoke and ash-fall sky with distant amber fires at horizon below, the cloud-cap glowing dimly, crows wheeling silhouetted',
      'Bone-white overcast sky with thin black cracks visible as if the sky itself were ceramic and breaking, bat-shapes flitting between cracks',
      'Spectral-army visible in the cloud-bank as ghostly silhouettes, the cloud lit faintly luminous from within',
      'Pale-violet corruption sky with phantom-bird silhouettes circling at altitude in slow gyre',
      'Storm-bruised violet sky with mammatus pouches and forking lightning above, every quadrant churning, ravens scattered',
    ],
    instructions: `Each entry is ONE gothic-vista sky, 15-30 words. SATURATED + THEATRICAL + GOTHIC. NEVER cheerful blue / NEVER clean daylight. STRICT GothBot dark-fantasy. NO sci-fi / cosmic / LOTR vocabulary. Lean toward skies that reinforce the alive-watching mood (bat-silhouettes / crow-flocks / phantom-shapes / aurora-rippling). Use blood-moon sparingly (~10%). Output as a NUMBERED list (1. ... 2. ... 3. ...), one entry per line.`,
  },

  // ─── GOTHBOT dark-landscape path (2026-05-15, full bespoke migration).
  // Pure gothic landscape — castles / cathedrals / cemeteries / haunted
  // wilds. NO CHARACTERS. Twilight color, vibrant haunting. Movie-poster
  // wide-vista compositions. ─────────────────────────────────────────────

  gothbot_dark_landscape_biome: {
    format: 'simple',
    theme: `GOTHIC LANDSCAPE BIOMES for GothBot's dark-landscape path. Each entry is a FULL biome description with multi-tier depth (foreground tactile / midground body / deep distance / sky context). Castlevania / Bloodborne / Crimson-Peak / Berserk / Tim-Burton / Van-Helsing / Dark-Souls / Elden-Ring visual lineage. Each entry 50-80 words.\n\n⚠️ STRICT GOTHIC DARK-FANTASY ONLY — NEVER LOTR / Skyrim / Witcher / Warcraft / DragonBot high-fantasy vocabulary. The bot lives in the BLOODBORNE / CASTLEVANIA visual world, not Tolkien's.\n\n⚠️ NO CHARACTERS in the biome description. The land is the hero. (A distant crow / bat / wolf-silhouette as atmospheric scale-prover OK, never a humanoid figure.)\n\n⚠️ MOVIE-POSTER WIDE VISTA — every biome entry reads as JAW-DROPPING. The kind of landscape that opens a Castlevania stage / Bloodborne area. SCALE-VERTIGO mandatory:\n• Cliffs that drop a thousand feet into mist\n• Vast cemeteries stretching miles\n• Cathedral spires piercing storm-clouds\n• Mountain-passes leading to distant citadels\n• Coastal cliffs above storm-wracked oceans\n• Canyon-gorges with stone aqueducts bridging the chasm\n• Vast haunted-lake foregrounds with gothic chateau across the ice\n• Aerial views over haunted villages\n\nMANDATORY in every entry:\n• A SPECIFIC GOTHIC BIOME (haunted-forest / cemetery / moorland / coastal-cliff / canyon-gorge / cursed-village / abbey-ruin / castle-approach / frozen-lake / swamp / volcanic-wasteland / etc.) named distinctly\n• MULTI-TIER DEPTH — foreground tactile detail + midground body + deep distance atmospheric layer\n• "ELEGANT DARKNESS" SIGNAL — twilight color, baroque ruin, moonlit melancholy, witch-fire glow, candle-warmth\n• A SIGNATURE FEATURE that makes this biome distinct (specific architectural ruin / specific moonlight pattern / specific witch-fire / specific gothic-flora)\n• SCALE PROVER — distant crow flock / bat silhouettes / wolf-silhouette / distant lit-window / single fog-curl — something small that makes the big things feel impossibly haunted\n\n🚫 ABSOLUTE BANS:\n• NO characters / human figures / humanoid silhouettes\n• NO LOTR / Skyrim / Witcher / Warcraft vocabulary — NEVER write "Mordor / Rivendell / Skyrim hold / Witcher path / Lothlórien / etc."\n• NO modern / industrial / sci-fi / cyberpunk / neon\n• NO single-tier flat compositions — every entry MUST describe foreground + midground + distance\n• NO "looking through stone archway at gothic building in middle distance" — banned cliché composition\n• NO blood-red-stained-glass-windows dominant in the scene — windows DARK, MOONLIT VIOLET, CANDLE-AMBER, or FEL-GREEN only\n• NO red-fog / red-mist / red-everything — palette is purple / violet / blue / green / silver / black with red as ACCENT only\n• NO blood-moon dominating the sky (red moon in at most 10% of renders) — moon is PALE SILVER / MOONLIT VIOLET / ECLIPSED with corona\n• NO interior chamber compositions — this is OUTDOOR LANDSCAPE\n\nVARIETY MANDATE — distribute roughly across these gothic-biome categories:\n\n  A. **HAUNTED FOREST / DEAD WOOD** (~15%): petrified dead trees / blackened skeletal canopy / moss-dripping cathedral-forest / blood-bark grove / will-o-wisp-haunted woodland\n  B. **CEMETERY / NECROPOLIS / GRAVE-FIELDS** (~15%): vast tombstone field / mausoleum city / above-ground crypt-row / drowned tomb-garden / catacomb-entrance plain\n  C. **CASTLE / CITADEL APPROACH** (~15%): mountain-pass approach to dark castle / cliff-top fortress silhouette / valley-floor looking up at spired citadel / fortified-bridge crossing\n  D. **CATHEDRAL / ABBEY / MONASTERY RUIN** (~10%): collapsed cathedral nave under moonlight / abbey courtyard with broken statuary / monastery-roof piercing forest canopy\n  E. **COASTAL / SEA-CLIFF / FJORD** (~10%): storm-wracked coastal cliff with lighthouse-tower / fjord with sheer black cliffs / sea-cave with gothic ruin / drowning village foreshore\n  F. **MOOR / HEATH / WIND-SWEPT LOWLAND** (~10%): heather-moor with abbey silhouette under twilight / blackthorn waste / cursed-fen with rolling fog / windswept barrows-field\n  G. **MOUNTAIN / ALPINE PASS** (~5%): mountain-pass to dark citadel / vampire-castle alpine-crag / snow-crowned dark fortress\n  H. **WETLAND / SWAMP / BOG** (~10%): half-submerged gothic ruin with will-o-wisps / corpse-marsh with dead-tree spires / drowned chapel in black-water / poisoned-fen at twilight\n  I. **CURSED VILLAGE / CITYSCAPE** (~5%): aerial view of haunted village with castle on distant hill / gothic city of red-tile-roofed houses under storm / abandoned village at dusk\n  J. **CANYON / GORGE** (~5%): canyon-gorge with stone aqueduct bridging the chasm / cliff-perch monastery / red-rock canyon with cathedral ruin\n  K. **FROZEN / WINTER LANDSCAPE** (~5%): frozen-lake foreground with gothic chateau across the ice / snow-piled cemetery / ice-rimed castle in a winter pass\n  L. **VOLCANIC / ASH WASTELAND** (~5%): volcanic plain with cracked obsidian / ash-fall ruined city / smoldering crater-field with witch-fire vents`,
    touchpoints: [
      'MOUNTAIN-PASS APPROACH TO RAVEN-CASTLE — narrow stone road winding up between sheer cliff-walls toward a multi-spire vampire-castle perched on the highest crag, the castle still half a mile distant and small in the frame; foreground: a single weathered cairn-stone with raven sigil carved into it; midground: the switchback road with mist rolling across the trail; deep distance: the castle silhouetted against violet-twilight storm-sky.',
      'VAST CEMETERY OF FORGOTTEN HOUSES — sprawling necropolis stretching to horizon with mausoleums and crypt-houses arranged in city-blocks, weathered stone-angels guarding intersections, sea of headstones and obelisks; foreground: a single tilted tombstone with worn-illegible inscription; midground: the necropolis grid receding through silver mist; deep distance: a great mausoleum-cathedral; sky: pale silver moonlight catching frost on every stone.',
      'STORM-WRACKED CLIFF FORTRESS — black-iron multi-tower fortress clinging to a basalt sea-cliff above crashing waves, lightning forking across the sky beyond it; foreground: storm-foam exploding against jagged sea-stacks; midground: the fortress with banners ripped horizontal by the gale, watchfires flickering in the wall-cages; deep distance: the storm-line at sea-horizon with sheet-lightning illuminating waves; sky: storm-violet with fork-lightning forking.',
      'COLLAPSED CATHEDRAL IN MOONLIT FOREST — Gothic cathedral ruin half-swallowed by black-bark forest, rose-window shattered showing star-bleed beyond, vines crawling up flying buttresses; foreground: fallen Gothic stone-fragment with carved-saint relief, moss-and-frost coated; midground: the cathedral nave with collapsed roof open to sky; deep distance: more forest receding into violet fog; sky: pale moonlit-violet with the moon a clean silver disk through the rose-window.',
      'CLIFF-TOP MONASTERY UNDER ECLIPSE — high-perched abbey with multiple spires reaching upward, the eclipsed moon haloed in red corona above; foreground: a single weathered stone-cross at the cliff-edge; midground: the monastery with single lit-window casting amber light into mist; deep distance: lower mountains and a valley filled with dawn-violet cloud; sky: eclipse-corona red around blackened moon, surrounding sky deep-violet.',
      'WILL-O-WISP MARSH WITH HALF-SUBMERGED CHAPEL — black-water swamp lit by dancing fey-light spots in pale-green hovering knee-height across the water, partially-drowned Gothic chapel emerging from the mire at midground; foreground: a single will-o-wisp drifting near the camera with reflected glow on the black water; midground: the chapel with broken spire and one intact stained-glass window glowing pale-violet; deep distance: dead cypress receding into mist; sky: green-tinged overcast.',
      'AERIAL VIEW OVER HAUNTED VILLAGE — high vantage looking down on a fog-shrouded valley with cursed village clustered along a black river, a vampire-castle on the distant hilltop dominating the horizon; foreground: dead-tree branches in the upper frame as a window into the scene; midground: village rooftops poking through fog with lit windows; deep distance: the castle silhouetted on the hill against twilight-violet sky.',
      'FROZEN LAKE WITH GOTHIC CHATEAU — vast frozen-lake foreground stretching to a Gothic chateau silhouette across the ice, the chateau lit warmly from within with amber lamplight; foreground: a single black-feathered raven perched on a frozen-reed stalk; midground: the ice surface with starlight reflection; deep distance: the chateau with multiple lit windows casting amber pools onto the surrounding snow; sky: aurora-purple with pale-silver moon.',
      'CANYON-GORGE WITH STONE AQUEDUCT — deep canyon spanned by a colossal stone aqueduct-bridge with multiple arch-tiers, monastery ruins clinging to one cliff-wall; foreground: cliff-edge with a gnarled dead tree clinging to the rim; midground: the aqueduct in profile, water still trickling in places; deep distance: the opposite cliff with monastery; sky: storm-bruised purple with crows wheeling in slow gyre.',
      'MOORLAND ABBEY UNDER LAVENDER SKY — windswept blackthorn moor with weathered abbey silhouette at deep distance, ancient barrow-mounds dotting the heath; foreground: a single weathered standing-stone with rune-carving worn smooth; midground: the moor stretching with scattered barrow-mounds; deep distance: the abbey with a single lit-window casting amber spot; sky: twilight-lavender bleeding to deep violet at zenith.',
      'COASTAL VILLAGE WITH GOTHIC LIGHTHOUSE-CITADEL — fishing-village clustered along storm-coast with a vast Gothic citadel-tower rising from a sea-stack offshore, storm-lantern at its summit; foreground: weathered fishing-boats overturned on the foreshore; midground: the village with lit windows; deep distance: the citadel-tower with its lit summit-beacon piercing storm-mist; sky: storm-cracked violet with sheet-lightning at horizon.',
      'BLACKTHORN-THICKET BARROW-FIELD — vast field of moss-covered barrow-mounds carpeted in blackthorn brambles, ravens nesting in the thicket; foreground: a single barrow-entrance stone with carved warning-runes; midground: the barrow-field with mist drifting low; deep distance: a tor with weathered standing-stone circle; sky: pre-dawn rose with single morning-star visible.',
      'DROWNED-FOREST SWAMP — black-water swamp filled with vertical dead-tree trunks half-submerged like cathedral pillars, glowing fungi on every trunk; foreground: dark water reflecting upward into the trunks; midground: the trunk-grove receding into mist with green fungal-glow pulsing; deep distance: a partially-drowned chapel-spire silhouette; sky: visible only as pale-violet patches between the canopy-skeletons.',
      'BLOOD-MOON FOREST CLEARING — circular forest clearing with a single ancient witch-tree at center, the eclipsed moon directly overhead through a perfect break in the canopy; foreground: a weathered stone-altar with offerings (candles, dried roses, bone-fragments); midground: the witch-tree with antler-shaped branches; deep distance: the surrounding black-bark forest; sky: eclipsed moon with red corona dominating the visible patch.',
      'GOTHIC VOLCANIC WASTELAND — vast plain of cracked black volcanic glass under perpetual ash-fall, distant ruined city silhouette emerging from haze; foreground: a single twisted dead bramble growing impossibly from glass-cracks; midground: the plain stretching with scattered obsidian fang-spires; deep distance: the ruined city with single tower still burning amber; sky: storm-bruised purple with violet aurora.',
      'WINTER PASS TO ICE-RIMED FORTRESS — snowy mountain-pass with weathered black-stone fortress visible on the highest crag, the fortress-roofs heavy with snow and icicles; foreground: a single frostbitten dead pine clinging to the cliff-edge; midground: the pass with single trail of wolf-prints in fresh snow; deep distance: the fortress with single lit window; sky: aurora-purple with snow-dust drifting.',
      'CURSED VILLAGE AT DUSK — abandoned half-timbered Gothic village with single street running between empty houses, lit only by a single lamp-post; foreground: a dropped basket of withered roses; midground: the deserted street with lit lamp casting amber pool; deep distance: a Gothic church-spire at the end of the street; sky: post-dusk indigo with first stars appearing.',
      'POISONED FEN AT TWILIGHT — flat reed-marsh in dim twilight with rolling violet fog and scattered dead-tree skeletons, willow-of-the-wisps dancing knee-high; foreground: a single reed-cluster with a perched black-bird; midground: the marsh with fog rolling across in slow waves; deep distance: a Gothic chapel emerging from the fog with single witch-fire green window; sky: post-dusk green-purple gloom.',
      'CATACOMB-ENTRANCE PLAIN — flat barren stone-plain with a vast carved entrance to subterranean catacombs, twin colossal stone-angel statues flanking the descent; foreground: a single weathered offering-stone with melted candle stubs; midground: the catacomb-entrance with darkness within; deep distance: more carved-stone features dotting the plain; sky: pre-dawn rose with the constellation of the underworld visible.',
      'STORM-LIT ABBEY ON A SEA-STACK — solitary Gothic abbey on an isolated sea-stack with crashing waves around its base, lightning illuminating the silhouette; foreground: storm-spray exploding against weathered rocks; midground: the abbey silhouetted; deep distance: storm-line at horizon with sheet-lightning; sky: storm-violet with fork-lightning above the abbey.',
      'VAMPIRE-CASTLE OVER MIST-VALLEY — towering multi-spire vampire-castle viewed from below in a misted valley, the castle rising like a mountain of black stone with countless lit windows; foreground: a Gothic stone-bridge crossing a black river with weathered statuary; midground: the valley floor with rolling mist; deep distance: the castle silhouetted against pale-violet sky with hundreds of lit windows like a constellation; sky: violet-twilight with bat silhouettes circling.',
      'WITCH-FOREST CLEARING WITH BARROW-MOUND — small clearing in dead-bark forest with a single moss-grown barrow-mound at center, weathered carved-stone marker at the apex; foreground: a circle of pale-green witch-fire candles burning low on the forest-floor; midground: the barrow-mound with the marker; deep distance: the surrounding skeletal forest; sky: pale-violet through the canopy.',
      'GOTHIC ROCKBOUND COVE — small cove between sheer black cliffs with a single Gothic chapel on a sea-stack at center, dark waves crashing around it; foreground: a single weathered jetty with overturned boat; midground: the chapel on its sea-stack with single lit-window; deep distance: open ocean with storm-line; sky: storm-violet with pale-silver moon breaking through cloud.',
      'TOMB-GARDEN OVERGROWN WITH BLACK-ROSES — vast garden-cemetery overgrown with black-rose vines crawling across every stone-angel and tomb-cross, the garden in perpetual late-autumn; foreground: a fallen rose-petal on a weathered grave-stone; midground: the rose-vines crawling everywhere; deep distance: a central mausoleum-chapel silhouette; sky: rose-dusk with single morning star.',
      'WIND-SCOURED FORTRESS APPROACH — barren stone-and-thorn approach to a Gothic black-iron fortress with skeletal scarecrow figures impaled along the road on either side; foreground: a single tilted milestone marker with worn-runic inscription; midground: the road through thorn-and-stone toward the fortress gate; deep distance: the fortress wall and central spire; sky: storm-broken with violet lightning.',
    ],
    instructions: `Each entry is ONE gothic-landscape biome, 50-80 words. Format: "[BIOME NAME] — [primary element]; foreground [tactile detail]; midground [body of the biome]; deep distance [atmospheric/architectural layer]; sky [overhead element]". STRICT GothBot dark-fantasy (Castlevania / Bloodborne / Crimson-Peak / Berserk lineage). NO LOTR / Skyrim / Witcher vocabulary. NO characters. NO red-fog / blood-stained-windows / blood-moon dominant. NO interior chambers. Output as a NUMBERED list (1. ... 2. ... 3. ...), one entry per line.`,
  },

  gothbot_dark_landscape_architecture: {
    format: 'simple',
    theme: `GOTHIC ARCHITECTURE FOCAL POINTS for dark-landscape scenes — castles / cathedrals / abbeys / monasteries / mausoleums / fortresses / village-spires / aqueducts. Each entry 20-40 words. Castlevania / Bloodborne / Crimson-Peak / Berserk / Dark-Souls / Elden-Ring visual lineage.\n\n⚠️ STRICT GOTHIC ONLY — NO LOTR / Skyrim / Witcher / Warcraft architecture vocabulary. The structures live in the BLOODBORNE / CASTLEVANIA world.\n\n🚫 ABSOLUTE BANS:\n• NO modern (no lighthouses with electric beacons / no clocktowers with digital faces / no factories)\n• NO real-world ethnic codes (no Forbidden-City / Persian-palace / Aztec-temple)\n• NO sci-fi / cyberpunk\n• NO cheerful / bright / pristine structures — every entry is RUINED, WEATHERED, or HAUNTED\n• NO blood-red-stained-glass dominant — windows DARK or MOONLIT VIOLET or CANDLE-AMBER or FEL-GREEN\n\n✓ GOTHIC ARCHITECTURE: vampire-castles / Gothic cathedrals / ruined abbeys / cliff-perched monasteries / mausoleum-cathedrals / black-iron fortresses / spired citadels / cursed-village churches / chateau-manors / cathedral-ruins / Gothic lighthouse-towers (no electric beacon, candle-lit beacon-fire) / bell-towers / catacomb-gates / Gothic stone-aqueducts / barrows-and-cairns / sea-stack chapels / forest-shrines / blood-cult-temples.`,
    touchpoints: [
      'A multi-spire vampire-castle at deep distance — towering black-stone fortress with countless gargoyle-statues lining every battlement, multiple turret-spires, banner-tatters flying.',
      'A Gothic cathedral-ruin at midground — collapsed nave with skeletal rib-vault still visible, rose-window shattered, flying buttresses half-fallen, ivy crawling up every column.',
      'A cliff-perched abbey at deep distance — multi-roof monastery clinging to a vertical rock-face, single watchtower at the summit, lantern-light at one window.',
      'A vast mausoleum-cathedral at midground — cathedral-sized tomb with stone-angel statuary lining the approach, central iron-bound door, weathered family-crests carved above.',
      'A black-iron fortress at midground — Gothic multi-tower fortress with skeletal scarecrows at every crenellation, single gate with twin gargoyle-flanking statues.',
      'A solitary Gothic spire at deep distance — single soaring cathedral-spire emerging from forest canopy or mist, weathered to grey with iron weathervane.',
      'A cursed-village church at midground — half-timbered village chapel with collapsed roof exposing the rafters, weathered grave-yard surrounding the building.',
      'A chateau-manor at deep distance — multi-wing Gothic mansion with steep mansard roofs, dozens of pointed-arch windows, ironwork balconies, single tower at one wing.',
      'A bell-tower at midground — solitary stone bell-tower with weathered iron bell visible through arched opening, ivy crawling up the stonework, raven perched on the bell-frame.',
      'A catacomb-entrance gate at midground — colossal carved-stone gate flanked by twin stone-angel statues with broken wings, descending stair into darkness beyond.',
      'A Gothic stone-aqueduct at midground — multi-arch bridge spanning a deep gorge, weathered to grey, partial collapse in the middle, ivy and dead vines crawling up the supports.',
      'A vast necropolis-skyline at deep distance — city of tombs and mausoleums stretching to horizon, central mausoleum-cathedral dominating the silhouette.',
      'A barrow-mound at midground — moss-covered earth-mound with carved-stone marker at the apex, weathered runic inscription, surrounded by standing-stones.',
      'A sea-stack chapel at deep distance — solitary Gothic chapel on an isolated rock pillar surrounded by dark waves, single iron weathervane visible.',
      'A forest-shrine at midground — small Gothic-stone shrine in a clearing, twin candle-stands on either side of the central altar, weathered carved-saint relief.',
      'A blood-cult temple at midground — circular Gothic monastery on a hilltop with cult-sigils carved into every wall, single iron-bound door.',
      'A Gothic lighthouse-tower at deep distance — vast stone tower on a sea-stack, single candle-fire beacon at the summit (no electric), weathered with salt-rime.',
      'A drowning-chapel at midground — Gothic chapel partially submerged in black-water swamp with only the upper half of the bell-tower above the surface.',
      'A cliff-bridge fortress at midground — stone fortress straddling a deep chasm with multi-arch bridge running through its center, weathered to grey.',
      'A Gothic abbey courtyard at midground — open cloistered courtyard with collapsed roof, broken statuary lining the walkways, central well still intact.',
      'A vampire-castle gatehouse at midground — single soaring gate-tower with portcullis raised, ironwork-spike rows at the gate-arch, gargoyles flanking the approach.',
      'A black-stone observatory at deep distance — Gothic tower with domed roof open to sky for telescope-access, perched on a high crag.',
      'A Gothic cliff-monastery at deep distance — multi-tier stone monastery built into vertical rock-face, accessed only by a single rope-bridge from above.',
      'A weathered cemetery-gate at midground — wrought-iron gate with carved-stone arch, weathered to verdigris, surrounded by collapsed grave-wall.',
      'A cursed obelisk at midground — twenty-meter black-stone monolith covered in cult-runes glowing faintly red at the seams, set on a flat plain.',
    ],
    instructions: `Each entry is ONE gothic architecture focal point, 20-40 words. STRICT GothBot gothic dark-fantasy (Castlevania / Bloodborne / Crimson-Peak). NO LOTR / Skyrim / Witcher / modern / sci-fi / real-world ethnic. Positioned at MIDGROUND or DEEP DISTANCE. Output as a NUMBERED list (1. ... 2. ... 3. ...), one entry per line.`,
  },

  gothbot_dark_landscape_phenomenon: {
    format: 'simple',
    theme: `80%-gated ATMOSPHERIC PHENOMENON for a gothic dark-landscape scene — a supernatural or magical event that elevates the haunting mood. Each entry 25-50 words. Castlevania / Bloodborne / Crimson-Peak / Berserk visual lineage.\n\n⚠️ STRICT GOTHIC DARK-FANTASY — magical / supernatural events that fit Gothic horror, NOT high-fantasy. NO LOTR-coded effects.\n\n🚫 NO sci-fi / cosmic / nebulas / orbital structures. NO Lovecraftian-tentacle-horror (mild eldritch references OK).\n\n✓ GOTHIC PHENOMENA: spectral mist that moves against the wind / blood-moon eclipse (rare — at most 10%) / witch-fire green aurora / ash-fall from distant pyre / spectral apparitions in the cloud-bank / will-o-wisp swarms / ghost-bell tolling visible as mist-ripples / corpse-light glow on the horizon / black-rain-shower / phantom-army silhouette in the distance / glowing carrion-bird flocks / unholy-rune-glow across the ground / nightmare-moth swarms / spectral horse-carriage in deep distance / a witch's tower-light cast on cloud-bank / hellfire-pit smoke columns / spectral-funeral procession visible at distance / cursed-mist crawling like serpents`,
    touchpoints: [
      'SPECTRAL MIST AGAINST THE WIND — wall of pale violet mist advancing across the landscape against prevailing wind, faces almost visible within the curling vapor',
      'WITCH-FIRE GREEN AURORA — corrupted aurora rippling across the sky in poisoned green-and-violet curtains, casting acid-green light on every surface below',
      'ASH-FALL FROM DISTANT PYRE — slow black ash-flakes drifting down like snow across the landscape, the source-pyre visible burning amber at horizon',
      'SPECTRAL APPARITION IN CLOUD-BANK — ghostly figure formed of pale mist visible in the distant cloud-bank, holding shape for moments before dissolving',
      'WILL-O-WISP SWARM AT MIDGROUND — dozens of pale-green phantom-lights drifting at knee-height across the landscape in misleading directions',
      'GHOST-BELL RIPPLES IN MIST — visible concentric ripples expanding through fog as a phantom bell tolls across the silent landscape',
      'CORPSE-LIGHT HORIZON GLOW — pale-green corpse-light shimmering on the horizon line, marking some distant cursed event, the light pulsing slowly',
      'BLACK-RAIN SHOWER — slow black raindrops falling perpendicular across the scene, the ground beneath stained dark with each strike',
      'PHANTOM-ARMY DISTANT SILHOUETTE — translucent army of soldiers visible at deep distance marching across the plain, faintly luminous and slowly fading',
      'GLOWING CARRION-BIRD FLOCK — vast flock of luminous spectral ravens circling overhead, their silhouettes glowing pale against the dark sky',
      'UNHOLY-RUNE-GLOW ACROSS GROUND — glowing red-and-violet rune-sigil scarred across the landscape ground, pulsing in slow waves visible to horizon',
      'NIGHTMARE-MOTH SWARM — vast cloud of dark moths with glowing-skull markings rising from the forest, blotting out the distant moon',
      'SPECTRAL HORSE-CARRIAGE AT DISTANCE — translucent funeral-carriage visible at deep distance crossing the landscape, drawn by spectral horses, no driver',
      "WITCH'S TOWER-LIGHT ON CLOUDS — single beam of violet light from a distant witch's tower cast upward onto the cloud-bank, illuminating the underside of the storm",
      'HELLFIRE-PIT SMOKE COLUMNS — twin or triple columns of black smoke rising from distant hell-vents in the landscape, each column glowing amber at the base',
      'SPECTRAL FUNERAL PROCESSION — translucent procession of robed figures visible at deep distance with lantern-flickers, moving slowly across the moor',
      'CURSED-MIST CRAWLING LIKE SERPENTS — thick black-violet mist crawling across the ground in serpent-coil patterns, moving against the wind, occasionally rising in cobra-hood shapes',
      'BLOOD-MOON ECLIPSE — moon turning to crimson disk haloed in pale corona, hanging massive over the landscape (use sparingly, ~10% of renders)',
      'SICKLY GREEN GOD-RAY — single thick column of acid-green light piercing through corrupted cloud-cover onto a single point of the landscape',
      'CORRUPTED FALLING STARS — meteor-streaks across the night sky burning black-red instead of white, each leaving a dim ash-trail',
      'PHANTOM-BELL TOLL RIPPLES — visible ripples expanding through mist as a phantom bell tolls, the toll itself silent but the ripples spread visibly',
      "LICH-AURA HORIZON GLOW — pale-violet glow on the horizon marking a distant lich-king's active influence, the light pulsing slowly in time with unseen heartbeat",
      'PERPETUAL ASH-SNOW — slow black ash-flakes falling like snow across the landscape, accumulating in drifts of grey-black on every surface',
      'WILL-O-WISP DENSE GATHERING — hundreds of pale-violet wisps swarming around a single ancient tree at midground in a slow vortex-pattern',
      'PHANTOM-AIRSHIP SILHOUETTE — translucent Gothic dirigible visible at deep distance, glowing pale-green within, drifting silently across the sky',
    ],
    instructions: `Each entry is ONE atmospheric phenomenon for a gothic dark-landscape, 25-50 words. STRICT GothBot gothic dark-fantasy. NO sci-fi / cosmic / Lovecraftian-tentacles / high-fantasy LOTR vocabulary. Use blood-moon sparingly (~10% max). Output as a NUMBERED list (1. ... 2. ... 3. ...), one entry per line.`,
  },

  gothbot_dark_landscape_surprise_element: {
    format: 'simple',
    theme: `TINY SECONDARY SUBJECTS for a gothic dark-landscape — small details implying the wider haunting. Each entry 15-35 words. Castlevania / Bloodborne / Crimson-Peak visual lineage.\n\n⚠️ NO CHARACTERS / NO humanoid figures (not even tiny scale-prover figures). The dark-landscape path is PURE LANDSCAPE per Kevin's spec. Scale-provers are crow / bat / wolf-silhouette / objects / animals — never people.\n\n✓ ALLOWED scale-provers: distant crow / bat / raven flock / wolf silhouette / lone deer at clearing-edge / black-feathered owl on a stone / fox crossing the path / weathered standing-stone / fallen banner / abandoned grave-marker / cult-sigil scratched in bark / dropped lantern / weathered cairn / overgrown statue.\n\n🚫 ABSOLUTE BANS: NO human/humanoid figures. NO modern objects. NO sci-fi. NO bright/cheerful elements.`,
    touchpoints: [
      'a single black-feathered raven perched on a weathered tombstone at midground edge, one bright eye fixed on the camera, holding very still',
      'a flock of carrion-crows wheeling overhead in slow gyre, dozens of black silhouettes against the twilight sky at deep midground',
      'a single wolf silhouette standing at a rock-outcrop at midground edge, fur ragged and eyes faintly luminous in moonlight',
      'a black-bird perched on a fallen-banner standard at midground, the banner-fabric long-rotted but the iron of the standard still standing',
      "a fallen knight's helm half-buried in the road-dust at foreground edge, dark-tarnished and weather-beaten",
      'a single bat silhouette darting across the midground, wings caught in starlight',
      'a fox crossing a forest-path at midground edge, head turned to look back, fur catching moon-silver light',
      'a weathered standing-stone at midground edge, single rune carved deep, listing slightly with age',
      'a cult-sigil scratched fresh into the bark of a dead tree at foreground edge, paint still wet-looking',
      'a tattered Gothic banner-pole at midground, fabric long-rotted but the rusted iron of the standard still hooked',
      'a fallen war-helm with broken plumes resting at the foot of a black-iron statue, weather-beaten',
      'an abandoned carriage half-overgrown with black-thorn vines at midground edge, its passengers long-gone',
      'a single black cat (slightly oversized, perhaps not entirely natural) perched on a tomb-step at midground, motionless and unnaturally still',
      'a vulture flock visible on a distant gibbet at deep midground, perched and patient',
      'a partially-buried skull at foreground edge, weathered smooth but with faint dark-rune carvings',
      'a deer silhouette at clearing-edge at midground, its eyes glinting silver in moonlight',
      'a flock of glowing-eyed crows perched along a weathered fence at midground edge',
      'a single owl with massive luminous amber eyes perched on a tomb-cross at midground, head turned to face the camera',
      'a black-iron-bound spellbook left open on a stone pedestal at midground, pages turning by themselves in still air',
      'a single suit of empty cursed armor standing at midground edge, helm-visor down, sword planted in ground',
      'an obsidian dagger embedded blade-down in the foreground at edge of frame, runic-etched and faintly glowing',
      'a single dark-blossom flower growing impossibly from a skull at foreground edge, black-petaled and faintly luminous',
      'a Gothic carriage-lantern fallen on its side at midground, the wax-candle within still flickering somehow',
      'a weathered tombstone with worn-illegible inscription at midground edge, vine-strangled',
      'a single luminous moth the size of a dinner plate perched on a fallen banner at midground edge',
    ],
    instructions: `Each entry is ONE tiny secondary subject, 15-35 words. NO human/humanoid figures (path is pure landscape). Scale-prover animals / objects / supernatural-detail only. STRICT GothBot gothic dark-fantasy. Output as a NUMBERED list (1. ... 2. ... 3. ...), one entry per line.`,
  },

  gothbot_dark_landscape_sky: {
    format: 'simple',
    theme: `GOTHIC TWILIGHT SKY for a dark-landscape scene. Each entry 15-30 words. The sky is THE atmospheric anchor — never washed-out, always SATURATED + THEATRICAL + GOTHIC.\n\n⚠️ STRICT GOTHIC DARK-FANTASY — Castlevania / Bloodborne / Crimson-Peak visual lineage.\n\n🚫 NO sci-fi / nebulas-in-daylight / galaxy-arms / floating-islands / sky-whales / orbital structures / cheerful-blue. 🚫 NO blood-red dominant sky (red moon ~10% max). NO clear bright weather. NO LOTR / Skyrim / Witcher vocabulary.\n\n✓ GOTHIC SKIES: violet-twilight / moonlit-violet / silver-moonlight / storm-bruised purple / sickly-green aurora / pale-rose dusk / lavender-indigo twilight / fel-violet storm-cloud / corpse-pale overcast / ash-fall grey / ghost-light pale luminescence / blackened-eclipse-moon / aurora-curtained night / cathedral-cloud lavender / bruised-blue-violet`,
    touchpoints: [
      'Storm-bruised purple-and-violet sky with fork-lightning crackling at horizon, mammatus pouches visible at high altitude',
      'Moonlit-violet sky with a clean pale-silver moon dominant, surrounding stars cold-pale, no clouds',
      'Sickly green-violet aurora rippling across the night sky in slow waves, the green tint catching every surface below',
      'Lavender-indigo twilight bleeding from horizon-rose to zenith-deep-violet, single morning-star visible',
      'Storm-cracked violet sky with fork-lightning illuminating dark architecture below in stark flashes',
      'Corpse-pale overcast with phosphorescent green tint, no warmth, everything cast cold',
      'Ash-fall grey-violet sky with dark flakes drifting perpetually, no sun or moon visible behind the haze',
      'Pale-rose dusk bleeding to deep violet at zenith, single witch-star visible at horizon',
      'Fel-violet storm-cloud sky with sickly violet glow at cloud-edges, no stars visible',
      'Ghost-light pale luminescence sky with no source visible, even cold luminescence everywhere',
      'Blackened-eclipse moon haloed in pale red corona, surrounding sky deep-violet (use ~10% max)',
      'Aurora-curtained night with green-and-violet light-curtains rippling across, casting magical glow on the landscape',
      'Cathedral-cloud sky with massive painted cloud-banks piled in vertical castles catching dying violet light',
      'Bruised-blue-violet sky with painted thunder-cloud architecture, single sheet-lightning at horizon',
      'Twin-moon night sky with two moons hanging dim-and-pale-violet against deep-indigo, blood-stained accent on both',
      'Pale corpse-light overcast sky with no warmth, everything cast in cold luminescence',
      'Ash-snow sky with slow black flakes falling perpetually from grey-violet ceiling, low cloud-cover',
      'Violet-and-rose sunset bleeding to deep indigo at zenith, single witch-light at horizon',
      'Storm-violet sky with twin sheet-lightning at horizon and forked-lightning above, mammatus pouches at high altitude',
      'Pale-silver moon haloed in faint violet corona against a violet-black sky, surrounding stars cold',
      'Pyre-smoke and ash-fall sky with distant amber fires visible at horizon below, the cloud-cap glowing dimly',
      'Bone-white overcast sky with thin black cracks visible as if the sky itself were ceramic and breaking',
      'Spectral-army visible in the cloud-bank as ghostly silhouettes, the cloud lit faintly luminous from within',
      'Pale-violet corruption sky with phantom-bird silhouettes circling at altitude',
      'Storm-bruised violet sky with mammatus pouches and forking lightning above, every quadrant churning',
    ],
    instructions: `Each entry is ONE gothic twilight sky, 15-30 words. SATURATED + THEATRICAL + GOTHIC. NEVER cheerful blue / NEVER clean daylight. STRICT GothBot dark-fantasy. NO sci-fi / cosmic / LOTR vocabulary. Use blood-moon sparingly. Output as a NUMBERED list (1. ... 2. ... 3. ...), one entry per line.`,
  },

  // ─── GOTHBOT vampire-hunter-in-action path (2026-05-22 migration).
  // SOLO hunter on-the-prowl, vampire OFF-CAMERA. Belmont / Witcher /
  // Van Helsing / Cossack / Wallachian / etc. — period 1500s-1800s.
  // Face-readable mandate (hood-down ~40%), masculine build, NO bishonen.
  // ──────────────────────────────────────────────────────────────────

  gothbot_vhia_hunter_archetype: {
    format: 'simple',
    theme: `HUNTER ARCHETYPES for GothBot's vampire-hunter-in-action path — period vampire-hunter identity / lineage / role / vibe. Each entry 18-30 words.

⚠️ Each entry weaves into ONE prose sentence: archetype name with lineage (Belmont-descendant / Witcher-trained / Van Helsing / older priest-hunter / Cossack vampire-rider / Borgia-purged exorcist / Wallachian boyar / etc.), ONE core trait (battle-scarred / haunted / methodical / cold predator / weary veteran), ONE masculine build cue (broad shoulders / heavy frame / weathered — never bishonen/pretty-boy), and ONE distinctive visual signature (specific hair color+style, OR specific facial detail like scar/eye-patch/tattoo, OR specific head-style like HOOD-DOWN / bare-headed / wide-brim hat / leather skullcap). Every hunter must be VISUALLY DISTINCT, not interchangeable.

⚠️ FACE-READABLE MANDATE — the hunter's face is rendered (not "shadowy" / not "hooded silhouette"). ~40% of entries explicitly state HOOD DOWN or BARE-HEADED. ~60% can have hood/hat but face still lit and readable.

VARIETY MANDATE — distribute the batch across these lineages so no two entries share one:
  • Belmont-descendant — blooded whip-hunter from cursed Belmont line
  • Witcher-trained mutant — silver-haired killer with cat-slit eyes, School of Wolf / Cat / Viper / Manticore / Griffin / Bear trade-hunter
  • Van Helsing professor-warrior — Dutch occult-academic gone field-hunter, kit-laden
  • Older priest-hunter — gaunt Tridentine padre with stake-rosary, weathered cassock
  • Cossack vampire-rider — saber-and-pistol hetman in fur-trimmed coat
  • Wallachian boyar — disinherited noble turned vampire-killer, fur-edged longcoat
  • Borgia-purged exorcist — defrocked Italian inquisitor with engraved silver
  • Caribbean tropical-port hunter — sun-scarred privateer turned vampire-killer
  • Irish brawler-priest — fist-and-stake hunter from a Galway monastery
  • Welsh moor-tracker — silent killer who reads spoor like a script, longbow + crossbow
  • Romani caravan-hunter — clan-elder with bone-knife and salt-pouch
  • Spanish flamenco-blade — duelist with rapier and crucifix, weathered olive skin
  • Bohemian alchemist-hunter — silver-mercury alchemist with dark goggles
  • Carpathian woodsman — taciturn forest-tracker with axe and silver-tipped pike
  • Black Forest dragoon — Imperial cavalryman seconded to vampire-hunt detail
  • Anatolian dervish-hunter — twin-saber whirling-style hunter from a heretic order
  • Cathar wandering-hunter — last of a purged heresy, blade and grimoire
  • Hessian deserter-hunter — heavy-built cuirassier turned freelance hunter
  • Greek klepht — mountain-bandit-turned-hunter, silver pistol and yataghan
  • Mexican vaquero-hunter — sun-weathered cattle-driver turned vampire-killer with silver bolas
  • Scottish highlands rievier — kilted clansman-hunter with claymore and dirk

ABSOLUTELY BANNED:
  - NO bishonen / NO femboy / NO pretty-boy / NO androgynous / NO K-pop-idol / NO smooth baby-face
  - NO modern-uniform descriptions
  - NO blood / gore
  - NO LOTR / Skyrim / Witcher-game-canon-only vocabulary mixed in — GothBot is period-grounded gothic`,
    touchpoints: [
      'Cursed Belmont bloodline carrier, broad-shouldered and battle-scarred, long copper hair tied back, cheek-scar permanent, whip coiled at hip, hood down.',
      'Wolf School Witcher mutant, heavy-framed silver-haired killer with cat-slit amber eyes, blade-nicked brow, trades monster contracts for vampire heads.',
      'Dutch occult-academic turned field-hunter, weathered and methodical, iron-grey hair, silver-streaked beard, kit-pouches buckled across leather chest-piece.',
      'Gaunt Tridentine padre, weary veteran of thirty exorcisms, close-cropped steel-grey hair, hollow-eyed, stake-rosary wrapped around knuckled fist, bare-head.',
      'Saber-and-pistol Cossack hetman, heavy-framed and haunted, shaved skull with long oseledets topknot, iron-grey drooping mustache, fur-trimmed coat.',
      'Disinherited Wallachian boyar turned vampire-killer, broad-shouldered cold predator, long dark-brown hair tied back, nose-bridge scar, fur-edged longcoat.',
      'Defrocked Italian inquisitor purged by the Borgias, slicked black hair silvering at temples, pepper-grey beard, jaw burn-scar, hood down.',
      'Sun-scarred Caribbean privateer turned vampire-killer, broad-shouldered with red-brown dreadlocks, lip-scar, cutlass at hip, tricorn knocked back on shoulders.',
      'Irish brawler-priest, broken nose, calloused fists, close-cropped chestnut hair, full red-brown beard, leather skullcap snug, lapsed-cleric vestments.',
      'Welsh moor-tracker, silent and gaunt, long iron-grey hair in a single braid down his back, weathered tan, longbow strapped across body, wide-brim hat.',
      'Romani caravan-elder turned hunter, leathery sun-creased face, salt-and-pepper beard threaded with bone beads, dark eyes, rust-red cloth-wrap over hair.',
      'Spanish flamenco-blade duelist, weathered olive skin, slicked black hair in a low tail, neat black mustache and short beard, crucifix at chest, bare-head.',
      'Bohemian alchemist-hunter, gaunt with shaved temples and long top-knotted black hair, mercury-stained fingertips, dark smoked-glass goggles on his brow.',
      'Carpathian woodsman, taciturn and broad, full ash-blond beard and shoulder-length tied-back hair, deep crow-foot wrinkles, leather skullcap, axe on hip.',
      'Black Forest Imperial dragoon seconded to the vampire-hunt detail, broad-shouldered, neat blond mustache, fully bare-head with cropped sides, scarred jaw.',
      'Anatolian dervish-hunter from a heretic order, lean and coiled, long jet-black hair under a tightly wound dark turban, kohl-rim eyes, twin sabers crossed.',
      'Hessian deserter cuirassier turned freelance hunter, heavy-built and stoic, close-cropped iron-grey hair, mutton-chop sideburns, domed steel helm under arm.',
      'Greek klepht mountain-bandit-turned-hunter, weathered olive skin with sun-creased smile-lines, long curly black hair bound back, silver-streaked beard, bare-head.',
      'Mexican vaquero-hunter, sun-darkened skin with twin scars at the temple, long black braided hair under wide-brim sombrero pushed back, silver bolas at belt.',
      'Scottish highlands rievier, broad-built and freckled, fiery red hair in a thick braid, full red beard, claymore strapped across back, bare-head in the cold.',
      'Cathar wandering-hunter, last of a purged heresy, gaunt and ascetic, shaved head with a single dark cross-tattoo at the brow, grimoire chained to his belt.',
      'Eastern-Orthodox staritz-hunter, ancient priest with waist-long white beard and white hair, sunken cheeks, leather-bound icon hanging at neck, hood down.',
      'Ottoman janissary-deserter turned vampire-hunter, lean and dangerous, deep olive skin, slicked-back black hair, neat goatee, white turban-cloth wrapped low.',
      'Portuguese cartographer-hunter, weathered tan, long pepper-grey hair tied loose, full grey beard, eye-patch over one socket, wide-brim leather field-hat.',
    ],
    instructions: `Each entry is ONE prose sentence, 18-30 words. Weaves archetype-name + masculine build + visual signature into one flowing description — NEVER a JSON object, NEVER bullet-pointed sub-fields. ~40% explicitly state HOOD DOWN or BARE-HEAD. Strict gothic-period (1500s-1800s lineage). Output as a NUMBERED list (1. ... 2. ... 3. ...), one entry per line.`,
  },

  gothbot_vhia_outfit_silhouette: {
    format: 'simple',
    theme: `HUNTER OUTFIT / SILHOUETTE descriptions for GothBot's vampire-hunter-in-action path — field-worn gothic-hunter kit. Each entry 18-30 words.

⚠️ Each entry is ONE flowing prose sentence describing the outfit + silhouette + head-style — NOT a JSON object, NOT prefixed with a bracketed category header like [HOOD DOWN].

⚠️ CHEST FULLY COVERED MANDATE — every outfit covers the chest fully (heavy armor / longcoat / chainmail / robes / cassock / brigandine / cuirass / gambeson). NEVER bare chest, NEVER shirtless, NEVER ripped-shirt-with-abs, NEVER open-coat-to-navel, NEVER sleeveless tank.

⚠️ HEAD-STYLE VARIETY — across the batch, distribute roughly:
  • ~32% HOOD DOWN — face fully visible, hair readable
  • ~20% BARE-HEAD — specific hair-style stated (long silver / iron braid / cropped black / red-brown shoulder-length / etc.)
  • ~16% WIDE-BRIM HAT — Tridentine priest-hat / cowboy-style / Witcher-broad-brim / leather field-hat / sombrero
  • ~12% CLOTH-WRAP / SCARF / TURBAN over hair, leaving face visible
  • ~12% LEATHER SKULLCAP / DOMED HELMET / METAL HELM
  • ~8% HOOD UP but face lit and readable (kohl-rim eyes / jaw / mouth visible)

OUTFIT LINEAGES (rotate widely across the batch):
  • Belmont leather longcoat with brass-buckle chest-plate, garlic-braid bandolier, knee-high field-boots
  • Witcher armored leather double-jerkin, steel pauldrons, dark fingerless gloves, sword-harness across back
  • Van Helsing kit-laden duster, brass-buckle holsters, holster-belt with stakes + flasks, leather chest-piece
  • Tridentine cassock with mail underlayer, leather pectoral cross, dark wide-brim hat, stake-rosary at belt
  • Cossack fur-trimmed greatcoat, leather knee-boots, silver-cross sash, saber + pistols cross-belt
  • Wallachian boyar fur-edged longcoat, embroidered chest-plate underneath, dark riding-boots, sword-belt
  • Borgia exorcist black robes with silver-embroidered hem, fingerless leather gloves, hooded cowl
  • Privateer-turned-hunter tropical longcoat with brass buttons, leather chest-plate, cross-belt of silver bullets
  • Irish brawler-priest leather jerkin over chainmail shirt, leather greaves, holy-rune wrap-bracers
  • Welsh moor-tracker oilskin longcoat with hood, leather hunting-vest, knee-boots, longbow + crossbow
  • Romani caravan-hunter waxed-canvas coat with scrap-leather chest-piece, scarf + amulets, ankle-boots
  • Spanish flamenco-blade dark-velvet doublet, silver-thread embroidery, knee-boots, cross-pendant at chest
  • Bohemian alchemist long dust-grey duster over chemical-stained leather apron, brass goggles at brow
  • Carpathian woodsman heavy fur-lined leather greatcoat, mail-shirt visible at collar, hatchet-belt
  • Hessian dragoon cuirass over dark wool tunic, brass-buttoned greatcoat, riding-boots, sabretache at hip
  • Anatolian dervish dark-indigo robes with leather chest-piece beneath, twin-saber cross-belt
  • Greek klepht embroidered black wool coat over mail-shirt, embroidered waistcoat, calf-laced boots
  • Mexican vaquero long brown leather duster, silver-conchoed chest-strap, riding-boots, sun-faded poncho
  • Scottish rievier wool-tartan plaid wrapped across mail-shirt chest, leather doublet, knee-boots
  • Cathar simple grey monk-robe over mail-shirt, leather cord-belt, leather sandals over knee-wraps
  • Portuguese cartographer canvas longcoat over leather chest-piece, brass-instrument satchel, riding-boots

EVERY outfit MUST:
  - Cover the chest fully (heavy armor / longcoat / chainmail / robes / cassock)
  - Have field-worn detail (dirt-streaked / dented / scuffed boots / scratched gauntlets / mud-caked / blood-faded)
  - Define silhouette (longcoat billow / hood / sword-harness / cross-belt)
  - State the head-style explicitly (HOOD DOWN / bare-head / wide-brim / cloth-wrap / leather skullcap / metal helm / hood up)

ABSOLUTELY BANNED:
  - NO bare chest / NO shirtless / NO ripped-shirt / NO open-to-navel / NO sleeveless tank-top
  - NO modern clothing / NO jeans / NO sneakers / NO trench coat (no buttons through cocktail-coat)
  - NO bishonen-pretty outfits / NO K-pop-idol stage costume
  - NO bracketed category headers like [HOOD DOWN] — weave the head-style into the prose`,
    touchpoints: [
      'Belmont leather longcoat, brass-buckle chest-plate dented from claws, garlic-braid bandolier, knee-high scuffed boots, hood down revealing close-cropped hair.',
      'Van Helsing kit-laden duster over leather chest-piece, holster-belt heavy with stakes and flasks, brass-buckle holsters, wide-brim leather hat pulled low.',
      'Witcher armored double-jerkin with steel pauldrons scratched silver-bright, sword-harness across fully covered back, dark fingerless gloves, bare-head with silver hair.',
      'Irish brawler-priest leather jerkin over chainmail shirt, holy-rune wrap-bracers, leather greaves mud-caked, leather skullcap tight over close-cropped chestnut hair.',
      'Tridentine cassock with mail underlayer, leather pectoral cross, stake-rosary at belt, dark wide-brim hat tipped back, knuckled rosary visible.',
      'Romani caravan-hunter waxed-canvas coat over scrap-leather chest-piece, amulets layered at collar, ankle-boots scuffed raw, rust-red cloth-wrap over salt-and-pepper hair.',
      'Cossack fur-trimmed greatcoat buttoned tight over chest, silver-cross sash diagonal, saber and pistols on cross-belt, fur-edged shapka pulled low over shaved temples.',
      'Borgia exorcist black robes with silver-embroidered hem, fingerless leather gloves, deep hood up but candle-light catches jaw, mouth, and kohl-rim eyes.',
      'Wallachian boyar fur-edged longcoat over embroidered brigandine, dark riding-boots scuffed to grey, sword-belt heavy with sabre, bare-head with long dark-brown tied-back hair.',
      'Spanish flamenco-blade dark-velvet doublet over chainmail, silver-thread embroidery, knee-boots dust-streaked, cross-pendant at chest, bare-head with slicked black hair.',
      'Welsh moor-tracker oilskin longcoat with hood pushed back, leather hunting-vest over wool tunic, knee-boots mud-caked, longbow strapped across back, iron-grey braid.',
      'Bohemian alchemist long dust-grey duster over chemical-stained leather apron, brass goggles at brow, hood-up cowl shadows half the face but candle-light catches kohl eyes.',
      'Carpathian woodsman heavy fur-lined leather greatcoat over mail-shirt, leather skullcap snug over ash-blond braid, hatchet-belt at waist, knee-boots laced tight.',
      'Hessian dragoon cuirass over dark wool tunic, brass-buttoned greatcoat slung open at the sides, riding-boots, domed steel helm under one arm, bare-head with cropped grey hair.',
      'Anatolian dervish dark-indigo robes with leather chest-piece beneath, twin-saber cross-belt, dark turban wrapped tight low over the brow leaving kohl-rim eyes visible.',
      'Greek klepht embroidered black wool coat over mail-shirt, embroidered waistcoat, calf-laced boots, silver-streaked beard, bare-head with long curly bound-back hair.',
      'Mexican vaquero long brown leather duster, silver-conchoed chest-strap over a faded poncho, riding-boots dusty, wide-brim sombrero pushed back on the cord behind the neck.',
      'Scottish rievier wool-tartan plaid wrapped across mail-shirt chest, leather doublet beneath, knee-boots laced, claymore on back, bare-head with red braid down the spine.',
      'Cathar simple grey monk-robe over mail-shirt, leather cord-belt knotted, leather sandals over knee-wraps, hood down revealing shaved head and dark brow-cross tattoo.',
      'Portuguese cartographer canvas longcoat over leather chest-piece, brass-instrument satchel diagonal, riding-boots scuffed, wide-brim leather field-hat pushed back, eye-patch visible.',
      'Ottoman janissary-deserter dark-indigo kaftan over chainmail shirt, silver-buttoned closure, leather sword-belt with yataghan, white turban-cloth wrapped low over slicked-back hair.',
      'Eastern-Orthodox staritz-hunter heavy black wool cassock over chainmail, leather-bound icon hanging at neck, knotted prayer-rope at belt, hood down revealing waist-long white beard.',
      'Caribbean privateer-turned-hunter long red coat over leather chest-piece, brass-buttoned closure, cross-belt of silver-shot, knee-boots salt-stained, tricorn knocked back on shoulders.',
      'Belmont leather longcoat short-cut over chain-vest, leather bracers etched with crosses, knee-high field-boots, whip coiled at hip, leather skullcap snug over close-cropped copper hair.',
    ],
    instructions: `Each entry is ONE prose sentence, 18-30 words. Weaves outfit + silhouette + head-style into one flowing description — NEVER a JSON object, NEVER bracketed-headed like [HOOD DOWN]. Every entry covers the chest fully. Output as a NUMBERED list (1. ... 2. ... 3. ...), one entry per line.`,
  },

  // ─── GOTHBOT goth-male-full-body-axis path (2026-05-22 R2 RESET).
  // Elite VAMPIRE HUNTER full-body cinematic poster moment. John Wick of
  // vampire hunters — Belmont / Witcher / Van Helsing / Blade / Hellsing /
  // Underworld Death-Dealer / Castlevania Trevor / Constantine.
  // STRAPPED with multiple visible weapons. Cool / mysterious / forboding.
  // NEVER vampires/warlocks/mages/liches/demonologists.
  // ──────────────────────────────────────────────────────────────────

  gothbot_gmfb_character_archetype: {
    format: 'simple',
    theme: `ELITE VAMPIRE HUNTER ARCHETYPES for GothBot's goth-male-full-body-axis path. Each entry is ONE 18-28 word prose sentence describing a CLASSIC-LORE vampire hunter — the John Wick of vampire hunters. Cool, mysterious, forboding, badass. Strong masculine build, ANY ADULT AGE.

⚠️ AGE DISTRIBUTION MANDATE (critical — pool was over-clustering at "old grizzled veteran"):
  • ~30% YOUNG (20s to early 30s) — sharp, lean, dangerous, fresh, hungry, prodigy, dark-haired, clean-shaven or light stubble
  • ~45% PRIME (mid-30s to mid-40s) — peak professional, methodical, focused, full-color hair, clean-shaven or short trimmed beard
  • ~25% VETERAN (45+) — weathered, scarred, weary, salt-and-pepper or silver-streaked hair, full beard OK
  Do NOT default every entry to "weathered veteran" / "battle-scarred elder" / "weary hunter." Mix the age register across the batch.

⚠️ ONLY vampire HUNTERS — NEVER vampires, NEVER warlocks, NEVER mages, NEVER liches, NEVER demonologists, NEVER cultists, NEVER necromancers. He is the GUY WHO KILLS vampires.

⚠️ Each sentence weaves: hunter lineage / archetype name + masculine build cue + identity vibe (forboding / cool / methodical / focused / elite-professional / hungry / lethal). Output ONLY a JSON array of plain strings.

REFERENCE LINEAGES (vary widely):
  • Belmont-line whip-hunter (Castlevania-canonical)
  • Witcher of the School of Wolf / School of Cat / School of Viper (vampire-contract trade)
  • Van Helsing tradition occult-professor-warrior
  • Blade-coded dhampir vampire-killer
  • Hellsing-style elite Vatican-occult vampire-hunter
  • Castlevania Trevor / Richter / Soma-coded combat hunter
  • Underworld Death-Dealer (male, post-vampire mortal)
  • Constantine occult-investigator
  • Tridentine inquisitor-hunter with stake-rosary
  • Wallachian boyar turned vampire-killer
  • Cossack vampire-rider in fur-coat
  • Carpathian-mountain woodsman tracker
  • Spanish flamenco rapier-hunter
  • Borgia-purged exorcist
  • Pre-WWII London occult investigator with revolver
  • Ottoman janissary-deserter hunter
  • Edwardian period-amateur vampire-hunter
  • Romani caravan-elder bone-knife hunter
  • Welsh-moor longbow tracker
  • Irish brawler-priest with stakes
  • Hessian-deserter heavy-cuirassier hunter
  • Hungarian honved-hussar hunter
  • Greek-klepht silver-pistol hunter
  • Mexican-vaquero silver-bola hunter
  • Caribbean-privateer hunter
  • Eastern-Orthodox staritz hunter
  • Norse-skald axe-and-rune hunter
  • Scottish-highland claymore hunter
  • Bohemian alchemist-hunter
  • Cathar last-of-purged-heresy hunter

ABSOLUTELY BANNED:
  - NO vampires / NO warlocks / NO mages / NO liches / NO demonologists
  - NO bishonen / NO femboy / NO pretty-boy / NO androgynous / NO K-pop-idol
  - NO emo / NO smudgy-eyeliner / NO bangs-over-eyes
  - NO modern-tactical-only descriptions (period-grounded preferred)
  - NO blood / NO gore`,
    touchpoints: [
      // YOUNG (~30%) — sharp, lean, dangerous, fresh, hungry, dark-haired, clean-shaven or light stubble
      'Young Belmont-line whip-prodigy in his late twenties, sharp lean build with cropped black hair, clean-shaven jaw and hungry predator gaze.',
      'Fresh-promoted Hellsing operative in his late twenties, lean dangerous build in black leather, jet-black slicked-back hair, clean-shaven sharp jaw.',
      'Witcher School of Cat trainee in his early thirties, lean wiry build with cropped dark hair and faint stubble, cat-slit amber eyes burning hungry.',
      'Young Constantine-coded London occult-investigator in his early thirties, lean cynical build in dark coat, dark messy hair and clean-shaven jaw.',
      'Underworld Death-Dealer rookie in his late twenties, lean broad-shouldered post-vampire mortal with cropped black hair, clean-shaven, twin pistols at thighs.',
      'Young Blade-coded dhampir in his late twenties, lean cold-cut professional with shaved scalp, clean-shaven jaw, dark glasses pushed up on forehead.',
      'Sharp-jawed prodigy vampire-hunter in his late twenties, lean dangerous build, dark close-cropped hair and faint stubble, intense focused gaze.',
      'Young Spanish flamenco-blade duelist in his early thirties, lean lithe build with slicked black hair tied in a low tail, clean-shaven jaw, sharp dark eyes.',
      'Young Tridentine inquisitor-novice in his late twenties, lean ascetic build in dark cassock, cropped chestnut hair, clean-shaven sharp jaw, burning eyes.',
      'Young Wallachian boyar-heir turned vampire-killer in his early thirties, broad-shouldered cold focus with dark shoulder-length hair, neat short beard.',
      'Young Hessian dragoon-deserter in his late twenties, lean lethal vampire-hunter with neat cropped blond hair, clean-shaven, mutton-chop sideburns.',
      'Fresh Edwardian-period amateur vampire-hunter in his early thirties, gentleman in tweed coat with dark side-parted oil-slicked hair, neat moustache.',
      'Sharp-eyed Ottoman janissary-deserter in his late twenties, lean dangerous build with deep olive skin and slicked-back jet-black hair, clean-shaven.',
      'Young Carpathian woodsman-tracker in his early thirties, broad-built reader of spoor with chestnut shoulder-length hair, neat short beard, focused.',
      // PRIME (~45%) — peak professional, methodical, focused, full-color hair, clean-shaven or short trimmed beard
      'Belmont-line whip-hunter at peak in his late thirties, broad-shouldered cursed-bloodline professional with shoulder-length dark hair, neat short beard.',
      'Van Helsing tradition Dutch occult-professor-warrior at peak, mid-thirties methodical scholar with neat dark beard and kit-laden hunter gravitas.',
      'School of Wolf Witcher mutant at peak, late thirties killer with shoulder-length ash-blond hair tied back, neat short beard, cat-slit amber eyes.',
      'Hellsing Vatican-occult elite hunter at peak, late thirties focused predator in long black coat with neat dark hair and clean-shaven sharp jaw.',
      'Underworld Death-Dealer veteran at peak, early forties broad-shouldered with cropped black hair, faint stubble, twin large pistols at thighs.',
      'Castlevania Trevor-Belmont combat hunter at peak, late thirties scarred professional with brushed-back dark hair, neat short beard, focused intense gaze.',
      'Wallachian boyar turned vampire-killer at peak, early forties cold predator in fur-edged longcoat, shoulder-length dark hair tied at nape, short beard.',
      'Constantine-coded occult investigator at peak, late thirties London cynic in dark coat with messy dark hair, clean-shaven, cigarette-burn fingertips.',
      'Cossack vampire-rider hetman at peak, late thirties broad-built warrior with oseledets topknot and neat dark drooping moustache, shaved temples.',
      'Hungarian honved-hussar hunter at peak, early forties cavalry-vet in decorated dolman with brushed-back dark hair and neat dark moustache.',
      'Castlevania Alucard-coded dhampir hunter at peak, late thirties professional with long shoulder-length brushed-back dark-silver hair, clean-shaven.',
      'Pre-WWII London occult investigator at peak, early forties Edwardian gentleman in trenchcoat with side-parted dark hair, neat short beard.',
      'Romani caravan-hunter at peak, late thirties weathered killer with shoulder-length dark hair tied back, neat short black beard, bone-knife at belt.',
      'Borgia-purged Italian exorcist at peak, early forties defrocked inquisitor with slicked black hair, neat short beard, engraved silver at his belt.',
      'Mexican vaquero vampire-hunter at peak, late thirties sun-darkened killer with dark shoulder-length hair under sombrero, neat dark beard, silver bolas at belt.',
      'Norse-skald axe-and-rune hunter at peak, early forties broad warrior with chestnut shoulder-length braid and full chestnut beard, rune-tattoo at temple.',
      'Caribbean privateer-turned-hunter at peak, late thirties sun-scarred broad-shouldered killer with red-brown dreadlocks tied back, neat short beard.',
      'Scottish-highland claymore hunter at peak, early forties broad-built clansman with fiery red beard cleanly trimmed, dark red hair tied back.',
      // VETERAN (~25%) — weathered, scarred, weary, salt-and-pepper or silver-streaked hair, full beard OK
      'Veteran Belmont-line whip-hunter in his fifties, weathered scarred professional with silver-streaked dark hair and full silver-shot beard, cursed-bloodline gravity.',
      'Van Helsing tradition Dutch occult-professor-warrior veteran, late fifties methodical with iron-grey hair and full pepper-grey beard, kit-laden gravitas.',
      'Veteran Tridentine inquisitor-hunter, fifties gaunt padre with close-cropped steel-grey hair, full silver-streaked beard, hollow-eyed from thirty exorcisms.',
      'Eastern-Orthodox staritz-hunter veteran, ancient priest in his sixties with waist-long white beard and white hair, leather-bound icon at neck.',
      'Veteran Welsh-moor longbow tracker, fifties silent gaunt killer with iron-grey braid down his back and full silver-streaked beard, weathered tan skin.',
      'Veteran Cossack vampire-rider hetman, late fifties broad-built haunted warrior with oseledets topknot and iron-grey drooping moustache, weathered.',
      'Veteran Irish brawler-priest, fifties broken-nosed hardened hunter with close-cropped silver-grey hair and full silver-streaked beard, calloused fists.',
      'Veteran Bohemian alchemist-hunter, sixties gaunt with shaved temples and iron-grey top-knotted hair, mercury-stained fingertips, full silver beard.',
      'Veteran Cathar last-of-purged-heresy hunter, fifties gaunt ascetic with shaved silver scalp and dark cross-tattoo at brow, full silver-grey beard.',
      'Veteran Hessian dragoon-deserter cuirassier, fifties heavy-built stoic vampire-hunter with close-cropped iron-grey hair and mutton-chop silver sideburns.',
      'Veteran Castlevania Trevor-Belmont elder, fifties scarred professional with brushed-back silver-shot dark hair and full pepper-grey beard, weary gravity.',
      'Veteran Carpathian woodsman-tracker, sixties broad-built reader of spoor with iron-grey braid and full silver beard threaded with bone beads.',
    ],
    instructions: `Each entry is ONE prose sentence, 18-28 words. ONE elite vampire HUNTER archetype + masculine build + identity vibe woven into flowing description. NEVER a vampire/warlock/mage/lich/demonologist — only HUNTERS. Output as a NUMBERED list (1. ... 2. ... 3. ...), one entry per line.`,
  },

  gothbot_gmfb_body_pose: {
    format: 'simple',
    theme: `COOL POSTER POSES for GothBot's goth-male-full-body-axis elite vampire-hunter path. Each entry is ONE 18-28 word prose sentence describing a FULL-BODY cinematic poster-moment pose — the John Wick of vampire hunters mid-prep / loaded readiness / forboding stillness.

⚠️ MOVIE-POSTER MOMENT, not action mid-strike. Cool, mysterious, forboding. He is BETWEEN actions, or about to act. Body language reads as deadly stillness or loaded readiness.

⚠️ Output ONLY a JSON array of plain strings. No JSON objects, no bracketed prefixes.

POSE CATEGORIES (rotate widely):
  • Standing tall against gothic backdrop, weight on one leg, weapons visibly strapped
  • Leaning shoulder against pillar / archway / wall, weapon at low ready
  • Half-turned glancing back over shoulder, coat billowing, weapons visible
  • Descending stone stairs into shadow, silhouette cut against light source
  • Standing in doorway backlit, weapons cross-belted, face partially in shadow
  • Mid-load of crossbow, body still, eyes focused on the weapon
  • Tightening cross-belt strap mid-prep, weapons visibly strapped
  • Stepping out of gothic shadow into moonlight, mid-stride
  • Slowly drawing pistol or blade mid-step, deliberate calm
  • Sharpening blade on whetstone, focused work (cool hunter pose, NOT contemplative-emo)
  • Cocking flintlock or revolver mid-stride
  • Standing on a stone bridge or rooftop edge, looking out, weapons strapped
  • Holstering pistol after a clean draw, calm pose
  • One foot up on a stone step, surveying the scene, weapon resting on raised knee
  • Striking flint to light a torch, face lit by new flame
  • Reading a tattered note or wanted-poster, weapons visibly strapped
  • Wiping blade clean with a black cloth (NO blood — calm post-action pose)
  • Standing over a stone gravestone, head bowed slightly, weapons strapped
  • Stepping over a fallen banner / overturned cart, half-turn
  • Pulling hood down to reveal face, mid-step into the scene
  • Tying a leather cord at wrist, mid-prep
  • Stowing a silver coin or pendant in a pouch, mid-pose

EVERY pose tells a story: he IS doing something — but it's the cool moment, not the strike. Weapons VISIBLE in the pose.

⚠️ ABSOLUTELY BANNED:
  - NO just-standing-still / NO hands-on-hips / NO heroic-weapon-aloft / NO modeling-pose
  - NO emo slumped / NO leaning-against-wall-melancholy / NO eyes-closed-meditating
  - NO mid-combat-strike / NO mid-firing / NO blood / NO gore
  - NO seated-on-throne / NO seated-cross-legged-meditative / NO contemplative-aristocrat
  - NO pouring-chalice / NO scrying-mirror / NO ritual-sigil-drawing (he is a HUNTER, not a warlock)`,
    touchpoints: [
      'Standing tall against a fog-bound cobblestone alley, weight on one leg, coat billowing, crossbow on back and twin pistols cross-belted, gaze locked off-frame.',
      'Half-turned glancing back over his shoulder mid-step, longcoat snapping behind him, sword at hip, daggers cross-belted, eyes catching lantern-light.',
      'Descending stone cathedral steps into shadow, silhouette cut against torchlight from below, weapons visibly strapped, coat caught mid-step.',
      'Standing in a crypt-gate doorway backlit by moonlight, twin large pistols holstered at thighs, sword across back, face half in shadow.',
      'Mid-load of an iron-stirrup crossbow, body still and focused, fingers placing a silver-tipped bolt, twin pistols holstered at his hip.',
      'Tightening the strap of a leather cross-belt over his coat, mid-prep, daggers and stake-bandolier visibly arrayed across his chest.',
      'Stepping out of gothic shadow into a pool of gas-lamp light, mid-stride, longcoat flowing, crossbow on back and revolver in shoulder-holster.',
      'Slowly drawing a silver dagger from a thigh-sheath mid-step, deliberate calm, twin pistols visible at his belt, focused gaze off-frame.',
      'Sharpening a curved blade on a whetstone balanced on his knee, focused work-pose, weapons visibly strapped across body, calm intensity.',
      'Cocking a long-barrel revolver mid-stride down a cobblestone alley, twin holsters at thighs, sword at hip, eyes locked forward.',
      'Standing on a rooftop edge surveying the gothic city below, weapons strapped across body, coat billowing in the night wind, silent watch.',
      'Holstering a flintlock pistol after a clean draw, calm post-draw pose, the second pistol still cross-belted, blade at hip.',
      'One foot raised on a stone step, surveying the village square ahead, repeating crossbow resting on the raised knee, twin pistols on cross-belt.',
      'Striking flint to a pitch-tipped torch, face suddenly lit by new flame, twin pistols visible at his belt, sword strapped across back.',
      'Reading a tattered wanted-poster pinned to a gothic post, weapons visibly strapped across body, gas-lamp glow catching his weathered face.',
      'Wiping a curved silver blade clean with a black cloth, calm post-action pose, NO blood visible, twin pistols still cross-belted, focused.',
      'Standing over a moss-grown gravestone, head bowed slightly to read the inscription, weapons visibly strapped, lantern in left hand.',
      'Stepping over a fallen banner in a cobblestone square, mid-step, twin pistols cross-belted and crossbow on back, half-turn back to camera.',
      'Pulling his hood down to reveal weathered scarred face, mid-step into a moonlit cathedral square, weapons visibly strapped at body.',
      'Tying a leather cord at his wrist mid-prep, weapons cross-belted across torso, calm focused pose, gothic alleyway behind him.',
      'Loading a silver-tipped bolt into a hand-cocked crossbow, focused calm, twin pistols cross-belted at hip, blade across back.',
      'Lighting a hand-rolled cigarette with a struck match, face lit by flame, twin holsters at thighs and silver dagger at hip.',
      'Adjusting a stake-bandolier across his chest mid-prep, mid-step into a fog-bound street, twin pistols visible, focused gaze.',
      'Standing on a stone bridge over fog-filled chasm, mid-stride, crossbow on back and twin pistols cross-belted, coat billowing.',
    ],
    instructions: `Each entry is ONE prose sentence, 18-28 words. ONE cool POSTER-MOMENT pose with WEAPONS VISIBLY STRAPPED. Movie-poster gravity. Never just-standing-still / never modeling-pose / never emo / never contemplative-aristocrat / never mid-strike. Output as a NUMBERED list (1. ... 2. ... 3. ...), one entry per line.`,
  },

  gothbot_gmfb_scene_context: {
    format: 'simple',
    theme: `GOTHIC URBAN SCENE CONTEXTS for GothBot's goth-male-full-body-axis elite vampire-hunter path. Each entry is ONE 18-28 word prose sentence describing the GOTHIC URBAN / CATHEDRAL / CRYPT / CASTLE-GATE / CHURCHYARD scene around the hunter.

⚠️ Setting is GOTHIC URBAN — cobblestone streets / cathedral steps / crypt entrances / castle gates / village squares / rooftops / alleys / churchyards / fog-bound bridges. NEVER throne-room / NEVER ritual-sigil-floor / NEVER scrying-mirror / NEVER altar-with-tome (that's warlock register, not hunter register).

⚠️ Output ONLY a JSON array of plain strings.

CATEGORIES (rotate widely):
  • Cobblestone alleyway with oil-lamp at far end and leaning gothic houses
  • Cathedral steps under colossal arched doorway with carved gargoyles
  • Crypt-gate iron grille ajar, mossy stone steps descending into dark
  • Castle gate with portcullis half-raised, weathered stone gatehouse
  • Village square at midnight with shuttered timber-and-plaster houses
  • Cobblestone bridge over fog-filled chasm or moat
  • Rooftop overlook of slate tiles with chimney-stacks
  • Churchyard with leaning tombstones and iron-fence rim
  • Crossroads with rusted gibbet and weathered stone signpost
  • Wattle-and-daub gothic inn with shuttered windows and hanging sign
  • Cobblestone street at night with gas-lamp pools of light
  • Cathedral nave interior with fractured stained glass and candle-stand
  • Catacomb stairs with sconces in carved alcoves
  • Stone bridge over moon-silvered black water
  • Plague-village abandoned square with chalk-marks on doors
  • Wallachian-castle inner-courtyard with weathered stone wall
  • Cliff-edge gothic chapel under stormy sky
  • Stone watchtower stairs winding up

ABSOLUTELY BANNED:
  - NO throne / NO altar-with-tome / NO ritual-sigil-floor / NO scrying-mirror (warlock register)
  - NO modern setting (no gas station / no street with cars)
  - NO bright daylight (this is gothic-night register)
  - NO interior boudoir / NO interior bedchamber (he's a hunter, not a lord)`,
    touchpoints: [
      'Narrow cobblestone alleyway between leaning gothic houses, single oil-lamp at the far end, gutter-iron grates underfoot, fog rolling at boot-height.',
      'Cathedral steps under colossal arched doorway, carved gargoyles flanking the entrance, candlelight pouring through stained glass behind him.',
      'Crypt-gate iron grille hanging ajar on rusted hinges, mossy stone steps descending into darkness, weathered stone arch above.',
      'Castle gate with portcullis half-raised, weathered stone gatehouse with arrow-slits, courtyard beyond visible only as shadow.',
      'Cobblestone village square at midnight, shuttered timber-and-plaster houses ringed around, central well with iron crank.',
      'Stone bridge over a fog-filled chasm, weathered parapet, far end disappearing into mist, single lantern marking the crossing.',
      'Slate-tile rooftop overlook of a gothic city, chimney-stacks and gabled gables silhouetted against a moonlit sky.',
      'Churchyard with leaning tombstones at varied angles, iron-fence rim, scattered fallen offerings, cathedral spire rising behind.',
      'Crossroads with rusted gibbet swaying, weathered stone signpost pointing four directions, gnarled tree at the verge.',
      'Cobblestone street at night, brass gas-lamps casting overlapping pools of warm light on wet cobbles, gothic timber houses leaning in.',
      'Cathedral nave interior with fractured stained glass at the apex, candle-stand ranks burning low, fallen pews scattered.',
      'Catacomb stairs winding down, sconces in carved alcoves casting orange light on wet stone walls, skull-niches at the bends.',
      'Stone bridge over moon-silvered black water, weathered parapets carved with worn gothic figures, mist rising from the surface.',
      'Plague-village abandoned square with white chalk-marks on every door, weathered shutters closed tight, single weathercock turning.',
      'Wallachian-castle inner-courtyard with weathered stone walls, broken statuary, single torch-bracket burning, dark archway beyond.',
      'Cliff-edge gothic chapel under stormy sky, weathered stone walls, single cross-window lit from within, jagged rocks below.',
      'Stone watchtower interior, winding stairs spiraling up around a central pillar, arrow-slit windows letting in shafts of moonlight.',
      'Cobblestone harbor street at night, gothic warehouses on one side, dark water beyond a stone quay, gas-lamps reflecting.',
      'Ruined monastery half-collapsed gothic arches, scattered stone-rubble, fallen-cross over a weathered altar in the deeper space.',
      'Wattle-and-daub gothic inn with iron-banded door, hanging sign creaking, shuttered upper windows, lantern by the door.',
      'Gas-lit Edwardian London street, foggy cobbles, hansom cab silhouette in the mist far behind him, gothic-revival storefront.',
      'Cemetery iron-gate with weathered brass lock, gravestones extending behind, gnarled oak at the gate, moonlight breaking through.',
    ],
    instructions: `Each entry is ONE prose sentence, 18-28 words. ONE gothic urban / cathedral / crypt / churchyard / castle-gate scene context. NEVER throne / altar / ritual-sigil / scrying-mirror (warlock register banned). Output as a NUMBERED list (1. ... 2. ... 3. ...), one entry per line.`,
  },

  gothbot_gmfb_outfit_silhouette: {
    format: 'simple',
    theme: `HUNTER OUTFIT + STRAPPED WEAPON-HARNESS for GothBot's goth-male-full-body-axis elite vampire-hunter path. Each entry is ONE 18-30 word prose sentence describing the full-body hunter outfit + at least 2-3 weapons visibly strapped on the silhouette.

⚠️ CHEST FULLY COVERED — leather longcoat / brigandine / chainmail / wool greatcoat / trenchcoat / tactical-mythic black leather. NEVER bare chest, NEVER shirtless, NEVER cleavage-of-pecs.

⚠️ MULTI-WEAPON STRAPPED — every outfit explicitly mentions 2-3 weapons strapped on the silhouette: crossbow on back / twin pistols cross-belt / sword on back or hip / daggers at thighs / stake-bandolier / silver-cross sash / holy-water flasks on belt. He looks LOADED.

⚠️ Output ONLY a JSON array of plain strings.

LINEAGE EXAMPLES (period-mythic blend OK, 1500s-modern-mythic):
  • Belmont-style brass-buckle leather longcoat, vampire-killer whip + daggers + holy symbol
  • Witcher armored leather double-jerkin, twin-sword harness on back (silver + steel) + daggers at thighs
  • Van Helsing kit-laden duster, brass-buckle holsters with twin pistols + stakes-and-flasks belt + crossbow on back
  • Black tactical leather longcoat (Hellsing-coded), twin large pistols holstered + sword across back + silver dagger
  • Edwardian Norfolk-jacket with cross-belts of stakes + revolver in shoulder-holster + blessed kukri on belt
  • London-occult-investigator long black trenchcoat with double-barrel shotgun strapped + silver knife at hip
  • Cossack fur-trimmed greatcoat, sabre at hip + twin flintlocks cross-belted + silver-cross sash
  • Wallachian fur-trimmed kontush over chainmail, twin pistols + sabre + silver-chain at neck
  • Tridentine cassock with hidden mail underlayer, stake-rosary + hidden dagger at sleeve + repeating crossbow
  • Hessian dragoon greatcoat with brass buttons, sabre + twin pistols + stake-bandolier
  • Underworld-Death-Dealer long black leather coat over brigandine, twin large pistols at thighs + sword on back
  • Spanish flamenco-blade dark-velvet doublet over chainmail, rapier at hip + twin pistols + holy-water flask

EVERY outfit MUST:
  - Cover the chest fully (no bare-pecs)
  - Have 2-3 weapons visibly STRAPPED on the silhouette (named in the entry)
  - Define silhouette (longcoat billow / coat / brigandine / weapon-harness)
  - Look field-worn but ELITE-PROFESSIONAL (not scuffed-shabby — dirty-but-deadly)

ABSOLUTELY BANNED:
  - NO bare chest / NO shirtless / NO ripped-shirt / NO cleavage-of-pecs
  - NO modern clothing (no jeans / no sneakers / no hoodies)
  - NO bishonen-pretty outfits / NO K-pop-idol stage costume / NO emo styling
  - NO unarmored softness (he is LOADED, not pretty)`,
    touchpoints: [
      'Belmont brass-buckle leather longcoat over chain-vest, vampire-killer whip coiled at hip, silver dagger cross-belted, holy-symbol pendant at his throat.',
      'Witcher armored leather double-jerkin with steel pauldrons, twin-sword harness on back (silver + steel blades), daggers sheathed at both thighs.',
      'Van Helsing kit-laden brown duster, brass-buckle holsters with twin flintlock pistols, stake-and-flask belt diagonal, hand-cocked crossbow on back.',
      'Black tactical leather longcoat (Hellsing-coded), twin large engraved pistols holstered at thighs, sword across back in matte sheath.',
      'Edwardian tweed Norfolk-jacket over chest-piece, twin cross-belts of wooden stakes, revolver in shoulder-holster, blessed kukri on hip-belt.',
      'London-occult-investigator long black trenchcoat over wool shirt, double-barrel shotgun strapped under coat, silver bowie-knife at hip, holy-water flask.',
      'Cossack fur-trimmed greatcoat buttoned tight, sabre at hip, twin flintlocks cross-belted, silver-cross sash diagonal across chest.',
      'Wallachian fur-trimmed kontush over chainmail shirt, twin pistols at hip, sabre on cross-belt, silver chain at neck with cross pendant.',
      'Tridentine cassock with hidden mail underlayer, stake-rosary wrapped at belt, hidden silver dagger at sleeve, repeating crossbow slung diagonal.',
      'Hessian dragoon brass-buttoned greatcoat over wool tunic, sabre at hip, twin pistols cross-belted, stake-bandolier across chest.',
      'Underworld-Death-Dealer long black leather coat over brigandine, twin large pistols holstered at thighs, sword on back, silver-tipped knife at hip.',
      'Spanish flamenco-blade dark-velvet doublet over chainmail, rapier at hip, twin small pistols cross-belted, holy-water flask at his throat.',
      'Constantine-coded long black coat over dark waistcoat, revolver in shoulder-holster, holy-water flask at belt, silver dagger at hip.',
      'Carpathian woodsman fur-lined leather greatcoat over mail, hand-axe at belt, twin pistols cross-belted, silver-tipped pike slung over shoulder.',
      'Welsh-moor oilskin longcoat over leather hunting-vest, longbow across back, twin daggers at thighs, hand-crossbow holstered at hip.',
      'Irish brawler-priest leather jerkin over chainmail, holy-rune wrap-bracers, twin stakes cross-belted, silver dagger at hip, repeater pistol holstered.',
      'Mexican vaquero long brown leather duster over chest-piece, silver-conchoed cross-belt of bolas, twin silver-shot revolvers at hip, blessed bowie-knife.',
      'Ottoman janissary-deserter dark-indigo kaftan over chainmail, twin yataghans crossed at hip, silver-flintlock pistol holstered, prayer-rope at belt.',
      'Norse-skald wool-and-fur coat over mail, rune-etched hand-axe at hip, silver-tipped pike across back, twin daggers cross-belted at chest.',
      'Scottish wool-tartan plaid wrapped over mail-shirt, claymore strapped across back, twin flintlocks at hip, dirk in boot-sheath, silver-cross.',
      'Edwardian period-amateur tweed coat over silk waistcoat, twin cross-belts of wooden stakes, revolver in shoulder-holster, silver kukri at hip.',
      'Castlevania Trevor-coded leather longcoat over brigandine, vampire-killer whip coiled at hip, twin daggers cross-belted, silver dagger at thigh.',
      'Bohemian alchemist long dust-grey duster over chemical-stained leather apron, brass-goggles at brow, twin flintlocks at hip, silver-tipped bolts in side-quiver.',
      'Pre-WWII London occult-investigator long black trenchcoat over tweed waistcoat, twin pistols in twin shoulder-holsters, silver knife at hip, stakes cross-belted.',
    ],
    instructions: `Each entry is ONE prose sentence, 18-30 words. ONE hunter outfit + 2-3 STRAPPED weapons named in the silhouette. NEVER bare chest. NEVER modern clothing. NEVER emo or pretty. Output as a NUMBERED list (1. ... 2. ... 3. ...), one entry per line.`,
  },

  gothbot_gmfb_weapon_or_object: {
    format: 'simple',
    theme: `MULTI-WEAPON ARSENAL for GothBot's goth-male-full-body-axis elite vampire-hunter path. Each entry is ONE 18-28 word prose sentence describing the FULL weapon-loadout he carries — at least 2-3 classic vampire-hunter weapons explicitly named with how they're carried in the frame.

⚠️ MULTIPLE WEAPONS VISIBLE — he is LOADED. Examples: twin pistols cross-belted + sword at hip + dagger at thigh / crossbow on back + twin daggers + holy-water flask / sabre on cross-belt + revolver in shoulder-holster + silver kukri at hip.

⚠️ Output ONLY a JSON array of plain strings.

WEAPON LIBRARY (classic vampire-hunter arsenal — period-mythic blend, 1500s-modern):
  • Castlevania Vampire-Killer whip (silver-linked leather lash, gold-cross pommel)
  • Hand-cocked iron-stirrup crossbow with silver-tipped bolts
  • Repeating crossbow with bolt-magazine top-mounted
  • Twin flintlock dueling pistols with engraved walnut grips
  • Twin wheellock short-pistols
  • Long-barrel period revolvers (1850s-style, silver-engraved)
  • Twin large pistols (Hellsing/Underworld-coded mythic-modern)
  • Cross-pommel sword / cruciform-hilted bastard sword
  • Silver-bladed scythe with rune-etched curve
  • Silver dagger pair (cross-pommel hilts)
  • Twin silver-blessed daggers
  • Silver-tipped quarterstaff
  • Stake-bandolier with wooden stakes
  • Holy-water flasks at belt
  • Silver-shot blunderbuss
  • Double-barrel shotgun (Victorian/Edwardian-period)
  • Cossack sabre + dueling pistol pair
  • Wallachian sabre
  • Spanish rapier
  • Hungarian honved-hussar sabre
  • Norse rune-etched hand-axe
  • Scottish claymore
  • Yataghan twin set
  • Bolas with silver weights (Mexican vaquero)

EVERY entry: 2-3 specific named weapons + how each is carried (across back / cross-belted / holstered / sheathed / at hip).

ABSOLUTELY BANNED:
  - NO modern firearms beyond what fits gothic-mythic register (no AR-15, no Glock — period or mythic-elite-modern only)
  - NO grimoire / NO staff / NO chalice / NO hourglass / NO scrying-mirror — he is a HUNTER, not a warlock
  - NO single weapon only — must be MULTI-WEAPON arsenal`,
    touchpoints: [
      'Castlevania Vampire-Killer whip coiled at his hip with gold-cross pommel, silver dagger cross-belted at chest, holy-symbol pendant at throat.',
      'Hand-cocked iron-stirrup crossbow slung diagonal across back with silver-tipped bolts in side-quiver, twin flintlock pistols cross-belted, dagger at thigh.',
      'Twin engraved flintlock dueling pistols in brass-buckle holsters at hip, cross-pommel saber sheathed at back, holy-water flask on belt.',
      'Repeating crossbow with top-mounted bolt-magazine slung on his back, twin daggers cross-belted at chest, blessed silver kukri at hip.',
      'Twin large engraved long-barrel revolvers holstered at his thighs (Hellsing-coded), cross-pommel sword strapped across back, silver-tipped knife at hip.',
      'Cossack sabre at hip with engraved hilt, twin wheellock pistols cross-belted in worn leather holsters, silver-cross sash diagonal.',
      'Twin silver-blessed daggers with cross-pommel hilts at his hips, hand-crossbow holstered at lower back, stake-bandolier diagonal across chest.',
      'Silver-bladed scythe with rune-etched curve slung on back, twin flintlock pistols at hip, holy-water flask at belt, silver dagger at thigh.',
      'Edwardian-period revolver in shoulder-holster, blessed kukri at hip, double-barrel shotgun strapped under his long trenchcoat at hip.',
      'Cruciform-hilted bastard sword in leather scabbard at back, twin pistols cross-belted, repeating crossbow holstered at the side of his hip.',
      'Wallachian sabre at hip with worn leather grip, twin flintlock pistols cross-belted, stake-bandolier diagonal across chest, dagger at thigh.',
      'Spanish rapier at hip with cross-hilt, twin small wheellock pistols cross-belted, holy-water flask at chest, silver-blessed dagger at sleeve.',
      'Twin yataghans crossed at hip in worn leather sheaths, single silver-flintlock pistol holstered, prayer-rope knotted at belt with stakes.',
      'Castlevania Trevor-coded vampire-killer whip at hip, twin cross-pommel daggers cross-belted at chest, silver-tipped dagger sheathed at thigh.',
      'Hand-axe at his hip with rune-etched bit, silver-tipped pike slung diagonally across back, twin daggers cross-belted, silver-cross sash.',
      'Scottish claymore strapped across his back in oiled-leather scabbard, twin flintlocks at hip, dirk in boot-sheath, silver-cross at throat.',
      'Holy-longsword (rune-etched cruciform-hilt) at his back, twin engraved pistols cross-belted, silver-blessed dagger at thigh, holy-water flask.',
      'Twin silver-shot pistols at hip, blessed bowie-knife at sleeve, silver-conchoed bolas cross-belted with silver weights, blessed-cross at chest.',
      'Hellsing-coded twin large pistols at thigh-holsters, blessed silver knife at hip, hand-crossbow holstered at the small of his back.',
      'Constantine-coded revolver in worn shoulder-holster, silver dagger at hip, holy-water flask on belt, stake-bandolier diagonal across chest.',
      'Double-barrel sawn-off shotgun cross-belted under his coat, twin period-revolvers in shoulder-holsters, blessed silver knife at his hip.',
      'Repeating crossbow on his back with silver-tipped bolts, twin daggers cross-belted at chest, stake-bandolier diagonal, holy-water flask at hip.',
    ],
    instructions: `Each entry is ONE prose sentence, 18-28 words. 2-3 SPECIFIC vampire-hunter weapons named with how each is carried in the frame. NEVER single-weapon-only. NEVER grimoire/staff/chalice/scrying-mirror. Output as a NUMBERED list (1. ... 2. ... 3. ...), one entry per line.`,
  },

  gothbot_gmfb_atmospheric_backdrop: {
    format: 'simple',
    theme: `GOTHIC URBAN ATMOSPHERIC BACKDROPS for GothBot's goth-male-full-body-axis elite vampire-hunter path. Each entry is ONE 18-26 word prose sentence describing the moody gothic-urban atmosphere AROUND the hunter — fog / lantern-glow / moonlight / gas-lamp / candlelight / rain — NEVER architecture-as-subject.

⚠️ Atmospheric mood, not focal architecture. The hunter is the subject; the backdrop is moody-support.

⚠️ Output ONLY a JSON array of plain strings.

CATEGORIES (rotate widely):
  • Rolling fog at boot-height with gas-lamp pools
  • Gothic moonlight cutting through cloud-bank
  • Cobblestone street wet with rain, reflecting lantern-glow
  • Gothic timber-and-plaster houses leaning in at the edges, shutters closed
  • Cathedral spires silhouetted in the distance against moonlit sky
  • Drifting embers from a distant fire / forge / torch
  • Gas-lamp light pooling on wet cobblestones, fog rolling
  • Crypt-mouth shadow with candlelight pooling
  • Gothic alleyway with single torch-bracket burning, fog in air
  • Castle silhouette in the far distance against stormy sky
  • Churchyard fog with leaning tombstones receding into mist
  • Stained-glass-light spilling onto wet cobbles from cathedral doorway
  • Moonlit gothic harbor with masts and rigging silhouetted
  • Plague-village abandoned-street atmosphere with chalk-marks half-visible
  • Lantern-glow in his off-hand catching scattered fog motes
  • Snow-dusted cobblestones with gothic spires far behind
  • Rain-streaked gothic windows behind him with single lit candle

ABSOLUTELY BANNED:
  - NO bright daylight (this is gothic-night register)
  - NO architecture-as-subject (cathedral filling the frame as the hero — backdrop only)
  - NO modern setting (no neon / no electric streetlight)
  - NO clean-CGI atmosphere (painted gothic fog/mist register)`,
    touchpoints: [
      'Rolling fog at boot-height with brass gas-lamp pools casting overlapping circles of warm light on wet cobbles.',
      'Gothic moonlight cutting through a bank of bruised violet clouds, silvering the wet cobblestones at his boots.',
      'Cobblestone street wet with cold rain, every stone reflecting lantern-glow, fog drifting at knee-height.',
      'Gothic timber-and-plaster houses leaning in at the edges of the frame, shutters closed, single window lit far behind him.',
      'Cathedral spires silhouetted in the far distance against a moonlit cloud-bank, the immediate scene dim and intimate.',
      'Drifting embers from a distant torch or chimney rising through cold air, faint orange points against the gothic-blue dark.',
      'Brass gas-lamp light pooling on wet cobblestones at his boots, fog rolling past his calves, breath visible in the cold.',
      'Crypt-mouth shadow yawning behind him, candlelight pooling from somewhere deep within, fog drifting at his shoulders.',
      'Gothic alleyway with a single torch-bracket burning on a far wall, fog hanging dense in the still air, his breath visible.',
      'Castle silhouette in the far distance against a stormy sky, jagged lightning fork visible behind a single dark spire.',
      'Churchyard fog with leaning tombstones receding into mist behind him, faint moonlight cutting through bare branches.',
      'Stained-glass light spilling onto wet cobblestones from a cathedral doorway behind him, blue-violet shadow at his feet.',
      'Moonlit gothic harbor far behind him, masts and rigging silhouetted, fog rolling in off the dark water.',
      'Plague-village abandoned-street atmosphere with white chalk-marks half-visible on shuttered doors, single lit window.',
      'Lantern in his off-hand catching scattered fog motes in its warm glow, the rest of the scene falling into gothic dark.',
      'Snow-dusted cobblestones at his boots, gothic spires silhouetted far behind against a slate-grey winter sky, breath visible.',
      'Rain-streaked gothic windows behind him with a single lit candle visible, raindrops catching lantern-light on the panes.',
      'Wallachian-mountain pass dropping away behind him, castle silhouette far down-valley, stormy sky overhead.',
      'Gothic crossroads with the rusted gibbet swinging slowly in the wind behind him, fog at boot-height, single lantern.',
      'Catacomb shadow yawning behind him, sconce-light from deeper in pooling on wet stone walls, dust motes drifting.',
      'Edwardian London foggy alleyway, gas-lamp glow at the far end, faint hansom-cab silhouette in the mist behind him.',
      'Cathedral steps behind him with carved gargoyles silhouetted, candlelight pouring through massive doors half-open.',
    ],
    instructions: `Each entry is ONE prose sentence, 18-26 words. ONE moody gothic-urban atmospheric backdrop — fog / lantern / moonlight / gas-lamp / candlelight / rain. NEVER architecture-as-subject. NEVER bright daylight. Output as a NUMBERED list (1. ... 2. ... 3. ...), one entry per line.`,
  },

  gothbot_gmfb_hairstyle: {
    format: 'simple',
    theme: `COOL HUNTER HAIRSTYLES for GothBot's goth-male-full-body-axis elite vampire-hunter path. Each entry is ONE 14-22 word prose sentence describing one cool, period-or-modern-mythic, masculine hunter hairstyle + head-style. ANY ADULT AGE — pool was over-defaulting to "iron-grey / silver" elder hair.

⚠️ AGE DISTRIBUTION MANDATE:
  • ~40% YOUNG/PRIME hair color — jet-black / dark-brown / chestnut / ash-blond / red-brown / sandy / copper — NO grey/silver/iron mentions
  • ~30% MIXED — mostly dark with hints of grey at temples, or pepper-grey shorter beard with darker hair
  • ~30% VETERAN — silver-streaked / iron-grey / salt-and-pepper / full-silver
  Do NOT default the majority to silver/iron-grey. Mix the age signals across the batch.

⚠️ FACIAL-HAIR DISTRIBUTION MANDATE:
  • ~40% CLEAN-SHAVEN with sharp jaw / faint stubble
  • ~30% SHORT TRIMMED beard or goatee
  • ~30% FULL beard (any age)

⚠️ NEVER emo bangs / NEVER smudgy-coverage / NEVER long-thin-bishonen-fringe / NEVER K-pop-idol-cut / NEVER pretty-boy styling.

⚠️ Output ONLY a JSON array of plain strings.

STYLE CATEGORIES (rotate widely):
  • Long shoulder-length brushed-back hair tied at nape (Geralt/Witcher-coded)
  • Short-cropped soldier's cut with stubble
  • Tied-back queue with sideburns
  • Half-up tied at crown, lower hair loose past shoulders
  • Wallachian topknot with shaved temples
  • Modern-tactical short cut + clean-shave
  • Edwardian-period side-parted oil-slicked hair
  • Long dark hair pulled into a low ponytail, full beard
  • Buzzed sides + longer tied-back top (modern-mythic)
  • Loose wavy shoulder-length hair (Geralt-coded)
  • Cossack oseledets topknot with shaved skull
  • Tightly braided long hair down spine
  • Hood-down revealing close-cropped hair
  • Hood-down revealing long iron-grey braid
  • Wide-brim hat over long tied-back hair
  • Tridentine priest-hat tipped back over close-cropped hair
  • Bare-head with shaved scalp and full beard
  • Bare-head with full silver-streaked hair tied at nape

ABSOLUTELY BANNED:
  - NO emo bangs / NO bangs-over-eyes / NO thin-fringe-covering-half-face
  - NO bishonen / NO K-pop / NO pretty-boy
  - NO modern-trendy-haircut (no fades, no top-knot-man-bun-trend)`,
    touchpoints: [
      // YOUNG / PRIME — dark / chestnut / blond / red-brown — clean-shaven or short beard
      'Long jet-black hair tied tight in a single braid down his back, clean-shaven sharp jaw, focused intense gaze.',
      "Close-cropped jet-black soldier's cut, clean-shaven jaw with faint stubble, single scar across his cheekbone, intense focus.",
      'Long shoulder-length chestnut hair brushed back loose, clean-shaven sharp jaw, focused gaze, no grey.',
      'Slicked-back jet-black hair with neat short sideburns, clean-shaven jaw, focused dark-eyed predator stillness.',
      'Modern-tactical short cut in dark-brown, clean-shaven jaw with faint stubble, single temple-scar, hardened focused gaze.',
      'Long ash-blond hair tied at the nape with a leather cord, clean-shaven sharp jaw, Witcher-coded gravity, intense.',
      'Shoulder-length dark-brown hair pulled into a low ponytail, neat short black beard, sharp jaw, focused gaze.',
      'Edwardian period side-parted oil-slicked dark hair, neat short dark moustache, clean-shaven cheek, sharp gentleman gravity.',
      'Long red-brown hair brushed loose past his shoulders, full red beard cleanly trimmed, sharp focused dark eyes.',
      'Buzzed sides with longer tied-back jet-black top, clean-shaven sharp jaw with faint stubble, modern-mythic gravity.',
      'Tactical short brush-cut in dark-brown, clean-shaven jaw, neat sideburns, hardened focused predator gaze.',
      'Long jet-black hair half-up tied at the crown with lower hair loose past shoulders, clean-shaven sharp jaw, focused gaze.',
      'Wallachian topknot of jet-black hair at the crown with shaved temples, clean-shaven jaw, neat short dark moustache.',
      'Cossack oseledets topknot of dark-brown hair at a shaved skull, neat short dark moustache, clean-shaven jaw.',
      'Long curly red-brown hair bound back loose, full red beard cleanly trimmed, freckled sharp cheekbones, focused gaze.',
      'Slicked-back ash-blond hair with neat sideburns, clean-shaven sharp jaw, focused pale-blue predator eyes.',
      'Long copper-red hair tied at the nape with a leather cord, neat short red beard, sharp jaw, focused intense eyes.',
      'Shaved scalp with a dark cross-tattoo at the brow, full neat black beard, sharp jaw, focused intense gaze.',
      // MIXED — mostly dark with hints of grey at temples, or pepper-grey beard with darker hair
      'Long dark-brown hair brushed back with faint grey at temples, tied at nape, neat short pepper-grey beard, focused gaze.',
      'Close-cropped dark hair greying lightly at temples, neat short pepper-grey beard, sharp jaw, focused intense eyes.',
      'Shoulder-length jet-black hair tied at nape with two strands of silver at the temple, full neat black beard, sharp jaw.',
      'Slicked-back dark hair silvering at temples, neat dark moustache and short beard with grey threads, sharp jaw.',
      'Modern-tactical short cut in dark-brown going pepper-grey at temples, clean-shaven jaw, focused hardened gaze.',
      'Long chestnut hair pulled into a low ponytail, single silver streak at the temple, neat short pepper-grey beard.',
      // VETERAN — silver-streaked / iron-grey / salt-and-pepper / full-silver — full beard OK
      'Long silver-streaked dark hair tied at the nape with a leather cord, full silver-streaked beard, weathered pale skin, severe gaze.',
      'Loose wavy shoulder-length silver hair brushed back, full silvered beard, weathered tan skin, Geralt-coded killer gravity.',
      'Tightly braided long iron-grey hair down his spine, full silver beard, weathered face, prayer-rope at his shoulder.',
      'Cossack oseledets topknot of iron-grey hair at a shaved skull, long silver drooping moustache, weathered olive complexion.',
      "Close-cropped iron-grey soldier's cut, weathered scalp, full silver-shot beard, scarred temple, hardened veteran gravity.",
      'Edwardian period side-parted iron-grey hair, full silver-streaked moustache and short beard, weathered cheek, stern gravity.',
      'Tridentine priest-hat tipped back on a cord, close-cropped steel-grey hair revealed, gaunt weathered face, hollow-eyed.',
      'Wide-brim leather field-hat tipped low over long tied-back iron-grey hair, full pepper-grey beard, scarred cheekbone.',
      'Hood pushed down revealing long silver-grey braid down his back, full silver beard, weathered pale skin, severe gaze.',
      'Shoulder-length salt-and-pepper hair tied at nape, full salt-and-pepper beard, weathered scarred cheek, intense focus.',
    ],
    instructions: `Each entry is ONE prose sentence, 14-22 words. ONE cool masculine hunter hairstyle + head-style. NEVER emo / NEVER bishonen / NEVER pretty-boy / NEVER trendy-modern-fade. Output as a NUMBERED list (1. ... 2. ... 3. ...), one entry per line.`,
  },

  gothbot_gmfb_face_detail: {
    format: 'simple',
    theme: `STERN HUNTER FACE DETAILS for GothBot's goth-male-full-body-axis elite vampire-hunter path. Each entry is ONE 14-22 word prose sentence describing focused-hunter facial detail — sharp jaw / scars / beards / piercing eyes. ANY ADULT AGE — pool was over-defaulting to "weathered elder with full beard."

⚠️ AGE DISTRIBUTION MANDATE:
  • ~30% YOUNG (20s-early-30s) — sharp clean-shaven jaw / faint stubble / unscarred or minimal scar / piercing eyes, NO weather-lines NO grey
  • ~45% PRIME (mid-30s to mid-40s) — sharp jaw with stubble or short beard, single scar OK, focused gaze, full-color
  • ~25% VETERAN (45+) — weathered scars, full or silver-streaked beard, hollow weathered cheeks

⚠️ FACIAL-HAIR DISTRIBUTION MANDATE:
  • ~40% CLEAN-SHAVEN — sharp jaw, faint stubble OK
  • ~30% SHORT BEARD / GOATEE / VANDYKE / TIGHT STUBBLE
  • ~30% FULL BEARD — any age (clean-color OR silver-streaked)

⚠️ NEVER emo / NEVER smudgy eyeliner / NEVER smooth bishonen / NEVER pretty-boy. Stern focused adult man.

⚠️ Output ONLY a JSON array of plain strings.

DETAIL CATEGORIES (rotate widely):
  • Cheekbone-scar from a vampire's claw
  • Vandyke beard meticulously trimmed
  • Full pepper-grey beard
  • Eye-patch over one socket
  • Hollow weathered cheeks from sleepless nights
  • Silver-streaked goatee
  • Three parallel scars across cheek (claw-marks)
  • Scar tracing from cheekbone to jawline
  • Lip-scar from an old fight
  • Brow-scar bisecting eyebrow
  • Clean-shaven sharp jaw with single temple-scar
  • Full red-brown beard with iron threading
  • Burn-scar across one side of the face
  • Faint kohl-rim around the eyes (Witcher-mutagen-coded)
  • Sharp cheekbones gaunt from years of hunting
  • Crow-foot wrinkles around watchful eyes
  • Weathered tan skin with map of old battle-scars
  • Cross-tattoo at the brow (Cathar-coded)
  • Cigarette-burn fingertips visible on a raised hand (Constantine-coded)

ABSOLUTELY BANNED:
  - NO smudgy eyeliner / NO mascara / NO emo-coded styling
  - NO smooth baby-face / NO bishonen-soft / NO pretty-boy
  - NO blood / NO gore`,
    touchpoints: [
      // YOUNG (~30%) — clean-shaven or faint stubble, minimal/no weather lines, piercing eyes
      'Sharp clean-shaven jaw with smooth unscarred cheek, faint stubble at the chin, piercing focused dark eyes.',
      'Sharp jaw with faint stubble and a single thin temple-scar, smooth youthful cheek, intense focused gaze.',
      'Clean-shaven sharp jaw, faint dark stubble, smooth unmarked cheek, piercing focused pale-blue eyes.',
      'Sharp clean-shaven jaw with a single faint claw-mark across the cheekbone, focused intense dark gaze.',
      'Sharp clean-shaven jaw with kohl-rim eyes (Witcher-mutagen-coded), smooth cheek, intense amber focused gaze.',
      'Sharp clean-shaven jaw with cold predator stillness, smooth cheek, intense focused grey eyes, lethal calm.',
      'Sharp jaw with neat dark stubble and a thin lip-scar, smooth cheek, focused intense dark eyes.',
      'Sharp clean-shaven jaw with smooth deep-olive cheek, neat dark eyebrows, intense focused dark eyes.',
      'Sharp clean-shaven jaw with smooth tan cheek and freckled bridge of nose, focused intense pale-blue eyes.',
      'Sharp clean-shaven jaw with smooth pale cheek and a thin scar tracing from temple to cheekbone, intense gaze.',
      // PRIME (~45%) — sharp jaw with stubble/short beard, single scar OK, focused full-color hair-line
      'Sharp jaw with neat black goatee on a smooth dark cheek, single thin scar across the cheekbone, focused.',
      'Vandyke beard meticulously trimmed, smooth olive cheek, sharp brow-scar bisecting one eyebrow, focused gaze.',
      'Neat short dark beard on a sharp jaw, smooth pale cheek, single thin scar at temple, focused intense gaze.',
      'Sharp jaw with neat dark moustache and clean-shaven cheek, single scar across the cheekbone, intense focus.',
      'Neat short pepper-flecked beard on a sharp jaw, smooth cheek with a single scar, focused dark gaze.',
      'Sharp jaw with neat short red-brown beard, freckled tan cheek, single faint scar at the brow, focused.',
      'Clean-shaven sharp jaw with neat short sideburns, single scar tracing temple to ear, intense dark eyes.',
      'Sharp jaw with neat black goatee and slim moustache, smooth olive cheek, focused intense dark eyes.',
      'Neat short ash-blond beard on a sharp jaw, pale cheek, faint stubble at the temple, focused pale-blue gaze.',
      'Sharp clean-shaven jaw with a vertical scar from cheekbone to jawline, focused intense dark eyes.',
      'Cross-tattoo at the brow (Cathar-coded), neat short dark beard, sharp olive cheek, intense focused gaze.',
      'Sharp jaw with neat Vandyke beard, smooth pale cheek, single thin lip-scar, focused intense dark eyes.',
      'Sharp jaw with neat black moustache (Hungarian-pulled), clean-shaven cheek, scarred temple, intense focus.',
      'Faint kohl-rim around piercing amber eyes (Witcher-mutagen-coded), sharp jaw with faint stubble, focused.',
      'Three parallel thin claw-marks across one cheekbone, sharp jaw with faint stubble, intense focused gaze.',
      // VETERAN (~25%) — weathered, scars, full or silver-streaked beard, hollow cheeks
      'Full silver-streaked beard with iron-grey threads, weathered tan cheek, hollow watchful pale-grey eyes.',
      'Eye-patch over one socket with thin leather strap, gaunt weathered cheek, full silver-shot beard on a sharp jaw.',
      'Hollow weathered cheeks from sleepless decades, full silver beard, scar tracing from temple to cheekbone.',
      'Burn-scar across one side of the face from temple to jaw, full silver-streaked beard, intense remaining eye.',
      'Sharp cheekbones gaunt from forty years of hunting, hollow weathered eyes, full pepper-grey beard.',
      'Crow-foot wrinkles around watchful pale-blue eyes, full silver beard, weathered tan cheek, severe gaze.',
      'Weathered tan skin with a map of old battle-scars across one cheek, full pepper-grey beard, intense focus.',
      'Full white beard on a deeply lined face, hollow ascetic cheeks, leather-bound icon faintly visible at the neck.',
      'Full silver-streaked dark beard on a weathered pale jaw, single deep scar from cheekbone to ear, intense focus.',
      'Stoic gaunt face with weathered olive skin, full silver beard, deep frown-line between intense weathered brows.',
      'Norse-rune-tattoo across one cheekbone, full silver-streaked red beard, weathered freckled cheek, focused.',
      "Cigarette-burn fingertips visible on a raised hand (Constantine-coded), weathered London cynic's gaunt cheek, pepper-grey stubble.",
    ],
    instructions: `Each entry is ONE prose sentence, 14-22 words. ONE stern weathered hunter face detail. NEVER smudgy / NEVER emo / NEVER smooth bishonen / NEVER pretty-boy. Output as a NUMBERED list (1. ... 2. ... 3. ...), one entry per line.`,
  },

  // ════════════════════════════════════════════════════════════════
  // the-sanctum — NEW path (2026-06-10). GRAND COLD gothic INTERIOR as hero
  // (80%+ of frame). gothic-architecture turned INWARD. Distinct from cozy-goth
  // (warm/cluttered/intimate) — this is COLD / VAST / AWE-INSPIRING. universal:[].
  // ════════════════════════════════════════════════════════════════
  gothbot_sanctum_interior: {
    format: 'simple',
    theme: `THE GRAND GOTHIC INTERIOR — the HERO axis. Each entry is ONE vast, COLD, awe-inspiring gothic interior SPACE seen from INSIDE. 22-36 words. The viewer stands within an immense gothic chamber — towering vaulted ceilings, deep receding perspective, the space DWARFING everything. Castlevania / Bloodborne / Crimson-Peak / Berserk / Dark-Souls / Elden-Ring lineage.

⚠️ THE BAR — a MONUMENTAL gothic interior that fills the frame: soaring ribbed vaults overhead, columns marching into shadowed depth, a vanishing-point that pulls the eye into darkness. The SPACE is the hero — vast, cold, sacred, hushed.

🚫 COLD + GRAND, NOT cozy (the overriding rule) — this is NOT the warm, cluttered, treasure-filled witch's-study register (that is a different path). NO warm domestic clutter, NO small intimate nook. The mood is VAST, COLD, REVERENT, awe-and-dread. Stone, height, echo, emptiness.

✓ VARIETY MANDATE (~20):
  • CATHEDRAL NAVE (~2) — towering columns, ribbed vault, receding aisle to a distant altar
  • CRYPT OF KINGS (~2) — rows of stone sarcophagi + tomb effigies under low heavy vaults
  • CATACOMB OSSUARY (~2) — bone-lined tunnels, skull-stacked walls, niches of the dead
  • CURSED GRAND LIBRARY (~2) — towering bookshelves, spiral iron stairs, chained tomes
  • THRONE HALL (~2) — vast empty throne room, long approach, colonnade into gloom
  • GRAND STAIRWELL (~2) — a vertiginous spiral / sweeping staircase descending into dark
  • RELIQUARY or MAUSOLEUM ROTUNDA (~2) — domed sacred hall, central tomb, glass-cased relics
  • VAULTED CHAPEL / CHAPTER HOUSE (~2) — central pillar fanning into a vaulted ceiling
  • GREAT ORGAN LOFT / RUINED BALLROOM (~2) — vast pipe organ or a dust-shrouded ballroom + chandelier
  • UNDERCROFT / FLOODED CRYPT (~2) — low heavy stone vaults, chains, or black water mirroring columns

Each entry: the interior archetype + its vast architecture (vault / columns / depth) + a cold awe trait. The camera is INSIDE looking down the length / up into the vault / across the chamber.`,
    touchpoints: [
      'a vast cathedral nave, columns the girth of oaks marching into shadow, a ribbed vault soaring overhead, the aisle receding toward a distant pale altar',
      'a crypt of forgotten kings, rows of carved stone sarcophagi with weathered effigies, low heavy groin-vaults pressing down, dust thick on every tomb',
      'a catacomb ossuary, tunnels lined floor-to-vault with stacked skulls and arranged bone, dark niches receding endlessly into cold black depth',
      'a cursed grand library, bookshelves climbing four storeys into gloom, a wrought-iron spiral stair spiralling up, chained tomes on slanted lecterns',
      'a colossal throne hall, a long colonnade of black-marble pillars flanking an empty obsidian throne on a distant dais, banners rotting overhead',
      'a vertiginous grand stairwell, a sweeping stone staircase coiling down into bottomless dark, carved balustrades and a hanging chain of dead lamps',
      'a domed mausoleum rotunda, a ring of pale statuary encircling a central raised sarcophagus, the dome above pierced by a single oculus',
      'a vaulted chapter house, a single slender central pillar fanning into a star-ribbed ceiling, stone benches ringing the cold circular chamber',
      'a ruined grand ballroom, a vast dust-shrouded floor under a cobwebbed crystal chandelier, tall arched windows and a sweeping derelict staircase',
      'a flooded undercroft, squat heavy romanesque vaults reflected in still black floodwater, drowned columns marching into the dripping dark',
      'a great organ loft, a colossal wall of brass and blackwood pipes towering over empty choir stalls, the vault lost in shadow above',
      'an immense gothic crossing beneath a lantern-tower, four great arches opening to dim transepts, the floor a worn labyrinth of inlaid stone',
      'a long barrel-vaulted reliquary hall, glass-and-gilt cases of saintly relics lining both walls, the vault receding into incense-dim depth',
      'a sunken chapel of the dead, tilted flagstones, leaning tomb-slabs, a collapsed section of vault open to blackness above',
      'a vast vertical bell-tower interior, thick ropes hanging down through tiers of timber and stone, the great bronze bell a shadow far above',
    ],
    instructions: `Each entry is ONE grand cold gothic interior, 22-36 words. The SPACE is the hero (vast / cold / soaring / receding). NEVER warm-cozy-cluttered, NEVER an exterior, NEVER a small intimate room. Output as a NUMBERED list (1. ... 2. ...), one per line. NO internal newlines.`,
  },

  gothbot_sanctum_detail: {
    format: 'simple',
    theme: `INTERIOR ARCHITECTURAL DETAIL for a grand gothic interior. Each entry 10-20 words. ONE ornate INTERIOR feature, obsessively carved. The eye should want to study every surface. Castlevania / Bloodborne / Crimson-Peak lineage.

⚠️ INTERIOR detail only — ribbed vaults, fan-tracery, carved capitals, tomb effigies, choir stalls, rood screens, stained-glass-from-within, chandeliers, carved misericords, bone-arrangements. NOT exterior (no flying buttresses / battlements / spires-as-silhouette).

🚫 NO modern, NO sci-fi, NO LOTR/Skyrim/Witcher vocabulary.`,
    touchpoints: [
      'a ribbed groin-vault overhead, every rib carved with running scrollwork meeting at gilded boss-stones',
      'towering clustered columns with foliate carved capitals, each leaf-and-grotesque different',
      'a carved stone rood-screen of saints and wyrms dividing nave from choir, pierced like lace',
      'rows of dark oak choir stalls with carved misericords and canopied seat-backs',
      'tomb effigies of armoured lords recumbent on raised slabs, hands folded over carved swords',
      'tall lancet stained-glass windows glowing from within, lead-tracery casting jewelled light',
      'a hanging iron chandelier-wheel ringed with guttering candles, wax stalactites dripping',
      'a carved stone pulpit on a spiralling foliate stem, reached by a curling stair',
      'fan-vault tracery spreading across the ceiling like petrified frost',
      'walls of stacked skulls and arranged long-bones set in patterned ossuary niches',
      'a great carved reredos behind the altar, tier on tier of niched saints and demons',
      'worn inlaid floor-brasses and a labyrinth pattern set into the flagstones',
      'a wrought-iron spiral staircase climbing the library wall, treads worn concave',
      'carved stone angels with folded wings flanking every pier, faces eroded smooth',
      'a colossal pipe-organ facade of blackened brass ranks rising into the vault',
    ],
    instructions: `Each entry is ONE ornate INTERIOR architectural detail, 10-20 words. Carved, intricate, study-worthy. Interior only. Output as a NUMBERED list (1. ... 2. ...), one per line. NO internal newlines.`,
  },

  gothbot_sanctum_inner_light: {
    format: 'simple',
    theme: `THE LIGHT WITHIN — the SIGNATURE money-shot for a grand interior: the dramatic light source + how it falls. Each entry 14-26 words. The single thing that makes a vast gothic interior breathtaking is HOW it is lit. Castlevania / Bloodborne / Crimson-Peak lineage.

⚠️ DRAMATIC INTERIOR LIGHTING — god-rays through high windows, a thousand candles, witch-fire braziers, a glowing reliquary, moonlight through an oculus, fel-green spell-light. The light carves the volume of the space and pulls the eye into depth.

🚫 NO sunlight-as-warm-daylight (this is gothic gloom pierced by dramatic light). NO modern/electric light.

✓ SOURCES: shafts of pale moonlight through tall lancet windows / thousands of candle-flames / witch-fire-green braziers / a single oculus beam / a glowing reliquary or altar / sapphire arcane glow / fel-green spell-light / amber torch-rows / corpse-pale luminescence / stained-glass jewelled god-rays`,
    touchpoints: [
      'great slanting shafts of pale moonlight stab down through tall lancet windows, carving bright bars across the dark nave floor',
      'a thousand candle-flames terraced up the chamber in iron stands, a galaxy of small warm lights swallowed by the vast cold dark',
      'a single blade of silver light falls from the dome oculus onto the central sarcophagus, the rest of the rotunda drowned in shadow',
      'witch-fire-green braziers line the colonnade, throwing acid-green light up the columns and pooling poison-bright on the flagstones',
      'jewelled god-rays pour through a great stained-glass window, scattering red-and-violet light across the choir in drifting motes',
      'a glowing reliquary on the distant altar throws a cold sapphire radiance down the length of the nave, the source tiny but blinding',
      'fel-green spell-light seeps up between the flagstones and around the tomb-slabs, lighting the crypt from below like a drowned moon',
      'rows of amber torches recede down the catacomb tunnel, each smaller and dimmer, the last lost in absolute black',
      'corpse-pale luminescence breathes from the bone-walls themselves, the ossuary lit by the cold glow of its own dead',
      'a shaft of stormlight flickers through a collapsed section of vault, lightning strobing the ruined ballroom white then black',
      'candlelight from a hundred guttering tapers on the altar throws monstrous shifting shadows of the statuary up the apse wall',
      'moonlight floods the flooded undercroft through a broken grille, the black water throwing rippling silver up across the vaults',
    ],
    instructions: `Each entry is ONE dramatic interior light-source + how it falls, 14-26 words. The light carves the space and leads the eye. NEVER warm daylight, NEVER modern light. Output as a NUMBERED list (1. ... 2. ...), one per line. NO internal newlines.`,
  },

  gothbot_sanctum_focal_feature: {
    format: 'simple',
    theme: `THE FOCAL CENTREPIECE — the one dramatic interior feature the eye lands on at the end of the space. Each entry 12-24 words. Deep in the grand interior sits ONE arresting centrepiece that anchors the composition. Castlevania / Bloodborne / Crimson-Peak lineage.

⚠️ A single hero-object at the vanishing point or chamber-centre — a towering altar, a raised sarcophagus, a great throne, a vast organ, a hanging chandelier-cluster, a rose-window seen from inside, a grand staircase, a draped catafalque, an arcane summoning-circle inlaid in the floor.

🚫 NO living monster as the centrepiece (this is an empty sacred space). NO modern objects.`,
    touchpoints: [
      'a towering carved altar at the end of the nave, candelabra blazing across its tiers, a dark reredos rising behind into shadow',
      'a single raised sarcophagus on a stepped dais at the chamber-centre, its effigy crowned, fresh black roses laid upon the stone',
      'an obsidian throne on a high distant dais, empty, a tattered canopy of banners hanging in shreds above it',
      'a colossal pipe-organ filling the far wall, its blackened ranks soaring into the vault, a single candle lit at the keyboard',
      'an immense crystal chandelier hanging in the dark above the ruined ballroom floor, half its candles guttering, cobweb-draped',
      'a great rose-window seen from within, its jewelled tracery glowing, casting a wheel of coloured light onto the floor below',
      'a sweeping grand staircase coiling up into gloom, a single pale figure-statue at its newel post holding a dead lamp',
      'an arcane summoning-circle inlaid in silver and bone across the chamber floor, faint runes glowing cold around its rim',
      'a draped black catafalque at the crossing, tall candles at its four corners, the bier waiting and empty',
      'a vast standing reliquary cabinet of gilt and glass, a single relic within throwing cold light across the hall',
      'a colossal cracked bronze bell hung in the tower-shaft above, its rope falling away into the dark below',
      'a leaning tomb-slab thrown open at the crypt-centre, the dark mouth of the grave gaping, dust still settling',
    ],
    instructions: `Each entry is ONE arresting interior centrepiece, 12-24 words. A single hero-object anchoring the deep space. NO living monster, NO modern objects. Output as a NUMBERED list (1. ... 2. ...), one per line. NO internal newlines.`,
  },

  gothbot_sanctum_atmosphere: {
    format: 'simple',
    theme: `THE AIR WITHIN — the volumetric atmosphere + depth cue inside the grand interior. Each entry 12-22 words. What fills the vast cold air of the chamber and makes the light visible + the depth felt. Castlevania / Bloodborne / Crimson-Peak lineage.

⚠️ Volumetric interior atmosphere — drifting incense-smoke, dust-motes swimming in light-shafts, cold mist pooling on the floor, candle-smoke haze, falling dust from the vault, cobwebs, a chill fog seeping between columns. It makes the god-rays VISIBLE and the depth READABLE.

🚫 NO outdoor weather (no rain / no snow / no wind-blown leaves — we are INSIDE).`,
    touchpoints: [
      'drifting incense-smoke hangs in the still air, turning every shaft of light into a solid pale blade',
      'dust-motes swim slowly through the moonlight bars, the only movement in the dead-still chamber',
      'a low cold mist pools across the crypt floor, lapping at the foot of every sarcophagus',
      'candle-smoke haze gathers under the vault, softening the far columns into grey silhouettes',
      'fine dust sifts down endlessly from the cracked vault, catching the light like slow ash',
      'cobwebs hang in vast grey sheets between the chandelier and the gallery, stirring faintly',
      'a chill fog seeps up between the flagstones and threads between the columns into depth',
      'frankincense smoke coils up from a swinging censer, ribboning through the coloured god-rays',
      'the air is thick and cold and utterly still, sound deadened, breath fogging in the candlelight',
      'pale damp mist breathes off the black floodwater, blurring the drowned columns into ghosts',
      'motes of bone-dust drift through the ossuary air, settling pale on the stacked skulls',
      'a faint luminous haze clings around the arcane circle, the cold light fogging the nearby air',
    ],
    instructions: `Each entry is ONE interior volumetric atmosphere, 12-22 words. Makes light visible + depth felt. Indoors only — never outdoor weather. Output as a NUMBERED list (1. ... 2. ...), one per line. NO internal newlines.`,
  },

  gothbot_sanctum_accent: {
    format: 'simple',
    theme: `THE ACCENT — a small life-sign or scale-prover deep in the grand interior (70%-gated). Each entry 10-20 words. ONE small element that adds life + proves the colossal scale without competing with the space. Castlevania / Bloodborne / Crimson-Peak lineage.

⚠️ SMALL accent only — a tiny hooded figure dwarfed by the architecture (8-15% of frame, scale-prover, NEVER the subject), OR dark interior wildlife (roosting bats, a raven on a tomb, a black cat on the altar steps, moths around the candles, rats among the bones).

🚫 The accent NEVER dominates — the INTERIOR is the hero. NO large monster, NO combat, NO group of figures.`,
    touchpoints: [
      'a single tiny hooded figure stands far down the nave, dwarfed to nothing by the soaring columns',
      'a lone cloaked figure ascends the grand staircase, a small dark shape against the vast stone sweep',
      'bats roost in clusters high in the ribbed vault, a few wheeling through the moonlight shafts',
      'a single raven perches on the crowned effigy of the central tomb, utterly still',
      'a black cat sits on the lowest altar step, eyes catching the candlelight, watching the empty hall',
      'pale moths circle the chandelier candles in a slow spiral high above the ballroom floor',
      'a small kneeling figure before the distant altar, candle in hand, lost in the immense gloom',
      'rats move among the stacked bones of the ossuary, small shapes in the corpse-pale glow',
      'a tiny figure with a lantern stands at the crypt entrance, the light a pinprick in the dark',
      'a single white owl sits in a high window-arch, silhouetted against the moonlit glass',
      'a small acolyte in robes crosses the far end of the colonnade, dwarfed by the black pillars',
      'a coiled serpent rests on the warm flagstones beside a fallen candle, scales gleaming faintly',
    ],
    instructions: `Each entry is ONE small accent (tiny scale-prover figure OR dark interior wildlife), 10-20 words. NEVER dominates the space. Output as a NUMBERED list (1. ... 2. ...), one per line. NO internal newlines.`,
  },

  // ════════════════════════════════════════════════════════════════
  // the-frost-garden — NEW path (2026-06-10). A CURSED FROZEN gothic GARDEN /
  // CONSERVATORY as hero — black-rose courts, frozen fountains, weeping statuary,
  // glass greenhouses, ice-glazed arbors. Softer painterly scene register. FROST
  // is the signature. NO CHARACTERS as subject. universal:[].
  // ════════════════════════════════════════════════════════════════
  gothbot_frostgarden_garden: {
    format: 'simple',
    theme: `THE CURSED FROZEN GARDEN — the HERO axis. Each entry is ONE haunting gothic GARDEN or CONSERVATORY space, frost-touched and overgrown. 22-36 words. A walled black-rose garden, a frozen fountain court, a weeping-statuary garden, a derelict glass greenhouse, a dead orchard, a topiary maze under frost, an ice-glazed arbor walk, a sunken grotto. Crimson-Peak / Sleepy-Hollow / gothic-fairy-tale / Pan's-Labyrinth lineage.

⚠️ THE BAR — a gorgeous, melancholy, frost-bitten gothic garden that fills the frame: bare black trees, thorned rose-arbors, cracked stone paths, statuary furred with frost, everything still and silver-cold. The GARDEN is the hero. Beautiful and mournful.

🚫 NO CHARACTERS as subject (tiny scale-prover accent only). NO bright cheerful spring garden — this is a CURSED WINTER garden: frost, decay, thorns, mournful beauty. NO modern / NO sci-fi / NO LOTR-Skyrim-Witcher vocabulary.

✓ VARIETY MANDATE (~18):
  • BLACK-ROSE WALLED GARDEN (~2) — thorned arbors of frost-rimed black roses
  • FROZEN FOUNTAIN COURT (~2) — a great fountain caught mid-cascade in ice
  • WEEPING-STATUARY GARDEN (~2) — mourning angels + draped figures furred with frost
  • DERELICT GLASS CONSERVATORY (~2) — frost-feathered greenhouse, dead exotic flora within
  • DEAD ORCHARD (~2) — rows of bare black fruit-trees, frost on every branch
  • TOPIARY / HEDGE MAZE (~2) — frost-dusted topiary beasts, a maze of bare hedges
  • ICE-GLAZED ARBOR / PERGOLA WALK (~2) — a long tunnel of frozen climbing vines
  • SUNKEN GROTTO / GRAVEYARD GARDEN (~2) — a mossy grotto or tomb-studded garden under frost
  • WINTER CLOISTER GARTH (~1) — a frozen courtyard garden ringed by an arcade
  • FROZEN LILY-POND GARDEN (~1) — a black pond glazed with ice, dead reeds, a stone bridge

Each entry: the garden archetype + its frost/decay + its layout (paths / arbors / walls) + a mournful beauty trait.`,
    touchpoints: [
      'a walled black-rose garden, arbors of thorned roses rimed white with frost, cracked flagstone paths winding between frozen beds under a bruised sky',
      'a frozen fountain court, a great tiered fountain caught mid-cascade in glassy ice, frost-furred cherubs, a ring of dead topiary around it',
      'a garden of weeping statuary, mourning stone angels and draped figures furred with hoarfrost, bare black trees clawing above the frozen lawns',
      'a derelict glass conservatory, its panes frost-feathered and cracked, dead exotic palms and black orchids withered inside, vines frozen to the iron ribs',
      'a dead orchard, rows of bare black fruit-trees heavy with frost, a stone bench, a low silver mist creeping between the trunks',
      'a topiary maze under frost, hedge-beasts dusted white and losing their shapes, narrow paths of frozen gravel turning into shadow',
      'a long ice-glazed pergola walk, climbing roses and wisteria frozen solid over the arches, a tunnel of glittering thorned ice receding into mist',
      'a sunken grotto garden, a mossy shell-lined alcove glazed with ice, a trickle frozen mid-fall, ferns turned to frost-lace',
      'a graveyard garden, leaning frost-furred headstones among bare rose-briars, a wrought-iron gate hanging open, mist pooling between the graves',
      'a winter cloister garth, a square frozen lawn ringed by a stone arcade, a frost-cracked sundial at its centre, bare vines on every column',
      'a frozen lily-pond garden, a black pond glazed with clouded ice, dead reeds standing stiff, a humpbacked stone bridge furred with frost',
      'a ruined formal parterre, geometric beds of dead black hedging outlined in frost, a toppled urn spilling frozen earth, gravel paths cracked',
      'an overgrown rose conservatory gone to ruin, a glass dome half-collapsed, a single frozen rose-tree filling the space, frost on every shard',
      'a thorn-choked secret garden behind a frost-split stone wall, a rusted gate, black briars swallowing a forgotten stone bench and birdbath',
    ],
    instructions: `Each entry is ONE cursed frozen gothic garden, 22-36 words. The GARDEN is the hero (frost / thorns / statuary / decay / mournful beauty). NEVER a character-subject, NEVER a cheerful spring garden. Output as a NUMBERED list (1. ... 2. ...), one per line. NO internal newlines.`,
  },

  gothbot_frostgarden_flora: {
    format: 'simple',
    theme: `THE DARK FROST-FLORA — the plants of a cursed winter garden. Each entry 10-20 words. ONE haunting frozen/dark plant detail. Crimson-Peak / gothic-fairy-tale lineage.

⚠️ Dark gothic flora touched by frost — black roses, frost-flowers, thornbriars, withered wisteria, pale moonflowers, frozen lilies, ice-glazed ivy, dead foxglove, hoarfrost ferns, blue-glowing nightbloom, brittle nightshade.

🚫 NO bright cheerful spring blooms. NO tropical jungle. NO modern garden plants.`,
    touchpoints: [
      'black roses rimed in white frost, petals stiff and glittering, thorned canes arching over a path',
      'delicate frost-flowers blooming across the cold ground in feathery white crystal fans',
      'tangled thornbriars choking a stone bench, every barb tipped with a bead of clear ice',
      'withered wisteria hanging in frozen lavender cascades from an iron arbor',
      'pale luminous moonflowers half-open in the frost, glowing faintly blue in the gloom',
      'frozen lilies standing stiff on a glazed black pond, their petals sheathed in ice',
      'ice-glazed ivy climbing a frost-split wall, each leaf a perfect glass replica of itself',
      'dead foxglove and brittle nightshade standing tall and black against the silver frost',
      'hoarfrost ferns unfurling in feathered white along the shaded edge of the path',
      'a single frozen rose-tree, its black blooms encased in clear ice like glass ornaments',
      'brittle dried hydrangea-heads furred with frost, drooping over a cracked urn',
      'creeping blue-glowing nightbloom threading luminous through the frozen undergrowth',
    ],
    instructions: `Each entry is ONE dark frost-flora detail, 10-20 words. Frozen, gothic, mournful. Output as a NUMBERED list (1. ... 2. ...), one per line. NO internal newlines.`,
  },

  gothbot_frostgarden_frost_feature: {
    format: 'simple',
    theme: `THE FROST SIGNATURE — the SIGNATURE money-shot: the ICE/frost effect that makes the garden magical and cold. Each entry 12-24 words. The single frozen detail that makes the shot iconic. Crimson-Peak / Frozen-fairy-tale lineage.

⚠️ A gorgeous ICE/FROST hero-effect — a fountain frozen mid-cascade, ice-glazed statuary, frost-feathered glass panes, a frozen pond mirror, icicles draping an arbor, snow dusting topiary, a frost-rimed spiderweb, hoarfrost furring every surface, breath-fog hanging in the cold air.

🚫 NO heavy blizzard whiteout (the garden must stay readable). NO warm sun melting it.`,
    touchpoints: [
      'a great fountain frozen mid-cascade, its falling water caught as glassy blue-white ice sheets and dripping icicle-curtains',
      'every statue glazed in a skin of clear ice, frost furring their carved faces and outstretched stone hands',
      'frost-feathered conservatory glass, the panes ferned white with crystal patterns glowing in the moonlight',
      'a black pond frozen to a perfect clouded mirror, reflecting the bare trees and the pale moon above',
      'long crystalline icicles draping the arbor in a glittering curtain, the path beneath glazed slick',
      'fine snow dusting the topiary beasts, softening their shapes, the gravel paths powdered white',
      'a vast frost-rimed spiderweb strung between two thorned arbors, every strand beaded with ice',
      'thick hoarfrost furring every twig, thorn and railing in feathery white, the whole garden silvered',
      'breath-fog and frost-mist hanging low over the frozen beds, lit silver-blue by the moon',
      'a frozen rivulet winding through the garden caught mid-flow as ribboned blue ice over the stones',
      'ice-sheathed rose-arbors arching overhead, the black blooms encased like jewels in clear glass',
      'a sundial encased in a dome of clear ice, its frozen shadow stopped forever at midnight',
    ],
    instructions: `Each entry is ONE iconic frost/ice effect, 12-24 words. Gorgeous, cold, magical, readable. NEVER a whiteout, NEVER melting. Output as a NUMBERED list (1. ... 2. ...), one per line. NO internal newlines.`,
  },

  gothbot_frostgarden_statuary: {
    format: 'simple',
    theme: `THE GARDEN CENTREPIECE — the stone feature the eye lands on. Each entry 12-24 words. ONE arresting garden centrepiece (usually statuary or stonework). Crimson-Peak / gothic-fairy-tale lineage.

⚠️ A single hero stone-feature anchoring the garden — a weeping angel statue, a draped mourner, a cracked sundial, a fountain-figure, a moss-eaten cherub, an armless goddess, a gothic gazebo, an iron-and-glass folly, a tomb among the roses, a stone archway.

🚫 NO living monster as centrepiece (this is a still, empty garden). NO modern objects.`,
    touchpoints: [
      'a weeping stone angel kneeling at the garden centre, frost on her folded wings, face buried in carved hands',
      'a draped marble mourner standing among the black roses, her stone veil furred with hoarfrost',
      'a cracked stone sundial on a frost-split plinth, its gnomon hung with a single icicle',
      'a moss-eaten cherub fountain-figure, its basin frozen, ivy and ice climbing its pitted stone',
      'an armless weathered goddess on a pedestal, frost outlining every fold of her carved robe',
      'a wrought-iron-and-glass garden folly at the path-end, its panes frost-feathered, dark within',
      'a single ivy-wrapped tomb among the rose-briars, its stone lid carved with a sleeping figure',
      'a crumbling stone archway hung with frozen climbing roses, framing the misty depth beyond',
      'a great frost-furred urn on a balustrade, dead trailing plants spilling stiff over its rim',
      'a pale statue of a robed maiden holding a frozen stone lantern, frost glittering on her face',
      'a tiered stone birdbath cracked and frozen solid, a single black feather frozen into the ice',
      'a stone gazebo at the maze-heart, its dome laced with icicles, a frozen bench within',
    ],
    instructions: `Each entry is ONE arresting garden stone-centrepiece, 12-24 words. Still, gothic, frost-touched. NO living monster, NO modern objects. Output as a NUMBERED list (1. ... 2. ...), one per line. NO internal newlines.`,
  },

  gothbot_frostgarden_light_sky: {
    format: 'simple',
    theme: `THE LIGHT + SKY + COLD AIR over the frozen garden. Each entry 14-26 words. The lighting, the sky overhead, and the cold atmosphere together. Crimson-Peak / gothic-fairy-tale lineage.

⚠️ Cold gothic light + sky + frost-air — pale moonlight silvering the frost, frost-blue pre-dawn, lavender twilight, a low pale sun through fog, witch-fire wisps drifting, mist pooling, a single moon through bare branches, aurora-thin light at the horizon. Frost-mist and breath-cold are part of it.

🚫 NO warm golden daylight, NO bright blue summer sky. NO modern light. Keep it cold, dim, dreamlike — Nightshade palette.

✓ Lean toward CLEAN skies (deep violet, single moon, pale fog) that let the garden read.`,
    touchpoints: [
      'pale moonlight pours over the garden, silvering every frost-furred surface, the sky a deep clear violet-black above bare branches',
      'frost-blue pre-dawn light, the eastern sky a cold pale rose, the garden hushed and silver-grey in the half-light',
      'soft lavender twilight settling over the beds, the first stars pricking a violet sky, mist rising off the frozen lawns',
      'a low pale sun smothered in fog, casting no warmth, the garden flat and silver under a colourless winter sky',
      'witch-fire wisps drift between the frozen arbors, casting drifting green light on the hoarfrost, the sky deep indigo above',
      'a single huge pale moon hangs through the bare black branches, its cold light glazing the frozen pond to a mirror',
      'thin aurora-light shimmers green-violet low at the horizon, the garden silvered beneath, frost-mist pooling along the paths',
      'heavy frost-fog fills the garden, the statuary looming as grey shapes, a diffuse silver glow with no visible source',
      'storm-light flickers behind racing clouds, lightning briefly silvering the frozen fountain, the sky a churning slate-violet',
      'a clear cold star-field arcs over the walled garden, the milky band faint, the frost glittering back like an answering sky',
      'sickly amber lantern-light glows from a distant conservatory, warm against the cold blue frost of the foreground beds',
      'a blood-orange dusk burns low and cold behind the bare orchard, the long shadows of the trees barred across the frost',
    ],
    instructions: `Each entry is ONE cold light + sky + frost-air over the garden, 14-26 words. Cold, dim, dreamlike, Nightshade. NEVER warm daylight. Output as a NUMBERED list (1. ... 2. ...), one per line. NO internal newlines.`,
  },

  gothbot_frostgarden_accent: {
    format: 'simple',
    theme: `THE ACCENT — a small life-sign in the frozen garden (60%-gated). Each entry 10-20 words. ONE small element of life or a tiny scale-prover. Crimson-Peak / gothic-fairy-tale lineage.

⚠️ SMALL accent — dark garden wildlife (a raven on a statue, a white fox in the snow, crows in the dead orchard, a black cat on a frozen bench, a robin on a thorn, moths) OR a tiny distant figure (a small cloaked figure on a far path, dwarfed by the garden — NEVER the subject, 8-15%).

🚫 NEVER dominates — the GARDEN is the hero. NO large monster, NO combat, NO group.`,
    touchpoints: [
      'a single raven perched on the weeping angel statue, black against the white frost, utterly still',
      'a white fox picks its way across the frozen lawn, leaving a thread of small prints in the hoarfrost',
      'a scatter of crows roosting in the bare black orchard, a few lifting into the cold sky',
      'a black cat curled on a frost-furred stone bench, watching the silent garden',
      'a small red robin on a thorned rose-cane, the one spot of warm colour in the frozen grey',
      'pale moths drifting around a distant conservatory window, lit faintly from within',
      'a tiny cloaked figure stands far down a frozen path, dwarfed by the towering bare arbors',
      'a single white owl on the frozen fountain rim, silhouetted against the pale moon',
      'a deer stands frozen-still among the dead trees, breath fogging, ready to bolt',
      'a small distant figure with a lantern moves through the hedge-maze, the light a warm pinprick',
      'a swan, white and motionless, sits on the frozen black pond as if caught in the ice',
      'a hare crouches beneath a frosted hedge, ears flat, eyes catching the moonlight',
    ],
    instructions: `Each entry is ONE small accent (dark garden wildlife OR tiny distant figure), 10-20 words. NEVER dominates the garden. Output as a NUMBERED list (1. ... 2. ...), one per line. NO internal newlines.`,
  },

  // ════════════════════════════════════════════════════════════════
  // twilight-gothic — NEW path (2026-06-10). A gothic SCENE at the MAGIC HOUR —
  // dawn / dusk / golden-hour / blue-hour / foggy-morning. Fills the "all-night"
  // gap: soft warm-cool transitional LIGHT is the hero quality. NO deep night.
  // NO CHARACTERS as subject. universal:[].
  // ════════════════════════════════════════════════════════════════
  gothbot_twilight_scene: {
    format: 'simple',
    theme: `THE GOTHIC SCENE AT TWILIGHT — the HERO axis. Each entry is ONE gothic landscape/subject seen at the MAGIC HOUR (dawn / dusk / twilight / foggy-morning). 22-36 words. A castle on a ridge, a hill-top cemetery, a foggy abbey ruin, a moorland church, a cliff monastery, a misty village, a lone gothic bridge, a manor on a hill, a crossroads gibbet, standing stones, a drowned causeway, a lighthouse on a black cape. Sleepy-Hollow / Crimson-Peak / gothic-fairy-tale / Caspar-David-Friedrich lineage.

⚠️ THE BAR — a gorgeous gothic scene bathed in SOFT TRANSITIONAL LIGHT: long shadows, a low sun or pale dawn, mist in the hollows, warm-and-cool colour. Melancholy and beautiful and still. The SCENE + its LIGHT are the hero.

🚫 NOT DEEP NIGHT, NOT full moonlit-dark (those are other paths) — this is the magic hour: dawn, dusk, golden-hour, blue-hour, fog-morning. NO characters as subject (tiny accent only). NO modern / NO sci-fi / NO LOTR-Skyrim-Witcher vocabulary.

✓ VARIETY MANDATE (~18):
  • CASTLE / KEEP on a ridge (~2) — silhouetted against the dawn or dusk
  • HILL-TOP CEMETERY (~2) — leaning headstones, long shadows, mist
  • FOGGY ABBEY / CATHEDRAL RUIN (~2) — broken arches in golden mist
  • MOORLAND CHURCH / CHAPEL (~2) — a lone church on the heath at gloaming
  • CLIFF MONASTERY / SEA-STACK (~2) — a monastery on a black cape over a dawn sea
  • MISTY VILLAGE / HAMLET (~2) — gabled rooftops + woodsmoke in the valley fog
  • LONE GOTHIC BRIDGE / CAUSEWAY (~2) — an old bridge over a misted river at dusk
  • MANOR / MANSION on a hill (~1) — a dark mansion against a burning sunset
  • CROSSROADS GIBBET / STANDING STONES (~1) — a gibbet or stone-ring on the dusk moor
  • WINDING ROAD / AVENUE (~1) — a bare-tree avenue or hollow-way at golden last-light
  • HARBOUR / LIGHTHOUSE (~1) — a black harbour or lighthouse at cold dawn

Each entry: the gothic subject + the magic-hour time + the landscape setting + a melancholy-beautiful trait. The LIGHT and TIME are felt.`,
    touchpoints: [
      'a vast gothic castle silhouetted black on a ridge against a burning blood-orange dusk, its towers sharp, the valley below sinking into blue shadow',
      'a hill-top cemetery at golden last-light, leaning frost-furred headstones casting long shadows across the dewy grass, a bare oak black against the sky',
      'a ruined gothic abbey at dawn, broken pointed arches rising from a sea of pale golden mist, the rising sun glowing through the empty rose-window',
      'a lone moorland church at gloaming, its squat tower dark on the empty heath, the last violet light draining from a vast lavender sky',
      'a cliff-top monastery on a black sea-cape, the cold rose dawn breaking over a misted ocean, gulls wheeling far below the broken walls',
      'a misty village in a valley at dusk, gabled rooftops and a gothic spire rising from woodsmoke and golden fog, lamps just beginning to glow',
      'an old humpbacked gothic bridge over a misted river at dusk, its arches doubled in the still water, bare willows trailing into the gold-grey haze',
      'a dark gothic manor on a low hill against a furious sunset, its many windows catching the last red fire, black cypress flanking the drive',
      'a crossroads gibbet-cage on the open dusk moor, the empty cage creaking, a single bare thorn-tree leaning beside it under a bruised lavender sky',
      'a ring of standing stones on a heather moor at first light, long blue shadows reaching west, a low pearl mist clinging to the ground between them',
      'a bare-tree avenue receding to a distant gothic gatehouse, the low golden sun firing through the trunks, leaves drifting down through the warm light',
      'a black lighthouse on a storm-worn cape at cold dawn, the sea a sheet of pewter and rose, the sky streaked with the first pale fire',
      'a gothic cathedral town across a river at blue-hour, spires and rooftops a layered silhouette, the water mirroring a deep indigo-and-amber sky',
      'a windswept clifftop graveyard above a dawn sea, crosses and angels leaning into the wind, the horizon a thin band of cold rose fire',
    ],
    instructions: `Each entry is ONE gothic scene at the magic hour, 22-36 words. The SCENE + soft transitional LIGHT are the hero. NEVER deep night, NEVER a character-subject. Output as a NUMBERED list (1. ... 2. ...), one per line. NO internal newlines.`,
  },

  gothbot_twilight_light: {
    format: 'simple',
    theme: `THE MAGIC-HOUR LIGHT — the SIGNATURE money-shot: the exact quality of transitional light. Each entry 14-26 words. The single thing that defines this path is the LIGHT of dawn/dusk/twilight. Caspar-David-Friedrich / Sleepy-Hollow / golden-hour-cinematography lineage.

⚠️ SOFT TRANSITIONAL LIGHT — rose dawn, blood-orange dusk, lavender blue-hour, golden last-light, pale foggy morning, amber gloaming, silver pre-dawn, a low sun through mist, god-rays through fog, the green flash, alpenglow on stone. Long warm shadows + cool blue shade.

🚫 NOT deep night, NOT a high bright noon sun, NOT moonlight-as-primary. NO modern/electric light.`,
    touchpoints: [
      'a low blood-orange sun sits on the horizon, raking long gold shadows across the ground and firing the stone edges molten',
      'cold rose-and-violet dawn light spreads from the east, the world still blue-grey, the first warmth just touching the highest towers',
      'deep lavender blue-hour glow after sunset, the sky a gradient of indigo to amber, every shape softened to silhouette',
      'golden last-light pours low and warm through mist, turning the haze to luminous gold and gilding every wet leaf and stone',
      'pale foggy-morning light, flat and silver and sourceless, the sun a soft white disc smothered in the mist',
      'amber gloaming, the warm dying light glowing on west-facing stone while cool blue shadow pools in every hollow',
      'silver pre-dawn light, the sky pearl-grey shading to faint rose, mist sheeting low and luminous across the ground',
      'god-rays fan down through a broken sky and drifting fog, solid golden shafts striking the ruin below',
      'the sun a swollen red disc setting through haze, the whole scene drenched in a deep smouldering crimson-gold',
      'a thin band of cold green-and-rose fire on the horizon, the last of the light, the land above it sinking to violet-black',
      'warm sodium-gold dusk afterglow on the underside of low cloud, reflected soft onto the misted fields below',
      'alpenglow firing the upper stonework pink-gold while the base of the scene drowns in cool blue twilight shade',
    ],
    instructions: `Each entry is ONE magic-hour light quality, 14-26 words. Soft, transitional, warm-and-cool. NEVER deep night, noon, or moonlight. Output as a NUMBERED list (1. ... 2. ...), one per line. NO internal newlines.`,
  },

  gothbot_twilight_sky: {
    format: 'simple',
    theme: `THE TWILIGHT SKY — the sky at the magic hour. Each entry 12-24 words. ONE gorgeous dawn/dusk/twilight sky. Caspar-David-Friedrich / romantic-landscape lineage.

⚠️ A magic-hour sky — streaked sunset, pastel dawn, layered violet cloud, a low burning sun, a thin crescent at dusk, a fog-bank rolling in, a flock crossing the gloaming, mackerel cloud lit from below, the first stars in an indigo east.

🚫 NOT a black night sky, NOT a high blue noon sky. The sky is part of the magic hour.`,
    touchpoints: [
      'a streaked sunset of crimson, gold and violet banding the western sky, the clouds underlit in fire',
      'a soft pastel dawn, the sky shading from pale rose at the horizon up through peach to faint lavender',
      'layered violet-and-amber cloud rolling slow across a deepening dusk sky, the light draining warm to cold',
      'a low burning sun half-sunk into a bank of indigo cloud, its last rays spoking up across the sky',
      'a thin pale crescent moon hanging in a still-lit lavender dusk sky, one bright planet beside it',
      'a wall of pearl-grey fog rolling in low under a pale colourless dawn sky, swallowing the far distance',
      'a great ragged flock of crows crossing the burning gloaming sky, scattering black against the gold',
      'a mackerel sky of small clouds lit pink-and-gold from below by the set sun, fading to blue overhead',
      'the first faint stars pricking a deep indigo eastern sky while the west still burns amber',
      'storm-cloud breaking at dusk, a single shaft of gold light spearing through onto the dark land',
      'a vast empty dawn sky of palest eggshell-blue and rose, a single high contrail catching the early sun',
      'sodium-orange afterglow smouldering along the whole horizon under a heavy lid of deep blue cloud',
    ],
    instructions: `Each entry is ONE magic-hour sky, 12-24 words. Dawn/dusk/twilight only — never black night or noon-blue. Output as a NUMBERED list (1. ... 2. ...), one per line. NO internal newlines.`,
  },

  gothbot_twilight_atmosphere: {
    format: 'simple',
    theme: `THE TWILIGHT ATMOSPHERE — the air + weather effect at the magic hour. Each entry 12-22 words. What fills the air and catches the low light. Sleepy-Hollow / romantic-landscape lineage.

⚠️ Magic-hour atmosphere — ground-fog pooling in the hollows, valley mist, drifting woodsmoke, long dewy shadows, drifting autumn leaves, a chill golden haze, dust-gold in the sunbeams, sea-spray haze, the breath of cattle, midges dancing in a sunbeam.

🚫 NO heavy night-darkness, NO whiteout. The atmosphere makes the low light VISIBLE.`,
    touchpoints: [
      'low ground-fog pools white in every hollow and ditch, the tops of stones and trees rising clear above it',
      'valley mist fills the whole low ground, the gothic spire and hill-tops floating as islands above a golden sea',
      'drifting woodsmoke from unseen chimneys hangs blue in the still dusk air, catching the last warm light',
      'long dew-silvered shadows stretch east across the grass, every blade catching a bead of golden light',
      'drifting autumn leaves spin slowly down through a slanting golden sunbeam, the air thick with warm light',
      'a chill golden haze softens all the distance, the far hills fading to flat lavender silhouettes',
      'dust-gold motes hang in the low god-rays, drifting slow through the warm slanted light',
      'cold sea-spray haze blurs the base of the cliffs, the upper rocks catching the rose dawn clear above it',
      'the breath of unseen cattle fogs in the cold gloaming air, the field sinking into blue shadow',
      'a thin luminous river-mist threads along the water, glowing where the low sun strikes it',
      'midges dance in a single slanting amber sunbeam between the dark trees, the rest in cool shadow',
      'frost-smoke rises off the dew as the first sun touches the cold ground, glowing pale gold',
    ],
    instructions: `Each entry is ONE magic-hour atmosphere, 12-22 words. Makes the low light visible. Never night-dark, never whiteout. Output as a NUMBERED list (1. ... 2. ...), one per line. NO internal newlines.`,
  },

  gothbot_twilight_foreground: {
    format: 'simple',
    theme: `THE FOREGROUND ANCHOR — a near element that frames the twilight scene + gives depth. Each entry 10-20 words. ONE foreground object the composition opens from. Romantic-landscape / Friedrich repoussoir lineage.

⚠️ A foreground anchor — a lone bare tree, a wrought-iron gate, a leaning headstone, a weathered stone cross, a flock of crows on a fence, a winding road, a milestone, dead reeds, a broken wall, a roadside shrine, a gnarled root, a wayside bench.

🚫 NO modern objects. NO living human as the anchor (a tiny figure is a separate accent axis).`,
    touchpoints: [
      'a lone gnarled bare tree in the near foreground, its black branches clawing across the burning sky',
      'a rusted wrought-iron gate hanging open in the foreground, framing the misted scene beyond',
      'a single leaning lichen-furred headstone close to the camera, the cemetery receding behind it',
      'a weathered stone wayside cross in the foreground, its arms catching the last gold light',
      'a row of crows perched on a foreground fence-rail, black silhouettes against the gloaming',
      'a pale winding road or hollow-way leading the eye from the foreground into the misted distance',
      'a mossy milestone half-swallowed by grass in the foreground, the road curving away behind',
      'dead reeds and rushes in the near foreground, black against the glowing water beyond',
      'a tumbled drystone wall in the foreground, its gap framing the distant dusk-lit church',
      'a small roadside shrine with a guttered candle in the foreground, the moor stretching beyond',
      'a gnarled exposed tree-root and a scatter of bracken framing the lower edge of the frame',
      'an old wayside bench under a bare tree, empty, facing the burning sunset across the valley',
    ],
    instructions: `Each entry is ONE foreground anchor, 10-20 words. Frames the scene + gives depth. No modern objects, no human anchor. Output as a NUMBERED list (1. ... 2. ...), one per line. NO internal newlines.`,
  },

  gothbot_twilight_accent: {
    format: 'simple',
    theme: `THE ACCENT — a small life-sign in the twilight scene (50%-gated). Each entry 10-20 words. ONE small element of life or a tiny distant figure. Sleepy-Hollow / romantic-landscape lineage.

⚠️ SMALL accent — wildlife (a flock of crows, a lone rider, a deer at the wood-edge, an owl, a fox, wheeling rooks, sheep on the moor) OR a tiny distant figure (a hooded traveller on the road, a shepherd, a distant funeral procession, a lone figure at a grave — NEVER the subject, 5-12%).

🚫 NEVER dominates — the SCENE + LIGHT are the hero. NO large monster, NO combat, NO close-up figure.`,
    touchpoints: [
      'a ragged flock of crows lifts from the bare trees, scattering black across the burning dusk sky',
      'a single hooded traveller on the winding road far below, tiny against the vast misted valley',
      'a lone rider on a dark horse crests the distant ridge, silhouetted on the gold horizon',
      'a deer stands at the edge of the misted wood, head up, caught in the last gold light',
      'a tiny distant funeral procession winds toward the hill-top church, small black shapes in the gloaming',
      'rooks wheel and call around the abbey ruin, a slow black spiral against the rose dawn',
      'a single shepherd and his dog move a scatter of pale sheep across the dusk-blue moor',
      'a lone figure stands at a distant grave on the cemetery hill, dwarfed by the burning sky',
      'a white owl glides low and silent across the misted field toward the dark wood',
      'a fox trots along the foreground wall, pausing to look back, its coat lit gold by the low sun',
      'a horse-drawn cart crawls along the far causeway, a small dark shape on the misted road',
      'a flock of starlings ripples in a murmuration over the village rooftops at dusk',
    ],
    instructions: `Each entry is ONE small accent (wildlife OR tiny distant figure), 10-20 words. NEVER dominates the scene. Output as a NUMBERED list (1. ... 2. ...), one per line. NO internal newlines.`,
  },

  // ════════════════════════════════════════════════════════════════
  // the-dark-prince — NEW path (2026-06-10). MALE dark-beauty/menace BUST portrait
  // — vampire-lord / cursed-prince / dark-sorcerer. The male counterpart to
  // vampire-girls-2. Opulent, aristocratic, beautiful-but-evil — NOT a hunter
  // (the other male paths are all hunters). Gender-locked MALE, solo, LARGE bust.
  // ════════════════════════════════════════════════════════════════
  darkprince_archetype: {
    format: 'simple',
    theme: `THE DARK PRINCE — the HERO archetype (his ROLE + energy). Each entry 15-26 words. ONE elegant, menacing, beautiful MALE dark-aristocrat. Castlevania-Dracula / Alucard / Lestat / Crimson-Peak-Thomas-Sharpe / Hellsing-Alucard / byronic-dark-lord lineage.

⚠️ An opulent, dangerous, gorgeous-but-EVIL male aristocrat — a vampire lord, a cursed prince, a dark sorcerer. Cold elegance + ancient menace. NOT a hunter, NOT a warrior-in-armor, NOT a scruffy rogue — a REFINED, powerful, damned nobleman.

🚫 NO hunter / inquisitor / Belmont / Van-Helsing (that is a different path). NO scruffy / no peasant. NO femboy / androgynous-pretty-boy — he is MALE, commanding, masculine-elegant.

✓ VARIETY MANDATE (~16): vampire-count / vampire-progenitor-elder / cursed crown-prince / dark sorcerer-lord / byronic revenant / blood-king / demon-prince / undying emperor / gothic archduke / nosferatu-but-elegant / shadow-bishop / opera-phantom-lord / damned cardinal / warlock-duke / lich-lord (elegant, not skeletal) / fallen-angel prince.`,
    touchpoints: [
      'an ancient vampire count, cold and courteous and utterly lethal, centuries of cruelty behind a beautiful aristocratic stillness',
      'a cursed crown-prince, young and gorgeous and damned, bearing the weight of an undying bloodline with bitter elegance',
      'a dark sorcerer-lord, arcane power coiling around him, eyes that have read forbidden things, serene and terrifying',
      'a byronic revenant nobleman, romantic and doomed and dangerous, beauty sharpened by grief and centuries of hunger',
      'a blood-king upon his ancient line, imperious and magnetic, the kind of monster others kneel to willingly',
      'a demon-prince in human-elegant form, otherworldly and seductive, an old god wearing a beautiful man like a glove',
      'an undying gothic emperor, regal and weary and pitiless, his court long dust, his power undimmed',
      'a nosferatu elder rendered ELEGANT, ancient and predatory but draped in dark refinement, not a feral ghoul',
      'a shadow-bishop of a fallen faith, robed and ringed and damned, holy beauty turned to something unholy',
      'an opera-phantom dark-lord, theatrical and obsessive and brilliant, half-masked, magnetic and unstable',
      'a warlock-duke, urbane and amused and deadly, trading in pacts and ruin from behind a charming smile',
      'a fallen-angel prince, unbearably beautiful and cold, the memory of grace curdled into proud damnation',
      'a vampire-progenitor, the first of a line, primordial and serene, his hunger a calm and bottomless thing',
      'a damned cardinal-prince, scarlet and gold and corrupt, sanctity rotted into exquisite cruelty',
      'a gothic archduke of a dead kingdom, melancholy and grand, ruling a court of ghosts with perfect manners',
      'a lich-lord kept ELEGANT and whole, not skeletal — a sorcerer-king who cheated death and kept his beauty',
    ],
    instructions: `Each entry is ONE elegant menacing male dark-aristocrat archetype, 15-26 words. Refined + powerful + damned. NEVER a hunter, NEVER androgynous-pretty-boy. Output as a NUMBERED list (1. ... 2. ...), one per line. NO internal newlines.`,
  },

  darkprince_ethnicity: {
    format: 'simple',
    theme: `THE LOOK + UNDEAD PALLOR — his ethnicity/heritage rendered with a dark-aristocrat's cast. Each entry 12-22 words. ONE masculine face-heritage + its pale, refined, dangerous quality. Span world ethnicities.

⚠️ A handsome, severe, aristocratic MALE face of a specific heritage, touched with undead or cursed pallor — pale, cold, beautiful, masculine. Sharp bone structure, commanding presence.

🚫 NO soft/cute/boyish. NO real-world ethnic stereotypes or slurs — describe features + pallor with dignity. He is human-shaped (NO elf/pointed ears).

✓ Span: pale Slavic / Nordic-fair / Mediterranean-olive / Spanish / Persian / South-Asian / East-Asian / West-African / Levantine / Roma / Romanian-noble / Latin-American — each with refined masculine bone structure + cursed pallor.`,
    touchpoints: [
      'a pale Slavic nobleman, high broad cheekbones and a hard jaw, ice-grey undertone beneath corpse-pale skin',
      'a Nordic-fair lord, sharp pale features and a strong brow, frost-white skin and a cold severe beauty',
      'a Mediterranean-olive aristocrat, dark brows and an aquiline nose, the olive skin drained to a sallow marble pallor',
      'a Persian prince, deep-set dark eyes and an elegant straight nose, warm-bronze skin gone cold and ashen',
      'a South-Asian dark-lord, rich brown skin dulled to a grey undertone, strong handsome features and a regal bearing',
      'an East-Asian nobleman, refined angular features and a smooth jaw, porcelain skin with a corpse-cold cast',
      'a West-African prince, deep dark skin with an ashen undertone, proud sculptural features and a commanding brow',
      'a Levantine aristocrat, golden-tan skin gone wan and grey, dark expressive eyes and a fine straight nose',
      'a Spanish grandee, sharp dark Iberian features, sallow ivory skin and a thin cruel-elegant mouth',
      'a Romanian boyar, gaunt pale features and heavy dark brows, the classic Carpathian undead pallor',
      'a Roma lord, dark soulful eyes and rich features drained pale, a wild and dangerous masculine beauty',
      'a Latin-American dark-noble, warm-brown skin gone cold-grey, strong handsome features and a proud jaw',
    ],
    instructions: `Each entry is ONE masculine aristocratic face-heritage + undead pallor, 12-22 words. Handsome, severe, dignified. Human-shaped. Output as a NUMBERED list (1. ... 2. ...), one per line. NO internal newlines.`,
  },

  darkprince_hair: {
    format: 'simple',
    theme: `THE HAIR — his dark-aristocrat hair. Each entry 10-20 words. ONE masculine gothic hairstyle. Castlevania / Interview-with-the-Vampire / Crimson-Peak lineage.

⚠️ Masculine dark gothic hair — long raven mane, slicked-back with a widow's peak, shoulder-length waves, silver-streaked, wild and tousled, a sleek dark ponytail, close-cropped with a sharp widow's-peak, long silver-white, severe and elegant.

🚫 NO cute/boyish/modern-trendy cuts. NO colorful dye-jobs. Dark, refined, dangerous.`,
    touchpoints: [
      'a long raven-black mane falling past the shoulders in loose dark waves, framing a pale severe face',
      'slicked-back black hair with a sharp widow\'s peak, severe and aristocratic, not a strand out of place',
      'shoulder-length dark waves swept back from a high pale brow, faintly silvered at the temples',
      'a long silver-white mane, ancient and elegant, flowing over a high black collar',
      'wild tousled black hair, romantic and unkempt, falling across burning eyes',
      'a sleek low black ponytail bound in dark ribbon, a few loose strands at a sharp jaw',
      'close-cropped black hair with a pronounced widow\'s peak, a hard masculine elegance',
      'long dark hair streaked with grey, half pulled back, the rest falling about a gaunt handsome face',
      'jet-black hair pushed straight back, glossy and severe, baring a pale aristocratic forehead',
      'chin-length dark hair parted in the centre, curtaining a cold beautiful face, Byronic and brooding',
      'a leonine mane of dark hair shot through with white, regal and untamed, a fallen king\'s crown',
      'short dark hair with sharp sideburns and a neat widow\'s peak, precise and dangerous',
    ],
    instructions: `Each entry is ONE masculine dark gothic hairstyle, 10-20 words. Dark, refined, dangerous. Output as a NUMBERED list (1. ... 2. ...), one per line. NO internal newlines.`,
  },

  darkprince_wardrobe: {
    format: 'simple',
    theme: `THE WARDROBE — his opulent male gothic attire. Each entry 16-30 words. ONE richly-detailed masculine dark-aristocrat outfit. Dracula / Crimson-Peak / Castlevania / Baroque-noble lineage.

⚠️ Opulent masculine gothic attire — a high-collared black cloak, a brocade frock-coat, an ornate cravat + embroidered waistcoat, a fur-trimmed mantle, a gilded breastplate over black silk, a great-coat with silver clasps, a damask doublet, jeweled rings, a ruffled high collar. Layered, rich, textured.

🚫 NO modern clothing. NO armor-only (he is a courtier, not just a warrior). NO bare-chested. NO scruffy/peasant. Refined, layered, expensive.`,
    touchpoints: [
      'a high-collared floor-length black cloak over an embroidered oxblood-and-gold brocade frock-coat, a silver wolf-head clasp at the throat',
      'an ornate black velvet frock-coat with silver-thread embroidery, a ruffled white cravat gone ivory with age, jeweled rings on pale fingers',
      'a fur-trimmed deep-violet mantle over a black damask doublet, a heavy ancient signet ring, tarnished-gold buttons in a long row',
      'a gilded ceremonial breastplate worn over black silk, a tattered crimson half-cape, a single shoulder-pauldron carved with a wyrm',
      'a sweeping charcoal great-coat with double rows of silver clasps, a black silk scarf, a brocade waistcoat of midnight-and-amethyst',
      'a scarlet-and-gold cardinal\'s robe corrupted with dark embroidery, a heavy pectoral chain, rings of black stone',
      'a Baroque black-and-silver doublet with slashed sleeves showing oxblood silk beneath, a stiff ruffled collar framing a pale face',
      'a long high-collared coat of black-on-black damask, frogged with jet buttons, a sapphire stickpin in a grey cravat',
      'an emerald-and-black brocade frock-coat with a fur collar, lace at the cuffs, a cane-head of carved bone visible at the edge',
      'a sorcerer\'s robe of deep indigo sewn with faint silver constellations, a high collar, an amulet heavy on the chest',
      'a tattered imperial mantle of moth-eaten purple over ancient gilded finery, the grandeur of a dead empire worn with pride',
      'a sleek black military-cut greatcoat with silver epaulettes and a blood-red sash, severe, predatory, immaculate',
    ],
    instructions: `Each entry is ONE opulent masculine gothic outfit, 16-30 words. Layered, rich, textured, expensive. NEVER modern, bare-chested, or scruffy. Output as a NUMBERED list (1. ... 2. ...), one per line. NO internal newlines.`,
  },

  darkprince_menace: {
    format: 'simple',
    theme: `THE FACE + GLOWING EYES + DEMONIC TELL — the unified menace (the most important axis). Each entry 18-30 words. His HARD, MATURE, MASCULINE face + GLOWING inhuman eyes + a DEMONIC tell, woven together. This is the focal point.

⚠️ A HARD, MASCULINE, HANDSOME man's face — a strong heavy brow, a square or angular chiselled jaw, sharp cheekbones, a firm cruel mouth, a commanding dangerous bearing — with GLOWING inhuman eyes (light radiating outward) and a DEMONIC tell (bared fangs / a clawed fingertip at the jaw / slit pupils / dark veins at the temple). HANDSOME in a HARD, virile, dangerous way — masculine, not pretty.

🚫 ABSOLUTELY NO pretty-boy / bishonen / fashion-model / soft / smooth / delicate / androgynous / feminine / twink face. NO heavy makeup. NO elf ears / pointed ears. Vampires are AGELESS — he can read anywhere from a hard man in his prime to timeless, but he must be MASCULINE and CHISELLED — NOT a soft youth AND NOT forced-elderly. Light stubble or a trim beard is optional, not required. Think Gary-Oldman / Luke-Evans Dracula, a Frazetta dark-warlord — virile, severe, commanding.

Each entry MUST include: a HARD masculine face quality + GLOWING eyes (use "glowing" + "radiating") + a demonic tell.`,
    touchpoints: [
      'a hard chiselled face, a strong heavy brow and a square cruel jaw, deep-set eyes GLOWING blood-crimson and radiating light, fangs bared in a grim snarl',
      'a severe handsome face of cold marble, a firm square jaw and a hard mouth, pale-gold eyes GLOWING and casting light across sharp cheekbones, two fangs visible',
      'a commanding virile face, a strong straight nose and a heavy brow, ice-grey eyes GLOWING with cold radiating light, slit pupils, a clawed fingertip at his jaw',
      'a battle-hard predator\'s face, a thick brow and a firm set mouth, emerald eyes GLOWING and radiating witch-light, sharp fangs bared, imposing and still',
      'a sharp imperious face, strong angular features and a hard jaw, violet eyes GLOWING and pouring light into the gloom, a clawed black-nailed hand raised, fangs gleaming',
      'a rugged frost-pale face, a strong nose and a grim firm mouth, light stubble on a hard jaw, pale-blue eyes GLOWING and casting light, slit pupils, two needle fangs',
      'a magnetic hard-cut face, a square jaw and a thin dangerous mouth, amber eyes GLOWING like coals and radiating into the dark, a fang catching the light, a slow cruel half-smile',
      'a commanding chiselled face, a heavy brow over eyes that GLOW silver-white and radiate cold light, fangs bared, a clawed thumb dragging slow along his own jaw, predatory',
      'a regal hard face of cold stone, a strong clean jaw, eyes GLOWING fel-green and casting acid light, slit pupils, a fanged mouth set in imperious contempt',
      'a brutal handsome face drawn taut over a strong skull, dark eyes GLOWING with a deep red radiance, a long fang at the lip, an old scar splitting one heavy brow',
      'a grim virile face half in shadow, a strong jaw and hard cheekbones, one eye GLOWING gold and radiating light, fangs bared, a clawed finger raised, a trim severe beard',
      'a powerful granite-cut face, a massive brow and a broad hard jaw, bottomless eyes GLOWING pale and radiating light, long elegant fangs, skin like cold scarred marble',
    ],
    instructions: `Each entry is ONE unified HARD MASCULINE handsome male face + GLOWING eyes + demonic tell, 18-30 words. Chiselled, virile, commanding, dangerous — masculine NOT pretty, but NOT forced-old either (vampires are ageless). NEVER bishonen / smooth / soft / pointed-ears. MUST include "glowing"+"radiating" + a demonic tell. Output as a NUMBERED list (1. ... 2. ...), one per line. NO internal newlines.`,
  },

  darkprince_regalia: {
    format: 'simple',
    theme: `THE REGALIA — the SIGNATURE money-shot: the unforgettable focal piece marking him a dark prince. Each entry 12-22 words. ONE iconic object on or near him.

⚠️ A single arresting prince-detail — a black-iron crown, a goblet of dark wine/blood, a great ancient signet ring, a raven perched on his shoulder, a glowing amulet, a jeweled sceptre, an ornate skull-topped cane, a half-mask, a coiled serpent, a pocket-watch on a chain, a bound grimoire.

🚫 NO modern objects. NO weapon-as-hero (he is a lord, not a fighter — a blade may be sheathed at most). NO gore.`,
    touchpoints: [
      'a thorned black-iron crown resting low on his brow, set with a single bleeding-red ruby',
      'a tall ornate goblet of dark wine raised in a pale ringed hand, the surface catching the candlelight',
      'a great ancient signet ring of black gold on his forefinger, carved with a wyrm devouring its tail',
      'a sleek raven perched on his shoulder, head tilted, its eye a bead of black glass beside his pale jaw',
      'a glowing amulet at his throat, a captured ember of cold light pulsing slowly against the dark silk',
      'a jewelled sceptre of tarnished silver held loosely across his lap, its head a snarling stag-skull',
      'an ornate ebony cane topped with a carved silver skull, his pale hand resting upon it',
      'a fine porcelain half-mask pushed up onto his brow, the other half of his beautiful face bare',
      'a black serpent coiled lazily about his wrist and forearm, scales gleaming oil-dark',
      'an ancient pocket-watch on a long silver chain, stopped, swinging slow from his ringed fingers',
      'a bound grimoire clasped with black iron held against his chest, faint runes glowing along its edge',
      'a withered single black rose held to his lips, its petals frost-rimed, his eyes watching over it',
    ],
    instructions: `Each entry is ONE iconic prince-regalia detail, 12-22 words. A single arresting object. NO modern items, NO weapon-as-hero, NO gore. Output as a NUMBERED list (1. ... 2. ...), one per line. NO internal newlines.`,
  },

  darkprince_scene: {
    format: 'simple',
    theme: `THE SETTING — the lordly dark backdrop behind him (soft / blurred — he stays the focus). Each entry 15-28 words. ONE opulent gothic setting. Castlevania / Crimson-Peak / Dracula lineage.

⚠️ A rich gothic backdrop, thrown soft behind the bust — a candlelit throne room, a balcony over a moonlit gothic city, a great library, a crypt of his ancestors, a derelict ballroom, a war-council chamber, a cathedral nave, a fire-lit study. The setting frames him; it never competes.

🚫 NO modern / no daylight-bright. Keep it dim, opulent, dramatic — the gothic world of a dark lord.`,
    touchpoints: [
      'a candlelit throne room behind him, a great carved obsidian throne and tattered banners receding into warm gloom',
      'a high balcony over a moonlit gothic city, spires and rooftops falling away into blue mist below',
      'a vast ancestral library, towering shelves and a spiral stair lost in shadow, a single candelabra burning',
      'a crypt of his bloodline, carved sarcophagi and guttering candles ranged behind him in the cold dark',
      'a derelict grand ballroom, a cobwebbed chandelier and a dust-shrouded floor stretching away behind him',
      'a fire-lit study of dark wood and red leather, a great hearth throwing warm unsteady light across the gloom',
      'a cathedral nave at night, moonlight falling in coloured shafts through a great rose-window far behind',
      'a war-council chamber, a vast dark map-table and the banners of conquered houses hung above the panelling',
      'a moonlit conservatory of black glass, frost-feathered panes and dead exotic flora dim behind him',
      'an opulent dining hall, a long table set for a feast none will eat, candelabra blazing down its length',
      'a tower chamber of arcane instruments, an orrery and glowing alembics turning slow in the violet dark',
      'a rain-streaked gothic window at his back, the storm-lit city beyond blurred to silver and indigo',
    ],
    instructions: `Each entry is ONE opulent gothic backdrop, 15-28 words. Dim, rich, dramatic, soft behind him. NO modern, NO daylight. Output as a NUMBERED list (1. ... 2. ...), one per line. NO internal newlines.`,
  },

  darkprince_composition: {
    format: 'simple',
    theme: `COMPOSITION + FRAMING for the dark-prince bust portrait. Each entry 12-22 words. ONE bust/portrait framing. He fills 40-50% of the frame, the gothic setting around him.

⚠️ A BUST / chest-up portrait composition — three-quarter turn, a cold gaze down at the viewer, an over-the-shoulder glance, a low-angle that makes him loom, a near-profile, a head-on commanding stare. Always face-focused, bust 40-50%.

🚫 NO full-body / no wide shot (a different path does those). NO tight-crop losing the face. NO action pose. He is composed, still, commanding.`,
    touchpoints: [
      'a chest-up three-quarter portrait, his face turned slightly, eyes cutting back to the viewer, the hall soft behind',
      'a commanding head-on bust, looking straight down the lens with cold authority, the setting framing him symmetrically',
      'a low-angle bust that makes him loom and tower, chin lifted, the vaulted gloom rising behind',
      'an over-the-shoulder portrait, his face half-turned back toward the viewer, candlelight raking one cheekbone',
      'a near-profile bust, the elegant line of brow, nose and jaw against the dim opulent backdrop',
      'a tight chest-up portrait with one ringed hand raised near his jaw, the glowing eyes the focal point',
      'a slightly high-three-quarter bust, his eyes lifted to the viewer from beneath his brow, predatory and calm',
      'a centred bust framed by an arch or throne-back behind him, regal and symmetrical, face dead-centre',
      'a portrait turned to give a cold sidelong glance, the raven or goblet just entering the lower frame',
      'a head-and-shoulders portrait leaning subtly toward the viewer, intimate and threatening, eyes aglow',
      'a bust with the shoulder forward and face turned back, the cloak sweeping across the lower frame',
      'a still commanding chest-up portrait, hands folded, the dark prince regarding the viewer like a subject',
    ],
    instructions: `Each entry is ONE bust/portrait framing, 12-22 words. Face-focused, bust 40-50%, composed + commanding. NO full-body, NO action. Output as a NUMBERED list (1. ... 2. ...), one per line. NO internal newlines.`,
  },

  // ════════════════════════════════════════════════════════════════
  // the-haunting — NEW path (2026-06-10). A SOLO TRANSLUCENT GHOST / spectre
  // drifting a gothic place. Fills the "no ghosts" gap. TRANSLUCENCY is the
  // signature + the hard part. Sorrowful, beautiful, eerie. universal:[].
  // ════════════════════════════════════════════════════════════════
  gothbot_haunting_spectre: {
    format: 'simple',
    theme: `THE SPECTRE — the HERO axis. Each entry is ONE hauntingly beautiful, sorrowful FEMALE GHOST. 18-30 words. An elegant woman-ghost — a lady in white, a grey lady, a weeping bride, a drowned maiden, a veiled widow, a spectral nun, a phantom governess, a pale lady in a faded ball-gown. Crimson-Peak / The-Woman-in-Black / The-Others / gothic-ghost-story lineage.

⚠️ THE BAR — a HAUNTINGLY BEAUTIFUL, sad, eerie WOMAN-spectre: corpse-pale, mournful, elegant, otherworldly, frozen in some old grief, faintly luminous with a cold corpse-blue light. She is the hero of the frame. (Kevin's hearted look: the elegant translucent lady-ghost.)

🚫 ALWAYS a FEMALE ghost (this path is the beautiful lady-spectre — NO male lords/knights/soldiers/gallows-men). NOT a living solid person, NOT a vampire, NOT a monster/zombie, NOT a jump-scare gore-ghoul. SORROWFUL, beautiful, melancholy. NO modern / NO LOTR-Skyrim-Witcher vocabulary.

✓ VARIETY MANDATE (~16), all ELEGANT WOMEN:
  • LADY IN WHITE / grey lady (~4) — a pale mournful woman in a long trailing gown
  • WEEPING BRIDE / jilted bride (~3) — a spectral bride in a decaying veil
  • DROWNED MAIDEN (~2) — a water-soaked drifting spirit, hair like weed
  • VEILED WIDOW / mourner (~2) — a black-veiled grieving lady-phantom
  • SPECTRAL NUN / abbess (~1) — a hooded cloistered woman-ghost
  • PHANTOM GOVERNESS / housekeeper (~2) — a stern grey lady-phantom (NO child as subject)
  • PALE BALL-GOWN LADY (~1) — a young woman drifting a ballroom she never leaves
  • DARK-HAIRED MELANCHOLY LADY (~1) — a brooding pale beauty at a window

Each entry: the female-spectre archetype + her mournful identity / old grief + her corpse-pale, faintly cold-blue-luminous, elegant look. Faded, drained, spectral clothing (never rich color).`,
    touchpoints: [
      'a pale lady in a long trailing white gown, her face beautiful and grief-stricken, drifting with a sorrow centuries old, her form faintly cold-blue luminous',
      'a spectral bride in a yellowed decaying veil and gown, frozen forever at an altar that never came, her eyes hollow with betrayal',
      'a drowned maiden, her pale gown and long hair drifting as if still underwater, water beading and falling from her translucent form, mournful and slow',
      'a black-veiled widow-phantom, her grief a palpable cold, gloved hands clasped, a spectral mourning-brooch at her throat, endlessly waiting',
      'a hooded spectral nun gliding the cloister, her wimple grey and faded, her downturned face pale and sorrowful, lips moving in silent prayer',
      'a grey lady in a high-collared Victorian dress, hands folded, her beautiful face cold and resigned, faintly luminous in the dark',
      'a stern phantom governess in high-collared grey, hands clasped, watching an empty nursery with cold sorrow, her form semi-transparent',
      'a wailing lady, her mouth open in a silent endless keen, her hair and tattered shroud streaming as if in a wind that is not there',
      'a pale young woman in a faded ball-gown, a single spectral rose in her hand, drifting a ballroom she never wishes to leave',
      'a melancholy dark-haired beauty in a trailing pale gown, gazing from a tall window, corpse-pale and faintly glowing',
      'a drowned bride, her veil and gown sodden and trailing, pale hands lifted, water running endlessly from her translucent form',
      'a serene veiled abbess-ghost, a faint cold halo of light about her downturned head, drifting the dark chapel aisle',
    ],
    instructions: `Each entry is ONE hauntingly beautiful sorrowful FEMALE ghost, 18-30 words. Always an elegant WOMAN, corpse-pale + faintly cold-blue luminous. NEVER male / living-solid / vampire / gore-ghoul. Output as a NUMBERED list (1. ... 2. ...), one per line. NO internal newlines.`,
  },

  gothbot_haunting_visage: {
    format: 'simple',
    theme: `THE VISAGE — her FACE + HAIR, making each ghost a DISTINCT woman. Each entry 14-24 words. ONE specific combination of hair COLOUR + hairstyle + complexion/ethnicity + a couple of facial features. The whole point is VARIETY — no two ghosts should look like the same woman. (Kevin: the renders all looked like the same girl; differentiate face / hair colour / style.)

⚠️ Her FACE is always CLEAR + defined + beautiful (visible eyes, nose, sorrowful mouth) — NEVER blurred, smudged or erased. She is a ghost so corpse-pale/drained, but keep her ORIGINAL hair colour + ethnicity so she reads as a specific individual.

✓ VARIETY MANDATE — span widely, do NOT default to dark-haired-pale-young-woman every time:
  • HAIR COLOUR: raven-black, jet-black, silver-white, ash-blonde, platinum, honey-blonde, deep auburn, copper-red, chestnut, dark-brown, iron-grey, snow-white
  • HAIRSTYLE: long loose waves, heavy Victorian updo, braided coronet, ringlets half-up, severe centre-part, wild unbound, plait over one shoulder, low chignon, finger-waved bob, tumbling curls, Edwardian pompadour
  • COMPLEXION / FEATURES (all drained ghost-pale but varied undertone + bone-structure): sharp Slavic, soft round English, freckled Irish, porcelain East-Asian, olive Mediterranean, warm South-Asian, deep-brown, gaunt high-boned, delicate heart-shaped, lined-and-dignified-older
  • AGE: mostly young women, but a few dignified older ladies.

🚫 NO living-warm glow (she's drained), NO bright lipstick / modern makeup, NO blurred or faceless head.`,
    touchpoints: [
      'raven-black hair in a heavy Victorian updo, sharp Slavic cheekbones, dark sorrowful eyes, corpse-pale porcelain skin',
      'long loose ash-blonde waves, a soft round English face, faint freckles gone grey, gentle grief-stricken eyes',
      'deep auburn hair plaited over one shoulder, fair freckled Irish complexion, hollow-cheeked, mournful pale-green eyes',
      'silver-white hair unbound and wild, a gaunt high-boned face, near-translucent skin, huge haunted pale eyes',
      'sleek jet-black hair in a low chignon, porcelain East-Asian features, delicate, downturned dark eyes',
      'honey-blonde ringlets pinned half-up, a delicate heart-shaped face, soft full lips, sorrowful hazel eyes',
      'dark-brown hair coiled in a braided coronet, warm olive-Mediterranean skin drained ashen, deep-set grieving eyes',
      'copper-red hair tumbling in loose curls, pale freckled skin, a sharp little chin, wide mournful eyes',
      'iron-grey hair severely centre-parted, a lined dignified older face, hollow cheeks, cold pale eyes',
      'black hair in a finger-waved 1920s bob, a sharp angular face, dark-lidded sorrowful eyes, porcelain skin',
      'chestnut hair loose to the waist, warm South-Asian features drained ghost-pale, large dark grieving eyes',
      'platinum hair in a soft Edwardian pompadour, fine aristocratic features, a thin sad mouth, pale grey eyes',
    ],
    instructions: `Each entry is ONE distinct hair-colour + hairstyle + complexion + features combination, 14-24 words. MAXIMIZE variety — never the same woman twice. Corpse-pale but keep original hair colour + ethnicity. Face always CLEAR (never blurred/erased). Output as a NUMBERED list (1. ... 2. ...), one per line. NO internal newlines.`,
  },

  gothbot_haunting_translucency: {
    format: 'simple',
    theme: `THE TRANSLUCENCY — the SIGNATURE money-shot: the SEE-THROUGH spectral effect that makes her a GHOST. Each entry 12-24 words. This is the WHOLE POINT and the hard part — she must be SEMI-TRANSPARENT.

⚠️ The spectre is TRANSLUCENT — you SEE THROUGH her to the wall / window / stairs behind. Render: the architecture visible through her body, edges dissolving into mist, the lower body / feet fading to nothing, a faint cold inner glow, a smoky semi-transparent form, light passing through her.

🚫 She is NOT solid / NOT opaque / NOT a costumed living person. If you can't see through her, it has FAILED. NOT a heavy fog blob either — a READABLE translucent FIGURE.`,
    touchpoints: [
      'her body semi-transparent, the moonlit window and stone wall clearly visible THROUGH her pale form',
      'translucent and smoky, the carved banister and stairs showing right through her drifting gown',
      'her lower body and feet dissolving into a trailing wisp of cold mist, no longer touching the floor',
      'a faint cold inner light glows through her, her edges feathering into the dark like smoke',
      'so thin and spectral that the candle-flame behind her shines straight through her shoulder',
      'her form a pale luminous haze you can see the portraits and panelling through, hands almost vanishing',
      'translucent as breath on glass, the gothic arch and far doorway visible through her chest and trailing veil',
      'her gown and hair streaming into dissolving threads of mist at every edge, the wall glowing faintly through her',
      'a watery transparency, the cold blue light passing clean through her drowned drifting shape',
      'half-there and half-gone, the floor and far columns clearly visible beneath and through her hovering form',
      'her face and hands the most solid, the rest of her fading to a see-through luminous vapour',
      'the spectral chains and her own arm semi-transparent, the firelight glowing through them onto the wall',
    ],
    instructions: `Each entry is ONE translucency effect, 12-24 words. She MUST read as SEE-THROUGH (architecture visible through her, edges to mist, feet faded). Never solid, never a fog-blob. Output as a NUMBERED list (1. ... 2. ...), one per line. NO internal newlines.`,
  },

  gothbot_haunting_setting: {
    format: 'simple',
    theme: `THE HAUNTED PLACE — the gothic INTERIOR she haunts (soft / atmospheric behind her). Each entry 18-30 words. ONE empty room or hall INSIDE a dark old manor or abbey. Crimson-Peak / gothic-manor / The-Woman-in-Black / The-Others lineage. (Kevin's hearted look: an atmospheric manor INTERIOR.)

⚠️ ALWAYS AN INTERIOR — a grand staircase, a portrait gallery, a candlelit corridor, a derelict ballroom, a cold music room, a faded drawing room, an abandoned nursery, a vast library, a long servants' corridor, a chapel/abbey nave, a dining hall, a turret window-seat, a grand bedchamber. Still, empty, lonely — the emptiness makes the haunting land. A tall moonlit window or candle gives the cold light.

🚫 ALWAYS INDOORS — NO graveyard, NO garden, NO moor, NO bridge, NO exterior. NO crowds / no other living people. NO modern / no daylight-cheerful.`,
    touchpoints: [
      'a grand sweeping staircase in a dark manor, moonlight falling through a tall window onto the worn carpet, the upper landing lost in gloom',
      'a long portrait gallery, ancestral faces watching from the walls, a runner of carpet receding into candlelit shadow',
      'a derelict grand ballroom, a cobwebbed chandelier above a dust-shrouded floor, tall arched windows leaking pale moonlight',
      'a long candlelit corridor of closed doors, the wallpaper peeling, a cold draught stirring the curtains at the far end',
      'a cold music room, a raised grand piano with open sheet-music, dust-sheeted chairs, moonlight through a tall draped window',
      'a faded drawing room, Holland dust-covers over the furniture, a dead fireplace, damask wallpaper peeling in the gloom',
      'a small abandoned nursery, a still rocking-horse and a closed music-box, moonlight on a dusty cradle and an empty child\'s bed',
      'a vast cold library, towering shelves vanishing into the dark above, a single chair drawn up to a dead hearth',
      'a long low servants\' corridor beneath the house, stone-vaulted ceiling, oil lamps spaced too far apart in pools of cold amber',
      'a ruined abbey nave, ribbed stone arches soaring into shadow, moonlight falling through a great empty rose-window onto cold flags',
      'a grand dining hall, a long table laid and abandoned under dust and cobwebs, tarnished candelabra down its length',
      'a deep turret window-seat, rain streaking the diamond panes, faded velvet cushions, the storm-lit night beyond the glass',
      'a grand bedchamber with a great carved four-poster, moth-eaten drapes drawn back, a cracked mirror catching the moonlight',
      'an upper landing of a manor, tall shadowed doorways, a tarnished sconce, the great hall yawning dark below the banister',
    ],
    instructions: `Each entry is ONE empty atmospheric gothic INTERIOR room/hall, 18-30 words. ALWAYS indoors (manor/abbey). NO exterior/graveyard/garden/moor/bridge. NO crowds, NO modern, NO daylight. Output as a NUMBERED list (1. ... 2. ...), one per line. NO internal newlines.`,
  },

  gothbot_haunting_light: {
    format: 'simple',
    theme: `THE PALE LIGHT + COLD AIR — the ghostly glow + atmosphere. Each entry 14-26 words. The lighting that makes a spectre eerie + the cold air around her. Crimson-Peak / ghost-story lineage.

⚠️ Cold, pale, spectral light — moonlight through a tall window, a single guttering candle, a cold blue spectral glow emanating from her, a will-o-wisp, the grey light of pre-dawn, a faint corpse-light, mist catching the glow. Her own faint luminance is part of it.

🚫 NO warm cosy daylight, NO bright color. Cold, dim, blue-grey-silver, eerie.`,
    touchpoints: [
      'a shaft of cold moonlight falls through a tall window, and the spectre glows faintly with her own pale corpse-light within it',
      'a single guttering candle throws huge trembling shadows, the spectre lit cold blue against the warm flame',
      'a cold spectral radiance emanates from the ghost herself, casting a faint blue glow on the floor and walls around her',
      'pale grey pre-dawn light fills the room, colourless and cold, the spectre barely brighter than the gloom',
      'a will-o-wisp of cold light drifts beside her, the only glow in the pitch dark, mist catching its pale shimmer',
      'moonlight and a low cold mist combine into a silver haze, the ghost a paler shape within it',
      'a faint corpse-light flickers along her form, blue-white and unsteady, throwing no warmth into the cold dark',
      'storm-light flickers through the windows, each lightning-flash catching the spectre stark and pale before the dark returns',
      'the dying embers of a hearth throw a faint red glow, against which the spectre stands cold and blue and out of place',
      'a single oil-lamp burns low and amber, and the cold blue ghost-light beside it refuses to mix',
      'pale moonlight floods a graveyard in silver-blue, the spectre a brighter pallor drifting between the dark stones',
      'a thin luminous mist hangs at knee-height, glowing faintly where the spectre passes through it',
    ],
    instructions: `Each entry is ONE cold pale ghostly light + atmosphere, 14-26 words. Eerie, dim, blue-grey-silver, her own faint glow. NEVER warm daylight. Output as a NUMBERED list (1. ... 2. ...), one per line. NO internal newlines.`,
  },

  gothbot_haunting_composition: {
    format: 'simple',
    theme: `THE "CAUGHT A GHOST ON CAMERA" MOMENT — the spectre caught in a STARTLING, CANDID, DYNAMIC instant, like a real paranormal photograph. Each entry 14-26 words. The "holy shit we actually caught a ghost on camera" feeling: she is MID-MOTION or seen from an UNCANNY vantage — NEVER a calm centered standing portrait. (Kevin: every render was the same static head-bowed pose — spice them up.)

⚠️ A dynamic, candid, uncanny MOMENT — pick a striking action + an off-kilter camera vantage so it reads as "captured by accident, not posed":
  • TURNING TO THE LENS — head/body snapping toward the camera as if she just noticed it; caught looking straight back at us
  • DRIFTING AWAY — gliding fast down a corridor away from us, form streaking to mist, glancing back over her shoulder
  • FLOATING / LEVITATING — hovering off the floor, body tilted at an impossible angle, gown hanging wrong against gravity
  • REACHING — a translucent hand thrust toward the camera, her face looming behind it
  • EMERGING — half-coming THROUGH a wall / out of a dark mirror / a doorway, mid-passage
  • OFF-FRAME — slipping behind a doorway at the very edge of the shot, half-out of frame, as if avoiding the lens
  • REFLECTION — present only in a mirror/window, the room empty in front of it
  • WEIRD ANGLE — shot from the top of the stairs looking down, a low found-footage angle, foreshortened and wrong
  • MOTION-STREAK — caught gliding, gown + hair streaming sideways, her form doubled / motion-blurred
  • UNNATURAL — head turned too far / wrenched fully around, body still drifting the other way; rising vertically up a stairwell

🚫 NO calm centered standing portrait. NO "head bowed, hands clasped, facing forward." NO tight face-crop (we still need her body + the place). NO crowd / no second figure. Keep it eerie-beautiful, NOT gore / jump-scare.`,
    touchpoints: [
      'caught mid-turn as if she just noticed the camera, head snapping toward the lens, veil and hair still swinging with the motion',
      'drifting fast AWAY down a long corridor, her trailing form streaking to mist, glancing back over her shoulder straight at us',
      'floating a full foot off the floor, her body tilted at an impossible angle, gown hanging wrong against the gravity',
      'a translucent hand thrust toward the camera, her sorrowful face looming close behind it, the rest of her receding to mist',
      'half-emerged THROUGH the wall, one shoulder and arm still sunk into the plaster, caught mid-passage between rooms',
      'glimpsed off-center at the very edge of the frame, slipping behind a doorway, half out of shot as if avoiding the lens',
      'present only in the tall dark mirror — the corridor empty in front of it, her pale form caught in the glass alone',
      'shot from the top of the staircase looking DOWN, she drifts up toward the camera, foreshortened and unnaturally close',
      'caught gliding across the hall mid-motion, gown and hair streaming sideways, her form doubled and motion-streaked',
      'a low, off-kilter found-footage angle, she looms tall and close, head tilted too far, gazing down into the lens',
      'rising vertically up the stairwell well, her trailing form impossibly long, head turned back down toward the camera',
      'frozen three-quarters away mid-stride, but her head wrenched fully around to face us, her body still drifting off',
    ],
    instructions: `Each entry is ONE startling "caught on camera" moment — a dynamic action + an uncanny vantage, 14-26 words. NEVER a calm centered standing portrait / head-bowed-hands-clasped. Eerie-beautiful, not gore. Output as a NUMBERED list (1. ... 2. ...), one per line. NO internal newlines.`,
  },

  gothbot_haunting_manifestation: {
    format: 'simple',
    theme: `THE MANIFESTATION — a subtle hint of her story / death (50%-gated). Each entry 10-20 words. ONE quiet supernatural detail that tells WHY she haunts, without gore.

⚠️ A subtle eerie tell — a spreading damp water-stain, a noose-shadow on the wall, cold breath-fog, a reaching translucent hand, a second fainter shape behind her, a clutched spectral letter or rose, a stopped clock, a music-box, scratch-marks, a portrait whose eyes match hers, candle-flames bending away from her.

🚫 NO blood / no gore / no rot / no jump-scare. Quiet, sorrowful, uncanny.`,
    touchpoints: [
      'a dark damp water-stain spreading slowly across the floor beneath her drifting drowned form',
      'the cold shadow of a noose thrown on the wall behind her, though nothing hangs there',
      'her breath and the cold air fogging white, though she has not breathed in a hundred years',
      'one translucent hand reaching toward the viewer in silent appeal, fingers dissolving to mist',
      'a second, fainter shape standing just behind her in the dark, barely there',
      'a yellowed spectral letter clutched to her chest, the ink long faded, never delivered',
      'every candle-flame in the room bending away from her as she passes, guttering low',
      'a stopped grandfather-clock behind her, its hands frozen at the hour she died',
      'a closed music-box on the table beside her, its lid trembling as if about to open on its own',
      'a portrait on the wall whose painted face is unmistakably hers, watching the room',
      'faint scratch-marks scored into the inside of a closed door behind her',
      'a single spectral rose drifting from her hand, dissolving to mist before it reaches the floor',
    ],
    instructions: `Each entry is ONE subtle supernatural manifestation, 10-20 words. Quiet, sorrowful, uncanny — NEVER gore/jump-scare. Output as a NUMBERED list (1. ... 2. ...), one per line. NO internal newlines.`,
  },

  // ════════════════════════════════════════════════════════════════
  // the-coven — NEW path (2026-06-10). A SOLO FEMALE WITCH / sorceress MID-SPELL —
  // magic visibly erupting (sigils / witchfire / conjuring). Every female path is a
  // vampire/goth-beauty; none is a WITCH doing magic. The SPELL is the money-shot.
  // ════════════════════════════════════════════════════════════════
  gothbot_coven_witch: {
    format: 'simple',
    theme: `THE WITCH — the HERO archetype: an ORNATE, WARPED, WEIRD witch. Each entry is ONE solo witch, elaborately adorned, with ONE uncanny TWIST that makes her strange-and-wonderful. 22-34 words. The-VVitch / Pan's-Labyrinth / Brian-&-Wendy-Froud / Leonora-Carrington / Remedios-Varo / alchemical-engraving / folk-horror-fairy-tale lineage. (Kevin: "witches are into weird shit — make it weird, but readable + cool/gothic.")

⚠️ THE BAR — an OVER-THE-TOP ORNATE witch (baroque layered robes, antler/bone crowns, charm-strung adornments, masks, too many rings, embroidered sigils, dangling talismans) PLUS exactly ONE readable WEIRD TWIST: a third eye on her brow, fingers a touch too long, twig-and-root antlers growing from her hair, bark patches on her skin, a familiar fused to her shoulder, an extra pair of stitched-on hands, ink-black veins, a mouth sewn with thread she's loosening, a halo of orbiting teeth, eyes with goat-slit pupils, moths pouring from her sleeves. Strange, intricate, characterful.

🌿 PULL BACK FROM DARK-VAMPIRE — she is a FOLK-HORROR / FAIRY-TALE OCCULT witch, NOT a sexy goth-vampire. Warmer, weirder, ornate, uncanny. Jewel-toned + earthy + strange, not just black. Readable + cool/gothic, never gory or cartoonish-green-hag.

🚫 NO vampire fangs/glowing-vampire-eyes. NO generic goth pin-up. NO modern / NO LOTR-Skyrim-Witcher. NO body-horror gore — the weirdness is UNCANNY + ORNATE, not bloody.

✓ VARIETY MANDATE (~16): antler-crowned forest-witch / mandrake-grower / bone-stitcher seamstress-witch / sea-witch barnacled-and-pearled / moth-witch / honey-and-bee witch / clockwork-and-curiosity witch / mirror-oracle / herbalist-crone (dignified, ornate) / spider-silk weaver-witch / mushroom-and-rot witch / star-charmer / toad-mother / tooth-collector / wax-and-poppet witch / shadow-tailor. Span ages + ethnicities. Always women, always ornate + ONE weird twist.`,
    touchpoints: [
      'an antler-crowned forest-witch in layered moss-green and embroidered shawls hung with bird-skulls and acorns, a small third eye blinking on her brow, twig-roots threading her wild hair',
      'a bone-stitcher witch in a patchwork robe of a hundred embroidered eyes, a thimble on every long finger, a needle trailing red thread from her sewn-and-half-unpicked lips',
      'a moth-witch draped in grey velvet furred with living luna-moths, a veil of wings over her face, antennae curling from her own brow, calm and uncanny',
      'a honey-witch in amber-and-gold robes crusted with old wax, a crown of empty honeycomb, bees crawling her cheek and pouring from her wide sleeve',
      'a barnacled sea-witch in salt-stiff teal silks studded with limpets and pearls, an extra pair of small webbed hands stitched at her ribs, seaweed-braided hair',
      'a mushroom-witch in a ruffled cap-and-gill gown of bracket-fungus, pale spotted skin, bioluminescent fungus blooming along one arm, dreamy slit-pupil eyes',
      'a tooth-collector witch in ivory-button robes, a slow halo of human teeth orbiting her head, a tiny key on a chain, a thin knowing smile a touch too wide',
      'a clockwork-curiosity witch in a frock-coat of tiny drawers and brass charms, a monocle-lens grown into one eye-socket, mechanical beetles climbing her collar',
      'a dignified herbalist-crone, silver-braided and richly ornate in layered talisman-strung shawls, her left hand sprouting tiny green seedlings from the fingertips',
      'a spider-silk weaver-witch in a gown of grey gossamer and dewdrops, eight thin braids like legs, four calm eyes set above her two, spinning thread from her fingertips',
      'a wax-and-poppet witch hung with little stitched dolls and dripping candle-stubs, wax sealing one eye shut, a half-made poppet cradled in her ringed hands',
      'a star-charmer in deep indigo robes embroidered with constellations that faintly move, a tiny captured star orbiting her head, her irises full of drifting points of light',
    ],
    instructions: `Each entry is ONE ornate, warped, WEIRD witch, 22-34 words. Elaborately adorned + exactly ONE readable uncanny twist. Folk-horror occult (NOT dark-vampire / goth-pinup), uncanny not gory. Output as a NUMBERED list (1. ... 2. ...), one per line. NO internal newlines.`,
  },

  gothbot_coven_spell: {
    format: 'simple',
    theme: `THE MAGIC GLOW — the weird magical effect lighting the scene + accompanying her rite. Each entry 12-24 words. Varied + uncanny + characterful — sometimes a big effect, often a small strange one. It is the main light source. Alchemical-engraving / folk-magic / The-VVitch lineage.

⚠️ A weird, glowing magical effect tied to her deed — floating runes, drifting motes of light, a small storm spinning over a cup, a jar full of caught light, witchfire, a glowing thread, a conjured wisp or spirit-shape, luminous spilled potion, a halo of light around an object, glowing sigils breathing on the floor, fireflies of soul-light.

🚫 NO sci-fi / no neon-tech / no laser-beams. It is OLD, organic, candle-and-ember weird magic — uncanny, not flashy.`,
    touchpoints: [
      'a slow spiral of glowing motes lifts from her cupped hands, turning gently in the dark like drifting embers',
      'a thumb-sized storm-cloud spins and flickers tiny lightning above the rim of her cup',
      'witch-fire in soft green and violet pools in her palm, coiling without heat, lighting her face from below',
      'a glowing thread of light unspools from her fingertip, faint sparks shedding where it turns',
      'a bell-jar in her hands brims with caught light, a tiny glowing scene turning slowly inside the glass',
      'pale rune-shapes hang and drift in the air around her, breathing soft light across the cluttered shelves',
      'a captured will-o-wisp bobs at her shoulder, the only light, throwing her shadow huge on the wall',
      'soft fireflies of soul-light rise from an open book, settling on the jars and her ringed hands',
      'a luminous potion spills slow and glowing across the table, pooling in the carved grooves of a sigil',
      'a half-formed spirit-wisp coils up from the cauldron-smoke, peering at her with two faint lights for eyes',
      'a ring of little candle-flames lifts off their wicks and hovers, turning slowly around her head',
      'the scrying-mirror glows from within, a different candlelit room faintly visible in its depths',
    ],
    instructions: `Each entry is ONE weird glowing magical effect, 12-24 words. Varied, uncanny, organic candle-ember magic (often small). NEVER sci-fi/neon. Output as a NUMBERED list (1. ... 2. ...), one per line. NO internal newlines.`,
  },

  gothbot_coven_action: {
    format: 'simple',
    theme: `THE WEIRD RITE — the SIGNATURE money-shot: the strange occult ACT she is caught performing (this TELLS THE STORY). Each entry 14-26 words. Witches are into weird shit — show her mid-WEIRD-DEED, a clear little narrative. The-VVitch / Pan's-Labyrinth / folk-horror / alchemical-engraving lineage.

⚠️ ONE specific, weird, READABLE occult act in progress — you can tell exactly what strange thing she's doing. Uncanny and characterful, never gory.

✓ VARIETY MANDATE (~18 weird deeds): stitching a little poppet shut / coaxing a screaming mandrake up out of the soil / growing a tiny homunculus in a bell-jar / reading a fortune in spilled entrail-coloured ribbons (clean) / scrying in a black mirror that shows a different room / charming a spiralling swarm of moths from her open mouth / spinning glowing thread of fate from her own fingertips / weighing a tiny glowing soul on jeweller's scales / bottling a captured scream / a star / in glass / feeding a dog-sized toad a ring / conducting a slow choir of floating candle-flames and skulls / planting teeth in a tray of soil that sprout tiny hands / unspooling her own long shadow like wool / whispering to a severed talking head sat calmly on a plate / pulling a long ribbon endlessly from a raven's beak / brewing a potion that has formed a tiny weather-storm above the cup / knitting with a strand drawn from a sleeping cat / tucking a captured will-o-wisp into a lantern.

🚫 NO gore / no blood-horror. The weird is UNCANNY + WHIMSICAL-DARK + readable. NO modern objects.`,
    touchpoints: [
      'coaxing a tiny screaming mandrake-root up out of a soil-tray with both ringed hands, leaning in with tender curiosity',
      'bent over a bell-jar where a thumb-sized homunculus floats and turns, tapping the glass with one long fingernail',
      'a slow spiral of moths streaming up out of her open mouth into the dark, her eyes calm and half-closed',
      'spinning a glowing thread of fate from her own fingertip onto a bone spindle, the thread shedding faint sparks',
      'weighing a tiny glowing soul-light on a pair of jeweller\'s scales, head tilted, brow furrowed in judgement',
      'whispering close to a severed head that sits calm and listening on a silver plate, one hand cupped to its ear',
      'planting small teeth in a row in a tray of black soil, where the first ones have sprouted tiny grasping hands',
      'easing a captured scream into a glass bottle, both hands cupped, her face wincing at the muffled wail',
      'unspooling her own long shadow off the floor like grey wool, winding it slowly around her forearm',
      'conducting a slow choir of floating candle-flames and little hovering skulls with both raised hands',
      'feeding a gold ring to a dog-sized warty toad that gulps it down, patting its head fondly',
      'stitching shut the seam of a small cloth poppet with red thread, biting the thread off between sharp teeth',
    ],
    instructions: `Each entry is ONE specific weird occult ACT in progress (it tells a story), 14-26 words. Uncanny, readable, characterful, NEVER gory. Output as a NUMBERED list (1. ... 2. ...), one per line. NO internal newlines.`,
  },

  gothbot_coven_lair: {
    format: 'simple',
    theme: `THE WITCH-HOUSE — a CLUTTERED, WEIRD, STORY-RICH occult interior crammed with strange stuff. Each entry 20-32 words. The space itself is full of little curiosities + tells you a witch lives here. The-VVitch / Pan's-Labyrinth / Baba-Yaga / cabinet-of-curiosities / alchemist's-overgrown-study lineage.

⚠️ A WEIRD CLUTTERED occult interior STUFFED with detail — shelves of jarred eyes and floating things, hanging dried herbs and taxidermy, walls of tiny labelled drawers, candle-stubs, growing fungi, poppets and dolls, bottled storms, a bubbling cauldron, animal skulls, strings of teeth, curling charts, a black mirror, roots breaking through the floor. The viewer should want to STUDY every corner for weird treasures.

🌿 WARM + WEIRD + ORNATE, not cold-crypt-empty — earthy and rich and strange (amber jar-glow, mossy green, candle-warmth, jewel-tone clutter), not a bare dark vault. Folk-horror cosy-uncanny.

🚫 NO modern / no daylight-cheerful. NO bare empty dark crypt (this path is the OPPOSITE — packed with weird stuff).`,
    touchpoints: [
      'a crooked witch-cottage interior crammed floor-to-rafter with jarred eyes, dangling taxidermy crows, drying herb-bunches and dripping candle-stubs, a cauldron muttering in the hearth',
      'a wall of hundreds of tiny labelled drawers and curiosity-shelves, bottled storms and floating things glowing faintly, a black scrying-mirror in an ornate frame',
      'a root-cellar where pale homunculi turn slowly in rows of bell-jars on every shelf, soft amber light, soil and growing things crowding the corners',
      'an alchemist\'s overgrown study, brass orreries furred with moss, towering grimoire-stacks, glassware bubbling, a fat toad on the desk among spilled charts',
      'a hut on hen\'s legs lined with strung teeth, poppet-dolls, antlers and herb-braids, a stove glowing warm, the forest pressing dark at the round windows',
      'a cabinet-of-curiosities chamber, specimen-jars and pinned moths and tiny skeletons in cases, a candelabra, a sigil rug, everything ornate and over-stuffed',
      'a witch\'s greenhouse gone wild, mandrakes potted in rows, carnivorous flowers, hanging lanterns, glass jars of fireflies, vines swallowing the panes',
      'a low beamed kitchen hung with bundled herbs, smoked things and copper pans, a vast cauldron, shelves of labelled potions, a cat-shaped warmth in the gloom',
      'a spider-haunted weaving-room, looms strung with glowing thread, cocooned curiosities in the corners, dust-motes adrift in a single amber shaft',
      'a bottle-witch\'s parlour, walls of stoppered glass each holding a tiny glowing scene — a storm, a star, a face — candlelight catching a thousand reflections',
      'a forest-shrine interior of woven branches and bone-charms, fungi glowing soft along the walls, a stone basin, ribbons and offerings tied everywhere',
      'an observatory-attic crammed with star-charts, hanging models of moons, jarred constellations and a great brass telescope, the domed roof open to the swirling night',
    ],
    instructions: `Each entry is ONE cluttered weird story-rich witch-interior, 20-32 words. Stuffed with curiosities, warm + ornate + strange (never a bare dark crypt). NO modern, NO daylight. Output as a NUMBERED list (1. ... 2. ...), one per line. NO internal newlines.`,
  },

  gothbot_coven_composition: {
    format: 'simple',
    theme: `COMPOSITION + FRAMING for the witch mid-spell. Each entry 12-22 words. She is the focal figure (45-65% of frame), the magic and lair around her. Full or three-quarter to SHOW the casting gesture + the spell.

⚠️ A dynamic figure-with-magic composition — a low-angle that makes her loom over a glowing circle, a wide shot showing her dwarfed by her own conjuration, a three-quarter mid-cast, a frontal hero-shot with the spell blazing toward the viewer, an over-the-circle view.

🚫 NO tight face-crop (we must see her hands + the spell). NO crowd (she is solo). NO static portrait.`,
    touchpoints: [
      'a low-angle hero-shot, the witch looming over a blazing sigil-circle, the magic lighting her from below',
      'a wide shot, the witch small before the towering conjuration she has summoned, dwarfed by her own power',
      'a three-quarter figure mid-cast, arms wide, the spell-light wrapping around her and filling the frame',
      'a frontal hero-shot, the witch facing the viewer, the spell blazing forward off her outstretched hands',
      'an over-the-circle view looking down past her shoulders at the glowing runes on the floor',
      'the witch centred and full-body, the lair receding around her, the magic the brightest thing in frame',
      'a dramatic side-on, the witch bent over the cauldron, the rising luminous smoke filling the upper frame',
      'a low wide shot, the witch silhouetted against the huge moon, the spell-light cupped in her raised hands',
      'a three-quarter from below, the conjured beast of light rearing above her, the witch calm at its centre',
      'the witch framed within her own sigil-circle, the burning runes ringing her, the chamber dark beyond',
      'a kneeling figure at the circle\'s edge, the magic spreading away across the floor toward the viewer',
      'a tall vertical composition, the column of her magic rising from her hands to fill the frame above',
    ],
    instructions: `Each entry is ONE composition for the witch mid-spell, 12-22 words. Figure 45-65%, the magic + lair around her. NO tight face-crop, NO crowd, NO static. Output as a NUMBERED list (1. ... 2. ...), one per line. NO internal newlines.`,
  },

  gothbot_coven_familiar: {
    format: 'simple',
    theme: `THE WEIRD FAMILIAR — the witch's uncanny companion (50%-gated). Each entry 10-20 words. ONE strange familiar near her or in her rite — slightly WRONG, readable + cool, never gory.

⚠️ A WEIRD familiar — a cat with three eyes, a goat with too many curling horns, a thumb-sized homunculus, a two-headed raven, a hare with little human eyes, a toad the size of a dog, a taxidermy crow stitched-and-living, a moth-swarm that moves as one mind, a serpent with tiny hands, a doll-poppet that walks, an owl with a human face, a many-legged cat.

🚫 NO large monster, NO second human, NO combat, NO gore. A small UNCANNY companion only — strange but charming.`,
    touchpoints: [
      'a sleek black cat with three calm eyes winding around her ankles, all six eyes reflecting the magic-light',
      'a two-headed raven on her shoulder, both heads cocking to watch the rite with bead-bright interest',
      'a thumb-sized homunculus perched on the rim of a jar, swinging its little legs and watching her work',
      'a fat dog-sized toad squatting beside her, a gold ring glinting in its wide patient mouth',
      'a hare sitting bolt upright beside her, its eyes uncannily human and far too knowing',
      'a black goat with one too many curling horns and pale square-pupilled eyes, still as stone behind her',
      'a stitched taxidermy crow, button-eyed and very much alive, hopping along the cluttered shelf',
      'a slow swarm of luna-moths moving as a single mind, gathering into a vague shape at her shoulder',
      'a green serpent with two tiny clawed hands coiled up her arm, gesturing as if helping her cast',
      'a little cloth poppet-doll up and walking across the table on stubby legs, fetching her a pin',
      'a small barn-owl with a faintly human face roosting on the curiosity-shelf, blinking slowly',
      'a many-legged black cat picking its delicate way across the grimoire, far too many paws',
    ],
    instructions: `Each entry is ONE WEIRD familiar, 10-20 words. A small uncanny companion (slightly wrong, charming, never gory). NEVER a large monster / second human / combat. Output as a NUMBERED list (1. ... 2. ...), one per line. NO internal newlines.`,
  },

  // ════════════════════════════════════════════════════════════════
  // moonlit-maiden — NEW path (2026-06-11). The softer "R0" ghost look:
  // a lone ethereal beautiful woman in a GORGEOUS moonlit gothic scene.
  // Scene + maiden co-equal; dreamy, romantic-melancholy; anime/painterly.
  // ════════════════════════════════════════════════════════════════
  gothbot_moonlit_maiden: {
    format: 'simple',
    theme: `THE MAIDEN — the HERO: a lone, ETHEREALLY BEAUTIFUL woman, co-equal with her gorgeous moonlit gothic scene. Each entry 18-28 words. ONE graceful, melancholy, otherworldly beauty + her flowing gown + her quiet sorrow. Crimson-Peak / dark-romantic-fantasy / painterly lineage.

⚠️ A LONE, lovely, dreamlike woman — solid-but-ethereal, luminous, graceful, achingly beautiful with a soft melancholy. Her flowing gown is half the figure. Span gown colours + moods.

🚫 NOT a hard see-through ghost (that's the-haunting). NOT a fanged vampire, NOT gore, NOT a goth pin-up. Beautiful + sublime + sorrowful, never scary.

✓ VARIETY: spectral lady / mourning noblewoman / moonlit maiden / pale enchantress / gothic bride / sorrowful aristocrat / ethereal wraith-beauty / barefoot waif. Gowns: pale gossamer white / luminous blue / trailing black silk / dove-grey / dark star-sewn velvet / opulent brocade.`,
    touchpoints: [
      'a pale ethereal beauty in a flowing gossamer-white gown, her grace otherworldly, a soft centuries-old sorrow in her bearing',
      'a mourning noblewoman in trailing black silk and lace, exquisite and grief-stricken, moving like a slow sad dream',
      'a spectral bride in a luminous veil and pale gown, beautiful and lost, drifting through the cold moonlight',
      'a moonlit maiden in pale-blue gossamer that seems woven of mist and starlight, luminous, serene, sorrowful',
      'a dark-haired beauty in a corseted midnight gown trailing gauze, regal and melancholy, pale as the moon',
      'an ethereal lady in a tattered-elegant gown of grey silk, achingly lovely, a faded grandeur about her',
      'a sorrowful enchantress in flowing dark velvet sewn with faint silver stars, beautiful, remote, luminous',
      'a wraith-beauty in a near-sheer pale gown glowing soft blue, graceful and dreamlike, lovely beyond living',
      'a pale gothic maiden in a high-collared dove-grey Victorian gown, delicate and quietly heartbroken',
      'a luminous lady in a billowing gown that streams like water, her beauty serene and otherworldly',
      'a gothic aristocrat in opulent dark brocade and a sheer trailing cloak, regal, pale, melancholy',
      'an ethereal maiden barefoot in a simple flowing white shift, fragile and lovely in the cold moonlight',
    ],
    instructions: `Each entry is ONE lone ethereal beautiful woman + her flowing gown + melancholy grace, 18-28 words. Solid-but-dreamlike, luminous, NEVER a hard see-through ghost / fanged vampire / gore. Output as a NUMBERED list (1. ... 2. ...), one per line. NO internal newlines.`,
  },

  gothbot_moonlit_visage: {
    format: 'simple',
    theme: `THE VISAGE — her FACE + HAIR, making each maiden a DISTINCT woman. Each entry 14-24 words. ONE hair COLOUR + hairstyle + complexion + features combination. MAXIMIZE variety — no two should be the same woman.

⚠️ Her face is always CLEAR + defined + lovely (visible eyes, nose, soft mouth) — NEVER blurred/erased. LUMINOUS-PALE + moonlit (NOT corpse-grey) — she is ethereal, not a rotting ghost. Keep her original hair colour + ethnicity so she reads as an individual.

✓ Span widely — HAIR: raven-black / ash-blonde / deep auburn / silver-white / jet-black / honey-blonde / dark-brown / copper-red / platinum / chestnut / iron-grey. STYLE: soft updo / loose waves / braided coronet / unbound / chignon / ringlets / finger-waved bob / pompadour. FACE: sharp Slavic / soft English / freckled Irish / porcelain East-Asian / olive / South-Asian / fine aristocratic / dignified older.`,
    touchpoints: [
      'raven-black hair in a soft Victorian updo, pale luminous skin, dark sorrowful eyes, delicate features',
      'long loose ash-blonde waves, a soft heart-shaped English face, fair moonlit skin, gentle grey eyes',
      'deep auburn hair in a braided coronet, fair freckled skin, mournful green eyes, a fine straight nose',
      'silver-white hair tumbling unbound, ethereal porcelain skin, large luminous pale eyes, fragile beauty',
      'sleek black hair in a low chignon, porcelain East-Asian features, calm downturned dark eyes',
      'honey-blonde ringlets half-pinned, a delicate face, soft full lips, dreamy hazel eyes',
      'dark-brown hair loose to the waist, warm olive skin gone moonlit-pale, deep soulful eyes',
      'copper-red hair in soft waves, pale freckled skin, a delicate chin, wide luminous green eyes',
      'platinum hair in a soft Edwardian pompadour, fine aristocratic features, a soft sad mouth, pale eyes',
      'jet-black hair in a finger-waved bob, a striking angular face, dark-lidded luminous eyes, pale skin',
      'chestnut hair half-up with loose tendrils, warm South-Asian features moonlit-pale, large dark eyes',
      'iron-grey hair softly waved, a dignified mature beauty, a fine lined face, calm pale eyes',
    ],
    instructions: `Each entry is ONE distinct hair-colour + hairstyle + complexion + features, 14-24 words. MAXIMIZE variety. Luminous-pale (moonlit, NOT corpse), face always CLEAR. Output as a NUMBERED list (1. ... 2. ...), one per line. NO internal newlines.`,
  },

  gothbot_moonlit_scene: {
    format: 'simple',
    theme: `THE GRAND MOONLIT SCENE — the GORGEOUS gothic environment (co-equal with the maiden — make it breathtaking). Each entry 18-30 words. ONE stunning, atmospheric gothic place, interior OR moonlit-exterior ruin, with scale + depth + beauty.

⚠️ A breathtaking gothic environment — render it grand + atmospheric + cold-blue. Half the image. Span interiors + open-air ruins.

✓ VARIETY: ruined cathedral nave / moonlit cloister open to the sky / derelict grand ballroom / overgrown abbey ruin / wild moonlit conservatory / grand derelict staircase hall / flooded crypt-chapel / cliff-top ruin / misty manor gallery / wild moonlit rose-garden / shattered domed rotunda / frozen gothic courtyard.

🚫 NO modern / no daylight-cheerful / no crowds. Dim, cold, sublime, moonlit.`,
    touchpoints: [
      'a vast ruined cathedral nave, soaring shattered arches, moonlight pouring through a broken rose-window onto cold flags',
      'a moonlit cloister open to the sky, mossy columns and broken arches ringing a misty courtyard beneath a huge moon',
      'a derelict grand ballroom, a cobwebbed chandelier above a dust-pale floor, tall arched windows leaking blue moonlight',
      'an overgrown abbey ruin, ivy swallowing the broken walls, a single great arch framing the cold star-strewn sky',
      'a wild moonlit conservatory, shattered glass panes and skeletal vines, frost and moonlight pooling on the tiles',
      'a grand sweeping staircase in a derelict manor, moonlight falling through a tall cracked window onto worn marble',
      'a flooded crypt-chapel, still black water mirroring broken columns, moonlight through a collapsed ceiling',
      'a cliff-top ruin beneath an enormous moon, broken battlements and the dark sea crashing far below',
      'a long misty manor gallery, ancestral portraits watching from peeling walls, a runner receding into blue gloom',
      'a wild moonlit rose-garden, dead arbors and a dry fountain, fog pooling silver between frostbitten beds',
      'a vast rotunda with a shattered dome open to moon and stars, ivy spilling down the broken stonework',
      'a frozen courtyard ringed by gothic spires, snow and moonlight, a single bare black tree against the sky',
    ],
    instructions: `Each entry is ONE breathtaking gothic environment (interior OR moonlit-exterior ruin), 18-30 words. Grand, atmospheric, cold-blue, depth + scale. NO modern, NO daylight. Output as a NUMBERED list (1. ... 2. ...), one per line. NO internal newlines.`,
  },

  gothbot_moonlit_light: {
    format: 'simple',
    theme: `MOONLIGHT + ATMOSPHERE — the cold luminous light that sets the dreamy mood. Each entry 14-26 words. ONE moonlit lighting + atmosphere. Blue-silver, misty, sublime.

⚠️ Cold moonlight — a vast moon, moonbeams + god-rays, drifting mist, cold haze, blue-silver glow. Dreamy + luminous, NEVER warm daylight.`,
    touchpoints: [
      'an enormous pale moon hanging low, flooding the scene in cold blue-silver light, mist drifting in slow veils',
      'a single shaft of moonlight falling through a shattered window, god-rays cutting the cold haze',
      'soft blue-silver moonglow suffusing everything, a low ground-mist curling, the air cold and still',
      'a rose-pink moon haloed in cloud, its strange light bleeding across broken stone and pooling mist',
      'cold moonbeams raking through skeletal arches, dust and frost-motes adrift in the still beams',
      'a vast star-strewn sky, the moon casting long blue shadows, a glacial haze softening the ruin',
      'pale moonlight reflecting off still black water, doubling the cold light, mist breathing off the surface',
      'a frost-cyan moonglow with drifting snow, the cold light catching every falling flake',
      'a wan silver moon behind thin cloud, a diffuse dreamlike glow, soft fog softening the stone',
      'moonlight and one distant guttering candle, a single warm point against the cold blue, mist between',
      'an aurora-tinged night, faint green-and-violet light above the moon, cold and otherworldly',
      'a breaking storm-moon, ragged clouds racing, shafts of cold light strobing across the ruin',
    ],
    instructions: `Each entry is ONE cold moonlit lighting + atmosphere, 14-26 words. Blue-silver, dreamy, misty, luminous. NO warm daylight. Output as a NUMBERED list (1. ... 2. ...), one per line. NO internal newlines.`,
  },

  gothbot_moonlit_composition: {
    format: 'simple',
    theme: `COMPOSITION — the graceful maiden placed beautifully within the grand moonlit scene. Each entry 14-26 words. Cinematic + painterly + balanced. She can be intimate-and-close OR a small lone figure dwarfed by the breathtaking space.

⚠️ A graceful, painterly placement — walking away into the depth, small beneath a huge moon, at a tall window, descending a stair, on a balcony, silhouetted in an arch, intimate in the foreground. The gorgeous scene reads around her.

🚫 NO tight face-crop. NO "caught-on-camera" uncanny/startle (that's the-haunting). NO crowd. Graceful + sublime, not eerie-wrong.`,
    touchpoints: [
      'she walks slowly away down the long cathedral aisle toward the moonlit window, small and graceful, the nave towering',
      'a small lone figure beneath an enormous moon, dwarfed by the breathtaking ruin, the scale sublime',
      'she stands at a tall arched window gazing out at the moonlit night, in profile, the cold light on her face',
      'she descends the grand staircase slowly, one hand on the banister, the moonlit hall opening below her',
      'centered and intimate, a three-quarter figure, the gorgeous moonlit ruin softening behind her',
      'she stands on a broken balcony above the misty courtyard, the huge moon behind her, her gown streaming',
      'a low painterly angle, she stands tall and serene amid the soaring arches, moonlight haloing her',
      'she pauses mid-step in the long gallery, half-turned, gazing back softly, the portraits receding behind',
      'seated gracefully on the rim of a dry moonlit fountain, gazing down, her gown pooling around her',
      'silhouetted in a great broken archway against the moon, a lone graceful shape framed by the ruin',
      'she drifts across the vast ballroom floor, small and luminous, the cobwebbed chandelier high above',
      'an intimate framing low in the foreground, her sorrowful moonlit face near, the grand scene rising behind',
    ],
    instructions: `Each entry is ONE graceful figure-in-grand-scene composition, 14-26 words. Cinematic, painterly; intimate OR small-and-dwarfed. NOT caught-on-camera/uncanny, NO tight face-crop. Output as a NUMBERED list (1. ... 2. ...), one per line. NO internal newlines.`,
  },

  gothbot_moonlit_accent: {
    format: 'simple',
    theme: `A SOFT ATMOSPHERIC ACCENT — a single delicate, dreamlike detail (50%-gated). Each entry 8-18 words. Quiet + lovely, never busy, never gore.`,
    touchpoints: [
      'a slow drift of pale rose petals falling through the moonlight around her',
      'a soft swirl of will-o-wisps, fireflies of cold blue light hovering near her',
      'tendrils of ground-mist curling slowly around her feet and trailing hem',
      'a scatter of dead leaves drifting down through the cold moonbeams',
      'a few moonlit moths circling, their pale wings catching the silver light',
      'her long sheer veil trailing and lifting on an unfelt draught',
      'faint bioluminescent moss glowing soft blue along the broken stones',
      'a single distant candle guttering on a ledge, one warm point in the cold',
      'a slow fall of fine snow drifting through the moonlight',
      'pale dust-motes adrift, turning slowly in the still moonbeams',
      'a lone raven perched on a broken arch nearby, silhouetted against the moon',
      'soft ripples spreading across still moonlit water at her feet',
    ],
    instructions: `Each entry is ONE soft atmospheric accent, 8-18 words. Delicate, dreamlike, quiet — never busy, never gore. Output as a NUMBERED list (1. ... 2. ...), one per line. NO internal newlines.`,
  },
};

const recipe = POOL_RECIPES[POOL];
if (!recipe) {
  console.error(`No recipe for pool "${POOL}". Add it to POOL_RECIPES.`);
  process.exit(1);
}

function buildPrompt(count, recipe) {
  // Simple format opt-out — recipes can set `format: 'simple'` to skip the
  // Rich Scene Seed scaffolding and just pass through theme + instructions.
  if (recipe.format === 'simple') {
    return `${recipe.theme}

${recipe.instructions}

Output ${count} numbered list entries (1. ... 2. ... 3. ...). Each entry on its own single line. NO preamble, NO commentary, NO markdown fences.`;
  }

  return `Generate ${count} Rich Scene Seeds for the StarBot ${POOL} pool. StarBot is a sci-fi image-generation bot whose renders should feel like stills from an unmade epic film — multi-tier depth, scale provers, materially specific, narratively suggestive.

━━━ POOL THEME ━━━
${recipe.theme}

━━━ AESTHETIC TOUCHPOINTS (draw from these) ━━━
${recipe.touchpoints.map((t) => '  • ' + t).join('\n')}

━━━ POOL-SPECIFIC INSTRUCTIONS ━━━
${recipe.instructions}

━━━ THE RICH SCENE SEED FORMAT — every entry follows this EXACTLY ━━━
Each seed is 80-150 words. Use these exact slot headers (the labels themselves are part of the entry):

[NAME / TYPE] — [one-sentence headline anchor]
FOREGROUND: [specific tangible detail — railing, terrace, machinery, ruin, ridge]
MIDGROUND: [city/structure body, with scale provers named — tiny ships, lit windows, bridge traffic, smaller buildings clustered]
DEEP DISTANCE: [the hero anchor, dominant, partially veiled in atmospheric haze]
SKY: [atmospheric layer — smog, twin moons, storm, light pollution glow, ring-curve]
SCALE PROVERS: [3+ explicit small-things-prove-big-things — name them]
MATERIAL: [what surfaces are made of, how they wear, what light does to them]
EMOTIONAL DNA: [the feeling — awe, dread, wonder, melancholy, alien-indifference, sacred]

━━━ HARD RULES ━━━
- Multi-tier composition is NON-NEGOTIABLE — every seed has all 4 depth layers (FG, MG, Deep, Sky) explicitly filled
- Specific material language — ribbed obsidian over concrete (not "alien architecture"), copper-green oxide (not "weathered"), bioluminescent chitin (not "alien biology")
- 3+ named scale provers per seed — "ships as dots", "hundreds of lit windows", "figures-as-pinpricks on the bridge"
- Each seed has a DISTINCT visual DNA — no two seeds should feel interchangeable
- Architectural / biological / mechanical SPECIFICITY — name the style (brutalist / chitin-grown / cyclopean / Kirby-cosmic / etc.)
- 80-150 words per seed
- NO franchise proper nouns (no "Coruscant" / "Reaper" / "Halo" / etc. — INSPIRED BY, not literal)

━━━ FORBIDDEN — every seed must AVOID ━━━
- Generic descriptors without anchors ("vast city", "sprawling spires", "massive structure", "alien architecture") — these are placeholder noise
- The same tower-with-orange-windows-in-fog default; force variety in architectural style across seeds
- Single-hero-building isolation — every seed has supporting density
- Teal+orange default palette mention — let LIGHTING/VIBE handle palette, don't lock it in the seed

━━━ OUTPUT FORMAT — STRICT ━━━
Return EXACTLY ${count} entries as a NUMBERED LIST. Each entry on its OWN SINGLE LINE prefixed by "<number>. ". NO internal newlines within an entry — use commas / semicolons / dashes for internal structure. NO preamble, NO commentary, NO markdown fences, NO JSON.

Example output (the WHOLE response is just this format, nothing else):
1. MEGACITY OF STACKED ZIGGURATS — five-kilometer-tall ribbed obsidian ziggurats in a grid, each a layered city of thousands, connected at seven elevations by 200-meter skybridges, hanging-garden terraces, copper-green oxide bridge-trusses, ships threading the gaps as dots, indifferent megalopolis mood.
2. CANYON CITY OF SUSPENDED BRIDGES — vertical city carved into both faces of a 3-kilometer canyon, linked by 80+ suspension bridges at staggered heights, eroded stone balconies, prayer flags whipping in updraft, canyon walls weeping mineral stains.
3. (... and so on, ${count} numbered entries total)

CRITICAL: each entry MUST be ONE LINE only. If you need to convey FG/MG/Deep/Sky/Material/Emotional context, combine them into ONE comma-separated line. Multi-line entries WILL BE PARSED INCORRECTLY.`;
}

async function callSonnet(prompt) {
  // Node's undici defaults to a 5-minute headers timeout — Sonnet's larger
  // responses (16K output tokens with content) can exceed this. Use a
  // dispatcher with a longer timeout via AbortController fallback.
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 15 * 60 * 1000); // 15min
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
    if (!res.ok) {
      throw new Error(`Sonnet ${res.status}: ${(await res.text()).slice(0, 300)}`);
    }
    const data = await res.json();
    return (data.content?.[0]?.text || '').trim();
  } finally {
    clearTimeout(timeoutId);
  }
}

// Numbered-list parser. Each entry starts with "<number>. ". Lines that
// don't start with a number are treated as continuations of the previous
// entry (in case Sonnet ignores the "one line per entry" rule and wraps).
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
    } else if (current) {
      // continuation line — append with a space
      current += ' ' + trimmed;
    }
  }
  if (current) entries.push(current);
  const cleaned = entries
    .map((e) =>
      e
        .replace(/^["']|["']$/g, '')
        .replace(/^[-•*]\s*/, '')
        .trim()
    )
    .filter((e) => e.length > 20 && e.length < 1200);
  if (cleaned.length === 0) throw new Error('No numbered entries found in response');
  return cleaned;
}

// ─── DEDUP ────────────────────────────────────────────────────────────────
// Sonnet clusters within batches and across batches — same theme, slightly
// different wording. Catch it programmatically by hashing a signature of
// each entry (significant keywords from the body, stopwords removed,
// sorted alphabetically). Entries with identical signatures are duplicates.

const STOPWORDS = new Set([
  'the',
  'a',
  'an',
  'and',
  'or',
  'but',
  'with',
  'of',
  'in',
  'on',
  'at',
  'to',
  'for',
  'from',
  'by',
  'as',
  'is',
  'are',
  'was',
  'were',
  'be',
  'been',
  'being',
  'have',
  'has',
  'had',
  'this',
  'that',
  'these',
  'those',
  'it',
  'its',
  'they',
  'them',
  'their',
  'her',
  'his',
  'into',
  'onto',
  'through',
  'across',
  'over',
  'under',
  'near',
  'around',
  'between',
  'one',
  'two',
  'three',
  'some',
  'any',
  'all',
  'no',
  'not',
  'than',
  'then',
  'also',
  'so',
  'very',
  'more',
  'most',
  'many',
  'much',
  'each',
  'every',
  'other',
  'another',
  'same',
  'such',
  'only',
  'own',
  'just',
  'still',
  'here',
  'there',
  'where',
  'when',
  'what',
  'who',
  'kilometer',
  'kilometers',
  'meter',
  'meters',
  'foot',
  'feet',
  'mile',
  'miles',
  'wide',
  'tall',
  'long',
  'high',
  'low',
  'large',
  'small',
  'massive',
  'huge',
  'vast',
  'huge',
  'across',
  'above',
  'below',
  'beside',
  'behind',
  'toward',
  'within',
  'throughout',
  'meterdiameter',
  'kilometerdiameter',
  'metertall',
  'kilometertall',
]);

function signatureOf(entry) {
  // Strip the title prefix (everything before the first " — ")
  const dashIdx = entry.indexOf(' — ');
  let body = dashIdx >= 0 ? entry.slice(dashIdx + 3) : entry;
  // Strip any Rich-Scene-Seed bloat
  const fgIdx = body.indexOf(' FOREGROUND:');
  if (fgIdx > 0) body = body.slice(0, fgIdx);
  // Tokenize and extract significant content nouns/adjectives
  const tokens = body
    .toLowerCase()
    .replace(/[^a-z0-9 ]/g, ' ')
    .split(/\s+/)
    .filter((w) => w.length > 4 && !STOPWORDS.has(w))
    .slice(0, 20); // first 20 significant words of the body
  // Sort alphabetically so word-order shuffling doesn't escape dedup
  return [...new Set(tokens)].sort().slice(0, 12).join(' ');
}

// Title-only signature for pools with "TITLE — description" or
// "lowercase phrase — description" shape. Two entries with the same
// title but different bodies should still be treated as duplicates —
// signatureOf strips titles, so we need a separate guard.
function titleOf(entry) {
  const dashIdx = entry.indexOf(' — ');
  if (dashIdx < 0) return null; // no title — fall back to signature-only dedup
  return entry.slice(0, dashIdx).trim().toLowerCase();
}

function dedupe(entries) {
  const seenSigs = new Map(); // body-signature → first entry that claimed it
  const seenTitles = new Map(); // title (lowercased) → first entry that claimed it
  const kept = [];
  const dropped = [];
  for (const e of entries) {
    if (typeof e !== 'string' || e.length < 20) continue;
    const title = titleOf(e);
    if (title && seenTitles.has(title)) {
      dropped.push({
        entry: e.slice(0, 80),
        duplicateOf: seenTitles.get(title).slice(0, 80),
        reason: 'title',
      });
      continue;
    }
    const sig = signatureOf(e);
    if (sig.length < 10) {
      // Body was too short to signature — keep (and register title)
      if (title) seenTitles.set(title, e);
      kept.push(e);
      continue;
    }
    if (seenSigs.has(sig)) {
      dropped.push({
        entry: e.slice(0, 80),
        duplicateOf: seenSigs.get(sig).slice(0, 80),
        reason: 'body',
      });
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
  if (!Array.isArray(arr) || arr.length === 0) {
    console.warn(`  ⚠ Sonnet returned no usable entries`);
    return [];
  }
  // Strip Rich-Scene-Seed bloat so signatures aren't polluted
  const stripped = arr
    .map((e) => {
      if (typeof e !== 'string') return null;
      const i = e.indexOf(' FOREGROUND:');
      return i > 0 ? e.slice(0, i).trim() : e;
    })
    .filter(Boolean);
  console.log(`  • Sonnet returned ${stripped.length} entries in ${elapsed}s`);
  return stripped;
}

(async () => {
  const outPath = path.resolve(`scripts/bots/gothbot/seeds/${POOL}.json`);
  let preExisting = [];
  if (fs.existsSync(outPath)) {
    try {
      preExisting = JSON.parse(fs.readFileSync(outPath, 'utf8'));
    } catch {}
  }

  // Determine final target.
  // --target N → fill up to N via iterative gen+dedup loop
  // --count N → single batch of N (legacy behavior)
  const finalTarget = TARGET ?? preExisting.length + COUNT;
  const startCount = preExisting.length;

  if (TARGET !== null) {
    console.log(
      `Pool "${POOL}": ${startCount} → ${finalTarget} (iterative gen+dedup)${DRY ? ' (dry-run)' : ''}`
    );
  } else {
    console.log(`Pool "${POOL}": gen ${COUNT} new (start ${startCount})${DRY ? ' (dry-run)' : ''}`);
  }

  let pool = [...preExisting];
  let iteration = 0;
  while (pool.length < finalTarget && iteration < MAX_ITERATIONS) {
    iteration++;
    const stillNeeded = finalTarget - pool.length;
    // Smaller batches (15-25) — Sonnet writes faster + ~10K-token responses
    // stay well under fetch timeouts. Overgen by ~50% to absorb dedup losses.
    const batchSize = Math.min(25, Math.ceil(stillNeeded * 1.5));
    console.log(
      `\nIteration ${iteration}: pool at ${pool.length}/${finalTarget}, need ${stillNeeded} more, gen ${batchSize}`
    );
    const fresh = await generateBatch(batchSize);
    if (fresh.length === 0) {
      console.warn('  ⚠ empty Sonnet response — stopping iteration');
      break;
    }
    // Within-batch dedup
    const within = dedupe(fresh);
    if (within.dropped.length > 0) {
      console.log(`  • within-batch dedup dropped ${within.dropped.length}`);
    }
    // Cross-batch dedup against current pool — body signature AND title
    const existingSigs = new Set(pool.map((e) => signatureOf(e)));
    const existingTitles = new Set(pool.map((e) => titleOf(e)).filter(Boolean));
    const newUnique = within.kept.filter((e) => {
      if (existingSigs.has(signatureOf(e))) return false;
      const t = titleOf(e);
      if (t && existingTitles.has(t)) return false;
      return true;
    });
    const crossDropped = within.kept.length - newUnique.length;
    if (crossDropped > 0) {
      console.log(`  • cross-batch dedup dropped ${crossDropped}`);
    }
    // Trim to target if we overshot
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

  console.log('\nSample (last 2 added):');
  pool.slice(-2).forEach((e, i) => console.log(`\n[${pool.length - 1 + i}] ${e.slice(0, 400)}...`));

  if (DRY) {
    console.log('\nDry-run — not writing to disk.');
    return;
  }
  const bakPath = outPath + '.bak-' + Date.now();
  if (fs.existsSync(outPath)) {
    fs.copyFileSync(outPath, bakPath);
    console.log(`Backed up existing pool → ${bakPath}`);
  }
  fs.writeFileSync(outPath, JSON.stringify(pool, null, 2));
  console.log(`✓ Wrote ${pool.length} entries → ${outPath}`);
})();
