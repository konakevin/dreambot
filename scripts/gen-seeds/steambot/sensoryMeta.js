/**
 * Meta-prompt registry for SteamBot sensory channel pools.
 * 3 contexts (female / male / scene) × 7 channels = 21 pools.
 * Per design doc memory/sensory_rollout/steambot.md.
 */

const SHARED_RULES = `━━━ HARD RULES ━━━
- 8-16 words per entry — short, vivid, sensory
- ONE concrete sensory image per entry
- Comma-separated phrases when needed; no full sentences
- NO direct color naming (lightcolor channel is the exception)
- NO duplicate verb+noun pairs across entries
- Aesthetic register: steampunk / Victorian-industrial / brass-and-gear / dirigible-era / clockwork

━━━ AESTHETIC ANCHORS ━━━
- objects: brass gears, copper pipes, leather gauntlet, gas lamp, gaslit lantern, pocket watch,
  goggles, monocle, top hat, corset, bustle, parasol, brass cane, walking stick, monocle chain,
  Tesla coil, vacuum tube, brass instruments, sextant, compass, brass dirigible, airship,
  zeppelin, locomotive, steam piston, boiler, pressure gauge, valve, rivet, copper kettle,
  gear-pendant, mechanical prosthetic, brass goggles, leather harness, tool-belt
- materials: brass, copper, tarnished silver, blackened iron, oiled leather, tarnished-gold,
  velvet, brocade, lace, mahogany, oak, ivory, tarnished-bronze, polished-mahogany
- environments: airship deck, dirigible, cargo hold, boiler room, gentlemen's parlor, speakeasy,
  brass-forge, cathedral-foundry, Tesla-coil chamber, locomotive cab, brass submarine,
  workshop, tinker's bench, observatory, opium den, smoking lounge, gas-lit alley, foggy quay`;

function ch(opts) {
  return (n) => `You are writing ${n} distinct ${opts.name.toUpperCase()} anchors for SteamBot's ${opts.context} context.

${opts.desc}

EXAMPLES (DO NOT REUSE):
${opts.examples.map(e => '- "' + e + '"').join('\n')}

${SHARED_RULES}
${opts.absoluteRule || ''}

━━━ DEDUP — too similar if both ${opts.dedup}. Vary one.
━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering, no markdown.`;
}

const female = {
  smell: ch({name: 'smell', context: 'FEMALE (sexy-steampunk-woman)', desc: 'Olfactory cues — perfume / oil / brass / engine smoke on her body / hair / clothing.', examples: ['gear-grease faint on her leather gauntlet','pomade and brass-polish in her swept-up hair','lily-of-the-valley perfume cutting through engine smoke','rose-water and laudanum on her gloved fingertips','tobacco-and-leather on her brass goggle-strap'], dedup: 'SCENT NOUN AND LOCATION on her body'}),
  sound: ch({name: 'sound', context: 'FEMALE', desc: 'Steampunk-mechanical sounds + her gear/clothing.', examples: ['her brass corset-stays creaking as she draws breath','gear-pendant ticking softly at her throat','her brass-soled boots ringing on the catwalk grate','her parasol-rib unfolding with a brass click','tea-kettle whistling beside her on the parlor stove'], dedup: 'SOURCE AND QUALITY'}),
  touch: ch({name: 'touch', context: 'FEMALE', desc: 'Tactile cues — leather, brass, velvet, soot on her skin.', examples: ['leather harness biting at her bare shoulder','brass goggle-strap warm against her temple','soot smudging her cheek from the engine room','copper bracelet cool against her wrist','her gloved fingertips sticky with axle-oil'], dedup: 'BODY PART AND SENSATION VERB'}),
  temperature: ch({name: 'temperature', context: 'FEMALE', desc: 'Thermal cues — boiler heat / gaslamp warmth / engine cold on her body.', examples: ['boiler-heat radiating against her left side','midnight chill seeping through her airship cabin window','gas-lamp warmth pooling under her chin','steam venting against her shoulder from a leaking valve','tea-warmth glowing in her cupped palms'], dedup: 'THERMAL SOURCE AND BODY PART'}),
  weight: ch({name: 'weight', context: 'FEMALE', desc: 'Steampunk gear weight on her body — tool-belt, prosthetic, corset, skirts.', examples: ['tool-belt of brass instruments pulling at her hip','century-heavy mechanical prosthetic arm at her shoulder','velvet skirts pooling around her ankles in the parlor','brass-laden bandolier biting across her chest','pocket-watch chain dragging at her vest pocket'], dedup: 'OBJECT AND BODY PART'}),
  air: ch({name: 'air', context: 'FEMALE', desc: 'Atmospheric cues around her — steam, smoke, fog, soot.', examples: ['steam venting around her from a cracked pipe at her elbow','coal-smoke drifting between her and the airship railing','gaslamp halo glowing in the foggy alley behind her','her breath fogging the brass goggle-lens','copper-scented mist curling around her boots'], dedup: 'PARTICLE AND MOTION VERB'}),
  lightcolor: (n) => `You are writing ${n} distinct LIGHTCOLOR anchors for SteamBot's FEMALE context. Steampunk lighting on her face/body — gaslamp / brass-forge / tesla-spark / candle.

EXAMPLES (DO NOT REUSE):
- "amber gaslamp underglow flooding her face from below"
- "brass-forge orange key cutting across her cheek from the boiler"
- "verdigris-green sidelight tracing her profile from a copper valve"
- "tarnished-silver moonlight rim along her parasol curve"
- "ozone-blue spark flashing across her goggle-lens from a Tesla coil"

━━━ COLOR FAMILIES ━━━
GASLAMP-AMBER (14-16 — heavy emphasis, signature lighting), BRASS-FORGE-ORANGE (10-12), VERDIGRIS-GREEN (8-10), TARNISHED-SILVER MOONLIGHT (8-10), OZONE-BLUE TESLA SPARK (8-10), BLOOD-VELVET-RED (6-8), TOBACCO-WARM-BROWN (6-8), STAINED-GLASS-EMERALD (4-6).

━━━ DIRECTION SPREAD ━━━ key (12-14), rim (10-12), underlight (12-14 — gaslamp signature), shaft (6-8), sidelight (6-8).

━━━ HARD RULES ━━━ 8-16 words; COLOR + DIRECTION + IMPACT POINT (her face / parasol / corset / silhouette).
━━━ DEDUP — share COLOR FAMILY and DIRECTION = too similar.
━━━ OUTPUT ━━━ JSON array of ${n} strings. No preamble, no numbering, no markdown.`,
};

const male = {
  smell: ch({name: 'smell', context: 'MALE (steampunk gentleman/inventor — safety-net pool for scene paths)', desc: 'Olfactory cues — pipe-smoke / gear-grease / leather / brass.', examples: ['pipe-smoke and tobacco clinging to his waistcoat','gear-grease and copper on his rolled sleeves','whiskey and gun-powder on his fingertips','leather and brass-polish on his pocket watch','engine-soot smudging his shirt collar'], dedup: 'SCENT NOUN AND LOCATION on him'}),
  sound: ch({name: 'sound', context: 'MALE', desc: 'Mechanical/steampunk sounds + his clothing/gear.', examples: ['his pocket-watch ticking against his vest','his boot-heels ringing on the brass catwalk','his cane tapping the cobblestone with measured rhythm','his goggle-strap creaking as he tightens it','the deep clack of his pipe being knocked out'], dedup: 'SOURCE AND QUALITY'}),
  touch: ch({name: 'touch', context: 'MALE', desc: 'Tactile cues on his skin/hands — leather, brass, soot, oil.', examples: ['his leather glove warming against the brass valve','soot smudging his calloused knuckles','his pocket-watch chain cool against his vest','axle-grease on the back of his bare hand','copper bracelet warm against his wrist'], dedup: 'BODY PART AND SENSATION VERB'}),
  temperature: ch({name: 'temperature', context: 'MALE', desc: 'Thermal cues — boiler/gaslamp/engine warmth or cold on his body.', examples: ['boiler-heat pressing the back of his coat','gas-lamp warmth glowing on his forehead','engine-room steam fogging his goggles','airship-cold biting through his greatcoat sleeves','firelight from the parlor hearth flushing his face'], dedup: 'THERMAL SOURCE AND BODY PART'}),
  weight: ch({name: 'weight', context: 'MALE', desc: 'Steampunk gear weight — tool-belt, brass cane, prosthetic, gear-vest.', examples: ['his tool-belt of brass instruments pulling at his waist','mechanical prosthetic forearm dragging at his elbow','greatcoat soaked with rain at his shoulders','brass-cane balanced casually against his hip','pocket-watch chain swinging across his vest'], dedup: 'OBJECT AND BODY PART'}),
  air: ch({name: 'air', context: 'MALE', desc: 'Atmospheric cues — steam, smoke, soot, fog around him.', examples: ['his pipe-smoke curling past his shoulder','steam venting from the boiler beside him','coal-soot drifting around him from the locomotive','gaslamp halo glowing in the fog around his silhouette','engine-grease vapor catching the lamplight at his elbow'], dedup: 'PARTICLE AND MOTION VERB'}),
  lightcolor: (n) => `You are writing ${n} distinct LIGHTCOLOR anchors for SteamBot's MALE context. Steampunk lighting on his face/body.

EXAMPLES (DO NOT REUSE):
- "gaslamp-amber underglow flooding his face from below"
- "brass-forge orange key cutting across his beard from the boiler"
- "tarnished-silver moonlight rim along his greatcoat shoulder"
- "ozone-blue spark flashing across his goggle-lens"
- "blood-velvet red key from the gentlemen's lounge sconces"

━━━ COLOR FAMILIES ━━━
Same as female: GASLAMP-AMBER (14-16), BRASS-FORGE-ORANGE (10-12), VERDIGRIS-GREEN (8-10), TARNISHED-SILVER MOONLIGHT (8-10), OZONE-BLUE TESLA SPARK (8-10), BLOOD-VELVET-RED (6-8), TOBACCO-WARM-BROWN (6-8), STAINED-GLASS-EMERALD (4-6).

━━━ DIRECTION SPREAD ━━━ key (12-14), rim (10-12), underlight (12-14), shaft (6-8), sidelight (6-8).

━━━ HARD RULES ━━━ 8-16 words; COLOR + DIRECTION + IMPACT POINT (his face / coat / silhouette).
━━━ DEDUP — share COLOR FAMILY and DIRECTION = too similar.
━━━ OUTPUT ━━━ JSON array of ${n} strings. No preamble, no numbering, no markdown.`,
};

const scene = {
  smell: ch({name: 'smell', context: 'SCENE', desc: 'Steampunk environment scents — boiler smoke / gear-grease / brass-polish / cargo.', examples: ['coal-smoke and steam venting from the locomotive boiler','gear-grease and brass-polish in the workshop','tobacco and absinthe in the gentlemen\'s parlor','engine-soot and rust in the cargo hold','steam-and-copper from the venting pressure valve'], dedup: 'SCENT NOUN AND LOCATION'}),
  sound: ch({name: 'sound', context: 'SCENE', desc: 'Steampunk environmental sounds — engines, pistons, gears, valves, gaslamps.', examples: ['steam-piston rhythm pounding through the locomotive','brass gears clicking through their cycle in the contraption','airship rope creaking against its mooring','gaslamp hissing softly above the empty alley','Tesla-coil arc cracking across the laboratory'], dedup: 'SOURCE AND QUALITY'}),
  touch: ch({name: 'touch', context: 'SCENE', desc: 'Steampunk environmental texture — brass, copper, leather, soot.', examples: ['soot dusting the brass railings of the airship deck','copper pipes cool with condensation in the boiler room','leather upholstery soft in the gentlemen\'s parlor','rust crusting the bolted plates of the submarine hull','steam beading on the brass goggles hung on the workbench'], dedup: 'TEXTURE AND SURFACE'}),
  temperature: ch({name: 'temperature', context: 'SCENE', desc: 'Thermal cues — boiler heat / engine cold / gaslamp warmth in the empty environment.', examples: ['boiler-heat radiating into the empty engine room','airship-cabin chill drifting from the high-altitude window','gas-lamp warmth pooling on the parlor table','steam-vent heat blooming in the cargo bay','tea-kettle warmth misting the workshop window'], dedup: 'THERMAL SOURCE AND LOCATION'}),
  weight: ch({name: 'weight', context: 'SCENE', desc: 'Massive steampunk machinery / clockwork / dirigible weight in the environment.', examples: ['century-heavy clockwork pendulum swinging in the cathedral-foundry','airship gondola sagging beneath its brass cargo','locomotive sitting heavy on its iron rails','brass dirigible mooring-cables groaning under tension','steam-engine boiler bolted to its iron deck'], dedup: 'OBJECT AND WEIGHT VERB'}),
  air: ch({name: 'air', context: 'SCENE', desc: 'Atmospheric cues — steam, smoke, soot, fog, gear-mist in environment.', examples: ['steam billowing across the engine-room ceiling','coal-smoke drifting through the airship dock','gaslamp halos glowing through the foggy quay','engine-grease vapor hanging in the workshop air','copper-scented mist curling around the Tesla coil'], dedup: 'PARTICLE AND LOCATION'}),
  lightcolor: (n) => `You are writing ${n} distinct LIGHTCOLOR anchors for SteamBot's SCENE context.

EXAMPLES (DO NOT REUSE):
- "amber gaslamp underglow flooding the parlor"
- "brass-forge orange key from the open boiler door"
- "verdigris-green sidelight from a venting copper valve"
- "tarnished-silver moonlight on the airship deck"
- "ozone-blue spark from a malfunctioning Tesla coil"

━━━ COLOR FAMILIES ━━━ Same as female/male: GASLAMP-AMBER (14-16), BRASS-FORGE-ORANGE (10-12), VERDIGRIS-GREEN (8-10), TARNISHED-SILVER MOONLIGHT (8-10), OZONE-BLUE TESLA SPARK (8-10), BLOOD-VELVET-RED (6-8), TOBACCO-WARM-BROWN (6-8), STAINED-GLASS-EMERALD (4-6).

━━━ DIRECTION SPREAD ━━━ key (12-14), wash (10-12), shaft (10-12), underlight (10-12), backlight (4-6).

━━━ HARD RULES ━━━ 8-16 words; COLOR + DIRECTION + IMPACT POINT (steampunk environmental feature).
━━━ DEDUP — share COLOR FAMILY and DIRECTION = too similar.
━━━ OUTPUT ━━━ JSON array of ${n} strings. No preamble, no numbering, no markdown.`,
};

const metaPrompts = { female, male, scene };
module.exports = { metaPrompts };
