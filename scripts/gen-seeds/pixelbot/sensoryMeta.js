/**
 * Meta-prompt registry for PixelBot sensory channel pools.
 * 2 contexts (figure / scene) × 7 channels = 14 pools.
 * Pixel-art register — sprite/tile/parallax/scanline/MIDI/8-bit/16-bit/SNES/CRT.
 */

const SHARED_RULES = `━━━ HARD RULES ━━━
- 8-16 words per entry
- ONE concrete sensory image per entry
- Comma-separated phrases when needed
- NO direct color naming (lightcolor exception)
- NO duplicate verb+noun pairs across entries
- NO HUMAN ANATOMY — never her/his/she/he or hands/lips/skin. Use "the sprite" / "the figure" / "the pixel".
- Aesthetic register: pixel-art / 8-bit / 16-bit / SNES / Genesis / NES / Gameboy / CRT-monitor / chiptune
- Vocabulary: sprite, tile, scanline, parallax, palette, pixel-cluster, MIDI chime, retro-CRT,
  game-boy-green, NES-greyscale, SNES-saturated, 8-bit, 16-bit, Mode-7

━━━ AESTHETIC ANCHORS ━━━
- pixel objects: sprite, tile, baseplate, mini-map icon, inventory item, dialog-box, menu-cursor,
  pixel-cluster, MIDI fanfare, scanline, parallax-layer, sprite-sheet, tile-set, pixel-perfect
- environments: pixel cottage, pixel town, pixel cave, pixel castle, pixel ship, pixel forest,
  pixel mountain, pixel village, pixel-dungeon, pixel-volcano, pixel-mansion, retro-arcade-cabinet`;

function ch(opts) {
  return (n) => `You are writing ${n} distinct ${opts.name.toUpperCase()} anchors for PixelBot's ${opts.context} context.

${opts.desc}

EXAMPLES (DO NOT REUSE):
${opts.examples.map(e => '- "' + e + '"').join('\n')}

${SHARED_RULES}
${opts.absoluteRule || ''}

━━━ DEDUP — too similar if both ${opts.dedup}. Vary one.
━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering, no markdown.`;
}

const figure = {
  smell: ch({name: 'smell', context: 'FIGURE (pixel sprite character)', desc: 'Pixel-art-coded olfactory cues — pixel-smoke / pixel-fire / chiptune-ozone.', examples: ['8-bit pixel-fire embers smoldering near the sprite','ozone-cloud sprite hanging around the lightning-mage','pixel-smoke trailing from a smoldering torch','retro-CRT-phosphor metallic tang around the sprite','pixel-cluster smoke curling from the sprite\'s sword-tip'], dedup: 'PIXEL-CODE NOUN and SPRITE LOCATION'}),
  sound: ch({name: 'sound', context: 'FIGURE', desc: 'Chiptune / MIDI / 8-bit sound effects around the sprite.', examples: ['8-bit footstep blip as the sprite walks','menu-cursor chime in the inventory popup beside the sprite','MIDI battle-fanfare swelling around the heroic pose','pixel-coin pickup ping at the sprite\'s feet','retro-CRT scanline hum behind the sprite'], dedup: 'SOUND TYPE and SPRITE LOCATION'}),
  touch: ch({name: 'touch', context: 'FIGURE', desc: 'Pixel-art surface textures — pixel-perfect outline / scanline ripple / palette-edge.', examples: ['pixel-perfect outline crisp against the parallax background','16-bit half-pixel-feather edge along the sprite\'s cape','scanline ripple crossing the sprite\'s chest','jagged sprite-edge of the sword silhouette','dithered shadow blending under the sprite\'s feet'], dedup: 'PIXEL TEXTURE and SPRITE PART'}),
  temperature: ch({name: 'temperature', context: 'FIGURE', desc: 'Pixel-coded thermal cues — torch-warmth pixel-cluster, frost-tile chill, magma-pixel heat.', examples: ['torch-warmth pixel cluster at the sprite\'s hand','frost-tile chill creeping up the sprite\'s leg','magma-pixel heat radiating around the sprite','snow-tile cool pooling beneath the sprite\'s boots','spell-fire warmth flickering across the sprite\'s face-pixels'], dedup: 'THERMAL SOURCE and SPRITE LOCATION'}),
  weight: ch({name: 'weight', context: 'FIGURE', desc: 'Pixel-sprite weight — equipment / inventory / pixel-pose physics.', examples: ['pixel-armor weighing down the sprite\'s shoulders','inventory pack jostling at the sprite\'s back','pixel-sword dragging at the sprite\'s hip','retro-RPG bag of holding swinging at the sprite\'s side','pixel-helmet pressing the sprite\'s head down'], dedup: 'OBJECT and SPRITE PART'}),
  air: ch({name: 'air', context: 'FIGURE', desc: 'Pixel atmosphere — pixel-pollen / pixel-smoke / sprite-glow drift.', examples: ['pixel-pollen drifting around the sprite\'s silhouette','pixel-smoke curling past the sprite\'s shoulder','spell-glitter pixel-flecks orbiting the sprite\'s halo','retro-CRT static pixel-fuzz around the sprite','dust-pixel cluster swirling at the sprite\'s feet'], dedup: 'PARTICLE and MOTION VERB'}),
  lightcolor: (n) => `You are writing ${n} distinct LIGHTCOLOR anchors for PixelBot's FIGURE context. Pixel-art-palette lighting on the sprite.

EXAMPLES (DO NOT REUSE):
- "magic-cyan pixel-shaft glowing across the sprite"
- "torchlight-amber pixel-cluster casting on the sprite's face"
- "sprite-shadow purple haloing the figure"
- "boss-fight crimson key flooding the sprite"
- "16-bit-sunset orange wash on the sprite's silhouette"

━━━ COLOR FAMILIES ━━━
MAGIC-CYAN PIXEL (10-12), TORCHLIGHT-AMBER (10-12), SPRITE-SHADOW PURPLE (8-10), BOSS-FIGHT CRIMSON (8-10), 16-BIT SUNSET-ORANGE (8-10), GAMEBOY-GREEN (6-8), NEON-PINK CRT (6-8), FLUORESCENT-ARCADE PURPLE (4-6), NES-GREYSCALE (4-6), SNES-SATURATED RAINBOW (4-6), GENESIS-RED-GREEN (4-6).

━━━ DIRECTION SPREAD ━━━ key (12-14), rim (10-12), shaft (8-10), parallax-glow (8-10), palette-shift (4-6), CRT-flicker (4-6).

━━━ HARD RULES ━━━ 8-16 words; COLOR + DIRECTION + IMPACT POINT (sprite face / silhouette / weapon / cape).
━━━ DEDUP — share COLOR FAMILY and DIRECTION = too similar.
━━━ OUTPUT ━━━ JSON array of ${n} strings. No preamble, no numbering, no markdown.`,
};

const scene = {
  smell: ch({name: 'smell', context: 'SCENE (pixel landscape / pixel cottage / pixel-arcade)', desc: 'Pixel-coded environmental smells — pixel-smoke / pixel-pollen / chiptune-ozone.', examples: ['pixel-smoke drifting across the empty pixel-village','pixel-pollen drifting through the parallax forest','retro-CRT ozone hanging in the arcade-cabinet','pixel-fire embers smoldering across the pixel-volcano','dungeon-mildew pixel-fog in the pixel-crypt'], dedup: 'PIXEL NOUN and PIXEL LOCATION'}),
  sound: ch({name: 'sound', context: 'SCENE', desc: 'Chiptune / MIDI / 8-bit ambient sounds in the pixel scene.', examples: ['retro-CRT scanline hum behind the pixel cottage','MIDI town-theme cycling in the pixel village','8-bit wind blip across the pixel landscape','spell-pixel chime echoing in the pixel cave','wave-pixel sound looping at the pixel beach'], dedup: 'SOUND TYPE and PIXEL LOCATION'}),
  touch: ch({name: 'touch', context: 'SCENE', desc: 'Pixel scene textures — pixel-tile / parallax / scanline.', examples: ['pixel-tile cobblestone crisp underfoot in the pixel street','parallax-layer mountain shifting behind the pixel forest','scanline ripple across the pixel sky','dithered-shadow blending across the pixel ground','pixel-grass rustling in the pixel meadow'], dedup: 'PIXEL TEXTURE and SCENE PART'}),
  temperature: ch({name: 'temperature', context: 'SCENE', desc: 'Pixel thermal cues — magma-tile heat / frost-tile chill / dungeon-cool.', examples: ['magma-tile heat radiating across the pixel-volcano','frost-tile chill creeping through the pixel-cave','torchlight-amber warmth pooling in the pixel-cottage','dungeon-pixel cool drifting through the pixel-crypt','spell-fire heat flickering across the pixel-temple'], dedup: 'THERMAL SOURCE and PIXEL LOCATION'}),
  weight: ch({name: 'weight', context: 'SCENE', desc: 'Pixel scene mass — pixel-castle wall / pixel-tower / pixel-cliff.', examples: ['pixel-castle wall pressing into the pixel-mountain','pixel-tower leaning over the pixel-courtyard','pixel-cliff overhanging the pixel-sea','pixel-bridge bowing under the pixel-waggon','pixel-tree trunk anchored to the pixel-meadow'], dedup: 'PIXEL OBJECT and WEIGHT VERB'}),
  air: ch({name: 'air', context: 'SCENE', desc: 'Pixel atmosphere — pixel-mist / pixel-snow / sprite-fire embers.', examples: ['pixel-mist drifting through the pixel-forest','pixel-snowflakes settling on the pixel-cottage roof','spell-glitter pixel-flecks orbiting the pixel-tower','pixel-fire embers spinning over the pixel-village','retro-CRT static pixel-fuzz around the pixel-arcade'], dedup: 'PARTICLE and PIXEL LOCATION'}),
  lightcolor: (n) => `You are writing ${n} distinct LIGHTCOLOR anchors for PixelBot's SCENE context.

EXAMPLES (DO NOT REUSE):
- "magic-cyan pixel-shaft cutting through the pixel-cave"
- "torchlight-amber pixel-cluster glowing in the pixel-cottage window"
- "16-bit-sunset orange wash flooding the pixel-meadow"
- "boss-fight crimson key flooding the pixel-throne-room"
- "fluorescent-arcade purple lighting the pixel-arcade-cabinet"

━━━ COLOR FAMILIES ━━━ Same as figure: MAGIC-CYAN (10-12), TORCHLIGHT-AMBER (10-12), SPRITE-SHADOW PURPLE (8-10), BOSS-FIGHT CRIMSON (8-10), 16-BIT SUNSET-ORANGE (8-10), GAMEBOY-GREEN (6-8), NEON-PINK CRT (6-8), FLUORESCENT-ARCADE PURPLE (4-6), NES-GREYSCALE (4-6), SNES-SATURATED RAINBOW (4-6), GENESIS-RED-GREEN (4-6).

━━━ DIRECTION SPREAD ━━━ key (12-14), wash (10-12), shaft (10-12), parallax-glow (8-10), backlight (6-8).

━━━ HARD RULES ━━━ 8-16 words; COLOR + DIRECTION + IMPACT POINT (pixel scene feature).
━━━ DEDUP — share COLOR FAMILY and DIRECTION = too similar.
━━━ OUTPUT ━━━ JSON array of ${n} strings. No preamble, no numbering, no markdown.`,
};

const metaPrompts = { figure, scene };
module.exports = { metaPrompts };
