#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/mangabot/seeds/anime_archetype_female.json',
  total: 25,
  batch: 25,
  append: false,
  maxTokens: 4000,
  metaPrompt: (n) => `Write ${n} ANIME FEMALE ARCHETYPE descriptions for MangaBot's character paths. Each entry is 22-38 words. The archetype is WHO the character is + her vibe / energy / story-flavor — NOT outfit (separate pool), NOT face details (separate pools).

CONTEXT: Lush, vibrant, frame-worthy anime poster moments. Draw from ALL anime genres. Each archetype is a SPECIFIC type — distinct, evocative, recognizable as anime. NOT generic "anime girl"; specific roles with personality.

Categories — rotate widely across genres:
- Slice-of-life (high schooler / college student / part-time café worker / aspiring artist / aspiring writer / amateur photographer / music-club member)
- Magical girl / mahou shoujo (young apprentice mage / spirit-binder / star-themed magical girl / flower-themed magical girl)
- Shonen-adjacent (martial-arts academy student / kendo club member / archery club member — non-combat moments only)
- Fantasy (apprentice witch / shrine maiden / forest spirit-keeper / library mage)
- Cyberpunk (signal-runner / gear-tinker / hacker / café-hopping rebel)
- Historical / jidaigeki (samurai-era poet / kimono-clad noblewoman / shrine maiden / itinerant traveler)
- Idol / pop (off-duty idol on a coffee run / aspiring idol practicing alone / quiet introverted singer)
- Sports (off-season runner / morning swimmer / weekend cyclist — NOT mid-competition)
- Detective / curiosity-driven (amateur sleuth / journalist trainee / curiosity-shop apprentice)
- Cozy supernatural (yokai-friendly schoolgirl / spirit-tea-shop worker / ghost-friend mediator)
- Off-duty (a young woman who just clocked out / weekend wanderer / morning regular at a café)

EVERY entry must include:
- Age range (mid-teens / late-teens / early-twenties / mid-twenties — anime adult range; NEVER child, NEVER over 30)
- Specific archetype (named — high schooler / shrine maiden / apprentice witch / off-duty idol / etc.)
- Personality / energy hint (cheerful and curious / quiet and contemplative / sardonic and clever / shy but determined / cool and aloof / warm and grounded / dreamy and artistic)
- ONE story / hint detail (a sketchbook full of drawings she never shows / a small charm her grandmother gave her / a cassette tape with no label / a rumor she's chasing / a cat she's secretly feeding)

ABSOLUTELY BANNED:
- NO weapons / combat archetypes mid-action (off-duty samurai is OK; samurai mid-strike is NOT)
- NO sexualized framing — anime stylized femininity, NEVER fanservice
- NO "she carries a [weapon]" or outfit language (those go in other pools)
- NO villain / dark-coded archetypes (mangabot anime tone is wholesome / cinematic / wonder-evoking)

Examples (write fresh):
- "Late-teens high schooler with a quiet artistic streak, dreamy and contemplative, a sketchbook full of drawings she never shows tucked under her arm"
- "Early-twenties off-duty idol on a coffee run, warm and grounded, a small lucky charm her late grandmother gave her tied to her wrist"
- "Mid-teens apprentice shrine maiden curious about the city, cheerful and observant, a worn folktale-book in her satchel that her grandmother left her"
- "Early-twenties amateur photographer wandering between projects, sardonic and clever, a film camera always slung across her chest, hunting for one perfect frame"

Output ONLY a valid JSON array of ${n} strings (22-38 words each). No preamble, no commentary.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
