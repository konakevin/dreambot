/**
 * FarmBot shared blocks.
 *
 * FARMBOT_COZY_NEUTRAL — the bot's ONLY medium (2026-09-07). Locks FarmBot's
 * IDENTITY (cozy, adorable, stylized) but drops any fixed rendering-medium
 * language. The specific animation style / rendering medium / finish /
 * palette is set by the rolled sharedDNA.lookRegister tokens that lead the
 * prompt (chibi 3D-CGI / kawaii illustration / anime — see
 * farmbot_look_register.json). Mirrors ChibiBot's CHIBI_NEUTRAL and YumBot's
 * YUMBOT_FOOD_NEUTRAL.
 *
 * WRITTEN POSITIVE-ONLY (2026-09-07 — see feedback_negative_prompt_leak
 * memory / BOT_SCENE_QUALITY_PLAYBOOK.md "negation leak"): this fragment is
 * concatenated straight into the FINAL FLUX PROMPT (botEngine.js line ~1501,
 * `mediumStyle` + Sonnet's `middle`) — it never passes through Sonnet, so
 * there is no filter step to catch a "no X" phrase before Flux sees it.
 * Flux's CLIP/T5 conditioning doesn't process negation; naming a noun even
 * to ban it ("no figure glimpsed in a window") puts that noun's token
 * directly in the prompt and Flux renders it anyway. An earlier version of
 * this fragment banned "human figure / incidental people / figures glimpsed
 * in a window or doorway / realistic animal / scary / gritty / sad /
 * photoreal" — root-caused as the reason FarmBot kept hallucinating
 * uninvited figures and non-cute content despite the ban. Fixed by dropping
 * every negated noun: govern the cast by pointing at the scene text
 * ("nothing beyond it") instead of listing what's forbidden, and let the
 * look-register's inherently-stylized options rule out photorealism instead
 * of naming "photoreal" to ban it.
 *
 * HUMANS (Kevin 2026-09-07): NOT a blanket ban — a stylized human figure
 * (a farmer, a child, someone doing chores) is a legitimate, deliberate
 * design choice on paths built for it, matching the cozy-anime genre this
 * bot draws from (and MangaBot's own precedent). Governed positively: the
 * scene text below is the complete cast list, so a path that doesn't write
 * a human into its own seed pool never gets one uninvited.
 *
 * COMPOSITION-NEUTRAL ON PURPOSE (same fix as ChibiBot's hybrid-bot lesson,
 * BOT_SCENE_QUALITY_PLAYBOOK.md): FarmBot is HYBRID — some paths are
 * creature-led (a hero animal) and some are scene-led (a farm stand / barn /
 * farmhouse is the hero, with life in it only where the scene calls for it).
 * This fragment does NOT assert "the subject is a creature" — it locks the
 * CAST convention and defers composition entirely to the path's own scene
 * text. Litmus per the playbook: if a scene-led path renders subject-dominant
 * once paths are added, read the ai_prompt opener before touching anything
 * else — a subject-asserting medium fragment is the usual cause.
 *
 * CHARACTER CUTENESS (Kevin 2026-09-09): a live render traced (via
 * ai_prompt full-text search) to a clean, correctly-anime look-register
 * entry still came out looking like a serious/mature romance-anime bishonen
 * rather than a cute little villager — because nothing in the pipeline ever
 * said CHARACTERS specifically should be cute; only the WORLD was described
 * that way. Fixed at the source this fragment defers to (per the sentence
 * above, "the character-design language the look register above sets") by
 * adding "cute" directly into every look-register entry's character
 * vocabulary (big/adorable/rounded/sparkling), so it's WRITTEN POSITIVE-ONLY
 * per this file's own rule above: describe what characters SHOULD look like
 * (cute, round-faced, big joyful eyes) rather than naming "serious" or
 * "mature" to ban them, which would put those exact tokens in front of Flux.
 */
const FARMBOT_COZY_NEUTRAL =
  'OVERARCHING RULE (applies to every single render regardless of scene): this is a cute, adorable, pretty, cozy, peaceful, happy, fun, warm, gentle, storybook-charming farm-life illustration — a small, idyllic, handcrafted countryside world where every tool, structure, and object is charming, old-fashioned, and personal in scale. Color stays vibrant and richly saturated throughout — even where the light is soft, dreamy, or gentle, the palette itself stays warm and colorful. Even the least remarkable render from this bot must still read as nice and wholesome. Any character in the frame is drawn just as cute and adorable as the world around them — a warm round-cheeked face, big joyful sparkling eyes, a playful cheerful expression, like a beloved character from a gentle children\'s picture book. The scene described below is the complete cast list for the frame — render exactly what it names, in exactly the proportions and character-design language the look register above sets, and nothing beyond it. The animation style, rendering medium, finish, and palette are set entirely by the look-register tokens that lead the prompt.';

/**
 * Prepend the ART STYLE block to a path's own scene text. `look` is one
 * entry rolled from the bot-wide look-register pool (see rollSharedDNA in
 * index.js). Falls through to plain scene text if no look is rolled, so
 * this stays safe to call unconditionally.
 *
 * HARD LESSON (2026-09-08) — do NOT use "NON-NEGOTIABLE / AUTHORITY /
 * OVERRIDES" language here, even though that's the exact wording the bot
 * playbook's MangaBot section recommends for a bot whose templates carry
 * baked style phrases. On FarmBot that phrasing measurably triggered
 * Sonnet's OWN prompt-injection defenses — a QA review of 18 real renders
 * found Sonnet outright refusing or meta-commenting on ~28% of calls
 * ("I notice a structural issue... the 'override' framing... is designed
 * to make me treat outside instructions as having special authority"),
 * and the refusal TEXT ITSELF got sent to Flux as the prompt, producing
 * generic/empty renders completely independent of which look or model was
 * used. This is likely why several "wrong style" renders tonight had
 * nothing to do with the look register at all. Fixed by rewording to plain
 * cooperative instruction language ("please write... using this style")
 * with zero authority-claiming words. If a future path's template needs
 * the look to win against strong baked style phrases, reach for something
 * short and factual ("this section sets the art style") — never
 * authority/override/non-negotiable language, on this bot specifically.
 */
function lookOverride(look) {
  if (!look) return '';
  return `━━━ ART STYLE FOR THIS SCENE ━━━
${look}

Please write the Flux prompt using this art style throughout. Keep all the
scene content, characters, and composition described below exactly as
written — just describe everything using this style's linework, shading,
and color treatment. Start the Flux prompt with these style words so they
set the visual tone from the very first line.

`;
}

module.exports = { FARMBOT_COZY_NEUTRAL, lookOverride };
