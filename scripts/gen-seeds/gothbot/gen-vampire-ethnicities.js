#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/gothbot/seeds/vampire_ethnicities.json',
  total: 100,
  batch: 25,
  metaPrompt: (n) => `You are writing ${n} FEMALE VAMPIRE ETHNICITY descriptions for GothBot's vampire-girls-2 path. Each entry describes a specific ethnic background + the feminine facial features that come with it. These anchor Flux to render a specific FEMALE face, not a generic one.

GENDER: These are FEMALE vampires. Say "vampire woman" explicitly. Describe feminine features — high cheekbones, delicate or strong jaw, specific eye shape, lip fullness.

━━━ FORMAT ━━━
Each entry: "{Region} vampire woman — {bone structure}, {eye shape + color}, {nose}, {lip shape}, {hair texture + color}, {skin undertone} beneath deathly pallor"

━━━ ETHNICITY SPREAD (enforce variety across ${n}) ━━━
PRIMARILY EUROPEAN (~60%, 60 entries) — period-accurate to vampire lore (Carpathian / Balkan / Anglo / Mediterranean origins):
- Eastern European (12-15): Romanian, Hungarian, Serbian, Polish, Czech, Bulgarian, Croatian, Slovenian, Slovak
- Western European (8-10): French, German, Dutch, Belgian, Austrian, Swiss
- Northern European (8-10): Scandinavian-Norse, Finnish, Icelandic, Scots-Highland, Irish, Norwegian, Swedish, Danish
- Southern European (8-10): Italian, Spanish, Greek, Portuguese, Sicilian, Sardinian, Maltese
- British Isles (5-7): Welsh, English, Scottish, Cornish
- Slavic (8-10): Russian, Ukrainian, Georgian, Balkan, Belarusian, Lithuanian, Latvian, Estonian

ASIAN (~25%, 25 entries) — period-accurate East/Central/South Asian:
- East Asian (8-10): Japanese (Heian-court), Korean (Joseon-dynasty), Chinese (Tang/Song), Mongolian, Manchu
- South Asian (5-7): Northern Indian (Mughal-era), Kashmiri, Punjabi, Bengali
- Central Asian (5-7): Persian, Afghan, Uzbek, Tajik, Kazakh
- Southeast Asian (3-5): Vietnamese, Thai, Burmese, Khmer

MIDDLE EASTERN (~10%, 10 entries) — period-accurate Levantine/Anatolian/Persian:
- Persian / Iranian (2-3)
- Anatolian / Ottoman Turkish (2-3)
- Levantine: Syrian, Lebanese, Palestinian, Jordanian (2-3)
- Arabian Peninsula: Bedouin, Yemeni, Saudi (1-2)
- Mesopotamian: Iraqi, Kurdish (1-2)

HISPANIC/LATINO + MOROCCAN (~5%, 5 entries) — Iberian + Moorish/Andalusian heritage:
- Spanish (Andalusian, Castilian, Catalan, Basque) (2-3)
- Mexican / Latin American with Spanish heritage (1-2)
- Moroccan / Berber / Andalusian-Moor (1-2)

NO OTHER AFRICAN ETHNICITIES — vampire lore in this aesthetic is European/Asian/Middle-Eastern/Iberian-Moorish in origin. Period-accurate to the gothic dark-fantasy register. Sub-Saharan African / Ethiopian / Nigerian / etc. are NOT in lineage for this path.

Every entry should feel like a DIFFERENT woman from a different region — not 100 versions of the same pale girl. Different bone structures, eye shapes, hair textures, and skin undertones. Use the regional variety.

━━━ RULES ━━━
- Every entry MUST say "vampire woman" — never just "vampire"
- Include skin undertone + how vampire-pallor interacts with it (Mediterranean olive goes ashen differently than Nordic pink-undertone or Mongolian wheat-undertone or Persian honey-undertone)
- Be specific to the region — Romanian bone structure differs from Scandinavian differs from Korean differs from Persian
- No named individuals as reference
- NO African ethnicities (Sub-Saharan, North African, Ethiopian, Nigerian, etc.) — period-accurate to the lore

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
