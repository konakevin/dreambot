#!/usr/bin/env node
/**
 * COZY_ARCANE_MAGICAL_SIGNATURE — scale-up 25 → 200.
 *
 * Each entry is ONE specific AMBIENT MAGIC element — a single visible
 * magical effect happening in the sanctum that ANY render can drop in
 * (gated ~50% by template). 15-25 words. Third-person, present-tense,
 * naming the SHAPE + COLOR + BEHAVIOR of the magic.
 *
 * Voice: quiet, casual, "magic as routine office decor" — the
 * inhabitant isn't reacting because this is their everyday.
 */
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/dragonbot/seeds/cozy_arcane_magical_signature.json',
  total: 200,
  batch: 50,
  append: true,
  metaPrompt: (
    n
  ) => `You are writing ${n} MAGICAL-SIGNATURE descriptions for DragonBot's cozy-arcane path. Each entry is ONE specific ambient magical effect happening in the sanctum — described in 15-25 words, present-tense, the magic as routine sanctum decor.

━━━ THE SHAPE OF EVERY ENTRY ━━━

Each entry names a SPECIFIC magical element with:
1. SHAPE (rune / wisp-orb / sigil / chalk-circle / floating tome / self-writing quill / glowing tattoo / smoke-spirit / mote-drift)
2. COLOR (amber / pale-blue / violet / rose-pink / emerald / pale-gold / indigo / teal / silver / pearl-white)
3. BEHAVIOR (pulses / orbits / hovers / writes itself / spins lazily / drifts / floats / brightens / curls / dissolves)
4. WHERE (above the desk / near the bookshelf / on the hearthrug / above the candle / at shoulder-height / on the mantle / etc.)

━━━ VARIETY MANDATE — distribute the ${n} entries across these magical-effect families ━━━

- ~15% PULSING RUNES (single rune in air / on hearthstone / etched in wall / above the open tome — pulsing color cycles)
- ~12% WISP-ORBS / DRIFTING LIGHTS (single orb, cluster orbiting, slow ellipse, drifting motes, mote-clouds)
- ~10% SELF-MOVING OBJECTS (quill writing on its own / page turning / bookmark rising / herbs floating to a pouch / spoon stirring solo)
- ~10% SPELL-CIRCLES / CHALK-WORK (drawn on hearthrug / on floor / on desk surface / on door-frame — slowly spinning rings)
- ~10% AURA / INHABITANT'S-OWN-MAGIC (glowing tattoo on collarbone / forearm rune brightening / palm-glow / aura at shoulder-height)
- ~8% HOVERING SCRIPT / FROZEN MIDAIR TEXT (lines of notation hanging like frozen breath / glowing script at eye-height / magical text above the open page)
- ~8% SHAPED SMOKE / STEAM (incense smoke forming sigils / kettle-steam shaping a hare / cauldron vapor coiling into runes / pipe smoke writing a name)
- ~7% FAMILIAR-MAGIC (dragon-cat exhaling blue-flame thread / book-imp breathing rune-smoke / spirit-fox flickering in mirror / wisp-pet bobbing at the shoulder)
- ~7% FROZEN / SUSPENDED PHENOMENA (candle-flame paused mid-flicker / drop of liquid hanging mid-air / clock-hand still / spinning coin frozen at the apex)
- ~6% CRYSTAL / FOCUS-STONE GLOW (orb pulsing on tripod / focus-crystal at shoulder-height / magic-stone in iron cradle cycling colors / pearl orb fogging from within)
- ~6% RELIT / SELF-RELIGHTING FLAME (candles relighting after a draft / hearth-fire flaring at a thought / sigil-wick lighting itself / wall-torches brightening as the inhabitant enters)
- ~6% SCROLL / BOOK MAGIC (scroll unrolling on its own / runes reading along the edge / open tome's text rearranging / illustrated map figure walking across the page)
- ~5% MISC AMBIENT (binding-knot pulsing / floating ingredient over flask / suspended-blade balanced on rune / shadow behaving wrong on the wall / mirror showing a different room)

━━━ COLOR PALETTE TO MIRROR ━━━

GOOD colors (mirror these — specific, warm OR cool, paired with a noun):
  • "amber rune" / "pale-blue wisp-orbs" / "rose-pink chalk-circle"
  • "emerald-glowing script" / "violet glyphs" / "silver-outlined fox"
  • "pearl-white light" / "pale-gold motes" / "indigo magic-stone"
  • "copper-orange rune" / "teal glowing mark" / "periwinkle wisp"

AVOID: vague "soft glow", "magical light", "mysterious shimmer", "ethereal aura" — name the COLOR + NOUN.

━━━ BEHAVIOR VERBS TO MIRROR ━━━

GOOD verbs (active, slow, ambient):
  pulses, orbits, hovers, drifts, spins lazily, brightens, curls, dissolves, threads, coils, rotates slowly, hangs, suspended, frozen mid-flicker, settles, blooms, ripples, traces, brushes light across, scatters halos

AVOID: "explodes", "blasts", "shoots", "fires" — this is COZY arcane, not combat magic.

━━━ BANS ━━━

- NO ambiguous magic. NEVER "some magic happens" or "an aura pervades the room". NAME the shape + color + location.
- NO combat / weapon magic (no lightning bolts / no fireballs / no shielding spells against attackers). This is a SANCTUM at REST.
- NO cathedral-scale magic (no "filling the entire chamber" / no "vast columns of light"). INTIMATE scale only — chalk-rune on the hearthstone, orb above the desk, glow at the collarbone.
- NO viewer-facing language ("you can see" / "the viewer feels").
- NO modern technology language ("hologram" / "projection" / "screen"). Magical-fantasy vocabulary only.
- NO horror / gore (no "blood runes" / no "screaming faces in the mirror"). Even the spirit-fox in the mirror is QUIET.
- NO inhabitant's full body in the magical-signature description (the inhabitant goes in inhabitant_archetype + candid_moment). At most: "the inhabitant's collarbone" / "her forearm" / "his shoulder" as a SURFACE the magic touches.

━━━ MOOD ━━━

Quiet. Routine. The magic happens at the speed of breathing — orbits in slow ellipses, pulses on a slow heartbeat, drifts like dust motes. The inhabitant isn't reacting because this is their EVERYDAY workspace.

━━━ OUTPUT ━━━

JSON array of ${n} strings, 15-25 words each. No preamble. No numbering. Each is a single declarative sentence.`,
}).catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
