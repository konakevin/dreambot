#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/gothbot/seeds/scene_girls_characters.json',
  total: 200,
  batch: 12,
  metaPrompt: (n) => `You are writing ${n} CHARACTER DESCRIPTIONS for GothBot's scene-girls path — dark-fantasy gothic women with a sexy-vampire-hunter aesthetic, caught mid-action in richly detailed gothic scenes. Each entry describes ONE complete woman: her archetype + ethnicity + hair + eyes + clothing (period-appropriate gothic).

Each entry: 30-50 words. Describes ONE complete character. NO action, NO location (those come from separate pools). JUST the character.

━━━ AESTHETIC NORTH STAR ━━━
Sexy dark-fantasy vampire-huntress / occult witch / dark sorceress / vampiric noblewoman energy. References: Kate-Beckinsale-Selene (Underworld), Jessica-Biel-Abigail (Blade Trinity), Winona-Ryder-Mina (Dracula 1992), Eva-Green-Penny-Dreadful, Elle-Fanning-Neon-Demon-gone-goth, Milla-Jovovich-Resident-Evil, Cate-Blanchett-Galadriel-dark, Kate-Bush-wuthering-goth, Stevie-Nicks, Florence-Welch, Abbey-Lee-Mad-Max-dark. Dangerous, elegant, magnetic, beautiful — she could kiss you or kill you.

━━━ ARCHETYPE (rotate across pool) ━━━
- Dark sorceress (arcane-focused, spell-slinger)
- Occult witch (ritualistic, coven, familiar)
- Vampiric noblewoman (old-blood, aristocratic)
- Blood-huntress / vampire huntress (Van-Helsing-female)
- Dark-priestess / fallen cleric
- Ritual enchantress
- Necromancer-sorceress
- Gothic-royal (princess / queen / duchess of a dark court)
- Spell-smith / alchemist-witch
- Cursed heroine (hunter-cursed-by-what-she-hunts)

━━━ 4 DEDUP AXES (ENFORCE ACROSS 200) ━━━

1. **RACE / ETHNICITY** — spread widely, no clustering. Rotate:
   - Western European (English, Irish, Scottish, Welsh, French, German, Italian, Spanish, Portuguese)
   - Slavic (Russian, Polish, Ukrainian, Serbian, Romanian, Hungarian)
   - Nordic (Scandinavian, Finnish, Icelandic)
   - East Asian (Japanese, Korean, Chinese, Mongolian)
   - Southeast Asian (Vietnamese, Thai, Filipino, Indonesian)
   - South Asian (Indian, Pakistani, Sri Lankan, Tamil, Bengali)
   - Middle Eastern / North African (Persian, Turkish, Arab, Lebanese, Moroccan, Egyptian, Berber)
   - Sub-Saharan African (Nigerian, Ethiopian, Somali, Kenyan, Ghanaian, Senegalese, South African)
   - Latin American (Mexican, Peruvian, Brazilian, Argentinian, Colombian, Chilean)
   - Indigenous Americas (Navajo-inspired, Mayan-inspired, Incan-inspired, Andean)
   - Polynesian / Pacific Islander (Maori, Hawaiian, Samoan)
   - Caribbean / Afro-diaspora (Haitian, Dominican, Cuban)
   - Mixed / Eurasian / Afro-Latin / Afro-Asian
   Name the ethnicity explicitly. All regions welcome, rotate aggressively.

2. **HAIR COLOR + STYLE** — spread widely:
   - Colors: raven-black / jet-black / platinum-white / silver-grey / wine-burgundy / blood-red / copper-auburn / mahogany / honey-blonde / ash-blonde / violet-streaked / emerald-streaked / ice-blue-streaked / ebony / cobalt-black / champagne / red-auburn / chestnut / rose-gold
   - Styles: waist-long loose waves / sleek raven straight / wild windswept / backcombed tall / severe high-updo / braided crown / tight Victorian coil-up / floor-length straight / bob / pixie / half-veiled / ribboned braid / wet-slicked-back / space-buns / tied-back with leather cord / adorned with raven feathers / pinned with silver combs

3. **EYE COLOR** — spread widely:
   - Natural: emerald green / jade / forest-green / hazel-gold / amber / honey / chestnut-brown / cobalt blue / ice blue / steel grey / violet / slate / green-grey / deep-brown
   - Supernatural-tinted (subtle glow optional): glowing crimson / fel-green glow / molten-amber / sapphire-bright / opalescent
   - Mark one eye as "slightly uncanny" occasionally (heterochromia, subtle glow, sclera-tint)

4. **CLOTHING — PERIOD-APPROPRIATE GOTHIC WITH SEXY VAMPIRE-HUNTER VIBE** — spread widely across eras and silhouettes:
   **Eras to rotate:**
   - Medieval (fitted kirtle + leather gambeson + cloak)
   - Late-Gothic / Renaissance (corseted bodice + flowing skirt + ornate sleeves)
   - Elizabethan / Tudor (lace ruff + embroidered stomacher + velvet)
   - Baroque (corset + draped silk + lace cuffs)
   - Regency (high-waist empire gown in dark fabrics)
   - Victorian (full corset + bustle skirt + lace collar + mourning jewelry)
   - Edwardian (fitted blouse + long skirt + choker)
   - Belle-Époque (velvet gown with beadwork)
   - Late-1800s huntress (fitted trousers + knee-boots + leather vest + white blouse + long coat)
   - 1920s-dark-vamp (velvet dress + beaded headband + ornate gloves)
   - Transylvanian folk (embroidered blouse + wool skirt + leather bodice + head-scarf)
   - Moorish / Ottoman (embroidered tunic + layered silks + silver jewelry)
   - East-Asian gothic (adapted kimono / hanbok silhouette in black lace + gold embroidery)
   - South-Asian gothic (dark lehenga / sari adapted with gothic accents)
   - Witchy-outlaw (loose trousers + knee-boots + lace-up corseted vest + flowing cloak)
   - Dark-priestess (robes + stole + embroidered vestments + ritual jewelry)

   **Every clothing description includes:**
   - A specific silhouette (fitted / flowing / layered / asymmetric / tight / draped)
   - A fabric/texture mix (velvet + lace / silk + leather / brocade + wool / satin + fur-trim)
   - A sexy but period-appropriate accent (low-cut sweetheart neckline, corseted waist defining hips, slit showing knee-high boots, cropped sleeves revealing arm, side-slit skirt, tight leather trousers tucked into boots, plunging back)
   - Ornate accessories: silver filigree jewelry, occult pendant, ritual-dagger at hip, crossbow or rapier sheathed at belt, amulet, cameo brooch, chainmail choker, spiked collar, widow-veil, silver cross inverted, pentagram-ward (abstract), rune-etched bracer, leather gauntlets

   **NOT costume-y / fancy-dress:**
   Real period-appropriate garment silhouettes, rendered with vampire-huntress sensuality. NOT Halloween-costume. NOT cosplay. NOT stripper-outfit-with-cross. Think Kate-Beckinsale-Selene-latex-coat-gothic + Winona-Ryder-Dracula-costume + Eva-Green-Penny-Dreadful-Victorian-gown elegance.

━━━ MANDATORY FOR EVERY ENTRY ━━━
Name explicitly:
- Archetype (1 of 10 above)
- Ethnicity (from the wide list above)
- Hair color + style
- Eye color (sometimes with subtle glow/tint)
- Clothing: era + silhouette + fabrics + sexy-accent + 1-2 ornate accessories

━━━ BANNED ━━━
- NO named celebrity anchor ("looks like Kate Beckinsale") — just features
- NO sexual / lingerie-catalog / explicitly-naked description — sexy is suggested via silhouette + fabric + confidence, NOT exposure
- NO underage reading — all adult
- NO modern clothes (jeans, t-shirt, sneakers, hoodie)
- NO action verbs / scene / setting (pool axes handle those)
- NO "pose" / "posing" / "modeling"
- NO named IP (Dracula, Carmilla, Vampirella, Lady-D, Selene, Van-Helsing)
- NO devil horns / pentagrams / 666-imagery / explicit satanic symbols

━━━ WRITING EXAMPLES ━━━
"Bengali vampire-huntress with deep bronze skin and fierce hazel-gold eyes, long raven hair in a backcombed tall crown-braid adorned with silver-filigree hair-combs, wearing a fitted Victorian black-velvet riding-coat over a corseted bodice, tight leather trousers tucked into knee-high silver-buckled boots, a rapier sheathed at her hip and an inverted-silver-cross pendant at her throat"

"Romanian dark sorceress, porcelain-pale skin with piercing jade-green slightly-glowing eyes, waist-long platinum-white loose waves framing her face, wearing a floor-length wine-burgundy velvet gown with a corseted bodice and plunging sweetheart neckline trimmed in lace, ornate silver-filigree vine-bracelets climbing both arms, heavy moonstone amulet at her throat"

"Moroccan-Berber occult witch with warm olive skin and amber-honey eyes, thick wavy black hair loosely tied back with a leather cord, wearing a layered robe of embroidered indigo silk over a fitted black leather bodice, ornate silver-coin hip-belt with a ritual-dagger sheathed beside, sigil-etched bronze bangles stacked at both wrists"

"Japanese blood-huntress with pale porcelain skin and dark onyx eyes with subtle crimson tint, sleek raven chin-length bob with swept bangs, wearing a black-lace-overlaid dark-kimono-silhouette tunic cinched with a wide obi-belt over fitted leather trousers tucked into knee-boots, twin crossbows holstered at her hips, carved-jade pendant choker"

"Scottish-Celtic dark-priestess with fair pale skin and steel-grey wide-set eyes, copper-auburn waist-long loose waves, wearing a floor-length black velvet robe over an embroidered crimson kirtle with a low tight-laced corseted bodice, heavy silver-crescent clan-brooch at her shoulder, iron-rune-etched bracer on her sword-arm, a widow-veil draped over her hair"

"Nigerian-Igbo vampiric noblewoman with deep mahogany skin and glowing molten-amber eyes, intricately coiled braided-crown updo adorned with silver-filigree and obsidian-beads, wearing a deep-violet silk Renaissance-style corseted gown with gold-embroidered bodice, plunging back, obsidian-bead chain-drape across her shoulders, ornate gold-filigree ear-cuffs"

"Persian-Iranian blood-huntress with warm olive-honey skin and piercing sapphire-bright eyes, wavy dark-brown hair with blood-red streaks tied back in a leather cord, wearing a fitted late-1800s huntress ensemble — black leather vest laced over a crisp white high-collar blouse, charcoal riding-trousers tucked into knee-high buckled boots, a silver-hilted rapier at her hip, runed leather bracers"

━━━ HARD RULES ━━━
- 30-50 words per entry
- Every entry names: archetype + ethnicity + hair + eyes + clothing (era, silhouette, fabrics, sexy-accent, accessories)
- Every entry visibly distinct from every other across ALL 4 dedup axes
- Period-appropriate clothing, never modern
- Sexy-vampire-hunter vibe (suggestive via silhouette, not exposure)

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
