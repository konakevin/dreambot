#!/usr/bin/env node
// AlphaBot — pixel-trickortreat-street candidate path (prototyped for
// eventual promotion to PixelBot, per BOT_SCENE_QUALITY_PLAYBOOK.md /
// ALPHABOT.md). A 16-bit pixel-art Halloween trick-or-treat street: decorated
// houses with jack-o-lanterns, small trick-or-treater silhouettes, warm
// porch lights against a purple-orange dusk sky.
//
// Scaled to production depth (target 120, grow-to-N via append:true — keeps
// the tested MVP-25 entries, adds more with the same recipe), five generated
// pools (see scripts/bots/alphabot/paths/pixel-trickortreat-street.js for
// the full axis design):
//   - scene    : the street/block architecture type (SCENE axis)
//   - porch    : the MONEY-SHOT hero jack-o-lantern porch/doorway display
//   - treater  : small sprite-scale trick-or-treater silhouette moments
//   - sky      : the purple-to-orange dusk/night sky + phenomena
//   - detail   : secondary yard/street decor away from the hero porch
//
// PixelBot casts human NPCs freely (see its own npc_life pool — "market
// vendor", "children chasing ball", etc.) so these pools do NOT use
// banHumanLanguage — that gate is for non-human-cast bots only.
//
// Run: node scripts/gen-seeds/alphabot/gen-pixel-trickortreat-street-pool.js
const { generatePool } = require('../../lib/seedGenHelper');

const DIR = 'scripts/bots/pixelbot/seeds/';

(async () => {
  await generatePool({
    outPath: DIR + 'pixel_trickortreat_street_scene.json',
    total: 120,
    batch: 25,
    append: true,
    metaPrompt: (
      n
    ) => `You are a pixel-art game-art director writing the STREET/BLOCK axis for PixelBot's Halloween trick-or-treat-street path — 16-bit SNES-era pixel art game screenshots (Chrono Trigger / Secret of Mana / Earthbound / Link to the Past register). Each entry is ONE specific residential street or block, dressed for Halloween, that will host a hero jack-o-lantern porch (described separately — don't invent one here, just set the block). Write ${n} entries.

━━━ FORMAT (mirror exactly) ━━━
"CATEGORY LABEL — description", ~30-50 words, comma-separated phrases, one entry per line of the JSON array.

Example entries (this exact format/length, adapt the CONTENT, never reuse verbatim):
"CRAFTSMAN BUNGALOW ROW — a curving suburban street of single-story craftsman bungalows with deep front porches and low-pitched roofs, picket fences lining trimmed lawns, jack-o-lanterns glowing on every porch step, string lights looping along eaves, sidewalk cracks catching pixel-dither shadow."
"VICTORIAN CORNER BLOCK — a corner block of tall narrow Victorian houses with gabled turrets and wraparound porches, wrought-iron fences, gas-lamp-style streetlights just switching on, carved pumpkins lined along stone stoops, a corner mailbox wrapped in cobweb bunting."
"FARMHOUSE COUNTRY LANE — a gravel lane leading past one weathered farmhouse and a leaning barn, a split-rail fence strung with dried cornstalks, a hand-painted pumpkin-stand sign at the gate, wide open dusk sky pressing low over the fields beyond."

━━━ STREET/BLOCK VARIETY — rotate across ALL of these, never cluster on one ━━━
1. Craftsman bungalow row with deep front porches
2. Victorian corner block with gabled turrets
3. Colonial two-story street with symmetric shutters
4. Farmhouse country lane with a barn in view
5. Brownstone stoop row (urban rowhouse block)
6. Split-level suburban cul-de-sac curve
7. Ranch-house block with wide flat lawns
8. Cottage lane with low picket fences
9. Small-town main-street block dressed for the holiday, shopfronts included
10. Apartment courtyard with a shared communal yard
11. Hillside stair-street with houses stacked up a slope
12. Lakeside cottage row facing a dark tree line
13. Cape-Cod shingle-style street near the coast
14. Tudor-revival block with steep gables and half-timbering
15. Trailer-park lane with string-light-draped awnings
16. Small-town square with a gazebo and shops around it
17. Adobe/southwestern single-story block with flat roofs
18. New-England green with a white chapel visible down the block
19. Row of townhouses with shared stoops and iron railings
20. Wooded cul-de-sac where the last house backs onto dark trees

━━━ MANDATORY IN EVERY ENTRY ━━━
- Exactly one architecture/neighborhood TYPE, named as the CATEGORY LABEL
- At least one Halloween decoration visible somewhere on the block (this is the SETTING, not the hero porch — keep it light, the hero porch is a separate axis)
- A sense of depth (foreground street/sidewalk, midground houses, background receding block)
- Evening/dusk light implied (porch lights just starting to glow, streetlights switching on)

🚫 STRICT BANS: NO genuine horror/gore/blood/real skulls, NO menacing imagery, NO IP-named locations or franchises, NO brand names, NO readable text/signage, NO photographer/camera-brand names, NO negation phrasing ("not scary" etc — just write it playful and warm).

Output ONLY a JSON array of ${n} strings, no preamble, no numbering, no markdown fences.`,
  });

  await generatePool({
    outPath: DIR + 'pixel_trickortreat_street_porch.json',
    total: 120,
    batch: 25,
    append: true,
    metaPrompt: (
      n
    ) => `You are writing the MONEY-SHOT "hero porch" axis for PixelBot's Halloween trick-or-treat-street path — the single most eye-catching jack-o-lantern display in the frame, the detail that makes the shot iconic. Each entry describes ONE specific decorated porch or doorway, warmly lit, as a 16-bit pixel-art game-screenshot centerpiece. Write ${n} entries, ~25-45 words each.

━━━ FORMAT (mirror exactly) ━━━
"CATEGORY LABEL — description", comma-separated phrases.

Example entries (this exact format/length, adapt the CONTENT, never reuse verbatim):
"PUMPKIN-STAIR CASCADE — a cascade of carved jack-o-lanterns lining every porch step from largest at the bottom to smallest at the top, each grinning face lit from within with warm orange candle-glow, the open front door spilling golden light behind them."
"GIANT SINGLE PUMPKIN — one enormous hand-carved pumpkin dominating the porch railing, an elaborate grinning face lit from inside, smaller unlit pumpkins scattered around its base like children, a welcome mat glowing faintly in its light."
"LUMINARIA-LINED WALKWAY — a row of paper-bag luminaries flickering along the front walk leading up to a wreathed door, a single carved pumpkin on the top step, porch-light glow pooling warm against the cool dusk."

━━━ HERO-PORCH VARIETY — rotate across ALL of these, never cluster on one ━━━
1. Pumpkin-stair cascade (largest to smallest up the steps)
2. One giant single carved pumpkin as the centerpiece
3. A pumpkin family lineup (small to large, side by side)
4. Paper-bag luminaria-lined front walk
5. A tiered pumpkin pyramid stacked on a table
6. Hay-bale-and-pumpkin display flanking the door
7. Cornstalk-flanked doorway with a pumpkin on the mat
8. A jack-o-lantern chandelier or hanging lantern-chain over the porch eave
9. A small pumpkin patch spilling onto the porch from the lawn
10. A pumpkin stack topped with a witch hat
11. Window-sill row of small glowing pumpkins along the porch front
12. A porch swing flanked by two large carved pumpkins
13. A pumpkin-lined picket-fence gate leading up the walk
14. A spiral pumpkin-lined path curling up to the door
15. A porch railing wrapped in orange lights with pumpkins along its base
16. A double-door entry each side lit by its own carved pumpkin
17. A wheelbarrow of pumpkins parked beside the front steps
18. A porch table set up for a candy bowl, ringed by small pumpkins

━━━ MANDATORY IN EVERY ENTRY ━━━
- Warm jack-o-lantern amber-orange glow as the dominant light source
- At least one carved pumpkin with a FRIENDLY grinning face (never a scary or menacing carving)
- A clear sense this is THE focal point of the shot (porch, doorway, or front steps)

🚫 STRICT BANS: NO genuine horror/gore/blood/real skulls, NO menacing or scary carved faces, NO IP-named characters, NO brand names, NO readable text/signage, NO photographer/camera-brand names, NO negation phrasing.

Output ONLY a JSON array of ${n} strings, no preamble, no numbering, no markdown fences.`,
  });

  await generatePool({
    outPath: DIR + 'pixel_trickortreat_street_treater.json',
    total: 120,
    batch: 25,
    append: true,
    metaPrompt: (
      n
    ) => `You are writing the trick-or-treater axis for PixelBot's Halloween trick-or-treat-street path. Each entry is ONE small sprite-scale silhouette (or duo) of trick-or-treaters, mid-action, on the sidewalk or street — genre-correct pixel-RPG NPC framing (like PixelBot's cozy-rpg-town NPCs), never a close-up portrait, always distant/small and part of the scene's life rather than its sole subject. Write ${n} entries, ~20-35 words each.

━━━ FORMAT (mirror exactly) ━━━
"CATEGORY LABEL — description", comma-separated phrases.

Example entries (this exact format/length, adapt the CONTENT, never reuse verbatim):
"COSTUME SPRINT — a small ghost-sheet-costumed silhouette dashing between two porches, a plastic pumpkin bucket swinging from one arm, cape/sheet fluttering mid-stride."
"PORCH-STEP REACH — a witch-hat-silhouetted trick-or-treater climbing a porch step, reaching up toward a glowing candy bowl, a second smaller silhouette waiting at the bottom of the steps."
"WAGON PULL — a small dinosaur-costumed silhouette pulling a wagon loaded with a single carved pumpkin down the sidewalk, wagon wheels mid-turn."

━━━ ACTION/COSTUME VARIETY — rotate across ALL of these, never cluster on one ━━━
1. Sprinting or dashing between two porches, sprite-scale
2. Climbing porch steps reaching toward a candy bowl
3. A duo racing each other toward the next lit porch
4. Pulling a small wagon loaded with a pumpkin
5. Looking back over a shoulder mid-stride, cape or sheet trailing
6. Skipping down the sidewalk swinging a candy bucket
7. Standing at a curb, silhouette pointing toward the next house
8. A small robot-costumed silhouette walking stiff-armed
9. A witch-hat silhouette carrying a broom prop
10. A dinosaur or animal-costumed silhouette on all fours briefly
11. Two silhouettes comparing candy hauls under a streetlamp
12. A cape-and-mask silhouette leaping off the bottom porch step
13. A ghost-sheet silhouette with one arm raised knocking on a door
14. A small group of three crossing the street together, mid-stride
15. A superhero-caped silhouette striking a pose on a lawn
16. A pirate-hat silhouette dragging a treat bag along the ground

━━━ MANDATORY IN EVERY ENTRY ━━━
- SMALL, sprite-scale, silhouette-forward framing (never a detailed close-up face)
- A clear costume element (hat, cape, sheet, mask, animal ears — kept generic, never an IP character)
- Mid-action, never a static standing pose

🚫 STRICT BANS: NO genuine horror/gore/scary expressions, NO IP-named costumes (no branded superheroes), NO brand names, NO readable text, NO photographer/camera-brand names, NO negation phrasing, NO close-up detailed human faces (keep them small and silhouette-forward).

Output ONLY a JSON array of ${n} strings, no preamble, no numbering, no markdown fences.`,
  });

  await generatePool({
    outPath: DIR + 'pixel_trickortreat_street_sky.json',
    total: 120,
    batch: 25,
    append: true,
    metaPrompt: (
      n
    ) => `You are writing the dusk-to-night SKY axis for PixelBot's Halloween trick-or-treat-street path. Each entry describes ONE specific purple-to-orange dusk/night sky treatment plus a small atmospheric phenomenon, rendered as 16-bit pixel-art dithered gradient bands (never a smooth gradient). Write ${n} entries, ~20-35 words each.

━━━ FORMAT (mirror exactly) ━━━
"CATEGORY LABEL — description", comma-separated phrases.

Example entries (this exact format/length, adapt the CONTENT, never reuse verbatim):
"HARVEST MOON RISING — a huge dithered harvest-moon disc hanging low over the rooftops, deep purple zenith fading to a burnt-orange horizon band, a few pixel-bat silhouettes crossing in front of the moon."
"STARLIT DEEPENING — indigo overhead deepening from a warm orange horizon strip, the first hand-placed pixel stars appearing near the top of frame, a thin streak of cloud catching the last orange light."
"STREETLAMP HALO MIX — warm amber streetlamp halos glowing up into a purple-orange dusk band, chimney smoke curling up into the gradient from a distant rooftop, the color banding sharply dithered."

━━━ SKY/PHENOMENON VARIETY — rotate across ALL of these, never cluster on one ━━━
1. A huge harvest moon low over the rooftops
2. A few small bat silhouettes crossing the sky
3. Deepening indigo zenith with the first stars appearing
4. Thin cloud streaks catching the last orange light
5. Streetlamp halos glowing up into the gradient
6. A thread of chimney smoke rising into the color band
7. Migrating crow-silhouettes in a loose line
8. A distant water tower or church-spire silhouette against the horizon band
9. A faint orange glow along the rooftop line like a sunset ember
10. Wispy high clouds dyed orange-pink at the horizon
11. A single bright planet or star pinprick near the horizon
12. Silhouetted bare tree branches reaching into the gradient
13. A soft violet haze softening the transition between bands
14. A hawk or owl silhouette gliding low across the frame
15. The moon partly veiled by a thin drifting cloud

━━━ MANDATORY IN EVERY ENTRY ━━━
- A clear purple-to-orange (or purple-to-amber) dusk/night gradient, described as DITHERED bands, never smooth
- At least one specific sky phenomenon or silhouette detail (not just "a nice sky")
- Warmth concentrated low near the horizon/rooftops, cooling toward the top of frame

🚫 STRICT BANS: NO genuine horror/gore imagery, NO IP-named locations, NO brand names, NO readable text, NO photographer/camera-brand names, NO negation phrasing, NO smooth/photoreal gradient language.

Output ONLY a JSON array of ${n} strings, no preamble, no numbering, no markdown fences.`,
  });

  await generatePool({
    outPath: DIR + 'pixel_trickortreat_street_detail.json',
    total: 120,
    batch: 25,
    append: true,
    metaPrompt: (
      n
    ) => `You are writing the secondary STREET DETAIL axis for PixelBot's Halloween trick-or-treat-street path. Each entry is ONE small decor or prop detail found somewhere ELSE on the block — the yard, the curb, the sidewalk, a fence — away from the hero porch (which is a separate, already-described axis). These add texture without competing with the hero porch for attention. Write ${n} entries, ~15-30 words each.

━━━ FORMAT (mirror exactly) ━━━
"CATEGORY LABEL — description", comma-separated phrases.

Example entries (this exact format/length, adapt the CONTENT, never reuse verbatim):
"CORNSTALK MAILBOX — a cluster of dried cornstalks tied to a curbside mailbox post, a small pumpkin resting at its base."
"INFLATABLE LAWN GHOST — a friendly round-eyed inflatable ghost bobbing gently on a neighboring lawn, string lights looped along the fence behind it."
"LEAF-SWIRL GUTTER — a scatter of fallen leaves swirling near a storm drain at the curb, caught mid-motion in the pixel-dither wind."

━━━ DETAIL VARIETY — rotate across ALL of these, never cluster on one ━━━
1. Cornstalk bundle tied to a mailbox or fence post
2. A hay bale with a small pumpkin on a neighboring lawn
3. A wheelbarrow of pumpkins parked at the curb
4. A friendly round-eyed inflatable ghost or pumpkin on a lawn
5. A picket fence draped loosely in cobweb strands
6. String lights looped between two trees or porch posts
7. A black-cat silhouette perched on a fence post
8. Fallen leaves swirling near a storm drain or gutter
9. A bicycle leaned against a porch rail, a candy bucket on the handlebars
10. A decorated mailbox with a small spider or web motif
11. A cheerful cardboard "tombstone" prop leaning in a yard (friendly, cartoonish, never gory)
12. A row of small pumpkins topping a low fence line
13. A wagon full of pumpkins parked on the curb
14. A porch-rail garland of dried leaves and small gourds
15. A scarecrow leaning against a lamp post
16. A candy-corn-striped ribbon wound around a tree trunk
17. A small chalk hopscotch grid on the sidewalk, faintly visible

━━━ MANDATORY IN EVERY ENTRY ━━━
- Exactly ONE specific detail object/prop, clearly placed away from the hero porch
- Warm, playful register — nothing menacing or gory

🚫 STRICT BANS: NO genuine horror/gore/blood/real skulls or bones, NO IP-named props, NO brand names, NO readable text, NO photographer/camera-brand names, NO negation phrasing.

Output ONLY a JSON array of ${n} strings, no preamble, no numbering, no markdown fences.`,
  });
})().catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
