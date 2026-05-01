/**
 * RetroBot sensory meta — 1 context (scene) × 7 channels.
 * 80s/90s nostalgia — diner, mall, arcade, vintage household, faded-Kodachrome.
 */

const SHARED_RULES = `━━━ HARD RULES ━━━
- 8-16 words per entry
- ONE concrete sensory image per entry
- NO direct color naming (lightcolor exception)
- NO duplicate verb+noun pairs
- NO HUMANS — never her/his/she/he. Use "the diner" / "the arcade" / "the bedroom"
- Aesthetic register: 80s/90s nostalgia / faded-Kodachrome / VHS-tape / suburban-living-room
- Vocabulary: lava lamp, Lisa Frank, neon sign, arcade cabinet, jukebox, vinyl record, polaroid,
  VHS tape, cassette, boombox, rotary phone, shag carpet, wood paneling, popcorn ceiling,
  wallpaper-floral, fluorescent-mall-corridor, diner-counter, drive-in cinema, neon-coke, Pepsi-blue`;

const scene = {
  smell: (n) => `${n} SMELL anchors for RetroBot's 80s/90s scene.

EXAMPLES (DO NOT REUSE):
- "fresh popcorn from the empty diner counter"
- "vinyl-record-sleeve cardboard in the basement"
- "shag-carpet dust in the wood-paneled den"
- "VHS-tape plastic in the rented videostore aisle"
- "fluorescent-mall HVAC drifting through the empty corridor"

${SHARED_RULES}
━━━ DEDUP — share SCENT and LOCATION = too similar.
━━━ OUTPUT ━━━ JSON array of ${n} strings. No preamble, no numbering, no markdown.`,

  sound: (n) => `${n} SOUND anchors for RetroBot's 80s/90s scene.

EXAMPLES (DO NOT REUSE):
- "VHS-tape rewind hum from the empty TV cabinet"
- "arcade-cabinet attract-loop chiptune in the mall corner"
- "rotary phone ringing on the avocado-green kitchen wall"
- "vinyl record needle popping in the empty den"
- "Coca-Cola neon buzzing above the diner booth"

${SHARED_RULES}
━━━ DEDUP — share SOURCE and QUALITY = too similar.
━━━ OUTPUT ━━━ JSON array of ${n} strings. No preamble, no numbering, no markdown.`,

  touch: (n) => `${n} TOUCH anchors for RetroBot's 80s/90s scene. Carpet/wallpaper/wood-panel/lacquer textures.

EXAMPLES (DO NOT REUSE):
- "shag-carpet pile catching dust in the den"
- "wood-paneling warm under the afternoon sun stripe"
- "polaroid emulsion peeling along the bedroom wall"
- "neon-tube vibration humming against the diner-window glass"
- "wallpaper floral pattern peeling at the corner of the kitchen"

${SHARED_RULES}
━━━ DEDUP — share TEXTURE and SURFACE = too similar.
━━━ OUTPUT ━━━ JSON array of ${n} strings. No preamble, no numbering, no markdown.`,

  temperature: (n) => `${n} TEMPERATURE anchors for RetroBot's 80s/90s scene.

EXAMPLES (DO NOT REUSE):
- "summer-window heat warming the bedroom carpet"
- "fluorescent-mall AC chilling the empty corridor"
- "lava-lamp warmth glowing on the dresser"
- "popcorn-ceiling cool above the basement TV"
- "neon-tube heat pulsing through the diner window"

${SHARED_RULES}
━━━ DEDUP — share THERMAL SOURCE and LOCATION = too similar.
━━━ OUTPUT ━━━ JSON array of ${n} strings. No preamble, no numbering, no markdown.`,

  weight: (n) => `${n} WEIGHT anchors for RetroBot's 80s/90s scene.

EXAMPLES (DO NOT REUSE):
- "console TV anchored on the wood-paneled stand"
- "arcade-cabinet leaning against the mall-corridor wall"
- "boombox sitting heavy on the bedroom dresser"
- "stack of vinyl records pressing the basement crate"
- "rotary phone bolted to the avocado-green kitchen wall"

${SHARED_RULES}
━━━ DEDUP — share OBJECT and WEIGHT VERB = too similar.
━━━ OUTPUT ━━━ JSON array of ${n} strings. No preamble, no numbering, no markdown.`,

  air: (n) => `${n} AIR anchors for RetroBot's 80s/90s scene.

EXAMPLES (DO NOT REUSE):
- "popcorn steam drifting across the empty diner booth"
- "lava-lamp blob suspended in the dresser glass"
- "neon-sign humid haze in the wet sidewalk above"
- "dust motes turning in the basement-window shaft"
- "bubble-gum smoke ring from a vintage cigarette ashtray"

${SHARED_RULES}
━━━ DEDUP — share PARTICLE and LOCATION = too similar.
━━━ OUTPUT ━━━ JSON array of ${n} strings. No preamble, no numbering, no markdown.`,

  lightcolor: (n) => `${n} LIGHTCOLOR anchors for RetroBot's 80s/90s scene.

EXAMPLES (DO NOT REUSE):
- "faded-Kodachrome amber glow flooding the living room"
- "neon-pink-and-cyan 80s sign-light on the wet sidewalk"
- "Lisa-Frank rainbow-iridescent backlight on the bedroom wall"
- "lava-lamp orange-and-pink glow on the dresser"
- "VHS-tape teal-and-magenta tracking-line glow on the TV"

━━━ COLOR FAMILIES ━━━
FADED-KODACHROME-AMBER (12-14), NEON-PINK-AND-CYAN (12-14), LISA-FRANK-IRIDESCENT (8-10), LAVA-LAMP-ORANGE-PINK (8-10), VHS-TEAL-MAGENTA (8-10), FLUORESCENT-MALL-COOL (8-10), CHRISTMAS-RED-GREEN (4-6), NEON-COKE-PEPSI (4-6), ARCADE-PURPLE-CYAN (6-8), POLAROID-WARM-CORAL (6-8), WINTER-STREETLIGHT-AMBER (4-6), SUMMER-GOLDEN (4-6).

━━━ DIRECTION SPREAD ━━━ key (12-14), wash (10-12), shaft (10-12), rim (8-10), backlight (4-6).

━━━ HARD RULES ━━━ 8-16 words; COLOR + DIRECTION + IMPACT POINT (retro environmental feature).
━━━ DEDUP — share COLOR FAMILY and DIRECTION = too similar.
━━━ OUTPUT ━━━ JSON array of ${n} strings. No preamble, no numbering, no markdown.`,
};

module.exports = { metaPrompts: { scene } };
