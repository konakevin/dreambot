#!/usr/bin/env node
/**
 * COZY_ARCANE_INHABITANT_ARCHETYPE — scale-up 25 → 200.
 *
 * Each entry is ONE inhabitant: who they are (archetype) + what they're
 * wearing (specific fabric/color/cut) + one signature carried/worn item
 * (staff / pendant / satchel / focus-stone). Voice: literary-fantasy
 * costume description, third-person, NO scene around them (the scene
 * is owned by setting/clutter/warmth axes).
 *
 * Mandate: VARY the archetype broadly across the magical-trades of a
 * high-fantasy world. The clutter_focus + magical_signature + familiar
 * axes will supply the room — this axis only supplies the person.
 */
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/dragonbot/seeds/cozy_arcane_inhabitant_archetype.json',
  total: 200,
  batch: 50,
  append: true,
  metaPrompt: (
    n
  ) => `You are writing ${n} INHABITANT-ARCHETYPE descriptions for DragonBot's cozy-arcane path. Each entry is ONE high-fantasy magical-trade inhabitant alone in their sanctum, described in 22-35 words — third-person, costume-and-signature-item focused, NO scene around them (scene is owned by other axes).

━━━ THE SHAPE OF EVERY ENTRY ━━━

[ARCHETYPE-NOUN] in [FABRIC + COLOR + CUT of garment(s)], [ONE specific signature item carried/worn or close at hand].

Three required ingredients in each entry:
1. ARCHETYPE — what they ARE (sorcerer / hedgewitch / dragon-lorekeeper / cartomancer / rune-master / apothecary / hermit-scholar / etc.)
2. GARMENT — fabric + color + cut (deep-crimson velvet mage-robes / wax-stained canvas apron over cream linen tunic / layered undyed-wool shawl-and-skirt)
3. SIGNATURE ITEM — one prop worn or carried (knotted ashwood staff capped with sapphire focus-stone / worn leather herb-pouch on a knotted cord belt / brass-framed reading glasses + bulging scroll-satchel)

━━━ VARIETY MANDATE — distribute the ${n} entries across these archetype families ━━━

- ~30% SPELL-CASTERS (arcane-mage, sorceress, sorcerer, evoker, conjurer, enchantress, warlock, witch-of-the-pines, weather-mage, fire-mage, frost-mage)
- ~15% ALCHEMIST / APOTHECARY / BREWMASTER / POTION-MASTER / TINCTURER
- ~10% HEDGEWITCH / CUNNING-FOLK / GREEN-WITCH / SWAMP-CRONE / FOREST-HERMIT
- ~10% DIVINER (cartomancer, astronomer, star-reader, scryer, oracle, dream-reader, palm-reader)
- ~10% RUNE-WORKER / ENCHANTER / SIGIL-SCRIBE / GLYPH-CARVER / WARD-MAKER
- ~10% SCHOLAR / LOREKEEPER / SAGE / HERMIT-SCHOLAR / MAP-ILLUMINATOR / SCRIPTSCHOLAR
- ~5% DRAGON-LORE specialists (dragon-keeper, dragon-lorekeeper, scale-curator, dragon-binder, drake-tamer, wyrm-scholar)
- ~5% BARDIC-ARCHIVIST / MUSIC-KEEPER / SONG-WEAVER / TALE-SPINNER
- ~5% MISC (diplomat-scribe, occultist, summoner, necromancer-scholar, blood-mage, mirror-mage, golem-shaper, beast-binder)

━━━ COSTUME LANGUAGE — what good looks like ━━━

GOOD garment phrasings (mirror these):
  • "deep-crimson velvet mage-robes edged with silver-thread sigils"
  • "wax-stained canvas apron over a cream linen tunic"
  • "layered undyed-wool shawl-and-skirt pinned with a sprig of dried lavender"
  • "long slate-grey wool scholar-coat buttoned to the throat"
  • "midnight-blue velvet bodice-robes fitted with a crystal-cluster harness"
  • "heavy charcoal-black robes trimmed with tarnished iron threading"
  • "richly patterned burgundy-and-gold shawl wrapped tight at the shoulders"
  • "deep-blue wool robes densely embroidered with silver constellations"
  • "linen-and-leather work-coat dyed pale sage-green"
  • "slate-and-rust patterned velvet overrobes lined with fox-fur trim"

GOOD signature-item phrasings:
  • "clutching a knotted ashwood staff capped with a pulsing sapphire focus-stone"
  • "copper mortar crusted with dried reagents resting beside ink-blackened fingertips"
  • "polished dragon-tooth pendant resting against their chest above an open hoard-ledger"
  • "brass-framed reading glasses perched on their nose and a bulging scroll-satchel at their hip"
  • "skull-tipped yew staff leaning close and bone-and-iron talismans rattling at the collar"
  • "worn tarot deck fanned across the reading-cloth before them, crystal pendant swinging"
  • "polished brass astrolabe suspended from their neck and a telescope-monocle clipped to one eye"
  • "rune-carved wax tablet wedged in the crook of one arm and a fine-tipped bone stylus in hand"
  • "beaded rowan-berry necklace worn close and a hare-bone pendulum held very still"

━━━ BANS ━━━

- NO scene language around them (no "in a candlelit study" / no "by the hearth" / no "amid stacks of books") — the SCENE belongs to clutter_focus, hearth_warmth_source, and settings axes. This axis is the PERSON only.
- NO famous-character names (no Gandalf / Merlin / Mickey Mouse / Harry Potter / Yennefer). Use ARCHETYPES.
- NO modern register (no "vibes" / no "casually" / no "nerdy" / no "geeky"). Maintain high-fantasy literary register.
- NO action verbs as the lead ("mid-pour" / "stirring" / "bent over") — those belong to candid_moment. This axis opens with "[Archetype] in [garment]..."
- NO age descriptors (no "young" / "old" / "elderly" / "ancient") — age is its own axis (inhabitant_age).
- NO race descriptors (no "elven" / "dwarven" / "human" / "halfling") — race is its own axis. Use trade-archetype only.
- NO horns / no demon-coding / no "dark lord" — these are SANCTUM inhabitants in a cozy ARCANE register, not villains.
- NO viewer-facing language ("staring at you" / "regarding the viewer") — they are unaware they're being observed.
- NO weapon-as-signature-item (no swords / no axes / no daggers as the primary signature) — these are MAGICAL trades. Staves / wands / focus-stones / pendants / satchels / instruments only.

━━━ MOOD ━━━

Quiet, lived-in, professional. These are working magicians at home in their craft, dressed in clothes that show YEARS of use (stained / patched / worn smooth / ink-darkened). Wealth varies — some richly embroidered, some plain linen — all unmistakably MAGICAL practitioners.

━━━ OUTPUT ━━━

JSON array of ${n} strings, 22-35 words each. No preamble. No numbering. Each starts with the archetype noun ("Arcane-mage..." / "Hedgewitch..." / "Cartomancer...") followed by "in [garment]," then the signature item clause.`,
}).catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
