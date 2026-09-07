#!/usr/bin/env node
// AlphaBot — tiny-haunted-hollow candidate path (prototyped for eventual
// promotion to TinyBot, per BOT_SCENE_QUALITY_PLAYBOOK.md / ALPHABOT.md).
//
// A gentle-spooky (NEVER truly scary) miniature diorama: a tiny hollow tree
// or acorn-cap "rest garden" clearing — cobwebs strung between twigs like
// seasonal lace, mushroom-cap lanterns glowing amber, 1-2 tiny real
// woodland critters cast as the ONLY inhabitants. MVP-25, three generated
// pools:
//   - scenes   : the hollow-tree / acorn-rest-garden world (3-clause
//                layered format, mirrors tiny_winter_village.json)
//   - lanterns : MONEY-SHOT axis — specific mushroom-cap lantern glow
//                configurations that anchor every render
//   - critters : the mandatory tiny critter cast (mirrors
//                tiny_winter_village_cast.json)
//
// Run: node scripts/gen-seeds/tinybot/gen-tiny-haunted-hollow-pool.js
//
// Promoted from AlphaBot to TinyBot (2026-09-07) — approved Halloween
// candidate, mechanical relocation only.
const { generatePool } = require('../../lib/seedGenHelper');

const DIR = 'scripts/bots/tinybot/seeds/';

(async () => {
  await generatePool({
    outPath: DIR + 'tiny_haunted_hollow_scenes.json',
    total: 120,
    batch: 25,
    append: true,
    banHumanLanguage: true,
    metaPrompt: (
      n
    ) => `You are a master model-maker writing GENTLE-SPOOKY MINIATURE HOLLOW-TREE / ACORN-REST-GARDEN scenes for TinyBot's tilt-shift diorama style. Each entry is ONE dollhouse-scale autumn-nook vignette — a lived-in little world dressed for the season, never a single object on a bare surface, and NEVER genuinely scary. Write ${n} entries.

━━━ FORMAT (mirror exactly) ━━━
Each entry is THREE clauses separated by semicolons, moving foreground → midground → far-distance, ~25-40 words total. Comma-separated phrases within each clause, no full sentences with periods until the very end of the entry.

Example entries (this exact format/length, adapt the CONTENT, never reuse verbatim):
"A gnarled hollow-tree doorway is strung with lace-thin cobwebs catching the amber lantern-glow; moss-cushioned roots curl outward like little steps; the trunk fades upward into soft indigo dusk, a single owlet silhouette on a high branch."
"A ring of acorn-cap rest-markers circles a mossy clearing, each capped with a small glowing mushroom; a curled fallen log serves as a bench beside a snail-shell lantern; the forest floor dissolves into gentle silver mist in the distance."
"A spiral of bark-plank steps winds up the hollow trunk to a knot-hole window lit warm from within; twig-and-cobweb bunting drapes the doorway below; the surrounding woodland recedes into a soft harvest-moon haze."

━━━ HOLLOW-WORLD VIGNETTE VARIETY — rotate across ALL of these (never cluster on one) ━━━
1. Hollow tree-trunk interior with a bark doorway strung in cobweb lace
2. Hollow tree exterior with gnarled root-archways and a glowing knot-hole window
3. Acorn-cap "rest garden" clearing — cheerful moss-cushioned acorn-cap markers, each topped with a tiny glowing mushroom (whimsical fairy-tale motif, never a literal creepy graveyard)
4. A curled fallen log with a mushroom "porch" and a lantern-lined path to a hollow doorway
5. A root-cellar entrance beneath the tree, cobweb curtain over the door, stacked acorn-shell barrels
6. A mossy stump village square ringed with acorn-cap rest-markers and mushroom lampposts
7. A spiral staircase of bark-plank steps winding up the trunk to a lit hollow window
8. A cobweb-draped archway of two bent twigs framing the hollow's entrance
9. A twisted root-cave mouth strung with silvery cobweb lace and dangling mushroom lanterns
10. A tree-hollow bakery nook with a crooked chimney puffing pale smoke, cobwebs in the eaves
11. An owlet's hollow high in the bark, a vine rope-ladder, lanterns lining the climb
12. A fungus-ringed fairy circle beside the hollow, acorn-cap stools arranged for a gathering
13. A cracked acorn-shell mailbox beside the hollow's mossy doorway
14. A hollow-log bridge over a trickling creek, lanterns strung along the underside
15. A burrow entrance tucked between roots, cobweb netting over a round door, a pumpkin-seed welcome mat
16. A twilight gathering of acorn-cap lanterns lining a spiral path up to the hollow's door
17. A cobweb hammock strung between two low branches near the hollow
18. A tiny watchtower built into a broken branch-stub, lantern-lit, cobweb pennants fluttering
19. A moss-covered mushroom cluster shaped like a friendly little dome beside the hollow
20. A lantern-lit root-bridge crossing a shallow puddle-pond reflecting the harvest moon

━━━ MANDATORY IN EVERY ENTRY ━━━
- Warm jack-o'-lantern amber-orange glow present somewhere in the scene (from a mushroom lantern, a window, or similar)
- At least one specific cobweb detail (lace, garland, curtain, bunting) framed as pretty decoration
- Foreground / midground / far-distance depth layering (the 3-clause format enforces this)
- Miniature scale language implied by materials/props (matchbox, thumb-sized, thread-thin, bead-sized, sugar-cube, etc.)

🚫 STRICT BANS: NO humans or human silhouettes, NO witches/ghosts/skeletons/gore, NO genuine horror or scares, NO real skulls/bones, NO literal tombstones or "RIP" markers, NO IP-named locations, NO brand names, NO readable text, NO photographer/camera-brand names, NO negation phrasing ("not scary" etc — just write it playful and cozy).

Output ONLY a JSON array of ${n} strings, no preamble, no numbering, no markdown fences.`,
  });

  await generatePool({
    outPath: DIR + 'tiny_haunted_hollow_lanterns.json',
    total: 120,
    batch: 25,
    append: true,
    banHumanLanguage: true,
    metaPrompt: (
      n
    ) => `You are writing the MONEY-SHOT signature-lantern axis for TinyBot's miniature Halloween "tiny-haunted-hollow" path. Each entry describes ONE specific arrangement of glowing MUSHROOM-CAP LANTERNS — the single most important recurring visual signature of this path, the detail that must anchor and light every render. Write ${n} entries, ~15-30 words each.

━━━ THE BAR ━━━
Every entry must read as a concrete, paintable lighting fixture: describe the mushroom-cap shape/size, HOW it glows (translucent cap lit from within like a paper lampshade), WHERE it's placed (hanging, staked in moss, lining a path, clustered, stacked), and its light quality (warm amber/honeyed by default — an occasional pale-gold or blush-orange variant is fine).

━━━ VARIETY — rotate across arrangements, never repeat the same shape/placement twice in a row ━━━
- A single oversized toadstool lantern hanging from a bent-twig hook, swinging gently
- A row/procession of lanterns lining a path, doorway, or set of steps
- A cluster or "chandelier" of stacked lanterns of shrinking size
- Lanterns ringing a clearing like votive candles
- A lantern staked directly into moss or a root, glowing at ground level
- Twin lanterns flanking a doorway like sconces
- A lantern nestled inside a hollow or knot-hole, light spilling outward
- A lantern strung on a cobweb thread, dangling and turning slowly
- A cluster of small button-cap lanterns scattered like fallen embers
- One dramatically oversized "hero" lantern with several small satellite lanterns around it

Occasionally (~15% of entries) let one lantern in the cluster glow a cool ghostly teal or pale violet instead of amber, as a rare accent — amber must still read as the dominant, defining color overall across the pool.

🚫 STRICT BANS: NO humans, NO real flame/fire hazard framing, NO horror, NO IP names, NO brand names, NO readable text, NO photographer/camera-brand names, NO negation phrasing.

Output ONLY a JSON array of ${n} strings, no preamble, no numbering, no markdown fences.`,
  });

  await generatePool({
    outPath: DIR + 'tiny_haunted_hollow_critters.json',
    total: 120,
    batch: 25,
    append: true,
    banHumanLanguage: true,
    metaPrompt: (
      n
    ) => `You are writing the MANDATORY tiny critter cast for TinyBot's miniature "tiny-haunted-hollow" path. Each entry is ONE short sentence: a real small woodland animal caught mid a specific gentle-spooky/cozy Halloween-season activity. These critters are the hollow's ONLY inhabitants — never humans, never upright cartoon "creature-people," always proportioned like an actual small animal (button nose, whiskers, paws, quills, fur, shell, feathers). Write ${n} entries, ~12-22 words each.

━━━ SPECIES to rotate across (never cluster on one) ━━━
Field-mouse, hedgehog, vole, mole, toad, snail, beetle, owlet, chipmunk, shrew, dormouse.

━━━ ACTIVITIES to rotate across — gentle-spooky/cozy, never frightening ━━━
- Lighting or tending a mushroom-cap lantern with a glowing ember on a twig
- Napping curled inside half an acorn shell under a cobweb or leaf blanket
- Standing "guard" at the hollow's door wearing an upturned acorn-cap helmet
- Stringing a cobweb garland between two twigs
- Carving a tiny berry-sized jack-o'-lantern
- Sweeping the doorstep with a dried-seed-head broom
- Arranging acorn-cap rest-markers in the clearing
- Perched on a lantern-post, watching a moth flutter by
- Inching along a leaf-path leaving a faint silver trail that catches lantern-light
- Peeking out from a knot-hole window, whiskers lit amber
- Hanging a paper-thin leaf-bat charm above the door
- Curled with a jar of fireflies for a nightlight

━━━ FORMAT ━━━
"A [size/texture adjective] [species] with [2-3 specific non-human physical features] [specific activity][, optional small whimsical accessory/prop]." Give roughly HALF the entries a small optional accessory (acorn-cap hat, cobweb scarf, twig-broom, tiny lantern) and leave the other half accessory-free doing a bare action — never make the accessory mandatory on every entry.

🚫 STRICT BANS: NO age/gender human nouns (man/woman/boy/girl/elderly/etc — species descriptors ONLY), NO upright bipedal "creature-person" posing, NO humans, NO horror, NO IP names, NO readable text, NO negation phrasing.

Output ONLY a JSON array of ${n} strings, no preamble, no numbering, no markdown fences.`,
  });
})();
