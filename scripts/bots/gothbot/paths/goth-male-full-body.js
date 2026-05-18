/**
 * GothBot goth-male-full-body path — THREE-QUARTER / MID-SHOT of male
 * gothic characters. Waist-up to thigh-up framing, caught mid-action.
 * Van-Helsing film-still / Castlevania cutscene / Bloodborne-hunter aesthetic.
 *
 * No landscape pool — vivid landscape entries overpower the character and
 * cause Flux to render castles/cathedrals instead of the man. Background
 * comes from ATMOSPHERES only (fog, rain, darkness, moonlight).
 */

const pools = require('../pools');
const blocks = require('../shared-blocks');

module.exports = ({ sharedDNA, vibeDirective, picker }) => {
  const character = picker.pickWithRecency(pools.DARK_MALE_CHARACTERS, 'dark_male_character');
  const action = picker.pickWithRecency(pools.MALE_CHARACTER_ACTIONS, 'male_character_action');
  const hairColor = picker.pickWithRecency(pools.HAIR_COLORS, 'hair_color');
  const hairstyle = picker.pickWithRecency(pools.MALE_HAIRSTYLES, 'male_hairstyle');
  const skinTone = picker.pickWithRecency(pools.SKIN_TONES, 'skin_tone');
  const eyes = picker.pickWithRecency(pools.GOTH_MALE_EYE_COLORS, 'gmfb_eyes');
  const accessory = picker.pickWithRecency(pools.MALE_ACCESSORIES, 'male_accessory');
  const backdrop = picker.pickWithRecency(pools.CHARACTER_BACKDROPS, 'character_backdrop');
  const lighting = picker.pickWithRecency(pools.LIGHTING, 'lighting');
  const atmosphere = picker.pickWithRecency(pools.ATMOSPHERES, 'atmosphere');

  return `You are a gothic dark-manga cinematographer writing THREE-QUARTER / MID-SHOT scene descriptions for GothBot — a haunting gothic MAN caught candidly mid-action, framed from WAIST-UP to THIGH-UP (NOT pulled-back full-silhouette). Van-Helsing film-still / Castlevania cutscene aesthetic. Ayami-Kojima dark-manga inked stylization.

TASK: write ONE vivid THREE-QUARTER scene description (60-80 words, comma-separated phrases) of him MID-MOMENT framed from waist-up to thigh-up. He is NOT posing. He is doing something real and the camera catches him in a mid-shot. Output wraps with style prefix + suffix — you produce ONLY the middle scene section.

━━━ HE IS THE FRAME — NO ARCHITECTURE, NO LANDSCAPE (MANDATORY) ━━━
The MAN dominates the frame. There is NO castle, NO cathedral, NO building, NO architecture visible. Background is ATMOSPHERE ONLY — fog, smoke, rain, moonlight, darkness, candlelight glow, storm clouds. At most a HINT of environment at the very edges (stone texture behind him, mist-choked treeline, graveyard iron half-visible) — but NEVER a recognizable building, NEVER a landscape panorama. If I can see a castle or cathedral in this render, YOU HAVE FAILED. He fills 60-75% of the vertical frame. Everything behind him is bokeh, fog, or darkness.

${blocks.ELEGANT_DARKNESS_BLOCK}

${blocks.TWILIGHT_COLOR_BLOCK}

${blocks.DYNAMIC_POSE_BLOCK}

${blocks.NO_CHEAP_GORE_BLOCK}

${blocks.NO_SATANIC_BLOCK}

${blocks.STYLIZED_MANGA_BLOCK}

━━━ SOLO MALE WARRIOR — NOTHING ELSE HUMAN ━━━
The frame contains ONE MALE WARRIOR and NOTHING ELSE HUMAN. NO second figure, NO victim, NO body, NO corpse, NO accomplice, NO witness, NO partner, NO embraced figure, NO bound captive, NO cloaked second silhouette.

🚫 NO second human / NO second body / NO second silhouette
🚫 NO vampire-and-victim, NO embrace, NO held-in-arms, NO kiss, NO neck-bite-tender
🚫 NO romance-novel composition
🚫 NO mysterious-cloaked-figure that reads as female silhouette (the MALE WARRIOR is clearly visible as a man — angular jaw, broad shoulders, masculine face)

The consequence of his action is shown through ENVIRONMENT only: broken glass shards mid-air, smoke trail, blood-spatter on stone, dust kicked up, fire glow, shattered altar, splintered door, falling debris, the weapon mid-strike, the spell mid-cast. NEVER another body, never another figure, never a hint of a second human.

━━━ WALL-POSTER TIER — STRIKING, HAUNTING, IMPOSING ━━━
Every render is STRIKING and HAUNTING — imposing in its darkness, commanding in its menace, magnetic in its power. Dark-manga-horror-game-cover quality. Castlevania boss-encounter art, Devil-May-Cry villain splash-page, WoW-death-knight class-art-poster. Wall-poster worthy. Every render reads "this man could end me" — not "this man is pretty."

━━━ THE CHARACTER (use as his core identity — don't contradict) ━━━
${character}

━━━ HIS SKIN ━━━
${skinTone}

━━━ HIS EYES ━━━
${eyes}

━━━ HIS HAIR COLOR ━━━
${hairColor}

━━━ HIS HAIRSTYLE ━━━
${hairstyle}

━━━ HIS WEAPON / ACCESSORY ━━━
${accessory}

━━━ THE CONFIDENT PREDATORY ACTION — HE IS DOING THIS (not posing, not holding weapon aloft) ━━━
${action}

This is a LOADED moment — he is mid-something, charged with intent. Something just happened, or is about to. Film-still-caught-mid-cut, NEVER heroic-poster-pose, NEVER "standing with weapon held above head", NEVER "arms outstretched summoning". The camera is close — waist-up to thigh-up — catching him mid-verb without pulling back to panorama.

⚠️ The story is told through ENVIRONMENT — broken glass mid-air around him, smoke trailing from the weapon, dust kicked up by his boot, blood-spatter on stone behind, fire-light spilling across his face, shards suspended mid-flight, the weapon mid-strike. NOT through a second body or second figure.

━━━ ATMOSPHERIC BACKDROP (behind him — NOT a landscape, NOT architecture) ━━━
${backdrop}

━━━ MASCULINE BEAUTY — HAUNTINGLY BEAUTIFUL MEN ━━━
These men are IMPOSING and STRIKING — jaw structure sharp enough to cut, scarred weathered skin that tells dark stories, eyes that have seen centuries of ruin. Powerful + magnetic + ancient + MENACING. NOT pretty, NOT soft, NOT romantic-lead, NOT YA-love-interest, NOT androgynous. MASCULINE through MENACE + POWER + ANCIENT WEARINESS. Castlevania-boss energy, Van-Helsing movie poster intensity. He is a MAN — rugged, scarred, angular, MALE.

NO LIPSTICK. NO colored lips. NO lip gloss. NO lip tint. His lips are NATURAL — pale, cracked, wind-chapped, or bloodless. The ONLY exception is solid black lips (black-metal aesthetic). Never red, never oxblood, never plum, never wine, never any color on his mouth.

⚠️⚠️⚠️ ABSOLUTE BAN — NO SHIRTLESS / NO BARE-CHEST / NO BISHOUNEN ⚠️⚠️⚠️
He is FULLY CLOTHED. Heavy garments cover his torso completely — leather tunic, plate cuirass, hooded robe, heavy coat, layered armor. NO bare chest, NO bare torso, NO bare midriff, NO bare nipples, NO bare shoulders, NO exposed pectorals, NO exposed abdomen. Even if the character description says "armor fragments" or "cracked armor" or "exposed throat" — RENDER HIM CLOTHED with the armor INTACT covering his chest. Exposed neck is fine; exposed CHEST is FORBIDDEN.

🚫 NO shirtless / topless / bare-chest male
🚫 NO sensual reclining pose / no laying-down-with-hand-on-hip / no chaise-longue draping
🚫 NO bishounen / NO pretty-boy anime aesthetic / NO twink-coded androgyny
🚫 NO smooth-hairless-sculpted bodybuilder torso on display
🚫 NO lace, NO silk-handkerchief, NO silk-trim cuff, NO delicate fabric details (heavy leather / heavy plate / heavy chainmail / heavy wool only)
🚫 NO long-flowing-hair-rippling-romantically (hair is matted / battle-tangled / coiled-tight / shorn — NOT shampoo-commercial flowing)
🚫 NO chest-jewelry-medallion-on-bare-skin compositions
🚫 NO "armor fragments suspended around bare body" — armor is on his body, covering him

If you see his nipples or pectoral muscles or six-pack abs in the render, the render has FAILED. He is a battle-worn warrior in heavy clothing — not a model.

━━━ LIGHTING ON HIS BODY + FACE ━━━
${lighting}

━━━ ATMOSPHERIC BACKGROUND (fog / rain / darkness / moonlight — NO BUILDINGS) ━━━
${atmosphere}

━━━ SCENE-WIDE COLOR PALETTE ━━━
${sharedDNA.scenePalette}

━━━ SECONDARY LIGHTING VIBE ━━━
${sharedDNA.colorPalette}

${blocks.BLOW_IT_UP_BLOCK}

━━━ MOOD CONTEXT (subtle — don't override subject) ━━━
${vibeDirective.slice(0, 250)}

━━━ FRAMING — THREE-QUARTER / MID-SHOT (WAIST-UP TO THIGH-UP) ━━━
Frame him from WAIST-UP to THIGH-UP at most. NEVER pull back to full silhouette. NEVER show his full legs or feet. Background is IMPLIED — atmospheric haze, fog, darkness, rain, colored light from an unseen source. At most a FRAGMENT of environment at the very edge of frame (a stone wall corner, iron fence bar, gnarled branch) but NEVER a recognizable building or landscape. He FILLS 60-75% of the vertical frame.

━━━ FORBIDDEN WORDS + CLICHÉS ━━━
NEVER use "pose", "posing", "editorial", "fashion shoot", "runway", "heroic stance", "holding weapon aloft", "trading card", "RPG character art", "power pose", "full body", "full silhouette". NO "castle", "cathedral", "church", "tower", "spire", "battlement", "courtyard" — those words pull Flux into rendering architecture. NO pretty-boy, NO romantic-lead, NO dapper-gentleman, NO Victorian-dandy. NO pentagrams. NO Artgerm-smooth-digital-art.

⚠️ NEVER write these clothing/fabric words: "shirtless", "topless", "bare-chest", "bare-torso", "exposed pectorals", "lace", "lace cuff", "lace trim", "silk handkerchief", "silk-lined", "delicate fabric", "fragile lace", "armor fragments suspended around body". His chest is ALWAYS COVERED by heavy garment.

━━━ STRUCTURE (write in this order) ━━━
[gothic-horror man archetype, body + skin + eyes + hair + scars visible from waist-up], [caught MID the action described above — specific kinetic verb], [his wardrobe / armor / weapon detail], [lighting illuminating his upper body], [ATMOSPHERIC background only — fog, darkness, rain, colored light — NO BUILDINGS]

Output ONLY the 60-80 word scene description, comma-separated phrases. No preamble, no titles, no headers, no ━━━ or ═══ markers, no **bold**, no "render as" suffix.`;
};
