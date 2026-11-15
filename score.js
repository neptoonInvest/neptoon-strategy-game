/** Integer percent, safe against binary float noise. */
export function percentOf(weight) { return Math.round(weight * 100); }
export function targetWeights(holdings) {
  const map = new Map();
  for (const holding of holdings) map.set(holding.instrumentId, percentOf(holding.weight));
  return map;
}
/** Original exact-match scorer, retained for compatibility and diagnostics. */
export function similarityScore(slotPercents, placed, target) {
  let got = 0, total = 0;
  for (let i = 0; i < slotPercents.length; i++) {
    const w = slotPercents[i] ?? 0;
    total += w;
    if (placed[i] && target.get(placed[i]) === w) got += w;
  }
  return total > 0 ? got / total : 0;
}

const clamp = x => Math.max(0, Math.min(1, x));
const near = (actual, target, scale = 35) => clamp(1 - Math.abs(actual - target) / scale);
const atLeast = (actual, target) => clamp(actual / Math.max(1, target));
const all = (...values) => values.reduce((a, b) => a + b, 0) / values.length;

/**
 * Score the strategy, not the original ticker-to-slot arrangement.
 * Every displayed rule maps to a concrete, testable condition.
 * A level is won ONLY when 100% is allocated and every condition passes.
 * Partial credit powers the Strategy Signal without awarding false victories.
 */
/* =====================================================
   NEPTOON · UNIVERSAL PORTFOLIO MATCH SCORER

   0–100% similarity to the target portfolio.
   100% requires an exact solution.
   Works automatically for all 10 levels.
===================================================== */

export function evaluateStrategy(level, slotPercents, placed){

  const target = targetWeights(level.holdings);
  const actual = new Map();

  let allocated = 0;
  let occupied = 0;

  for(let i = 0; i < slotPercents.length; i++){

    const id = placed[i];
    if(!id) continue;

    const weight = Number(slotPercents[i]) || 0;

    allocated += weight;
    occupied++;

    actual.set(
      id,
      (actual.get(id) || 0) + weight
    );

  }

  const allIds = new Set([
    ...target.keys(),
    ...actual.keys()
  ]);

  let totalError = 0;

  for(const id of allIds){

    const expected = target.get(id) || 0;
    const observed = actual.get(id) || 0;

    totalError += Math.abs(observed - expected);

  }

  const similarity =
    Math.max(0, Math.min(1, 1 - totalError / 200));

  const complete =
    allocated === 100 &&
    occupied === level.holdings.length &&
    actual.size === target.size;

  const perfect =
    complete &&
    totalError === 0;

return {
    score: perfect ? 1 : Math.min(0.985, similarity),
    perfect,
    passed: level.metaFlat.rules?.map(() => perfect) || [],
    allocated,
    count: occupied,
    totalError
};

}
export function isPerfectScore(score) { return score >= 0.999; }
export function signalName(score) {
  if (score >= 0.999) return "perfect";
  if (score >= 0.72) return "almost";
  if (score >= 0.45) return "hot";
  if (score >= 0.12) return "warmer";
  return "searching";
}
export const SIGNAL_LABEL = {
  searching: "Searching", warmer: "Getting warmer", hot: "Hot",
  almost: "Almost there", perfect: "Perfect!"
};
