/**
 * AlphaBot candidate — anime-witch-familiar (destination: MangaBot).
 *
 * Identity is CLONED from MangaBot's own hard rules (read from
 * scripts/bots/mangabot/index.js + shared-blocks.js in full before writing
 * this file): hand-drawn anime illustration ONLY (Studio Ghibli / Makoto
 * Shinkai / Kyoto Animation register, cel-shaded clean linework, painterly
 * atmospheric backgrounds, vibrant saturated palette — NEVER photoreal,
 * NEVER 3D-CGI, NEVER Western cartoon, NEVER pure-black-and-white manga
 * panel), characters described BY ROLE/ARCHETYPE ONLY (never a named
 * specific anime character or franchise), camera framing as a MANDATORY
 * driving axis (Flux's anime "back-of-character-looking-at-scenery" default
 * must be overridden), and the density mandate (2+ atmosphere effects, 2+
 * lighting descriptors, 8+ environmental micro-details — no empty space).
 * A path proven under the wrong config proves nothing, so — like the sibling
 * anime-halloween-festival.js / anime-halloween-cozy.js candidates — this
 * file writes MangaBot's own material identity directly into the returned
 * brief rather than relying on AlphaBot's bot-level medium config. Fully
 * self-contained function-form path (AlphaBot CANDIDATES contract, see
 * ALPHABOT.md "Workflow"): requires its own seed pools directly as JSON, no
 * shared-registry edits (alphabot/index.js, alphabot/pools.js,
 * alphabot/shared-blocks.js all untouched), so it never collides with any
 * other candidate being built in parallel.
 *
 * CONCEPT: an anime WITCH-AND-FAMILIAR DUO caught mid-flight on a
 * broomstick, soaring over a moonlit Halloween town at night. Magical-girl-
 * adjacent register (Sailor-Moon / Precure / Kiki's-Delivery-Service
 * silhouette energy) — a flowing witch dress/cloak, ribbon trims, a small
 * animal familiar riding along, cape and hair caught streaming in the wind
 * of flight. Playful and wondrous, never real horror.
 *
 * AXES (7 total — 6 generated MVP-25 pools + 1 inline fixed list):
 *   1. witch          (pool, always)        — the witch herself: role/
 *                                              archetype (never named) +
 *                                              ethnicity + hair/eyes +
 *                                              magical-girl-adjacent witch
 *                                              fashion (flowing cloak/dress,
 *                                              ribbon/brooch trims). Ordinary
 *                                              human age/gender/ethnicity
 *                                              words are CORRECT here — she
 *                                              is a human anime character
 *                                              (mirrors mangabot's own
 *                                              magical-girl path convention),
 *                                              not a fantasy/creature/toy
 *                                              cast, so the usual
 *                                              non-human-language ban does
 *                                              not apply to her. A pointed
 *                                              witch hat appears in roughly
 *                                              HALF the pool's own entries,
 *                                              never mandated on all of
 *                                              them, per the
 *                                              never-homogenize rule.
 *   2. familiar        (pool, always)       — the non-human ANIMAL familiar
 *                                              riding along (cat / owl /
 *                                              raven / fox / bat / toad /
 *                                              ferret / etc.) + how it rides
 *                                              (perched on the handle,
 *                                              curled in her arm, gripping
 *                                              the bristles) + its own wind-
 *                                              blown detail. banHumanLanguage
 *                                              gated at generation time — the
 *                                              familiar must never read as a
 *                                              human character in costume.
 *   3. broom_trail     (pool, always)       — MONEY SHOT: the specific
 *                                              magical effect trailing off
 *                                              the broomstick as they fly
 *                                              (spiraling sparks, a swirl of
 *                                              caught autumn leaves, peeling
 *                                              embers, unspooling glowing
 *                                              runes, a firefly cascade...).
 *                                              THE iconic signature detail
 *                                              this whole path is built
 *                                              around — always-on (not
 *                                              conditional), variety comes
 *                                              from a 25-entry pool so it
 *                                              never repeats back-to-back.
 *   4. town            (pool, always)       — the Halloween-lit town
 *                                              glimpsed below/around them in
 *                                              flight (lantern-strung
 *                                              square, jack-o-lantern-lit
 *                                              rooftops, a harvest-fair
 *                                              street, a canal town...).
 *                                              Cozy/festive imagery only —
 *                                              deliberately NO graveyard
 *                                              iconography, to stay clear of
 *                                              the genuine-horror line.
 *   5. sky             (pool, always)       — the night-sky backdrop behind/
 *                                              around the flying duo (a huge
 *                                              rising moon, a river of
 *                                              stars, a loose bat formation,
 *                                              drifting cloud-veils...).
 *   6. whimsy          (pool, ~40% cond.)   — one small extra playful
 *                                              Halloween beat glimpsed
 *                                              below/around (trick-or-
 *                                              treaters waving up, a
 *                                              friendly ghost peeking from a
 *                                              chimney, a scarecrow tipping
 *                                              its hat...). Optional so it
 *                                              never becomes a mandatory
 *                                              homogenizing feature; its own
 *                                              25-entry pool carries the
 *                                              variety on the renders where
 *                                              it does appear.
 *   7. camera_framing  (inline fixed list,
 *                        always) MANDATORY  — the camera position for the
 *                        DRIVING AXIS         flying duo (low-angle hero
 *                                              silhouette against the moon,
 *                                              side-profile eye-level glide,
 *                                              head-on toward-viewer
 *                                              approach...), per MangaBot's
 *                                              own CAMERA_FRAMING_MANDATORY_
 *                                              BLOCK convention — a short
 *                                              fixed list, no generated pool
 *                                              needed (this is a small
 *                                              enumerable set of camera
 *                                              positions, not open-ended
 *                                              content).
 *
 * NON-NEGOTIABLE TEMPLATE MANDATE: this is ALWAYS a WITCH-AND-FAMILIAR DUO
 * caught mid-flight astride a single broomstick above a Halloween-lit town —
 * never a witch alone, never grounded or standing, never walking. She is a
 * hand-drawn anime illustration character (never photoreal/3D/Western-
 * cartoon/B&W-manga); her familiar is ALWAYS affirmatively cast as a
 * non-human ANIMAL creature — never a human companion, never a toy, never a
 * costumed human sidekick. Her cape and hair are ALWAYS caught streaming
 * dramatically in the wind of flight (the concept's other signature, stated
 * as a fixed composition instruction below rather than pool content, so it
 * never has to compete with per-entry variety).
 *
 * Known failure modes deliberately designed around:
 *   - human age/gender/ethnicity words are INTENTIONALLY used for the WITCH
 *     (matches mangabot's own magical-girl path precedent — an ordinary
 *     human anime cast, not a fantasy/creature/toy cast) but the FAMILIAR
 *     pool is generated with banHumanLanguage:true so it can never drift
 *     into "a small person in a cat costume"
 *   - the witch's pointed hat lives in ~half the WITCH pool's own entries,
 *     never mandatory on every render — avoids homogenizing into "the same
 *     one witch"
 *   - the wind-swept cape/hair signature is a FIXED composition instruction
 *     (always true), not a pool variety axis — so it never dilutes or
 *     competes with the witch/familiar/trail pool variety
 *   - positive register only ("PLAYFUL, wondrous, magical-girl-adjacent
 *     wonder") — no bare negation as the only guardrail
 *   - the TOWN pool deliberately excludes graveyard/tombstone iconography to
 *     stay clear of genuine horror while still reading as unmistakably
 *     Halloween (jack-o-lanterns, harvest fairs, lantern strings)
 *   - camera_framing is explicitly flagged MANDATORY DRIVING AXIS (mirrors
 *     mangabot's CAMERA_FRAMING_MANDATORY_BLOCK) so Flux's anime-keyframe
 *     "tiny back-of-character silhouette" default cannot silently override
 *     the rolled framing
 *   - no framing option zooms into a body-part/prop macro — every option
 *     keeps the whole flying duo + broom + at least a glimpse of the town/
 *     sky readable, so the money-shot broom trail and the town/sky context
 *     never disappear off-frame
 *   - re-QA round 1 (2026-09-06) found the physical broomstick itself
 *     silently dropped from a render entirely (the "low-angle hero framing
 *     ... silhouetted against a huge moon" camera option produced a static
 *     bust-portrait of the witch holding her familiar with NO broom visible
 *     anywhere — violates this path's own NON-NEGOTIABLE "always astride a
 *     broomstick" rule). None of the 8 CAMERA_FRAMINGS entries explicitly
 *     anchor the broom's visibility, so under a dense ~280-300-word prompt
 *     (well over the 90-120-word output target — every sampled render came
 *     in 2.3-2.5x over) Flux was free to drop it. Fixed by adding a fixed
 *     "THE BROOMSTICK ITSELF" block (always-true, mirrors THE SIGNATURE
 *     WIND treatment) that mandates the handle/bristles stay visible and
 *     gripped/straddled under every framing, including close ones.
 *   - re-QA round 2 (2026-09-06) confirmed the predicted next failure: all 3
 *     sampled renders' actual rendered prompts still ran 274-307 words
 *     (2.3-2.6x the 90-120 word output target — the overrun never went
 *     away, the round-1 fix only patched its ONE specific casualty). This
 *     round's casualty was the "over-the-shoulder framing from just behind
 *     the witch, looking forward past her shoulder toward the town" option:
 *     the render came out as a frontal close-up portrait (direct eye
 *     contact with camera) with the ENTIRE town axis and both atmosphere-
 *     effect requirements silently dropped — no jack-o-lanterns, no
 *     rooftop gardens, no owl, no environment at all, just the duo against
 *     a bare sparkle-filled sky (a product-shot-portrait failure, exactly
 *     the "bokeh-collapsed/empty" grading failure the QA bar calls out).
 *     Root cause confirmed by inspecting the actual seed pools: WITCH
 *     averaged 37 words/entry (max 42) and FAMILIAR 34 words/entry (max
 *     38) — the two heaviest of the 5 always-on pool axes, together often
 *     eating 65-75 words of the 90-120-word budget before the template's
 *     own fixed instructional blocks (NON-NEGOTIABLE, signature wind, the
 *     broomstick block, density mandate) are even counted, leaving Sonnet
 *     no realistic way to compress everything in and still hit spec — so it
 *     just doesn't compress, and Flux (not this path's own logic) decides
 *     what gets dropped under the resulting overlong prompt. FIX APPLIED:
 *     trimmed the WITCH pool only (one variable at a time — FAMILIAR is the
 *     next lever if a future round still shows overrun/dropped content) by
 *     cutting redundant mood-adjective clauses after eye color (e.g.
 *     "narrowed in concentration", "wide with wonder") and collapsing
 *     doubled garment-trim details down to one per entry, while preserving
 *     every entry's ethnicity, hair, eye color, one signature garment/prop
 *     detail, AND its exact original hat/bare-headed/no-hat status (the
 *     ~half-the-pool hat balance is unchanged). New WITCH pool average: 28
 *     words/entry (max 36), down from 37 (max 42) — roughly a 24%
 *     reduction. If round 3 still shows 2x+ overrun or further dropped
 *     content, trim FAMILIAR next (currently untouched, still 34 avg/38
 *     max); if the overrun persists even after both pools are trimmed, the
 *     lever after that is shortening the fixed instructional blocks
 *     themselves (NON-NEGOTIABLE + signature wind + broomstick + density
 *     mandate measure ~310 words combined as written here, before any pool
 *     content is added — though in practice Sonnet does compress these into
 *     short output phrases rather than echoing them verbatim, so they are
 *     NOT a 1:1 contributor to output length the way the pool axes are).
 *     ALSO OBSERVED (not acted on this round — one variable at a time):
 *     all 3 sampled outputs open by stating the hand-drawn-anime/cel-shaded/
 *     painterly/vibrant-palette material identity TWICE back to back in
 *     near-identical phrasing (once echoing this file's own preamble
 *     sentence, once as Sonnet's own restatement) — a ~25-30-word verbatim
 *     duplication for zero added content, in every sample. If WITCH (and
 *     later FAMILIAR) trims don't fully resolve the overrun, explicitly
 *     instructing "state the medium identity ONCE only" is a cheap,
 *     zero-creative-cost next lever before cutting further pool content.
 *   - re-QA round 3 (2026-09-07) confirmed the overrun STILL had not gone
 *     away after the WITCH-only trim: all 3 sampled rendered prompts came in
 *     at 279-300 words (still 2.3-2.5x the 90-120 word target — essentially
 *     unchanged from round 2's 274-307). Concrete casualties this round: (1)
 *     render 1's MONEY-SHOT broom trail was specced as "vivid emerald
 *     pale-green witch-fire" but rendered as a plain gold/tan ribbon matching
 *     the broom's own wood color — Flux dropped the one color detail that
 *     makes this path's signature effect distinctive; (2) render 2 rolled a
 *     framing whose own text explicitly keeps the town legible ("side-profile
 *     ... the town streaking past below") and the prompt DID contain the full
 *     harvest-fair/jack-o-lantern TOWN block, yet the actual image came out as
 *     a bust-portrait against a fully bokeh-blurred sky with ZERO town/
 *     environment visible — a repeat of the round-2 "bokeh-collapsed
 *     product-shot" failure mode, this time even though the prompt text
 *     itself didn't ask for bokeh, which points at sheer prompt-length/detail
 *     dilution (too many competing foreground descriptors) rather than one
 *     bad framing option. This matches this file's own round-2 prediction
 *     exactly: FAMILIAR was "the next lever if a future round still shows
 *     overrun/dropped content" and was "currently untouched, still 34
 *     avg/38 max" — confirmed unchanged going into this round. FIX APPLIED:
 *     trimmed the FAMILIAR pool only (WITCH untouched this round — one
 *     variable at a time), same method as the round-2 WITCH trim: cut
 *     redundant intensifiers/filler ("softly", "faint", "confidently",
 *     "just", "completely", "rushing") and collapsed doubled wind-reaction
 *     clauses down to one, while preserving every entry's species/color,
 *     ONE signature magical detail (glow/shimmer/collar/sparkle-trail),
 *     riding position, and wind-blown reaction. New FAMILIAR pool average:
 *     29.2 words/entry (max 33), down from 34.0 (max 38) — about a 14%
 *     reduction, bringing it in line with WITCH's post-trim 28.3 avg. Also
 *     fixed an unrelated authoring-artifact bug spotted while editing: one
 *     entry read "a second sleek black cat" (leftover pool-authoring
 *     bookkeeping — there is only ever ONE familiar per render, so "second"
 *     would render as a nonsensical/confusing token) — corrected to "a sleek
 *     black cat". If round 4 still shows 2x+ overrun or further dropped
 *     content (town axis or money-shot color/detail silently lost), the
 *     next lever is the fixed instructional blocks themselves (NON-
 *     NEGOTIABLE + signature wind + broomstick + density mandate), starting
 *     with the "state the medium identity ONCE only" fix flagged in round 2
 *     (still not yet applied), since both pool axes have now had one
 *     trimming pass each.
 *   - re-QA round 4 (2026-09-07) confirmed the overrun is STILL essentially
 *     unchanged after BOTH pool trims: all 3 sampled rendered prompts came in
 *     at 287-294 words (vs 274-307 in round 2 and 279-300 in round 3) — a
 *     ~1-2% shift, i.e. noise, not a fix. This confirms the file's own round-3
 *     prediction: pool trimming has run its course as a lever; the overrun
 *     lives in the fixed instructional blocks / Sonnet's own restatement
 *     habit, not the pool content. Concrete casualty this round: render 3's
 *     WITCH entry ("a traveling witch of Nigerian descent... a lace-trimmed
 *     black cape and a cinched orange sash with dangling charms") got cut off
 *     mid-phrase in the actual output — "...cinched orange sash with," then
 *     straight into the closing tags, silently dropping "dangling charms" and
 *     leaving a dangling preposition in the rendered prompt. Also re-confirmed
 *     verbatim: every sample still opens by stating the hand-drawn-anime/
 *     cel-shaded/painterly/vibrant-palette identity TWICE back to back
 *     ("hand-drawn anime illustration in the Ghibli / Shinkai / Kyoto
 *     Animation tradition, cel-shaded clean linework with painterly
 *     atmospheric backgrounds, vibrant saturated color palette, hand-drawn
 *     anime keyframe illustration, cel-shaded clean linework, painterly
 *     atmospheric background, ...") — ~25-30 words of pure duplication before
 *     a single pool axis is even reached. FIX APPLIED (next lever, as
 *     predicted): added an explicit "state the material identity ONCE only"
 *     instruction to the output-format block, naming the exact duplicated
 *     phrase pattern so Sonnet can recognize and drop its own second
 *     restatement. Pools themselves untouched this round (one variable at a
 *     time — WITCH and FAMILIAR each already had their trimming pass; this
 *     round targets the fixed template block per the round-2/3 plan). If
 *     round 5 still shows 2x+ overrun or further dropped/truncated pool
 *     content, the remaining levers are: (a) shortening the NON-NEGOTIABLE /
 *     signature-wind / broomstick / density-mandate blocks themselves, or (b)
 *     accepting ~90-120 words is not achievable at this content density and
 *     re-targeting the word budget upward instead of fighting Sonnet on it.
 *
 * Medium note (for whoever wires this into mangabot/index.js at promotion —
 * NOT decided here): MangaBot's magical-girl path (this path's closest
 * sibling) is NOT in the excluded-from-looks set, so mangabot_anime_neutral
 * (the rolled-lookRegister "looks" medium) is the likely fit — but whoever
 * promotes this path should confirm with Kevin rather than assume.
 */

const WITCHES = require('../seeds/anime_witch_familiar_witch.json');
const FAMILIARS = require('../seeds/anime_witch_familiar_familiar.json');
const BROOM_TRAILS = require('../seeds/anime_witch_familiar_broom_trail.json');
const TOWNS = require('../seeds/anime_witch_familiar_town.json');
const SKIES = require('../seeds/anime_witch_familiar_sky.json');
const WHIMSY = require('../seeds/anime_witch_familiar_whimsy.json');

// ── Camera framing — MANDATORY DRIVING AXIS, short fixed enumerable set ──
// (per mangabot's CAMERA_FRAMING_MANDATORY_BLOCK convention; not open-ended
// content, so no generated pool needed). Every option keeps the whole duo +
// broom + a glimpse of town/sky readable — none zoom into a macro detail.
const CAMERA_FRAMINGS = [
  'low-angle hero framing from the town square looking up, the witch and familiar silhouetted hard against a huge moon, cape and hair streaming toward the viewer',
  'side-profile framing at eye level with the flight path, both figures caught mid-glide with cape and hair whipped fully sideways, the town streaking past below',
  'three-quarter dynamic diagonal framing, the duo banking hard over the rooftops, motion-blurred broom trail curving behind them',
  'over-the-shoulder framing from just behind the witch, looking forward past her shoulder toward the lantern-lit town and the sky ahead',
  'wide establishing framing from far below, the whole town spread beneath a small but clearly readable silhouette of the flying duo',
  'close three-quarter framing filling most of the frame with the witch and familiar, the town reduced to soft glowing bokeh far beneath them',
  'head-on framing as the duo flies straight toward the viewer, cape and hair blown back hard, town lights streaking below on either side',
  'a rooftop-skimming chase framing, the camera low and close over the tiles as the duo banks around a chimney just ahead',
];

module.exports = ({ sharedDNA, vibeDirective, picker }) => {
  const witch = picker.pickWithRecency(WITCHES, 'anime_witch_familiar_witch');
  const familiar = picker.pickWithRecency(FAMILIARS, 'anime_witch_familiar_familiar');
  // MONEY SHOT — always rolled, never conditional; variety comes from the
  // pool itself so it never repeats back-to-back.
  const broomTrail = picker.pickWithRecency(BROOM_TRAILS, 'anime_witch_familiar_broom_trail');
  const town = picker.pickWithRecency(TOWNS, 'anime_witch_familiar_town');
  const sky = picker.pickWithRecency(SKIES, 'anime_witch_familiar_sky');

  let whimsy = null;
  if (Math.random() < 0.4) {
    whimsy = picker.pickWithRecency(WHIMSY, 'anime_witch_familiar_whimsy');
  }
  const whimsyBlock = whimsy
    ? `\n\n━━━ ONE PLAYFUL EXTRA TOUCH ━━━\n${whimsy}`
    : '';

  const cameraFraming = CAMERA_FRAMINGS[Math.floor(Math.random() * CAMERA_FRAMINGS.length)];

  return `You are a Studio Ghibli / Makoto Shinkai / Kyoto Animation keyframe artist illustrating an anime WITCH-AND-FAMILIAR DUO caught mid-flight on a broomstick, soaring over a moonlit Halloween town at night. Magical-girl-adjacent register — Sailor-Moon / Precure / Kiki's-Delivery-Service silhouette energy. Hand-drawn anime illustration, cel-shaded clean linework with painterly atmospheric backgrounds, vibrant saturated color palette.

━━━ NON-NEGOTIABLE — READ FIRST ━━━
This is ALWAYS a WITCH-AND-FAMILIAR DUO mid-flight on ONE broomstick — never a witch alone, never grounded, never walking or standing. Render as HAND-DRAWN ANIME/MANGA ILLUSTRATION only — NEVER photoreal, NEVER 3D-render, NEVER Disney-Pixar CGI, NEVER Western cartoon, NEVER black-and-white manga panel (this is full-color keyframe art). The witch is described by role/archetype only — NEVER a named specific anime character or franchise. Her familiar is ALWAYS affirmatively cast as a non-human ANIMAL creature — NEVER a human companion, NEVER a toy, NEVER a costumed human sidekick. This is PLAYFUL, wondrous, magical-girl-adjacent Halloween wonder — grinning jack-o-lanterns and cozy autumn glow, NEVER genuine horror, gore, or real scares.

━━━ THE WITCH ━━━
${witch}

━━━ THE FAMILIAR — riding along, always a real animal creature ━━━
${familiar}

━━━ MONEY SHOT — THE BROOM'S MAGIC TRAIL — honor this exactly ━━━
${broomTrail}
This trailing magic is the single most eye-catching element streaming off the broomstick — render it vividly, clearly separate from the sky and town behind it.

━━━ THE TOWN BELOW ━━━
${town}

━━━ THE NIGHT SKY ━━━
${sky}${whimsyBlock}

━━━ CAMERA FRAMING — MANDATORY DRIVING AXIS ━━━
${cameraFraming}
Apply this exact camera position and match the witch's and familiar's facing/engagement to it. Reject the generic "tiny back-of-character silhouette looking at scenery" default unless this framing explicitly calls for it.

━━━ THE SIGNATURE WIND ━━━
Her cape (or cloak/dress hem) and hair are ALWAYS caught streaming dramatically backward in the wind of flight — never limp, never still, never resting against her body. The familiar's fur, feathers, ears, or tail likewise catch the same wind. This is a constant, non-negotiable part of every render regardless of which framing or pool entries are rolled.

━━━ THE BROOMSTICK ITSELF — always physically present, never dropped ━━━
The physical broomstick — its wooden handle and bristles — MUST be clearly visible and readable in every render: she is astride it or has both hands gripping the handle, the full shaft crossing the frame beneath or beside her. This holds true even under a close/bust-style framing choice — compose so the handle still crosses the frame in her grip rather than cropping it away. Never render her floating free of the broom with only a magic trail and no physical broom object present; never let the broom become an implied-but-invisible detail.

━━━ DENSITY MANDATE — NO EMPTY SPACE ━━━
Layer the frame densely: 2+ atmosphere effects (drifting leaves / lantern glow / mist / stardust / cloud-wisps), 2+ lighting descriptors (warm jack-o-lantern amber against cool moonlit blue), and 8+ specific environmental micro-details across the town and sky. The background is composed as carefully as the flying duo in the foreground.

━━━ MOOD ━━━
${vibeDirective.slice(0, 200)}

━━━ SCENE-WIDE COLOR PALETTE ━━━
${sharedDNA.scenePalette}

━━━ SECONDARY LIGHTING VIBE ━━━
${sharedDNA.colorPalette}

Output ONLY the 90-120 word Flux prompt, comma-separated phrases. NO preamble, NO titles, NO headers, NO ━━━ markers, NO "render as" suffixes. Start immediately with the scene content. State the hand-drawn-anime/cel-shaded/painterly-background/vibrant-palette material identity ONCE only, in your opening phrase — do NOT restate it, rephrase it, or echo a second "hand-drawn anime keyframe illustration, cel-shaded linework, painterly background" phrase later in the same prompt; that budget belongs to the witch, familiar, broom trail, and town content instead. Every witch/familiar/town/sky detail supplied above must survive into the output in full, complete phrases — never truncate a phrase mid-clause to fit the word count; if something must be cut to make room, drop a whole micro-detail rather than cut a phrase in half. End with: soft bloom highlights, filmic color grading, no text no words no watermarks no logos no frame borders.`;
};
