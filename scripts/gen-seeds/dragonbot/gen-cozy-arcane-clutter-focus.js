#!/usr/bin/env node
/**
 * COZY_ARCANE_CLUTTER_FOCUS — scale-up 25 → 200.
 *
 * Each entry is ONE specific MAGICAL PROP in the sanctum, hero-shot as
 * if the camera focused on it for a beat. 28-40 words. Third-person,
 * descriptive, NOT scene-spanning. The path pulls pickN:3 of these per
 * render to build a layered cluttered foreground.
 *
 * Voice: lived-in, weighted with detail — material + color + state of
 * use + one specific quirk (eye sockets packed with lavender / left
 * page blazing with crimson script / needle spinning rather than
 * settling). The QUIRK is what makes each prop memorable.
 */
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/dragonbot/seeds/cozy_arcane_clutter_focus.json',
  total: 200,
  batch: 50,
  append: true,
  metaPrompt: (
    n
  ) => `You are writing ${n} CLUTTER-FOCUS descriptions for DragonBot's cozy-arcane path. Each entry is ONE specific magical prop in a wizard's sanctum, described in 28-40 words as if the camera held on it for a beat. Voice: literary-fantasy, lived-in, materially specific.

━━━ THE SHAPE OF EVERY ENTRY ━━━

"A [adjective] [PROP-NOUN] [where it sits], [material/color/state-of-use detail], [ONE specific quirk that makes it memorable]."

Three required ingredients in each entry:
1. THE PROP — what it is (alembic / grimoire / orb / tome / staff / chest / map / instrument / specimen)
2. PHYSICAL DETAIL — material, color, state of use (tarnished brass / aged rosewood / crusted with dried herbs / worn pale and smooth)
3. THE QUIRK — one strange specific detail (needle spinning rather than settling / left page blazing with crimson script / labeled DO NOT OPEN INDOORS / spinning slowly rather than settling)

━━━ VARIETY MANDATE — distribute the ${n} entries across these prop families ━━━

- ~15% ALCHEMY APPARATUS (alembic, retort, distilling coil, mortar-and-pestle, copper still-head, glass condenser, herb-press, oil-extractor, fermentation jar)
- ~12% TOMES & GRIMOIRES (open grimoire on stand, leather-bound codex, scroll-cases, illuminated manuscript page, bound vellum sheaves, palimpsest, reading-glass case)
- ~10% APOTHECARY GLASSWARE (vial racks, stoppered amber bottles, specimen jars, glowing liquid flasks, sealed wax-stamped vessels, dropper-bottles)
- ~10% DIVINATION TOOLS (crystal orb on tripod, scrying bowl, tarot deck, brass astrolabe, sextant, celestial chart, brass orrery, palmistry diagram)
- ~10% DRAGON ARTIFACTS (dragon skull, dragon-egg in cradle, dragon-scale display, dragon-tooth letter-opener, hoard-ledger, scale-curator's case, drake-claw paperweight)
- ~8% MAPS & PARCHMENT (rolled celestial chart, wall-pinned territory map, cracked terrestrial globe, faded star-chart, hand-drawn cave system, treasure map fragment)
- ~8% FURNITURE & UPHOLSTERY (wing-back armchair worn pale, carved reading stand, roll-top desk tambour-open, low oak table, leather footstool, rune-carved oak chest)
- ~8% INSTRUMENTS & TOOLS (silver-tipped quills + dried-ink pots, iron-and-wood chisel set, rune-carving knife, herb-binding twine, mortar pestle, brass calipers, magnifying lens)
- ~8% TAXIDERMY & SPECIMENS (taxidermied owl, mounted dragon-eye in jar, preserved scaled claw, beetle-pinned wall display, pickled mandrake jar, fossilized rune-stone)
- ~6% LIGHT & FIRE OBJECTS (wrought-iron candelabra with cascading wax, brass oil-lantern with blue flame, hanging chandelier, brazier with herb-steam — light objects that are PROPS not the room's main warmth source)
- ~5% MISC RUNE / SIGIL OBJECTS (rune-carved chest, sigil-burned door-jamb wedge, charm-stones in pewter dish, binding-knot rope coil, warded lockbox)

━━━ THE QUIRK — what makes entries memorable ━━━

Every entry needs ONE specific quirk that elevates it from "a description of an object" to "a STORY in one prop." Mirror these:
  • "its eye sockets packed with dried lavender and a single brass candle-stub flickering inside"
  • "its left page blazing with self-illuminating crimson script, the right page blank but visibly scorched at the margins"
  • "its needle spinning slowly rather than settling, enchanted and perpetually restless"
  • "labeled in red ink: DO NOT OPEN INDOORS"
  • "one continent crossed out in red ink, a handwritten correction inked beside it"
  • "three glowing faintly amber, one sealed with black wax stamped with a dragon sigil"
  • "its interior pulsing with slow amber light in a rhythm that subtly matches the room's candle-flicker"
  • "from which spills a fold of heavy crimson cloth and the glint of something golden inside"
  • "twenty years of cascading wax built into pale sculptural ridges along the central column"
  • "the last recorded move circled twice"
  • "its arc engraved with constellation names, a single dried ink-mark on the index arm"
  • "identifiable as a tiny scaled claw no larger than a thumb, label unreadable"

━━━ BANS ━━━

- NO inhabitant in the description (no "the wizard's hand resting on..." / no "as she reads"). The PERSON belongs to inhabitant_archetype and candid_moment. This axis is the PROP only.
- NO viewer-facing language ("you can see" / "the viewer notices"). Just describe.
- NO scene-spanning prose ("across the entire workshop" / "throughout the room"). ONE prop in ONE position.
- NO modern register (no "vintage" / "antique" / "aesthetic" / "vibes"). High-fantasy lived-in register.
- NO famous-IP names (no Hogwarts / no Gandalf / no Lord of the Rings / no D&D-specific trademarks).
- NO weapons (no swords / no daggers / no battle-axes). These are SANCTUM clutter — books, glassware, instruments, NOT armory. Staff is fine (it's the inhabitant's signature; here only as a leaning prop).
- NO horror-coding (no severed heads / no bloodied bones / no Cenobite imagery). DARK-MOODY-OCCULT is fine (skulls, bone talismans, raven feathers) — gore is not.
- NO duplicates of existing pool entries (helper auto-dedups but mind the touchpoints).

━━━ MOOD ━━━

Materially specific. Aged. Used daily. The kind of prop a wizard would reach for without looking because they know exactly where it is. Every prop has a STORY — a notation in the margin, a label in red ink, a single scorch-mark, a continent crossed out. NEVER pristine. NEVER ornamental-only.

━━━ OUTPUT ━━━

JSON array of ${n} strings, 28-40 words each. No preamble. No numbering. Each starts with "A [adjective] [prop]..." or "An [adjective] [prop]...".`,
}).catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
