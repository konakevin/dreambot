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
 *
 * SINGLE UNIFIED FRAME (Kevin 2026-09-09, "no split frames like this"): a
 * render posted from rainy-farmhouse-morning came back as a literal split
 * diptych — a rainy meadow in the top half, a kitchen interior in the
 * bottom half, divided by a hard white bar, rather than one integrated
 * scene. Root-caused via the agent's own build log: whenever a scene
 * combines an interior with something visible beyond a window/doorway,
 * Sonnet sometimes composes it as two described "zones" ("a window
 * dominates the upper portion... inside, [X]...") which reads to Flux as
 * comic-panel instructions rather than one continuous depth-of-field shot.
 * Fixed with an explicit, POSITIVE structural instruction below (describing
 * the composition Flux SHOULD produce, not naming "split" or "panel" to ban
 * them — same positive-only discipline as the rest of this fragment).
 *
 * HUE FREEDOM (Kevin 2026-09-09): a review of the whole render grid showed
 * a strong, consistent golden/amber wash across nearly every render,
 * independent of scene or weather. Root cause: this fragment previously
 * said "even where the light is soft, dreamy, or gentle, the palette
 * itself stays warm and colorful" — an UNCONDITIONAL instruction toward
 * warm hues on literally every render, applied straight into the final
 * Flux prompt with no per-scene override (see WRITTEN POSITIVE-ONLY above
 * — this fragment bypasses Sonnet entirely, so there's no filter to catch
 * an over-broad rule before Flux sees it). Compounded by
 * farmbot_weather_atmosphere.json itself skewing 14/25 warm-dominant vs.
 * 5/25 cool — see that file's rebalance note. Fixed here by keeping the
 * "vibrant, richly saturated, never washed out" intent (the actual original
 * ask) but dropping the hard lock to warm specifically — a vivid blue,
 * green, or violet scene should be exactly as richly saturated as an amber
 * one. Let hue follow the scene/weather/look freely; only saturation and
 * richness are the fixed rule.
 *
 * TRIMMED 276 → 45 WORDS (2026-09-30, Kevin: "clean up farmbot's prompt
 * length"). This fragment sits at word 4 of EVERY render, so the old rules
 * block pushed the rolled look to ~word 280 and the scene's subject to ~word
 * 320, and prompts ran 514-908 words; details past ~word 600 (a quilt, a
 * rocking chair) never rendered. Flux can't follow instructions ("render
 * exactly what it names… nothing beyond it", "the look register above sets
 * the style"), so those sentences only spent the front of the prompt. What
 * each old sentence was FOR is kept: the tone + handcrafted world + saturated
 * scene-led colour + one continuous frame + cute characters stay here as
 * picture words; the two writer instructions (complete cast list,
 * interior-with-a-window as one shot) moved to lookOverride() below, where
 * Sonnet actually obeys them. The character line is load-bearing: a first
 * trim without it drew mature bishonen adults on 4 of 6 character renders
 * (the 2026-09-09 defect above), because the look register's "cute
 * proportions" alone doesn't hold it. "photograph-like" was dropped (a photo
 * prior on an illustration bot). See BOT_SCENE_QUALITY_PLAYBOOK.md §5.1
 * (position) and §5.2 (length).
 */
const FARMBOT_COZY_NEUTRAL =
  "cute storybook farm-life illustration, a small handcrafted old-fashioned countryside world, vibrant richly saturated color in the scene's own hues, one continuous scene with natural depth, every character cute and round-cheeked with big joyful sparkling eyes and a cheerful expression, like a gentle children's picture book";

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

The sections below are the complete cast: include only the people and
animals they name. If the scene is indoors with a window or doorway, write
it as one continuous room with the outside seen softly through the opening.

`;
}

/**
 * Appended to EVERY FarmBot brief by index.js buildBrief (2026-09-30). FarmBot
 * was the only bot whose briefs stated no word count, so Sonnet wrote 500-900
 * words and Flux only reliably renders what sits early in the prompt (playbook
 * §5.1-5.2). Most bots say "110-140 WORDS, COUNT THEM"; FarmBot's briefs carry
 * more sections (food, animal, character, activity, setting, camera), so a
 * little more room. The order line puts the subject right after the style
 * words, where it renders most reliably.
 */
const FARMBOT_LENGTH_RULE = `

Write the Flux prompt as ONE flowing paragraph of 120-160 WORDS, COUNT THEM.
Begin with the art-style words, then the main subject and what is happening,
then the setting, light and camera. Describe only what IS in the picture.`;

module.exports = { FARMBOT_COZY_NEUTRAL, FARMBOT_LENGTH_RULE, lookOverride };
