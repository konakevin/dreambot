#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/starbot/seeds/female_explorers.json',
  total: 200,
  batch: 50,
  metaPrompt: (n) => `You are writing ${n} descriptions of STUNNING FEMALE sci-fi explorers for StarBot. Each is a beautiful, dangerous WOMAN in an ornate space suit/armor. 25-40 words. Start every entry with "A beautiful female" or "A stunning woman" or "A gorgeous female" — the image model MUST know she is a woman.

━━━ WHO THESE WOMEN ARE ━━━
These are the most beautiful, exotic, awe-inspiring women in all of sci-fi. When you see one, your jaw DROPS — not just because she's gorgeous, but because she radiates competence, danger, and otherworldly beauty all at once. She looks like she could hack a mainframe, pilot a starship through an asteroid field, and negotiate a peace treaty before breakfast.

Think: Ripley in power-loader mode, Leia in Boushh armor, Gamora, Valkyrie, Padmé in battle gear, Furiosa, Zoe Washburne. Exotic, ornate, breathtaking.

━━━ WHAT MAKES THEM STUNNING ━━━
- Beautiful faces with DISTINCTIVE features — striking eyes, full lips, high cheekbones, beauty marks, tribal tattoos, cybernetic accents
- Hair that's a STATEMENT — elaborate space-braids with metal threading, zero-G-adapted crops, flowing manes impossible in atmosphere, wild curls with tech-woven beads
- Athletic feminine bodies — toned, strong, graceful, powerful curves under form-fitting suits
- Confidence and presence — she OWNS every bridge and battlefield she enters
- Exotic beauty — varied skin tones, unusual eye colors, alien heritage features, otherworldly allure

━━━ RACE/SPECIES DIVERSITY (spread across all ${n}) ━━━
- Human (pale Northern European, olive Mediterranean, fair Nordic, porcelain, ruddy Celtic)
- Near-human alien (subtly alien — unusual skin hue, slightly elongated features, bioluminescent markings)
- Alien hybrid (clearly non-human but humanoid — ridged brow, scaled patches, chromatic eyes, pointed features)
- Cybernetically enhanced human (visible implants integrated beautifully — chrome temple ports, glowing iris, elegant prosthetic)
- Deep-space adapted human (pale from generations aboard ships, elongated fingers, large dark-adapted eyes)

━━━ DEDUP: APPEARANCE (STRICT — read carefully) ━━━
No two characters should share species + hair color + hairstyle + distinguishing feature.

HAIR COLOR — hard caps, MAX 2 of each across all ${n} entries:
- Blacks (raven, jet, blue-black) — max 2 TOTAL across all black shades
- Blondes (platinum, honey, ash, sandy) — max 2 TOTAL across all blonde shades
- Browns (chestnut, ash brown, chocolate, tawny) — max 2 TOTAL across all brown shades
- Whites/silvers (snow white, silver, platinum-white) — max 2 TOTAL
- Reds/warm (copper, auburn, strawberry, burgundy, crimson) — MAX 1 TOTAL
- Unusual (electric blue, violet-black, emerald, pink) — at least 3 entries should have non-natural hair colors

HAIRSTYLE — hard caps, MAX 3 braids of any kind across all ${n} entries:
- Braids (any type — micro, warrior, crown, single) — MAX 3 TOTAL
- Cropped/pixie/buzz — at least 3 entries
- Flowing/loose — max 4 entries
- Bun/ponytail/updo — at least 3 entries
- Shaved side/undercut — at least 2 entries
- Unique (dreads, locs, mohawk, spikes, coils) — at least 3 entries

ACCESSORIES/DISTINGUISHING — no two entries should share the same type:
- Spread across: scars (face, neck, hands), cybernetic implants (temple, eye, hand), tattoos (tribal, geometric, military), bioluminescent marks, beauty marks, burns, prosthetics, piercings, unusual ears
- Each entry gets ONE primary distinguishing feature — don't stack 3 features on one character

- SKIN: porcelain, olive, fair freckled, ruddy, pale, blue-tinged, chrome-patched, bioluminescent-marked, copper-hued, ash-pale
- EYES: amber, ice-blue, emerald, violet, heterochromia, gold-flecked, chrome-silver, bioluminescent teal, obsidian black, nebula-purple

━━━ RULES ━━━
- EVERY entry MUST start with "A beautiful female..." or "A stunning woman..." or "A gorgeous female..." — MANDATORY for the image model
- Describe the CHARACTER only — no setting, no pose, no action, no outfit details (separate pools handle those)
- Each is a unique individual you could recognize in a lineup
- Sexy, exotic, ornate, awe-inspiring — but NEVER trashy or gratuitous
- No named IP characters
- Include 2-3 specific physical details Flux can render (scar placement, hair style, eye color, skin detail)

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
