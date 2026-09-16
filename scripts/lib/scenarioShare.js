/**
 * scenarioShare.js — the SINGLE SOURCE for "how much of a dreamer's nightly is a
 * COMMUNITY SCENARIO instead of one of their own saved places".
 *
 * WHY THIS EXISTS (drift found 2026-09-16). A nightly face-swap dream rolls a scene
 * TYPE: goofy / elegant / active (all three are shared community scenario pools that
 * REPLACE the dreamer's place) or plain-location (their own saved place + an anchor
 * from location_iconic_spots). The split shipped as 20 goofy / 20 elegant / 0 active
 * = 40% community, 60% their places. When the `active` pool was later turned on at
 * 20%, goofy and elegant only came down 20 → 15 each: 20 points added, 10 given back.
 * Nobody decided 50% — it was the residue of adding a third pool without taking the
 * same amount back out. Measured on a 20-dream organic batch: 44% of dreams rendered
 * Kevin's own places, 56% rendered a community scenario.
 *
 * So the number that matters is not any single pool's percentage, it is their TOTAL.
 * A fourth pool added at 15% tomorrow would quietly do this again. This module holds
 * the ceiling on that total, and __tests__/lib/scenarioShare.test.ts asserts EVERY
 * copy of the split in the repo respects it — including the two that are currently
 * dormant, because dormant copies are exactly how this bites (LOOKS_SCENE_PCTS sits
 * at 60% behind the LOOKS_MINIMAL flag, and two separate fixes have already been
 * found dead behind that same flag).
 *
 * Pure + deterministic; unit-tested. Mirrors the botCadence.js pattern: derive the
 * alarm from the config, never hardcode it, and lock the invariant in CI.
 */

/**
 * The most of a dreamer's nightlies that may come from the shared scenario pools,
 * as a percentage (Kevin, 2026-09-16: "20% max"). Their own saved places get the
 * rest. Raising this is a product decision, not a tuning knob — if you raise it,
 * the CI test fails loudly and you change it HERE, in one place, on purpose.
 */
const SCENARIO_SHARE_CEILING_PCT = 20;

/** Holiday runs SEPARATELY from this ceiling: it takes its cut first and renormalizes
 *  the rest (sceneTypeRoll.ts sceneTypeCuts §3.3a). Kevin locked those odds during the
 *  2026 fall/Halloween readiness pass, so they are deliberately NOT counted here — but
 *  they do come off the location share while a holiday is armed, which is what
 *  locationSharePct's `holidayPct` argument accounts for. */

/**
 * The share that is NOT the dreamer's own place.
 *
 * Sums EVERY numeric field it is given, not a hardcoded goofy/elegant/active. That is
 * the whole point: the drift being guarded against is a FOURTH pool arriving at a
 * plausible-looking percentage while each individual number still looks small. A
 * counter that knows only today's three pools would miss the next occurrence exactly
 * the way we missed this one.
 */
function scenarioTotalPct(pcts) {
  return Object.values(pcts || {}).reduce((sum, v) => {
    const n = Number(v);
    return sum + (Number.isFinite(n) ? n : 0);
  }, 0);
}

/**
 * The share of nightlies that actually render the dreamer's OWN saved place, given the
 * community total.
 *
 * Mirrors sceneTypeCuts exactly: the holiday window takes its cut FIRST and the normal
 * distribution is renormalized into what is left, so
 *   plain = (1 - holiday) × (1 - scenarioTotal)
 * rather than the two simply summing. Clamped, so a nonsense split reports 0 rather
 * than a negative share.
 */
function locationShareFromTotal(totalPct, holidayPct = 0) {
  const holiday = Math.max(0, Math.min(100, Number(holidayPct) || 0));
  const scenario = Math.max(0, Math.min(100, Number(totalPct) || 0));
  return ((100 - holiday) / 100) * (100 - scenario);
}

/** Same, taking the per-pool split. Assumes a dreamer at or above RAMP_PLACES. */
function locationSharePct(pcts, holidayPct = 0) {
  return locationShareFromTotal(scenarioTotalPct(pcts), holidayPct);
}

/** True when a split breaks the ceiling. The alarm predicate, used by CI and by the
 *  live-config check so they can never disagree about what "too high" means. */
function exceedsCeiling(pcts) {
  return scenarioTotalPct(pcts) > SCENARIO_SHARE_CEILING_PCT;
}

/**
 * adaptiveScenePcts (sceneTypeRoll.ts) scales the scenario window UP for dreamers who
 * picked FEWER than this many places, on purpose: someone who saved one place should
 * not get the same place every single night. So the ceiling above describes a dreamer
 * at or above the ramp — which onboarding pushes everyone toward, but not everyone
 * reaches. Exposed so the check can say so instead of over-claiming.
 */
const RAMP_PLACES = 4;

module.exports = {
  SCENARIO_SHARE_CEILING_PCT,
  RAMP_PLACES,
  scenarioTotalPct,
  locationShareFromTotal,
  locationSharePct,
  exceedsCeiling,
};
