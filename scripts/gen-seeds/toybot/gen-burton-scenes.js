#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/toybot/seeds/burton_scenes.json',
  total: 25,
  batch: 10,
  metaPrompt: (n) => `You are writing ${n} TIM BURTON / CORPSE BRIDE stop-motion scene descriptions for ToyBot's burton-scene path — cinematic scenes populated by tall gaunt elongated Laika-puppet characters (Corpse Bride / Coraline / Frankenweenie / Nightmare-Before-Christmas puppet DNA). Every scene is a handcrafted miniature stop-motion set photographed on a practical soundstage with dramatic lighting.

Each entry: 18-28 words. ONE specific cinematic Burton-puppet scene with a character (or characters) mid-action in a gothic-whimsy miniature set.

━━━ THE CHARACTERS ━━━
Tall gaunt stop-motion puppets — oversized heads, huge teardrop eyes, porcelain or pale-blue skin, visible body-stitch-seams, armature-supported limbs, wild silk hair or intricate sculpted updos, Victorian-gothic wardrobe (tattered lace / morning-coat / top-hat / veil / fingerless-gloves / tailcoat). NEVER call them "humans" — they are stop-motion PUPPETS.

━━━ SCENE CATEGORIES (rotate, don't cluster) ━━━
- Moonlit cemetery — puppet weeping at crooked headstone, fog rolling through iron gates
- Gothic wedding chapel — ghostly bride puppet mid-vow with spider-web veil
- Spiraling haunted staircase — puppet ascending with candelabra, floorboards groaning
- Dead forest — puppet figure lost among twisted black trees with paper moon overhead
- Puppet tea-party on a tilted tombstone table — crooked china, skeletal crow guest
- Victorian parlor — puppet reading to pet-bat, dust motes in raking window light
- Snow-dusted gothic village rooftops — puppet leaping between chimneys under full moon
- Underground skeleton-band ballroom — puppet couple dancing, bone-chandelier above
- Puppet ringmaster in abandoned circus tent, tattered banners, single sputtering spotlight
- Puppet climbing a moonlit church bell-tower, gargoyle stone-perch, raven companion
- Stop-motion pumpkin-patch at dusk — puppet holding a lit jack-o-lantern, long shadows
- Haunted theater stage — puppet performing to empty velvet seats, ghost-audience mist
- Winter Victorian carriage — puppet coachman driving skeletal horses, snow whipping past
- Bone-shelf library — puppet stretching up to pull a leather tome from impossible height
- Spider-web-draped dining hall — puppet host lifting silver lid to reveal a glowing heart
- Puppet-scientist's laboratory — bubbling green flask, anatomical charts, tesla-coil arc
- Cliffside gothic manor balcony — puppet in mourning-veil staring down at crashing waves
- Black-widow-themed boudoir — puppet brushing hair at cracked ornate mirror, raven perched
- Paper-moon boat on ink-black lake — puppet rowing alone, lantern throwing halo
- Burning candles in a puppet-cathedral — puppet kneeling at altar of bone-and-velvet
- Stop-motion alleyway — puppet hiding in shadow from a pursuing lantern-carrier
- Puppet bride stepping through a portal of smoke on a chalk circle — skeletal groom waiting
- Attic chandelier scene — puppet swinging on dust-draped crystal chandelier
- Haunted music-box winter scene — puppet ballerina spinning atop an oversized wind-up box
- Puppet coffin-procession through a snow-covered Victorian street — mourners in top-hats

━━━ MUST-HAVE FOR EVERY ENTRY ━━━
- Reference puppets / stop-motion / armature / miniature-set LANGUAGE — this is a handcrafted stop-motion world, NOT a real gothic scene
- Cinematic verbs: "mid-reach", "mid-step", "frozen mid-turn", "caught mid-whisper"
- Practical lighting cue (candlelight / moonlight / rake-light / paper-moon / sputtering-lantern)
- Gothic-whimsy wardrobe reference

━━━ BANNED ━━━
- NO "real woman" / "real man" — these are PUPPETS
- NO "CGI" / "3D render" / "illustration" / "anime"
- NO explicit blood / gore / violence
- NO sexual content
- NO real-world IP character names (Emily / Victor / Sally / Jack Skellington) — archetype only
- NO static poses — mid-action only

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
