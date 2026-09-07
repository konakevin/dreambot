#!/usr/bin/env node
// AlphaBot — tiny-halloween-hideaway candidate path (prototyped for eventual
// promotion to TinyBot, per BOT_SCENE_QUALITY_PLAYBOOK.md / ALPHABOT.md).
//
// A SINGLE tiny critter's cozy Halloween micro-home: a hollowed pumpkin
// turned into a cottage, an acorn-cap turned into a candy stand, or a
// walnut-shell / gourd den — warm and intimate, ONE critter mandatory,
// never a human. Deliberately intimate/single-dwelling, distinct from the
// village-scale sibling tiny-halloween-village. MVP-25, three generated
// pools:
//   - home     : the money-shot axis — the natural-object dwelling itself,
//                material identity kept unmistakably readable
//   - critter  : the mandatory single resident + a specific home activity
//   - decor    : lived-in furnishing/clutter detail (not staged)
//
// Run: node scripts/gen-seeds/tinybot/gen-tiny-halloween-hideaway-pools.js
//
// Promoted from AlphaBot to TinyBot (2026-09-07) — approved Halloween
// candidate, mechanical relocation only.
const { generatePool } = require('../../lib/seedGenHelper');

const DIR = 'scripts/bots/tinybot/seeds/';

(async () => {
  await generatePool({
    outPath: DIR + 'tiny_halloween_hideaway_home.json',
    total: 120,
    batch: 25,
    append: true,
    banHumanLanguage: true,
    metaPrompt: (
      n
    ) => `You are a master model-maker writing the MONEY-SHOT "home structure" axis for TinyBot's miniature Halloween-hideaway path — the single detail that makes the shot iconic. Each entry describes ONE tiny dwelling hollowed or built from a REAL natural object (a pumpkin, acorn cap, walnut shell, gourd, or chestnut), with its natural rind/shell/cap texture kept UNMISTAKABLY visible — never a generic round cottage that merely happens to be orange. Write ${n} entries, ~25-40 words each, one sentence with a couple of clauses.

━━━ FORMAT (mirror exactly) ━━━
One flowing sentence, comma-separated descriptive clauses, no periods until the end. Name the specific natural object AND at least one carved/built architectural feature (a door, window, roof, awning, chimney) AND one texture detail that proves the material is real.

Example entries (this exact format/length, adapt the CONTENT, never reuse verbatim):
"A whole pumpkin lies hollowed into a one-room cottage, its rind carved into a round door and two crescent windows, the ribbed orange skin still bearing its natural grooves and a stem-stub chimney puffing thin smoke."
"An acorn cap, tipped upside down, forms a tiny candy stand with a striped awning of dried leaf, its rough woody rim left exposed as the counter edge, the felted cap-texture visible along the inside."
"A single walnut shell is split and hollowed into a snug den, one half sunk into the moss as the floor, the other propped open on a twig hinge as a curved roof, its wrinkled shell-grain catching the light."

━━━ DWELLING VARIETY — rotate across ALL of these, roughly even spread ━━━
1. A hollowed whole pumpkin as a one-room cottage (carved door, window, stem chimney)
2. A pumpkin turned on its side as a barrel-shaped cottage with a round porthole window
3. An acorn cap (tipped or upright) as a candy stand, market stall, or tea counter
4. A walnut shell (split, hinged) as a two-room den with a hinged roof-half
5. A gourd (bottle-gourd shape) as a two-story cottage, the narrow neck as an upper loft
6. A chestnut shell (spiky husk removed) as a rounded one-room hut
7. An acorn (the whole nut, not just the cap) as a tower-shaped tiny home
8. A butternut-squash sliver as a lean-to shed or workshop
9. A hazelnut shell as a snug single-room nook with a round door
10. A dried gourd-neck as a chimney or lookout-tower attached to a larger pumpkin-cottage
11. A pumpkin with a real carved jack-o-lantern face doubling as the home's windows and door
12. An acorn-cap roof set atop a hollowed chestnut-shell base (a composite two-material home)

━━━ MANDATORY IN EVERY ENTRY ━━━
- Name the SPECIFIC real natural object (pumpkin / acorn cap / walnut shell / gourd / chestnut — never a generic "shell" or "nut" alone)
- At least one carved or built architectural feature (door, window, roof, chimney, awning, porch)
- At least one texture/material detail proving it is genuinely that object (ribbed rind, woody cap-rim, shell-grain, felted texture, stem-stub)
- Small scale language implied by material (thumb-sized door, matchstick porch post, thread-thin hinge)

🚫 STRICT BANS: NO humans or human silhouettes, NO gore, NO genuine horror/scares, NO real skulls/bones, NO IP-named locations, NO brand names, NO readable text, NO photographer/camera-brand names, NO negation phrasing ("not scary" etc — just write it playful), NO village/street/multiple-buildings framing (this is ONE home only).

Output ONLY a JSON array of ${n} strings, no preamble, no numbering, no markdown fences.`,
  });

  await generatePool({
    outPath: DIR + 'tiny_halloween_hideaway_critter.json',
    total: 120,
    batch: 25,
    append: true,
    banHumanLanguage: true,
    metaPrompt: (
      n
    ) => `You are writing the MANDATORY single-critter resident for TinyBot's miniature Halloween-hideaway path. Each entry is ONE short sentence: a real small woodland animal, living ALONE in its tiny natural-object home, caught mid a specific cozy Halloween-season activity. This critter is the home's only inhabitant — never a human, never an upright cartoon-mascot "creature-person," always proportioned like an actual small animal (button nose, whiskers, paws, fur/quills/scales). Write ${n} entries, ~10-20 words each.

Example entries (this exact format/length, adapt the CONTENT, never reuse verbatim):
"A mouse in a tiny knit scarf stirs a thimble of spiced cider over a bead-sized stove."
"A hedgehog curls beside a candle stub, a half-eaten hazelnut resting on its round belly."
"A vole arranges candy-corn kernels in neat rows on a leaf-plate counter."

━━━ SPECIES MIX — rotate freely across all of these ━━━
mice, hedgehogs, voles, chipmunks, red squirrels, toads, moles, shrews, dormice

━━━ HOME ACTIVITY VARIETY — rotate across ALL of these, never cluster on one ━━━
1. Stirring cider or soup over a tiny stove or bead-sized fire
2. Carving a small pumpkin-face into its own home's rind
3. Curled up asleep on a leaf-quilt bed, candle still burning
4. Sorting or wrapping candy into little packages
5. Reading a tiny book by candlelight in a corner nook
6. Hanging a small paper-bat or cobweb decoration from a hook
7. Setting out a treat dish by the front door
8. Peering out through a carved window, one paw on the sill
9. Sweeping the doorstep with a twig broom
10. Lighting a candle stub inside a lantern
11. Stacking acorns or seeds into a pantry corner
12. Sipping from an acorn-cap teacup at a tiny table
13. Sewing or patching a small leaf-cloak by the fire
14. Popping half out the front door mid-greeting, startled and delighted
15. Tending a small pot of herbs on the windowsill
16. Winding down for the night, blowing out a candle
17. Arranging pumpkin seeds to dry on a windowsill tray
18. Knitting or weaving a small blanket from plant fiber

🚫 STRICT BANS: NO human age/gender words (man/woman/boy/girl/person/etc — these are animals), NO upright human-posed "mascot" framing, NO scary/menacing expressions — always warm, cozy-spooky, playful. NO IP-named characters. NO second animal in the same entry (this home has exactly one resident).

Output ONLY a JSON array of ${n} strings, no preamble, no numbering, no markdown fences.`,
  });

  await generatePool({
    outPath: DIR + 'tiny_halloween_hideaway_decor.json',
    total: 120,
    batch: 25,
    append: true,
    banHumanLanguage: true,
    metaPrompt: (
      n
    ) => `You are writing the LIVED-IN DECOR / CLUTTER axis for TinyBot's miniature Halloween-hideaway path. Each entry is ONE piece of small furnishing or lived-in clutter, inside or right around the tiny natural-object home, that proves a critter actually lives there (not staged, not empty). Write ${n} entries, ~12-25 words each, one sentence.

Example entries (this exact format/length, adapt the CONTENT, never reuse verbatim):
"A stack of acorn-cap teacups sits drying on a mushroom-slice shelf beside the stove."
"A half-carved pumpkin lid leans against the wall, curls of orange shaving still on the floor."
"A row of dried berries hangs on a twine string above the tiny hearth."

━━━ DECOR / CLUTTER VARIETY — rotate across ALL of these categories ━━━
1. Furniture built from smaller natural objects (mushroom-cap stool, seed-pod armchair, twig ladder)
2. Kitchenware (acorn-cap teacup, walnut-shell bowl, berry-preserve jar on a shelf)
3. Halloween-season leftovers (pumpkin shavings, a half-carved lid, spilled seeds)
4. Bedding (a leaf-quilt, moss mattress, dried-petal pillow)
5. Storage (a pantry nook stacked with acorns or seeds, a hanging herb bundle)
6. Lighting fixtures (a candle stub in a thimble holder, a firefly-jar lamp)
7. Small tools (a twig broom in the corner, a thorn-needle and thread)
8. Reading/leisure (a folded leaf-page book, a pressed-flower bookmark)
9. Textiles (a woven-grass rug, a curtain of dried grass strands)
10. Exterior touches right at the doorstep (a welcome mat of moss, a row of drying berries)
11. Seasonal snacks (a bowl of candy-corn kernels, a dish of roasted seeds)
12. Wall decoration (a pressed autumn leaf pinned up, a small cobweb in a corner left undisturbed)

🚫 STRICT BANS: NO humans, NO human-made modern objects (phones, plastic, branded items), NO IP names, NO gore/skulls/bones, NO readable text/labels, NO second critter mentioned in this entry.

Output ONLY a JSON array of ${n} strings, no preamble, no numbering, no markdown fences.`,
  });
})().catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
