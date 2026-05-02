/**
 * AncientBot — shared prose blocks.
 *
 * Monumental oil-painting renderings of ancient civilizations (pre-600 BC).
 * Arnold-Friberg-scale grandeur. People as background texture only.
 */

const PROMPT_PREFIX =
  'lush monumental oil painting, ancient civilization, dramatic lighting, epic architectural scale, painterly detail, archaeological reconstruction';

const PROMPT_SUFFIX =
  'no modern elements, no text, no words, no watermarks, no fantasy creatures, no magic, painterly masterpiece quality';

const ANCIENT_WORLD_BLOCK = `━━━ THE ANCIENT WORLD ━━━

This is the REAL ancient world — pre-1000 AD pre-modern global civilizations from across every continent. Bronze Age, Iron Age, Classical Antiquity, and the great early-medieval Asian / African / Pre-Columbian / Pacific civilizations all qualify. The test: does it feel mythic-ancient and pre-industrial? If yes, it qualifies.

Every detail must be archaeologically plausible. Use period-appropriate materials (mud-brick, limestone, sandstone, granite, jade, bronze, copper, iron-where-appropriate, cedar, acacia, lacquered wood, papyrus, vellum, painted plaster, gold leaf, lapis lazuli, carnelian, jadeite, obsidian) and period-appropriate construction techniques (corbel-arches, post-and-lintel, ziggurat-stepping, Chinese tou-kung bracketing, Khmer corbel-vault, Mesoamerican pyramid-platform, Roman concrete-and-brick, Persian iwan).

The goal is AWE — the viewer should feel transported deep into the past, standing before something monumental that real human hands built. NOT fantasy. NOT European medieval (no knights, no plate armor, no flying buttresses, no stained glass). NOT modern.`;

const HUMAN_ACTIVITY_BLOCK = `━━━ BACKGROUND HUMAN ACTIVITY ━━━

People are BACKGROUND TEXTURE only — tiny figures at architectural scale giving the scene LIFE. Merchants with laden donkeys, priests in ceremonial linen, laborers hauling stone, children running through market stalls, soldiers at distant gates, women carrying water jars. Dozens of figures each doing something specific, all TINY against the architecture. NEVER a subject, NEVER closeup, NEVER centered, NEVER named. Like a Bruegel painting — the WORLD is the subject, the people are just proof it's alive.`;

const MONUMENTAL_SCALE_BLOCK = `━━━ MONUMENTAL SCALE ━━━

These civilizations built to impress GODS. Temples rise above treelines. Ziggurats dominate entire city skylines. Columns are 40 feet tall. Statues are colossal — carved from single blocks of granite, painted in vivid pigments, inlaid with precious stone eyes that catch the light. The viewer should feel the WEIGHT of 4000 years of human ambition in every frame. Architectural details rendered obsessively — every carved relief, every painted column capital, every bronze door-fitting, every glazed brick pattern.`;

const BLOW_IT_UP_BLOCK = `━━━ BLOW IT UP — MAXIMUM GRANDEUR ━━━

Push EVERYTHING to maximum. Layer atmospheric depth — heat shimmer, incense smoke drifting through colonnades, dust caught in light shafts, river mist softening distant architecture. Stack architectural details in every inch of the frame. The lighting should be THEATRICAL — never flat, never dull. But NOT every scene needs to be a color explosion — some should be subtle, quiet, just beautiful natural light on ancient stone. Let the SCENE PALETTE below guide the color temperature. Every frame should make someone stop scrolling and zoom in to explore.`;

const PERIOD_ACCURACY_BLOCK = `━━━ PERIOD ACCURACY — HARD BANS ━━━

- NO European-medieval elements (NO knights in plate armor, NO flying buttresses, NO Gothic stained glass, NO pointed-arch cathedrals)
- NO industrial-modern materials (NO modern steel beams, NO modern concrete, NO float glass, NO plastic)
- NO fantasy magic (NO dragons, NO glowing runes, NO floating objects, NO wizards)
- NO modern clothing, NO modern infrastructure (NO cars, NO power-lines, NO asphalt)

PERIOD-APPROPRIATE materials by era and region:
- Mesopotamian / Egyptian: mud-brick, fired brick, limestone, sandstone, granite, cedar, acacia, bronze, copper, gold, lapis lazuli, carnelian, alabaster, reed, papyrus, bitumen
- Greco-Roman: marble, travertine, brick, Roman-concrete (opus caementicium), bronze, iron, terracotta, painted plaster, mosaic
- East Asian (China/Japan/Korea): rammed-earth, fired-brick, hand-shaped tile, lacquered cedar/cypress, jade, jadeite, bronze, iron, gold, painted silk, paper-and-wood lattice screens
- Khmer / SE Asian: laterite, sandstone, brick, palm-thatch, lacquered teak, gilded bronze
- Pre-Columbian: limestone, andesite, basalt, jade, jadeite, obsidian, gold, turquoise, painted stucco, woven feathers
- Persian: glazed tile, fired brick, stone, painted gypsum, gold inlay
- Norse / Celtic: timber, thatch, iron, bronze, antler, leather
- African (Aksum, Mali, Zimbabwe): hewn-stone (Aksumite stelae), mud-brick (Mali), drystone (Zimbabwe), gold, ivory
- Polynesian: basalt (Easter Island), volcanic stone, palm-thatch, woven mats, carved wood`;


const PAINTERLY_HISTORICAL_BLOCK = `━━━ PAINTERLY HISTORICAL REGISTER (LOCK) ━━━

The render IS a painting. Visible brushwork, painterly edges, museum-canvas surface. Concept-art-painting / matte-painting / illustrated-history-book / National-Geographic-painting / oil-on-board / Met-Museum-canvas register ONLY. The image should look hand-painted by an academic master OR a great book-cover illustrator.

Hard bans on the wrong register: NEVER photoreal-tourist-snapshot, NEVER 3D-render-archaeology-reconstruction, NEVER cheap-Hollywood-stage-set, NEVER drone-footage-aesthetic, NEVER video-game-screenshot, NEVER AI-rendered-glossiness.`;

const IMPOSSIBLE_BEAUTY_ANCIENT_BLOCK = `━━━ IMPOSSIBLE BEAUTY — ANCIENT EDITION ━━━

Smithsonian-magazine-cover × 10. Met-Museum exhibition-catalog-cover quality. The kind of painting commissioned for a National-Geographic-Society retrospective on lost civilizations. Wall-poster gorgeous — the kind of image someone would buy as a print and frame above their desk. Dense detail, masterful composition. Every render is the chapter-opener illustration of a great history book.`;

module.exports = {
  PROMPT_PREFIX,
  PROMPT_SUFFIX,
  ANCIENT_WORLD_BLOCK,
  HUMAN_ACTIVITY_BLOCK,
  MONUMENTAL_SCALE_BLOCK,
  BLOW_IT_UP_BLOCK,
  PERIOD_ACCURACY_BLOCK,
  PAINTERLY_HISTORICAL_BLOCK,
  IMPOSSIBLE_BEAUTY_ANCIENT_BLOCK,
};
