#!/usr/bin/env node
// AlphaBot candidate — pixel-graveyard-night (destination: PixelBot).
// A 16-bit pixel-art game-screenshot of a moonlit Halloween graveyard LEVEL:
// rows of tombstones receding into drifting ground fog, at least one raven
// perched on a bare branch, and a huge dramatic moon (the money shot)
// dominating a cool purple-blue night sky. Four MVP-25 pools: the graveyard
// layout/terrain, the moon treatment, the drifting fog, and the raven(s) on
// bare branches. Modeled on scripts/gen-seeds/alphabot/gen-pixel-witchs-cottage-pool.js.
const { generatePool } = require('../../lib/seedGenHelper');

(async () => {
  // ── Axis 1: the graveyard layout/terrain (rows of tombstones + composition) ──
  await generatePool({
    outPath: 'scripts/bots/pixelbot/seeds/pixel_graveyard_night_layout.json',
    total: 120,
    batch: 25,
    append: true,
    banHumanLanguage: true,
    metaPrompt: (
      n
    ) => `Write ${n} GRAVEYARD-LAYOUT entries for a 16-bit pixel-art game-screenshot scene. Each describes ONE distinct cemetery layout: the terrain/paths PLUS multiple tombstones arranged across it (rows, clusters, or a plot) — never a single isolated stone. Each entry 20-32 words.

━━━ TONE ━━━
Atmospheric and cozy-spooky, a level-establishing shot you'd walk into exploring a game world — never bleak, decayed, or genuinely scary.

━━━ VARY THE LAYOUT ACROSS ALL ${n} (spread across these, don't repeat the same one twice) ━━━
- Rows of leaning tombstones climbing a gentle hillside terrace
- A wrought-iron-gated cemetery entrance with a straight central path
- A mausoleum-lined avenue with tombstones flanking both sides
- Tombstones circling a single massive dead oak at the plot's center
- A small fenced family plot with a tight cluster of close-set stones
- Tombstones descending a set of worn stone steps into a lower yard
- A crumbling low stone wall enclosing a tightly packed plot of stones
- Tombstones scattered unevenly across a rolling grassy knoll
- A cemetery split by a narrow gravel path lined with lantern posts
- Tombstones ringing a dry, cracked stone fountain at the plot's center
- A walled cemetery corner with tombstones stacked in tiered rows up a slope
- Tombstones clustered beneath a row of skeletal, leafless trees
- A cemetery terrace overlooking a distant church silhouette below
- Tombstones arranged in a fan pattern radiating from a central crypt
- A sunken graveyard hollow ringed by a low earthen embankment
- Tombstones lining both sides of a long covered lychgate archway
- A hillside cemetery with a switchback path climbing between plots
- Tombstones huddled around the base of a broken stone obelisk
- A cemetery courtyard bordered by a crumbling cloister wall
- Tombstones set in neat rows inside a rusted wrought-iron fence enclosure
- A plateau graveyard with a sheer drop-off at its far edge
- Tombstones scattered among the roots of a grove of bare birches
- A cemetery bisected by a shallow, slow-moving dark stream

━━━ EACH ENTRY MUST INCLUDE ━━━
1. The terrain/layout feature (from or inspired by the list above)
2. Clear evidence of MULTIPLE tombstones (rows / cluster / plot) — never just one stone alone

━━━ RULES ━━━
NO humans, no undead figures, no zombies, no anything rising or clawing out of the ground. NO readable text or epitaphs. Cozy-spooky and atmospheric only — never "decayed," "rotting," or genuinely frightening framing.

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
  });

  // ── Axis 2 (MONEY SHOT): the huge dramatic moon ──
  await generatePool({
    outPath: 'scripts/bots/pixelbot/seeds/pixel_graveyard_night_moon.json',
    total: 120,
    batch: 25,
    append: true,
    banHumanLanguage: true,
    metaPrompt: (
      n
    ) => `Write ${n} MOON entries for a 16-bit pixel-art Halloween graveyard scene — THIS IS THE MONEY SHOT of the whole scene: describe HOW a huge, dramatic, OVERSIZED moon dominates the night sky above the graveyard. Each entry 20-35 words. Always specify its dramatic size/prominence plus a color or lighting effect.

━━━ VARY THE TREATMENT ACROSS ALL ${n} (spread across distinct moon moods, don't repeat the same one twice) ━━━
- A massive deep-orange moon low on the horizon, tombstone silhouettes stark against it
- An oversized pale-silver moon high overhead, ringed by a faint hazy halo
- A huge moon half-veiled by a thin drifting band of cloud
- A colossal moon with visible chunky pixel craters, dominating a third of the sky
- A low golden moon rising directly behind a single bare, leafless tree
- A huge moon tinted pale violet, casting long cool shadows across the stones
- A giant moon partially shadowed at one edge, glowing deep amber where it's lit
- An enormous moon ringed by a thin double halo of soft light
- A massive moon behind thin wispy fog, its edges softened into a glow
- A huge full moon with a faint crescent-shaped cloud drifting across its face
- An oversized moon casting a pale silver path of light across the fog below
- A giant pale moon with a subtle blue-green tint, deepening the night's chill
- A huge moon low and swollen near the horizon, amber fading up into deep purple sky
- A massive moon partly framed by the silhouette of a crooked bare branch
- An enormous moon with a faint scatter of stars just beside it
- A huge cratered moon glowing cool white, throwing sharp long shadows from every stone
- A colossal moon rising between two distant hills, deep orange at its base
- A giant moon veiled by a single long ribbon of cloud drifting slowly across it
- A huge, unusually bright moon making the drifting fog glow faintly silver from within
- An oversized moon low in the sky, a loose scatter of small bats crossing its face
- A massive full moon faintly reflected in a still puddle among the stones
- A giant moon behind a lattice of bare branches, fragmenting its light into shards
- A huge pale moon low on the horizon, its glow rimming every headstone in silver

━━━ EACH ENTRY MUST INCLUDE ━━━
1. Explicit oversized/dramatic scale language (massive, colossal, huge, giant, enormous, oversized)
2. A specific color or lighting effect (amber, violet, silver, cool white, halo, craters, cloud veil, etc.)

━━━ RULES ━━━
NO humans. NO readable text. Cool purple-blue-to-amber night palette; the moon is a stylized DRAMATIC sky presence, never a small realistic dot. Avoid "blood" as a color word — use amber/deep-orange instead. Charming cozy-spooky register, never bleak or genuinely frightening.

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
  });

  // ── Axis 3: drifting ground fog ──
  await generatePool({
    outPath: 'scripts/bots/pixelbot/seeds/pixel_graveyard_night_fog.json',
    total: 120,
    batch: 25,
    append: true,
    banHumanLanguage: true,
    metaPrompt: (
      n
    ) => `Write ${n} FOG entries for a 16-bit pixel-art Halloween graveyard scene — the drifting ground fog winding through the tombstones (the graveyard layout and the moon are supplied separately). Each entry 18-30 words.

━━━ VARY ACROSS ALL ${n} (spread across distinct fog behaviors, don't repeat the same one twice) ━━━
- Low ground fog pooling ankle-deep between the tombstone rows
- Thin fog wisps curling slowly around the base of a leaning cross
- A solid fog bank rolling in from the distant tree line
- Moonlit mist pooling in a shallow hollow near the plot's center
- Fog threading through the bars of a rusted wrought-iron fence
- Ribbons of fog drifting sideways in a slow, unbroken current
- Fog clinging low to the ground, swallowing the bottom third of every stone
- A thin veil of mist rising off the grass like slow steam
- Fog pooling thickest around a single crooked headstone, thinning elsewhere
- Drifting fog catching the moonlight in faint silver streaks
- Fog curling up around a weathered stone angel's folded wings
- A shallow fog layer rippling gently as if stirred by a breeze
- Fog pooling in the low spots between rows, stones rising above it like islands
- Thin patchy fog drifting unevenly, thicker near the ground, wisping upward
- Fog rolling slowly downhill from the graveyard's highest terrace
- A soft fog bank glowing faintly where moonlight passes through it
- Fog drifting through a lychgate archway and spilling into the plot
- Fog pooling around the base of a dead, leafless tree
- Wisps of fog curling upward past a tilted, moss-covered slab
- Thick fog blanketing the far rows while nearer stones stay clearly visible
- Fog drifting past in slow horizontal bands like layered gauze
- A faint fog halo surrounding the graveyard's lantern posts
- Low fog swirling gently in the wake of a passing night breeze

━━━ RULES ━━━
NO humans. NO readable text. Pure weather/atmosphere only — never implies a hidden figure, hand, or shape emerging from within the fog. Cozy-spooky, never genuinely frightening.

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
  });

  // ── Axis 4: raven(s) on bare branches (core identity beat) ──
  await generatePool({
    outPath: 'scripts/bots/pixelbot/seeds/pixel_graveyard_night_ravens.json',
    total: 120,
    batch: 25,
    append: true,
    banHumanLanguage: true,
    metaPrompt: (
      n
    ) => `Write ${n} RAVEN entries for a 16-bit pixel-art Halloween graveyard scene — one or more ravens perched on a bare, leafless branch (a core identity beat of this scene, always present). Each entry 16-26 words and must include the bare branch/tree detail. Start EACH entry directly with the raven (e.g. "A single raven..." / "Two ravens...") — do NOT restate "16-bit pixel-art" or "Halloween graveyard" in the entry itself, that framing is supplied elsewhere.

━━━ FORMAT (match this exactly — no self-referential medium/scene restatement) ━━━
"A single raven perched mid-caw on a cracked leafless branch, beak wide open, wings folded tight against the night air"
"Two ravens side by side on a low bare branch, feathers ruffled against the chill, silhouetted sharply against the pale moon"

━━━ VARY ACROSS ALL ${n} (spread across distinct raven poses/groupings, don't repeat the same one twice) ━━━
- A single raven perched mid-caw on a cracked, leafless branch
- Two ravens perched side by side on a low bare branch, feathers ruffled
- A raven with wings half-spread mid-launch from a gnarled branch tip
- A raven silhouetted sharply against the moon from a high bare branch
- Three ravens spaced along one long skeletal branch, all facing the same direction
- A raven preening its wing while perched on a bent, leafless branch overhead
- A raven perched atop a crooked, dead tree's highest fork
- A pair of ravens facing each other on a low forked bare branch
- A raven mid-hop between two close bare branches
- A lone raven perched on a branch jutting from a hollow, dead trunk
- A raven with its head cocked curiously, perched on a thin swaying branch
- A small cluster of ravens lifting off together from one bare branch in unison
- A raven perched low, just above eye level, on a leaning dead branch
- A raven perched on the topmost twig of a stark, leafless tree
- A raven settling onto a branch, wings still spread from landing
- A raven perched on a thick broken branch stub jutting from a bare trunk
- A pair of ravens huddled close together on a branch, feathers puffed against the cold
- A raven perched on a branch that arcs directly over a row of headstones
- A raven mid-call, beak open, perched on a high gnarled bare branch
- A raven perched motionless on a branch silhouetted against the drifting fog below
- A raven shifting its grip on a thin, swaying bare branch
- A raven perched on a branch beside a torn, long-abandoned nest
- A raven perched on a low branch, one eye catching a glint of moonlight

━━━ RULES ━━━
NO humans. NO readable text. Always at least one raven ON a visibly bare/leafless branch. The raven is atmospheric wildlife — never attacking, never menacing, just a still or gently-moving night bird. Cozy-spooky, never genuinely frightening.

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
  });
})().catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
