#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/mangabot/seeds/occult_tokyo_archetype.json',
  total: 25, batch: 25, append: true,
  metaPrompt: (n) => `Write ${n} OCCULT-TOKYO ARCHETYPE entries — who's interacting with the supernatural in modern urban Japan. Tokyo-Ghoul / Jujutsu-Kaisen / Mob-Psycho / Bleach register. BOTH genders represented.

Each 12-22 words. Role + relationship-to-occult + tone.

⚠️ GENDER BALANCE: ~45% male / ~45% female / ~10% neutral. NO gender skew.

VARIETY:
- 14% EXORCIST / CURSE-USER (jujutsu-style sorcerer with kuji-hands / Onmyoji descendant wielding shikigami / freelance curse-hunter)
- 12% CURSED-STUDENT (high-school student newly awakened to cursed-energy / college kid with parasitic spirit / club-member discovering powers)
- 10% SHRINE-MAIDEN / URBAN-MIKO (modern miko at city shrine / shrine-keeper's apprentice / itinerant blessing-seller)
- 10% URBAN-MONK / SOHEI (modernized warrior-monk / temple-trained street-monk / wandering shaved-head ascetic in city)
- 8% DETECTIVE-MEDIUM (paranormal investigator / spirit-channeling private-eye / Mob-Psycho-style psychic-consultant)
- 8% SPIRIT-HUNTER (yokai-hunter with talismans / cursed-tool wielder / freelance spirit-exterminator)
- 8% CURSED-VESSEL (host-body for ancient spirit / Tokyo-Ghoul-style hybrid / containment-vessel for sealed entity)
- 6% TALISMAN-CRAFTER (ofuda-maker in alley shop / kanji-sigil tattooist / paper-charm artisan)
- 6% ROGUE-CURSE-USER (criminal sorcerer / curse-energy gangster / black-market spirit-broker)
- 6% AWAKENED-SALARYMAN (office-worker who sees spirits / programmer with newly-opened third-eye / OL who hosts a familiar)
- 6% OCCULT-CLUB-LEADER (high-school occult-club president / college paranormal-research lead / urban-legend chaser)
- 6% YOKAI-HALF-BLOOD (half-kitsune passing as human / half-tengu modern wanderer / half-spirit liminal being)

DO write:
- Jujutsu-style sorcerer mid-kuji-hand-sign, register: focused-resolute
- Cursed high-school student with parasitic spirit visible at shoulder, register: wary-determined
- Modern miko at neon-lit city shrine handing out blessings, register: serene-attentive
- Awakened salaryman with third-eye glowing faintly at brow, register: tired-haunted
- Yokai-hunter with talisman-roll across chest mid-deployment, register: tense-ready
- Half-kitsune passing as urban office-worker with fox-ear briefly visible, register: secretive-amused

DO NOT: pure-evil / cheesecake roles / multiple per entry. Western occult tropes (no witches with cauldrons).

Return ONLY JSON array of ${n} strings. No preamble.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
