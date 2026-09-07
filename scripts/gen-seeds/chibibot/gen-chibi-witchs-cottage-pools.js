#!/usr/bin/env node
// AlphaBot — chibi-witchs-cottage (Halloween candidate for ChibiBot, MVP-25
// QA). A friendly chibi WITCH CRITTER's cute-spooky cottage in a moody dusk
// forest: bubbling glowing cauldron (money shot), glowing ingredient jars,
// optional black-cat companion, warm amber window-light vs the dark woods.
// PLAYFUL Halloween register only — never genuine horror/gore.
//
// 4 generated pools (25 each): cottage / witch / cauldron / jars.
// (black-cat poses, dusk-forest moods, and the surprise-detail list are short
// fixed lists — inlined directly in the path file, no pool needed.)
const { generatePool } = require('../../lib/seedGenHelper');

const DIR = 'scripts/bots/chibibot/seeds/';

(async () => {
  // ── cottage (the hero setting) ──────────────────────────────────────────
  await generatePool({
    outPath: DIR + 'chibi_witchs_cottage_cottage.json',
    total: 120,
    batch: 25,
    append: true,
    banHumanLanguage: true,
    metaPrompt: (
      n
    ) => `Write ${n} WITCH'S-COTTAGE architecture descriptions for a cute-spooky Halloween chibi bot. Each is ONE small, whimsical cottage — a friendly chibi witch-critter's home — nestled at the edge of a moody dusk forest. The COTTAGE is the hero setting. Each entry 20-32 words, a specific architecture + one specific charming detail.

━━━ COTTAGE SHAPES (spread across all ${n} — vary architecture, roof, material, silhouette) ━━━
- a mushroom-cap thatched roof over a round stone cottage
- a cottage built from a gnarled hollow tree trunk, knothole windows glowing
- a crooked leaning stone cottage with round porthole windows
- a spiral-shingled tower cottage, slightly lopsided
- a cottage wrapped in thick moss and climbing ivy, one crooked chimney
- a cottage built into a cluster of giant toadstools
- a cottage with a wraparound porch strung with drying herb bundles
- a cottage with round stained-glass windows glowing warm amber
- a cottage perched on gnarled root-legs like it might walk away
- a cottage with a weathervane shaped like a bat and a lopsided picket fence
- a cottage with window-boxes of glowing night-blooming flowers
- a cottage half-buried in drifted autumn leaves, door hanging slightly ajar
- a cottage with a bundle of spare broomsticks leaning by the round door
- a cottage at the end of a pumpkin-lined garden path
- a cottage with a crooked brick chimney puffing soft lavender smoke
- a cottage tucked beneath one enormous ancient oak, roots forming an archway
- a cottage with a tiny arched stone bridge over a trickling creek
- a cottage roofed in overlapping dried leaves like shingles

━━━ HARD RULES ━━━
- The cottage always has at least one WARM AMBER GLOWING WINDOW spilling honeyed light — the signature contrast against the cooling dusk forest around it.
- Cute-spooky, PLAYFUL register — friendly, storybook, never genuinely scary or decayed/rotting.
- NO humans, NO human-shaped silhouettes, NO real-world place names, NO brand/IP names.

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
  });

  // ── witch critter (the chibi witch, always a creature — never a human) ──
  await generatePool({
    outPath: DIR + 'chibi_witchs_cottage_witch.json',
    total: 120,
    batch: 25,
    append: true,
    banHumanLanguage: true,
    metaPrompt: (
      n
    ) => `Write ${n} CHIBI WITCH-CRITTER descriptions for a cute-spooky Halloween chibi bot. Each names a small round ANIMAL/CREATURE SPECIES wearing witch-costume pieces (pointed hat, patched robe/cape) and doing one small witchy activity. Each entry 20-32 words.

━━━ NON-NEGOTIABLE RULE — CREATURE, NEVER HUMAN ━━━
Every entry MUST open by naming the animal/creature species (owl, cat, toad, fox, hedgehog, bat, mouse, raccoon, crow, rabbit, squirrel, frog, possum, badger, ferret, etc.) plus 2-3 unmistakable non-human physical features (feathers, muzzle, paws, whiskers, big round animal eyes, fur, a tail). The witch hat/robe/cape are COSTUME PIECES worn over the creature's body — never describe a human, girl, woman, boy, man, or person; never age the character. If it could be mistaken for a person in a costume, rewrite it.

━━━ EXAMPLE ENTRIES (match this exact register) ━━━
- A round fluffy owl with big amber eyes and soft feather-tufts, tiny pointed witch hat perched between her ear-tufts, stirring a cauldron with one wing.
- A tubby black-cat-eared kitten-critter with a fluffy tail and round paws, wrapped in a patchwork witch cape, sprinkling sparkling powder from a tiny pouch.
- A plump warty toad-critter with big round eyes and webbed paws, a crooked witch hat slipping over one eye, perched on a stool reading a spellbook.

━━━ MORE ACTIVITIES TO SPREAD ACROSS ALL ${n} (vary species AND activity) ━━━
measuring glowing herbs on a tiny scale; floating just above the ground on a tiny broom; hanging upside-down from a rafter with a wand in paw; stacking glowing jars on a shelf with a tail; peering into the cauldron through a tiny magnifying glass; perched on the chimney with a cape fluttering; kneading pumpkin-bread dough by the window; levitating a jar with a twinkle of a wand; blowing a shimmering bubble-spell; sorting potion bottles by size; grinding herbs with a tiny mortar and pestle; weaving a glowing charm out of threads; dusting cobwebs with a feather duster; labeling jars with a quill; tasting a potion off a wooden spoon.

━━━ RULES ━━━
Cute-spooky, PLAYFUL, friendly — never menacing. NO real-world ethnic/national labels. NO brand/IP names. NO readable text.

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
  });

  // ── cauldron — THE MONEY SHOT (always present, must anchor every render) ─
  await generatePool({
    outPath: DIR + 'chibi_witchs_cottage_cauldron.json',
    total: 120,
    batch: 25,
    append: true,
    banHumanLanguage: true,
    metaPrompt: (
      n
    ) => `Write ${n} BUBBLING CAULDRON descriptions for a cute-spooky Halloween chibi bot — the SIGNATURE money-shot detail of a friendly witch-critter's cottage. Each is ONE cauldron mid-bubble with a specific glowing potion color + a specific bubble/steam effect. Each entry 15-28 words.

━━━ EXAMPLE ENTRIES (match this exact register) ━━━
- A squat black iron cauldron bubbling with glowing violet potion, tiny star-shaped bubbles popping and drifting upward like fireflies.
- A cauldron overflowing with swirling emerald potion, soft glowing steam curling into little ghost-shaped wisps above the rim.
- A cauldron brimming with warm golden potion that occasionally overflows down its sides in slow glowing rivulets, pooling like honey.

━━━ POTION COLORS + EFFECTS TO SPREAD ACROSS ALL ${n} ━━━
violet potion with star-shaped bubbles; emerald potion with ghost-shaped steam wisps; amber potion with rising firefly-sparks; bubblegum-pink potion popping heart-shaped bubbles; deep blue potion with spiraling glowing motes; golden potion overflowing like honey; rainbow-swirl potion with bubbles that pop into sparkles; candy-corn-orange potion lighting the whole room; teal potion with softly glowing mushroom-shaped bubbles; magenta potion crackling with tiny lightning-bug flickers; silver-white potion glowing like captured moonlight; deep purple potion with slow rising smoke-rings shaped like bats; lime-green potion fizzing with tiny star-sparks; rose-gold potion with a lazy swirl and drifting petals of light.

━━━ HARD RULES ━━━
- The cauldron is ALWAYS bubbling/glowing — this is the non-negotiable centerpiece detail, present in every entry.
- Cute-spooky, PLAYFUL, warm and inviting glow — never a toxic/gross/gory read.
- NO humans, NO brand/IP names, NO readable text.

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
  });

  // ── glowing ingredient jars ──────────────────────────────────────────────
  await generatePool({
    outPath: DIR + 'chibi_witchs_cottage_jars.json',
    total: 120,
    batch: 25,
    append: true,
    banHumanLanguage: true,
    metaPrompt: (
      n
    ) => `Write ${n} GLOWING INGREDIENT JAR descriptions for a cute-spooky Halloween chibi bot — jars of magical ingredients lining a witch-critter's windowsill or shelf. Each is ONE jar (or small cluster of jars) with a specific glowing contents. Each entry 15-26 words.

━━━ EXAMPLE ENTRIES (match this exact register) ━━━
- A row of glass jars glowing softly with captured fireflies, blinking gently on the windowsill against the darkening woods.
- A jar of swirling violet potion glowing like a tiny captured nebula, catching the cauldron-light beside it.
- A jar of star-shaped candies that glow faintly amber, stacked beside jars of ordinary buttons and ribbon.

━━━ CONTENTS TO SPREAD ACROSS ALL ${n} ━━━
captured fireflies blinking softly; bottled moonlight glowing pale silver; glowing golden honey; candy-corn-colored gumdrops that glow faintly; tiny glowing mushroom caps stacked like marbles; giggling bubble-potion with pastel light escaping the lid; star-shaped candies glowing amber; shimmering dust that swirls like a snow globe; glowing magenta berries; a swirl of tiny captured lightning-bugs; softly glowing pumpkin seeds; a jar of rainbow potion droplets; jarred stardust that drifts lazily; glowing spiced cider; a cluster of tiny glass vials each a different glow-color.

━━━ HARD RULES ━━━
- Playful, candy-magic, whimsical — like a cottage pantry, never a gross/gory apothecary-of-body-parts read.
- The jars ALWAYS glow softly — a light source in the scene.
- NO humans, NO brand/IP names, NO readable text/labels.

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
  });

  console.log('\n✅ All chibi-witchs-cottage pools generated.\n');
})().catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
