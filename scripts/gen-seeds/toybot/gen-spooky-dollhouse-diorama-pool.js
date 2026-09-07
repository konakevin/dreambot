#!/usr/bin/env node
// AlphaBot — spooky-dollhouse-diorama candidate path (Halloween, prototyped
// for eventual promotion to ToyBot, per BOT_SCENE_QUALITY_PLAYBOOK.md /
// ALPHABOT.md).
//
// A miniature HAUNTED DOLLHOUSE rendered as a physical toy/model
// architectural diorama: tiny cobwebbed rooms, a crooked turret or other
// haunted quirk, warm window-glow against a dark exterior, shot as a
// cinematic macro toy photograph. The HOUSE is the hero — architecture, not
// a dollhouse-people cast. MVP-25, four generated pools:
//   - architecture  : MONEY-SHOT axis — exterior silhouette + ONE haunted/
//                     crooked quirk (mirrors the "money-shot" pattern from
//                     tiny_halloween_village_scale_prover.json)
//   - room_vignette : one tiny interior room glimpsed through a lit window
//   - yard_grounds  : the exterior grounds/base dressing
//   - haunt_accent  : OPTIONAL (~45% at render time) friendly toy-scale
//                     Halloween creature/detail — never mandatory
//
// Run: node scripts/gen-seeds/toybot/gen-spooky-dollhouse-diorama-pool.js
const { generatePool } = require('../../lib/seedGenHelper');

const DIR = 'scripts/bots/toybot/seeds/';

const STRICT_BANS =
  '🚫 STRICT BANS: NO real humans or human silhouettes, NO genuine horror/gore, NO real skulls/bones, NO IP-named locations or characters, NO brand names, NO readable text, NO photographer/camera-brand names, NO negation phrasing ("not scary" etc — just write it playful and let the positive details carry it).';

(async () => {
  // ─── Axis 1 — HAUNTED_ARCHITECTURE (the money-shot axis) ───
  await generatePool({
    outPath: DIR + 'spooky_dollhouse_architecture.json',
    total: 120,
    batch: 25,
    append: true,
    banHumanLanguage: true,
    metaPrompt: (
      n
    ) => `You are a master miniature-model builder writing the SIGNATURE ARCHITECTURE for a MINIATURE HAUNTED DOLLHOUSE — a real handcrafted scale-model toy that is the star of every shot in ToyBot's spooky-dollhouse-diorama path. Each entry is ONE specific dollhouse silhouette PLUS ONE unmistakable haunted/crooked architectural quirk — the money-shot detail that makes THIS exact house iconic. This is always a MINIATURE TOY, never a real full-size house: keep hand-cut-wood / glued-card / hand-painted-trim / dollhouse-scale materials language present in every entry. Write ${n} entries, 25-45 words each, one house per entry.

━━━ FORMAT (mirror exactly) ━━━
One flowing comma-separated description, no full sentences with periods until the very end. Silhouette first, then the ONE haunted quirk, then a material/craft detail.

Example entries (this exact format/length, adapt the CONTENT, never reuse verbatim):
"A three-story Victorian dollhouse mansion with a corner witch's-hat turret that leans noticeably off-plumb, hand-cut cedar-shake shingles curling at the edges, a wraparound porch sagging at one corner, dollhouse-scale gingerbread trim peeling in careful hand-painted flakes."
"A narrow gambrel-roofed farmhouse dollhouse with a crooked brick chimney tilted mid-collapse, one shutter hanging by a single tiny hinge, hand-painted clapboard siding faded to weathered gray, a widow's-walk railing missing two balusters."
"A squat gothic-manor dollhouse with twin pointed dormers, one cracked stained-glass rosette window, an iron weathervane spun backward and frozen mid-turn, hand-laid stone-look card facade with a visible crumbling corner."

━━━ SILHOUETTE VARIETY — rotate across ALL of these (never cluster on Victorian) ━━━
1. Tall Victorian mansion with a corner witch's-hat turret
2. Squat gothic manor with twin pointed dormers
3. Narrow gambrel-roofed farmhouse
4. Crooked shotgun rowhouse leaning against its neighbor
5. Lighthouse-style tower house
6. Crumbling castle-keep dollhouse with a single round tower
7. A saltbox cottage with a lopsided add-on wing
8. A plantation-style dollhouse with a tilted columned porch
9. A stacked townhouse with a rooftop cupola
10. A round silo-shaped tower dollhouse
11. A steep A-frame chalet-style dollhouse
12. A wide Queen-Anne dollhouse with a wraparound porch
13. A tall narrow brownstone-style dollhouse
14. A mill-house dollhouse with a broken waterwheel
15. A church-chapel-style dollhouse with a crooked steeple
16. A treehouse-style dollhouse built into a gnarled toy-tree trunk
17. A barn-style dollhouse with a hayloft door hanging open
18. A windmill-style dollhouse with one stalled, frozen sail

━━━ HAUNTED-QUIRK VARIETY — give each house ONE of these (rotate, never repeat the same quirk twice in a row) ━━━
- A turret or spire leaning noticeably off-plumb
- A sagging porch roofline or bowed floorboards
- A crooked, mid-collapse chimney
- A widow's-walk railing missing balusters
- A shutter hanging by a single hinge
- A weathervane spun backward and frozen
- A cracked or crookedly-hung stained-glass window
- Ivy quietly swallowing one dormer
- A missing-shingle patch revealing bare wood underneath
- A tilted mailbox post out front
- A lopsided, off-center cupola
- A visibly bowed or bulging wall section

━━━ MANDATORY IN EVERY ENTRY ━━━
- Explicit miniature-TOY material language (hand-cut, glued, hand-painted, card, balsa, dollhouse-scale) — this must always read as a handcrafted model, never a real building
- Exactly ONE haunted/crooked quirk from the list above (not two, not none)
- At least one warm-glowing window mentioned or implied against the dark exterior

${STRICT_BANS}

Output ONLY a JSON array of ${n} strings, no preamble, no numbering, no markdown fences.`,
  });

  // ─── Axis 2 — COBWEBBED_ROOM_VIGNETTE ───
  await generatePool({
    outPath: DIR + 'spooky_dollhouse_room_vignette.json',
    total: 120,
    batch: 25,
    append: true,
    banHumanLanguage: true,
    metaPrompt: (
      n
    ) => `You are writing tiny INTERIOR ROOM vignettes glimpsed inside a miniature haunted dollhouse — through a lit window or an open dollhouse-front cutaway — for ToyBot's spooky-dollhouse-diorama path. Each room is cobwebbed but COZY-spooky: Halloween-cute, never scary. Each entry: ONE specific room type + ONE piece of specific furnishing/detail + ONE cobweb or Halloween touch + a warm light source. Miniature-scale materials only (thimble-sized, matchbox-sized, dollhouse-scale). Write ${n} entries, 20-35 words each, one room per entry.

Example entries (this exact format/length, adapt the CONTENT, never reuse verbatim):
"A dusty parlor with a cobweb-draped miniature chandelier over a tea-set laid for two, a carved pumpkin glowing on the side table, warm candlelight flickering behind lace curtains."
"An attic under sloped rafters strung with silvery cobweb garlands, a rocking chair mid-creak beside a trunk of forgotten toys, one bare bulb swinging on a thread of warm light."
"A kitchen with a fresh pumpkin pie cooling on a cobwebbed windowsill, copper pots hanging from tiny hooks, a black-cat silhouette painted onto the curtain, warm hearth-glow spilling out."

━━━ ROOM VARIETY — rotate across ALL of these (never cluster on parlor/kitchen) ━━━
1. Dusty parlor with a cobwebbed chandelier
2. Attic under sloped rafters with a forgotten trunk
3. Kitchen with a fresh pumpkin pie cooling
4. Library with tilted, cobwebbed bookshelves
5. Nursery with a gently rocking cradle
6. Dining room with a lopsided candelabra centerpiece
7. Wine cellar with cobwebbed barrels and dusty bottles
8. Music room with a spider perched politely on piano keys
9. Sitting room with a jack-o-lantern glowing on the mantel
10. Staircase landing with a cobweb-draped banister
11. Conservatory with twisted potted plants silhouetted in the glow
12. Laundry room with a ghost-shaped bedsheet drying on a line
13. Study with a candle-lit desk and an open storybook
14. Bedroom with a patchwork quilt and a bat-shaped nightlight
15. Bathroom with a claw-foot tub and a bat-shaped rubber toy
16. Foyer with a cobwebbed coat rack and a grinning-pumpkin welcome mat
17. Sewing room with a spiderweb stretched over an unfinished quilt
18. Pantry with jars of candy corn lined on cobwebbed shelves

━━━ MANDATORY IN EVERY ENTRY ━━━
- A warm light source (candle, lantern, pumpkin-glow, hearth, bare bulb) named or clearly implied
- Visible cobweb, thread, or gauze detail somewhere in the room
- Miniature-scale material language (thimble, matchbox, dollhouse-scale, tiny)
- Cozy-spooky tone — inviting and playful, never frightening

${STRICT_BANS}

Output ONLY a JSON array of ${n} strings, no preamble, no numbering, no markdown fences.`,
  });

  // ─── Axis 3 — YARD_AND_GROUNDS ───
  await generatePool({
    outPath: DIR + 'spooky_dollhouse_yard_grounds.json',
    total: 120,
    batch: 25,
    append: true,
    banHumanLanguage: true,
    metaPrompt: (
      n
    ) => `You are writing the EXTERIOR GROUNDS surrounding a miniature haunted dollhouse — the diorama base that seats it in a believable little world — for ToyBot's spooky-dollhouse-diorama path. Each entry is ONE specific yard/garden feature plus a Halloween touch, at true miniature scale, playful and comic-spooky, never scary. Write ${n} entries, 20-35 words each, one yard scene per entry.

Example entries (this exact format/length, adapt the CONTENT, never reuse verbatim):
"A wrought-iron picket fence with a creaky half-open gate, a gravel path lined with grinning jack-o-lanterns leading to the porch steps, dry leaves scattered across the flagstones."
"A small pumpkin patch out front with three ripening gourds tangled in curling vines, a scarecrow leaning good-naturedly against a fencepost, a wheelbarrow tipped over nearby."
"Mossy stone steps climbing to the porch, a birdbath filled with drifted autumn leaves, a garden gnome dressed in a tiny handmade ghost sheet standing guard by the door."

━━━ YARD-FEATURE VARIETY — rotate across ALL of these (never cluster on the fence/gate) ━━━
1. Wrought-iron picket fence with a creaky gate
2. Gravel or flagstone path lined with jack-o-lanterns
3. A small pumpkin patch with curling vines
4. Mossy stone steps up to the porch
5. A twisted bare toy-tree with a tire swing
6. A cluster of comic "RIP" toy tombstones (cartoonish, never gory)
7. A birdbath filled with fallen leaves
8. A hedge trimmed into a black-cat silhouette
9. A stone well with a lantern hanging over it
10. A scarecrow leaning good-naturedly against a fencepost
11. A wheelbarrow full of gourds
12. A stack of firewood by the door
13. A rocking chair on the porch, mid-creak
14. A row of carved pumpkins lining the porch railing
15. A string of paper-bat lights along the eaves
16. A mailbox shaped like a bat or a pumpkin
17. A garden gnome dressed in a tiny ghost costume
18. A pile of raked autumn leaves by the front walk

━━━ MANDATORY IN EVERY ENTRY ━━━
- At least one specific, named yard/garden prop or feature
- Grounds the house in a believable little diorama base (path, fence line, steps, or similar)
- Playful, comic-spooky register — no genuinely creepy details

${STRICT_BANS}

Output ONLY a JSON array of ${n} strings, no preamble, no numbering, no markdown fences.`,
  });

  // ─── Axis 4 — FRIENDLY_HAUNT_ACCENT (optional ~45% at render time) ───
  await generatePool({
    outPath: DIR + 'spooky_dollhouse_haunt_accent.json',
    total: 120,
    batch: 25,
    append: true,
    banHumanLanguage: true,
    metaPrompt: (
      n
    ) => `You are writing ONE tiny toy-scale FRIENDLY Halloween creature or animated detail that brings life to a miniature haunted dollhouse scene, for ToyBot's spooky-dollhouse-diorama path. This accent is OPTIONAL at render time (used in roughly half of renders) — never describe it as central or dominant, just one small warm touch. It must always be explicitly a TOY / PLUSH / PAINTED FIGURE, NEVER a human, and always warmly playful — grinning, waving, peeking, perched, or otherwise friendly, NEVER menacing. Write ${n} entries, 15-30 words each, one accent per entry.

Example entries (this exact format/length, adapt the CONTENT, never reuse verbatim):
"A round plush ghost figure peeks out from behind a curtain in an upstairs window, its stitched-on grin warm and welcoming."
"A tiny painted-tin bat toy hangs upside-down from the porch eave on a thread, wings caught mid-flutter."
"A plush black cat toy with button eyes perches on the porch railing, tail curled, watching the gate with a friendly squint."

━━━ ACCENT VARIETY — rotate across ALL of these (never repeat the same creature/toy type twice) ━━━
1. Plush ghost figure peeking from a window
2. Painted-tin or felt bat toy hanging from the eave
3. Plush black cat toy on the porch rail
4. Toy spider dangling from the turret on a thread
5. A jack-o-lantern toy figure with a lit candle-stub grin on the step
6. A broom-riding toy witch figurine mid-flight just over the roofline
7. A toy owl figure perched on the chimney
8. A felt bat-cutout garland fluttering along the porch eave
9. A plush mouse in a tiny cape scurrying along the porch rail
10. A toy skeleton-hand puppet waving cheerfully from the mail slot (cartoonish, never gory)
11. A stuffed pumpkin-headed scarecrow toy tipping its hat
12. A tiny wind-up toy bat circling the turret
13. A felt raven toy perched on the gatepost
14. A toy frog figure wearing a tiny witch-hat on the step
15. A plush spider toy sitting politely atop a pumpkin

━━━ MANDATORY IN EVERY ENTRY ━━━
- Explicit toy/plush/painted-figure material language (plush, felt, painted-tin, stitched, button-eyed, stuffed, wind-up)
- A warm, friendly action or expression (grinning, waving, peeking, perched, curled, squinting warmly)
- NEVER a human, NEVER menacing or threatening

${STRICT_BANS}

Output ONLY a JSON array of ${n} strings, no preamble, no numbering, no markdown fences.`,
  });
})().catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
