#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/pixelbot/seeds/jrpg_dreamscape_scenes.json',
  total: 200,
  batch: 50,
  append: false,
  maxTokens: 6000,
  metaPrompt: (n) => `Write ${n} 16-BIT JRPG CUTSCENE / DREAMSCAPE GAMEPLAY SCREENSHOT scene descriptions for PixelBot's jrpg-dreamscape path. Genre lineage: Final Fantasy IV / V / VI mode-7 cutscenes + Octopath Traveler HD-2D pivotal cutscenes + Sea of Stars dream sequences + Chrono Trigger time-vortex + Earthbound surreal interludes + Live A Live + Trials of Mana mystical hubs + Lufia II legend cutscenes + Tales of Phantasia spirit-realm.

Each entry: 30-50 words, ONE paragraph, focused on a SURREAL JRPG-CUTSCENE moment with a RECOGNIZABLE JRPG CHARACTER ANCHOR — party-of-heroes mid-stride, summon-spirit reveal, hero at altar, world-tree with party at base, princess at the cosmic stair. NEVER pure-abstract geometry without characters.

━━━ THE NORTH STAR ━━━

Every scene should feel like "a screenshot of a pivotal JRPG cutscene I'd play right now." Surreal otherworldly setting, BUT with recognizable JRPG characters (party / hero / princess / mage / summon-spirit) anchoring the frame. The viewer thinks: "what JRPG cutscene IS this? I want to know the story."

━━━ MANDATORY ELEMENTS (every entry — NO EXCEPTIONS) ━━━

EVERY entry MUST include at least ONE of these JRPG ANCHORS as the FOREGROUND/MIDDLE focal subject:
- HERO PARTY (1-4 chunky 16-bit RPG sprites) mid-stride / mid-cast / mid-reveal — kid in green tunic, mage in robe, princess in gown, warrior in armor, ninja, monk, ranger, dragoon, samurai, dancer
- SUMMON-SPIRIT REVEAL with elemental titan emerging from runic-circle (the party watching from below)
- LONE HERO at a sacred altar / world-tree base / cosmic stair (with party visible in background or alone)
- PRINCESS / NPC FIGURE at a cosmic temple / palace
- DRAGON / SUMMON SPIRIT mid-reveal with hero-party tiny in foreground
- AIRSHIP-DECK with hero-party mid-flight viewing cosmic vista

NO scene without a JRPG character/figure anchor. PURE COSMIC-GEOMETRY without characters is FORBIDDEN.

━━━ COMPOSITION CHECKLIST ━━━

1. CAMERA — wide cinematic JRPG-cutscene framing (3-quarter top-down OR side-view OR mode-7-style overworld-flyover)
2. SURREAL COSMIC SETTING (astral-plane / crystalline cathedral / time-vortex / world-tree / cosmic-temple / dream-realm / spirit-realm / cosmic-stair / floating-shrine)
3. RECOGNIZABLE JRPG CHARACTER ANCHOR clearly visible
4. COSMIC ATMOSPHERE — drifting feathers / falling stars / hourglass-sand / drifting motes / aurora-veils / refracted prism-light
5. 16-BIT chunky pixel-grid aesthetic — hard sprite edges, dithered shading

━━━ SCENE TYPES — ROTATE BROADLY (CHARACTER ANCHOR REQUIRED IN EVERY ONE) ━━━

- Hero party of four mid-stride on astral-plane platform with cosmic-void backdrop
- Summon-spirit titan rising from runic-circle, party watching from below
- Lone hero kid at world-tree base looking up, party in middle distance
- Princess in white gown at crystalline cathedral altar, refracted rainbow light
- Time-vortex chamber with party mid-stride through, clock-faces rotating around them
- Mage in blue robe at cosmic-stair-top mid-cast, sky-galaxy backdrop, party trailing on steps
- Warrior at sacred-grove rune-circle confronting glowing-spirit-deer
- Ninja mid-leap across cosmic-platform with starfield, party watching from edge
- Dragoon with spear mid-thrust at cosmic-dragon emerging from void
- Hero party in airship-cockpit silhouette viewing dream-realm vista
- Cleric in white-and-red mid-prayer at floating-shrine with cosmic-mist, hero approaching
- Hero touching sacred-relic on cosmic altar with light-pillar shooting up
- Memory-room with party-of-four standing in suspended pearl-white light
- Summon-spirit dragon coiled around world-tree, hero kid at base looking up
- Princess mid-fall through dream-portal with hero kid reaching from edge
- Mage at infinite-stair with ascending light, party companions trailing
- Hero on dream-cloud platform looking at distant cosmic-castle, mage beside
- Warrior in armor charging down cosmic-bridge toward dark-temple, party flanking
- Hero at frozen-time-altar with frozen-world tableau around, party mid-stride approaching
- Party at cosmic-ocean shore looking at floating spirit-island
- Hero mid-transformation in light-pillar, party watching with concern
- Sage-NPC at cosmic-orrery floating chamber, hero approaching
- Hero kid at stained-glass cosmic-cathedral with princess companion
- Party crossing rainbow-bridge over cosmic-void, hero leading
- Lone hero at moonlit shrine with summon-fox-spirit emerging
- Twin heroes back-to-back on cosmic-arena platform, dual-summons appearing
- Hero kid lifting cosmic-sword from runic-pedestal, party watching
- Princess on celestial-throne with hero approaching, light-rays from above
- Party walking ascending cloud-stairs toward cosmic-castle gate
- Mage at floating-shrine summoning spirit-dragon, party watching from below
- Hero crossing crystal-bridge with summon-bird-spirit overhead
- Party at floating-island ruin with summon-spirit emerging from broken altar
- Hero kid touching world-orb on cosmic pedestal, party encircling
- Princess mid-dance in cosmic-ballroom with hero approaching, prism light

━━━ HERO PARTY-SPRITE TYPES — ROTATE BROADLY ━━━

Kid in green tunic with sword and shield, mage in blue robe with staff, warrior in heavy armor with axe, princess in white gown, ninja in dark garb with shuriken, monk in saffron robes, paladin in golden armor, cleric in white-and-red, ranger with bow, dragoon with spear, dancer in flowing scarves, samurai in lacquered armor, summoner with bird-companion, scholar with book.

━━━ EXAMPLES (write fresh — do not copy) ━━━

- "3-quarter top-down cosmic astral-plane platform, party of four mid-stride at platform-center — kid-hero with sword raised, mage in blue robe casting, princess companion watching, dragoon with spear flanking, drifting feather-particles, deep starfield-violet cosmic backdrop, refracted prism-light from above."
- "Wide cosmic summon-spirit reveal chamber, hero party of three mid-foreground watching mage at runic-circle — TOWERING translucent fire-elemental titan rising from runes radiating pulse-glow, drifting prism-motes, deep cosmic-violet backdrop fading to deep starfield-black."
- "Side-view crystalline cathedral interior, princess companion mid-prayer at altar foreground, hero kid-with-sword approaching from left, refracted-rainbow light through prismatic walls, vaulted ceiling extending into infinity, drifting magical motes."
- "Time-vortex chamber, hero party of four mid-stride through, massive clock-faces rotating slowly around them, drifting hourglass-sand suspended mid-fall, deep pink-and-violet cosmic backdrop, prism-shimmer catching glowing runes."
- "World-tree axial sanctuary, lone-hero kid with sword at the colossal trunk-base looking up, mage and warrior companions in middle-distance, glowing pale-gold leaves drifting down, drifting magical motes, soft cosmic-haze."
- "Side-view cosmic stair ascending into starlight, mage in blue robe at the top mid-cast staff glowing, princess and warrior companions trailing on the steps below, runes pulsing on each step, drifting feather-particles, deep cosmic-violet backdrop."
- "3-quarter top-down memory-room hub, party of four standing in suspended pearl-white light, floating still-frames of past events around them, drifting prism-shimmer particles, opalescent cosmic-haze, soft pearl-cyan ambient."
- "Wide cosmic-ocean shore, hero party of three at the shoreline foreground looking out at floating spirit-island in middle-distance, drifting feather-particles, soft golden-rose cosmic-backdrop, refracted prism-shimmer on cosmic-water."
- "Mode-7 airship-cockpit silhouette with party of three in hero-pose looking forward, dream-realm cosmic-vista beyond — floating cathedral-islands in pink-and-violet starfield, drifting magical motes."
- "Side-view sacred-grove rune-circle, warrior-hero in armor mid-stride approaching, glowing-spirit-deer translucent at the runic-center, mage and cleric companions watching from middle-distance, drifting glowing-leaf particles."
- "3-quarter top-down floating-shrine platform with hero kid touching sacred relic on cosmic altar, light-pillar shooting up to starfield, party of three encircling and watching, drifting feather-particles, deep cosmic-violet backdrop."
- "Wide cosmic dragon-reveal chamber, dragoon-hero mid-spear-thrust foreground, TOWERING translucent ice-dragon coiling around floating crystal-pillars, party of two flanking, drifting ice-shimmer particles, deep starfield-cyan cosmic backdrop."
- "Side-view cosmic-cathedral with princess companion at the altar mid-prayer, hero kid in green tunic approaching, mage-companion watching from a colonnade, refracted-rainbow stained-glass light, drifting feather-particles, dreamy soft pearl-amber ambient."

━━━ HARD RULES ━━━

- EVERY entry MUST include at least one JRPG character anchor (hero / party / summon-spirit / princess / NPC)
- NEVER pure-abstract cosmic-geometry without a character anchor
- 16-BIT chunky pixel-grid aesthetic — hard sprite edges, dithered shading, NEVER smooth/painterly
- Surreal cosmic mood — refracted prism-light, drifting cosmic particles, otherworldly settings
- Soft pastels (pearl-white, opalescent, pink-violet, golden-rose, pale-cyan) AS COSMIC GLOW (not as smoothness)
- DREAMY DIFFUSION but with HARD pixel sprite edges on characters
- NEVER UI / HUD / menus / dialogue boxes
- NEVER named IP characters (Crono, Cloud, Terra by name) — use generic descriptive labels for hero ("kid in green tunic", "mage in blue robe")
- NEVER realistic / mundane settings — these are SURREAL DREAMSCAPES with characters

━━━ AVOID ━━━

- Pure abstract cosmic geometry without a character/figure anchor (THE BIG FAILURE MODE — no scene without characters)
- Specific named IPs
- Static empty frames
- Modern smooth indie-pixel rendering

━━━ OUTPUT ━━━
Output ONLY a valid JSON array of ${n} strings. Each string is one complete scene description (30-50 words). No preamble, no commentary, no markdown code fences.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
