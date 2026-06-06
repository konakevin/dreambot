#!/usr/bin/env node
/**
 * ICONIC_LANDSCAPE_MYTHIC_TRADITION — production scale-up to 200.
 *
 * Painter-lineage anchors for DragonBot's iconic-landscape path. Each entry
 * names a SPECIFIC named painter / illustrator / studio tradition + their
 * signature painted-fantasy register (palette + brushwork + mood), so the
 * Sonnet brief can lock the rendering aesthetic to that lineage.
 *
 * Mirrors the existing 25 entries' register: "Painter-Name tradition-tag —
 * palette + brushwork + mood sentence, 25-40 words."
 */
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/dragonbot/seeds/iconic_landscape_mythic_tradition.json',
  total: 200,
  batch: 50,
  maxTokens: 8000,
  append: true,
  metaPrompt: (
    n
  ) => `You are writing ${n} MYTHIC PAINTER-TRADITION anchors for DragonBot's iconic-landscape path. Each entry names a SPECIFIC named fantasy/illustrative painter (or studio tradition) + their signature painted-landscape register — palette, brushwork, mood — so the Flux render locks to that exact aesthetic lineage.

Each entry: 25-40 words, ONE sentence. Format strictly:
"<Painter Name> <tradition-tag> — <palette + brushwork + mood description>."

━━━ EXAMPLE REGISTER (mirror this exactly) ━━━

  "Alan Lee Tolkien atmospheric-watercolor — muted earth-green and grey-gold wet washes bleeding softly at horizon edges, ancient organic warmth pooling in valley shadows, moss-and-twilight mood throughout."
  "Frank Frazetta sword-and-sorcery oil — dramatic chiaroscuro with ember-and-shadow palette, rust-bronze sun-pillar slicing primordial jungle canopy, savage landscape tension coiled beneath volcanic amber atmosphere."
  "Samwise Didier Blizzard hand-painted-stylized — saturated bold color-block textures, painterly heroic-fantasy mood with exaggerated theatrical rim-lighting against simplified geometric foliage masses and vivid azure sky."

━━━ THE PAINTER POOL — anchor each entry to a REAL named lineage ━━━

This is Western high-fantasy painted-landscape tradition. Distribute the ${n} entries roughly across these named lineages — each entry names ONE of them as its anchor:

TOLKIEN-LINEAGE: Alan Lee, John Howe, Ted Nasmith, Hildebrandt Brothers (Tim & Greg), Roger Garland, Inger Edelfeldt, Anke Eißmann, Donato Giancola Tolkien-tradition.

D&D / TSR PAPERBACK-OIL: Larry Elmore, Jeff Easley, Keith Parkinson, Clyde Caldwell, Tony DiTerlizzi, Wayne Reynolds, Todd Lockwood, Daniel Horne, Robh Ruppel.

BLIZZARD / HEARTHSTONE / WARCRAFT STYLIZED: Samwise Didier, Glenn Rane, Wei Wang, Peter Lee, Justin Thavirat, Chris Robinson, Laurel Austin, Jomaro Kindred.

SWORD-AND-SORCERY OIL: Frank Frazetta, Boris Vallejo, Julie Bell, Ken Kelly, Esteban Maroto, Sanjulian, Manuel Sanjulián.

DARK-FANTASY PAINTERLY: Brom, Yoshitaka Amano dark-register, Zdzisław Beksiński fantasy-adjacent, Gerald Brom.

PAPERBACK SF-FANTASY OIL (Analog / Asimov / Daw): Michael Whelan, Don Maitz, Darrell K. Sweet, Jeff Jones, Vincent Di Fate, Bob Eggleton, Stephen Hickman, Tom Kidd, James Gurney Dinotopia-tradition.

GOLDEN-AGE / VICTORIAN ILLUSTRATION: Arthur Rackham, Edmund Dulac, Kay Nielsen, John Bauer Swedish-folk, Maxfield Parrish, N.C. Wyeth, Howard Pyle, Walter Crane.

MID-CENTURY STYLIZED: Eyvind Earle Disney-stylized, Mary Blair Disney-color, Mary GrandPré, Gustaf Tenggren, Trina Schart Hyman.

PROG-ROCK / SURREAL-FANTASY: Roger Dean, Rodney Matthews, Patrick Woodroffe, Tim White.

MODERN-FANTASY PAINTERLY (concept-art lineage): Justin Sweet, Craig Mullins (fantasy work), Even Mehl Amundsen, Donato Giancola, Daniel Dociu, Greg Rutkowski painted-landscape register, Jaime Jones, Sparth fantasy-register.

ELDEN-RING / SOULSBORNE PAINTED: Yoshinori Shono, Daisuke Satake painted-landscape tradition (describe as "FromSoftware painterly dark-fantasy" if naming the studio not the individual).

WITCHER PAINTED-LANDSCAPE: Bartłomiej Gaweł, Marek Madej Witcher-painterly tradition.

GHIBLI-LANDSCAPE (only the painted-vista subset): Kazuo Oga Ghibli-watercolor-landscape, Yoji Takeshige Ghibli-background tradition (NOT character-animation work — landscape backgrounds only).

CLASSIC SCANDINAVIAN / FOLK-FANTASY: John Bauer, Theodor Kittelsen Norwegian-troll-fantasy, Akseli Gallen-Kallela Kalevala-tradition.

PRE-RAPHAELITE FANTASY-ADJACENT: John William Waterhouse mythic-landscape backdrop, Edward Burne-Jones painted-mythic-backdrop.

━━━ THE TRADITION TAG ━━━

Right after the painter's name, add a 2-4 word tradition-tag that names the SUB-tradition: "Tolkien atmospheric-watercolor" / "sword-and-sorcery oil" / "Blizzard hand-painted-stylized" / "D&D paperback oil" / "Hearthstone-Warcraft theatrical" / "Victorian ink-and-wash" / "mid-century Disney-stylized" / "prog-rock surreal-fantasy" / "Swedish folk-fantasy watercolor" / "Norwegian troll-fantasy" / "Pre-Raphaelite painted-mythic" / "Souls-painterly dark-fantasy" / "Ghibli-watercolor-landscape" / etc.

━━━ THE PAINTED-REGISTER DESCRIPTION ━━━

Each entry MUST name at least:
- 2 specific palette colors (e.g., "muted earth-green and grey-gold" / "ember-and-shadow" / "bone-white and indigo")
- 1 brushwork / surface quality (e.g., "wet washes bleeding softly" / "saturated color-block textures" / "soft-edged moody atmospheric register" / "Gothic painterly textures")
- 1 mood / emotional DNA (e.g., "moss-and-twilight mood" / "savage landscape tension" / "hopeful mythic grandeur" / "elegantly sinister landscape atmosphere")

━━━ STRICT FORMAT ━━━

- ONE sentence per entry. No internal periods.
- 25-40 words.
- Start with the painter's name + tradition-tag, then em-dash, then the painted-register description.
- Strip apostrophes from possessives if any (e.g., "Frazetta-Brom" not "Frazetta's-Brom").
- NEVER repeat a painter already in the prior batches.
- Each entry is a SINGLE coherent painted-aesthetic anchor — not a generic "fantasy painting" wash.

━━━ STRICT BANS ━━━

- NO franchise proper nouns in the description (no "Azeroth", "Mordor", "Pandaria", "Rivendell", "Lothlorien"). The painter's tradition can be named ("Tolkien-tradition", "Warcraft-tradition") but specific franchise settings cannot.
- NO photoreal / CGI / 3D-render language. This is HAND-PAINTED tradition only.
- NO sci-fi / cyberpunk / neon / modern-industrial.
- NO Eastern-coded register (no "samurai-painted", "Persian-miniature-tradition", "Bedouin-illustration"). Western high-fantasy painted-landscape only.
- NO photographer name-drops. PAINTERS only.

━━━ OUTPUT ━━━

JSON array of ${n} strings. No preamble, no numbering, one entry per string. Each entry follows the format exactly.`,
}).catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
