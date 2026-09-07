#!/usr/bin/env node
// AlphaBot candidate — pixel-haunted-dungeon (destination: PixelBot).
// A 16-bit RPG-style SIDE-VIEW dungeon interior gameplay screenshot: a
// torch-lit stone crypt/basement room holding exactly ONE ghost-or-skeleton
// enemy sprite, camera locked to a flat side-view cross-section (distinct
// from the overworld's top-down camera and from PixelBot's existing
// top-down/iso dungeon-depth path). Four MVP-25 pools: the room layout, the
// torch-lit wall (money shot), the haunted enemy, and floor-level dressing.
// Modeled on scripts/gen-seeds/alphabot/gen-pixel-haunted-house.js.
const { generatePool } = require('../../lib/seedGenHelper');

(async () => {
  // ── Axis 1: the room's side-view layout ──
  await generatePool({
    outPath: 'scripts/bots/pixelbot/seeds/pixel_haunted_dungeon_room.json',
    total: 120,
    batch: 25,
    append: true,
    banHumanLanguage: true,
    metaPrompt: (
      n
    ) => `Write ${n} SIDE-VIEW HAUNTED-DUNGEON ROOM entries for a 16-bit pixel-art RPG-style dungeon interior gameplay screenshot. Each describes ONE room/chamber's side-view interior layout — a flat cross-section view straight into the room, like a classic 2D side-view RPG dungeon screen (NOT top-down, NOT isometric). Each entry 20-32 words. (Torch-lighting, the enemy, and floor dressing are supplied separately — focus only on the room's architecture/layout here.)

━━━ VARY THE ROOM ACROSS ALL ${n} (spread across these, don't repeat the same room type twice) ━━━
- Crypt vestibule with stacked stone sarcophagi lining one wall
- Ossuary alcove with skull-lined niches carved into the back wall
- Collapsed stairwell landing with a partial rubble slope
- Sunken chapel nave with a row of broken wooden pews
- Bone-strewn antechamber under a low vaulted stone ceiling
- Narrow corridor bend widening into a small side alcove
- Flooded cellar chamber with a shallow reflective pool
- Root-choked tomb passage where thick roots break through cracked stone
- Ruined library alcove with a few rotted, empty shelves
- Forgotten treasury vault with one toppled, empty chest
- Cracked mausoleum interior centered on a low stone altar
- Catacomb junction with three small archways leading off-frame
- Bone-strewn storeroom with a few overturned barrels
- Tomb antechamber with faint carved spiral patterns on the walls
- Sunken dungeon cell block with one open iron-barred cell door
- Forgotten armory alcove with a rack of rusted, empty weapon hooks
- Cobweb-draped storage vault stacked with broken wooden crates
- Cracked well-room chamber with a dry stone wellhead
- Subterranean shrine room with a small weathered stone shrine
- Spiral stairwell landing carved directly into bedrock

━━━ EACH ENTRY MUST INCLUDE ━━━
1. The room/chamber type (from or inspired by the list above)
2. Its side-view layout detail — what fills the back wall and floor plane in this flat cross-section (so it unmistakably reads as a side-view screen, never a top-down one)

━━━ EXAMPLE FORMAT (~24 words) ━━━
"A crypt vestibule with three stacked stone sarcophagi along the back wall, a low cracked archway at floor level opening onto a darker passage beyond."

━━━ RULES ━━━
SIDE-VIEW cross-section framing only — never describe a top-down, bird's-eye, or overhead layout. NO humans, no human bystanders, no people of any age. NO readable text/runes-as-text. Charming spooky-game register — never genuinely bleak, gory, or grotesque.

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
  });

  // ── Axis 2 (MONEY SHOT): the torch-lit stone wall ──
  await generatePool({
    outPath: 'scripts/bots/pixelbot/seeds/pixel_haunted_dungeon_torchwall.json',
    total: 120,
    batch: 25,
    append: true,
    banHumanLanguage: true,
    metaPrompt: (
      n
    ) => `Write ${n} TORCH-LIT STONE WALL entries for a 16-bit pixel-art haunted-dungeon-room gameplay screenshot — THIS IS THE MONEY SHOT of the whole scene: describe the specific warm flickering torch/flame treatment against the cold stone wall. Each entry 20-35 words. Always name the warm firelight (orange/amber flame, flicker, glow) EXPLICITLY.

━━━ VARY THE TREATMENT ACROSS ALL ${n} (spread across distinct torch/wall pairings, don't repeat the same one twice) ━━━
- Iron wall-sconces holding flickering orange flame spaced along the stone
- Torches nestled in carved skull-shaped brackets
- A single large iron brazier casting long dancing shadows across the wall
- Twin torches flanking a cracked stone archway
- Wall-mounted torches with dripping wax pooling on the ledge below
- Torches in rusted cage-holders throwing lattice-shaped shadow
- A low-burning torch casting a weak, warm halo against damp stone
- Torches reflected faintly in a thin sheen of moisture on the wall
- Torches spaced along a moss-patched wall, green-tinted shadow at the edges
- A chain of small votive flames set along a stone ledge
- A single torch beside a cracked door throwing one long stretched shadow
- Torches mounted in gargoyle-mouth wall brackets
- Torchlight flickering warm across faint carved spiral wall patterns
- A row of torches behind iron bars throwing striped shadow across the floor
- Torch flame reflected in a small puddle at the wall's base
- Warm torchlight pooling against cool blue ambient dungeon shadow
- Torches flanking a low stone altar or dais
- A cracked wall section lit by torchlight showing crumbling mortar seams
- A lantern hook holding a torch that sways very slightly
- A trio of torches clustered near a stone doorway, throwing overlapping shadow

━━━ EACH ENTRY MUST INCLUDE ━━━
1. Explicit warm firelight (orange/amber flame, flicker, glow) named directly
2. The specific torch placement/holder (from or inspired by the list above)
3. How it plays against the stone wall (shadow, dampness, moss, carving, crack)

━━━ EXAMPLE FORMAT (~28 words) ━━━
"Iron wall-sconces holding flickering orange flame spaced every few feet along the damp gray stone, each casting a warm dancing halo and long shifting shadow across the wall."

━━━ RULES ━━━
NO humans, no human bystanders, no people of any age. NO readable text. This is the SIGNATURE moment of the render — commit fully to warm flickering firelight against cold stone.

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
  });

  // ── Axis 3: the haunted enemy (exactly one, playful, non-human) ──
  await generatePool({
    outPath: 'scripts/bots/pixelbot/seeds/pixel_haunted_dungeon_enemy.json',
    total: 120,
    batch: 25,
    append: true,
    banHumanLanguage: true,
    metaPrompt: (
      n
    ) => `Write ${n} HAUNTED-ENEMY entries for a 16-bit pixel-art haunted-dungeon-room gameplay screenshot. Each describes exactly ONE ghost-or-skeleton enemy sprite caught mid-idle-action, like a paused game-encounter moment. Each entry 20-32 words. PLAYFUL and cheeky register — a friendly game-mascot monster, never a genuine scare.

━━━ VARY THE POSE ACROSS ALL ${n} (spread across distinct mid-action poses, don't repeat the same one twice — alternate between skeleton and ghost entries) ━━━
- Grinning skeleton warrior mid-swing with a rattling bone sword
- Round-eyed ghost drifting mid-float with a lopsided grin
- Skeleton archer mid-draw, arrow nocked, jaw open in a playful battle-cry
- Wobbly skeleton mid-stumble, bones rattling loose then clattering back into place
- Plump ghost puffing itself up mid-boo, translucent form rippling
- Skeleton knight mid-salute holding a small cracked round shield
- Shy ghost peeking out from behind a pillar, one eye showing
- Skeleton mid-jig, doing a little bone-rattling dance step
- Ghost mid-spin, trailing a wispy ribbon-like vapor
- Skeleton mage mid-cast, holding a glowing wisp of green flame
- Skeleton mid-yawn, stretching bony arms overhead
- Ghost mid-giggle, translucent shoulders shaking
- Skeleton guard mid-patrol-turn, a small spear resting on one bony shoulder
- Ghost mid-peekaboo, half its form phased through the wall
- Skeleton mid-juggle, tossing its own detached hand bones playfully
- Ghost mid-somersault, trailing a loose swirl of ectoplasm
- Skeleton mid-bow, one hand theatrically over its hollow ribcage
- Ghost mid-hover, translucent cheeks puffed comically wide
- Skeleton mid-hiccup, jaw rattling loose then clattering shut again
- Friendly ghost mid-wave, one wispy arm raised high

━━━ EACH ENTRY MUST INCLUDE ━━━
1. The species — "a skeleton" OR "a ghost" (never both in one entry) — plus its mid-action pose (from or inspired by the list above)
2. 2-3 unmistakable NON-HUMAN features stated explicitly: e.g. rattling bare bones, a hollow ribcage, glowing eye sockets, a fully translucent see-through form, a trailing wisp of vapor, no visible skin or flesh
3. A PLAYFUL, cheeky, or charming quality (a grin, a wink, a giggle, a cheerful pose) — never a menacing or frightening quality

━━━ EXAMPLE FORMAT (~26 words) ━━━
"A grinning skeleton warrior mid-swing with a rattling bone sword, hollow eye sockets glowing faint blue, bare rib bones clacking loosely, a cheeky triumphant grin on its skull."

━━━ RULES ━━━
NO humans, no human bystanders, no people of any age — this is a skeleton or a ghost, never a costumed person. Exactly ONE enemy per entry. NO readable text. PLAYFUL and charming always — never described as menacing, terrifying, or bloodthirsty.

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
  });

  // ── Axis 4: floor-level dressing ──
  await generatePool({
    outPath: 'scripts/bots/pixelbot/seeds/pixel_haunted_dungeon_floor.json',
    total: 120,
    batch: 25,
    append: true,
    banHumanLanguage: true,
    metaPrompt: (
      n
    ) => `Write ${n} DUNGEON-ROOM FLOOR-DETAIL entries for a 16-bit pixel-art haunted-dungeon-room gameplay screenshot. Each entry 16-28 words, describing ONE floor-level dressing detail filling out the side-view room (the room architecture, torch-lit wall, and enemy are supplied separately).

━━━ VARY ACROSS ALL ${n} (spread across distinct floor features, don't repeat the same one twice) ━━━
- A scattered pile of loose gray rubble
- A scatter of small pale bone shards
- Cracked flagstones with thin roots pushing through the seams
- A few scattered gold coins catching the torchlight
- A broken round shield half-buried in dust
- Patches of moss creeping up from floor cracks
- A small pool of still water reflecting torchlight
- Drifts of dust and cobweb along the base of the walls
- A fallen wooden ladder lying across the floor
- Shattered pottery shards scattered near a wall
- A low pile of rubble partially blocking a side passage
- Uneven flagstones tilted from old ground shifts
- An old iron floor-grate set flush into the stone
- A small scatter of bones near the wall base
- A broken cart wheel half-buried in dust
- Patchy dead moss and lichen filling floor seams
- A thin crack in the floor glowing faint amber from below
- An overturned wooden crate spilling loose straw
- A short run of rusted chain anchored into the floor
- A light scatter of fallen torch-ash near a wall

━━━ EACH ENTRY MUST INCLUDE ━━━
1. The specific floor feature (from or inspired by the list above)
2. Where it sits in the side-view floor plane (foreground, against the wall base, mid-floor, etc.)

━━━ EXAMPLE FORMAT (~20 words) ━━━
"Cracked flagstones in the foreground with thin pale roots pushing up through the seams, a faint scatter of loose gray rubble nearby."

━━━ RULES ━━━
NO humans, no human bystanders, no people of any age. NO readable text. Grounded game-clutter register — never gory or grotesque.

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
  });
})().catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
