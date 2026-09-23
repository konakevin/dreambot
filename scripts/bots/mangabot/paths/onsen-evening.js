/**
 * MangaBot onsen-evening path (2026-09-22) — MangaBot's first ONSEN register.
 *
 * THE SOUL OF THE PATH:
 *   Evening at an OPEN-AIR hot-spring bath (rotenburo) at a traditional inn.
 *   Thick banks of lit steam rolling over the rim of a pool that sits somewhere
 *   worth travelling to — a cliff shelf above a sea of cloud, a rooftop over a
 *   lit valley, a snowfield with one torii at its rim, a boulder mid-river — and
 *   behind it the inn itself as a lantern-box of warm glowing paper screens in
 *   the blue evening. Snow falling into hot water. Snow monkeys in the bath.
 *   STEAM IS THE HERO MATERIAL and the bath is the hero subject.
 *
 * WHY IT EXISTS (the gap): across MangaBot's 25 live paths there is no onsen,
 *   no ryokan, no bathing and no steam register at all — steam appears only as
 *   one item in the bot-wide DENSITY_BLOCK's atmosphere list, never as a hero.
 *   Its cosy paths are all DAY or STREET (slice-of-life urban, rooftop-sunsets,
 *   beach-episode, cherry-blossom, festival-nights crowd) and winter-anime
 *   covers snow as streets/shrines/festivals. Nothing in the roster can make the
 *   single most iconic warm-Japanese-evening picture there is, and nothing can
 *   produce snow monkeys in a bath.
 *
 * LOOK-ENABLED (route to mangabot_anime_neutral). The four look-EXCLUDED paths
 *   (ghibli-countryside / ghibli-painterly / slice-of-life / samurai-era) are
 *   excluded because a fixed STYLE is their identity. This path's identity is a
 *   PLACE plus a CONDITION (evening, open air, steam), not a style, so a rolled
 *   look never fights it: watercolour Ghibli, Shinkai god-rays through steam,
 *   90s OVA cel, flat gouache poster and dreamy pastel all suit a lantern-lit
 *   bath equally. And the look register is what keeps 2 posts/day of "warm amber
 *   steam" from going samey, which a single-place cosy path needs most. Note the
 *   path is deliberately kept OUTDOOR so it never meets the playbook's
 *   interior-look trap ("on an interior path the rolled look decides whether the
 *   room exists").
 *
 * FUNCTION-FORM + SELF-CONTAINED (the ToyBot Stage-O / FaeBot apothecary
 *   pattern): this file loads its own eight seed JSONs and inlines its whole
 *   brief. It touches NO shared bot file — no pools.js entry, no archetypes.js
 *   entry, no archetype-templates.js entry. Registration is the block at the
 *   bottom of this file.
 *
 * 8 AXES (6 always-on, charm picked twice, 2 gated):
 *   - bath          ★ HERO. The pool's own mass, then the extraordinary place
 *                     it sits in. Season-neutral and light-free by contract.
 *   - steam_light   ★★ THE MONEY SHOT. What the steam does, what lights it, and
 *                     the palette it brings. Place-agnostic by construction.
 *   - inn             the ryokan behind as a lit lantern-box, in ONE continuous
 *                     outdoor shot, carrying the plain-surface law.
 *   - charm    ×2     the hand-made props. Density without another slot.
 *   - air             the season + what the air is doing. Axis-clean.
 *   - camera          HAND-AUTHORED, audited as a set (see below).
 *   - wildlife  0.45  the ONLY axis that may contain an animal.
 *   - bather    0.55  the ONLY axis that may contain a figure.
 *
 * THE SIX TRAPS THIS PATH IS BUILT AGAINST (all playbook-documented):
 *   1. THE DULL VERSION. A plain steaming pool at dusk is pretty, generic and
 *      indistinguishable from a thousand anime backgrounds — clean, defect-free
 *      and a MISS. The cure is a pool-register decision, not a template one:
 *      the bath pool is 25 places worth travelling to, steam_light carries a
 *      VIVID LAW (two named colours, half warm-against-cool), charm carries a
 *      CHARM LAW (one clever detail per entry) and wildlife carries comic
 *      timing.
 *   2. READABLE TEXT. An inn means signage — noren curtains, lantern faces, a
 *      plank by the door, eave boards — and the surface you FORGET to describe
 *      is the one that gets lettering. Every inn entry names at least one flat
 *      panel as plain or as carrying one small painted picture, AND the
 *      plain-surface clause sits inside the REQUIRED OUTPUT ORDER below, not in
 *      a rules block: Sonnet writes only what the order tells it to write.
 *   3. THE SPLIT-PANEL TRAP. An interior plus an outdoor view renders as a
 *      hard-divided two-zone image. This path is never an interior: it is ONE
 *      continuous open-air shot with the inn's lit windows inside the same
 *      frame, stated positively. "Split" and "panel" are never named.
 *   4. THE CAMERA POOL AS A HARD-FAIL GENERATOR. A single axial, plan-view or
 *      body-part-macro camera entry out-votes every mandate in a template, and
 *      Sonnet-generated camera pools leak time-of-day, weather, hero type and
 *      posture verbs (a posture verb renders a PERSON in that posture). The
 *      camera pool here is hand-authored, hero-agnostic, posture-verb-free, and
 *      every entry carries an ANGLE word so the inn never renders as a dead
 *      mirrored facade.
 *   5. THE TASTE LINE. A hot-spring bath is handled the way wholesome family
 *      anime handles one. Every bather entry states ONE covering (to the
 *      shoulders in the water / wrapped in a white cotton towel / dressed in a
 *      cotton robe and sash), never layers one garment over another (the proven
 *      beach-episode cheesecake-trigger phrasing), never describes a body, and
 *      carries an explicit small-size word. The cast is mixed in age and kind,
 *      which is the strongest anti-cheesecake lever there is. nudityCheck is
 *      wired as the backstop.
 *   6. NEGATION LEAK. CLIP cannot negate, so the brief describes only what IS
 *      present. The no-figure and no-animal branches are written as POSITIVE
 *      states of the bath, never as "nobody is there".
 *
 * TWO CONDITIONS ARE NAMED IN THE EMITTED PROMPT, not merely implied — a path
 *   whose identity is a CONDITION must state it (the campfire-night lesson):
 *   (a) it is EVENING/night, and (b) it is OPEN-AIR. Both lead the output order.
 *
 * CONFIG NOTES (see the registration block at the bottom):
 *   - mediumByPath → mangabot_anime_neutral (look-enabled).
 *   - modelByPath excludes flux-1.1-pro-ultra: the playbook records it as a
 *     standing exclusion for any path whose identity is a LIGHTING CONDITION
 *     (it reverts to a golden-hour exterior and signs its work).
 *   - sensoryAnchors MUST skip this path. MangaBot's scene `lightcolor` pool
 *     carries SETTING NOUNS ("the manga aisle corner", "the late-night parking
 *     lot", "the underground tunnel entrance") — a second-scene injection that
 *     would also out-vote the money-shot light axis.
 *   - twoPassPolish MUST skip (Haiku strips the camera, continuity, plain-
 *     surface and covering rules when compressing).
 *   - chaos MUST skip — chaos is enabled bot-wide on MangaBot.
 *   - sharedDNA.colorPalette is deliberately NOT used: steam_light owns the
 *     palette, and a fixed vibe colour-cast would override the rolled light.
 *   - No promptPrefixByPath — the wrapper-strip lesson says default to empty.
 */

const fs = require('fs');
const nodePath = require('path');

function load(name) {
  return JSON.parse(
    fs.readFileSync(nodePath.join(__dirname, '..', 'seeds', `${name}.json`), 'utf8')
  );
}

const BATH = load('onsen_evening_bath');
const STEAM_LIGHT = load('onsen_evening_steam_light');
const INN = load('onsen_evening_inn');
const CHARM = load('onsen_evening_charm');
const AIR = load('onsen_evening_air');
const CAMERA = load('onsen_evening_camera');
const WILDLIFE = load('onsen_evening_wildlife');
const BATHER = load('onsen_evening_bather');

const WILDLIFE_GATE = 0.45;
const BATHER_GATE = 0.55;

// Look-override header. Deliberately worded COOPERATIVELY rather than reusing
// archetype-templates.js `lookOverride()`'s "NON-NEGOTIABLE / AUTHORITY /
// OVERRIDES" wording: the playbook's FarmBot amendment measured that phrase
// family triggering Sonnet's own injection defences on ~28% of calls, and this
// template carries NO baked style phrases for a look to have to beat (the
// mangabot_anime_neutral medium explicitly defers style to the look), so the
// authority wording buys nothing here and costs refusal risk.
function lookLead(sharedDNA) {
  if (!sharedDNA || !sharedDNA.lookRegister) return '';
  return `━━━ THE ART STYLE FOR THIS RENDER ━━━
${sharedDNA.lookRegister}

Please write the whole Flux prompt in this art style, and open the prompt with these style words so they set the visual treatment from the very first line. Keep every piece of scene content and every rule below exactly as written — just render all of it in this style.

`;
}

module.exports = ({ sharedDNA, vibeDirective, picker }) => {
  const bath = picker.pickWithRecency(BATH, 'onsen_bath');
  const steamLight = picker.pickWithRecency(STEAM_LIGHT, 'onsen_steam_light');
  const inn = picker.pickWithRecency(INN, 'onsen_inn');
  const charmA = picker.pickWithRecency(CHARM, 'onsen_charm');
  const charmB = picker.pickWithRecency(CHARM, 'onsen_charm');
  const air = picker.pickWithRecency(AIR, 'onsen_air');
  const camera = picker.pickWithRecency(CAMERA, 'onsen_camera');
  const wildlife =
    Math.random() < WILDLIFE_GATE ? picker.pickWithRecency(WILDLIFE, 'onsen_wildlife') : null;
  const bather =
    Math.random() < BATHER_GATE ? picker.pickWithRecency(BATHER, 'onsen_bather') : null;

  const charm = charmB && charmB !== charmA ? `${charmA}\n${charmB}` : charmA;

  const wildlifeSection = wildlife
    ? `
━━━ 7. THE ANIMAL (small, and the best joke in the picture) ━━━
${wildlife}

Keep it exactly the size the entry says. Each animal is a whole real animal with a real animal's head, body and face — never part-human, never upright and talking, never dressed.
`
    : '';

  const batherSection = bather
    ? `
━━━ 8. THE ONE GUEST (small, covered, and busy with something) ━━━
${bather}

Keep the guest exactly the size the entry says and covered exactly the way the entry says — to the shoulders in the water, or wrapped in a white cotton towel, or dressed in a cotton robe with a sash. One covering only, described plainly, nothing layered over anything. This is a warm, wholesome family scene.
`
    : `
━━━ 8. THE BATH BETWEEN GUESTS ━━━
The bath has it to itself this moment: the water turning slowly where the inflow lands, the steam going up off the whole surface, and the small things around the rim sitting exactly where somebody set them down.

Should you place any figure here at all, that figure is covered — sunk to the shoulders with only head and shoulders above the surface, or wrapped in a white cotton towel, or dressed in a cotton robe with a sash — small, and busy with something quiet.
`;

  return `${lookLead(sharedDNA)}You are an anime background painter writing ONE Flux prompt for an EVENING at an OPEN-AIR Japanese hot-spring bath — a rotenburo at a traditional mountain or coastal inn. Register anchors for YOU only, never written into the output: the warmth of a Ghibli bath-house, the winter-onsen trips of a cosy camping anime, the mountain quiet of a folk-tale anime.

━━━ THE FIVE THINGS THAT MAKE THIS PICTURE ━━━
1. EVENING, OUTDOORS, AT THE BATH — say so in the first words of the prompt. Open sky overhead, and every light is a made light or the moon. Never an indoor room, never a tiled bathroom, never a view out through a window. ONE continuous outdoor shot: the pool near, its setting around it, the inn's lit windows further back, all in the same unbroken frame.
2. THICK STEAM IS THE HERO MATERIAL — banks of white steam standing over the whole surface of the water, rolling over the rim and climbing to veil the far side. Never a thin wisp. The pool owns 40-60% of the frame, in deep focus front to back.
3. SOMEWHERE WORTH TRAVELLING TO, in saturated committed colour, a warm light source set against the cold blue of the evening. A plain pool at dusk is a failure.
4. EVERYONE IN THE BATH IS COVERED. Whoever is in frame — whether the scene below names them or not — is either sunk in the water to the shoulders with only head and shoulders above the surface, or wrapped in a white cotton towel, or dressed in a cotton robe with a sash. One covering each, named plainly. Never describe a body. This is a warm wholesome family scene, and steam is the warm air over hot water, never a veil over anyone.
5. EVERY FLAT PANEL IS PLAIN OR CARRIES ONE SMALL PAINTED PICTURE — the entry curtain, the round lantern faces, the plank by the doorway, the eave boards, the fan's paper face, the buckets, the trays and the towels. Above the entrance the lintel is FULL — a row of round paper lanterns strung across it, or a hanging bough of pine, or a bundle of bamboo, or snow heaped along the eave with icicles hanging from it. Something is always hanging there, and it is never flat and never rectangular. The WALL to either side of the doorway is bare smooth timber and plaster, left empty. Whichever panel you leave undescribed is the one that comes back wrong, so describe them all. A picture is only a sprig, leaf, circle, wave, moon, mountain outline, pine or crane.
6. IF THE SEASON DOES NOT SUIT THE PLACE, KEEP THE PLACE and write the air as the plain still evening air there instead.

★━━━ 1. THE BATH (the hero) ━━━
${bath}

★★━━━ 2. THE STEAM AND THE LIGHT (the money shot — it owns the palette) ━━━
${steamLight}

Commit to this light and to both its colours, named on the surfaces they land on. Light is a glow, a patch, a pool or a soft shaft on a real thing; steam is a bank, a drift, a veil, a roll or a low haze — never a solid column, wall, bar or ribbon.

━━━ 3. THE INN BEHIND (further back, smaller, turned) ━━━
${inn}

━━━ 4. THE SMALL THINGS AT THE RIM ━━━
${charm}

━━━ 5. THE AIR AND THE SEASON ━━━
${air}

━━━ 6. THE CAMERA (apply the position, distance and angle exactly) ━━━
${camera}

Never a portrait, never a face, never a close view of a hand or an object, never a straight-down or straight-on symmetrical view.
${wildlifeSection}${batherSection}
━━━ MOOD ━━━
${vibeDirective ? String(vibeDirective).slice(0, 90) : ''}

━━━ LENGTH IS THE FIRST RULE — 95-120 WORDS. COUNT THEM. ━━━
Write ONE line of comma-separated phrases, ONE phrase per bracket below, in exactly this order, then STOP. Anything not on this list gets cut, and every phrase is trimmed to its essentials to make the count. A tight 110-word scene beats a crammed 300-word inventory.
[EVENING, OPEN-AIR JAPANESE HOT-SPRING BATH, named plainly together with the rolled light],
[the pool itself — its mass, rim and material — and the place it sits in],
[THICK BANKS OF STEAM standing over the water and rolling over the rim, and both colours the light brings, on the surfaces they land on],
[the inn further back and turned, its warm lit windows],
[its entry curtain, its lantern faces, its doorway plank and its eave boards — every one of them plain and smooth, or carrying one small painted picture and nothing else — with the lintel above the entrance FULL of round lanterns or a hanging pine bough or snow and icicles along the eave, nothing flat or rectangular up there, and the bare empty smooth wall to either side of the doorway],
[the small hand-made things at the rim, their faces and sides plain and unmarked],
[the air and the season],${wildlife ? '\n[the small animal],' : ''}${
    bather
      ? '\n[the one small guest, covered exactly as written],'
      : '\n[that this is a wholesome family bath, and that any bather in it is small and covered — to the shoulders in the water, or wrapped in a white cotton towel, or dressed in a cotton robe],'
  }
[the camera position, distance and angle].

Describe only what IS present — every phrase names something in the picture, never something absent or avoided. No preamble, no headers, no markers, no bullets, no bold labels.`;
};

/*
 * ── REGISTRATION (merge into scripts/bots/mangabot/index.js) ─────────────────
 *
 *  1. pathBuilders:
 *       'onsen-evening': require('./paths/onsen-evening'),
 *
 *  2. shadowPaths (currently `[]`):
 *       shadowPaths: ['onsen-evening'],
 *
 *  3. mediumByPath — add (LOOK-ENABLED):
 *       'onsen-evening': 'mangabot_anime_neutral',
 *
 *  4. modelByPath — add (array = uniform random pick). MEASURED over 24 renders,
 *     reading the model STAMPED on each upload, not the picked value:
 *       - flux-2-pro + flux-2-max: 14 renders, zero taste-line failures, zero
 *         steam failures, best look fidelity. These two hold the path.
 *       - flux-1.1-pro (4 renders): back-fills BARE-BACKED bathers into a pool
 *         where the brief named none, and drifts to a full daylight sunset.
 *       - flux-dev (4 renders): renders the pool with NO STEAM in 3 of 4, which
 *         turns a hot spring into a cold swimming pool.
 *       - flux-1.1-pro-ultra: excluded a priori — the playbook records it as a
 *         standing exclusion for any path whose identity is a lighting condition.
 *       'onsen-evening': [
 *         'black-forest-labs/flux-2-pro',
 *         'black-forest-labs/flux-2-max',
 *       ],
 *
 *  5. vibesByPath — add:
 *       'onsen-evening': ['cozy','peaceful','nostalgic','enchanted','cinematic','whimsical','ethereal','shimmer'],
 *
 *  6. chaos.skipPaths — add:
 *       'onsen-evening',
 *
 *  7. twoPassPolish.skipPaths — add:
 *       'onsen-evening',
 *
 *  8. sensoryAnchors — add a skipPaths key (MangaBot has none today):
 *       skipPaths: ['onsen-evening'],
 *
 *  9. nudityCheck — MangaBot has NO nudityCheck block at all today. Add one:
 *       nudityCheck: { enabled: true, maxRetries: 2, paths: ['onsen-evening'] },
 *
 * Nothing else is required: pools.js is untouched (this file loads its own
 * seeds), and no dream_mediums / dlt_clean_mediums row is needed because the
 * path reuses the existing mangabot_anime_neutral medium.
 * Going live later = move the string from shadowPaths[] into paths[], changing
 * nothing else (the faithful-xerox rule).
 */
