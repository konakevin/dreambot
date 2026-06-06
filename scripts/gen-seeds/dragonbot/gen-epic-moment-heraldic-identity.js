#!/usr/bin/env node
/**
 * EPIC_MOMENT_HERALDIC_IDENTITY — production scale-up 2026-06-05.
 *
 * Gated 50% accent axis for DragonBot's epic-moment path. Names visible
 * banners / flags / sigils / livery painted onto the castle's walls,
 * battlements, gate-arches, spire-tips — the heraldic markings that
 * declare the castle's allegiance / dynasty / mood (mourning, coronation,
 * conquest, alliance).
 *
 * Append mode preserves the initial 25 hand-curated entries.
 */
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/dragonbot/seeds/epic_moment_heraldic_identity.json',
  total: 200,
  batch: 50,
  append: true,
  metaPrompt: (
    n
  ) => `You are writing ${n} HERALDIC-IDENTITY descriptions for DragonBot's epic-moment path. Each entry names VISIBLE heraldic markings — banners, flags, pennants, painted-sigil walls, mounted-shield reliefs, sculpted-emblem statuary — that declare the castle's allegiance / dynasty / current ceremonial mood.

Each entry: 22-35 words. Each describes ONE specific heraldic element (one sigil-type + one color-scheme + one specific castle-location-where-mounted).

━━━ THE BAR ━━━
The render must show CLEARLY READABLE heraldic markings as part of the castle's silhouette. The viewer should be able to tell which house holds this castle, OR what ceremonial event is happening (coronation / mourning / alliance / siege / festival / surrender). NO generic "banners flying" — every entry names a SPECIFIC sigil, a SPECIFIC color scheme, and a SPECIFIC location on the castle's architecture.

━━━ STRUCTURE — every entry includes ━━━
1. A COLOR SCHEME (sable-on-ivory / gold-on-crimson / silver-on-emerald / pearl-and-sable / amber-on-black / pale-gold-on-deep-green / charcoal-grey / black-and-bone / teal-and-copper / rust-red-and-bone-white). Use heraldic color language (gules, azure, vert OK, but plain modern color works too).
2. A SPECIFIC SIGIL (wolf-rampant / griffin-passant / crowned chalice / tree-of-ages / sword-upright / crowned-eagle / chalice-and-flame / coiled-serpent / open-winged griffin / skeletal-hand / bear-passant / twin-sword-crossed / dragon-claw / stag-rampant / moon-and-star / inverted-crown / open-book / hammer-and-anvil / phoenix-rising / horse-and-banner / star-burst / lion-head / eight-pointed-star / boar-charging / kraken-tentacle / falcon-stooping / golden-fleece / black-rose / silver-axe / weeping-willow / leviathan-tail / direwolf-howling).
3. A SPECIFIC LOCATION — gatehouse corbel / battlement merlon / main gate arch / keep eastern face / spire-tip / tower base / curtain wall / barbican / portcullis frame / great hall door / inner courtyard / wall-walk / parapet / spire-tips / window bracket / cornerstone / keystone / gable-end / drawbridge platform / outer ward.

━━━ VARIETY MANDATE — distribute across these heraldic modes ━━━

DYNASTIC IDENTITY (~12 entries):
- Hanging banners from gatehouse / spire / wall-walk
- Painted shield-reliefs above the main gate
- Sculpted heraldic statuary flanking entrances
- Sigil-emblazoned curtain-wall livery in vertical stripes
- House-color enamel panels set into masonry
- Carved-stone heraldic-beast cornerstone embellishments
- Gilded sigil burned in pigment across great-hall doors

CEREMONIAL / OCCASIONAL (~7 entries):
- Mourning black bunting with wolf-claw embroidery
- Coronation laurels of hammered-copper ivy
- Festival garlands of gilded iron leaves
- Wedding-week pearl-and-ivory livery
- Triumph-procession trophy-banners
- Saints'-day prayer-pennants
- Investiture cloth-of-gold draping

CONQUEST / DEFEAT (~5 entries):
- Captured enemy banners hung inverted from the barbican
- Burned-edge banners of a defeated house pinned to the gate
- Newly painted conquerer's sigil over a chiseled-away predecessor
- Hostage-house pennant flying below the conqueror's
- Surrender-white banners hung from the tallest spire

ALLIANCE / NEGOTIATION (~5 entries):
- Rival faction's pennant flying alongside the castle's own
- Three allied factions' banners crowding the barbican spires
- Marriage-alliance combined-sigil quartered banner
- Trade-treaty merchant-guild pennant
- Diplomatic-summit flags of multiple houses

EXOTIC / MAGICAL (~3 entries):
- Enchanted self-fluttering banners with sigils that glow at dusk
- Levitating heraldic-orbs hanging in the air above the gate
- Living-banners woven from glowing-thread that shifts color
- Ghost-banners that fade in and out of visibility in the wind

━━━ EXAMPLES — match this register ━━━

- "Sable-on-ivory wolf-rampant banners hanging from every gatehouse corbel, the wolf's snarling maw stitched in silver thread catching torchlight."
- "Triangular gold-on-crimson pennants lining every battlement merlon, each bearing a crowned chalice sigil repeated forty times across the curtain wall."
- "Long scarlet pennants bearing a white sword-upright sigil snapping from all twelve spire-tips, sword-edges glinting with sewn metallic thread."
- "Captured enemy banners hung inverted from the barbican's outer face, their once-proud black-dragon-on-white now deliberately reversed in defeat."

━━━ STRICT RULES ━━━
- Western high-fantasy heraldry register only — LOTR / GoT / D&D / Warcraft / Witcher. NO real-world national flags. NO modern-corporate logos.
- Every entry names a SPECIFIC SIGIL — not "a banner" but "a wolf-rampant banner" / "a crowned-chalice pennant" / "a coiled-serpent shield".
- Every entry names a SPECIFIC LOCATION on the castle — never abstract "around the castle". The heraldry has a place.
- Every entry names a SPECIFIC COLOR SCHEME — never generic "colorful banners".
- Vary the SIGIL across entries — no repetition. Vary the LOCATION. Vary the COLOR PAIR.
- NO portrait. NO character description. ONLY the heraldic marking and its mounting.

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering, one entry per string.`,
}).catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
