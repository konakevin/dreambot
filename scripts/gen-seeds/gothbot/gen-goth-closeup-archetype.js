#!/usr/bin/env node
/**
 * GOTHBOT_GOTH_CLOSEUP_ARCHETYPE — hauntingly beautiful dark-seductress
 * archetypes. SEXY + SULTRY + EVIL + FEISTY gothic women named with a
 * one-line characterization. Castlevania / Crimson-Peak / Bloodborne /
 * Devil-May-Cry painted-oil register. Solo female, NSFW-clean.
 */
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/gothbot/seeds/gothbot_goth_closeup_archetype.json',
  total: 200,
  batch: 25,
  maxTokens: 8000,
  append: true,
  metaPrompt: (
    n
  ) => `You are writing ${n} ARCHETYPE entries for GothBot's goth-closeup path — hauntingly-beautiful dark-seductress archetypes used as the character spec for a TIGHT FACE-CLOSEUP gothic portrait. Each entry is one line: "<Archetype name> — <one-sentence characterization>." (15-30 words total).

━━━ THE BAR ━━━
Every entry: (1) names ONE dark-female archetype with the format "<Name> —" (em-dash separator); (2) follows with one sentence characterizing her DARK POWER + ELEGANT MENACE + SEDUCTIVE DANGER. The register is painted-oil Castlevania / Crimson-Peak / Bloodborne / Devil-May-Cry / Frazetta-Brom-Royo-Vallejo. SEXY + SULTRY + EVIL + FEISTY. Not goofy, not campy — beautiful and lethal.

━━━ EXAMPLE PHRASINGS (mirror this register exactly) ━━━
"Vampiress — ancient, predatory elegance; she moves like hunger itself, beautiful and lethal, draining vitality with a gaze before her teeth ever touch skin."
"Dark Queen — sovereign over ruin; her authority is absolute, her cruelty architectural, and her beauty the last thing conquered kingdoms ever worship."
"Witch — wild and knowing; she communes with rot and root, her beauty untamed, her vengeance botanical and patient and absolute."
"Enchantress — desire made weaponized; she wraps ruin in silk, her charm a labyrinth you enter willingly and never truly leave."
"Banshee — grief incarnate and screaming; her wail peels flesh from bone, her sorrow transformed into something that hunts and howls and destroys."
"Dark Oracle — prophecy as curse; she speaks futures that cannot be escaped, her voice a wound, her compassion long since burned away by knowing."

━━━ VARIETY MANDATE (distribute across these archetype families) ━━━
- ~4 VAMPIRE / BLOOD (vampiress / vampire countess / blood sorceress / undead duchess / nosferatu princess / lamia / strigoi-bride / draculina / nightblood empress)
- ~3 WITCH / SORCERESS (witch / dark sorceress / nightshade witch / blood sorceress / hex-weaver / coven-mother / blackmagic sorceress / curse-keeper / hag in beautiful form)
- ~3 ROYALTY / NOBLE (dark queen / dark countess / dark duchess / shadow empress / undead duchess / dark countess of ash / corrupted princess / dark archduchess)
- ~3 PRIESTESS / CULT (dark priestess / death-cult priestess / dark druidess / blood-priestess / nightshade abbess / cult matriarch / unholy nun)
- ~3 DEMON / DARK DIVINITY (succubus / demoness / dark goddess / dark seraph / corrupted angel / fallen valkyrie / dark cherub / abyss-queen / underworld bride)
- ~3 FAE / OTHERWORLDLY (dark fae queen / shadow fae enchantress / nightshade fae / shadow nymph / Unseelie princess / dark dryad / corrupted muse / shadow mermaid)
- ~3 SPIRIT / GHOST (banshee / wraith-bride / nightmare bride / ghost-bride / shadow widow / haunted contessa / cursed nun-shade / phantom debutante)
- ~3 ASSASSIN / WARRIOR (shadow assassin / vampire huntress / dark valkyrie / dread-knight in human form / blood-bound mercenary / dark templar)
- ~2 SEER / ORACLE (dark oracle / dark mystic / dark prophet / shadow visionary / nightshade seer / scarlet medium)
- ~2 ARTIST / MUSE (dark muse / corrupted muse / dark patron / scarlet diva / cursed prima donna)
- ~2 INSECT / BOTANICAL HORROR (nightshade witch / spider-queen / mantis-priestess / black-rose duchess / venom-mistress / death-bloom matron)

━━━ FORMAT RULES (NON-NEGOTIABLE) ━━━
- "<Archetype Name> — <one-sentence characterization>" — em-dash separator is required.
- 15-30 words total per entry.
- Archetype names can use hyphens or spaces ("Dark Queen" / "Dark-Sorceress" / "Nightmare-Bride") — match the existing pool's relaxed style.
- The body MUST convey DARK POWER + BEAUTY + DANGER, not be a job description.

━━━ BANS ━━━
- NO modern / contemporary archetypes (no "dark CEO", no "goth influencer", no "punk singer").
- NO campy / goofy / Halloween-costume register.
- NO male archetypes — gender-locked FEMALE.
- NO explicit sexual / gore content — implied danger + dark beauty + seduction only.
- NO repeating the same exact archetype across entries (multiple "vampire" variants are fine if each is distinct — "Vampiress" / "Blood Countess" / "Undead Duchess of the Crimson Court" are valid distinct entries).

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering, one entry per string in the "Archetype Name — characterization" format.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
