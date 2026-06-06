#!/usr/bin/env node
/**
 * LANDSCAPE_AESTHETIC_REGISTER — production scale-up to 200.
 *
 * Each entry names a SPECIFIC fantasy-landscape PAINTER LINEAGE with:
 *   - Painter name (real fantasy/SF illustrator) + style descriptor
 *   - Concrete palette anchor (specific colors)
 *   - Painted surface / brushwork / medium quality
 *   - Mood / atmospheric register
 *
 * Anchors the WHOLE render in a painter tradition — sets palette + surface
 * texture + chromatic register simultaneously. Strict Western high-fantasy
 * lineage (LOTR / GoT / Elden Ring / D&D / Conan / sword-and-sorcery).
 */
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/dragonbot/seeds/landscape_aesthetic_register.json',
  total: 200,
  batch: 50,
  append: true,
  metaPrompt: (
    n
  ) => `You are writing ${n} AESTHETIC-REGISTER entries for DragonBot's landscape path — each entry names ONE fantasy-illustration PAINTER LINEAGE that will anchor the entire painted look of a high-fantasy landscape render. Each entry is one sentence, 25-40 words.

━━━ EVERY ENTRY MUST CONTAIN ALL FOUR ELEMENTS ━━━

1. PAINTER NAME + STYLE DESCRIPTOR — a real fantasy / SF / sword-and-sorcery illustrator, with their tradition tagged (e.g. "Frank Frazetta sword-and-sorcery oil" / "Alan Lee Tolkien atmospheric-watercolor" / "Bob Eggleton dragon-landscape painted")
2. CONCRETE PALETTE — name SPECIFIC chromatic anchors ("ember-and-shadow palette" / "muted earth-green and grey-gold washes" / "warm amber-sienna" / "jewel-saturated sapphire and magenta")
3. PAINTED SURFACE QUALITY — name the brushwork / medium / surface ("dynamic painted brushwork" / "layered impasto passages" / "translucent watercolor washes" / "hyper-rendered painterly depth" / "loose gestural painted passages")
4. MOOD / REGISTER — what register does the painter bring ("weathered chiaroscuro mood" / "warm storybook-painted register" / "Gothic painterly register" / "epic-scale serious illustrative craft" / "quiet luminous atmosphere")

━━━ VARIETY MANDATE (distribute roughly across these traditions) ━━━

- 6 TOLKIEN-LINEAGE PAINTERS (Alan Lee / John Howe / Ted Nasmith / Hildebrandt Brothers / Tim Kirk / Roger Garland / Inger Edelfeldt / Cor Blok / Donato Giancola Tolkien work)
- 5 D&D / TSR / PAPERBACK FANTASY (Larry Elmore / Keith Parkinson / Jeff Easley / Clyde Caldwell / Wayne Reynolds / Erol Otus / Jim Roslof / Brian Snõddy)
- 6 SWORD-AND-SORCERY / CONAN LINEAGE (Frank Frazetta / Boris Vallejo / Julie Bell / Ken Kelly / Joe Jusko / Sanjulian / Esteban Maroto / Roy Krenkel / Earl Norem)
- 4 DARK-FANTASY (Brom / Bernie Wrightson / Wayne Barlowe / Zdzislaw Beksinski / Trevor Henderson — Gothic / cosmic-horror register)
- 5 MODERN-CONCEPT-FANTASY (Marc Simonetti / Jaime Jones / Wesley Burt / Craig Mullins / Sparth / Raph Lomotan / Daarken / Tyler Jacobson)
- 4 DRAGON-SPECIALIST (Bob Eggleton / Ciruelo Cabral / Donato Giancola / Todd Lockwood / Wayne Reynolds dragon work)
- 4 SCI-FANTASY HYBRID (Michael Whelan / Vincent Di Fate / Don Maitz / Stephan Martiniere / Bruce Pennington — Analog/F&SF/DAW cover painters)
- 3 STORYBOOK-LUMINOUS (Justin Sweet / Justin Gerard / Donato Giancola / Charles Vess / Brian Froud / Arthur Rackham updated)
- 3 PROG-ROCK / SURREAL-FANTASY (Roger Dean / Rodney Matthews / Patrick Woodroffe — floating-island / impossible-geometry register)
- 5 HYBRID-LINEAGE PAIRINGS (combine two painters whose styles fuse productively — "Frazetta-Brom dark-fantasy hybrid" / "Howe-Lee Tolkien-extended hybrid" / "Vallejo-Whelan jewel-tone hybrid" / "Elmore-Easley TSR-paperback hybrid" / "Simonetti-Mullins modern-concept hybrid")

━━━ EXAMPLE PHRASINGS TO USE ━━━

Format pattern: "[Painter name] [tradition descriptor] — [palette description], [surface quality + mood phrase]."

GOOD:
- "Frank Frazetta sword-and-sorcery oil — dramatic chiaroscuro with ember-and-shadow palette, molten copper sky against black silhouetted crags, visceral painted energy radiating from every textured stroke."
- "Alan Lee Tolkien atmospheric-watercolor — muted earth-green and grey-gold washes bleeding softly into one another, misty valley distances dissolving into luminous pale sky with quiet painterly restraint."
- "Bob Eggleton dragon-landscape painted — saturated emerald-and-violet aerial panoramas across smoke-veiled volcanic ranges, primal chromatic intensity rendered with dynamic painted brushwork and cinematic scale."

━━━ BANS ━━━

- NO photoreal / cinema reference (no "Peter Jackson" / no "Game of Thrones cinematography" / no film references) — this axis is PAINTER LINEAGE only
- NO non-Western traditions (no anime / no Studio Ghibli / no ukiyo-e / no Chinese ink-wash) — DragonBot is strict Western high-fantasy
- NO living-artist obscurities — stick to recognized fantasy-illustration lineage
- NO generic "fantasy art" descriptors without a SPECIFIC named painter
- NO digital-only descriptors without rooting in painted tradition (modern concept entries should still reference painted surface quality)
- NO photographer name-drops, NO "8K", NO "hyperreal CG" — this is PAINTED tradition only

━━━ OUTPUT ━━━

JSON array of ${n} strings. No preamble, no numbering, one entry per string. Each follows the format: "[Painter name] [tradition descriptor] — [palette description], [surface quality phrase], [mood register phrase]."`,
}).catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
