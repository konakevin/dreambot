#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/sirenbot/seeds/seductive_moments.json',
  total: 50,
  batch: 10,
  metaPrompt: (n) => `You are writing ${n} SEDUCTIVE MOMENT descriptions for a dangerous high-fantasy WOMAN — she in a sizzling, provocative fantasy scene. Siren energy — beautiful, mysterious, dangerous. Fantasy-art mythic aesthetic, like mythic fine-art oil painting. SOLO.

Each entry: 20-40 words describing her in a charged pose/moment in an exotic fantasy setting.

━━━ VIBE ━━━
Like a Magic: the Gathering card-art of a seductive sorceress, a pre-Raphaelite painting of a dangerous nymph, a Frank Frazetta barbarian-queen cover — stunning, sensual, mythic, never pornographic. Rated R at most.

━━━ CATEGORIES TO MIX ━━━
- Bathing (in glowing pools, moonlit springs, hot spring with petals) — solo, no second figure
- Reclining (on silk/fur draped settings, throne, altar, pool-edge) — alone
- Emerging (from water, forest, mist, shadow)
- Adorning (mid-braiding hair, clasping necklace, fixing armor on)
- Dancing / mid-ritual (in a private temple, in a moonlit grove)
- Gazing (from balcony, across a ruined hall, into a scrying pool)
- At a threshold (doorway to magical realm, mirror portal, ornate archway)
- Fire-adjacent (beside ritual flame, hearth, braazier)

━━━ SOLO — NON-NEGOTIABLE ━━━
She is the ONLY figure in the frame. No one to seduce visible — the viewer IS the intended target but is not rendered.

━━━ COVERAGE ━━━
- Scantily clad is fine (fantasy bikini armor, translucent robes, leather-and-lace, chainmail-over-silk)
- No nipples, no bare breasts, no exposed genitals
- Mythic art aesthetic — suggestive, not explicit

━━━ BANNED ━━━
- Race naming (separate axis)
- "posing for camera" / "modeling" / "editorial"
- Second figures in frame
- Pornographic content

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
  maxTokens: 4000,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
