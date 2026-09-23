#!/usr/bin/env node
/**
 * BloomBot alpine-wildflower-meadow path pools (2026-09-23).
 *
 * THE GAP: BloomBot has 24 live paths and every one is flowers. `flower-fields`
 * (cultivated geometry), `landscape` (wild carpet), `garden-walk` and
 * `flower-grove` already own "an open expanse of flowers with mountains behind
 * it". So this path may NOT be that. Its differentiator is ALTITUDE AS A
 * PHYSICAL FACT, present in the NEAR ground of every render:
 *   bare broken rock and loose scree breaking through the flowers (never a
 *   continuous lawn) · old snow lying IN the meadow with flowers at its melting
 *   edge · plants growing flat and tight to the ground because that is what
 *   wind and altitude do · a snowfield or glacier ABOVE the flower line and the
 *   tree line visibly ENDING below · thin hard high light with razor shadows and
 *   air you can see three ranges through · high-altitude animals (marmot, pika,
 *   ibex, ptarmigan) — never garden ones.
 *
 * SIX AXES (5 always-on + 1 gated):
 *   meadow_ground   HERO — the stage, flowers AND the rock/snow/water through it
 *   flower_cast     ★ named alpine species in their REAL prior colours + habit
 *   altitude_fact   ★ the one thing in frame that proves height
 *   mountain_light  ★ owns the palette; two named colours, one warm one cool
 *   high_life       (0.6 gate) ONE whole high-altitude animal, scale-welded
 *   charm           one clever detail the eye finds on second look
 *
 * THE LAYPERSON-WORD LAW (playbook lesson 28, the BrickBot "envelope" trap):
 * alpine botany's own correct terms are confident WRONG priors in Flux, so they
 * are banned here even though they are right. `cushion plant` renders a sofa
 * cushion; `rosette` renders a prize ribbon; `crown`, `eye`, `spur`, `cap`,
 * `runner`, `bract`, `sport` all collide with a commoner object; `alpenrose`
 * carries "rose"; `harebell` carries "hare"; `crowfoot` carries "crow"; `col`,
 * `tarn`, `moraine`, `neve`, `runnel` have no layperson prior at all. Growth
 * habit is therefore described with VERBS and plain shapes, never with the
 * botanical noun.
 *
 * Species are drawn from a fixed roster whose Flux PRIOR COLOUR already matches
 * the colour we want (BloomBot's flower×colour render-prior lesson: you cannot
 * recolour a named species with a word), so gentians stay blue and edelweiss
 * stays white.
 *
 * Run: node scripts/gen-seeds/bloombot/gen-alpine-meadow-pools.js
 *      (SEED_TOTAL=25 for the MVP — the default. Scale only after sign-off.)
 */
const { generatePool } = require('../../lib/seedGenHelper');

// ─── Shared law blocks, appended to every recipe ────────────────────────────

const LAYPERSON_LAW = `━━━ THE LAYPERSON-WORD LAW (this is the #1 rule — a correct botanical term can be a confidently WRONG picture) ━━━
For every word, ask what an ordinary person pictures. If that is a different object, the word is BANNED even though it is correct.
NEVER write any of these words: cushion, pincushion, mat, pad, rosette, crown, eye, spur, bract, runner, sport, cap, col, tarn, moraine, neve, runnel, scarp, crowfoot, monkshood, lady's slipper, elephant head, alpenrose, harebell, houseleek, sempervivum, sky pilot, king's crown, monkey flower, umbel, corymb, inflorescence, whorl, calyx, tomentose, glabrous.
INSTEAD describe growth habit with VERBS and plain shapes: "growing flat and tight against the ground", "pressed into a crack in the rock", "in dense low clumps no higher than the rock beside them", "in short stiff spikes a hand high", "hugging the ground out of the wind", "a dense round clump of tiny flowers spread flat over the stone".`;

const NO_TEXT_LAW = `━━━ NOTHING THAT IS SHAPED LIKE A SIGN ━━━
Never name any of: sign, signpost, waymark, trail marker, blaze, plaque, label, board, tag, cairn, stone pile, flag, banner, map, inscription, carving, marks, markings, lettering, writing, summit cross, cross. These render as gibberish text or as human structures. Describe only living plants, rock, snow, water, light and animals.`;

const NO_PEOPLE_LAW = `━━━ NO PEOPLE AND NOTHING BUILT — FILL THE GROUND INSTEAD ━━━
Never a person, hiker, climber, walker, figure, silhouette, backpack, rope, tent, boot or footprint. Never a trail, footpath, boardwalk, cut steps, bridge, fence, gate, wall, hut, cabin, shelter, bench, road, ladder, cable, cable car or ski lift. Do not say they are absent either — instead fill the ground positively: the space between the flowers is always bare broken rock, loose stone, old snow or running meltwater, right out to the edges of the picture, so there is nowhere a path could be.`;

const SCALE_LAW = `━━━ THE SCALE LAW ━━━
A low count is what makes a creature render giant — Flux gives each named subject a share of the frame. So insects are always stated as "a dozen or more" or "twenty or more", never one, two or three. Any size comparison must be welded to something big and fixed that is IN the picture — the old snow patch, the scree slope, the rock face, the flower clump it stands beside — never an off-camera ruler like a thumb, a fingernail or a coin, and never a free-floating object whose own size could inflate.
GRANT NO SUBJECT A DETAIL EXEMPTION. Never add a close anatomical clause for "the nearest one" — no "the nearest showing its banded fur / veined wings / amber eyes". The one you describe most is the one that comes out biggest.`;

const NO_CORRIDOR_LAW = `━━━ NO CORRIDOR, NO VANISHING POINT ━━━
Never write converging, convergence, vanishing point, leading to a single point, apex, meeting point, receding rows, or a line of anything running away into the distance. Ground features run ACROSS the picture from one side edge to the other, and their ends run out of frame.`;

const SPECIES_ROSTER = `━━━ THE SPECIES ROSTER — draw only from this list, and keep each one its own real colour ━━━
Flux renders a named flower in its own fixed colour and a colour word cannot override it, so use these pairings exactly:
trumpet gentian (deep blue-violet) · spring gentian (intense sky-blue) · alpine forget-me-not (sky blue with a small gold centre) · edelweiss (white and woolly, star-shaped) · dwarf rhododendron shrubs (small magenta-pink bell flowers) · moss campion, written as "dense round clumps of tiny hot-pink flowers spread flat on the stone" · alpine snowbell (nodding violet bells with fringed petals) · pasqueflower (furry purple bells, silver-haired stems) · alpine buttercup (round butter-yellow) · golden-yellow mountain daisies (arnica) · alpine sunflowers, short and thick-stemmed, every head facing the same way · Indian paintbrush (scarlet flame-shaped spikes) · alpine lupine (blue-violet spikes) · fireweed (tall magenta spikes) · starry saxifrage (small white flowers with red dots, wedged in rock cracks) · white mountain anemone (gold centre) · alpine aster (violet petals, gold centre) · alpine primula (deep magenta-pink with a yellow centre) · glacier buttercup (small yellow, right at the snow edge) · alpine bistort (white bottlebrush heads on wiry stems) · yellow mountain saxifrage (small yellow, orange-speckled) · purple saxifrage (bright magenta, flat over the rock) · alpine bellflower, written as "small nodding violet bell-shaped flowers" · white dryad flowers with gold centres · alpine toadflax (violet and cream).`;

const WHIMSY_BAR = `━━━ THE BAR — PLAYFUL, ADVENTUROUS, VIVID, BEAUTIFUL, CLEVER ━━━
A clean, correct, sober entry is a MISS, not a pass. Every entry must either show something nobody has been shown before or take the familiar and redress it as something more interesting. Ask of each one: is this the obvious version of this idea, or the surprising one? Ship the surprising one. Colour is LITERAL and committed — saturated, named, never muted or tasteful-grey. No entry may read as a tasteful postcard of a meadow with mountains behind it.`;

const POOLS = {
  // ── 1. meadow_ground — the HERO axis. Leads with its defining mass. ───────
  bloombot_alpine_meadow_ground: {
    metaPrompt: (
      n
    ) => `You are writing ${n} GROUND descriptions for BloomBot's "alpine-wildflower-meadow" path — a high wildflower meadow right at the snowline, thousands of feet above the last trees. This axis is the STAGE and the HERO of the picture: the near and middle ground, which is ALWAYS flowers AND the bare rock, loose stone, old snow and running meltwater breaking up through them.

THE ONE THING EVERY ENTRY MUST DO: open by naming the ground as a BROKEN MIX, never as a continuous lawn or a smooth carpet. About half of it is flowers; the other half is bare grey broken rock, loose sliding stone, a lying patch of old snow, or clear cold water running over stone — and both halves sit in the NEAR half of the picture, close to the camera. An unbroken sheet of flowers to the horizon is the one thing this path is not.

Each entry: 22-38 words. Name the shape of the ground (a tilted shelf, a bowl, a bench below a rock face, a step, a gully side, a shoulder, a hollow, a bank above water), then what is breaking through it, then how the flowers sit in what is left. Do NOT name flower species or colours (a separate axis supplies those). Do NOT describe the light (a separate axis owns it).

VARIETY MANDATE — ~25 DISTINCT grounds: a tilted shelf of grey slabs with flowers packed into every seam; a bowl floored with loose sliding stone and flowers only where the stone has settled; a bench of turf ending at a wall of bare rock; a gully side with a tongue of old snow down its middle and flowers up both edges; a shoulder scoured so bare that flowers grow only in the lee stripe behind each rock; a hollow where meltwater has spread out flat and bright over gravel; flat pavement-like rock split into a grid of deep cracks with flowers crammed in the cracks and nothing on the stone; a slope of broken plates of rock, flowers in the gaps, the plates clinking-loose; a green strip following a buried water seep in a single bright line across grey stone; a bank undercut by a stream showing the soil and root-mass in section; a boulder field with flowers filling the shaded gaps between house-sized blocks; a fan of fine grit spread out below a rock chute, the newest grit bare and the older grit flowering; a step of rock with a shallow pool held on top of it; ground still half under a melting snow sheet, wet dark soil showing at its edge; a rib of rock running ACROSS the picture from side edge to side edge with flowers banked on its sunny side. Vary the tilt, the rock type and how much snow is in it.

${NO_CORRIDOR_LAW}

${LAYPERSON_LAW}

${NO_PEOPLE_LAW}

${NO_TEXT_LAW}

${WHIMSY_BAR}

OUTPUT — JSON array of ${n} strings. No preamble, no numbering.`,
  },

  // ── 2. flower_cast — ★ the species, their real colours, their habit ───────
  bloombot_alpine_meadow_flower_cast: {
    metaPrompt: (
      n
    ) => `You are writing ${n} FLOWER-CAST descriptions for BloomBot's "alpine-wildflower-meadow" path — which actual alpine species are in flower, in their real colours, growing the way altitude makes them grow.

Each entry: 20-34 words. Name TWO or THREE species from the roster below, give each its real colour, and say HOW it grows here — flat and tight against the ground, pressed into a crack, in dense low clumps, in short stiff spikes a hand high, hugging the ground out of the wind. Then say where it is relative to the rock: banked against a slab, filling a seam, ringing a stone, crowded on the lee side. At altitude nothing is tall and nothing is loose: state that physically, through the way the plants sit.

${SPECIES_ROSTER}

VARIETY MANDATE — ~25 DISTINCT casts. Spread the roster widely: cold-blue combinations (gentian + forget-me-not + white edelweiss against grey stone), hot combinations (magenta rhododendron + scarlet paintbrush), single-species floods (one slope solid blue-violet gentian), rock-crack specialists (starry saxifrage and purple saxifrage flat over bare stone), snow-edge specialists (glacier buttercup and violet snowbells opening in the first inches of thaw), one-colour-against-grey pairings so saturated the colour reads almost unreal, and a few deliberately odd ones (short thick-stemmed alpine sunflowers all facing the same way; furry silver-stemmed pasqueflowers pushing up through last year's dead stems). Never the same pairing twice.

RULES — no species outside the roster; every species keeps its roster colour; no light, no weather, no animals (separate axes); never a tall garden flower, never a rose, never a tulip, never a hydrangea, never a tropical bloom.

${LAYPERSON_LAW}

${NO_PEOPLE_LAW}

${NO_TEXT_LAW}

${WHIMSY_BAR}

OUTPUT — JSON array of ${n} strings. No preamble, no numbering.`,
  },

  // ── 3. altitude_fact — ★ the one thing in frame that proves height ────────
  bloombot_alpine_meadow_altitude_fact: {
    metaPrompt: (
      n
    ) => `You are writing ${n} ALTITUDE-FACT descriptions for BloomBot's "alpine-wildflower-meadow" path. Each entry is the ONE visible thing in the picture that proves this meadow is thousands of feet up, at the edge of permanent snow. Without it the render is just a meadow with mountains behind it, which is exactly what this path must never be.

Each entry: 16-28 words. One specific, visible, physically real fact of height. It must be a THING IN THE PICTURE, not a mood or an adjective.

VARIETY MANDATE — ~25 DISTINCT facts, spread across these kinds:
SNOW STILL PRESENT — a lying patch of old grey-white snow in the middle of the meadow with flowers in bloom right along its melting edge; snow still filling every shaded gully while the sunlit slope is in full flower; a patch of old snow undercut into a blue hollow by the meltwater running away beneath it; a sheet of snow pulling back day by day with the first inches of green following it.
ICE ABOVE — a blue glacier tongue hanging above the flower line; a broad white snowfield filling the whole upper slope above the flowers; a bare rock peak standing straight out of the snowfield.
THE TREE LINE ENDING — the forest stopping in a ragged edge far below like a shoreline, the last few trees short and twisted and leaning all one way; a single stunted tree flagged by the wind, all its branches on one side, alone below the meadow.
AIR AND DISTANCE — three ranges visible one behind the other, each one paler than the last, all of them hard-edged in the thin air; the valley floor so far below it is hazed while the flowers underfoot are razor sharp.
CLOUD BEHAVING LIKE WATER — cloud pouring over a low saddle between two peaks and spilling down the slope into the meadow; the meadow standing in bright sun above a flat white sea of cloud filling the valley; a torn cloud dragging its shadow across the flowers.
WATER — clear cold meltwater braiding in silver threads down through the flowers; a small still lake holding the doubled peak, flowers growing right to the waterline.
ROCK — grey rock faces rising straight out of the flowers; the meadow stopping dead in a hard line where the bare rock begins; a long low ridge of rubble left behind by a glacier that is gone, flowers only on its sheltered side.

${NO_CORRIDOR_LAW}

${LAYPERSON_LAW}

${NO_PEOPLE_LAW}

${NO_TEXT_LAW}

${WHIMSY_BAR}

OUTPUT — JSON array of ${n} strings. No preamble, no numbering.`,
  },

  // ── 4. mountain_light — ★ owns the whole palette. Commit hard. ────────────
  bloombot_alpine_meadow_light: {
    metaPrompt: (
      n
    ) => `You are writing ${n} LIGHT descriptions for BloomBot's "alpine-wildflower-meadow" path. This axis owns the entire palette of the render, and high-altitude light is its own thing: thin, hard, unfiltered, with razor-edged shadows and a sky that darkens as it climbs.

Each entry: 16-28 words. COMMIT FULLY to one light condition. Name TWO colours explicitly, and in at least half the entries set one WARM colour against one COOL one — a single warm accent against all that cold is the whole trick. Always name the SURFACE the light lands on (the flowers, the wet stone, the snow, the rock face, the water) — light is a patch, a streak, a rim or a pool on a real thing, never a general glow.

VARIETY MANDATE — ~25 DISTINCT light conditions: hard thin midday sun with shadows cut razor-sharp on the stone and the sky a deep cobalt overhead; a black storm standing over the next ridge with the meadow itself blazing lit in front of it; alpenglow burning pink-orange on the high snow while the meadow below sits in deep blue shade; low sun raking straight across the slope so every clump of flowers throws a long shadow; a single break in the cloud dropping one bright patch of sun onto one part of the meadow while the rest is slate; backlight coming low through the petals so they glow like coloured glass with the rock behind them dark; cold clear early light with white frost still in the shade and full bloom two steps away in the sun; the sky shading from pale at the ridge to near-violet at the top of the frame; sun on wet stone after a shower, the rock almost black and mirror-bright; a rainbow standing against the retreating storm over the snowfield; the last gold light leaving the meadow and climbing the rock face above it; a cold blue dusk with one strip of the snowfield still catching the sun; light bouncing up off the snow patch and filling the shadows under the flowers; a sudden hailstorm's white stones lying bright among the colours.

RULES — this axis is LIGHT and COLOUR only. Never describe rock shapes, flower species, animals or the ground plan (separate axes own those). Never muted, washed-out, hazy-grey or tasteful — the colour is saturated and committed.

${NO_PEOPLE_LAW}

${NO_TEXT_LAW}

${WHIMSY_BAR}

OUTPUT — JSON array of ${n} strings. No preamble, no numbering.`,
  },

  // ── 5. high_life — 0.6 gate. ONE whole animal, scale-welded, no exemption. ─
  bloombot_alpine_meadow_high_life: {
    metaPrompt: (
      n
    ) => `You are writing ${n} ANIMAL descriptions for BloomBot's "alpine-wildflower-meadow" path — a 60%-gated axis putting ONE creature of the high mountains into the meadow. These are animals that actually live above the trees, never garden or farm animals.

Each entry: 14-26 words. ONE whole recognisable animal, head and body both visible, small in the frame and never centred. Its size must be pinned by something big and fixed that is already in the picture.

THE ALLOWED CAST: marmot · pika · ibex · chamois · bighorn sheep · mountain goat · ptarmigan half-white in moult · alpine crow, glossy black with a bright yellow beak · snow vole · ermine in its brown summer coat · small butterflies (always a dozen or more) · bumblebees (always a dozen or more) · a golden eagle, tiny and high · a mountain hare in patchy summer coat.

VARIETY MANDATE — ~25 DISTINCT beats, and favour the ones with a story in them: a marmot standing bolt upright on a rock at the edge of the old snow patch, surveying, small against the snow; a pika trotting over the stones with a whole mouthful of flower stems sticking out sideways like a bouquet; two marmots flat out asleep on the same warm slab; an ibex traversing the loose stone above the flower line, small against the rock face; a line of bighorn sheep picking along a ledge high on the rock face; a ptarmigan standing dead still among the flowers, half its winter white still showing; twenty or more small butterflies working one clump of flowers with old snow lying a few steps away; a dozen bumblebees over the low flowers, low and heavy in the cold air; an alpine crow with a bright yellow beak standing on a slab at the edge of the meadow; an ermine sitting up out of a gap between two rocks; a mountain goat standing on a slab no wider than itself, small against the snowfield above; a marmot mid-run through the flowers with its tail straight out behind it; a golden eagle tiny against the snowfield with its shadow crossing the meadow; a mountain hare pressed flat in the lee of a rock.

${SCALE_LAW}

RULES — one animal (or one stated mass of insects) per entry; always a real recognisable species from the cast; the meadow stays the hero and the animal stays small; never a bird of paradise, never a garden songbird, never a hummingbird, never a cat, dog, cow, sheepdog or horse; never a fantasy creature.

${LAYPERSON_LAW}

${NO_PEOPLE_LAW}

${NO_TEXT_LAW}

${WHIMSY_BAR}

OUTPUT — JSON array of ${n} strings. No preamble, no numbering.`,
  },

  // ── 6. charm — one clever detail the eye finds on second look ─────────────
  bloombot_alpine_meadow_charm: {
    metaPrompt: (
      n
    ) => `You are writing ${n} CHARM DETAILS for BloomBot's "alpine-wildflower-meadow" path. Each is ONE small clever detail that makes it THAT meadow and no other — the thing a viewer finds on second look and smiles at. This axis is where the delight lives.

Each entry: 12-24 words. One detail only, small, physically true, and visible in the picture. It must be a thing, not a feeling.

VARIETY MANDATE — ~25 DISTINCT charms, all of them the surprising version rather than the obvious one: the first inches of green following the retreating snow edge in a bright band, so the meadow's whole growing season is visible at once as a stripe; one clump of flowers in full bloom in a crack in a rock face too narrow and steep to stand on; a ring of flowers crowded around one boulder that holds the day's heat, and none at all a stride away; frost still white on the flowers inside a rock's shadow while the same species blooms wide open two steps out in the sun; a flower stem still bent in the curve of the snow that only just left it; meltwater running clear straight over the stems of the flowers it feeds; an old snow patch gone hollow underneath, glowing blue from inside where the water runs out; a single clump of flowers growing out of a crack in a boulder balanced high on three smaller stones; one flower head turned the wrong way while every other head on the slope faces the sun; a bright green strip of flowers tracing an underground seep in a clean line across grey stone; last summer's dry seed heads standing among this summer's open flowers; a scatter of white hailstones lying unmelted in the shade of the flower clumps; one flower clump grown into a flattened dish by something that keeps sitting on it; a stone worn smooth and polished in one small patch where the wind funnels; a pale-flowered clump among thousands of the same species in colour, the one that came up wrong; petals shivering in the same direction across the whole slope while the flowers themselves do not move; a small bright pool held in a hollow in the rock with petals floating on it; a flower growing in the print a hoof pressed into wet grit.

━━━ NO LIVING CREATURES IN THIS AXIS (axis-clean) ━━━
A separate axis owns the animal, so a charm here is never a creature. Never name a beetle, spider, bee, butterfly, moth, ant, bird or any animal — a creature in this axis doubles the animal in one render and a swarm of insects is off-register for this bot. Never a bone, a skull or anything dead. A charm is rock, snow, water, light or a plant behaving surprisingly.

${LAYPERSON_LAW}

${NO_PEOPLE_LAW}

${NO_TEXT_LAW}

OUTPUT — JSON array of ${n} strings. No preamble, no numbering.`,
  },
};

(async () => {
  const total = parseInt(process.env.SEED_TOTAL || '25', 10);
  const only = process.env.SEED_POOL || null;
  for (const [key, cfg] of Object.entries(POOLS)) {
    if (only && key !== only) continue;
    await generatePool({
      outPath: `scripts/bots/bloombot/seeds/${key}.json`,
      total,
      batch: 25,
      metaPrompt: cfg.metaPrompt,
    });
  }
})().catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
