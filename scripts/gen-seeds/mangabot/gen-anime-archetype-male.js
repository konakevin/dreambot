#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/mangabot/seeds/anime_archetype_male.json',
  total: 200,
  batch: 50,
  append: true,
  maxTokens: 4000,
  metaPrompt: (n) => `Write ${n} ANIME MALE ARCHETYPE descriptions for MangaBot's character paths. Each entry is 22-38 words. The archetype is WHO he is + his vibe / energy / story-flavor — NOT outfit (separate pool), NOT face details (separate pools).

CONTEXT: Lush, vibrant, frame-worthy anime poster moments. Draw from ALL anime genres. Each archetype is a SPECIFIC type — distinct, evocative, recognizable. NOT generic "anime guy"; specific roles with personality.

Categories — rotate widely across genres:
- Slice-of-life (high schooler / college student / part-time café worker / aspiring artist / aspiring writer / amateur photographer / music-club member / barista)
- Magical / fantasy (apprentice mage / wandering monk / spirit-binder / herbalist / academy researcher)
- Shonen-adjacent off-duty (martial-arts academy student post-practice / kendo club member walking home / off-duty kenshin)
- Cyberpunk (signal-runner / gear-tinker / hacker / coffee-fueled developer / off-shift courier)
- Historical / jidaigeki (ronin / itinerant poet / samurai-era teamaster / wandering bard)
- Idol / band (off-duty band member / aspiring guitarist on a coffee run / quiet introverted singer)
- Sports (off-season runner / morning swimmer / weekend cyclist / off-duty tennis player)
- Detective / curiosity-driven (amateur sleuth / journalist trainee / antiques-shop apprentice)
- Cozy supernatural (yokai-friendly schoolboy / spirit-tea-shop worker / ghost-friend translator)
- Off-duty professional (chef on his commute / young architect on a coffee break / barista on his lunch / programmer at a window seat)
- Solitary / contemplative (a young man wandering home from a late shift / a weekend stroller / a quiet bookstore regular)

EVERY entry must include:
- Age range (late-teens / early-twenties / mid-twenties / late-twenties — anime adult range; NEVER child, NEVER over 30)
- Specific archetype (named — barista / ronin / apprentice mage / cyberpunk runner / etc.)
- Personality / energy hint (sardonic and aloof / warm and grounded / quiet and observant / cocky and brilliant / cool and detached / kind and shy / brooding and thoughtful)
- ONE story / hint detail (a notebook full of half-songs / a cracked watch he can't quite let go of / a stray cat he secretly feeds / a music tape he plays on loop / a journal entry he's avoiding)

ABSOLUTELY BANNED:
- NO weapons / combat archetypes mid-action (off-duty samurai OK; samurai mid-strike NOT)
- NO bare-torso / fan-service framing — anime stylized masculinity, never pin-up
- NO "he carries a [weapon]" or outfit language (those go in other pools)
- NO villain / dark-coded archetypes (anime tone is wholesome / cinematic / wonder-evoking)

Examples (write fresh):
- "Late-teens high schooler with quiet artistic streak, brooding and contemplative, a notebook full of half-finished songs always tucked into the back pocket of his uniform"
- "Mid-twenties off-duty barista on a coffee break, sardonic and warm, a cracked watch his father gave him on his wrist that he refuses to replace"
- "Early-twenties apprentice mage wandering the city, curious and observant, a worn leather-bound spellbook in his satchel that he reads on every train ride"
- "Late-twenties cyberpunk gear-tinker with grease-stained hands, cocky and brilliant, a small mechanical owl perched on his shoulder that he built himself"

Output ONLY a valid JSON array of ${n} strings (22-38 words each). No preamble, no commentary.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
