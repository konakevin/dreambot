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

This is the REAL ancient world — pre-600 BC. Bronze Age and earlier. These civilizations ACTUALLY EXISTED. Every detail must be archaeologically plausible: mud-brick and limestone walls, cedar and acacia timber, bronze and copper tools, lapis lazuli and carnelian inlay, gold leaf on carved reliefs, alabaster vessels, reed-and-bitumen waterproofing, painted plaster walls in vivid mineral pigments.

The goal is AWE — the viewer should feel transported 4000 years into the past, standing before something monumental that real human hands built. NOT fantasy. NOT medieval. NOT Roman or Greek classical. OLDER.`;

const HUMAN_ACTIVITY_BLOCK = `━━━ BACKGROUND HUMAN ACTIVITY ━━━

People are BACKGROUND TEXTURE only — tiny figures at architectural scale giving the scene LIFE. Merchants with laden donkeys, priests in ceremonial linen, laborers hauling stone, children running through market stalls, soldiers at distant gates, women carrying water jars. Dozens of figures each doing something specific, all TINY against the architecture. NEVER a subject, NEVER closeup, NEVER centered, NEVER named. Like a Bruegel painting — the WORLD is the subject, the people are just proof it's alive.`;

const MONUMENTAL_SCALE_BLOCK = `━━━ MONUMENTAL SCALE ━━━

These civilizations built to impress GODS. Temples rise above treelines. Ziggurats dominate entire city skylines. Columns are 40 feet tall. Statues are colossal — carved from single blocks of granite, painted in vivid pigments, inlaid with precious stone eyes that catch the light. The viewer should feel the WEIGHT of 4000 years of human ambition in every frame. Architectural details rendered obsessively — every carved relief, every painted column capital, every bronze door-fitting, every glazed brick pattern.`;

const BLOW_IT_UP_BLOCK = `━━━ BLOW IT UP — MAXIMUM GRANDEUR ━━━

Push EVERYTHING to maximum. Layer atmospheric depth — heat shimmer, incense smoke drifting through colonnades, dust caught in light shafts, river mist softening distant architecture. Stack architectural details in every inch of the frame. The lighting should be THEATRICAL — never flat, never dull. But NOT every scene needs to be a color explosion — some should be subtle, quiet, just beautiful natural light on ancient stone. Let the SCENE PALETTE below guide the color temperature. Every frame should make someone stop scrolling and zoom in to explore.`;

const PERIOD_ACCURACY_BLOCK = `━━━ PERIOD ACCURACY — HARD BANS ━━━

- NO medieval elements (castles, knights, pointed arches, stained glass, plate armor)
- NO Roman/Greek classical architecture (Corinthian columns, marble temples, amphitheaters)
- NO pointed arches, NO flying buttresses, NO glass windows
- NO steel, NO concrete, NO iron (this is the BRONZE Age)
- NO fantasy magic, NO dragons, NO glowing runes, NO floating objects
- NO modern clothing, NO modern materials
- Materials MUST be period-accurate: mud-brick, fired brick, limestone, sandstone, granite, cedar, acacia, bronze, copper, gold, lapis lazuli, carnelian, alabaster, reed, papyrus, bitumen, obsidian, flint`;

module.exports = {
  PROMPT_PREFIX,
  PROMPT_SUFFIX,
  ANCIENT_WORLD_BLOCK,
  HUMAN_ACTIVITY_BLOCK,
  MONUMENTAL_SCALE_BLOCK,
  BLOW_IT_UP_BLOCK,
  PERIOD_ACCURACY_BLOCK,
};
